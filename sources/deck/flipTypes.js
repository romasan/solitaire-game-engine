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

	"notlast"         : (i, length) => (i < length - 1) ? true : false                         ,

	"bee"             : (i, length) => (i == length - 1) ? false : (i % 2 == 0) ? true  : false,

	"beeFlip"         : (i, length) => (i == length - 1) ? true  : (i % 2 == 0) ? false : true ,

	"_direction_type" : (direction, type, i, length, data) => data && (data | 0) > 0
		? direction == "top"
			? i > length - data - 1 // top
				? type == "flip"
					? true
					: false
				: type == "flip"
					? false
					: true
			: i < data              // bottom
				? type == "flip"
					? true
					: false
				: type == "flip"
					? false
					: true
		: false,

	"bottomFlip"      : (i, length, data) => flipTypes._direction_type("bootom", "flip"  , i, length, data),

	"bottomUnflip"    : (i, length, data) => flipTypes._direction_type("bootom", "unflip", i, length, data),

	"topFlip"         : (i, length, data) => flipTypes._direction_type("top"   , "flip"  , i, length, data),

	"topUnflip"       : (i, length, data) => flipTypes._direction_type("top"   , "unflip", i, length, data)
};

export default flipTypes;