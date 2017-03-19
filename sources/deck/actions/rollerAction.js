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

			// hide unflipped cards
			if(unflipCardsCount > 0) {

				let cards = deck.getCards();

				for(let i in cards) {
					if(cards[i].flip == false) {

						deck.hideCardByIndex(i);

						event.dispatch('addStep', {
							"hide" : {
								"deckName"  : deck.name         ,
								"cardIndex" : i                 ,
								"cardName"  : deck.cards[i].name
							}
						});
					}
				}
			}

			// unflip next cards
			let flipCardsCount = deck.cardsCount({
				"visible" : true,
				"flip"    : true
			});

			for(
				let i = flipCardsCount - 1;
				i >= 0 && i >= flipCardsCount - openCount;
				i -= 1
			) {

				deck.cards[i].flip = false;

				event.dispatch('addStep', {
					"flip" : {
						"card" : deck.cards[i].name,
						"deck" : deck.name
					}
				});
			}

			cardsCount = deck.cardsCount({
				"visible" : true
			});

			if(cardsCount == 0) {

				// показать все карты
				deck.showCards();
				deck.flipAllCards();

				// TODO clear roll history (if no steps)
				event.dispatch('rewindHistory', data => {

					let undoCount = 0;

					if(data.history.length) {

						// найти был ли ход
						for(let i = data.history.length - 1; i >= 0; i += 1) {
							// check undoCount
						}

						for(let i = 0; i < undoCount; i += 1) {
							// data.undo();
						}
					}
				});
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