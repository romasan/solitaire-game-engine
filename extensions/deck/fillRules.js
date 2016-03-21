'use strict';

import defaults from 'defaults';

export default {
	deckLength : function(a) {
		return defaults.card.ranks.length <= a.deck.cards.length;
	},
	not : function() {
		return false;
	}
};