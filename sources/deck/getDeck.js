'use strict';

import common from 'common';

export default function(name, groupName) {
	
	var _decks = common.getElementsByName(name, 'deck');
	if(groupName && typeof groupName == 'string') {
		for(var i in _decks) {
			var _group = common.getElementById(_gecks[i].parent());
			if(_group && _group.name && _group.name == groupName) {
				return _decks[i];
			}
		}
		return false;
	} else {
		return _decks[0];
	}
}