'use strict';

import mapCommon from 'mapCommon';

export default data => {// {deckIndex, count, decks, data}

	let _relations = [];

	let _prev = data.deckIndex > 0
		? data.decks[(data.deckIndex | 0) - 1].name
		: null;

	if(_prev) {
		_relations.push({
			"name" : 'beside',
			"type" : 'prev'  ,
			"to"   : _prev
		});
	}

	let _next = data.deckIndex < data.count - 1
		? data.decks[(data.deckIndex | 0) + 1].name
		: null;

	if(_next) {
		_relations.push({
			"name" : 'beside',
			"type" : 'next'  ,
			"to"   : _next
		});
	}

	return _relations;
};