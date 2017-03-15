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

		console.log('roller action:', data, 'hidden cards count:', hiddenCardsCount);

		if(cardsCount == 0) {

			// показать все карты
			deck.showCards();

			// TODO clear roll history (if no steps)
		} else {

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
						console.log('HIDE CARD:', i);

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

			console.log('unflip cards:', flipCardsCount, openCards);
			for(let i = flipCardsCount - 1; i >= 0 && i >= flipCardsCount - openCards; i -= 1) {
				console.log('FLIP CARD:', i);
				deck.cards[i].flip = false;
			}

			// let unflipIndexTo   = cardsCount - unflipCardsCount > 0 ? cardsCount - unflipCardsCount : 0;
			// let unflipIndexFrom = cardsCount - openCards        > 0 ? cardsCount - openCards        : 0;

			// for(;unflipIndexFrom < unflipIndexTo; unflipIndexFrom += 1) {
			// 	deck.cards[unflipIndexFrom].flip = false;
			// }

			deck.Redraw();
		}

		super.end();
	}
}

export default new rollerAction();