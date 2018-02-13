'use strict';

import {share} from '../common';

export default id => {

	let _elements = share.get('elements');

	return _elements[id] && _elements[id].type == 'deck'
		? _elements[id]
		: false;
}