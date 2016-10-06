'use strict';

import event    from 'event';
import defaults from 'defaults';

import storage         from 'storage';
import gamePreferences from 'gamePreferences';

let onShowParameters = ()=>{

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);

	for(var prefName in defaults.themes) {

		let _pref = pref[prefName] && defaults.themes[prefName].indexOf(pref[prefName]) >= 0 ? pref[prefName] : defaults.pref[prefName];

		$(`input[name='pref_${prefName}'][value='${_pref}']`)
			.prop({checked: true});
	}

	gamePreferences.show(pref);
};

let applyParameters = ()=>{
	
	var pref = {};
	for(var prefName in defaults.themes) {
		pref[prefName] = $(`input[name='pref_${prefName}']:checked`).val();
	}

	event.dispatch('fieldThemesSet', pref);

	gamePreferences.get(pref);

	event.dispatch('changeGameParameters', pref);
	saveParameters(pref);
};

let saveParameters = (pref)=>{

	storage.set('pref', pref);
};

export default ()=>{
	
	// TODO переделать без jQuery

	$("#bbParameters").click(onShowParameters);
	// event.dispatch('addDomEvent', {
	// 	"event"    : "click"
	// 	"element"  : "#bbParameters",
	// 	"callback" : onShowParameters
	// });
	
	// $("#gpCommit").click(saveParameters);
	
	$('#parametersPanel').on('change', 'input', applyParameters);
	// $("#solitaire-engine-style-preferences input").change(applyParameters);
	
	// event.dispatch('addDomEvent', {
	// 	"event"    : "change"
	// 	"element"  : ".solitaire-engine-style-preferences-element",
	// 	"callback" : applyParameters
	// });
};
