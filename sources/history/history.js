'use strict';

import event        from 'event';
import share        from 'share';
import common       from 'common';
import stateManager from 'stateManager';

import forceMove    from 'forceMove';
import Deck         from 'deck';
import Tips         from 'tips';
import field        from 'field';
// import elRender  from 'elRender';

// let _undoMethods = {};
// let _redoMethods = {};

let _movesCallback = e => {
	if(_undoMoveStack.length) {
		_undoMoveStack.shift()();
	} else {
		// 
	}
};

let _movesMoveStack = [];

// ---------------------------------------- UNDO ----------------------------------------
let historyStack = [];

let _undo = data => {

	if(share.get('sessionStarted')) {
		// _undoMoveStack = [];
		event.dispatch('stopAnimations');
		// stateManager.restore();
	}
	
	// FLIP
	// if(data.flip) {};
	
	// UNFLIP
	// if(data.unflip) {};
	
	// FULL
	// if(data.full) {};

	// LOCK
	if(
		typeof data.lock != "undefined"
	) {
		for(let i in data.lock) {
			let _element = common.getElementsByName(data.lock[i])[0];
			_element.unlock();
		}
	}

	// UNLOCK
	if(
		typeof data.unlock != "undefined"
	) {
		for(let i in data.unlock) {
			let _element = common.getElementsByName(data.unlock[i])[0];
			_element.lock();
		}
	}

	// MOVE
	if(
		typeof data.move      != "undefined" &&
		typeof data.move.from != "undefined" &&
		typeof data.move.to   != "undefined" &&
		typeof data.move.deck != "undefined"
	) {

		// TODO
		let movesAnimation = share.get('movesAnimation');
		
		if(data.move.stepType) {

			if(typeof data.move.stepType == "string") {
				share.set('stepType', data.move.stepType);
			}

			if(typeof data.move.stepType.undo == "string") {
				share.set('stepType', data.move.stepType.undo);
			}
		}

		_movesMoveStack.push(e => {

			let forceMoveData = {
				from     : data.move.to,   // from ->
				to       : data.move.from, //      <- to
				deck     : data.move.deck,
				flip     : data.move.flip,
			};
			forceMoveData.callback = _movesCallback
			forceMove(forceMoveData);

		});

		if(_movesMoveStack.length == 1) {
			_movesMoveStack.shift()();
		}
	}
};

event.listen('undo', undoData => {

	event.dispatch('stopAnimations');
	
	if(!undoData) {
		return;
	};

	// Обратная совместимость
	if(undoData instanceof Array) {

		undoData.reverse();
		
		for(let _i in undoData) {
			let data = undoData[_i];
			_undo(data);
		}
	} else {
		_undo(undoData);
	}

	Tips.checkTips();

});

// ---------------------------------------- REDO ----------------------------------------

let _redo = data => {

	if(share.get('sessionStarted')) {
		// _undoMoveStack = [];
		event.dispatch('stopAnimations');
		// stateManager.restore();
	}

	// FLIP
	// if(data.flip) {};

	// UNFLIP
	// if(data.unflip) {};
	
	// FULL
	// if(data.full) {};

	// LOCK
	if(
		typeof data.lock != "undefined"
	) {
		for(let i in data.lock) {
			let _element = common.getElementsByName(data.lock[i])[0];
			_element.lock();
		}
	}

	// UNLOCK
	if(
		typeof data.unlock != "undefined"
	) {
		for(let i in data.unlock) {
			let _element = common.getElementsByName(data.unlock[i])[0];
			_element.unlock();
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

event.listen('redo', redoData => {

	event.dispatch('stopAnimations');

	if(!redoData) {
		return;
	}

	// Обратная совместимость
	if(redoData instanceof Array) {
		
		redoData.reverse();
		
		for(let _i in redoData) {
			let data = redoData[_i];
			_redo(data);
		}
	} else {
		_redo(redoData);
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

event.listen('addStep', data => {
	_history.add(data)
});

// save steps to client history
event.listen('saveSteps', e => {
	event.dispatch('makeStep', _history.get());
});

export default _history;
