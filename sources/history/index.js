'use strict';

import event         from '../common/event'   ;
import share         from '../common/share'   ;
import defaults      from '../common/defaults';
import common        from '../common'         ;

import undo          from './undo'            ;
import redo          from './redo'            ;
import historyCommon from './historyCommon'   ;

const stepTypes = {

	"flip"        : { // {flip : {cardName : "h9", cardIndex: 3, deckName: "deck_name"} -> "fD12C3h9;"
		"key" : "f",
		"values" : {
			"deck" : {
				"key" : "D"
			}
		}
	},

	"unflip"      : {
		"key" : "u"
	},

	"show"        : {
		"key" : "s"
	},

	"hide"        : {
		"key" : "h"
	},

	"lock"        : {
		"key" : "l"
	},

	"unlock"      : {
		"key" : "n"
	},

	"swap"        : {
		"key" : "w"
	},

	"move"        : {
		"key" : "m"
	},

	"markCard"    : {
		"key" : "r"
	},

	"unmarkCard"  : {
		"key" : "a"
	},

	"setStepType" : {
		"key" : "t"
	}
};

class historyClass {

	constructor() {

		this.steps = [];

		// this._debugData = [];
		this._nextId = 0;
	}

	/**
	 * Reset
	 */
	reset() {

		// console.log('History:clear');
		// this._debugData.push(this.steps);

		this.steps = [];
	}

	/**
	 * Add
	 * @param {*} step 
	 */
	add(step) { // {move || flip ... }

		if ( share.get('noSave') ) {
			// console.warn('Add step to history break. noSave mode.');
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

	/**
	 * Delete
	 * @param {*} steps 
	 */
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

	/**
	 * Get
	 * @param {boolean} reset 
	 */
	get(reset = true) {

		// console.warn('history:get;', 'reset:', reset);
		// console.groupCollapsed('data');
		// console.log( JSON.stringify(this.steps, true, 2) );
		// console.groupEnd();

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

	/**
	 * Count
	 * @returns {number}
	 */
	count() {
		return this.steps.length;
	}

	// TODO
	zip() {

		let decks = common.getElementsByType('deck');

		let f = (key, data, path) => {
			let line = "";
			if (path[key]) {
				line += path[key];
			}
			if (path[values]) {
				// line += f(null, data, path[values]);
			}
			// TODO
			return line;
		}

		for (let i in this.steps) {

			const step = this.steps[i];
			let result = [];
			for (let key in step) {
				if (stepTypes[key]) {
					result.push( f(key, step[key], stepTypes[key]) );
				}
 			}
			this.steps = result.join(';');
		}
	}

	unzip(data) {
		// 
	}
}

let history = new historyClass();

export default history;
