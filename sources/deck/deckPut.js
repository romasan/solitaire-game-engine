'use strict';

import share    from 'share';
import defaults from 'defaults';

import Field    from 'field';
import Deck     from 'addDeck';
import putRules from 'readyPutRules';

export default function(putDeck) {

	let _stepType = share.get('stepType');

	var rulesCorrect = true;
	
	var _deckId         = putDeck[0].card.parent;
	var _deck_departure = Deck.getDeckById(_deckId);

	rulesCorrect = rulesCorrect && !this.locked;

	if(_stepType != defaults.stepType) {

		// Нестандартный ход (autosteps)
		let _field = Field();
		rulesCorrect = rulesCorrect && _field.autoSteps && _field.autoSteps[_stepType]
			? _field.autoSteps[_stepType].manual({
				putDeck,
				to: this
			})
			: false;
	} else {

		for(var ruleIndex in this.putRules) {
			
			if(rulesCorrect) {

				var ruleName = this.putRules[ruleIndex];

				if(putRules[ruleName]) {

					rulesCorrect = rulesCorrect && putRules[ruleName]({
						from      : {
							deckId : _deckId, 
							deck   : _deck_departure
						}, 
						putDeck   : putDeck,
						cards     : this.cards//,
						// rulesArgs : putRules[ruleName]
					});

				} else {
					console.warn('putRule:', ruleName, 'not exists');
					rulesCorrect = false;
				}
			}
		}
	}

	return rulesCorrect;
};
