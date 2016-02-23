'use strict';

module.exports = function(main, share) {

	share.fillRules = {
		deckLength : function(a) {
			return share.cardsRank.length <= a.deck.getCards().length;
		},
		not : function() {
			// console.log('NOT FILL RULES');
			return false;
		}
	};

};