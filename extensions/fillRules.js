'use strict';

export default function(main, share) {

	return {
		deckLength : function(a) {
			return share.cardsRank.length <= a.deck.getCards().length;
		},
		not : function() {
			// console.log('NOT FILL RULES');
			return false;
		}
	};

};