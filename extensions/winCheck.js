'use strict';

import share           from 'share';
import event           from 'event';
import common          from 'SolitaireCommon';

import winCheckMethods from 'winCheckMethods';
import Deck            from 'addDeck';

var winCheck = function(params) {
		
	var rulesCorrect = true;
	var _hasMetods = false;
	var _winCheck = share.get('winCheck');

	// console.log('winCheck', params, _winCheck);
	
	for(var ruleName in _winCheck.rules) {
		_hasMetods = true;

		
		if(winCheckMethods[ruleName]) {
		
			// console.log('>>', ruleName);

				rulesCorrect = rulesCorrect && winCheckMethods[ruleName]({
					decks     : Deck.getDecks({visible : true}), 
					rulesArgs : _winCheck.rules[ruleName]
				});

		} else {
			rulesCorrect = rulesCorrect && winCheckMethods['newerWin']();
		}
	}
	
	if(!_hasMetods) {
		rulesCorrect = rulesCorrect && winCheckMethods['newerWin']();
	}

	if(rulesCorrect) {
		if(params && params.noCallback == true) return true;
		event.dispatch('win', params);
		// a.winCheck.callback();
		return true;
	}

	return false;
		// return rulesCorrect;
	// }
};

var hwinCheck = function(a) {
	if(!a) {
		a = {};
	}
	if(typeof a.show == 'undefined') {
		a.show = false;
	}
	// console.log('winCheck', a);
	winCheck(a);
	// return winCheck({noCallback : true});
};

export default {
	winCheck, 
	hwinCheck
};