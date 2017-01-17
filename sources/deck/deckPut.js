'use strict';

import share    from 'share'        ;
import defaults from 'defaults'     ;

import Field    from 'field'        ;
import Deck     from 'deck'         ;
import putRules from 'readyPutRules';

export default (deck, putDeck) => {

	let _stepType = share.get('stepType');

	let rulesCorrect = true;
	
	let _deckId         = putDeck[0].card.parent;
	let _deck_departure = Deck.getDeckById(_deckId);

	rulesCorrect = rulesCorrect && !deck.locked;

	if(_stepType != defaults.stepType) {

		// Нестандартный ход (autosteps)
		rulesCorrect = rulesCorrect && Field.autoSteps && Field.autoSteps[_stepType]
			? Field.autoSteps[_stepType].manual({
				putDeck,
				to : deck
			})
			: false;
	} else {

		let _link = null;// deckName
		let _deck = deck;

		for(let ruleIndex in deck.putRules) {
			
			if(rulesCorrect) {

				if(_link) {
					_deck = Deck.getDeck(_link);
				}

				let ruleName = deck.putRules[ruleIndex];

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
