'use strict';

import defaults from '../common/defaults';

export default e => {

	let _html = require('html!./preferncesTemplate.html');

	// $("#gpCommit")
	// 	.parent()
	// 	.before(_html);

	try {

		let el = document.getElementById('gpCommit');

		let div = document.createElement('div');
		div.innerHTML = _html;

		el.parentNode.insertBefore(div, el);
	} catch (e) {}
};
