'use strict';

import event          from 'event';
import share          from 'share';
import defaults       from 'defaults';
import common         from 'common';

import Deck           from 'addDeck';
import groupFill      from 'groupFill';
import groupRedraw    from 'groupRedraw';
import groupGenerator from 'groupGenerator';

class groupClass {
	
	constructor(a, _id) {
		
		this.type = 'group';
		
		var id = _id;
		
		this.getId = function() {
			return id;
		}

		this.name = a.name && typeof a.name == 'string' 
			? a.name 
			: ('name_' + id);
		
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
		this.parameters = {
			paddingType  : a.paddingType  ? a.paddingType  : defaults.paddingType  ,
			flip         : a.flip         ? a.flip         : null                  ,
			// take         : a.take         ? a.take         : null               ,// ???
			showSlot     : a.showSlot     ? a.showSlot     : defaults.showSlot     ,
			takeRules    : a.takeRules    ? a.takeRules    : defaults.takeRules    ,
			putRules     : a.putRules     ? a.putRules     : defaults.putRules     ,
			fillRule     : a.fillRule     ? a.fillRule     : defaults.fillRule     ,
			autoHide     : a.autoHide     ? a.autoHide     : defaults.autoHide     ,
			
			paddingX     : a.paddingX     ? a.paddingX     : defaults.paddingX     ,
			paddingY     : a.paddingY     ? a.paddingY     : defaults.paddingY     ,
			flipPaddingX : a.flipPaddingX ? a.flipPaddingX : defaults.flipPaddingX ,
			flipPaddingY : a.flipPaddingY ? a.flipPaddingY : defaults.flipPaddingY ,
			
			actions      : a.actions      ? a.actions      : null                  ,
			
			afterStep    : (typeof a.afterStep == "boolean" ? a.afterStep : defaults.afterStep)
		};
		
		// console.log('AFTERSTEP#1', this.name, typeof a.afterStep, a.afterStep, defaults.afterStep, this.parameters.afterStep)

		this.deckIndex = [];

	}

// --------------------------------------------------------------------

	// Add deck to group
	addDeck(a) {

		if(!a) return;
		if(!a.position) {
			a.position = {
				'x' : 0, 
				'y' : 0
			};
		}

		// сортировка элементов в группе по заданному индексу и порядку добавления

		
		// if(!a.position.x) { a.position.x = 0; }
		// if(!a.position.y) { a.position.y = 0; }

		if(!a.parent) a.parent = this.name;
		
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
			// console.log('РАССТАВКА КОЛОД', this.deckIndex);
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
		if( this.parameters.paddingType  && typeof a.paddingType  == "undefined" ) { a.paddingType  = this.parameters.paddingType;  };
		if( this.parameters.flip         && typeof a.flip         == "undefined" ) { a.flip         = this.parameters.flip;         };
		// if( this.parameters.take      && typeof a.take         == "undefined" ) { a.take         = this.parameters.take;         };
		if( this.parameters.showSlot     && typeof a.showSlot     == "undefined" ) { a.showSlot     = this.parameters.showSlot;     };
		if( this.parameters.takeRules    && typeof a.takeRules    == "undefined" ) { a.takeRules    = this.parameters.takeRules;    };
		if( this.parameters.putRules     && typeof a.putRules     == "undefined" ) { a.putRules     = this.parameters.putRules;     };
		if( this.parameters.fillRule     && typeof a.fillRule     == "undefined" ) { a.fillRule     = this.parameters.fillRule;     };
		if( this.parameters.autoHide     && typeof a.autoHide     == "undefined" ) { a.autoHide     = this.parameters.autoHide;     };
		// changed
		if( this.parameters.paddingX     && typeof a.paddingX     == "undefined" ) { a.paddingX     = this.parameters.paddingX;     };
		if( this.parameters.paddingY     && typeof a.paddingY     == "undefined" ) { a.paddingY     = this.parameters.paddingY;     };
		if( this.parameters.flipPaddingX && typeof a.flipPaddingX == "undefined" ) { a.flipPaddingX = this.parameters.flipPaddingX; };
		if( this.parameters.flipPaddingY && typeof a.flipPaddingY == "undefined" ) { a.flipPaddingY = this.parameters.flipPaddingY; };
		
		if( this.parameters.actions      && typeof a.actions      == "undefined" ) { a.actions      = this.parameters.actions;      };
		
		if( typeof a.afterStep == "undefined" ) {
			a.afterStep = this.parameters.afterStep;
		};

		// console.log('AFTERSTEP#2', this.name, a.afterStep, this.parameters.afterStep)
		
		// console.log('%cGroup:addDeck->', 'background : red', this.name, a);

		var _el = Deck.addDeck(a);
		
		this.deckIndex[_index]  = _el.getId();
		this.decks[_el.getId()] = _el;
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
		for(var d in this.decks) {
			if(this.decks[d].name == name) {
				_decks[d] = decks[d];
			}
		}
		return _decks;
	}

	// Get decks from group
	getDecks(a) {
		var _decks = [];
		for(var i in this.decks) {
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

}

// -----------------------------------------------------------------------------------------------------------------------

var addGroup = function(a) {

	if(!a) return false;
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
				
					console.log('>>>', groupGenerator[a.decks.generator.type], '---', _el_group, '---', a, '<<<');
					
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

		// TODO ADD RELATIONS
		console.log('BEFORE ADD RELATIONS', a.decks, a.decks.length)

		for(var d in a.decks) {
			_el_group.addDeck(a.decks[d]);
		};
	};

	if(a.decksRelations) {
		
		for(var i in a.decksRelations) {
			// TODO
			console.log('Relation', a.decksRelations[i]);
		}

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

var Group = function(name) {
	return common.getElementsByName(name, 'group')[0];
};
	
export default {
	addGroup,
	Group
};
