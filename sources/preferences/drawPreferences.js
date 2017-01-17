'use strict';

import defaults from 'defaults';

export default e => {
	
	let _html = require('html!./preferncesTemplate.html');

	$("#gpCommit")
		.parent()
		.before(_html);
};
