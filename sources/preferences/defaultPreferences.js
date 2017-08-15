'use strict';

import share    from '../common/share'   ;
import event    from '../common/event'   ;
import defaults from '../common/defaults';

import storage  from '../common/storage' ;

export default e => {

	// Сохранённые настройки
	let pref = storage.get('pref');

	if(!pref) {

		// Настройки по умолчанию из конфигурации
		let theme = share.get('theme');

		if(theme) {

			pref = {};

			for(let prefName in defaults.pref) {
				pref[prefName] = typeof theme[prefName] == 'undefined'
					? defaults.pref[prefName]
					: defaults.themes[prefName].indexOf(theme[prefName]) >= 0
						? theme[prefName]
						: defaults.pref[prefName];
			}

			storage.set('pref', pref);
		} else {

			// Если нет ни сохранённых, ни общих настроек, берём настройки по умолчанию
			pref = defaults.pref;
		}
	}

	for(let prefName in pref) {

		if(defaults.themes[prefName]) {

			if(defaults.themes[prefName].indexOf(pref[prefName]) < 0) {

				pref[prefName] = defaults.pref[prefName];
			}
		}
	}

	event.dispatch('fieldThemesSet', pref);
}