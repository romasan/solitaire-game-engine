'use strict';

import event      from '../../common/event';
import share      from '../../common/share';

import deckAction from './deckAction'      ;
import Deck       from '../'               ;
import History    from '../../history'     ;
import Atom       from '../atom'           ;

const defaultOpenCount = 3;

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		// console.log('rollerAction:run', deck, data);

		if (
			!deck                   ||
			!data                   ||
			!deck.cards             ||
			 deck.cards.length == 0
		) {
			return;
		}

		let _save = data.eventName == 'moveEnd:force' ? false : true; // !share.get('noSave');

		/*
		 * действие совершаемое после хода из стопки
		 * если задан такой event
		 */

		if (data.eventName.indexOf('moveEnd') >= 0) {

			if (data.eventData.from.name != deck.name) {
				return;
			}

			// количество открытых видимых карт
			let unflipCardsCount = deck.cardsCount({
				"visible" : true ,
				"flip"    : false
			});

			// количество скрытых карт
			let hiddenCardsCount = deck.cardsCount({
				"visible" : false
			});

			// если нет открытых карт показать предыдущую скрытую
			if (
				unflipCardsCount    == 0 &&
				hiddenCardsCount >  0
			) {

				let next = deck.cards.length - hiddenCardsCount;

				deck.showCardByIndex(next, true); // index, redraw

				// save step
				if (_save) {
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

			// event.dispatch('addStep', {
			// 	"rollerActionEnd" : deck.name
			// });

			return;
		}

		/*
		 * действие совершаемое по прочим event-ам
		 * предпочтительно клик
		 */

		if (data.eventData.to.name != deck.name) {
			return false;
		}

		// количество показываемых карт
		let openCount = data.actionData.openCount
			? data.actionData.openCount
			: defaultOpenCount;

		// количество скрытых карт
		let hiddenCardsCount = deck.cardsCount({
			"visible" : false
		});

		// количество видимых карт
		let cardsCount = deck.cardsCount({
			"visible" : true
		});

		// есть видимые карты
		if (cardsCount > 0) {

			// количество открытых видимых карт
			let unflipCardsCount = deck.cardsCount({
				"visible" : true ,
				"flip"    : false
			});

			// количество закрытых видимых карт
			let flipCardsCount = deck.cardsCount({
				"visible" : true,
				"flip"    : true
			});

			// не осталось видимых закрытых карт
			if (flipCardsCount == 0) {

				// количество скрытых карт
				hiddenCardsCount = deck.cardsCount({
					"visible" : false
				});

				// let rewindStatus = null;

				event.dispatch('rewindHistory', data => {

					let found = false;

					let stepsCount = 0;

					// Пробегаем по истории с конца
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

						for (let atomIndex in step) {

							let atom = step[atomIndex];

							// rewind
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
			}

			// первая прокрутка
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

			// количество скрываемых дальше открытых карт
			let unflippedCount = 0;

			// скрываем открытые видимые карты
			if (unflipCardsCount > 0) {

				let cards = deck.getCards();

				for (let i in cards) {

					if (cards[i].flip == false) {

						unflippedCount += 1;

						deck.hideCardByIndex(i);

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
				}
			}

			// далее карты выкладываются в обратном порядке
			// поэтому возвращаем выложенные на предыдущей итерации карты в исходное положение
			if (openCount > 1) {

				for (let i = cardsCount - unflippedCount; i < cardsCount; i += 1) {

					let next = cardsCount * 2 - i - unflippedCount - 1;

					if (i < next) {
						Atom.swap(deck, i, next, _save);
					}
				}
			}

			// количество открытых дальше карт (карт в стопке могло остаться меньше трёх)
			unflippedCount = 0;

			// открываем следующие openCount|3 карт
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

			// количество видимых карт
			cardsCount = deck.cardsCount({
				"visible" : true
			});

			// карты выкладываются в обратном порядке
			if (
				openCount > 1// &&
				// unflippedCount
			) {

				for (let i = cardsCount - unflippedCount; i < cardsCount; i += 1) {

					let next = cardsCount * 2 - i - unflippedCount - 1;

					if (i < next) {
						Atom.swap(deck, i, next, _save);
					}
				}
			}

			if (_save) {
				event.dispatch('saveSteps');
			}

		// нет видимых карт
		} else {

			// console.log('нет видимых карт');

			// Restore deck

			// количество скрытых карт
			hiddenCardsCount = deck.cardsCount({
				"visible" : false
			});

			if (hiddenCardsCount > 0) {

				deck.showCards   (false, _save); // no redraw, save
				deck.flipAllCards(false, _save); // no redraw, save

				// event.dispatch('saveSteps');

				deck.Redraw();

				this.run(deck, data);

				return;
			}
		}

		deck.Redraw();

		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();