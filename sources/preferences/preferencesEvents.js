'use strict';

import share           from 'share'          ;
import event           from 'event'          ;
import defaults        from 'defaults'       ;

import storage         from 'storage'        ;
import gamePreferences from 'gamePreferences';

/*
 * onShowParameters
 * applyParameters
 * saveParameters
 */

let onShowParameters = e => {

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);

	for(let prefName in defaults.themes) {

		let _pref = pref[prefName] && defaults.themes[prefName].indexOf(pref[prefName]) >= 0
			? pref[prefName]
			: defaults.pref[prefName];

		$(`input[name='pref_${prefName}'][value='${(_pref).toString()}']`)
			.prop({checked: true});
	}

	gamePreferences.show(pref);
};

let applyParameters = e => {
	
	let pref = {};

	for(let prefName in defaults.themes) {
		let _value = $(`input[name='pref_${prefName}']:checked`).val();
		_value = _value == "true" ? true : _value == "false" ? false : _value;
		pref[prefName] = _value;
	}

	event.dispatch('fieldThemesSet', pref);

	gamePreferences.get(pref);

	// event.dispatch('changeGameParameters', pref);

	saveParameters(pref);
	
	let changePreferencesCallback = share.get('changePreferencesCallback');
	if(typeof changePreferencesCallback == "function") {
		let _data = pref;
		changePreferencesCallback(_data);
	}
};

let saveParameters = pref => {
	storage.set('pref', pref);
};

export default e => {
	
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
