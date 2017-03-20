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

			let flipCardsCount = deck.cardsCount({
				"visible" : true,
				"flip"    : true
			});

			// first roll
			if(hiddenCardsCount == 0 && unflipCardsCount == 0) {

				deck.data.rollerActionData = {
					"cardsCount" : cardsCount,
					"stepsCount" : 1
				}
			} else {
				// TODO
				try {
					deck.data.rollerActionData.stepsCount += 1;
				} catch(e) {}
			}

			// hide unflipped cards
			if(unflipCardsCount > 0) {

				let cards = deck.getCards();

				let _count = 0;

				for(let i in cards) {

					if(cards[i].flip == false) {

						_count += 1;

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
			// flipCardsCount = deck.cardsCount({
			// 	"visible" : true,
			// 	"flip"    : true
			// });

			for(
				let i = flipCardsCount - 1;
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
				});

				if(
					deck.data.rollerActionData                                && 
					deck.data.rollerActionData.cardsCount                     &&
					deck.data.rollerActionData.cardsCount == hiddenCardsCount
				) {

					event.dispatch('rewindHistory', data => {

						for(let i = 0; i < deck.data.rollerActionData.stepsCount; i += 1) {
							data.undo();
						}
					});
				} else {
					// показать все карты
					deck.showCards();
					deck.flipAllCards();
				}


				// TODO clear roll history (if no steps)
			} else {
				console.log('ROLLER SAVE STEPS');
				event.dispatch('saveSteps');
			}
		}

		deck.Redraw();

		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();