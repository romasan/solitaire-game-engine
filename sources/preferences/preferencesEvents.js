'use strict';

import event    from 'event';
import defaults from 'defaults';

import storage from 'storage';

let onShowParameters = ()=>{

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);
	
	for(var prefName in defaults.themes) {
		$("#pref_" + prefName + " [value=" + (pref[prefName] ? pref[prefName] : defaults.pref[prefName]) + "]")
	}
};

let applyParameters = ()=>{
	
	var pref = {};
	for(var prefName in defaults.themes) {
		pref[prefName] = $("#pref_" + prefName).val();
	}

	event.dispatch('fieldThemesSet', pref);

	saveParameters(pref);
};

let saveParameters = (pref)=>{

	storage.set('pref', pref);
};

export default ()=>{
	
	$("#bbParameters").click(onShowParameters);
	// $("#gpCommit").click(saveParameters);
	$(".cards-style-preferences-element").change(applyParameters);
};
