'use strict';

import mapCommon from 'mapCommon';

export default (e)=>{// {deckIndex, count, decks, data}

	let _relations = [];

	var _prev = e.deckIndex > 0
 		? e.decks[(e.deckIndex|0) - 1].name
 		: null;
	if(_prev) {
		_relations.push({
			name: 'beside',
			type: 'prev',
			to  : _prev
		});
	}

	var _next = e.deckIndex < e.count - 1
 		? e.decks[(e.deckIndex|0) + 1].name
 		: null;
	if(_next) {
		_relations.push({
			name: 'beside',
			type: 'next',
			to  : _next
		});
	}

	return _relations;
};