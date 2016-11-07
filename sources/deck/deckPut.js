'use strict';

import share    from 'share';
import defaults from 'defaults';

import Field    from 'field';
import Deck     from 'deck';
import putRules from 'readyPutRules';

export default function(putDeck) {

	let _stepType = share.get('stepType');

	var rulesCorrect = true;
	
	var _deckId         = putDeck[0].card.parent;
	var _deck_departure = Deck.getDeckById(_deckId);

	rulesCorrect = rulesCorrect && !this.locked;

	if(_stepType != defaults.stepType) {

		// Нестандартный ход (autosteps)
		rulesCorrect = rulesCorrect && Field.autoSteps && Field.autoSteps[_stepType]
			? Field.autoSteps[_stepType].manual({
				putDeck,
				to: this
			})
			: false;
	} else {

		let _link = null;// deckName
		let _deck = this;

		for(var ruleIndex in this.putRules) {
			
			if(rulesCorrect) {

				if(_link) {
					_deck = Deck.getDeck(_link);
				}

				var ruleName = this.putRules[ruleIndex];

				if(putRules[ruleName]) {

					let _param = {
						from    : {
							deckId : _deckId, 
							deck   : _deck_departure
						}, 
						putDeck,
						cards   : _deck.cards,
						to      : _deck,
						link    : _link
						// rulesArgs : putRules[ruleName]
					};
					rulesCorrect = rulesCorrect && putRules[ruleName](_param);
					_link = _param.link;

				} else {
					console.warn('putRule:', ruleName, 'not exists');
					rulesCorrect = false;
				}
			}
		}
	}

	return rulesCorrect;
};
