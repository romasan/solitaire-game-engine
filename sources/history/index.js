'use strict';

import event         from '../common/event'   ;
import share         from '../common/share'   ;
import defaults      from '../common/defaults';
import common        from '../common'         ;

import undo          from './undo'            ;
import redo          from './redo'            ;
import historyCommon from './historyCommon'   ;

/*
 * reset
 * add
 * get
 * count
 */

class historyClass {

	constructor() {

		this.steps = [];

		// this._debugData = [];
		this._nextId = 0;
	}

	reset() {

		// console.log('History:clear');
		// this._debugData.push(this.steps);

		this.steps = [];
	}

	add(step) { // {move || flip ... }

		if (share.get('noSave')) {
			return;
		}

		// console.log('History:add', step);

		this._nextId += 1;
		let stepId = this._nextId | 0;

		this.steps.push({
			"id"   : stepId,
			"step" : step
		});

		// if (share.get('inRedo')) {
		// 	console.groupCollapsed('%cHistory:add', 'color: #00ff00', stepId);
		// 	console.log(JSON.stringify(step, true, 2));
		// 	console.groupEnd();
		// }

		return stepId;
	}

	delete(steps) { // stepId || [stepId]

		// console.log('History:delete:', steps);

		if (typeof steps == "number") {
			steps = [steps];
		}

		// for (let i in steps) {
		// 	if (this.steps[steps[i]]) {
		// 		delete this.steps[steps[i]];
		// 	}
		// }

		this.steps = this.steps.filter(e => steps.indexOf(e.id) < 0);
	}

	// get steps and reset
	get(reset = true) {

		let _req = [];
		for (let i in this.steps) {
			_req.push(this.steps[i].step);
		}

		// console.groupCollapsed('History:get (reset: ' + reset + ')', _req.length);
		// console.log('%c' + JSON.stringify(_req, true, 2), 'background: #e0edfa;width: 100%;');
		// console.groupEnd();

		if (reset) {

			this.reset(true);
		}

		// console.log('History:get', _req);

		// for (let line of _req) {
		// 	for (let name in line) {
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

	// _debugLod() {
	// 	return this._debugData;
	// }
}

let history = new historyClass();

export default history;
