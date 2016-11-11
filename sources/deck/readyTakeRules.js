'use strict';

export default {
				
	// SimpleRules
	not      : (data) => {
		return false;
	},

	notFirst : (data) => {
		return data.cardIndex > 0;
	},

	any      : (data) => {
		return true;
	},

	onlytop  : (data) => {

		return data.cardIndex == data.deckLength - 1;
	}
	
	// TODO rules
	
	// ask : function(data) {
	// 	return true;
	// },

	// desc : function(data) {
	// 	return true;
	// }
};