'use strict';

import event         from 'event'        ;
import share         from 'share'        ;
import common        from 'common'       ;
import defaults      from 'defaults'     ;

import undo          from 'undo'         ;
import redo          from 'redo'         ;
import historyCommon from 'historyCommon';

/*
 * reset
 * add
 * get
 * count
 */

class historyClass {

	constructor() {

		this.steps = [];

		this._debugData = [];
	}

	reset() {

		// console.log('History:clear');
		this._debugData.push(this.steps);

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

			// console.groupCollapsed('History:get(reset)', _req.length);
			// console.log('%c' + JSON.stringify(_req, true, 2), 'background: #e0edfa;width: 100%;');
			// console.groupEnd();

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

	_debugLod() {
		return this._debugData;
	}
}

let history = new historyClass();

export default history;
