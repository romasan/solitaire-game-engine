'use strict';

import share from 'share';

export default function(a) {

	// console.log('getDecks', a)

	var _decks = {}
	var _elements = share.get('elements');
	for(var d in _elements) {
		if(_elements[d].type == 'deck') {
			if(a && a.visible) {
				if(_elements[d].visible) {
					_decks[d] = _elements[d];
				}
			} else {
				_decks[d] = _elements[d];
			};
		};
	};
	return _decks;
}