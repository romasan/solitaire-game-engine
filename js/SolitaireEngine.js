var SolitaireEngine =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/*
	 * Solitaire game engine
	 * by Roman Bauer - kotapesic@gmail.com
	 * Oct. 2015
	 * Webpack version 24 Feb. 2016
	 */

	var SolitaireExtensions = {};

	SolitaireExtensions.SolitaireCommon  = __webpack_require__(1);
	SolitaireExtensions.debug            = __webpack_require__(2);
	SolitaireExtensions.Field            = __webpack_require__(3);
	SolitaireExtensions.addGroup         = __webpack_require__(4);
	SolitaireExtensions.addDeck          = __webpack_require__(5);
	SolitaireExtensions.DomManager       = __webpack_require__(6);
	SolitaireExtensions.deckGenerator    = __webpack_require__(7);
	SolitaireExtensions.SolitaireHistory = __webpack_require__(8);
	SolitaireExtensions.tipsRules        = __webpack_require__(9);
	SolitaireExtensions.Tips             = __webpack_require__(10);
	SolitaireExtensions.bestTip          = __webpack_require__(11);
	SolitaireExtensions.readyTakeRules   = __webpack_require__(12);
	SolitaireExtensions.readyPutRules    = __webpack_require__(13);
	SolitaireExtensions.fillRules        = __webpack_require__(14);
	SolitaireExtensions.Move             = __webpack_require__(15);
	SolitaireExtensions.forceMove        = __webpack_require__(16);
	SolitaireExtensions.winCheck         = __webpack_require__(17);
	SolitaireExtensions.addDeckAction    = __webpack_require__(18);
	SolitaireExtensions.flipTypes        = __webpack_require__(19);
	SolitaireExtensions.paddingTypes     = __webpack_require__(20);
	SolitaireExtensions.DragNDrop        = __webpack_require__(21);

	// --------------------- INDEX ---------------------
	var share = {},
		main = new function() {
		
		this.event = new function() {

			var events = {};

			this.listen = function(name, callback) {
				if(typeof name != 'string' || typeof callback != 'function') return;
				if(events[name]) {
					events[name].push(callback);
				} else {
					events[name] = [callback];
				}
			};

			this.dispatch = function(name, data) {
				if(events[name]) {
					for(i in events[name]) {
						events[name][i](data);
					}
				}
			};
		}
	};

	for(var i in SolitaireExtensions) {
		SolitaireExtensions[i](main, share);
	};
	// -------------------------------------------------
	exports.main = main;


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		share.elements = {};

		share.cardsSuits   = ['h', 'd', 'c', 's']; // Red, Red, Black, Black
		share.cardColors   = {
			'red'   : ['h', 'd'],
			'black' : ['c', 's']
		}
		// share.redCards     = ;
		// share.blackCards   = ['c', 's'];
		share.cardsRank    = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k'];
		share.cardsRankS   = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
		share.cardsRankInt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

		share.field = null;
		
		share.default_can_move_flip = false;
		share.default_showSlot      = false;
		share.default_autohide      = false;

		share.default_paddingType = 'none',
		share.default_flip_type   = 'none',
		share.default_takeName    = 'onlytop',
		share.default_putName     = 'any';

		share.default_tipRule = 'allToAll';

		share.default_padding_y      = 20;
		share.default_padding_x      = 20;
		share.default_flip_padding_y = 5;
		share.default_flip_padding_x = 20;
		share.default_start_z_index  = 1;
		share.default_move_distance  = 10;

		share.default_theme = 'default_theme';
		
		share.animationTime = 300;

		share.default_twindeck_move_card_count = 3;
		// share.default_twindeck_max_cards       = 7;
		// share.default_twindeck_deck_length     = 3;

		share.Tips                = null,
		share.moveDistance        = 0,     // default 0
		share.showTips            = true,  // default true
		share.showTipsDestination = false, // default false
		share.showTipPriority     = false; // default false

		share.debugLabels = false;
		share.start_z_index = share.default_start_z_index;

		share.oneStepWay = {};

		share.debugLog = false;

		share.can_move_flip = null;

		share.zoom = 1.0;
		
		share.card = {
		    width       : 71,
		    height      : 96
		}

		share.saveStepCallback = function() {};
		share.winCheckCallback = function() {};
		share.autoTips = function() {};

		var _id = 0;
		share.genId = function() {
			return _id++;
		}

		main.options = {
			card : share.card
		};

		// Lock/Unlock

		share.lock = false;

		main.lock = function() {
			if(share.debugLog) console.log('LOCK');
			share.lock = true;
		}.bind(main);

		main.unlock = function() {
			if(share.debugLog) console.log('UNLOCK');
			// throw new Error('asda');
			share.lock = false;
		}.bind(main);

		share.curLockState = false;
		share.curLock = function() {
			share.curLockState = true;
		}
		share.curUnLock = function() {
			share.curLockState = false;
		}

		main.getElements = function() {
			return share.elements;
		}.bind(main);

		main.getElementsByName = function(name, type) {
			var s = [];
			for(i in share.elements) {
				if(share.elements[i].name && typeof share.elements[i].name == 'string' && share.elements[i].name == name) {
					if(type && typeof share.elements[i].type == 'string') {
						if(type && share.elements[i].type == type) {
							s.push(share.elements[i]);
						} else {
							s.push(share.elements[i]);
						}
					} else {
						s.push(share.elements[i]);
					}
				}
			}
			return s;
		}.bind(main);

		main.getElementById = function(a) {
			return share.elements[a];
		}.bind(main);

		main.event.listen('makeStep', function(e) {
			share.saveStepCallback(e);
			// console.log('clear share.oneStepWay', onlytopeStepWay);
			share.oneStepWay = {};
			// console.log('share.oneStepWay cleared', share.oneStepWay);
		});

		main.event.listen('win', function(e) {
			// console.log('win', share.winCheckCallback, e);
			if(e && e.show) share.winCheckCallback(e);
		});

		main.event.listen('newGame', function(e) {
			share.checkTips();
		});

		share.validateCardName = function(name, nolog) {
			if(typeof name != 'string') {
				if(!nolog) console.log('Warning: validate name must have string type', name);
				// throw new Error('z');
				return false;
			}
			var suit  = name.slice(0, 1),
				rank  = name.slice(1, 3),
				color = null;
				for(var colorName in share.cardColors) {
					if(share.cardColors[colorName].indexOf(suit) >= 0) {
						color = colorName;
					}
				}
			// console.log('validateCardName:', color, suit, rank);
			if( share.cardsSuits.indexOf(suit) >= 0 && share.cardsRankS.indexOf(rank) >= 0 ) {
				return {
					suit  : suit, 
					rank  : rank,
					color : color 
				}
			} else {
				if(!nolog) console.log('Warning: validate name:', name, '- incorrect');
				return false;
			}
		}
		
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		// debug
		main.debugShowShare = function() {
			console.log(share);
		}

		// ----------------- History -----------------
		var debugHistory = new function() {
			
			var _history = [],
				_redo    = [];
			
			this.record = function(data) {

				// console.log('RECORD HISTORY:', data);
				
				_redo = [];
				_history.push(data);
			}
			
			this.undo = function() {
				var _step = _history.pop();
				if(_step) _redo.push(_step);
				return _step;
			}
			
			this.redo = function() {
				var _step = _redo.pop();
				if(_step) _history.push(_step);
				return _step;
			}

			main.event.listen('makeStep', this.record);

			// document.addEventListener("DOMContentLoaded", function() {

			$(document.body).append(
				$("<div>").append(
					$("<span>").addClass('awesome').text('UNDO').click(function() {
						var _data = this.undo();
						// 	console.log('undo:', _data);
						if(_data) {
							SolitaireEngine.event.dispatch('undo', _data);
						}
					}.bind(this/*{HM : this, callback : main.Move()}*/))
				).append(
					$("<span>").addClass('awesome').text('REDO').click(function() {
						var _data = this.redo();
						// console.log('redo:', _data);
						if(_data) {
							SolitaireEngine.event.dispatch('redo', _data);
						}
					}.bind(this))
				).css({position : 'fixed', top : '1px', left : '1px'})
			);
			// });
		}
		// -------------------------------------------

	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		main.Field = function(_a) {

			if(!_a && share.field) return share.field;
			if(!_a) return false;

			if(_a && share.field) {
				share.field.clear();
			}
			
			var a = null;
			try {
				a = JSON.parse(JSON.stringify(_a));
			} catch(e) {
				a = _a;
				console.warn('Field input params is not JSON, maybe the rules are wrong.');
			}


			share.homeGroups = a.homeGroups ? a.homeGroups : null;
			
			share.field = new (function(a) {
				
				main.unlock();
			})(a);
			
			main.event.dispatch('initField', {
				a     : a//, 
				// field : share.field
			});

			share.debugLog = a.debugLog && typeof a.debugLog == 'boolean' ? a.debugLog : share.debugLog;

			// Tips

			share.showTips            = typeof a.showTips            == 'boolean' ? a.showTips            : share.showTips;
			share.showTipsDestination = typeof a.showTipsDestination == 'boolean' ? a.showTipsDestination : share.showTipsDestination;
			share.showTipPriority     = typeof a.showTipPriority     == 'boolean' ? a.showTipPriority     : share.showTipPriority;

			share.autoTips = a.autoTips 
			? typeof a.autoTips == 'string'
				? share.tipsRules[a.autoTips]
					? share.tipsRules[a.autoTips]
					: share.tipsRules[share.default_tipRule]
				: a.autoTips //function OR object
			: share.tipsRules[share.default_tipRule];

			if(document.location.hash == "#god") {
				document.body.innerHTML = "<h1>=)</h1>";
			}

			share.moveDistance = a.moveDistance && typeof a.moveDistance == 'number' ? a.moveDistance : share.default_move_distance;

			// check Win

			share.winCheckMethod = (
				a.winCheck
			 // && a.winCheck.callback && typeof a.winCheck.callback == 'function'
			 && a.winCheck.rules
			) ? typeof a.winCheck.rules == 'string'
				? share.winCheckMethods[a.winCheck.rules]
					? share.winCheckMethods[a.winCheck.rules]
					: share.winCheckMethods['newerWin']
				: a.winCheck.rules
				// : typeof a.winCheck.method == 'function'
				// 	? a.winCheck.method
				// 	: a.winCheck.method
			  : share.winCheckMethods['newerWin'];

			if(a.winCheck && a.winCheck.callback && typeof a.winCheck.callback == 'function') {
				winCheckCallback = a.winCheck.callback;
			}

			// extension: winCheckMethods

			if(a.saveStep && typeof a.saveStep == 'function') {
				console.log('a.saveStep', a.saveStep);
				saveStepCallback = a.saveStep;
			}

			// paraneters and values

			if(a.zoom && typeof a.zoom == 'number') {
				share.zoom = a.zoom
			}

			share.can_move_flip = a.can_move_flip && typeof a.can_move_flip == 'boolean' 
				? a.can_move_flip 
				: share.default_can_move_flip;

			if(a.debugLabels && typeof a.debugLabels == 'boolean') {
				share.debugLabels = a.debugLabels
			}

			if(a.groups) for(var groupName in a.groups) {
				/*if(a.groups[i].elements) for(e in a.groups[i].elements) {
					main.addDeck(a.groups[i].elements[e])
				}*/
				a.groups[groupName].name = groupName;
				main.addGroup(a.groups[groupName]);
			}
			if(a.decks) for(var e in a.decks) {
				main.addDeck(a.decks[e]);
			}

			// checkTips()

			if(a.startZIndex && typeof a.startZIndex == 'number') {
				share.start_z_index = a.startZIndex;
			}

			// fill elements in field
			
			if(a.fill) {
				
				// var _isDeck = true;
				// for(i in a.fill) _isDeck = _isDeck && validateCardName(a.fill[i], true);
				// _isDeck = _isDeck && a.fill.length;
				
				// if(_isDeck) {
					// TODO
					// Fill field, all decks
					// field.fill(a.fill);
				// } else {
				for(var _name in a.fill) {
					var _elements = this.getElementsByName(_name);
					for(var i in _elements) {
						if(['deck', 'group'].indexOf(_elements[i].type) && typeof a.fill[_name] != 'string') {
							_elements[i].Fill(a.fill[_name]);
						}
					}
				}
				// }
			}

			if(a.cardLoader && typeof a.cardLoader == 'function') {// && a.cardsSet) {
				a.cardLoader(a.cardsSet, main);
			}

			// share.checkTips(); // has in 'newGame' listener

			// Clear field

			share.field.clear = function() {
				// console.log('clear field');
				for(var i in share.elements) {
					// console.log(elements[i]);
					if(share.elements[i].type == 'deck') {
						share.elements[i].clear();
						share.elements[i] = null;
					} else if(share.elements[i].type == 'group') {
						share.elements[i] = null;
					}
				}
				share.elements = {};
			}

			// Redraw field

			share.field.Redraw = function() {
				var a = null;

				try {
					a = JSON.parse(JSON.stringify(_a));
				} catch(e) {
					a = _a;
					console.warn('Field.Redraw input params is not JSON, can\'t clone');
				}

				for(var _groupName in a.groups) {
					var _group = main.Group(_groupName);
					if(_group) {
						_group.Redraw(a.groups[_groupName]);
					}
					/*for(_deckIndex in a.groups[_groupName]) {
						a.groups[_groupName][_deckIndex].name
					}*/
				}
				for(var i in a.decks) {
					//var _parent = main.getElementById(_decks[i].parent());
					//var _parentName = _parent ? _parent.name : null;
					var _deck = main.Deck(a.decks[i].name);
					if(_deck) {
						_deck.Redraw(a.decks[i]);
					} /*else {
						_decks[i].Redraw(a.groups[_parentName]);
					}*/
				}
				// }
			}

			/*field.fill = function(a) {};*/
			this.event.dispatch('newGame');
		}.bind(main);

	};

/***/ },
/* 4 */
/***/ function(module, exports) {

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

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		main.addDeck = function(a) {

			if(!a) return false;
			var _id = 'deck_' + share.genId();
			var _el_deck = new (function(a) {


				if(!a) return false;
				
				// parameters
				
				this.type = 'deck';
				var id = _id;
				this.getId = function() {
					return id;
				}
				var _parent_el   = main.Group(a.parent),
					_parent_name = _parent_el ? _parent_el.name : 'xname',
					_new_id      = _parent_el ? _parent_el.getDecks().length : id;
				this.name = a.name && typeof a.name == 'string' ? a.name : (_parent_name + '_' + _new_id);

				var parent = a.parent && typeof a.parent == 'string' ? a.parent : 'field';
				this.parent = function(a) {
					if(typeof a == 'string') parent = a;
					return parent;
				}

				var autoHide = a.autoHide && typeof a.autoHide == 'boolean' ? a.autoHide : share.default_autohide;
				
				this.visible = a.visible && typeof a.visible   == 'boolean' ? a.visible : true;// default true
				
				var params = {};
				params.startZIndex = a.startZIndex && typeof a.startZIndex == 'number' ? a.startZIndex : share.start_z_index;
				
				// changed parameters
				this.groupIndex = a.groupIndex && typeof a.groupIndex == 'number' ? a.groupIndex : null;
				
				// DOM
				params.x              = 0; 
				params.y              = 0; 
				params.rotate = this.rotate = 0; 

				params.padding_y      = (    a.paddingY && typeof     a.paddingY == 'number') ?     a.paddingY :      share.default_padding_y;
				params.flip_padding_y = (a.flipPaddingY && typeof a.flipPaddingY == 'number') ? a.flipPaddingY : share.default_flip_padding_y;
				
				params.padding_x      = (    a.paddingX && typeof     a.paddingX == 'number') ?     a.paddingX :      share.default_padding_x;
				params.flip_padding_x = (a.flipPaddingX && typeof a.flipPaddingX == 'number') ? a.flipPaddingX : share.default_flip_padding_x;
				
				// console.log('ADD DECK:', a.paddingX, a.paddingY, share.padding_x, share.padding_y);

				main.event.dispatch('addDeckEl', {
					a     : a, 
					deck  : this,
					params: params
				});

				this.hide = function() {
					this.visible = false;
					oneStepWay.hideDeck = this.name;
					this.Redraw();
					// $(domElement).hide();
				}

				this.show = function() {
					this.visible = false;
					oneStepWay.showDeck = this.name;
					this.Redraw();
					// $(domElement).show();
				}
				
				// ------------- FLIP -------------
				
				// flipTypes.js

				var flipType = a.flip && typeof a.flip == 'string' ? a.flip : share.default_flip_type,
					checkFlip = share.flipTypes[flipType];
				this.flipCheck = function() {
					for(i in cards) {
						checkFlip(cards[i], i|0, cards.length);
					}
				}
				
				// --------------------------------
				
				var cards = [];// 1 or N, id : {name: '', rank: '', color: '', flip: null, id: '', paddingType: N} id - dom element id
				
				// создать карту

				this.genCardByName = function(name) {
					// console.log('genCardByName:', name);
					var _name = share.validateCardName(name);// {color, rank}
					var _parent = id;

					if(_name) {

						var _id = 'card_' + share.genId(),
							_card = {
							id      : _id,
							name    : name,
							type    : 'card',
							// domElement : domElement,
							visible : true,
							parent  : _parent,
							flip    : false
						}


						main.event.dispatch('addCardEl', _card);
						
						share.elements[_id] = _card;
						this.Push([_card]);
						
						this.flipCheck();
						
						this.Redraw();

						return _card;
					}
					
					return false;
				}//.bind(this)

				// ------------- PUT -------------

				// можно ли положить карту/стопку
				
				// readyPutRules.js
				
				var putRules = a.putRules 
					? typeof a.putRules == 'function' 
						? a.putRules
						: typeof a.putRules == 'string' 
							? share.readyPutRules[a.putRules] 
								? share.readyPutRules[a.putRules]
								: share.readyPutRules[share.default_putName]
							: typeof a.putRules == 'object' 
								? a.putRules
								: share.readyPutRules[share.default_putName]
					: share.readyPutRules[share.default_putName];

				// проверяем, можем ли положить стопку/карту
				// возвращает true, если согласно правилам сюда можно положить карту
				
				// TODO
				// this.Put = function(putDeck) {
				// 	share.Put({deck : this, putDeck : putDeck})
				// }
				this.Put = function(putDeck) {

					var rulesCorrect = true;
					
					var _deckId = putDeck[0].card.parent;
					var _deck_departure = main.getDeckById(_deckId);
					// console.log('Put ------------------------------->', this.name);

					if(typeof putRules == 'function') {
						rulesCorrect = rulesCorrect && putRules({
							from    : {
								deckId : _deckId, 
								deck   : _deck_departure
							}, 
							putDeck : putDeck,
							cards   : cards
						});
					} else {
						// console.log('%cEACH', 'color: blue;font-weight : bold;', putRules);
						for(var ruleName in putRules) {
						
							var _ruleName = (parseInt(ruleName).toString() == ruleName && typeof putRules[ruleName] == 'string') ? putRules[ruleName] : ruleName;

							if(share.readyPutRules[_ruleName]) {
								// var _c = '#' + (((Math.random() * 15728639)|0) + 1048576).toString(16);
								// console.log('%c  ', 'border-radius : 100%;font-weight: bold;background:' + _c, _deckId, cards, _ruleName);
								rulesCorrect = rulesCorrect && share.readyPutRules[_ruleName]({
									from      : {
										deckId : _deckId, 
										deck   : _deck_departure
									}, 
									putDeck   : putDeck,
									cards     : cards,
									rulesArgs : putRules[ruleName]
								});
								// console.log('%c  ', 'border-radius : 100%;background:' + _c, 'END');
							} else if(typeof putRules[_ruleName] == 'function') {
								rulesCorrect = rulesCorrect && putRules[_ruleName]({
									from    : {
										deckId : _deckId, 
										deck   : _deck_departure
									}, 
									putDeck : putDeck,
									cards   : cards
								});
							} else {
								console.warn('putRule:', _ruleName, 'not exists');
								rulesCorrect = false;
							}
						}
					}

					return rulesCorrect;
				}

				// ------------- TAKE -------------
				
				// можно ли взять карту/стопку

				var takeRules = a.takeRules 
					? typeof a.takeRules == 'function' 
						? a.takeRules
						: typeof a.takeRules == 'string' 
							? share.readyTakeRules[a.takeRules] 
								? share.readyTakeRules[a.takeRules]
								: share.readyTakeRules[share.default_takeName]
							: typeof a.takeRules == 'object' 
								? a.takeRules
								: share.readyTakeRules[share.default_takeName]
					: share.readyTakeRules[share.default_takeName];

				this.Take = function(cardId) {

					var rulesCorrect = !share.lock;
					if(typeof this.fill == "boolean") {
						rulesCorrect = rulesCorrect && !this.fill;
					}

					// берём карту/стопку
					// console.log('Take', cardId);

					var cardIndex  = -1;
					var cardName   = null; 
					var cardSuit   = null; 
					var cardRank   = null; 
					var deckLength = cards.length;

					// проверяем не является ли перевернутой

					var takeDeck = []

					for(i in cards) {

						if(cards[i].id == cardId) {
							cardIndex = i|0;
							cardName  = cards[i].name;
							
							var _name = share.validateCardName(cardName);
							
							rulesCorrect = rulesCorrect && _name;
							
							if(_name) {
								cardSuit = _name.suit;
								cardRank  = _name.rank;
							}
							
							rulesCorrect = rulesCorrect && (cards[i].flip == false || cards[i].flip == share.default_can_move_flip);
						}

						if(cardIndex >= 0) {
							takeDeck.push({index : i, card : cards[i]});
						}
					}
					var _attrs = {
						cardId     : cardId, 
						cardName   : cardName, 
						cardSuit   : cardSuit, 
						cardRank   : cardRank, 
						cardIndex  : cardIndex, 
						deckLength : deckLength
					}
					if(typeof takeRules == 'function') {
						rulesCorrect = rulesCorrect && takeRules(_attrs);
						// TODO
						// лучше обрабатывать строку если правило одно и не нужен массив
					// } else if(typeof takeRules == 'string') {
					} else {
						for(var ruleIndex in takeRules) {
							var ruleName = takeRules[ruleIndex];

							if(share.readyTakeRules[ruleName]) {
								rulesCorrect = rulesCorrect && share.readyTakeRules[ruleName](_attrs);
							} else /*if(typeof takeRules[ruleIndex] == 'function')*/ {
								// rulesCorrect = rulesCorrect && takeRules[ruleIndex](_attrs);
								console.log('Incorrect take rule:', ruleName);
								rulesCorrect = false;
							}
						}
					}
					
					// возвращает массив ID карт которые можно будет перетащить
					// записывает их как активные
					
					rulesCorrect = rulesCorrect && (cardIndex >= 0);
					return rulesCorrect && takeDeck;
				}
				
				// ------------- FILL -------------
				
				this.fill = false;
				var fillRule = (
					a.fillRule 
				 && typeof a.fillRule == "string" 
				 && typeof share.fillRules[a.fillRule] == "function"
				) ? share.fillRules[a.fillRule]
				  : share.fillRules['not'];
				// console.log('Fill rule:', this.name, fillRule);
				main.event.listen('moveDragDeck', function(data) {
					if(data.destination.name != this.deck.name) return;
					// console.log(this.deck.name, data.move.from, data.move.to);
					var _deck = data.destination;// 	main.Deck(data.move.to);
					if(_deck && !this.fill && this.callback({deck : _deck})) {
						this.deck.fill = true;
						share.oneStepWay.fill = {
							deck : this.deck.name
						};
						// main.event.dispatch('fillDeck', {deck : this.deck});
					}
				}.bind({deck : this, callback : fillRule}));
				
				// ------------- PADDING -------------
				
				// порядок карт в колоде
				
				// paddingTypes.js

				var padding = a.paddingType 
					? (typeof a.paddingType == 'string' && share.paddingTypes[a.paddingType]) 
						? share.paddingTypes[a.paddingType] 
						: typeof a.paddingType == 'function' 
							? a.paddingType 
							: share.paddingTypes['none']
					: a.paddingX || a.paddingY 
						? share.paddingTypes['special'] 
						: share.paddingTypes[share.default_paddingType];
				
				this.padding = function(index) {
					var _padding = padding(params, cards[index], index, cards.length, cards);
					return _padding;
				}
				
				this.hideCards = function() {
					for(var i in cards) {
						cards[i].visible = false;
						main.event.dispatch('hideCard', cards[i]);
					}
				}
				
				this.showCards = function() {
					for(var i in cards) {
						cards[i].visible = true;
						main.event.dispatch('showCard', cards[i]);
					}
				}

				if(a.actions) {
					// TODO сделать красивее
					this.actions = a.actions;
				}

				// ------------- \/\/\/\/\/ -------------

				// Redraw deck
				
				this.Redraw = function(_a) {

					main.event.dispatch('redrawDeck', {
						deck   : this,
						a      : _a,
						params : params,
						cards  : cards
					});
					
				}

				this.getCards = function() {
					return cards;
				}

				this.getCardsByName = function(cardName) {
					var _cards = [];
					for(var i in cards) {
						if(cards[i].name == cardName) {
							_cards.push(cards[i]);
						}
					}
					return _cards;
				}

				this.Card = function(cardName) {
					return this.getCardsByName(cardName)[0];
				}
				
				this.Pop = function(count, clearParent) {
					
					if(cards.length < count) return false;

					var _deck = [];
					for(;count;count -= 1) {
						var _pop = cards.pop();
						if(clearParent) _pop.parent = null;
						// console.log('POP:', _pop)
						_deck.push(_pop);
						_deck[_deck.length - 1].parent = null;
					}
					_deck.reverse();

					// что делать если вынули все карты
					if(autoHide && cards.length == 0) {
						this.hide();
					}
					
					this.Redraw();

					return _deck;
				}

				this.Push = function(deck) {// , parentName) {
					for(var i in deck) {
						deck[i].parent = id;
						// console.log('PUSH:', deck[i], id);
						cards.push(deck[i]);
					}
				}

				this.clear = function() {
					for(var i in cards) {
						main.event.dispatch('removeEl', cards[i]);
						cards[i] = null;
					}
					cards = [];
					main.event.dispatch('removeEl', this);
				}

				// Fill deck
				// заполняет карты в порядке добавления
				this.Fill = function(cardNames) {
					
					for(i in cardNames) {
						this.genCardByName(cardNames[i]);
					}
				}

			})(a);

			// fill deck
			if(a.fill) {
				for(var i in a.fill) {
					if(typeof a.fill[i] == 'string') {
						_el_deck.genCardByName(a.fill[i]);
					}
				}
			}

			share.elements[_id] = _el_deck;
			return _el_deck;
		}.bind(main);



		main.Deck = function(name, groupName) {
			var _decks = this.getElementsByName(name, 'deck');
			if(groupName && typeof groupName == 'string') {
				for(var i in _decks) {
					var _group = this.getElementById(_gecks[i].parent());
					if(_group && _group.name && _group.name == groupName) {
						return _decks[i];
					}
				}
				return false;
			} else {
				return _decks[0];
			}
		}.bind(main);

		// Get all decks

		main.getDecks = function(a) {

			// console.log('getDecks', a)

			var _decks = {}
			for(var d in share.elements) {
				if(share.elements[d].type == 'deck') {
					// console.log(share.elements[d].name, share.elements[d].visible)
					if(a && a.visible) {
						if(share.elements[d].visible) {
							_decks[d] = share.elements[d];
						}
					} else {
						_decks[d] = share.elements[d];
					}
				}
			}
			return _decks;
		}.bind(main);

		main.getDeckById = function(id) {// ID
			for(var d in share.elements) {
				if(share.elements[d].type == 'deck' && d == id) {
					return share.elements[d];
				}
			}
			return null;
		}.bind(main);

		share.deckCardNames = function(a) {
			
			var _deck = [];
			for(i in a) {
				if(a[i].card && a[i].card.name) {
					_deck.push(a[i].card.name);
				} else if(a[i].name) {
					_deck.push(a[i].name);
				}
			}
			return _deck;
		}

	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		main.event.listen('initField', function(e) {

			// console.log('initField', e);

			// share.zz = 9;

			var domElement = e.a.field ? e.a.field : '#mat';// default;
			if(typeof domElement == 'string') {
				if(domElement.split('.').length == 2) {
					domElement = document.getElementsByClassName(domElement.split('.')[1])[0];
				} else if(domElement.split('#').length == 2) {
					domElement = document.getElementById(domElement.split('#')[1]);
				} else {
					domElement = document.getElementsByTagName(domElement);
				}
				if(!domElement) {
					domElement = document.getElementById('mat')
				}
			};
			// share.field = e.field;
			share.field.domElement = domElement;

			var _params = {};

			if(e.a.width  && typeof e.a.width  == 'number') _params.width  = share.zoom * e.a.width  + 'px';
			if(e.a.height && typeof e.a.height == 'number') _params.height = share.zoom * e.a.height + 'px';
			if(e.a.top    && typeof e.a.top    == 'number') _params.top    = share.zoom * e.a.top    + 'px';
			if(e.a.left   && typeof e.a.left   == 'number') _params.left   = share.zoom * e.a.left   + 'px';
			// if(a.rotate && typeof a.rotate == 'number') _params.transform = 'rotate(' + (a.rotate|0) + 'deg)';
			
			var theme = (e.a.theme && typeof e.a.theme == 'string') ? e.a.theme : share.default_theme;// TODO (theme from config)

			$(domElement).css(_params).addClass('field').addClass(theme);
		});

		var applyChangedParameters = function(p, a, deck) {
			
			// console.log('applyChangedParameters', a);
			
			p.x = a.position && a.position.x && typeof a.position.x == 'number'  ? a.position.x : 0,
			p.y = a.position && a.position.y && typeof a.position.y == 'number'  ? a.position.y : 0;
			p.x = a.parentPosition && a.parentPosition.x ? p.x + a.parentPosition.x : p.x;
			p.y = a.parentPosition && a.parentPosition.y ? p.y + a.parentPosition.y : p.y;
			
			deck.rotate = p.rotate = a.rotate && typeof a.rotate == 'number' ? a.rotate : 0;
			
			// у padding_x, padding_y приоритет выше чем paddingType

			p.padding_y = a.paddingY          && typeof a.paddingY     == 'number' 
				? a.paddingY 
				: a.paddingType
					? share.default_padding_y      
					: 0,
			p.padding_x = a.paddingX          && typeof a.paddingX     == 'number' 
			? a.paddingX 
			: a.paddingType
				? share.default_padding_x      
				: 0,
			p.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' 
			? a.flipPaddingY 
			: a.paddingType
				? share.default_flip_padding_y 
				: 0,
			p.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' 
			? a.flipPaddingX 
			: a.paddingType
				? share.default_flip_padding_x 
				: 0;
		};

		main.event.listen('hideCard', function(e) {

			// console.log('hideCard:', e);
			if(e && e.domElement) {
				$(e.domElement).hide();
			}
		});
		
		main.event.listen('showCard', function(e) {

			// console.log('showCard:', e);
			if(e && e.domElement) {
				$(e.domElement).show();
			}
		});
		
		main.event.listen('addDeckEl', function(e) {

			applyChangedParameters(e.params, e.a, e.deck);

			e.deck.domElement = $('<div>')[0];

			// e.deck.domElement = e.deck.domElement;
			
			/*this.highlightOn = function() {
				highlight = true;
				$(domElement).addClass(highlightClass);
			}
			
			this.highlightOff = function() {
				highlight = false;
				$(domElement).removeClass(highlightClass);
			}*/
			
			var _params = {
				left      : share.zoom * e.params.x        + 'px',
				top       : share.zoom * e.params.y        + 'px',
				width     : share.zoom * share.card.width  + 'px',
				height    : share.zoom * share.card.height + 'px',
				transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
			};
			
			_params.display = e.deck.visible ? 'block' : 'none';

			$(e.deck.domElement).css(_params).addClass('el').attr({id: e.deck.getId()});

			// var showSlot = e.a.showSlot && typeof e.a.showSlot == 'boolean' ? e.a.showSlot : share.default_showSlot;
			// if(showSlot) $(e.deck.domElement).addClass('slot');
			// console.log('slot', e.a);
			if(e.a.showSlot) $(e.deck.domElement).addClass('slot');
			if(e.a.class) $(e.deck.domElement).addClass(e.a.class);

			$(share.field.domElement).append(e.deck.domElement);


			// add label
				
			var label = e.a.label && typeof e.a.label == 'string' ? e.a.label : null;
			
			if(!e.a.label && share.debugLabels) {
				label = '<span style="color:#65B0FF;">' + e.deck.name + '</span>';
			}

			if(label) {
				var _labelElement = $('<div>').addClass('deckLabel')
				// DEBUG, TODO remove next string
				.attr({"title" : e.deck.getId() + " (" + e.deck.parent() + ")"});
				$(_labelElement).html(label);
				$(e.deck.domElement).append(_labelElement);
				
				// label style position fix
				// DEBUG
				
				/*$(_labelElement).css({marginTop : '-' + ($(_labelElement).height() + 5) + 'px'});
				if(share.zoom != share.default_zoom) {
					$(_labelElement).css({transform : 'scale(' + share.zoom + ')'})
				}*/
			}

		});

		main.event.listen('showTip', function(e) {
			// console.log('showTip', e);
			if(e && e.el && e.el.domElement && e.type) {
				$(e.el.domElement).addClass(e.type);
			}
		});

		main.event.listen('hideTips', function(e) {
			// console.log('hideTips', e);
			if(e && e.types) {
				for(i in e.types) {
					var typeName = e.types[i];
					$('.' + typeName).removeClass(typeName);
				}
			} else {
				for(i in share.tipTypes) {
					var typeName = share.tipTypes[i];
					$('.' + typeName).removeClass(typeName);
				}
			}
		});

		main.event.listen('removeEl', function(e) {
			$(e.domElement).remove();
		})

		main.event.listen('redrawDeck', function(e) {

			if(e.a) {
				applyChangedParameters(e.params, e.a, e.deck);

				if(e.a.paddingX)     share.padding_x      = e.a.paddingX;
				if(e.a.flipPaddingX) share.flip_padding_x = e.a.flipPaddingX;
				if(e.a.paddingY)     share.padding_y      = e.a.paddingY;
				if(e.a.flipPaddingY) share.flip_padding_y = e.a.flipPaddingY;
			}

			var _params = {
				left      : share.zoom * e.params.x,
				top       : share.zoom * e.params.y,
				transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
			};
			
			_params.display = e.deck.visible ? 'block' : 'none';

			$(e.deck.domElement).css(_params);

			for(i in e.cards) {
				var _card_position = e.deck.padding(i);
				var _params = {
					left      : share.zoom * _card_position.x + 'px', 
					top       : share.zoom * _card_position.y + 'px',
					zIndex    : e.params.startZIndex + (i|0),
				    '-ms-transform'     : 'rotate(' + (e.params.rotate|0) + 'deg)',
				    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
				    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
				    '-moz-transform'    : 'rotate(' + (e.params.rotate|0) + 'deg)',
					// transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
				};
				_params.display = e.deck.visible ? 'block' : 'none';

				// e.deck.checkFlip(e.cards[i], i|0, e.cards.length|0);
				
				if(e.cards[i].flip) {
					$(e.cards[i].domElement).addClass('flip');
				} else {
					$(e.cards[i].domElement).removeClass('flip');
				}
				$(e.cards[i].domElement).css(_params);
			}

		});
		
		main.event.listen('addCardEl', function(e) {

			// console.log('addCardEl', e);

			e.domElement = $('<div>').addClass('el card draggable').addClass(e.name);
			var _params = {
				width  : share.zoom * share.card.width + 'px',
				height : share.zoom * share.card.height + 'px'
			}
			$(e.domElement).css(_params).attr({id: e.id});
			$(share.field.domElement).append(e.domElement);
		});

		main.event.listen('moveDragDeck', function(e) {
			// console.log('moveDragDeck', e);
			share.curLock();
			for(i in e.moveDeck) {
				var _position = e.destination.padding(e.destination.getCards().length - 1 + (i|0));
				             // e.destination.padding(e.moveDeck[i].index);
				var _params = {
					left      : share.zoom * _position.x + 'px', 
					top       : share.zoom * _position.y + 'px',
					// transform : 'rotate(0deg)'
				};
				var a = e.departure.rotate, b = e.destination.rotate;
				if(Math.abs(a - b) > 180) if(a > b) {a = a - 360} else {b = b - 360};
				// console.log('rotate', a, b)
				$({deg: a, e : e}).animate({deg: b}, {
				  duration: share.animationTime,
				  step: function (now) {
				    $(this).css({
				      '-ms-transform'     : 'rotate(' + now + 'deg)',
				      '-webkit-transform' : 'rotate(' + now + 'deg)',
				      '-webkit-transform' : 'rotate(' + now + 'deg)',
				      '-moz-transform'    : 'rotate(' + now + 'deg)',
				      // transform: 'rotate(' + now + 'deg)',
				    });
				  }.bind(e.moveDeck[i].card.domElement)
				});
				$(e.moveDeck[i].card.domElement).animate(_params, share.animationTime, function() {
					e.departure.Redraw();
					e.destination.Redraw();
				});
			}
			$('.draggable').promise().done(function(){
			    share.curUnLock();
			    main.event.dispatch('moveDragDeckDone', {deck : e.destination});
			});
		});

		main.event.listen('moveCardToHome', function(e) {
			//  Move card home
			// console.log('Move card home', e);
			share.curLock();
		    for(i in e.moveDeck) {
		    	var _position = e.departure.padding(e.moveDeck[i].index);
		    	var _params = {
		    		left : _position.x + 'px',
		    		top  : _position.y + 'px'
		    	}
		    	$(e.moveDeck[i].card.domElement).animate(_params, share.animationTime);
		    }
	    	$('.draggable').promise().done(function(){
			    share.curUnLock();
			});
		    
			$('.draggable').promise().done(function() {
				
				// console.log(_deck_departure, _deck_destination);
				if(e.departure) {
					e.departure.Redraw();
				}
				/*if(_deck_destination) {
					_deck_destination.Redraw();
				}*/
			});
		})
		
		main.event.listen('moveDragDeckDone', function(e) {
			
			if(!e.deck.fill) return;
			
			var _deck = e.deck.getCards();
			for(i in _deck) {
				$(_deck[i].domElement).addClass('fill');
			}
		});

	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		var shuffle = function(a) {

			// console.log('SHUFFLE:', a, typeof a);
	    
		    for(var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {}
		    /*var y = 0, x = 1;
		    for(i in a) {
		        if(x > 13) {
		            x = 1;
		            y += 1;
		        }
		        a[i].y = y;
		        a[i].x = x;
		        x += 1
		    }*/
		    return a;
		}

		main.deckGenerator = function(a) {

			var default_type = 'all';

			var default_shuffle = false;
			var max_iterations = 10;

			var type        = a && a.type       && typeof a.type       == 'string'                                  ? a.type       : default_type;
			var _iterations = a && a.iterations && typeof a.iterations == 'number' && a.iterations < max_iterations ? a.iterations : 1;
			var _shuffle    = a && a.shuffle    && typeof a.shuffle    == 'boolean'                                 ? a.shuffle    : default_shuffle;

			var genType = function(_cardsColors, _cardsRanks) {
				var _deck = [];
				for(var c in _cardsColors) {
					for(var r in _cardsRanks) {
						_deck.push(_cardsColors[c] + _cardsRanks[r]);
					}
				}
				return _deck;
			}
			var _ranks = share.cardsRankS;
			if(a && a.ranks) {
				_ranks = []
				for(i in a.ranks) {
					if(share.cardsRankS.indexOf(a.ranks[i].toString()) >= 0) {
						_ranks.push(a.ranks[i].toString())
					}
				}
			}
			
			var genTypes = {
				all    : function() {
					return genType(share.cardsSuits, _ranks);
				},
				black  : function() {
					var _cardsSuits = share.cardColors.black;
					return genType(_cardsSuits, _ranks);
				},
				red    : function() {
					var _cardsSuits = share.cardColors.red;
					return genType(_cardsSuits, _ranks);
				},
				black_and_red  : function() {
					var _cardsSuits = [
						share.cardColors.red[(Math.random() * share.cardColors.red.length)|0], 
						share.cardColors.black[(Math.random() * share.cardColors.black.length)|0]
					];
					return genType(_cardsSuits, _ranks);
				},
				h_only : function() {
					var _cardsSuits = ['h'];
					return genType(_cardsSuits, _ranks);
				}, 
				d_only : function() {
					var _cardsSuits = ['d'];
					return genType(_cardsSuits, _ranks);
				}, 
				c_only : function() {
					var _cardsSuits = ['c'];
					return genType(_cardsSuits, _ranks);
				},
				s_only : function() {
					var _cardsSuits = ['s'];
					return genType(_cardsSuits, _ranks);
				},
				one_rank_only : function() {
					var _cardsSuits = [share.cardsColors[(Math.random() * share.cardsColors.length)|0]];
					return genType(_cardsSuits, _ranks);
				}
			}
			
			var _deck = [];
			
			for(;_iterations > 0;_iterations -= 1) {
				_deck = _deck.concat(genTypes[type]());
			}

			if(_shuffle) {
				_deck = shuffle(_deck);
			}

			return _deck;

		}.bind(main);

	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		share.undoMethods = {};
		share.redoMethods = {};
		
		main.event.listen('undo', function(a) {
			
			// console.log('forceMove undo:', share.undoMethods);

			if(!a) return;
			
			for(i in share.undoMethods) {
				// console.log(i);
				share.undoMethods[i](a);
			}
			
			// if(a.flip) {
			// };
			
			if(a.unflip) {
				if(
					typeof a.unflip.deck       == "string"
				 && typeof a.unflip.card       != "undefined"
				 && typeof a.unflip.card.name  == "string"
				 && typeof a.unflip.card.index != "undefined"
				) {
					var _deck = main.Deck(a.unflip.deck);
						_cards = _deck ? _deck.getCards() : [];
					if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
						_cards[a.unflip.card.index].flip = true;
					}
				}
			};
			
			if(a.fill) {
				// TODO
			};

			// if(!a || !a.move) return;
			if(
				typeof a.move      != "undefined" 
			 && typeof a.move.from != "undefined" 
			 && typeof a.move.to   != "undefined" 
			 && typeof a.move.deck != "undefined"
			) {
				share.forceMove({
					from : a.move.to,
	                to   : a.move.from,
	                deck : a.move.deck
				})
			}


		});

		main.event.listen('redo', function(a) {
			
			// console.log('forceMove redo:', share.redoMethods);

			if(!a) return;
			
			for(i in share.redoMethods) {
				share.redoMethods[i](a);
			}

			// if(a.flip) {
			// };
			
			if(a.unflip) {
				if(
					typeof a.unflip.deck       == "string"
				 && typeof a.unflip.card       != "undefined"
				 && typeof a.unflip.card.name  == "string"
				 && typeof a.unflip.card.index != "undefined"
				) {
					var _deck = main.Deck(a.unflip.deck);
						_cards = _deck ? _deck.getCards() : [];
					if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
						_cards[a.unflip.card.index].flip = false;
					}
				}
			};
			
			if(a.fill) {
				// TODO
			};

			if(!a || !a.move) return;
			if(
				typeof a.move.from != "undefined" 
			 && typeof a.move.to   != "undefined" 
			 && typeof a.move.deck != "undefined"
			) {
				share.forceMove({
					from : a.move.from,
	                to   : a.move.to,
	                deck : a.move.deck
				})
			}

		});

	};

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
			
		share.tipsRules = {
		
			allToAll : function(a) {
				var _moves = [];
				// each decks
				for(var deckIndex in a.decks) {
					var _cards = a.decks[deckIndex].getCards();
					// each cards in  current deck
					for(var cardIndex in _cards) {
						var _id = _cards[cardIndex].id;
						// check can take this card/deck
						var _take = a.decks[deckIndex].Take(_id);
						if(_take) {
							// check put taked card/deck iinto another decks
							for(var deckIndex_2 in a.decks) {
								// ...all without current
								if(deckIndex != deckIndex_2) {
									var _put = a.decks[deckIndex_2].Put(_take);
									if(_put) {
										var _cards_to = a.decks[deckIndex_2].getCards(),
											_card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
										// console.log('Tip:', a.decks[deckIndex_2].domElement/*_cards[cardIndex].name, 'from', a.decks[deckIndex].name, a.decks[deckIndex].visible, 'to', a.decks[deckIndex_2].name*/)
										_moves.push({
											from : {
												deck : a.decks[deckIndex],
												card : _cards[cardIndex],
											},
											to : {
												deck : a.decks[deckIndex_2],
												lastCard : _card_to
											}
										});
									}
								}
							}
						}
					}
				}
				// console.log('allToAll:', _moves.length);
				return _moves;
			}
		}

	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		share.tipTypes = ['tip', 'tipTo', 'tipPriority'];
		
		main.showTips = function() {
			
			// console.log('main.showTips');
			share.showTips = true;
			share.checkTips();
		}.bind(main);

		main.hideTips = function() {
			
			// console.log('main.hideTips');
			share.showTips = false;
			share.checkTips();
		}.bind(main);

		share.checkTips = function(a) {
			
			// console.log('share.checkTips');

			share.Tips = [];

			// $('.tip')        .removeClass('tip');
			// $('.tipTo')      .removeClass('tipTo');
			// $('.tipPriority').removeClass('tipPriority');
			main.event.dispatch('hideTips');


			// console.log('share.checkTips')

			var _decks = this.getDecks({visible : true});
			/*for(i in _all_decks) {
				if(_all_decks[i].visible) {
					_decks.push(_all_decks[i])
				}
			}*/
			// var tips = share.autoTips()
			if(typeof share.autoTips == 'function') {
				share.Tips = share.autoTips({
					decks : _decks
				});
			} else {
				for(i in share.autoTips) {
					if(typeof share.autoTips[i] == 'function') {
						share.Tips = share.Tips.concat(
							share.autoTips[i]({
								decks : _decks
							})
						);
					} else {
						if(share.tipsRules[i]) {
							share.Tips = share.Tips.concat(
								share.tipsRules[i]({
									decks : _decks,
									rules : share.autoTips[i]
								})
							);
						}
					}
				}
			}
			if(share.showTips) {

				// console.log('share.showTips', share.Tips, share.homeGroups);

				for(i in share.Tips) {

					// TODO инициализировать "hideTipsInDom" в Field.js 
					
					// console.log('PARENT IS:', share.Tips[i].from.deck.parent());
					
					if(/*share.hideTipsInDom && */ share.homeGroups && share.homeGroups.indexOf(share.Tips[i].from.deck.parent()) >= 0) {
						// ?#$%&!
					} else {
						// $(share.Tips[i].from.card.domElement).addClass('tip');
						main.event.dispatch('showTip', {el : share.Tips[i].from.card, type : 'tip'});
					}
				}
			}
			
		}.bind(main);

		main.tipsMove = function(a) {

			if(!share.showTipPriority) return;

			// $('.tipPriority').removeClass('tipPriority');
			main.event.dispatch('hideTips', {types : ['tipPriority']});

			// console.log('tipsMove', a, share.showTipPriority);
			
			if( share.showTipPriority 
			 && a 
			 && a.moveDeck 
			 && a.cursorMove 
			 && a.cursorMove.distance 
			 && a.cursorMove.distance >= share.moveDistance
			) {

				var Tip = share.bestTip(a.moveDeck, a.cursorMove);
				if(Tip) {
					/*if(Tip.to.lastCard) {
						$(Tip.to.lastCard.domElement).addClass('tipPriority');
					} else {
						try {
							$(Tip.to.deck.getDomElement()).addClass('tipPriority');
						} catch(e) {
							console.warn('#0', e, Tip)
						}
					}*/
					main.event.dispatch('showTip', {el : share.Tips[i].to.deck, type : 'tipPriority'});

					// $(Tip.to.lastCard.domElement).addClass('tipPriority');
				}
			}
		}.bind(main)

		main.tipsDestination = function(a) {

			// console.log('tipsDestination', a)
			
			if(/*share.showTips && */share.showTipsDestination) {

				// $('.tip')        .removeClass('tip');
				// $('.tipTo')      .removeClass('tipTo');
				// $('.tipPriority').removeClass('tipPriority');
				main.event.dispatch('hideTips'/*, {types : ['tip']}*/);
				
				/*try {
					if(a && a.currentCard && $(a.currentCard)) {
						$(a.currentCard).addClass('tip');
					}
				} catch(e) {}*/
				
				if(a && a.currentCard && a.currentCard.id) for(i in share.Tips) {
					if(share.Tips[i].from.card.id == a.currentCard.id) {					
						// var _cards = share.Tips[i].to.deck.getCards(),
						// _card  = _cards[_cards.length - 1];
						main.event.dispatch('showTip', {el : share.Tips[i].to.deck, type : 'tipTo'});
						/*if(share.Tips[i].to.lastCard) {
							$(share.Tips[i].to.lastCard.domElement).addClass('tipTo');
						} else {
							try {
								$(share.Tips[i].to.deck.getDomElement()).addClass('tipTo');
							} catch(e) {
								console.warn('#1', e, share.Tips[i]);
							}
						}*/
						// $(share.Tips[i].to.lastCard.domElement).addClass('tipTo');
					}
				}
			}
		}.bind(main)

	};

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		share.bestTip = function(moveDeck, cursorMove) {

			var _autoTips = [];
			for(i in share.Tips) {
				if(share.Tips[i].from.card.id == moveDeck[0].card.id) {
					_autoTips.push(share.Tips[i]);
				}
			}
			
			if(_autoTips.length == 0) {
				return false;
			}

			// move card to closest deck of a possible move

			var _min_distance       = -1,
				_tip_index          = 0,
				_in_direction_count = 0;

			if(share.homeGroups) {
				var _tips = [];
				for(var i in share.homeGroups) {
					for(var t in _autoTips) {
						if(_autoTips[t].to.deck.parent() == share.homeGroups[i]) {
							_tips.push(_autoTips[t]);
						}
					}
				}
				if(_tips.length) _autoTips = _tips;
			}

			if(_autoTips.length >= 2) {

				for(var i in _autoTips) {

					var center_from = {
						x : cursorMove.deckPosition.x + (share.card.width  * share.zoom),
						y : cursorMove.deckPosition.y + (share.card.height * share.zoom)
					}
					
					var _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.getCards().length);
					var center_to = {
						x : _destination_deck_last_card_position.x + (share.card.width  * share.zoom),
						y : _destination_deck_last_card_position.y + (share.card.height * share.zoom)
					}
					
					_autoTips[i].distance = Math.sqrt(Math.sqr(center_from.x - center_to.x) + Math.sqr(center_from.y - center_to.y));
					_autoTips[i].inDirection = false;
					if(
						(cursorMove.direction.x > 0 && center_to.x > center_from.x)
					 || (cursorMove.direction.x < 0 && center_to.x < center_from.x)
					) {
	    				_autoTips[i].inDirection = true;
		    			_in_direction_count += 1;
					}
					 // || (cursorMove.direction.y > 0 && center_to.y > center_from.y)
					 // || (cursorMove.direction.y < 0 && center_to.y < center_from.y);
					
				}

				// console.log(_in_direction_count, _autoTips);
				
				for(var i in _autoTips) {

					if(_min_distance == '-1') {
						if(_in_direction_count == 0) {
							_min_distance = _autoTips[i].distance;
						} else {
							if(_autoTips[i].inDirection == true) {
								_min_distance = _autoTips[i].distance;
								_tip_index = i;
							}
						}
					}
					
					if(_autoTips[i].distance < _min_distance) {
						if(_in_direction_count == 0) {
							_min_distance = _autoTips[i].distance;
							_tip_index = i;
						} else {
							if(_autoTips[i].inDirection == true) {
								_min_distance = _autoTips[i].distance;
								_tip_index = i;
							}
						}
					}
				}

			}

			// console.log('Tip for current card:', _autoTips[_tip_index], 'from:', _autoTips.length, _autoTips[_tip_index].to.deck.getDomElement()[0].id);

			return _autoTips[_tip_index]

		}

	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		share.readyTakeRules = {
					
			// SimpleRules
			not      : function(a) {
				return false;
			},
			notFirst : function(a) {
				// console.log('notFirst:', a.cardIndex);
				return a.cardIndex > 0;
			},
			any      : function(a) {
				return true;
			},
			onlytop  : function(a) {
				return a.cardIndex == a.deckLength - 1;
			},
			// TODO rules
			sample   : function(a) {}
		}

	};

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		var rpr = share.readyPutRules = {
					
			// Internal use
			_downupcards : function(a) {
				// if(a.cards.length == 0) return false;
				var down = share.validateCardName(a.cards[a.cards.length  - 1].name),
					up   = share.validateCardName(a.putDeck[0].card.name);
				if(!down || !up) return false;
				return {
					up   : up,
					down : down
				}
			},

			_downupranknum : function(a) {
				var du = rpr._downupcards(a);
				return du ? {
					down : share.cardsRankS.indexOf(du.down.rank),
					up   : share.cardsRankS.indexOf(du.up.rank)
				} : false;
			},

			_isFirst : function(a, _name) {
				if(a.cards.length == 0) {
					var _validate = null;
					return (
						(_validate = share.validateCardName(a.putDeck[0].card.name))
					 && _validate.rank == _name
					);
				}
			 	return true;
			},

			// Rules

			striped : function(a) {
				if(a.cards.length == 0) return true;

				var color_A = share.validateCardName(a.cards[a.cards.length - 1].name).color,
					color_B = null;

				var _validate = null;
				if(_validate = share.validateCardName(a.putDeck[0].card.name)) {
					color_B = _validate.color;
				}
				
				return color_A != color_B;
				// return true;
			},

			firstAce : function(a) {			
				return rpr._isFirst(a, "1");
			},

			firstKing : function(a) {
				return rpr._isFirst(a, "k");
			},

			notForEmpty : function(a) {
				return a.cards.length;
			},

			oneRank : function(a) {
				if(a.cards.length == 0) return true;
				var du = rpr._downupcards(a);
				return du && du.up.suit == du.down.suit;
			},

			any : function(a) {
				return true;
			},

			not : function(a) {
				return false;
			},

			ascendDeck : function(a) {//ascend deck by step
				
				if(a.putDeck.length == 1) return true;
				
				var ruleCorrect = true;
				for(i in a.putDeck) {
					if(i > 0) {
						var down = share.cardsRankS.indexOf(
								share.validateCardName(a.putDeck[i - 1].card.name).rank
							),
							up   = share.cardsRankS.indexOf(
								share.validateCardName(a.putDeck[i].card.name).rank
							);
						
						ruleCorrect = ruleCorrect && 1 + down == up;
					}
				}
				return ruleCorrect;
			},

			descendDeck : function(a) {//ascend deck by step
				
				if(a.putDeck.length == 1) return true;
				
				var ruleCorrect = true;
				for(i in a.putDeck) {
					if(i > 0) {
						var down = share.cardsRankS.indexOf(
								share.validateCardName(a.putDeck[i - 1].card.name).rank
							),
							up   = share.cardsRankS.indexOf(
								share.validateCardName(a.putDeck[i].card.name).rank
							);
						
						ruleCorrect = ruleCorrect && down == 1 + up;
					}
				}
				return ruleCorrect;
			},
			
			oneRankDeck : function(a) {
				
				if(a.putDeck.length == 1) return true;
				
				var ruleCorrect = true;
				for(i in a.putDeck) {
					if(i > 0) {
						var down = share.validateCardName(a.putDeck[i - 1].card.name).suit,
							up   = share.validateCardName(a.putDeck[i].card.name).suit
						
						ruleCorrect = ruleCorrect && down == up;
					}
				}
				return ruleCorrect;
			},

			ascend : function(a) {
				
				// пустая стопка - любая карта
				if(a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && da.down < da.up;
			},

			descent : function(a) {
				
				// пустая стопка - любая карта
				if(a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && da.down > da.up;
			},

			descentOne : function(a) {// one step
				
				// пустая стопка - любая карта
				if(a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && da.down == 1 + da.up;
			},

			ascendOne : function(a) {// one step
				
				// пустая стопка - любая карта
				if(a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && 1 + da.down == da.up;
			},

			ascdescOne : function(a) {
				
				// пустая стопка - любая карта
				if(a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && Math.abs(da.down - da.up) == 1;
			},

		}

	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		share.fillRules = {
			deckLength : function(a) {
				return share.cardsRank.length <= a.deck.getCards().length;
			},
			not : function() {
				// console.log('NOT FILL RULES');
				return false;
			}
		};

	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {	
		
		main.Move = function(moveDeck, to, cursorMove) {
			
			var _deck_destination = null,// to
		    	_deck_departure   = null;// from
		    var _success = true;

		    _success = _success && to;

		    var _el = to && to.id && this.getElementById(to.id);

	    	if(_el) {
	    
	    		if(_el.type == 'card') {
		    		_deck_destination = this.getElementById(_el.parent)
		    	} else if(_el.type == 'deck') {
		    		_deck_destination = _el;
		    	}
		    }

		    _success = _success && _deck_destination;
	    	
	    	_deck_departure = moveDeck[0].card.parent && this.getElementById(moveDeck[0].card.parent);
	    	// console.log('DROP:', _dop.id, _deck_destination);
		    _success = _success && _deck_departure;

		    if(_deck_destination && _deck_destination.getId() != _deck_departure.getId()) {
			    
		    	var _put = _deck_destination.Put(moveDeck);
			    _success = _success && _put;
		    	
		    	if(_put && _deck_departure) {
		    		
		    		var _pop = _deck_departure.Pop(moveDeck.length);
		    		
		    		// console.log('MOVE', _deck_departure, _deck_departure.Pop, moveDeck.length);

				    _success = _success && _pop;
		    		
		    		if(_pop) {
		    			

		    			// положили в колоду
		    			// без анимации, просто перерисовка обеих колод

		    			_deck_destination.Push(_pop);

						main.event.dispatch('moveDragDeck', {
							departure   : _deck_departure,
							destination : _deck_destination,
							moveDeck    : moveDeck
						});

		    			// _deck_departure  .Redraw();
		    			// _deck_destination.Redraw();
						
						share.oneStepWay.move = {
							from : _deck_departure  .name,
							to   : _deck_destination.name,
							deck : share.deckCardNames(moveDeck)
						};

						var _deck = _deck_departure.getCards();
						if(_deck.length && _deck[_deck.length - 1].flip == true) {
							_deck[_deck.length - 1].flip = false;
							share.oneStepWay.unflip = {
								deck : _deck_departure.name,
								card : {
									name  : _deck[_deck.length - 1].name,
									index : _deck.length - 1
								}
							}
						}

						this.event.dispatch('makeStep', share.oneStepWay);
						
						// saveStep();
						
						// afterStep();
						
						this.winCheck({show : true});

		    		}
		    	}
		    	// A Pop()
		    	// B Push()
		    	// A, B Redraw()
		    } else {
		    	_success = false;
		    }

			// если не кдалось положить карты, вернуть обратно
	    	
	    	if(!_success && _deck_departure) {

	    		if(cursorMove.distance >= share.moveDistance) {

		    		var Tip = share.bestTip(moveDeck, cursorMove);
		    		if(Tip) {
		    			this.Move(moveDeck, Tip.to.deck.domElement, cursorMove);
		    		} else {
		    			main.event.dispatch('moveCardToHome', {
		    				moveDeck  : moveDeck,
		    				departure : _deck_departure
		    			});
			    		// share.moveCardToHome();
		    		}

	    		} else {
	    			main.event.dispatch('moveCardToHome', {
	    				moveDeck  : moveDeck,
	    				departure : _deck_departure
	    			});
		    		// share.moveCardToHome(moveDeck, _deck_departure);
	    		}

	    	}

	    	if(_success) {

	    		// afterMove();
		    	share.checkTips();
		    }

		}.bind(main);

	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		share.forceMove = function(a) {// {'from', 'to', deck[]}

			// console.log('forceMove', a);

			var _warn = function(index) {
				console.warn(index, 'Incorrect move.' + (share.debugLog ? '' : ' (use debugLog : true in field parameters for details)'));
				// if(share.debugLog == true) {console.log('Arguments:', a, index);}
			}
			
			if(!a.from || !a.to || !a.deck) {_warn(1);return;}
			if( typeof a.from != 'string' || typeof a.to != 'string') {_warn(2);return;}
			if(!a.deck.length) return;
			
			var _from = main.Deck(a.from);
			var _to   = main.Deck(a.to);

			if(!_from || !_to) {_warn(3);return;}
			
			var _check = true;
			var _from_deck = _from.getCards();
			
			for(i in _from_deck) {
				
				if(i >= _from_deck.length - a.deck.length) {
					var _id = i - (_from_deck.length|0) + (a.deck.length|0);
					if(a.deck[_id] && _from_deck[i].name != a.deck[_id]) {
						console.log(i, _id, _from_deck, _from_deck[i].name, a.deck[_id])
						_check = false;
					}
				}
			}
			
			if(_check) {
				var _pop = _from.Pop(a.deck.length);
				_to.Push(_pop);
			} else {
				_warn(4);
			}

			_from.Redraw();
			_to  .Redraw();
			//for(var i = deck.length;i;i -= 1) {
			//	_to.push(_to.getCards)
			//}

			share.checkTips();

		}/*.bind(main)*/;

	};

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		var wcm = share.winCheckMethods = {
				
			// Filters

			// возвращает колоды определённой группы/групп
			group : function(a) {
				if(!a.filter) return false;
				var _decks = [];
				for(var _i in a.decks) {
					
					// console.log('group filter:', _i, a.decks[_i].parent(), a.filterArgs);
					// var _parent = a.decks[_i].parent()
					// if(a.filterArgs.indexOf(a.decks[_i].parent())) {
					if(
						(
							typeof a.filterArgs  == "string" 
						 && a.decks[_i].parent() == a.filterArgs
						)
					 || a.filterArgs.indexOf(a.decks[_i].parent()) >= 0
					) {
						_decks.push(a.decks[_i]);
					}
				}
				a.decks = _decks;
				return _decks.length;
			},

			// Internal use

			_asc_desk : function(a) {

				if(!a || a.asc_desk == null || typeof a.asc_desk != 'number') return false;

				var _correct = true;
				
				for(var d in a.decks) {

					// console.log('_asc_desk', a.asc_desk ? 'asc' : 'desk', a.asc_desk, d, a.decks[d], _correct, a.decks[d].getCards());
					if(_correct == false) return false;
					
					var _cards = a.decks[d].getCards();
					// console.log('cards:', _cards);
					for(var c in _cards) {
						if(c > 0) {	
							var down = share.validateCardName(_cards[(c|0) - 1].name),
								up   = share.validateCardName(_cards[(c|0)].name);
							// console.log('_asc_desk', down, up, a.asc_desk);	
							_correct = _correct && down && up && share.cardsRankS.indexOf(down.rank) == (share.cardsRankS.indexOf(up.rank) + a.asc_desk);
							
						}
					}

				}
				return _correct;
			},

			// Simple rules

			newerWin : function() {
				console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.")
				return false;
			},

			// все колоды пусты

			allEmpty : function(a) {

				var _correct = true;
				for(var _i in a.decks) {
					_correct = _correct && a.decks[_i].getCards().length == 0;
				}
				return _correct;
			},

			// Combined rules (use like filter)

			// все карты в одной колоде
			allInOne : function(a) {

				// console.log('check Win, rule/filter - allInOne:', a);

				var _emptyDecksCount = 0,
					_decksLength     = 0,
					_fillIndex       = 0;
				for(var i in a.decks) {
					if(a.decks[i].getCards().length == 0) {
						_emptyDecksCount += 1;
					} else {
						fillIndex = i;
					}
					_decksLength += 1;
				}
				// console.log('allinone', a, _emptyDecksCount, _decksLength);
				var _correct = _emptyDecksCount == _decksLength - 1;
				if(a.filter) a.decks = _correct ? [a.decks[fillIndex]] : [];
				return _correct

					/*? a.rulesArgs 
						? _oneDeck 
						: true 
					: false;*/
			},

			// step by step 1, 2, 3
			// во всех колодах карты по возрастанию
			allAscend : function(a) {

				// console.log('check Win, rule - allAscending:', a);
				a.asc_desk = -1;
				return wcm._asc_desk(a);
			},
			
			// step by step 3, 2, 1
			// во всех колодах карты по убыванию
			allDescent : function(a) {
					
				// console.log('check Win, rule - allDescent:', a);
				a.asc_desk = 1;
				return wcm._asc_desk(a);
			},


			// Composite rules (input arguments)
			// комбинированное правило
			lego : function(_a) {
				
				// console.log(a.rulesArgs.filters, a.rulesArgs.rules)
				
				if(!_a || !_a.rulesArgs) return false;
				
				var _correct = true;
				
				// apply filters
				for(var next in _a.rulesArgs) {
				// console.log('check Win, LEGO RULE:', _a.rulesArgs[next]);

					var _decksClone = {};
					for(var i in _a.decks) _decksClone[i] = _a.decks[i];
					var a = {
						// filters : _a[next].filters,
						// rules   : _a[next].rules,
						decks   : _decksClone
					};

					// применяем фильтры, оставляем только интересующие колоды
					
					if(_correct && _a.rulesArgs[next].filters) {

						a.filter = true;
						

						for(var i in _a.rulesArgs[next].filters) {
							// console.log('LEGO FILTER', i, _a.rulesArgs[next].filters[i])

							if(typeof _a.rulesArgs[next].filters[i] == 'string' && wcm[_a.rulesArgs[next].filters[i]]) {

								// alert((function(a){var _c = 0;for(var _i in a){_c += 1;};return _c;})(a.decks));
								// console.log('apply filter', _a.rulesArgs[next].filters[i], 'start', a);
								
								_correct = _correct && wcm[_a.rulesArgs[next].filters[i]](a);
								// wcm[a.rulesArgs.filters[i]](a);
								
								// console.log('apply filter', a.rulesArgs.filters, 'result:', a);
							} else {
								if(typeof _a.rulesArgs[next].filters[i] == 'object') {

									// console.log('filters:', _a.rulesArgs[next].filters[i]);
									for(var filterName in _a.rulesArgs[next].filters[i]) {
										// var filterName = _a.rulesArgs[next].filters[i][filterIndex];
										// console.log('apply filter', filterName);
										if(wcm[filterName]) {
											a.filterArgs = _a.rulesArgs[next].filters[i][filterName]
											_correct = _correct && wcm[filterName](a);
										} else {
											_correct = _correct && wcm['newerWin']();
										}
									}
								} else {
									_correct = _correct && wcm['newerWin']();
								}
							}
						}
						
						a.filter = false;
					}

					// применяем правила к оставшимся колодам

					if(_a.rulesArgs[next].rules) {
						
						for(var i in _a.rulesArgs[next].rules) {
							// console.log('apply rule', _a.rulesArgs[next].rules[i])
							if(wcm[_a.rulesArgs[next].rules[i]]) {
								_correct = _correct && wcm[_a.rulesArgs[next].rules[i]](a);
							} else {
								console.log('#2')
								_correct = _correct && wcm['newerWin']();
							}
						}
					}

					// console.log('rules:', _correct ? 'success' : 'fail');
				}

				return _correct;
			}
		}

		main.winCheck = function(a) {
			if(!a) a = {};
			if(typeof a.show == 'undefined') a.show = false;
			// console.log('winCheck', a);
			return share.winCheck(a);
			// return winCheck({noCallback : true});
		}.bind(main);

		share.winCheck = function(params) {

			// var _decks = main.getDecks();
			
			if(typeof share.winCheckMethod == 'function') {
				if(share.winCheckMethod({
					decks : main.getDecks({visible : true})
				})) {
					EventManager.dispatch('win', params);
					// if(params && params.noCallback == true) return true;
					// a.winCheck.callback();
					return true;
				}
			} else {
				
				var rulesCorrect = true;
				var _hasMetods = false;
				for(var i in share.winCheckMethod) {
					_hasMetods = true;
					if(share.winCheckMethods[i]) {
	 					
	 					rulesCorrect = rulesCorrect && share.winCheckMethods[i]({
	 						decks     : main.getDecks({visible : true}), 
	 						rulesArgs : share.winCheckMethod[i]
	 					});

					} else {
						if(typeof share.winCheckMethod[i] == 'function') {
							rulesCorrect = rulesCorrect && share.winCheckMethod[i]({
								decks : main.getDecks({visible : true})
							});
						} else {
							rulesCorrect = rulesCorrect && share.winCheckMethods['newerWin']();
						}
					}
				}
				if(!_hasMetods) {
					rulesCorrect = rulesCorrect && share.winCheckMethods['newerWin']();
				}

				if(rulesCorrect) {
					if(params && params.noCallback == true) return true;
					main.event.dispatch('win', params);
					// a.winCheck.callback();
					return true;
				}

				return false;
				// return rulesCorrect;
			}
		}

	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		var deckActions = {
			
			"testDeckAction" : function() {
				// TODO
			},
			
			"twindeck" : function(e) {
				
				// console.log("twindeck action:", e);
				if(e.deck_from.iteration == 0) {
					return;
				}


				var deck_to = main.Deck(e.data.to);
				
				var moveCardsCount = e.data.count && typeof e.data.count == 'number' ? e.data.count : share.default_twindeck_move_card_count;
				
				// количество оставшихся карт в первой колоде
				var deckFromCardsCount = e.deck_from.getCards().length;
				
				if(deckFromCardsCount < moveCardsCount) {
					moveCardsCount = deckFromCardsCount;
				}
				
				// инициализация
				if(typeof e.deck_from.iteration == 'undefined') {
					// "-1" - infinity
					e.deck_from.iteration = -1;
					e.deck_from.twindeck = [];
				}

				// количество циклов перелистываний сначало до конца
				if(e.iterations && e.deck_from.iteration < 0) {
					e.deck_from.iteration = e.iterations
				}

				deck_to.hideCards();

				var _deck = deck_to.Pop(deck_to.getCards().length);

				// Step
				share.oneStepWay.twindeck = {};
				share.oneStepWay.twindeck.toHide = share.deckCardNames(_deck);
				
				_deck.reverse();
				for(i in _deck) {
					e.deck_from.twindeck.unshift(_deck[i]);
				}
				
				// первая колода пуста
				if(e.deck_from.twindeck && e.deck_from.twindeck.length && deckFromCardsCount == 0 && e.deck_from.iteration != 0) {
					// e.deck_from.twindeck.reverse();
					e.deck_from.Push(e.deck_from.twindeck);
					e.deck_from.twindeck = [];// unshift
				// перелистывание
				} else {
					var _deck = e.deck_from.Pop(moveCardsCount);
					deck_to.Push(_deck);
				}
				
				e.deck_from.showCards();
				
				// ------------ FLIP ------------
				// var _deck_from = e.deck_from.getCards();
				// var _deck_to = deck_to.getCards();
				
				e.deck_from.flipCheck();
				deck_to    .flipCheck();
				
				e.deck_from.Redraw();
				deck_to    .Redraw();
				
				// ------------ STEP ------------
				share.oneStepWay.twindeck.from      = e.deck_from.name,
				share.oneStepWay.twindeck.to        = deck_to    .name,
				share.oneStepWay.twindeck.moveCards = share.deckCardNames(_deck),
				share.oneStepWay.twindeck.iteration = (e.deck_from.iteration|0)
				
				// hiddenCards : share.deckCardNames(e.deck_from.twindeck), 
				// cards       : share.deckCardNames(e.deck_from.getCards()),

				if(typeof share.undoMethods == "undefined") {
					share.undoMethods = {};
				}

				// History extension
				share.undoMethods.twindeck = function(a) {
					if(a.twindeck) {
						
						var _deck_from = main.Deck(a.twindeck.from),
							_deck_to   = main.Deck(a.twindeck.to);
						
						// TODO
						// deck_to cards [moveCards] -> deck_from
						var _moveDeck = _deck_to.Pop(a.twindeck.moveCards.length);
						if(_moveDeck.length) {
							console.log('push#0', _moveDeck);
							_deck_from.Push(_moveDeck);
						}

						// deck_from.twindeck cards [toHide]  -> deck_to
						var _twindeck = [];
						for(i in a.twindeck.toHide) {
							if(_deck_from.twindeck.length) {
								_twindeck.push(
									_deck_from.twindeck.pop()
								);
							}
						}
						_twindeck.reverse();

						console.log('_deck_from.twindeck:', _deck_from.twindeck);
						console.log('a.twindeck.toHide:', a.twindeck.toHide);
						console.log('_twindeck:', _twindeck);
						
						if(_twindeck.length) {
							console.log('push#1');
							_deck_to.Push(_twindeck);
						}

						_deck_to.showCards();
						
						_deck_from.flipCheck();

						_deck_from.Redraw();
						_deck_to  .Redraw();
						
						console.log('twindeck undo:', a.twindeck, share.deckCardNames(_deck_from.twindeck));
					}
				}
				
				share.redoMethods.twindeck = function(a) {
					if(a.twindeck) {
						console.log('twindeck redo:', a.twindeck);
					}
				}

				main.event.dispatch('makeStep', share.oneStepWay);
				// ------------------------------

				share.checkTips();

				e.deck_from.iteration -= 1;

			}
		};

		main.event.listen('runDeckActions', function(e) {
			// console.log('runDeckActios:', e.deck);
			for(var actionName in e.deck.actions) {
				if(deckActions[actionName]) {
					deckActions[actionName]({
						deck_from : e.deck, 
						data      : e.deck.actions[actionName]
					});
				}
			}
		});

		main.event.listen('runDeckAction', function(e) {
			if(e.name && typeof deckActions[e.name] == 'string'/* && e.data*/) {
				deckActions[e.name](e.data);
			}
		});

		main.event.listen('addDeckAction', function(e) {
			console.log(deckActions);
			if(e.name && e.callback) deckActions[e.name] = e.callback;

		});

	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		
		share.flipTypes = {
			none    : function(card, i, length) {
				card.flip = false;
			},
			all     : function(card, i, length) {
				card.flip = true;
			},
			notlast : function(card, i, length) {
				card.flip = (i < length - 1) ? true : false;
			},
			first_1 : function(card, i, length) {
				card.flip = (i < 1) ? true : false;
			},
			first_2 : function(card, i, length) {
				card.flip = (i < 2) ? true : false;
			},
			first_3 : function(card, i, length) {
				card.flip = (i < 3) ? true : false;
			}
		}

	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {

		share.paddingTypes = {
					none : function(params, card, index, length, deck) {
						return {x : params.x, y : params.y};
					},
					last_three_min : function(params, card, index, length, deck) {
						if(index > length - 3) {
							if(length > 3) {
								return {
									x : params.x - (length - 3 - index) * 2,
									y : params.y - (length - 3 - index)
								};
							} else {
								return {
									x : params.x + (index * 2),
									y : params.y + (index|0)
								};
							}
						} else {
							return {x : x, y : y};
						}
					},
					twindeck_typeA : function(params, card, index, length, deck) {

						var twindeck_max_cards       = 24,
							twindeck_deck_length     = 3;
						
						var _padding = {
							x : 2,
							y : 1
						}

						var _depth = (length / twindeck_max_cards * twindeck_deck_length)|0;
						if(_depth >= twindeck_deck_length) _depth = twindeck_deck_length - 1;

						var _plus = index - (length - _depth - 1);
						if(_plus < 0) _plus = 0;

						return {
							x : params.x + _padding.x * _plus, 
							y : params.y + _padding.y * _plus
						};
					},
					radial : function(params, card, index, length, deck) {

			            //              b
			            //       C  ..`:   A = sin(b) * C
			            //     ...``   :B  B = cos(b) * C
			            // a.``.......+:
			            //        A     y 90deg
			            var _depth  = 1,
			            	_radius = index * _depth,
			            	_step   = 180 / 16,
			            	_card   = SolitaireEngine.options.card,
			            	_angle  = params.rotate,//_step / 2 + 270;
			            	_deg    = Math.PI / 180,
		                	_a      = Math.sin(_angle * _deg) * _radius,
		                	_b      = Math.cos(_angle * _deg) * _radius;
		                // if(_angle > 360) _angle -= 360;
						return {
		                    x : params.x + _a,// - _card.width  / 2,
	                        y : params.y - _b// - _card.height / 2
						};
			            // console.log('radial:', params, card, index, length, deck);
					},
					special : function(params, card, index, length, deck) {
						// console.log('special', share.padding_x, share.padding_y);
						var _y = params.y, _x = params.x;
						for(var i = 0; i < index; i += 1) {
							_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
							_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
						}
						// console.log('special padding:', index, share.flip_padding_x, share.flip_padding_y, share.padding_x, share.padding_y, _x, _y, deck);
						return {x : _x, y : _y};
					},
					vertical: function(params, card, index, length, deck) {
						var _y = params.y;
						for(var i = 0; i < index; i += 1) _y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
						var _return = {
							x : params.x,
							y : _y
						};
						// console.log('vertical:', deck.length, index, _return);
						return _return;
					},
					horizontal: function(params, card, index, length, deck) {
						var _x = params.x;
						for(var i = 0; i < index; i += 1) _x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
						var _return = {
							x : _x,
							y : params.y
						};
						// console.log('horizontal:', deck.length, index, _return);
						return _return;
					}
				}

	};

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function(main, share) {
		// пусть будет
		Math.sqr = function(i) {return i * i;}

		// var drag_el = null;
		share.dragDeck = null;
		share.startCursor = null;

		var top_z_index = 900;

		main.event.listen('undo', function() {
			/*share.moveCardToHome(
				share.dragDeck, 
				main.getDeckById(share.dragDeck[0].card.parent)
			);*/
			if(share.dragDeck) main.getDeckById(share.dragDeck[0].card.parent).Redraw();
			share.dragDeck    = null;
			share.startCursor = null;
		});

		main.event.listen('redo', function() {
			/*share.moveCardToHome(
				share.dragDeck, 
				main.getDeckById(share.dragDeck[0].card.parent)
			);*/
			if(share.dragDeck) main.getDeckById(share.dragDeck[0].card.parent).Redraw();
			share.dragDeck    = null;
			share.startCursor = null;
		});

	// -------------------------------------------------------------------------------------------------------------

		var cdown = function(target, x, y) {

			if(share.curLockState) return;

			try {
				$('.draggable').finish();
			} catch(e) {
				console.log(e);
			}

			// try{$('.draggable:animated').finish();}catch(e){console.log('Hmmm...', $('.draggable:animated'));}

		    if(share.dragDeck || share.startCursor) return;
		    
		    if( target.className.split(' ').indexOf('slot') >= 0 ) {
			    
			    var _id   = target.id,
			    	_deck = main.getElementById(_id);
		    	main.event.dispatch('runDeckActions', {
					deck : _deck
				});
		    }
		    
		    if( target.className.split(' ').indexOf('draggable') >= 0 ) {
			    
			    var _id     =                         target.id,
	    			_card   = _id                   ? main.getElementById(_id)  : null,
					_parent = _card && _card.parent ? _card.parent              : null,
					_deck   = _parent               ? main.getDeckById(_parent) : null;
				
				// console.log('card from deck:', _deck);
				
				main.event.dispatch('runDeckActions', {
					deck : _deck
				});
				
				// TODO
				// в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются
				
				// console.log(_id, _card, _parent, _deck, main.getElements())
				
				share.dragDeck = _deck ? _deck.Take(_id) : null;
				
				// console.log(share.dragDeck);
		    
		        if(share.dragDeck) {

		        	share.startCursor = {
		            	x  : x,
		            	y  : y
			        }

			        main.tipsDestination({currentCard : _card});
			    }
		    }

		    // console.log(share.dragDeck, share.startCursor);


		}

	// -------------------------------------------------------------------------------------------------------------

		var cmove = function(x, y) {

		    if(!share.dragDeck || !share.startCursor) return;

			// if(main.debugLabels()) {
				// var canvas = document.createElement('canvas');
				// canvas.setAttribute('width', 128);
				// canvas.setAttribute('height', 128);
				// canvas.setAttribute('id', 'canvas');
				// context = canvas.getContext("2d");
				// context.lineWidth = 2;
				// context.font = "12px Verdana";
				// context.fillStyle = "blue";//white";
				// context.strokeStyle = "white";//black";
				// var text = "(x:y): " + x + ":" + y;
				// context.strokeText(text, 15, 20);
				// context.fillText(text, 15, 20);
				// // if(share.dragDeck) $(share.dragDeck[0].card).hide();
				// var _el = document.elementFromPoint(x, y);
				// if(_el) {
				// text = "cursor on: " + _el.id;
				// 	// if(share.dragDeck) $(share.dragDeck[0].card).show();
				// 	context.strokeText(text, 15, 35);
				// 	context.fillText(text, 15, 35);
				// }
				// if(share.dragDeck) {
				// 	text = "take: " + share.dragDeck[0].card.id;
				// 	context.strokeText(text, 15, 50);
				// 	context.fillText(text, 15, 50);
				// 	text = "...(x:y): " + share.startCursor.x + ":" + share.startCursor.y;
				// 	context.strokeText(text, 15, 65);
				// 	context.fillText(text, 15, 65);
				// 	text = "dist.: " + _distance;
				// 	context.strokeText(text, 15, 80);
				// 	context.fillText(text, 15, 80);
				// }
				// var image = new Image();
				// image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QAAAAAAAD5Q7t/AAABiElEQVRYw+2WwUrDQBBA39TYpFUIFJRa8Cqkn+HVX+jNmydPfpsI6l/0Azz1VFuqZkOt4yGzNal6MokifTAku2GTl9lld+CXEYuWXQEUeLNrIwTAnhrAPrBbEKqVlkUIMBwOUdUF0DGx2iVawI4XmE6nXmLelISf+wDAOde4RFBsZFnGZiZEJAZS4JUaFmZJwDm3vm9KItjscM6tRZqQ+CQQRVGpXbdESSCKIsIwLIn0ej2A2iRKAv7jWZYxGAwAGI/HpQEm0QVWlQt40jSl3++v/15ELoFnYGFRKV3gWFU1jmO/HV+pqiZJokmS+L4T4AiIgYh8D/kx/iUKMJvNEJEL4BbyBVhMjGUhBZZUtAhb9qKlpXoEXAOPInI+mUyA9QJ8sDErKpp/L7ACMhE5A26AGTAH7r/IQpuKUl8kIJ/TjkXb2gfASAsAh/a8MqQQHrW/7JDXBqfkJ+YLcAc8YVNWlcB3/QH5MR2awBLILFZ1C/hnvmARPkq1Rsu1LVu2/E9sW9/yN3gHxBjGgvpF0o0AAAAASUVORK5CYII=";
				// image.onload = function() {
				//     context.drawImage(image, 0, 0, 30, 30);
				// 	$('#mat').css({cursor : 'url(\'' + canvas.toDataURL() + '\'), pointer'});
				// };
			// }

			var _distance = share.startCursor ? Math.sqrt(Math.sqr(x - share.startCursor.x) + Math.sqr(y - share.startCursor.y)) : 0;

	    	var _deck = main.getElementById(share.dragDeck[0].card.parent);
		    for(i in share.dragDeck) {
		    	var _position = _deck.padding(share.dragDeck[i].index);
		    	var _params = {
		    		left      : (_position.x + (x - share.startCursor.x)) + 'px',
		    		top       : (_position.y + (y - share.startCursor.y)) + 'px',
		    		// transform : 'rotate(0deg)',
		    		zIndex    : top_z_index + (i|0)
		    	}
		    	// Operations with DOM
		    	$(share.dragDeck[i].card.domElement).css(_params);
		    }


		    var cursorMove = {
		    	distance     : _distance,
		    	direction    : {
			    	x     : x - share.startCursor.x,// (+) rigth / (-) left
			    	y     : y - share.startCursor.y,// (+) down  / (-) up
			    	right : x > share.startCursor.x,
			    	left  : x < share.startCursor.x,
			    	down  : y > share.startCursor.y,
			    	up    : y < share.startCursor.y
		    	},
		    	lastPosition : {
		    		x : x,
		    		y : y
		    	},
		    	deckPosition : {
		    		x : (_position.x + (x - share.startCursor.x)),
		    		y : (_position.y + (y - share.startCursor.y))
		    	}
		    }
		    
		    main.tipsMove({moveDeck : share.dragDeck, cursorMove : cursorMove});

		    //$('#' + drag_el.id).css({display: 'none'});
		    /*/var _dop = document.elementFromPoint(x, y)
		    if(_dop) {
		    	//console.log('DRAG:', _dop.id);
		    }/*/
		    /*/$('#' + drag_el.id).css({
		        left : ( (x|0) - (drag_el.cursor.x|0) + (drag_el.el.x|0) ) + 'px',
		        top  : ( (y|0) - (drag_el.cursor.y|0) + (drag_el.el.y|0) ) + 'px',
		        display: 'block'
		    });/*/
		}

	// -------------------------------------------------------------------------------------------------------------

		var cend = function(target, x, y) {

		    if(!share.dragDeck || !share.startCursor) return;

	    	var _deck = main.getElementById(share.dragDeck[0].card.parent);
	    	var _position = _deck.padding(share.dragDeck[0].index);

		    var cursorMove = {
		    	distance     : Math.sqrt(Math.sqr(x - share.startCursor.x) + Math.sqr(y - share.startCursor.y)),
		    	direction    : {
			    	x     : x - share.startCursor.x,// (+) rigth / (-) left
			    	y     : y - share.startCursor.y,// (+) down  / (-) up
			    	right : x > share.startCursor.x,
			    	left  : x < share.startCursor.x,
			    	down  : y > share.startCursor.y,
			    	up    : y < share.startCursor.y
		    	},
		    	lastPosition : {
		    		x : x,
		    		y : y
		    	},
		    	deckPosition : {
		    		x : (_position.x + (x - share.startCursor.x)),
		    		y : (_position.y + (y - share.startCursor.y))
		    	}
		    }

		    $(target).hide();
		    var _dop = document.elementFromPoint(x, y);
		    $(target).show();
		    // if(_dop) {
	    	main.Move(share.dragDeck, _dop, cursorMove);
		    // }

		    share.dragDeck = share.startCursor = null;

		}

	// -------------------------------------------------------------------------------------------------------------

		document.onmousedown = function(e) {
			if(e.button != 0) return;
		    cdown(e.target, e.clientX, e.clientY)
		}
		document.onmousemove = function(e) {
		    cmove(e.clientX, e.clientY)
		}
		document.onmouseup = function(e) {
			// if(e.button != 0) return;
		    cend(e.target, e.clientX, e.clientY)
		}

		document.addEventListener('touchstart', function(e) {
		    // e.preventDefault()
		    cdown(e.target, e.touches[0].clientX, e.touches[0].clientY)
		}, false);
		document.addEventListener('touchmove', function(e) {
			if(share.startCursor) e.preventDefault();
		    cmove(e.touches[0].clientX, e.touches[0].clientY)
		}, false);
		document.addEventListener('touchend', function(e) {
		    // e.preventDefault()
		    cend(e.changedTouches[0].target, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		}, false);
	};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9Tb2xpdGFpcmVFbmdpbmUuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgODY5MDBiY2JlNjg1YmUzODhhZDgiLCJ3ZWJwYWNrOi8vLy4vU29saXRhaXJlRW5naW5lLm1haW4uanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9Tb2xpdGFpcmVDb21tb24uanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9kZWJ1Zy5qcyIsIndlYnBhY2s6Ly8vLi9leHRlbnNpb25zL0ZpZWxkLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvYWRkR3JvdXAuanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9hZGREZWNrLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvRG9tTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9leHRlbnNpb25zL2RlY2tHZW5lcmF0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9Tb2xpdGFpcmVIaXN0b3J5LmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvdGlwc1J1bGVzLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvVGlwcy5qcyIsIndlYnBhY2s6Ly8vLi9leHRlbnNpb25zL2Jlc3RUaXAuanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9yZWFkeVRha2VSdWxlcy5qcyIsIndlYnBhY2s6Ly8vLi9leHRlbnNpb25zL3JlYWR5UHV0UnVsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9maWxsUnVsZXMuanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9Nb3ZlLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvZm9yY2VNb3ZlLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvd2luQ2hlY2suanMiLCJ3ZWJwYWNrOi8vLy4vZXh0ZW5zaW9ucy9hZGREZWNrQWN0aW9uLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvZmxpcFR5cGVzLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvcGFkZGluZ1R5cGVzLmpzIiwid2VicGFjazovLy8uL2V4dGVuc2lvbnMvRHJhZ05Ecm9wLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKVxuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuXG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRleHBvcnRzOiB7fSxcbiBcdFx0XHRpZDogbW9kdWxlSWQsXG4gXHRcdFx0bG9hZGVkOiBmYWxzZVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKDApO1xuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogd2VicGFjay9ib290c3RyYXAgODY5MDBiY2JlNjg1YmUzODhhZDhcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG4vKlxyXG4gKiBTb2xpdGFpcmUgZ2FtZSBlbmdpbmVcclxuICogYnkgUm9tYW4gQmF1ZXIgLSBrb3RhcGVzaWNAZ21haWwuY29tXHJcbiAqIE9jdC4gMjAxNVxyXG4gKiBXZWJwYWNrIHZlcnNpb24gMjQgRmViLiAyMDE2XHJcbiAqL1xyXG5cclxudmFyIFNvbGl0YWlyZUV4dGVuc2lvbnMgPSB7fTtcclxuXHJcblNvbGl0YWlyZUV4dGVuc2lvbnMuU29saXRhaXJlQ29tbW9uICA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy9Tb2xpdGFpcmVDb21tb24nKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5kZWJ1ZyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2RlYnVnJyk7XHJcblNvbGl0YWlyZUV4dGVuc2lvbnMuRmllbGQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy9GaWVsZCcpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLmFkZEdyb3VwICAgICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvYWRkR3JvdXAnKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5hZGREZWNrICAgICAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2FkZERlY2snKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5Eb21NYW5hZ2VyICAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL0RvbU1hbmFnZXInKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5kZWNrR2VuZXJhdG9yICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2RlY2tHZW5lcmF0b3InKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5Tb2xpdGFpcmVIaXN0b3J5ID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL1NvbGl0YWlyZUhpc3RvcnknKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy50aXBzUnVsZXMgICAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL3RpcHNSdWxlcycpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLlRpcHMgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvVGlwcycpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLmJlc3RUaXAgICAgICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvYmVzdFRpcCcpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLnJlYWR5VGFrZVJ1bGVzICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvcmVhZHlUYWtlUnVsZXMnKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5yZWFkeVB1dFJ1bGVzICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL3JlYWR5UHV0UnVsZXMnKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5maWxsUnVsZXMgICAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL2ZpbGxSdWxlcycpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLk1vdmUgICAgICAgICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvTW92ZScpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLmZvcmNlTW92ZSAgICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvZm9yY2VNb3ZlJyk7XHJcblNvbGl0YWlyZUV4dGVuc2lvbnMud2luQ2hlY2sgICAgICAgICA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy93aW5DaGVjaycpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLmFkZERlY2tBY3Rpb24gICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvYWRkRGVja0FjdGlvbicpO1xyXG5Tb2xpdGFpcmVFeHRlbnNpb25zLmZsaXBUeXBlcyAgICAgICAgPSByZXF1aXJlKCcuL2V4dGVuc2lvbnMvZmxpcFR5cGVzJyk7XHJcblNvbGl0YWlyZUV4dGVuc2lvbnMucGFkZGluZ1R5cGVzICAgICA9IHJlcXVpcmUoJy4vZXh0ZW5zaW9ucy9wYWRkaW5nVHlwZXMnKTtcclxuU29saXRhaXJlRXh0ZW5zaW9ucy5EcmFnTkRyb3AgICAgICAgID0gcmVxdWlyZSgnLi9leHRlbnNpb25zL0RyYWdORHJvcCcpO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tIElOREVYIC0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG52YXIgc2hhcmUgPSB7fSxcclxuXHRtYWluID0gbmV3IGZ1bmN0aW9uKCkge1xyXG5cdFxyXG5cdHRoaXMuZXZlbnQgPSBuZXcgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIGV2ZW50cyA9IHt9O1xyXG5cclxuXHRcdHRoaXMubGlzdGVuID0gZnVuY3Rpb24obmFtZSwgY2FsbGJhY2spIHtcclxuXHRcdFx0aWYodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycgfHwgdHlwZW9mIGNhbGxiYWNrICE9ICdmdW5jdGlvbicpIHJldHVybjtcclxuXHRcdFx0aWYoZXZlbnRzW25hbWVdKSB7XHJcblx0XHRcdFx0ZXZlbnRzW25hbWVdLnB1c2goY2FsbGJhY2spO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGV2ZW50c1tuYW1lXSA9IFtjYWxsYmFja107XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0dGhpcy5kaXNwYXRjaCA9IGZ1bmN0aW9uKG5hbWUsIGRhdGEpIHtcclxuXHRcdFx0aWYoZXZlbnRzW25hbWVdKSB7XHJcblx0XHRcdFx0Zm9yKGkgaW4gZXZlbnRzW25hbWVdKSB7XHJcblx0XHRcdFx0XHRldmVudHNbbmFtZV1baV0oZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH1cclxufTtcclxuXHJcbmZvcih2YXIgaSBpbiBTb2xpdGFpcmVFeHRlbnNpb25zKSB7XHJcblx0U29saXRhaXJlRXh0ZW5zaW9uc1tpXShtYWluLCBzaGFyZSk7XHJcbn07XHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuZXhwb3J0cy5tYWluID0gbWFpbjtcclxuXG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL1NvbGl0YWlyZUVuZ2luZS5tYWluLmpzXG4gKiogbW9kdWxlIGlkID0gMFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRzaGFyZS5lbGVtZW50cyA9IHt9O1xyXG5cclxuXHRzaGFyZS5jYXJkc1N1aXRzICAgPSBbJ2gnLCAnZCcsICdjJywgJ3MnXTsgLy8gUmVkLCBSZWQsIEJsYWNrLCBCbGFja1xyXG5cdHNoYXJlLmNhcmRDb2xvcnMgICA9IHtcclxuXHRcdCdyZWQnICAgOiBbJ2gnLCAnZCddLFxyXG5cdFx0J2JsYWNrJyA6IFsnYycsICdzJ11cclxuXHR9XHJcblx0Ly8gc2hhcmUucmVkQ2FyZHMgICAgID0gO1xyXG5cdC8vIHNoYXJlLmJsYWNrQ2FyZHMgICA9IFsnYycsICdzJ107XHJcblx0c2hhcmUuY2FyZHNSYW5rICAgID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAnaicsICdxJywgJ2snXTtcclxuXHRzaGFyZS5jYXJkc1JhbmtTICAgPSBbJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJzEwJywgJ2onLCAncScsICdrJ107XHJcblx0c2hhcmUuY2FyZHNSYW5rSW50ID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzXTtcclxuXHJcblx0c2hhcmUuZmllbGQgPSBudWxsO1xyXG5cdFxyXG5cdHNoYXJlLmRlZmF1bHRfY2FuX21vdmVfZmxpcCA9IGZhbHNlO1xyXG5cdHNoYXJlLmRlZmF1bHRfc2hvd1Nsb3QgICAgICA9IGZhbHNlO1xyXG5cdHNoYXJlLmRlZmF1bHRfYXV0b2hpZGUgICAgICA9IGZhbHNlO1xyXG5cclxuXHRzaGFyZS5kZWZhdWx0X3BhZGRpbmdUeXBlID0gJ25vbmUnLFxyXG5cdHNoYXJlLmRlZmF1bHRfZmxpcF90eXBlICAgPSAnbm9uZScsXHJcblx0c2hhcmUuZGVmYXVsdF90YWtlTmFtZSAgICA9ICdvbmx5dG9wJyxcclxuXHRzaGFyZS5kZWZhdWx0X3B1dE5hbWUgICAgID0gJ2FueSc7XHJcblxyXG5cdHNoYXJlLmRlZmF1bHRfdGlwUnVsZSA9ICdhbGxUb0FsbCc7XHJcblxyXG5cdHNoYXJlLmRlZmF1bHRfcGFkZGluZ195ICAgICAgPSAyMDtcclxuXHRzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeCAgICAgID0gMjA7XHJcblx0c2hhcmUuZGVmYXVsdF9mbGlwX3BhZGRpbmdfeSA9IDU7XHJcblx0c2hhcmUuZGVmYXVsdF9mbGlwX3BhZGRpbmdfeCA9IDIwO1xyXG5cdHNoYXJlLmRlZmF1bHRfc3RhcnRfel9pbmRleCAgPSAxO1xyXG5cdHNoYXJlLmRlZmF1bHRfbW92ZV9kaXN0YW5jZSAgPSAxMDtcclxuXHJcblx0c2hhcmUuZGVmYXVsdF90aGVtZSA9ICdkZWZhdWx0X3RoZW1lJztcclxuXHRcclxuXHRzaGFyZS5hbmltYXRpb25UaW1lID0gMzAwO1xyXG5cclxuXHRzaGFyZS5kZWZhdWx0X3R3aW5kZWNrX21vdmVfY2FyZF9jb3VudCA9IDM7XHJcblx0Ly8gc2hhcmUuZGVmYXVsdF90d2luZGVja19tYXhfY2FyZHMgICAgICAgPSA3O1xyXG5cdC8vIHNoYXJlLmRlZmF1bHRfdHdpbmRlY2tfZGVja19sZW5ndGggICAgID0gMztcclxuXHJcblx0c2hhcmUuVGlwcyAgICAgICAgICAgICAgICA9IG51bGwsXHJcblx0c2hhcmUubW92ZURpc3RhbmNlICAgICAgICA9IDAsICAgICAvLyBkZWZhdWx0IDBcclxuXHRzaGFyZS5zaG93VGlwcyAgICAgICAgICAgID0gdHJ1ZSwgIC8vIGRlZmF1bHQgdHJ1ZVxyXG5cdHNoYXJlLnNob3dUaXBzRGVzdGluYXRpb24gPSBmYWxzZSwgLy8gZGVmYXVsdCBmYWxzZVxyXG5cdHNoYXJlLnNob3dUaXBQcmlvcml0eSAgICAgPSBmYWxzZTsgLy8gZGVmYXVsdCBmYWxzZVxyXG5cclxuXHRzaGFyZS5kZWJ1Z0xhYmVscyA9IGZhbHNlO1xyXG5cdHNoYXJlLnN0YXJ0X3pfaW5kZXggPSBzaGFyZS5kZWZhdWx0X3N0YXJ0X3pfaW5kZXg7XHJcblxyXG5cdHNoYXJlLm9uZVN0ZXBXYXkgPSB7fTtcclxuXHJcblx0c2hhcmUuZGVidWdMb2cgPSBmYWxzZTtcclxuXHJcblx0c2hhcmUuY2FuX21vdmVfZmxpcCA9IG51bGw7XHJcblxyXG5cdHNoYXJlLnpvb20gPSAxLjA7XHJcblx0XHJcblx0c2hhcmUuY2FyZCA9IHtcclxuXHQgICAgd2lkdGggICAgICAgOiA3MSxcclxuXHQgICAgaGVpZ2h0ICAgICAgOiA5NlxyXG5cdH1cclxuXHJcblx0c2hhcmUuc2F2ZVN0ZXBDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XHJcblx0c2hhcmUud2luQ2hlY2tDYWxsYmFjayA9IGZ1bmN0aW9uKCkge307XHJcblx0c2hhcmUuYXV0b1RpcHMgPSBmdW5jdGlvbigpIHt9O1xyXG5cclxuXHR2YXIgX2lkID0gMDtcclxuXHRzaGFyZS5nZW5JZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIF9pZCsrO1xyXG5cdH1cclxuXHJcblx0bWFpbi5vcHRpb25zID0ge1xyXG5cdFx0Y2FyZCA6IHNoYXJlLmNhcmRcclxuXHR9O1xyXG5cclxuXHQvLyBMb2NrL1VubG9ja1xyXG5cclxuXHRzaGFyZS5sb2NrID0gZmFsc2U7XHJcblxyXG5cdG1haW4ubG9jayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYoc2hhcmUuZGVidWdMb2cpIGNvbnNvbGUubG9nKCdMT0NLJyk7XHJcblx0XHRzaGFyZS5sb2NrID0gdHJ1ZTtcclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdG1haW4udW5sb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihzaGFyZS5kZWJ1Z0xvZykgY29uc29sZS5sb2coJ1VOTE9DSycpO1xyXG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKCdhc2RhJyk7XHJcblx0XHRzaGFyZS5sb2NrID0gZmFsc2U7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRzaGFyZS5jdXJMb2NrU3RhdGUgPSBmYWxzZTtcclxuXHRzaGFyZS5jdXJMb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRzaGFyZS5jdXJMb2NrU3RhdGUgPSB0cnVlO1xyXG5cdH1cclxuXHRzaGFyZS5jdXJVbkxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdHNoYXJlLmN1ckxvY2tTdGF0ZSA9IGZhbHNlO1xyXG5cdH1cclxuXHJcblx0bWFpbi5nZXRFbGVtZW50cyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHNoYXJlLmVsZW1lbnRzO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblx0bWFpbi5nZXRFbGVtZW50c0J5TmFtZSA9IGZ1bmN0aW9uKG5hbWUsIHR5cGUpIHtcclxuXHRcdHZhciBzID0gW107XHJcblx0XHRmb3IoaSBpbiBzaGFyZS5lbGVtZW50cykge1xyXG5cdFx0XHRpZihzaGFyZS5lbGVtZW50c1tpXS5uYW1lICYmIHR5cGVvZiBzaGFyZS5lbGVtZW50c1tpXS5uYW1lID09ICdzdHJpbmcnICYmIHNoYXJlLmVsZW1lbnRzW2ldLm5hbWUgPT0gbmFtZSkge1xyXG5cdFx0XHRcdGlmKHR5cGUgJiYgdHlwZW9mIHNoYXJlLmVsZW1lbnRzW2ldLnR5cGUgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0XHRcdGlmKHR5cGUgJiYgc2hhcmUuZWxlbWVudHNbaV0udHlwZSA9PSB0eXBlKSB7XHJcblx0XHRcdFx0XHRcdHMucHVzaChzaGFyZS5lbGVtZW50c1tpXSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRzLnB1c2goc2hhcmUuZWxlbWVudHNbaV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRzLnB1c2goc2hhcmUuZWxlbWVudHNbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHM7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLmdldEVsZW1lbnRCeUlkID0gZnVuY3Rpb24oYSkge1xyXG5cdFx0cmV0dXJuIHNoYXJlLmVsZW1lbnRzW2FdO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ21ha2VTdGVwJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0c2hhcmUuc2F2ZVN0ZXBDYWxsYmFjayhlKTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdjbGVhciBzaGFyZS5vbmVTdGVwV2F5Jywgb25seXRvcGVTdGVwV2F5KTtcclxuXHRcdHNoYXJlLm9uZVN0ZXBXYXkgPSB7fTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdzaGFyZS5vbmVTdGVwV2F5IGNsZWFyZWQnLCBzaGFyZS5vbmVTdGVwV2F5KTtcclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3dpbicsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCd3aW4nLCBzaGFyZS53aW5DaGVja0NhbGxiYWNrLCBlKTtcclxuXHRcdGlmKGUgJiYgZS5zaG93KSBzaGFyZS53aW5DaGVja0NhbGxiYWNrKGUpO1xyXG5cdH0pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbignbmV3R2FtZScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdHNoYXJlLmNoZWNrVGlwcygpO1xyXG5cdH0pO1xyXG5cclxuXHRzaGFyZS52YWxpZGF0ZUNhcmROYW1lID0gZnVuY3Rpb24obmFtZSwgbm9sb2cpIHtcclxuXHRcdGlmKHR5cGVvZiBuYW1lICE9ICdzdHJpbmcnKSB7XHJcblx0XHRcdGlmKCFub2xvZykgY29uc29sZS5sb2coJ1dhcm5pbmc6IHZhbGlkYXRlIG5hbWUgbXVzdCBoYXZlIHN0cmluZyB0eXBlJywgbmFtZSk7XHJcblx0XHRcdC8vIHRocm93IG5ldyBFcnJvcigneicpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHR2YXIgc3VpdCAgPSBuYW1lLnNsaWNlKDAsIDEpLFxyXG5cdFx0XHRyYW5rICA9IG5hbWUuc2xpY2UoMSwgMyksXHJcblx0XHRcdGNvbG9yID0gbnVsbDtcclxuXHRcdFx0Zm9yKHZhciBjb2xvck5hbWUgaW4gc2hhcmUuY2FyZENvbG9ycykge1xyXG5cdFx0XHRcdGlmKHNoYXJlLmNhcmRDb2xvcnNbY29sb3JOYW1lXS5pbmRleE9mKHN1aXQpID49IDApIHtcclxuXHRcdFx0XHRcdGNvbG9yID0gY29sb3JOYW1lO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3ZhbGlkYXRlQ2FyZE5hbWU6JywgY29sb3IsIHN1aXQsIHJhbmspO1xyXG5cdFx0aWYoIHNoYXJlLmNhcmRzU3VpdHMuaW5kZXhPZihzdWl0KSA+PSAwICYmIHNoYXJlLmNhcmRzUmFua1MuaW5kZXhPZihyYW5rKSA+PSAwICkge1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdHN1aXQgIDogc3VpdCwgXHJcblx0XHRcdFx0cmFuayAgOiByYW5rLFxyXG5cdFx0XHRcdGNvbG9yIDogY29sb3IgXHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmKCFub2xvZykgY29uc29sZS5sb2coJ1dhcm5pbmc6IHZhbGlkYXRlIG5hbWU6JywgbmFtZSwgJy0gaW5jb3JyZWN0Jyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4dGVuc2lvbnMvU29saXRhaXJlQ29tbW9uLmpzXG4gKiogbW9kdWxlIGlkID0gMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHQvLyBkZWJ1Z1xyXG5cdG1haW4uZGVidWdTaG93U2hhcmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdGNvbnNvbGUubG9nKHNoYXJlKTtcclxuXHR9XHJcblxyXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tIEhpc3RvcnkgLS0tLS0tLS0tLS0tLS0tLS1cclxuXHR2YXIgZGVidWdIaXN0b3J5ID0gbmV3IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHJcblx0XHR2YXIgX2hpc3RvcnkgPSBbXSxcclxuXHRcdFx0X3JlZG8gICAgPSBbXTtcclxuXHRcdFxyXG5cdFx0dGhpcy5yZWNvcmQgPSBmdW5jdGlvbihkYXRhKSB7XHJcblxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnUkVDT1JEIEhJU1RPUlk6JywgZGF0YSk7XHJcblx0XHRcdFxyXG5cdFx0XHRfcmVkbyA9IFtdO1xyXG5cdFx0XHRfaGlzdG9yeS5wdXNoKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLnVuZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zdGVwID0gX2hpc3RvcnkucG9wKCk7XHJcblx0XHRcdGlmKF9zdGVwKSBfcmVkby5wdXNoKF9zdGVwKTtcclxuXHRcdFx0cmV0dXJuIF9zdGVwO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLnJlZG8gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIF9zdGVwID0gX3JlZG8ucG9wKCk7XHJcblx0XHRcdGlmKF9zdGVwKSBfaGlzdG9yeS5wdXNoKF9zdGVwKTtcclxuXHRcdFx0cmV0dXJuIF9zdGVwO1xyXG5cdFx0fVxyXG5cclxuXHRcdG1haW4uZXZlbnQubGlzdGVuKCdtYWtlU3RlcCcsIHRoaXMucmVjb3JkKTtcclxuXHJcblx0XHQvLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCBmdW5jdGlvbigpIHtcclxuXHJcblx0XHQkKGRvY3VtZW50LmJvZHkpLmFwcGVuZChcclxuXHRcdFx0JChcIjxkaXY+XCIpLmFwcGVuZChcclxuXHRcdFx0XHQkKFwiPHNwYW4+XCIpLmFkZENsYXNzKCdhd2Vzb21lJykudGV4dCgnVU5ETycpLmNsaWNrKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0dmFyIF9kYXRhID0gdGhpcy51bmRvKCk7XHJcblx0XHRcdFx0XHQvLyBcdGNvbnNvbGUubG9nKCd1bmRvOicsIF9kYXRhKTtcclxuXHRcdFx0XHRcdGlmKF9kYXRhKSB7XHJcblx0XHRcdFx0XHRcdFNvbGl0YWlyZUVuZ2luZS5ldmVudC5kaXNwYXRjaCgndW5kbycsIF9kYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LmJpbmQodGhpcy8qe0hNIDogdGhpcywgY2FsbGJhY2sgOiBtYWluLk1vdmUoKX0qLykpXHJcblx0XHRcdCkuYXBwZW5kKFxyXG5cdFx0XHRcdCQoXCI8c3Bhbj5cIikuYWRkQ2xhc3MoJ2F3ZXNvbWUnKS50ZXh0KCdSRURPJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR2YXIgX2RhdGEgPSB0aGlzLnJlZG8oKTtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdyZWRvOicsIF9kYXRhKTtcclxuXHRcdFx0XHRcdGlmKF9kYXRhKSB7XHJcblx0XHRcdFx0XHRcdFNvbGl0YWlyZUVuZ2luZS5ldmVudC5kaXNwYXRjaCgncmVkbycsIF9kYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LmJpbmQodGhpcykpXHJcblx0XHRcdCkuY3NzKHtwb3NpdGlvbiA6ICdmaXhlZCcsIHRvcCA6ICcxcHgnLCBsZWZ0IDogJzFweCd9KVxyXG5cdFx0KTtcclxuXHRcdC8vIH0pO1xyXG5cdH1cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leHRlbnNpb25zL2RlYnVnLmpzXG4gKiogbW9kdWxlIGlkID0gMlxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFxyXG5cdG1haW4uRmllbGQgPSBmdW5jdGlvbihfYSkge1xyXG5cclxuXHRcdGlmKCFfYSAmJiBzaGFyZS5maWVsZCkgcmV0dXJuIHNoYXJlLmZpZWxkO1xyXG5cdFx0aWYoIV9hKSByZXR1cm4gZmFsc2U7XHJcblxyXG5cdFx0aWYoX2EgJiYgc2hhcmUuZmllbGQpIHtcclxuXHRcdFx0c2hhcmUuZmllbGQuY2xlYXIoKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGEgPSBudWxsO1xyXG5cdFx0dHJ5IHtcclxuXHRcdFx0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX2EpKTtcclxuXHRcdH0gY2F0Y2goZSkge1xyXG5cdFx0XHRhID0gX2E7XHJcblx0XHRcdGNvbnNvbGUud2FybignRmllbGQgaW5wdXQgcGFyYW1zIGlzIG5vdCBKU09OLCBtYXliZSB0aGUgcnVsZXMgYXJlIHdyb25nLicpO1xyXG5cdFx0fVxyXG5cclxuXHJcblx0XHRzaGFyZS5ob21lR3JvdXBzID0gYS5ob21lR3JvdXBzID8gYS5ob21lR3JvdXBzIDogbnVsbDtcclxuXHRcdFxyXG5cdFx0c2hhcmUuZmllbGQgPSBuZXcgKGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHJcblx0XHRcdG1haW4udW5sb2NrKCk7XHJcblx0XHR9KShhKTtcclxuXHRcdFxyXG5cdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnaW5pdEZpZWxkJywge1xyXG5cdFx0XHRhICAgICA6IGEvLywgXHJcblx0XHRcdC8vIGZpZWxkIDogc2hhcmUuZmllbGRcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNoYXJlLmRlYnVnTG9nID0gYS5kZWJ1Z0xvZyAmJiB0eXBlb2YgYS5kZWJ1Z0xvZyA9PSAnYm9vbGVhbicgPyBhLmRlYnVnTG9nIDogc2hhcmUuZGVidWdMb2c7XHJcblxyXG5cdFx0Ly8gVGlwc1xyXG5cclxuXHRcdHNoYXJlLnNob3dUaXBzICAgICAgICAgICAgPSB0eXBlb2YgYS5zaG93VGlwcyAgICAgICAgICAgID09ICdib29sZWFuJyA/IGEuc2hvd1RpcHMgICAgICAgICAgICA6IHNoYXJlLnNob3dUaXBzO1xyXG5cdFx0c2hhcmUuc2hvd1RpcHNEZXN0aW5hdGlvbiA9IHR5cGVvZiBhLnNob3dUaXBzRGVzdGluYXRpb24gPT0gJ2Jvb2xlYW4nID8gYS5zaG93VGlwc0Rlc3RpbmF0aW9uIDogc2hhcmUuc2hvd1RpcHNEZXN0aW5hdGlvbjtcclxuXHRcdHNoYXJlLnNob3dUaXBQcmlvcml0eSAgICAgPSB0eXBlb2YgYS5zaG93VGlwUHJpb3JpdHkgICAgID09ICdib29sZWFuJyA/IGEuc2hvd1RpcFByaW9yaXR5ICAgICA6IHNoYXJlLnNob3dUaXBQcmlvcml0eTtcclxuXHJcblx0XHRzaGFyZS5hdXRvVGlwcyA9IGEuYXV0b1RpcHMgXHJcblx0XHQ/IHR5cGVvZiBhLmF1dG9UaXBzID09ICdzdHJpbmcnXHJcblx0XHRcdD8gc2hhcmUudGlwc1J1bGVzW2EuYXV0b1RpcHNdXHJcblx0XHRcdFx0PyBzaGFyZS50aXBzUnVsZXNbYS5hdXRvVGlwc11cclxuXHRcdFx0XHQ6IHNoYXJlLnRpcHNSdWxlc1tzaGFyZS5kZWZhdWx0X3RpcFJ1bGVdXHJcblx0XHRcdDogYS5hdXRvVGlwcyAvL2Z1bmN0aW9uIE9SIG9iamVjdFxyXG5cdFx0OiBzaGFyZS50aXBzUnVsZXNbc2hhcmUuZGVmYXVsdF90aXBSdWxlXTtcclxuXHJcblx0XHRpZihkb2N1bWVudC5sb2NhdGlvbi5oYXNoID09IFwiI2dvZFwiKSB7XHJcblx0XHRcdGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gXCI8aDE+PSk8L2gxPlwiO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNoYXJlLm1vdmVEaXN0YW5jZSA9IGEubW92ZURpc3RhbmNlICYmIHR5cGVvZiBhLm1vdmVEaXN0YW5jZSA9PSAnbnVtYmVyJyA/IGEubW92ZURpc3RhbmNlIDogc2hhcmUuZGVmYXVsdF9tb3ZlX2Rpc3RhbmNlO1xyXG5cclxuXHRcdC8vIGNoZWNrIFdpblxyXG5cclxuXHRcdHNoYXJlLndpbkNoZWNrTWV0aG9kID0gKFxyXG5cdFx0XHRhLndpbkNoZWNrXHJcblx0XHQgLy8gJiYgYS53aW5DaGVjay5jYWxsYmFjayAmJiB0eXBlb2YgYS53aW5DaGVjay5jYWxsYmFjayA9PSAnZnVuY3Rpb24nXHJcblx0XHQgJiYgYS53aW5DaGVjay5ydWxlc1xyXG5cdFx0KSA/IHR5cGVvZiBhLndpbkNoZWNrLnJ1bGVzID09ICdzdHJpbmcnXHJcblx0XHRcdD8gc2hhcmUud2luQ2hlY2tNZXRob2RzW2Eud2luQ2hlY2sucnVsZXNdXHJcblx0XHRcdFx0PyBzaGFyZS53aW5DaGVja01ldGhvZHNbYS53aW5DaGVjay5ydWxlc11cclxuXHRcdFx0XHQ6IHNoYXJlLndpbkNoZWNrTWV0aG9kc1snbmV3ZXJXaW4nXVxyXG5cdFx0XHQ6IGEud2luQ2hlY2sucnVsZXNcclxuXHRcdFx0Ly8gOiB0eXBlb2YgYS53aW5DaGVjay5tZXRob2QgPT0gJ2Z1bmN0aW9uJ1xyXG5cdFx0XHQvLyBcdD8gYS53aW5DaGVjay5tZXRob2RcclxuXHRcdFx0Ly8gXHQ6IGEud2luQ2hlY2subWV0aG9kXHJcblx0XHQgIDogc2hhcmUud2luQ2hlY2tNZXRob2RzWyduZXdlcldpbiddO1xyXG5cclxuXHRcdGlmKGEud2luQ2hlY2sgJiYgYS53aW5DaGVjay5jYWxsYmFjayAmJiB0eXBlb2YgYS53aW5DaGVjay5jYWxsYmFjayA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHdpbkNoZWNrQ2FsbGJhY2sgPSBhLndpbkNoZWNrLmNhbGxiYWNrO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGV4dGVuc2lvbjogd2luQ2hlY2tNZXRob2RzXHJcblxyXG5cdFx0aWYoYS5zYXZlU3RlcCAmJiB0eXBlb2YgYS5zYXZlU3RlcCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKCdhLnNhdmVTdGVwJywgYS5zYXZlU3RlcCk7XHJcblx0XHRcdHNhdmVTdGVwQ2FsbGJhY2sgPSBhLnNhdmVTdGVwO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHBhcmFuZXRlcnMgYW5kIHZhbHVlc1xyXG5cclxuXHRcdGlmKGEuem9vbSAmJiB0eXBlb2YgYS56b29tID09ICdudW1iZXInKSB7XHJcblx0XHRcdHNoYXJlLnpvb20gPSBhLnpvb21cclxuXHRcdH1cclxuXHJcblx0XHRzaGFyZS5jYW5fbW92ZV9mbGlwID0gYS5jYW5fbW92ZV9mbGlwICYmIHR5cGVvZiBhLmNhbl9tb3ZlX2ZsaXAgPT0gJ2Jvb2xlYW4nIFxyXG5cdFx0XHQ/IGEuY2FuX21vdmVfZmxpcCBcclxuXHRcdFx0OiBzaGFyZS5kZWZhdWx0X2Nhbl9tb3ZlX2ZsaXA7XHJcblxyXG5cdFx0aWYoYS5kZWJ1Z0xhYmVscyAmJiB0eXBlb2YgYS5kZWJ1Z0xhYmVscyA9PSAnYm9vbGVhbicpIHtcclxuXHRcdFx0c2hhcmUuZGVidWdMYWJlbHMgPSBhLmRlYnVnTGFiZWxzXHJcblx0XHR9XHJcblxyXG5cdFx0aWYoYS5ncm91cHMpIGZvcih2YXIgZ3JvdXBOYW1lIGluIGEuZ3JvdXBzKSB7XHJcblx0XHRcdC8qaWYoYS5ncm91cHNbaV0uZWxlbWVudHMpIGZvcihlIGluIGEuZ3JvdXBzW2ldLmVsZW1lbnRzKSB7XHJcblx0XHRcdFx0bWFpbi5hZGREZWNrKGEuZ3JvdXBzW2ldLmVsZW1lbnRzW2VdKVxyXG5cdFx0XHR9Ki9cclxuXHRcdFx0YS5ncm91cHNbZ3JvdXBOYW1lXS5uYW1lID0gZ3JvdXBOYW1lO1xyXG5cdFx0XHRtYWluLmFkZEdyb3VwKGEuZ3JvdXBzW2dyb3VwTmFtZV0pO1xyXG5cdFx0fVxyXG5cdFx0aWYoYS5kZWNrcykgZm9yKHZhciBlIGluIGEuZGVja3MpIHtcclxuXHRcdFx0bWFpbi5hZGREZWNrKGEuZGVja3NbZV0pO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNoZWNrVGlwcygpXHJcblxyXG5cdFx0aWYoYS5zdGFydFpJbmRleCAmJiB0eXBlb2YgYS5zdGFydFpJbmRleCA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRzaGFyZS5zdGFydF96X2luZGV4ID0gYS5zdGFydFpJbmRleDtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBmaWxsIGVsZW1lbnRzIGluIGZpZWxkXHJcblx0XHRcclxuXHRcdGlmKGEuZmlsbCkge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gdmFyIF9pc0RlY2sgPSB0cnVlO1xyXG5cdFx0XHQvLyBmb3IoaSBpbiBhLmZpbGwpIF9pc0RlY2sgPSBfaXNEZWNrICYmIHZhbGlkYXRlQ2FyZE5hbWUoYS5maWxsW2ldLCB0cnVlKTtcclxuXHRcdFx0Ly8gX2lzRGVjayA9IF9pc0RlY2sgJiYgYS5maWxsLmxlbmd0aDtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGlmKF9pc0RlY2spIHtcclxuXHRcdFx0XHQvLyBUT0RPXHJcblx0XHRcdFx0Ly8gRmlsbCBmaWVsZCwgYWxsIGRlY2tzXHJcblx0XHRcdFx0Ly8gZmllbGQuZmlsbChhLmZpbGwpO1xyXG5cdFx0XHQvLyB9IGVsc2Uge1xyXG5cdFx0XHRmb3IodmFyIF9uYW1lIGluIGEuZmlsbCkge1xyXG5cdFx0XHRcdHZhciBfZWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzQnlOYW1lKF9uYW1lKTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gX2VsZW1lbnRzKSB7XHJcblx0XHRcdFx0XHRpZihbJ2RlY2snLCAnZ3JvdXAnXS5pbmRleE9mKF9lbGVtZW50c1tpXS50eXBlKSAmJiB0eXBlb2YgYS5maWxsW19uYW1lXSAhPSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0XHRfZWxlbWVudHNbaV0uRmlsbChhLmZpbGxbX25hbWVdKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmKGEuY2FyZExvYWRlciAmJiB0eXBlb2YgYS5jYXJkTG9hZGVyID09ICdmdW5jdGlvbicpIHsvLyAmJiBhLmNhcmRzU2V0KSB7XHJcblx0XHRcdGEuY2FyZExvYWRlcihhLmNhcmRzU2V0LCBtYWluKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBzaGFyZS5jaGVja1RpcHMoKTsgLy8gaGFzIGluICduZXdHYW1lJyBsaXN0ZW5lclxyXG5cclxuXHRcdC8vIENsZWFyIGZpZWxkXHJcblxyXG5cdFx0c2hhcmUuZmllbGQuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NsZWFyIGZpZWxkJyk7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBzaGFyZS5lbGVtZW50cykge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGVsZW1lbnRzW2ldKTtcclxuXHRcdFx0XHRpZihzaGFyZS5lbGVtZW50c1tpXS50eXBlID09ICdkZWNrJykge1xyXG5cdFx0XHRcdFx0c2hhcmUuZWxlbWVudHNbaV0uY2xlYXIoKTtcclxuXHRcdFx0XHRcdHNoYXJlLmVsZW1lbnRzW2ldID0gbnVsbDtcclxuXHRcdFx0XHR9IGVsc2UgaWYoc2hhcmUuZWxlbWVudHNbaV0udHlwZSA9PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0XHRzaGFyZS5lbGVtZW50c1tpXSA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHNoYXJlLmVsZW1lbnRzID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gUmVkcmF3IGZpZWxkXHJcblxyXG5cdFx0c2hhcmUuZmllbGQuUmVkcmF3ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBhID0gbnVsbDtcclxuXHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoX2EpKTtcclxuXHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0YSA9IF9hO1xyXG5cdFx0XHRcdGNvbnNvbGUud2FybignRmllbGQuUmVkcmF3IGlucHV0IHBhcmFtcyBpcyBub3QgSlNPTiwgY2FuXFwndCBjbG9uZScpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRmb3IodmFyIF9ncm91cE5hbWUgaW4gYS5ncm91cHMpIHtcclxuXHRcdFx0XHR2YXIgX2dyb3VwID0gbWFpbi5Hcm91cChfZ3JvdXBOYW1lKTtcclxuXHRcdFx0XHRpZihfZ3JvdXApIHtcclxuXHRcdFx0XHRcdF9ncm91cC5SZWRyYXcoYS5ncm91cHNbX2dyb3VwTmFtZV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvKmZvcihfZGVja0luZGV4IGluIGEuZ3JvdXBzW19ncm91cE5hbWVdKSB7XHJcblx0XHRcdFx0XHRhLmdyb3Vwc1tfZ3JvdXBOYW1lXVtfZGVja0luZGV4XS5uYW1lXHJcblx0XHRcdFx0fSovXHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yKHZhciBpIGluIGEuZGVja3MpIHtcclxuXHRcdFx0XHQvL3ZhciBfcGFyZW50ID0gbWFpbi5nZXRFbGVtZW50QnlJZChfZGVja3NbaV0ucGFyZW50KCkpO1xyXG5cdFx0XHRcdC8vdmFyIF9wYXJlbnROYW1lID0gX3BhcmVudCA/IF9wYXJlbnQubmFtZSA6IG51bGw7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gbWFpbi5EZWNrKGEuZGVja3NbaV0ubmFtZSk7XHJcblx0XHRcdFx0aWYoX2RlY2spIHtcclxuXHRcdFx0XHRcdF9kZWNrLlJlZHJhdyhhLmRlY2tzW2ldKTtcclxuXHRcdFx0XHR9IC8qZWxzZSB7XHJcblx0XHRcdFx0XHRfZGVja3NbaV0uUmVkcmF3KGEuZ3JvdXBzW19wYXJlbnROYW1lXSk7XHJcblx0XHRcdFx0fSovXHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qZmllbGQuZmlsbCA9IGZ1bmN0aW9uKGEpIHt9OyovXHJcblx0XHR0aGlzLmV2ZW50LmRpc3BhdGNoKCduZXdHYW1lJyk7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9GaWVsZC5qc1xuICoqIG1vZHVsZSBpZCA9IDNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHRcclxuXHRtYWluLmFkZEdyb3VwID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdGlmKCFhKSByZXR1cm4gZmFsc2U7XHJcblx0XHR2YXIgX2lkID0gJ2dyb3VwXycgKyBzaGFyZS5nZW5JZCgpO1xyXG5cdFx0dmFyIF9lbF9ncm91cCA9IG5ldyAoZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy50eXBlID0gJ2dyb3VwJztcclxuXHRcdFx0dmFyIGlkID0gX2lkO1xyXG5cdFx0XHR0aGlzLmdldElkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLm5hbWUgPSBhLm5hbWUgJiYgdHlwZW9mIGEubmFtZSA9PSAnc3RyaW5nJyA/IGEubmFtZSA6ICgnbmFtZV8nICsgaWQpO1xyXG5cclxuXHRcdFx0dmFyIHggPSBhLnBvc2l0aW9uICYmIGEucG9zaXRpb24ueCAmJiB0eXBlb2YgYS5wb3NpdGlvbi54ID09ICdudW1iZXInICA/IGEucG9zaXRpb24ueCA6IDAsXHJcblx0XHRcdFx0eSA9IGEucG9zaXRpb24gJiYgYS5wb3NpdGlvbi55ICYmIHR5cGVvZiBhLnBvc2l0aW9uLnkgPT0gJ251bWJlcicgID8gYS5wb3NpdGlvbi55IDogMCxcclxuXHRcdFx0XHRwbGFjZW1lbnQgPSBhLnBsYWNlbWVudCA/IHt4IDogYS5wbGFjZW1lbnQueCA/IGEucGxhY2VtZW50LnggOiAwLCB5IDogYS5wbGFjZW1lbnQueSA/IGEucGxhY2VtZW50LnkgOiAwfSA6IG51bGxcclxuXHJcblx0XHRcdHZhciBkZWNrcyA9IHt9O1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0YHQvtGF0YDQsNC90Y/QtdC8INCw0YLRgNC40LHRg9GC0Ysg0YfRgtC+0LHRiyDQv9GA0L7QutC40L3Rg9GC0Ywg0LjRhSDQutC+0LvQvtC00LDQvFxyXG5cclxuXHRcdFx0dmFyIHBhZGRpbmdUeXBlICA9IGEucGFkZGluZ1R5cGUgID8gYS5wYWRkaW5nVHlwZSAgOiBudWxsLFxyXG5cdFx0XHRcdGZsaXAgICAgICAgICA9IGEuZmxpcCAgICAgICAgID8gYS5mbGlwICAgICAgICAgOiBudWxsLFxyXG5cdFx0XHRcdHRha2UgICAgICAgICA9IGEudGFrZSAgICAgICAgID8gYS50YWtlICAgICAgICAgOiBudWxsLFxyXG5cdFx0XHRcdHNob3dTbG90ICAgICA9IGEuc2hvd1Nsb3QgICAgID8gYS5zaG93U2xvdCAgICAgOiBudWxsLFxyXG5cdFx0XHRcdHRha2VSdWxlcyAgICA9IGEudGFrZVJ1bGVzICAgID8gYS50YWtlUnVsZXMgICAgOiBudWxsLFxyXG5cdFx0XHRcdHB1dFJ1bGVzICAgICA9IGEucHV0UnVsZXMgICAgID8gYS5wdXRSdWxlcyAgICAgOiBudWxsLFxyXG5cdFx0XHRcdGZpbGxSdWxlICAgICA9IGEuZmlsbFJ1bGUgICAgID8gYS5maWxsUnVsZSAgICAgOiBudWxsLFxyXG5cdFx0XHRcdGF1dG9IaWRlICAgICA9IGEuYXV0b0hpZGUgICAgID8gYS5hdXRvSGlkZSAgICAgOiBudWxsLFxyXG5cdFx0XHRcdHBhZGRpbmdYICAgICA9IGEucGFkZGluZ1ggICAgID8gYS5wYWRkaW5nWCAgICAgOiBudWxsLFxyXG5cdFx0XHRcdHBhZGRpbmdZICAgICA9IGEucGFkZGluZ1kgICAgID8gYS5wYWRkaW5nWSAgICAgOiBudWxsLFxyXG5cdFx0XHRcdGZsaXBQYWRkaW5nWCA9IGEuZmxpcFBhZGRpbmdYID8gYS5mbGlwUGFkZGluZ1ggOiBudWxsLFxyXG5cdFx0XHRcdGZsaXBQYWRkaW5nWSA9IGEuZmxpcFBhZGRpbmdZID8gYS5mbGlwUGFkZGluZ1kgOiBudWxsO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0YHQvtGA0YLQuNGA0L7QstC60LAg0Y3Qu9C10LzQtdC90YLQvtCyINCyINCz0YDRg9C/0L/QtSDQv9C+INC30LDQtNCw0L3QvdC+0LzRgyDQuNC90LTQtdC60YHRgyDQuCDQv9C+0YDRj9C00LrRgyDQtNC+0LHQsNCy0LvQtdC90LjRj1xyXG5cclxuXHRcdFx0dmFyIGRlY2tJbmRleCA9IFtdO1xyXG5cdFx0XHQvLyBmb3IoaSBpbiBkZWNrcykgZGVja0luZGV4LnB1c2gobnVsbCk7XHJcblx0XHRcclxuXHRcdFx0Ly8gQWRkIGRlY2sgdG8gZ3JvdXBcclxuXHJcblx0XHRcdHRoaXMuYWRkRGVjayA9IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHRcdFx0aWYoIWEpIHJldHVybjtcclxuXHRcdFx0XHRpZighYS5wb3NpdGlvbikgYS5wb3NpdGlvbiA9IHt4IDogMCwgeSA6IDB9O1xyXG5cdFx0XHRcdGlmKCFhLnBvc2l0aW9uLngpIGEucG9zaXRpb24ueCA9IDA7XHJcblx0XHRcdFx0aWYoIWEucG9zaXRpb24ueSkgYS5wb3NpdGlvbi55ID0gMDtcclxuXHJcblx0XHRcdFx0aWYoIWEucGFyZW50KSBhLnBhcmVudCA9IHRoaXMubmFtZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRhLnBhcmVudFBvc2l0aW9uID0ge3ggOiB4LCB5IDogeX07XHJcblx0XHRcdFx0Ly8gYS5wb3NpdGlvbiA9IGEucG9zaXRpb24gPyB7eCA6IGEucG9zaXRpb24ueCArIHgsIHkgOiBhLnBvc2l0aW9uLnkgKyB5fSA6IHt4IDogeCwgeSA6IHl9O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vINGA0LDRgdGB0YLQsNCy0LvRj9C10Lwg0LrQvtC70L7QtNGLINCyINCz0YDRg9C/0L/QtVxyXG5cdFx0XHRcdC8vIDEg0L/RgNC40L7RgNC10YLQtdGCINC+0YLQtNCw0ZHRgtGB0Y8g0L/QsNGA0LDQvNC10YLRgNGDIGdyb3VwSW5kZXhcclxuXHRcdFx0XHQvLyDQvtGB0YLQsNC70YzQvdGL0LUg0LLRgdGC0LDQstC70Y/RjtGC0YHRjyDQsiDQv9GA0L7QvNC10LbRg9GC0LrQuCDQuNC70Lgg0LTQvtCx0LDQstC70Y/RjtGC0YHRjyDQsiDQutC+0L3QtdGGXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIF9pbmRleCA9IDA7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoYS5ncm91cEluZGV4ICYmIHR5cGVvZiBhLmdyb3VwSW5kZXggPT0gJ251bWJlcicgJiYgZGVja0luZGV4W2EuZ3JvdXBJbmRleCAtIDFdICYmIGRlY2tzW2RlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXV0uZGVja0luZGV4ID09IGEuZGVja0luZGV4KSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLndhcm4oJ1dhcm5pbmc6IGR1cGxpY2F0ZSBncm91cEluZGV4JywgYS5ncm91cEluZGV4LCAnY2hhbmdlZCB0byBudWxsJyk7XHJcblx0XHRcdFx0XHRhLmdyb3VwSW5kZXggPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoYS5ncm91cEluZGV4ICYmIHR5cGVvZiBhLmdyb3VwSW5kZXggPT0gJ251bWJlcicpIHtcclxuXHJcblx0XHRcdFx0XHRpZihkZWNrSW5kZXhbYS5ncm91cEluZGV4IC0gMV0pIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGZvcig7dHlwZW9mIGRlY2tJbmRleFtfaW5kZXhdICE9ICd1bmRlZmluZWQnO19pbmRleCArPSAxKSB7fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYocGxhY2VtZW50KSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3BsYWNlbWVudCMxJyk7XHJcblx0XHRcdFx0XHRcdFx0aWYocGxhY2VtZW50LngpIHNoYXJlLmVsZW1lbnRzW2RlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXV0ueCh4ICsgKHBsYWNlbWVudC54ICsgY2FyZC53aWR0aCkgICogX2luZGV4KTtcclxuXHRcdFx0XHRcdFx0XHRpZihwbGFjZW1lbnQueSkgc2hhcmUuZWxlbWVudHNbZGVja0luZGV4W2EuZ3JvdXBJbmRleCAtIDFdXS55KHkgKyAocGxhY2VtZW50LnkgKyBjYXJkLndpZHRoKSAgKiBfaW5kZXgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRkZWNrSW5kZXhbX2luZGV4XSA9IGRlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXTtcclxuXHRcdFx0XHRcdFx0ZGVja0luZGV4W2EuZ3JvdXBJbmRleCAtIDFdID0gdHJ1ZTsvL2EubmFtZSAmJiB0eXBlb2YgYS5uYW1lID09ICdzdHJpbmcnID8gYS5uYW1lIDogdHJ1ZTtcclxuXHRcdFx0XHRcdFx0X2luZGV4ID0gYS5ncm91cEluZGV4IC0gMVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGRlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXSA9IHRydWU7Ly9hLm5hbWUgJiYgdHlwZW9mIGEubmFtZSA9PSAnc3RyaW5nJyA/IGEubmFtZSA6IHRydWU7XHJcblx0XHRcdFx0XHRcdF9pbmRleCA9IGEuZ3JvdXBJbmRleCAtIDFcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Zm9yKDt0eXBlb2YgZGVja0luZGV4W19pbmRleF0gIT0gJ3VuZGVmaW5lZCc7X2luZGV4ICs9IDEpIHt9XHJcblx0XHRcdFx0XHRkZWNrSW5kZXhbX2luZGV4XSA9IHRydWU7Ly9hLm5hbWUgJiYgdHlwZW9mIGEubmFtZSA9PSAnc3RyaW5nJyA/IGEubmFtZSA6IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vINGB0LzQtdGJ0LDQtdC8INC60L7QvtGA0LTQuNC90LDRgtGLINC60L7Qu9C+0LQg0L7RgtC90L7RgdC40YLQutC70YzQvdC+INC60L7QvtGA0LTQuNC90LDQtCDQs9GA0YPQv9C/0YtcclxuXHJcblx0XHRcdFx0aWYocGxhY2VtZW50KSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygncGxhY2VtZW50IzInLCBwbGFjZW1lbnQpO1xyXG5cdFx0XHRcdFx0aWYocGxhY2VtZW50LngpIGEucG9zaXRpb24ueCA9IC8qeCArICovKHBsYWNlbWVudC54ICsgc2hhcmUuY2FyZC53aWR0aCkgICogKF9pbmRleCk7XHJcblx0XHRcdFx0XHRpZihwbGFjZW1lbnQueSkgYS5wb3NpdGlvbi55ID0gLyp5ICsgKi8ocGxhY2VtZW50LnkgKyBzaGFyZS5jYXJkLmhlaWdodCkgKiAoX2luZGV4KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vINC/0YDQvtC60LjQtNGL0LLQsNC10Lwg0L3QtdC60L7RgtC+0YDRi9C1INCw0YLRgNC40LHRg9GC0Ysg0LLRgdC10Lwg0LrQvtC70L7QtNCw0Lwg0LPRgNGD0L/Qv9GLICjRgyDQsNGC0YDQuNCx0YPRgtC+0LIg0LfQsNC00LDQvdC90YvRhSDQutC+0LvQvtC00LUg0L/RgNC40L7RgNC40YLQtdGCINCy0YvRiNC1KVxyXG5cclxuXHRcdFx0XHQvLyBpZihwYWRkaW5nVHlwZSAgJiYgIWEucGFkZGluZ1R5cGUpICBhLnBhZGRpbmdUeXBlICA9IHBhZGRpbmdUeXBlO1xyXG5cdFx0XHRcdC8vIGlmKGZsaXAgICAgICAgICAmJiAhYS5mbGlwKSAgICAgICAgIGEuZmxpcCAgICAgICAgID0gZmxpcDtcclxuXHRcdFx0XHQvLyBpZih0YWtlICAgICAgICAgJiYgIWEudGFrZSkgICAgICAgICBhLnRha2UgICAgICAgICA9IHRha2U7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYocGFkZGluZ1R5cGUgICYmIHR5cGVvZiBhLnBhZGRpbmdUeXBlICA9PSBcInVuZGVmaW5lZFwiKSBhLnBhZGRpbmdUeXBlICA9IHBhZGRpbmdUeXBlO1xyXG5cdFx0XHRcdGlmKGZsaXAgICAgICAgICAmJiB0eXBlb2YgYS5mbGlwICAgICAgICAgPT0gXCJ1bmRlZmluZWRcIikgYS5mbGlwICAgICAgICAgPSBmbGlwO1xyXG5cdFx0XHRcdGlmKHRha2UgICAgICAgICAmJiB0eXBlb2YgYS50YWtlICAgICAgICAgPT0gXCJ1bmRlZmluZWRcIikgYS50YWtlICAgICAgICAgPSB0YWtlO1xyXG5cdFx0XHRcdGlmKHNob3dTbG90ICAgICAmJiB0eXBlb2YgYS5zaG93U2xvdCAgICAgPT0gXCJ1bmRlZmluZWRcIikgYS5zaG93U2xvdCAgICAgPSBzaG93U2xvdDtcclxuXHRcdFx0XHRpZih0YWtlUnVsZXMgICAgJiYgdHlwZW9mIGEudGFrZVJ1bGVzICAgID09IFwidW5kZWZpbmVkXCIpIGEudGFrZVJ1bGVzICAgID0gdGFrZVJ1bGVzO1xyXG5cdFx0XHRcdGlmKHB1dFJ1bGVzICAgICAmJiB0eXBlb2YgYS5wdXRSdWxlcyAgICAgPT0gXCJ1bmRlZmluZWRcIikgYS5wdXRSdWxlcyAgICAgPSBwdXRSdWxlcztcclxuXHRcdFx0XHRpZihmaWxsUnVsZSAgICAgJiYgdHlwZW9mIGEuZmlsbFJ1bGUgICAgID09IFwidW5kZWZpbmVkXCIpIGEuZmlsbFJ1bGUgICAgID0gZmlsbFJ1bGU7XHJcblx0XHRcdFx0aWYoYXV0b0hpZGUgICAgICYmIHR5cGVvZiBhLmF1dG9IaWRlICAgICA9PSBcInVuZGVmaW5lZFwiKSBhLmF1dG9IaWRlICAgICA9IGF1dG9IaWRlO1xyXG5cdFx0XHRcdC8vIGNoYW5nZWRcclxuXHRcdFx0XHRpZihwYWRkaW5nWCAgICAgJiYgdHlwZW9mIGEucGFkZGluZ1ggICAgID09IFwidW5kZWZpbmVkXCIpIGEucGFkZGluZ1ggICAgID0gcGFkZGluZ1g7XHJcblx0XHRcdFx0aWYocGFkZGluZ1kgICAgICYmIHR5cGVvZiBhLnBhZGRpbmdZICAgICA9PSBcInVuZGVmaW5lZFwiKSBhLnBhZGRpbmdZICAgICA9IHBhZGRpbmdZO1xyXG5cdFx0XHRcdGlmKGZsaXBQYWRkaW5nWCAmJiB0eXBlb2YgYS5mbGlwUGFkZGluZ1ggPT0gXCJ1bmRlZmluZWRcIikgYS5mbGlwUGFkZGluZ1ggPSBmbGlwUGFkZGluZ1g7XHJcblx0XHRcdFx0aWYoZmxpcFBhZGRpbmdZICYmIHR5cGVvZiBhLmZsaXBQYWRkaW5nWSA9PSBcInVuZGVmaW5lZFwiKSBhLmZsaXBQYWRkaW5nWSA9IGZsaXBQYWRkaW5nWTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgX2VsID0gbWFpbi5hZGREZWNrKGEpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIF9lbC5wYXJlbnQoX2lkKTsvLyB3cml0ZVxyXG5cdFx0XHRcdGRlY2tJbmRleFtfaW5kZXhdID0gX2VsLmdldElkKCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0ZGVja3NbX2VsLmdldElkKCldID0gX2VsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBHZXQgZGVja3MgZnJvbSBncm91cFxyXG5cclxuXHRcdFx0dGhpcy5nZXREZWNrcyA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHR2YXIgX2RlY2tzID0gW107XHJcblx0XHRcdFx0Zm9yKGkgaW4gZGVja3MpIHtcclxuXHRcdFx0XHRcdGlmKGEgJiYgYS52aXNpYmxlKSB7XHJcblx0XHRcdFx0XHRcdGlmKGRlY2tzW2ldLnZpc2libGUpIHtcclxuXHRcdFx0XHRcdFx0XHRfZGVja3MucHVzaChkZWNrc1tpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF9kZWNrcy5wdXNoKGRlY2tzW2ldKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIF9kZWNrcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXREZWNrQnlJZCA9IGZ1bmN0aW9uKGlkKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlY2tzW2lkXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXREZWNrc0J5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHR2YXIgX2RlY2tzID0ge307XHJcblx0XHRcdFx0Zm9yKGQgaW4gZGVja3MpIHtcclxuXHRcdFx0XHRcdGlmKGRlY2tzW2RdLm5hbWUgPT0gbmFtZSkge1xyXG5cdFx0XHRcdFx0XHRfZGVja3NbZF0gPSBkZWNrc1tkXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIF9kZWNrcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gRmlsbCBncm91cFxyXG5cclxuXHRcdFx0dGhpcy5GaWxsID0gZnVuY3Rpb24oY2FyZE5hbWVzKSB7XHJcblxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdmaWxsIEdyb3VwJywgdGhpcy5uYW1lLCBjYXJkTmFtZXMsIGRlY2tzKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgZGVja0luZGV4ID0gW107XHJcblx0XHRcdFx0dmFyIF9kZWNrc0xlbmd0aCA9IDA7XHJcblxyXG5cdFx0XHRcdC8vINGB0L7Qt9C00LDRkdC8INC60LDRgNGC0Ysg0LjQtyDRgdC/0LjRgdC60LAgY2FyZE5hbWVzINCyINC/0L7RgNGP0LTQutC1INC+0YfQtdGA0ZHQtNC90L7RgdGC0Lgg0LrQvtC70L7QtCAo0L/QviDQvtC00L3QvtC5INC60LDRgNGC0LUpXHJcblxyXG5cdFx0XHRcdGZvcihpIGluIGRlY2tzKSB7XHJcblx0XHRcdFx0XHRfZGVja3NMZW5ndGggKz0gMTtcclxuXHRcdFx0XHRcdGRlY2tJbmRleC5wdXNoKG51bGwpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IoaSBpbiBkZWNrcykge1xyXG5cdFx0XHRcdFx0aWYoZGVja3NbaV0uZ3JvdXBJbmRleCAmJiBkZWNrc1tpXS5ncm91cEluZGV4IDw9IF9kZWNrc0xlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRkZWNrSW5kZXhbZGVja3NbaV0uZ3JvdXBJbmRleCAtIDFdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IoaSBpbiBkZWNrcykge1xyXG5cdFx0XHRcdFx0aWYoIWRlY2tzW2ldLmdyb3VwSW5kZXgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIF9pbmRleCA9IDA7XHJcblx0XHRcdFx0XHRcdGZvcig7ZGVja0luZGV4W19pbmRleF0gIT0gbnVsbDtfaW5kZXggKz0gMSkge31cclxuXHRcdFx0XHRcdFx0ZGVja0luZGV4W19pbmRleF0gPSBkZWNrc1tpXS5nZXRJZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yKGkgaW4gZGVja3MpIHtcclxuXHRcdFx0XHRcdGlmKGRlY2tzW2ldLmdyb3VwSW5kZXggJiYgZGVja3NbaV0uZ3JvdXBJbmRleCA8PSBfZGVja3NMZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0ZGVja0luZGV4W2RlY2tzW2ldLmdyb3VwSW5kZXggLSAxXSA9IGRlY2tzW2ldLmdldElkKCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgX2RlY2tzV2l0aEJpZ0luZGV4ID0ge31cclxuXHRcdFx0XHRmb3IoaSBpbiBkZWNrcykge1xyXG5cdFx0XHRcdFx0aWYoZGVja3NbaV0uZ3JvdXBJbmRleCAmJiBkZWNrc1tpXS5ncm91cEluZGV4ID4gX2RlY2tzTGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF9kZWNrc1dpdGhCaWdJbmRleFtkZWNrc1tpXS5ncm91cEluZGV4IC0gMV0gPSBkZWNrc1tpXS5nZXRJZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yKGkgaW4gX2RlY2tzV2l0aEJpZ0luZGV4KSB7XHJcblx0XHRcdFx0XHR2YXIgX2luZGV4ID0gMDtcclxuXHRcdFx0XHRcdGZvcig7ZGVja0luZGV4W19pbmRleF0gIT0gbnVsbDtfaW5kZXggKz0gMSkge31cclxuXHRcdFx0XHRcdGRlY2tJbmRleFtfaW5kZXhdID0gZGVja3NbX2RlY2tzV2l0aEJpZ0luZGV4W2ldXS5nZXRJZCgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIF9jaGVja0RlY2sgPSB0cnVlO1xyXG5cdFx0XHRcdGZvcihpIGluIGNhcmROYW1lcykge1xyXG5cdFx0XHRcdFx0X2NoZWNrRGVjayA9IF9jaGVja0RlY2sgJiYgdHlwZW9mIGNhcmROYW1lc1tpXSA9PSAnc3RyaW5nJzsvL3NoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoY2FyZE5hbWVzW2ldKVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYoX2NoZWNrRGVjaykge1xyXG5cdFx0XHRcdFx0Zm9yKGkgaW4gY2FyZE5hbWVzKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyDRhtC40LrQu9C40YfQvdC+INC00L7QsdCw0LLQu9GP0LXRgiDQutCw0YDRgtGLINCyINC60L7Qu9C+0LTRiyDQsiDQs9GA0YPQv9C/0LUgKNCyINC/0L7RgNGP0LTQutC1INC00L7QsdCw0LLQu9C10L3QuNGPKVxyXG5cdFxyXG5cdFx0XHRcdFx0XHR2YXIgX2luZGV4ID0gZGVja0luZGV4W2kgJSBkZWNrSW5kZXgubGVuZ3RoXTtcclxuXHRcdFx0XHRcdFx0ZGVja3NbX2luZGV4XS5nZW5DYXJkQnlOYW1lKGNhcmROYW1lc1tpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQgXHRmb3IoaSBpbiBjYXJkTmFtZXMpIHtcclxuXHRcdFx0XHQgXHRcdGlmKGkgPCBkZWNrSW5kZXgubGVuZ3RoKSB7XHJcblx0XHRcdFx0IFx0XHRcdFxyXG5cdFx0XHRcdCBcdFx0XHRkZWNrc1tkZWNrSW5kZXhbaV1dLkZpbGwoY2FyZE5hbWVzW2ldKTtcclxuXHRcdFx0XHQgXHRcdH1cclxuXHRcdFx0XHQgXHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSkoYSk7XHJcblxyXG5cdFx0aWYoYS5kZWNrcykge1xyXG5cdFx0XHRpZih0eXBlb2YgYS5kZWNrcyA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdHZhciBfY291bnQgPSBhLmRlY2tzO1xyXG5cdFx0XHRcdGEuZGVja3MgPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGRlY2tOdW1cdD0gMDsgZGVja051bSA8IF9jb3VudDsgZGVja051bSArPSAxKSB7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnREVCVUc7IEdFTiBERUNLUyBCWSBDT1VOVEVSJywgZGVja051bSwgX2NvdW50LCBhLmRlY2tzKVxyXG5cdFx0XHRcdFx0YS5kZWNrcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0bmFtZSAgIDogX2VsX2dyb3VwLm5hbWUgKyBcIl9kZWNrXCIgKyAoZGVja051bSArIDEpXHJcblx0XHRcdFx0XHRcdC8vIHBhcmVudCA6IF9pZFxyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGZvcih2YXIgZCBpbiBhLmRlY2tzKSB7XHJcblx0XHRcdFx0X2VsX2dyb3VwLmFkZERlY2soYS5kZWNrc1tkXSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHNoYXJlLmVsZW1lbnRzW19pZF0gPSBfZWxfZ3JvdXA7XHJcblx0XHRcclxuXHRcdC8vIGZpbGwgZ3JvdXBcclxuXHJcblx0XHRpZihhICYmIGEuZmlsbCkge1xyXG5cdFx0XHR2YXIgX2NoZWNrRmlsbERlY2sgPSBhLmZpbGwubGVuZ3RoO1xyXG5cdFx0XHQvKmZvcihpIGluIGEuZmlsbCkge1xyXG5cdFx0XHRcdF9jaGVja0ZpbGxEZWNrID0gX2NoZWNrRmlsbERlY2sgJiYgdHlwZW9mIGEuZmlsbFtpXSA9PSAnc3RyaW5nJyAmJiBzaGFyZS52YWxpZGF0ZUNhcmROYW1lKGEuZmlsbFtpXSk7XHJcblx0XHRcdH0qL1xyXG5cdFx0XHRpZihfY2hlY2tGaWxsRGVjaykgX2VsX2dyb3VwLkZpbGwoYS5maWxsKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZWRyYXcgZ3JvdXBcclxuXHJcblx0XHRfZWxfZ3JvdXAuUmVkcmF3ID0gZnVuY3Rpb24oX2EpIHtcclxuXHRcdFx0dmFyIF9kZWNrcyA9IHRoaXMuZ2V0RGVja3MoKTtcclxuXHRcdFx0dmFyIF9pbmRleCA9IHt9XHJcblx0XHRcdC8vIGZvcihpIGluIF9hLmRlY2tzKVxyXG5cdFx0XHRpZih0eXBlb2YgX2EuZGVja3MgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIF9hLmRlY2tzID09ICdudW1iZXInKSBfYS5kZWNrcyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2RlY2tzKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldKSBfYS5kZWNrc1tpXSA9IHt9O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIGNoYW5nZWQgdmFsdWVzXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLnBvc2l0aW9uKSB7XHJcblx0XHRcdFx0XHRfYS5kZWNrc1tpXS5wb3NpdGlvbiA9IHt9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighX2EuZGVja3NbaV0ucGFyZW50UG9zaXRpb24pIHtcclxuXHRcdFx0XHRcdF9hLmRlY2tzW2ldLnBhcmVudFBvc2l0aW9uID0ge307XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8qaWYoICFfYS5kZWNrc1tpXS5wb3NpdGlvbi54ICYmIGEucG9zaXRpb24gJiYgYS5wb3NpdGlvbi54ICYmIHR5cGVvZiBhLnBvc2l0aW9uLnggPT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdF9hLmRlY2tzW2ldLnBvc2l0aW9uLnggPSBfYS5wb3NpdGlvbi54O1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3NldCBwb3NpdGlvbiB4JywgX2EuZGVja3NbaV0ucG9zaXRpb24pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCAhX2EuZGVja3NbaV0ucG9zaXRpb24ueSAmJiBhLnBvc2l0aW9uICYmIGEucG9zaXRpb24ueSAmJiB0eXBlb2YgYS5wb3NpdGlvbi55ID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0XHRfYS5kZWNrc1tpXS5wb3NpdGlvbi55ID0gX2EucG9zaXRpb24ueTtcclxuXHRcdFx0XHR9Ki9cclxuXHRcdFx0XHRpZiggIV9hLmRlY2tzW2ldLnBhcmVudFBvc2l0aW9uLnggJiYgYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnggJiYgdHlwZW9mIGEucG9zaXRpb24ueCA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdFx0X2EuZGVja3NbaV0ucGFyZW50UG9zaXRpb24ueCA9IF9hLnBvc2l0aW9uLng7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKCAhX2EuZGVja3NbaV0ucGFyZW50UG9zaXRpb24ueSAmJiBhLnBvc2l0aW9uICYmIGEucG9zaXRpb24ueSAmJiB0eXBlb2YgYS5wb3NpdGlvbi55ID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0XHRfYS5kZWNrc1tpXS5wYXJlbnRQb3NpdGlvbi55ID0gX2EucG9zaXRpb24ueTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoX2EucGxhY2VtZW50KSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciBfY2FyZCA9IG1haW4ub3B0aW9ucy5jYXJkO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3BsYWNlbWVudCMzJywgX2EucGxhY2VtZW50KTtcclxuXHJcblx0XHRcdFx0XHRpZihfYS5wbGFjZW1lbnQueCkgX2EuZGVja3NbaV0ucG9zaXRpb24ueCA9IC8qeCArICovKF9hLnBsYWNlbWVudC54ICsgX2NhcmQud2lkdGgpICAqIGkvKiArIGEucGFyZW50UG9zaXRpb24ueCovO1xyXG5cdFx0XHRcdFx0aWYoX2EucGxhY2VtZW50LnkpIF9hLmRlY2tzW2ldLnBvc2l0aW9uLnkgPSAvKnkgKyAqLyhfYS5wbGFjZW1lbnQueSArIF9jYXJkLmhlaWdodCkgKiBpLyogKyBhLnBhcmVudFBvc2l0aW9uLnkqLztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLnJvdGF0ZSAgICAgICAmJiBfYS5yb3RhdGUgICAgICAgICYmIHR5cGVvZiBfYS5yb3RhdGUgICAgICAgPT0gJ251bWJlcicpIF9hLmRlY2tzW2ldLnJvdGF0ZSAgICAgICA9IF9hLnJvdGF0ZTtcclxuXHRcdFx0XHRpZighX2EuZGVja3NbaV0ucGFkZGluZ1ggICAgICYmIF9hLnBhZGRpbmdYICAgICAgJiYgdHlwZW9mIF9hLnBhZGRpbmdYICAgICA9PSAnbnVtYmVyJykgX2EuZGVja3NbaV0ucGFkZGluZ1ggICAgID0gX2EucGFkZGluZ1g7XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLnBhZGRpbmdZICAgICAmJiBfYS5wYWRkaW5nWSAgICAgICYmIHR5cGVvZiBfYS5wYWRkaW5nWSAgICAgPT0gJ251bWJlcicpIF9hLmRlY2tzW2ldLnBhZGRpbmdZICAgICA9IF9hLnBhZGRpbmdZO1xyXG5cdFx0XHRcdGlmKCFfYS5kZWNrc1tpXS5mbGlwUGFkZGluZ1ggJiYgX2EuZmxpcFBhZGRpbmdYICAmJiB0eXBlb2YgX2EuZmxpcFBhZGRpbmdYID09ICdudW1iZXInKSBfYS5kZWNrc1tpXS5mbGlwUGFkZGluZ1ggPSBfYS5mbGlwUGFkZGluZ1g7XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLmZsaXBQYWRkaW5nWSAmJiBfYS5mbGlwUGFkZGluZ1kgICYmIHR5cGVvZiBfYS5mbGlwUGFkZGluZ1kgPT0gJ251bWJlcicpIF9hLmRlY2tzW2ldLmZsaXBQYWRkaW5nWSA9IF9hLmZsaXBQYWRkaW5nWTtcclxuXHRcdFx0XHRfZGVja3NbaV0uUmVkcmF3KF9hLmRlY2tzW2ldKTtcclxuXHRcdFx0XHQvLyBpZihfZGVja3NbaV0ubmFtZSlcclxuXHRcdFx0fVxyXG5cdFx0XHQvKmZvcihpIGluIF9hLmRlY2tzKSB7XHJcblx0XHRcdFx0Y29uc29sZS5sb2coJ3JlZHJhdzonLCBfYS5kZWNrc1tpXSlcclxuXHRcdFx0XHR2YXIgX2RlY2sgPSBtYWluLkRlY2soX2EuZGVja3NbaV0ubmFtZSwgX2VsX2dyb3VwLm5hbWUpO1xyXG5cdFx0XHRcdGlmKF9kZWNrKSB7XHJcblx0XHRcdFx0XHRfZGVjay5SZWRyYXcoX2EuZGVja3NbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSovXHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gX2VsX2dyb3VwO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblx0bWFpbi5Hcm91cCA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdHJldHVybiB0aGlzLmdldEVsZW1lbnRzQnlOYW1lKG5hbWUsICdncm91cCcpWzBdO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4dGVuc2lvbnMvYWRkR3JvdXAuanNcbiAqKiBtb2R1bGUgaWQgPSA0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0XHJcblx0bWFpbi5hZGREZWNrID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdGlmKCFhKSByZXR1cm4gZmFsc2U7XHJcblx0XHR2YXIgX2lkID0gJ2RlY2tfJyArIHNoYXJlLmdlbklkKCk7XHJcblx0XHR2YXIgX2VsX2RlY2sgPSBuZXcgKGZ1bmN0aW9uKGEpIHtcclxuXHJcblxyXG5cdFx0XHRpZighYSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gcGFyYW1ldGVyc1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy50eXBlID0gJ2RlY2snO1xyXG5cdFx0XHR2YXIgaWQgPSBfaWQ7XHJcblx0XHRcdHRoaXMuZ2V0SWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gaWQ7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIF9wYXJlbnRfZWwgICA9IG1haW4uR3JvdXAoYS5wYXJlbnQpLFxyXG5cdFx0XHRcdF9wYXJlbnRfbmFtZSA9IF9wYXJlbnRfZWwgPyBfcGFyZW50X2VsLm5hbWUgOiAneG5hbWUnLFxyXG5cdFx0XHRcdF9uZXdfaWQgICAgICA9IF9wYXJlbnRfZWwgPyBfcGFyZW50X2VsLmdldERlY2tzKCkubGVuZ3RoIDogaWQ7XHJcblx0XHRcdHRoaXMubmFtZSA9IGEubmFtZSAmJiB0eXBlb2YgYS5uYW1lID09ICdzdHJpbmcnID8gYS5uYW1lIDogKF9wYXJlbnRfbmFtZSArICdfJyArIF9uZXdfaWQpO1xyXG5cclxuXHRcdFx0dmFyIHBhcmVudCA9IGEucGFyZW50ICYmIHR5cGVvZiBhLnBhcmVudCA9PSAnc3RyaW5nJyA/IGEucGFyZW50IDogJ2ZpZWxkJztcclxuXHRcdFx0dGhpcy5wYXJlbnQgPSBmdW5jdGlvbihhKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIGEgPT0gJ3N0cmluZycpIHBhcmVudCA9IGE7XHJcblx0XHRcdFx0cmV0dXJuIHBhcmVudDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dmFyIGF1dG9IaWRlID0gYS5hdXRvSGlkZSAmJiB0eXBlb2YgYS5hdXRvSGlkZSA9PSAnYm9vbGVhbicgPyBhLmF1dG9IaWRlIDogc2hhcmUuZGVmYXVsdF9hdXRvaGlkZTtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMudmlzaWJsZSA9IGEudmlzaWJsZSAmJiB0eXBlb2YgYS52aXNpYmxlICAgPT0gJ2Jvb2xlYW4nID8gYS52aXNpYmxlIDogdHJ1ZTsvLyBkZWZhdWx0IHRydWVcclxuXHRcdFx0XHJcblx0XHRcdHZhciBwYXJhbXMgPSB7fTtcclxuXHRcdFx0cGFyYW1zLnN0YXJ0WkluZGV4ID0gYS5zdGFydFpJbmRleCAmJiB0eXBlb2YgYS5zdGFydFpJbmRleCA9PSAnbnVtYmVyJyA/IGEuc3RhcnRaSW5kZXggOiBzaGFyZS5zdGFydF96X2luZGV4O1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY2hhbmdlZCBwYXJhbWV0ZXJzXHJcblx0XHRcdHRoaXMuZ3JvdXBJbmRleCA9IGEuZ3JvdXBJbmRleCAmJiB0eXBlb2YgYS5ncm91cEluZGV4ID09ICdudW1iZXInID8gYS5ncm91cEluZGV4IDogbnVsbDtcclxuXHRcdFx0XHJcblx0XHRcdC8vIERPTVxyXG5cdFx0XHRwYXJhbXMueCAgICAgICAgICAgICAgPSAwOyBcclxuXHRcdFx0cGFyYW1zLnkgICAgICAgICAgICAgID0gMDsgXHJcblx0XHRcdHBhcmFtcy5yb3RhdGUgPSB0aGlzLnJvdGF0ZSA9IDA7IFxyXG5cclxuXHRcdFx0cGFyYW1zLnBhZGRpbmdfeSAgICAgID0gKCAgICBhLnBhZGRpbmdZICYmIHR5cGVvZiAgICAgYS5wYWRkaW5nWSA9PSAnbnVtYmVyJykgPyAgICAgYS5wYWRkaW5nWSA6ICAgICAgc2hhcmUuZGVmYXVsdF9wYWRkaW5nX3k7XHJcblx0XHRcdHBhcmFtcy5mbGlwX3BhZGRpbmdfeSA9IChhLmZsaXBQYWRkaW5nWSAmJiB0eXBlb2YgYS5mbGlwUGFkZGluZ1kgPT0gJ251bWJlcicpID8gYS5mbGlwUGFkZGluZ1kgOiBzaGFyZS5kZWZhdWx0X2ZsaXBfcGFkZGluZ195O1xyXG5cdFx0XHRcclxuXHRcdFx0cGFyYW1zLnBhZGRpbmdfeCAgICAgID0gKCAgICBhLnBhZGRpbmdYICYmIHR5cGVvZiAgICAgYS5wYWRkaW5nWCA9PSAnbnVtYmVyJykgPyAgICAgYS5wYWRkaW5nWCA6ICAgICAgc2hhcmUuZGVmYXVsdF9wYWRkaW5nX3g7XHJcblx0XHRcdHBhcmFtcy5mbGlwX3BhZGRpbmdfeCA9IChhLmZsaXBQYWRkaW5nWCAmJiB0eXBlb2YgYS5mbGlwUGFkZGluZ1ggPT0gJ251bWJlcicpID8gYS5mbGlwUGFkZGluZ1ggOiBzaGFyZS5kZWZhdWx0X2ZsaXBfcGFkZGluZ194O1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ0FERCBERUNLOicsIGEucGFkZGluZ1gsIGEucGFkZGluZ1ksIHNoYXJlLnBhZGRpbmdfeCwgc2hhcmUucGFkZGluZ195KTtcclxuXHJcblx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ2FkZERlY2tFbCcsIHtcclxuXHRcdFx0XHRhICAgICA6IGEsIFxyXG5cdFx0XHRcdGRlY2sgIDogdGhpcyxcclxuXHRcdFx0XHRwYXJhbXM6IHBhcmFtc1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdHRoaXMuaGlkZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdG9uZVN0ZXBXYXkuaGlkZURlY2sgPSB0aGlzLm5hbWU7XHJcblx0XHRcdFx0dGhpcy5SZWRyYXcoKTtcclxuXHRcdFx0XHQvLyAkKGRvbUVsZW1lbnQpLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0b25lU3RlcFdheS5zaG93RGVjayA9IHRoaXMubmFtZTtcclxuXHRcdFx0XHR0aGlzLlJlZHJhdygpO1xyXG5cdFx0XHRcdC8vICQoZG9tRWxlbWVudCkuc2hvdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyAtLS0tLS0tLS0tLS0tIEZMSVAgLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gZmxpcFR5cGVzLmpzXHJcblxyXG5cdFx0XHR2YXIgZmxpcFR5cGUgPSBhLmZsaXAgJiYgdHlwZW9mIGEuZmxpcCA9PSAnc3RyaW5nJyA/IGEuZmxpcCA6IHNoYXJlLmRlZmF1bHRfZmxpcF90eXBlLFxyXG5cdFx0XHRcdGNoZWNrRmxpcCA9IHNoYXJlLmZsaXBUeXBlc1tmbGlwVHlwZV07XHJcblx0XHRcdHRoaXMuZmxpcENoZWNrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Zm9yKGkgaW4gY2FyZHMpIHtcclxuXHRcdFx0XHRcdGNoZWNrRmxpcChjYXJkc1tpXSwgaXwwLCBjYXJkcy5sZW5ndGgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHJcblx0XHRcdHZhciBjYXJkcyA9IFtdOy8vIDEgb3IgTiwgaWQgOiB7bmFtZTogJycsIHJhbms6ICcnLCBjb2xvcjogJycsIGZsaXA6IG51bGwsIGlkOiAnJywgcGFkZGluZ1R5cGU6IE59IGlkIC0gZG9tIGVsZW1lbnQgaWRcclxuXHRcdFx0XHJcblx0XHRcdC8vINGB0L7Qt9C00LDRgtGMINC60LDRgNGC0YNcclxuXHJcblx0XHRcdHRoaXMuZ2VuQ2FyZEJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnZ2VuQ2FyZEJ5TmFtZTonLCBuYW1lKTtcclxuXHRcdFx0XHR2YXIgX25hbWUgPSBzaGFyZS52YWxpZGF0ZUNhcmROYW1lKG5hbWUpOy8vIHtjb2xvciwgcmFua31cclxuXHRcdFx0XHR2YXIgX3BhcmVudCA9IGlkO1xyXG5cclxuXHRcdFx0XHRpZihfbmFtZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBfaWQgPSAnY2FyZF8nICsgc2hhcmUuZ2VuSWQoKSxcclxuXHRcdFx0XHRcdFx0X2NhcmQgPSB7XHJcblx0XHRcdFx0XHRcdGlkICAgICAgOiBfaWQsXHJcblx0XHRcdFx0XHRcdG5hbWUgICAgOiBuYW1lLFxyXG5cdFx0XHRcdFx0XHR0eXBlICAgIDogJ2NhcmQnLFxyXG5cdFx0XHRcdFx0XHQvLyBkb21FbGVtZW50IDogZG9tRWxlbWVudCxcclxuXHRcdFx0XHRcdFx0dmlzaWJsZSA6IHRydWUsXHJcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBfcGFyZW50LFxyXG5cdFx0XHRcdFx0XHRmbGlwICAgIDogZmFsc2VcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnYWRkQ2FyZEVsJywgX2NhcmQpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRzaGFyZS5lbGVtZW50c1tfaWRdID0gX2NhcmQ7XHJcblx0XHRcdFx0XHR0aGlzLlB1c2goW19jYXJkXSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMuZmxpcENoZWNrKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMuUmVkcmF3KCk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIF9jYXJkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0vLy5iaW5kKHRoaXMpXHJcblxyXG5cdFx0XHQvLyAtLS0tLS0tLS0tLS0tIFBVVCAtLS0tLS0tLS0tLS0tXHJcblxyXG5cdFx0XHQvLyDQvNC+0LbQvdC+INC70Lgg0L/QvtC70L7QttC40YLRjCDQutCw0YDRgtGDL9GB0YLQvtC/0LrRg1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gcmVhZHlQdXRSdWxlcy5qc1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHB1dFJ1bGVzID0gYS5wdXRSdWxlcyBcclxuXHRcdFx0XHQ/IHR5cGVvZiBhLnB1dFJ1bGVzID09ICdmdW5jdGlvbicgXHJcblx0XHRcdFx0XHQ/IGEucHV0UnVsZXNcclxuXHRcdFx0XHRcdDogdHlwZW9mIGEucHV0UnVsZXMgPT0gJ3N0cmluZycgXHJcblx0XHRcdFx0XHRcdD8gc2hhcmUucmVhZHlQdXRSdWxlc1thLnB1dFJ1bGVzXSBcclxuXHRcdFx0XHRcdFx0XHQ/IHNoYXJlLnJlYWR5UHV0UnVsZXNbYS5wdXRSdWxlc11cclxuXHRcdFx0XHRcdFx0XHQ6IHNoYXJlLnJlYWR5UHV0UnVsZXNbc2hhcmUuZGVmYXVsdF9wdXROYW1lXVxyXG5cdFx0XHRcdFx0XHQ6IHR5cGVvZiBhLnB1dFJ1bGVzID09ICdvYmplY3QnIFxyXG5cdFx0XHRcdFx0XHRcdD8gYS5wdXRSdWxlc1xyXG5cdFx0XHRcdFx0XHRcdDogc2hhcmUucmVhZHlQdXRSdWxlc1tzaGFyZS5kZWZhdWx0X3B1dE5hbWVdXHJcblx0XHRcdFx0OiBzaGFyZS5yZWFkeVB1dFJ1bGVzW3NoYXJlLmRlZmF1bHRfcHV0TmFtZV07XHJcblxyXG5cdFx0XHQvLyDQv9GA0L7QstC10YDRj9C10LwsINC80L7QttC10Lwg0LvQuCDQv9C+0LvQvtC20LjRgtGMINGB0YLQvtC/0LrRgy/QutCw0YDRgtGDXHJcblx0XHRcdC8vINCy0L7Qt9Cy0YDQsNGJ0LDQtdGCIHRydWUsINC10YHQu9C4INGB0L7Qs9C70LDRgdC90L4g0L/RgNCw0LLQuNC70LDQvCDRgdGO0LTQsCDQvNC+0LbQvdC+INC/0L7Qu9C+0LbQuNGC0Ywg0LrQsNGA0YLRg1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gVE9ET1xyXG5cdFx0XHQvLyB0aGlzLlB1dCA9IGZ1bmN0aW9uKHB1dERlY2spIHtcclxuXHRcdFx0Ly8gXHRzaGFyZS5QdXQoe2RlY2sgOiB0aGlzLCBwdXREZWNrIDogcHV0RGVja30pXHJcblx0XHRcdC8vIH1cclxuXHRcdFx0dGhpcy5QdXQgPSBmdW5jdGlvbihwdXREZWNrKSB7XHJcblxyXG5cdFx0XHRcdHZhciBydWxlc0NvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBfZGVja0lkID0gcHV0RGVja1swXS5jYXJkLnBhcmVudDtcclxuXHRcdFx0XHR2YXIgX2RlY2tfZGVwYXJ0dXJlID0gbWFpbi5nZXREZWNrQnlJZChfZGVja0lkKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnUHV0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+JywgdGhpcy5uYW1lKTtcclxuXHJcblx0XHRcdFx0aWYodHlwZW9mIHB1dFJ1bGVzID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBwdXRSdWxlcyh7XHJcblx0XHRcdFx0XHRcdGZyb20gICAgOiB7XHJcblx0XHRcdFx0XHRcdFx0ZGVja0lkIDogX2RlY2tJZCwgXHJcblx0XHRcdFx0XHRcdFx0ZGVjayAgIDogX2RlY2tfZGVwYXJ0dXJlXHJcblx0XHRcdFx0XHRcdH0sIFxyXG5cdFx0XHRcdFx0XHRwdXREZWNrIDogcHV0RGVjayxcclxuXHRcdFx0XHRcdFx0Y2FyZHMgICA6IGNhcmRzXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJyVjRUFDSCcsICdjb2xvcjogYmx1ZTtmb250LXdlaWdodCA6IGJvbGQ7JywgcHV0UnVsZXMpO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBydWxlTmFtZSBpbiBwdXRSdWxlcykge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBfcnVsZU5hbWUgPSAocGFyc2VJbnQocnVsZU5hbWUpLnRvU3RyaW5nKCkgPT0gcnVsZU5hbWUgJiYgdHlwZW9mIHB1dFJ1bGVzW3J1bGVOYW1lXSA9PSAnc3RyaW5nJykgPyBwdXRSdWxlc1tydWxlTmFtZV0gOiBydWxlTmFtZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmKHNoYXJlLnJlYWR5UHV0UnVsZXNbX3J1bGVOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHZhciBfYyA9ICcjJyArICgoKE1hdGgucmFuZG9tKCkgKiAxNTcyODYzOSl8MCkgKyAxMDQ4NTc2KS50b1N0cmluZygxNik7XHJcblx0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJyVjICAnLCAnYm9yZGVyLXJhZGl1cyA6IDEwMCU7Zm9udC13ZWlnaHQ6IGJvbGQ7YmFja2dyb3VuZDonICsgX2MsIF9kZWNrSWQsIGNhcmRzLCBfcnVsZU5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBzaGFyZS5yZWFkeVB1dFJ1bGVzW19ydWxlTmFtZV0oe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbSAgICAgIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWNrSWQgOiBfZGVja0lkLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVjayAgIDogX2RlY2tfZGVwYXJ0dXJlXHJcblx0XHRcdFx0XHRcdFx0XHR9LCBcclxuXHRcdFx0XHRcdFx0XHRcdHB1dERlY2sgICA6IHB1dERlY2ssXHJcblx0XHRcdFx0XHRcdFx0XHRjYXJkcyAgICAgOiBjYXJkcyxcclxuXHRcdFx0XHRcdFx0XHRcdHJ1bGVzQXJncyA6IHB1dFJ1bGVzW3J1bGVOYW1lXVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCclYyAgJywgJ2JvcmRlci1yYWRpdXMgOiAxMDAlO2JhY2tncm91bmQ6JyArIF9jLCAnRU5EJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZih0eXBlb2YgcHV0UnVsZXNbX3J1bGVOYW1lXSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIHB1dFJ1bGVzW19ydWxlTmFtZV0oe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbSAgICA6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVja0lkIDogX2RlY2tJZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRlY2sgICA6IF9kZWNrX2RlcGFydHVyZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSwgXHJcblx0XHRcdFx0XHRcdFx0XHRwdXREZWNrIDogcHV0RGVjayxcclxuXHRcdFx0XHRcdFx0XHRcdGNhcmRzICAgOiBjYXJkc1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybigncHV0UnVsZTonLCBfcnVsZU5hbWUsICdub3QgZXhpc3RzJyk7XHJcblx0XHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBydWxlc0NvcnJlY3Q7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0gVEFLRSAtLS0tLS0tLS0tLS0tXHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQvNC+0LbQvdC+INC70Lgg0LLQt9GP0YLRjCDQutCw0YDRgtGDL9GB0YLQvtC/0LrRg1xyXG5cclxuXHRcdFx0dmFyIHRha2VSdWxlcyA9IGEudGFrZVJ1bGVzIFxyXG5cdFx0XHRcdD8gdHlwZW9mIGEudGFrZVJ1bGVzID09ICdmdW5jdGlvbicgXHJcblx0XHRcdFx0XHQ/IGEudGFrZVJ1bGVzXHJcblx0XHRcdFx0XHQ6IHR5cGVvZiBhLnRha2VSdWxlcyA9PSAnc3RyaW5nJyBcclxuXHRcdFx0XHRcdFx0PyBzaGFyZS5yZWFkeVRha2VSdWxlc1thLnRha2VSdWxlc10gXHJcblx0XHRcdFx0XHRcdFx0PyBzaGFyZS5yZWFkeVRha2VSdWxlc1thLnRha2VSdWxlc11cclxuXHRcdFx0XHRcdFx0XHQ6IHNoYXJlLnJlYWR5VGFrZVJ1bGVzW3NoYXJlLmRlZmF1bHRfdGFrZU5hbWVdXHJcblx0XHRcdFx0XHRcdDogdHlwZW9mIGEudGFrZVJ1bGVzID09ICdvYmplY3QnIFxyXG5cdFx0XHRcdFx0XHRcdD8gYS50YWtlUnVsZXNcclxuXHRcdFx0XHRcdFx0XHQ6IHNoYXJlLnJlYWR5VGFrZVJ1bGVzW3NoYXJlLmRlZmF1bHRfdGFrZU5hbWVdXHJcblx0XHRcdFx0OiBzaGFyZS5yZWFkeVRha2VSdWxlc1tzaGFyZS5kZWZhdWx0X3Rha2VOYW1lXTtcclxuXHJcblx0XHRcdHRoaXMuVGFrZSA9IGZ1bmN0aW9uKGNhcmRJZCkge1xyXG5cclxuXHRcdFx0XHR2YXIgcnVsZXNDb3JyZWN0ID0gIXNoYXJlLmxvY2s7XHJcblx0XHRcdFx0aWYodHlwZW9mIHRoaXMuZmlsbCA9PSBcImJvb2xlYW5cIikge1xyXG5cdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmICF0aGlzLmZpbGw7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyDQsdC10YDRkdC8INC60LDRgNGC0YMv0YHRgtC+0L/QutGDXHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1Rha2UnLCBjYXJkSWQpO1xyXG5cclxuXHRcdFx0XHR2YXIgY2FyZEluZGV4ICA9IC0xO1xyXG5cdFx0XHRcdHZhciBjYXJkTmFtZSAgID0gbnVsbDsgXHJcblx0XHRcdFx0dmFyIGNhcmRTdWl0ICAgPSBudWxsOyBcclxuXHRcdFx0XHR2YXIgY2FyZFJhbmsgICA9IG51bGw7IFxyXG5cdFx0XHRcdHZhciBkZWNrTGVuZ3RoID0gY2FyZHMubGVuZ3RoO1xyXG5cclxuXHRcdFx0XHQvLyDQv9GA0L7QstC10YDRj9C10Lwg0L3QtSDRj9Cy0LvRj9C10YLRgdGPINC70Lgg0L/QtdGA0LXQstC10YDQvdGD0YLQvtC5XHJcblxyXG5cdFx0XHRcdHZhciB0YWtlRGVjayA9IFtdXHJcblxyXG5cdFx0XHRcdGZvcihpIGluIGNhcmRzKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYoY2FyZHNbaV0uaWQgPT0gY2FyZElkKSB7XHJcblx0XHRcdFx0XHRcdGNhcmRJbmRleCA9IGl8MDtcclxuXHRcdFx0XHRcdFx0Y2FyZE5hbWUgID0gY2FyZHNbaV0ubmFtZTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBfbmFtZSA9IHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoY2FyZE5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIF9uYW1lO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYoX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRjYXJkU3VpdCA9IF9uYW1lLnN1aXQ7XHJcblx0XHRcdFx0XHRcdFx0Y2FyZFJhbmsgID0gX25hbWUucmFuaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIChjYXJkc1tpXS5mbGlwID09IGZhbHNlIHx8IGNhcmRzW2ldLmZsaXAgPT0gc2hhcmUuZGVmYXVsdF9jYW5fbW92ZV9mbGlwKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZihjYXJkSW5kZXggPj0gMCkge1xyXG5cdFx0XHRcdFx0XHR0YWtlRGVjay5wdXNoKHtpbmRleCA6IGksIGNhcmQgOiBjYXJkc1tpXX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgX2F0dHJzID0ge1xyXG5cdFx0XHRcdFx0Y2FyZElkICAgICA6IGNhcmRJZCwgXHJcblx0XHRcdFx0XHRjYXJkTmFtZSAgIDogY2FyZE5hbWUsIFxyXG5cdFx0XHRcdFx0Y2FyZFN1aXQgICA6IGNhcmRTdWl0LCBcclxuXHRcdFx0XHRcdGNhcmRSYW5rICAgOiBjYXJkUmFuaywgXHJcblx0XHRcdFx0XHRjYXJkSW5kZXggIDogY2FyZEluZGV4LCBcclxuXHRcdFx0XHRcdGRlY2tMZW5ndGggOiBkZWNrTGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGVvZiB0YWtlUnVsZXMgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIHRha2VSdWxlcyhfYXR0cnMpO1xyXG5cdFx0XHRcdFx0Ly8gVE9ET1xyXG5cdFx0XHRcdFx0Ly8g0LvRg9GH0YjQtSDQvtCx0YDQsNCx0LDRgtGL0LLQsNGC0Ywg0YHRgtGA0L7QutGDINC10YHQu9C4INC/0YDQsNCy0LjQu9C+INC+0LTQvdC+INC4INC90LUg0L3Rg9C20LXQvSDQvNCw0YHRgdC40LJcclxuXHRcdFx0XHQvLyB9IGVsc2UgaWYodHlwZW9mIHRha2VSdWxlcyA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IodmFyIHJ1bGVJbmRleCBpbiB0YWtlUnVsZXMpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHJ1bGVOYW1lID0gdGFrZVJ1bGVzW3J1bGVJbmRleF07XHJcblxyXG5cdFx0XHRcdFx0XHRpZihzaGFyZS5yZWFkeVRha2VSdWxlc1tydWxlTmFtZV0pIHtcclxuXHRcdFx0XHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgc2hhcmUucmVhZHlUYWtlUnVsZXNbcnVsZU5hbWVdKF9hdHRycyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSAvKmlmKHR5cGVvZiB0YWtlUnVsZXNbcnVsZUluZGV4XSA9PSAnZnVuY3Rpb24nKSovIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgdGFrZVJ1bGVzW3J1bGVJbmRleF0oX2F0dHJzKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5jb3JyZWN0IHRha2UgcnVsZTonLCBydWxlTmFtZSk7XHJcblx0XHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10YIg0LzQsNGB0YHQuNCyIElEINC60LDRgNGCINC60L7RgtC+0YDRi9C1INC80L7QttC90L4g0LHRg9C00LXRgiDQv9C10YDQtdGC0LDRidC40YLRjFxyXG5cdFx0XHRcdC8vINC30LDQv9C40YHRi9Cy0LDQtdGCINC40YUg0LrQsNC6INCw0LrRgtC40LLQvdGL0LVcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgKGNhcmRJbmRleCA+PSAwKTtcclxuXHRcdFx0XHRyZXR1cm4gcnVsZXNDb3JyZWN0ICYmIHRha2VEZWNrO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyAtLS0tLS0tLS0tLS0tIEZJTEwgLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5maWxsID0gZmFsc2U7XHJcblx0XHRcdHZhciBmaWxsUnVsZSA9IChcclxuXHRcdFx0XHRhLmZpbGxSdWxlIFxyXG5cdFx0XHQgJiYgdHlwZW9mIGEuZmlsbFJ1bGUgPT0gXCJzdHJpbmdcIiBcclxuXHRcdFx0ICYmIHR5cGVvZiBzaGFyZS5maWxsUnVsZXNbYS5maWxsUnVsZV0gPT0gXCJmdW5jdGlvblwiXHJcblx0XHRcdCkgPyBzaGFyZS5maWxsUnVsZXNbYS5maWxsUnVsZV1cclxuXHRcdFx0ICA6IHNoYXJlLmZpbGxSdWxlc1snbm90J107XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdGaWxsIHJ1bGU6JywgdGhpcy5uYW1lLCBmaWxsUnVsZSk7XHJcblx0XHRcdG1haW4uZXZlbnQubGlzdGVuKCdtb3ZlRHJhZ0RlY2snLCBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRcdFx0aWYoZGF0YS5kZXN0aW5hdGlvbi5uYW1lICE9IHRoaXMuZGVjay5uYW1lKSByZXR1cm47XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2codGhpcy5kZWNrLm5hbWUsIGRhdGEubW92ZS5mcm9tLCBkYXRhLm1vdmUudG8pO1xyXG5cdFx0XHRcdHZhciBfZGVjayA9IGRhdGEuZGVzdGluYXRpb247Ly8gXHRtYWluLkRlY2soZGF0YS5tb3ZlLnRvKTtcclxuXHRcdFx0XHRpZihfZGVjayAmJiAhdGhpcy5maWxsICYmIHRoaXMuY2FsbGJhY2soe2RlY2sgOiBfZGVja30pKSB7XHJcblx0XHRcdFx0XHR0aGlzLmRlY2suZmlsbCA9IHRydWU7XHJcblx0XHRcdFx0XHRzaGFyZS5vbmVTdGVwV2F5LmZpbGwgPSB7XHJcblx0XHRcdFx0XHRcdGRlY2sgOiB0aGlzLmRlY2submFtZVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdC8vIG1haW4uZXZlbnQuZGlzcGF0Y2goJ2ZpbGxEZWNrJywge2RlY2sgOiB0aGlzLmRlY2t9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0uYmluZCh7ZGVjayA6IHRoaXMsIGNhbGxiYWNrIDogZmlsbFJ1bGV9KSk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyAtLS0tLS0tLS0tLS0tIFBBRERJTkcgLS0tLS0tLS0tLS0tLVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0L/QvtGA0Y/QtNC+0Log0LrQsNGA0YIg0LIg0LrQvtC70L7QtNC1XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBwYWRkaW5nVHlwZXMuanNcclxuXHJcblx0XHRcdHZhciBwYWRkaW5nID0gYS5wYWRkaW5nVHlwZSBcclxuXHRcdFx0XHQ/ICh0eXBlb2YgYS5wYWRkaW5nVHlwZSA9PSAnc3RyaW5nJyAmJiBzaGFyZS5wYWRkaW5nVHlwZXNbYS5wYWRkaW5nVHlwZV0pIFxyXG5cdFx0XHRcdFx0PyBzaGFyZS5wYWRkaW5nVHlwZXNbYS5wYWRkaW5nVHlwZV0gXHJcblx0XHRcdFx0XHQ6IHR5cGVvZiBhLnBhZGRpbmdUeXBlID09ICdmdW5jdGlvbicgXHJcblx0XHRcdFx0XHRcdD8gYS5wYWRkaW5nVHlwZSBcclxuXHRcdFx0XHRcdFx0OiBzaGFyZS5wYWRkaW5nVHlwZXNbJ25vbmUnXVxyXG5cdFx0XHRcdDogYS5wYWRkaW5nWCB8fCBhLnBhZGRpbmdZIFxyXG5cdFx0XHRcdFx0PyBzaGFyZS5wYWRkaW5nVHlwZXNbJ3NwZWNpYWwnXSBcclxuXHRcdFx0XHRcdDogc2hhcmUucGFkZGluZ1R5cGVzW3NoYXJlLmRlZmF1bHRfcGFkZGluZ1R5cGVdO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5wYWRkaW5nID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdFx0XHR2YXIgX3BhZGRpbmcgPSBwYWRkaW5nKHBhcmFtcywgY2FyZHNbaW5kZXhdLCBpbmRleCwgY2FyZHMubGVuZ3RoLCBjYXJkcyk7XHJcblx0XHRcdFx0cmV0dXJuIF9wYWRkaW5nO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmhpZGVDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBjYXJkcykge1xyXG5cdFx0XHRcdFx0Y2FyZHNbaV0udmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnaGlkZUNhcmQnLCBjYXJkc1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNob3dDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBjYXJkcykge1xyXG5cdFx0XHRcdFx0Y2FyZHNbaV0udmlzaWJsZSA9IHRydWU7XHJcblx0XHRcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdzaG93Q2FyZCcsIGNhcmRzW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGEuYWN0aW9ucykge1xyXG5cdFx0XHRcdC8vIFRPRE8g0YHQtNC10LvQsNGC0Ywg0LrRgNCw0YHQuNCy0LXQtVxyXG5cdFx0XHRcdHRoaXMuYWN0aW9ucyA9IGEuYWN0aW9ucztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLSBcXC9cXC9cXC9cXC9cXC8gLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdFx0Ly8gUmVkcmF3IGRlY2tcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuUmVkcmF3ID0gZnVuY3Rpb24oX2EpIHtcclxuXHJcblx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgncmVkcmF3RGVjaycsIHtcclxuXHRcdFx0XHRcdGRlY2sgICA6IHRoaXMsXHJcblx0XHRcdFx0XHRhICAgICAgOiBfYSxcclxuXHRcdFx0XHRcdHBhcmFtcyA6IHBhcmFtcyxcclxuXHRcdFx0XHRcdGNhcmRzICA6IGNhcmRzXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZ2V0Q2FyZHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gY2FyZHM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuZ2V0Q2FyZHNCeU5hbWUgPSBmdW5jdGlvbihjYXJkTmFtZSkge1xyXG5cdFx0XHRcdHZhciBfY2FyZHMgPSBbXTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gY2FyZHMpIHtcclxuXHRcdFx0XHRcdGlmKGNhcmRzW2ldLm5hbWUgPT0gY2FyZE5hbWUpIHtcclxuXHRcdFx0XHRcdFx0X2NhcmRzLnB1c2goY2FyZHNbaV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gX2NhcmRzO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLkNhcmQgPSBmdW5jdGlvbihjYXJkTmFtZSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmdldENhcmRzQnlOYW1lKGNhcmROYW1lKVswXTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5Qb3AgPSBmdW5jdGlvbihjb3VudCwgY2xlYXJQYXJlbnQpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihjYXJkcy5sZW5ndGggPCBjb3VudCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0XHR2YXIgX2RlY2sgPSBbXTtcclxuXHRcdFx0XHRmb3IoO2NvdW50O2NvdW50IC09IDEpIHtcclxuXHRcdFx0XHRcdHZhciBfcG9wID0gY2FyZHMucG9wKCk7XHJcblx0XHRcdFx0XHRpZihjbGVhclBhcmVudCkgX3BvcC5wYXJlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1BPUDonLCBfcG9wKVxyXG5cdFx0XHRcdFx0X2RlY2sucHVzaChfcG9wKTtcclxuXHRcdFx0XHRcdF9kZWNrW19kZWNrLmxlbmd0aCAtIDFdLnBhcmVudCA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdF9kZWNrLnJldmVyc2UoKTtcclxuXHJcblx0XHRcdFx0Ly8g0YfRgtC+INC00LXQu9Cw0YLRjCDQtdGB0LvQuCDQstGL0L3Rg9C70Lgg0LLRgdC1INC60LDRgNGC0YtcclxuXHRcdFx0XHRpZihhdXRvSGlkZSAmJiBjYXJkcy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuUmVkcmF3KCk7XHJcblxyXG5cdFx0XHRcdHJldHVybiBfZGVjaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5QdXNoID0gZnVuY3Rpb24oZGVjaykgey8vICwgcGFyZW50TmFtZSkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBkZWNrKSB7XHJcblx0XHRcdFx0XHRkZWNrW2ldLnBhcmVudCA9IGlkO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1BVU0g6JywgZGVja1tpXSwgaWQpO1xyXG5cdFx0XHRcdFx0Y2FyZHMucHVzaChkZWNrW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuY2xlYXIgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gY2FyZHMpIHtcclxuXHRcdFx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3JlbW92ZUVsJywgY2FyZHNbaV0pO1xyXG5cdFx0XHRcdFx0Y2FyZHNbaV0gPSBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXJkcyA9IFtdO1xyXG5cdFx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3JlbW92ZUVsJywgdGhpcyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEZpbGwgZGVja1xyXG5cdFx0XHQvLyDQt9Cw0L/QvtC70L3Rj9C10YIg0LrQsNGA0YLRiyDQsiDQv9C+0YDRj9C00LrQtSDQtNC+0LHQsNCy0LvQtdC90LjRj1xyXG5cdFx0XHR0aGlzLkZpbGwgPSBmdW5jdGlvbihjYXJkTmFtZXMpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IoaSBpbiBjYXJkTmFtZXMpIHtcclxuXHRcdFx0XHRcdHRoaXMuZ2VuQ2FyZEJ5TmFtZShjYXJkTmFtZXNbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pKGEpO1xyXG5cclxuXHRcdC8vIGZpbGwgZGVja1xyXG5cdFx0aWYoYS5maWxsKSB7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBhLmZpbGwpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgYS5maWxsW2ldID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRfZWxfZGVjay5nZW5DYXJkQnlOYW1lKGEuZmlsbFtpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0c2hhcmUuZWxlbWVudHNbX2lkXSA9IF9lbF9kZWNrO1xyXG5cdFx0cmV0dXJuIF9lbF9kZWNrO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblxyXG5cclxuXHRtYWluLkRlY2sgPSBmdW5jdGlvbihuYW1lLCBncm91cE5hbWUpIHtcclxuXHRcdHZhciBfZGVja3MgPSB0aGlzLmdldEVsZW1lbnRzQnlOYW1lKG5hbWUsICdkZWNrJyk7XHJcblx0XHRpZihncm91cE5hbWUgJiYgdHlwZW9mIGdyb3VwTmFtZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2RlY2tzKSB7XHJcblx0XHRcdFx0dmFyIF9ncm91cCA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQoX2dlY2tzW2ldLnBhcmVudCgpKTtcclxuXHRcdFx0XHRpZihfZ3JvdXAgJiYgX2dyb3VwLm5hbWUgJiYgX2dyb3VwLm5hbWUgPT0gZ3JvdXBOYW1lKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gX2RlY2tzW2ldO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gX2RlY2tzWzBdO1xyXG5cdFx0fVxyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblx0Ly8gR2V0IGFsbCBkZWNrc1xyXG5cclxuXHRtYWluLmdldERlY2tzID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdnZXREZWNrcycsIGEpXHJcblxyXG5cdFx0dmFyIF9kZWNrcyA9IHt9XHJcblx0XHRmb3IodmFyIGQgaW4gc2hhcmUuZWxlbWVudHMpIHtcclxuXHRcdFx0aWYoc2hhcmUuZWxlbWVudHNbZF0udHlwZSA9PSAnZGVjaycpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhzaGFyZS5lbGVtZW50c1tkXS5uYW1lLCBzaGFyZS5lbGVtZW50c1tkXS52aXNpYmxlKVxyXG5cdFx0XHRcdGlmKGEgJiYgYS52aXNpYmxlKSB7XHJcblx0XHRcdFx0XHRpZihzaGFyZS5lbGVtZW50c1tkXS52aXNpYmxlKSB7XHJcblx0XHRcdFx0XHRcdF9kZWNrc1tkXSA9IHNoYXJlLmVsZW1lbnRzW2RdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRfZGVja3NbZF0gPSBzaGFyZS5lbGVtZW50c1tkXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBfZGVja3M7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLmdldERlY2tCeUlkID0gZnVuY3Rpb24oaWQpIHsvLyBJRFxyXG5cdFx0Zm9yKHZhciBkIGluIHNoYXJlLmVsZW1lbnRzKSB7XHJcblx0XHRcdGlmKHNoYXJlLmVsZW1lbnRzW2RdLnR5cGUgPT0gJ2RlY2snICYmIGQgPT0gaWQpIHtcclxuXHRcdFx0XHRyZXR1cm4gc2hhcmUuZWxlbWVudHNbZF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblx0c2hhcmUuZGVja0NhcmROYW1lcyA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFxyXG5cdFx0dmFyIF9kZWNrID0gW107XHJcblx0XHRmb3IoaSBpbiBhKSB7XHJcblx0XHRcdGlmKGFbaV0uY2FyZCAmJiBhW2ldLmNhcmQubmFtZSkge1xyXG5cdFx0XHRcdF9kZWNrLnB1c2goYVtpXS5jYXJkLm5hbWUpO1xyXG5cdFx0XHR9IGVsc2UgaWYoYVtpXS5uYW1lKSB7XHJcblx0XHRcdFx0X2RlY2sucHVzaChhW2ldLm5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gX2RlY2s7XHJcblx0fVxyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9hZGREZWNrLmpzXG4gKiogbW9kdWxlIGlkID0gNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbignaW5pdEZpZWxkJywgZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdpbml0RmllbGQnLCBlKTtcclxuXHJcblx0XHQvLyBzaGFyZS56eiA9IDk7XHJcblxyXG5cdFx0dmFyIGRvbUVsZW1lbnQgPSBlLmEuZmllbGQgPyBlLmEuZmllbGQgOiAnI21hdCc7Ly8gZGVmYXVsdDtcclxuXHRcdGlmKHR5cGVvZiBkb21FbGVtZW50ID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGlmKGRvbUVsZW1lbnQuc3BsaXQoJy4nKS5sZW5ndGggPT0gMikge1xyXG5cdFx0XHRcdGRvbUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGRvbUVsZW1lbnQuc3BsaXQoJy4nKVsxXSlbMF07XHJcblx0XHRcdH0gZWxzZSBpZihkb21FbGVtZW50LnNwbGl0KCcjJykubGVuZ3RoID09IDIpIHtcclxuXHRcdFx0XHRkb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tRWxlbWVudC5zcGxpdCgnIycpWzFdKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZG9tRWxlbWVudCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWRvbUVsZW1lbnQpIHtcclxuXHRcdFx0XHRkb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hdCcpXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHQvLyBzaGFyZS5maWVsZCA9IGUuZmllbGQ7XHJcblx0XHRzaGFyZS5maWVsZC5kb21FbGVtZW50ID0gZG9tRWxlbWVudDtcclxuXHJcblx0XHR2YXIgX3BhcmFtcyA9IHt9O1xyXG5cclxuXHRcdGlmKGUuYS53aWR0aCAgJiYgdHlwZW9mIGUuYS53aWR0aCAgPT0gJ251bWJlcicpIF9wYXJhbXMud2lkdGggID0gc2hhcmUuem9vbSAqIGUuYS53aWR0aCAgKyAncHgnO1xyXG5cdFx0aWYoZS5hLmhlaWdodCAmJiB0eXBlb2YgZS5hLmhlaWdodCA9PSAnbnVtYmVyJykgX3BhcmFtcy5oZWlnaHQgPSBzaGFyZS56b29tICogZS5hLmhlaWdodCArICdweCc7XHJcblx0XHRpZihlLmEudG9wICAgICYmIHR5cGVvZiBlLmEudG9wICAgID09ICdudW1iZXInKSBfcGFyYW1zLnRvcCAgICA9IHNoYXJlLnpvb20gKiBlLmEudG9wICAgICsgJ3B4JztcclxuXHRcdGlmKGUuYS5sZWZ0ICAgJiYgdHlwZW9mIGUuYS5sZWZ0ICAgPT0gJ251bWJlcicpIF9wYXJhbXMubGVmdCAgID0gc2hhcmUuem9vbSAqIGUuYS5sZWZ0ICAgKyAncHgnO1xyXG5cdFx0Ly8gaWYoYS5yb3RhdGUgJiYgdHlwZW9mIGEucm90YXRlID09ICdudW1iZXInKSBfcGFyYW1zLnRyYW5zZm9ybSA9ICdyb3RhdGUoJyArIChhLnJvdGF0ZXwwKSArICdkZWcpJztcclxuXHRcdFxyXG5cdFx0dmFyIHRoZW1lID0gKGUuYS50aGVtZSAmJiB0eXBlb2YgZS5hLnRoZW1lID09ICdzdHJpbmcnKSA/IGUuYS50aGVtZSA6IHNoYXJlLmRlZmF1bHRfdGhlbWU7Ly8gVE9ETyAodGhlbWUgZnJvbSBjb25maWcpXHJcblxyXG5cdFx0JChkb21FbGVtZW50KS5jc3MoX3BhcmFtcykuYWRkQ2xhc3MoJ2ZpZWxkJykuYWRkQ2xhc3ModGhlbWUpO1xyXG5cdH0pO1xyXG5cclxuXHR2YXIgYXBwbHlDaGFuZ2VkUGFyYW1ldGVycyA9IGZ1bmN0aW9uKHAsIGEsIGRlY2spIHtcclxuXHRcdFxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2FwcGx5Q2hhbmdlZFBhcmFtZXRlcnMnLCBhKTtcclxuXHRcdFxyXG5cdFx0cC54ID0gYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnggJiYgdHlwZW9mIGEucG9zaXRpb24ueCA9PSAnbnVtYmVyJyAgPyBhLnBvc2l0aW9uLnggOiAwLFxyXG5cdFx0cC55ID0gYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnkgJiYgdHlwZW9mIGEucG9zaXRpb24ueSA9PSAnbnVtYmVyJyAgPyBhLnBvc2l0aW9uLnkgOiAwO1xyXG5cdFx0cC54ID0gYS5wYXJlbnRQb3NpdGlvbiAmJiBhLnBhcmVudFBvc2l0aW9uLnggPyBwLnggKyBhLnBhcmVudFBvc2l0aW9uLnggOiBwLng7XHJcblx0XHRwLnkgPSBhLnBhcmVudFBvc2l0aW9uICYmIGEucGFyZW50UG9zaXRpb24ueSA/IHAueSArIGEucGFyZW50UG9zaXRpb24ueSA6IHAueTtcclxuXHRcdFxyXG5cdFx0ZGVjay5yb3RhdGUgPSBwLnJvdGF0ZSA9IGEucm90YXRlICYmIHR5cGVvZiBhLnJvdGF0ZSA9PSAnbnVtYmVyJyA/IGEucm90YXRlIDogMDtcclxuXHRcdFxyXG5cdFx0Ly8g0YMgcGFkZGluZ194LCBwYWRkaW5nX3kg0L/RgNC40L7RgNC40YLQtdGCINCy0YvRiNC1INGH0LXQvCBwYWRkaW5nVHlwZVxyXG5cclxuXHRcdHAucGFkZGluZ195ID0gYS5wYWRkaW5nWSAgICAgICAgICAmJiB0eXBlb2YgYS5wYWRkaW5nWSAgICAgPT0gJ251bWJlcicgXHJcblx0XHRcdD8gYS5wYWRkaW5nWSBcclxuXHRcdFx0OiBhLnBhZGRpbmdUeXBlXHJcblx0XHRcdFx0PyBzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeSAgICAgIFxyXG5cdFx0XHRcdDogMCxcclxuXHRcdHAucGFkZGluZ194ID0gYS5wYWRkaW5nWCAgICAgICAgICAmJiB0eXBlb2YgYS5wYWRkaW5nWCAgICAgPT0gJ251bWJlcicgXHJcblx0XHQ/IGEucGFkZGluZ1ggXHJcblx0XHQ6IGEucGFkZGluZ1R5cGVcclxuXHRcdFx0PyBzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeCAgICAgIFxyXG5cdFx0XHQ6IDAsXHJcblx0XHRwLmZsaXBfcGFkZGluZ195ID0gYS5mbGlwUGFkZGluZ1kgJiYgdHlwZW9mIGEuZmxpcFBhZGRpbmdZID09ICdudW1iZXInIFxyXG5cdFx0PyBhLmZsaXBQYWRkaW5nWSBcclxuXHRcdDogYS5wYWRkaW5nVHlwZVxyXG5cdFx0XHQ/IHNoYXJlLmRlZmF1bHRfZmxpcF9wYWRkaW5nX3kgXHJcblx0XHRcdDogMCxcclxuXHRcdHAuZmxpcF9wYWRkaW5nX3ggPSBhLmZsaXBQYWRkaW5nWCAmJiB0eXBlb2YgYS5mbGlwUGFkZGluZ1ggPT0gJ251bWJlcicgXHJcblx0XHQ/IGEuZmxpcFBhZGRpbmdYIFxyXG5cdFx0OiBhLnBhZGRpbmdUeXBlXHJcblx0XHRcdD8gc2hhcmUuZGVmYXVsdF9mbGlwX3BhZGRpbmdfeCBcclxuXHRcdFx0OiAwO1xyXG5cdH07XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdoaWRlQ2FyZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnaGlkZUNhcmQ6JywgZSk7XHJcblx0XHRpZihlICYmIGUuZG9tRWxlbWVudCkge1xyXG5cdFx0XHQkKGUuZG9tRWxlbWVudCkuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdzaG93Q2FyZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnc2hvd0NhcmQ6JywgZSk7XHJcblx0XHRpZihlICYmIGUuZG9tRWxlbWVudCkge1xyXG5cdFx0XHQkKGUuZG9tRWxlbWVudCkuc2hvdygpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdhZGREZWNrRWwnLCBmdW5jdGlvbihlKSB7XHJcblxyXG5cdFx0YXBwbHlDaGFuZ2VkUGFyYW1ldGVycyhlLnBhcmFtcywgZS5hLCBlLmRlY2spO1xyXG5cclxuXHRcdGUuZGVjay5kb21FbGVtZW50ID0gJCgnPGRpdj4nKVswXTtcclxuXHJcblx0XHQvLyBlLmRlY2suZG9tRWxlbWVudCA9IGUuZGVjay5kb21FbGVtZW50O1xyXG5cdFx0XHJcblx0XHQvKnRoaXMuaGlnaGxpZ2h0T24gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aGlnaGxpZ2h0ID0gdHJ1ZTtcclxuXHRcdFx0JChkb21FbGVtZW50KS5hZGRDbGFzcyhoaWdobGlnaHRDbGFzcyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaGlnaGxpZ2h0T2ZmID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGhpZ2hsaWdodCA9IGZhbHNlO1xyXG5cdFx0XHQkKGRvbUVsZW1lbnQpLnJlbW92ZUNsYXNzKGhpZ2hsaWdodENsYXNzKTtcclxuXHRcdH0qL1xyXG5cdFx0XHJcblx0XHR2YXIgX3BhcmFtcyA9IHtcclxuXHRcdFx0bGVmdCAgICAgIDogc2hhcmUuem9vbSAqIGUucGFyYW1zLnggICAgICAgICsgJ3B4JyxcclxuXHRcdFx0dG9wICAgICAgIDogc2hhcmUuem9vbSAqIGUucGFyYW1zLnkgICAgICAgICsgJ3B4JyxcclxuXHRcdFx0d2lkdGggICAgIDogc2hhcmUuem9vbSAqIHNoYXJlLmNhcmQud2lkdGggICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0ICAgIDogc2hhcmUuem9vbSAqIHNoYXJlLmNhcmQuaGVpZ2h0ICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtIDogJ3JvdGF0ZSgnICsgKGUucGFyYW1zLnJvdGF0ZXwwKSArICdkZWcpJ1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0X3BhcmFtcy5kaXNwbGF5ID0gZS5kZWNrLnZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cclxuXHRcdCQoZS5kZWNrLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKS5hZGRDbGFzcygnZWwnKS5hdHRyKHtpZDogZS5kZWNrLmdldElkKCl9KTtcclxuXHJcblx0XHQvLyB2YXIgc2hvd1Nsb3QgPSBlLmEuc2hvd1Nsb3QgJiYgdHlwZW9mIGUuYS5zaG93U2xvdCA9PSAnYm9vbGVhbicgPyBlLmEuc2hvd1Nsb3QgOiBzaGFyZS5kZWZhdWx0X3Nob3dTbG90O1xyXG5cdFx0Ly8gaWYoc2hvd1Nsb3QpICQoZS5kZWNrLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdzbG90Jyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnc2xvdCcsIGUuYSk7XHJcblx0XHRpZihlLmEuc2hvd1Nsb3QpICQoZS5kZWNrLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdzbG90Jyk7XHJcblx0XHRpZihlLmEuY2xhc3MpICQoZS5kZWNrLmRvbUVsZW1lbnQpLmFkZENsYXNzKGUuYS5jbGFzcyk7XHJcblxyXG5cdFx0JChzaGFyZS5maWVsZC5kb21FbGVtZW50KS5hcHBlbmQoZS5kZWNrLmRvbUVsZW1lbnQpO1xyXG5cclxuXHJcblx0XHQvLyBhZGQgbGFiZWxcclxuXHRcdFx0XHJcblx0XHR2YXIgbGFiZWwgPSBlLmEubGFiZWwgJiYgdHlwZW9mIGUuYS5sYWJlbCA9PSAnc3RyaW5nJyA/IGUuYS5sYWJlbCA6IG51bGw7XHJcblx0XHRcclxuXHRcdGlmKCFlLmEubGFiZWwgJiYgc2hhcmUuZGVidWdMYWJlbHMpIHtcclxuXHRcdFx0bGFiZWwgPSAnPHNwYW4gc3R5bGU9XCJjb2xvcjojNjVCMEZGO1wiPicgKyBlLmRlY2submFtZSArICc8L3NwYW4+JztcclxuXHRcdH1cclxuXHJcblx0XHRpZihsYWJlbCkge1xyXG5cdFx0XHR2YXIgX2xhYmVsRWxlbWVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2RlY2tMYWJlbCcpXHJcblx0XHRcdC8vIERFQlVHLCBUT0RPIHJlbW92ZSBuZXh0IHN0cmluZ1xyXG5cdFx0XHQuYXR0cih7XCJ0aXRsZVwiIDogZS5kZWNrLmdldElkKCkgKyBcIiAoXCIgKyBlLmRlY2sucGFyZW50KCkgKyBcIilcIn0pO1xyXG5cdFx0XHQkKF9sYWJlbEVsZW1lbnQpLmh0bWwobGFiZWwpO1xyXG5cdFx0XHQkKGUuZGVjay5kb21FbGVtZW50KS5hcHBlbmQoX2xhYmVsRWxlbWVudCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBsYWJlbCBzdHlsZSBwb3NpdGlvbiBmaXhcclxuXHRcdFx0Ly8gREVCVUdcclxuXHRcdFx0XHJcblx0XHRcdC8qJChfbGFiZWxFbGVtZW50KS5jc3Moe21hcmdpblRvcCA6ICctJyArICgkKF9sYWJlbEVsZW1lbnQpLmhlaWdodCgpICsgNSkgKyAncHgnfSk7XHJcblx0XHRcdGlmKHNoYXJlLnpvb20gIT0gc2hhcmUuZGVmYXVsdF96b29tKSB7XHJcblx0XHRcdFx0JChfbGFiZWxFbGVtZW50KS5jc3Moe3RyYW5zZm9ybSA6ICdzY2FsZSgnICsgc2hhcmUuem9vbSArICcpJ30pXHJcblx0XHRcdH0qL1xyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3Nob3dUaXAnLCBmdW5jdGlvbihlKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnc2hvd1RpcCcsIGUpO1xyXG5cdFx0aWYoZSAmJiBlLmVsICYmIGUuZWwuZG9tRWxlbWVudCAmJiBlLnR5cGUpIHtcclxuXHRcdFx0JChlLmVsLmRvbUVsZW1lbnQpLmFkZENsYXNzKGUudHlwZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdoaWRlVGlwcycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdoaWRlVGlwcycsIGUpO1xyXG5cdFx0aWYoZSAmJiBlLnR5cGVzKSB7XHJcblx0XHRcdGZvcihpIGluIGUudHlwZXMpIHtcclxuXHRcdFx0XHR2YXIgdHlwZU5hbWUgPSBlLnR5cGVzW2ldO1xyXG5cdFx0XHRcdCQoJy4nICsgdHlwZU5hbWUpLnJlbW92ZUNsYXNzKHR5cGVOYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yKGkgaW4gc2hhcmUudGlwVHlwZXMpIHtcclxuXHRcdFx0XHR2YXIgdHlwZU5hbWUgPSBzaGFyZS50aXBUeXBlc1tpXTtcclxuXHRcdFx0XHQkKCcuJyArIHR5cGVOYW1lKS5yZW1vdmVDbGFzcyh0eXBlTmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3JlbW92ZUVsJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0JChlLmRvbUVsZW1lbnQpLnJlbW92ZSgpO1xyXG5cdH0pXHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdyZWRyYXdEZWNrJywgZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdGlmKGUuYSkge1xyXG5cdFx0XHRhcHBseUNoYW5nZWRQYXJhbWV0ZXJzKGUucGFyYW1zLCBlLmEsIGUuZGVjayk7XHJcblxyXG5cdFx0XHRpZihlLmEucGFkZGluZ1gpICAgICBzaGFyZS5wYWRkaW5nX3ggICAgICA9IGUuYS5wYWRkaW5nWDtcclxuXHRcdFx0aWYoZS5hLmZsaXBQYWRkaW5nWCkgc2hhcmUuZmxpcF9wYWRkaW5nX3ggPSBlLmEuZmxpcFBhZGRpbmdYO1xyXG5cdFx0XHRpZihlLmEucGFkZGluZ1kpICAgICBzaGFyZS5wYWRkaW5nX3kgICAgICA9IGUuYS5wYWRkaW5nWTtcclxuXHRcdFx0aWYoZS5hLmZsaXBQYWRkaW5nWSkgc2hhcmUuZmxpcF9wYWRkaW5nX3kgPSBlLmEuZmxpcFBhZGRpbmdZO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBfcGFyYW1zID0ge1xyXG5cdFx0XHRsZWZ0ICAgICAgOiBzaGFyZS56b29tICogZS5wYXJhbXMueCxcclxuXHRcdFx0dG9wICAgICAgIDogc2hhcmUuem9vbSAqIGUucGFyYW1zLnksXHJcblx0XHRcdHRyYW5zZm9ybSA6ICdyb3RhdGUoJyArIChlLnBhcmFtcy5yb3RhdGV8MCkgKyAnZGVnKSdcclxuXHRcdH07XHJcblx0XHRcclxuXHRcdF9wYXJhbXMuZGlzcGxheSA9IGUuZGVjay52aXNpYmxlID8gJ2Jsb2NrJyA6ICdub25lJztcclxuXHJcblx0XHQkKGUuZGVjay5kb21FbGVtZW50KS5jc3MoX3BhcmFtcyk7XHJcblxyXG5cdFx0Zm9yKGkgaW4gZS5jYXJkcykge1xyXG5cdFx0XHR2YXIgX2NhcmRfcG9zaXRpb24gPSBlLmRlY2sucGFkZGluZyhpKTtcclxuXHRcdFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0XHRcdFx0bGVmdCAgICAgIDogc2hhcmUuem9vbSAqIF9jYXJkX3Bvc2l0aW9uLnggKyAncHgnLCBcclxuXHRcdFx0XHR0b3AgICAgICAgOiBzaGFyZS56b29tICogX2NhcmRfcG9zaXRpb24ueSArICdweCcsXHJcblx0XHRcdFx0ekluZGV4ICAgIDogZS5wYXJhbXMuc3RhcnRaSW5kZXggKyAoaXwwKSxcclxuXHRcdFx0ICAgICctbXMtdHJhbnNmb3JtJyAgICAgOiAncm90YXRlKCcgKyAoZS5wYXJhbXMucm90YXRlfDApICsgJ2RlZyknLFxyXG5cdFx0XHQgICAgJy13ZWJraXQtdHJhbnNmb3JtJyA6ICdyb3RhdGUoJyArIChlLnBhcmFtcy5yb3RhdGV8MCkgKyAnZGVnKScsXHJcblx0XHRcdCAgICAnLXdlYmtpdC10cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnICsgKGUucGFyYW1zLnJvdGF0ZXwwKSArICdkZWcpJyxcclxuXHRcdFx0ICAgICctbW96LXRyYW5zZm9ybScgICAgOiAncm90YXRlKCcgKyAoZS5wYXJhbXMucm90YXRlfDApICsgJ2RlZyknLFxyXG5cdFx0XHRcdC8vIHRyYW5zZm9ybSA6ICdyb3RhdGUoJyArIChlLnBhcmFtcy5yb3RhdGV8MCkgKyAnZGVnKSdcclxuXHRcdFx0fTtcclxuXHRcdFx0X3BhcmFtcy5kaXNwbGF5ID0gZS5kZWNrLnZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cclxuXHRcdFx0Ly8gZS5kZWNrLmNoZWNrRmxpcChlLmNhcmRzW2ldLCBpfDAsIGUuY2FyZHMubGVuZ3RofDApO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoZS5jYXJkc1tpXS5mbGlwKSB7XHJcblx0XHRcdFx0JChlLmNhcmRzW2ldLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdmbGlwJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChlLmNhcmRzW2ldLmRvbUVsZW1lbnQpLnJlbW92ZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChlLmNhcmRzW2ldLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKTtcclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblx0XHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ2FkZENhcmRFbCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnYWRkQ2FyZEVsJywgZSk7XHJcblxyXG5cdFx0ZS5kb21FbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnZWwgY2FyZCBkcmFnZ2FibGUnKS5hZGRDbGFzcyhlLm5hbWUpO1xyXG5cdFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0XHRcdHdpZHRoICA6IHNoYXJlLnpvb20gKiBzaGFyZS5jYXJkLndpZHRoICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0IDogc2hhcmUuem9vbSAqIHNoYXJlLmNhcmQuaGVpZ2h0ICsgJ3B4J1xyXG5cdFx0fVxyXG5cdFx0JChlLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKS5hdHRyKHtpZDogZS5pZH0pO1xyXG5cdFx0JChzaGFyZS5maWVsZC5kb21FbGVtZW50KS5hcHBlbmQoZS5kb21FbGVtZW50KTtcclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ21vdmVEcmFnRGVjaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdtb3ZlRHJhZ0RlY2snLCBlKTtcclxuXHRcdHNoYXJlLmN1ckxvY2soKTtcclxuXHRcdGZvcihpIGluIGUubW92ZURlY2spIHtcclxuXHRcdFx0dmFyIF9wb3NpdGlvbiA9IGUuZGVzdGluYXRpb24ucGFkZGluZyhlLmRlc3RpbmF0aW9uLmdldENhcmRzKCkubGVuZ3RoIC0gMSArIChpfDApKTtcclxuXHRcdFx0ICAgICAgICAgICAgIC8vIGUuZGVzdGluYXRpb24ucGFkZGluZyhlLm1vdmVEZWNrW2ldLmluZGV4KTtcclxuXHRcdFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0XHRcdFx0bGVmdCAgICAgIDogc2hhcmUuem9vbSAqIF9wb3NpdGlvbi54ICsgJ3B4JywgXHJcblx0XHRcdFx0dG9wICAgICAgIDogc2hhcmUuem9vbSAqIF9wb3NpdGlvbi55ICsgJ3B4JyxcclxuXHRcdFx0XHQvLyB0cmFuc2Zvcm0gOiAncm90YXRlKDBkZWcpJ1xyXG5cdFx0XHR9O1xyXG5cdFx0XHR2YXIgYSA9IGUuZGVwYXJ0dXJlLnJvdGF0ZSwgYiA9IGUuZGVzdGluYXRpb24ucm90YXRlO1xyXG5cdFx0XHRpZihNYXRoLmFicyhhIC0gYikgPiAxODApIGlmKGEgPiBiKSB7YSA9IGEgLSAzNjB9IGVsc2Uge2IgPSBiIC0gMzYwfTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ3JvdGF0ZScsIGEsIGIpXHJcblx0XHRcdCQoe2RlZzogYSwgZSA6IGV9KS5hbmltYXRlKHtkZWc6IGJ9LCB7XHJcblx0XHRcdCAgZHVyYXRpb246IHNoYXJlLmFuaW1hdGlvblRpbWUsXHJcblx0XHRcdCAgc3RlcDogZnVuY3Rpb24gKG5vdykge1xyXG5cdFx0XHQgICAgJCh0aGlzKS5jc3Moe1xyXG5cdFx0XHQgICAgICAnLW1zLXRyYW5zZm9ybScgICAgIDogJ3JvdGF0ZSgnICsgbm93ICsgJ2RlZyknLFxyXG5cdFx0XHQgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnICsgbm93ICsgJ2RlZyknLFxyXG5cdFx0XHQgICAgICAnLXdlYmtpdC10cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnICsgbm93ICsgJ2RlZyknLFxyXG5cdFx0XHQgICAgICAnLW1vei10cmFuc2Zvcm0nICAgIDogJ3JvdGF0ZSgnICsgbm93ICsgJ2RlZyknLFxyXG5cdFx0XHQgICAgICAvLyB0cmFuc2Zvcm06ICdyb3RhdGUoJyArIG5vdyArICdkZWcpJyxcclxuXHRcdFx0ICAgIH0pO1xyXG5cdFx0XHQgIH0uYmluZChlLm1vdmVEZWNrW2ldLmNhcmQuZG9tRWxlbWVudClcclxuXHRcdFx0fSk7XHJcblx0XHRcdCQoZS5tb3ZlRGVja1tpXS5jYXJkLmRvbUVsZW1lbnQpLmFuaW1hdGUoX3BhcmFtcywgc2hhcmUuYW5pbWF0aW9uVGltZSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0ZS5kZXBhcnR1cmUuUmVkcmF3KCk7XHJcblx0XHRcdFx0ZS5kZXN0aW5hdGlvbi5SZWRyYXcoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHQkKCcuZHJhZ2dhYmxlJykucHJvbWlzZSgpLmRvbmUoZnVuY3Rpb24oKXtcclxuXHRcdCAgICBzaGFyZS5jdXJVbkxvY2soKTtcclxuXHRcdCAgICBtYWluLmV2ZW50LmRpc3BhdGNoKCdtb3ZlRHJhZ0RlY2tEb25lJywge2RlY2sgOiBlLmRlc3RpbmF0aW9ufSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ21vdmVDYXJkVG9Ib21lJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0Ly8gIE1vdmUgY2FyZCBob21lXHJcblx0XHQvLyBjb25zb2xlLmxvZygnTW92ZSBjYXJkIGhvbWUnLCBlKTtcclxuXHRcdHNoYXJlLmN1ckxvY2soKTtcclxuXHQgICAgZm9yKGkgaW4gZS5tb3ZlRGVjaykge1xyXG5cdCAgICBcdHZhciBfcG9zaXRpb24gPSBlLmRlcGFydHVyZS5wYWRkaW5nKGUubW92ZURlY2tbaV0uaW5kZXgpO1xyXG5cdCAgICBcdHZhciBfcGFyYW1zID0ge1xyXG5cdCAgICBcdFx0bGVmdCA6IF9wb3NpdGlvbi54ICsgJ3B4JyxcclxuXHQgICAgXHRcdHRvcCAgOiBfcG9zaXRpb24ueSArICdweCdcclxuXHQgICAgXHR9XHJcblx0ICAgIFx0JChlLm1vdmVEZWNrW2ldLmNhcmQuZG9tRWxlbWVudCkuYW5pbWF0ZShfcGFyYW1zLCBzaGFyZS5hbmltYXRpb25UaW1lKTtcclxuXHQgICAgfVxyXG4gICAgXHQkKCcuZHJhZ2dhYmxlJykucHJvbWlzZSgpLmRvbmUoZnVuY3Rpb24oKXtcclxuXHRcdCAgICBzaGFyZS5jdXJVbkxvY2soKTtcclxuXHRcdH0pO1xyXG5cdCAgICBcclxuXHRcdCQoJy5kcmFnZ2FibGUnKS5wcm9taXNlKCkuZG9uZShmdW5jdGlvbigpIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKF9kZWNrX2RlcGFydHVyZSwgX2RlY2tfZGVzdGluYXRpb24pO1xyXG5cdFx0XHRpZihlLmRlcGFydHVyZSkge1xyXG5cdFx0XHRcdGUuZGVwYXJ0dXJlLlJlZHJhdygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8qaWYoX2RlY2tfZGVzdGluYXRpb24pIHtcclxuXHRcdFx0XHRfZGVja19kZXN0aW5hdGlvbi5SZWRyYXcoKTtcclxuXHRcdFx0fSovXHJcblx0XHR9KTtcclxuXHR9KVxyXG5cdFxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdtb3ZlRHJhZ0RlY2tEb25lJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0XHJcblx0XHRpZighZS5kZWNrLmZpbGwpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0dmFyIF9kZWNrID0gZS5kZWNrLmdldENhcmRzKCk7XHJcblx0XHRmb3IoaSBpbiBfZGVjaykge1xyXG5cdFx0XHQkKF9kZWNrW2ldLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdmaWxsJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leHRlbnNpb25zL0RvbU1hbmFnZXIuanNcbiAqKiBtb2R1bGUgaWQgPSA2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0XHJcblx0dmFyIHNodWZmbGUgPSBmdW5jdGlvbihhKSB7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ1NIVUZGTEU6JywgYSwgdHlwZW9mIGEpO1xyXG4gICAgXHJcblx0ICAgIGZvcih2YXIgaiwgeCwgaSA9IGEubGVuZ3RoOyBpOyBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogaSksIHggPSBhWy0taV0sIGFbaV0gPSBhW2pdLCBhW2pdID0geCkge31cclxuXHQgICAgLyp2YXIgeSA9IDAsIHggPSAxO1xyXG5cdCAgICBmb3IoaSBpbiBhKSB7XHJcblx0ICAgICAgICBpZih4ID4gMTMpIHtcclxuXHQgICAgICAgICAgICB4ID0gMTtcclxuXHQgICAgICAgICAgICB5ICs9IDE7XHJcblx0ICAgICAgICB9XHJcblx0ICAgICAgICBhW2ldLnkgPSB5O1xyXG5cdCAgICAgICAgYVtpXS54ID0geDtcclxuXHQgICAgICAgIHggKz0gMVxyXG5cdCAgICB9Ki9cclxuXHQgICAgcmV0dXJuIGE7XHJcblx0fVxyXG5cclxuXHRtYWluLmRlY2tHZW5lcmF0b3IgPSBmdW5jdGlvbihhKSB7XHJcblxyXG5cdFx0dmFyIGRlZmF1bHRfdHlwZSA9ICdhbGwnO1xyXG5cclxuXHRcdHZhciBkZWZhdWx0X3NodWZmbGUgPSBmYWxzZTtcclxuXHRcdHZhciBtYXhfaXRlcmF0aW9ucyA9IDEwO1xyXG5cclxuXHRcdHZhciB0eXBlICAgICAgICA9IGEgJiYgYS50eXBlICAgICAgICYmIHR5cGVvZiBhLnR5cGUgICAgICAgPT0gJ3N0cmluZycgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBhLnR5cGUgICAgICAgOiBkZWZhdWx0X3R5cGU7XHJcblx0XHR2YXIgX2l0ZXJhdGlvbnMgPSBhICYmIGEuaXRlcmF0aW9ucyAmJiB0eXBlb2YgYS5pdGVyYXRpb25zID09ICdudW1iZXInICYmIGEuaXRlcmF0aW9ucyA8IG1heF9pdGVyYXRpb25zID8gYS5pdGVyYXRpb25zIDogMTtcclxuXHRcdHZhciBfc2h1ZmZsZSAgICA9IGEgJiYgYS5zaHVmZmxlICAgICYmIHR5cGVvZiBhLnNodWZmbGUgICAgPT0gJ2Jvb2xlYW4nICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBhLnNodWZmbGUgICAgOiBkZWZhdWx0X3NodWZmbGU7XHJcblxyXG5cdFx0dmFyIGdlblR5cGUgPSBmdW5jdGlvbihfY2FyZHNDb2xvcnMsIF9jYXJkc1JhbmtzKSB7XHJcblx0XHRcdHZhciBfZGVjayA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGMgaW4gX2NhcmRzQ29sb3JzKSB7XHJcblx0XHRcdFx0Zm9yKHZhciByIGluIF9jYXJkc1JhbmtzKSB7XHJcblx0XHRcdFx0XHRfZGVjay5wdXNoKF9jYXJkc0NvbG9yc1tjXSArIF9jYXJkc1JhbmtzW3JdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIF9kZWNrO1xyXG5cdFx0fVxyXG5cdFx0dmFyIF9yYW5rcyA9IHNoYXJlLmNhcmRzUmFua1M7XHJcblx0XHRpZihhICYmIGEucmFua3MpIHtcclxuXHRcdFx0X3JhbmtzID0gW11cclxuXHRcdFx0Zm9yKGkgaW4gYS5yYW5rcykge1xyXG5cdFx0XHRcdGlmKHNoYXJlLmNhcmRzUmFua1MuaW5kZXhPZihhLnJhbmtzW2ldLnRvU3RyaW5nKCkpID49IDApIHtcclxuXHRcdFx0XHRcdF9yYW5rcy5wdXNoKGEucmFua3NbaV0udG9TdHJpbmcoKSlcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIGdlblR5cGVzID0ge1xyXG5cdFx0XHRhbGwgICAgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gZ2VuVHlwZShzaGFyZS5jYXJkc1N1aXRzLCBfcmFua3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRibGFjayAgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2NhcmRzU3VpdHMgPSBzaGFyZS5jYXJkQ29sb3JzLmJsYWNrO1xyXG5cdFx0XHRcdHJldHVybiBnZW5UeXBlKF9jYXJkc1N1aXRzLCBfcmFua3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWQgICAgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2NhcmRzU3VpdHMgPSBzaGFyZS5jYXJkQ29sb3JzLnJlZDtcclxuXHRcdFx0XHRyZXR1cm4gZ2VuVHlwZShfY2FyZHNTdWl0cywgX3JhbmtzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YmxhY2tfYW5kX3JlZCAgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2NhcmRzU3VpdHMgPSBbXHJcblx0XHRcdFx0XHRzaGFyZS5jYXJkQ29sb3JzLnJlZFsoTWF0aC5yYW5kb20oKSAqIHNoYXJlLmNhcmRDb2xvcnMucmVkLmxlbmd0aCl8MF0sIFxyXG5cdFx0XHRcdFx0c2hhcmUuY2FyZENvbG9ycy5ibGFja1soTWF0aC5yYW5kb20oKSAqIHNoYXJlLmNhcmRDb2xvcnMuYmxhY2subGVuZ3RoKXwwXVxyXG5cdFx0XHRcdF07XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoX2NhcmRzU3VpdHMsIF9yYW5rcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGhfb25seSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBfY2FyZHNTdWl0cyA9IFsnaCddO1xyXG5cdFx0XHRcdHJldHVybiBnZW5UeXBlKF9jYXJkc1N1aXRzLCBfcmFua3MpO1xyXG5cdFx0XHR9LCBcclxuXHRcdFx0ZF9vbmx5IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gWydkJ107XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoX2NhcmRzU3VpdHMsIF9yYW5rcyk7XHJcblx0XHRcdH0sIFxyXG5cdFx0XHRjX29ubHkgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2NhcmRzU3VpdHMgPSBbJ2MnXTtcclxuXHRcdFx0XHRyZXR1cm4gZ2VuVHlwZShfY2FyZHNTdWl0cywgX3JhbmtzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0c19vbmx5IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gWydzJ107XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoX2NhcmRzU3VpdHMsIF9yYW5rcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdG9uZV9yYW5rX29ubHkgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2NhcmRzU3VpdHMgPSBbc2hhcmUuY2FyZHNDb2xvcnNbKE1hdGgucmFuZG9tKCkgKiBzaGFyZS5jYXJkc0NvbG9ycy5sZW5ndGgpfDBdXTtcclxuXHRcdFx0XHRyZXR1cm4gZ2VuVHlwZShfY2FyZHNTdWl0cywgX3JhbmtzKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgX2RlY2sgPSBbXTtcclxuXHRcdFxyXG5cdFx0Zm9yKDtfaXRlcmF0aW9ucyA+IDA7X2l0ZXJhdGlvbnMgLT0gMSkge1xyXG5cdFx0XHRfZGVjayA9IF9kZWNrLmNvbmNhdChnZW5UeXBlc1t0eXBlXSgpKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZihfc2h1ZmZsZSkge1xyXG5cdFx0XHRfZGVjayA9IHNodWZmbGUoX2RlY2spO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBfZGVjaztcclxuXHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9kZWNrR2VuZXJhdG9yLmpzXG4gKiogbW9kdWxlIGlkID0gN1xuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRzaGFyZS51bmRvTWV0aG9kcyA9IHt9O1xyXG5cdHNoYXJlLnJlZG9NZXRob2RzID0ge307XHJcblx0XHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3VuZG8nLCBmdW5jdGlvbihhKSB7XHJcblx0XHRcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdmb3JjZU1vdmUgdW5kbzonLCBzaGFyZS51bmRvTWV0aG9kcyk7XHJcblxyXG5cdFx0aWYoIWEpIHJldHVybjtcclxuXHRcdFxyXG5cdFx0Zm9yKGkgaW4gc2hhcmUudW5kb01ldGhvZHMpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coaSk7XHJcblx0XHRcdHNoYXJlLnVuZG9NZXRob2RzW2ldKGEpO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBpZihhLmZsaXApIHtcclxuXHRcdC8vIH07XHJcblx0XHRcclxuXHRcdGlmKGEudW5mbGlwKSB7XHJcblx0XHRcdGlmKFxyXG5cdFx0XHRcdHR5cGVvZiBhLnVuZmxpcC5kZWNrICAgICAgID09IFwic3RyaW5nXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkICAgICAgICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkLm5hbWUgID09IFwic3RyaW5nXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkLmluZGV4ICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gbWFpbi5EZWNrKGEudW5mbGlwLmRlY2spO1xyXG5cdFx0XHRcdFx0X2NhcmRzID0gX2RlY2sgPyBfZGVjay5nZXRDYXJkcygpIDogW107XHJcblx0XHRcdFx0aWYoX2NhcmRzW2EudW5mbGlwLmNhcmQuaW5kZXhdLm5hbWUgPT0gYS51bmZsaXAuY2FyZC5uYW1lKSB7XHJcblx0XHRcdFx0XHRfY2FyZHNbYS51bmZsaXAuY2FyZC5pbmRleF0uZmxpcCA9IHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0XHJcblx0XHRpZihhLmZpbGwpIHtcclxuXHRcdFx0Ly8gVE9ET1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBpZighYSB8fCAhYS5tb3ZlKSByZXR1cm47XHJcblx0XHRpZihcclxuXHRcdFx0dHlwZW9mIGEubW92ZSAgICAgICE9IFwidW5kZWZpbmVkXCIgXHJcblx0XHQgJiYgdHlwZW9mIGEubW92ZS5mcm9tICE9IFwidW5kZWZpbmVkXCIgXHJcblx0XHQgJiYgdHlwZW9mIGEubW92ZS50byAgICE9IFwidW5kZWZpbmVkXCIgXHJcblx0XHQgJiYgdHlwZW9mIGEubW92ZS5kZWNrICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdCkge1xyXG5cdFx0XHRzaGFyZS5mb3JjZU1vdmUoe1xyXG5cdFx0XHRcdGZyb20gOiBhLm1vdmUudG8sXHJcbiAgICAgICAgICAgICAgICB0byAgIDogYS5tb3ZlLmZyb20sXHJcbiAgICAgICAgICAgICAgICBkZWNrIDogYS5tb3ZlLmRlY2tcclxuXHRcdFx0fSlcclxuXHRcdH1cclxuXHJcblxyXG5cdH0pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbigncmVkbycsIGZ1bmN0aW9uKGEpIHtcclxuXHRcdFxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2ZvcmNlTW92ZSByZWRvOicsIHNoYXJlLnJlZG9NZXRob2RzKTtcclxuXHJcblx0XHRpZighYSkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHRmb3IoaSBpbiBzaGFyZS5yZWRvTWV0aG9kcykge1xyXG5cdFx0XHRzaGFyZS5yZWRvTWV0aG9kc1tpXShhKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBpZihhLmZsaXApIHtcclxuXHRcdC8vIH07XHJcblx0XHRcclxuXHRcdGlmKGEudW5mbGlwKSB7XHJcblx0XHRcdGlmKFxyXG5cdFx0XHRcdHR5cGVvZiBhLnVuZmxpcC5kZWNrICAgICAgID09IFwic3RyaW5nXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkICAgICAgICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkLm5hbWUgID09IFwic3RyaW5nXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkLmluZGV4ICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gbWFpbi5EZWNrKGEudW5mbGlwLmRlY2spO1xyXG5cdFx0XHRcdFx0X2NhcmRzID0gX2RlY2sgPyBfZGVjay5nZXRDYXJkcygpIDogW107XHJcblx0XHRcdFx0aWYoX2NhcmRzW2EudW5mbGlwLmNhcmQuaW5kZXhdLm5hbWUgPT0gYS51bmZsaXAuY2FyZC5uYW1lKSB7XHJcblx0XHRcdFx0XHRfY2FyZHNbYS51bmZsaXAuY2FyZC5pbmRleF0uZmxpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aWYoYS5maWxsKSB7XHJcblx0XHRcdC8vIFRPRE9cclxuXHRcdH07XHJcblxyXG5cdFx0aWYoIWEgfHwgIWEubW92ZSkgcmV0dXJuO1xyXG5cdFx0aWYoXHJcblx0XHRcdHR5cGVvZiBhLm1vdmUuZnJvbSAhPSBcInVuZGVmaW5lZFwiIFxyXG5cdFx0ICYmIHR5cGVvZiBhLm1vdmUudG8gICAhPSBcInVuZGVmaW5lZFwiIFxyXG5cdFx0ICYmIHR5cGVvZiBhLm1vdmUuZGVjayAhPSBcInVuZGVmaW5lZFwiXHJcblx0XHQpIHtcclxuXHRcdFx0c2hhcmUuZm9yY2VNb3ZlKHtcclxuXHRcdFx0XHRmcm9tIDogYS5tb3ZlLmZyb20sXHJcbiAgICAgICAgICAgICAgICB0byAgIDogYS5tb3ZlLnRvLFxyXG4gICAgICAgICAgICAgICAgZGVjayA6IGEubW92ZS5kZWNrXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9Tb2xpdGFpcmVIaXN0b3J5LmpzXG4gKiogbW9kdWxlIGlkID0gOFxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFx0XHJcblx0c2hhcmUudGlwc1J1bGVzID0ge1xyXG5cdFxyXG5cdFx0YWxsVG9BbGwgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdHZhciBfbW92ZXMgPSBbXTtcclxuXHRcdFx0Ly8gZWFjaCBkZWNrc1xyXG5cdFx0XHRmb3IodmFyIGRlY2tJbmRleCBpbiBhLmRlY2tzKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkcyA9IGEuZGVja3NbZGVja0luZGV4XS5nZXRDYXJkcygpO1xyXG5cdFx0XHRcdC8vIGVhY2ggY2FyZHMgaW4gIGN1cnJlbnQgZGVja1xyXG5cdFx0XHRcdGZvcih2YXIgY2FyZEluZGV4IGluIF9jYXJkcykge1xyXG5cdFx0XHRcdFx0dmFyIF9pZCA9IF9jYXJkc1tjYXJkSW5kZXhdLmlkO1xyXG5cdFx0XHRcdFx0Ly8gY2hlY2sgY2FuIHRha2UgdGhpcyBjYXJkL2RlY2tcclxuXHRcdFx0XHRcdHZhciBfdGFrZSA9IGEuZGVja3NbZGVja0luZGV4XS5UYWtlKF9pZCk7XHJcblx0XHRcdFx0XHRpZihfdGFrZSkge1xyXG5cdFx0XHRcdFx0XHQvLyBjaGVjayBwdXQgdGFrZWQgY2FyZC9kZWNrIGlpbnRvIGFub3RoZXIgZGVja3NcclxuXHRcdFx0XHRcdFx0Zm9yKHZhciBkZWNrSW5kZXhfMiBpbiBhLmRlY2tzKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gLi4uYWxsIHdpdGhvdXQgY3VycmVudFxyXG5cdFx0XHRcdFx0XHRcdGlmKGRlY2tJbmRleCAhPSBkZWNrSW5kZXhfMikge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIF9wdXQgPSBhLmRlY2tzW2RlY2tJbmRleF8yXS5QdXQoX3Rha2UpO1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYoX3B1dCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgX2NhcmRzX3RvID0gYS5kZWNrc1tkZWNrSW5kZXhfMl0uZ2V0Q2FyZHMoKSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRfY2FyZF90byAgPSBfY2FyZHNfdG8ubGVuZ3RoID8gX2NhcmRzX3RvW19jYXJkc190by5sZW5ndGggLSAxXSA6IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdUaXA6JywgYS5kZWNrc1tkZWNrSW5kZXhfMl0uZG9tRWxlbWVudC8qX2NhcmRzW2NhcmRJbmRleF0ubmFtZSwgJ2Zyb20nLCBhLmRlY2tzW2RlY2tJbmRleF0ubmFtZSwgYS5kZWNrc1tkZWNrSW5kZXhdLnZpc2libGUsICd0bycsIGEuZGVja3NbZGVja0luZGV4XzJdLm5hbWUqLylcclxuXHRcdFx0XHRcdFx0XHRcdFx0X21vdmVzLnB1c2goe1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGZyb20gOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZWNrIDogYS5kZWNrc1tkZWNrSW5kZXhdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Y2FyZCA6IF9jYXJkc1tjYXJkSW5kZXhdLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dG8gOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkZWNrIDogYS5kZWNrc1tkZWNrSW5kZXhfMl0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0Q2FyZCA6IF9jYXJkX3RvXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2FsbFRvQWxsOicsIF9tb3Zlcy5sZW5ndGgpO1xyXG5cdFx0XHRyZXR1cm4gX21vdmVzO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4dGVuc2lvbnMvdGlwc1J1bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRzaGFyZS50aXBUeXBlcyA9IFsndGlwJywgJ3RpcFRvJywgJ3RpcFByaW9yaXR5J107XHJcblx0XHJcblx0bWFpbi5zaG93VGlwcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHJcblx0XHQvLyBjb25zb2xlLmxvZygnbWFpbi5zaG93VGlwcycpO1xyXG5cdFx0c2hhcmUuc2hvd1RpcHMgPSB0cnVlO1xyXG5cdFx0c2hhcmUuY2hlY2tUaXBzKCk7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLmhpZGVUaXBzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdtYWluLmhpZGVUaXBzJyk7XHJcblx0XHRzaGFyZS5zaG93VGlwcyA9IGZhbHNlO1xyXG5cdFx0c2hhcmUuY2hlY2tUaXBzKCk7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRzaGFyZS5jaGVja1RpcHMgPSBmdW5jdGlvbihhKSB7XHJcblx0XHRcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdzaGFyZS5jaGVja1RpcHMnKTtcclxuXHJcblx0XHRzaGFyZS5UaXBzID0gW107XHJcblxyXG5cdFx0Ly8gJCgnLnRpcCcpICAgICAgICAucmVtb3ZlQ2xhc3MoJ3RpcCcpO1xyXG5cdFx0Ly8gJCgnLnRpcFRvJykgICAgICAucmVtb3ZlQ2xhc3MoJ3RpcFRvJyk7XHJcblx0XHQvLyAkKCcudGlwUHJpb3JpdHknKS5yZW1vdmVDbGFzcygndGlwUHJpb3JpdHknKTtcclxuXHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ2hpZGVUaXBzJyk7XHJcblxyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdzaGFyZS5jaGVja1RpcHMnKVxyXG5cclxuXHRcdHZhciBfZGVja3MgPSB0aGlzLmdldERlY2tzKHt2aXNpYmxlIDogdHJ1ZX0pO1xyXG5cdFx0Lypmb3IoaSBpbiBfYWxsX2RlY2tzKSB7XHJcblx0XHRcdGlmKF9hbGxfZGVja3NbaV0udmlzaWJsZSkge1xyXG5cdFx0XHRcdF9kZWNrcy5wdXNoKF9hbGxfZGVja3NbaV0pXHJcblx0XHRcdH1cclxuXHRcdH0qL1xyXG5cdFx0Ly8gdmFyIHRpcHMgPSBzaGFyZS5hdXRvVGlwcygpXHJcblx0XHRpZih0eXBlb2Ygc2hhcmUuYXV0b1RpcHMgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRzaGFyZS5UaXBzID0gc2hhcmUuYXV0b1RpcHMoe1xyXG5cdFx0XHRcdGRlY2tzIDogX2RlY2tzXHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yKGkgaW4gc2hhcmUuYXV0b1RpcHMpIHtcclxuXHRcdFx0XHRpZih0eXBlb2Ygc2hhcmUuYXV0b1RpcHNbaV0gPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0c2hhcmUuVGlwcyA9IHNoYXJlLlRpcHMuY29uY2F0KFxyXG5cdFx0XHRcdFx0XHRzaGFyZS5hdXRvVGlwc1tpXSh7XHJcblx0XHRcdFx0XHRcdFx0ZGVja3MgOiBfZGVja3NcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKHNoYXJlLnRpcHNSdWxlc1tpXSkge1xyXG5cdFx0XHRcdFx0XHRzaGFyZS5UaXBzID0gc2hhcmUuVGlwcy5jb25jYXQoXHJcblx0XHRcdFx0XHRcdFx0c2hhcmUudGlwc1J1bGVzW2ldKHtcclxuXHRcdFx0XHRcdFx0XHRcdGRlY2tzIDogX2RlY2tzLFxyXG5cdFx0XHRcdFx0XHRcdFx0cnVsZXMgOiBzaGFyZS5hdXRvVGlwc1tpXVxyXG5cdFx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZihzaGFyZS5zaG93VGlwcykge1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ3NoYXJlLnNob3dUaXBzJywgc2hhcmUuVGlwcywgc2hhcmUuaG9tZUdyb3Vwcyk7XHJcblxyXG5cdFx0XHRmb3IoaSBpbiBzaGFyZS5UaXBzKSB7XHJcblxyXG5cdFx0XHRcdC8vIFRPRE8g0LjQvdC40YbQuNCw0LvQuNC30LjRgNC+0LLQsNGC0YwgXCJoaWRlVGlwc0luRG9tXCIg0LIgRmllbGQuanMgXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1BBUkVOVCBJUzonLCBzaGFyZS5UaXBzW2ldLmZyb20uZGVjay5wYXJlbnQoKSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoLypzaGFyZS5oaWRlVGlwc0luRG9tICYmICovIHNoYXJlLmhvbWVHcm91cHMgJiYgc2hhcmUuaG9tZUdyb3Vwcy5pbmRleE9mKHNoYXJlLlRpcHNbaV0uZnJvbS5kZWNrLnBhcmVudCgpKSA+PSAwKSB7XHJcblx0XHRcdFx0XHQvLyA/IyQlJiFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gJChzaGFyZS5UaXBzW2ldLmZyb20uY2FyZC5kb21FbGVtZW50KS5hZGRDbGFzcygndGlwJyk7XHJcblx0XHRcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdzaG93VGlwJywge2VsIDogc2hhcmUuVGlwc1tpXS5mcm9tLmNhcmQsIHR5cGUgOiAndGlwJ30pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLnRpcHNNb3ZlID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdGlmKCFzaGFyZS5zaG93VGlwUHJpb3JpdHkpIHJldHVybjtcclxuXHJcblx0XHQvLyAkKCcudGlwUHJpb3JpdHknKS5yZW1vdmVDbGFzcygndGlwUHJpb3JpdHknKTtcclxuXHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ2hpZGVUaXBzJywge3R5cGVzIDogWyd0aXBQcmlvcml0eSddfSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3RpcHNNb3ZlJywgYSwgc2hhcmUuc2hvd1RpcFByaW9yaXR5KTtcclxuXHRcdFxyXG5cdFx0aWYoIHNoYXJlLnNob3dUaXBQcmlvcml0eSBcclxuXHRcdCAmJiBhIFxyXG5cdFx0ICYmIGEubW92ZURlY2sgXHJcblx0XHQgJiYgYS5jdXJzb3JNb3ZlIFxyXG5cdFx0ICYmIGEuY3Vyc29yTW92ZS5kaXN0YW5jZSBcclxuXHRcdCAmJiBhLmN1cnNvck1vdmUuZGlzdGFuY2UgPj0gc2hhcmUubW92ZURpc3RhbmNlXHJcblx0XHQpIHtcclxuXHJcblx0XHRcdHZhciBUaXAgPSBzaGFyZS5iZXN0VGlwKGEubW92ZURlY2ssIGEuY3Vyc29yTW92ZSk7XHJcblx0XHRcdGlmKFRpcCkge1xyXG5cdFx0XHRcdC8qaWYoVGlwLnRvLmxhc3RDYXJkKSB7XHJcblx0XHRcdFx0XHQkKFRpcC50by5sYXN0Q2FyZC5kb21FbGVtZW50KS5hZGRDbGFzcygndGlwUHJpb3JpdHknKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0JChUaXAudG8uZGVjay5nZXREb21FbGVtZW50KCkpLmFkZENsYXNzKCd0aXBQcmlvcml0eScpO1xyXG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUud2FybignIzAnLCBlLCBUaXApXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSovXHJcblx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnc2hvd1RpcCcsIHtlbCA6IHNoYXJlLlRpcHNbaV0udG8uZGVjaywgdHlwZSA6ICd0aXBQcmlvcml0eSd9KTtcclxuXHJcblx0XHRcdFx0Ly8gJChUaXAudG8ubGFzdENhcmQuZG9tRWxlbWVudCkuYWRkQ2xhc3MoJ3RpcFByaW9yaXR5Jyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LmJpbmQobWFpbilcclxuXHJcblx0bWFpbi50aXBzRGVzdGluYXRpb24gPSBmdW5jdGlvbihhKSB7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3RpcHNEZXN0aW5hdGlvbicsIGEpXHJcblx0XHRcclxuXHRcdGlmKC8qc2hhcmUuc2hvd1RpcHMgJiYgKi9zaGFyZS5zaG93VGlwc0Rlc3RpbmF0aW9uKSB7XHJcblxyXG5cdFx0XHQvLyAkKCcudGlwJykgICAgICAgIC5yZW1vdmVDbGFzcygndGlwJyk7XHJcblx0XHRcdC8vICQoJy50aXBUbycpICAgICAgLnJlbW92ZUNsYXNzKCd0aXBUbycpO1xyXG5cdFx0XHQvLyAkKCcudGlwUHJpb3JpdHknKS5yZW1vdmVDbGFzcygndGlwUHJpb3JpdHknKTtcclxuXHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnaGlkZVRpcHMnLyosIHt0eXBlcyA6IFsndGlwJ119Ki8pO1xyXG5cdFx0XHRcclxuXHRcdFx0Lyp0cnkge1xyXG5cdFx0XHRcdGlmKGEgJiYgYS5jdXJyZW50Q2FyZCAmJiAkKGEuY3VycmVudENhcmQpKSB7XHJcblx0XHRcdFx0XHQkKGEuY3VycmVudENhcmQpLmFkZENsYXNzKCd0aXAnKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gY2F0Y2goZSkge30qL1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoYSAmJiBhLmN1cnJlbnRDYXJkICYmIGEuY3VycmVudENhcmQuaWQpIGZvcihpIGluIHNoYXJlLlRpcHMpIHtcclxuXHRcdFx0XHRpZihzaGFyZS5UaXBzW2ldLmZyb20uY2FyZC5pZCA9PSBhLmN1cnJlbnRDYXJkLmlkKSB7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gdmFyIF9jYXJkcyA9IHNoYXJlLlRpcHNbaV0udG8uZGVjay5nZXRDYXJkcygpLFxyXG5cdFx0XHRcdFx0Ly8gX2NhcmQgID0gX2NhcmRzW19jYXJkcy5sZW5ndGggLSAxXTtcclxuXHRcdFx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3Nob3dUaXAnLCB7ZWwgOiBzaGFyZS5UaXBzW2ldLnRvLmRlY2ssIHR5cGUgOiAndGlwVG8nfSk7XHJcblx0XHRcdFx0XHQvKmlmKHNoYXJlLlRpcHNbaV0udG8ubGFzdENhcmQpIHtcclxuXHRcdFx0XHRcdFx0JChzaGFyZS5UaXBzW2ldLnRvLmxhc3RDYXJkLmRvbUVsZW1lbnQpLmFkZENsYXNzKCd0aXBUbycpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0XHQkKHNoYXJlLlRpcHNbaV0udG8uZGVjay5nZXREb21FbGVtZW50KCkpLmFkZENsYXNzKCd0aXBUbycpO1xyXG5cdFx0XHRcdFx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLndhcm4oJyMxJywgZSwgc2hhcmUuVGlwc1tpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0qL1xyXG5cdFx0XHRcdFx0Ly8gJChzaGFyZS5UaXBzW2ldLnRvLmxhc3RDYXJkLmRvbUVsZW1lbnQpLmFkZENsYXNzKCd0aXBUbycpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0uYmluZChtYWluKVxyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9UaXBzLmpzXG4gKiogbW9kdWxlIGlkID0gMTBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHRcclxuXHRzaGFyZS5iZXN0VGlwID0gZnVuY3Rpb24obW92ZURlY2ssIGN1cnNvck1vdmUpIHtcclxuXHJcblx0XHR2YXIgX2F1dG9UaXBzID0gW107XHJcblx0XHRmb3IoaSBpbiBzaGFyZS5UaXBzKSB7XHJcblx0XHRcdGlmKHNoYXJlLlRpcHNbaV0uZnJvbS5jYXJkLmlkID09IG1vdmVEZWNrWzBdLmNhcmQuaWQpIHtcclxuXHRcdFx0XHRfYXV0b1RpcHMucHVzaChzaGFyZS5UaXBzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihfYXV0b1RpcHMubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1vdmUgY2FyZCB0byBjbG9zZXN0IGRlY2sgb2YgYSBwb3NzaWJsZSBtb3ZlXHJcblxyXG5cdFx0dmFyIF9taW5fZGlzdGFuY2UgICAgICAgPSAtMSxcclxuXHRcdFx0X3RpcF9pbmRleCAgICAgICAgICA9IDAsXHJcblx0XHRcdF9pbl9kaXJlY3Rpb25fY291bnQgPSAwO1xyXG5cclxuXHRcdGlmKHNoYXJlLmhvbWVHcm91cHMpIHtcclxuXHRcdFx0dmFyIF90aXBzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBzaGFyZS5ob21lR3JvdXBzKSB7XHJcblx0XHRcdFx0Zm9yKHZhciB0IGluIF9hdXRvVGlwcykge1xyXG5cdFx0XHRcdFx0aWYoX2F1dG9UaXBzW3RdLnRvLmRlY2sucGFyZW50KCkgPT0gc2hhcmUuaG9tZUdyb3Vwc1tpXSkge1xyXG5cdFx0XHRcdFx0XHRfdGlwcy5wdXNoKF9hdXRvVGlwc1t0XSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKF90aXBzLmxlbmd0aCkgX2F1dG9UaXBzID0gX3RpcHM7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoX2F1dG9UaXBzLmxlbmd0aCA+PSAyKSB7XHJcblxyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2F1dG9UaXBzKSB7XHJcblxyXG5cdFx0XHRcdHZhciBjZW50ZXJfZnJvbSA9IHtcclxuXHRcdFx0XHRcdHggOiBjdXJzb3JNb3ZlLmRlY2tQb3NpdGlvbi54ICsgKHNoYXJlLmNhcmQud2lkdGggICogc2hhcmUuem9vbSksXHJcblx0XHRcdFx0XHR5IDogY3Vyc29yTW92ZS5kZWNrUG9zaXRpb24ueSArIChzaGFyZS5jYXJkLmhlaWdodCAqIHNoYXJlLnpvb20pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBfZGVzdGluYXRpb25fZGVja19sYXN0X2NhcmRfcG9zaXRpb24gPSBfYXV0b1RpcHNbaV0udG8uZGVjay5wYWRkaW5nKF9hdXRvVGlwc1tpXS50by5kZWNrLmdldENhcmRzKCkubGVuZ3RoKTtcclxuXHRcdFx0XHR2YXIgY2VudGVyX3RvID0ge1xyXG5cdFx0XHRcdFx0eCA6IF9kZXN0aW5hdGlvbl9kZWNrX2xhc3RfY2FyZF9wb3NpdGlvbi54ICsgKHNoYXJlLmNhcmQud2lkdGggICogc2hhcmUuem9vbSksXHJcblx0XHRcdFx0XHR5IDogX2Rlc3RpbmF0aW9uX2RlY2tfbGFzdF9jYXJkX3Bvc2l0aW9uLnkgKyAoc2hhcmUuY2FyZC5oZWlnaHQgKiBzaGFyZS56b29tKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRfYXV0b1RpcHNbaV0uZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5zcXIoY2VudGVyX2Zyb20ueCAtIGNlbnRlcl90by54KSArIE1hdGguc3FyKGNlbnRlcl9mcm9tLnkgLSBjZW50ZXJfdG8ueSkpO1xyXG5cdFx0XHRcdF9hdXRvVGlwc1tpXS5pbkRpcmVjdGlvbiA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmKFxyXG5cdFx0XHRcdFx0KGN1cnNvck1vdmUuZGlyZWN0aW9uLnggPiAwICYmIGNlbnRlcl90by54ID4gY2VudGVyX2Zyb20ueClcclxuXHRcdFx0XHQgfHwgKGN1cnNvck1vdmUuZGlyZWN0aW9uLnggPCAwICYmIGNlbnRlcl90by54IDwgY2VudGVyX2Zyb20ueClcclxuXHRcdFx0XHQpIHtcclxuICAgIFx0XHRcdFx0X2F1dG9UaXBzW2ldLmluRGlyZWN0aW9uID0gdHJ1ZTtcclxuXHQgICAgXHRcdFx0X2luX2RpcmVjdGlvbl9jb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQgLy8gfHwgKGN1cnNvck1vdmUuZGlyZWN0aW9uLnkgPiAwICYmIGNlbnRlcl90by55ID4gY2VudGVyX2Zyb20ueSlcclxuXHRcdFx0XHQgLy8gfHwgKGN1cnNvck1vdmUuZGlyZWN0aW9uLnkgPCAwICYmIGNlbnRlcl90by55IDwgY2VudGVyX2Zyb20ueSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKF9pbl9kaXJlY3Rpb25fY291bnQsIF9hdXRvVGlwcyk7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2F1dG9UaXBzKSB7XHJcblxyXG5cdFx0XHRcdGlmKF9taW5fZGlzdGFuY2UgPT0gJy0xJykge1xyXG5cdFx0XHRcdFx0aWYoX2luX2RpcmVjdGlvbl9jb3VudCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdF9taW5fZGlzdGFuY2UgPSBfYXV0b1RpcHNbaV0uZGlzdGFuY2U7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZihfYXV0b1RpcHNbaV0uaW5EaXJlY3Rpb24gPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRcdF9taW5fZGlzdGFuY2UgPSBfYXV0b1RpcHNbaV0uZGlzdGFuY2U7XHJcblx0XHRcdFx0XHRcdFx0X3RpcF9pbmRleCA9IGk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoX2F1dG9UaXBzW2ldLmRpc3RhbmNlIDwgX21pbl9kaXN0YW5jZSkge1xyXG5cdFx0XHRcdFx0aWYoX2luX2RpcmVjdGlvbl9jb3VudCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdF9taW5fZGlzdGFuY2UgPSBfYXV0b1RpcHNbaV0uZGlzdGFuY2U7XHJcblx0XHRcdFx0XHRcdF90aXBfaW5kZXggPSBpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYoX2F1dG9UaXBzW2ldLmluRGlyZWN0aW9uID09IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0XHRfbWluX2Rpc3RhbmNlID0gX2F1dG9UaXBzW2ldLmRpc3RhbmNlO1xyXG5cdFx0XHRcdFx0XHRcdF90aXBfaW5kZXggPSBpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUaXAgZm9yIGN1cnJlbnQgY2FyZDonLCBfYXV0b1RpcHNbX3RpcF9pbmRleF0sICdmcm9tOicsIF9hdXRvVGlwcy5sZW5ndGgsIF9hdXRvVGlwc1tfdGlwX2luZGV4XS50by5kZWNrLmdldERvbUVsZW1lbnQoKVswXS5pZCk7XHJcblxyXG5cdFx0cmV0dXJuIF9hdXRvVGlwc1tfdGlwX2luZGV4XVxyXG5cclxuXHR9XHJcblxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leHRlbnNpb25zL2Jlc3RUaXAuanNcbiAqKiBtb2R1bGUgaWQgPSAxMVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFxyXG5cdHNoYXJlLnJlYWR5VGFrZVJ1bGVzID0ge1xyXG5cdFx0XHRcdFxyXG5cdFx0Ly8gU2ltcGxlUnVsZXNcclxuXHRcdG5vdCAgICAgIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9LFxyXG5cdFx0bm90Rmlyc3QgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdub3RGaXJzdDonLCBhLmNhcmRJbmRleCk7XHJcblx0XHRcdHJldHVybiBhLmNhcmRJbmRleCA+IDA7XHJcblx0XHR9LFxyXG5cdFx0YW55ICAgICAgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHRcdG9ubHl0b3AgIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRyZXR1cm4gYS5jYXJkSW5kZXggPT0gYS5kZWNrTGVuZ3RoIC0gMTtcclxuXHRcdH0sXHJcblx0XHQvLyBUT0RPIHJ1bGVzXHJcblx0XHRzYW1wbGUgICA6IGZ1bmN0aW9uKGEpIHt9XHJcblx0fVxyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9yZWFkeVRha2VSdWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDEyXG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0XHJcblx0dmFyIHJwciA9IHNoYXJlLnJlYWR5UHV0UnVsZXMgPSB7XHJcblx0XHRcdFx0XHJcblx0XHQvLyBJbnRlcm5hbCB1c2VcclxuXHRcdF9kb3dudXBjYXJkcyA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0Ly8gaWYoYS5jYXJkcy5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR2YXIgZG93biA9IHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5jYXJkc1thLmNhcmRzLmxlbmd0aCAgLSAxXS5uYW1lKSxcclxuXHRcdFx0XHR1cCAgID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbMF0uY2FyZC5uYW1lKTtcclxuXHRcdFx0aWYoIWRvd24gfHwgIXVwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0dXAgICA6IHVwLFxyXG5cdFx0XHRcdGRvd24gOiBkb3duXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X2Rvd251cHJhbmtudW0gOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdHZhciBkdSA9IHJwci5fZG93bnVwY2FyZHMoYSk7XHJcblx0XHRcdHJldHVybiBkdSA/IHtcclxuXHRcdFx0XHRkb3duIDogc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKGR1LmRvd24ucmFuayksXHJcblx0XHRcdFx0dXAgICA6IHNoYXJlLmNhcmRzUmFua1MuaW5kZXhPZihkdS51cC5yYW5rKVxyXG5cdFx0XHR9IDogZmFsc2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdF9pc0ZpcnN0IDogZnVuY3Rpb24oYSwgX25hbWUpIHtcclxuXHRcdFx0aWYoYS5jYXJkcy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdHZhciBfdmFsaWRhdGUgPSBudWxsO1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQoX3ZhbGlkYXRlID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbMF0uY2FyZC5uYW1lKSlcclxuXHRcdFx0XHQgJiYgX3ZhbGlkYXRlLnJhbmsgPT0gX25hbWVcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHQgXHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUnVsZXNcclxuXHJcblx0XHRzdHJpcGVkIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRpZihhLmNhcmRzLmxlbmd0aCA9PSAwKSByZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBjb2xvcl9BID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLmNhcmRzW2EuY2FyZHMubGVuZ3RoIC0gMV0ubmFtZSkuY29sb3IsXHJcblx0XHRcdFx0Y29sb3JfQiA9IG51bGw7XHJcblxyXG5cdFx0XHR2YXIgX3ZhbGlkYXRlID0gbnVsbDtcclxuXHRcdFx0aWYoX3ZhbGlkYXRlID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbMF0uY2FyZC5uYW1lKSkge1xyXG5cdFx0XHRcdGNvbG9yX0IgPSBfdmFsaWRhdGUuY29sb3I7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBjb2xvcl9BICE9IGNvbG9yX0I7XHJcblx0XHRcdC8vIHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRmaXJzdEFjZSA6IGZ1bmN0aW9uKGEpIHtcdFx0XHRcclxuXHRcdFx0cmV0dXJuIHJwci5faXNGaXJzdChhLCBcIjFcIik7XHJcblx0XHR9LFxyXG5cclxuXHRcdGZpcnN0S2luZyA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIHJwci5faXNGaXJzdChhLCBcImtcIik7XHJcblx0XHR9LFxyXG5cclxuXHRcdG5vdEZvckVtcHR5IDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRyZXR1cm4gYS5jYXJkcy5sZW5ndGg7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uZVJhbmsgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmKGEuY2FyZHMubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cdFx0XHR2YXIgZHUgPSBycHIuX2Rvd251cGNhcmRzKGEpO1xyXG5cdFx0XHRyZXR1cm4gZHUgJiYgZHUudXAuc3VpdCA9PSBkdS5kb3duLnN1aXQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFueSA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdG5vdCA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhc2NlbmREZWNrIDogZnVuY3Rpb24oYSkgey8vYXNjZW5kIGRlY2sgYnkgc3RlcFxyXG5cdFx0XHRcclxuXHRcdFx0aWYoYS5wdXREZWNrLmxlbmd0aCA9PSAxKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBydWxlQ29ycmVjdCA9IHRydWU7XHJcblx0XHRcdGZvcihpIGluIGEucHV0RGVjaykge1xyXG5cdFx0XHRcdGlmKGkgPiAwKSB7XHJcblx0XHRcdFx0XHR2YXIgZG93biA9IHNoYXJlLmNhcmRzUmFua1MuaW5kZXhPZihcclxuXHRcdFx0XHRcdFx0XHRzaGFyZS52YWxpZGF0ZUNhcmROYW1lKGEucHV0RGVja1tpIC0gMV0uY2FyZC5uYW1lKS5yYW5rXHJcblx0XHRcdFx0XHRcdCksXHJcblx0XHRcdFx0XHRcdHVwICAgPSBzaGFyZS5jYXJkc1JhbmtTLmluZGV4T2YoXHJcblx0XHRcdFx0XHRcdFx0c2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbaV0uY2FyZC5uYW1lKS5yYW5rXHJcblx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHJ1bGVDb3JyZWN0ID0gcnVsZUNvcnJlY3QgJiYgMSArIGRvd24gPT0gdXA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBydWxlQ29ycmVjdDtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzY2VuZERlY2sgOiBmdW5jdGlvbihhKSB7Ly9hc2NlbmQgZGVjayBieSBzdGVwXHJcblx0XHRcdFxyXG5cdFx0XHRpZihhLnB1dERlY2subGVuZ3RoID09IDEpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHJ1bGVDb3JyZWN0ID0gdHJ1ZTtcclxuXHRcdFx0Zm9yKGkgaW4gYS5wdXREZWNrKSB7XHJcblx0XHRcdFx0aWYoaSA+IDApIHtcclxuXHRcdFx0XHRcdHZhciBkb3duID0gc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKFxyXG5cdFx0XHRcdFx0XHRcdHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5wdXREZWNrW2kgLSAxXS5jYXJkLm5hbWUpLnJhbmtcclxuXHRcdFx0XHRcdFx0KSxcclxuXHRcdFx0XHRcdFx0dXAgICA9IHNoYXJlLmNhcmRzUmFua1MuaW5kZXhPZihcclxuXHRcdFx0XHRcdFx0XHRzaGFyZS52YWxpZGF0ZUNhcmROYW1lKGEucHV0RGVja1tpXS5jYXJkLm5hbWUpLnJhbmtcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0cnVsZUNvcnJlY3QgPSBydWxlQ29ycmVjdCAmJiBkb3duID09IDEgKyB1cDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJ1bGVDb3JyZWN0O1xyXG5cdFx0fSxcclxuXHRcdFxyXG5cdFx0b25lUmFua0RlY2sgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihhLnB1dERlY2subGVuZ3RoID09IDEpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHJ1bGVDb3JyZWN0ID0gdHJ1ZTtcclxuXHRcdFx0Zm9yKGkgaW4gYS5wdXREZWNrKSB7XHJcblx0XHRcdFx0aWYoaSA+IDApIHtcclxuXHRcdFx0XHRcdHZhciBkb3duID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbaSAtIDFdLmNhcmQubmFtZSkuc3VpdCxcclxuXHRcdFx0XHRcdFx0dXAgICA9IHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5wdXREZWNrW2ldLmNhcmQubmFtZSkuc3VpdFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRydWxlQ29ycmVjdCA9IHJ1bGVDb3JyZWN0ICYmIGRvd24gPT0gdXA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBydWxlQ29ycmVjdDtcclxuXHRcdH0sXHJcblxyXG5cdFx0YXNjZW5kIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0L/Rg9GB0YLQsNGPINGB0YLQvtC/0LrQsCAtINC70Y7QsdCw0Y8g0LrQsNGA0YLQsFxyXG5cdFx0XHRpZihhLmNhcmRzLmxlbmd0aCA9PSAwKSByZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBkYSA9IHJwci5fZG93bnVwcmFua251bShhKTtcclxuXHRcdFx0cmV0dXJuIGRhICYmIGRhLmRvd24gPCBkYS51cDtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzY2VudCA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vINC/0YPRgdGC0LDRjyDRgdGC0L7Qv9C60LAgLSDQu9GO0LHQsNGPINC60LDRgNGC0LBcclxuXHRcdFx0aWYoYS5jYXJkcy5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblxyXG5cdFx0XHR2YXIgZGEgPSBycHIuX2Rvd251cHJhbmtudW0oYSk7XHJcblx0XHRcdHJldHVybiBkYSAmJiBkYS5kb3duID4gZGEudXA7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlc2NlbnRPbmUgOiBmdW5jdGlvbihhKSB7Ly8gb25lIHN0ZXBcclxuXHRcdFx0XHJcblx0XHRcdC8vINC/0YPRgdGC0LDRjyDRgdGC0L7Qv9C60LAgLSDQu9GO0LHQsNGPINC60LDRgNGC0LBcclxuXHRcdFx0aWYoYS5jYXJkcy5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblxyXG5cdFx0XHR2YXIgZGEgPSBycHIuX2Rvd251cHJhbmtudW0oYSk7XHJcblx0XHRcdHJldHVybiBkYSAmJiBkYS5kb3duID09IDEgKyBkYS51cDtcclxuXHRcdH0sXHJcblxyXG5cdFx0YXNjZW5kT25lIDogZnVuY3Rpb24oYSkgey8vIG9uZSBzdGVwXHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9GD0YHRgtCw0Y8g0YHRgtC+0L/QutCwIC0g0LvRjtCx0LDRjyDQutCw0YDRgtCwXHJcblx0XHRcdGlmKGEuY2FyZHMubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGRhID0gcnByLl9kb3dudXByYW5rbnVtKGEpO1xyXG5cdFx0XHRyZXR1cm4gZGEgJiYgMSArIGRhLmRvd24gPT0gZGEudXA7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFzY2Rlc2NPbmUgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9GD0YHRgtCw0Y8g0YHRgtC+0L/QutCwIC0g0LvRjtCx0LDRjyDQutCw0YDRgtCwXHJcblx0XHRcdGlmKGEuY2FyZHMubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGRhID0gcnByLl9kb3dudXByYW5rbnVtKGEpO1xyXG5cdFx0XHRyZXR1cm4gZGEgJiYgTWF0aC5hYnMoZGEuZG93biAtIGRhLnVwKSA9PSAxO1xyXG5cdFx0fSxcclxuXHJcblx0fVxyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9yZWFkeVB1dFJ1bGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMTNcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHJcblx0c2hhcmUuZmlsbFJ1bGVzID0ge1xyXG5cdFx0ZGVja0xlbmd0aCA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIHNoYXJlLmNhcmRzUmFuay5sZW5ndGggPD0gYS5kZWNrLmdldENhcmRzKCkubGVuZ3RoO1xyXG5cdFx0fSxcclxuXHRcdG5vdCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnTk9UIEZJTEwgUlVMRVMnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH07XHJcblxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leHRlbnNpb25zL2ZpbGxSdWxlcy5qc1xuICoqIG1vZHVsZSBpZCA9IDE0XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHRcclxuXHRcclxuXHRtYWluLk1vdmUgPSBmdW5jdGlvbihtb3ZlRGVjaywgdG8sIGN1cnNvck1vdmUpIHtcclxuXHRcdFxyXG5cdFx0dmFyIF9kZWNrX2Rlc3RpbmF0aW9uID0gbnVsbCwvLyB0b1xyXG5cdCAgICBcdF9kZWNrX2RlcGFydHVyZSAgID0gbnVsbDsvLyBmcm9tXHJcblx0ICAgIHZhciBfc3VjY2VzcyA9IHRydWU7XHJcblxyXG5cdCAgICBfc3VjY2VzcyA9IF9zdWNjZXNzICYmIHRvO1xyXG5cclxuXHQgICAgdmFyIF9lbCA9IHRvICYmIHRvLmlkICYmIHRoaXMuZ2V0RWxlbWVudEJ5SWQodG8uaWQpO1xyXG5cclxuICAgIFx0aWYoX2VsKSB7XHJcbiAgICBcclxuICAgIFx0XHRpZihfZWwudHlwZSA9PSAnY2FyZCcpIHtcclxuXHQgICAgXHRcdF9kZWNrX2Rlc3RpbmF0aW9uID0gdGhpcy5nZXRFbGVtZW50QnlJZChfZWwucGFyZW50KVxyXG5cdCAgICBcdH0gZWxzZSBpZihfZWwudHlwZSA9PSAnZGVjaycpIHtcclxuXHQgICAgXHRcdF9kZWNrX2Rlc3RpbmF0aW9uID0gX2VsO1xyXG5cdCAgICBcdH1cclxuXHQgICAgfVxyXG5cclxuXHQgICAgX3N1Y2Nlc3MgPSBfc3VjY2VzcyAmJiBfZGVja19kZXN0aW5hdGlvbjtcclxuICAgIFx0XHJcbiAgICBcdF9kZWNrX2RlcGFydHVyZSA9IG1vdmVEZWNrWzBdLmNhcmQucGFyZW50ICYmIHRoaXMuZ2V0RWxlbWVudEJ5SWQobW92ZURlY2tbMF0uY2FyZC5wYXJlbnQpO1xyXG4gICAgXHQvLyBjb25zb2xlLmxvZygnRFJPUDonLCBfZG9wLmlkLCBfZGVja19kZXN0aW5hdGlvbik7XHJcblx0ICAgIF9zdWNjZXNzID0gX3N1Y2Nlc3MgJiYgX2RlY2tfZGVwYXJ0dXJlO1xyXG5cclxuXHQgICAgaWYoX2RlY2tfZGVzdGluYXRpb24gJiYgX2RlY2tfZGVzdGluYXRpb24uZ2V0SWQoKSAhPSBfZGVja19kZXBhcnR1cmUuZ2V0SWQoKSkge1xyXG5cdFx0ICAgIFxyXG5cdCAgICBcdHZhciBfcHV0ID0gX2RlY2tfZGVzdGluYXRpb24uUHV0KG1vdmVEZWNrKTtcclxuXHRcdCAgICBfc3VjY2VzcyA9IF9zdWNjZXNzICYmIF9wdXQ7XHJcblx0ICAgIFx0XHJcblx0ICAgIFx0aWYoX3B1dCAmJiBfZGVja19kZXBhcnR1cmUpIHtcclxuXHQgICAgXHRcdFxyXG5cdCAgICBcdFx0dmFyIF9wb3AgPSBfZGVja19kZXBhcnR1cmUuUG9wKG1vdmVEZWNrLmxlbmd0aCk7XHJcblx0ICAgIFx0XHRcclxuXHQgICAgXHRcdC8vIGNvbnNvbGUubG9nKCdNT1ZFJywgX2RlY2tfZGVwYXJ0dXJlLCBfZGVja19kZXBhcnR1cmUuUG9wLCBtb3ZlRGVjay5sZW5ndGgpO1xyXG5cclxuXHRcdFx0ICAgIF9zdWNjZXNzID0gX3N1Y2Nlc3MgJiYgX3BvcDtcclxuXHQgICAgXHRcdFxyXG5cdCAgICBcdFx0aWYoX3BvcCkge1xyXG5cdCAgICBcdFx0XHRcclxuXHJcblx0ICAgIFx0XHRcdC8vINC/0L7Qu9C+0LbQuNC70Lgg0LIg0LrQvtC70L7QtNGDXHJcblx0ICAgIFx0XHRcdC8vINCx0LXQtyDQsNC90LjQvNCw0YbQuNC4LCDQv9GA0L7RgdGC0L4g0L/QtdGA0LXRgNC40YHQvtCy0LrQsCDQvtCx0LXQuNGFINC60L7Qu9C+0LRcclxuXHJcblx0ICAgIFx0XHRcdF9kZWNrX2Rlc3RpbmF0aW9uLlB1c2goX3BvcCk7XHJcblxyXG5cdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnbW92ZURyYWdEZWNrJywge1xyXG5cdFx0XHRcdFx0XHRkZXBhcnR1cmUgICA6IF9kZWNrX2RlcGFydHVyZSxcclxuXHRcdFx0XHRcdFx0ZGVzdGluYXRpb24gOiBfZGVja19kZXN0aW5hdGlvbixcclxuXHRcdFx0XHRcdFx0bW92ZURlY2sgICAgOiBtb3ZlRGVja1xyXG5cdFx0XHRcdFx0fSk7XHJcblxyXG5cdCAgICBcdFx0XHQvLyBfZGVja19kZXBhcnR1cmUgIC5SZWRyYXcoKTtcclxuXHQgICAgXHRcdFx0Ly8gX2RlY2tfZGVzdGluYXRpb24uUmVkcmF3KCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHNoYXJlLm9uZVN0ZXBXYXkubW92ZSA9IHtcclxuXHRcdFx0XHRcdFx0ZnJvbSA6IF9kZWNrX2RlcGFydHVyZSAgLm5hbWUsXHJcblx0XHRcdFx0XHRcdHRvICAgOiBfZGVja19kZXN0aW5hdGlvbi5uYW1lLFxyXG5cdFx0XHRcdFx0XHRkZWNrIDogc2hhcmUuZGVja0NhcmROYW1lcyhtb3ZlRGVjaylcclxuXHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0dmFyIF9kZWNrID0gX2RlY2tfZGVwYXJ0dXJlLmdldENhcmRzKCk7XHJcblx0XHRcdFx0XHRpZihfZGVjay5sZW5ndGggJiYgX2RlY2tbX2RlY2subGVuZ3RoIC0gMV0uZmxpcCA9PSB0cnVlKSB7XHJcblx0XHRcdFx0XHRcdF9kZWNrW19kZWNrLmxlbmd0aCAtIDFdLmZsaXAgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0c2hhcmUub25lU3RlcFdheS51bmZsaXAgPSB7XHJcblx0XHRcdFx0XHRcdFx0ZGVjayA6IF9kZWNrX2RlcGFydHVyZS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdGNhcmQgOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRuYW1lICA6IF9kZWNrW19kZWNrLmxlbmd0aCAtIDFdLm5hbWUsXHJcblx0XHRcdFx0XHRcdFx0XHRpbmRleCA6IF9kZWNrLmxlbmd0aCAtIDFcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHR0aGlzLmV2ZW50LmRpc3BhdGNoKCdtYWtlU3RlcCcsIHNoYXJlLm9uZVN0ZXBXYXkpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBzYXZlU3RlcCgpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHQvLyBhZnRlclN0ZXAoKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dGhpcy53aW5DaGVjayh7c2hvdyA6IHRydWV9KTtcclxuXHJcblx0ICAgIFx0XHR9XHJcblx0ICAgIFx0fVxyXG5cdCAgICBcdC8vIEEgUG9wKClcclxuXHQgICAgXHQvLyBCIFB1c2goKVxyXG5cdCAgICBcdC8vIEEsIEIgUmVkcmF3KClcclxuXHQgICAgfSBlbHNlIHtcclxuXHQgICAgXHRfc3VjY2VzcyA9IGZhbHNlO1xyXG5cdCAgICB9XHJcblxyXG5cdFx0Ly8g0LXRgdC70Lgg0L3QtSDQutC00LDQu9C+0YHRjCDQv9C+0LvQvtC20LjRgtGMINC60LDRgNGC0YssINCy0LXRgNC90YPRgtGMINC+0LHRgNCw0YLQvdC+XHJcbiAgICBcdFxyXG4gICAgXHRpZighX3N1Y2Nlc3MgJiYgX2RlY2tfZGVwYXJ0dXJlKSB7XHJcblxyXG4gICAgXHRcdGlmKGN1cnNvck1vdmUuZGlzdGFuY2UgPj0gc2hhcmUubW92ZURpc3RhbmNlKSB7XHJcblxyXG5cdCAgICBcdFx0dmFyIFRpcCA9IHNoYXJlLmJlc3RUaXAobW92ZURlY2ssIGN1cnNvck1vdmUpO1xyXG5cdCAgICBcdFx0aWYoVGlwKSB7XHJcblx0ICAgIFx0XHRcdHRoaXMuTW92ZShtb3ZlRGVjaywgVGlwLnRvLmRlY2suZG9tRWxlbWVudCwgY3Vyc29yTW92ZSk7XHJcblx0ICAgIFx0XHR9IGVsc2Uge1xyXG5cdCAgICBcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdtb3ZlQ2FyZFRvSG9tZScsIHtcclxuXHQgICAgXHRcdFx0XHRtb3ZlRGVjayAgOiBtb3ZlRGVjayxcclxuXHQgICAgXHRcdFx0XHRkZXBhcnR1cmUgOiBfZGVja19kZXBhcnR1cmVcclxuXHQgICAgXHRcdFx0fSk7XHJcblx0XHQgICAgXHRcdC8vIHNoYXJlLm1vdmVDYXJkVG9Ib21lKCk7XHJcblx0ICAgIFx0XHR9XHJcblxyXG4gICAgXHRcdH0gZWxzZSB7XHJcbiAgICBcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdtb3ZlQ2FyZFRvSG9tZScsIHtcclxuICAgIFx0XHRcdFx0bW92ZURlY2sgIDogbW92ZURlY2ssXHJcbiAgICBcdFx0XHRcdGRlcGFydHVyZSA6IF9kZWNrX2RlcGFydHVyZVxyXG4gICAgXHRcdFx0fSk7XHJcblx0ICAgIFx0XHQvLyBzaGFyZS5tb3ZlQ2FyZFRvSG9tZShtb3ZlRGVjaywgX2RlY2tfZGVwYXJ0dXJlKTtcclxuICAgIFx0XHR9XHJcblxyXG4gICAgXHR9XHJcblxyXG4gICAgXHRpZihfc3VjY2Vzcykge1xyXG5cclxuICAgIFx0XHQvLyBhZnRlck1vdmUoKTtcclxuXHQgICAgXHRzaGFyZS5jaGVja1RpcHMoKTtcclxuXHQgICAgfVxyXG5cclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leHRlbnNpb25zL01vdmUuanNcbiAqKiBtb2R1bGUgaWQgPSAxNVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFxyXG5cdHNoYXJlLmZvcmNlTW92ZSA9IGZ1bmN0aW9uKGEpIHsvLyB7J2Zyb20nLCAndG8nLCBkZWNrW119XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2ZvcmNlTW92ZScsIGEpO1xyXG5cclxuXHRcdHZhciBfd2FybiA9IGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHRcdGNvbnNvbGUud2FybihpbmRleCwgJ0luY29ycmVjdCBtb3ZlLicgKyAoc2hhcmUuZGVidWdMb2cgPyAnJyA6ICcgKHVzZSBkZWJ1Z0xvZyA6IHRydWUgaW4gZmllbGQgcGFyYW1ldGVycyBmb3IgZGV0YWlscyknKSk7XHJcblx0XHRcdC8vIGlmKHNoYXJlLmRlYnVnTG9nID09IHRydWUpIHtjb25zb2xlLmxvZygnQXJndW1lbnRzOicsIGEsIGluZGV4KTt9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKCFhLmZyb20gfHwgIWEudG8gfHwgIWEuZGVjaykge193YXJuKDEpO3JldHVybjt9XHJcblx0XHRpZiggdHlwZW9mIGEuZnJvbSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgYS50byAhPSAnc3RyaW5nJykge193YXJuKDIpO3JldHVybjt9XHJcblx0XHRpZighYS5kZWNrLmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR2YXIgX2Zyb20gPSBtYWluLkRlY2soYS5mcm9tKTtcclxuXHRcdHZhciBfdG8gICA9IG1haW4uRGVjayhhLnRvKTtcclxuXHJcblx0XHRpZighX2Zyb20gfHwgIV90bykge193YXJuKDMpO3JldHVybjt9XHJcblx0XHRcclxuXHRcdHZhciBfY2hlY2sgPSB0cnVlO1xyXG5cdFx0dmFyIF9mcm9tX2RlY2sgPSBfZnJvbS5nZXRDYXJkcygpO1xyXG5cdFx0XHJcblx0XHRmb3IoaSBpbiBfZnJvbV9kZWNrKSB7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihpID49IF9mcm9tX2RlY2subGVuZ3RoIC0gYS5kZWNrLmxlbmd0aCkge1xyXG5cdFx0XHRcdHZhciBfaWQgPSBpIC0gKF9mcm9tX2RlY2subGVuZ3RofDApICsgKGEuZGVjay5sZW5ndGh8MCk7XHJcblx0XHRcdFx0aWYoYS5kZWNrW19pZF0gJiYgX2Zyb21fZGVja1tpXS5uYW1lICE9IGEuZGVja1tfaWRdKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhpLCBfaWQsIF9mcm9tX2RlY2ssIF9mcm9tX2RlY2tbaV0ubmFtZSwgYS5kZWNrW19pZF0pXHJcblx0XHRcdFx0XHRfY2hlY2sgPSBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoX2NoZWNrKSB7XHJcblx0XHRcdHZhciBfcG9wID0gX2Zyb20uUG9wKGEuZGVjay5sZW5ndGgpO1xyXG5cdFx0XHRfdG8uUHVzaChfcG9wKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdF93YXJuKDQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdF9mcm9tLlJlZHJhdygpO1xyXG5cdFx0X3RvICAuUmVkcmF3KCk7XHJcblx0XHQvL2Zvcih2YXIgaSA9IGRlY2subGVuZ3RoO2k7aSAtPSAxKSB7XHJcblx0XHQvL1x0X3RvLnB1c2goX3RvLmdldENhcmRzKVxyXG5cdFx0Ly99XHJcblxyXG5cdFx0c2hhcmUuY2hlY2tUaXBzKCk7XHJcblxyXG5cdH0vKi5iaW5kKG1haW4pKi87XHJcblxyXG59O1xuXG5cbi8qKioqKioqKioqKioqKioqKlxuICoqIFdFQlBBQ0sgRk9PVEVSXG4gKiogLi9leHRlbnNpb25zL2ZvcmNlTW92ZS5qc1xuICoqIG1vZHVsZSBpZCA9IDE2XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0XHJcblx0dmFyIHdjbSA9IHNoYXJlLndpbkNoZWNrTWV0aG9kcyA9IHtcclxuXHRcdFx0XHJcblx0XHQvLyBGaWx0ZXJzXHJcblxyXG5cdFx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10YIg0LrQvtC70L7QtNGLINC+0L/RgNC10LTQtdC70ZHQvdC90L7QuSDQs9GA0YPQv9C/0Ysv0LPRgNGD0L/Qv1xyXG5cdFx0Z3JvdXAgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmKCFhLmZpbHRlcikgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR2YXIgX2RlY2tzID0gW107XHJcblx0XHRcdGZvcih2YXIgX2kgaW4gYS5kZWNrcykge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdncm91cCBmaWx0ZXI6JywgX2ksIGEuZGVja3NbX2ldLnBhcmVudCgpLCBhLmZpbHRlckFyZ3MpO1xyXG5cdFx0XHRcdC8vIHZhciBfcGFyZW50ID0gYS5kZWNrc1tfaV0ucGFyZW50KClcclxuXHRcdFx0XHQvLyBpZihhLmZpbHRlckFyZ3MuaW5kZXhPZihhLmRlY2tzW19pXS5wYXJlbnQoKSkpIHtcclxuXHRcdFx0XHRpZihcclxuXHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0dHlwZW9mIGEuZmlsdGVyQXJncyAgPT0gXCJzdHJpbmdcIiBcclxuXHRcdFx0XHRcdCAmJiBhLmRlY2tzW19pXS5wYXJlbnQoKSA9PSBhLmZpbHRlckFyZ3NcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQgfHwgYS5maWx0ZXJBcmdzLmluZGV4T2YoYS5kZWNrc1tfaV0ucGFyZW50KCkpID49IDBcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdF9kZWNrcy5wdXNoKGEuZGVja3NbX2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YS5kZWNrcyA9IF9kZWNrcztcclxuXHRcdFx0cmV0dXJuIF9kZWNrcy5sZW5ndGg7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIEludGVybmFsIHVzZVxyXG5cclxuXHRcdF9hc2NfZGVzayA6IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHRcdGlmKCFhIHx8IGEuYXNjX2Rlc2sgPT0gbnVsbCB8fCB0eXBlb2YgYS5hc2NfZGVzayAhPSAnbnVtYmVyJykgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIF9jb3JyZWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdGZvcih2YXIgZCBpbiBhLmRlY2tzKSB7XHJcblxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdfYXNjX2Rlc2snLCBhLmFzY19kZXNrID8gJ2FzYycgOiAnZGVzaycsIGEuYXNjX2Rlc2ssIGQsIGEuZGVja3NbZF0sIF9jb3JyZWN0LCBhLmRlY2tzW2RdLmdldENhcmRzKCkpO1xyXG5cdFx0XHRcdGlmKF9jb3JyZWN0ID09IGZhbHNlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIF9jYXJkcyA9IGEuZGVja3NbZF0uZ2V0Q2FyZHMoKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnY2FyZHM6JywgX2NhcmRzKTtcclxuXHRcdFx0XHRmb3IodmFyIGMgaW4gX2NhcmRzKSB7XHJcblx0XHRcdFx0XHRpZihjID4gMCkge1x0XHJcblx0XHRcdFx0XHRcdHZhciBkb3duID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShfY2FyZHNbKGN8MCkgLSAxXS5uYW1lKSxcclxuXHRcdFx0XHRcdFx0XHR1cCAgID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShfY2FyZHNbKGN8MCldLm5hbWUpO1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnX2FzY19kZXNrJywgZG93biwgdXAsIGEuYXNjX2Rlc2spO1x0XHJcblx0XHRcdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgZG93biAmJiB1cCAmJiBzaGFyZS5jYXJkc1JhbmtTLmluZGV4T2YoZG93bi5yYW5rKSA9PSAoc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKHVwLnJhbmspICsgYS5hc2NfZGVzayk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIF9jb3JyZWN0O1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBTaW1wbGUgcnVsZXNcclxuXHJcblx0XHRuZXdlcldpbiA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJZb3UgdXNlICduZXdlcldpbicgcnVsZSBmb3IgY2hlY2tpbmcgV2luLiBNYXliZSBhcmd1bWVudHMgaW4gJ3dpbkNoZWNrLnJ1bGUnIGhhdmUgaW5jb3JyZWN0IHJ1bGUgbmFtZS5cIilcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyDQstGB0LUg0LrQvtC70L7QtNGLINC/0YPRgdGC0YtcclxuXHJcblx0XHRhbGxFbXB0eSA6IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHRcdHZhciBfY29ycmVjdCA9IHRydWU7XHJcblx0XHRcdGZvcih2YXIgX2kgaW4gYS5kZWNrcykge1xyXG5cdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgYS5kZWNrc1tfaV0uZ2V0Q2FyZHMoKS5sZW5ndGggPT0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gX2NvcnJlY3Q7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIENvbWJpbmVkIHJ1bGVzICh1c2UgbGlrZSBmaWx0ZXIpXHJcblxyXG5cdFx0Ly8g0LLRgdC1INC60LDRgNGC0Ysg0LIg0L7QtNC90L7QuSDQutC+0LvQvtC00LVcclxuXHRcdGFsbEluT25lIDogZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NoZWNrIFdpbiwgcnVsZS9maWx0ZXIgLSBhbGxJbk9uZTonLCBhKTtcclxuXHJcblx0XHRcdHZhciBfZW1wdHlEZWNrc0NvdW50ID0gMCxcclxuXHRcdFx0XHRfZGVja3NMZW5ndGggICAgID0gMCxcclxuXHRcdFx0XHRfZmlsbEluZGV4ICAgICAgID0gMDtcclxuXHRcdFx0Zm9yKHZhciBpIGluIGEuZGVja3MpIHtcclxuXHRcdFx0XHRpZihhLmRlY2tzW2ldLmdldENhcmRzKCkubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdF9lbXB0eURlY2tzQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmlsbEluZGV4ID0gaTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0X2RlY2tzTGVuZ3RoICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2FsbGlub25lJywgYSwgX2VtcHR5RGVja3NDb3VudCwgX2RlY2tzTGVuZ3RoKTtcclxuXHRcdFx0dmFyIF9jb3JyZWN0ID0gX2VtcHR5RGVja3NDb3VudCA9PSBfZGVja3NMZW5ndGggLSAxO1xyXG5cdFx0XHRpZihhLmZpbHRlcikgYS5kZWNrcyA9IF9jb3JyZWN0ID8gW2EuZGVja3NbZmlsbEluZGV4XV0gOiBbXTtcclxuXHRcdFx0cmV0dXJuIF9jb3JyZWN0XHJcblxyXG5cdFx0XHRcdC8qPyBhLnJ1bGVzQXJncyBcclxuXHRcdFx0XHRcdD8gX29uZURlY2sgXHJcblx0XHRcdFx0XHQ6IHRydWUgXHJcblx0XHRcdFx0OiBmYWxzZTsqL1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBzdGVwIGJ5IHN0ZXAgMSwgMiwgM1xyXG5cdFx0Ly8g0LLQviDQstGB0LXRhSDQutC+0LvQvtC00LDRhSDQutCw0YDRgtGLINC/0L4g0LLQvtC30YDQsNGB0YLQsNC90LjRjlxyXG5cdFx0YWxsQXNjZW5kIDogZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NoZWNrIFdpbiwgcnVsZSAtIGFsbEFzY2VuZGluZzonLCBhKTtcclxuXHRcdFx0YS5hc2NfZGVzayA9IC0xO1xyXG5cdFx0XHRyZXR1cm4gd2NtLl9hc2NfZGVzayhhKTtcclxuXHRcdH0sXHJcblx0XHRcclxuXHRcdC8vIHN0ZXAgYnkgc3RlcCAzLCAyLCAxXHJcblx0XHQvLyDQstC+INCy0YHQtdGFINC60L7Qu9C+0LTQsNGFINC60LDRgNGC0Ysg0L/QviDRg9Cx0YvQstCw0L3QuNGOXHJcblx0XHRhbGxEZXNjZW50IDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2hlY2sgV2luLCBydWxlIC0gYWxsRGVzY2VudDonLCBhKTtcclxuXHRcdFx0YS5hc2NfZGVzayA9IDE7XHJcblx0XHRcdHJldHVybiB3Y20uX2FzY19kZXNrKGEpO1xyXG5cdFx0fSxcclxuXHJcblxyXG5cdFx0Ly8gQ29tcG9zaXRlIHJ1bGVzIChpbnB1dCBhcmd1bWVudHMpXHJcblx0XHQvLyDQutC+0LzQsdC40L3QuNGA0L7QstCw0L3QvdC+0LUg0L/RgNCw0LLQuNC70L5cclxuXHRcdGxlZ28gOiBmdW5jdGlvbihfYSkge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coYS5ydWxlc0FyZ3MuZmlsdGVycywgYS5ydWxlc0FyZ3MucnVsZXMpXHJcblx0XHRcdFxyXG5cdFx0XHRpZighX2EgfHwgIV9hLnJ1bGVzQXJncykgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIF9jb3JyZWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGFwcGx5IGZpbHRlcnNcclxuXHRcdFx0Zm9yKHZhciBuZXh0IGluIF9hLnJ1bGVzQXJncykge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2hlY2sgV2luLCBMRUdPIFJVTEU6JywgX2EucnVsZXNBcmdzW25leHRdKTtcclxuXHJcblx0XHRcdFx0dmFyIF9kZWNrc0Nsb25lID0ge307XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIF9hLmRlY2tzKSBfZGVja3NDbG9uZVtpXSA9IF9hLmRlY2tzW2ldO1xyXG5cdFx0XHRcdHZhciBhID0ge1xyXG5cdFx0XHRcdFx0Ly8gZmlsdGVycyA6IF9hW25leHRdLmZpbHRlcnMsXHJcblx0XHRcdFx0XHQvLyBydWxlcyAgIDogX2FbbmV4dF0ucnVsZXMsXHJcblx0XHRcdFx0XHRkZWNrcyAgIDogX2RlY2tzQ2xvbmVcclxuXHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHQvLyDQv9GA0LjQvNC10L3Rj9C10Lwg0YTQuNC70YzRgtGA0YssINC+0YHRgtCw0LLQu9GP0LXQvCDRgtC+0LvRjNC60L4g0LjQvdGC0LXRgNC10YHRg9GO0YnQuNC1INC60L7Qu9C+0LTRi1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKF9jb3JyZWN0ICYmIF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzKSB7XHJcblxyXG5cdFx0XHRcdFx0YS5maWx0ZXIgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHJcblxyXG5cdFx0XHRcdFx0Zm9yKHZhciBpIGluIF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzKSB7XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdMRUdPIEZJTFRFUicsIGksIF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldKVxyXG5cclxuXHRcdFx0XHRcdFx0aWYodHlwZW9mIF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldID09ICdzdHJpbmcnICYmIHdjbVtfYS5ydWxlc0FyZ3NbbmV4dF0uZmlsdGVyc1tpXV0pIHtcclxuXHJcblx0XHRcdFx0XHRcdFx0Ly8gYWxlcnQoKGZ1bmN0aW9uKGEpe3ZhciBfYyA9IDA7Zm9yKHZhciBfaSBpbiBhKXtfYyArPSAxO307cmV0dXJuIF9jO30pKGEuZGVja3MpKTtcclxuXHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnYXBwbHkgZmlsdGVyJywgX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV0sICdzdGFydCcsIGEpO1xyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgd2NtW19hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldXShhKTtcclxuXHRcdFx0XHRcdFx0XHQvLyB3Y21bYS5ydWxlc0FyZ3MuZmlsdGVyc1tpXV0oYSk7XHJcblx0XHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2FwcGx5IGZpbHRlcicsIGEucnVsZXNBcmdzLmZpbHRlcnMsICdyZXN1bHQ6JywgYSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYodHlwZW9mIF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldID09ICdvYmplY3QnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZpbHRlcnM6JywgX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV0pO1xyXG5cdFx0XHRcdFx0XHRcdFx0Zm9yKHZhciBmaWx0ZXJOYW1lIGluIF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdC8vIHZhciBmaWx0ZXJOYW1lID0gX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV1bZmlsdGVySW5kZXhdO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnYXBwbHkgZmlsdGVyJywgZmlsdGVyTmFtZSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGlmKHdjbVtmaWx0ZXJOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGEuZmlsdGVyQXJncyA9IF9hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldW2ZpbHRlck5hbWVdXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2NvcnJlY3QgPSBfY29ycmVjdCAmJiB3Y21bZmlsdGVyTmFtZV0oYSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0X2NvcnJlY3QgPSBfY29ycmVjdCAmJiB3Y21bJ25ld2VyV2luJ10oKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRfY29ycmVjdCA9IF9jb3JyZWN0ICYmIHdjbVsnbmV3ZXJXaW4nXSgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRhLmZpbHRlciA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8g0L/RgNC40LzQtdC90Y/QtdC8INC/0YDQsNCy0LjQu9CwINC6INC+0YHRgtCw0LLRiNC40LzRgdGPINC60L7Qu9C+0LTQsNC8XHJcblxyXG5cdFx0XHRcdGlmKF9hLnJ1bGVzQXJnc1tuZXh0XS5ydWxlcykge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRmb3IodmFyIGkgaW4gX2EucnVsZXNBcmdzW25leHRdLnJ1bGVzKSB7XHJcblx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdhcHBseSBydWxlJywgX2EucnVsZXNBcmdzW25leHRdLnJ1bGVzW2ldKVxyXG5cdFx0XHRcdFx0XHRpZih3Y21bX2EucnVsZXNBcmdzW25leHRdLnJ1bGVzW2ldXSkge1xyXG5cdFx0XHRcdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgd2NtW19hLnJ1bGVzQXJnc1tuZXh0XS5ydWxlc1tpXV0oYSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJyMyJylcclxuXHRcdFx0XHRcdFx0XHRfY29ycmVjdCA9IF9jb3JyZWN0ICYmIHdjbVsnbmV3ZXJXaW4nXSgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygncnVsZXM6JywgX2NvcnJlY3QgPyAnc3VjY2VzcycgOiAnZmFpbCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gX2NvcnJlY3Q7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRtYWluLndpbkNoZWNrID0gZnVuY3Rpb24oYSkge1xyXG5cdFx0aWYoIWEpIGEgPSB7fTtcclxuXHRcdGlmKHR5cGVvZiBhLnNob3cgPT0gJ3VuZGVmaW5lZCcpIGEuc2hvdyA9IGZhbHNlO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3dpbkNoZWNrJywgYSk7XHJcblx0XHRyZXR1cm4gc2hhcmUud2luQ2hlY2soYSk7XHJcblx0XHQvLyByZXR1cm4gd2luQ2hlY2soe25vQ2FsbGJhY2sgOiB0cnVlfSk7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRzaGFyZS53aW5DaGVjayA9IGZ1bmN0aW9uKHBhcmFtcykge1xyXG5cclxuXHRcdC8vIHZhciBfZGVja3MgPSBtYWluLmdldERlY2tzKCk7XHJcblx0XHRcclxuXHRcdGlmKHR5cGVvZiBzaGFyZS53aW5DaGVja01ldGhvZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGlmKHNoYXJlLndpbkNoZWNrTWV0aG9kKHtcclxuXHRcdFx0XHRkZWNrcyA6IG1haW4uZ2V0RGVja3Moe3Zpc2libGUgOiB0cnVlfSlcclxuXHRcdFx0fSkpIHtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuZGlzcGF0Y2goJ3dpbicsIHBhcmFtcyk7XHJcblx0XHRcdFx0Ly8gaWYocGFyYW1zICYmIHBhcmFtcy5ub0NhbGxiYWNrID09IHRydWUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdC8vIGEud2luQ2hlY2suY2FsbGJhY2soKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBydWxlc0NvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHR2YXIgX2hhc01ldG9kcyA9IGZhbHNlO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gc2hhcmUud2luQ2hlY2tNZXRob2QpIHtcclxuXHRcdFx0XHRfaGFzTWV0b2RzID0gdHJ1ZTtcclxuXHRcdFx0XHRpZihzaGFyZS53aW5DaGVja01ldGhvZHNbaV0pIHtcclxuIFx0XHRcdFx0XHRcclxuIFx0XHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgc2hhcmUud2luQ2hlY2tNZXRob2RzW2ldKHtcclxuIFx0XHRcdFx0XHRcdGRlY2tzICAgICA6IG1haW4uZ2V0RGVja3Moe3Zpc2libGUgOiB0cnVlfSksIFxyXG4gXHRcdFx0XHRcdFx0cnVsZXNBcmdzIDogc2hhcmUud2luQ2hlY2tNZXRob2RbaV1cclxuIFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKHR5cGVvZiBzaGFyZS53aW5DaGVja01ldGhvZFtpXSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBzaGFyZS53aW5DaGVja01ldGhvZFtpXSh7XHJcblx0XHRcdFx0XHRcdFx0ZGVja3MgOiBtYWluLmdldERlY2tzKHt2aXNpYmxlIDogdHJ1ZX0pXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIHNoYXJlLndpbkNoZWNrTWV0aG9kc1snbmV3ZXJXaW4nXSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZighX2hhc01ldG9kcykge1xyXG5cdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBzaGFyZS53aW5DaGVja01ldGhvZHNbJ25ld2VyV2luJ10oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocnVsZXNDb3JyZWN0KSB7XHJcblx0XHRcdFx0aWYocGFyYW1zICYmIHBhcmFtcy5ub0NhbGxiYWNrID09IHRydWUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3dpbicsIHBhcmFtcyk7XHJcblx0XHRcdFx0Ly8gYS53aW5DaGVjay5jYWxsYmFjaygpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdC8vIHJldHVybiBydWxlc0NvcnJlY3Q7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy93aW5DaGVjay5qc1xuICoqIG1vZHVsZSBpZCA9IDE3XG4gKiogbW9kdWxlIGNodW5rcyA9IDBcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblxyXG5cdHZhciBkZWNrQWN0aW9ucyA9IHtcclxuXHRcdFxyXG5cdFx0XCJ0ZXN0RGVja0FjdGlvblwiIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIFRPRE9cclxuXHRcdH0sXHJcblx0XHRcclxuXHRcdFwidHdpbmRlY2tcIiA6IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwidHdpbmRlY2sgYWN0aW9uOlwiLCBlKTtcclxuXHRcdFx0aWYoZS5kZWNrX2Zyb20uaXRlcmF0aW9uID09IDApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHR2YXIgZGVja190byA9IG1haW4uRGVjayhlLmRhdGEudG8pO1xyXG5cdFx0XHRcclxuXHRcdFx0dmFyIG1vdmVDYXJkc0NvdW50ID0gZS5kYXRhLmNvdW50ICYmIHR5cGVvZiBlLmRhdGEuY291bnQgPT0gJ251bWJlcicgPyBlLmRhdGEuY291bnQgOiBzaGFyZS5kZWZhdWx0X3R3aW5kZWNrX21vdmVfY2FyZF9jb3VudDtcclxuXHRcdFx0XHJcblx0XHRcdC8vINC60L7Qu9C40YfQtdGB0YLQstC+INC+0YHRgtCw0LLRiNC40YXRgdGPINC60LDRgNGCINCyINC/0LXRgNCy0L7QuSDQutC+0LvQvtC00LVcclxuXHRcdFx0dmFyIGRlY2tGcm9tQ2FyZHNDb3VudCA9IGUuZGVja19mcm9tLmdldENhcmRzKCkubGVuZ3RoO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoZGVja0Zyb21DYXJkc0NvdW50IDwgbW92ZUNhcmRzQ291bnQpIHtcclxuXHRcdFx0XHRtb3ZlQ2FyZHNDb3VudCA9IGRlY2tGcm9tQ2FyZHNDb3VudDtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0LjQvdC40YbQuNCw0LvQuNC30LDRhtC40Y9cclxuXHRcdFx0aWYodHlwZW9mIGUuZGVja19mcm9tLml0ZXJhdGlvbiA9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRcdC8vIFwiLTFcIiAtIGluZmluaXR5XHJcblx0XHRcdFx0ZS5kZWNrX2Zyb20uaXRlcmF0aW9uID0gLTE7XHJcblx0XHRcdFx0ZS5kZWNrX2Zyb20udHdpbmRlY2sgPSBbXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8g0LrQvtC70LjRh9C10YHRgtCy0L4g0YbQuNC60LvQvtCyINC/0LXRgNC10LvQuNGB0YLRi9Cy0LDQvdC40Lkg0YHQvdCw0YfQsNC70L4g0LTQviDQutC+0L3RhtCwXHJcblx0XHRcdGlmKGUuaXRlcmF0aW9ucyAmJiBlLmRlY2tfZnJvbS5pdGVyYXRpb24gPCAwKSB7XHJcblx0XHRcdFx0ZS5kZWNrX2Zyb20uaXRlcmF0aW9uID0gZS5pdGVyYXRpb25zXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGRlY2tfdG8uaGlkZUNhcmRzKCk7XHJcblxyXG5cdFx0XHR2YXIgX2RlY2sgPSBkZWNrX3RvLlBvcChkZWNrX3RvLmdldENhcmRzKCkubGVuZ3RoKTtcclxuXHJcblx0XHRcdC8vIFN0ZXBcclxuXHRcdFx0c2hhcmUub25lU3RlcFdheS50d2luZGVjayA9IHt9O1xyXG5cdFx0XHRzaGFyZS5vbmVTdGVwV2F5LnR3aW5kZWNrLnRvSGlkZSA9IHNoYXJlLmRlY2tDYXJkTmFtZXMoX2RlY2spO1xyXG5cdFx0XHRcclxuXHRcdFx0X2RlY2sucmV2ZXJzZSgpO1xyXG5cdFx0XHRmb3IoaSBpbiBfZGVjaykge1xyXG5cdFx0XHRcdGUuZGVja19mcm9tLnR3aW5kZWNrLnVuc2hpZnQoX2RlY2tbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9C10YDQstCw0Y8g0LrQvtC70L7QtNCwINC/0YPRgdGC0LBcclxuXHRcdFx0aWYoZS5kZWNrX2Zyb20udHdpbmRlY2sgJiYgZS5kZWNrX2Zyb20udHdpbmRlY2subGVuZ3RoICYmIGRlY2tGcm9tQ2FyZHNDb3VudCA9PSAwICYmIGUuZGVja19mcm9tLml0ZXJhdGlvbiAhPSAwKSB7XHJcblx0XHRcdFx0Ly8gZS5kZWNrX2Zyb20udHdpbmRlY2sucmV2ZXJzZSgpO1xyXG5cdFx0XHRcdGUuZGVja19mcm9tLlB1c2goZS5kZWNrX2Zyb20udHdpbmRlY2spO1xyXG5cdFx0XHRcdGUuZGVja19mcm9tLnR3aW5kZWNrID0gW107Ly8gdW5zaGlmdFxyXG5cdFx0XHQvLyDQv9C10YDQtdC70LjRgdGC0YvQstCw0L3QuNC1XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gZS5kZWNrX2Zyb20uUG9wKG1vdmVDYXJkc0NvdW50KTtcclxuXHRcdFx0XHRkZWNrX3RvLlB1c2goX2RlY2spO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRlLmRlY2tfZnJvbS5zaG93Q2FyZHMoKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLSBGTElQIC0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvLyB2YXIgX2RlY2tfZnJvbSA9IGUuZGVja19mcm9tLmdldENhcmRzKCk7XHJcblx0XHRcdC8vIHZhciBfZGVja190byA9IGRlY2tfdG8uZ2V0Q2FyZHMoKTtcclxuXHRcdFx0XHJcblx0XHRcdGUuZGVja19mcm9tLmZsaXBDaGVjaygpO1xyXG5cdFx0XHRkZWNrX3RvICAgIC5mbGlwQ2hlY2soKTtcclxuXHRcdFx0XHJcblx0XHRcdGUuZGVja19mcm9tLlJlZHJhdygpO1xyXG5cdFx0XHRkZWNrX3RvICAgIC5SZWRyYXcoKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLSBTVEVQIC0tLS0tLS0tLS0tLVxyXG5cdFx0XHRzaGFyZS5vbmVTdGVwV2F5LnR3aW5kZWNrLmZyb20gICAgICA9IGUuZGVja19mcm9tLm5hbWUsXHJcblx0XHRcdHNoYXJlLm9uZVN0ZXBXYXkudHdpbmRlY2sudG8gICAgICAgID0gZGVja190byAgICAubmFtZSxcclxuXHRcdFx0c2hhcmUub25lU3RlcFdheS50d2luZGVjay5tb3ZlQ2FyZHMgPSBzaGFyZS5kZWNrQ2FyZE5hbWVzKF9kZWNrKSxcclxuXHRcdFx0c2hhcmUub25lU3RlcFdheS50d2luZGVjay5pdGVyYXRpb24gPSAoZS5kZWNrX2Zyb20uaXRlcmF0aW9ufDApXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBoaWRkZW5DYXJkcyA6IHNoYXJlLmRlY2tDYXJkTmFtZXMoZS5kZWNrX2Zyb20udHdpbmRlY2spLCBcclxuXHRcdFx0Ly8gY2FyZHMgICAgICAgOiBzaGFyZS5kZWNrQ2FyZE5hbWVzKGUuZGVja19mcm9tLmdldENhcmRzKCkpLFxyXG5cclxuXHRcdFx0aWYodHlwZW9mIHNoYXJlLnVuZG9NZXRob2RzID09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHRzaGFyZS51bmRvTWV0aG9kcyA9IHt9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBIaXN0b3J5IGV4dGVuc2lvblxyXG5cdFx0XHRzaGFyZS51bmRvTWV0aG9kcy50d2luZGVjayA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHRpZihhLnR3aW5kZWNrKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciBfZGVja19mcm9tID0gbWFpbi5EZWNrKGEudHdpbmRlY2suZnJvbSksXHJcblx0XHRcdFx0XHRcdF9kZWNrX3RvICAgPSBtYWluLkRlY2soYS50d2luZGVjay50byk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFRPRE9cclxuXHRcdFx0XHRcdC8vIGRlY2tfdG8gY2FyZHMgW21vdmVDYXJkc10gLT4gZGVja19mcm9tXHJcblx0XHRcdFx0XHR2YXIgX21vdmVEZWNrID0gX2RlY2tfdG8uUG9wKGEudHdpbmRlY2subW92ZUNhcmRzLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRpZihfbW92ZURlY2subGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdwdXNoIzAnLCBfbW92ZURlY2spO1xyXG5cdFx0XHRcdFx0XHRfZGVja19mcm9tLlB1c2goX21vdmVEZWNrKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBkZWNrX2Zyb20udHdpbmRlY2sgY2FyZHMgW3RvSGlkZV0gIC0+IGRlY2tfdG9cclxuXHRcdFx0XHRcdHZhciBfdHdpbmRlY2sgPSBbXTtcclxuXHRcdFx0XHRcdGZvcihpIGluIGEudHdpbmRlY2sudG9IaWRlKSB7XHJcblx0XHRcdFx0XHRcdGlmKF9kZWNrX2Zyb20udHdpbmRlY2subGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdFx0X3R3aW5kZWNrLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0XHRfZGVja19mcm9tLnR3aW5kZWNrLnBvcCgpXHJcblx0XHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0X3R3aW5kZWNrLnJldmVyc2UoKTtcclxuXHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnX2RlY2tfZnJvbS50d2luZGVjazonLCBfZGVja19mcm9tLnR3aW5kZWNrKTtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdhLnR3aW5kZWNrLnRvSGlkZTonLCBhLnR3aW5kZWNrLnRvSGlkZSk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnX3R3aW5kZWNrOicsIF90d2luZGVjayk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGlmKF90d2luZGVjay5sZW5ndGgpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coJ3B1c2gjMScpO1xyXG5cdFx0XHRcdFx0XHRfZGVja190by5QdXNoKF90d2luZGVjayk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0X2RlY2tfdG8uc2hvd0NhcmRzKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdF9kZWNrX2Zyb20uZmxpcENoZWNrKCk7XHJcblxyXG5cdFx0XHRcdFx0X2RlY2tfZnJvbS5SZWRyYXcoKTtcclxuXHRcdFx0XHRcdF9kZWNrX3RvICAuUmVkcmF3KCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd0d2luZGVjayB1bmRvOicsIGEudHdpbmRlY2ssIHNoYXJlLmRlY2tDYXJkTmFtZXMoX2RlY2tfZnJvbS50d2luZGVjaykpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0c2hhcmUucmVkb01ldGhvZHMudHdpbmRlY2sgPSBmdW5jdGlvbihhKSB7XHJcblx0XHRcdFx0aWYoYS50d2luZGVjaykge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ3R3aW5kZWNrIHJlZG86JywgYS50d2luZGVjayk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdtYWtlU3RlcCcsIHNoYXJlLm9uZVN0ZXBXYXkpO1xyXG5cdFx0XHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHRcdHNoYXJlLmNoZWNrVGlwcygpO1xyXG5cclxuXHRcdFx0ZS5kZWNrX2Zyb20uaXRlcmF0aW9uIC09IDE7XHJcblxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdydW5EZWNrQWN0aW9ucycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdydW5EZWNrQWN0aW9zOicsIGUuZGVjayk7XHJcblx0XHRmb3IodmFyIGFjdGlvbk5hbWUgaW4gZS5kZWNrLmFjdGlvbnMpIHtcclxuXHRcdFx0aWYoZGVja0FjdGlvbnNbYWN0aW9uTmFtZV0pIHtcclxuXHRcdFx0XHRkZWNrQWN0aW9uc1thY3Rpb25OYW1lXSh7XHJcblx0XHRcdFx0XHRkZWNrX2Zyb20gOiBlLmRlY2ssIFxyXG5cdFx0XHRcdFx0ZGF0YSAgICAgIDogZS5kZWNrLmFjdGlvbnNbYWN0aW9uTmFtZV1cclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbigncnVuRGVja0FjdGlvbicsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKGUubmFtZSAmJiB0eXBlb2YgZGVja0FjdGlvbnNbZS5uYW1lXSA9PSAnc3RyaW5nJy8qICYmIGUuZGF0YSovKSB7XHJcblx0XHRcdGRlY2tBY3Rpb25zW2UubmFtZV0oZS5kYXRhKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ2FkZERlY2tBY3Rpb24nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRjb25zb2xlLmxvZyhkZWNrQWN0aW9ucyk7XHJcblx0XHRpZihlLm5hbWUgJiYgZS5jYWxsYmFjaykgZGVja0FjdGlvbnNbZS5uYW1lXSA9IGUuY2FsbGJhY2s7XHJcblxyXG5cdH0pO1xyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9hZGREZWNrQWN0aW9uLmpzXG4gKiogbW9kdWxlIGlkID0gMThcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHRcclxuXHRzaGFyZS5mbGlwVHlwZXMgPSB7XHJcblx0XHRub25lICAgIDogZnVuY3Rpb24oY2FyZCwgaSwgbGVuZ3RoKSB7XHJcblx0XHRcdGNhcmQuZmxpcCA9IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdGFsbCAgICAgOiBmdW5jdGlvbihjYXJkLCBpLCBsZW5ndGgpIHtcclxuXHRcdFx0Y2FyZC5mbGlwID0gdHJ1ZTtcclxuXHRcdH0sXHJcblx0XHRub3RsYXN0IDogZnVuY3Rpb24oY2FyZCwgaSwgbGVuZ3RoKSB7XHJcblx0XHRcdGNhcmQuZmxpcCA9IChpIDwgbGVuZ3RoIC0gMSkgPyB0cnVlIDogZmFsc2U7XHJcblx0XHR9LFxyXG5cdFx0Zmlyc3RfMSA6IGZ1bmN0aW9uKGNhcmQsIGksIGxlbmd0aCkge1xyXG5cdFx0XHRjYXJkLmZsaXAgPSAoaSA8IDEpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdFx0fSxcclxuXHRcdGZpcnN0XzIgOiBmdW5jdGlvbihjYXJkLCBpLCBsZW5ndGgpIHtcclxuXHRcdFx0Y2FyZC5mbGlwID0gKGkgPCAyKSA/IHRydWUgOiBmYWxzZTtcclxuXHRcdH0sXHJcblx0XHRmaXJzdF8zIDogZnVuY3Rpb24oY2FyZCwgaSwgbGVuZ3RoKSB7XHJcblx0XHRcdGNhcmQuZmxpcCA9IChpIDwgMykgPyB0cnVlIDogZmFsc2U7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcblxuXG4vKioqKioqKioqKioqKioqKipcbiAqKiBXRUJQQUNLIEZPT1RFUlxuICoqIC4vZXh0ZW5zaW9ucy9mbGlwVHlwZXMuanNcbiAqKiBtb2R1bGUgaWQgPSAxOVxuICoqIG1vZHVsZSBjaHVua3MgPSAwXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRzaGFyZS5wYWRkaW5nVHlwZXMgPSB7XHJcblx0XHRcdFx0bm9uZSA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHt4IDogcGFyYW1zLngsIHkgOiBwYXJhbXMueX07XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRsYXN0X3RocmVlX21pbiA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0XHRcdFx0aWYoaW5kZXggPiBsZW5ndGggLSAzKSB7XHJcblx0XHRcdFx0XHRcdGlmKGxlbmd0aCA+IDMpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRcdFx0eCA6IHBhcmFtcy54IC0gKGxlbmd0aCAtIDMgLSBpbmRleCkgKiAyLFxyXG5cdFx0XHRcdFx0XHRcdFx0eSA6IHBhcmFtcy55IC0gKGxlbmd0aCAtIDMgLSBpbmRleClcclxuXHRcdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdFx0XHR4IDogcGFyYW1zLnggKyAoaW5kZXggKiAyKSxcclxuXHRcdFx0XHRcdFx0XHRcdHkgOiBwYXJhbXMueSArIChpbmRleHwwKVxyXG5cdFx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB7eCA6IHgsIHkgOiB5fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHR3aW5kZWNrX3R5cGVBIDogZnVuY3Rpb24ocGFyYW1zLCBjYXJkLCBpbmRleCwgbGVuZ3RoLCBkZWNrKSB7XHJcblxyXG5cdFx0XHRcdFx0dmFyIHR3aW5kZWNrX21heF9jYXJkcyAgICAgICA9IDI0LFxyXG5cdFx0XHRcdFx0XHR0d2luZGVja19kZWNrX2xlbmd0aCAgICAgPSAzO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHR2YXIgX3BhZGRpbmcgPSB7XHJcblx0XHRcdFx0XHRcdHggOiAyLFxyXG5cdFx0XHRcdFx0XHR5IDogMVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdHZhciBfZGVwdGggPSAobGVuZ3RoIC8gdHdpbmRlY2tfbWF4X2NhcmRzICogdHdpbmRlY2tfZGVja19sZW5ndGgpfDA7XHJcblx0XHRcdFx0XHRpZihfZGVwdGggPj0gdHdpbmRlY2tfZGVja19sZW5ndGgpIF9kZXB0aCA9IHR3aW5kZWNrX2RlY2tfbGVuZ3RoIC0gMTtcclxuXHJcblx0XHRcdFx0XHR2YXIgX3BsdXMgPSBpbmRleCAtIChsZW5ndGggLSBfZGVwdGggLSAxKTtcclxuXHRcdFx0XHRcdGlmKF9wbHVzIDwgMCkgX3BsdXMgPSAwO1xyXG5cclxuXHRcdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHRcdHggOiBwYXJhbXMueCArIF9wYWRkaW5nLnggKiBfcGx1cywgXHJcblx0XHRcdFx0XHRcdHkgOiBwYXJhbXMueSArIF9wYWRkaW5nLnkgKiBfcGx1c1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHJhZGlhbCA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cclxuXHRcdCAgICAgICAgICAgIC8vICAgICAgICAgICAgICBiXHJcblx0XHQgICAgICAgICAgICAvLyAgICAgICBDICAuLmA6ICAgQSA9IHNpbihiKSAqIENcclxuXHRcdCAgICAgICAgICAgIC8vICAgICAuLi5gYCAgIDpCICBCID0gY29zKGIpICogQ1xyXG5cdFx0ICAgICAgICAgICAgLy8gYS5gYC4uLi4uLi4rOlxyXG5cdFx0ICAgICAgICAgICAgLy8gICAgICAgIEEgICAgIHkgOTBkZWdcclxuXHRcdCAgICAgICAgICAgIHZhciBfZGVwdGggID0gMSxcclxuXHRcdCAgICAgICAgICAgIFx0X3JhZGl1cyA9IGluZGV4ICogX2RlcHRoLFxyXG5cdFx0ICAgICAgICAgICAgXHRfc3RlcCAgID0gMTgwIC8gMTYsXHJcblx0XHQgICAgICAgICAgICBcdF9jYXJkICAgPSBTb2xpdGFpcmVFbmdpbmUub3B0aW9ucy5jYXJkLFxyXG5cdFx0ICAgICAgICAgICAgXHRfYW5nbGUgID0gcGFyYW1zLnJvdGF0ZSwvL19zdGVwIC8gMiArIDI3MDtcclxuXHRcdCAgICAgICAgICAgIFx0X2RlZyAgICA9IE1hdGguUEkgLyAxODAsXHJcblx0ICAgICAgICAgICAgICAgIFx0X2EgICAgICA9IE1hdGguc2luKF9hbmdsZSAqIF9kZWcpICogX3JhZGl1cyxcclxuXHQgICAgICAgICAgICAgICAgXHRfYiAgICAgID0gTWF0aC5jb3MoX2FuZ2xlICogX2RlZykgKiBfcmFkaXVzO1xyXG5cdCAgICAgICAgICAgICAgICAvLyBpZihfYW5nbGUgPiAzNjApIF9hbmdsZSAtPSAzNjA7XHJcblx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdCAgICAgICAgICAgICAgICAgICAgeCA6IHBhcmFtcy54ICsgX2EsLy8gLSBfY2FyZC53aWR0aCAgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB5IDogcGFyYW1zLnkgLSBfYi8vIC0gX2NhcmQuaGVpZ2h0IC8gMlxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdCAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdyYWRpYWw6JywgcGFyYW1zLCBjYXJkLCBpbmRleCwgbGVuZ3RoLCBkZWNrKTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHNwZWNpYWwgOiBmdW5jdGlvbihwYXJhbXMsIGNhcmQsIGluZGV4LCBsZW5ndGgsIGRlY2spIHtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdzcGVjaWFsJywgc2hhcmUucGFkZGluZ194LCBzaGFyZS5wYWRkaW5nX3kpO1xyXG5cdFx0XHRcdFx0dmFyIF95ID0gcGFyYW1zLnksIF94ID0gcGFyYW1zLng7XHJcblx0XHRcdFx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW5kZXg7IGkgKz0gMSkge1xyXG5cdFx0XHRcdFx0XHRfeSArPSBkZWNrW2ldICYmIGRlY2tbaV0uZmxpcCA/IHBhcmFtcy5mbGlwX3BhZGRpbmdfeSA6IHBhcmFtcy5wYWRkaW5nX3k7XHJcblx0XHRcdFx0XHRcdF94ICs9IGRlY2tbaV0gJiYgZGVja1tpXS5mbGlwID8gcGFyYW1zLmZsaXBfcGFkZGluZ194IDogcGFyYW1zLnBhZGRpbmdfeDtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdzcGVjaWFsIHBhZGRpbmc6JywgaW5kZXgsIHNoYXJlLmZsaXBfcGFkZGluZ194LCBzaGFyZS5mbGlwX3BhZGRpbmdfeSwgc2hhcmUucGFkZGluZ194LCBzaGFyZS5wYWRkaW5nX3ksIF94LCBfeSwgZGVjayk7XHJcblx0XHRcdFx0XHRyZXR1cm4ge3ggOiBfeCwgeSA6IF95fTtcclxuXHRcdFx0XHR9LFxyXG5cdFx0XHRcdHZlcnRpY2FsOiBmdW5jdGlvbihwYXJhbXMsIGNhcmQsIGluZGV4LCBsZW5ndGgsIGRlY2spIHtcclxuXHRcdFx0XHRcdHZhciBfeSA9IHBhcmFtcy55O1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGluZGV4OyBpICs9IDEpIF95ICs9IGRlY2tbaV0gJiYgZGVja1tpXS5mbGlwID8gcGFyYW1zLmZsaXBfcGFkZGluZ195IDogcGFyYW1zLnBhZGRpbmdfeTtcclxuXHRcdFx0XHRcdHZhciBfcmV0dXJuID0ge1xyXG5cdFx0XHRcdFx0XHR4IDogcGFyYW1zLngsXHJcblx0XHRcdFx0XHRcdHkgOiBfeVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCd2ZXJ0aWNhbDonLCBkZWNrLmxlbmd0aCwgaW5kZXgsIF9yZXR1cm4pO1xyXG5cdFx0XHRcdFx0cmV0dXJuIF9yZXR1cm47XHJcblx0XHRcdFx0fSxcclxuXHRcdFx0XHRob3Jpem9udGFsOiBmdW5jdGlvbihwYXJhbXMsIGNhcmQsIGluZGV4LCBsZW5ndGgsIGRlY2spIHtcclxuXHRcdFx0XHRcdHZhciBfeCA9IHBhcmFtcy54O1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBpID0gMDsgaSA8IGluZGV4OyBpICs9IDEpIF94ICs9IGRlY2tbaV0gJiYgZGVja1tpXS5mbGlwID8gcGFyYW1zLmZsaXBfcGFkZGluZ194IDogcGFyYW1zLnBhZGRpbmdfeDtcclxuXHRcdFx0XHRcdHZhciBfcmV0dXJuID0ge1xyXG5cdFx0XHRcdFx0XHR4IDogX3gsXHJcblx0XHRcdFx0XHRcdHkgOiBwYXJhbXMueVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdob3Jpem9udGFsOicsIGRlY2subGVuZ3RoLCBpbmRleCwgX3JldHVybik7XHJcblx0XHRcdFx0XHRyZXR1cm4gX3JldHVybjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4dGVuc2lvbnMvcGFkZGluZ1R5cGVzLmpzXG4gKiogbW9kdWxlIGlkID0gMjBcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHQvLyDQv9GD0YHRgtGMINCx0YPQtNC10YJcclxuXHRNYXRoLnNxciA9IGZ1bmN0aW9uKGkpIHtyZXR1cm4gaSAqIGk7fVxyXG5cclxuXHQvLyB2YXIgZHJhZ19lbCA9IG51bGw7XHJcblx0c2hhcmUuZHJhZ0RlY2sgPSBudWxsO1xyXG5cdHNoYXJlLnN0YXJ0Q3Vyc29yID0gbnVsbDtcclxuXHJcblx0dmFyIHRvcF96X2luZGV4ID0gOTAwO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbigndW5kbycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0LypzaGFyZS5tb3ZlQ2FyZFRvSG9tZShcclxuXHRcdFx0c2hhcmUuZHJhZ0RlY2ssIFxyXG5cdFx0XHRtYWluLmdldERlY2tCeUlkKHNoYXJlLmRyYWdEZWNrWzBdLmNhcmQucGFyZW50KVxyXG5cdFx0KTsqL1xyXG5cdFx0aWYoc2hhcmUuZHJhZ0RlY2spIG1haW4uZ2V0RGVja0J5SWQoc2hhcmUuZHJhZ0RlY2tbMF0uY2FyZC5wYXJlbnQpLlJlZHJhdygpO1xyXG5cdFx0c2hhcmUuZHJhZ0RlY2sgICAgPSBudWxsO1xyXG5cdFx0c2hhcmUuc3RhcnRDdXJzb3IgPSBudWxsO1xyXG5cdH0pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbigncmVkbycsIGZ1bmN0aW9uKCkge1xyXG5cdFx0LypzaGFyZS5tb3ZlQ2FyZFRvSG9tZShcclxuXHRcdFx0c2hhcmUuZHJhZ0RlY2ssIFxyXG5cdFx0XHRtYWluLmdldERlY2tCeUlkKHNoYXJlLmRyYWdEZWNrWzBdLmNhcmQucGFyZW50KVxyXG5cdFx0KTsqL1xyXG5cdFx0aWYoc2hhcmUuZHJhZ0RlY2spIG1haW4uZ2V0RGVja0J5SWQoc2hhcmUuZHJhZ0RlY2tbMF0uY2FyZC5wYXJlbnQpLlJlZHJhdygpO1xyXG5cdFx0c2hhcmUuZHJhZ0RlY2sgICAgPSBudWxsO1xyXG5cdFx0c2hhcmUuc3RhcnRDdXJzb3IgPSBudWxsO1xyXG5cdH0pO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHR2YXIgY2Rvd24gPSBmdW5jdGlvbih0YXJnZXQsIHgsIHkpIHtcclxuXHJcblx0XHRpZihzaGFyZS5jdXJMb2NrU3RhdGUpIHJldHVybjtcclxuXHJcblx0XHR0cnkge1xyXG5cdFx0XHQkKCcuZHJhZ2dhYmxlJykuZmluaXNoKCk7XHJcblx0XHR9IGNhdGNoKGUpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gdHJ5eyQoJy5kcmFnZ2FibGU6YW5pbWF0ZWQnKS5maW5pc2goKTt9Y2F0Y2goZSl7Y29uc29sZS5sb2coJ0htbW0uLi4nLCAkKCcuZHJhZ2dhYmxlOmFuaW1hdGVkJykpO31cclxuXHJcblx0ICAgIGlmKHNoYXJlLmRyYWdEZWNrIHx8IHNoYXJlLnN0YXJ0Q3Vyc29yKSByZXR1cm47XHJcblx0ICAgIFxyXG5cdCAgICBpZiggdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoJ3Nsb3QnKSA+PSAwICkge1xyXG5cdFx0ICAgIFxyXG5cdFx0ICAgIHZhciBfaWQgICA9IHRhcmdldC5pZCxcclxuXHRcdCAgICBcdF9kZWNrID0gbWFpbi5nZXRFbGVtZW50QnlJZChfaWQpO1xyXG5cdCAgICBcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3J1bkRlY2tBY3Rpb25zJywge1xyXG5cdFx0XHRcdGRlY2sgOiBfZGVja1xyXG5cdFx0XHR9KTtcclxuXHQgICAgfVxyXG5cdCAgICBcclxuXHQgICAgaWYoIHRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKCdkcmFnZ2FibGUnKSA+PSAwICkge1xyXG5cdFx0ICAgIFxyXG5cdFx0ICAgIHZhciBfaWQgICAgID0gICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LmlkLFxyXG4gICAgXHRcdFx0X2NhcmQgICA9IF9pZCAgICAgICAgICAgICAgICAgICA/IG1haW4uZ2V0RWxlbWVudEJ5SWQoX2lkKSAgOiBudWxsLFxyXG5cdFx0XHRcdF9wYXJlbnQgPSBfY2FyZCAmJiBfY2FyZC5wYXJlbnQgPyBfY2FyZC5wYXJlbnQgICAgICAgICAgICAgIDogbnVsbCxcclxuXHRcdFx0XHRfZGVjayAgID0gX3BhcmVudCAgICAgICAgICAgICAgID8gbWFpbi5nZXREZWNrQnlJZChfcGFyZW50KSA6IG51bGw7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2FyZCBmcm9tIGRlY2s6JywgX2RlY2spO1xyXG5cdFx0XHRcclxuXHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgncnVuRGVja0FjdGlvbnMnLCB7XHJcblx0XHRcdFx0ZGVjayA6IF9kZWNrXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gVE9ET1xyXG5cdFx0XHQvLyDQsiDQtNCw0L3QvdC+0Lkg0YHQuNGC0YPQsNGG0LjQuCDQvtCx0YDQsNCx0LDRgtGL0LLQsNC10YLRgdGPINGC0L7Qu9GM0LrQviDQutC70LjQuiDQv9C+INC60LDRgNGC0LUsINC/0YPRgdGC0YvQtSDQutC+0LvQvtC00Ysg0L3QuNC60LDQuiDQvdC1INC+0LHRgNCw0LHQsNGC0YvQstCw0Y7RgtGB0Y9cclxuXHRcdFx0XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKF9pZCwgX2NhcmQsIF9wYXJlbnQsIF9kZWNrLCBtYWluLmdldEVsZW1lbnRzKCkpXHJcblx0XHRcdFxyXG5cdFx0XHRzaGFyZS5kcmFnRGVjayA9IF9kZWNrID8gX2RlY2suVGFrZShfaWQpIDogbnVsbDtcclxuXHRcdFx0XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHNoYXJlLmRyYWdEZWNrKTtcclxuXHQgICAgXHJcblx0ICAgICAgICBpZihzaGFyZS5kcmFnRGVjaykge1xyXG5cclxuXHQgICAgICAgIFx0c2hhcmUuc3RhcnRDdXJzb3IgPSB7XHJcblx0ICAgICAgICAgICAgXHR4ICA6IHgsXHJcblx0ICAgICAgICAgICAgXHR5ICA6IHlcclxuXHRcdCAgICAgICAgfVxyXG5cclxuXHRcdCAgICAgICAgbWFpbi50aXBzRGVzdGluYXRpb24oe2N1cnJlbnRDYXJkIDogX2NhcmR9KTtcclxuXHRcdCAgICB9XHJcblx0ICAgIH1cclxuXHJcblx0ICAgIC8vIGNvbnNvbGUubG9nKHNoYXJlLmRyYWdEZWNrLCBzaGFyZS5zdGFydEN1cnNvcik7XHJcblxyXG5cclxuXHR9XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHZhciBjbW92ZSA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHJcblx0ICAgIGlmKCFzaGFyZS5kcmFnRGVjayB8fCAhc2hhcmUuc3RhcnRDdXJzb3IpIHJldHVybjtcclxuXHJcblx0XHQvLyBpZihtYWluLmRlYnVnTGFiZWxzKCkpIHtcclxuXHRcdFx0Ly8gdmFyIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cdFx0XHQvLyBjYW52YXMuc2V0QXR0cmlidXRlKCd3aWR0aCcsIDEyOCk7XHJcblx0XHRcdC8vIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIDEyOCk7XHJcblx0XHRcdC8vIGNhbnZhcy5zZXRBdHRyaWJ1dGUoJ2lkJywgJ2NhbnZhcycpO1xyXG5cdFx0XHQvLyBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcclxuXHRcdFx0Ly8gY29udGV4dC5saW5lV2lkdGggPSAyO1xyXG5cdFx0XHQvLyBjb250ZXh0LmZvbnQgPSBcIjEycHggVmVyZGFuYVwiO1xyXG5cdFx0XHQvLyBjb250ZXh0LmZpbGxTdHlsZSA9IFwiYmx1ZVwiOy8vd2hpdGVcIjtcclxuXHRcdFx0Ly8gY29udGV4dC5zdHJva2VTdHlsZSA9IFwid2hpdGVcIjsvL2JsYWNrXCI7XHJcblx0XHRcdC8vIHZhciB0ZXh0ID0gXCIoeDp5KTogXCIgKyB4ICsgXCI6XCIgKyB5O1xyXG5cdFx0XHQvLyBjb250ZXh0LnN0cm9rZVRleHQodGV4dCwgMTUsIDIwKTtcclxuXHRcdFx0Ly8gY29udGV4dC5maWxsVGV4dCh0ZXh0LCAxNSwgMjApO1xyXG5cdFx0XHQvLyAvLyBpZihzaGFyZS5kcmFnRGVjaykgJChzaGFyZS5kcmFnRGVja1swXS5jYXJkKS5oaWRlKCk7XHJcblx0XHRcdC8vIHZhciBfZWwgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xyXG5cdFx0XHQvLyBpZihfZWwpIHtcclxuXHRcdFx0Ly8gdGV4dCA9IFwiY3Vyc29yIG9uOiBcIiArIF9lbC5pZDtcclxuXHRcdFx0Ly8gXHQvLyBpZihzaGFyZS5kcmFnRGVjaykgJChzaGFyZS5kcmFnRGVja1swXS5jYXJkKS5zaG93KCk7XHJcblx0XHRcdC8vIFx0Y29udGV4dC5zdHJva2VUZXh0KHRleHQsIDE1LCAzNSk7XHJcblx0XHRcdC8vIFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0LCAxNSwgMzUpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIGlmKHNoYXJlLmRyYWdEZWNrKSB7XHJcblx0XHRcdC8vIFx0dGV4dCA9IFwidGFrZTogXCIgKyBzaGFyZS5kcmFnRGVja1swXS5jYXJkLmlkO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCAxNSwgNTApO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuZmlsbFRleHQodGV4dCwgMTUsIDUwKTtcclxuXHRcdFx0Ly8gXHR0ZXh0ID0gXCIuLi4oeDp5KTogXCIgKyBzaGFyZS5zdGFydEN1cnNvci54ICsgXCI6XCIgKyBzaGFyZS5zdGFydEN1cnNvci55O1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCAxNSwgNjUpO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuZmlsbFRleHQodGV4dCwgMTUsIDY1KTtcclxuXHRcdFx0Ly8gXHR0ZXh0ID0gXCJkaXN0LjogXCIgKyBfZGlzdGFuY2U7XHJcblx0XHRcdC8vIFx0Y29udGV4dC5zdHJva2VUZXh0KHRleHQsIDE1LCA4MCk7XHJcblx0XHRcdC8vIFx0Y29udGV4dC5maWxsVGV4dCh0ZXh0LCAxNSwgODApO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIHZhciBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG5cdFx0XHQvLyBpbWFnZS5zcmMgPSBcImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQ0FBQUFBZ0NBWUFBQUJ6ZW5yMEFBQUFCbUpMUjBRQUFBQUFBQUQ1UTd0L0FBQUJpRWxFUVZSWXcrMld3VXJEUUJCQTM5VFlwRlVJRkpSYThDcWtuK0hWWCtqTm15ZFBmcHNJNmwvMEF6ejFWRnVxWmtPdDR5R3pOYWw2TW9raWZUQWt1MkdUbDlsbGQrQ1hFWXVXWFFFVWVMTnJJd1RBbmhyQVByQmJFS3FWbGtVSU1Cd09VZFVGMERHeDJpVmF3STRYbUU2blhtTGVsSVNmK3dEQU9kZTRSRkJzWkZuR1ppWkVKQVpTNEpVYUZtWkp3RG0zdm05S0l0anNjTTZ0UlpxUStDUVFSVkdwWGJkRVNTQ0tJc0l3TEluMGVqMkEyaVJLQXY3aldaWXhHQXdBR0kvSHBRRW0wUVZXbFF0NDBqU2wzKyt2LzE1RUxvRm5ZR0ZSS1YzZ1dGVTFqbU8vSFYrcHFpWkpva21TK0w0VDRBaUlnWWg4RC9reC9pVUtNSnZORUpFTDRCYnlCVmhNakdVaEJaWlV0QWhiOXFLbHBYb0VYQU9QSW5JK21VeUE5UUo4c0RFcktwcC9MN0FDTWhFNUEyNkFHVEFIN3IvSVFwdUtVbDhrSUovVGprWGIyZ2ZBU0FzQWgvYThNcVFRSHJXLzdKRFhCcWZrSitZTGNBYzhZVk5XbGNCMy9RSDVNUjJhd0JMSUxGWjFDL2hudm1BUlBrcTFSc3UxTFZ1Mi9FOXNXOS95TjNnSHhCakdndnBGMG8wQUFBQUFTVVZPUks1Q1lJST1cIjtcclxuXHRcdFx0Ly8gaW1hZ2Uub25sb2FkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vICAgICBjb250ZXh0LmRyYXdJbWFnZShpbWFnZSwgMCwgMCwgMzAsIDMwKTtcclxuXHRcdFx0Ly8gXHQkKCcjbWF0JykuY3NzKHtjdXJzb3IgOiAndXJsKFxcJycgKyBjYW52YXMudG9EYXRhVVJMKCkgKyAnXFwnKSwgcG9pbnRlcid9KTtcclxuXHRcdFx0Ly8gfTtcclxuXHRcdC8vIH1cclxuXHJcblx0XHR2YXIgX2Rpc3RhbmNlID0gc2hhcmUuc3RhcnRDdXJzb3IgPyBNYXRoLnNxcnQoTWF0aC5zcXIoeCAtIHNoYXJlLnN0YXJ0Q3Vyc29yLngpICsgTWF0aC5zcXIoeSAtIHNoYXJlLnN0YXJ0Q3Vyc29yLnkpKSA6IDA7XHJcblxyXG4gICAgXHR2YXIgX2RlY2sgPSBtYWluLmdldEVsZW1lbnRCeUlkKHNoYXJlLmRyYWdEZWNrWzBdLmNhcmQucGFyZW50KTtcclxuXHQgICAgZm9yKGkgaW4gc2hhcmUuZHJhZ0RlY2spIHtcclxuXHQgICAgXHR2YXIgX3Bvc2l0aW9uID0gX2RlY2sucGFkZGluZyhzaGFyZS5kcmFnRGVja1tpXS5pbmRleCk7XHJcblx0ICAgIFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0ICAgIFx0XHRsZWZ0ICAgICAgOiAoX3Bvc2l0aW9uLnggKyAoeCAtIHNoYXJlLnN0YXJ0Q3Vyc29yLngpKSArICdweCcsXHJcblx0ICAgIFx0XHR0b3AgICAgICAgOiAoX3Bvc2l0aW9uLnkgKyAoeSAtIHNoYXJlLnN0YXJ0Q3Vyc29yLnkpKSArICdweCcsXHJcblx0ICAgIFx0XHQvLyB0cmFuc2Zvcm0gOiAncm90YXRlKDBkZWcpJyxcclxuXHQgICAgXHRcdHpJbmRleCAgICA6IHRvcF96X2luZGV4ICsgKGl8MClcclxuXHQgICAgXHR9XHJcblx0ICAgIFx0Ly8gT3BlcmF0aW9ucyB3aXRoIERPTVxyXG5cdCAgICBcdCQoc2hhcmUuZHJhZ0RlY2tbaV0uY2FyZC5kb21FbGVtZW50KS5jc3MoX3BhcmFtcyk7XHJcblx0ICAgIH1cclxuXHJcblxyXG5cdCAgICB2YXIgY3Vyc29yTW92ZSA9IHtcclxuXHQgICAgXHRkaXN0YW5jZSAgICAgOiBfZGlzdGFuY2UsXHJcblx0ICAgIFx0ZGlyZWN0aW9uICAgIDoge1xyXG5cdFx0ICAgIFx0eCAgICAgOiB4IC0gc2hhcmUuc3RhcnRDdXJzb3IueCwvLyAoKykgcmlndGggLyAoLSkgbGVmdFxyXG5cdFx0ICAgIFx0eSAgICAgOiB5IC0gc2hhcmUuc3RhcnRDdXJzb3IueSwvLyAoKykgZG93biAgLyAoLSkgdXBcclxuXHRcdCAgICBcdHJpZ2h0IDogeCA+IHNoYXJlLnN0YXJ0Q3Vyc29yLngsXHJcblx0XHQgICAgXHRsZWZ0ICA6IHggPCBzaGFyZS5zdGFydEN1cnNvci54LFxyXG5cdFx0ICAgIFx0ZG93biAgOiB5ID4gc2hhcmUuc3RhcnRDdXJzb3IueSxcclxuXHRcdCAgICBcdHVwICAgIDogeSA8IHNoYXJlLnN0YXJ0Q3Vyc29yLnlcclxuXHQgICAgXHR9LFxyXG5cdCAgICBcdGxhc3RQb3NpdGlvbiA6IHtcclxuXHQgICAgXHRcdHggOiB4LFxyXG5cdCAgICBcdFx0eSA6IHlcclxuXHQgICAgXHR9LFxyXG5cdCAgICBcdGRlY2tQb3NpdGlvbiA6IHtcclxuXHQgICAgXHRcdHggOiAoX3Bvc2l0aW9uLnggKyAoeCAtIHNoYXJlLnN0YXJ0Q3Vyc29yLngpKSxcclxuXHQgICAgXHRcdHkgOiAoX3Bvc2l0aW9uLnkgKyAoeSAtIHNoYXJlLnN0YXJ0Q3Vyc29yLnkpKVxyXG5cdCAgICBcdH1cclxuXHQgICAgfVxyXG5cdCAgICBcclxuXHQgICAgbWFpbi50aXBzTW92ZSh7bW92ZURlY2sgOiBzaGFyZS5kcmFnRGVjaywgY3Vyc29yTW92ZSA6IGN1cnNvck1vdmV9KTtcclxuXHJcblx0ICAgIC8vJCgnIycgKyBkcmFnX2VsLmlkKS5jc3Moe2Rpc3BsYXk6ICdub25lJ30pO1xyXG5cdCAgICAvKi92YXIgX2RvcCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSlcclxuXHQgICAgaWYoX2RvcCkge1xyXG5cdCAgICBcdC8vY29uc29sZS5sb2coJ0RSQUc6JywgX2RvcC5pZCk7XHJcblx0ICAgIH0vKi9cclxuXHQgICAgLyovJCgnIycgKyBkcmFnX2VsLmlkKS5jc3Moe1xyXG5cdCAgICAgICAgbGVmdCA6ICggKHh8MCkgLSAoZHJhZ19lbC5jdXJzb3IueHwwKSArIChkcmFnX2VsLmVsLnh8MCkgKSArICdweCcsXHJcblx0ICAgICAgICB0b3AgIDogKCAoeXwwKSAtIChkcmFnX2VsLmN1cnNvci55fDApICsgKGRyYWdfZWwuZWwueXwwKSApICsgJ3B4JyxcclxuXHQgICAgICAgIGRpc3BsYXk6ICdibG9jaydcclxuXHQgICAgfSk7LyovXHJcblx0fVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHR2YXIgY2VuZCA9IGZ1bmN0aW9uKHRhcmdldCwgeCwgeSkge1xyXG5cclxuXHQgICAgaWYoIXNoYXJlLmRyYWdEZWNrIHx8ICFzaGFyZS5zdGFydEN1cnNvcikgcmV0dXJuO1xyXG5cclxuICAgIFx0dmFyIF9kZWNrID0gbWFpbi5nZXRFbGVtZW50QnlJZChzaGFyZS5kcmFnRGVja1swXS5jYXJkLnBhcmVudCk7XHJcbiAgICBcdHZhciBfcG9zaXRpb24gPSBfZGVjay5wYWRkaW5nKHNoYXJlLmRyYWdEZWNrWzBdLmluZGV4KTtcclxuXHJcblx0ICAgIHZhciBjdXJzb3JNb3ZlID0ge1xyXG5cdCAgICBcdGRpc3RhbmNlICAgICA6IE1hdGguc3FydChNYXRoLnNxcih4IC0gc2hhcmUuc3RhcnRDdXJzb3IueCkgKyBNYXRoLnNxcih5IC0gc2hhcmUuc3RhcnRDdXJzb3IueSkpLFxyXG5cdCAgICBcdGRpcmVjdGlvbiAgICA6IHtcclxuXHRcdCAgICBcdHggICAgIDogeCAtIHNoYXJlLnN0YXJ0Q3Vyc29yLngsLy8gKCspIHJpZ3RoIC8gKC0pIGxlZnRcclxuXHRcdCAgICBcdHkgICAgIDogeSAtIHNoYXJlLnN0YXJ0Q3Vyc29yLnksLy8gKCspIGRvd24gIC8gKC0pIHVwXHJcblx0XHQgICAgXHRyaWdodCA6IHggPiBzaGFyZS5zdGFydEN1cnNvci54LFxyXG5cdFx0ICAgIFx0bGVmdCAgOiB4IDwgc2hhcmUuc3RhcnRDdXJzb3IueCxcclxuXHRcdCAgICBcdGRvd24gIDogeSA+IHNoYXJlLnN0YXJ0Q3Vyc29yLnksXHJcblx0XHQgICAgXHR1cCAgICA6IHkgPCBzaGFyZS5zdGFydEN1cnNvci55XHJcblx0ICAgIFx0fSxcclxuXHQgICAgXHRsYXN0UG9zaXRpb24gOiB7XHJcblx0ICAgIFx0XHR4IDogeCxcclxuXHQgICAgXHRcdHkgOiB5XHJcblx0ICAgIFx0fSxcclxuXHQgICAgXHRkZWNrUG9zaXRpb24gOiB7XHJcblx0ICAgIFx0XHR4IDogKF9wb3NpdGlvbi54ICsgKHggLSBzaGFyZS5zdGFydEN1cnNvci54KSksXHJcblx0ICAgIFx0XHR5IDogKF9wb3NpdGlvbi55ICsgKHkgLSBzaGFyZS5zdGFydEN1cnNvci55KSlcclxuXHQgICAgXHR9XHJcblx0ICAgIH1cclxuXHJcblx0ICAgICQodGFyZ2V0KS5oaWRlKCk7XHJcblx0ICAgIHZhciBfZG9wID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcclxuXHQgICAgJCh0YXJnZXQpLnNob3coKTtcclxuXHQgICAgLy8gaWYoX2RvcCkge1xyXG4gICAgXHRtYWluLk1vdmUoc2hhcmUuZHJhZ0RlY2ssIF9kb3AsIGN1cnNvck1vdmUpO1xyXG5cdCAgICAvLyB9XHJcblxyXG5cdCAgICBzaGFyZS5kcmFnRGVjayA9IHNoYXJlLnN0YXJ0Q3Vyc29yID0gbnVsbDtcclxuXHJcblx0fVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRkb2N1bWVudC5vbm1vdXNlZG93biA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdGlmKGUuYnV0dG9uICE9IDApIHJldHVybjtcclxuXHQgICAgY2Rvd24oZS50YXJnZXQsIGUuY2xpZW50WCwgZS5jbGllbnRZKVxyXG5cdH1cclxuXHRkb2N1bWVudC5vbm1vdXNlbW92ZSA9IGZ1bmN0aW9uKGUpIHtcclxuXHQgICAgY21vdmUoZS5jbGllbnRYLCBlLmNsaWVudFkpXHJcblx0fVxyXG5cdGRvY3VtZW50Lm9ubW91c2V1cCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGlmKGUuYnV0dG9uICE9IDApIHJldHVybjtcclxuXHQgICAgY2VuZChlLnRhcmdldCwgZS5jbGllbnRYLCBlLmNsaWVudFkpXHJcblx0fVxyXG5cclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24oZSkge1xyXG5cdCAgICAvLyBlLnByZXZlbnREZWZhdWx0KClcclxuXHQgICAgY2Rvd24oZS50YXJnZXQsIGUudG91Y2hlc1swXS5jbGllbnRYLCBlLnRvdWNoZXNbMF0uY2xpZW50WSlcclxuXHR9LCBmYWxzZSk7XHJcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoc2hhcmUuc3RhcnRDdXJzb3IpIGUucHJldmVudERlZmF1bHQoKTtcclxuXHQgICAgY21vdmUoZS50b3VjaGVzWzBdLmNsaWVudFgsIGUudG91Y2hlc1swXS5jbGllbnRZKVxyXG5cdH0sIGZhbHNlKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHQgICAgLy8gZS5wcmV2ZW50RGVmYXVsdCgpXHJcblx0ICAgIGNlbmQoZS5jaGFuZ2VkVG91Y2hlc1swXS50YXJnZXQsIGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCwgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKTtcclxuXHR9LCBmYWxzZSk7XHJcbn07XG5cblxuLyoqKioqKioqKioqKioqKioqXG4gKiogV0VCUEFDSyBGT09URVJcbiAqKiAuL2V4dGVuc2lvbnMvRHJhZ05Ecm9wLmpzXG4gKiogbW9kdWxlIGlkID0gMjFcbiAqKiBtb2R1bGUgY2h1bmtzID0gMFxuICoqLyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM1S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUM5REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3RNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3pVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN4Z0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzVUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQzlKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDdkxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2hSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztBQ2hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0FDcEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OyIsInNvdXJjZVJvb3QiOiIifQ==