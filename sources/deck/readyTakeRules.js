'use strict';

export default {
				
	// SimpleRules
	not      : (a)=>{
		return false;
	},

	notFirst : (a)=>{
		return a.cardIndex > 0;
	},

	any      : (a)=>{
		return true;
	},

	onlytop  : (a)=>{

		return a.cardIndex == a.deckLength - 1;
	}
	
	// TODO rules
	
	// ask : function(a) {
	// 	return true;
	// },

	// desc : function(a) {
	// 	return true;
	// }
};