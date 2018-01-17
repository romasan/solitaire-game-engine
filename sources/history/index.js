'use strict';

import event         from '../common/event'   ;
import share         from '../common/share'   ;
import defaults      from '../common/defaults';
import common        from '../common'         ;

import undo          from './undo'            ;
import redo          from './redo'            ;
import historyCommon from './historyCommon'   ;

const DECK_NAME = "DECK_NAME",
	  OBJ_NAME  = "OBJ_NAME" ,
	  BOOL      = "BOOL"     ,
	  AS_IT_IS  = "AS_IT_IS" ;

const SHEME_D_I_C = {
	"deckName" : {
		"key" : "D",
		"value" : DECK_NAME
	},
	"cardIndex" : {
		"key" : "I",
		"value" : AS_IT_IS
	},
	"cardName" : {
		"key" : "C",
		"value" : AS_IT_IS
	}
};

const stepTypes = {

	"flip"        : { // {flip : {cardName : "h9", cardIndex: 3, deckName: "deck_name"} -> "fD12I3Ch9;"
		"key" : "f",
		"values" : SHEME_D_I_C
	},

	"unflip"      : {
		"key" : "u",
		"values" : SHEME_D_I_C
	},

	"show"        : {
		"key" : "s",
		"values" : SHEME_D_I_C
	},

	"hide"        : {
		"key" : "h",
		"values" : SHEME_D_I_C
	},

	"lock"        : {
		"key" : "l",
		"value" : OBJ_NAME // TODO
	},

	"unlock"      : {
		"key" : "n",
		"value" : OBJ_NAME
	},

	"swap"        : {
		"key" : "w",
		"values" : {
			"deckName"  : {
				"key" : null,
				"value" : DECK_NAME
			},
			"fromIndex" : {
				"key" : null,
				"value" : AS_IT_IS
			},
			"toIndex"   : {
				"key" : null,
				"value" : AS_IT_IS
			}
		}
	},

	"move"        : {
		"key" : "m",
		"values" : {
			"from" : {
				"key" : null,
				"value" : null
			},
			"to" : {
				"key" : null,
				"value" : null
			},
			"deck" : {
				"key" : null,
				"value" : null
			},
			"flip" : {
				"key" : null,
				"value" : null
			},
			"stepType" : {
				"key" : "t",
				"value" : AS_IT_IS
			}
		}
	},

	"markCard"    : {
		"key" : "r",
		"values" : SHEME_D_I_C
	},

	"unmarkCard"  : {
		"key" : "a",
		"values" : SHEME_D_I_C
	},

	"setStepType" : {
		"key" : "t",
		"value" : AS_IT_IS
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
		console.groupCollapsed('history:get');
		console.log( JSON.stringify(this.steps, true, 2) );
		console.groupEnd();
		
		if (share.get('zipHistory')) {
			this.zip();
		}
		
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

	_zipParse(key, data, path) {

		console.log('parse:', key, data, path);

		if (
			typeof key  == "undefined" ||
			typeof data == "undefined" ||
			typeof path == "undefined"
		) {
			return "";
		}

		let line = "";

		if (path.key) {
			line += path.key;
		} else {
			return "";
		}

		if (path.values) {
			for (let _key in path.values) {
				line += this._zipParse(_key, data[_key], path.values[_key]);
			}
		}

		if (path.value) {
			if (
				path.value              &&
				path.value == DECK_NAME
			) {

				let decks = common.getElementsByType('deck').map(e => e.name);

				let deckIndex = decks.indexOf(data);

				if (deckIndex >= 0) {
					line += deckIndex;
				}
			}

			if (path.value == AS_IT_IS) {
				line += data;
			}
		}

		return line;
	}

	zip() {

		console.log('zip:', this.steps);

		for (let stepIndex in this.steps) {

			for (let key in this.steps[stepIndex].step) {

				if (stepTypes[key]) {

					console.log('zip key:', key);

					this.steps[stepIndex].step = this._zipParse(
						key                            ,
						this.steps[stepIndex].step[key],
						stepTypes[key]
					);
				}
 			}
		}
	}

	unzip(data) {
		// 
	}
}

let history = new historyClass();

export default history;
