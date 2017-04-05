'use strict';

import share from 'share';

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

		if(this.exist) {
			return;
		}		

		let _preferences = share.get('gamePreferences');

		for(let prefName in _preferences) {
			
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

			for(let i in _preferences[prefName].options) {
				$(_label).append(
					$('<label>')
						.append(
							$('<input>').prop({
								"type"  : 'radio',
								"name"  : 'gamePref_' + prefName,
								"value" : _preferences[prefName].options[i].value
							})
						)
						.append(
							_preferences[prefName].options[i].title
						)
				)
			}
			$('#gamePreferences').append(_label)
		}

		this.exist = true;
	}

	show(pref) {

		this.draw();

		let _preferences = share.get('gamePreferences');

		for(let prefName in _preferences) {
			if(pref && typeof pref[prefName] != 'undefined') {
				$(`input[name='gamePref_${prefName}'][value='${(pref[prefName]).toString()}']`)
					.prop({ "checked": true });
			} else {
				$(`input[name='gamePref_${prefName}'][value='${(_preferences[prefName].value).toString()}']`)
					.prop({ "checked": true });
			}
		}
	}

	get(pref) {

		let _preferences = share.get('gamePreferences');

		for(let prefName in _preferences) {

			let _value = $(`input[name='gamePref_${prefName}']:checked`).val();

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