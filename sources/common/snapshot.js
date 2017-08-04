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
						// "id"      : cardFrom.id   ,
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

		console.groupCollapsed('>summary');
		let i = 0;
		console.log(
			stateDifferences.map(
				e => Object.entries(e.decks).map(
					([z, d]) => z + ((l => Array(l > 0 ? l : 0).join(' '))(18 - z.length)) + ': '  + d.cards.map(
						c => c.flip ? c.name : '%c' + (++i && c.name) + '%c'
					).join(',')
				).join('\n')
			).join('\n---\n'),
			...[...Array(i * 2)].map((e, i) => "color:" + ((i % 2) ? "blue" : "default"))
		);
		console.groupEnd();

		let state = {
			"decks" : {}
		};

		for(let stateIndex in stateDifferences) {

			let stateI = stateDifferences[stateIndex];

			if(stateIndex == 0) {

				for(let indexI in stateI.decks) {

					state.decks[indexI] = {

						"cards" : (deck => {

							let cards = [];

							for(let cardIndex in deck.cards) {

								let card = deck.cards[cardIndex];

								cards[cardIndex] = {
									"uid"     : card.uid    ,
									// "id"      : card.id     ,
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
									"uid"     : card.uid                                     ,
									// "id"      : card.id                                      ,
									"name"    : card.name                                    ,
									"visible" : deck.cards[cardIndex].visible || card.visible,
									"flip"    : deck.cards[cardIndex].flip    && card.flip
								};
							}

							return cards;
						})(stateI.decks[indexI])
					}
				}
			}
		}

		i = 0;
		console.log(
			'summary\n' + 
			Object.entries(state.decks).map(
				([z, d]) => z + ((l => Array(l > 0 ? l : 0).join(' '))(18 - z.length)) + ': '  + d.cards.map(
					c => c.flip ? c.name : '%c' + (++i && c.name) + '%c'
				).join(',')
			).join('\n'),
			...[...Array(i * 2)].map((e, i) => "color:" + ((i % 2) ? "blue" : "default"))
		);

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

	applyState(summaryState, aliases) {

		console.log('applyState', summaryState);

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

					let values = ['flip', 'visible'];

					for(let valueIndex in values) {

						let value = values[valueIndex];

						changes = changes || card[value] != stateCard[value];

						card[value] = stateCard[value];
					}
				}

				if(changes) {
					console.log('changes in deck', deck.name);
					deck.Redraw();
				}
			}
		}
	}
}

export default new snapshot();