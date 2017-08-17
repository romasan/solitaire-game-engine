'use strict';

import event         from '../common/event'      ;

import deckGenerator from '../deck/deckGenerator';
import Card          from '../card'              ;
import Deck          from '../deck'              ;

let nextCards = deckGenerator({
	"cardDescription" : true
});

let _cardNames = [];

let genNextCards = e => {

	// console.log('genNextCards');

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
						cards.push(_card);
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

event.listen('genNextCards', genNextCards);

export default genNextCards;