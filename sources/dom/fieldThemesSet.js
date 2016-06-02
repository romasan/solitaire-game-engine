'use strict';

import event    from 'event';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

event.listen('fieldThemesSet', (pref)=>{
	
	var _field = Field();
	
	let fieldDomElement = _field.domElement;

	// Clear old themes
	for(var i in defaults.themes.face) {
		let themeName = defaults.themes.face[i];
		elRender(fieldDomElement).removeClass(themeName);
	}
	for(var i in defaults.themes.back) {
		let themeName = defaults.themes.back[i];
		elRender(fieldDomElement).removeClass(themeName);
	}
	for(var i in defaults.themes.empty) {
		let themeName = defaults.themes.empty[i];
		elRender(fieldDomElement).removeClass(themeName);
	}
	
	// Add new themes
	let faceClassName = defaults.themes.face[pref.face];
	elRender(fieldDomElement).addClass(faceClassName);
	
	let backClassName = defaults.themes.back[pref.back];
	elRender(fieldDomElement).addClass(backClassName);
	
	let emptyClassName = defaults.themes.empty[pref.empty];
	elRender(fieldDomElement).addClass(emptyClassName);
});