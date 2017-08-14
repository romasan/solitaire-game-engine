'use strict';

import deckGenerator  from 'deckGenerator' ;

let nextCards = deckGenerator().map(e => [e]);

let getNextCards = e => {

	let decks = Deck.getDecks();

	for(let deckIndex in decks) {

		let deck = decks[deckIndex];

		// TODO test move to deck with card
		// {
		// 	cards : [cardClass], // !
		// 	from: {
		// 		deck: deckClass,
		// 		deckId: "deck_1"
		// 	},
		// 	putDeck: [{ // !
		// 		index: "0",
		// 		card: cardClass
		// 	}],
		// 	to: deckClass // @!
		// }

		let _data = {
			"from"    : {
				"deckId" : _deckId        ,
				"deck"   : _deck_departure
			}, 
			"putDeck" : putDeck    ,
			"cards"   : _deck.cards,
			"to"      : _deck
			// "link"    : _link
		};
	}
}