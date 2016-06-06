'use strict';

import event    from 'event';
import defaults from 'defaults';

import storage from 'storage';

let onShowParameters = ()=>{

	let pref = storage.get('pref');
	!pref && (pref = defaults.pref);
	
	$("#pref_field [value=" + (pref.field ? pref.field : defaults.pref.field) + "]")
		.prop({selected: true});
	$("#pref_face [value=" + (pref.face ? pref.face : defaults.pref.face) + "]")
		.prop({selected: true});
	$("#pref_back [value=" + (pref.back ? pref.back : defaults.pref.back) + "]")
		.prop({selected: true});
	// $("#pref_empty [value=" + pref.empty + "]")
		// .prop({selected: true});
};

let applyParameters = ()=>{
	
	var pref = {
		face  : $("#pref_face") .val(),
		back  : $("#pref_back") .val(),
		empty : $("#pref_empty").val()
	};

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
