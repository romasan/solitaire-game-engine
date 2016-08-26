'use strict';

export default {
	none    : function(card, i, length) {
		card.flip = false;
	},
	all     : function(card, i, length) {
		card.flip = true;
	},
	notlast : function(card, i, length) {
		card.flip = (i < length - 1) ? true : false;
	},
	first_1 : function(card, i, length) {
		card.flip = (i < 1) ? true : false;
	},
	first_2 : function(card, i, length) {
		card.flip = (i < 2) ? true : false;
	},
	first_3 : function(card, i, length) {
		card.flip = (i < 3) ? true : false;
	},
	bee     : (card, i, length) => {
		card.flip = (i == length - 1) ? false : (i % 2 == 0) ? true : false;
	}
};