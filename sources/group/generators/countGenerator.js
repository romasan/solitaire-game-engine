/*
 * сгенерировать ряд из N карт
 */

'use strict';

export default function(e) {
	
    // {
    //   type   : "count",
    //   count  : int,
    // }
    
    // TODO
    // direction : string(up|down|right|left) default right
    // new generator 'line'?

	var _count = e.count;
	var _decks = [];
	
	for(var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
		var _deckName = this.name + "_deck" + (deckIndex + 1);
		_decks.push({
			name : _deckName
		});
	}
	
	return _decks;
}