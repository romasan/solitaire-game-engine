'use strict';

import getDecks from 'getDecks';

/*
 * get
 * diff
 */

class snapshot {

	constructor() {}

	get() {

		let state = {
			"decks" : {}
		};

		let decks = getDecks();

		let uid = b = (function* z(i) {while(true) {yield i++;}})(0);

		for(let i in decks) {

			let deck = decks[i];

			state.decks[deck.name] = {
				"cards" : deck.getCards().map(card => {
					return {
						"uid"     : uid.next().value,
						"id"      : card.id         ,
						"name"    : card.name       ,
						"visible" : card.visible    ,
						"flip"    : card.flip
					};
				})
			}
		}

		return state;
	}

	diff(stateA, stateB) {

		let state = {
			"decks" : {}
		}

		for(let indexA in stateA.deck) {
			state.decks[indexA] = {
				"cards" : (e => {

					let catds = {};

					for(let i in e) {

						let cardA = e[i];
						let cardB = null;

						for(let indexB in stateB.decks) {

							let filter = stateB[indexB].cards.filter(c => c.uid == cardA.uid);

							if(filter.length) {
								cardB = filter[0];
							}
						}

						cards[i] = {
							"uid"     : e[i].uid     ,
							"id"      : e[i].id      ,
							"name"    : e[i].name    ,
							"visible" : cardB.visible,
							"flip"    : cardB.flip
						};
					}

					return cards;
				})(state.decks[indexA])
			}
		}
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
}

export default new snapshot();