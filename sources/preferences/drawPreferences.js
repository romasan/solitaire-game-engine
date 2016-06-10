'use strict';

// import elRender from 'elRender';

export default ()=>{

	let _html = require('html!./preferncesTemplate.html');

	$("#gpCommit")
		.parent()
		.before(_html);

};
