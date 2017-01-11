'use strict';

import share           from 'share';
import event           from 'event';
import common          from 'common';

import winCheckRules   from 'winCheckRules';
import Deck            from 'deck';

let winCheck = params => {

	let rulesCorrect = true;
	let _hasRules = false;

	let _winCheck = share.get('winCheck');

	if(!_winCheck) {
		return false;
	}

	// if(_winCheck.rules) {
	// 	_winCheck = winCheck.rules;
	// }

	let _winCheckRules = _winCheck.rules
		? _winCheck.rules
		: _winCheck;

	for(let ruleName in _winCheckRules) {

		_hasRules = true;

		if(winCheckRules[ruleName]) {

			let _result = winCheckRules[ruleName]({
				decks     : Deck.getDecks({visible : true}), 
				rulesArgs : _winCheckRules[ruleName]
			});

			rulesCorrect &= _result;

		} else {
			rulesCorrect &= winCheckRules.newerWin();
		}
	}

	if(!_hasRules) {
		rulesCorrect &= winCheckRules.newerWin();
	}

	if(rulesCorrect) {

		if(params && params.noCallback) {
			return true;
		}

		// show you win message
		event.dispatch('win', params);

		console.log('WIN');

		return true;
	}

	return false;
};

// hidden check
let hwinCheck = params => {

	if(!params) {
		params = {};
	}

	if(typeof params.show == 'undefined') {
		params.show = false;
	}

	winCheck(params);
	// return winCheck({noCallback : true});
};

export default {
	winCheck , 
	hwinCheck
};