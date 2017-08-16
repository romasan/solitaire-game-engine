'use strict';

import share from '../common/share';

export default data => {

	let _decks = {};

	let _elements = share.get('elements');

	if (data && data.visible) {

		for (let deckId in _elements) {
			if (_elements[deckId].type == 'deck') {
				if (_elements[deckId].visible) {
					_decks[deckId] = _elements[deckId];
				}
			};
		};
	} else {

		for (let deckId in _elements) {
			if (_elements[deckId].type == 'deck') {
				_decks[deckId] = _elements[deckId];
			};
		};
	}

	return _decks;
}