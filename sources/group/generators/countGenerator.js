/*
 * сгенерировать ряд из N карт
 */

'use strict';

export default function(e) {

	// {
	// 	type   : "count",
	// 	count  : int,
	// }

	let _count = e.count;
	let _decks = [];

	for(let deckIndex = 0; deckIndex < _count; deckIndex += 1) {
		
		let _deckName = this.name + "_deck" + (deckIndex + 1);
		
		_decks.push({
			name : _deckName
		});
	}

	return _decks;
}