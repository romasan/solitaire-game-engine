'use strict';

import getDecks from 'getDecks';

/*
 * get
 * diff
 * summary
 * getInStateByUid
 * applyState
 */

class snapshot {

	constructor() {}

	get() {

		let state = {
			"decks" : {}
		};

		let decks = getDecks();

		// let uid = (function* (i) {while(true) {yield i++;}})(0);
		// let uid = new (function (i) {this.next = function() {return {"value" : i++};}})(0);
		let uid = (i => () => i++)(0);

		for(let i in decks) {

			let deck = decks[i];

			state.decks[deck.name] = {
				"cards" : deck.getCards().map(card => {
					return {
						"uid"     : uid()       ,
						"id"      : card.id     ,
						"name"    : card.name   ,
						"visible" : card.visible,
						"flip"    : card.flip
					};
				})
			}
		}

		return state;
	}

	diff(stateA, stateB) {

		console.log('Diff:', stateA, stateB)

		let state = {
			"decks" : {}
		};

		for(let deckNameA in stateA.decks) {

			let deckA = stateA.decks[deckNameA];

			let deck = [];

			// console.log('callback', deckA, stateB.decks[deckNameA]);

			for(let cardIndexA in deckA.cards) {

				let cardA = deckA.cards[cardIndexA];
				let cardB = null;

				for(let deckIndexB in stateB.decks) {

					let deckB = stateB.decks[deckIndexB];

					let filter = deckB.cards.filter(cardB => cardB.uid == cardA.uid);

					if(filter.length) {

						cardB = filter[0];

						console.log('found', cardB.uid, cardA.name, cardB.name);
					}
				}

				deck[cardIndexA] = {
					"uid"     : cardA.uid    ,
					"id"      : cardA.id     ,
					"name"    : cardA.name   ,
					"visible" : cardB.visible,
					"flip"    : cardB.flip
				};
			}

			console.log(deck);

			state.decks[deckNameA] = {
				"cards" : deck
			};
		}

		return state;
	}

	summary(...args) {

		let state = {
			"decks" : {}
		}

		for(let argIndex in args) {

			let stateI = args[argIndex];

			if(argIndex == 0) {

				for(let indexI in stateI) {

					state.decks[indexI] = {
						"cards" : (deck => {

							let cards = [];

							for(let cardIndex in deck.cards) {

								let card = deck.cards[cardIndex];

								cards[cardIndex] = {
									"uid"     : card.uid    ,
									"id"      : card.id     ,
									"name"    : card.name   ,
									"visible" : card.visible,
									"flip"    : card.flip
								};
							}

							return cards;
						})(stateI[indexI])
					}
				}
			} else {

				for(let indexI in stateI) {

					state.decks[indexI] = {

						"cards" : (deck => {

							let cards = [];

							for(let cardIndex in deck.cards) {

								let card = deck.cards[cardIndex];

								cards[cardIndex] = {
									"uid"     : card.uid                                ,
									"id"      : card.id                                 ,
									"name"    : card.name                               ,
									"visible" : cards[cardIndex].visible || card.visible,
									"flip"    : cards[cardIndex].flip    && card.flip
								};
							}

							return cards;
						})(stateI[indexI])
					}
				}
			}
		}

		return state;
	}

	getInStateByUid(state, uid) {

		for(let deckName in state.decks) {

			for(let i in state.decks[deckName]) {

				if(state.decks[deckName][i].uid == uid) {

					return state.decks[deckName][i];
				}
			}
		}

		return false;
	}

	applyState(summaryState) {

		let decks = getDecks();

		let uid = (i => () => i++)(0);

		for(let i in decks) {

			let deck = decks[i];

			for(let cardIndex in deck.cards) {	

				let stateCard = this.getInStateByUid(summaryState, uid());

				let card = deck.cards[cardIndex];

				// card.visible = stateCard.visible;

				card.flip = stateCard.flip;
			}
		}
	}
}

export default new snapshot();