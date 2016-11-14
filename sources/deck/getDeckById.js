'use strict';

import share from 'share';

export default (id) => {// ID
	
	let _elements = share.get('elements');
	
	// for(var d in _elements) {
	// 	if(_elements[d].type == 'deck' && d == id) {
	// 		return _elements[d];
	// 	};
	// };

	return _elements[id] && _elements[id].type == 'deck'
		? _elements[id]
		: false;
}