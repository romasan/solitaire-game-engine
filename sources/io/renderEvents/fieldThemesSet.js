'use strict';

import {event, share, defaults} from '../../common';

import Field                    from '../../field' ;
import {elRender}               from '../dom'      ;

event.listen('fieldThemesSet', pref => {

	if (share.get('nodraw')) {
		return;
	}

	let _fieldDomElement = share.get('domElement:field');
	    _fieldDomElement = _fieldDomElement.parentNode.parentNode; // TODO может быть не корректно в отличном от текущего окружении

	for (let prefName in defaults.themes) {

		// Clear old themes
		for (let i in defaults.themes[prefName]) {

			let themeName = defaults.themes[prefName][i];

			elRender(_fieldDomElement)
				.removeClass(themeName);
		}

		// Add new themes
		let className = pref[prefName];
		// let className = defaults.themes[prefName][pref[prefName]];

		elRender(_fieldDomElement)
			.addClass(className);
	}
});