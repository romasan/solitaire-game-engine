'use strict';

// import share from 'share';
import defaults        from 'defaults';
// import gamePreferences from 'gamePreferences';

// import elRender from 'elRender';

export default ()=>{


	// let _locale = require('json!locales.json')[defaults.locale];
	
	// let Tpl = require("./preferncesTemplate.hamlc");//
	
	// let _values = {
	// 	locale: _locale,
	// 	preferences: []
	// };

	// for(let propName in defaults.themes) {
		
	// 	let _pref = {
	// 		title   : _locale["label_" + propName],
	// 		options : []
	// 	};
		
	// 	for(let i in defaults.themes[propName]) {
	// 		_pref.options.push({
	// 			value : defaults.themes[propName][i],
	// 			label : _locale[defaults.themes[propName][i]]
	// 		});
	// 	}

	// 	_values.preferences.push(_pref);
	// };

	// let _html = Tpl(_values);

// --
	
	let _html = require('html!./preferncesTemplate.html');

	$("#gpCommit")
		.parent()
		.before(_html);

	// gamePreferences.draw();

};
