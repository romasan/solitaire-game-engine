'use strict';

import event      from 'event'     ;

import deckAction from 'deckAction';
import Deck       from 'deck'      ;

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		// default openCount = 3
		let openCount = data.actionData.openCount ? data.actionData.openCount : 3;

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
			if(hiddenCardsCount == 0 && unflipCardsCount == 0) {

				// deck.data.rollerActionData = {
				// 	"cardsCount" : cardsCount,
				// 	"stepsCount" : 1
				// }

				event.dispatch('addStep', {
					"rollerActionStart" : this.name
				});
			} else {
				// TODO
				// try {
				// 	deck.data.rollerActionData.stepsCount += 1;
				// } catch(e) {}
			}

			// hide unflipped cards
			if(unflipCardsCount > 0) {

				let cards = deck.getCards();

				for(let i in cards) {

					if(cards[i].flip == false) {

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

			// unflip next cards
			for(
				let i = flipCardsCount - 1               ;
				i >= 0 && i >= flipCardsCount - openCount;
				i -= 1
			) {

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

			if(cardsCount == 0) {

				hiddenCardsCount = deck.cardsCount({
					"visible" : false
					// "flip"    : true
				});

				if(
					deck.data.rollerActionData                                && 
					deck.data.rollerActionData.stepsCount                     &&
					deck.data.rollerActionData.cardsCount                     &&
					deck.data.rollerActionData.cardsCount == hiddenCardsCount
				) {

					event.dispatch('resetHistory');

					event.dispatch('rewindHistory', data => {

						let found = false;

						for(let i = data.history.length - 1; i > 0 && !found; i -= 1) {

							let step = data.history[i];

							for(let atom of step) {

								if(atom.rollerActionStart == this.name) {
									// found = true
								}

								if(
									atom.move &&
									atom.move.from == this.name
								) {
									// 
								}
							}
						}

						for(let i = 0; i < deck.data.rollerActionData.stepsCount - 1; i += 1) {
							data.undo();
						}

						deck.showCards   (false); // redraw, add in history
						deck.flipAllCards(false); // redraw, add in history
					});
				} else {

					// показать все карты
					deck.showCards   (false, true); // redraw, add in history
					deck.flipAllCards(false, true); // redraw, add in history

					event.dispatch('saveSteps');
				}


				// TODO clear roll history (if no steps)
			} else {
				event.dispatch('saveSteps');
			}
		}

		deck.Redraw();

		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();