'use strict';

import event         from '../common/event'   ;
import share         from '../common/share'   ;
import defaults      from '../common/defaults';
import common        from '../common'         ;

import undo          from './undo'            ;
import redo          from './redo'            ;
import historyCommon from './historyCommon'   ;

const DECK_NAME = "DECK_NAME", // index of deck
//    OBJ_NAME  = "OBJ_NAME" ,
	  CARD_LIST = "CARD_LIST", // c1-h2-d3
	  BOOL      = "BOOL"     , // 1 - true, 0 - false
	  STEP_TYPE = "STEP_TYPE", // "step_type" | "step_type+step_type" 
	  AS_IT_IS  = "AS_IT_IS" ; // string | number

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

const SHEMES = {

	"flip"        : { // {flip : {cardName : "h9", cardIndex: 3, deckName: "deck_name"} -> "fD12I3Ch9;" (fD:12I:3C:h9)
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

	// "lock"        : {
	// 	"key" : "l",
	// 	"value" : OBJ_NAME
	// },

	// "unlock"      : {
	// 	"key" : "n",
	// 	"value" : OBJ_NAME
	// },

	"swap"        : {
		"key" : "w",
		"values" : {
			"deckName"  : {
				"key" : "D",
				"value" : DECK_NAME
			},
			"fromIndex" : {
				"key" : "F",
				"value" : AS_IT_IS
			},
			"toIndex"   : {
				"key" : "T",
				"value" : AS_IT_IS
			}
		}
	},

	"move"        : {
		"key" : "m",
		"values" : {
			"from" : {
				"key" : "F",
				"value" : DECK_NAME
			},
			"to" : {
				"key" : "T",
				"value" : DECK_NAME
			},
			"deck" : {
				"key" : "D",
				"value" : CARD_LIST
			},
			"flip" : {
				"key" : "L",
				"value" : BOOL
			},
			"stepType" : {
				"key" : "t",
				"value" : STEP_TYPE
			},
			"context" : {
				"key" : "x",
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
	get(reset = true, unzip = false) {

		if (unzip) {
			this.unzip();
		}

		// console.warn('history:get;', 'reset:', reset);
		// console.groupCollapsed('history:get');
		// console.log( JSON.stringify(this.steps, true, 2) );
		// console.groupEnd();
		
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

	_zipMinify(key, data, path) {

		// console.log('parse:', key, data, path);

		if (
			typeof key  == "undefined" ||
			typeof data == "undefined" ||
			typeof path == "undefined"
		) {
			return "";
		}

		let line = "";

		if (path.key) {
			line += path.key + ':';
		} else {
			return "";
		}

		if (path.values) {
			for (let _key in path.values) {
				line += this._zipMinify(_key, data[_key], path.values[_key]);
			}
		}

		if (path.value) {

			if (path.value == DECK_NAME) {

				let decks = common.getElementsByType('deck').map(e => e.name);

				let deckIndex = decks.indexOf(data);

				if (deckIndex >= 0) {
					line += deckIndex;
				}
			}

			if (path.value == CARD_LIST) {
				line += data.join('-');
			}

			if (path.value == BOOL) {
				line += data == true ? 1 : 0;
			}

			if (path.value == STEP_TYPE) {

				let undo = "",
				    redo = "";

				if (typeof data.undo == "string") {
					undo = data.undo;
				}

				if (typeof data.redo == "string") {
					redo = data.redo;
				}

				line += typeof data == "string" ? data : undo + '+' + redo;
			}

			if (path.value == AS_IT_IS) {
				line += data;
			}
		}

		return line;
	}

	zip() {

		// console.log('zip:', this.steps);

		for (let stepIndex in this.steps) {

			for (let key in this.steps[stepIndex].step) {

				if (SHEMES[key]) {

					// console.log('zip key:', key);

					this.steps[stepIndex].step = this._zipMinify(
						key                            ,
						this.steps[stepIndex].step[key],
						SHEMES[key]
					);
				}
 			}
		}
	}

	_zipParse(data) {

		// console.log('--zipParse:', JSON.stringify(data), typeof data);

		if (typeof data != "string") {
			return data;
		}

		if (!this._keys_cache) {

			this._keys_cache = {
				short_keys : [],
				keys : []
			};

			for(let name in SHEMES) {
				this._keys_cache.short_keys.push(SHEMES[name].key);
				this._keys_cache.keys.push(name);
			}
		} 

		const index = this._keys_cache.short_keys.indexOf(data[0]);

		// console.log('zipParse', index, data[0]);

		if (index >= 0) {

			const shemeName = this._keys_cache.keys[index];
			const sheme = SHEMES[shemeName];

			let keys = [];

			for (let key in sheme.values) {

				const shortKey = sheme.values[key].key;

				keys.push({
					"key"   : shortKey                    ,
					"name"  : key                         ,
					"index" : data.indexOf(shortKey + ':'),
					"type"  : sheme.values[key].value
				});
			}

			// console.log('#', JSON.stringify(keys, true, 2));

			keys.sort((a, b) => (a.index > b.index ? 1 : -1));
			keys = keys.filter(e => e.index >= 0);

			let _data = {};

			let decks = null;

			// console.log('>', keys);

			for (let i in keys) {

				let start = keys[i].index + keys[i].key.length + 1                         ,
					end   = ((i < keys.length - 1) ? keys[(i | 0) + 1].index : data.length),
					line  = data.slice(start, end)                                         ;

				// console.log('###', keys[i].name, keys[i].key, keys[i].type, line, start, end, i, keys.length, data.length, i < keys.length - 1, (i | 0) + 1);

				if (keys[i].type == DECK_NAME) {

					if (!decks) {
						decks = common.getElementsByType('deck').map(e => e.name);
					}

					_data[keys[i].name] = decks[line];
				}

				if (keys[i].type == CARD_LIST) {
					_data[keys[i].name] = line.split('-');
				}

				if (keys[i].type == BOOL) {
					_data[keys[i].name] = line == "1" ? true : false;
				}

				if (keys[i].type == STEP_TYPE) {

					let _line = line.split('+');

					if ( _line.length == 1 ) {
						_data[keys[i].name] = line;
					} else {

						let stepType = {};

						if (_line[0].length) {
							stepType.undo = _line[0];
						}

						if (_line[1].length) {
							stepType.redo = _line[1];
						}

						_data[keys[i].name] = stepType;
					}
				}

				if (keys[i].type == AS_IT_IS) {
					_data[keys[i].name] = line;
				}
			}

			return {[shemeName] : _data};
		}
	}

	unzip(steps) {

		if (!steps) {
			steps = this.steps;
		}

		for (let i in steps) {
			steps[i] = this._zipParse(steps[i]);
		}

		// console.log('%cunzipped: ' + JSON.stringify(steps), 'color: blue;');

		return steps;
	}
}

let history = new historyClass();

event.listen('newGame', e => {
	history._keys_cache = null;
});

export default history;
