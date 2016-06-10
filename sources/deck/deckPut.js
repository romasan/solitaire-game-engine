'use strict';

import Deck     from 'addDeck';
import putRules from 'readyPutRules';

export default function(putDeck) {

	var rulesCorrect = true;
	
	var _deckId         = putDeck[0].card.parent;
	var _deck_departure = Deck.getDeckById(_deckId);

	rulesCorrect = rulesCorrect && !this.locked;

	for(var ruleIndex in this.putRules) {
		
		var ruleName = this.putRules[ruleIndex];

		if(putRules[ruleName]) {
			rulesCorrect = rulesCorrect && putRules[ruleName]({
				from      : {
					deckId : _deckId, 
					deck   : _deck_departure
				}, 
				putDeck   : putDeck,
				cards     : this.cards,
				rulesArgs : putRules[ruleName]
			});

		} else {
			console.warn('putRule:', ruleName, 'not exists');
			rulesCorrect = false;
		}
	}

	return rulesCorrect;
};