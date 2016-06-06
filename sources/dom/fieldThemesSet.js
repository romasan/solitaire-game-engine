'use strict';

import event    from 'event';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

event.listen('fieldThemesSet', (pref)=>{
	
	var _field = Field();
	
	let fieldDomElement = _field.domElement;

	// Clear old themes

	for(var prefName in defaults.themes) {
		for(var i in defaults.themes[prefName]) {
			let themeName = defaults.themes[prefName][i];
			elRender(fieldDomElement).removeClass(themeName);
			
		}
	}
	
	// Add new themes
	let fieldClassName = defaults.themes.field[pref.field];
	elRender(fieldDomElement).addClass(fieldClassName);

	let faceClassName = defaults.themes.face[pref.face];
	elRender(fieldDomElement).addClass(faceClassName);
	
	let backClassName = defaults.themes.back[pref.back];
	elRender(fieldDomElement).addClass(backClassName);
	
	let emptyClassName = defaults.themes.empty[pref.empty];
	elRender(fieldDomElement).addClass(emptyClassName);
});