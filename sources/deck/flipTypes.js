'use strict';

/*

Types:

 * none
 * all
 * notlast
 * bee
 * beeFlip
 * _direction_type
 * bottomFlip
 * bottomUnflip
 * topFlip
 * topUnflip

 */

let flipTypes = {

	"none"            : (i, length) => false                                                   ,

	"all"             : (i, length) => true                                                    ,

	"notlast"         : (i, length) => (i <  length - 1) ? true  : false                       ,

	"bee"             : (i, length) => (i == length - 1) ? false : (i % 2 == 0) ? true  : false,

	"beeFlip"         : (i, length) => (i == length - 1) ? true  : (i % 2 == 0) ? false : true ,

	"_direction_type" : (direction, type, i, length, data) => direction == "top"
		? i >= length - (data ? (data | 0) : 1) // top
			? type == "flip"                    // top param
				? true                          // top param flip
				: false                         // top param unflip
			: type == "flip"                    // top no param
				? false                         // top no param flip
				: true                          // top no param unflip
		: i < (data ? (data | 0) : 1)           // bottom
			? type == "flip"                    // bottom param 
				? true                          // bottom param flip
				: false                         // bottom param unflip
			: type == "flip"                    // bottom no param
				? false                         // bottom no param flip
				: true,                         // bottom no param unflip

	"bottomFlip"      : (i, length, data) => flipTypes._direction_type("bootom", "flip"  , i, length, data),

	"bottomUnflip"    : (i, length, data) => flipTypes._direction_type("bootom", "unflip", i, length, data),

	"topFlip"         : (i, length, data) => flipTypes._direction_type("top"   , "flip"  , i, length, data),

	"topUnflip"       : (i, length, data, deck) => {

		let _result = flipTypes._direction_type("top"   , "unflip", i, length, data);

		// console.log('topUnflip', i, length, data, deck.name, deck.cards[i].name, _result);

		return _result;
	}
};

export default flipTypes;