'use strict';

module.exports = function(main, share) {
	
	share.flipTypes = {
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
		}
	}

};