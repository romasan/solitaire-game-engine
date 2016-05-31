'use strict';

import elRender from 'elRender';

export default ()=>{

	return;
	
	console.log("-- renderTests");
// --
	let _el_1 = elRender("<div>");
	console.log(
		"- renderTest#1-A",
		_el_1
	);
	console.log(
		"- renderTest#1-B",
		_el_1.elements[0].el.className
	);
// --
	let _el_2 = elRender("#tbUndo");
	console.log(
		"- renderTest#2-A",
		_el_2
	);
	console.log(
		"- renderTest#2-B",
		_el_2.elements[0].el.className
	);
// --
	let _el_3 = elRender(".titleBandLink");
	console.log(
		"- renderTest#3-A",
		_el_3
	);
	console.log(
		"- renderTest#3-B",
		_el_3.elements[0].el.className
	);
// --
	let _el_4 = document.querySelector(".titleBandLink");
	console.log(
		"- renderTest#4-A",
		_el_4
	);
	console.log(
		"- renderTest#4-B",
		_el_4.elements[0].el.className
	);
// --
	let _el_5 = document.querySelectorAll(".titleBandLink");
	console.log(
		"- renderTest#5-A",
		_el_5
	);
	console.log(
		"- renderTest#5-B",
		_el_5.elements[0].el.className
	);
// --
	let _el = elRender("#tbUndo");
	let _el_6 = elRender(_el);
	console.log(
		"- renderTest#6-A",
		_el_6
	);
	console.log(
		"- renderTest#6-B",
		_el_6.elements[0].el.className
	);
// --
	let _elements = elRender(".titleBandLink");
	let _el_7 = elRender(_elements);
	console.log(
		"- renderTest#7-A",
		_el_7
	);
	console.log(
		"- renderTest#7-B",
		_el_7.elements[0].el.className
	);
}; 