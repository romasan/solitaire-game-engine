'use strict';

import share from 'share';

export default (a) => {

	let _decks = {};

	let _elements = share.get('elements');

	if(a && a.visible) {

		for(let d in _elements) {
			if(_elements[d].type == 'deck') {
				if(_elements[d].visible) {
					_decks[d] = _elements[d];
				}
			};
		};
	} else {
		return _elements;
	}
	
	return _decks;
}