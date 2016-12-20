'use strict';

import event    from 'event';
import defaults from 'defaults';

import storage from 'storage';

export default e => {

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);

	for(let prefName in pref) {
		
		if(defaults.themes[prefName]) {

			if(!defaults.themes[prefName].includes(pref[prefName])) {
				pref[prefName] = defaults.pref[prefName];
			}

		}
	}

	event.dispatch('fieldThemesSet', pref);
}