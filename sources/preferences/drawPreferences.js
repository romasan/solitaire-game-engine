'use strict';

import defaults from '../common/defaults';
import share    from '../common/share'   ;


export default e => {

	console.log('drawPreferences', share.get('locale'));

	let _html = {
		"ru" : require('html!./preferncesTemplate.ru.html'),
		"en" : require('html!./preferncesTemplate.en.html')
	};

	// $("#gpCommit")
	// 	.parent()
	// 	.before(_html);

	try {

		let el = document.getElementById('gpCommit');

		let div = document.createElement('div');
		div.innerHTML = _html[share.get('locale')];

		el.parentNode.insertBefore(div, el);
	} catch (e) {}
};
