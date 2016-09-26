'use strict';

import event    from 'event';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

event.listen('fieldThemesSet', (pref)=>{
	
	let fieldDomElement = Field.domElement;


	for(var prefName in defaults.themes) {
		
		// Clear old themes
		for(var i in defaults.themes[prefName]) {
			let themeName = defaults.themes[prefName][i];
			elRender(fieldDomElement).removeClass(themeName);
			
		}
		
		// Add new themes
		// let className = defaults.themes[prefName][pref[prefName]];
		let className = pref[prefName];
		elRender(fieldDomElement).addClass(className);
		
	}
});