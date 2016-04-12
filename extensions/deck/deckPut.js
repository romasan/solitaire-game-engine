'use strict';

import Deck     from 'addDeck';
import putRules from 'readyPutRules';

export default function(putDeck) {

	// console.log('PUT', this.name, this.putRules);

	var rulesCorrect = true;
	
	var _deckId         = putDeck[0].card.parent;
	var _deck_departure = Deck.getDeckById(_deckId);

	rulesCorrect = rulesCorrect && !this.locked;

	// if(typeof putRules == 'function') {
	// 	rulesCorrect = rulesCorrect && putRules({
	// 		from    : {
	// 			deckId : _deckId, 
	// 			deck   : _deck_departure
	// 		}, 
	// 		putDeck : putDeck,
	// 		cards   : this.cards
	// 	});
	// } else {
	for(var ruleIndex in this.putRules) {
		
		var ruleName = this.putRules[ruleIndex];
		
		// var ruleName = (parseInt(ruleName).toString() == ruleName && typeof putRules[ruleName] == 'string') 
		// 	? putRules[ruleName] 
		// 	: ruleName;

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
		// } //else if(typeof putRules[ruleName] == 'function') {
		// 	rulesCorrect = rulesCorrect && putRules[ruleName]({
		// 		from    : {
		// 			deckId : _deckId, 
		// 			deck   : _deck_departure
		// 		}, 
		// 		putDeck : putDeck,
		// 		cards   : this.cards
		// 	});
		} else {
			console.warn('putRule:', ruleName, 'not exists');
			rulesCorrect = false;
		}
	}
	// }

	return rulesCorrect;
};