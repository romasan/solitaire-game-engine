'use strict';

export defaults (_deck)=>{// {deck}
	
	let prev = _deck.getRelationsByName('beside', {
		from: null,
		type: "prev"
	})[0];

	let next = _deck.getRelationsByName('beside', {
		from: null,
		type: "next"
	})[0];

	return {prev, next};
};