'use strict';

import event      from 'event'     ;
// import share      from 'share'     ;
// import common     from 'common'    ;
// import defaults   from 'defaults'  ;

import deckAction from 'deckAction';

class rollerAction extends deckAction {

	constructor() {
		super();
	}

	run(deck, data) {

		if(data.eventData.to.name != deck.name) {
			return false;
		}

		let cardsCount = deck.cardsCount({
			"visible" : true
		});

		let openCards = data.openCards ? data.openCards : 3;

		let hiddenCardsCount = deck.cardsCount({
			"visible" : false
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

				// deck.Redraw();
			}

			// unflip next cards
			let flipCardsCount = deck.cardsCount({
				"visible" : true,
				"flip"    : true
			});

			for(let i = flipCardsCount - 1; i >= 0 && i >= flipCardsCount - openCards; i -= 1) {
				deck.cards[i].flip = false;
			}

			// let unflipIndexTo   = cardsCount - unflipCardsCount > 0 ? cardsCount - unflipCardsCount : 0;
			// let unflipIndexFrom = cardsCount - openCards        > 0 ? cardsCount - openCards        : 0;

			// for(;unflipIndexFrom < unflipIndexTo; unflipIndexFrom += 1) {
			// 	deck.cards[unflipIndexFrom].flip = false;
			// }

			cardsCount = deck.cardsCount({
				"visible" : true
			});

			if(cardsCount == 0) {

				// показать все карты
				deck.showCards();
				deck.flipAllCards();
				console.log('SHOW ALL CARDS');

				// TODO clear roll history (if no steps)
			}

			deck.Redraw();
		}



		super.end();

		event.dispatch('checkTips');
	}
}

export default new rollerAction();