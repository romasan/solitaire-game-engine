'use strict';

import event     from 'event';

import forceMove from 'forceMove';
import Deck      from 'addDeck';

var _oneStepWay  = {};
var _undoMethods = {};
var _redoMethods = {};

export default new function() {

	this.reset = function() {
		_oneStepWay = {};
	};

	this.add = function(step) {
		for(var i in step) {
			_oneStepWay[i] = step[i];
		}
	};

	this.get = function() {
		var _req = _oneStepWay;
		_oneStepWay = {};
		return _req;
	};

	this.addUndoMethods  = function(a) {
		for(var i in a) {
			_undoMethods[i] = a[i];
		}
	};
	
	this.addRedoMethods  = function(a) {
		for(var i in a) {
			_redoMethods[i] = a[i];
		}
	};

	event.listen('undo', function(a) {
		
		// console.log('forceMove undo:', _undoMethods);
		if(!a) return;
		
		for(var i in _undoMethods) {
			// console.log(i);
			_undoMethods[i](a);
		}
		
		// if(a.flip) {
		// };
		
		if(a.unflip) {
			if(
				typeof a.unflip.deck       == "string"
			 && typeof a.unflip.card       != "undefined"
			 && typeof a.unflip.card.name  == "string"
			 && typeof a.unflip.card.index != "undefined"
			) {
				var _deck = Deck.Deck(a.unflip.deck),
					_cards = _deck ? _deck.cards : [];
				if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
					_cards[a.unflip.card.index].flip = true;
				}
			}
		};
		
		if(a.fill) {
			// TODO
		};

		// if(!a || !a.move) return;
		if(
			typeof a.move      != "undefined" 
		 && typeof a.move.from != "undefined" 
		 && typeof a.move.to   != "undefined" 
		 && typeof a.move.deck != "undefined"
		) {
			forceMove({
				from : a.move.to,
                to   : a.move.from,
                deck : a.move.deck
			})
		}


	});

	event.listen('redo', function(a) {
		
		// console.log('forceMove redo:', _redoMethods);

		if(!a) return;
		
		for(var i in _redoMethods) {
			_redoMethods[i](a);
		}

		// if(a.flip) {
		// };
		
		if(a.unflip) {
			if(
				typeof a.unflip.deck       == "string"
			 && typeof a.unflip.card       != "undefined"
			 && typeof a.unflip.card.name  == "string"
			 && typeof a.unflip.card.index != "undefined"
			) {
				var _deck = Deck.Deck(a.unflip.deck),
					_cards = _deck ? _deck.cards : [];
				if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
					_cards[a.unflip.card.index].flip = false;
				}
			}
		};
		
		if(a.fill) {
			// TODO
		};

		if(!a || !a.move) return;
		if(
			typeof a.move.from != "undefined" 
		 && typeof a.move.to   != "undefined" 
		 && typeof a.move.deck != "undefined"
		) {
			forceMove({
				from : a.move.from,
                to   : a.move.to,
                deck : a.move.deck
			})
		}

	});
};
