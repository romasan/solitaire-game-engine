'use strict';

/*

Types:

 * none
 * all
 * notlast
 * bee
 * bottomFlip
 * bottomUnflip
 * topFlip
 * topUnflip

 */

export default {

	"none"         : (i, length) => false,

	"all"          : (i, length) => true,

	"notlast"      : (i, length) => (i < length - 1) ? true : false,

	"bee"          : (i, length) => (i == length - 1) ? false : (i % 2 == 0) ? true : false,

	"bottomFlip"   : (i, length, data) => {

		console.log("bottomCount", data);

		return false;
	},

	"bottomUnflip" : (i, length, data) => {

		console.log("bottomUnflip", data);

		return false;
	},

	"topFlip"      : (i, length, data) => {

		console.log("topFlip", data);

		return false;
	},

	"topUnflip"    : (i, length, data) => {

		console.log("topUnflip", data);

		return false;
	}
};