'use strict';

import deckGenerator from '../deck/deckGenerator';
import card          from '../card'              ;
import Deck          from '../deck'              ;

let nextCards = deckGenerator().map(e => [card.validateCardName(e)]);

let getNextCards = e => {

	let decks = Deck.getDecks();

	for (let deckIndex in decks) {

		let deck = decks[deckIndex];

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

			console.log('cards for deck', deck.name, cards);
		}
	}
}

export default getNextCards;