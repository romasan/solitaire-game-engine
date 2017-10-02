'use strict';

import Deck from '../../../deck';

export default deck => { // deckClass

	let prev = Deck.getRelationsByName(deck, 'beside', {
		"from" : null,
		"type" : 'prev'
	})[0];

	let next = Deck.getRelationsByName(deck, 'beside', {
		"from" : null,
		"type" : 'next'
	})[0];

	return {prev, next};
};