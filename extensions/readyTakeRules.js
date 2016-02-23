'use strict';

module.exports = function(main, share) {
	
	share.readyTakeRules = {
				
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
		sample   : function(a) {}
	}

};