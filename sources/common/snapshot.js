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

					let _card = {
						"uid"     : uid()       ,
						"id"      : card.id     ,
						"name"    : card.name   ,
						"visible" : card.visible,
						"flip"    : card.flip
					};

					return _card;
				})
			}
		}

		return state;
	}

	diff(stateFrom, stateTo) { // A - from, B - to

		let state = {
			"decks" : {}
		};

		for(let deckNameFrom in stateFrom.decks) {

			let deckFrom = stateFrom.decks[deckNameFrom];

			let deck = [];

			for(let cardIndexFrom in deckFrom.cards) {

				let cardFrom = deckFrom.cards[cardIndexFrom];
				let cardTo   = null;

				for(let deckIndexTo in stateTo.decks) {

					let deckTo = stateTo.decks[deckIndexTo];

					let filter = deckTo.cards.filter(cardTo => cardTo.id == cardFrom.id);

					if(filter.length) {
						cardTo = filter[0];
					}
				}

				if(cardTo) {

					deck[cardIndexFrom] = {
						"uid"     : cardFrom.uid  ,
						"id"      : cardFrom.id   ,
						"name"    : cardFrom.name ,
						"visible" : cardTo.visible,
						"flip"    : cardTo.flip
					};
				} else {
					console.warn('card', cardFrom.name, 'with id', cardFrom.id, 'not found');
				}
			}

			state.decks[deckNameFrom] = {
				"cards" : deck
			};
		}

		return state;
	}

	summary(stateDifferences) {

		let state = {
			"decks" : {}
		};

		for(let argIndex in stateDifferences) {

			let stateI = stateDifferences[argIndex];

			if(argIndex == 0) {

				for(let indexI in stateI.decks) {

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
						})(stateI.decks[indexI])
					}
				}
			} else {

				for(let indexI in stateI.decks) {

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
						})(stateI.decks[indexI])
					}
				}
			}
		}

		return state;
	}

	getInStateByUid(state, uid) {

		for(let deckName in state.decks) {

			for(let i in state.decks[deckName].cards) {

				if(state.decks[deckName].cards[i].uid == uid) {

					return state.decks[deckName].cards[i];
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

			if(deck.showPrevAttempts) {

				let changes = false;

				for(let cardIndex in deck.cards) {

					let _uid = uid();

					let stateCard = this.getInStateByUid(summaryState, _uid);

					let card = deck.cards[cardIndex];


					changes = changes || card.flip    != stateCard.flip   ;
					changes = changes || card.visible != stateCard.visible;

					card.visible = stateCard.visible;
					card.flip    = stateCard.flip;
				}

				if(changes) {
					deck.Redraw();
				}
			}
		}
	}
}

export default new snapshot();