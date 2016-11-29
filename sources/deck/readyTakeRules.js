'use strict';

export default {
				
	// SimpleRules
	not      : data => false,

	notFirst : data => data.cardIndex > 0,

	any      : data => true,

	onlytop  : data => data.cardIndex == data.deckLength - 1
	
	// TODO rules
	
	// ask : function(data) {
	// 	return true;
	// },

	// desc : function(data) {
	// 	return true;
	// }
};