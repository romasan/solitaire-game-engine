'use strict';

// import elRender from 'elRender';

export default ()=>{

let _html = require('html!./preferncesTemplate.html');

	// console.log(
	// 	"html",
	// 	_html
	// );
	// console.log(
	// 	"#gpCommit",
	// 	elRender("#gpCommit")
	// );
	// console.log(
	// 	"PARENT:",
	// 	elRender("#gpCommit")
	// 		.parent()
	// );

	// elRender("#gpCommit")
	// 	.parent()
	// 	.before(_html);
	$("#gpCommit")
		.parent()
		.before(_html);

	// console.log("test")
};

// preload preferences
// clicks (apply changes)