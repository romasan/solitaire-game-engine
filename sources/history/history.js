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

		// console.log('History:add', step);

		this.steps.push(step);
	}

	// get steps and reset
	get(reset = true) {

		let _req = this.steps;

		if(reset) {

			console.groupCollapsed('History:get(reset)', _req.length);
			console.log('%c' + JSON.stringify(_req, true, 2), 'background: #e0edfa;width: 100%;');
			console.groupEnd();

			this.reset(true);
		}

		// console.log('History:get', _req);

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

	history.add(data);
});

// save steps to client history
event.listen('saveSteps', e => {

	console.log('%c### saveSteps', 'font-weight: bold; color: green;');

	let data = history.get();

	if(data.length) {
		event.dispatch('makeStep', data);
	} else {
		// console.warn('Empty history to save.');
		throw new Error('Empty history to save.');
	}
});

// let next_history_step = function() {};
// event.listen('next_history_step', e => {next_history_step()});

event.listen('doHistory', e => {	

	// common.animationOff();
	if(!e || !e.data) {
		console.warn('doHistory data:', e);
	}

	common.animationOff();

	for(let i in e.data) {
	// console.log('### DOHISTORY', e.data.length, 'Press key "N"');
	// let i = 0;
	// let playHistory = z => {

		// console.log('DO STEP', i, 'FROM', e.data.length);

		event.dispatch('redo', e.data[i]);

		if(
			!redoAdvanced.handle(e.data[i][0]) &&
			typeof e.callback == 'function'
		) {
			e.callback(e.data[i]);
		}

		// if(i >= e.data.length - 1) {

			// common.animationDefault();

			// playHistory = null;
		// }

		// i += 1;

		// if(typeof playHistory == "function") {
			// playHistory();
			// setTimeout(playHistory, 0);
		// }
	}
	// playHistory();

	common.animationDefault();

	event.dispatch('stopRunHistory');

	// next_history_step = z => {

	// 	if(typeof playHistory == "function") {
	// 		playHistory();
	// 	}
	// }
});

event.listen('resetHistory', e => {
	history.reset();
});

event.listen('newGame', e => {
	history.reset();
});

export default history;
