'use strict';

import common   from 'common'  ;

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

	diff(stateFrom, stateTo) { // A - from, B - to

		// console.groupCollapsed('diff');
		// let i = 0;
		// console.log(
		// 	[stateFrom, stateTo].map(
		// 		e => Object.entries(e.decks).map(
		// 			([z, d]) => z + ((l => Array(l > 0 ? l : 0).join(' '))(18 - z.length)) + ': '  + d.cards.map(
		// 				c => c.flip ? c.name : '%c' + (++i && c.name) + '%c'
		// 			).join(',')
		// 		).join('\n')
		// 	).join('\n---\n'),
		// 	...[...Array(i * 2)].map((e, i) => "color:" + ((i % 2) ? "blue" : "default"))
		// );
		// console.groupEnd();

		let state = {
			"decks" : {}
		};

		for(let deckNameFrom in stateFrom.decks) {

			let deckFrom = stateFrom.decks[deckNameFrom];

			let deck = [];

			for(let cardIndexFrom in deckFrom.cards) {

				let cardFrom = deckFrom.cards[cardIndexFrom];
				let cardTo   = null;

				for(let deckNameTo in stateTo.decks) {

					let deckTo = stateTo.decks[deckNameTo];

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
					// let allCards = common.getElementsByType('card');
					// allCards.sort((a, b) => (a.id.replace( /^\D+/g, '') | 0) > (b.id.replace( /^\D+/g, '') | 0) ? 1 : -1);
					// console.warn('card', cardFrom.name, 'with id', cardFrom.id, 'not found in', deckNameFrom,
					// 	allCards[0].id, '...', allCards[allCards.length - 1].id, allCards.filter(e => e.name == cardFrom.name)[0],
					// 	stateTo.decks);
				}
			}

			state.decks[deckNameFrom] = {
				"cards" : deck
			};
		}

		return state;
	}

	summary(stateDifferences) {

		let summaryState = {
			"decks" : {}
		};

		for(let stateIndex in stateDifferences) {

			let stateI = stateDifferences[stateIndex];

			console.groupCollapsed('summary', stateIndex);
			let i = 0;
			console.log(
				Object.entries(stateI.decks).map(
						([z, d]) => z + ((l => Array(l > 0 ? l : 0).join(' '))(18 - z.length)) + ': '  + d.cards.map(
							c => c.flip ? c.name : '%c' + (++i && c.name) + '%c'
						).join(',')
					).join('\n'),
				...[...Array(i * 2)].map((e, i) => "color:" + ((i % 2) ? "blue" : "default"))
			);
			console.groupEnd();

			if(stateIndex == 0) {
				summaryState = stateI;
			} else {

				for(let deckName in stateI.decks) {

					let deck     = stateI.decks[deckName];
					let deckPrev = summaryState.decks[deckName];

					summaryState.decks[deckName] = {

						"cards" : deck.cards.map((card, i, deck) => {

							return {
								"uid"     : card.uid                           ,
								"name"    : card.name                          ,
								"visible" : deckPrev.cards[i].visible || card.visible,
								"flip"    : deckPrev.cards[i].flip    && card.flip
							};
						})
					}
				}
			}
		}

		let i = 0;
		console.log(
			'summary result\n' + 
			Object.entries(summaryState.decks).map(
				([z, d]) => z + ((l => Array(l > 0 ? l : 0).join(' '))(18 - z.length)) + ': '  + d.cards.map(
					c => c.flip ? c.name : '%c' + (++i && c.name) + '%c'
				).join(',')
			).join('\n'),
			...[...Array(i * 2)].map((e, i) => "color:" + ((i % 2) ? "blue" : "default"))
		);

		return summaryState;
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

	applyState(summaryState, aliases = {}) {

		// console.log('applyState', summaryState);

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
					let values = ['flip']; // , 'visible'];

					for(let valueIndex in values) {

						let value = values[valueIndex];

						console.log(card);
						if(value in aliases) {

							let alias = aliases[value];


							card.classList[alias] = (card[value] != stateCard[value]);
						} else {

							if(card[value] != stateCard[value]) {

								card[value] = stateCard[value];

								changes = true;
							}
						}

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