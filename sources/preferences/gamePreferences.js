'use strict';

import share from 'share';

class gamePreferences {

	constructor() {
		this.append = false;
	}

	draw() {
		
		if(this.append) {
			return;
		}
		
		let _preferences = share.get('gamePreferences');
		
		console.log('gamePreferences', _preferences);
		
		for(let prefName in _preferences) {
			
			let _label = $('<div>').append(
				$('<span>')
					.addClass('solitaire-engine-style-preferences-label')
					.html(_preferences[prefName].title)
			);

			for(let i in _preferences[prefName].values) {
				$(_label).append(
					$('<label>')
						.append(
							$('<input>').prop({
								type   : 'radio',
								name   : 'gamePref_' + prefName,
								values : _preferences[prefName][i].value
							})
						)
						.append(
							_preferences[prefName][i].title
						)
				)
			}

			
			$('#gamePreferences').append(_label)
		}

		this.append = true;
	}

	show(pref) {

		this.draw();
		
		let _preferences = share.get('gamePreferences');

		for(let prefName in _preferences) {
			if(pref && pref[prefName]) {
				$(`input[name='gamePref_${prefName}'][value='${pref[prefName]}']`)
					.prop({checked: true});
			} else {
				$(`input[name='gamePref_${prefName}'][value='${_preferences[prefName].value}']`)
					.prop({checked: true});
			}
		}
	}
	
	get(pref) {

		let _preferences = share.get('gamePreferences');

		for(let prefName in _preferences) {
			pref[prefName] = $(`input[name='gamePref_${prefName}']:checked`).val();
		}
	}
}

export default new gamePreferences();