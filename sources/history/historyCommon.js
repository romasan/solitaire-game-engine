'use strict'

import event        from 'event'       ;
import common       from 'common'      ;

import history      from 'history'     ;
import redoAdvanced from 'redoAdvanced';

/*
 * Events:
 *
 * addStep
 * saveSteps
 * doHistory
 * resetHistory
 * newGame
 */

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

// events

event.listen('addStep', data => {

	// if(data.debug) {
	// 	delete data.debug;
	// }

	history.add(data);
});

// save steps to client history
event.listen('saveSteps', e => {

	let data = history.get();

	console.groupCollapsed('%c### saveSteps', 'font-weight: bold; color: green;');
	console.log('%c' + JSON.stringify(data, true, 2), 'background: #cceacc;');
	console.groupEnd();

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

	console.groupCollapsed('DO HISTORY');

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

	console.groupEnd();
});

event.listen('resetHistory', e => {
	history.reset();
});

event.listen('newGame', e => {
	history.reset();
});
