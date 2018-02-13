'use strict';

import {share} from '../common';

/*
 * draw
 * show
 * get
 */

class gamePreferences {

	constructor() {
		this.exist = false;
	}

	draw() {

		if (this.exist) {
			return;
		}		

		let _preferences = share.get('gamePreferences');

		for (let prefName in _preferences) {
			
			// let _label = $('<div>').append(
			// 	$('<span>')
			// 		.addClass('solitaire-engine-style-preferences-label')
			// 		.html(_preferences[prefName].title)
			// );

			let el = document.createElement('span');
			    el.setAttribute('class', 'solitaire-engine-style-preferences-label');
			    el.innerHTML = _preferences[prefName].title;

			let _label = document.createElement('div');
			    _label.appendChild(el);

			for (let i in _preferences[prefName].options) {
				
				// $(_label).append(
				// 	$('<label>')
				// 		.append(
				// 			$('<input>').prop({
				// 				"type"  : 'radio',
				// 				"name"  : 'gamePref_' + prefName,
				// 				"value" : _preferences[prefName].options[i].value
				// 			})
				// 		)
				// 		.append(
				// 			_preferences[prefName].options[i].title
				// 		)
				// );

				let _labelInner = document.createElement('label');
				
				let _input = document.createElement('input');
				    _input.setAttribute('type' , 'radio');
				    _input.setAttribute('name' , 'gamePref_' + prefName);
				    _input.setAttribute('value', _preferences[prefName].options[i].value);
				
				_labelInner.appendChild(_input);
				
				// let _span = document.createElement('span');
				//     _span.innerHTML = _preferences[prefName].options[i].title;
				//     console.log(_preferences[prefName].options[i]);

				// _labelInner.appendChild(_span);
				_labelInner.innerHTML += _preferences[prefName].options[i].title;
				
				_label.appendChild(_labelInner);
			}

			// $('#gamePreferences').append(_label)
			document.getElementById('gamePreferences').appendChild(_label);
		}

		this.exist = true;
	}

	show(pref) {

		this.draw();

		let _preferences = share.get('gamePreferences');

		for (let prefName in _preferences) {
			if (pref && typeof pref[prefName] != 'undefined') {

				// $(`input[name='gamePref_${prefName}'][value='${(pref[prefName]).toString()}']`)
				// 	.prop({ "checked": true });

				document.querySelector(`input[name="gamePref_${prefName}"][value="${(pref[prefName]).toString()}"]`)
					.setAttribute('checked', true);
			} else {

				// $(`input[name='gamePref_${prefName}'][value='${(_preferences[prefName].value).toString()}']`)
				// 	.prop({ "checked": true });

				document.querySelector(`input[name="gamePref_${prefName}"][value="${(_preferences[prefName].value).toString()}"]`)
					.setAttribute('checked', true);
			}
		}
	}

	get(pref) {

		let _preferences = share.get('gamePreferences');

		for (let prefName in _preferences) {

			// let _value = $(`input[name='gamePref_${prefName}']:checked`).val();

			let _value = document.querySelector(`input[name="gamePref_${prefName}"]:checked`).value;

			_value = _value == 'true'
				? true
				: _value == 'false'
					? false
					: _value;

			pref[prefName] = _value;
		}
	}
}

export default new gamePreferences();