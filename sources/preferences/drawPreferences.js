'use strict';

import share from 'share';

// import elRender from 'elRender';

export default ()=>{


	// let _lang = require('lang.json')[share.get('lang')];
	
	// let Tpl = require("./preferncesTemplate.hamlc");
	
	// let _values = {
	// 	lang: _lang,
	// 	preferences: []
	// };

	// for(let propName in defaults.themes) {
		
	// 	let _pref = {
	// 		title   : _lang["title_" + propName],
	// 		options : []
	// 	};
		
	// 	for(let i in defaults.themes[propName]) {
	// 		_pref.options.push({
	// 			value : defaults.themes[propName][i],
	// 			label : _lang[defaults.themes[propName][i]]
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

};
