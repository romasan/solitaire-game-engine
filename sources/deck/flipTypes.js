'use strict';


/*

Types:

 * none
 * all
 * notlast
 * first_1
 * first_2
 * first_3
 * bee

 */

export default {
	
	none    : (card, i, length) => {
		card.flip = false;
	},

	all     : (card, i, length) => {
		card.flip = true;
	},

	notlast : (card, i, length) => {
		card.flip = (i < length - 1) ? true : false;
	},

	first_1 : (card, i, length) => {
		card.flip = (i < 1) ? true : false;
	},

	first_2 : (card, i, length) => {
		card.flip = (i < 2) ? true : false;
	},

	first_3 : (card, i, length) => {
		card.flip = (i < 3) ? true : false;
	},

	bee     : (card, i, length) => {
		card.flip = (i == length - 1) ? false : (i % 2 == 0) ? true : false;
	}
};