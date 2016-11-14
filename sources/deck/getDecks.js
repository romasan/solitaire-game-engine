'use strict';

import share from 'share';

export default (data) => {

	let _decks = {};

	let _elements = share.get('elements');

	if(data && data.visible) {

		for(let d in _elements) {
			if(_elements[d].type == 'deck') {
				if(_elements[d].visible) {
					_decks[d] = _elements[d];
				}
			};
		};
	} else {
		for(let d in _elements) {
			if(_elements[d].type == 'deck') {
				_decks[d] = _elements[d];
			};
		};
		// return _elements;
	}
	
	return _decks;
}