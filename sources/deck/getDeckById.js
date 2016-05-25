'use strict';

import share from 'share';

export default function(id) {// ID
	
	var _elements = share.get('elements');
	for(var d in _elements) {
		if(_elements[d].type == 'deck' && d == id) {
			return _elements[d];
		};
	};
	return null;
}