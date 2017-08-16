'use strict';

import event         from '../common/event'      ;

import deckGenerator from '../deck/deckGenerator';
import card          from '../card'              ;
import Deck          from '../deck'              ;

let nextCards = deckGenerator().map(e => card.validateCardName(e));

let getNextCards = e => {

	// console.log('getNextCards');

	let decks = Deck.getDecks();

	let _nextCards = {};

	for (let deckIndex in decks) {

		let deck = decks[deckIndex];

		// console.log(deck.name, 'checkNextCards', deck.checkNextCards, deck);
		
		if (deck.checkNextCards) {

			let cards = [];

			for (let i in nextCards) {
			
				let _card = nextCards[i];
				
				try {
					if (deck.Put([{
						"index" : 0,
						"card"  : _card
					}])) {
						cards.push(_card.name);
					}
				} catch (e) {
					console.log(e);
				}
			}

			_nextCards[deck.id] = cards;
		}
	}

	event.dispatch('updateNextCards', _nextCards);
}

export default getNextCards;