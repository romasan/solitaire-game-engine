'use strict';

import event          from 'event';
import share          from 'share';
import defaults       from 'defaults';
import common         from 'common';

import Deck           from 'deck';
import groupFill      from 'groupFill';
import groupRedraw    from 'groupRedraw';
import groupGenerator from 'groupGenerator';

const params = {
	"paddingType"  : {type : "any"}                    ,
	"flip"         : {type : "any"}                    ,
	"showSlot"     : {type : "any"}                    ,
	"takeRules"    : {type : "any"}                    ,
	"putRules"     : {type : "any"}                    ,
	"fillRule"     : {type : "any"}                    ,
	"autoHide"     : {type : "any"}                    ,
	"paddingX"     : {type : "any"}                    ,
	"paddingY"     : {type : "any"}                    ,
	"flipPaddingX" : {type : "any"}                    ,
	"flipPaddingY" : {type : "any"}                    ,
	"actions"      : {type : "any"}                    ,
	"save"         : {type : "boolean", default : true}
	// "longStep"     : {type : "boolean", default : false}
};

class groupClass {
	
	constructor(a, _id) {
		
		this.type = 'group';
		
		this.id = _id

		this.name = a.name && typeof a.name == 'string' 
			? a.name 
			: ('name_' + _id);
		
		this.position = {
			x : a.position && a.position.x && typeof a.position.x == 'number' 
				? a.position.x 
				: 0,
			y : a.position && a.position.y && typeof a.position.y == 'number' 
				? a.position.y 
				: 0,
		};

		this.placement = a.placement 
			? {
				x : a.placement.x 
					? a.placement.x 
					: 0, 
				y : a.placement.y 
					? a.placement.y 
					: 0
			} 
			: null

		this.decks = {};
		
		// сохраняем атрибуты чтобы прокинуть их колодам
		this.parameters = {};
		for(let paramName in params) {
			if(params[paramName].type == "any") {
				this.parameters[paramName] = a[paramName] ? a[paramName] : defaults[paramName];
			} else if(params[paramName].type == "boolean") {
				this.parameters[paramName] = typeof a[paramName] == "boolean" ? a[paramName] : params[paramName].default;
				// this.parameters[paramName] = typeof a[paramName] == "boolean" ? a[paramName] : defaults[paramName];
			}
		};
		
		this.deckIndex = [];

	}

// --------------------------------------------------------------------

	// Add deck to group
	addDeck(a) {

		if(!a) {
			return;
		}
		
		if(!a.position) {
			a.position = {
				'x' : 0, 
				'y' : 0
			};
		}

		// сортировка элементов в группе по заданному индексу и порядку добавления
		
		// if(!a.position.x) { a.position.x = 0; }
		// if(!a.position.y) { a.position.y = 0; }

		if(!a.parent) {
			a.parent = this.name;
		}
		
		a.parentPosition = {
			x : this.position.x, 
			y : this.position.y
		};
		
		// расставляем колоды в группе
		// 1 приоретет отдаётся параметру groupIndex
		// остальные вставляются в промежутки или добавляются в конец
		var _index = 0;
		
		if( a.groupIndex 
		 && typeof a.groupIndex == 'number' 
		 && this.deckIndex[a.groupIndex - 1] 
		 && decks[ this.deckIndex[a.groupIndex - 1] ].this.deckIndex == a.this.deckIndex
		) {
			console.warn('Warning: duplicate groupIndex', a.groupIndex, 'changed to null');
			a.groupIndex = null;
		}

		if(a.groupIndex && typeof a.groupIndex == 'number') {

			if(this.deckIndex[a.groupIndex - 1]) {
				
				for(;typeof this.deckIndex[_index] != 'undefined';_index += 1) {}
				
				if(placement) {
					var _index    = this.deckIndex[a.groupIndex - 1];
					var _elements = share.get('elements');
					if(placement.x) {
						_elements[_index].x( this.position.x + (placement.x + defaults.card.width) * _index );
					}
					if(placement.y) {
						_elements[_index].y( this.position.y + (placement.y + defaults.card.width) * _index );
					}
					share.set('elements', _elements);
				}

				this.deckIndex[_index] = this.deckIndex[a.groupIndex - 1];
				this.deckIndex[a.groupIndex - 1] = true;
				_index = a.groupIndex - 1
			} else {
				
				this.deckIndex[a.groupIndex - 1] = true;
				_index = a.groupIndex - 1
			}

		} else {
			for(;typeof this.deckIndex[_index] != 'undefined';_index += 1) {};
			this.deckIndex[_index] = true;
		}
		
		// смещаем координаты колод относиткльно координад группы
		if(this.placement) {


			if(this.placement.x) {
				a.position.x = (this.placement.x + defaults.card.width)  * (_index);
			}
			if(this.placement.y) {
				a.position.y = (this.placement.y + defaults.card.height) * (_index);
			}
		}

		// прокидываем некоторые атрибуты всем колодам группы (у атрибутов заданных колоде приоритет выше)
		for(let paramName in params) {
			
			if(params[paramName].type == "any") {
				if(
					this.parameters[paramName]        &&
					typeof a[paramName] == "undefined"
				) {
					a[paramName] = this.parameters[paramName];
				};
			} else if(params[paramName].type == "boolean") {
				// if(
				//	typeof this.parameters[paramName] != "undefined" &&
				//	typeof a[paramName] == "undefined"
				// ) {
				a[paramName] = this.parameters[paramName];
				// }			
			}
		};

		var _el = Deck.addDeck(a);
		
		this.deckIndex[_index]  = _el.id;
		this.decks[_el.id] = _el;
	}

	// Fill group
	Fill(cardNames) {
		groupFill.call(this, cardNames);
	}

	getDeckById(id) {
		return this.decks[id];
	}

	getDecksByName(name) {
		var _decks = {};
		for(let d in this.decks) {
			if(this.decks[d].name == name) {
				_decks[d] = decks[d];
			}
		}
		return _decks;
	}

	// Get decks from group
	getDecks(a) {
		var _decks = [];
		for(let i in this.decks) {
			if(a && a.visible) {
				if(this.decks[i].visible) {
					_decks.push(this.decks[i]);
				}
			} else {
				_decks.push(this.decks[i]);
			}
		}
		return _decks;
	}

	// Redraw group
	Redraw(_a) {
		groupRedraw.call(this, _a);
	}

	hasDeck(deckName) {
		let has = false;
		for(let deckId in decks) {
			if(decks[deckId].name == deckName) {
				has = true;
			}
		}
		return has;
	}

}

// -----------------------------------------------------------------------------------------------------------------------

var addGroup = function(a) {

	if(!a) {
		return false;
	}
	
	var _id = 'group_' + common.genId();
	
	var _el_group = new groupClass(a, _id);

	if(a.decks) {
		
		if(typeof a.decks == 'number') {
			a.decks = {
				"generator" : {
					"type"  : "count",
					"count" : a.decks
				}
			};
		};
		
		if(a.decks.generator) {
			
			if(a.decks.generator.type) {
				
				if(groupGenerator[a.decks.generator.type]) {
				
					a.decks = groupGenerator[a.decks.generator.type].call(_el_group, a.decks.generator);
				} else {
					console.warn('Deck generator type "' + a.decks.generator.type + '" not found.');
					return;
				}
			} else {
				console.warn('Deck generator type is null.');
				return;
			};

			a.placement = null;

		};

		// relations TO <-> FROM
		// if( a.backRelations ) TODO
		for(let to in a.decks) {

			for(let relId in a.decks[to].relations) {

				let _relation = null;
				try {
					_relation = Object.assign({}, a.decks[to].relations[relId]);
				} catch(e) {
					_relation = a.decks[to].relations[relId];
				}

				for(let from in a.decks) {
					
					if(a.decks[from].name == _relation.to) {
						_relation.to = null;
						_relation.from = a.decks[to].name;
						a.decks[from].relations.push(_relation)
					}
				}
			}
		}

		for(let d in a.decks) {
			_el_group.addDeck(a.decks[d]);
		};
	};

	var _elements = share.get('elements');
	_elements[_id] = _el_group;
	share.set('elements', _elements);
	
	// fill group
	if(a && a.fill) {

		var _checkFillDeck = a.fill.length;
		if(_checkFillDeck) {
			_el_group.Fill(a.fill);
		}
	}

	return _el_group;
};

var getGroup = function(name) {
	return common.getElementsByName(name, 'group')[0];
};
	
export default {
	addGroup,
	getGroup
};
