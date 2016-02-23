'use strict';

module.exports = function(main, share) {
	
	main.addGroup = function(a) {

		if(!a) return false;
		var _id = 'group_' + share.genId();
		var _el_group = new (function(a) {
			
			this.type = 'group';
			var id = _id;
			this.getId = function() {
				return id;
			}

			this.name = a.name && typeof a.name == 'string' ? a.name : ('name_' + id);

			var x = a.position && a.position.x && typeof a.position.x == 'number'  ? a.position.x : 0,
				y = a.position && a.position.y && typeof a.position.y == 'number'  ? a.position.y : 0,
				placement = a.placement ? {x : a.placement.x ? a.placement.x : 0, y : a.placement.y ? a.placement.y : 0} : null

			var decks = {};
			
			// сохраняем атрибуты чтобы прокинуть их колодам

			var paddingType  = a.paddingType  ? a.paddingType  : null,
				flip         = a.flip         ? a.flip         : null,
				take         = a.take         ? a.take         : null,
				showSlot     = a.showSlot     ? a.showSlot     : null,
				takeRules    = a.takeRules    ? a.takeRules    : null,
				putRules     = a.putRules     ? a.putRules     : null,
				fillRule     = a.fillRule     ? a.fillRule     : null,
				autoHide     = a.autoHide     ? a.autoHide     : null,
				paddingX     = a.paddingX     ? a.paddingX     : null,
				paddingY     = a.paddingY     ? a.paddingY     : null,
				flipPaddingX = a.flipPaddingX ? a.flipPaddingX : null,
				flipPaddingY = a.flipPaddingY ? a.flipPaddingY : null;
			
			// сортировка элементов в группе по заданному индексу и порядку добавления

			var deckIndex = [];
			// for(i in decks) deckIndex.push(null);
		
			// Add deck to group

			this.addDeck = function(a) {

				if(!a) return;
				if(!a.position) a.position = {x : 0, y : 0};
				if(!a.position.x) a.position.x = 0;
				if(!a.position.y) a.position.y = 0;

				if(!a.parent) a.parent = this.name;
				
				a.parentPosition = {x : x, y : y};
				// a.position = a.position ? {x : a.position.x + x, y : a.position.y + y} : {x : x, y : y};
				
				// расставляем колоды в группе
				// 1 приоретет отдаётся параметру groupIndex
				// остальные вставляются в промежутки или добавляются в конец
				
				var _index = 0;
				
				if(a.groupIndex && typeof a.groupIndex == 'number' && deckIndex[a.groupIndex - 1] && decks[deckIndex[a.groupIndex - 1]].deckIndex == a.deckIndex) {
					console.warn('Warning: duplicate groupIndex', a.groupIndex, 'changed to null');
					a.groupIndex = null;
				}

				if(a.groupIndex && typeof a.groupIndex == 'number') {

					if(deckIndex[a.groupIndex - 1]) {
						
						for(;typeof deckIndex[_index] != 'undefined';_index += 1) {}
						
						if(placement) {
							console.log('placement#1');
							if(placement.x) share.elements[deckIndex[a.groupIndex - 1]].x(x + (placement.x + card.width)  * _index);
							if(placement.y) share.elements[deckIndex[a.groupIndex - 1]].y(y + (placement.y + card.width)  * _index);
						}

						deckIndex[_index] = deckIndex[a.groupIndex - 1];
						deckIndex[a.groupIndex - 1] = true;//a.name && typeof a.name == 'string' ? a.name : true;
						_index = a.groupIndex - 1
					} else {
						
						deckIndex[a.groupIndex - 1] = true;//a.name && typeof a.name == 'string' ? a.name : true;
						_index = a.groupIndex - 1
					}

				} else {
					
					for(;typeof deckIndex[_index] != 'undefined';_index += 1) {}
					deckIndex[_index] = true;//a.name && typeof a.name == 'string' ? a.name : true;
				}
				
				// смещаем координаты колод относиткльно координад группы

				if(placement) {
					// console.log('placement#2', placement);
					if(placement.x) a.position.x = /*x + */(placement.x + share.card.width)  * (_index);
					if(placement.y) a.position.y = /*y + */(placement.y + share.card.height) * (_index);
				}

				// прокидываем некоторые атрибуты всем колодам группы (у атрибутов заданных колоде приоритет выше)

				// if(paddingType  && !a.paddingType)  a.paddingType  = paddingType;
				// if(flip         && !a.flip)         a.flip         = flip;
				// if(take         && !a.take)         a.take         = take;
				
				if(paddingType  && typeof a.paddingType  == "undefined") a.paddingType  = paddingType;
				if(flip         && typeof a.flip         == "undefined") a.flip         = flip;
				if(take         && typeof a.take         == "undefined") a.take         = take;
				if(showSlot     && typeof a.showSlot     == "undefined") a.showSlot     = showSlot;
				if(takeRules    && typeof a.takeRules    == "undefined") a.takeRules    = takeRules;
				if(putRules     && typeof a.putRules     == "undefined") a.putRules     = putRules;
				if(fillRule     && typeof a.fillRule     == "undefined") a.fillRule     = fillRule;
				if(autoHide     && typeof a.autoHide     == "undefined") a.autoHide     = autoHide;
				// changed
				if(paddingX     && typeof a.paddingX     == "undefined") a.paddingX     = paddingX;
				if(paddingY     && typeof a.paddingY     == "undefined") a.paddingY     = paddingY;
				if(flipPaddingX && typeof a.flipPaddingX == "undefined") a.flipPaddingX = flipPaddingX;
				if(flipPaddingY && typeof a.flipPaddingY == "undefined") a.flipPaddingY = flipPaddingY;
				
				var _el = main.addDeck(a);
				
				// _el.parent(_id);// write
				deckIndex[_index] = _el.getId();
				
				decks[_el.getId()] = _el;
			}

			// Get decks from group

			this.getDecks = function(a) {
				var _decks = [];
				for(i in decks) {
					if(a && a.visible) {
						if(decks[i].visible) {
							_decks.push(decks[i]);
						}
					} else {
						_decks.push(decks[i]);
					}
				}
				return _decks;
			}

			this.getDeckById = function(id) {
				return decks[id];
			}

			this.getDecksByName = function(name) {
				var _decks = {};
				for(d in decks) {
					if(decks[d].name == name) {
						_decks[d] = decks[d];
					}
				}
				return _decks;
			}

			// Fill group

			this.Fill = function(cardNames) {

				// console.log('fill Group', this.name, cardNames, decks);
				
				var deckIndex = [];
				var _decksLength = 0;

				// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)

				for(i in decks) {
					_decksLength += 1;
					deckIndex.push(null);
				}
				
				for(i in decks) {
					if(decks[i].groupIndex && decks[i].groupIndex <= _decksLength) {
						deckIndex[decks[i].groupIndex - 1] = true;
					}
				}	
				
				for(i in decks) {
					if(!decks[i].groupIndex) {
						var _index = 0;
						for(;deckIndex[_index] != null;_index += 1) {}
						deckIndex[_index] = decks[i].getId();
					}
				}

				for(i in decks) {
					if(decks[i].groupIndex && decks[i].groupIndex <= _decksLength) {
						deckIndex[decks[i].groupIndex - 1] = decks[i].getId();
					}
				}

				var _decksWithBigIndex = {}
				for(i in decks) {
					if(decks[i].groupIndex && decks[i].groupIndex > _decksLength) {
						_decksWithBigIndex[decks[i].groupIndex - 1] = decks[i].getId();
					}
				}

				for(i in _decksWithBigIndex) {
					var _index = 0;
					for(;deckIndex[_index] != null;_index += 1) {}
					deckIndex[_index] = decks[_decksWithBigIndex[i]].getId();
				}

				var _checkDeck = true;
				for(i in cardNames) {
					_checkDeck = _checkDeck && typeof cardNames[i] == 'string';//share.validateCardName(cardNames[i])
				}

				if(_checkDeck) {
					for(i in cardNames) {
						
						// циклично добавляет карты в колоды в группе (в порядке добавления)
	
						var _index = deckIndex[i % deckIndex.length];
						decks[_index].genCardByName(cardNames[i]);
					}
				} else {
				 	for(i in cardNames) {
				 		if(i < deckIndex.length) {
				 			
				 			decks[deckIndex[i]].Fill(cardNames[i]);
				 		}
				 	}
				}
			}

		})(a);

		if(a.decks) {
			if(typeof a.decks == 'number') {
				var _count = a.decks;
				a.decks = [];
				for(var deckNum	= 0; deckNum < _count; deckNum += 1) {
					// console.log('DEBUG; GEN DECKS BY COUNTER', deckNum, _count, a.decks)
					a.decks.push({
						name   : _el_group.name + "_deck" + (deckNum + 1)
						// parent : _id
					});
				}
			}
			for(var d in a.decks) {
				_el_group.addDeck(a.decks[d]);
			}
		}
		share.elements[_id] = _el_group;
		
		// fill group

		if(a && a.fill) {
			var _checkFillDeck = a.fill.length;
			/*for(i in a.fill) {
				_checkFillDeck = _checkFillDeck && typeof a.fill[i] == 'string' && share.validateCardName(a.fill[i]);
			}*/
			if(_checkFillDeck) _el_group.Fill(a.fill);
		}

		// Redraw group

		_el_group.Redraw = function(_a) {
			var _decks = this.getDecks();
			var _index = {}
			// for(i in _a.decks)
			if(typeof _a.decks == 'undefined' || typeof _a.decks == 'number') _a.decks = [];
			for(var i in _decks) {
				
				if(!_a.decks[i]) _a.decks[i] = {};
				
				// changed values
				
				if(!_a.decks[i].position) {
					_a.decks[i].position = {};
				}
				if(!_a.decks[i].parentPosition) {
					_a.decks[i].parentPosition = {};
				}
				/*if( !_a.decks[i].position.x && a.position && a.position.x && typeof a.position.x == 'number') {
					_a.decks[i].position.x = _a.position.x;
					console.log('set position x', _a.decks[i].position)
				}
				if( !_a.decks[i].position.y && a.position && a.position.y && typeof a.position.y == 'number') {
					_a.decks[i].position.y = _a.position.y;
				}*/
				if( !_a.decks[i].parentPosition.x && a.position && a.position.x && typeof a.position.x == 'number') {
					_a.decks[i].parentPosition.x = _a.position.x;
				}
				if( !_a.decks[i].parentPosition.y && a.position && a.position.y && typeof a.position.y == 'number') {
					_a.decks[i].parentPosition.y = _a.position.y;
				}
				if(_a.placement) {
					
					var _card = main.options.card;
					// console.log('placement#3', _a.placement);

					if(_a.placement.x) _a.decks[i].position.x = /*x + */(_a.placement.x + _card.width)  * i/* + a.parentPosition.x*/;
					if(_a.placement.y) _a.decks[i].position.y = /*y + */(_a.placement.y + _card.height) * i/* + a.parentPosition.y*/;
				}
				if(!_a.decks[i].rotate       && _a.rotate        && typeof _a.rotate       == 'number') _a.decks[i].rotate       = _a.rotate;
				if(!_a.decks[i].paddingX     && _a.paddingX      && typeof _a.paddingX     == 'number') _a.decks[i].paddingX     = _a.paddingX;
				if(!_a.decks[i].paddingY     && _a.paddingY      && typeof _a.paddingY     == 'number') _a.decks[i].paddingY     = _a.paddingY;
				if(!_a.decks[i].flipPaddingX && _a.flipPaddingX  && typeof _a.flipPaddingX == 'number') _a.decks[i].flipPaddingX = _a.flipPaddingX;
				if(!_a.decks[i].flipPaddingY && _a.flipPaddingY  && typeof _a.flipPaddingY == 'number') _a.decks[i].flipPaddingY = _a.flipPaddingY;
				_decks[i].Redraw(_a.decks[i]);
				// if(_decks[i].name)
			}
			/*for(i in _a.decks) {
				console.log('redraw:', _a.decks[i])
				var _deck = main.Deck(_a.decks[i].name, _el_group.name);
				if(_deck) {
					_deck.Redraw(_a.decks[i]);
				}
			}*/

		};

		return _el_group;
	}.bind(main);

	main.Group = function(name) {
		return this.getElementsByName(name, 'group')[0];
	}.bind(main);

};