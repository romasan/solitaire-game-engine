'use strict';

import share           from 'share';
import event           from 'event';
import common          from 'common';

import winCheckMethods from 'winCheckMethods';
import Deck            from 'deck';

let winCheck = (params) => {

	let rulesCorrect = true;
	let _hasMetods = false;
	let _winCheck = share.get('winCheck');// _field.winCheck

	if(!_winCheck) {
		return false;
	}
	
	for(let ruleName in _winCheck.rules) {
		_hasMetods = true;
		
		if(winCheckMethods[ruleName]) {
		
			let _result = winCheckMethods[ruleName]({
				decks     : Deck.getDecks({visible : true}), 
				rulesArgs : _winCheck.rules[ruleName]
			});
			
			rulesCorrect = rulesCorrect && _result;

		} else {
			rulesCorrect = rulesCorrect && winCheckMethods.newerWin();
		}
	}
	
	if(!_hasMetods) {
		rulesCorrect = rulesCorrect && winCheckMethods.newerWin();
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
let hwinCheck = (params) => {
	
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
	winCheck, 
	hwinCheck
};