'use strict';

import event     from 'event';
import share     from 'share';

import forceMove from 'forceMove';
import Deck      from 'addDeck';
import Tips      from 'tips';
// import elRender  from 'elRender';

// var _undoMethods = {};
// var _redoMethods = {};

// ---------------------------------------- UNDO ----------------------------------------

var _undo = function(a) {

	// for(var i in _undoMethods) {
	// 	_undoMethods[i](a);
	// }
	
	// if(a.flip) {
	// };
	
	// if(a.unflip) {
	// 	if(
	// 		typeof a.unflip.deck       == "string"
	// 	 && typeof a.unflip.card       != "undefined"
	// 	 && typeof a.unflip.card.name  == "string"
	// 	 && typeof a.unflip.card.index != "undefined"
	// 	) {
	// 		var _deck = Deck.Deck(a.unflip.deck),
	// 			_cards = _deck ? _deck.cards : [];
	// 		if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
	// 			_cards[a.unflip.card.index].flip = true;
	// 		}
	// 	}
	// };
	
	// if(a.fill) {
	// 	// TODO
	// };

	// LOCK
	if(
		typeof a.lock != "undefined"
	) {
		Deck.Deck(a.lock).unlock();
	}

	if(
		typeof a.unlock != "undefined"
	) {
		Deck.Deck(a.unlock).lock();
	}

	// MOVE
	if(
		typeof a.move      != "undefined" 
	 && typeof a.move.from != "undefined" 
	 && typeof a.move.to   != "undefined" 
	 && typeof a.move.deck != "undefined"
	) {
		forceMove({
			from : a.move.to,// from <=> to
			to   : a.move.from,
			deck : a.move.deck,
			flip : a.move.flip
		});
	}

};

event.listen('undo', function(_a) {

	// elRender.animationsEnd();
	event.dispatch('stopAnimations');
	
	if(!_a) { return; };

	// Обратная совместимость
	if(_a instanceof Array) {

		_a.reverse();
		
		for(var _i in _a) {
			var a = _a[_i];
			_undo(a);
		}
		
	} else {
		
		_undo(_a);
		
	}

	Tips.checkTips();

});

// ---------------------------------------- REDO ----------------------------------------

var _redo = function(a) {

	// for(var i in _redoMethods) {
	// 	_redoMethods[i](a);
	// }

	// if(a.flip) {
	// };
	
	// if(a.unflip) {
	// 	if(
	// 		typeof a.unflip.deck       == "string"
	// 	 && typeof a.unflip.card       != "undefined"
	// 	 && typeof a.unflip.card.name  == "string"
	// 	 && typeof a.unflip.card.index != "undefined"
	// 	) {
	// 		var _deck = Deck.Deck(a.unflip.deck),
	// 			_cards = _deck ? _deck.cards : [];
	// 		if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
	// 			_cards[a.unflip.card.index].flip = false;
	// 		}
	// 	}
	// };
	
	// if(a.fill) {
	// 	// TODO
	// };

	// LOCK
	if(
		typeof a.lock != "undefined"
	) {
		Deck.Deck(a.lock).lock();
	}

	if(
		typeof a.unlock != "undefined"
	) {
		Deck.Deck(a.unlock).unlock();
	}

	// MOVE
	if(
		typeof a.move      != "undefined" 
	 && typeof a.move.from != "undefined" 
	 && typeof a.move.to   != "undefined" 
	 && typeof a.move.deck != "undefined"
	) {
		forceMove(a.move);
	}

};

event.listen('redo', function(_a) {

	// elRender.animationsEnd();
	event.dispatch('stopAnimations');
	

	if(!_a) return;

	// Обратная совместимость
	if(_a instanceof Array) {
		_a.reverse();
		for(var _i in _a) {
			var a = _a[_i];
			_redo(a);
		}
	} else {
		_redo(_a);
	}

	Tips.checkTips();

});

// ----------------------------------------------

class history {

	constructor() {
		
		this.steps = [];
	}

	reset() {
		this.steps = [];
	}

	add(step) {

		// for(var i in step) {
		this.steps.push(step);
		// }
	}

	// get steps and reset
	get(reset = true) {

		var _req = this.steps;
		
		if(reset) {
			this.reset();
		}

		return _req;
	}

	log() {
		console.log(this.steps);
	}

	count() {
		return this.steps.length;
	}

	// addUndoMethods(a) {
	// 	for(var i in a) {
	// 		_undoMethods[i] = a[i];
	// 	}
	// }
	
	// addRedoMethods(a) {
	// 	for(var i in a) {
	// 		_redoMethods[i] = a[i];
	// 	}
	// }
}

let _history = new history();

event.listen('addStep', (e)=>{
	_history.add(e)
});

event.listen('saveSteps', ()=>{

	// save steps to client history
	event.dispatch('makeStep', _history.get());
});

export default _history;
