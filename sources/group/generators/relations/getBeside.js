'use strict';

export default deck => { // deckClass

	let prev = deck.getRelationsByName('beside', {
		"from" : null,
		"type" : 'prev'
	})[0];

	let next = deck.getRelationsByName('beside', {
		"from" : null,
		"type" : 'next'
	})[0];

	return {prev, next};
};