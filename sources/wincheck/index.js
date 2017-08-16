'use strict';

import share         from '../common/share';
import event         from '../common/event';
import common        from '../common'      ;

import winCheckRules from './winCheckRules';
import Deck          from '../deck'        ;

let winCheck = params => {

	let rulesCorrect = true;
	let hasRules     = false;

	let winCheck = share.get('winCheck');

	if (!winCheck) {
		return false;
	}

	winCheck = winCheck.rules
		? winCheck.rules
		: winCheck;

	for (let ruleName in winCheck) {

		hasRules = true;

		// winCheck - Object
		if (
			typeof ruleName == "string" &&
			winCheck[ruleName]
		) {
			rulesCorrect = rulesCorrect && winCheckRules[ruleName]({
				"decks"     : Deck.getDecks({
					"visible" : true
				}),
				"rulesArgs" : winCheck[ruleName]
			});

		// winCheck - Array of string
		} else if (
			typeof ruleName == "number"  &&
			winCheck[winCheck[ruleName]]
		) {
			rulesCorrect = rulesCorrect && winCheckRules[ruleName]({
				"decks" : Deck.getDecks({
					"visible" : true
				})
			});
		} else {
			rulesCorrect = rulesCorrect && winCheckRules.newerWin();
		}
	}

	if (!hasRules) {
		rulesCorrect = rulesCorrect && winCheckRules.newerWin();
	}

	if (
		rulesCorrect           ||
		share.get('gameIsWon')
	) {

		if (params && params.noCallback) {
			return true;
		}

		// show you win message
		event.dispatch('win', params);

		share.set('gameIsWon', true);

		console.log('WIN');

		return true;
	}

	return false;
};

event.listen('winCheck', winCheck);

// hidden check
let hwinCheck = params => {

	if (!params) {
		params = {};
	}

	if (typeof params.show == 'undefined') {
		params.show = false;
	}

	winCheck(params);
};

export default {
	"winCheck"  : winCheck , 
	"hwinCheck" : hwinCheck
};