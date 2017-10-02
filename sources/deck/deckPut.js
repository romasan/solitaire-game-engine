'use strict';

import share    from '../common/share'   ;
import defaults from '../common/defaults';

import putRules from './putRules'        ;

/**
 * @typedef {Object} deckTakeReturns
 * @property {number} index
 * @property {Card} card
 */

/**
 * Checking, the possibility of putting the card
 * @param {Deck} deck
 * @param {deckTakeReturns[]} putDeck 
 * @returns {boolean}
 */
let deckPut = (deck, putDeck, decks, state) => {

	let _stepType = share.get('stepType');

	let rulesCorrect = true;

	let _deckId         = putDeck[0].card.parent;
	let _deck_departure = decks.filter(e => e.id == _deckId)[0];

	rulesCorrect = rulesCorrect && !deck.locked;

	rulesCorrect = rulesCorrect && !deck.full;

	// Нестандартный ход (autosteps)
	if (_stepType != defaults.stepType) {

		// TODO
		// rulesCorrect = rulesCorrect    &&
		// 	state.autoSteps            &&
		// 	state.autoSteps[_stepType]
		// 		? state.autoSteps[_stepType].manual({
		// 			"putDeck" : putDeck,
		// 			"to"      : deck
		// 		})
		// 		: false;
	// Стандартный ход
	} else {
		// let _link = null; // target deck name?
		let _deck = deck;

		for (let ruleIndex in deck.putRules) {

			if (rulesCorrect) {

				// if (_link) {
				// 	_deck = Deck.getDeck(_link);
				// }

				let ruleName = deck.putRules[ruleIndex].name;
				let ruleProp = deck.putRules[ruleIndex].value;

				// if (ruleName.indexOf(':') > 0) {
				// 	ruleProp = ruleName.split(':')[1];
				// 	ruleName = ruleName.split(':')[0];
				// }

				if (putRules[ruleName]) {

					let _data = {
						"from"    : {
							"deckId" : _deckId        ,
							"deck"   : _deck_departure
						}, 
						"putDeck" : putDeck    ,
						"cards"   : _deck.cards,
						"to"      : _deck
						// "link"    : _link
					};

					rulesCorrect = rulesCorrect && putRules[ruleName](_data, ruleProp, decks);
					// _link = _param.link;

				} else {
					console.warn('putRule:', ruleName, 'not exists');
					rulesCorrect = false;
				}
			}
		}
	}

	return rulesCorrect;
};

export default deckPut;