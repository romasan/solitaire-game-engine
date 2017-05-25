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

	"_direction_type" : (direction, type, i, length, data, arg) => data && (data | 0) > 0
		? direction == "top"
			? i > length - data - (arg ? (arg | 0) : 1) // top
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

	"bottomFlip"      : (i, length, data, arg) => flipTypes._direction_type("bootom", "flip"  , i, length, data, arg),

	"bottomUnflip"    : (i, length, data, arg) => flipTypes._direction_type("bootom", "unflip", i, length, data, arg),

	"topFlip"         : (i, length, data, arg) => flipTypes._direction_type("top"   , "flip"  , i, length, data, arg),

	"topUnflip"       : (i, length, data, arg) => flipTypes._direction_type("top"   , "unflip", i, length, data, arg)

	// TODO topFlip:counter, topUnflip:counter, bottomFlip:counter, bottomUnflip:counter
};

export default flipTypes;