'use strict';

import event    from 'event';
import defaults from 'defaults';

import storage from 'storage';

let onShowParameters = ()=>{

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);
	
	for(var prefName in defaults.themes) {
		let _pref = pref[prefName] ? pref[prefName] : defaults.pref[prefName];
		$(`input[name='pref_${prefName}'] [value='${_pref}']`)
			.prop({selected: true});
	}
};

let applyParameters = ()=>{
	
	var pref = {};
	for(var prefName in defaults.themes) {
		pref[prefName] = $(`imput[name='pref_${prefName}']`).val();
	}

	event.dispatch('fieldThemesSet', pref);

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
	
	$(".solitaire-engine-style-preferences-element").change(applyParameters);
	// event.dispatch('addDomEvent', {
	// 	"event"    : "change"
	// 	"element"  : ".solitaire-engine-style-preferences-element",
	// 	"callback" : applyParameters
	// });
};
