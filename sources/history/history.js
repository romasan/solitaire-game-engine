'use strict';

import event        from 'event'       ;
import share        from 'share'       ;
import common       from 'common'      ;
import stateManager from 'stateManager';

import forceMove    from 'forceMove'   ;
import Deck         from 'deck'        ;
import Tips         from 'tips'        ;
import field        from 'field'       ;
import inputs       from 'inputs'      ;

// TODO пошаговая анимация
// let _movesCallback = e => {
// 	if(_movesStack.length) {
// 		_movesStack.shift()();
// 	} else {
// 		// 
// 	}
// };
// let _movesStack = [];

// let _stepsCallback = e => {
// 	if(_stepsStack.length) {
// 		_stepsStack.shift()();
// 	} else {
// 		// 
// 	}
// };
// let _stepsStack = [];

// undo

let historyStack = [];

let _undo = data => {

	if(share.get('sessionStarted')) {
		// _undoMoveStack = [];
		event.dispatch('stopAnimations');
		stateManager.restore();
	}

	// FLIP
	// if(data.flip) {};

	// UNFLIP
	// if(data.unflip) {};

	// FULL
	// if(data.full) {};

	// LOCK
	if(
		typeof data.lock != 'undefined'
	) {
		for(let i in data.lock) {
			let _element = common.getElementsByName(data.lock[i])[0];
			_element.unlock();
		}
	}

	// UNLOCK
	if(
		typeof data.unlock != 'undefined'
	) {
		for(let i in data.unlock) {
			let _element = common.getElementsByName(data.unlock[i])[0];
			_element.lock();
		}
	}

	// MOVE
	if(
		typeof data.move      != 'undefined' &&
		typeof data.move.from != 'undefined' &&
		typeof data.move.to   != 'undefined' &&
		typeof data.move.deck != 'undefined'
	) {

		// TODO
		let movesAnimation = share.get('movesAnimation');

		if(data.move.stepType) {

			if(typeof data.move.stepType == 'string') {
				share.set('stepType', data.move.stepType);
			}

			if(typeof data.move.stepType.undo == 'string') {
				share.set('stepType', data.move.stepType.undo);
			}
		}

		// TODO
		// _movesStack.push(e => {

		let forceMoveData = {
			"from" : data.move.to  , // from ->
			"to"   : data.move.from, //      <- to
			"deck" : data.move.deck,
			"flip" : data.move.flip,
		};

		if(!share.get('showHistoryAnimation')) {

			common.animationOff();

			forceMoveData.callback = e => {
				common.animationOn();
			};
		}
		// forceMoveData.callback = _movesCallback
		forceMove(forceMoveData);

		// });

		// if(_movesStack.length == 1) {
			// _movesStack.shift()();
		// }
	}
};

event.listen('undo', undoData => {

	// common.animationOff();
	// event.dispatch('moveCardToHome', {});
	// common.animationOn();

	console.log('undo:', undoData);

	if(!undoData) {
		return;
	};

	// let e = undoData.length ? undoData[undoData.length - 1] : undoData;
	// if(e.move) {
	// 	// TODO
	// }

	inputs.break();

	_history.reset();

	event.dispatch('stopAnimations');


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

// redo

let _redo = data => {

	if(share.get('sessionStarted')) {
		// _undoMoveStack = [];
		event.dispatch('stopAnimations');
		stateManager.restore();
	}

	// FLIP
	// if(data.flip) {};

	// UNFLIP
	// if(data.unflip) {};
	
	// FULL
	// if(data.full) {};

	// LOCK
	if(
		typeof data.lock != 'undefined'
	) {
		for(let i in data.lock) {
			let _element = common.getElementsByName(data.lock[i])[0];
			_element.lock();
		}
	}

	// UNLOCK
	if(
		typeof data.unlock != 'undefined'
	) {
		for(let i in data.unlock) {
			let _element = common.getElementsByName(data.unlock[i])[0];
			_element.unlock();
		}
	}

	// MOVE
	if(
		typeof data.move      != 'undefined' &&
		typeof data.move.from != 'undefined' &&
		typeof data.move.to   != 'undefined' &&
		typeof data.move.deck != 'undefined'
	) {

		if(data.move.stepType) {

			if(typeof data.move.stepType == 'string') {
				share.set('stepType', data.move.stepType);
			}

			if(typeof data.move.stepType.redo == 'string') {
				share.set('stepType', data.move.stepType.redo);
			}
		}

		let forceMoveData = {
			"from" : data.move.from,
			"to"   : data.move.to  ,
			"deck" : data.move.deck,
			"flip" : data.move.flip,
		};

		if(!share.get('showHistoryAnimation')) {

			common.animationOff();

			forceMoveData.callback = e => {
				common.animationOn();
			};
		}

		forceMove(forceMoveData);
	}

	if(
		data.redo                            &&
		typeof data.redo.stepType == 'string'
	) {
		share.set('stepType', data.redo.stepType);
	}
};

event.listen('redo', redoData => {

	inputs.break();

	_history.reset();

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

// history

class history {

	constructor() {

		this.steps = [];
	}

	reset(interior) {
		this.steps = [];
		if(!interior) {
			event.dispatch('debugFlag', {flag : 1, color : 'blue', text : 'h:reset'});
		}
	}

	add(step) {

		// console.log(
		// 	'history add:'                                             ,
		// 	step && step.move && step.move.from ? step.move.from : step,
		// 	'->'                                                       ,
		// 	step && step.move && step.move.to   ? step.move.to   : step
		// );

		// for(let i in step) {
		this.steps.push(step);
		event.dispatch('debugFlag', {flag : 1, color : 'red', text : 'h:add' + this.steps.length});
		// }
	}

	// get steps and reset
	get(reset = true) {

		let _req = this.steps;
		// console.log('history get:', _req);

		if(reset) {
			this.reset(true);
		}
		event.dispatch('debugFlag', {flag : 1, color : 'green', text : 'h:get'});

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
	let data = _history.get();
	if(data.length) {
		event.dispatch('makeStep', data);
	} else {
		console.warn('Empty history to save.');
	}
});

export default _history;