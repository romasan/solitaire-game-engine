'use strict';

import event    from 'event';
import defaults from 'defaults';

import storage from 'storage';

export default ()=>{

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);

	event.dispatch('fieldThemesSet', pref);
}