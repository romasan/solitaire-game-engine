'use strict';

import event     from 'event';
import share     from 'share';
import common    from 'common';
import state     from 'state';

import forceMove from 'forceMove';
import Deck      from 'deck';
import Tips      from 'tips';
import field     from 'field';
// import elRender  from 'elRender';

// let _undoMethods = {};
// let _redoMethods = {};

// ---------------------------------------- UNDO ----------------------------------------

let _undo = (data) => {

	if(share.get('sessionStarted')) {

		event.dispatch('stopAnimations');
		
		state.restore();
	}

	// for(let i in _undoMethods) {
	// 	_undoMethods[i](data);
	// }
	
	// if(data.flip) {
	// };
	
	// if(data.unflip) {
	// };
	
	// if(data.full) {
	// };

	// LOCK
	if(
		typeof data.lock != "undefined"
	) {
		// Deck.Deck(data.lock).unlock();
		// TODO сделать также в оставшихся местах
		for(let i in data.lock) {
			let _elements = common.getElementsByName(data.lock[i]);
			for(let elNum in _elements) {
				_elements[elNum].unlock();
			}
		}
	}

	if(
		typeof data.unlock != "undefined"
	) {
		// Deck.Deck(data.unlock).lock();
		for(let i in data.lock) {
			let _elements = common.getElementsByName(data.lock[i]);
			for(let elNum in _elements) {
				_elements[elNum].lock();
			}
		}
	}

	// MOVE
	if(
		typeof data.move      != "undefined" &&
		typeof data.move.from != "undefined" &&
		typeof data.move.to   != "undefined" &&
		typeof data.move.deck != "undefined"
	) {

		if(data.move.stepType) {
			if(typeof data.move.stepType == "string") {
				share.set('stepType', data.move.stepType);
			}
			if(typeof data.move.stepType.undo == "string") {
				share.set('stepType', data.move.stepType.undo);
			}
		}

		forceMove({
			from : data.move.to,   // from ->
			to   : data.move.from, //      <- to
			deck : data.move.deck,
			flip : data.move.flip
		});
	}

};

event.listen('undo', function(_a) {

	// elRender.animationsEnd();
	event.dispatch('stopAnimations');
	
	if(!_a) {
		return;
	};

	// Обратная совместимость
	if(_a instanceof Array) {

		_a.reverse();
		
		for(let _i in _a) {
			let data = _a[_i];
			_undo(data);
		}
		
	} else {
		
		_undo(_a);
		
	}

	Tips.checkTips();

});

// ---------------------------------------- REDO ----------------------------------------

let _redo = (data) => {

	// for(let i in _redoMethods) {
	// 	_redoMethods[i](data);
	// }

	// if(data.flip) {
	// };
	
	// if(data.full) {
	// 	// TODO
	// };

	// LOCK
	if(
		typeof data.lock != "undefined"
	) {
		// Deck.Deck(data.lock).lock();
		for(let i in data.lock) {
			let _elements = common.getElementsByName(data.lock[i]);
			for(let elNum in _elements) {
				_elements[elNum].lock();
			}
		}
	}

	if(
		typeof data.unlock != "undefined"
	) {
		// Deck.Deck(data.unlock).unlock();
		for(let i in data.unlock) {
			let _elements = common.getElementsByName(data.lock[i]);
			for(let elNum in _elements) {
				_elements[elNum].unlock();
			}
		}
	}

	// MOVE
	if(
		typeof data.move      != "undefined" &&
		typeof data.move.from != "undefined" &&
		typeof data.move.to   != "undefined" &&
		typeof data.move.deck != "undefined"
	) {

		if(data.move.stepType) {
			if(typeof data.move.stepType == "string") {
				share.set('stepType', data.move.stepType);
			}
			if(typeof data.move.stepType.redo == "string") {
				share.set('stepType', data.move.stepType.redo);
			}
		}

		forceMove(data.move);
	}

	if(
		data.redo                            &&
		typeof data.redo.stepType == "string"
	) {
		share.set('stepType', data.redo.stepType);
	}
};

event.listen('redo', function(_a) {

	// elRender.animationsEnd();
	event.dispatch('stopAnimations');
	

	if(!_a) {
		return;
	}

	// Обратная совместимость
	if(_a instanceof Array) {
		_a.reverse();
		for(let _i in _a) {
			let data = _a[_i];
			_redo(data);
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

		// for(let i in step) {
		this.steps.push(step);
		// }
	}

	// get steps and reset
	get(reset = true) {

		let _req = this.steps;
		
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

	// addUndoMethods(data) {
	// 	for(let i in data) {
	// 		_undoMethods[i] = data[i];
	// 	}
	// }
	
	// addRedoMethods(data) {
	// 	for(let i in data) {
	// 		_redoMethods[i] = data[i];
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
