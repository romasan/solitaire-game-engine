'use strict';

import {share, event, defaults, storage} from '../common';

import gamePreferences from './gamePreferences' ;

/*
 * onShowParameters
 * applyParameters
 * saveParameters
 */

let onShowParameters = e => {

	let pref = storage.get('pref');

	!pref && (pref = defaults.pref);

	try {
		for (let prefName in defaults.themes) {

			let _pref = pref[prefName] && defaults.themes[prefName].indexOf(pref[prefName]) >= 0
				? pref[prefName]
				: defaults.pref[prefName];

			// $(`input[name='pref_${prefName}'][value='${(_pref).toString()}']`)
			// 	.prop({checked: true});

			document.querySelector(`input[name="pref_${prefName}"][value="${(_pref).toString()}"]`)
				.setAttribute('checked', true);
		}
	} catch (e) {}

	gamePreferences.show(pref);
};

let applyParameters = e => {

	let pref = {};

	try {

		for (let prefName in defaults.themes) {

			// let _value = $(`input[name='pref_${prefName}']:checked`).val();

			let _value = document.querySelector(`input[name="pref_${prefName}"]:checked`).value;

			_value = _value == 'true'
				? true
				: _value == 'false'
					? false
					: _value;

			pref[prefName] = _value;
		}
	} catch (e) {}

	event.dispatch('fieldThemesSet', pref);

	gamePreferences.get(pref);

	// event.dispatch('changeGameParameters', pref);

	saveParameters(pref);

	let changePreferencesCallback = share.get('changePreferencesCallback');

	if (typeof changePreferencesCallback == 'function') {

		let _data = pref;

		changePreferencesCallback(_data, {
			"stepType" : share.get('stepType')
		});
	}
};

let saveParameters = pref => {
	storage.set('pref', pref);
};

export default e => {

	try {

		// $('#bbParameters').click(onShowParameters);

		document.getElementById('bbParameters')
			.addEventListener('click', onShowParameters);
		
		// event.dispatch('addDomEvent', {
		// 	"event"    : "click"
		// 	"element"  : "#bbParameters",
		// 	"callback" : onShowParameters
		// });

		// $("#gpCommit").click(saveParameters);

		// $('#parametersPanel').on('change', 'input', applyParameters);

		document.getElementById('parametersPanel')
			.addEventListener('change', e => {
				if (e.target.nodeName == 'INPUT') {
					applyParameters()
				}
			});

		// $("#solitaire-engine-style-preferences input").change(applyParameters);

		// event.dispatch('addDomEvent', {
		// 	"event"    : "change"
		// 	"element"  : ".solitaire-engine-style-preferences-element",
		// 	"callback" : applyParameters
		// });
	} catch (e) {}
};
