'use strict';

export default {
				
	// SimpleRules
	not      : function(a) {
		return false;
	},

	notFirst : function(a) {
		// console.log('notFirst:', a.cardIndex);
		return a.cardIndex > 0;
	},

	any      : function(a) {
		return true;
	},

	onlytop  : function(a) {
		return a.cardIndex == a.deckLength - 1;
	},
	
	// TODO rules
	ask : function(a) {
		console.log(a);
		return true;
	},

	desc : function(a) {
		console.log(a);
		return true;
	}
};