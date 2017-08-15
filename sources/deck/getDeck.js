'use strict';

import common from '../common';

export default (name, groupName) => {

	let _decks = common.getElementsByName(name, 'deck');

	if(groupName && typeof groupName == 'string') {
		for(let i in _decks) {

			let _group = common.getElementById(_decks[i].parent());
			if(_group && _group.name && _group.name == groupName) {
				return _decks[i];
			}
		}
		return false;
	} else {
		return _decks[0];
	}
}