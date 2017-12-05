'use strict';

import event      from '../../common/event';
import share      from '../../common/share';

import deckAction from './deckAction'      ;
import Deck       from '../'               ;
import History    from '../../history'     ;
import Atom       from '../atom'           ;

const DEBUG_LOG = false;

const defaultOpenCount = 3;

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if (DEBUG_LOG) console.log('rollerAction:run', deck, data);

		// в стопке больше нет карт
		if (
			!deck                   ||
			!data                   ||
			!deck.cards             ||
			 deck.cards.length == 0
		) {
			if (DEBUG_LOG) console.log('rollerAction:run -> break #0');
			return;
		}

		// Не сохранять если action вызван из истории
		let _save = data.eventName != 'moveEnd:force'; // !share.get('noSave');
		
		if (DEBUG_LOG) console.log('rollerAction:run -> _save:', _save);

		/* *********************************************************************
		 * действие совершаемое после хода из стопки
		 * если задан такой event
		 * ****************************************************************** */

		if (data.eventName.indexOf('moveEnd') >= 0) {

			if (DEBUG_LOG) console.groupCollapsed('сделали ход из роллера');

			if (DEBUG_LOG) console.log('rollerAction:run -> moveEnd');

			// относится ли событие к данной стопке?
			if (data.eventData.from.name != deck.name) {

				if (DEBUG_LOG) console.log('rollerAction:run -> moveEnd -> break#');
				if (DEBUG_LOG) console.groupEnd();

				return;
			}

			/**
			 * количество открытых видимых карт
			 * @type {number}
			 */
			let unflipCardsCount = deck.cardsCount({
				"visible" : true ,
				"flip"    : false
			});

			/**
			 * количество скрытых карт
			 * @type {number}
			 */
			let hiddenCardsCount = deck.cardsCount({
				"visible" : false
			});

			if (DEBUG_LOG) console.log('rollerAction:run -> moveEnd -> unflip:', unflipCardsCount, 'hidden:', hiddenCardsCount);

			if (DEBUG_LOG) console.groupCollapsed('если нет открытых карт показать предыдущую скрытую');

			// если нет открытых карт показать предыдущую скрытую
			if (
				unflipCardsCount == 0 &&
				hiddenCardsCount >  0
			) {

				if (DEBUG_LOG) console.log('rollerAction:run -> moveEnd -> 0unplip, +hidden');

				let next = deck.cards.length - hiddenCardsCount;

				deck.showCardByIndex(next, true); // index, redraw

				// save step
				if (_save) {

					if (DEBUG_LOG) console.log('rollerAction:run -> moveEnd -> 0unplip, +hidden -> addStep:show');

					event.dispatch('addStep', {
						"show" : {
							"cardIndex" : next                 ,
							"cardName"  : deck.cards[next].name,
							"deckName"  : deck            .name
						}
					});
				}

				event.dispatch('checkTips');
			}
			if (DEBUG_LOG) console.groupEnd();
			
			// event.dispatch('addStep', {
			// 	"rollerActionEnd" : deck.name
			// });

			if (DEBUG_LOG) console.log('rollerAction:run -> moveEnd -> break#1');
			if (DEBUG_LOG) console.groupEnd();

			return;
		}

		/* *********************************************************************
		 * действие совершаемое по прочим event-ам,
		 * всем кроме хода из стопки, предпочтительно клик
		 * ****************************************************************** */

/*
	как стоит делать

	смотрим есть ли скрытые и открытые карты
	-	добавляем в историю начало прокрутки
	смотрим есть ли открытые
	+	перекладываем справа на лево и кладем в конец скрытых;
			(однако не забываем что работем с одним массивом карт, в который
			входят и открытые и закрытые и скрытые карты и это как-то нужно
			хранить в истории)
	смотрим есть ли закрытые
	+	открываем по одной и кладём в конец открытых;
	-	если нет то показываем и переворачиваем все скрытые
			при этом если за весь цикл прокрутки стопки из неё
			не было взято ни одной карты, вернуть историю на
			начало прокрутки стопки;

	как делаем

	смотрим есть ли видимые карты
	+	смотрим есть ли перевёрнутые карты
			-	просматриваем историю;
			смотрим есть ли скрытые и открытые карты
			-	добавляем в историю начало прокрутки
			смотрим есть ли открытые
			+	скрываем открытые, и записываем это в историю паралельно
				считая сколько карт скрыли;
			смотрим нужно ли по правилам выкладывать на стол больше 1й карты
			+	перекладываем в обратном порядке карты которые выложим
			открываем сколько нужно карт или сколько осталось если осталось
			меньше чем нужно и записываем это в историю;
			опять же если по правилам нужно было положить больше 1й карты
			+	снова ставим скрытые ранее карты в обратном порядке
	-	смотрим есть ли скрытые карты
			+	показываем все скрытые карты;
				переворачиваем/закрываем все карты;

	ещё вариант

	1) переставляем открытые в обратном порядке
	2) скрываем все открытые
	3) открываем N карт
	4) переставляем открытые в обратном порядке
	5) смотрим сколько видимых
	5.1) если 0, показываем и закрываем все скрытые 
*/

		// относится ли событие к данной стопке?
		if (data.eventData.to.name != deck.name) {
			console.log('rollerAction:run -> break#2 (eventData.to.name != deck.name)');
			return false;
		}

		/**
		 * количество показываемых карт
		 * например в пасьянке "Косынка" есть два режима игры, по 1 и по 3 карты
		 * @type {number}
		 */
		let openCount = data.actionData.openCount
			? data.actionData.openCount
			: defaultOpenCount;

		/**
		 * количество скрытых карт
		 * @type {number}
		 */
		let hiddenCardsCount = 0;

		/**
		 * количество видимых карт
		 * @type {number}
		 */
		let visibleCardsCount = 0;

		/**
		 * количество открытых видимых карт
		 * @type {number}
		 */
		let unflipCardsCount = 0;

		/**
		 * количество закрытых видимых карт
		 * @type {number}
		 */
		let flipCardsCount = 0;

		/**
		 * позиция первой открытой карты
		 * @type {number}
		 */
		let startIndexOfOpenCards = -1;
		
		/**
		 * позиция первой скрытой карты
		 * @type {number}
		 */
		let startIndexOfHiddenCards = -1;

		for (let i in deck.cards) {

			const card = deck.cards[i];

			if (card.visible == true) {

				visibleCardsCount += 1;

				if (card.flip == true) {
					flipCardsCount += 1;
				} else {

					if (unflipCardsCount == 0) {
						startIndexOfOpenCards = i;
					}

					unflipCardsCount += 1;
				}
			} else {

				if (hiddenCardsCount == 0) {
					startIndexOfHiddenCards = i;
				}

				hiddenCardsCount += 1;
			}
		}

		if (startIndexOfOpenCards < 0) {
			startIndexOfOpenCards = flipCardsCount;
		}

		if (startIndexOfHiddenCards < 1) {
			startIndexOfHiddenCards = (startIndexOfOpenCards | 0) + (unflipCardsCount | 0);
		}

console.log(`
visibleCardsCount       : ${visibleCardsCount      }
hiddenCardsCount        : ${hiddenCardsCount       }
flipCardsCount          : ${flipCardsCount         }
unflipCardsCount        : ${unflipCardsCount       }
startIndexOfOpenCards   : ${startIndexOfOpenCards  }
startIndexOfHiddenCards : ${startIndexOfHiddenCards}
_save                   : ${_save                  }
`);

		/**
		 * количество скрываемых открытых карт
		 * @type {number}
		 */
		// let unflippedCount = 0;

		if (DEBUG_LOG) console.groupCollapsed('клик по роллеру');
		if (DEBUG_LOG) console.log('rollerAction:run -> openCount:', openCount, 'hidden:', hiddenCardsCount, 'visible:', cardsCount);

		if (false) {
// ---
		// есть видимые карты
		if (cardsCount > 0) {

			if (DEBUG_LOG) console.groupCollapsed('есть видимые карты');

			if (DEBUG_LOG) console.log('rollerAction:run -> +visible -> v_unflip:', unflipCardsCount, 'v_flip:', flipCardsCount);

			// не осталось видимых закрытых карт (все видимые открыты)

			/*
				,...,   +-+-+---+
				:   :   |x|x|x  |
				:   :   | | |  x|
				:...:   +-+-+---+ [0 / +]
			*/

			// кончились закрытые карты в стопке
			if (flipCardsCount == 0) {

				if (DEBUG_LOG) console.groupCollapsed('нет перевёрнутых карт');

				if (DEBUG_LOG) console.log('rollerAction:run -> +visible -> +v_flip');

				/**
				 * количество скрытых карт
				 * @type {number}
				 */
				hiddenCardsCount = deck.cardsCount({
					"visible" : false
				});

				if (DEBUG_LOG) console.log('rollerAction:run -> +visible -> +v_flip -> hidden:', hiddenCardsCount);

				// let rewindStatus = null;

				// смотрим делали ли мы ход за время прокрутки
				event.dispatch('rewindHistory', data => {

					console.log('rollerAction:run -> +visible -> +v_flip -> rewindHistory');

					// флаг найденного начала прокрутки колоды
					let found = false;

					let stepsCount = 0;

					// Пробегаем по истории от последнего хода к первому
					for (let i = data.history.length - 1; i >= 0 && !found; i -= 1) {

						stepsCount += 1;

						let step = data.history[i];

						// find action end
						// for (let atomIndex in step) {

						// 	let atom = step[atomIndex];

						// 	if (
						// 		!found                                   &&
						// 		typeof atom.rollerActionEnd == "string"  &&
						// 		       atom.rollerActionEnd == deck.name
						// 	) {
						// 		// break rewind
						// 		return;
						// 	}
						// }

						// пробегаемся по атомарным составным хода из истории
						for (let atomIndex in step) {

							let atom = step[atomIndex];

							// rewind
							// просматриваемый ход содержит флаг начала игры
							if (
								!found                                     &&
								typeof atom.rollerActionStart == "string"  &&
								       atom.rollerActionStart == deck.name
							) {

								found = true;

								event.dispatch('resetHistory');

								for (let i = 0; i < stepsCount; i += 1) {
									data.undo();
								}

								// reset deck
								deck.showCards   (false); // no redraw, not add in history
								deck.flipAllCards(false); // no redraw, not add in history

								// rewindStatus = 'done';

							// reset
							// если ход в истории найден раньше начала прокруток остановить rewind
							} else if (
								!found    &&
								atom.move
							) {
								// всё ещё не нашли начало прокрутки колоды
								// текущая атомарная составляющая хода содержит перемещение карт

								// Swap
								for (let i = 0; i < ((unflipCardsCount / 2) | 0); i += 1) {

									let next = unflipCardsCount - i - 1;

									if (i < next) {
										Atom.swap(deck, i, next, _save); // deck, fromIndex, toIndex, save
									}
								}

								// Hide visible flipped cards
								for (let i = 0; i < unflipCardsCount; i += 1) {

									deck.hideCardByIndex(i, true); // index, redraw

									// save step
									if (_save) {
										event.dispatch('addStep', {
											"hide" : {
												"cardIndex" : i                 ,
												"cardName"  : deck.cards[i].name,
												"deckName"  : deck         .name
											}
										});
									}
								}

								found = true;

								// reset deck
								deck.showCards   (false, _save); // no redraw, add in history
								deck.flipAllCards(false, _save); // no redraw, add in history

								deck.Redraw();

								if (_save) {
									event.dispatch('saveSteps');
								}

								// rewindStatus = 'break';
								// выходим из rewindHistory т.к. из стопки брали карты
								break;
							}
						}
					}
				});

				// Restore deck

				// количество скрытых карт
				hiddenCardsCount = deck.cardsCount({
					"visible" : false
				});

				// ещё есть скрытые карты
				if (hiddenCardsCount > 0) {

					// console.log('ещё есть скрытые карты', hiddenCardsCount, );

					deck.showCards   (false, _save); // no redraw, add to history
					deck.flipAllCards(false, _save); // no redraw, add to history

					// event.dispatch('saveSteps');

					// this.run(deck, data);

					deck.Redraw();
				}

				// return;
				console.groupEnd();
			}

			// первая прокрутка

			/*
				+---+   ,...,    
				|///|   :   :    
				|///|   :   :    
				+---+   :...:     [0]
			*/

			if (
				hiddenCardsCount == 0 && // нет скрытых карт
				unflipCardsCount == 0    // нет открытых видимых карт
			) {
				if (_save) {
					event.dispatch('addStep', {
						"rollerActionStart" : deck.name
					});
				}
			}

			// скрываем открытые видимые карты (если есть)
			if (unflipCardsCount > 0) {

				console.groupCollapsed('есть открытые карты', unflipCardsCount);

				// +---+   +-+-+---+
				// |///|   |x|x|x  |
				// |///|   | | |  x|
				// +---+   +-+-+---+ -> [...]

				console.log('rollerAction:run -> +visible -> +v_unflip');

				let cards = deck.getCards();

				for (let i in cards) {

					if (cards[i].flip == false) {

						unflippedCount += 1;

						deck.hideCardByIndex(i);

						if (_save) {
							console.log('rollerAction:run -> +visible -> +v_unflip -> addStep:hide');
							event.dispatch('addStep', {
								"hide" : {
									"cardIndex" : i                 ,
									"cardName"  : deck.cards[i].name,
									"deckName"  : deck         .name
								}
							});
						}
					}
				}

				console.groupEnd();
			}

			// далее карты выкладываются в обратном порядке
			// если выкладываем больше одной карты
			// поэтому возвращаем выложенные на предыдущей итерации карты в исходное положение
			if (openCount > 1) {

				if (DEBUG_LOG) console.groupCollapsed('переставляем карты #0');

				if (DEBUG_LOG) console.log('rollerAction:run -> +visible -> +openCount');

				for (let i = cardsCount - unflippedCount; i < cardsCount; i += 1) {

					let next = cardsCount * 2 - i - unflippedCount - 1; // TODO что тут происходит? почему * 2

					if (DEBUG_LOG) console.log(
						'rollerAction:run -> +visible -> +v_unflip -> +openCount -> swap#1:',
						i, next, i < next, deck.cards[i].name, deck.cards[next].name
					);

					if (i < next) {
						Atom.swap(deck, i, next, _save);
					}
				}

				if (DEBUG_LOG) console.groupEnd();
			}

			// количество открытых дальше карт (карт в стопке могло остаться меньше трёх)
			unflippedCount = 0;

			// открываем следующие openCount|3 карт
			if (DEBUG_LOG) console.log('открываем следующие', openCount, 'карт');

			for (
				let i  =           flipCardsCount - 1        ;
				    i >= 0 && i >= flipCardsCount - openCount;
				    i -= 1
			) {

				unflippedCount += 1;

				deck.cards[i].flip = false;

				if (_save) {
					event.dispatch('addStep', {
						"unflip" : {
							"cardIndex" : i                 ,
							"cardName"  : deck.cards[i].name,
							"deckName"  : deck.name
						}
					});
				}
			}

			if (DEBUG_LOG) console,log('открыли', unflippedCount, 'карт');

			/**
			 * количество видимых карт
			 * @type {number}
			 */
			cardsCount = deck.cardsCount({
				"visible" : true
			});

			// карты выкладываются в обратном порядке
			if (
				openCount > 1 //         &&
				// cardsCount > openCount
			) {

				if (DEBUG_LOG) console.log('переставляем карты #1');

				for (let i = cardsCount - unflippedCount; i < cardsCount; i += 1) {

					let next = cardsCount * 2 - i - unflippedCount - 1;

					if (i < next) {

						if (DEBUG_LOG) console.log(i, next, deck.cards[i].name, deck.cards[next].name);

						Atom.swap(deck, i, next, _save);
					}
				}
			}

			if (_save) {
				event.dispatch('saveSteps');
			}

			if (DEBUG_LOG) console.groupEnd();

		// нет видимых карт
		} else {

			if (DEBUG_LOG) console.groupCollapsed('нет видимых карт');

			// Restore deck

			// количество скрытых карт
			hiddenCardsCount = deck.cardsCount({
				"visible" : false
			});

			// есть скрытые карты
			if (hiddenCardsCount > 0) {

				if (DEBUG_LOG) console.log('есть скрытые карты');

				// показываем все скрытые карты
				deck.showCards   (false, _save); // no redraw, save
				
				// переворачиваем/закрываем все карты
				deck.flipAllCards(false, _save); // no redraw, save

				// event.dispatch('saveSteps');

				deck.Redraw();

				this.run(deck, data);

				if (DEBUG_LOG) console.groupEnd();
				if (DEBUG_LOG) console.groupEnd();

				return;
			}

			if (DEBUG_LOG) console.groupEnd();
		}
// ---
		}

		
		// 1) переставляем открытые в обратном порядке
		if (unflipCardsCount > 0) {

			for (let i = 0; i <= unflipCardsCount / 2 - 1; i += 1) {
				let side_1 = (startIndexOfOpenCards | 0)                   + (i | 0),
				    side_2 = (startIndexOfOpenCards | 0) + (openCount | 0) - (i | 0) - 1;
				console.log('SWAP#1', side_1, side_2);
				Atom.swap(deck, side_1, side_2, _save);
			}
			
			// 2) скрываем все открытые
			for (let i = 0; i < unflipCardsCount; i += 1) {
				let index = (startIndexOfOpenCards | 0) + i;
				console.log('HIDE', index);
				deck.hideCardByIndex(index);
			}
		}
			
		// let _unflipCardsCount = 0;
		unflipCardsCount = 0;
		
		let _stopIndex = unflipCardsCount - openCount - 1;
		
		if (flipCardsCount > 0) {
			
			// 3) открываем N карт
			for (
				let i  = (startIndexOfOpenCards | 0) - 1;
				i >= 0 && i > (startIndexOfOpenCards | 0) - (openCount | 0) - 1;
				i -= 1
			) {
				console.log('UNFLIP', i);
				deck.unflipCardByIndex(i);
				unflipCardsCount += 1;
			}
			
			// 4) переставляем открытые в обратном порядке
			for (let i = 0; i <= unflipCardsCount / 2 - 1; i += 1) {
				let side_1 = (startIndexOfOpenCards | 0)                          - i - 1,
				    side_2 = (startIndexOfOpenCards | 0) - (unflipCardsCount | 0) + i    ;
				console.log('SWAP#2', side_1, side_2);
				Atom.swap(deck, side_1, side_2, _save);
			}
		}

		// 5) смотрим сколько видимых
		// unflipCardsCount = deck.cardsCount({
		// 	"visible" : true ,
		// 	"flip"    : false
		// });

		// 5.1) если 0, показываем и закрываем все скрытые 
		if (visibleCardsCount == 0) {
			deck.flipAllCards(false, _save);
			deck.showCards(false, _save);
		}

		if (DEBUG_LOG) console.groupEnd();

		deck.Redraw();

		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();
