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

		console.log('-----------------------------------------------');		

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

console.groupCollapsed('#1');
console.log(`
openCount               : ${ openCount               }
visibleCardsCount       : ${ visibleCardsCount       }
hiddenCardsCount        : ${ hiddenCardsCount        }
flipCardsCount          : ${ flipCardsCount          }
unflipCardsCount        : ${ unflipCardsCount        }
startIndexOfOpenCards   : ${ startIndexOfOpenCards   }
startIndexOfHiddenCards : ${ startIndexOfHiddenCards }
_save                   : ${ _save                   }
`);
console.groupEnd();

		/**
		 * количество скрываемых открытых карт
		 * @type {number}
		 */
		// let unflippedCount = 0;

		if (DEBUG_LOG) console.groupCollapsed('клик по роллеру');
		if (DEBUG_LOG) console.log('rollerAction:run -> openCount:', openCount, 'hidden:', hiddenCardsCount, 'visible:', cardsCount);

		// 1) переставляем открытые в обратном порядке
		if (unflipCardsCount > 0) {

			for (let i = 0; i < unflipCardsCount / 2; i += 1) {

				let side_1 = (startIndexOfOpenCards | 0)                          + (i | 0)    ,
				    side_2 = (startIndexOfOpenCards | 0) + (unflipCardsCount | 0) - (i | 0) - 1;
				try {
						console.log('SWAP#1', side_1, side_2, deck.cards[side_1].name, deck.cards[side_2].name);
				} catch (e) {
					console.warn('Error (SWAP#1):', e);
					console.log(side_1, side_2);
				}
				if (side_1 != side_2) {
				  Atom.swap(deck, side_1, side_2, _save);
				}
				// save swap
			}
			
			// 2) скрываем все открытые
			for (let i = 0; i < unflipCardsCount; i += 1) {
				let index = (startIndexOfOpenCards | 0) + i;
				console.log('HIDE', index, deck.cards[index].name);
				deck.hideCardByIndex(index, false, _save);
				hiddenCardsCount  += 1;
				visibleCardsCount -= 1;
				// save hide
			}
		}
			
		// let _unflipCardsCount = 0;
		unflipCardsCount = 0;
		
		// let _stopIndex = unflipCardsCount - openCount - 1;
		
		if (flipCardsCount > 0) {
			
			// 3) открываем N карт
			for (
				let i  = (startIndexOfOpenCards | 0) - 1;
				i >= 0 && i > (startIndexOfOpenCards | 0) - (openCount | 0) - 1;
				i -= 1
			) {
				console.log('UNFLIP', i, deck.cards[i].name);
				deck.unflipCardByIndex(i, _save);
				unflipCardsCount += 1;
			}
			
			// 4) переставляем открытые в обратном порядке
			for (let i = 0; i < unflipCardsCount / 2; i += 1) {
				let side_1 = (startIndexOfOpenCards | 0)                          - i - 1,
				    side_2 = (startIndexOfOpenCards | 0) - (unflipCardsCount | 0) + i    ;
			  if (side_1 != side_2) {
				  console.log('SWAP#2', side_1, side_2, deck.cards[side_1].name, deck.cards[side_2].name);
					Atom.swap(deck, side_1, side_2, _save);
				}
			}
		}

		// 5) смотрим сколько видимых
		// unflipCardsCount = deck.cardsCount({
		// 	"visible" : true ,
		// 	"flip"    : false
		// });

		// 5.1) если 0, показываем и закрываем все скрытые 10411
		if (visibleCardsCount == 0) {
			deck.flipAllCards (false, _save);
			deck.showCards    (false, _save);
			visibleCardsCount = hiddenCardsCount;
			hiddenCardsCount  = 0;
		}

		if (_save) {
			event.dispatch('saveSteps');
		}

		// save hash
		// do history back
		//   make new hash of sate of step
		//   find step or same hash

		// или...

		// посчитать сколько прокруток можно было сделать
		// N = cardsCount / openCount
		let backSteps = ( (visibleCardsCount | 0) + (hiddenCardsCount | 0) ) / openCount;
		// если в этих ходах не найдётся move
		//   провернуть назад N ходов

		/* *********************************************** */
		// смотрим делали ли мы ход за время прокрутки
		/*event.dispatch('rewindHistory', data => {

			// флаг найденного начала прокрутки колоды
			let found = false;

			let stepsCount = 0;

			// Пробегаем по истории от последнего хода к первому
			for (let i = data.history.length - 1; i >= 0 && !found; i -= 1) {

				stepsCount += 1;

				let step = data.history[i];

				// пробегаемся по атомарным составным хода из истории
				for (let atomIndex in step) {

					let atom = step[atomIndex];

					// rewind
					// просматриваемый ход содержит флаг начала игры
					if (
						!found                                     &&
						typeof atom.rollerActionStart == "string"  && // больше эта конструкция не нужна
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
		});*/
		/* *********************************************** */

console.groupCollapsed('#2');
console.log(`
openCount               : ${ openCount               }
visibleCardsCount       : ${ visibleCardsCount       }
hiddenCardsCount        : ${ hiddenCardsCount        }
flipCardsCount          : ${ flipCardsCount          }
unflipCardsCount        : ${ unflipCardsCount        }
startIndexOfOpenCards   : ${ startIndexOfOpenCards   }
startIndexOfHiddenCards : ${ startIndexOfHiddenCards }
_save                   : ${ _save                   }
backSteps               : ${ backSteps               }
`);
console.groupEnd();

		if (DEBUG_LOG) console.groupEnd();

		deck.Redraw();

		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();
