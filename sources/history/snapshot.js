'use strict';

import {getDecks} from '../deck';

class snapshot {

	constructor() {}

	/**
	 * Get play state of game field
	 */
	get() {

		let state = {
			"decks" : {}
		};

		let decks = getDecks();

		let uid = (i => () => i++)(0);

		for (let i in decks) {

			let deck = decks[i];

			state.decks[deck.name] = {

				"cards" : deck.cards.map(card => {

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

	/**
	 * Comparison of two snapshots of the initial state and the final state
	 * @param {*} stateFrom - the first snapshot
	 * @param {*} stateTo  - the second snapshot
	 */
	diff(stateFrom, stateTo) { // A - from, B - to

		let state = {
			"decks" : {}
		};

		for (let deckNameFrom in stateFrom.decks) {

			let deckFrom = stateFrom.decks[deckNameFrom];

			let deck = [];

			for (let cardIndexFrom in deckFrom.cards) {

				let cardFrom = deckFrom.cards[cardIndexFrom];
				let cardTo   = null;

				for (let deckNameTo in stateTo.decks) {

					let deckTo = stateTo.decks[deckNameTo];

					let filter = deckTo.cards.filter(cardTo => cardTo.id == cardFrom.id);

					if (filter.length) {
						cardTo = filter[0];
					}
				}

				if (cardTo) {

					deck[cardIndexFrom] = {
						"uid"     : cardFrom.uid  ,
						// "id"      : cardFrom.id   ,
						"name"    : cardFrom.name ,
						"visible" : cardTo.visible,
						"flip"    : cardTo.flip
					};
				} else {
					// console.warn('card', cardFrom.name, 'with id', cardFrom.id, 'not found');
				}
			}

			state.decks[deckNameFrom] = {
				"cards" : deck
			};
		}

		return state;
	}

	/**
	 * Comparison of all differences between states, and obtaining a summary state
	 * @param {*} stateDifferences - Array of snapshot diffs
	 */
	summary(stateDifferences) {

		// console.log('snapshot:summary', stateDifferences);

		let summaryState = {
			"decks" : {}
		};

		for (let stateIndex in stateDifferences) {

			let stateI = stateDifferences[stateIndex];

			if (stateIndex == 0) {
				summaryState = stateI;
			} else {

				for (let deckName in stateI.decks) {

					let deck     = stateI.decks[deckName];
					let deckPrev = summaryState.decks[deckName];

					summaryState.decks[deckName] = {

						"cards" : deck.cards.map((card, i, deck) => {

							return {
								"uid"     : card.uid                                 ,
								"name"    : card.name                                ,
								"visible" : deckPrev.cards[i].visible || card.visible,
								"flip"    : deckPrev.cards[i].flip    && card.flip
							};
						})
					}
				}
			}
		}

		return summaryState;
	}

	/**
	 * Get card info in state
	 * @param {*} state 
	 * @param {number} uid 
	 */
	getInStateByUid(state, uid) {

		for (let deckName in state.decks) {

			for (let i in state.decks[deckName].cards) {

				if (state.decks[deckName].cards[i].uid == uid) {

					return state.decks[deckName].cards[i];
				}
			}
		}

		return false;
	}

	/**
	 * Apply the resulting total state
	 * @param {*} summaryState - resulting state
	 * @param {*} aliases - replacing parameters with classes
	 */
	applyState(summaryState, aliases = {}) {

		// console.log('applyState', summaryState);

		let decks = getDecks();

		let uid = (i => () => i++)(0);

		for (let i in decks) {

			let deck = decks[i];

			if (
				deck.showPrevAttempts           &&
				             summaryState.decks &&
				deck.name in summaryState.decks
			) {

				let changes = false;

				for (let cardIndex in deck.cards) {

					let _uid      = uid();
					let stateCard = this.getInStateByUid(summaryState, _uid);
					let card      = deck.cards[cardIndex];
					let values    = ['flip']; // , 'visible'];

					for (let valueIndex in values) {

						let value = values[valueIndex];

						if (value in aliases) {

							let alias = aliases[value];

							card.classList[alias] = (card[value] != stateCard[value]);

						} else {

							if (card[value] != stateCard[value]) {

								card[value] = stateCard[value];

								changes = true;
							}
						}
					}
				}

				// if (changes) {

					// console.log('changes in deck', deck.name);

				deck.Redraw();
				// }
			}
		}
	}
}

export default new snapshot();