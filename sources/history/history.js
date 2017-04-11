'use strict';

import event        from 'event'       ;
import share        from 'share'       ;
import common       from 'common'      ;
import defaults     from 'defaults'    ;

import undo         from 'undo'        ;
import redo         from 'redo'        ;
import redoAdvanced from 'redoAdvanced';

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

// let historyStack = [];

/*
 * reset
 * add
 * get
 * count
 */

class historyClass {

	constructor() {

		this.steps = [];
	}

	reset() {

		// console.log('History:clear');

		this.steps = [];
	}

	add(step) {

		console.log('History:add', step);

		this.steps.push(step);
	}

	// get steps and reset
	get(reset = true) {

		let _req = this.steps;

		if(reset) {
			this.reset(true);
		}

		console.log('History:get', _req);

		// for(let line of _req) {
		// 	for(let name in line) {
		// 		console.log('History:get', name, line[name]);
		// 	}
		// }

		return _req;
	}

	count() {
		return this.steps.length;
	}

	// TODO
	zip() {
		// 
	}

	unzip(data) {
		// 
	}
}

let history = new historyClass();

// events

event.listen('addStep', data => {

	if(data.debug) {
		delete data.debug;
	}

	history.add(data)
});

share.set('saveHistory', true);

// save steps to client history
event.listen('saveSteps', e => {

	let data = history.get();

	if(data.length) {
		event.dispatch('makeStep', data);
	} else {
		console.warn('Empty history to save.');
	}
});

event.listen('doHistory', e => {

	if(!share.get('saveHistory')) {
		return;
	}

	// common.animationOff();
	share.set('saveHistory', false);

	for(let i in e.data) {

		event.dispatch('redo', e.data[i]);

		if(
			!redoAdvanced.handle(e.data[i]) &&
			typeof e.callback == 'function'
		) {
			e.callback(e.data[i]);
		}
	}

	share.set('saveHistory', true);

	// common.animationOn();
});

event.listen('resetHistory', e => {
	history.reset();
});

event.listen('newGame', e => {
	history.reset();
});

export default history;