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

event.listen('addStep', data => {

	if(data.step) {

		let stepId = history.add(data.step);

		if(typeof data.callback == "function") {
			data.callback(stepId);
		}
	} else {
		history.add(data);
	}
});

// save steps to client history
event.listen('saveSteps', e => {

	let data = history.get();

	// console.groupCollapsed('%c### saveSteps', 'font-weight: bold; color: green;');
	// console.log('%c' + JSON.stringify(data, true, 2), 'background: #cceacc;');
	// console.groupEnd();

	if(data.length) {
		event.dispatch('makeStep', data);
	} else {
		console.warn('Empty history to save.');
	}
});

event.listen('doHistory', e => {

	// console.groupCollapsed('DO HISTORY');

	// common.animationOff();
	if(!e || !e.data) {
		console.warn('doHistory data:', e);
	}

	common.animationOff();

	for(let i in e.data) {
	
		event.dispatch('redo', e.data[i]);

		if(
			!redoAdvanced.handle(e.data[i][0]) &&
			typeof e.callback == 'function'
		) {
			e.callback(e.data[i]);	
		}
	}

	common.animationDefault();

	event.dispatch('stopRunHistory');

	// console.groupEnd();
});

event.listen('resetHistory', e => {
	history.reset();
});

event.listen('deleteHistory', steps => {
	history.delete(steps);
});

event.listen('newGame', e => {
	history.reset();
});
