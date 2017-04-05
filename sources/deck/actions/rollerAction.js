'use strict';

import event      from 'event'     ;

import deckAction from 'deckAction';
import Deck       from 'deck'      ;
import History    from 'history'   ;
import atom       from 'atom'      ;

const defaultOpenCount = 3;

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventName.indexOf('moveEnd') >= 0) {

			if(data.eventData.from.name != deck.name) {
				return;
			}

			// сколько открыто карт
			let unflipCardsCount = deck.cardsCount({
				"visible" : true ,
				"flip"    : false
			});

			let invisibleCardsCount = deck.cardsCount({
				"visible" : false
			});

			// если нет открытых карт показать предыдущую скрытую
			if(
				unflipCardsCount    == 0 &&
				invisibleCardsCount >  0
			) {

				let next = deck.cards.length - invisibleCardsCount;

				deck.showCardByIndex(next, true);

				// save step
				event.dispatch('addStep', {
					"show" : {
						"cardIndex" : next                 ,
						"cardName"  : deck.cards[next].name,
						"deckName"  : deck.name
					}
				});

				event.dispatch('checkTips');
			}

			return;
		}

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		let openCount = data.actionData.openCount
			? data.actionData.openCount
			: defaultOpenCount;

		let hiddenCardsCount = deck.cardsCount({
			"visible" : false
		});

		let cardsCount = deck.cardsCount({
			"visible" : true
		});

		if(cardsCount > 0) {

			let unflipCardsCount = deck.cardsCount({
				"visible" : true ,
				"flip"    : false
			});

			let flipCardsCount = deck.cardsCount({
				"visible" : true,
				"flip"    : true
			});

			// first roll
			if(
				hiddenCardsCount == 0 &&
				unflipCardsCount == 0
			) {
				event.dispatch('addStep', {
					"rollerActionStart" : deck.name
				});
			}

			let _unflippedCount = 0;

			// hide unflipped cards
			if(unflipCardsCount > 0) {

				let cards = deck.getCards();

				for(let i in cards) {

					if(cards[i].flip == false) {

						_unflippedCount += 1;

						deck.hideCardByIndex(i);

						event.dispatch('addStep', {
							"hide" : {
								"cardIndex" : i                 ,
								"cardName"  : deck.cards[i].name,
								"deckName"  : deck.name
							}
						});
					}
				}
			}

			// swap unflipped
			if(openCount > 1) {

				for(let i = cardsCount - _unflippedCount; i < cardsCount; i += 1) {

					let next = cardsCount * 2 - i - _unflippedCount - 1;

					if(i < next) {
						atom.swap(deck, i, next, true);
					}
				}
			}

			// unflip next cards
			_unflippedCount = 0;

			for(
				let i = flipCardsCount - 1               ;
				i >= 0 && i >= flipCardsCount - openCount;
				i -= 1
			) {

				_unflippedCount += 1;

				deck.cards[i].flip = false;

				event.dispatch('addStep', {
					"unflip" : {
						"cardIndex" : i                 ,
						"cardName"  : deck.cards[i].name,
						"deckName"  : deck.name
					}
				});
			}

			cardsCount = deck.cardsCount({
				"visible" : true
			});

			// swap unflipped
			if(openCount > 1) {

				for(let i = cardsCount - _unflippedCount; i < cardsCount; i += 1) {

					let next = cardsCount * 2 - i - _unflippedCount - 1;

					if(i < next) {
						// let tmp          = deck.cards[i]   ;
						// deck.cards[i]    = deck.cards[next];
						// deck.cards[next] = tmp             ;
						atom.swap(deck, i, next, true);
					}
				}
			}

			// не осталось видимых карт
			if(cardsCount == 0) {

				hiddenCardsCount = deck.cardsCount({
					"visible" : false
				});

				event.dispatch('rewindHistory', data => {

					console.log('rewindHistory');

					let found = false;

					let stepsCount = 0;

					for(let i = data.history.length - 1; i >= 0 && !found; i -= 1) {

						stepsCount += 1;

						let step = data.history[i];

						for(let atomIndex in step) {

							let atom = step[atomIndex];

							// rewind
							if(
								!found                                    &&
								typeof atom.rollerActionStart == "string" &&
								       atom.rollerActionStart == deck.name
							) {

								found = true;

								event.dispatch('resetHistory');

								for(let i = 0; i < stepsCount; i += 1) {
									data.undo();
								}

								// reset deck
								deck.showCards   (false); // no redraw, add in history
								deck.flipAllCards(false); // no redraw, add in history

								// event.dispatch('saveSteps');

							// reset
							} else if(
								!found    &&
								atom.move
								// typeof atom.move.from == "string" &&
								//        atom.move.from == deck.name
							) {

								found = true;

								// reset deck
								deck.showCards   (false, true); // no redraw, add in history
								deck.flipAllCards(false, true); // no redraw, add in history

								event.dispatch('saveSteps');
							}
						}
					}
				});
			} else {
				event.dispatch('saveSteps');
			}
		} else {

			hiddenCardsCount = deck.cardsCount({
				"visible" : false
			});

			if(hiddenCardsCount > 0) {

				deck.showCards   (false, true); // no redraw
				deck.flipAllCards(false, true); // no redraw

				// event.dispatch('saveSteps');
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