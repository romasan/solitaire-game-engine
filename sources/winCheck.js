'use strict';

import share           from 'share';
import event           from 'event';
import common          from 'common';

import winCheckMethods from 'winCheckMethods';
import Deck            from 'addDeck';

var winCheck = function(params) {

	var rulesCorrect = true;
	var _hasMetods = false;
	var _winCheck = share.get('winCheck');// _field.winCheck
	
	for(var ruleName in _winCheck.rules) {
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
		
		if(params && params.noCallback) { return true; }
		
		// show you win message
		event.dispatch('win', params);

		console.log('WIN');

		return true;
	}

	return false;
};

// hidden check
var hwinCheck = function(a) {
	
	if(!a) {
		a = {};
	}
	
	if(typeof a.show == 'undefined') {
		a.show = false;
	}
	
	winCheck(a);
	// return winCheck({noCallback : true});
};

export default {
	winCheck, 
	hwinCheck
};