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

	var _SolitaireCommon = __webpack_require__(1);

	var _SolitaireCommon2 = _interopRequireDefault(_SolitaireCommon);

	var _Field = __webpack_require__(3);

	var _Field2 = _interopRequireDefault(_Field);

	var _DomManager = __webpack_require__(16);

	var _DomManager2 = _interopRequireDefault(_DomManager);

	var _SolitaireHistory = __webpack_require__(17);

	var _SolitaireHistory2 = _interopRequireDefault(_SolitaireHistory);

	var _Tips = __webpack_require__(18);

	var _Tips2 = _interopRequireDefault(_Tips);

	var _Move = __webpack_require__(20);

	var _Move2 = _interopRequireDefault(_Move);

	var _winCheck = __webpack_require__(21);

	var _winCheck2 = _interopRequireDefault(_winCheck);

	var _DragNDrop = __webpack_require__(22);

	var _DragNDrop2 = _interopRequireDefault(_DragNDrop);

	var _SolitaireDebug = __webpack_require__(2);

	var _SolitaireDebug2 = _interopRequireDefault(_SolitaireDebug);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SolitaireExtensions = {}; // ON | IN

	// +
	// +
	//             import * from './extensions/addGroup';            // +    Field
	//             import * from './extensions/addDeck';             // +    Field
	// +
	//             import * from './extensions/deckGenerator';       // +    SolitaireDebug
	// +
	//             import * from './extensions/tipsRules';           // +    Tips
	// +
	//             import * from './extensions/bestTip';             // +    Tips
	//             import * from './extensions/readyTakeRules';      // +    Field.addDeck
	//             import * from './extensions/readyPutRules';       // +    Field.addDeck
	//             import * from './extensions/fillRules';           // +    Field.addDeck
	// +
	//             import * from './extensions/forceMove';           // +    SolitaireHistory
	// +
	//             import * from './extensions/addDeckAction';       // +    Field.addDeck
	//             import * from './extensions/flipTypes';           // +    Field.addDeck
	//             import * from './extensions/paddingTypes';        // +    Field.addDeck
	// +
	// +

	// --------------------- INDEX ---------------------
	var share = {};

	var main = new function () {
	  // this.event = null;
	}();

	/*for(var i in SolitaireExtensions) {
		SolitaireExtensions[i](main, share);
	};*/

	(0, _SolitaireCommon2.default)(main, share);
	(0, _DomManager2.default)(main, share);
	(0, _DragNDrop2.default)(main, share);
	(0, _Tips2.default)(main, share);
	(0, _Move2.default)(main, share);
	(0, _winCheck2.default)(main, share);
	(0, _SolitaireHistory2.default)(main, share);

	if (typeof _SolitaireDebug2.default != "undefined") {
	  (0, _SolitaireDebug2.default)(main, share);
	}

	exports.main = main;
	exports.event = main.event;

	exports.init = function (gameConfig) {

	  (0, _Field2.default)(main, share, gameConfig);
		};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		share.elements = {};

		share.cardsSuits = ['h', 'd', 'c', 's']; // Red, Red, Black, Black
		share.cardColors = {
			'red': ['h', 'd'],
			'black': ['c', 's']
		};
		// share.redCards     = ;
		// share.blackCards   = ['c', 's'];
		share.cardsRank = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k'];
		share.cardsRankS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
		share.cardsRankInt = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

		share.field = null;

		share.default_can_move_flip = false;
		share.default_showSlot = false;
		share.default_autohide = false;

		share.default_paddingType = 'none', share.default_flip_type = 'none', share.default_takeName = 'onlytop', share.default_putName = 'any';

		share.default_tipRule = 'allToAll';

		share.default_padding_y = 20;
		share.default_padding_x = 20;
		share.default_flip_padding_y = 5;
		share.default_flip_padding_x = 20;
		share.default_start_z_index = 1;
		share.default_move_distance = 10;

		share.default_theme = 'default_theme';

		share.animationTime = 300;

		share.default_twindeck_move_card_count = 3;
		// share.default_twindeck_max_cards       = 7;
		// share.default_twindeck_deck_length     = 3;

		share.Tips = null, share.moveDistance = 0, // default 0
		share.showTips = true, // default true
		share.showTipsDestination = false, // default false
		share.showTipPriority = false; // default false

		share.debugLabels = false;
		share.start_z_index = share.default_start_z_index;

		share.oneStepWay = {};

		share.debugLog = false;

		share.can_move_flip = null;

		share.zoom = 1.0;

		share.card = {
			width: 71,
			height: 96,

			suits: ['h', 'd', 'c', 's'],
			colors: {
				red: ['h', 'd'],
				black: ['c', 's']
			},
			ranks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
			indexes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
		};

		main.event = new function () {

			var events = {};

			this.listen = function (name, callback) {
				if (typeof name != 'string' || typeof callback != 'function') return;
				if (events[name]) {
					events[name].push(callback);
				} else {
					events[name] = [callback];
				}
			};

			this.dispatch = function (name, data) {
				if (events[name]) {
					for (var i in events[name]) {
						events[name][i](data);
					}
				}
			};
		}();

		share.saveStepCallback = function () {};
		share.winCheckCallback = function () {};
		share.autoTips = function () {};

		var _id = 0;
		share.genId = function () {
			return _id++;
		};

		main.options = {
			card: share.card
		};

		// Lock/Unlock

		share.lock = false;

		var _lock = main.lock = function () {
			if (share.debugLog) console.log('LOCK');
			share.lock = true;
		}.bind(main);
		main.event.listen('lock', _lock);

		var _unlock = main.unlock = function () {
			if (share.debugLog) console.log('UNLOCK');
			// throw new Error('asda');
			share.lock = false;
		}.bind(main);
		main.event.listen('unlock', _unlock);

		share.curLockState = false;
		share.curLock = function () {
			share.curLockState = true;
		};
		share.curUnLock = function () {
			share.curLockState = false;
		};

		main.getElements = function () {
			return share.elements;
		}.bind(main);

		main.getElementsByName = function (name, type) {
			var s = [];
			for (var i in share.elements) {
				if (share.elements[i].name && typeof share.elements[i].name == 'string' && share.elements[i].name == name) {
					if (type && typeof share.elements[i].type == 'string') {
						if (type && share.elements[i].type == type) {
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

		main.getElementById = function (a) {
			return share.elements[a];
		}.bind(main);

		main.event.listen('makeStep', function (e) {
			share.saveStepCallback(e);
			// console.log('clear share.oneStepWay', onlytopeStepWay);
			share.oneStepWay = {};
			// console.log('share.oneStepWay cleared', share.oneStepWay);
		});

		main.event.listen('win', function (e) {
			// console.log('win', share.winCheckCallback, e);
			if (e && e.show) share.winCheckCallback(e);
		});

		main.event.listen('newGame', function (e) {
			share.checkTips();
		});

		share.validateCardName = function (name, nolog) {
			if (typeof name != 'string') {
				if (!nolog) console.log('Warning: validate name must have string type', name);
				// throw new Error('z');
				return false;
			}
			var suit = name.slice(0, 1),
			    rank = name.slice(1, 3),
			    color = null;
			for (var colorName in share.cardColors) {
				if (share.cardColors[colorName].indexOf(suit) >= 0) {
					color = colorName;
				}
			}
			// console.log('validateCardName:', color, suit, rank);
			if (share.cardsSuits.indexOf(suit) >= 0 && share.cardsRankS.indexOf(rank) >= 0) {
				return {
					suit: suit,
					rank: rank,
					color: color
				};
			} else {
				if (!nolog) console.log('Warning: validate name:', name, '- incorrect');
				return false;
			}
		};
	};

		;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		(0, _deckGenerator2.default)(main, share);

		// debug
		main.debugShowShare = function () {
			console.log(share);
		};

		// ----------------- History -----------------
		var debugHistory = new function () {

			var _history = [],
			    _redo = [];

			this.record = function (data) {

				// console.log('RECORD HISTORY:', data);

				_redo = [];
				_history.push(data);
			};

			this.undo = function () {
				var _step = _history.pop();
				if (_step) _redo.push(_step);
				return _step;
			};

			this.redo = function () {
				var _step = _redo.pop();
				if (_step) _history.push(_step);
				return _step;
			};

			var hist = this;

			main.event.listen('makeStep', this.record);

			document.addEventListener("DOMContentLoaded", function () {
				$(document.body).append($("<div>").append($("<span>").addClass('awesome').text('UNDO').click(function () {
					var _data = this.undo();
					// 	console.log('undo:', _data);
					if (_data) {
						SolitaireEngine.event.dispatch('undo', _data);
					}
					// }.bind({HM : this, callback : main.Move()}))
				}.bind(hist))).append($("<span>").addClass('awesome').text('REDO').click(function () {
					var _data = this.redo();
					// console.log('redo:', _data);
					if (_data) {
						SolitaireEngine.event.dispatch('redo', _data);
					}
				}.bind(hist))).css({ position: 'fixed', top: '1px', left: '1px' }));
			});
		}();
		// -------------------------------------------
	};
	
	var _deckGenerator = __webpack_require__(24);

	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// module.exports = function(main, share) {
	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _stringify = __webpack_require__(4);

	var _stringify2 = _interopRequireDefault(_stringify);

	exports.default = function (main, share, data) {

		// return Field;
		share.field = new Field(main, share, data);
	};

	var _addGroup = __webpack_require__(7);

	var _addGroup2 = _interopRequireDefault(_addGroup);

	var _addDeck = __webpack_require__(8);

	var _addDeck2 = _interopRequireDefault(_addDeck);

	var _tipsRules = __webpack_require__(15);

	var _tipsRules2 = _interopRequireDefault(_tipsRules);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Field = function Field(main, share, data) {

		var addDeck = function addDeck(data) {
			return new _addDeck2.default(main, share, data);
		};

		var addGroup = function addGroup(data) {
			return new _addGroup2.default(main, share, data);
		};

		if (!data && share.field) return share.field;
		if (!data) return false;

		if (data && share.field) {
			share.field.clear();
		}

		var a = null;
		try {
			a = JSON.parse((0, _stringify2.default)(data));
		} catch (e) {
			a = data;
			console.warn('Field input params is not JSON, maybe the rules are wrong.');
			// DEBUG
			/*var _names = [];
	  for(var i in a.groups.group_a) {
	  	_names.push(i);
	  }
	  console.log('DATA:', _names, a.groups.group_a);*/
		}

		share.homeGroups = a.homeGroups ? a.homeGroups : null;

		share.field = new function (a) {

			main.unlock();
		}(a);

		main.event.dispatch('initField', {
			a: a //,
			// field : share.field
		});

		share.debugLog = a.debugLog && typeof a.debugLog == 'boolean' ? a.debugLog : share.debugLog;

		// Tips

		share.showTips = typeof a.showTips == 'boolean' ? a.showTips : share.showTips;
		share.showTipsDestination = typeof a.showTipsDestination == 'boolean' ? a.showTipsDestination : share.showTipsDestination;
		share.showTipPriority = typeof a.showTipPriority == 'boolean' ? a.showTipPriority : share.showTipPriority;

		share.autoTips = a.autoTips ? typeof a.autoTips == 'string' ? _tipsRules2.default[a.autoTips] ? _tipsRules2.default[a.autoTips] : _tipsRules2.default[share.default_tipRule] : a.autoTips //function OR object
		: _tipsRules2.default[share.default_tipRule];

		if (document.location.hash == "#god") {
			document.body.innerHTML = "<h1>=)</h1>";
		}

		share.moveDistance = a.moveDistance && typeof a.moveDistance == 'number' ? a.moveDistance : share.default_move_distance;

		// check Win

		share.winCheckMethod = a.winCheck
		// && a.winCheck.callback && typeof a.winCheck.callback == 'function'
		 && a.winCheck.rules ? typeof a.winCheck.rules == 'string' ? share.winCheckMethods[a.winCheck.rules] ? share.winCheckMethods[a.winCheck.rules] : share.winCheckMethods['newerWin'] : a.winCheck.rules
		// : typeof a.winCheck.method == 'function'
		// 	? a.winCheck.method
		// 	: a.winCheck.method
		: share.winCheckMethods['newerWin'];

		if (a.winCheck && a.winCheck.callback && typeof a.winCheck.callback == 'function') {
			winCheckCallback = a.winCheck.callback;
		}

		// extension: winCheckMethods

		if (a.saveStep && typeof a.saveStep == 'function') {
			console.log('a.saveStep', a.saveStep);
			saveStepCallback = a.saveStep;
		}

		// paraneters and values

		if (a.zoom && typeof a.zoom == 'number') {
			share.zoom = a.zoom;
		}

		share.can_move_flip = a.can_move_flip && typeof a.can_move_flip == 'boolean' ? a.can_move_flip : share.default_can_move_flip;

		if (a.debugLabels && typeof a.debugLabels == 'boolean') {
			share.debugLabels = a.debugLabels;
		}

		if (a.groups) for (var groupName in a.groups) {
			// if(a.groups[i].elements) for(e in a.groups[i].elements) {
			// 	main.addDeck(a.groups[i].elements[e])
			// }
			a.groups[groupName].name = groupName;
			addGroup(a.groups[groupName]);
		}
		if (a.decks) for (var e in a.decks) {
			main.addDeck(a.decks[e]);
		}

		// checkTips()

		if (a.startZIndex && typeof a.startZIndex == 'number') {
			share.start_z_index = a.startZIndex;
		}

		// fill elements in field

		if (a.fill) {

			// var _isDeck = true;
			// for(i in a.fill) _isDeck = _isDeck && validateCardName(a.fill[i], true);
			// _isDeck = _isDeck && a.fill.length;

			// if(_isDeck) {
			// TODO
			// Fill field, all decks
			// field.fill(a.fill);
			// } else {
			for (var _name in a.fill) {
				var _elements = this.getElementsByName(_name);
				for (var i in _elements) {
					if (['deck', 'group'].indexOf(_elements[i].type) && typeof a.fill[_name] != 'string') {
						_elements[i].Fill(a.fill[_name]);
					}
				}
			}
			// }
		}

		if (a.cardLoader && typeof a.cardLoader == 'function') {
			// && a.cardsSet) {
			a.cardLoader(a.cardsSet, main);
		}

		// share.checkTips(); // has in 'newGame' listener

		// Clear field

		share.field.clear = function () {
			// console.log('clear field');
			for (var i in share.elements) {
				// console.log(elements[i]);
				if (share.elements[i].type == 'deck') {
					share.elements[i].clear();
					share.elements[i] = null;
				} else if (share.elements[i].type == 'group') {
					share.elements[i] = null;
				}
			}
			share.elements = {};
		};

		// Redraw field

		// field.fill = function(a) {};
		main.event.dispatch('newGame');
	}; //.bind(main);

	Field.prototype.Redraw = function () {
		var a = null;

		try {
			a = JSON.parse((0, _stringify2.default)(data));
		} catch (e) {
			a = data;
			console.warn('Field.Redraw input params is not JSON, can\'t clone');
		}

		for (var _groupName in a.groups) {
			var _group = main.Group(_groupName);
			if (_group) {
				_group.Redraw(a.groups[_groupName]);
			}
			// for(_deckIndex in a.groups[_groupName]) {
			// 	a.groups[_groupName][_deckIndex].name
			// }
		}
		for (var i in a.decks) {
			//var _parent = main.getElementById(_decks[i].parent());
			//var _parentName = _parent ? _parent.name : null;
			var _deck = main.Deck(a.decks[i].name);
			if (_deck) {
				_deck.Redraw(a.decks[i]);
			} //else {
			// 	_decks[i].Redraw(a.groups[_parentName]);
			// }
		}
		// }
	};

		;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

		module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(4);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var core = __webpack_require__(6);
	module.exports = function stringify(it) {
	  // eslint-disable-line no-unused-vars
	  return (core.JSON && core.JSON.stringify || _stringify2.default).apply(JSON, arguments);
		};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	var core = module.exports = { version: '1.2.6' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share, data) {

		var addDeck = function addDeck(data) {
			return new _addDeck2.default(main, share, data);
		};

		var addGroup = function addGroup(a) {

			// console.log('GROUP:', main, share, a);

			if (!a) return false;
			var _id = 'group_' + share.genId();
			var _el_group = new function (a) {

				this.type = 'group';
				var id = _id;
				this.getId = function () {
					return id;
				};

				this.name = a.name && typeof a.name == 'string' ? a.name : 'name_' + id;

				var x = a.position && a.position.x && typeof a.position.x == 'number' ? a.position.x : 0,
				    y = a.position && a.position.y && typeof a.position.y == 'number' ? a.position.y : 0,
				    placement = a.placement ? { x: a.placement.x ? a.placement.x : 0, y: a.placement.y ? a.placement.y : 0 } : null;

				var decks = {};

				// сохраняем атрибуты чтобы прокинуть их колодам

				var paddingType = a.paddingType ? a.paddingType : null,
				    flip = a.flip ? a.flip : null,
				    take = a.take ? a.take : null,
				    showSlot = a.showSlot ? a.showSlot : null,
				    takeRules = a.takeRules ? a.takeRules : null,
				    putRules = a.putRules ? a.putRules : null,
				    fillRule = a.fillRule ? a.fillRule : null,
				    autoHide = a.autoHide ? a.autoHide : null,
				    paddingX = a.paddingX ? a.paddingX : null,
				    paddingY = a.paddingY ? a.paddingY : null,
				    flipPaddingX = a.flipPaddingX ? a.flipPaddingX : null,
				    flipPaddingY = a.flipPaddingY ? a.flipPaddingY : null;

				// сортировка элементов в группе по заданному индексу и порядку добавления

				var deckIndex = [];
				// for(i in decks) deckIndex.push(null);

				// Add deck to group

				this.addDeck = function (a) {

					if (!a) return;
					if (!a.position) a.position = { x: 0, y: 0 };
					if (!a.position.x) a.position.x = 0;
					if (!a.position.y) a.position.y = 0;

					if (!a.parent) a.parent = this.name;

					a.parentPosition = { x: x, y: y };
					// a.position = a.position ? {x : a.position.x + x, y : a.position.y + y} : {x : x, y : y};

					// расставляем колоды в группе
					// 1 приоретет отдаётся параметру groupIndex
					// остальные вставляются в промежутки или добавляются в конец

					var _index = 0;

					if (a.groupIndex && typeof a.groupIndex == 'number' && deckIndex[a.groupIndex - 1] && decks[deckIndex[a.groupIndex - 1]].deckIndex == a.deckIndex) {
						console.warn('Warning: duplicate groupIndex', a.groupIndex, 'changed to null');
						a.groupIndex = null;
					}

					if (a.groupIndex && typeof a.groupIndex == 'number') {

						if (deckIndex[a.groupIndex - 1]) {

							for (; typeof deckIndex[_index] != 'undefined'; _index += 1) {}

							if (placement) {
								console.log('placement#1');
								if (placement.x) share.elements[deckIndex[a.groupIndex - 1]].x(x + (placement.x + card.width) * _index);
								if (placement.y) share.elements[deckIndex[a.groupIndex - 1]].y(y + (placement.y + card.width) * _index);
							}

							deckIndex[_index] = deckIndex[a.groupIndex - 1];
							deckIndex[a.groupIndex - 1] = true; //a.name && typeof a.name == 'string' ? a.name : true;
							_index = a.groupIndex - 1;
						} else {

							deckIndex[a.groupIndex - 1] = true; //a.name && typeof a.name == 'string' ? a.name : true;
							_index = a.groupIndex - 1;
						}
					} else {

						for (; typeof deckIndex[_index] != 'undefined'; _index += 1) {}
						deckIndex[_index] = true; //a.name && typeof a.name == 'string' ? a.name : true;
					}

					// смещаем координаты колод относиткльно координад группы

					if (placement) {
						// console.log('placement#2', placement);
						if (placement.x) a.position.x = (placement.x + share.card.width) * _index;
						// if(placement.x) a.position.x = x + (placement.x + share.card.width)  * (_index);
						if (placement.y) a.position.y = (placement.y + share.card.height) * _index;
						// if(placement.y) a.position.y = y + (placement.y + share.card.height) * (_index);
					}

					// прокидываем некоторые атрибуты всем колодам группы (у атрибутов заданных колоде приоритет выше)

					// if(paddingType  && !a.paddingType)  a.paddingType  = paddingType;
					// if(flip         && !a.flip)         a.flip         = flip;
					// if(take         && !a.take)         a.take         = take;

					if (paddingType && typeof a.paddingType == "undefined") a.paddingType = paddingType;
					if (flip && typeof a.flip == "undefined") a.flip = flip;
					if (take && typeof a.take == "undefined") a.take = take;
					if (showSlot && typeof a.showSlot == "undefined") a.showSlot = showSlot;
					if (takeRules && typeof a.takeRules == "undefined") a.takeRules = takeRules;
					if (putRules && typeof a.putRules == "undefined") a.putRules = putRules;
					if (fillRule && typeof a.fillRule == "undefined") a.fillRule = fillRule;
					if (autoHide && typeof a.autoHide == "undefined") a.autoHide = autoHide;
					// changed
					if (paddingX && typeof a.paddingX == "undefined") a.paddingX = paddingX;
					if (paddingY && typeof a.paddingY == "undefined") a.paddingY = paddingY;
					if (flipPaddingX && typeof a.flipPaddingX == "undefined") a.flipPaddingX = flipPaddingX;
					if (flipPaddingY && typeof a.flipPaddingY == "undefined") a.flipPaddingY = flipPaddingY;

					var _el = addDeck(a);

					// _el.parent(_id);// write
					deckIndex[_index] = _el.getId();

					decks[_el.getId()] = _el;
				};

				// Get decks from group

				this.getDecks = function (a) {
					var _decks = [];
					for (i in decks) {
						if (a && a.visible) {
							if (decks[i].visible) {
								_decks.push(decks[i]);
							}
						} else {
							_decks.push(decks[i]);
						}
					}
					return _decks;
				};

				this.getDeckById = function (id) {
					return decks[id];
				};

				this.getDecksByName = function (name) {
					var _decks = {};
					for (var d in decks) {
						if (decks[d].name == name) {
							_decks[d] = decks[d];
						}
					}
					return _decks;
				};

				// Fill group

				this.Fill = function (cardNames) {

					// console.log('fill Group', this.name, cardNames, decks);

					var deckIndex = [];
					var _decksLength = 0;

					// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)

					for (var i in decks) {
						_decksLength += 1;
						deckIndex.push(null);
					}

					for (var i in decks) {
						if (decks[i].groupIndex && decks[i].groupIndex <= _decksLength) {
							deckIndex[decks[i].groupIndex - 1] = true;
						}
					}

					for (var i in decks) {
						if (!decks[i].groupIndex) {
							var _index = 0;
							for (; deckIndex[_index] != null; _index += 1) {}
							deckIndex[_index] = decks[i].getId();
						}
					}

					for (var i in decks) {
						if (decks[i].groupIndex && decks[i].groupIndex <= _decksLength) {
							deckIndex[decks[i].groupIndex - 1] = decks[i].getId();
						}
					}

					var _decksWithBigIndex = {};
					for (var i in decks) {
						if (decks[i].groupIndex && decks[i].groupIndex > _decksLength) {
							_decksWithBigIndex[decks[i].groupIndex - 1] = decks[i].getId();
						}
					}

					for (var i in _decksWithBigIndex) {
						var _index = 0;
						for (; deckIndex[_index] != null; _index += 1) {}
						deckIndex[_index] = decks[_decksWithBigIndex[i]].getId();
					}

					var _checkDeck = true;
					for (var i in cardNames) {
						_checkDeck = _checkDeck && typeof cardNames[i] == 'string'; //share.validateCardName(cardNames[i])
					}

					if (_checkDeck) {
						for (var i in cardNames) {

							// циклично добавляет карты в колоды в группе (в порядке добавления)

							var _index = deckIndex[i % deckIndex.length];
							decks[_index].genCardByName(cardNames[i]);
						}
					} else {
						for (var i in cardNames) {
							if (i < deckIndex.length) {

								decks[deckIndex[i]].Fill(cardNames[i]);
							}
						}
					}
				};
			}(a);

			if (a.decks) {
				if (typeof a.decks == 'number') {
					var _count = a.decks;
					a.decks = [];
					for (var deckNum = 0; deckNum < _count; deckNum += 1) {
						// console.log('DEBUG; GEN DECKS BY COUNTER', deckNum, _count, a.decks)
						a.decks.push({
							name: _el_group.name + "_deck" + (deckNum + 1)
							// parent : _id
						});
					}
				}
				for (var d in a.decks) {
					_el_group.addDeck(a.decks[d]);
				}
			}
			share.elements[_id] = _el_group;

			// fill group

			if (a && a.fill) {
				var _checkFillDeck = a.fill.length;
				// for(i in a.fill) {
				// 	_checkFillDeck = _checkFillDeck && typeof a.fill[i] == 'string' && share.validateCardName(a.fill[i]);
				// }
				if (_checkFillDeck) _el_group.Fill(a.fill);
			}

			// Redraw group

			_el_group.Redraw = function (_a) {
				var _decks = this.getDecks();
				var _index = {};
				// for(i in _a.decks)
				if (typeof _a.decks == 'undefined' || typeof _a.decks == 'number') _a.decks = [];
				for (var i in _decks) {

					if (!_a.decks[i]) _a.decks[i] = {};

					// changed values

					if (!_a.decks[i].position) {
						_a.decks[i].position = {};
					}
					if (!_a.decks[i].parentPosition) {
						_a.decks[i].parentPosition = {};
					}
					// if( !_a.decks[i].position.x && a.position && a.position.x && typeof a.position.x == 'number') {
					// 	_a.decks[i].position.x = _a.position.x;
					// 	console.log('set position x', _a.decks[i].position)
					// }
					// if( !_a.decks[i].position.y && a.position && a.position.y && typeof a.position.y == 'number') {
					// 	_a.decks[i].position.y = _a.position.y;
					// }
					if (!_a.decks[i].parentPosition.x && a.position && a.position.x && typeof a.position.x == 'number') {
						_a.decks[i].parentPosition.x = _a.position.x;
					}
					if (!_a.decks[i].parentPosition.y && a.position && a.position.y && typeof a.position.y == 'number') {
						_a.decks[i].parentPosition.y = _a.position.y;
					}
					if (_a.placement) {

						var _card = main.options.card;
						// console.log('placement#3', _a.placement);

						if (_a.placement.x) _a.decks[i].position.x = (_a.placement.x + _card.width) * i;
						// if(_a.placement.x) _a.decks[i].position.x = x + (_a.placement.x + _card.width)  * i + a.parentPosition.x;
						if (_a.placement.y) _a.decks[i].position.y = (_a.placement.y + _card.height) * i;
						// if(_a.placement.y) _a.decks[i].position.y = y + (_a.placement.y + _card.height) * i + a.parentPosition.y;
					}
					if (!_a.decks[i].rotate && _a.rotate && typeof _a.rotate == 'number') _a.decks[i].rotate = _a.rotate;
					if (!_a.decks[i].paddingX && _a.paddingX && typeof _a.paddingX == 'number') _a.decks[i].paddingX = _a.paddingX;
					if (!_a.decks[i].paddingY && _a.paddingY && typeof _a.paddingY == 'number') _a.decks[i].paddingY = _a.paddingY;
					if (!_a.decks[i].flipPaddingX && _a.flipPaddingX && typeof _a.flipPaddingX == 'number') _a.decks[i].flipPaddingX = _a.flipPaddingX;
					if (!_a.decks[i].flipPaddingY && _a.flipPaddingY && typeof _a.flipPaddingY == 'number') _a.decks[i].flipPaddingY = _a.flipPaddingY;
					_decks[i].Redraw(_a.decks[i]);
					// if(_decks[i].name)
				}
				// for(i in _a.decks) {
				// 	console.log('redraw:', _a.decks[i])
				// 	var _deck = main.Deck(_a.decks[i].name, _el_group.name);
				// 	if(_deck) {
				// 		_deck.Redraw(_a.decks[i]);
				// 	}
				// }
			};
	
			return _el_group;
		}; //.bind(main);

		main.Group = function (name) {
			return main.getElementsByName(name, 'group')[0];
		};

		return addGroup(data);
	};

	var _addDeck = __webpack_require__(8);

	var _addDeck2 = _interopRequireDefault(_addDeck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share, data) {

		var readyPutRules = (0, _readyPutRules2.default)(main, share);
		var fillRules = (0, _fillRules2.default)(main, share);
		var deckActions = (0, _addDeckAction2.default)(main, share);

		// console.log('readyPutRules:', readyPutRules);

		var addDeck = function addDeck(a) {

			// console.log('DECK:', a, share, data);

			if (!a) return false;
			var _id = 'deck_' + share.genId();
			var _el_deck = new function (a) {

				if (!a) return false;

				// parameters

				this.type = 'deck';
				var id = _id;
				this.getId = function () {
					return id;
				};

				var _parent_el = main.Group(a.parent),
				    _parent_name = _parent_el ? _parent_el.name : 'xname',
				    _new_id = _parent_el ? _parent_el.getDecks().length : id;
				this.name = a.name && typeof a.name == 'string' ? a.name : _parent_name + '_' + _new_id;

				var parent = a.parent && typeof a.parent == 'string' ? a.parent : 'field';
				this.parent = function (a) {
					if (typeof a == 'string') parent = a;
					return parent;
				};

				var autoHide = a.autoHide && typeof a.autoHide == 'boolean' ? a.autoHide : share.default_autohide;

				this.visible = a.visible && typeof a.visible == 'boolean' ? a.visible : true; // default true

				var params = {};
				params.startZIndex = a.startZIndex && typeof a.startZIndex == 'number' ? a.startZIndex : share.start_z_index;

				// changed parameters
				this.groupIndex = a.groupIndex && typeof a.groupIndex == 'number' ? a.groupIndex : null;

				// DOM
				params.x = 0;
				params.y = 0;
				params.rotate = this.rotate = 0;

				params.padding_y = a.paddingY && typeof a.paddingY == 'number' ? a.paddingY : share.default_padding_y;
				params.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' ? a.flipPaddingY : share.default_flip_padding_y;

				params.padding_x = a.paddingX && typeof a.paddingX == 'number' ? a.paddingX : share.default_padding_x;
				params.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' ? a.flipPaddingX : share.default_flip_padding_x;

				// console.log('ADD DECK:', a.paddingX, a.paddingY, share.padding_x, share.padding_y);

				main.event.dispatch('addDeckEl', {
					a: a,
					deck: this,
					params: params
				});

				this.hide = function () {
					this.visible = false;
					oneStepWay.hideDeck = this.name;
					this.Redraw();
					// $(domElement).hide();
				};

				this.show = function () {
					this.visible = false;
					oneStepWay.showDeck = this.name;
					this.Redraw();
					// $(domElement).show();
				};

				// ------------- FLIP -------------

				// flipTypes.js

				var flipType = a.flip && typeof a.flip == 'string' ? a.flip : share.default_flip_type,
				    checkFlip = _flipTypes2.default[flipType];
				this.flipCheck = function () {
					for (var i in cards) {
						checkFlip(cards[i], i | 0, cards.length);
					}
				};

				// --------------------------------

				var cards = []; // 1 or N, id : {name: '', rank: '', color: '', flip: null, id: '', paddingType: N} id - dom element id

				// создать карту
				this.genCardByName = function (name) {
					// console.log('genCardByName:', name);
					var _name = share.validateCardName(name); // {color, rank}
					var _parent = id;

					if (_name) {

						var _id = 'card_' + share.genId(),
						    _card = {
							id: _id,
							name: name,
							type: 'card',
							// domElement : domElement,
							visible: true,
							parent: _parent,
							flip: false
						};

						main.event.dispatch('addCardEl', _card);

						share.elements[_id] = _card;
						this.Push([_card]);

						this.flipCheck();

						this.Redraw();

						return _card;
					}

					return false;
				}; //.bind(this)
				// ------------- PUT -------------

				// можно ли положить карту/стопку

				// readyPutRules.js
				// console.log('PUT DEBUG:', a.putRules, share.default_putName, readyPutRules);	
				var putRules = a.putRules ? typeof a.putRules == 'function' ? a.putRules : typeof a.putRules == 'string' ? readyPutRules[a.putRules] ? readyPutRules[a.putRules] : readyPutRules[share.default_putName]
				// : readyPutRules[share.default_putName]
				// : typeof a.putRules === 'object'
				// : a.putRules.toString() == "[object Object]"
				: a.putRules.constructor == Array ? a.putRules : readyPutRules[share.default_putName] : readyPutRules[share.default_putName];

				// проверяем, можем ли положить стопку/карту
				// возвращает true, если согласно правилам сюда можно положить карту

				// TODO
				// this.Put = function(putDeck) {
				// 	share.Put({deck : this, putDeck : putDeck})
				// }

				this.Put = function (putDeck) {

					var rulesCorrect = true;

					var _deckId = putDeck[0].card.parent;
					var _deck_departure = main.getDeckById(_deckId);
					// console.log('Put ------------------------------->', this.name);

					if (typeof putRules == 'function') {
						rulesCorrect = rulesCorrect && putRules({
							from: {
								deckId: _deckId,
								deck: _deck_departure
							},
							putDeck: putDeck,
							cards: cards
						});
					} else {
						// console.log('%cEACH', 'color: blue;font-weight : bold;', putRules);
						for (var ruleName in putRules) {

							var _ruleName = parseInt(ruleName).toString() == ruleName && typeof putRules[ruleName] == 'string' ? putRules[ruleName] : ruleName;

							if (readyPutRules[_ruleName]) {
								// var _c = '#' + (((Math.random() * 15728639)|0) + 1048576).toString(16);
								// console.log('%c  ', 'border-radius : 100%;font-weight: bold;background:' + _c, _deckId, cards, _ruleName);
								rulesCorrect = rulesCorrect && readyPutRules[_ruleName]({
									from: {
										deckId: _deckId,
										deck: _deck_departure
									},
									putDeck: putDeck,
									cards: cards,
									rulesArgs: putRules[ruleName]
								});
								// console.log('%c  ', 'border-radius : 100%;background:' + _c, 'END');
							} else if (typeof putRules[_ruleName] == 'function') {
									rulesCorrect = rulesCorrect && putRules[_ruleName]({
										from: {
											deckId: _deckId,
											deck: _deck_departure
										},
										putDeck: putDeck,
										cards: cards
									});
								} else {
									console.warn('putRule:', _ruleName, 'not exists');
									rulesCorrect = false;
								}
						}
					}

					return rulesCorrect;
				};
				// ------------- TAKE -------------

				// можно ли взять карту/стопку

				var takeRules = a.takeRules ? typeof a.takeRules == 'function' ? a.takeRules : typeof a.takeRules == 'string' ? _readyTakeRules2.default[a.takeRules] ? _readyTakeRules2.default[a.takeRules] : _readyTakeRules2.default[share.default_takeName] : _readyTakeRules2.default[share.default_takeName]
				// : typeof a.takeRules == 'object'
				// 	? a.takeRules
				// 	: readyTakeRules[share.default_takeName]
				: _readyTakeRules2.default[share.default_takeName];
				// console.log(this.name, a.takeRules);

				this.Take = function (cardId) {

					var rulesCorrect = !share.lock;
					if (typeof this.fill == "boolean") {
						rulesCorrect = rulesCorrect && !this.fill;
					}

					// берём карту/стопку
					// console.log('Take', cardId);

					var cardIndex = -1;
					var cardName = null;
					var cardSuit = null;
					var cardRank = null;
					var deckLength = cards.length;

					// проверяем не является ли перевернутой

					var takeDeck = [];

					for (var i in cards) {

						if (cards[i].id == cardId) {
							cardIndex = i | 0;
							cardName = cards[i].name;

							var _name = share.validateCardName(cardName);

							rulesCorrect = rulesCorrect && _name;

							if (_name) {
								cardSuit = _name.suit;
								cardRank = _name.rank;
							}

							rulesCorrect = rulesCorrect && (cards[i].flip == false || cards[i].flip == share.default_can_move_flip);
						}

						if (cardIndex >= 0) {
							takeDeck.push({ index: i, card: cards[i] });
						}
					}
					var _attrs = {
						cardId: cardId,
						cardName: cardName,
						cardSuit: cardSuit,
						cardRank: cardRank,
						cardIndex: cardIndex,
						deckLength: deckLength
					};
					if (typeof takeRules == 'function') {
						rulesCorrect = rulesCorrect && takeRules(_attrs);
						// TODO
						// лучше обрабатывать строку если правило одно и не нужен массив
						// } else if(typeof takeRules == 'string') {
					} else {
							for (var ruleIndex in takeRules) {
								var ruleName = takeRules[ruleIndex];

								if (share.readyTakeRules[ruleName]) {
									rulesCorrect = rulesCorrect && share.readyTakeRules[ruleName](_attrs);
								} else {
									// if(typeof takeRules[ruleIndex] == 'function') {
									// rulesCorrect = rulesCorrect && takeRules[ruleIndex](_attrs);
									console.log('Incorrect take rule:', ruleName);
									rulesCorrect = false;
								}
							}
						}

					// возвращает массив ID карт которые можно будет перетащить
					// записывает их как активные

					rulesCorrect = rulesCorrect && cardIndex >= 0;
					return rulesCorrect && takeDeck;
				};
				// ------------- FILL -------------

				this.fill = false;
				var fillRule = a.fillRule && typeof a.fillRule == "string" && typeof fillRules[a.fillRule] == "function" ? fillRules[a.fillRule] : fillRules['not'];
				// console.log('Fill rule:', this.name, fillRule);
				main.event.listen('moveDragDeck', function (data) {
					if (data.destination.name != this.deck.name) return;
					// console.log(this.deck.name, data.move.from, data.move.to);
					var _deck = data.destination; // 	main.Deck(data.move.to);
					if (_deck && !this.fill && this.callback({ deck: _deck })) {
						this.deck.fill = true;
						share.oneStepWay.fill = {
							deck: this.deck.name
						};
						// main.event.dispatch('fillDeck', {deck : this.deck});
					}
				}.bind({ deck: this, callback: fillRule }));

				// ------------- PADDING -------------

				// порядок карт в колоде

				// paddingTypes.js

				var padding = a.paddingType ? typeof a.paddingType == 'string' && _paddingTypes2.default[a.paddingType] ? _paddingTypes2.default[a.paddingType] : typeof a.paddingType == 'function' ? a.paddingType : _paddingTypes2.default['none'] : a.paddingX || a.paddingY ? _paddingTypes2.default['special'] : _paddingTypes2.default[share.default_paddingType];

				this.padding = function (index) {
					var _padding = padding(params, cards[index], index, cards.length, cards);
					return _padding;
				};

				this.hideCards = function () {
					for (var i in cards) {
						cards[i].visible = false;
						main.event.dispatch('hideCard', cards[i]);
					}
				};

				this.showCards = function () {
					for (var i in cards) {
						cards[i].visible = true;
						main.event.dispatch('showCard', cards[i]);
					}
				};

				if (a.actions) {
					// TODO сделать красивее
					this.actions = a.actions;
				}

				// ------------- \/\/\/\/\/ -------------

				// Redraw deck

				this.Redraw = function (_a) {

					main.event.dispatch('redrawDeck', {
						deck: this,
						a: _a,
						params: params,
						cards: cards
					});
				};
				this.getCards = function () {
					return cards;
				};

				this.getCardsByName = function (cardName) {
					var _cards = [];
					for (var i in cards) {
						if (cards[i].name == cardName) {
							_cards.push(cards[i]);
						}
					}
					return _cards;
				};

				this.Card = function (cardName) {
					return this.getCardsByName(cardName)[0];
				};

				this.Pop = function (count, clearParent) {

					if (cards.length < count) return false;

					var _deck = [];
					for (; count; count -= 1) {
						var _pop = cards.pop();
						if (clearParent) _pop.parent = null;
						// console.log('POP:', _pop)
						_deck.push(_pop);
						_deck[_deck.length - 1].parent = null;
					}
					_deck.reverse();

					// что делать если вынули все карты
					if (autoHide && cards.length == 0) {
						this.hide();
					}

					this.Redraw();

					return _deck;
				};

				this.Push = function (deck) {
					// , parentName) {
					for (var i in deck) {
						deck[i].parent = id;
						// console.log('PUSH:', deck[i], id);
						cards.push(deck[i]);
					}
				};

				this.clear = function () {
					for (var i in cards) {
						main.event.dispatch('removeEl', cards[i]);
						cards[i] = null;
					}
					cards = [];
					main.event.dispatch('removeEl', this);
				};

				// Fill deck
				// заполняет карты в порядке добавления
				this.Fill = function (cardNames) {

					for (var i in cardNames) {
						this.genCardByName(cardNames[i]);
					}
				};
			}(a);

			// fill deck
			if (a.fill) {
				for (var i in a.fill) {
					if (typeof a.fill[i] == 'string') {
						_el_deck.genCardByName(a.fill[i]);
					}
				}
			}

			share.elements[_id] = _el_deck;
			return _el_deck;
		}; //.bind(main);

		main.Deck = function (name, groupName) {
			var _decks = this.getElementsByName(name, 'deck');
			if (groupName && typeof groupName == 'string') {
				for (var i in _decks) {
					var _group = this.getElementById(_gecks[i].parent());
					if (_group && _group.name && _group.name == groupName) {
						return _decks[i];
					}
				}
				return false;
			} else {
				return _decks[0];
			}
		}.bind(main);

		// Get all decks

		main.getDecks = function (a) {

			// console.log('getDecks', a)

			var _decks = {};
			for (var d in share.elements) {
				if (share.elements[d].type == 'deck') {
					// console.log(share.elements[d].name, share.elements[d].visible)
					if (a && a.visible) {
						if (share.elements[d].visible) {
							_decks[d] = share.elements[d];
						}
					} else {
						_decks[d] = share.elements[d];
					}
				}
			}
			return _decks;
		}.bind(main);

		main.getDeckById = function (id) {
			// ID
			for (var d in share.elements) {
				if (share.elements[d].type == 'deck' && d == id) {
					return share.elements[d];
				}
			}
			return null;
		}.bind(main);

		share.deckCardNames = function (a) {

			var _deck = [];
			for (var i in a) {
				if (a[i].card && a[i].card.name) {
					_deck.push(a[i].card.name);
				} else if (a[i].name) {
					_deck.push(a[i].name);
				}
			}
			return _deck;
		};

		return addDeck(data);
	};

	var _flipTypes = __webpack_require__(9);

	var _flipTypes2 = _interopRequireDefault(_flipTypes);

	var _readyPutRules = __webpack_require__(10);

	var _readyPutRules2 = _interopRequireDefault(_readyPutRules);

	var _readyTakeRules = __webpack_require__(11);

	var _readyTakeRules2 = _interopRequireDefault(_readyTakeRules);

	var _fillRules = __webpack_require__(12);

	var _fillRules2 = _interopRequireDefault(_fillRules);

	var _paddingTypes = __webpack_require__(13);

	var _paddingTypes2 = _interopRequireDefault(_paddingTypes);

	var _addDeckAction = __webpack_require__(14);

	var _addDeckAction2 = _interopRequireDefault(_addDeckAction);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		;

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		none: function none(card, i, length) {
			card.flip = false;
		},
		all: function all(card, i, length) {
			card.flip = true;
		},
		notlast: function notlast(card, i, length) {
			card.flip = i < length - 1 ? true : false;
		},
		first_1: function first_1(card, i, length) {
			card.flip = i < 1 ? true : false;
		},
		first_2: function first_2(card, i, length) {
			card.flip = i < 2 ? true : false;
		},
		first_3: function first_3(card, i, length) {
			card.flip = i < 3 ? true : false;
		}
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		var rpr = {

			// Internal use
			_downupcards: function _downupcards(a) {
				// if(a.cards.length == 0) return false;
				var down = share.validateCardName(a.cards[a.cards.length - 1].name),
				    up = share.validateCardName(a.putDeck[0].card.name);
				if (!down || !up) return false;
				return {
					up: up,
					down: down
				};
			},

			_downupranknum: function _downupranknum(a) {
				var du = rpr._downupcards(a);
				return du ? {
					down: share.cardsRankS.indexOf(du.down.rank),
					up: share.cardsRankS.indexOf(du.up.rank)
				} : false;
			},

			_isFirst: function _isFirst(a, _name) {
				if (a.cards.length == 0) {
					var _validate = null;
					return (_validate = share.validateCardName(a.putDeck[0].card.name)) && _validate.rank == _name;
				}
				return true;
			},

			// Rules

			striped: function striped(a) {
				if (a.cards.length == 0) return true;

				var color_A = share.validateCardName(a.cards[a.cards.length - 1].name).color,
				    color_B = null;

				var _validate = null;
				if (_validate = share.validateCardName(a.putDeck[0].card.name)) {
					color_B = _validate.color;
				}

				return color_A != color_B;
				// return true;
			},

			firstAce: function firstAce(a) {
				return rpr._isFirst(a, "1");
			},

			firstKing: function firstKing(a) {
				return rpr._isFirst(a, "k");
			},

			notForEmpty: function notForEmpty(a) {
				return a.cards.length;
			},

			oneRank: function oneRank(a) {
				if (a.cards.length == 0) return true;
				var du = rpr._downupcards(a);
				return du && du.up.suit == du.down.suit;
			},

			any: function any(a) {
				return true;
			},

			not: function not(a) {
				return false;
			},

			ascendDeck: function ascendDeck(a) {
				//ascend deck by step

				if (a.putDeck.length == 1) return true;

				var ruleCorrect = true;
				for (var i in a.putDeck) {
					if (i > 0) {
						var down = share.cardsRankS.indexOf(share.validateCardName(a.putDeck[i - 1].card.name).rank),
						    up = share.cardsRankS.indexOf(share.validateCardName(a.putDeck[i].card.name).rank);

						ruleCorrect = ruleCorrect && 1 + down == up;
					}
				}
				return ruleCorrect;
			},

			descendDeck: function descendDeck(a) {
				//ascend deck by step

				if (a.putDeck.length == 1) return true;

				var ruleCorrect = true;
				for (var i in a.putDeck) {
					if (i > 0) {
						var down = share.cardsRankS.indexOf(share.validateCardName(a.putDeck[i - 1].card.name).rank),
						    up = share.cardsRankS.indexOf(share.validateCardName(a.putDeck[i].card.name).rank);

						ruleCorrect = ruleCorrect && down == 1 + up;
					}
				}
				return ruleCorrect;
			},

			oneRankDeck: function oneRankDeck(a) {

				if (a.putDeck.length == 1) return true;

				var ruleCorrect = true;
				for (var i in a.putDeck) {
					if (i > 0) {
						var down = share.validateCardName(a.putDeck[i - 1].card.name).suit,
						    up = share.validateCardName(a.putDeck[i].card.name).suit;

						ruleCorrect = ruleCorrect && down == up;
					}
				}
				return ruleCorrect;
			},

			ascend: function ascend(a) {

				// пустая стопка - любая карта
				if (a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && da.down < da.up;
			},

			descent: function descent(a) {

				// пустая стопка - любая карта
				if (a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && da.down > da.up;
			},

			descentOne: function descentOne(a) {
				// one step

				// пустая стопка - любая карта
				if (a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && da.down == 1 + da.up;
			},

			ascendOne: function ascendOne(a) {
				// one step

				// пустая стопка - любая карта
				if (a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && 1 + da.down == da.up;
			},

			ascdescOne: function ascdescOne(a) {

				// пустая стопка - любая карта
				if (a.cards.length == 0) return true;

				var da = rpr._downupranknum(a);
				return da && Math.abs(da.down - da.up) == 1;
			}

		};

		return rpr;
	};

		;

/***/ },
/* 11 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {

		// SimpleRules
		not: function not(a) {
			return false;
		},
		notFirst: function notFirst(a) {
			// console.log('notFirst:', a.cardIndex);
			return a.cardIndex > 0;
		},
		any: function any(a) {
			return true;
		},
		onlytop: function onlytop(a) {
			return a.cardIndex == a.deckLength - 1;
		},
		// TODO rules
		sample: function sample(a) {}
	};

/***/ },
/* 12 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		return {
			deckLength: function deckLength(a) {
				return share.cardsRank.length <= a.deck.getCards().length;
			},
			not: function not() {
				// console.log('NOT FILL RULES');
				return false;
			}
		};
	};

		;

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		none: function none(params, card, index, length, deck) {
			return { x: params.x, y: params.y };
		},
		last_three_min: function last_three_min(params, card, index, length, deck) {
			if (index > length - 3) {
				if (length > 3) {
					return {
						x: params.x - (length - 3 - index) * 2,
						y: params.y - (length - 3 - index)
					};
				} else {
					return {
						x: params.x + index * 2,
						y: params.y + (index | 0)
					};
				}
			} else {
				return { x: x, y: y };
			}
		},
		twindeck_typeA: function twindeck_typeA(params, card, index, length, deck) {

			var twindeck_max_cards = 24,
			    twindeck_deck_length = 3;

			var _padding = {
				x: 2,
				y: 1
			};

			var _depth = length / twindeck_max_cards * twindeck_deck_length | 0;
			if (_depth >= twindeck_deck_length) _depth = twindeck_deck_length - 1;

			var _plus = index - (length - _depth - 1);
			if (_plus < 0) _plus = 0;

			return {
				x: params.x + _padding.x * _plus,
				y: params.y + _padding.y * _plus
			};
		},
		radial: function radial(params, card, index, length, deck) {

			//              b
			//       C  ..`:   A = sin(b) * C
			//     ...``   :B  B = cos(b) * C
			// a.``.......+:
			//        A     y 90deg
			var _depth = 1,
			    _radius = index * _depth,
			    _step = 180 / 16,
			    _card = SolitaireEngine.options.card,
			    _angle = params.rotate,
			    //_step / 2 + 270;
			_deg = Math.PI / 180,
			    _a = Math.sin(_angle * _deg) * _radius,
			    _b = Math.cos(_angle * _deg) * _radius;
			// if(_angle > 360) _angle -= 360;
			return {
				x: params.x + _a, // - _card.width  / 2,
				y: params.y - _b // - _card.height / 2
			};
			// console.log('radial:', params, card, index, length, deck);
		},
		special: function special(params, card, index, length, deck) {
			var _y = params.y,
			    _x = params.x;
			for (var i = 0; i < index; i += 1) {
				_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
				_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
			}
			return { x: _x, y: _y };
		},
		vertical: function vertical(params, card, index, length, deck) {
			var _y = params.y;
			for (var i = 0; i < index; i += 1) {
				_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
			}var _return = {
				x: params.x,
				y: _y
			};
			// console.log('vertical:', deck.length, index, _return);
			return _return;
		},
		horizontal: function horizontal(params, card, index, length, deck) {
			var _x = params.x;
			for (var i = 0; i < index; i += 1) {
				_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
			}var _return = {
				x: _x,
				y: params.y
			};
			// console.log('horizontal:', deck.length, index, _return);
			return _return;
		}
	};

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		var deckActions = {

			"testDeckAction": function testDeckAction() {
				// TODO
			},

			"twindeck": function twindeck(e) {

				// console.log("twindeck action:", e);
				if (e.deck_from.iteration == 0) {
					return;
				}

				var deck_to = main.Deck(e.data.to);

				var moveCardsCount = e.data.count && typeof e.data.count == 'number' ? e.data.count : share.default_twindeck_move_card_count;

				// количество оставшихся карт в первой колоде
				var deckFromCardsCount = e.deck_from.getCards().length;

				if (deckFromCardsCount < moveCardsCount) {
					moveCardsCount = deckFromCardsCount;
				}

				// инициализация
				if (typeof e.deck_from.iteration == 'undefined') {
					// "-1" - infinity
					e.deck_from.iteration = -1;
					e.deck_from.twindeck = [];
				}

				// количество циклов перелистываний сначало до конца
				if (e.iterations && e.deck_from.iteration < 0) {
					e.deck_from.iteration = e.iterations;
				}

				deck_to.hideCards();

				var _deck = deck_to.Pop(deck_to.getCards().length);

				// Step
				share.oneStepWay.twindeck = {};
				share.oneStepWay.twindeck.toHide = share.deckCardNames(_deck);

				_deck.reverse();
				for (var i in _deck) {
					e.deck_from.twindeck.unshift(_deck[i]);
				}

				// первая колода пуста
				if (e.deck_from.twindeck && e.deck_from.twindeck.length && deckFromCardsCount == 0 && e.deck_from.iteration != 0) {
					// e.deck_from.twindeck.reverse();
					e.deck_from.Push(e.deck_from.twindeck);
					e.deck_from.twindeck = []; // unshift
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
				deck_to.flipCheck();

				e.deck_from.Redraw();
				deck_to.Redraw();

				// ------------ STEP ------------
				share.oneStepWay.twindeck.from = e.deck_from.name, share.oneStepWay.twindeck.to = deck_to.name, share.oneStepWay.twindeck.moveCards = share.deckCardNames(_deck), share.oneStepWay.twindeck.iteration = e.deck_from.iteration | 0;

				// hiddenCards : share.deckCardNames(e.deck_from.twindeck),
				// cards       : share.deckCardNames(e.deck_from.getCards()),

				if (typeof share.undoMethods == "undefined") {
					share.undoMethods = {};
				}

				// History extension
				share.undoMethods.twindeck = function (a) {
					if (a.twindeck) {

						var _deck_from = main.Deck(a.twindeck.from),
						    _deck_to = main.Deck(a.twindeck.to);

						// TODO
						// deck_to cards [moveCards] -> deck_from
						var _moveDeck = _deck_to.Pop(a.twindeck.moveCards.length);
						if (_moveDeck.length) {
							console.log('push#0', _moveDeck);
							_deck_from.Push(_moveDeck);
						}

						// deck_from.twindeck cards [toHide]  -> deck_to
						var _twindeck = [];
						for (var i in a.twindeck.toHide) {
							if (_deck_from.twindeck.length) {
								_twindeck.push(_deck_from.twindeck.pop());
							}
						}
						_twindeck.reverse();

						console.log('_deck_from.twindeck:', _deck_from.twindeck);
						console.log('a.twindeck.toHide:', a.twindeck.toHide);
						console.log('_twindeck:', _twindeck);

						if (_twindeck.length) {
							console.log('push#1');
							_deck_to.Push(_twindeck);
						}

						_deck_to.showCards();

						_deck_from.flipCheck();

						_deck_from.Redraw();
						_deck_to.Redraw();

						console.log('twindeck undo:', a.twindeck, share.deckCardNames(_deck_from.twindeck));
					}
				};

				share.redoMethods.twindeck = function (a) {
					if (a.twindeck) {
						console.log('twindeck redo:', a.twindeck);
					}
				};

				main.event.dispatch('makeStep', share.oneStepWay);
				// ------------------------------

				share.checkTips();

				e.deck_from.iteration -= 1;
			}
		};

		main.event.listen('runDeckActions', function (e) {
			// console.log('runDeckActios:', e.deck);
			for (var actionName in e.deck.actions) {
				if (deckActions[actionName]) {
					deckActions[actionName]({
						deck_from: e.deck,
						data: e.deck.actions[actionName]
					});
				}
			}
		});

		main.event.listen('runDeckAction', function (e) {
			if (e.name && typeof deckActions[e.name] == 'string' /* && e.data*/) {
					deckActions[e.name](e.data);
				}
		});

		main.event.listen('addDeckAction', function (e) {
			console.log(deckActions);
			if (e.name && e.callback) deckActions[e.name] = e.callback;
		});

		return deckActions;
	};

		;

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {

		allToAll: function allToAll(a) {
			var _moves = [];
			// each decks
			for (var deckIndex in a.decks) {
				var _cards = a.decks[deckIndex].getCards();
				// each cards in  current deck
				for (var cardIndex in _cards) {
					var _id = _cards[cardIndex].id;
					// check can take this card/deck
					var _take = a.decks[deckIndex].Take(_id);
					if (_take) {
						// check put taked card/deck iinto another decks
						for (var deckIndex_2 in a.decks) {
							// ...all without current
							if (deckIndex != deckIndex_2) {
								var _put = a.decks[deckIndex_2].Put(_take);
								if (_put) {
									var _cards_to = a.decks[deckIndex_2].getCards(),
									    _card_to = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
									// console.log('Tip:', a.decks[deckIndex_2].domElement/*_cards[cardIndex].name, 'from', a.decks[deckIndex].name, a.decks[deckIndex].visible, 'to', a.decks[deckIndex_2].name*/)
									_moves.push({
										from: {
											deck: a.decks[deckIndex],
											card: _cards[cardIndex]
										},
										to: {
											deck: a.decks[deckIndex_2],
											lastCard: _card_to
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
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		main.event.listen('initField', function (e) {

			// console.log('initField', e);

			// share.zz = 9;

			var domElement = e.a.field ? e.a.field : '#mat'; // default;
			if (typeof domElement == 'string') {
				if (domElement.split('.').length == 2) {
					domElement = document.getElementsByClassName(domElement.split('.')[1])[0];
				} else if (domElement.split('#').length == 2) {
					domElement = document.getElementById(domElement.split('#')[1]);
				} else {
					domElement = document.getElementsByTagName(domElement);
				}
				if (!domElement) {
					domElement = document.getElementById('mat');
				}
			};
			// share.field = e.field;
			share.field.domElement = domElement;

			var _params = {};

			if (e.a.width && typeof e.a.width == 'number') _params.width = share.zoom * e.a.width + 'px';
			if (e.a.height && typeof e.a.height == 'number') _params.height = share.zoom * e.a.height + 'px';
			if (e.a.top && typeof e.a.top == 'number') _params.top = share.zoom * e.a.top + 'px';
			if (e.a.left && typeof e.a.left == 'number') _params.left = share.zoom * e.a.left + 'px';
			// if(a.rotate && typeof a.rotate == 'number') _params.transform = 'rotate(' + (a.rotate|0) + 'deg)';

			var theme = e.a.theme && typeof e.a.theme == 'string' ? e.a.theme : share.default_theme; // TODO (theme from config)

			$(domElement).css(_params).addClass('field').addClass(theme);
		});

		var applyChangedParameters = function applyChangedParameters(p, a, deck) {

			// console.log('applyChangedParameters', a);

			p.x = a.position && a.position.x && typeof a.position.x == 'number' ? a.position.x : 0, p.y = a.position && a.position.y && typeof a.position.y == 'number' ? a.position.y : 0;
			p.x = a.parentPosition && a.parentPosition.x ? p.x + a.parentPosition.x : p.x;
			p.y = a.parentPosition && a.parentPosition.y ? p.y + a.parentPosition.y : p.y;

			deck.rotate = p.rotate = a.rotate && typeof a.rotate == 'number' ? a.rotate : 0;

			// у padding_x, padding_y приоритет выше чем paddingType

			p.padding_y = a.paddingY && typeof a.paddingY == 'number' ? a.paddingY : a.paddingType ? share.default_padding_y : 0, p.padding_x = a.paddingX && typeof a.paddingX == 'number' ? a.paddingX : a.paddingType ? share.default_padding_x : 0, p.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' ? a.flipPaddingY : a.paddingType ? share.default_flip_padding_y : 0, p.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' ? a.flipPaddingX : a.paddingType ? share.default_flip_padding_x : 0;
		};

		main.event.listen('hideCard', function (e) {

			// console.log('hideCard:', e);
			if (e && e.domElement) {
				$(e.domElement).hide();
			}
		});

		main.event.listen('showCard', function (e) {

			// console.log('showCard:', e);
			if (e && e.domElement) {
				$(e.domElement).show();
			}
		});

		main.event.listen('addDeckEl', function (e) {

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
				left: share.zoom * e.params.x + 'px',
				top: share.zoom * e.params.y + 'px',
				width: share.zoom * share.card.width + 'px',
				height: share.zoom * share.card.height + 'px',
				transform: 'rotate(' + (e.params.rotate | 0) + 'deg)'
			};

			_params.display = e.deck.visible ? 'block' : 'none';

			$(e.deck.domElement).css(_params).addClass('el').attr({ id: e.deck.getId() });

			// var showSlot = e.a.showSlot && typeof e.a.showSlot == 'boolean' ? e.a.showSlot : share.default_showSlot;
			// if(showSlot) $(e.deck.domElement).addClass('slot');
			// console.log('slot', e.a);
			if (e.a.showSlot) $(e.deck.domElement).addClass('slot');
			if (e.a.class) $(e.deck.domElement).addClass(e.a.class);

			$(share.field.domElement).append(e.deck.domElement);

			// add label

			var label = e.a.label && typeof e.a.label == 'string' ? e.a.label : null;

			if (!e.a.label && share.debugLabels) {
				label = '<span style="color:#65B0FF;">' + e.deck.name + '</span>';
			}

			if (label) {
				var _labelElement = $('<div>').addClass('deckLabel')
				// DEBUG, TODO remove next string
				.attr({ "title": e.deck.getId() + " (" + e.deck.parent() + ")" });
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

		main.event.listen('showTip', function (e) {
			// console.log('showTip', e);
			if (e && e.el && e.el.domElement && e.type) {
				$(e.el.domElement).addClass(e.type);
			}
		});

		main.event.listen('hideTips', function (e) {
			// console.log('hideTips', e);
			if (e && e.types) {
				for (var i in e.types) {
					var typeName = e.types[i];
					$('.' + typeName).removeClass(typeName);
				}
			} else {
				for (var i in share.tipTypes) {
					var typeName = share.tipTypes[i];
					$('.' + typeName).removeClass(typeName);
				}
			}
		});

		main.event.listen('removeEl', function (e) {
			$(e.domElement).remove();
		});

		main.event.listen('redrawDeck', function (e) {

			if (e.a) {
				applyChangedParameters(e.params, e.a, e.deck);

				if (e.a.paddingX) share.padding_x = e.a.paddingX;
				if (e.a.flipPaddingX) share.flip_padding_x = e.a.flipPaddingX;
				if (e.a.paddingY) share.padding_y = e.a.paddingY;
				if (e.a.flipPaddingY) share.flip_padding_y = e.a.flipPaddingY;
			}

			var _params = {
				left: share.zoom * e.params.x,
				top: share.zoom * e.params.y,
				transform: 'rotate(' + (e.params.rotate | 0) + 'deg)'
			};

			_params.display = e.deck.visible ? 'block' : 'none';

			$(e.deck.domElement).css(_params);

			for (var i in e.cards) {
				var _card_position = e.deck.padding(i);
				var _params = {
					left: share.zoom * _card_position.x + 'px',
					top: share.zoom * _card_position.y + 'px',
					zIndex: e.params.startZIndex + (i | 0),
					'-ms-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)',
					'-webkit-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)',
					'-webkit-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)',
					'-moz-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)'
				};
				// transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
				_params.display = e.deck.visible ? 'block' : 'none';

				// e.deck.checkFlip(e.cards[i], i|0, e.cards.length|0);

				if (e.cards[i].flip) {
					$(e.cards[i].domElement).addClass('flip');
				} else {
					$(e.cards[i].domElement).removeClass('flip');
				}
				$(e.cards[i].domElement).css(_params);
			}
		});

		main.event.listen('addCardEl', function (e) {

			// console.log('addCardEl', e);

			e.domElement = $('<div>').addClass('el card draggable').addClass(e.name);
			var _params = {
				width: share.zoom * share.card.width + 'px',
				height: share.zoom * share.card.height + 'px'
			};
			$(e.domElement).css(_params).attr({ id: e.id });
			$(share.field.domElement).append(e.domElement);
		});

		main.event.listen('moveDragDeck', function (e) {
			// console.log('moveDragDeck', e);
			share.curLock();
			for (var i in e.moveDeck) {
				var _position = e.destination.padding(e.destination.getCards().length - 1 + (i | 0));
				// e.destination.padding(e.moveDeck[i].index);
				var _params = {
					left: share.zoom * _position.x + 'px',
					top: share.zoom * _position.y + 'px'
				};
				// transform : 'rotate(0deg)'
				var a = e.departure.rotate,
				    b = e.destination.rotate;
				if (Math.abs(a - b) > 180) if (a > b) {
					a = a - 360;
				} else {
					b = b - 360;
				};
				// console.log('rotate', a, b)
				$({ deg: a, e: e }).animate({ deg: b }, {
					duration: share.animationTime,
					step: function (now) {
						$(this).css({
							'-ms-transform': 'rotate(' + now + 'deg)',
							'-webkit-transform': 'rotate(' + now + 'deg)',
							'-webkit-transform': 'rotate(' + now + 'deg)',
							'-moz-transform': 'rotate(' + now + 'deg)'
						});
					}. // transform: 'rotate(' + now + 'deg)',
					bind(e.moveDeck[i].card.domElement)
				});
				$(e.moveDeck[i].card.domElement).animate(_params, share.animationTime, function () {
					e.departure.Redraw();
					e.destination.Redraw();
				});
			}
			$('.draggable').promise().done(function () {
				share.curUnLock();
				main.event.dispatch('moveDragDeckDone', { deck: e.destination });
			});
		});

		main.event.listen('moveCardToHome', function (e) {
			//  Move card home
			// console.log('Move card home', e);
			share.curLock();
			for (var i in e.moveDeck) {
				var _position = e.departure.padding(e.moveDeck[i].index);
				var _params = {
					left: _position.x + 'px',
					top: _position.y + 'px'
				};
				$(e.moveDeck[i].card.domElement).animate(_params, share.animationTime);
			}
			$('.draggable').promise().done(function () {
				share.curUnLock();
			});

			$('.draggable').promise().done(function () {

				// console.log(_deck_departure, _deck_destination);
				if (e.departure) {
					e.departure.Redraw();
				}
				/*if(_deck_destination) {
	   	_deck_destination.Redraw();
	   }*/
			});
		});

		main.event.listen('moveDragDeckDone', function (e) {

			if (!e.deck.fill) return;

			var _deck = e.deck.getCards();
			for (var i in _deck) {
				$(_deck[i].domElement).addClass('fill');
			}
		});
	};

		;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		(0, _forceMove2.default)(main, share);

		share.undoMethods = {};
		share.redoMethods = {};

		main.event.listen('undo', function (a) {

			// console.log('forceMove undo:', share.undoMethods);

			if (!a) return;

			for (var i in share.undoMethods) {
				// console.log(i);
				share.undoMethods[i](a);
			}

			// if(a.flip) {
			// };

			if (a.unflip) {
				if (typeof a.unflip.deck == "string" && typeof a.unflip.card != "undefined" && typeof a.unflip.card.name == "string" && typeof a.unflip.card.index != "undefined") {
					var _deck = main.Deck(a.unflip.deck),
					    _cards = _deck ? _deck.getCards() : [];
					if (_cards[a.unflip.card.index].name == a.unflip.card.name) {
						_cards[a.unflip.card.index].flip = true;
					}
				}
			};

			if (a.fill) {
				// TODO
			};

			// if(!a || !a.move) return;
			if (typeof a.move != "undefined" && typeof a.move.from != "undefined" && typeof a.move.to != "undefined" && typeof a.move.deck != "undefined") {
				share.forceMove({
					from: a.move.to,
					to: a.move.from,
					deck: a.move.deck
				});
			}
		});

		main.event.listen('redo', function (a) {

			// console.log('forceMove redo:', share.redoMethods);

			if (!a) return;

			for (var i in share.redoMethods) {
				share.redoMethods[i](a);
			}

			// if(a.flip) {
			// };

			if (a.unflip) {
				if (typeof a.unflip.deck == "string" && typeof a.unflip.card != "undefined" && typeof a.unflip.card.name == "string" && typeof a.unflip.card.index != "undefined") {
					var _deck = main.Deck(a.unflip.deck),
					    _cards = _deck ? _deck.getCards() : [];
					if (_cards[a.unflip.card.index].name == a.unflip.card.name) {
						_cards[a.unflip.card.index].flip = false;
					}
				}
			};

			if (a.fill) {
				// TODO
			};

			if (!a || !a.move) return;
			if (typeof a.move.from != "undefined" && typeof a.move.to != "undefined" && typeof a.move.deck != "undefined") {
				share.forceMove({
					from: a.move.from,
					to: a.move.to,
					deck: a.move.deck
				});
			}
		});
	};

	var _forceMove = __webpack_require__(23);

	var _forceMove2 = _interopRequireDefault(_forceMove);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		(0, _bestTip2.default)(main, share);

		share.tipTypes = ['tip', 'tipTo', 'tipPriority'];

		main.showTips = function () {

			// console.log('main.showTips');
			share.showTips = true;
			share.checkTips();
		}.bind(main);

		main.hideTips = function () {

			// console.log('main.hideTips');
			share.showTips = false;
			share.checkTips();
		}.bind(main);

		share.checkTips = function (a) {

			// console.log('share.checkTips');

			share.Tips = [];

			// $('.tip')        .removeClass('tip');
			// $('.tipTo')      .removeClass('tipTo');
			// $('.tipPriority').removeClass('tipPriority');
			main.event.dispatch('hideTips');

			// console.log('share.checkTips')

			var _decks = this.getDecks({ visible: true });

			// for(i in _all_decks) {
			// 	if(_all_decks[i].visible) {
			// 		_decks.push(_all_decks[i])
			// 	}
			// }

			// var tips = share.autoTips()
			if (typeof share.autoTips == 'function') {
				share.Tips = share.autoTips({
					decks: _decks
				});
			} else {
				for (i in share.autoTips) {
					if (typeof share.autoTips[i] == 'function') {
						share.Tips = share.Tips.concat(share.autoTips[i]({
							decks: _decks
						}));
					} else {
						if (_tipsRules2.default[i]) {
							share.Tips = share.Tips.concat(_tipsRules2.default[i]({
								decks: _decks,
								rules: share.autoTips[i]
							}));
						}
					}
				}
			}
			if (share.showTips) {

				// console.log('share.showTips', share.Tips, share.homeGroups);

				for (var i in share.Tips) {

					// TODO инициализировать "hideTipsInDom" в Field.js

					// console.log('PARENT IS:', share.Tips[i].from.deck.parent());

					// if(share.hideTipsInDom &&  share.homeGroups && share.homeGroups.indexOf(share.Tips[i].from.deck.parent()) >= 0) {
					if (share.homeGroups && share.homeGroups.indexOf(share.Tips[i].from.deck.parent()) >= 0) {
						// ?#$%&!
					} else {
							// $(share.Tips[i].from.card.domElement).addClass('tip');
							main.event.dispatch('showTip', { el: share.Tips[i].from.card, type: 'tip' });
						}
				}
			}
		}.bind(main);

		main.tipsMove = function (a) {

			if (!share.showTipPriority) return;

			// $('.tipPriority').removeClass('tipPriority');
			main.event.dispatch('hideTips', { types: ['tipPriority'] });

			// console.log('tipsMove', a, share.showTipPriority);

			if (share.showTipPriority && a && a.moveDeck && a.cursorMove && a.cursorMove.distance && a.cursorMove.distance >= share.moveDistance) {

				var Tip = share.bestTip(a.moveDeck, a.cursorMove);

				if (Tip) {

					main.event.dispatch('showTip', { el: Tip.to.deck, type: 'tipPriority' });
					// TODO: 'i' - undefined
					// main.event.dispatch('showTip', {el : share.Tips[i].to.deck, type : 'tipPriority'});

					// $(Tip.to.lastCard.domElement).addClass('tipPriority');
				}
			}
		}.bind(main);

		main.tipsDestination = function (a) {

			// console.log('tipsDestination', a)

			// if(share.showTips && share.showTipsDestination) {
			if (share.showTipsDestination) {

				// $('.tip')        .removeClass('tip');
				// $('.tipTo')      .removeClass('tipTo');
				// $('.tipPriority').removeClass('tipPriority');

				// main.event.dispatch('hideTips', {types : ['tip']});
				main.event.dispatch('hideTips');

				// try {
				// 	if(a && a.currentCard && $(a.currentCard)) {
				// 		$(a.currentCard).addClass('tip');
				// 	}
				// } catch(e) {}

				if (a && a.currentCard && a.currentCard.id) {
					for (var i in share.Tips) {
						if (share.Tips[i].from.card.id == a.currentCard.id) {

							// var _cards = share.Tips[i].to.deck.getCards(),
							// _card  = _cards[_cards.length - 1];

							main.event.dispatch('showTip', { el: share.Tips[i].to.deck, type: 'tipTo' });

							// if(share.Tips[i].to.lastCard) {
							// 	$(share.Tips[i].to.lastCard.domElement).addClass('tipTo');
							// } else {
							// 	try {
							// 		$(share.Tips[i].to.deck.getDomElement()).addClass('tipTo');
							// 	} catch(e) {
							// 		console.warn('#1', e, share.Tips[i]);
							// 	}
							// }

							// $(share.Tips[i].to.lastCard.domElement).addClass('tipTo');
						}
					}
				}
			}
		}.bind(main);
	};

	var _tipsRules = __webpack_require__(15);

	var _tipsRules2 = _interopRequireDefault(_tipsRules);

	var _bestTip = __webpack_require__(19);

	var _bestTip2 = _interopRequireDefault(_bestTip);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

		;

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		share.bestTip = function (moveDeck, cursorMove) {

			var _autoTips = [];
			for (i in share.Tips) {
				if (share.Tips[i].from.card.id == moveDeck[0].card.id) {
					_autoTips.push(share.Tips[i]);
				}
			}

			if (_autoTips.length == 0) {
				return false;
			}

			// move card to closest deck of a possible move

			var _min_distance = -1,
			    _tip_index = 0,
			    _in_direction_count = 0;

			if (share.homeGroups) {
				var _tips = [];
				for (var i in share.homeGroups) {
					for (var t in _autoTips) {
						if (_autoTips[t].to.deck.parent() == share.homeGroups[i]) {
							_tips.push(_autoTips[t]);
						}
					}
				}
				if (_tips.length) _autoTips = _tips;
			}

			if (_autoTips.length >= 2) {

				for (var i in _autoTips) {

					var center_from = {
						x: cursorMove.deckPosition.x + share.card.width * share.zoom,
						y: cursorMove.deckPosition.y + share.card.height * share.zoom
					};

					var _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.getCards().length);
					var center_to = {
						x: _destination_deck_last_card_position.x + share.card.width * share.zoom,
						y: _destination_deck_last_card_position.y + share.card.height * share.zoom
					};

					_autoTips[i].distance = Math.sqrt(Math.sqr(center_from.x - center_to.x) + Math.sqr(center_from.y - center_to.y));
					_autoTips[i].inDirection = false;
					if (cursorMove.direction.x > 0 && center_to.x > center_from.x || cursorMove.direction.x < 0 && center_to.x < center_from.x) {
						_autoTips[i].inDirection = true;
						_in_direction_count += 1;
					}
					// || (cursorMove.direction.y > 0 && center_to.y > center_from.y)
					// || (cursorMove.direction.y < 0 && center_to.y < center_from.y);
				}
	
				// console.log(_in_direction_count, _autoTips);

				for (var i in _autoTips) {

					if (_min_distance == '-1') {
						if (_in_direction_count == 0) {
							_min_distance = _autoTips[i].distance;
						} else {
							if (_autoTips[i].inDirection == true) {
								_min_distance = _autoTips[i].distance;
								_tip_index = i;
							}
						}
					}

					if (_autoTips[i].distance < _min_distance) {
						if (_in_direction_count == 0) {
							_min_distance = _autoTips[i].distance;
							_tip_index = i;
						} else {
							if (_autoTips[i].inDirection == true) {
								_min_distance = _autoTips[i].distance;
								_tip_index = i;
							}
						}
					}
				}
			}

			// console.log('Tip for current card:', _autoTips[_tip_index], 'from:', _autoTips.length, _autoTips[_tip_index].to.deck.getDomElement()[0].id);

			return _autoTips[_tip_index];
		};
	};

		;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		main.Move = function (moveDeck, to, cursorMove) {

			var _deck_destination = null,
			    // to
			_deck_departure = null; // from
			var _success = true;

			_success = _success && to;

			var _el = to && to.id && this.getElementById(to.id);

			if (_el) {

				if (_el.type == 'card') {
					_deck_destination = this.getElementById(_el.parent);
				} else if (_el.type == 'deck') {
					_deck_destination = _el;
				}
			}

			_success = _success && _deck_destination;

			_deck_departure = moveDeck[0].card.parent && this.getElementById(moveDeck[0].card.parent);
			// console.log('DROP:', _dop.id, _deck_destination);
			_success = _success && _deck_departure;

			if (_deck_destination && _deck_destination.getId() != _deck_departure.getId()) {

				var _put = _deck_destination.Put(moveDeck);
				_success = _success && _put;

				if (_put && _deck_departure) {

					var _pop = _deck_departure.Pop(moveDeck.length);

					// console.log('MOVE', _deck_departure, _deck_departure.Pop, moveDeck.length);

					_success = _success && _pop;

					if (_pop) {

						// положили в колоду
						// без анимации, просто перерисовка обеих колод

						_deck_destination.Push(_pop);

						main.event.dispatch('moveDragDeck', {
							departure: _deck_departure,
							destination: _deck_destination,
							moveDeck: moveDeck
						});

						// _deck_departure  .Redraw();
						// _deck_destination.Redraw();

						share.oneStepWay.move = {
							from: _deck_departure.name,
							to: _deck_destination.name,
							deck: share.deckCardNames(moveDeck)
						};

						var _deck = _deck_departure.getCards();
						if (_deck.length && _deck[_deck.length - 1].flip == true) {
							_deck[_deck.length - 1].flip = false;
							share.oneStepWay.unflip = {
								deck: _deck_departure.name,
								card: {
									name: _deck[_deck.length - 1].name,
									index: _deck.length - 1
								}
							};
						}

						this.event.dispatch('makeStep', share.oneStepWay);

						// saveStep();

						// afterStep();

						this.winCheck({ show: true });
					}
				}
				// A Pop()
				// B Push()
				// A, B Redraw()
			} else {
					_success = false;
				}

			// если не кдалось положить карты, вернуть обратно

			if (!_success && _deck_departure) {

				if (cursorMove.distance >= share.moveDistance) {

					var Tip = share.bestTip(moveDeck, cursorMove);

					if (Tip) {
						this.Move(moveDeck, Tip.to.deck.domElement, cursorMove);
					} else {
						main.event.dispatch('moveCardToHome', {
							moveDeck: moveDeck,
							departure: _deck_departure
						});
						// share.moveCardToHome();
					}
				} else {
						main.event.dispatch('moveCardToHome', {
							moveDeck: moveDeck,
							departure: _deck_departure
						});
						// share.moveCardToHome(moveDeck, _deck_departure);
					}
			}

			if (_success) {

				// afterMove();
				share.checkTips();
			}
		}.bind(main);
	};

		;

/***/ },
/* 21 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		var wcm = share.winCheckMethods = {
			// Filters

			// возвращает колоды определённой группы/групп
			group: function group(a) {
				if (!a.filter) return false;
				var _decks = [];
				for (var _i in a.decks) {

					// console.log('group filter:', _i, a.decks[_i].parent(), a.filterArgs);
					// var _parent = a.decks[_i].parent()
					// if(a.filterArgs.indexOf(a.decks[_i].parent())) {
					if (typeof a.filterArgs == "string" && a.decks[_i].parent() == a.filterArgs || a.filterArgs.indexOf(a.decks[_i].parent()) >= 0) {
						_decks.push(a.decks[_i]);
					}
				}
				a.decks = _decks;
				return _decks.length;
			},

			// Internal use

			_asc_desk: function _asc_desk(a) {

				if (!a || a.asc_desk == null || typeof a.asc_desk != 'number') return false;

				var _correct = true;

				for (var d in a.decks) {

					// console.log('_asc_desk', a.asc_desk ? 'asc' : 'desk', a.asc_desk, d, a.decks[d], _correct, a.decks[d].getCards());
					if (_correct == false) return false;

					var _cards = a.decks[d].getCards();
					// console.log('cards:', _cards);
					for (var c in _cards) {
						if (c > 0) {
							var down = share.validateCardName(_cards[(c | 0) - 1].name),
							    up = share.validateCardName(_cards[c | 0].name);
							// console.log('_asc_desk', down, up, a.asc_desk);	
							_correct = _correct && down && up && share.cardsRankS.indexOf(down.rank) == share.cardsRankS.indexOf(up.rank) + a.asc_desk;
						}
					}
				}
				return _correct;
			},

			// Simple rules

			newerWin: function newerWin() {
				console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.");
				return false;
			},

			// все колоды пусты

			allEmpty: function allEmpty(a) {

				var _correct = true;
				for (var _i in a.decks) {
					_correct = _correct && a.decks[_i].getCards().length == 0;
				}
				return _correct;
			},

			// Combined rules (use like filter)

			// все карты в одной колоде
			allInOne: function allInOne(a) {

				// console.log('check Win, rule/filter - allInOne:', a);

				var _emptyDecksCount = 0,
				    _decksLength = 0,
				    _fillIndex = 0;
				for (var i in a.decks) {
					if (a.decks[i].getCards().length == 0) {
						_emptyDecksCount += 1;
					} else {
						fillIndex = i;
					}
					_decksLength += 1;
				}
				// console.log('allinone', a, _emptyDecksCount, _decksLength);
				var _correct = _emptyDecksCount == _decksLength - 1;
				if (a.filter) a.decks = _correct ? [a.decks[fillIndex]] : [];
				return _correct;
			},

			// step by step 1, 2, 3
			// во всех колодах карты по возрастанию
			allAscend: function allAscend(a) {

				// console.log('check Win, rule - allAscending:', a);
				a.asc_desk = -1;
				return wcm._asc_desk(a);
			},

			// step by step 3, 2, 1
			// во всех колодах карты по убыванию
			allDescent: function allDescent(a) {

				a.asc_desk = 1;
				return wcm._asc_desk(a);
			},

			// Composite rules (input arguments)
			// комбинированное правило

			lego: function lego(_a) {

				// console.log(a.rulesArgs.filters, a.rulesArgs.rules)

				if (!_a || !_a.rulesArgs) return false;

				var _correct = true;

				// apply filters
				for (var next in _a.rulesArgs) {
					var _decksClone = {};
					for (var i in _a.decks) {
						_decksClone[i] = _a.decks[i];
					}var a = {
						// filters : _a[next].filters,
						// rules   : _a[next].rules,
						decks: _decksClone
					};

					// применяем фильтры, оставляем только интересующие колоды

					if (_correct && _a.rulesArgs[next].filters) {

						a.filter = true;

						for (var i in _a.rulesArgs[next].filters) {
							if (typeof _a.rulesArgs[next].filters[i] == 'string' && wcm[_a.rulesArgs[next].filters[i]]) {
								_correct = _correct && wcm[_a.rulesArgs[next].filters[i]](a);
							} else {
								// if(typeof _a.rulesArgs[next].filters[i] == 'object') {
								if (_a.rulesArgs[next].filters[i] && _a.rulesArgs[next].filters[i].toString() == "[object Object]") {
									for (var filterName in _a.rulesArgs[next].filters[i]) {
										if (wcm[filterName]) {
											a.filterArgs = _a.rulesArgs[next].filters[i][filterName];
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

					if (_a.rulesArgs[next].rules) {

						for (var i in _a.rulesArgs[next].rules) {
							if (wcm[_a.rulesArgs[next].rules[i]]) {
								_correct = _correct && wcm[_a.rulesArgs[next].rules[i]](a);
							} else {
								console.log('#2');
								_correct = _correct && wcm['newerWin']();
							}
						}
					}
				}

				return _correct;
			}
		};

		main.winCheck = function (a) {
			if (!a) a = {};
			if (typeof a.show == 'undefined') a.show = false;
			// console.log('winCheck', a);
			return share.winCheck(a);
			// return winCheck({noCallback : true});
		}.bind(main);

		share.winCheck = function (params) {

			// var _decks = main.getDecks();

			if (typeof share.winCheckMethod == 'function') {
				if (share.winCheckMethod({
					decks: main.getDecks({ visible: true })
				})) {
					EventManager.dispatch('win', params);
					// if(params && params.noCallback == true) return true;
					// a.winCheck.callback();
					return true;
				}
			} else {

				var rulesCorrect = true;
				var _hasMetods = false;
				for (var i in share.winCheckMethod) {
					_hasMetods = true;
					if (share.winCheckMethods[i]) {

						rulesCorrect = rulesCorrect && share.winCheckMethods[i]({
							decks: main.getDecks({ visible: true }),
							rulesArgs: share.winCheckMethod[i]
						});
					} else {
						if (typeof share.winCheckMethod[i] == 'function') {
							rulesCorrect = rulesCorrect && share.winCheckMethod[i]({
								decks: main.getDecks({ visible: true })
							});
						} else {
							rulesCorrect = rulesCorrect && share.winCheckMethods['newerWin']();
						}
					}
				}
				if (!_hasMetods) {
					rulesCorrect = rulesCorrect && share.winCheckMethods['newerWin']();
				}

				if (rulesCorrect) {
					if (params && params.noCallback == true) return true;
					main.event.dispatch('win', params);
					// a.winCheck.callback();
					return true;
				}

				return false;
				// return rulesCorrect;
			}
		};
	};

		;

/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {
		// пусть будет
		Math.sqr = function (i) {
			return i * i;
		};

		// var drag_el = null;
		share.dragDeck = null;
		share.startCursor = null;

		var top_z_index = 900;

		main.event.listen('undo', function () {
			/*share.moveCardToHome(
	  	share.dragDeck, 
	  	main.getDeckById(share.dragDeck[0].card.parent)
	  );*/
			if (share.dragDeck) main.getDeckById(share.dragDeck[0].card.parent).Redraw();
			share.dragDeck = null;
			share.startCursor = null;
		});

		main.event.listen('redo', function () {
			/*share.moveCardToHome(
	  	share.dragDeck, 
	  	main.getDeckById(share.dragDeck[0].card.parent)
	  );*/
			if (share.dragDeck) main.getDeckById(share.dragDeck[0].card.parent).Redraw();
			share.dragDeck = null;
			share.startCursor = null;
		});

		// -------------------------------------------------------------------------------------------------------------

		var cdown = function cdown(target, x, y) {

			if (share.curLockState) return;

			try {
				$('.draggable').finish();
			} catch (e) {
				console.log(e);
			}

			// try{$('.draggable:animated').finish();}catch(e){console.log('Hmmm...', $('.draggable:animated'));}

			if (share.dragDeck || share.startCursor) return;

			if (target.className.split(' ').indexOf('slot') >= 0) {

				var _id = target.id,
				    _deck = main.getElementById(_id);
				main.event.dispatch('runDeckActions', {
					deck: _deck
				});
			}

			if (target.className.split(' ').indexOf('draggable') >= 0) {

				var _id = target.id,
				    _card = _id ? main.getElementById(_id) : null,
				    _parent = _card && _card.parent ? _card.parent : null,
				    _deck = _parent ? main.getDeckById(_parent) : null;

				// console.log('card from deck:', _deck);

				main.event.dispatch('runDeckActions', {
					deck: _deck
				});

				// TODO
				// в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются

				// console.log(_id, _card, _parent, _deck, main.getElements())

				share.dragDeck = _deck ? _deck.Take(_id) : null;

				// console.log(share.dragDeck);

				if (share.dragDeck) {

					share.startCursor = {
						x: x,
						y: y
					};

					main.tipsDestination({ currentCard: _card });
				}
			}

			// console.log(share.dragDeck, share.startCursor);
		};
	
		// -------------------------------------------------------------------------------------------------------------

		var cmove = function cmove(x, y) {

			if (!share.dragDeck || !share.startCursor) return;

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
			for (var i in share.dragDeck) {
				var _position = _deck.padding(share.dragDeck[i].index);
				var _params = {
					left: _position.x + (x - share.startCursor.x) + 'px',
					top: _position.y + (y - share.startCursor.y) + 'px',
					// transform : 'rotate(0deg)',
					zIndex: top_z_index + (i | 0)
				};
				// Operations with DOM
				$(share.dragDeck[i].card.domElement).css(_params);
			}

			var cursorMove = {
				distance: _distance,
				direction: {
					x: x - share.startCursor.x, // (+) rigth / (-) left
					y: y - share.startCursor.y, // (+) down  / (-) up
					right: x > share.startCursor.x,
					left: x < share.startCursor.x,
					down: y > share.startCursor.y,
					up: y < share.startCursor.y
				},
				lastPosition: {
					x: x,
					y: y
				},
				deckPosition: {
					x: _position.x + (x - share.startCursor.x),
					y: _position.y + (y - share.startCursor.y)
				}
			};

			main.tipsMove({ moveDeck: share.dragDeck, cursorMove: cursorMove });

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
		};

		// -------------------------------------------------------------------------------------------------------------

		var cend = function cend(target, x, y) {

			if (!share.dragDeck || !share.startCursor) return;

			var _deck = main.getElementById(share.dragDeck[0].card.parent);
			var _position = _deck.padding(share.dragDeck[0].index);

			var cursorMove = {
				distance: Math.sqrt(Math.sqr(x - share.startCursor.x) + Math.sqr(y - share.startCursor.y)),
				direction: {
					x: x - share.startCursor.x, // (+) rigth / (-) left
					y: y - share.startCursor.y, // (+) down  / (-) up
					right: x > share.startCursor.x,
					left: x < share.startCursor.x,
					down: y > share.startCursor.y,
					up: y < share.startCursor.y
				},
				lastPosition: {
					x: x,
					y: y
				},
				deckPosition: {
					x: _position.x + (x - share.startCursor.x),
					y: _position.y + (y - share.startCursor.y)
				}
			};

			$(target).hide();
			var _dop = document.elementFromPoint(x, y);
			$(target).show();
			// if(_dop) {
			main.Move(share.dragDeck, _dop, cursorMove);
			// }

			share.dragDeck = share.startCursor = null;
		};

		// -------------------------------------------------------------------------------------------------------------

		document.onmousedown = function (e) {
			if (e.button != 0) return;
			cdown(e.target, e.clientX, e.clientY);
		};
		document.onmousemove = function (e) {
			cmove(e.clientX, e.clientY);
		};
		document.onmouseup = function (e) {
			// if(e.button != 0) return;
			cend(e.target, e.clientX, e.clientY);
		};

		document.addEventListener('touchstart', function (e) {
			// e.preventDefault()
			cdown(e.target, e.touches[0].clientX, e.touches[0].clientY);
		}, false);
		document.addEventListener('touchmove', function (e) {
			if (share.startCursor) e.preventDefault();
			cmove(e.touches[0].clientX, e.touches[0].clientY);
		}, false);
		document.addEventListener('touchend', function (e) {
			// e.preventDefault()
			cend(e.changedTouches[0].target, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		}, false);
	};

		;

/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		share.forceMove = function (a) {
			// {'from', 'to', deck[]}

			// console.log('forceMove', a);

			var _warn = function _warn(index) {
				console.warn(index, 'Incorrect move.' + (share.debugLog ? '' : ' (use debugLog : true in field parameters for details)'));
				// if(share.debugLog == true) {console.log('Arguments:', a, index);}
			};

			if (!a.from || !a.to || !a.deck) {
				_warn(1);
				return;
			}

			if (typeof a.from != 'string' || typeof a.to != 'string') {
				_warn(2);
				return;
			}

			if (!a.deck.length) return;

			var _from = main.Deck(a.from);
			var _to = main.Deck(a.to);

			if (!_from || !_to) {
				_warn(3);return;
			}

			var _check = true;
			var _from_deck = _from.getCards();

			for (var i in _from_deck) {

				if (i >= _from_deck.length - a.deck.length) {
					var _id = i - (_from_deck.length | 0) + (a.deck.length | 0);
					if (a.deck[_id] && _from_deck[i].name != a.deck[_id]) {
						console.log(i, _id, _from_deck, _from_deck[i].name, a.deck[_id]);
						_check = false;
					}
				}
			}

			if (_check) {
				var _pop = _from.Pop(a.deck.length);
				_to.Push(_pop);
			} else {
				_warn(4);
			}

			_from.Redraw();
			_to.Redraw();

			//for(var i = deck.length;i;i -= 1) {
			//	_to.push(_to.getCards)
			//}

			share.checkTips();
		}; //.bind(main);
	};
	
		;

/***/ },
/* 24 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (main, share) {

		var shuffle = function shuffle(a) {

			// console.log('SHUFFLE:', a, typeof a);

			for (var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {}
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
		};

		main.deckGenerator = function (a) {

			var default_type = 'all';

			var default_shuffle = false;
			var max_iterations = 10;

			var type = a && a.type && typeof a.type == 'string' ? a.type : default_type;
			var _iterations = a && a.iterations && typeof a.iterations == 'number' && a.iterations < max_iterations ? a.iterations : 1;
			var _shuffle = a && a.shuffle && typeof a.shuffle == 'boolean' ? a.shuffle : default_shuffle;

			var genType = function genType(_cardsColors, _cardsRanks) {
				var _deck = [];
				for (var c in _cardsColors) {
					for (var r in _cardsRanks) {
						_deck.push(_cardsColors[c] + _cardsRanks[r]);
					}
				}
				return _deck;
			};
			var _ranks = share.cardsRankS;
			if (a && a.ranks) {
				_ranks = [];
				for (i in a.ranks) {
					if (share.cardsRankS.indexOf(a.ranks[i].toString()) >= 0) {
						_ranks.push(a.ranks[i].toString());
					}
				}
			}

			var genTypes = {
				all: function all() {
					return genType(share.cardsSuits, _ranks);
				},
				black: function black() {
					var _cardsSuits = share.cardColors.black;
					return genType(_cardsSuits, _ranks);
				},
				red: function red() {
					var _cardsSuits = share.cardColors.red;
					return genType(_cardsSuits, _ranks);
				},
				black_and_red: function black_and_red() {
					var _cardsSuits = [share.cardColors.red[Math.random() * share.cardColors.red.length | 0], share.cardColors.black[Math.random() * share.cardColors.black.length | 0]];
					return genType(_cardsSuits, _ranks);
				},
				h_only: function h_only() {
					var _cardsSuits = ['h'];
					return genType(_cardsSuits, _ranks);
				},
				d_only: function d_only() {
					var _cardsSuits = ['d'];
					return genType(_cardsSuits, _ranks);
				},
				c_only: function c_only() {
					var _cardsSuits = ['c'];
					return genType(_cardsSuits, _ranks);
				},
				s_only: function s_only() {
					var _cardsSuits = ['s'];
					return genType(_cardsSuits, _ranks);
				},
				one_rank_only: function one_rank_only() {
					var _cardsSuits = [share.cardsColors[Math.random() * share.cardsColors.length | 0]];
					return genType(_cardsSuits, _ranks);
				}
			};

			var _deck = [];

			for (; _iterations > 0; _iterations -= 1) {
				_deck = _deck.concat(genTypes[type]());
			}

			if (_shuffle) {
				_deck = shuffle(_deck);
			}

			return _deck;
		}.bind(main);
	};

		;

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9qcy9Tb2xpdGFpcmVFbmdpbmUuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYTFiZWViZDk1YmM3N2I5ZjE0MTUiLCJ3ZWJwYWNrOi8vL1NvbGl0YWlyZUVuZ2luZS5tYWluLmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL1NvbGl0YWlyZUNvbW1vbi5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9Tb2xpdGFpcmVEZWJ1Zy5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9GaWVsZC5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeS5qcyIsIndlYnBhY2s6Ly8vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY29yZS5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9hZGRHcm91cC5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9hZGREZWNrLmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL2ZsaXBUeXBlcy5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9yZWFkeVB1dFJ1bGVzLmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL3JlYWR5VGFrZVJ1bGVzLmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL2ZpbGxSdWxlcy5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9wYWRkaW5nVHlwZXMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVuc2lvbnMvYWRkRGVja0FjdGlvbi5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy90aXBzUnVsZXMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVuc2lvbnMvRG9tTWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9Tb2xpdGFpcmVIaXN0b3J5LmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL1RpcHMuanMiLCJ3ZWJwYWNrOi8vL2V4dGVuc2lvbnMvYmVzdFRpcC5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9Nb3ZlLmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL3dpbkNoZWNrLmpzIiwid2VicGFjazovLy9leHRlbnNpb25zL0RyYWdORHJvcC5qcyIsIndlYnBhY2s6Ly8vZXh0ZW5zaW9ucy9mb3JjZU1vdmUuanMiLCJ3ZWJwYWNrOi8vL2V4dGVuc2lvbnMvZGVja0dlbmVyYXRvci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0ZXhwb3J0czoge30sXG4gXHRcdFx0aWQ6IG1vZHVsZUlkLFxuIFx0XHRcdGxvYWRlZDogZmFsc2VcbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubG9hZGVkID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXygwKTtcblxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIHdlYnBhY2svYm9vdHN0cmFwIGExYmVlYmQ5NWJjNzdiOWYxNDE1XG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLypcclxuICogU29saXRhaXJlIGdhbWUgZW5naW5lXHJcbiAqIGJ5IFJvbWFuIEJhdWVyIC0ga290YXBlc2ljQGdtYWlsLmNvbVxyXG4gKiBPY3QuIDIwMTVcclxuICogV2VicGFjayB2ZXJzaW9uIDI0IEZlYi4gMjAxNlxyXG4gKi9cclxuXHJcbnZhciBTb2xpdGFpcmVFeHRlbnNpb25zID0ge307ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gT04gfCBJTlxyXG5cclxuaW1wb3J0IFNvbGl0YWlyZUNvbW1vbiAgZnJvbSAnLi9leHRlbnNpb25zL1NvbGl0YWlyZUNvbW1vbic7ICAgICAvLyArXHJcbmltcG9ydCBGaWVsZCAgICAgICAgICAgIGZyb20gJy4vZXh0ZW5zaW9ucy9GaWVsZCc7ICAgICAgICAgICAgICAgLy8gK1xyXG4vLyAgICAgICAgICAgICBpbXBvcnQgKiBmcm9tICcuL2V4dGVuc2lvbnMvYWRkR3JvdXAnOyAgICAgICAgICAgIC8vICsgICAgRmllbGRcclxuLy8gICAgICAgICAgICAgaW1wb3J0ICogZnJvbSAnLi9leHRlbnNpb25zL2FkZERlY2snOyAgICAgICAgICAgICAvLyArICAgIEZpZWxkXHJcbmltcG9ydCBEb21NYW5hZ2VyICAgICAgIGZyb20gJy4vZXh0ZW5zaW9ucy9Eb21NYW5hZ2VyJzsgICAgICAgICAgLy8gK1xyXG4vLyAgICAgICAgICAgICBpbXBvcnQgKiBmcm9tICcuL2V4dGVuc2lvbnMvZGVja0dlbmVyYXRvcic7ICAgICAgIC8vICsgICAgU29saXRhaXJlRGVidWdcclxuaW1wb3J0IFNvbGl0YWlyZUhpc3RvcnkgZnJvbSAnLi9leHRlbnNpb25zL1NvbGl0YWlyZUhpc3RvcnknOyAgICAvLyArXHJcbi8vICAgICAgICAgICAgIGltcG9ydCAqIGZyb20gJy4vZXh0ZW5zaW9ucy90aXBzUnVsZXMnOyAgICAgICAgICAgLy8gKyAgICBUaXBzXHJcbmltcG9ydCBUaXBzICAgICAgICAgICAgIGZyb20gJy4vZXh0ZW5zaW9ucy9UaXBzJzsgICAgICAgICAgICAgICAgLy8gK1xyXG4vLyAgICAgICAgICAgICBpbXBvcnQgKiBmcm9tICcuL2V4dGVuc2lvbnMvYmVzdFRpcCc7ICAgICAgICAgICAgIC8vICsgICAgVGlwc1xyXG4vLyAgICAgICAgICAgICBpbXBvcnQgKiBmcm9tICcuL2V4dGVuc2lvbnMvcmVhZHlUYWtlUnVsZXMnOyAgICAgIC8vICsgICAgRmllbGQuYWRkRGVja1xyXG4vLyAgICAgICAgICAgICBpbXBvcnQgKiBmcm9tICcuL2V4dGVuc2lvbnMvcmVhZHlQdXRSdWxlcyc7ICAgICAgIC8vICsgICAgRmllbGQuYWRkRGVja1xyXG4vLyAgICAgICAgICAgICBpbXBvcnQgKiBmcm9tICcuL2V4dGVuc2lvbnMvZmlsbFJ1bGVzJzsgICAgICAgICAgIC8vICsgICAgRmllbGQuYWRkRGVja1xyXG5pbXBvcnQgTW92ZSAgICAgICAgICAgICBmcm9tICcuL2V4dGVuc2lvbnMvTW92ZSc7ICAgICAgICAgICAgICAgIC8vICtcclxuLy8gICAgICAgICAgICAgaW1wb3J0ICogZnJvbSAnLi9leHRlbnNpb25zL2ZvcmNlTW92ZSc7ICAgICAgICAgICAvLyArICAgIFNvbGl0YWlyZUhpc3RvcnlcclxuaW1wb3J0IHdpbkNoZWNrICAgICAgICAgZnJvbSAnLi9leHRlbnNpb25zL3dpbkNoZWNrJzsgICAgICAgICAgICAvLyArXHJcbi8vICAgICAgICAgICAgIGltcG9ydCAqIGZyb20gJy4vZXh0ZW5zaW9ucy9hZGREZWNrQWN0aW9uJzsgICAgICAgLy8gKyAgICBGaWVsZC5hZGREZWNrXHJcbi8vICAgICAgICAgICAgIGltcG9ydCAqIGZyb20gJy4vZXh0ZW5zaW9ucy9mbGlwVHlwZXMnOyAgICAgICAgICAgLy8gKyAgICBGaWVsZC5hZGREZWNrXHJcbi8vICAgICAgICAgICAgIGltcG9ydCAqIGZyb20gJy4vZXh0ZW5zaW9ucy9wYWRkaW5nVHlwZXMnOyAgICAgICAgLy8gKyAgICBGaWVsZC5hZGREZWNrXHJcbmltcG9ydCBEcmFnTkRyb3AgICAgICAgIGZyb20gJy4vZXh0ZW5zaW9ucy9EcmFnTkRyb3AnOyAgICAgICAgICAgLy8gK1xyXG5pbXBvcnQgU29saXRhaXJlRGVidWcgICBmcm9tICcuL2V4dGVuc2lvbnMvU29saXRhaXJlRGVidWcnOyAgICAgIC8vICsgXHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0gSU5ERVggLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbnZhciBzaGFyZSA9IHt9O1xyXG5cclxudmFyIG1haW4gPSBuZXcgZnVuY3Rpb24oKSB7XHJcblx0Ly8gdGhpcy5ldmVudCA9IG51bGw7XHJcbn07XHJcblxyXG4vKmZvcih2YXIgaSBpbiBTb2xpdGFpcmVFeHRlbnNpb25zKSB7XHJcblx0U29saXRhaXJlRXh0ZW5zaW9uc1tpXShtYWluLCBzaGFyZSk7XHJcbn07Ki9cclxuXHJcblNvbGl0YWlyZUNvbW1vbiAgKG1haW4sIHNoYXJlKTtcclxuRG9tTWFuYWdlciAgICAgICAobWFpbiwgc2hhcmUpO1xyXG5EcmFnTkRyb3AgICAgICAgIChtYWluLCBzaGFyZSk7XHJcblRpcHMgICAgICAgICAgICAgKG1haW4sIHNoYXJlKTtcclxuTW92ZSAgICAgICAgICAgICAobWFpbiwgc2hhcmUpO1xyXG53aW5DaGVjayAgICAgICAgIChtYWluLCBzaGFyZSk7XHJcblNvbGl0YWlyZUhpc3RvcnkgKG1haW4sIHNoYXJlKTtcclxuXHJcbmlmKHR5cGVvZiBTb2xpdGFpcmVEZWJ1ZyAhPSBcInVuZGVmaW5lZFwiKSB7XHJcblx0U29saXRhaXJlRGVidWcgICAobWFpbiwgc2hhcmUpO1xyXG59XHJcblxyXG5leHBvcnRzLm1haW4gPSBtYWluO1xyXG5leHBvcnRzLmV2ZW50ID0gbWFpbi5ldmVudDtcclxuXHJcbmV4cG9ydHMuaW5pdCA9IGZ1bmN0aW9uKGdhbWVDb25maWcpIHtcclxuXHRcclxuXHRGaWVsZChtYWluLCBzaGFyZSwgZ2FtZUNvbmZpZyk7XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogU29saXRhaXJlRW5naW5lLm1haW4uanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRzaGFyZS5lbGVtZW50cyA9IHt9O1xyXG5cclxuXHRzaGFyZS5jYXJkc1N1aXRzICAgPSBbJ2gnLCAnZCcsICdjJywgJ3MnXTsgLy8gUmVkLCBSZWQsIEJsYWNrLCBCbGFja1xyXG5cdHNoYXJlLmNhcmRDb2xvcnMgICA9IHtcclxuXHRcdCdyZWQnICAgOiBbJ2gnLCAnZCddLFxyXG5cdFx0J2JsYWNrJyA6IFsnYycsICdzJ11cclxuXHR9XHJcblx0Ly8gc2hhcmUucmVkQ2FyZHMgICAgID0gO1xyXG5cdC8vIHNoYXJlLmJsYWNrQ2FyZHMgICA9IFsnYycsICdzJ107XHJcblx0c2hhcmUuY2FyZHNSYW5rICAgID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAnaicsICdxJywgJ2snXTtcclxuXHRzaGFyZS5jYXJkc1JhbmtTICAgPSBbJzEnLCAnMicsICczJywgJzQnLCAnNScsICc2JywgJzcnLCAnOCcsICc5JywgJzEwJywgJ2onLCAncScsICdrJ107XHJcblx0c2hhcmUuY2FyZHNSYW5rSW50ID0gWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzXTtcclxuXHJcblx0c2hhcmUuZmllbGQgPSBudWxsO1xyXG5cdFxyXG5cdHNoYXJlLmRlZmF1bHRfY2FuX21vdmVfZmxpcCA9IGZhbHNlO1xyXG5cdHNoYXJlLmRlZmF1bHRfc2hvd1Nsb3QgICAgICA9IGZhbHNlO1xyXG5cdHNoYXJlLmRlZmF1bHRfYXV0b2hpZGUgICAgICA9IGZhbHNlO1xyXG5cclxuXHRzaGFyZS5kZWZhdWx0X3BhZGRpbmdUeXBlID0gJ25vbmUnLFxyXG5cdHNoYXJlLmRlZmF1bHRfZmxpcF90eXBlICAgPSAnbm9uZScsXHJcblx0c2hhcmUuZGVmYXVsdF90YWtlTmFtZSAgICA9ICdvbmx5dG9wJyxcclxuXHRzaGFyZS5kZWZhdWx0X3B1dE5hbWUgICAgID0gJ2FueSc7XHJcblxyXG5cdHNoYXJlLmRlZmF1bHRfdGlwUnVsZSA9ICdhbGxUb0FsbCc7XHJcblxyXG5cdHNoYXJlLmRlZmF1bHRfcGFkZGluZ195ICAgICAgPSAyMDtcclxuXHRzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeCAgICAgID0gMjA7XHJcblx0c2hhcmUuZGVmYXVsdF9mbGlwX3BhZGRpbmdfeSA9IDU7XHJcblx0c2hhcmUuZGVmYXVsdF9mbGlwX3BhZGRpbmdfeCA9IDIwO1xyXG5cdHNoYXJlLmRlZmF1bHRfc3RhcnRfel9pbmRleCAgPSAxO1xyXG5cdHNoYXJlLmRlZmF1bHRfbW92ZV9kaXN0YW5jZSAgPSAxMDtcclxuXHJcblx0c2hhcmUuZGVmYXVsdF90aGVtZSA9ICdkZWZhdWx0X3RoZW1lJztcclxuXHRcclxuXHRzaGFyZS5hbmltYXRpb25UaW1lID0gMzAwO1xyXG5cclxuXHRzaGFyZS5kZWZhdWx0X3R3aW5kZWNrX21vdmVfY2FyZF9jb3VudCA9IDM7XHJcblx0Ly8gc2hhcmUuZGVmYXVsdF90d2luZGVja19tYXhfY2FyZHMgICAgICAgPSA3O1xyXG5cdC8vIHNoYXJlLmRlZmF1bHRfdHdpbmRlY2tfZGVja19sZW5ndGggICAgID0gMztcclxuXHJcblx0c2hhcmUuVGlwcyAgICAgICAgICAgICAgICA9IG51bGwsXHJcblx0c2hhcmUubW92ZURpc3RhbmNlICAgICAgICA9IDAsICAgICAvLyBkZWZhdWx0IDBcclxuXHRzaGFyZS5zaG93VGlwcyAgICAgICAgICAgID0gdHJ1ZSwgIC8vIGRlZmF1bHQgdHJ1ZVxyXG5cdHNoYXJlLnNob3dUaXBzRGVzdGluYXRpb24gPSBmYWxzZSwgLy8gZGVmYXVsdCBmYWxzZVxyXG5cdHNoYXJlLnNob3dUaXBQcmlvcml0eSAgICAgPSBmYWxzZTsgLy8gZGVmYXVsdCBmYWxzZVxyXG5cclxuXHRzaGFyZS5kZWJ1Z0xhYmVscyA9IGZhbHNlO1xyXG5cdHNoYXJlLnN0YXJ0X3pfaW5kZXggPSBzaGFyZS5kZWZhdWx0X3N0YXJ0X3pfaW5kZXg7XHJcblxyXG5cdHNoYXJlLm9uZVN0ZXBXYXkgPSB7fTtcclxuXHJcblx0c2hhcmUuZGVidWdMb2cgPSBmYWxzZTtcclxuXHJcblx0c2hhcmUuY2FuX21vdmVfZmxpcCA9IG51bGw7XHJcblxyXG5cdHNoYXJlLnpvb20gPSAxLjA7XHJcblx0XHJcblx0c2hhcmUuY2FyZCA9IHtcclxuXHQgICAgd2lkdGggICA6IDcxLFxyXG5cdCAgICBoZWlnaHQgIDogOTYsXHJcblxyXG5cdCAgICBzdWl0cyAgIDogWydoJywgJ2QnLCAnYycsICdzJ10sXHJcblx0ICAgIGNvbG9ycyAgOiB7XHJcblx0ICAgIFx0cmVkICAgOiBbJ2gnLCAnZCddLFxyXG5cdFx0XHRibGFjayA6IFsnYycsICdzJ11cclxuXHQgICAgfSxcclxuXHQgICAgcmFua3MgICA6IFsnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknLCAnMTAnLCAnaicsICdxJywgJ2snXSxcclxuXHQgICAgaW5kZXhlcyA6IFsgMSwgICAyLCAgIDMsICAgNCwgICA1LCAgIDYsICAgNywgICA4LCAgIDksICAgMTAsICAgMTEsICAxMiwgIDEzXVxyXG5cdH1cclxuXHJcblxyXG5cdG1haW4uZXZlbnQgPSBuZXcgZnVuY3Rpb24oKSB7XHJcblx0XHJcblx0XHR2YXIgZXZlbnRzID0ge307XHJcblxyXG5cdFx0dGhpcy5saXN0ZW4gPSBmdW5jdGlvbihuYW1lLCBjYWxsYmFjaykge1xyXG5cdFx0XHRpZih0eXBlb2YgbmFtZSAhPSAnc3RyaW5nJyB8fCB0eXBlb2YgY2FsbGJhY2sgIT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xyXG5cdFx0XHRpZihldmVudHNbbmFtZV0pIHtcclxuXHRcdFx0XHRldmVudHNbbmFtZV0ucHVzaChjYWxsYmFjayk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZXZlbnRzW25hbWVdID0gW2NhbGxiYWNrXTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR0aGlzLmRpc3BhdGNoID0gZnVuY3Rpb24obmFtZSwgZGF0YSkge1xyXG5cdFx0XHRpZihldmVudHNbbmFtZV0pIHtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gZXZlbnRzW25hbWVdKSB7XHJcblx0XHRcdFx0XHRldmVudHNbbmFtZV1baV0oZGF0YSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdHNoYXJlLnNhdmVTdGVwQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xyXG5cdHNoYXJlLndpbkNoZWNrQ2FsbGJhY2sgPSBmdW5jdGlvbigpIHt9O1xyXG5cdHNoYXJlLmF1dG9UaXBzID0gZnVuY3Rpb24oKSB7fTtcclxuXHJcblx0dmFyIF9pZCA9IDA7XHJcblx0c2hhcmUuZ2VuSWQgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBfaWQrKztcclxuXHR9XHJcblxyXG5cdG1haW4ub3B0aW9ucyA9IHtcclxuXHRcdGNhcmQgOiBzaGFyZS5jYXJkXHJcblx0fTtcclxuXHJcblx0Ly8gTG9jay9VbmxvY2tcclxuXHJcblx0c2hhcmUubG9jayA9IGZhbHNlO1xyXG5cclxuXHR2YXIgX2xvY2sgPSBtYWluLmxvY2sgPSBmdW5jdGlvbigpIHtcclxuXHRcdGlmKHNoYXJlLmRlYnVnTG9nKSBjb25zb2xlLmxvZygnTE9DSycpO1xyXG5cdFx0c2hhcmUubG9jayA9IHRydWU7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdsb2NrJywgX2xvY2spO1xyXG5cclxuXHR2YXIgX3VubG9jayA9IG1haW4udW5sb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRpZihzaGFyZS5kZWJ1Z0xvZykgY29uc29sZS5sb2coJ1VOTE9DSycpO1xyXG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKCdhc2RhJyk7XHJcblx0XHRzaGFyZS5sb2NrID0gZmFsc2U7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cdG1haW4uZXZlbnQubGlzdGVuKCd1bmxvY2snLCBfdW5sb2NrKTtcclxuXHJcblx0c2hhcmUuY3VyTG9ja1N0YXRlID0gZmFsc2U7XHJcblx0c2hhcmUuY3VyTG9jayA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0c2hhcmUuY3VyTG9ja1N0YXRlID0gdHJ1ZTtcclxuXHR9XHJcblx0c2hhcmUuY3VyVW5Mb2NrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRzaGFyZS5jdXJMb2NrU3RhdGUgPSBmYWxzZTtcclxuXHR9XHJcblxyXG5cdG1haW4uZ2V0RWxlbWVudHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBzaGFyZS5lbGVtZW50cztcclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdG1haW4uZ2V0RWxlbWVudHNCeU5hbWUgPSBmdW5jdGlvbihuYW1lLCB0eXBlKSB7XHJcblx0XHR2YXIgcyA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpIGluIHNoYXJlLmVsZW1lbnRzKSB7XHJcblx0XHRcdGlmKHNoYXJlLmVsZW1lbnRzW2ldLm5hbWUgJiYgdHlwZW9mIHNoYXJlLmVsZW1lbnRzW2ldLm5hbWUgPT0gJ3N0cmluZycgJiYgc2hhcmUuZWxlbWVudHNbaV0ubmFtZSA9PSBuYW1lKSB7XHJcblx0XHRcdFx0aWYodHlwZSAmJiB0eXBlb2Ygc2hhcmUuZWxlbWVudHNbaV0udHlwZSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0aWYodHlwZSAmJiBzaGFyZS5lbGVtZW50c1tpXS50eXBlID09IHR5cGUpIHtcclxuXHRcdFx0XHRcdFx0cy5wdXNoKHNoYXJlLmVsZW1lbnRzW2ldKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHMucHVzaChzaGFyZS5lbGVtZW50c1tpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHMucHVzaChzaGFyZS5lbGVtZW50c1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcztcclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdG1haW4uZ2V0RWxlbWVudEJ5SWQgPSBmdW5jdGlvbihhKSB7XHJcblx0XHRyZXR1cm4gc2hhcmUuZWxlbWVudHNbYV07XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbignbWFrZVN0ZXAnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRzaGFyZS5zYXZlU3RlcENhbGxiYWNrKGUpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2NsZWFyIHNoYXJlLm9uZVN0ZXBXYXknLCBvbmx5dG9wZVN0ZXBXYXkpO1xyXG5cdFx0c2hhcmUub25lU3RlcFdheSA9IHt9O1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3NoYXJlLm9uZVN0ZXBXYXkgY2xlYXJlZCcsIHNoYXJlLm9uZVN0ZXBXYXkpO1xyXG5cdH0pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3Rlbignd2luJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3dpbicsIHNoYXJlLndpbkNoZWNrQ2FsbGJhY2ssIGUpO1xyXG5cdFx0aWYoZSAmJiBlLnNob3cpIHNoYXJlLndpbkNoZWNrQ2FsbGJhY2soZSk7XHJcblx0fSk7XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCduZXdHYW1lJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0c2hhcmUuY2hlY2tUaXBzKCk7XHJcblx0fSk7XHJcblxyXG5cdHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUgPSBmdW5jdGlvbihuYW1lLCBub2xvZykge1xyXG5cdFx0aWYodHlwZW9mIG5hbWUgIT0gJ3N0cmluZycpIHtcclxuXHRcdFx0aWYoIW5vbG9nKSBjb25zb2xlLmxvZygnV2FybmluZzogdmFsaWRhdGUgbmFtZSBtdXN0IGhhdmUgc3RyaW5nIHR5cGUnLCBuYW1lKTtcclxuXHRcdFx0Ly8gdGhyb3cgbmV3IEVycm9yKCd6Jyk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHZhciBzdWl0ICA9IG5hbWUuc2xpY2UoMCwgMSksXHJcblx0XHRcdHJhbmsgID0gbmFtZS5zbGljZSgxLCAzKSxcclxuXHRcdFx0Y29sb3IgPSBudWxsO1xyXG5cdFx0XHRmb3IodmFyIGNvbG9yTmFtZSBpbiBzaGFyZS5jYXJkQ29sb3JzKSB7XHJcblx0XHRcdFx0aWYoc2hhcmUuY2FyZENvbG9yc1tjb2xvck5hbWVdLmluZGV4T2Yoc3VpdCkgPj0gMCkge1xyXG5cdFx0XHRcdFx0Y29sb3IgPSBjb2xvck5hbWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZygndmFsaWRhdGVDYXJkTmFtZTonLCBjb2xvciwgc3VpdCwgcmFuayk7XHJcblx0XHRpZiggc2hhcmUuY2FyZHNTdWl0cy5pbmRleE9mKHN1aXQpID49IDAgJiYgc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKHJhbmspID49IDAgKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0c3VpdCAgOiBzdWl0LCBcclxuXHRcdFx0XHRyYW5rICA6IHJhbmssXHJcblx0XHRcdFx0Y29sb3IgOiBjb2xvciBcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYoIW5vbG9nKSBjb25zb2xlLmxvZygnV2FybmluZzogdmFsaWRhdGUgbmFtZTonLCBuYW1lLCAnLSBpbmNvcnJlY3QnKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL1NvbGl0YWlyZUNvbW1vbi5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBkZWNrR2VuZXJhdG9yIGZyb20gJy4vZGVja0dlbmVyYXRvcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRkZWNrR2VuZXJhdG9yKG1haW4sIHNoYXJlKTtcclxuXHJcblx0Ly8gZGVidWdcclxuXHRtYWluLmRlYnVnU2hvd1NoYXJlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRjb25zb2xlLmxvZyhzaGFyZSk7XHJcblx0fVxyXG5cclxuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLSBIaXN0b3J5IC0tLS0tLS0tLS0tLS0tLS0tXHJcblx0dmFyIGRlYnVnSGlzdG9yeSA9IG5ldyBmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0dmFyIF9oaXN0b3J5ID0gW10sXHJcblx0XHRcdF9yZWRvICAgID0gW107XHJcblx0XHRcclxuXHRcdHRoaXMucmVjb3JkID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ1JFQ09SRCBISVNUT1JZOicsIGRhdGEpO1xyXG5cdFx0XHRcclxuXHRcdFx0X3JlZG8gPSBbXTtcclxuXHRcdFx0X2hpc3RvcnkucHVzaChkYXRhKTtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy51bmRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBfc3RlcCA9IF9oaXN0b3J5LnBvcCgpO1xyXG5cdFx0XHRpZihfc3RlcCkgX3JlZG8ucHVzaChfc3RlcCk7XHJcblx0XHRcdHJldHVybiBfc3RlcDtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dGhpcy5yZWRvID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBfc3RlcCA9IF9yZWRvLnBvcCgpO1xyXG5cdFx0XHRpZihfc3RlcCkgX2hpc3RvcnkucHVzaChfc3RlcCk7XHJcblx0XHRcdHJldHVybiBfc3RlcDtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgaGlzdCA9IHRoaXM7XHJcblxyXG5cdFx0bWFpbi5ldmVudC5saXN0ZW4oJ21ha2VTdGVwJywgdGhpcy5yZWNvcmQpO1xyXG5cclxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKGRvY3VtZW50LmJvZHkpLmFwcGVuZChcclxuXHRcdFx0XHQkKFwiPGRpdj5cIikuYXBwZW5kKFxyXG5cdFx0XHRcdFx0JChcIjxzcGFuPlwiKS5hZGRDbGFzcygnYXdlc29tZScpLnRleHQoJ1VORE8nKS5jbGljayhmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0dmFyIF9kYXRhID0gdGhpcy51bmRvKCk7XHJcblx0XHRcdFx0XHRcdC8vIFx0Y29uc29sZS5sb2coJ3VuZG86JywgX2RhdGEpO1xyXG5cdFx0XHRcdFx0XHRpZihfZGF0YSkge1xyXG5cdFx0XHRcdFx0XHRcdFNvbGl0YWlyZUVuZ2luZS5ldmVudC5kaXNwYXRjaCgndW5kbycsIF9kYXRhKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gfS5iaW5kKHtITSA6IHRoaXMsIGNhbGxiYWNrIDogbWFpbi5Nb3ZlKCl9KSlcclxuXHRcdFx0XHRcdH0uYmluZChoaXN0KSlcclxuXHRcdFx0XHQpLmFwcGVuZChcclxuXHRcdFx0XHRcdCQoXCI8c3Bhbj5cIikuYWRkQ2xhc3MoJ2F3ZXNvbWUnKS50ZXh0KCdSRURPJykuY2xpY2soZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdHZhciBfZGF0YSA9IHRoaXMucmVkbygpO1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygncmVkbzonLCBfZGF0YSk7XHJcblx0XHRcdFx0XHRcdGlmKF9kYXRhKSB7XHJcblx0XHRcdFx0XHRcdFx0U29saXRhaXJlRW5naW5lLmV2ZW50LmRpc3BhdGNoKCdyZWRvJywgX2RhdGEpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LmJpbmQoaGlzdCkpXHJcblx0XHRcdFx0KS5jc3Moe3Bvc2l0aW9uIDogJ2ZpeGVkJywgdG9wIDogJzFweCcsIGxlZnQgOiAnMXB4J30pXHJcblx0XHRcdCk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9Tb2xpdGFpcmVEZWJ1Zy5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuaW1wb3J0IEdyb3VwICAgICBmcm9tICcuL2FkZEdyb3VwJztcclxuaW1wb3J0IERlY2sgICAgICBmcm9tICcuL2FkZERlY2snO1xyXG5pbXBvcnQgdGlwc1J1bGVzIGZyb20gJy4vdGlwc1J1bGVzJztcclxuXHJcblxyXG52YXIgRmllbGQgPSBmdW5jdGlvbihtYWluLCBzaGFyZSwgZGF0YSkge1xyXG5cdFxyXG5cdHZhciBhZGREZWNrID0gZnVuY3Rpb24oZGF0YSkge1xyXG5cdFx0cmV0dXJuIG5ldyBEZWNrKG1haW4sIHNoYXJlLCBkYXRhKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgYWRkR3JvdXAgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRyZXR1cm4gbmV3IEdyb3VwKG1haW4sIHNoYXJlLCBkYXRhKTtcclxuXHR9O1xyXG5cdFxyXG5cdGlmKCFkYXRhICYmIHNoYXJlLmZpZWxkKSByZXR1cm4gc2hhcmUuZmllbGQ7XHJcblx0aWYoIWRhdGEpIHJldHVybiBmYWxzZTtcclxuXHJcblx0aWYoZGF0YSAmJiBzaGFyZS5maWVsZCkge1xyXG5cdFx0c2hhcmUuZmllbGQuY2xlYXIoKTtcclxuXHR9XHJcblx0XHJcblx0dmFyIGEgPSBudWxsO1xyXG5cdHRyeSB7XHJcblx0XHRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XHJcblx0fSBjYXRjaChlKSB7XHJcblx0XHRhID0gZGF0YTtcclxuXHRcdGNvbnNvbGUud2FybignRmllbGQgaW5wdXQgcGFyYW1zIGlzIG5vdCBKU09OLCBtYXliZSB0aGUgcnVsZXMgYXJlIHdyb25nLicpO1xyXG5cdFx0Ly8gREVCVUdcclxuXHRcdC8qdmFyIF9uYW1lcyA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpIGluIGEuZ3JvdXBzLmdyb3VwX2EpIHtcclxuXHRcdFx0X25hbWVzLnB1c2goaSk7XHJcblx0XHR9XHJcblx0XHRjb25zb2xlLmxvZygnREFUQTonLCBfbmFtZXMsIGEuZ3JvdXBzLmdyb3VwX2EpOyovXHJcblx0fVxyXG5cclxuXHRzaGFyZS5ob21lR3JvdXBzID0gYS5ob21lR3JvdXBzID8gYS5ob21lR3JvdXBzIDogbnVsbDtcclxuXHRcclxuXHRzaGFyZS5maWVsZCA9IG5ldyAoZnVuY3Rpb24oYSkge1xyXG5cdFx0XHJcblx0XHRtYWluLnVubG9jaygpO1xyXG5cdH0pKGEpO1xyXG5cdFxyXG5cdFxyXG5cdG1haW4uZXZlbnQuZGlzcGF0Y2goJ2luaXRGaWVsZCcsIHtcclxuXHRcdGEgICAgIDogYS8vLCBcclxuXHRcdC8vIGZpZWxkIDogc2hhcmUuZmllbGRcclxuXHR9KTtcclxuXHJcblx0c2hhcmUuZGVidWdMb2cgPSBhLmRlYnVnTG9nICYmIHR5cGVvZiBhLmRlYnVnTG9nID09ICdib29sZWFuJyA/IGEuZGVidWdMb2cgOiBzaGFyZS5kZWJ1Z0xvZztcclxuXHJcblx0Ly8gVGlwc1xyXG5cclxuXHRzaGFyZS5zaG93VGlwcyAgICAgICAgICAgID0gdHlwZW9mIGEuc2hvd1RpcHMgICAgICAgICAgICA9PSAnYm9vbGVhbicgPyBhLnNob3dUaXBzICAgICAgICAgICAgOiBzaGFyZS5zaG93VGlwcztcclxuXHRzaGFyZS5zaG93VGlwc0Rlc3RpbmF0aW9uID0gdHlwZW9mIGEuc2hvd1RpcHNEZXN0aW5hdGlvbiA9PSAnYm9vbGVhbicgPyBhLnNob3dUaXBzRGVzdGluYXRpb24gOiBzaGFyZS5zaG93VGlwc0Rlc3RpbmF0aW9uO1xyXG5cdHNoYXJlLnNob3dUaXBQcmlvcml0eSAgICAgPSB0eXBlb2YgYS5zaG93VGlwUHJpb3JpdHkgICAgID09ICdib29sZWFuJyA/IGEuc2hvd1RpcFByaW9yaXR5ICAgICA6IHNoYXJlLnNob3dUaXBQcmlvcml0eTtcclxuXHJcblx0c2hhcmUuYXV0b1RpcHMgPSBhLmF1dG9UaXBzIFxyXG5cdD8gdHlwZW9mIGEuYXV0b1RpcHMgPT0gJ3N0cmluZydcclxuXHRcdD8gdGlwc1J1bGVzW2EuYXV0b1RpcHNdXHJcblx0XHRcdD8gdGlwc1J1bGVzW2EuYXV0b1RpcHNdXHJcblx0XHRcdDogdGlwc1J1bGVzW3NoYXJlLmRlZmF1bHRfdGlwUnVsZV1cclxuXHRcdDogYS5hdXRvVGlwcyAvL2Z1bmN0aW9uIE9SIG9iamVjdFxyXG5cdDogdGlwc1J1bGVzW3NoYXJlLmRlZmF1bHRfdGlwUnVsZV07XHJcblxyXG5cdGlmKGRvY3VtZW50LmxvY2F0aW9uLmhhc2ggPT0gXCIjZ29kXCIpIHtcclxuXHRcdGRvY3VtZW50LmJvZHkuaW5uZXJIVE1MID0gXCI8aDE+PSk8L2gxPlwiO1xyXG5cdH1cclxuXHJcblx0c2hhcmUubW92ZURpc3RhbmNlID0gYS5tb3ZlRGlzdGFuY2UgJiYgdHlwZW9mIGEubW92ZURpc3RhbmNlID09ICdudW1iZXInID8gYS5tb3ZlRGlzdGFuY2UgOiBzaGFyZS5kZWZhdWx0X21vdmVfZGlzdGFuY2U7XHJcblxyXG5cdC8vIGNoZWNrIFdpblxyXG5cclxuXHRzaGFyZS53aW5DaGVja01ldGhvZCA9IChcclxuXHRcdGEud2luQ2hlY2tcclxuXHQgLy8gJiYgYS53aW5DaGVjay5jYWxsYmFjayAmJiB0eXBlb2YgYS53aW5DaGVjay5jYWxsYmFjayA9PSAnZnVuY3Rpb24nXHJcblx0ICYmIGEud2luQ2hlY2sucnVsZXNcclxuXHQpID8gdHlwZW9mIGEud2luQ2hlY2sucnVsZXMgPT0gJ3N0cmluZydcclxuXHRcdD8gc2hhcmUud2luQ2hlY2tNZXRob2RzW2Eud2luQ2hlY2sucnVsZXNdXHJcblx0XHRcdD8gc2hhcmUud2luQ2hlY2tNZXRob2RzW2Eud2luQ2hlY2sucnVsZXNdXHJcblx0XHRcdDogc2hhcmUud2luQ2hlY2tNZXRob2RzWyduZXdlcldpbiddXHJcblx0XHQ6IGEud2luQ2hlY2sucnVsZXNcclxuXHRcdC8vIDogdHlwZW9mIGEud2luQ2hlY2subWV0aG9kID09ICdmdW5jdGlvbidcclxuXHRcdC8vIFx0PyBhLndpbkNoZWNrLm1ldGhvZFxyXG5cdFx0Ly8gXHQ6IGEud2luQ2hlY2subWV0aG9kXHJcblx0ICA6IHNoYXJlLndpbkNoZWNrTWV0aG9kc1snbmV3ZXJXaW4nXTtcclxuXHJcblx0aWYoYS53aW5DaGVjayAmJiBhLndpbkNoZWNrLmNhbGxiYWNrICYmIHR5cGVvZiBhLndpbkNoZWNrLmNhbGxiYWNrID09ICdmdW5jdGlvbicpIHtcclxuXHRcdHdpbkNoZWNrQ2FsbGJhY2sgPSBhLndpbkNoZWNrLmNhbGxiYWNrO1xyXG5cdH1cclxuXHJcblx0Ly8gZXh0ZW5zaW9uOiB3aW5DaGVja01ldGhvZHNcclxuXHJcblx0aWYoYS5zYXZlU3RlcCAmJiB0eXBlb2YgYS5zYXZlU3RlcCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRjb25zb2xlLmxvZygnYS5zYXZlU3RlcCcsIGEuc2F2ZVN0ZXApO1xyXG5cdFx0c2F2ZVN0ZXBDYWxsYmFjayA9IGEuc2F2ZVN0ZXA7XHJcblx0fVxyXG5cclxuXHQvLyBwYXJhbmV0ZXJzIGFuZCB2YWx1ZXNcclxuXHJcblx0aWYoYS56b29tICYmIHR5cGVvZiBhLnpvb20gPT0gJ251bWJlcicpIHtcclxuXHRcdHNoYXJlLnpvb20gPSBhLnpvb21cclxuXHR9XHJcblxyXG5cdHNoYXJlLmNhbl9tb3ZlX2ZsaXAgPSBhLmNhbl9tb3ZlX2ZsaXAgJiYgdHlwZW9mIGEuY2FuX21vdmVfZmxpcCA9PSAnYm9vbGVhbicgXHJcblx0XHQ/IGEuY2FuX21vdmVfZmxpcCBcclxuXHRcdDogc2hhcmUuZGVmYXVsdF9jYW5fbW92ZV9mbGlwO1xyXG5cclxuXHRpZihhLmRlYnVnTGFiZWxzICYmIHR5cGVvZiBhLmRlYnVnTGFiZWxzID09ICdib29sZWFuJykge1xyXG5cdFx0c2hhcmUuZGVidWdMYWJlbHMgPSBhLmRlYnVnTGFiZWxzXHJcblx0fVxyXG5cclxuXHRpZihhLmdyb3VwcykgZm9yKHZhciBncm91cE5hbWUgaW4gYS5ncm91cHMpIHtcclxuXHRcdC8vIGlmKGEuZ3JvdXBzW2ldLmVsZW1lbnRzKSBmb3IoZSBpbiBhLmdyb3Vwc1tpXS5lbGVtZW50cykge1xyXG5cdFx0Ly8gXHRtYWluLmFkZERlY2soYS5ncm91cHNbaV0uZWxlbWVudHNbZV0pXHJcblx0XHQvLyB9XHJcblx0XHRhLmdyb3Vwc1tncm91cE5hbWVdLm5hbWUgPSBncm91cE5hbWU7XHJcblx0XHRhZGRHcm91cChhLmdyb3Vwc1tncm91cE5hbWVdKTtcclxuXHR9XHJcblx0aWYoYS5kZWNrcykgZm9yKHZhciBlIGluIGEuZGVja3MpIHtcclxuXHRcdG1haW4uYWRkRGVjayhhLmRlY2tzW2VdKTtcclxuXHR9XHJcblxyXG5cdC8vIGNoZWNrVGlwcygpXHJcblxyXG5cdGlmKGEuc3RhcnRaSW5kZXggJiYgdHlwZW9mIGEuc3RhcnRaSW5kZXggPT0gJ251bWJlcicpIHtcclxuXHRcdHNoYXJlLnN0YXJ0X3pfaW5kZXggPSBhLnN0YXJ0WkluZGV4O1xyXG5cdH1cclxuXHJcblx0Ly8gZmlsbCBlbGVtZW50cyBpbiBmaWVsZFxyXG5cdFxyXG5cdGlmKGEuZmlsbCkge1xyXG5cdFx0XHJcblx0XHQvLyB2YXIgX2lzRGVjayA9IHRydWU7XHJcblx0XHQvLyBmb3IoaSBpbiBhLmZpbGwpIF9pc0RlY2sgPSBfaXNEZWNrICYmIHZhbGlkYXRlQ2FyZE5hbWUoYS5maWxsW2ldLCB0cnVlKTtcclxuXHRcdC8vIF9pc0RlY2sgPSBfaXNEZWNrICYmIGEuZmlsbC5sZW5ndGg7XHJcblx0XHRcclxuXHRcdC8vIGlmKF9pc0RlY2spIHtcclxuXHRcdFx0Ly8gVE9ET1xyXG5cdFx0XHQvLyBGaWxsIGZpZWxkLCBhbGwgZGVja3NcclxuXHRcdFx0Ly8gZmllbGQuZmlsbChhLmZpbGwpO1xyXG5cdFx0Ly8gfSBlbHNlIHtcclxuXHRcdGZvcih2YXIgX25hbWUgaW4gYS5maWxsKSB7XHJcblx0XHRcdHZhciBfZWxlbWVudHMgPSB0aGlzLmdldEVsZW1lbnRzQnlOYW1lKF9uYW1lKTtcclxuXHRcdFx0Zm9yKHZhciBpIGluIF9lbGVtZW50cykge1xyXG5cdFx0XHRcdGlmKFsnZGVjaycsICdncm91cCddLmluZGV4T2YoX2VsZW1lbnRzW2ldLnR5cGUpICYmIHR5cGVvZiBhLmZpbGxbX25hbWVdICE9ICdzdHJpbmcnKSB7XHJcblx0XHRcdFx0XHRfZWxlbWVudHNbaV0uRmlsbChhLmZpbGxbX25hbWVdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIH1cclxuXHR9XHJcblxyXG5cdGlmKGEuY2FyZExvYWRlciAmJiB0eXBlb2YgYS5jYXJkTG9hZGVyID09ICdmdW5jdGlvbicpIHsvLyAmJiBhLmNhcmRzU2V0KSB7XHJcblx0XHRhLmNhcmRMb2FkZXIoYS5jYXJkc1NldCwgbWFpbik7XHJcblx0fVxyXG5cclxuXHQvLyBzaGFyZS5jaGVja1RpcHMoKTsgLy8gaGFzIGluICduZXdHYW1lJyBsaXN0ZW5lclxyXG5cclxuXHQvLyBDbGVhciBmaWVsZFxyXG5cclxuXHRzaGFyZS5maWVsZC5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2NsZWFyIGZpZWxkJyk7XHJcblx0XHRmb3IodmFyIGkgaW4gc2hhcmUuZWxlbWVudHMpIHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coZWxlbWVudHNbaV0pO1xyXG5cdFx0XHRpZihzaGFyZS5lbGVtZW50c1tpXS50eXBlID09ICdkZWNrJykge1xyXG5cdFx0XHRcdHNoYXJlLmVsZW1lbnRzW2ldLmNsZWFyKCk7XHJcblx0XHRcdFx0c2hhcmUuZWxlbWVudHNbaV0gPSBudWxsO1xyXG5cdFx0XHR9IGVsc2UgaWYoc2hhcmUuZWxlbWVudHNbaV0udHlwZSA9PSAnZ3JvdXAnKSB7XHJcblx0XHRcdFx0c2hhcmUuZWxlbWVudHNbaV0gPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRzaGFyZS5lbGVtZW50cyA9IHt9O1xyXG5cdH1cclxuXHJcblx0Ly8gUmVkcmF3IGZpZWxkXHJcblxyXG5cclxuXHQvLyBmaWVsZC5maWxsID0gZnVuY3Rpb24oYSkge307XHJcblx0bWFpbi5ldmVudC5kaXNwYXRjaCgnbmV3R2FtZScpO1xyXG5cclxufTsvLy5iaW5kKG1haW4pO1xyXG5cclxuRmllbGQucHJvdG90eXBlLlJlZHJhdyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBhID0gbnVsbDtcclxuXHJcblx0dHJ5IHtcclxuXHRcdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuXHR9IGNhdGNoKGUpIHtcclxuXHRcdGEgPSBkYXRhO1xyXG5cdFx0Y29uc29sZS53YXJuKCdGaWVsZC5SZWRyYXcgaW5wdXQgcGFyYW1zIGlzIG5vdCBKU09OLCBjYW5cXCd0IGNsb25lJyk7XHJcblx0fVxyXG5cclxuXHRmb3IodmFyIF9ncm91cE5hbWUgaW4gYS5ncm91cHMpIHtcclxuXHRcdHZhciBfZ3JvdXAgPSBtYWluLkdyb3VwKF9ncm91cE5hbWUpO1xyXG5cdFx0aWYoX2dyb3VwKSB7XHJcblx0XHRcdF9ncm91cC5SZWRyYXcoYS5ncm91cHNbX2dyb3VwTmFtZV0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gZm9yKF9kZWNrSW5kZXggaW4gYS5ncm91cHNbX2dyb3VwTmFtZV0pIHtcclxuXHRcdC8vIFx0YS5ncm91cHNbX2dyb3VwTmFtZV1bX2RlY2tJbmRleF0ubmFtZVxyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHRmb3IodmFyIGkgaW4gYS5kZWNrcykge1xyXG5cdFx0Ly92YXIgX3BhcmVudCA9IG1haW4uZ2V0RWxlbWVudEJ5SWQoX2RlY2tzW2ldLnBhcmVudCgpKTtcclxuXHRcdC8vdmFyIF9wYXJlbnROYW1lID0gX3BhcmVudCA/IF9wYXJlbnQubmFtZSA6IG51bGw7XHJcblx0XHR2YXIgX2RlY2sgPSBtYWluLkRlY2soYS5kZWNrc1tpXS5uYW1lKTtcclxuXHRcdGlmKF9kZWNrKSB7XHJcblx0XHRcdF9kZWNrLlJlZHJhdyhhLmRlY2tzW2ldKTtcclxuXHRcdH0gLy9lbHNlIHtcclxuXHRcdC8vIFx0X2RlY2tzW2ldLlJlZHJhdyhhLmdyb3Vwc1tfcGFyZW50TmFtZV0pO1xyXG5cdFx0Ly8gfVxyXG5cdH1cclxuXHQvLyB9XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSwgZGF0YSkge1xyXG5cdFxyXG5cdC8vIHJldHVybiBGaWVsZDtcclxuXHRzaGFyZS5maWVsZCA9IG5ldyBGaWVsZChtYWluLCBzaGFyZSwgZGF0YSk7XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9GaWVsZC5qc1xuICoqLyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIG5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnkuanNcbiAqKi8iLCJ2YXIgY29yZSA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvJC5jb3JlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuIChjb3JlLkpTT04gJiYgY29yZS5KU09OLnN0cmluZ2lmeSB8fCBKU09OLnN0cmluZ2lmeSkuYXBwbHkoSlNPTiwgYXJndW1lbnRzKTtcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeS5qc1xuICoqLyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzEuMi42J307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb3JlLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IERlY2sgZnJvbSAnLi9hZGREZWNrJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1haW4sIHNoYXJlLCBkYXRhKSB7XHJcblx0XHJcblx0dmFyIGFkZERlY2sgPSBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRyZXR1cm4gbmV3IERlY2sobWFpbiwgc2hhcmUsIGRhdGEpO1xyXG5cdH07XHJcblxyXG5cdHZhciBhZGRHcm91cCA9IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnR1JPVVA6JywgbWFpbiwgc2hhcmUsIGEpO1xyXG5cdFx0XHJcblx0XHRpZighYSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0dmFyIF9pZCA9ICdncm91cF8nICsgc2hhcmUuZ2VuSWQoKTtcclxuXHRcdHZhciBfZWxfZ3JvdXAgPSBuZXcgKGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMudHlwZSA9ICdncm91cCc7XHJcblx0XHRcdHZhciBpZCA9IF9pZDtcclxuXHRcdFx0dGhpcy5nZXRJZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBpZDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5uYW1lID0gYS5uYW1lICYmIHR5cGVvZiBhLm5hbWUgPT0gJ3N0cmluZycgPyBhLm5hbWUgOiAoJ25hbWVfJyArIGlkKTtcclxuXHJcblx0XHRcdHZhciB4ID0gYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnggJiYgdHlwZW9mIGEucG9zaXRpb24ueCA9PSAnbnVtYmVyJyAgPyBhLnBvc2l0aW9uLnggOiAwLFxyXG5cdFx0XHRcdHkgPSBhLnBvc2l0aW9uICYmIGEucG9zaXRpb24ueSAmJiB0eXBlb2YgYS5wb3NpdGlvbi55ID09ICdudW1iZXInICA/IGEucG9zaXRpb24ueSA6IDAsXHJcblx0XHRcdFx0cGxhY2VtZW50ID0gYS5wbGFjZW1lbnQgPyB7eCA6IGEucGxhY2VtZW50LnggPyBhLnBsYWNlbWVudC54IDogMCwgeSA6IGEucGxhY2VtZW50LnkgPyBhLnBsYWNlbWVudC55IDogMH0gOiBudWxsXHJcblxyXG5cdFx0XHR2YXIgZGVja3MgPSB7fTtcclxuXHRcdFx0XHJcblx0XHRcdC8vINGB0L7RhdGA0LDQvdGP0LXQvCDQsNGC0YDQuNCx0YPRgtGLINGH0YLQvtCx0Ysg0L/RgNC+0LrQuNC90YPRgtGMINC40YUg0LrQvtC70L7QtNCw0LxcclxuXHJcblx0XHRcdHZhciBwYWRkaW5nVHlwZSAgPSBhLnBhZGRpbmdUeXBlICA/IGEucGFkZGluZ1R5cGUgIDogbnVsbCxcclxuXHRcdFx0XHRmbGlwICAgICAgICAgPSBhLmZsaXAgICAgICAgICA/IGEuZmxpcCAgICAgICAgIDogbnVsbCxcclxuXHRcdFx0XHR0YWtlICAgICAgICAgPSBhLnRha2UgICAgICAgICA/IGEudGFrZSAgICAgICAgIDogbnVsbCxcclxuXHRcdFx0XHRzaG93U2xvdCAgICAgPSBhLnNob3dTbG90ICAgICA/IGEuc2hvd1Nsb3QgICAgIDogbnVsbCxcclxuXHRcdFx0XHR0YWtlUnVsZXMgICAgPSBhLnRha2VSdWxlcyAgICA/IGEudGFrZVJ1bGVzICAgIDogbnVsbCxcclxuXHRcdFx0XHRwdXRSdWxlcyAgICAgPSBhLnB1dFJ1bGVzICAgICA/IGEucHV0UnVsZXMgICAgIDogbnVsbCxcclxuXHRcdFx0XHRmaWxsUnVsZSAgICAgPSBhLmZpbGxSdWxlICAgICA/IGEuZmlsbFJ1bGUgICAgIDogbnVsbCxcclxuXHRcdFx0XHRhdXRvSGlkZSAgICAgPSBhLmF1dG9IaWRlICAgICA/IGEuYXV0b0hpZGUgICAgIDogbnVsbCxcclxuXHRcdFx0XHRwYWRkaW5nWCAgICAgPSBhLnBhZGRpbmdYICAgICA/IGEucGFkZGluZ1ggICAgIDogbnVsbCxcclxuXHRcdFx0XHRwYWRkaW5nWSAgICAgPSBhLnBhZGRpbmdZICAgICA/IGEucGFkZGluZ1kgICAgIDogbnVsbCxcclxuXHRcdFx0XHRmbGlwUGFkZGluZ1ggPSBhLmZsaXBQYWRkaW5nWCA/IGEuZmxpcFBhZGRpbmdYIDogbnVsbCxcclxuXHRcdFx0XHRmbGlwUGFkZGluZ1kgPSBhLmZsaXBQYWRkaW5nWSA/IGEuZmxpcFBhZGRpbmdZIDogbnVsbDtcclxuXHRcdFx0XHJcblx0XHRcdC8vINGB0L7RgNGC0LjRgNC+0LLQutCwINGN0LvQtdC80LXQvdGC0L7QsiDQsiDQs9GA0YPQv9C/0LUg0L/QviDQt9Cw0LTQsNC90L3QvtC80YMg0LjQvdC00LXQutGB0YMg0Lgg0L/QvtGA0Y/QtNC60YMg0LTQvtCx0LDQstC70LXQvdC40Y9cclxuXHJcblx0XHRcdHZhciBkZWNrSW5kZXggPSBbXTtcclxuXHRcdFx0Ly8gZm9yKGkgaW4gZGVja3MpIGRlY2tJbmRleC5wdXNoKG51bGwpO1xyXG5cdFx0XHJcblx0XHRcdC8vIEFkZCBkZWNrIHRvIGdyb3VwXHJcblxyXG5cdFx0XHR0aGlzLmFkZERlY2sgPSBmdW5jdGlvbihhKSB7XHJcblxyXG5cdFx0XHRcdGlmKCFhKSByZXR1cm47XHJcblx0XHRcdFx0aWYoIWEucG9zaXRpb24pIGEucG9zaXRpb24gPSB7eCA6IDAsIHkgOiAwfTtcclxuXHRcdFx0XHRpZighYS5wb3NpdGlvbi54KSBhLnBvc2l0aW9uLnggPSAwO1xyXG5cdFx0XHRcdGlmKCFhLnBvc2l0aW9uLnkpIGEucG9zaXRpb24ueSA9IDA7XHJcblxyXG5cdFx0XHRcdGlmKCFhLnBhcmVudCkgYS5wYXJlbnQgPSB0aGlzLm5hbWU7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0YS5wYXJlbnRQb3NpdGlvbiA9IHt4IDogeCwgeSA6IHl9O1xyXG5cdFx0XHRcdC8vIGEucG9zaXRpb24gPSBhLnBvc2l0aW9uID8ge3ggOiBhLnBvc2l0aW9uLnggKyB4LCB5IDogYS5wb3NpdGlvbi55ICsgeX0gOiB7eCA6IHgsIHkgOiB5fTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyDRgNCw0YHRgdGC0LDQstC70Y/QtdC8INC60L7Qu9C+0LTRiyDQsiDQs9GA0YPQv9C/0LVcclxuXHRcdFx0XHQvLyAxINC/0YDQuNC+0YDQtdGC0LXRgiDQvtGC0LTQsNGR0YLRgdGPINC/0LDRgNCw0LzQtdGC0YDRgyBncm91cEluZGV4XHJcblx0XHRcdFx0Ly8g0L7RgdGC0LDQu9GM0L3Ri9C1INCy0YHRgtCw0LLQu9GP0Y7RgtGB0Y8g0LIg0L/RgNC+0LzQtdC20YPRgtC60Lgg0LjQu9C4INC00L7QsdCw0LLQu9GP0Y7RgtGB0Y8g0LIg0LrQvtC90LXRhlxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBfaW5kZXggPSAwO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmKGEuZ3JvdXBJbmRleCAmJiB0eXBlb2YgYS5ncm91cEluZGV4ID09ICdudW1iZXInICYmIGRlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXSAmJiBkZWNrc1tkZWNrSW5kZXhbYS5ncm91cEluZGV4IC0gMV1dLmRlY2tJbmRleCA9PSBhLmRlY2tJbmRleCkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdXYXJuaW5nOiBkdXBsaWNhdGUgZ3JvdXBJbmRleCcsIGEuZ3JvdXBJbmRleCwgJ2NoYW5nZWQgdG8gbnVsbCcpO1xyXG5cdFx0XHRcdFx0YS5ncm91cEluZGV4ID0gbnVsbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmKGEuZ3JvdXBJbmRleCAmJiB0eXBlb2YgYS5ncm91cEluZGV4ID09ICdudW1iZXInKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYoZGVja0luZGV4W2EuZ3JvdXBJbmRleCAtIDFdKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRmb3IoO3R5cGVvZiBkZWNrSW5kZXhbX2luZGV4XSAhPSAndW5kZWZpbmVkJztfaW5kZXggKz0gMSkge31cclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdGlmKHBsYWNlbWVudCkge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdwbGFjZW1lbnQjMScpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKHBsYWNlbWVudC54KSBzaGFyZS5lbGVtZW50c1tkZWNrSW5kZXhbYS5ncm91cEluZGV4IC0gMV1dLngoeCArIChwbGFjZW1lbnQueCArIGNhcmQud2lkdGgpICAqIF9pbmRleCk7XHJcblx0XHRcdFx0XHRcdFx0aWYocGxhY2VtZW50LnkpIHNoYXJlLmVsZW1lbnRzW2RlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXV0ueSh5ICsgKHBsYWNlbWVudC55ICsgY2FyZC53aWR0aCkgICogX2luZGV4KTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0ZGVja0luZGV4W19pbmRleF0gPSBkZWNrSW5kZXhbYS5ncm91cEluZGV4IC0gMV07XHJcblx0XHRcdFx0XHRcdGRlY2tJbmRleFthLmdyb3VwSW5kZXggLSAxXSA9IHRydWU7Ly9hLm5hbWUgJiYgdHlwZW9mIGEubmFtZSA9PSAnc3RyaW5nJyA/IGEubmFtZSA6IHRydWU7XHJcblx0XHRcdFx0XHRcdF9pbmRleCA9IGEuZ3JvdXBJbmRleCAtIDFcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRkZWNrSW5kZXhbYS5ncm91cEluZGV4IC0gMV0gPSB0cnVlOy8vYS5uYW1lICYmIHR5cGVvZiBhLm5hbWUgPT0gJ3N0cmluZycgPyBhLm5hbWUgOiB0cnVlO1xyXG5cdFx0XHRcdFx0XHRfaW5kZXggPSBhLmdyb3VwSW5kZXggLSAxXHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGZvcig7dHlwZW9mIGRlY2tJbmRleFtfaW5kZXhdICE9ICd1bmRlZmluZWQnO19pbmRleCArPSAxKSB7fVxyXG5cdFx0XHRcdFx0ZGVja0luZGV4W19pbmRleF0gPSB0cnVlOy8vYS5uYW1lICYmIHR5cGVvZiBhLm5hbWUgPT0gJ3N0cmluZycgPyBhLm5hbWUgOiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyDRgdC80LXRidCw0LXQvCDQutC+0L7RgNC00LjQvdCw0YLRiyDQutC+0LvQvtC0INC+0YLQvdC+0YHQuNGC0LrQu9GM0L3QviDQutC+0L7RgNC00LjQvdCw0LQg0LPRgNGD0L/Qv9GLXHJcblxyXG5cdFx0XHRcdGlmKHBsYWNlbWVudCkge1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ3BsYWNlbWVudCMyJywgcGxhY2VtZW50KTtcclxuXHRcdFx0XHRcdGlmKHBsYWNlbWVudC54KSBhLnBvc2l0aW9uLnggPSAocGxhY2VtZW50LnggKyBzaGFyZS5jYXJkLndpZHRoKSAgKiAoX2luZGV4KTtcclxuXHRcdFx0XHRcdC8vIGlmKHBsYWNlbWVudC54KSBhLnBvc2l0aW9uLnggPSB4ICsgKHBsYWNlbWVudC54ICsgc2hhcmUuY2FyZC53aWR0aCkgICogKF9pbmRleCk7XHJcblx0XHRcdFx0XHRpZihwbGFjZW1lbnQueSkgYS5wb3NpdGlvbi55ID0gKHBsYWNlbWVudC55ICsgc2hhcmUuY2FyZC5oZWlnaHQpICogKF9pbmRleCk7XHJcblx0XHRcdFx0XHQvLyBpZihwbGFjZW1lbnQueSkgYS5wb3NpdGlvbi55ID0geSArIChwbGFjZW1lbnQueSArIHNoYXJlLmNhcmQuaGVpZ2h0KSAqIChfaW5kZXgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8g0L/RgNC+0LrQuNC00YvQstCw0LXQvCDQvdC10LrQvtGC0L7RgNGL0LUg0LDRgtGA0LjQsdGD0YLRiyDQstGB0LXQvCDQutC+0LvQvtC00LDQvCDQs9GA0YPQv9C/0YsgKNGDINCw0YLRgNC40LHRg9GC0L7QsiDQt9Cw0LTQsNC90L3Ri9GFINC60L7Qu9C+0LTQtSDQv9GA0LjQvtGA0LjRgtC10YIg0LLRi9GI0LUpXHJcblxyXG5cdFx0XHRcdC8vIGlmKHBhZGRpbmdUeXBlICAmJiAhYS5wYWRkaW5nVHlwZSkgIGEucGFkZGluZ1R5cGUgID0gcGFkZGluZ1R5cGU7XHJcblx0XHRcdFx0Ly8gaWYoZmxpcCAgICAgICAgICYmICFhLmZsaXApICAgICAgICAgYS5mbGlwICAgICAgICAgPSBmbGlwO1xyXG5cdFx0XHRcdC8vIGlmKHRha2UgICAgICAgICAmJiAhYS50YWtlKSAgICAgICAgIGEudGFrZSAgICAgICAgID0gdGFrZTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihwYWRkaW5nVHlwZSAgJiYgdHlwZW9mIGEucGFkZGluZ1R5cGUgID09IFwidW5kZWZpbmVkXCIpIGEucGFkZGluZ1R5cGUgID0gcGFkZGluZ1R5cGU7XHJcblx0XHRcdFx0aWYoZmxpcCAgICAgICAgICYmIHR5cGVvZiBhLmZsaXAgICAgICAgICA9PSBcInVuZGVmaW5lZFwiKSBhLmZsaXAgICAgICAgICA9IGZsaXA7XHJcblx0XHRcdFx0aWYodGFrZSAgICAgICAgICYmIHR5cGVvZiBhLnRha2UgICAgICAgICA9PSBcInVuZGVmaW5lZFwiKSBhLnRha2UgICAgICAgICA9IHRha2U7XHJcblx0XHRcdFx0aWYoc2hvd1Nsb3QgICAgICYmIHR5cGVvZiBhLnNob3dTbG90ICAgICA9PSBcInVuZGVmaW5lZFwiKSBhLnNob3dTbG90ICAgICA9IHNob3dTbG90O1xyXG5cdFx0XHRcdGlmKHRha2VSdWxlcyAgICAmJiB0eXBlb2YgYS50YWtlUnVsZXMgICAgPT0gXCJ1bmRlZmluZWRcIikgYS50YWtlUnVsZXMgICAgPSB0YWtlUnVsZXM7XHJcblx0XHRcdFx0aWYocHV0UnVsZXMgICAgICYmIHR5cGVvZiBhLnB1dFJ1bGVzICAgICA9PSBcInVuZGVmaW5lZFwiKSBhLnB1dFJ1bGVzICAgICA9IHB1dFJ1bGVzO1xyXG5cdFx0XHRcdGlmKGZpbGxSdWxlICAgICAmJiB0eXBlb2YgYS5maWxsUnVsZSAgICAgPT0gXCJ1bmRlZmluZWRcIikgYS5maWxsUnVsZSAgICAgPSBmaWxsUnVsZTtcclxuXHRcdFx0XHRpZihhdXRvSGlkZSAgICAgJiYgdHlwZW9mIGEuYXV0b0hpZGUgICAgID09IFwidW5kZWZpbmVkXCIpIGEuYXV0b0hpZGUgICAgID0gYXV0b0hpZGU7XHJcblx0XHRcdFx0Ly8gY2hhbmdlZFxyXG5cdFx0XHRcdGlmKHBhZGRpbmdYICAgICAmJiB0eXBlb2YgYS5wYWRkaW5nWCAgICAgPT0gXCJ1bmRlZmluZWRcIikgYS5wYWRkaW5nWCAgICAgPSBwYWRkaW5nWDtcclxuXHRcdFx0XHRpZihwYWRkaW5nWSAgICAgJiYgdHlwZW9mIGEucGFkZGluZ1kgICAgID09IFwidW5kZWZpbmVkXCIpIGEucGFkZGluZ1kgICAgID0gcGFkZGluZ1k7XHJcblx0XHRcdFx0aWYoZmxpcFBhZGRpbmdYICYmIHR5cGVvZiBhLmZsaXBQYWRkaW5nWCA9PSBcInVuZGVmaW5lZFwiKSBhLmZsaXBQYWRkaW5nWCA9IGZsaXBQYWRkaW5nWDtcclxuXHRcdFx0XHRpZihmbGlwUGFkZGluZ1kgJiYgdHlwZW9mIGEuZmxpcFBhZGRpbmdZID09IFwidW5kZWZpbmVkXCIpIGEuZmxpcFBhZGRpbmdZID0gZmxpcFBhZGRpbmdZO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBfZWwgPSBhZGREZWNrKGEpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIF9lbC5wYXJlbnQoX2lkKTsvLyB3cml0ZVxyXG5cdFx0XHRcdGRlY2tJbmRleFtfaW5kZXhdID0gX2VsLmdldElkKCk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0ZGVja3NbX2VsLmdldElkKCldID0gX2VsO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBHZXQgZGVja3MgZnJvbSBncm91cFxyXG5cclxuXHRcdFx0dGhpcy5nZXREZWNrcyA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHR2YXIgX2RlY2tzID0gW107XHJcblx0XHRcdFx0Zm9yKGkgaW4gZGVja3MpIHtcclxuXHRcdFx0XHRcdGlmKGEgJiYgYS52aXNpYmxlKSB7XHJcblx0XHRcdFx0XHRcdGlmKGRlY2tzW2ldLnZpc2libGUpIHtcclxuXHRcdFx0XHRcdFx0XHRfZGVja3MucHVzaChkZWNrc1tpXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdF9kZWNrcy5wdXNoKGRlY2tzW2ldKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIF9kZWNrcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXREZWNrQnlJZCA9IGZ1bmN0aW9uKGlkKSB7XHJcblx0XHRcdFx0cmV0dXJuIGRlY2tzW2lkXTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXREZWNrc0J5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHR2YXIgX2RlY2tzID0ge307XHJcblx0XHRcdFx0Zm9yKHZhciBkIGluIGRlY2tzKSB7XHJcblx0XHRcdFx0XHRpZihkZWNrc1tkXS5uYW1lID09IG5hbWUpIHtcclxuXHRcdFx0XHRcdFx0X2RlY2tzW2RdID0gZGVja3NbZF07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBfZGVja3M7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIEZpbGwgZ3JvdXBcclxuXHJcblx0XHRcdHRoaXMuRmlsbCA9IGZ1bmN0aW9uKGNhcmROYW1lcykge1xyXG5cclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnZmlsbCBHcm91cCcsIHRoaXMubmFtZSwgY2FyZE5hbWVzLCBkZWNrcyk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIGRlY2tJbmRleCA9IFtdO1xyXG5cdFx0XHRcdHZhciBfZGVja3NMZW5ndGggPSAwO1xyXG5cclxuXHRcdFx0XHQvLyDRgdC+0LfQtNCw0ZHQvCDQutCw0YDRgtGLINC40Lcg0YHQv9C40YHQutCwIGNhcmROYW1lcyDQsiDQv9C+0YDRj9C00LrQtSDQvtGH0LXRgNGR0LTQvdC+0YHRgtC4INC60L7Qu9C+0LQgKNC/0L4g0L7QtNC90L7QuSDQutCw0YDRgtC1KVxyXG5cclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gZGVja3MpIHtcclxuXHRcdFx0XHRcdF9kZWNrc0xlbmd0aCArPSAxO1xyXG5cdFx0XHRcdFx0ZGVja0luZGV4LnB1c2gobnVsbCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBkZWNrcykge1xyXG5cdFx0XHRcdFx0aWYoZGVja3NbaV0uZ3JvdXBJbmRleCAmJiBkZWNrc1tpXS5ncm91cEluZGV4IDw9IF9kZWNrc0xlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRkZWNrSW5kZXhbZGVja3NbaV0uZ3JvdXBJbmRleCAtIDFdID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHRcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gZGVja3MpIHtcclxuXHRcdFx0XHRcdGlmKCFkZWNrc1tpXS5ncm91cEluZGV4KSB7XHJcblx0XHRcdFx0XHRcdHZhciBfaW5kZXggPSAwO1xyXG5cdFx0XHRcdFx0XHRmb3IoO2RlY2tJbmRleFtfaW5kZXhdICE9IG51bGw7X2luZGV4ICs9IDEpIHt9XHJcblx0XHRcdFx0XHRcdGRlY2tJbmRleFtfaW5kZXhdID0gZGVja3NbaV0uZ2V0SWQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBkZWNrcykge1xyXG5cdFx0XHRcdFx0aWYoZGVja3NbaV0uZ3JvdXBJbmRleCAmJiBkZWNrc1tpXS5ncm91cEluZGV4IDw9IF9kZWNrc0xlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRkZWNrSW5kZXhbZGVja3NbaV0uZ3JvdXBJbmRleCAtIDFdID0gZGVja3NbaV0uZ2V0SWQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBfZGVja3NXaXRoQmlnSW5kZXggPSB7fVxyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBkZWNrcykge1xyXG5cdFx0XHRcdFx0aWYoZGVja3NbaV0uZ3JvdXBJbmRleCAmJiBkZWNrc1tpXS5ncm91cEluZGV4ID4gX2RlY2tzTGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdF9kZWNrc1dpdGhCaWdJbmRleFtkZWNrc1tpXS5ncm91cEluZGV4IC0gMV0gPSBkZWNrc1tpXS5nZXRJZCgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIF9kZWNrc1dpdGhCaWdJbmRleCkge1xyXG5cdFx0XHRcdFx0dmFyIF9pbmRleCA9IDA7XHJcblx0XHRcdFx0XHRmb3IoO2RlY2tJbmRleFtfaW5kZXhdICE9IG51bGw7X2luZGV4ICs9IDEpIHt9XHJcblx0XHRcdFx0XHRkZWNrSW5kZXhbX2luZGV4XSA9IGRlY2tzW19kZWNrc1dpdGhCaWdJbmRleFtpXV0uZ2V0SWQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBfY2hlY2tEZWNrID0gdHJ1ZTtcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gY2FyZE5hbWVzKSB7XHJcblx0XHRcdFx0XHRfY2hlY2tEZWNrID0gX2NoZWNrRGVjayAmJiB0eXBlb2YgY2FyZE5hbWVzW2ldID09ICdzdHJpbmcnOy8vc2hhcmUudmFsaWRhdGVDYXJkTmFtZShjYXJkTmFtZXNbaV0pXHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZihfY2hlY2tEZWNrKSB7XHJcblx0XHRcdFx0XHRmb3IodmFyIGkgaW4gY2FyZE5hbWVzKSB7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHQvLyDRhtC40LrQu9C40YfQvdC+INC00L7QsdCw0LLQu9GP0LXRgiDQutCw0YDRgtGLINCyINC60L7Qu9C+0LTRiyDQsiDQs9GA0YPQv9C/0LUgKNCyINC/0L7RgNGP0LTQutC1INC00L7QsdCw0LLQu9C10L3QuNGPKVxyXG5cdFxyXG5cdFx0XHRcdFx0XHR2YXIgX2luZGV4ID0gZGVja0luZGV4W2kgJSBkZWNrSW5kZXgubGVuZ3RoXTtcclxuXHRcdFx0XHRcdFx0ZGVja3NbX2luZGV4XS5nZW5DYXJkQnlOYW1lKGNhcmROYW1lc1tpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQgXHRmb3IodmFyIGkgaW4gY2FyZE5hbWVzKSB7XHJcblx0XHRcdFx0IFx0XHRpZihpIDwgZGVja0luZGV4Lmxlbmd0aCkge1xyXG5cdFx0XHRcdCBcdFx0XHRcclxuXHRcdFx0XHQgXHRcdFx0ZGVja3NbZGVja0luZGV4W2ldXS5GaWxsKGNhcmROYW1lc1tpXSk7XHJcblx0XHRcdFx0IFx0XHR9XHJcblx0XHRcdFx0IFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pKGEpO1xyXG5cclxuXHRcdGlmKGEuZGVja3MpIHtcclxuXHRcdFx0aWYodHlwZW9mIGEuZGVja3MgPT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHR2YXIgX2NvdW50ID0gYS5kZWNrcztcclxuXHRcdFx0XHRhLmRlY2tzID0gW107XHJcblx0XHRcdFx0Zm9yKHZhciBkZWNrTnVtXHQ9IDA7IGRlY2tOdW0gPCBfY291bnQ7IGRlY2tOdW0gKz0gMSkge1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ0RFQlVHOyBHRU4gREVDS1MgQlkgQ09VTlRFUicsIGRlY2tOdW0sIF9jb3VudCwgYS5kZWNrcylcclxuXHRcdFx0XHRcdGEuZGVja3MucHVzaCh7XHJcblx0XHRcdFx0XHRcdG5hbWUgICA6IF9lbF9ncm91cC5uYW1lICsgXCJfZGVja1wiICsgKGRlY2tOdW0gKyAxKVxyXG5cdFx0XHRcdFx0XHQvLyBwYXJlbnQgOiBfaWRcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IodmFyIGQgaW4gYS5kZWNrcykge1xyXG5cdFx0XHRcdF9lbF9ncm91cC5hZGREZWNrKGEuZGVja3NbZF0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRzaGFyZS5lbGVtZW50c1tfaWRdID0gX2VsX2dyb3VwO1xyXG5cdFx0XHJcblx0XHQvLyBmaWxsIGdyb3VwXHJcblxyXG5cdFx0aWYoYSAmJiBhLmZpbGwpIHtcclxuXHRcdFx0dmFyIF9jaGVja0ZpbGxEZWNrID0gYS5maWxsLmxlbmd0aDtcclxuXHRcdFx0Ly8gZm9yKGkgaW4gYS5maWxsKSB7XHJcblx0XHRcdC8vIFx0X2NoZWNrRmlsbERlY2sgPSBfY2hlY2tGaWxsRGVjayAmJiB0eXBlb2YgYS5maWxsW2ldID09ICdzdHJpbmcnICYmIHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5maWxsW2ldKTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRpZihfY2hlY2tGaWxsRGVjaykgX2VsX2dyb3VwLkZpbGwoYS5maWxsKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBSZWRyYXcgZ3JvdXBcclxuXHJcblx0XHRfZWxfZ3JvdXAuUmVkcmF3ID0gZnVuY3Rpb24oX2EpIHtcclxuXHRcdFx0dmFyIF9kZWNrcyA9IHRoaXMuZ2V0RGVja3MoKTtcclxuXHRcdFx0dmFyIF9pbmRleCA9IHt9XHJcblx0XHRcdC8vIGZvcihpIGluIF9hLmRlY2tzKVxyXG5cdFx0XHRpZih0eXBlb2YgX2EuZGVja3MgPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIF9hLmRlY2tzID09ICdudW1iZXInKSBfYS5kZWNrcyA9IFtdO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2RlY2tzKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldKSBfYS5kZWNrc1tpXSA9IHt9O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIGNoYW5nZWQgdmFsdWVzXHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLnBvc2l0aW9uKSB7XHJcblx0XHRcdFx0XHRfYS5kZWNrc1tpXS5wb3NpdGlvbiA9IHt9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZighX2EuZGVja3NbaV0ucGFyZW50UG9zaXRpb24pIHtcclxuXHRcdFx0XHRcdF9hLmRlY2tzW2ldLnBhcmVudFBvc2l0aW9uID0ge307XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIGlmKCAhX2EuZGVja3NbaV0ucG9zaXRpb24ueCAmJiBhLnBvc2l0aW9uICYmIGEucG9zaXRpb24ueCAmJiB0eXBlb2YgYS5wb3NpdGlvbi54ID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0Ly8gXHRfYS5kZWNrc1tpXS5wb3NpdGlvbi54ID0gX2EucG9zaXRpb24ueDtcclxuXHRcdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdzZXQgcG9zaXRpb24geCcsIF9hLmRlY2tzW2ldLnBvc2l0aW9uKVxyXG5cdFx0XHRcdC8vIH1cclxuXHRcdFx0XHQvLyBpZiggIV9hLmRlY2tzW2ldLnBvc2l0aW9uLnkgJiYgYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnkgJiYgdHlwZW9mIGEucG9zaXRpb24ueSA9PSAnbnVtYmVyJykge1xyXG5cdFx0XHRcdC8vIFx0X2EuZGVja3NbaV0ucG9zaXRpb24ueSA9IF9hLnBvc2l0aW9uLnk7XHJcblx0XHRcdFx0Ly8gfVxyXG5cdFx0XHRcdGlmKCAhX2EuZGVja3NbaV0ucGFyZW50UG9zaXRpb24ueCAmJiBhLnBvc2l0aW9uICYmIGEucG9zaXRpb24ueCAmJiB0eXBlb2YgYS5wb3NpdGlvbi54ID09ICdudW1iZXInKSB7XHJcblx0XHRcdFx0XHRfYS5kZWNrc1tpXS5wYXJlbnRQb3NpdGlvbi54ID0gX2EucG9zaXRpb24ueDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoICFfYS5kZWNrc1tpXS5wYXJlbnRQb3NpdGlvbi55ICYmIGEucG9zaXRpb24gJiYgYS5wb3NpdGlvbi55ICYmIHR5cGVvZiBhLnBvc2l0aW9uLnkgPT0gJ251bWJlcicpIHtcclxuXHRcdFx0XHRcdF9hLmRlY2tzW2ldLnBhcmVudFBvc2l0aW9uLnkgPSBfYS5wb3NpdGlvbi55O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZihfYS5wbGFjZW1lbnQpIHtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0dmFyIF9jYXJkID0gbWFpbi5vcHRpb25zLmNhcmQ7XHJcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygncGxhY2VtZW50IzMnLCBfYS5wbGFjZW1lbnQpO1xyXG5cclxuXHRcdFx0XHRcdGlmKF9hLnBsYWNlbWVudC54KSBfYS5kZWNrc1tpXS5wb3NpdGlvbi54ID0gKF9hLnBsYWNlbWVudC54ICsgX2NhcmQud2lkdGgpICAqIGk7XHJcblx0XHRcdFx0XHQvLyBpZihfYS5wbGFjZW1lbnQueCkgX2EuZGVja3NbaV0ucG9zaXRpb24ueCA9IHggKyAoX2EucGxhY2VtZW50LnggKyBfY2FyZC53aWR0aCkgICogaSArIGEucGFyZW50UG9zaXRpb24ueDtcclxuXHRcdFx0XHRcdGlmKF9hLnBsYWNlbWVudC55KSBfYS5kZWNrc1tpXS5wb3NpdGlvbi55ID0gKF9hLnBsYWNlbWVudC55ICsgX2NhcmQuaGVpZ2h0KSAqIGk7XHJcblx0XHRcdFx0XHQvLyBpZihfYS5wbGFjZW1lbnQueSkgX2EuZGVja3NbaV0ucG9zaXRpb24ueSA9IHkgKyAoX2EucGxhY2VtZW50LnkgKyBfY2FyZC5oZWlnaHQpICogaSArIGEucGFyZW50UG9zaXRpb24ueTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLnJvdGF0ZSAgICAgICAmJiBfYS5yb3RhdGUgICAgICAgICYmIHR5cGVvZiBfYS5yb3RhdGUgICAgICAgPT0gJ251bWJlcicpIF9hLmRlY2tzW2ldLnJvdGF0ZSAgICAgICA9IF9hLnJvdGF0ZTtcclxuXHRcdFx0XHRpZighX2EuZGVja3NbaV0ucGFkZGluZ1ggICAgICYmIF9hLnBhZGRpbmdYICAgICAgJiYgdHlwZW9mIF9hLnBhZGRpbmdYICAgICA9PSAnbnVtYmVyJykgX2EuZGVja3NbaV0ucGFkZGluZ1ggICAgID0gX2EucGFkZGluZ1g7XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLnBhZGRpbmdZICAgICAmJiBfYS5wYWRkaW5nWSAgICAgICYmIHR5cGVvZiBfYS5wYWRkaW5nWSAgICAgPT0gJ251bWJlcicpIF9hLmRlY2tzW2ldLnBhZGRpbmdZICAgICA9IF9hLnBhZGRpbmdZO1xyXG5cdFx0XHRcdGlmKCFfYS5kZWNrc1tpXS5mbGlwUGFkZGluZ1ggJiYgX2EuZmxpcFBhZGRpbmdYICAmJiB0eXBlb2YgX2EuZmxpcFBhZGRpbmdYID09ICdudW1iZXInKSBfYS5kZWNrc1tpXS5mbGlwUGFkZGluZ1ggPSBfYS5mbGlwUGFkZGluZ1g7XHJcblx0XHRcdFx0aWYoIV9hLmRlY2tzW2ldLmZsaXBQYWRkaW5nWSAmJiBfYS5mbGlwUGFkZGluZ1kgICYmIHR5cGVvZiBfYS5mbGlwUGFkZGluZ1kgPT0gJ251bWJlcicpIF9hLmRlY2tzW2ldLmZsaXBQYWRkaW5nWSA9IF9hLmZsaXBQYWRkaW5nWTtcclxuXHRcdFx0XHRfZGVja3NbaV0uUmVkcmF3KF9hLmRlY2tzW2ldKTtcclxuXHRcdFx0XHQvLyBpZihfZGVja3NbaV0ubmFtZSlcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBmb3IoaSBpbiBfYS5kZWNrcykge1xyXG5cdFx0XHQvLyBcdGNvbnNvbGUubG9nKCdyZWRyYXc6JywgX2EuZGVja3NbaV0pXHJcblx0XHRcdC8vIFx0dmFyIF9kZWNrID0gbWFpbi5EZWNrKF9hLmRlY2tzW2ldLm5hbWUsIF9lbF9ncm91cC5uYW1lKTtcclxuXHRcdFx0Ly8gXHRpZihfZGVjaykge1xyXG5cdFx0XHQvLyBcdFx0X2RlY2suUmVkcmF3KF9hLmRlY2tzW2ldKTtcclxuXHRcdFx0Ly8gXHR9XHJcblx0XHRcdC8vIH1cclxuXHJcblx0XHR9O1xyXG5cclxuXHRcdHJldHVybiBfZWxfZ3JvdXA7XHJcblx0fTsvLy5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLkdyb3VwID0gZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0cmV0dXJuIG1haW4uZ2V0RWxlbWVudHNCeU5hbWUobmFtZSwgJ2dyb3VwJylbMF07XHJcblx0fTtcclxuXHRcclxuXHRyZXR1cm4gYWRkR3JvdXAoZGF0YSk7XHJcblxyXG59O1xyXG5cclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9hZGRHcm91cC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBmbGlwVHlwZXMgICAgICBmcm9tICcuL2ZsaXBUeXBlcyc7XHJcbmltcG9ydCBQdXRSdWxlcyAgICAgICBmcm9tICcuL3JlYWR5UHV0UnVsZXMnO1xyXG5pbXBvcnQgcmVhZHlUYWtlUnVsZXMgZnJvbSAnLi9yZWFkeVRha2VSdWxlcyc7XHJcbmltcG9ydCBmaWxsUnVsZXNFeHQgICBmcm9tICcuL2ZpbGxSdWxlcyc7XHJcbmltcG9ydCBwYWRkaW5nVHlwZXMgICBmcm9tICcuL3BhZGRpbmdUeXBlcyc7XHJcbmltcG9ydCBhZGREZWNrQWN0aW9uICBmcm9tICcuL2FkZERlY2tBY3Rpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWFpbiwgc2hhcmUsIGRhdGEpIHtcclxuXHJcblx0dmFyIHJlYWR5UHV0UnVsZXMgPSBQdXRSdWxlcyAgICAgICAobWFpbiwgc2hhcmUpO1xyXG5cdHZhciBmaWxsUnVsZXMgICAgID0gZmlsbFJ1bGVzRXh0ICAgKG1haW4sIHNoYXJlKTtcclxuXHR2YXIgZGVja0FjdGlvbnMgICA9IGFkZERlY2tBY3Rpb24gKG1haW4sIHNoYXJlKTtcclxuXHJcblx0Ly8gY29uc29sZS5sb2coJ3JlYWR5UHV0UnVsZXM6JywgcmVhZHlQdXRSdWxlcyk7XHJcblxyXG5cdHZhciBhZGREZWNrID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdERUNLOicsIGEsIHNoYXJlLCBkYXRhKTtcclxuXHRcdFxyXG5cdFx0aWYoIWEpIHJldHVybiBmYWxzZTtcclxuXHRcdHZhciBfaWQgPSAnZGVja18nICsgc2hhcmUuZ2VuSWQoKTtcclxuXHRcdHZhciBfZWxfZGVjayA9IG5ldyAoZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdFx0aWYoIWEpIHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIHBhcmFtZXRlcnNcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMudHlwZSA9ICdkZWNrJztcclxuXHRcdFx0dmFyIGlkID0gX2lkO1xyXG5cdFx0XHR0aGlzLmdldElkID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGlkO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgX3BhcmVudF9lbCAgID0gbWFpbi5Hcm91cChhLnBhcmVudCksXHJcblx0XHRcdFx0X3BhcmVudF9uYW1lID0gX3BhcmVudF9lbCA/IF9wYXJlbnRfZWwubmFtZSA6ICd4bmFtZScsXHJcblx0XHRcdFx0X25ld19pZCAgICAgID0gX3BhcmVudF9lbCA/IF9wYXJlbnRfZWwuZ2V0RGVja3MoKS5sZW5ndGggOiBpZDtcclxuXHRcdFx0dGhpcy5uYW1lID0gYS5uYW1lICYmIHR5cGVvZiBhLm5hbWUgPT0gJ3N0cmluZycgPyBhLm5hbWUgOiAoX3BhcmVudF9uYW1lICsgJ18nICsgX25ld19pZCk7XHJcblxyXG5cdFx0XHR2YXIgcGFyZW50ID0gYS5wYXJlbnQgJiYgdHlwZW9mIGEucGFyZW50ID09ICdzdHJpbmcnID8gYS5wYXJlbnQgOiAnZmllbGQnO1xyXG5cdFx0XHR0aGlzLnBhcmVudCA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHRpZih0eXBlb2YgYSA9PSAnc3RyaW5nJykgcGFyZW50ID0gYTtcclxuXHRcdFx0XHRyZXR1cm4gcGFyZW50O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgYXV0b0hpZGUgPSBhLmF1dG9IaWRlICYmIHR5cGVvZiBhLmF1dG9IaWRlID09ICdib29sZWFuJyA/IGEuYXV0b0hpZGUgOiBzaGFyZS5kZWZhdWx0X2F1dG9oaWRlO1xyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy52aXNpYmxlID0gYS52aXNpYmxlICYmIHR5cGVvZiBhLnZpc2libGUgICA9PSAnYm9vbGVhbicgPyBhLnZpc2libGUgOiB0cnVlOy8vIGRlZmF1bHQgdHJ1ZVxyXG5cdFx0XHRcclxuXHRcdFx0dmFyIHBhcmFtcyA9IHt9O1xyXG5cdFx0XHRwYXJhbXMuc3RhcnRaSW5kZXggPSBhLnN0YXJ0WkluZGV4ICYmIHR5cGVvZiBhLnN0YXJ0WkluZGV4ID09ICdudW1iZXInID8gYS5zdGFydFpJbmRleCA6IHNoYXJlLnN0YXJ0X3pfaW5kZXg7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjaGFuZ2VkIHBhcmFtZXRlcnNcclxuXHRcdFx0dGhpcy5ncm91cEluZGV4ID0gYS5ncm91cEluZGV4ICYmIHR5cGVvZiBhLmdyb3VwSW5kZXggPT0gJ251bWJlcicgPyBhLmdyb3VwSW5kZXggOiBudWxsO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gRE9NXHJcblx0XHRcdHBhcmFtcy54ICAgICAgICAgICAgICA9IDA7IFxyXG5cdFx0XHRwYXJhbXMueSAgICAgICAgICAgICAgPSAwOyBcclxuXHRcdFx0cGFyYW1zLnJvdGF0ZSA9IHRoaXMucm90YXRlID0gMDsgXHJcblxyXG5cdFx0XHRwYXJhbXMucGFkZGluZ195ICAgICAgPSAoICAgIGEucGFkZGluZ1kgJiYgdHlwZW9mICAgICBhLnBhZGRpbmdZID09ICdudW1iZXInKSA/ICAgICBhLnBhZGRpbmdZIDogICAgICBzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeTtcclxuXHRcdFx0cGFyYW1zLmZsaXBfcGFkZGluZ195ID0gKGEuZmxpcFBhZGRpbmdZICYmIHR5cGVvZiBhLmZsaXBQYWRkaW5nWSA9PSAnbnVtYmVyJykgPyBhLmZsaXBQYWRkaW5nWSA6IHNoYXJlLmRlZmF1bHRfZmxpcF9wYWRkaW5nX3k7XHJcblx0XHRcdFxyXG5cdFx0XHRwYXJhbXMucGFkZGluZ194ICAgICAgPSAoICAgIGEucGFkZGluZ1ggJiYgdHlwZW9mICAgICBhLnBhZGRpbmdYID09ICdudW1iZXInKSA/ICAgICBhLnBhZGRpbmdYIDogICAgICBzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeDtcclxuXHRcdFx0cGFyYW1zLmZsaXBfcGFkZGluZ194ID0gKGEuZmxpcFBhZGRpbmdYICYmIHR5cGVvZiBhLmZsaXBQYWRkaW5nWCA9PSAnbnVtYmVyJykgPyBhLmZsaXBQYWRkaW5nWCA6IHNoYXJlLmRlZmF1bHRfZmxpcF9wYWRkaW5nX3g7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnQUREIERFQ0s6JywgYS5wYWRkaW5nWCwgYS5wYWRkaW5nWSwgc2hhcmUucGFkZGluZ194LCBzaGFyZS5wYWRkaW5nX3kpO1xyXG5cclxuXHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnYWRkRGVja0VsJywge1xyXG5cdFx0XHRcdGEgICAgIDogYSwgXHJcblx0XHRcdFx0ZGVjayAgOiB0aGlzLFxyXG5cdFx0XHRcdHBhcmFtczogcGFyYW1zXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy5oaWRlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy52aXNpYmxlID0gZmFsc2U7XHJcblx0XHRcdFx0b25lU3RlcFdheS5oaWRlRGVjayA9IHRoaXMubmFtZTtcclxuXHRcdFx0XHR0aGlzLlJlZHJhdygpO1xyXG5cdFx0XHRcdC8vICQoZG9tRWxlbWVudCkuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR0aGlzLnZpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0XHRvbmVTdGVwV2F5LnNob3dEZWNrID0gdGhpcy5uYW1lO1xyXG5cdFx0XHRcdHRoaXMuUmVkcmF3KCk7XHJcblx0XHRcdFx0Ly8gJChkb21FbGVtZW50KS5zaG93KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0gRkxJUCAtLS0tLS0tLS0tLS0tXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBmbGlwVHlwZXMuanNcclxuXHJcblxyXG5cdFx0XHR2YXIgZmxpcFR5cGUgPSBhLmZsaXAgJiYgdHlwZW9mIGEuZmxpcCA9PSAnc3RyaW5nJyA/IGEuZmxpcCA6IHNoYXJlLmRlZmF1bHRfZmxpcF90eXBlLFxyXG5cdFx0XHRcdGNoZWNrRmxpcCA9IGZsaXBUeXBlc1tmbGlwVHlwZV07XHJcblx0XHRcdHRoaXMuZmxpcENoZWNrID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIGNhcmRzKSB7XHJcblx0XHRcdFx0XHRjaGVja0ZsaXAoY2FyZHNbaV0sIGl8MCwgY2FyZHMubGVuZ3RoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgY2FyZHMgPSBbXTsvLyAxIG9yIE4sIGlkIDoge25hbWU6ICcnLCByYW5rOiAnJywgY29sb3I6ICcnLCBmbGlwOiBudWxsLCBpZDogJycsIHBhZGRpbmdUeXBlOiBOfSBpZCAtIGRvbSBlbGVtZW50IGlkXHJcblx0XHRcdFxyXG5cdFx0XHQvLyDRgdC+0LfQtNCw0YLRjCDQutCw0YDRgtGDXHJcblx0XHRcdHRoaXMuZ2VuQ2FyZEJ5TmFtZSA9IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnZ2VuQ2FyZEJ5TmFtZTonLCBuYW1lKTtcclxuXHRcdFx0XHR2YXIgX25hbWUgPSBzaGFyZS52YWxpZGF0ZUNhcmROYW1lKG5hbWUpOy8vIHtjb2xvciwgcmFua31cclxuXHRcdFx0XHR2YXIgX3BhcmVudCA9IGlkO1xyXG5cclxuXHRcdFx0XHRpZihfbmFtZSkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBfaWQgPSAnY2FyZF8nICsgc2hhcmUuZ2VuSWQoKSxcclxuXHRcdFx0XHRcdFx0X2NhcmQgPSB7XHJcblx0XHRcdFx0XHRcdGlkICAgICAgOiBfaWQsXHJcblx0XHRcdFx0XHRcdG5hbWUgICAgOiBuYW1lLFxyXG5cdFx0XHRcdFx0XHR0eXBlICAgIDogJ2NhcmQnLFxyXG5cdFx0XHRcdFx0XHQvLyBkb21FbGVtZW50IDogZG9tRWxlbWVudCxcclxuXHRcdFx0XHRcdFx0dmlzaWJsZSA6IHRydWUsXHJcblx0XHRcdFx0XHRcdHBhcmVudCAgOiBfcGFyZW50LFxyXG5cdFx0XHRcdFx0XHRmbGlwICAgIDogZmFsc2VcclxuXHRcdFx0XHRcdH1cclxuXHJcblxyXG5cdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnYWRkQ2FyZEVsJywgX2NhcmQpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRzaGFyZS5lbGVtZW50c1tfaWRdID0gX2NhcmQ7XHJcblx0XHRcdFx0XHR0aGlzLlB1c2goW19jYXJkXSk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMuZmxpcENoZWNrKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMuUmVkcmF3KCk7XHJcblxyXG5cdFx0XHRcdFx0cmV0dXJuIF9jYXJkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH0vLy5iaW5kKHRoaXMpXHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0gUFVUIC0tLS0tLS0tLS0tLS1cclxuXHJcblx0XHRcdC8vINC80L7QttC90L4g0LvQuCDQv9C+0LvQvtC20LjRgtGMINC60LDRgNGC0YMv0YHRgtC+0L/QutGDXHJcblx0XHRcdFxyXG5cdFx0XHQvLyByZWFkeVB1dFJ1bGVzLmpzXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdQVVQgREVCVUc6JywgYS5wdXRSdWxlcywgc2hhcmUuZGVmYXVsdF9wdXROYW1lLCByZWFkeVB1dFJ1bGVzKTtcdFxyXG5cdFx0XHR2YXIgcHV0UnVsZXMgPSBhLnB1dFJ1bGVzIFxyXG5cdFx0XHRcdD8gdHlwZW9mIGEucHV0UnVsZXMgPT0gJ2Z1bmN0aW9uJyBcclxuXHRcdFx0XHRcdD8gYS5wdXRSdWxlc1xyXG5cdFx0XHRcdFx0OiB0eXBlb2YgYS5wdXRSdWxlcyA9PSAnc3RyaW5nJyBcclxuXHRcdFx0XHRcdFx0PyByZWFkeVB1dFJ1bGVzW2EucHV0UnVsZXNdIFxyXG5cdFx0XHRcdFx0XHRcdD8gcmVhZHlQdXRSdWxlc1thLnB1dFJ1bGVzXVxyXG5cdFx0XHRcdFx0XHRcdDogcmVhZHlQdXRSdWxlc1tzaGFyZS5kZWZhdWx0X3B1dE5hbWVdXHJcblx0XHRcdFx0XHRcdC8vIDogcmVhZHlQdXRSdWxlc1tzaGFyZS5kZWZhdWx0X3B1dE5hbWVdXHJcblx0XHRcdFx0XHRcdC8vIDogdHlwZW9mIGEucHV0UnVsZXMgPT09ICdvYmplY3QnIFxyXG5cdFx0XHRcdFx0XHQvLyA6IGEucHV0UnVsZXMudG9TdHJpbmcoKSA9PSBcIltvYmplY3QgT2JqZWN0XVwiIFxyXG5cdFx0XHRcdFx0XHQ6IGEucHV0UnVsZXMuY29uc3RydWN0b3IgPT0gQXJyYXkgXHJcblx0XHRcdFx0XHRcdFx0PyBhLnB1dFJ1bGVzXHJcblx0XHRcdFx0XHRcdFx0OiByZWFkeVB1dFJ1bGVzW3NoYXJlLmRlZmF1bHRfcHV0TmFtZV1cclxuXHRcdFx0XHQ6IHJlYWR5UHV0UnVsZXNbc2hhcmUuZGVmYXVsdF9wdXROYW1lXTtcclxuXHJcblx0XHRcdC8vINC/0YDQvtCy0LXRgNGP0LXQvCwg0LzQvtC20LXQvCDQu9C4INC/0L7Qu9C+0LbQuNGC0Ywg0YHRgtC+0L/QutGDL9C60LDRgNGC0YNcclxuXHRcdFx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10YIgdHJ1ZSwg0LXRgdC70Lgg0YHQvtCz0LvQsNGB0L3QviDQv9GA0LDQstC40LvQsNC8INGB0Y7QtNCwINC80L7QttC90L4g0L/QvtC70L7QttC40YLRjCDQutCw0YDRgtGDXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBUT0RPXHJcblx0XHRcdC8vIHRoaXMuUHV0ID0gZnVuY3Rpb24ocHV0RGVjaykge1xyXG5cdFx0XHQvLyBcdHNoYXJlLlB1dCh7ZGVjayA6IHRoaXMsIHB1dERlY2sgOiBwdXREZWNrfSlcclxuXHRcdFx0Ly8gfVxyXG5cclxuXHRcdFx0dGhpcy5QdXQgPSBmdW5jdGlvbihwdXREZWNrKSB7XHJcblxyXG5cdFx0XHRcdHZhciBydWxlc0NvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBfZGVja0lkID0gcHV0RGVja1swXS5jYXJkLnBhcmVudDtcclxuXHRcdFx0XHR2YXIgX2RlY2tfZGVwYXJ0dXJlID0gbWFpbi5nZXREZWNrQnlJZChfZGVja0lkKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnUHV0IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0+JywgdGhpcy5uYW1lKTtcclxuXHJcblx0XHRcdFx0aWYodHlwZW9mIHB1dFJ1bGVzID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBwdXRSdWxlcyh7XHJcblx0XHRcdFx0XHRcdGZyb20gICAgOiB7XHJcblx0XHRcdFx0XHRcdFx0ZGVja0lkIDogX2RlY2tJZCwgXHJcblx0XHRcdFx0XHRcdFx0ZGVjayAgIDogX2RlY2tfZGVwYXJ0dXJlXHJcblx0XHRcdFx0XHRcdH0sIFxyXG5cdFx0XHRcdFx0XHRwdXREZWNrIDogcHV0RGVjayxcclxuXHRcdFx0XHRcdFx0Y2FyZHMgICA6IGNhcmRzXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJyVjRUFDSCcsICdjb2xvcjogYmx1ZTtmb250LXdlaWdodCA6IGJvbGQ7JywgcHV0UnVsZXMpO1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBydWxlTmFtZSBpbiBwdXRSdWxlcykge1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBfcnVsZU5hbWUgPSAocGFyc2VJbnQocnVsZU5hbWUpLnRvU3RyaW5nKCkgPT0gcnVsZU5hbWUgJiYgdHlwZW9mIHB1dFJ1bGVzW3J1bGVOYW1lXSA9PSAnc3RyaW5nJykgPyBwdXRSdWxlc1tydWxlTmFtZV0gOiBydWxlTmFtZTtcclxuXHJcblx0XHRcdFx0XHRcdGlmKHJlYWR5UHV0UnVsZXNbX3J1bGVOYW1lXSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIHZhciBfYyA9ICcjJyArICgoKE1hdGgucmFuZG9tKCkgKiAxNTcyODYzOSl8MCkgKyAxMDQ4NTc2KS50b1N0cmluZygxNik7XHJcblx0XHRcdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJyVjICAnLCAnYm9yZGVyLXJhZGl1cyA6IDEwMCU7Zm9udC13ZWlnaHQ6IGJvbGQ7YmFja2dyb3VuZDonICsgX2MsIF9kZWNrSWQsIGNhcmRzLCBfcnVsZU5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiByZWFkeVB1dFJ1bGVzW19ydWxlTmFtZV0oe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbSAgICAgIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRkZWNrSWQgOiBfZGVja0lkLCBcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVjayAgIDogX2RlY2tfZGVwYXJ0dXJlXHJcblx0XHRcdFx0XHRcdFx0XHR9LCBcclxuXHRcdFx0XHRcdFx0XHRcdHB1dERlY2sgICA6IHB1dERlY2ssXHJcblx0XHRcdFx0XHRcdFx0XHRjYXJkcyAgICAgOiBjYXJkcyxcclxuXHRcdFx0XHRcdFx0XHRcdHJ1bGVzQXJncyA6IHB1dFJ1bGVzW3J1bGVOYW1lXVxyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCclYyAgJywgJ2JvcmRlci1yYWRpdXMgOiAxMDAlO2JhY2tncm91bmQ6JyArIF9jLCAnRU5EJyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZih0eXBlb2YgcHV0UnVsZXNbX3J1bGVOYW1lXSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIHB1dFJ1bGVzW19ydWxlTmFtZV0oe1xyXG5cdFx0XHRcdFx0XHRcdFx0ZnJvbSAgICA6IHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0ZGVja0lkIDogX2RlY2tJZCwgXHJcblx0XHRcdFx0XHRcdFx0XHRcdGRlY2sgICA6IF9kZWNrX2RlcGFydHVyZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSwgXHJcblx0XHRcdFx0XHRcdFx0XHRwdXREZWNrIDogcHV0RGVjayxcclxuXHRcdFx0XHRcdFx0XHRcdGNhcmRzICAgOiBjYXJkc1xyXG5cdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUud2FybigncHV0UnVsZTonLCBfcnVsZU5hbWUsICdub3QgZXhpc3RzJyk7XHJcblx0XHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiBydWxlc0NvcnJlY3Q7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLSBUQUtFIC0tLS0tLS0tLS0tLS1cclxuXHRcdFx0XHJcblx0XHRcdC8vINC80L7QttC90L4g0LvQuCDQstC30Y/RgtGMINC60LDRgNGC0YMv0YHRgtC+0L/QutGDXHJcblxyXG5cdFx0XHR2YXIgdGFrZVJ1bGVzID0gYS50YWtlUnVsZXMgXHJcblx0XHRcdFx0PyB0eXBlb2YgYS50YWtlUnVsZXMgPT0gJ2Z1bmN0aW9uJyBcclxuXHRcdFx0XHRcdD8gYS50YWtlUnVsZXNcclxuXHRcdFx0XHRcdDogdHlwZW9mIGEudGFrZVJ1bGVzID09ICdzdHJpbmcnIFxyXG5cdFx0XHRcdFx0XHQ/IHJlYWR5VGFrZVJ1bGVzW2EudGFrZVJ1bGVzXSBcclxuXHRcdFx0XHRcdFx0XHQ/IHJlYWR5VGFrZVJ1bGVzW2EudGFrZVJ1bGVzXVxyXG5cdFx0XHRcdFx0XHRcdDogcmVhZHlUYWtlUnVsZXNbc2hhcmUuZGVmYXVsdF90YWtlTmFtZV1cclxuXHRcdFx0XHRcdFx0OiByZWFkeVRha2VSdWxlc1tzaGFyZS5kZWZhdWx0X3Rha2VOYW1lXVxyXG5cdFx0XHRcdFx0XHQvLyA6IHR5cGVvZiBhLnRha2VSdWxlcyA9PSAnb2JqZWN0JyBcclxuXHRcdFx0XHRcdFx0Ly8gXHQ/IGEudGFrZVJ1bGVzXHJcblx0XHRcdFx0XHRcdC8vIFx0OiByZWFkeVRha2VSdWxlc1tzaGFyZS5kZWZhdWx0X3Rha2VOYW1lXVxyXG5cdFx0XHRcdDogcmVhZHlUYWtlUnVsZXNbc2hhcmUuZGVmYXVsdF90YWtlTmFtZV07XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKHRoaXMubmFtZSwgYS50YWtlUnVsZXMpO1xyXG5cclxuXHRcdFx0dGhpcy5UYWtlID0gZnVuY3Rpb24oY2FyZElkKSB7XHJcblxyXG5cdFx0XHRcdHZhciBydWxlc0NvcnJlY3QgPSAhc2hhcmUubG9jaztcclxuXHRcdFx0XHRpZih0eXBlb2YgdGhpcy5maWxsID09IFwiYm9vbGVhblwiKSB7XHJcblx0XHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgIXRoaXMuZmlsbDtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vINCx0LXRgNGR0Lwg0LrQsNGA0YLRgy/RgdGC0L7Qv9C60YNcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnVGFrZScsIGNhcmRJZCk7XHJcblxyXG5cdFx0XHRcdHZhciBjYXJkSW5kZXggID0gLTE7XHJcblx0XHRcdFx0dmFyIGNhcmROYW1lICAgPSBudWxsOyBcclxuXHRcdFx0XHR2YXIgY2FyZFN1aXQgICA9IG51bGw7IFxyXG5cdFx0XHRcdHZhciBjYXJkUmFuayAgID0gbnVsbDsgXHJcblx0XHRcdFx0dmFyIGRlY2tMZW5ndGggPSBjYXJkcy5sZW5ndGg7XHJcblxyXG5cdFx0XHRcdC8vINC/0YDQvtCy0LXRgNGP0LXQvCDQvdC1INGP0LLQu9GP0LXRgtGB0Y8g0LvQuCDQv9C10YDQtdCy0LXRgNC90YPRgtC+0LlcclxuXHJcblx0XHRcdFx0dmFyIHRha2VEZWNrID0gW11cclxuXHJcblx0XHRcdFx0Zm9yKHZhciBpIGluIGNhcmRzKSB7XHJcblxyXG5cdFx0XHRcdFx0aWYoY2FyZHNbaV0uaWQgPT0gY2FyZElkKSB7XHJcblx0XHRcdFx0XHRcdGNhcmRJbmRleCA9IGl8MDtcclxuXHRcdFx0XHRcdFx0Y2FyZE5hbWUgID0gY2FyZHNbaV0ubmFtZTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdHZhciBfbmFtZSA9IHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoY2FyZE5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIF9uYW1lO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0aWYoX25hbWUpIHtcclxuXHRcdFx0XHRcdFx0XHRjYXJkU3VpdCA9IF9uYW1lLnN1aXQ7XHJcblx0XHRcdFx0XHRcdFx0Y2FyZFJhbmsgID0gX25hbWUucmFuaztcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIChjYXJkc1tpXS5mbGlwID09IGZhbHNlIHx8IGNhcmRzW2ldLmZsaXAgPT0gc2hhcmUuZGVmYXVsdF9jYW5fbW92ZV9mbGlwKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRpZihjYXJkSW5kZXggPj0gMCkge1xyXG5cdFx0XHRcdFx0XHR0YWtlRGVjay5wdXNoKHtpbmRleCA6IGksIGNhcmQgOiBjYXJkc1tpXX0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR2YXIgX2F0dHJzID0ge1xyXG5cdFx0XHRcdFx0Y2FyZElkICAgICA6IGNhcmRJZCwgXHJcblx0XHRcdFx0XHRjYXJkTmFtZSAgIDogY2FyZE5hbWUsIFxyXG5cdFx0XHRcdFx0Y2FyZFN1aXQgICA6IGNhcmRTdWl0LCBcclxuXHRcdFx0XHRcdGNhcmRSYW5rICAgOiBjYXJkUmFuaywgXHJcblx0XHRcdFx0XHRjYXJkSW5kZXggIDogY2FyZEluZGV4LCBcclxuXHRcdFx0XHRcdGRlY2tMZW5ndGggOiBkZWNrTGVuZ3RoXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmKHR5cGVvZiB0YWtlUnVsZXMgPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIHRha2VSdWxlcyhfYXR0cnMpO1xyXG5cdFx0XHRcdFx0Ly8gVE9ET1xyXG5cdFx0XHRcdFx0Ly8g0LvRg9GH0YjQtSDQvtCx0YDQsNCx0LDRgtGL0LLQsNGC0Ywg0YHRgtGA0L7QutGDINC10YHQu9C4INC/0YDQsNCy0LjQu9C+INC+0LTQvdC+INC4INC90LUg0L3Rg9C20LXQvSDQvNCw0YHRgdC40LJcclxuXHRcdFx0XHQvLyB9IGVsc2UgaWYodHlwZW9mIHRha2VSdWxlcyA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRmb3IodmFyIHJ1bGVJbmRleCBpbiB0YWtlUnVsZXMpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHJ1bGVOYW1lID0gdGFrZVJ1bGVzW3J1bGVJbmRleF07XHJcblxyXG5cdFx0XHRcdFx0XHRpZihzaGFyZS5yZWFkeVRha2VSdWxlc1tydWxlTmFtZV0pIHtcclxuXHRcdFx0XHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgc2hhcmUucmVhZHlUYWtlUnVsZXNbcnVsZU5hbWVdKF9hdHRycyk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7Ly8gaWYodHlwZW9mIHRha2VSdWxlc1tydWxlSW5kZXhdID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgdGFrZVJ1bGVzW3J1bGVJbmRleF0oX2F0dHJzKTtcclxuXHRcdFx0XHRcdFx0XHRjb25zb2xlLmxvZygnSW5jb3JyZWN0IHRha2UgcnVsZTonLCBydWxlTmFtZSk7XHJcblx0XHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10YIg0LzQsNGB0YHQuNCyIElEINC60LDRgNGCINC60L7RgtC+0YDRi9C1INC80L7QttC90L4g0LHRg9C00LXRgiDQv9C10YDQtdGC0LDRidC40YLRjFxyXG5cdFx0XHRcdC8vINC30LDQv9C40YHRi9Cy0LDQtdGCINC40YUg0LrQsNC6INCw0LrRgtC40LLQvdGL0LVcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgKGNhcmRJbmRleCA+PSAwKTtcclxuXHRcdFx0XHRyZXR1cm4gcnVsZXNDb3JyZWN0ICYmIHRha2VEZWNrO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0gRklMTCAtLS0tLS0tLS0tLS0tXHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmZpbGwgPSBmYWxzZTtcclxuXHRcdFx0dmFyIGZpbGxSdWxlID0gKFxyXG5cdFx0XHRcdGEuZmlsbFJ1bGUgXHJcblx0XHRcdCAmJiB0eXBlb2YgYS5maWxsUnVsZSA9PSBcInN0cmluZ1wiIFxyXG5cdFx0XHQgJiYgdHlwZW9mIGZpbGxSdWxlc1thLmZpbGxSdWxlXSA9PSBcImZ1bmN0aW9uXCJcclxuXHRcdFx0KSA/IGZpbGxSdWxlc1thLmZpbGxSdWxlXVxyXG5cdFx0XHQgIDogZmlsbFJ1bGVzWydub3QnXTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ0ZpbGwgcnVsZTonLCB0aGlzLm5hbWUsIGZpbGxSdWxlKTtcclxuXHRcdFx0bWFpbi5ldmVudC5saXN0ZW4oJ21vdmVEcmFnRGVjaycsIGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0XHRpZihkYXRhLmRlc3RpbmF0aW9uLm5hbWUgIT0gdGhpcy5kZWNrLm5hbWUpIHJldHVybjtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLmRlY2submFtZSwgZGF0YS5tb3ZlLmZyb20sIGRhdGEubW92ZS50byk7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gZGF0YS5kZXN0aW5hdGlvbjsvLyBcdG1haW4uRGVjayhkYXRhLm1vdmUudG8pO1xyXG5cdFx0XHRcdGlmKF9kZWNrICYmICF0aGlzLmZpbGwgJiYgdGhpcy5jYWxsYmFjayh7ZGVjayA6IF9kZWNrfSkpIHtcclxuXHRcdFx0XHRcdHRoaXMuZGVjay5maWxsID0gdHJ1ZTtcclxuXHRcdFx0XHRcdHNoYXJlLm9uZVN0ZXBXYXkuZmlsbCA9IHtcclxuXHRcdFx0XHRcdFx0ZGVjayA6IHRoaXMuZGVjay5uYW1lXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0Ly8gbWFpbi5ldmVudC5kaXNwYXRjaCgnZmlsbERlY2snLCB7ZGVjayA6IHRoaXMuZGVja30pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fS5iaW5kKHtkZWNrIDogdGhpcywgY2FsbGJhY2sgOiBmaWxsUnVsZX0pKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLS0gUEFERElORyAtLS0tLS0tLS0tLS0tXHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9C+0YDRj9C00L7QuiDQutCw0YDRgiDQsiDQutC+0LvQvtC00LVcclxuXHRcdFx0XHJcblx0XHRcdC8vIHBhZGRpbmdUeXBlcy5qc1xyXG5cclxuXHRcdFx0dmFyIHBhZGRpbmcgPSBhLnBhZGRpbmdUeXBlIFxyXG5cdFx0XHRcdD8gKHR5cGVvZiBhLnBhZGRpbmdUeXBlID09ICdzdHJpbmcnICYmIHBhZGRpbmdUeXBlc1thLnBhZGRpbmdUeXBlXSkgXHJcblx0XHRcdFx0XHQ/IHBhZGRpbmdUeXBlc1thLnBhZGRpbmdUeXBlXSBcclxuXHRcdFx0XHRcdDogdHlwZW9mIGEucGFkZGluZ1R5cGUgPT0gJ2Z1bmN0aW9uJyBcclxuXHRcdFx0XHRcdFx0PyBhLnBhZGRpbmdUeXBlIFxyXG5cdFx0XHRcdFx0XHQ6IHBhZGRpbmdUeXBlc1snbm9uZSddXHJcblx0XHRcdFx0OiBhLnBhZGRpbmdYIHx8IGEucGFkZGluZ1kgXHJcblx0XHRcdFx0XHQ/IHBhZGRpbmdUeXBlc1snc3BlY2lhbCddIFxyXG5cdFx0XHRcdFx0OiBwYWRkaW5nVHlwZXNbc2hhcmUuZGVmYXVsdF9wYWRkaW5nVHlwZV07XHJcblx0XHRcdFxyXG5cdFx0XHRcclxuXHRcdFx0dGhpcy5wYWRkaW5nID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdFx0XHR2YXIgX3BhZGRpbmcgPSBwYWRkaW5nKHBhcmFtcywgY2FyZHNbaW5kZXhdLCBpbmRleCwgY2FyZHMubGVuZ3RoLCBjYXJkcyk7XHJcblx0XHRcdFx0cmV0dXJuIF9wYWRkaW5nO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLmhpZGVDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBjYXJkcykge1xyXG5cdFx0XHRcdFx0Y2FyZHNbaV0udmlzaWJsZSA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnaGlkZUNhcmQnLCBjYXJkc1tpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR0aGlzLnNob3dDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBjYXJkcykge1xyXG5cdFx0XHRcdFx0Y2FyZHNbaV0udmlzaWJsZSA9IHRydWU7XHJcblx0XHRcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdzaG93Q2FyZCcsIGNhcmRzW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmKGEuYWN0aW9ucykge1xyXG5cdFx0XHRcdC8vIFRPRE8g0YHQtNC10LvQsNGC0Ywg0LrRgNCw0YHQuNCy0LXQtVxyXG5cdFx0XHRcdHRoaXMuYWN0aW9ucyA9IGEuYWN0aW9ucztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLSBcXC9cXC9cXC9cXC9cXC8gLS0tLS0tLS0tLS0tLVxyXG5cclxuXHRcdFx0Ly8gUmVkcmF3IGRlY2tcclxuXHRcdFx0XHJcblx0XHRcdHRoaXMuUmVkcmF3ID0gZnVuY3Rpb24oX2EpIHtcclxuXHJcblx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgncmVkcmF3RGVjaycsIHtcclxuXHRcdFx0XHRcdGRlY2sgICA6IHRoaXMsXHJcblx0XHRcdFx0XHRhICAgICAgOiBfYSxcclxuXHRcdFx0XHRcdHBhcmFtcyA6IHBhcmFtcyxcclxuXHRcdFx0XHRcdGNhcmRzICA6IGNhcmRzXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5nZXRDYXJkcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBjYXJkcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5nZXRDYXJkc0J5TmFtZSA9IGZ1bmN0aW9uKGNhcmROYW1lKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkcyA9IFtdO1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBjYXJkcykge1xyXG5cdFx0XHRcdFx0aWYoY2FyZHNbaV0ubmFtZSA9PSBjYXJkTmFtZSkge1xyXG5cdFx0XHRcdFx0XHRfY2FyZHMucHVzaChjYXJkc1tpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBfY2FyZHM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHRoaXMuQ2FyZCA9IGZ1bmN0aW9uKGNhcmROYW1lKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZ2V0Q2FyZHNCeU5hbWUoY2FyZE5hbWUpWzBdO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cclxuXHRcdFx0dGhpcy5Qb3AgPSBmdW5jdGlvbihjb3VudCwgY2xlYXJQYXJlbnQpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihjYXJkcy5sZW5ndGggPCBjb3VudCkgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0XHR2YXIgX2RlY2sgPSBbXTtcclxuXHRcdFx0XHRmb3IoO2NvdW50O2NvdW50IC09IDEpIHtcclxuXHRcdFx0XHRcdHZhciBfcG9wID0gY2FyZHMucG9wKCk7XHJcblx0XHRcdFx0XHRpZihjbGVhclBhcmVudCkgX3BvcC5wYXJlbnQgPSBudWxsO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1BPUDonLCBfcG9wKVxyXG5cdFx0XHRcdFx0X2RlY2sucHVzaChfcG9wKTtcclxuXHRcdFx0XHRcdF9kZWNrW19kZWNrLmxlbmd0aCAtIDFdLnBhcmVudCA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdF9kZWNrLnJldmVyc2UoKTtcclxuXHJcblx0XHRcdFx0Ly8g0YfRgtC+INC00LXQu9Cw0YLRjCDQtdGB0LvQuCDQstGL0L3Rg9C70Lgg0LLRgdC1INC60LDRgNGC0YtcclxuXHRcdFx0XHRpZihhdXRvSGlkZSAmJiBjYXJkcy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdFx0dGhpcy5oaWRlKCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHRoaXMuUmVkcmF3KCk7XHJcblxyXG5cdFx0XHRcdHJldHVybiBfZGVjaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0dGhpcy5QdXNoID0gZnVuY3Rpb24oZGVjaykgey8vICwgcGFyZW50TmFtZSkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBkZWNrKSB7XHJcblx0XHRcdFx0XHRkZWNrW2ldLnBhcmVudCA9IGlkO1xyXG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1BVU0g6JywgZGVja1tpXSwgaWQpO1xyXG5cdFx0XHRcdFx0Y2FyZHMucHVzaChkZWNrW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcclxuXHRcdFx0dGhpcy5jbGVhciA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBjYXJkcykge1xyXG5cdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgncmVtb3ZlRWwnLCBjYXJkc1tpXSk7XHJcblx0XHRcdFx0XHRjYXJkc1tpXSA9IG51bGw7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGNhcmRzID0gW107XHJcblx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgncmVtb3ZlRWwnLCB0aGlzKTtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdC8vIEZpbGwgZGVja1xyXG5cdFx0XHQvLyDQt9Cw0L/QvtC70L3Rj9C10YIg0LrQsNGA0YLRiyDQsiDQv9C+0YDRj9C00LrQtSDQtNC+0LHQsNCy0LvQtdC90LjRj1xyXG5cdFx0XHR0aGlzLkZpbGwgPSBmdW5jdGlvbihjYXJkTmFtZXMpIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRmb3IodmFyIGkgaW4gY2FyZE5hbWVzKSB7XHJcblx0XHRcdFx0XHR0aGlzLmdlbkNhcmRCeU5hbWUoY2FyZE5hbWVzW2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHR9KShhKTtcclxuXHJcblx0XHQvLyBmaWxsIGRlY2tcclxuXHRcdGlmKGEuZmlsbCkge1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gYS5maWxsKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIGEuZmlsbFtpXSA9PSAnc3RyaW5nJykge1xyXG5cdFx0XHRcdFx0X2VsX2RlY2suZ2VuQ2FyZEJ5TmFtZShhLmZpbGxbaV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHNoYXJlLmVsZW1lbnRzW19pZF0gPSBfZWxfZGVjaztcclxuXHRcdHJldHVybiBfZWxfZGVjaztcclxuXHR9Oy8vLmJpbmQobWFpbik7XHJcblxyXG5cclxuXHJcblx0bWFpbi5EZWNrID0gZnVuY3Rpb24obmFtZSwgZ3JvdXBOYW1lKSB7XHJcblx0XHR2YXIgX2RlY2tzID0gdGhpcy5nZXRFbGVtZW50c0J5TmFtZShuYW1lLCAnZGVjaycpO1xyXG5cdFx0aWYoZ3JvdXBOYW1lICYmIHR5cGVvZiBncm91cE5hbWUgPT0gJ3N0cmluZycpIHtcclxuXHRcdFx0Zm9yKHZhciBpIGluIF9kZWNrcykge1xyXG5cdFx0XHRcdHZhciBfZ3JvdXAgPSB0aGlzLmdldEVsZW1lbnRCeUlkKF9nZWNrc1tpXS5wYXJlbnQoKSk7XHJcblx0XHRcdFx0aWYoX2dyb3VwICYmIF9ncm91cC5uYW1lICYmIF9ncm91cC5uYW1lID09IGdyb3VwTmFtZSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIF9kZWNrc1tpXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIF9kZWNrc1swXTtcclxuXHRcdH1cclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdC8vIEdldCBhbGwgZGVja3NcclxuXHJcblx0bWFpbi5nZXREZWNrcyA9IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnZ2V0RGVja3MnLCBhKVxyXG5cclxuXHRcdHZhciBfZGVja3MgPSB7fVxyXG5cdFx0Zm9yKHZhciBkIGluIHNoYXJlLmVsZW1lbnRzKSB7XHJcblx0XHRcdGlmKHNoYXJlLmVsZW1lbnRzW2RdLnR5cGUgPT0gJ2RlY2snKSB7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coc2hhcmUuZWxlbWVudHNbZF0ubmFtZSwgc2hhcmUuZWxlbWVudHNbZF0udmlzaWJsZSlcclxuXHRcdFx0XHRpZihhICYmIGEudmlzaWJsZSkge1xyXG5cdFx0XHRcdFx0aWYoc2hhcmUuZWxlbWVudHNbZF0udmlzaWJsZSkge1xyXG5cdFx0XHRcdFx0XHRfZGVja3NbZF0gPSBzaGFyZS5lbGVtZW50c1tkXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0X2RlY2tzW2RdID0gc2hhcmUuZWxlbWVudHNbZF07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gX2RlY2tzO1xyXG5cdH0uYmluZChtYWluKTtcclxuXHJcblx0bWFpbi5nZXREZWNrQnlJZCA9IGZ1bmN0aW9uKGlkKSB7Ly8gSURcclxuXHRcdGZvcih2YXIgZCBpbiBzaGFyZS5lbGVtZW50cykge1xyXG5cdFx0XHRpZihzaGFyZS5lbGVtZW50c1tkXS50eXBlID09ICdkZWNrJyAmJiBkID09IGlkKSB7XHJcblx0XHRcdFx0cmV0dXJuIHNoYXJlLmVsZW1lbnRzW2RdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbnVsbDtcclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdFxyXG5cdHNoYXJlLmRlY2tDYXJkTmFtZXMgPSBmdW5jdGlvbihhKSB7XHJcblx0XHRcclxuXHRcdHZhciBfZGVjayA9IFtdO1xyXG5cdFx0Zm9yKHZhciBpIGluIGEpIHtcclxuXHRcdFx0aWYoYVtpXS5jYXJkICYmIGFbaV0uY2FyZC5uYW1lKSB7XHJcblx0XHRcdFx0X2RlY2sucHVzaChhW2ldLmNhcmQubmFtZSk7XHJcblx0XHRcdH0gZWxzZSBpZihhW2ldLm5hbWUpIHtcclxuXHRcdFx0XHRfZGVjay5wdXNoKGFbaV0ubmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBfZGVjaztcclxuXHR9XHJcblxyXG5cdHJldHVybiBhZGREZWNrKGRhdGEpO1xyXG5cclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL2FkZERlY2suanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0bm9uZSAgICA6IGZ1bmN0aW9uKGNhcmQsIGksIGxlbmd0aCkge1xyXG5cdFx0Y2FyZC5mbGlwID0gZmFsc2U7XHJcblx0fSxcclxuXHRhbGwgICAgIDogZnVuY3Rpb24oY2FyZCwgaSwgbGVuZ3RoKSB7XHJcblx0XHRjYXJkLmZsaXAgPSB0cnVlO1xyXG5cdH0sXHJcblx0bm90bGFzdCA6IGZ1bmN0aW9uKGNhcmQsIGksIGxlbmd0aCkge1xyXG5cdFx0Y2FyZC5mbGlwID0gKGkgPCBsZW5ndGggLSAxKSA/IHRydWUgOiBmYWxzZTtcclxuXHR9LFxyXG5cdGZpcnN0XzEgOiBmdW5jdGlvbihjYXJkLCBpLCBsZW5ndGgpIHtcclxuXHRcdGNhcmQuZmxpcCA9IChpIDwgMSkgPyB0cnVlIDogZmFsc2U7XHJcblx0fSxcclxuXHRmaXJzdF8yIDogZnVuY3Rpb24oY2FyZCwgaSwgbGVuZ3RoKSB7XHJcblx0XHRjYXJkLmZsaXAgPSAoaSA8IDIpID8gdHJ1ZSA6IGZhbHNlO1xyXG5cdH0sXHJcblx0Zmlyc3RfMyA6IGZ1bmN0aW9uKGNhcmQsIGksIGxlbmd0aCkge1xyXG5cdFx0Y2FyZC5mbGlwID0gKGkgPCAzKSA/IHRydWUgOiBmYWxzZTtcclxuXHR9XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9mbGlwVHlwZXMuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFxyXG5cdHZhciBycHIgPSB7XHJcblx0XHRcdFx0XHJcblx0XHQvLyBJbnRlcm5hbCB1c2VcclxuXHRcdF9kb3dudXBjYXJkcyA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0Ly8gaWYoYS5jYXJkcy5sZW5ndGggPT0gMCkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR2YXIgZG93biA9IHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5jYXJkc1thLmNhcmRzLmxlbmd0aCAgLSAxXS5uYW1lKSxcclxuXHRcdFx0XHR1cCAgID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbMF0uY2FyZC5uYW1lKTtcclxuXHRcdFx0aWYoIWRvd24gfHwgIXVwKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0dXAgICA6IHVwLFxyXG5cdFx0XHRcdGRvd24gOiBkb3duXHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0X2Rvd251cHJhbmtudW0gOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdHZhciBkdSA9IHJwci5fZG93bnVwY2FyZHMoYSk7XHJcblx0XHRcdHJldHVybiBkdSA/IHtcclxuXHRcdFx0XHRkb3duIDogc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKGR1LmRvd24ucmFuayksXHJcblx0XHRcdFx0dXAgICA6IHNoYXJlLmNhcmRzUmFua1MuaW5kZXhPZihkdS51cC5yYW5rKVxyXG5cdFx0XHR9IDogZmFsc2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdF9pc0ZpcnN0IDogZnVuY3Rpb24oYSwgX25hbWUpIHtcclxuXHRcdFx0aWYoYS5jYXJkcy5sZW5ndGggPT0gMCkge1xyXG5cdFx0XHRcdHZhciBfdmFsaWRhdGUgPSBudWxsO1xyXG5cdFx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0XHQoX3ZhbGlkYXRlID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbMF0uY2FyZC5uYW1lKSlcclxuXHRcdFx0XHQgJiYgX3ZhbGlkYXRlLnJhbmsgPT0gX25hbWVcclxuXHRcdFx0XHQpO1xyXG5cdFx0XHR9XHJcblx0XHQgXHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0Ly8gUnVsZXNcclxuXHJcblx0XHRzdHJpcGVkIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRpZihhLmNhcmRzLmxlbmd0aCA9PSAwKSByZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBjb2xvcl9BID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLmNhcmRzW2EuY2FyZHMubGVuZ3RoIC0gMV0ubmFtZSkuY29sb3IsXHJcblx0XHRcdFx0Y29sb3JfQiA9IG51bGw7XHJcblxyXG5cdFx0XHR2YXIgX3ZhbGlkYXRlID0gbnVsbDtcclxuXHRcdFx0aWYoX3ZhbGlkYXRlID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbMF0uY2FyZC5uYW1lKSkge1xyXG5cdFx0XHRcdGNvbG9yX0IgPSBfdmFsaWRhdGUuY29sb3I7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHJldHVybiBjb2xvcl9BICE9IGNvbG9yX0I7XHJcblx0XHRcdC8vIHJldHVybiB0cnVlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRmaXJzdEFjZSA6IGZ1bmN0aW9uKGEpIHtcdFx0XHRcclxuXHRcdFx0cmV0dXJuIHJwci5faXNGaXJzdChhLCBcIjFcIik7XHJcblx0XHR9LFxyXG5cclxuXHRcdGZpcnN0S2luZyA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIHJwci5faXNGaXJzdChhLCBcImtcIik7XHJcblx0XHR9LFxyXG5cclxuXHRcdG5vdEZvckVtcHR5IDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRyZXR1cm4gYS5jYXJkcy5sZW5ndGg7XHJcblx0XHR9LFxyXG5cclxuXHRcdG9uZVJhbmsgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmKGEuY2FyZHMubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cdFx0XHR2YXIgZHUgPSBycHIuX2Rvd251cGNhcmRzKGEpO1xyXG5cdFx0XHRyZXR1cm4gZHUgJiYgZHUudXAuc3VpdCA9PSBkdS5kb3duLnN1aXQ7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFueSA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9LFxyXG5cclxuXHRcdG5vdCA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHRhc2NlbmREZWNrIDogZnVuY3Rpb24oYSkgey8vYXNjZW5kIGRlY2sgYnkgc3RlcFxyXG5cdFx0XHRcclxuXHRcdFx0aWYoYS5wdXREZWNrLmxlbmd0aCA9PSAxKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBydWxlQ29ycmVjdCA9IHRydWU7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBhLnB1dERlY2spIHtcclxuXHRcdFx0XHRpZihpID4gMCkge1xyXG5cdFx0XHRcdFx0dmFyIGRvd24gPSBzaGFyZS5jYXJkc1JhbmtTLmluZGV4T2YoXHJcblx0XHRcdFx0XHRcdFx0c2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbaSAtIDFdLmNhcmQubmFtZSkucmFua1xyXG5cdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHR1cCAgID0gc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKFxyXG5cdFx0XHRcdFx0XHRcdHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5wdXREZWNrW2ldLmNhcmQubmFtZSkucmFua1xyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRydWxlQ29ycmVjdCA9IHJ1bGVDb3JyZWN0ICYmIDEgKyBkb3duID09IHVwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcnVsZUNvcnJlY3Q7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlc2NlbmREZWNrIDogZnVuY3Rpb24oYSkgey8vYXNjZW5kIGRlY2sgYnkgc3RlcFxyXG5cdFx0XHRcclxuXHRcdFx0aWYoYS5wdXREZWNrLmxlbmd0aCA9PSAxKSByZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBydWxlQ29ycmVjdCA9IHRydWU7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBhLnB1dERlY2spIHtcclxuXHRcdFx0XHRpZihpID4gMCkge1xyXG5cdFx0XHRcdFx0dmFyIGRvd24gPSBzaGFyZS5jYXJkc1JhbmtTLmluZGV4T2YoXHJcblx0XHRcdFx0XHRcdFx0c2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbaSAtIDFdLmNhcmQubmFtZSkucmFua1xyXG5cdFx0XHRcdFx0XHQpLFxyXG5cdFx0XHRcdFx0XHR1cCAgID0gc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKFxyXG5cdFx0XHRcdFx0XHRcdHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5wdXREZWNrW2ldLmNhcmQubmFtZSkucmFua1xyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRydWxlQ29ycmVjdCA9IHJ1bGVDb3JyZWN0ICYmIGRvd24gPT0gMSArIHVwO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcnVsZUNvcnJlY3Q7XHJcblx0XHR9LFxyXG5cdFx0XHJcblx0XHRvbmVSYW5rRGVjayA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHJcblx0XHRcdGlmKGEucHV0RGVjay5sZW5ndGggPT0gMSkgcmV0dXJuIHRydWU7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgcnVsZUNvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gYS5wdXREZWNrKSB7XHJcblx0XHRcdFx0aWYoaSA+IDApIHtcclxuXHRcdFx0XHRcdHZhciBkb3duID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShhLnB1dERlY2tbaSAtIDFdLmNhcmQubmFtZSkuc3VpdCxcclxuXHRcdFx0XHRcdFx0dXAgICA9IHNoYXJlLnZhbGlkYXRlQ2FyZE5hbWUoYS5wdXREZWNrW2ldLmNhcmQubmFtZSkuc3VpdFxyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRydWxlQ29ycmVjdCA9IHJ1bGVDb3JyZWN0ICYmIGRvd24gPT0gdXA7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBydWxlQ29ycmVjdDtcclxuXHRcdH0sXHJcblxyXG5cdFx0YXNjZW5kIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0L/Rg9GB0YLQsNGPINGB0YLQvtC/0LrQsCAtINC70Y7QsdCw0Y8g0LrQsNGA0YLQsFxyXG5cdFx0XHRpZihhLmNhcmRzLmxlbmd0aCA9PSAwKSByZXR1cm4gdHJ1ZTtcclxuXHJcblx0XHRcdHZhciBkYSA9IHJwci5fZG93bnVwcmFua251bShhKTtcclxuXHRcdFx0cmV0dXJuIGRhICYmIGRhLmRvd24gPCBkYS51cDtcclxuXHRcdH0sXHJcblxyXG5cdFx0ZGVzY2VudCA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHJcblx0XHRcdC8vINC/0YPRgdGC0LDRjyDRgdGC0L7Qv9C60LAgLSDQu9GO0LHQsNGPINC60LDRgNGC0LBcclxuXHRcdFx0aWYoYS5jYXJkcy5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblxyXG5cdFx0XHR2YXIgZGEgPSBycHIuX2Rvd251cHJhbmtudW0oYSk7XHJcblx0XHRcdHJldHVybiBkYSAmJiBkYS5kb3duID4gZGEudXA7XHJcblx0XHR9LFxyXG5cclxuXHRcdGRlc2NlbnRPbmUgOiBmdW5jdGlvbihhKSB7Ly8gb25lIHN0ZXBcclxuXHRcdFx0XHJcblx0XHRcdC8vINC/0YPRgdGC0LDRjyDRgdGC0L7Qv9C60LAgLSDQu9GO0LHQsNGPINC60LDRgNGC0LBcclxuXHRcdFx0aWYoYS5jYXJkcy5sZW5ndGggPT0gMCkgcmV0dXJuIHRydWU7XHJcblxyXG5cdFx0XHR2YXIgZGEgPSBycHIuX2Rvd251cHJhbmtudW0oYSk7XHJcblx0XHRcdHJldHVybiBkYSAmJiBkYS5kb3duID09IDEgKyBkYS51cDtcclxuXHRcdH0sXHJcblxyXG5cdFx0YXNjZW5kT25lIDogZnVuY3Rpb24oYSkgey8vIG9uZSBzdGVwXHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9GD0YHRgtCw0Y8g0YHRgtC+0L/QutCwIC0g0LvRjtCx0LDRjyDQutCw0YDRgtCwXHJcblx0XHRcdGlmKGEuY2FyZHMubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGRhID0gcnByLl9kb3dudXByYW5rbnVtKGEpO1xyXG5cdFx0XHRyZXR1cm4gZGEgJiYgMSArIGRhLmRvd24gPT0gZGEudXA7XHJcblx0XHR9LFxyXG5cclxuXHRcdGFzY2Rlc2NPbmUgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9GD0YHRgtCw0Y8g0YHRgtC+0L/QutCwIC0g0LvRjtCx0LDRjyDQutCw0YDRgtCwXHJcblx0XHRcdGlmKGEuY2FyZHMubGVuZ3RoID09IDApIHJldHVybiB0cnVlO1xyXG5cclxuXHRcdFx0dmFyIGRhID0gcnByLl9kb3dudXByYW5rbnVtKGEpO1xyXG5cdFx0XHRyZXR1cm4gZGEgJiYgTWF0aC5hYnMoZGEuZG93biAtIGRhLnVwKSA9PSAxO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHRyZXR1cm4gcnByO1xyXG5cclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL3JlYWR5UHV0UnVsZXMuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0XHRcdFx0XHJcblx0Ly8gU2ltcGxlUnVsZXNcclxuXHRub3QgICAgICA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdG5vdEZpcnN0IDogZnVuY3Rpb24oYSkge1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ25vdEZpcnN0OicsIGEuY2FyZEluZGV4KTtcclxuXHRcdHJldHVybiBhLmNhcmRJbmRleCA+IDA7XHJcblx0fSxcclxuXHRhbnkgICAgICA6IGZ1bmN0aW9uKGEpIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0b25seXRvcCAgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRyZXR1cm4gYS5jYXJkSW5kZXggPT0gYS5kZWNrTGVuZ3RoIC0gMTtcclxuXHR9LFxyXG5cdC8vIFRPRE8gcnVsZXNcclxuXHRzYW1wbGUgICA6IGZ1bmN0aW9uKGEpIHt9XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9yZWFkeVRha2VSdWxlcy5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHRkZWNrTGVuZ3RoIDogZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRyZXR1cm4gc2hhcmUuY2FyZHNSYW5rLmxlbmd0aCA8PSBhLmRlY2suZ2V0Q2FyZHMoKS5sZW5ndGg7XHJcblx0XHR9LFxyXG5cdFx0bm90IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdOT1QgRklMTCBSVUxFUycpO1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9maWxsUnVsZXMuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0bm9uZSA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0cmV0dXJuIHt4IDogcGFyYW1zLngsIHkgOiBwYXJhbXMueX07XHJcblx0fSxcclxuXHRsYXN0X3RocmVlX21pbiA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0aWYoaW5kZXggPiBsZW5ndGggLSAzKSB7XHJcblx0XHRcdGlmKGxlbmd0aCA+IDMpIHtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0eCA6IHBhcmFtcy54IC0gKGxlbmd0aCAtIDMgLSBpbmRleCkgKiAyLFxyXG5cdFx0XHRcdFx0eSA6IHBhcmFtcy55IC0gKGxlbmd0aCAtIDMgLSBpbmRleClcclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0XHR4IDogcGFyYW1zLnggKyAoaW5kZXggKiAyKSxcclxuXHRcdFx0XHRcdHkgOiBwYXJhbXMueSArIChpbmRleHwwKVxyXG5cdFx0XHRcdH07XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB7eCA6IHgsIHkgOiB5fTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHR3aW5kZWNrX3R5cGVBIDogZnVuY3Rpb24ocGFyYW1zLCBjYXJkLCBpbmRleCwgbGVuZ3RoLCBkZWNrKSB7XHJcblxyXG5cdFx0dmFyIHR3aW5kZWNrX21heF9jYXJkcyAgICAgICA9IDI0LFxyXG5cdFx0XHR0d2luZGVja19kZWNrX2xlbmd0aCAgICAgPSAzO1xyXG5cdFx0XHJcblx0XHR2YXIgX3BhZGRpbmcgPSB7XHJcblx0XHRcdHggOiAyLFxyXG5cdFx0XHR5IDogMVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBfZGVwdGggPSAobGVuZ3RoIC8gdHdpbmRlY2tfbWF4X2NhcmRzICogdHdpbmRlY2tfZGVja19sZW5ndGgpfDA7XHJcblx0XHRpZihfZGVwdGggPj0gdHdpbmRlY2tfZGVja19sZW5ndGgpIF9kZXB0aCA9IHR3aW5kZWNrX2RlY2tfbGVuZ3RoIC0gMTtcclxuXHJcblx0XHR2YXIgX3BsdXMgPSBpbmRleCAtIChsZW5ndGggLSBfZGVwdGggLSAxKTtcclxuXHRcdGlmKF9wbHVzIDwgMCkgX3BsdXMgPSAwO1xyXG5cclxuXHRcdHJldHVybiB7XHJcblx0XHRcdHggOiBwYXJhbXMueCArIF9wYWRkaW5nLnggKiBfcGx1cywgXHJcblx0XHRcdHkgOiBwYXJhbXMueSArIF9wYWRkaW5nLnkgKiBfcGx1c1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdHJhZGlhbCA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cclxuICAgICAgICAvLyAgICAgICAgICAgICAgYlxyXG4gICAgICAgIC8vICAgICAgIEMgIC4uYDogICBBID0gc2luKGIpICogQ1xyXG4gICAgICAgIC8vICAgICAuLi5gYCAgIDpCICBCID0gY29zKGIpICogQ1xyXG4gICAgICAgIC8vIGEuYGAuLi4uLi4uKzpcclxuICAgICAgICAvLyAgICAgICAgQSAgICAgeSA5MGRlZ1xyXG4gICAgICAgIHZhciBfZGVwdGggID0gMSxcclxuICAgICAgICBcdF9yYWRpdXMgPSBpbmRleCAqIF9kZXB0aCxcclxuICAgICAgICBcdF9zdGVwICAgPSAxODAgLyAxNixcclxuICAgICAgICBcdF9jYXJkICAgPSBTb2xpdGFpcmVFbmdpbmUub3B0aW9ucy5jYXJkLFxyXG4gICAgICAgIFx0X2FuZ2xlICA9IHBhcmFtcy5yb3RhdGUsLy9fc3RlcCAvIDIgKyAyNzA7XHJcbiAgICAgICAgXHRfZGVnICAgID0gTWF0aC5QSSAvIDE4MCxcclxuICAgICAgICBcdF9hICAgICAgPSBNYXRoLnNpbihfYW5nbGUgKiBfZGVnKSAqIF9yYWRpdXMsXHJcbiAgICAgICAgXHRfYiAgICAgID0gTWF0aC5jb3MoX2FuZ2xlICogX2RlZykgKiBfcmFkaXVzO1xyXG4gICAgICAgIC8vIGlmKF9hbmdsZSA+IDM2MCkgX2FuZ2xlIC09IDM2MDtcclxuXHRcdHJldHVybiB7XHJcbiAgICAgICAgICAgIHggOiBwYXJhbXMueCArIF9hLC8vIC0gX2NhcmQud2lkdGggIC8gMixcclxuICAgICAgICAgICAgeSA6IHBhcmFtcy55IC0gX2IvLyAtIF9jYXJkLmhlaWdodCAvIDJcclxuXHRcdH07XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3JhZGlhbDonLCBwYXJhbXMsIGNhcmQsIGluZGV4LCBsZW5ndGgsIGRlY2spO1xyXG5cdH0sXHJcblx0c3BlY2lhbCA6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0dmFyIF95ID0gcGFyYW1zLnksIF94ID0gcGFyYW1zLng7XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW5kZXg7IGkgKz0gMSkge1xyXG5cdFx0XHRfeSArPSBkZWNrW2ldICYmIGRlY2tbaV0uZmxpcCA/IHBhcmFtcy5mbGlwX3BhZGRpbmdfeSA6IHBhcmFtcy5wYWRkaW5nX3k7XHJcblx0XHRcdF94ICs9IGRlY2tbaV0gJiYgZGVja1tpXS5mbGlwID8gcGFyYW1zLmZsaXBfcGFkZGluZ194IDogcGFyYW1zLnBhZGRpbmdfeDtcclxuXHRcdH1cclxuXHRcdHJldHVybiB7eCA6IF94LCB5IDogX3l9O1xyXG5cdH0sXHJcblx0dmVydGljYWw6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0dmFyIF95ID0gcGFyYW1zLnk7XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW5kZXg7IGkgKz0gMSkgX3kgKz0gZGVja1tpXSAmJiBkZWNrW2ldLmZsaXAgPyBwYXJhbXMuZmxpcF9wYWRkaW5nX3kgOiBwYXJhbXMucGFkZGluZ195O1xyXG5cdFx0dmFyIF9yZXR1cm4gPSB7XHJcblx0XHRcdHggOiBwYXJhbXMueCxcclxuXHRcdFx0eSA6IF95XHJcblx0XHR9O1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3ZlcnRpY2FsOicsIGRlY2subGVuZ3RoLCBpbmRleCwgX3JldHVybik7XHJcblx0XHRyZXR1cm4gX3JldHVybjtcclxuXHR9LFxyXG5cdGhvcml6b250YWw6IGZ1bmN0aW9uKHBhcmFtcywgY2FyZCwgaW5kZXgsIGxlbmd0aCwgZGVjaykge1xyXG5cdFx0dmFyIF94ID0gcGFyYW1zLng7XHJcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgaW5kZXg7IGkgKz0gMSkgX3ggKz0gZGVja1tpXSAmJiBkZWNrW2ldLmZsaXAgPyBwYXJhbXMuZmxpcF9wYWRkaW5nX3ggOiBwYXJhbXMucGFkZGluZ194O1xyXG5cdFx0dmFyIF9yZXR1cm4gPSB7XHJcblx0XHRcdHggOiBfeCxcclxuXHRcdFx0eSA6IHBhcmFtcy55XHJcblx0XHR9O1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2hvcml6b250YWw6JywgZGVjay5sZW5ndGgsIGluZGV4LCBfcmV0dXJuKTtcclxuXHRcdHJldHVybiBfcmV0dXJuO1xyXG5cdH1cclxufVxuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIGV4dGVuc2lvbnMvcGFkZGluZ1R5cGVzLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHJcblx0dmFyIGRlY2tBY3Rpb25zID0ge1xyXG5cdFx0XHJcblx0XHRcInRlc3REZWNrQWN0aW9uXCIgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0Ly8gVE9ET1xyXG5cdFx0fSxcclxuXHRcdFxyXG5cdFx0XCJ0d2luZGVja1wiIDogZnVuY3Rpb24oZSkge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJ0d2luZGVjayBhY3Rpb246XCIsIGUpO1xyXG5cdFx0XHRpZihlLmRlY2tfZnJvbS5pdGVyYXRpb24gPT0gMCkge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHZhciBkZWNrX3RvID0gbWFpbi5EZWNrKGUuZGF0YS50byk7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgbW92ZUNhcmRzQ291bnQgPSBlLmRhdGEuY291bnQgJiYgdHlwZW9mIGUuZGF0YS5jb3VudCA9PSAnbnVtYmVyJyA/IGUuZGF0YS5jb3VudCA6IHNoYXJlLmRlZmF1bHRfdHdpbmRlY2tfbW92ZV9jYXJkX2NvdW50O1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8g0LrQvtC70LjRh9C10YHRgtCy0L4g0L7RgdGC0LDQstGI0LjRhdGB0Y8g0LrQsNGA0YIg0LIg0L/QtdGA0LLQvtC5INC60L7Qu9C+0LTQtVxyXG5cdFx0XHR2YXIgZGVja0Zyb21DYXJkc0NvdW50ID0gZS5kZWNrX2Zyb20uZ2V0Q2FyZHMoKS5sZW5ndGg7XHJcblx0XHRcdFxyXG5cdFx0XHRpZihkZWNrRnJvbUNhcmRzQ291bnQgPCBtb3ZlQ2FyZHNDb3VudCkge1xyXG5cdFx0XHRcdG1vdmVDYXJkc0NvdW50ID0gZGVja0Zyb21DYXJkc0NvdW50O1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQuNC90LjRhtC40LDQu9C40LfQsNGG0LjRj1xyXG5cdFx0XHRpZih0eXBlb2YgZS5kZWNrX2Zyb20uaXRlcmF0aW9uID09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdFx0Ly8gXCItMVwiIC0gaW5maW5pdHlcclxuXHRcdFx0XHRlLmRlY2tfZnJvbS5pdGVyYXRpb24gPSAtMTtcclxuXHRcdFx0XHRlLmRlY2tfZnJvbS50d2luZGVjayA9IFtdO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyDQutC+0LvQuNGH0LXRgdGC0LLQviDRhtC40LrQu9C+0LIg0L/QtdGA0LXQu9C40YHRgtGL0LLQsNC90LjQuSDRgdC90LDRh9Cw0LvQviDQtNC+INC60L7QvdGG0LBcclxuXHRcdFx0aWYoZS5pdGVyYXRpb25zICYmIGUuZGVja19mcm9tLml0ZXJhdGlvbiA8IDApIHtcclxuXHRcdFx0XHRlLmRlY2tfZnJvbS5pdGVyYXRpb24gPSBlLml0ZXJhdGlvbnNcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0ZGVja190by5oaWRlQ2FyZHMoKTtcclxuXHJcblx0XHRcdHZhciBfZGVjayA9IGRlY2tfdG8uUG9wKGRlY2tfdG8uZ2V0Q2FyZHMoKS5sZW5ndGgpO1xyXG5cclxuXHRcdFx0Ly8gU3RlcFxyXG5cdFx0XHRzaGFyZS5vbmVTdGVwV2F5LnR3aW5kZWNrID0ge307XHJcblx0XHRcdHNoYXJlLm9uZVN0ZXBXYXkudHdpbmRlY2sudG9IaWRlID0gc2hhcmUuZGVja0NhcmROYW1lcyhfZGVjayk7XHJcblx0XHRcdFxyXG5cdFx0XHRfZGVjay5yZXZlcnNlKCk7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBfZGVjaykge1xyXG5cdFx0XHRcdGUuZGVja19mcm9tLnR3aW5kZWNrLnVuc2hpZnQoX2RlY2tbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHQvLyDQv9C10YDQstCw0Y8g0LrQvtC70L7QtNCwINC/0YPRgdGC0LBcclxuXHRcdFx0aWYoZS5kZWNrX2Zyb20udHdpbmRlY2sgJiYgZS5kZWNrX2Zyb20udHdpbmRlY2subGVuZ3RoICYmIGRlY2tGcm9tQ2FyZHNDb3VudCA9PSAwICYmIGUuZGVja19mcm9tLml0ZXJhdGlvbiAhPSAwKSB7XHJcblx0XHRcdFx0Ly8gZS5kZWNrX2Zyb20udHdpbmRlY2sucmV2ZXJzZSgpO1xyXG5cdFx0XHRcdGUuZGVja19mcm9tLlB1c2goZS5kZWNrX2Zyb20udHdpbmRlY2spO1xyXG5cdFx0XHRcdGUuZGVja19mcm9tLnR3aW5kZWNrID0gW107Ly8gdW5zaGlmdFxyXG5cdFx0XHQvLyDQv9C10YDQtdC70LjRgdGC0YvQstCw0L3QuNC1XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gZS5kZWNrX2Zyb20uUG9wKG1vdmVDYXJkc0NvdW50KTtcclxuXHRcdFx0XHRkZWNrX3RvLlB1c2goX2RlY2spO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRlLmRlY2tfZnJvbS5zaG93Q2FyZHMoKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLSBGTElQIC0tLS0tLS0tLS0tLVxyXG5cdFx0XHQvLyB2YXIgX2RlY2tfZnJvbSA9IGUuZGVja19mcm9tLmdldENhcmRzKCk7XHJcblx0XHRcdC8vIHZhciBfZGVja190byA9IGRlY2tfdG8uZ2V0Q2FyZHMoKTtcclxuXHRcdFx0XHJcblx0XHRcdGUuZGVja19mcm9tLmZsaXBDaGVjaygpO1xyXG5cdFx0XHRkZWNrX3RvICAgIC5mbGlwQ2hlY2soKTtcclxuXHRcdFx0XHJcblx0XHRcdGUuZGVja19mcm9tLlJlZHJhdygpO1xyXG5cdFx0XHRkZWNrX3RvICAgIC5SZWRyYXcoKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIC0tLS0tLS0tLS0tLSBTVEVQIC0tLS0tLS0tLS0tLVxyXG5cdFx0XHRzaGFyZS5vbmVTdGVwV2F5LnR3aW5kZWNrLmZyb20gICAgICA9IGUuZGVja19mcm9tLm5hbWUsXHJcblx0XHRcdHNoYXJlLm9uZVN0ZXBXYXkudHdpbmRlY2sudG8gICAgICAgID0gZGVja190byAgICAubmFtZSxcclxuXHRcdFx0c2hhcmUub25lU3RlcFdheS50d2luZGVjay5tb3ZlQ2FyZHMgPSBzaGFyZS5kZWNrQ2FyZE5hbWVzKF9kZWNrKSxcclxuXHRcdFx0c2hhcmUub25lU3RlcFdheS50d2luZGVjay5pdGVyYXRpb24gPSAoZS5kZWNrX2Zyb20uaXRlcmF0aW9ufDApXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBoaWRkZW5DYXJkcyA6IHNoYXJlLmRlY2tDYXJkTmFtZXMoZS5kZWNrX2Zyb20udHdpbmRlY2spLCBcclxuXHRcdFx0Ly8gY2FyZHMgICAgICAgOiBzaGFyZS5kZWNrQ2FyZE5hbWVzKGUuZGVja19mcm9tLmdldENhcmRzKCkpLFxyXG5cclxuXHRcdFx0aWYodHlwZW9mIHNoYXJlLnVuZG9NZXRob2RzID09IFwidW5kZWZpbmVkXCIpIHtcclxuXHRcdFx0XHRzaGFyZS51bmRvTWV0aG9kcyA9IHt9O1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvLyBIaXN0b3J5IGV4dGVuc2lvblxyXG5cdFx0XHRzaGFyZS51bmRvTWV0aG9kcy50d2luZGVjayA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFx0XHRpZihhLnR3aW5kZWNrKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHZhciBfZGVja19mcm9tID0gbWFpbi5EZWNrKGEudHdpbmRlY2suZnJvbSksXHJcblx0XHRcdFx0XHRcdF9kZWNrX3RvICAgPSBtYWluLkRlY2soYS50d2luZGVjay50byk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdC8vIFRPRE9cclxuXHRcdFx0XHRcdC8vIGRlY2tfdG8gY2FyZHMgW21vdmVDYXJkc10gLT4gZGVja19mcm9tXHJcblx0XHRcdFx0XHR2YXIgX21vdmVEZWNrID0gX2RlY2tfdG8uUG9wKGEudHdpbmRlY2subW92ZUNhcmRzLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRpZihfbW92ZURlY2subGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdwdXNoIzAnLCBfbW92ZURlY2spO1xyXG5cdFx0XHRcdFx0XHRfZGVja19mcm9tLlB1c2goX21vdmVEZWNrKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBkZWNrX2Zyb20udHdpbmRlY2sgY2FyZHMgW3RvSGlkZV0gIC0+IGRlY2tfdG9cclxuXHRcdFx0XHRcdHZhciBfdHdpbmRlY2sgPSBbXTtcclxuXHRcdFx0XHRcdGZvcih2YXIgaSBpbiBhLnR3aW5kZWNrLnRvSGlkZSkge1xyXG5cdFx0XHRcdFx0XHRpZihfZGVja19mcm9tLnR3aW5kZWNrLmxlbmd0aCkge1xyXG5cdFx0XHRcdFx0XHRcdF90d2luZGVjay5wdXNoKFxyXG5cdFx0XHRcdFx0XHRcdFx0X2RlY2tfZnJvbS50d2luZGVjay5wb3AoKVxyXG5cdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdF90d2luZGVjay5yZXZlcnNlKCk7XHJcblxyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ19kZWNrX2Zyb20udHdpbmRlY2s6JywgX2RlY2tfZnJvbS50d2luZGVjayk7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygnYS50d2luZGVjay50b0hpZGU6JywgYS50d2luZGVjay50b0hpZGUpO1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ190d2luZGVjazonLCBfdHdpbmRlY2spO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRpZihfdHdpbmRlY2subGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCdwdXNoIzEnKTtcclxuXHRcdFx0XHRcdFx0X2RlY2tfdG8uUHVzaChfdHdpbmRlY2spO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdF9kZWNrX3RvLnNob3dDYXJkcygpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRfZGVja19mcm9tLmZsaXBDaGVjaygpO1xyXG5cclxuXHRcdFx0XHRcdF9kZWNrX2Zyb20uUmVkcmF3KCk7XHJcblx0XHRcdFx0XHRfZGVja190byAgLlJlZHJhdygpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygndHdpbmRlY2sgdW5kbzonLCBhLnR3aW5kZWNrLCBzaGFyZS5kZWNrQ2FyZE5hbWVzKF9kZWNrX2Zyb20udHdpbmRlY2spKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHNoYXJlLnJlZG9NZXRob2RzLnR3aW5kZWNrID0gZnVuY3Rpb24oYSkge1xyXG5cdFx0XHRcdGlmKGEudHdpbmRlY2spIHtcclxuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCd0d2luZGVjayByZWRvOicsIGEudHdpbmRlY2spO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnbWFrZVN0ZXAnLCBzaGFyZS5vbmVTdGVwV2F5KTtcclxuXHRcdFx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdFx0XHRzaGFyZS5jaGVja1RpcHMoKTtcclxuXHJcblx0XHRcdGUuZGVja19mcm9tLml0ZXJhdGlvbiAtPSAxO1xyXG5cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbigncnVuRGVja0FjdGlvbnMnLCBmdW5jdGlvbihlKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygncnVuRGVja0FjdGlvczonLCBlLmRlY2spO1xyXG5cdFx0Zm9yKHZhciBhY3Rpb25OYW1lIGluIGUuZGVjay5hY3Rpb25zKSB7XHJcblx0XHRcdGlmKGRlY2tBY3Rpb25zW2FjdGlvbk5hbWVdKSB7XHJcblx0XHRcdFx0ZGVja0FjdGlvbnNbYWN0aW9uTmFtZV0oe1xyXG5cdFx0XHRcdFx0ZGVja19mcm9tIDogZS5kZWNrLCBcclxuXHRcdFx0XHRcdGRhdGEgICAgICA6IGUuZGVjay5hY3Rpb25zW2FjdGlvbk5hbWVdXHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3J1bkRlY2tBY3Rpb24nLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihlLm5hbWUgJiYgdHlwZW9mIGRlY2tBY3Rpb25zW2UubmFtZV0gPT0gJ3N0cmluZycvKiAmJiBlLmRhdGEqLykge1xyXG5cdFx0XHRkZWNrQWN0aW9uc1tlLm5hbWVdKGUuZGF0YSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdhZGREZWNrQWN0aW9uJywgZnVuY3Rpb24oZSkge1xyXG5cdFx0Y29uc29sZS5sb2coZGVja0FjdGlvbnMpO1xyXG5cdFx0aWYoZS5uYW1lICYmIGUuY2FsbGJhY2spIGRlY2tBY3Rpb25zW2UubmFtZV0gPSBlLmNhbGxiYWNrO1xyXG5cclxuXHR9KTtcclxuXHJcblx0cmV0dXJuIGRlY2tBY3Rpb25zO1xyXG5cclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL2FkZERlY2tBY3Rpb24uanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcblx0XHJcblx0YWxsVG9BbGwgOiBmdW5jdGlvbihhKSB7XHJcblx0XHR2YXIgX21vdmVzID0gW107XHJcblx0XHQvLyBlYWNoIGRlY2tzXHJcblx0XHRmb3IodmFyIGRlY2tJbmRleCBpbiBhLmRlY2tzKSB7XHJcblx0XHRcdHZhciBfY2FyZHMgPSBhLmRlY2tzW2RlY2tJbmRleF0uZ2V0Q2FyZHMoKTtcclxuXHRcdFx0Ly8gZWFjaCBjYXJkcyBpbiAgY3VycmVudCBkZWNrXHJcblx0XHRcdGZvcih2YXIgY2FyZEluZGV4IGluIF9jYXJkcykge1xyXG5cdFx0XHRcdHZhciBfaWQgPSBfY2FyZHNbY2FyZEluZGV4XS5pZDtcclxuXHRcdFx0XHQvLyBjaGVjayBjYW4gdGFrZSB0aGlzIGNhcmQvZGVja1xyXG5cdFx0XHRcdHZhciBfdGFrZSA9IGEuZGVja3NbZGVja0luZGV4XS5UYWtlKF9pZCk7XHJcblx0XHRcdFx0aWYoX3Rha2UpIHtcclxuXHRcdFx0XHRcdC8vIGNoZWNrIHB1dCB0YWtlZCBjYXJkL2RlY2sgaWludG8gYW5vdGhlciBkZWNrc1xyXG5cdFx0XHRcdFx0Zm9yKHZhciBkZWNrSW5kZXhfMiBpbiBhLmRlY2tzKSB7XHJcblx0XHRcdFx0XHRcdC8vIC4uLmFsbCB3aXRob3V0IGN1cnJlbnRcclxuXHRcdFx0XHRcdFx0aWYoZGVja0luZGV4ICE9IGRlY2tJbmRleF8yKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIF9wdXQgPSBhLmRlY2tzW2RlY2tJbmRleF8yXS5QdXQoX3Rha2UpO1xyXG5cdFx0XHRcdFx0XHRcdGlmKF9wdXQpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBfY2FyZHNfdG8gPSBhLmRlY2tzW2RlY2tJbmRleF8yXS5nZXRDYXJkcygpLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRfY2FyZF90byAgPSBfY2FyZHNfdG8ubGVuZ3RoID8gX2NhcmRzX3RvW19jYXJkc190by5sZW5ndGggLSAxXSA6IG51bGw7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnVGlwOicsIGEuZGVja3NbZGVja0luZGV4XzJdLmRvbUVsZW1lbnQvKl9jYXJkc1tjYXJkSW5kZXhdLm5hbWUsICdmcm9tJywgYS5kZWNrc1tkZWNrSW5kZXhdLm5hbWUsIGEuZGVja3NbZGVja0luZGV4XS52aXNpYmxlLCAndG8nLCBhLmRlY2tzW2RlY2tJbmRleF8yXS5uYW1lKi8pXHJcblx0XHRcdFx0XHRcdFx0XHRfbW92ZXMucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGZyb20gOiB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZGVjayA6IGEuZGVja3NbZGVja0luZGV4XSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYXJkIDogX2NhcmRzW2NhcmRJbmRleF0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRcdFx0XHRcdHRvIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGRlY2sgOiBhLmRlY2tzW2RlY2tJbmRleF8yXSxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0Q2FyZCA6IF9jYXJkX3RvXHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2FsbFRvQWxsOicsIF9tb3Zlcy5sZW5ndGgpO1xyXG5cdFx0cmV0dXJuIF9tb3ZlcztcclxuXHR9XHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy90aXBzUnVsZXMuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbignaW5pdEZpZWxkJywgZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdpbml0RmllbGQnLCBlKTtcclxuXHJcblx0XHQvLyBzaGFyZS56eiA9IDk7XHJcblxyXG5cdFx0dmFyIGRvbUVsZW1lbnQgPSBlLmEuZmllbGQgPyBlLmEuZmllbGQgOiAnI21hdCc7Ly8gZGVmYXVsdDtcclxuXHRcdGlmKHR5cGVvZiBkb21FbGVtZW50ID09ICdzdHJpbmcnKSB7XHJcblx0XHRcdGlmKGRvbUVsZW1lbnQuc3BsaXQoJy4nKS5sZW5ndGggPT0gMikge1xyXG5cdFx0XHRcdGRvbUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKGRvbUVsZW1lbnQuc3BsaXQoJy4nKVsxXSlbMF07XHJcblx0XHRcdH0gZWxzZSBpZihkb21FbGVtZW50LnNwbGl0KCcjJykubGVuZ3RoID09IDIpIHtcclxuXHRcdFx0XHRkb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZG9tRWxlbWVudC5zcGxpdCgnIycpWzFdKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRkb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoZG9tRWxlbWVudCk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYoIWRvbUVsZW1lbnQpIHtcclxuXHRcdFx0XHRkb21FbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hdCcpXHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHQvLyBzaGFyZS5maWVsZCA9IGUuZmllbGQ7XHJcblx0XHRzaGFyZS5maWVsZC5kb21FbGVtZW50ID0gZG9tRWxlbWVudDtcclxuXHJcblx0XHR2YXIgX3BhcmFtcyA9IHt9O1xyXG5cclxuXHRcdGlmKGUuYS53aWR0aCAgJiYgdHlwZW9mIGUuYS53aWR0aCAgPT0gJ251bWJlcicpIF9wYXJhbXMud2lkdGggID0gc2hhcmUuem9vbSAqIGUuYS53aWR0aCAgKyAncHgnO1xyXG5cdFx0aWYoZS5hLmhlaWdodCAmJiB0eXBlb2YgZS5hLmhlaWdodCA9PSAnbnVtYmVyJykgX3BhcmFtcy5oZWlnaHQgPSBzaGFyZS56b29tICogZS5hLmhlaWdodCArICdweCc7XHJcblx0XHRpZihlLmEudG9wICAgICYmIHR5cGVvZiBlLmEudG9wICAgID09ICdudW1iZXInKSBfcGFyYW1zLnRvcCAgICA9IHNoYXJlLnpvb20gKiBlLmEudG9wICAgICsgJ3B4JztcclxuXHRcdGlmKGUuYS5sZWZ0ICAgJiYgdHlwZW9mIGUuYS5sZWZ0ICAgPT0gJ251bWJlcicpIF9wYXJhbXMubGVmdCAgID0gc2hhcmUuem9vbSAqIGUuYS5sZWZ0ICAgKyAncHgnO1xyXG5cdFx0Ly8gaWYoYS5yb3RhdGUgJiYgdHlwZW9mIGEucm90YXRlID09ICdudW1iZXInKSBfcGFyYW1zLnRyYW5zZm9ybSA9ICdyb3RhdGUoJyArIChhLnJvdGF0ZXwwKSArICdkZWcpJztcclxuXHRcdFxyXG5cdFx0dmFyIHRoZW1lID0gKGUuYS50aGVtZSAmJiB0eXBlb2YgZS5hLnRoZW1lID09ICdzdHJpbmcnKSA/IGUuYS50aGVtZSA6IHNoYXJlLmRlZmF1bHRfdGhlbWU7Ly8gVE9ETyAodGhlbWUgZnJvbSBjb25maWcpXHJcblxyXG5cdFx0JChkb21FbGVtZW50KS5jc3MoX3BhcmFtcykuYWRkQ2xhc3MoJ2ZpZWxkJykuYWRkQ2xhc3ModGhlbWUpO1xyXG5cdH0pO1xyXG5cclxuXHR2YXIgYXBwbHlDaGFuZ2VkUGFyYW1ldGVycyA9IGZ1bmN0aW9uKHAsIGEsIGRlY2spIHtcclxuXHRcdFxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2FwcGx5Q2hhbmdlZFBhcmFtZXRlcnMnLCBhKTtcclxuXHRcdFxyXG5cdFx0cC54ID0gYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnggJiYgdHlwZW9mIGEucG9zaXRpb24ueCA9PSAnbnVtYmVyJyAgPyBhLnBvc2l0aW9uLnggOiAwLFxyXG5cdFx0cC55ID0gYS5wb3NpdGlvbiAmJiBhLnBvc2l0aW9uLnkgJiYgdHlwZW9mIGEucG9zaXRpb24ueSA9PSAnbnVtYmVyJyAgPyBhLnBvc2l0aW9uLnkgOiAwO1xyXG5cdFx0cC54ID0gYS5wYXJlbnRQb3NpdGlvbiAmJiBhLnBhcmVudFBvc2l0aW9uLnggPyBwLnggKyBhLnBhcmVudFBvc2l0aW9uLnggOiBwLng7XHJcblx0XHRwLnkgPSBhLnBhcmVudFBvc2l0aW9uICYmIGEucGFyZW50UG9zaXRpb24ueSA/IHAueSArIGEucGFyZW50UG9zaXRpb24ueSA6IHAueTtcclxuXHRcdFxyXG5cdFx0ZGVjay5yb3RhdGUgPSBwLnJvdGF0ZSA9IGEucm90YXRlICYmIHR5cGVvZiBhLnJvdGF0ZSA9PSAnbnVtYmVyJyA/IGEucm90YXRlIDogMDtcclxuXHRcdFxyXG5cdFx0Ly8g0YMgcGFkZGluZ194LCBwYWRkaW5nX3kg0L/RgNC40L7RgNC40YLQtdGCINCy0YvRiNC1INGH0LXQvCBwYWRkaW5nVHlwZVxyXG5cclxuXHRcdHAucGFkZGluZ195ID0gYS5wYWRkaW5nWSAgICAgICAgICAmJiB0eXBlb2YgYS5wYWRkaW5nWSAgICAgPT0gJ251bWJlcicgXHJcblx0XHRcdD8gYS5wYWRkaW5nWSBcclxuXHRcdFx0OiBhLnBhZGRpbmdUeXBlXHJcblx0XHRcdFx0PyBzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeSAgICAgIFxyXG5cdFx0XHRcdDogMCxcclxuXHRcdHAucGFkZGluZ194ID0gYS5wYWRkaW5nWCAgICAgICAgICAmJiB0eXBlb2YgYS5wYWRkaW5nWCAgICAgPT0gJ251bWJlcicgXHJcblx0XHQ/IGEucGFkZGluZ1ggXHJcblx0XHQ6IGEucGFkZGluZ1R5cGVcclxuXHRcdFx0PyBzaGFyZS5kZWZhdWx0X3BhZGRpbmdfeCAgICAgIFxyXG5cdFx0XHQ6IDAsXHJcblx0XHRwLmZsaXBfcGFkZGluZ195ID0gYS5mbGlwUGFkZGluZ1kgJiYgdHlwZW9mIGEuZmxpcFBhZGRpbmdZID09ICdudW1iZXInIFxyXG5cdFx0PyBhLmZsaXBQYWRkaW5nWSBcclxuXHRcdDogYS5wYWRkaW5nVHlwZVxyXG5cdFx0XHQ/IHNoYXJlLmRlZmF1bHRfZmxpcF9wYWRkaW5nX3kgXHJcblx0XHRcdDogMCxcclxuXHRcdHAuZmxpcF9wYWRkaW5nX3ggPSBhLmZsaXBQYWRkaW5nWCAmJiB0eXBlb2YgYS5mbGlwUGFkZGluZ1ggPT0gJ251bWJlcicgXHJcblx0XHQ/IGEuZmxpcFBhZGRpbmdYIFxyXG5cdFx0OiBhLnBhZGRpbmdUeXBlXHJcblx0XHRcdD8gc2hhcmUuZGVmYXVsdF9mbGlwX3BhZGRpbmdfeCBcclxuXHRcdFx0OiAwO1xyXG5cdH07XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdoaWRlQ2FyZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnaGlkZUNhcmQ6JywgZSk7XHJcblx0XHRpZihlICYmIGUuZG9tRWxlbWVudCkge1xyXG5cdFx0XHQkKGUuZG9tRWxlbWVudCkuaGlkZSgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdzaG93Q2FyZCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnc2hvd0NhcmQ6JywgZSk7XHJcblx0XHRpZihlICYmIGUuZG9tRWxlbWVudCkge1xyXG5cdFx0XHQkKGUuZG9tRWxlbWVudCkuc2hvdygpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdFxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdhZGREZWNrRWwnLCBmdW5jdGlvbihlKSB7XHJcblxyXG5cdFx0YXBwbHlDaGFuZ2VkUGFyYW1ldGVycyhlLnBhcmFtcywgZS5hLCBlLmRlY2spO1xyXG5cclxuXHRcdGUuZGVjay5kb21FbGVtZW50ID0gJCgnPGRpdj4nKVswXTtcclxuXHJcblx0XHQvLyBlLmRlY2suZG9tRWxlbWVudCA9IGUuZGVjay5kb21FbGVtZW50O1xyXG5cdFx0XHJcblx0XHQvKnRoaXMuaGlnaGxpZ2h0T24gPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0aGlnaGxpZ2h0ID0gdHJ1ZTtcclxuXHRcdFx0JChkb21FbGVtZW50KS5hZGRDbGFzcyhoaWdobGlnaHRDbGFzcyk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHRoaXMuaGlnaGxpZ2h0T2ZmID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGhpZ2hsaWdodCA9IGZhbHNlO1xyXG5cdFx0XHQkKGRvbUVsZW1lbnQpLnJlbW92ZUNsYXNzKGhpZ2hsaWdodENsYXNzKTtcclxuXHRcdH0qL1xyXG5cdFx0XHJcblx0XHR2YXIgX3BhcmFtcyA9IHtcclxuXHRcdFx0bGVmdCAgICAgIDogc2hhcmUuem9vbSAqIGUucGFyYW1zLnggICAgICAgICsgJ3B4JyxcclxuXHRcdFx0dG9wICAgICAgIDogc2hhcmUuem9vbSAqIGUucGFyYW1zLnkgICAgICAgICsgJ3B4JyxcclxuXHRcdFx0d2lkdGggICAgIDogc2hhcmUuem9vbSAqIHNoYXJlLmNhcmQud2lkdGggICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0ICAgIDogc2hhcmUuem9vbSAqIHNoYXJlLmNhcmQuaGVpZ2h0ICsgJ3B4JyxcclxuXHRcdFx0dHJhbnNmb3JtIDogJ3JvdGF0ZSgnICsgKGUucGFyYW1zLnJvdGF0ZXwwKSArICdkZWcpJ1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0X3BhcmFtcy5kaXNwbGF5ID0gZS5kZWNrLnZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cclxuXHRcdCQoZS5kZWNrLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKS5hZGRDbGFzcygnZWwnKS5hdHRyKHtpZDogZS5kZWNrLmdldElkKCl9KTtcclxuXHJcblx0XHQvLyB2YXIgc2hvd1Nsb3QgPSBlLmEuc2hvd1Nsb3QgJiYgdHlwZW9mIGUuYS5zaG93U2xvdCA9PSAnYm9vbGVhbicgPyBlLmEuc2hvd1Nsb3QgOiBzaGFyZS5kZWZhdWx0X3Nob3dTbG90O1xyXG5cdFx0Ly8gaWYoc2hvd1Nsb3QpICQoZS5kZWNrLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdzbG90Jyk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnc2xvdCcsIGUuYSk7XHJcblx0XHRpZihlLmEuc2hvd1Nsb3QpICQoZS5kZWNrLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdzbG90Jyk7XHJcblx0XHRpZihlLmEuY2xhc3MpICQoZS5kZWNrLmRvbUVsZW1lbnQpLmFkZENsYXNzKGUuYS5jbGFzcyk7XHJcblxyXG5cdFx0JChzaGFyZS5maWVsZC5kb21FbGVtZW50KS5hcHBlbmQoZS5kZWNrLmRvbUVsZW1lbnQpO1xyXG5cclxuXHJcblx0XHQvLyBhZGQgbGFiZWxcclxuXHRcdFx0XHJcblx0XHR2YXIgbGFiZWwgPSBlLmEubGFiZWwgJiYgdHlwZW9mIGUuYS5sYWJlbCA9PSAnc3RyaW5nJyA/IGUuYS5sYWJlbCA6IG51bGw7XHJcblx0XHRcclxuXHRcdGlmKCFlLmEubGFiZWwgJiYgc2hhcmUuZGVidWdMYWJlbHMpIHtcclxuXHRcdFx0bGFiZWwgPSAnPHNwYW4gc3R5bGU9XCJjb2xvcjojNjVCMEZGO1wiPicgKyBlLmRlY2submFtZSArICc8L3NwYW4+JztcclxuXHRcdH1cclxuXHJcblx0XHRpZihsYWJlbCkge1xyXG5cdFx0XHR2YXIgX2xhYmVsRWxlbWVudCA9ICQoJzxkaXY+JykuYWRkQ2xhc3MoJ2RlY2tMYWJlbCcpXHJcblx0XHRcdC8vIERFQlVHLCBUT0RPIHJlbW92ZSBuZXh0IHN0cmluZ1xyXG5cdFx0XHQuYXR0cih7XCJ0aXRsZVwiIDogZS5kZWNrLmdldElkKCkgKyBcIiAoXCIgKyBlLmRlY2sucGFyZW50KCkgKyBcIilcIn0pO1xyXG5cdFx0XHQkKF9sYWJlbEVsZW1lbnQpLmh0bWwobGFiZWwpO1xyXG5cdFx0XHQkKGUuZGVjay5kb21FbGVtZW50KS5hcHBlbmQoX2xhYmVsRWxlbWVudCk7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBsYWJlbCBzdHlsZSBwb3NpdGlvbiBmaXhcclxuXHRcdFx0Ly8gREVCVUdcclxuXHRcdFx0XHJcblx0XHRcdC8qJChfbGFiZWxFbGVtZW50KS5jc3Moe21hcmdpblRvcCA6ICctJyArICgkKF9sYWJlbEVsZW1lbnQpLmhlaWdodCgpICsgNSkgKyAncHgnfSk7XHJcblx0XHRcdGlmKHNoYXJlLnpvb20gIT0gc2hhcmUuZGVmYXVsdF96b29tKSB7XHJcblx0XHRcdFx0JChfbGFiZWxFbGVtZW50KS5jc3Moe3RyYW5zZm9ybSA6ICdzY2FsZSgnICsgc2hhcmUuem9vbSArICcpJ30pXHJcblx0XHRcdH0qL1xyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3Nob3dUaXAnLCBmdW5jdGlvbihlKSB7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnc2hvd1RpcCcsIGUpO1xyXG5cdFx0aWYoZSAmJiBlLmVsICYmIGUuZWwuZG9tRWxlbWVudCAmJiBlLnR5cGUpIHtcclxuXHRcdFx0JChlLmVsLmRvbUVsZW1lbnQpLmFkZENsYXNzKGUudHlwZSk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdoaWRlVGlwcycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdoaWRlVGlwcycsIGUpO1xyXG5cdFx0aWYoZSAmJiBlLnR5cGVzKSB7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBlLnR5cGVzKSB7XHJcblx0XHRcdFx0dmFyIHR5cGVOYW1lID0gZS50eXBlc1tpXTtcclxuXHRcdFx0XHQkKCcuJyArIHR5cGVOYW1lKS5yZW1vdmVDbGFzcyh0eXBlTmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvcih2YXIgaSBpbiBzaGFyZS50aXBUeXBlcykge1xyXG5cdFx0XHRcdHZhciB0eXBlTmFtZSA9IHNoYXJlLnRpcFR5cGVzW2ldO1xyXG5cdFx0XHRcdCQoJy4nICsgdHlwZU5hbWUpLnJlbW92ZUNsYXNzKHR5cGVOYW1lKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHRtYWluLmV2ZW50Lmxpc3RlbigncmVtb3ZlRWwnLCBmdW5jdGlvbihlKSB7XHJcblx0XHQkKGUuZG9tRWxlbWVudCkucmVtb3ZlKCk7XHJcblx0fSlcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3JlZHJhd0RlY2snLCBmdW5jdGlvbihlKSB7XHJcblxyXG5cdFx0aWYoZS5hKSB7XHJcblx0XHRcdGFwcGx5Q2hhbmdlZFBhcmFtZXRlcnMoZS5wYXJhbXMsIGUuYSwgZS5kZWNrKTtcclxuXHJcblx0XHRcdGlmKGUuYS5wYWRkaW5nWCkgICAgIHNoYXJlLnBhZGRpbmdfeCAgICAgID0gZS5hLnBhZGRpbmdYO1xyXG5cdFx0XHRpZihlLmEuZmxpcFBhZGRpbmdYKSBzaGFyZS5mbGlwX3BhZGRpbmdfeCA9IGUuYS5mbGlwUGFkZGluZ1g7XHJcblx0XHRcdGlmKGUuYS5wYWRkaW5nWSkgICAgIHNoYXJlLnBhZGRpbmdfeSAgICAgID0gZS5hLnBhZGRpbmdZO1xyXG5cdFx0XHRpZihlLmEuZmxpcFBhZGRpbmdZKSBzaGFyZS5mbGlwX3BhZGRpbmdfeSA9IGUuYS5mbGlwUGFkZGluZ1k7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0XHRcdGxlZnQgICAgICA6IHNoYXJlLnpvb20gKiBlLnBhcmFtcy54LFxyXG5cdFx0XHR0b3AgICAgICAgOiBzaGFyZS56b29tICogZS5wYXJhbXMueSxcclxuXHRcdFx0dHJhbnNmb3JtIDogJ3JvdGF0ZSgnICsgKGUucGFyYW1zLnJvdGF0ZXwwKSArICdkZWcpJ1xyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0X3BhcmFtcy5kaXNwbGF5ID0gZS5kZWNrLnZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cclxuXHRcdCQoZS5kZWNrLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKTtcclxuXHJcblx0XHRmb3IodmFyIGkgaW4gZS5jYXJkcykge1xyXG5cdFx0XHR2YXIgX2NhcmRfcG9zaXRpb24gPSBlLmRlY2sucGFkZGluZyhpKTtcclxuXHRcdFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0XHRcdFx0bGVmdCAgICAgIDogc2hhcmUuem9vbSAqIF9jYXJkX3Bvc2l0aW9uLnggKyAncHgnLCBcclxuXHRcdFx0XHR0b3AgICAgICAgOiBzaGFyZS56b29tICogX2NhcmRfcG9zaXRpb24ueSArICdweCcsXHJcblx0XHRcdFx0ekluZGV4ICAgIDogZS5wYXJhbXMuc3RhcnRaSW5kZXggKyAoaXwwKSxcclxuXHRcdFx0ICAgICctbXMtdHJhbnNmb3JtJyAgICAgOiAncm90YXRlKCcgKyAoZS5wYXJhbXMucm90YXRlfDApICsgJ2RlZyknLFxyXG5cdFx0XHQgICAgJy13ZWJraXQtdHJhbnNmb3JtJyA6ICdyb3RhdGUoJyArIChlLnBhcmFtcy5yb3RhdGV8MCkgKyAnZGVnKScsXHJcblx0XHRcdCAgICAnLXdlYmtpdC10cmFuc2Zvcm0nIDogJ3JvdGF0ZSgnICsgKGUucGFyYW1zLnJvdGF0ZXwwKSArICdkZWcpJyxcclxuXHRcdFx0ICAgICctbW96LXRyYW5zZm9ybScgICAgOiAncm90YXRlKCcgKyAoZS5wYXJhbXMucm90YXRlfDApICsgJ2RlZyknLFxyXG5cdFx0XHRcdC8vIHRyYW5zZm9ybSA6ICdyb3RhdGUoJyArIChlLnBhcmFtcy5yb3RhdGV8MCkgKyAnZGVnKSdcclxuXHRcdFx0fTtcclxuXHRcdFx0X3BhcmFtcy5kaXNwbGF5ID0gZS5kZWNrLnZpc2libGUgPyAnYmxvY2snIDogJ25vbmUnO1xyXG5cclxuXHRcdFx0Ly8gZS5kZWNrLmNoZWNrRmxpcChlLmNhcmRzW2ldLCBpfDAsIGUuY2FyZHMubGVuZ3RofDApO1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoZS5jYXJkc1tpXS5mbGlwKSB7XHJcblx0XHRcdFx0JChlLmNhcmRzW2ldLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdmbGlwJyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0JChlLmNhcmRzW2ldLmRvbUVsZW1lbnQpLnJlbW92ZUNsYXNzKCdmbGlwJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0JChlLmNhcmRzW2ldLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKTtcclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblx0XHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ2FkZENhcmRFbCcsIGZ1bmN0aW9uKGUpIHtcclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnYWRkQ2FyZEVsJywgZSk7XHJcblxyXG5cdFx0ZS5kb21FbGVtZW50ID0gJCgnPGRpdj4nKS5hZGRDbGFzcygnZWwgY2FyZCBkcmFnZ2FibGUnKS5hZGRDbGFzcyhlLm5hbWUpO1xyXG5cdFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0XHRcdHdpZHRoICA6IHNoYXJlLnpvb20gKiBzaGFyZS5jYXJkLndpZHRoICsgJ3B4JyxcclxuXHRcdFx0aGVpZ2h0IDogc2hhcmUuem9vbSAqIHNoYXJlLmNhcmQuaGVpZ2h0ICsgJ3B4J1xyXG5cdFx0fVxyXG5cdFx0JChlLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKS5hdHRyKHtpZDogZS5pZH0pO1xyXG5cdFx0JChzaGFyZS5maWVsZC5kb21FbGVtZW50KS5hcHBlbmQoZS5kb21FbGVtZW50KTtcclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ21vdmVEcmFnRGVjaycsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdtb3ZlRHJhZ0RlY2snLCBlKTtcclxuXHRcdHNoYXJlLmN1ckxvY2soKTtcclxuXHRcdGZvcih2YXIgaSBpbiBlLm1vdmVEZWNrKSB7XHJcblx0XHRcdHZhciBfcG9zaXRpb24gPSBlLmRlc3RpbmF0aW9uLnBhZGRpbmcoZS5kZXN0aW5hdGlvbi5nZXRDYXJkcygpLmxlbmd0aCAtIDEgKyAoaXwwKSk7XHJcblx0XHRcdCAgICAgICAgICAgICAvLyBlLmRlc3RpbmF0aW9uLnBhZGRpbmcoZS5tb3ZlRGVja1tpXS5pbmRleCk7XHJcblx0XHRcdHZhciBfcGFyYW1zID0ge1xyXG5cdFx0XHRcdGxlZnQgICAgICA6IHNoYXJlLnpvb20gKiBfcG9zaXRpb24ueCArICdweCcsIFxyXG5cdFx0XHRcdHRvcCAgICAgICA6IHNoYXJlLnpvb20gKiBfcG9zaXRpb24ueSArICdweCcsXHJcblx0XHRcdFx0Ly8gdHJhbnNmb3JtIDogJ3JvdGF0ZSgwZGVnKSdcclxuXHRcdFx0fTtcclxuXHRcdFx0dmFyIGEgPSBlLmRlcGFydHVyZS5yb3RhdGUsIGIgPSBlLmRlc3RpbmF0aW9uLnJvdGF0ZTtcclxuXHRcdFx0aWYoTWF0aC5hYnMoYSAtIGIpID4gMTgwKSBpZihhID4gYikge2EgPSBhIC0gMzYwfSBlbHNlIHtiID0gYiAtIDM2MH07XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdyb3RhdGUnLCBhLCBiKVxyXG5cdFx0XHQkKHtkZWc6IGEsIGUgOiBlfSkuYW5pbWF0ZSh7ZGVnOiBifSwge1xyXG5cdFx0XHQgIGR1cmF0aW9uOiBzaGFyZS5hbmltYXRpb25UaW1lLFxyXG5cdFx0XHQgIHN0ZXA6IGZ1bmN0aW9uIChub3cpIHtcclxuXHRcdFx0ICAgICQodGhpcykuY3NzKHtcclxuXHRcdFx0ICAgICAgJy1tcy10cmFuc2Zvcm0nICAgICA6ICdyb3RhdGUoJyArIG5vdyArICdkZWcpJyxcclxuXHRcdFx0ICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJyA6ICdyb3RhdGUoJyArIG5vdyArICdkZWcpJyxcclxuXHRcdFx0ICAgICAgJy13ZWJraXQtdHJhbnNmb3JtJyA6ICdyb3RhdGUoJyArIG5vdyArICdkZWcpJyxcclxuXHRcdFx0ICAgICAgJy1tb3otdHJhbnNmb3JtJyAgICA6ICdyb3RhdGUoJyArIG5vdyArICdkZWcpJyxcclxuXHRcdFx0ICAgICAgLy8gdHJhbnNmb3JtOiAncm90YXRlKCcgKyBub3cgKyAnZGVnKScsXHJcblx0XHRcdCAgICB9KTtcclxuXHRcdFx0ICB9LmJpbmQoZS5tb3ZlRGVja1tpXS5jYXJkLmRvbUVsZW1lbnQpXHJcblx0XHRcdH0pO1xyXG5cdFx0XHQkKGUubW92ZURlY2tbaV0uY2FyZC5kb21FbGVtZW50KS5hbmltYXRlKF9wYXJhbXMsIHNoYXJlLmFuaW1hdGlvblRpbWUsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGUuZGVwYXJ0dXJlLlJlZHJhdygpO1xyXG5cdFx0XHRcdGUuZGVzdGluYXRpb24uUmVkcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0JCgnLmRyYWdnYWJsZScpLnByb21pc2UoKS5kb25lKGZ1bmN0aW9uKCl7XHJcblx0XHQgICAgc2hhcmUuY3VyVW5Mb2NrKCk7XHJcblx0XHQgICAgbWFpbi5ldmVudC5kaXNwYXRjaCgnbW92ZURyYWdEZWNrRG9uZScsIHtkZWNrIDogZS5kZXN0aW5hdGlvbn0pO1xyXG5cdFx0fSk7XHJcblx0fSk7XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdtb3ZlQ2FyZFRvSG9tZScsIGZ1bmN0aW9uKGUpIHtcclxuXHRcdC8vICBNb3ZlIGNhcmQgaG9tZVxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ01vdmUgY2FyZCBob21lJywgZSk7XHJcblx0XHRzaGFyZS5jdXJMb2NrKCk7XHJcblx0ICAgIGZvcih2YXIgaSBpbiBlLm1vdmVEZWNrKSB7XHJcblx0ICAgIFx0dmFyIF9wb3NpdGlvbiA9IGUuZGVwYXJ0dXJlLnBhZGRpbmcoZS5tb3ZlRGVja1tpXS5pbmRleCk7XHJcblx0ICAgIFx0dmFyIF9wYXJhbXMgPSB7XHJcblx0ICAgIFx0XHRsZWZ0IDogX3Bvc2l0aW9uLnggKyAncHgnLFxyXG5cdCAgICBcdFx0dG9wICA6IF9wb3NpdGlvbi55ICsgJ3B4J1xyXG5cdCAgICBcdH1cclxuXHQgICAgXHQkKGUubW92ZURlY2tbaV0uY2FyZC5kb21FbGVtZW50KS5hbmltYXRlKF9wYXJhbXMsIHNoYXJlLmFuaW1hdGlvblRpbWUpO1xyXG5cdCAgICB9XHJcbiAgICBcdCQoJy5kcmFnZ2FibGUnKS5wcm9taXNlKCkuZG9uZShmdW5jdGlvbigpe1xyXG5cdFx0ICAgIHNoYXJlLmN1clVuTG9jaygpO1xyXG5cdFx0fSk7XHJcblx0ICAgIFxyXG5cdFx0JCgnLmRyYWdnYWJsZScpLnByb21pc2UoKS5kb25lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coX2RlY2tfZGVwYXJ0dXJlLCBfZGVja19kZXN0aW5hdGlvbik7XHJcblx0XHRcdGlmKGUuZGVwYXJ0dXJlKSB7XHJcblx0XHRcdFx0ZS5kZXBhcnR1cmUuUmVkcmF3KCk7XHJcblx0XHRcdH1cclxuXHRcdFx0LyppZihfZGVja19kZXN0aW5hdGlvbikge1xyXG5cdFx0XHRcdF9kZWNrX2Rlc3RpbmF0aW9uLlJlZHJhdygpO1xyXG5cdFx0XHR9Ki9cclxuXHRcdH0pO1xyXG5cdH0pXHJcblx0XHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ21vdmVEcmFnRGVja0RvbmUnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRcclxuXHRcdGlmKCFlLmRlY2suZmlsbCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR2YXIgX2RlY2sgPSBlLmRlY2suZ2V0Q2FyZHMoKTtcclxuXHRcdGZvcih2YXIgaSBpbiBfZGVjaykge1xyXG5cdFx0XHQkKF9kZWNrW2ldLmRvbUVsZW1lbnQpLmFkZENsYXNzKCdmaWxsJyk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIGV4dGVuc2lvbnMvRG9tTWFuYWdlci5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBmb3JjZU1vdmUgZnJvbSAnLi9mb3JjZU1vdmUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHJcblx0Zm9yY2VNb3ZlKG1haW4sIHNoYXJlKTtcclxuXHJcblx0c2hhcmUudW5kb01ldGhvZHMgPSB7fTtcclxuXHRzaGFyZS5yZWRvTWV0aG9kcyA9IHt9O1xyXG5cdFxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCd1bmRvJywgZnVuY3Rpb24oYSkge1xyXG5cdFx0XHJcblx0XHQvLyBjb25zb2xlLmxvZygnZm9yY2VNb3ZlIHVuZG86Jywgc2hhcmUudW5kb01ldGhvZHMpO1xyXG5cclxuXHRcdGlmKCFhKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaSBpbiBzaGFyZS51bmRvTWV0aG9kcykge1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhpKTtcclxuXHRcdFx0c2hhcmUudW5kb01ldGhvZHNbaV0oYSk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGlmKGEuZmxpcCkge1xyXG5cdFx0Ly8gfTtcclxuXHRcdFxyXG5cdFx0aWYoYS51bmZsaXApIHtcclxuXHRcdFx0aWYoXHJcblx0XHRcdFx0dHlwZW9mIGEudW5mbGlwLmRlY2sgICAgICAgPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHQgJiYgdHlwZW9mIGEudW5mbGlwLmNhcmQgICAgICAgIT0gXCJ1bmRlZmluZWRcIlxyXG5cdFx0XHQgJiYgdHlwZW9mIGEudW5mbGlwLmNhcmQubmFtZSAgPT0gXCJzdHJpbmdcIlxyXG5cdFx0XHQgJiYgdHlwZW9mIGEudW5mbGlwLmNhcmQuaW5kZXggIT0gXCJ1bmRlZmluZWRcIlxyXG5cdFx0XHQpIHtcclxuXHRcdFx0XHR2YXIgX2RlY2sgPSBtYWluLkRlY2soYS51bmZsaXAuZGVjayksXHJcblx0XHRcdFx0XHRfY2FyZHMgPSBfZGVjayA/IF9kZWNrLmdldENhcmRzKCkgOiBbXTtcclxuXHRcdFx0XHRpZihfY2FyZHNbYS51bmZsaXAuY2FyZC5pbmRleF0ubmFtZSA9PSBhLnVuZmxpcC5jYXJkLm5hbWUpIHtcclxuXHRcdFx0XHRcdF9jYXJkc1thLnVuZmxpcC5jYXJkLmluZGV4XS5mbGlwID0gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRcclxuXHRcdGlmKGEuZmlsbCkge1xyXG5cdFx0XHQvLyBUT0RPXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIGlmKCFhIHx8ICFhLm1vdmUpIHJldHVybjtcclxuXHRcdGlmKFxyXG5cdFx0XHR0eXBlb2YgYS5tb3ZlICAgICAgIT0gXCJ1bmRlZmluZWRcIiBcclxuXHRcdCAmJiB0eXBlb2YgYS5tb3ZlLmZyb20gIT0gXCJ1bmRlZmluZWRcIiBcclxuXHRcdCAmJiB0eXBlb2YgYS5tb3ZlLnRvICAgIT0gXCJ1bmRlZmluZWRcIiBcclxuXHRcdCAmJiB0eXBlb2YgYS5tb3ZlLmRlY2sgIT0gXCJ1bmRlZmluZWRcIlxyXG5cdFx0KSB7XHJcblx0XHRcdHNoYXJlLmZvcmNlTW92ZSh7XHJcblx0XHRcdFx0ZnJvbSA6IGEubW92ZS50byxcclxuICAgICAgICAgICAgICAgIHRvICAgOiBhLm1vdmUuZnJvbSxcclxuICAgICAgICAgICAgICAgIGRlY2sgOiBhLm1vdmUuZGVja1xyXG5cdFx0XHR9KVxyXG5cdFx0fVxyXG5cclxuXHJcblx0fSk7XHJcblxyXG5cdG1haW4uZXZlbnQubGlzdGVuKCdyZWRvJywgZnVuY3Rpb24oYSkge1xyXG5cdFx0XHJcblx0XHQvLyBjb25zb2xlLmxvZygnZm9yY2VNb3ZlIHJlZG86Jywgc2hhcmUucmVkb01ldGhvZHMpO1xyXG5cclxuXHRcdGlmKCFhKSByZXR1cm47XHJcblx0XHRcclxuXHRcdGZvcih2YXIgaSBpbiBzaGFyZS5yZWRvTWV0aG9kcykge1xyXG5cdFx0XHRzaGFyZS5yZWRvTWV0aG9kc1tpXShhKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBpZihhLmZsaXApIHtcclxuXHRcdC8vIH07XHJcblx0XHRcclxuXHRcdGlmKGEudW5mbGlwKSB7XHJcblx0XHRcdGlmKFxyXG5cdFx0XHRcdHR5cGVvZiBhLnVuZmxpcC5kZWNrICAgICAgID09IFwic3RyaW5nXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkICAgICAgICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkLm5hbWUgID09IFwic3RyaW5nXCJcclxuXHRcdFx0ICYmIHR5cGVvZiBhLnVuZmxpcC5jYXJkLmluZGV4ICE9IFwidW5kZWZpbmVkXCJcclxuXHRcdFx0KSB7XHJcblx0XHRcdFx0dmFyIF9kZWNrID0gbWFpbi5EZWNrKGEudW5mbGlwLmRlY2spLFxyXG5cdFx0XHRcdFx0X2NhcmRzID0gX2RlY2sgPyBfZGVjay5nZXRDYXJkcygpIDogW107XHJcblx0XHRcdFx0aWYoX2NhcmRzW2EudW5mbGlwLmNhcmQuaW5kZXhdLm5hbWUgPT0gYS51bmZsaXAuY2FyZC5uYW1lKSB7XHJcblx0XHRcdFx0XHRfY2FyZHNbYS51bmZsaXAuY2FyZC5pbmRleF0uZmxpcCA9IGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdFxyXG5cdFx0aWYoYS5maWxsKSB7XHJcblx0XHRcdC8vIFRPRE9cclxuXHRcdH07XHJcblxyXG5cdFx0aWYoIWEgfHwgIWEubW92ZSkgcmV0dXJuO1xyXG5cdFx0aWYoXHJcblx0XHRcdHR5cGVvZiBhLm1vdmUuZnJvbSAhPSBcInVuZGVmaW5lZFwiIFxyXG5cdFx0ICYmIHR5cGVvZiBhLm1vdmUudG8gICAhPSBcInVuZGVmaW5lZFwiIFxyXG5cdFx0ICYmIHR5cGVvZiBhLm1vdmUuZGVjayAhPSBcInVuZGVmaW5lZFwiXHJcblx0XHQpIHtcclxuXHRcdFx0c2hhcmUuZm9yY2VNb3ZlKHtcclxuXHRcdFx0XHRmcm9tIDogYS5tb3ZlLmZyb20sXHJcbiAgICAgICAgICAgICAgICB0byAgIDogYS5tb3ZlLnRvLFxyXG4gICAgICAgICAgICAgICAgZGVjayA6IGEubW92ZS5kZWNrXHJcblx0XHRcdH0pXHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL1NvbGl0YWlyZUhpc3RvcnkuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgdGlwc1J1bGVzIGZyb20gJy4vdGlwc1J1bGVzJztcclxuaW1wb3J0IGJlc3RUaXAgICBmcm9tICcuL2Jlc3RUaXAnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHJcblx0YmVzdFRpcChtYWluLCBzaGFyZSk7XHJcblxyXG5cdHNoYXJlLnRpcFR5cGVzID0gWyd0aXAnLCAndGlwVG8nLCAndGlwUHJpb3JpdHknXTtcclxuXHRcclxuXHRtYWluLnNob3dUaXBzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdtYWluLnNob3dUaXBzJyk7XHJcblx0XHRzaGFyZS5zaG93VGlwcyA9IHRydWU7XHJcblx0XHRzaGFyZS5jaGVja1RpcHMoKTtcclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdG1haW4uaGlkZVRpcHMgPSBmdW5jdGlvbigpIHtcclxuXHRcdFxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ21haW4uaGlkZVRpcHMnKTtcclxuXHRcdHNoYXJlLnNob3dUaXBzID0gZmFsc2U7XHJcblx0XHRzaGFyZS5jaGVja1RpcHMoKTtcclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG5cdHNoYXJlLmNoZWNrVGlwcyA9IGZ1bmN0aW9uKGEpIHtcclxuXHRcdFxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3NoYXJlLmNoZWNrVGlwcycpO1xyXG5cclxuXHRcdHNoYXJlLlRpcHMgPSBbXTtcclxuXHJcblx0XHQvLyAkKCcudGlwJykgICAgICAgIC5yZW1vdmVDbGFzcygndGlwJyk7XHJcblx0XHQvLyAkKCcudGlwVG8nKSAgICAgIC5yZW1vdmVDbGFzcygndGlwVG8nKTtcclxuXHRcdC8vICQoJy50aXBQcmlvcml0eScpLnJlbW92ZUNsYXNzKCd0aXBQcmlvcml0eScpO1xyXG5cdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnaGlkZVRpcHMnKTtcclxuXHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3NoYXJlLmNoZWNrVGlwcycpXHJcblxyXG5cdFx0dmFyIF9kZWNrcyA9IHRoaXMuZ2V0RGVja3Moe3Zpc2libGUgOiB0cnVlfSk7XHJcblx0XHRcclxuXHRcdC8vIGZvcihpIGluIF9hbGxfZGVja3MpIHtcclxuXHRcdC8vIFx0aWYoX2FsbF9kZWNrc1tpXS52aXNpYmxlKSB7XHJcblx0XHQvLyBcdFx0X2RlY2tzLnB1c2goX2FsbF9kZWNrc1tpXSlcclxuXHRcdC8vIFx0fVxyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdC8vIHZhciB0aXBzID0gc2hhcmUuYXV0b1RpcHMoKVxyXG5cdFx0aWYodHlwZW9mIHNoYXJlLmF1dG9UaXBzID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0c2hhcmUuVGlwcyA9IHNoYXJlLmF1dG9UaXBzKHtcclxuXHRcdFx0XHRkZWNrcyA6IF9kZWNrc1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvcihpIGluIHNoYXJlLmF1dG9UaXBzKSB7XHJcblx0XHRcdFx0aWYodHlwZW9mIHNoYXJlLmF1dG9UaXBzW2ldID09ICdmdW5jdGlvbicpIHtcclxuXHRcdFx0XHRcdHNoYXJlLlRpcHMgPSBzaGFyZS5UaXBzLmNvbmNhdChcclxuXHRcdFx0XHRcdFx0c2hhcmUuYXV0b1RpcHNbaV0oe1xyXG5cdFx0XHRcdFx0XHRcdGRlY2tzIDogX2RlY2tzXHJcblx0XHRcdFx0XHRcdH0pXHJcblx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRpZih0aXBzUnVsZXNbaV0pIHtcclxuXHRcdFx0XHRcdFx0c2hhcmUuVGlwcyA9IHNoYXJlLlRpcHMuY29uY2F0KFxyXG5cdFx0XHRcdFx0XHRcdHRpcHNSdWxlc1tpXSh7XHJcblx0XHRcdFx0XHRcdFx0XHRkZWNrcyA6IF9kZWNrcyxcclxuXHRcdFx0XHRcdFx0XHRcdHJ1bGVzIDogc2hhcmUuYXV0b1RpcHNbaV1cclxuXHRcdFx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYoc2hhcmUuc2hvd1RpcHMpIHtcclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKCdzaGFyZS5zaG93VGlwcycsIHNoYXJlLlRpcHMsIHNoYXJlLmhvbWVHcm91cHMpO1xyXG5cclxuXHRcdFx0Zm9yKHZhciBpIGluIHNoYXJlLlRpcHMpIHtcclxuXHJcblx0XHRcdFx0Ly8gVE9ETyDQuNC90LjRhtC40LDQu9C40LfQuNGA0L7QstCw0YLRjCBcImhpZGVUaXBzSW5Eb21cIiDQsiBGaWVsZC5qcyBcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnUEFSRU5UIElTOicsIHNoYXJlLlRpcHNbaV0uZnJvbS5kZWNrLnBhcmVudCgpKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHQvLyBpZihzaGFyZS5oaWRlVGlwc0luRG9tICYmICBzaGFyZS5ob21lR3JvdXBzICYmIHNoYXJlLmhvbWVHcm91cHMuaW5kZXhPZihzaGFyZS5UaXBzW2ldLmZyb20uZGVjay5wYXJlbnQoKSkgPj0gMCkge1xyXG5cdFx0XHRcdGlmKHNoYXJlLmhvbWVHcm91cHMgJiYgc2hhcmUuaG9tZUdyb3Vwcy5pbmRleE9mKHNoYXJlLlRpcHNbaV0uZnJvbS5kZWNrLnBhcmVudCgpKSA+PSAwKSB7XHJcblx0XHRcdFx0XHQvLyA/IyQlJiFcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gJChzaGFyZS5UaXBzW2ldLmZyb20uY2FyZC5kb21FbGVtZW50KS5hZGRDbGFzcygndGlwJyk7XHJcblx0XHRcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdzaG93VGlwJywge2VsIDogc2hhcmUuVGlwc1tpXS5mcm9tLmNhcmQsIHR5cGUgOiAndGlwJ30pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRtYWluLnRpcHNNb3ZlID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdGlmKCFzaGFyZS5zaG93VGlwUHJpb3JpdHkpIHJldHVybjtcclxuXHJcblx0XHQvLyAkKCcudGlwUHJpb3JpdHknKS5yZW1vdmVDbGFzcygndGlwUHJpb3JpdHknKTtcclxuXHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ2hpZGVUaXBzJywge3R5cGVzIDogWyd0aXBQcmlvcml0eSddfSk7XHJcblxyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3RpcHNNb3ZlJywgYSwgc2hhcmUuc2hvd1RpcFByaW9yaXR5KTtcclxuXHRcdFxyXG5cdFx0aWYoIHNoYXJlLnNob3dUaXBQcmlvcml0eSBcclxuXHRcdCAmJiBhIFxyXG5cdFx0ICYmIGEubW92ZURlY2sgXHJcblx0XHQgJiYgYS5jdXJzb3JNb3ZlIFxyXG5cdFx0ICYmIGEuY3Vyc29yTW92ZS5kaXN0YW5jZSBcclxuXHRcdCAmJiBhLmN1cnNvck1vdmUuZGlzdGFuY2UgPj0gc2hhcmUubW92ZURpc3RhbmNlXHJcblx0XHQpIHtcclxuXHJcblx0XHRcdHZhciBUaXAgPSBzaGFyZS5iZXN0VGlwKGEubW92ZURlY2ssIGEuY3Vyc29yTW92ZSk7XHJcblxyXG5cdFx0XHRpZihUaXApIHtcclxuXHJcblx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnc2hvd1RpcCcsIHtlbCA6IFRpcC50by5kZWNrLCB0eXBlIDogJ3RpcFByaW9yaXR5J30pO1xyXG5cdFx0XHRcdC8vIFRPRE86ICdpJyAtIHVuZGVmaW5lZFxyXG5cdFx0XHRcdC8vIG1haW4uZXZlbnQuZGlzcGF0Y2goJ3Nob3dUaXAnLCB7ZWwgOiBzaGFyZS5UaXBzW2ldLnRvLmRlY2ssIHR5cGUgOiAndGlwUHJpb3JpdHknfSk7XHJcblxyXG5cdFx0XHRcdC8vICQoVGlwLnRvLmxhc3RDYXJkLmRvbUVsZW1lbnQpLmFkZENsYXNzKCd0aXBQcmlvcml0eScpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fS5iaW5kKG1haW4pXHJcblxyXG5cdG1haW4udGlwc0Rlc3RpbmF0aW9uID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCd0aXBzRGVzdGluYXRpb24nLCBhKVxyXG5cdFx0XHJcblx0XHQvLyBpZihzaGFyZS5zaG93VGlwcyAmJiBzaGFyZS5zaG93VGlwc0Rlc3RpbmF0aW9uKSB7XHJcblx0XHRpZihzaGFyZS5zaG93VGlwc0Rlc3RpbmF0aW9uKSB7XHJcblxyXG5cdFx0XHQvLyAkKCcudGlwJykgICAgICAgIC5yZW1vdmVDbGFzcygndGlwJyk7XHJcblx0XHRcdC8vICQoJy50aXBUbycpICAgICAgLnJlbW92ZUNsYXNzKCd0aXBUbycpO1xyXG5cdFx0XHQvLyAkKCcudGlwUHJpb3JpdHknKS5yZW1vdmVDbGFzcygndGlwUHJpb3JpdHknKTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIG1haW4uZXZlbnQuZGlzcGF0Y2goJ2hpZGVUaXBzJywge3R5cGVzIDogWyd0aXAnXX0pO1xyXG5cdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdoaWRlVGlwcycpO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gdHJ5IHtcclxuXHRcdFx0Ly8gXHRpZihhICYmIGEuY3VycmVudENhcmQgJiYgJChhLmN1cnJlbnRDYXJkKSkge1xyXG5cdFx0XHQvLyBcdFx0JChhLmN1cnJlbnRDYXJkKS5hZGRDbGFzcygndGlwJyk7XHJcblx0XHRcdC8vIFx0fVxyXG5cdFx0XHQvLyB9IGNhdGNoKGUpIHt9XHJcblx0XHRcdFxyXG5cdFx0XHRpZihhICYmIGEuY3VycmVudENhcmQgJiYgYS5jdXJyZW50Q2FyZC5pZCkge1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBzaGFyZS5UaXBzKSB7XHJcblx0XHRcdFx0XHRpZihzaGFyZS5UaXBzW2ldLmZyb20uY2FyZC5pZCA9PSBhLmN1cnJlbnRDYXJkLmlkKSB7XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0Ly8gdmFyIF9jYXJkcyA9IHNoYXJlLlRpcHNbaV0udG8uZGVjay5nZXRDYXJkcygpLFxyXG5cdFx0XHRcdFx0XHQvLyBfY2FyZCAgPSBfY2FyZHNbX2NhcmRzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdFx0bWFpbi5ldmVudC5kaXNwYXRjaCgnc2hvd1RpcCcsIHtlbCA6IHNoYXJlLlRpcHNbaV0udG8uZGVjaywgdHlwZSA6ICd0aXBUbyd9KTtcclxuXHRcdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRcdC8vIGlmKHNoYXJlLlRpcHNbaV0udG8ubGFzdENhcmQpIHtcclxuXHRcdFx0XHRcdFx0Ly8gXHQkKHNoYXJlLlRpcHNbaV0udG8ubGFzdENhcmQuZG9tRWxlbWVudCkuYWRkQ2xhc3MoJ3RpcFRvJyk7XHJcblx0XHRcdFx0XHRcdC8vIH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0Ly8gXHRcdCQoc2hhcmUuVGlwc1tpXS50by5kZWNrLmdldERvbUVsZW1lbnQoKSkuYWRkQ2xhc3MoJ3RpcFRvJyk7XHJcblx0XHRcdFx0XHRcdC8vIFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdFx0XHRcdC8vIFx0XHRjb25zb2xlLndhcm4oJyMxJywgZSwgc2hhcmUuVGlwc1tpXSk7XHJcblx0XHRcdFx0XHRcdC8vIFx0fVxyXG5cdFx0XHRcdFx0XHQvLyB9XHJcblxyXG5cdFx0XHRcdFx0XHQvLyAkKHNoYXJlLlRpcHNbaV0udG8ubGFzdENhcmQuZG9tRWxlbWVudCkuYWRkQ2xhc3MoJ3RpcFRvJyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9UaXBzLmpzXG4gKiovIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24obWFpbiwgc2hhcmUpIHtcclxuXHRcclxuXHRzaGFyZS5iZXN0VGlwID0gZnVuY3Rpb24obW92ZURlY2ssIGN1cnNvck1vdmUpIHtcclxuXHJcblx0XHR2YXIgX2F1dG9UaXBzID0gW107XHJcblx0XHRmb3IoaSBpbiBzaGFyZS5UaXBzKSB7XHJcblx0XHRcdGlmKHNoYXJlLlRpcHNbaV0uZnJvbS5jYXJkLmlkID09IG1vdmVEZWNrWzBdLmNhcmQuaWQpIHtcclxuXHRcdFx0XHRfYXV0b1RpcHMucHVzaChzaGFyZS5UaXBzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZihfYXV0b1RpcHMubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIG1vdmUgY2FyZCB0byBjbG9zZXN0IGRlY2sgb2YgYSBwb3NzaWJsZSBtb3ZlXHJcblxyXG5cdFx0dmFyIF9taW5fZGlzdGFuY2UgICAgICAgPSAtMSxcclxuXHRcdFx0X3RpcF9pbmRleCAgICAgICAgICA9IDAsXHJcblx0XHRcdF9pbl9kaXJlY3Rpb25fY291bnQgPSAwO1xyXG5cclxuXHRcdGlmKHNoYXJlLmhvbWVHcm91cHMpIHtcclxuXHRcdFx0dmFyIF90aXBzID0gW107XHJcblx0XHRcdGZvcih2YXIgaSBpbiBzaGFyZS5ob21lR3JvdXBzKSB7XHJcblx0XHRcdFx0Zm9yKHZhciB0IGluIF9hdXRvVGlwcykge1xyXG5cdFx0XHRcdFx0aWYoX2F1dG9UaXBzW3RdLnRvLmRlY2sucGFyZW50KCkgPT0gc2hhcmUuaG9tZUdyb3Vwc1tpXSkge1xyXG5cdFx0XHRcdFx0XHRfdGlwcy5wdXNoKF9hdXRvVGlwc1t0XSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGlmKF90aXBzLmxlbmd0aCkgX2F1dG9UaXBzID0gX3RpcHM7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoX2F1dG9UaXBzLmxlbmd0aCA+PSAyKSB7XHJcblxyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2F1dG9UaXBzKSB7XHJcblxyXG5cdFx0XHRcdHZhciBjZW50ZXJfZnJvbSA9IHtcclxuXHRcdFx0XHRcdHggOiBjdXJzb3JNb3ZlLmRlY2tQb3NpdGlvbi54ICsgKHNoYXJlLmNhcmQud2lkdGggICogc2hhcmUuem9vbSksXHJcblx0XHRcdFx0XHR5IDogY3Vyc29yTW92ZS5kZWNrUG9zaXRpb24ueSArIChzaGFyZS5jYXJkLmhlaWdodCAqIHNoYXJlLnpvb20pXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBfZGVzdGluYXRpb25fZGVja19sYXN0X2NhcmRfcG9zaXRpb24gPSBfYXV0b1RpcHNbaV0udG8uZGVjay5wYWRkaW5nKF9hdXRvVGlwc1tpXS50by5kZWNrLmdldENhcmRzKCkubGVuZ3RoKTtcclxuXHRcdFx0XHR2YXIgY2VudGVyX3RvID0ge1xyXG5cdFx0XHRcdFx0eCA6IF9kZXN0aW5hdGlvbl9kZWNrX2xhc3RfY2FyZF9wb3NpdGlvbi54ICsgKHNoYXJlLmNhcmQud2lkdGggICogc2hhcmUuem9vbSksXHJcblx0XHRcdFx0XHR5IDogX2Rlc3RpbmF0aW9uX2RlY2tfbGFzdF9jYXJkX3Bvc2l0aW9uLnkgKyAoc2hhcmUuY2FyZC5oZWlnaHQgKiBzaGFyZS56b29tKVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRfYXV0b1RpcHNbaV0uZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5zcXIoY2VudGVyX2Zyb20ueCAtIGNlbnRlcl90by54KSArIE1hdGguc3FyKGNlbnRlcl9mcm9tLnkgLSBjZW50ZXJfdG8ueSkpO1xyXG5cdFx0XHRcdF9hdXRvVGlwc1tpXS5pbkRpcmVjdGlvbiA9IGZhbHNlO1xyXG5cdFx0XHRcdGlmKFxyXG5cdFx0XHRcdFx0KGN1cnNvck1vdmUuZGlyZWN0aW9uLnggPiAwICYmIGNlbnRlcl90by54ID4gY2VudGVyX2Zyb20ueClcclxuXHRcdFx0XHQgfHwgKGN1cnNvck1vdmUuZGlyZWN0aW9uLnggPCAwICYmIGNlbnRlcl90by54IDwgY2VudGVyX2Zyb20ueClcclxuXHRcdFx0XHQpIHtcclxuICAgIFx0XHRcdFx0X2F1dG9UaXBzW2ldLmluRGlyZWN0aW9uID0gdHJ1ZTtcclxuXHQgICAgXHRcdFx0X2luX2RpcmVjdGlvbl9jb3VudCArPSAxO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQgLy8gfHwgKGN1cnNvck1vdmUuZGlyZWN0aW9uLnkgPiAwICYmIGNlbnRlcl90by55ID4gY2VudGVyX2Zyb20ueSlcclxuXHRcdFx0XHQgLy8gfHwgKGN1cnNvck1vdmUuZGlyZWN0aW9uLnkgPCAwICYmIGNlbnRlcl90by55IDwgY2VudGVyX2Zyb20ueSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKF9pbl9kaXJlY3Rpb25fY291bnQsIF9hdXRvVGlwcyk7XHJcblx0XHRcdFxyXG5cdFx0XHRmb3IodmFyIGkgaW4gX2F1dG9UaXBzKSB7XHJcblxyXG5cdFx0XHRcdGlmKF9taW5fZGlzdGFuY2UgPT0gJy0xJykge1xyXG5cdFx0XHRcdFx0aWYoX2luX2RpcmVjdGlvbl9jb3VudCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdF9taW5fZGlzdGFuY2UgPSBfYXV0b1RpcHNbaV0uZGlzdGFuY2U7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpZihfYXV0b1RpcHNbaV0uaW5EaXJlY3Rpb24gPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRcdF9taW5fZGlzdGFuY2UgPSBfYXV0b1RpcHNbaV0uZGlzdGFuY2U7XHJcblx0XHRcdFx0XHRcdFx0X3RpcF9pbmRleCA9IGk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYoX2F1dG9UaXBzW2ldLmRpc3RhbmNlIDwgX21pbl9kaXN0YW5jZSkge1xyXG5cdFx0XHRcdFx0aWYoX2luX2RpcmVjdGlvbl9jb3VudCA9PSAwKSB7XHJcblx0XHRcdFx0XHRcdF9taW5fZGlzdGFuY2UgPSBfYXV0b1RpcHNbaV0uZGlzdGFuY2U7XHJcblx0XHRcdFx0XHRcdF90aXBfaW5kZXggPSBpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aWYoX2F1dG9UaXBzW2ldLmluRGlyZWN0aW9uID09IHRydWUpIHtcclxuXHRcdFx0XHRcdFx0XHRfbWluX2Rpc3RhbmNlID0gX2F1dG9UaXBzW2ldLmRpc3RhbmNlO1xyXG5cdFx0XHRcdFx0XHRcdF90aXBfaW5kZXggPSBpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdUaXAgZm9yIGN1cnJlbnQgY2FyZDonLCBfYXV0b1RpcHNbX3RpcF9pbmRleF0sICdmcm9tOicsIF9hdXRvVGlwcy5sZW5ndGgsIF9hdXRvVGlwc1tfdGlwX2luZGV4XS50by5kZWNrLmdldERvbUVsZW1lbnQoKVswXS5pZCk7XHJcblxyXG5cdFx0cmV0dXJuIF9hdXRvVGlwc1tfdGlwX2luZGV4XVxyXG5cclxuXHR9XHJcblxyXG59O1xuXG5cbi8qKiBXRUJQQUNLIEZPT1RFUiAqKlxuICoqIGV4dGVuc2lvbnMvYmVzdFRpcC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0XHJcblx0bWFpbi5Nb3ZlID0gZnVuY3Rpb24obW92ZURlY2ssIHRvLCBjdXJzb3JNb3ZlKSB7XHJcblx0XHRcclxuXHRcdHZhciBfZGVja19kZXN0aW5hdGlvbiA9IG51bGwsLy8gdG9cclxuXHQgICAgXHRfZGVja19kZXBhcnR1cmUgICA9IG51bGw7Ly8gZnJvbVxyXG5cdCAgICB2YXIgX3N1Y2Nlc3MgPSB0cnVlO1xyXG5cclxuXHQgICAgX3N1Y2Nlc3MgPSBfc3VjY2VzcyAmJiB0bztcclxuXHJcblx0ICAgIHZhciBfZWwgPSB0byAmJiB0by5pZCAmJiB0aGlzLmdldEVsZW1lbnRCeUlkKHRvLmlkKTtcclxuXHJcbiAgICBcdGlmKF9lbCkge1xyXG4gICAgXHJcbiAgICBcdFx0aWYoX2VsLnR5cGUgPT0gJ2NhcmQnKSB7XHJcblx0ICAgIFx0XHRfZGVja19kZXN0aW5hdGlvbiA9IHRoaXMuZ2V0RWxlbWVudEJ5SWQoX2VsLnBhcmVudClcclxuXHQgICAgXHR9IGVsc2UgaWYoX2VsLnR5cGUgPT0gJ2RlY2snKSB7XHJcblx0ICAgIFx0XHRfZGVja19kZXN0aW5hdGlvbiA9IF9lbDtcclxuXHQgICAgXHR9XHJcblx0ICAgIH1cclxuXHJcblx0ICAgIF9zdWNjZXNzID0gX3N1Y2Nlc3MgJiYgX2RlY2tfZGVzdGluYXRpb247XHJcbiAgICBcdFxyXG4gICAgXHRfZGVja19kZXBhcnR1cmUgPSBtb3ZlRGVja1swXS5jYXJkLnBhcmVudCAmJiB0aGlzLmdldEVsZW1lbnRCeUlkKG1vdmVEZWNrWzBdLmNhcmQucGFyZW50KTtcclxuICAgIFx0Ly8gY29uc29sZS5sb2coJ0RST1A6JywgX2RvcC5pZCwgX2RlY2tfZGVzdGluYXRpb24pO1xyXG5cdCAgICBfc3VjY2VzcyA9IF9zdWNjZXNzICYmIF9kZWNrX2RlcGFydHVyZTtcclxuXHJcblx0ICAgIGlmKF9kZWNrX2Rlc3RpbmF0aW9uICYmIF9kZWNrX2Rlc3RpbmF0aW9uLmdldElkKCkgIT0gX2RlY2tfZGVwYXJ0dXJlLmdldElkKCkpIHtcclxuXHRcdCAgICBcclxuXHQgICAgXHR2YXIgX3B1dCA9IF9kZWNrX2Rlc3RpbmF0aW9uLlB1dChtb3ZlRGVjayk7XHJcblx0XHQgICAgX3N1Y2Nlc3MgPSBfc3VjY2VzcyAmJiBfcHV0O1xyXG5cdCAgICBcdFxyXG5cdCAgICBcdGlmKF9wdXQgJiYgX2RlY2tfZGVwYXJ0dXJlKSB7XHJcblx0ICAgIFx0XHRcclxuXHQgICAgXHRcdHZhciBfcG9wID0gX2RlY2tfZGVwYXJ0dXJlLlBvcChtb3ZlRGVjay5sZW5ndGgpO1xyXG5cdCAgICBcdFx0XHJcblx0ICAgIFx0XHQvLyBjb25zb2xlLmxvZygnTU9WRScsIF9kZWNrX2RlcGFydHVyZSwgX2RlY2tfZGVwYXJ0dXJlLlBvcCwgbW92ZURlY2subGVuZ3RoKTtcclxuXHJcblx0XHRcdCAgICBfc3VjY2VzcyA9IF9zdWNjZXNzICYmIF9wb3A7XHJcblx0ICAgIFx0XHRcclxuXHQgICAgXHRcdGlmKF9wb3ApIHtcclxuXHQgICAgXHRcdFx0XHJcblxyXG5cdCAgICBcdFx0XHQvLyDQv9C+0LvQvtC20LjQu9C4INCyINC60L7Qu9C+0LTRg1xyXG5cdCAgICBcdFx0XHQvLyDQsdC10Lcg0LDQvdC40LzQsNGG0LjQuCwg0L/RgNC+0YHRgtC+INC/0LXRgNC10YDQuNGB0L7QstC60LAg0L7QsdC10LjRhSDQutC+0LvQvtC0XHJcblxyXG5cdCAgICBcdFx0XHRfZGVja19kZXN0aW5hdGlvbi5QdXNoKF9wb3ApO1xyXG5cclxuXHRcdFx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ21vdmVEcmFnRGVjaycsIHtcclxuXHRcdFx0XHRcdFx0ZGVwYXJ0dXJlICAgOiBfZGVja19kZXBhcnR1cmUsXHJcblx0XHRcdFx0XHRcdGRlc3RpbmF0aW9uIDogX2RlY2tfZGVzdGluYXRpb24sXHJcblx0XHRcdFx0XHRcdG1vdmVEZWNrICAgIDogbW92ZURlY2tcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHQgICAgXHRcdFx0Ly8gX2RlY2tfZGVwYXJ0dXJlICAuUmVkcmF3KCk7XHJcblx0ICAgIFx0XHRcdC8vIF9kZWNrX2Rlc3RpbmF0aW9uLlJlZHJhdygpO1xyXG5cdFx0XHRcdFx0XHJcblx0XHRcdFx0XHRzaGFyZS5vbmVTdGVwV2F5Lm1vdmUgPSB7XHJcblx0XHRcdFx0XHRcdGZyb20gOiBfZGVja19kZXBhcnR1cmUgIC5uYW1lLFxyXG5cdFx0XHRcdFx0XHR0byAgIDogX2RlY2tfZGVzdGluYXRpb24ubmFtZSxcclxuXHRcdFx0XHRcdFx0ZGVjayA6IHNoYXJlLmRlY2tDYXJkTmFtZXMobW92ZURlY2spXHJcblx0XHRcdFx0XHR9O1xyXG5cclxuXHRcdFx0XHRcdHZhciBfZGVjayA9IF9kZWNrX2RlcGFydHVyZS5nZXRDYXJkcygpO1xyXG5cdFx0XHRcdFx0aWYoX2RlY2subGVuZ3RoICYmIF9kZWNrW19kZWNrLmxlbmd0aCAtIDFdLmZsaXAgPT0gdHJ1ZSkge1xyXG5cdFx0XHRcdFx0XHRfZGVja1tfZGVjay5sZW5ndGggLSAxXS5mbGlwID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdHNoYXJlLm9uZVN0ZXBXYXkudW5mbGlwID0ge1xyXG5cdFx0XHRcdFx0XHRcdGRlY2sgOiBfZGVja19kZXBhcnR1cmUubmFtZSxcclxuXHRcdFx0XHRcdFx0XHRjYXJkIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0bmFtZSAgOiBfZGVja1tfZGVjay5sZW5ndGggLSAxXS5uYW1lLFxyXG5cdFx0XHRcdFx0XHRcdFx0aW5kZXggOiBfZGVjay5sZW5ndGggLSAxXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dGhpcy5ldmVudC5kaXNwYXRjaCgnbWFrZVN0ZXAnLCBzaGFyZS5vbmVTdGVwV2F5KTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gc2F2ZVN0ZXAoKTtcclxuXHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0Ly8gYWZ0ZXJTdGVwKCk7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdHRoaXMud2luQ2hlY2soe3Nob3cgOiB0cnVlfSk7XHJcblxyXG5cdCAgICBcdFx0fVxyXG5cdCAgICBcdH1cclxuXHQgICAgXHQvLyBBIFBvcCgpXHJcblx0ICAgIFx0Ly8gQiBQdXNoKClcclxuXHQgICAgXHQvLyBBLCBCIFJlZHJhdygpXHJcblx0ICAgIH0gZWxzZSB7XHJcblx0ICAgIFx0X3N1Y2Nlc3MgPSBmYWxzZTtcclxuXHQgICAgfVxyXG5cclxuXHRcdC8vINC10YHQu9C4INC90LUg0LrQtNCw0LvQvtGB0Ywg0L/QvtC70L7QttC40YLRjCDQutCw0YDRgtGLLCDQstC10YDQvdGD0YLRjCDQvtCx0YDQsNGC0L3QvlxyXG4gICAgXHRcclxuICAgIFx0aWYoIV9zdWNjZXNzICYmIF9kZWNrX2RlcGFydHVyZSkge1xyXG5cclxuICAgIFx0XHRpZihjdXJzb3JNb3ZlLmRpc3RhbmNlID49IHNoYXJlLm1vdmVEaXN0YW5jZSkge1xyXG5cclxuXHQgICAgXHRcdHZhciBUaXAgPSBzaGFyZS5iZXN0VGlwKG1vdmVEZWNrLCBjdXJzb3JNb3ZlKTtcclxuXHQgICAgXHRcdFxyXG5cdCAgICBcdFx0aWYoVGlwKSB7XHJcblx0ICAgIFx0XHRcdHRoaXMuTW92ZShtb3ZlRGVjaywgVGlwLnRvLmRlY2suZG9tRWxlbWVudCwgY3Vyc29yTW92ZSk7XHJcblx0ICAgIFx0XHR9IGVsc2Uge1xyXG5cdCAgICBcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdtb3ZlQ2FyZFRvSG9tZScsIHtcclxuXHQgICAgXHRcdFx0XHRtb3ZlRGVjayAgOiBtb3ZlRGVjayxcclxuXHQgICAgXHRcdFx0XHRkZXBhcnR1cmUgOiBfZGVja19kZXBhcnR1cmVcclxuXHQgICAgXHRcdFx0fSk7XHJcblx0XHQgICAgXHRcdC8vIHNoYXJlLm1vdmVDYXJkVG9Ib21lKCk7XHJcblx0ICAgIFx0XHR9XHJcblxyXG4gICAgXHRcdH0gZWxzZSB7XHJcbiAgICBcdFx0XHRtYWluLmV2ZW50LmRpc3BhdGNoKCdtb3ZlQ2FyZFRvSG9tZScsIHtcclxuICAgIFx0XHRcdFx0bW92ZURlY2sgIDogbW92ZURlY2ssXHJcbiAgICBcdFx0XHRcdGRlcGFydHVyZSA6IF9kZWNrX2RlcGFydHVyZVxyXG4gICAgXHRcdFx0fSk7XHJcblx0ICAgIFx0XHQvLyBzaGFyZS5tb3ZlQ2FyZFRvSG9tZShtb3ZlRGVjaywgX2RlY2tfZGVwYXJ0dXJlKTtcclxuICAgIFx0XHR9XHJcblxyXG4gICAgXHR9XHJcblxyXG4gICAgXHRpZihfc3VjY2Vzcykge1xyXG5cclxuICAgIFx0XHQvLyBhZnRlck1vdmUoKTtcclxuXHQgICAgXHRzaGFyZS5jaGVja1RpcHMoKTtcclxuXHQgICAgfVxyXG5cclxuXHR9LmJpbmQobWFpbik7XHJcblxyXG59O1xyXG5cblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL01vdmUuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFxyXG5cdHZhciB3Y20gPSBzaGFyZS53aW5DaGVja01ldGhvZHMgPSB7XHJcblx0XHQvLyBGaWx0ZXJzXHJcblxyXG5cdFx0Ly8g0LLQvtC30LLRgNCw0YnQsNC10YIg0LrQvtC70L7QtNGLINC+0L/RgNC10LTQtdC70ZHQvdC90L7QuSDQs9GA0YPQv9C/0Ysv0LPRgNGD0L/Qv1xyXG5cdFx0Z3JvdXAgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdGlmKCFhLmZpbHRlcikgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR2YXIgX2RlY2tzID0gW107XHJcblx0XHRcdGZvcih2YXIgX2kgaW4gYS5kZWNrcykge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdncm91cCBmaWx0ZXI6JywgX2ksIGEuZGVja3NbX2ldLnBhcmVudCgpLCBhLmZpbHRlckFyZ3MpO1xyXG5cdFx0XHRcdC8vIHZhciBfcGFyZW50ID0gYS5kZWNrc1tfaV0ucGFyZW50KClcclxuXHRcdFx0XHQvLyBpZihhLmZpbHRlckFyZ3MuaW5kZXhPZihhLmRlY2tzW19pXS5wYXJlbnQoKSkpIHtcclxuXHRcdFx0XHRpZihcclxuXHRcdFx0XHRcdChcclxuXHRcdFx0XHRcdFx0dHlwZW9mIGEuZmlsdGVyQXJncyAgPT0gXCJzdHJpbmdcIiBcclxuXHRcdFx0XHRcdCAmJiBhLmRlY2tzW19pXS5wYXJlbnQoKSA9PSBhLmZpbHRlckFyZ3NcclxuXHRcdFx0XHRcdClcclxuXHRcdFx0XHQgfHwgYS5maWx0ZXJBcmdzLmluZGV4T2YoYS5kZWNrc1tfaV0ucGFyZW50KCkpID49IDBcclxuXHRcdFx0XHQpIHtcclxuXHRcdFx0XHRcdF9kZWNrcy5wdXNoKGEuZGVja3NbX2ldKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0YS5kZWNrcyA9IF9kZWNrcztcclxuXHRcdFx0cmV0dXJuIF9kZWNrcy5sZW5ndGg7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIEludGVybmFsIHVzZVxyXG5cclxuXHRcdF9hc2NfZGVzayA6IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHRcdGlmKCFhIHx8IGEuYXNjX2Rlc2sgPT0gbnVsbCB8fCB0eXBlb2YgYS5hc2NfZGVzayAhPSAnbnVtYmVyJykgcmV0dXJuIGZhbHNlO1xyXG5cclxuXHRcdFx0dmFyIF9jb3JyZWN0ID0gdHJ1ZTtcclxuXHRcdFx0XHJcblx0XHRcdGZvcih2YXIgZCBpbiBhLmRlY2tzKSB7XHJcblxyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdfYXNjX2Rlc2snLCBhLmFzY19kZXNrID8gJ2FzYycgOiAnZGVzaycsIGEuYXNjX2Rlc2ssIGQsIGEuZGVja3NbZF0sIF9jb3JyZWN0LCBhLmRlY2tzW2RdLmdldENhcmRzKCkpO1xyXG5cdFx0XHRcdGlmKF9jb3JyZWN0ID09IGZhbHNlKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIF9jYXJkcyA9IGEuZGVja3NbZF0uZ2V0Q2FyZHMoKTtcclxuXHRcdFx0XHQvLyBjb25zb2xlLmxvZygnY2FyZHM6JywgX2NhcmRzKTtcclxuXHRcdFx0XHRmb3IodmFyIGMgaW4gX2NhcmRzKSB7XHJcblx0XHRcdFx0XHRpZihjID4gMCkge1x0XHJcblx0XHRcdFx0XHRcdHZhciBkb3duID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShfY2FyZHNbKGN8MCkgLSAxXS5uYW1lKSxcclxuXHRcdFx0XHRcdFx0XHR1cCAgID0gc2hhcmUudmFsaWRhdGVDYXJkTmFtZShfY2FyZHNbKGN8MCldLm5hbWUpO1xyXG5cdFx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnX2FzY19kZXNrJywgZG93biwgdXAsIGEuYXNjX2Rlc2spO1x0XHJcblx0XHRcdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgZG93biAmJiB1cCAmJiBzaGFyZS5jYXJkc1JhbmtTLmluZGV4T2YoZG93bi5yYW5rKSA9PSAoc2hhcmUuY2FyZHNSYW5rUy5pbmRleE9mKHVwLnJhbmspICsgYS5hc2NfZGVzayk7XHJcblx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIF9jb3JyZWN0O1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBTaW1wbGUgcnVsZXNcclxuXHJcblx0XHRuZXdlcldpbiA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oXCJZb3UgdXNlICduZXdlcldpbicgcnVsZSBmb3IgY2hlY2tpbmcgV2luLiBNYXliZSBhcmd1bWVudHMgaW4gJ3dpbkNoZWNrLnJ1bGUnIGhhdmUgaW5jb3JyZWN0IHJ1bGUgbmFtZS5cIilcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyDQstGB0LUg0LrQvtC70L7QtNGLINC/0YPRgdGC0YtcclxuXHJcblx0XHRhbGxFbXB0eSA6IGZ1bmN0aW9uKGEpIHtcclxuXHJcblx0XHRcdHZhciBfY29ycmVjdCA9IHRydWU7XHJcblx0XHRcdGZvcih2YXIgX2kgaW4gYS5kZWNrcykge1xyXG5cdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgYS5kZWNrc1tfaV0uZ2V0Q2FyZHMoKS5sZW5ndGggPT0gMDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gX2NvcnJlY3Q7XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIENvbWJpbmVkIHJ1bGVzICh1c2UgbGlrZSBmaWx0ZXIpXHJcblxyXG5cdFx0Ly8g0LLRgdC1INC60LDRgNGC0Ysg0LIg0L7QtNC90L7QuSDQutC+0LvQvtC00LVcclxuXHRcdGFsbEluT25lIDogZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NoZWNrIFdpbiwgcnVsZS9maWx0ZXIgLSBhbGxJbk9uZTonLCBhKTtcclxuXHJcblx0XHRcdHZhciBfZW1wdHlEZWNrc0NvdW50ID0gMCxcclxuXHRcdFx0XHRfZGVja3NMZW5ndGggICAgID0gMCxcclxuXHRcdFx0XHRfZmlsbEluZGV4ICAgICAgID0gMDtcclxuXHRcdFx0Zm9yKHZhciBpIGluIGEuZGVja3MpIHtcclxuXHRcdFx0XHRpZihhLmRlY2tzW2ldLmdldENhcmRzKCkubGVuZ3RoID09IDApIHtcclxuXHRcdFx0XHRcdF9lbXB0eURlY2tzQ291bnQgKz0gMTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0ZmlsbEluZGV4ID0gaTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0X2RlY2tzTGVuZ3RoICs9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2FsbGlub25lJywgYSwgX2VtcHR5RGVja3NDb3VudCwgX2RlY2tzTGVuZ3RoKTtcclxuXHRcdFx0dmFyIF9jb3JyZWN0ID0gX2VtcHR5RGVja3NDb3VudCA9PSBfZGVja3NMZW5ndGggLSAxO1xyXG5cdFx0XHRpZihhLmZpbHRlcikgYS5kZWNrcyA9IF9jb3JyZWN0ID8gW2EuZGVja3NbZmlsbEluZGV4XV0gOiBbXTtcclxuXHRcdFx0cmV0dXJuIF9jb3JyZWN0XHJcblx0XHR9LFxyXG5cclxuXHRcdC8vIHN0ZXAgYnkgc3RlcCAxLCAyLCAzXHJcblx0XHQvLyDQstC+INCy0YHQtdGFINC60L7Qu9C+0LTQsNGFINC60LDRgNGC0Ysg0L/QviDQstC+0LfRgNCw0YHRgtCw0L3QuNGOXHJcblx0XHRhbGxBc2NlbmQgOiBmdW5jdGlvbihhKSB7XHJcblxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZygnY2hlY2sgV2luLCBydWxlIC0gYWxsQXNjZW5kaW5nOicsIGEpO1xyXG5cdFx0XHRhLmFzY19kZXNrID0gLTE7XHJcblx0XHRcdHJldHVybiB3Y20uX2FzY19kZXNrKGEpO1xyXG5cdFx0fSxcclxuXHRcdFxyXG5cdFx0Ly8gc3RlcCBieSBzdGVwIDMsIDIsIDFcclxuXHRcdC8vINCy0L4g0LLRgdC10YUg0LrQvtC70L7QtNCw0YUg0LrQsNGA0YLRiyDQv9C+INGD0LHRi9Cy0LDQvdC40Y5cclxuXHRcdGFsbERlc2NlbnQgOiBmdW5jdGlvbihhKSB7XHJcblx0XHRcdFx0XHJcblx0XHRcdGEuYXNjX2Rlc2sgPSAxO1xyXG5cdFx0XHRyZXR1cm4gd2NtLl9hc2NfZGVzayhhKTtcclxuXHRcdH0sXHJcblxyXG5cclxuXHRcdC8vIENvbXBvc2l0ZSBydWxlcyAoaW5wdXQgYXJndW1lbnRzKVxyXG5cdFx0Ly8g0LrQvtC80LHQuNC90LjRgNC+0LLQsNC90L3QvtC1INC/0YDQsNCy0LjQu9C+XHJcblx0XHRcdFxyXG5cdFx0bGVnbyA6IGZ1bmN0aW9uKF9hKSB7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhhLnJ1bGVzQXJncy5maWx0ZXJzLCBhLnJ1bGVzQXJncy5ydWxlcylcclxuXHRcdFx0XHJcblx0XHRcdGlmKCFfYSB8fCAhX2EucnVsZXNBcmdzKSByZXR1cm4gZmFsc2U7XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgX2NvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHRcclxuXHRcdFx0XHJcblx0XHRcdC8vIGFwcGx5IGZpbHRlcnNcclxuXHRcdFx0Zm9yKHZhciBuZXh0IGluIF9hLnJ1bGVzQXJncykge1xyXG5cdFx0XHRcdHZhciBfZGVja3NDbG9uZSA9IHt9O1xyXG5cdFx0XHRcdGZvcih2YXIgaSBpbiBfYS5kZWNrcykgX2RlY2tzQ2xvbmVbaV0gPSBfYS5kZWNrc1tpXTtcclxuXHRcdFx0XHR2YXIgYSA9IHtcclxuXHRcdFx0XHRcdC8vIGZpbHRlcnMgOiBfYVtuZXh0XS5maWx0ZXJzLFxyXG5cdFx0XHRcdFx0Ly8gcnVsZXMgICA6IF9hW25leHRdLnJ1bGVzLFxyXG5cdFx0XHRcdFx0ZGVja3MgICA6IF9kZWNrc0Nsb25lXHJcblx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0Ly8g0L/RgNC40LzQtdC90Y/QtdC8INGE0LjQu9GM0YLRgNGLLCDQvtGB0YLQsNCy0LvRj9C10Lwg0YLQvtC70YzQutC+INC40L3RgtC10YDQtdGB0YPRjtGJ0LjQtSDQutC+0LvQvtC00YtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZihfY29ycmVjdCAmJiBfYS5ydWxlc0FyZ3NbbmV4dF0uZmlsdGVycykge1xyXG5cclxuXHRcdFx0XHRcdGEuZmlsdGVyID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFxyXG5cclxuXHRcdFx0XHRcdGZvcih2YXIgaSBpbiBfYS5ydWxlc0FyZ3NbbmV4dF0uZmlsdGVycykge1xyXG5cdFx0XHRcdFx0XHRpZih0eXBlb2YgX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV0gPT0gJ3N0cmluZycgJiYgd2NtW19hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldXSkge1xyXG5cdFx0XHRcdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgd2NtW19hLnJ1bGVzQXJnc1tuZXh0XS5maWx0ZXJzW2ldXShhKTtcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBpZih0eXBlb2YgX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV0gPT0gJ29iamVjdCcpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV1cclxuXHRcdFx0XHRcdFx0XHQgJiYgX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV0udG9TdHJpbmcoKSA9PSBcIltvYmplY3QgT2JqZWN0XVwiXHJcblx0XHRcdFx0XHRcdFx0KSB7XHJcblx0XHRcdFx0XHRcdFx0XHRmb3IodmFyIGZpbHRlck5hbWUgaW4gX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV0pIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0aWYod2NtW2ZpbHRlck5hbWVdKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YS5maWx0ZXJBcmdzID0gX2EucnVsZXNBcmdzW25leHRdLmZpbHRlcnNbaV1bZmlsdGVyTmFtZV1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRfY29ycmVjdCA9IF9jb3JyZWN0ICYmIHdjbVtmaWx0ZXJOYW1lXShhKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRfY29ycmVjdCA9IF9jb3JyZWN0ICYmIHdjbVsnbmV3ZXJXaW4nXSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdF9jb3JyZWN0ID0gX2NvcnJlY3QgJiYgd2NtWyduZXdlcldpbiddKCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGEuZmlsdGVyID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyDQv9GA0LjQvNC10L3Rj9C10Lwg0L/RgNCw0LLQuNC70LAg0Log0L7RgdGC0LDQstGI0LjQvNGB0Y8g0LrQvtC70L7QtNCw0LxcclxuXHJcblx0XHRcdFx0aWYoX2EucnVsZXNBcmdzW25leHRdLnJ1bGVzKSB7XHJcblx0XHRcdFx0XHRcclxuXHRcdFx0XHRcdGZvcih2YXIgaSBpbiBfYS5ydWxlc0FyZ3NbbmV4dF0ucnVsZXMpIHtcclxuXHRcdFx0XHRcdFx0aWYod2NtW19hLnJ1bGVzQXJnc1tuZXh0XS5ydWxlc1tpXV0pIHtcclxuXHRcdFx0XHRcdFx0XHRfY29ycmVjdCA9IF9jb3JyZWN0ICYmIHdjbVtfYS5ydWxlc0FyZ3NbbmV4dF0ucnVsZXNbaV1dKGEpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKCcjMicpXHJcblx0XHRcdFx0XHRcdFx0X2NvcnJlY3QgPSBfY29ycmVjdCAmJiB3Y21bJ25ld2VyV2luJ10oKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cclxuXHJcblx0XHRcdHJldHVybiBfY29ycmVjdDtcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRtYWluLndpbkNoZWNrID0gZnVuY3Rpb24oYSkge1xyXG5cdFx0aWYoIWEpIGEgPSB7fTtcclxuXHRcdGlmKHR5cGVvZiBhLnNob3cgPT0gJ3VuZGVmaW5lZCcpIGEuc2hvdyA9IGZhbHNlO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ3dpbkNoZWNrJywgYSk7XHJcblx0XHRyZXR1cm4gc2hhcmUud2luQ2hlY2soYSk7XHJcblx0XHQvLyByZXR1cm4gd2luQ2hlY2soe25vQ2FsbGJhY2sgOiB0cnVlfSk7XHJcblx0fS5iaW5kKG1haW4pO1xyXG5cclxuXHRzaGFyZS53aW5DaGVjayA9IGZ1bmN0aW9uKHBhcmFtcykge1xyXG5cclxuXHRcdC8vIHZhciBfZGVja3MgPSBtYWluLmdldERlY2tzKCk7XHJcblx0XHRcclxuXHRcdGlmKHR5cGVvZiBzaGFyZS53aW5DaGVja01ldGhvZCA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdGlmKHNoYXJlLndpbkNoZWNrTWV0aG9kKHtcclxuXHRcdFx0XHRkZWNrcyA6IG1haW4uZ2V0RGVja3Moe3Zpc2libGUgOiB0cnVlfSlcclxuXHRcdFx0fSkpIHtcclxuXHRcdFx0XHRFdmVudE1hbmFnZXIuZGlzcGF0Y2goJ3dpbicsIHBhcmFtcyk7XHJcblx0XHRcdFx0Ly8gaWYocGFyYW1zICYmIHBhcmFtcy5ub0NhbGxiYWNrID09IHRydWUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdC8vIGEud2luQ2hlY2suY2FsbGJhY2soKTtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0XHJcblx0XHRcdHZhciBydWxlc0NvcnJlY3QgPSB0cnVlO1xyXG5cdFx0XHR2YXIgX2hhc01ldG9kcyA9IGZhbHNlO1xyXG5cdFx0XHRmb3IodmFyIGkgaW4gc2hhcmUud2luQ2hlY2tNZXRob2QpIHtcclxuXHRcdFx0XHRfaGFzTWV0b2RzID0gdHJ1ZTtcclxuXHRcdFx0XHRpZihzaGFyZS53aW5DaGVja01ldGhvZHNbaV0pIHtcclxuIFx0XHRcdFx0XHRcclxuIFx0XHRcdFx0XHRydWxlc0NvcnJlY3QgPSBydWxlc0NvcnJlY3QgJiYgc2hhcmUud2luQ2hlY2tNZXRob2RzW2ldKHtcclxuIFx0XHRcdFx0XHRcdGRlY2tzICAgICA6IG1haW4uZ2V0RGVja3Moe3Zpc2libGUgOiB0cnVlfSksIFxyXG4gXHRcdFx0XHRcdFx0cnVsZXNBcmdzIDogc2hhcmUud2luQ2hlY2tNZXRob2RbaV1cclxuIFx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmKHR5cGVvZiBzaGFyZS53aW5DaGVja01ldGhvZFtpXSA9PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBzaGFyZS53aW5DaGVja01ldGhvZFtpXSh7XHJcblx0XHRcdFx0XHRcdFx0ZGVja3MgOiBtYWluLmdldERlY2tzKHt2aXNpYmxlIDogdHJ1ZX0pXHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0cnVsZXNDb3JyZWN0ID0gcnVsZXNDb3JyZWN0ICYmIHNoYXJlLndpbkNoZWNrTWV0aG9kc1snbmV3ZXJXaW4nXSgpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRpZighX2hhc01ldG9kcykge1xyXG5cdFx0XHRcdHJ1bGVzQ29ycmVjdCA9IHJ1bGVzQ29ycmVjdCAmJiBzaGFyZS53aW5DaGVja01ldGhvZHNbJ25ld2VyV2luJ10oKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYocnVsZXNDb3JyZWN0KSB7XHJcblx0XHRcdFx0aWYocGFyYW1zICYmIHBhcmFtcy5ub0NhbGxiYWNrID09IHRydWUpIHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3dpbicsIHBhcmFtcyk7XHJcblx0XHRcdFx0Ly8gYS53aW5DaGVjay5jYWxsYmFjaygpO1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdC8vIHJldHVybiBydWxlc0NvcnJlY3Q7XHJcblx0XHR9XHJcblx0fVxyXG5cclxufTtcclxuXG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy93aW5DaGVjay5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0Ly8g0L/Rg9GB0YLRjCDQsdGD0LTQtdGCXHJcblx0TWF0aC5zcXIgPSBmdW5jdGlvbihpKSB7cmV0dXJuIGkgKiBpO31cclxuXHJcblx0Ly8gdmFyIGRyYWdfZWwgPSBudWxsO1xyXG5cdHNoYXJlLmRyYWdEZWNrID0gbnVsbDtcclxuXHRzaGFyZS5zdGFydEN1cnNvciA9IG51bGw7XHJcblxyXG5cdHZhciB0b3Bfel9pbmRleCA9IDkwMDtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3VuZG8nLCBmdW5jdGlvbigpIHtcclxuXHRcdC8qc2hhcmUubW92ZUNhcmRUb0hvbWUoXHJcblx0XHRcdHNoYXJlLmRyYWdEZWNrLCBcclxuXHRcdFx0bWFpbi5nZXREZWNrQnlJZChzaGFyZS5kcmFnRGVja1swXS5jYXJkLnBhcmVudClcclxuXHRcdCk7Ki9cclxuXHRcdGlmKHNoYXJlLmRyYWdEZWNrKSBtYWluLmdldERlY2tCeUlkKHNoYXJlLmRyYWdEZWNrWzBdLmNhcmQucGFyZW50KS5SZWRyYXcoKTtcclxuXHRcdHNoYXJlLmRyYWdEZWNrICAgID0gbnVsbDtcclxuXHRcdHNoYXJlLnN0YXJ0Q3Vyc29yID0gbnVsbDtcclxuXHR9KTtcclxuXHJcblx0bWFpbi5ldmVudC5saXN0ZW4oJ3JlZG8nLCBmdW5jdGlvbigpIHtcclxuXHRcdC8qc2hhcmUubW92ZUNhcmRUb0hvbWUoXHJcblx0XHRcdHNoYXJlLmRyYWdEZWNrLCBcclxuXHRcdFx0bWFpbi5nZXREZWNrQnlJZChzaGFyZS5kcmFnRGVja1swXS5jYXJkLnBhcmVudClcclxuXHRcdCk7Ki9cclxuXHRcdGlmKHNoYXJlLmRyYWdEZWNrKSBtYWluLmdldERlY2tCeUlkKHNoYXJlLmRyYWdEZWNrWzBdLmNhcmQucGFyZW50KS5SZWRyYXcoKTtcclxuXHRcdHNoYXJlLmRyYWdEZWNrICAgID0gbnVsbDtcclxuXHRcdHNoYXJlLnN0YXJ0Q3Vyc29yID0gbnVsbDtcclxuXHR9KTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuXHJcblx0dmFyIGNkb3duID0gZnVuY3Rpb24odGFyZ2V0LCB4LCB5KSB7XHJcblxyXG5cdFx0aWYoc2hhcmUuY3VyTG9ja1N0YXRlKSByZXR1cm47XHJcblxyXG5cdFx0dHJ5IHtcclxuXHRcdFx0JCgnLmRyYWdnYWJsZScpLmZpbmlzaCgpO1xyXG5cdFx0fSBjYXRjaChlKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIHRyeXskKCcuZHJhZ2dhYmxlOmFuaW1hdGVkJykuZmluaXNoKCk7fWNhdGNoKGUpe2NvbnNvbGUubG9nKCdIbW1tLi4uJywgJCgnLmRyYWdnYWJsZTphbmltYXRlZCcpKTt9XHJcblxyXG5cdCAgICBpZihzaGFyZS5kcmFnRGVjayB8fCBzaGFyZS5zdGFydEN1cnNvcikgcmV0dXJuO1xyXG5cdCAgICBcclxuXHQgICAgaWYoIHRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKCdzbG90JykgPj0gMCApIHtcclxuXHRcdCAgICBcclxuXHRcdCAgICB2YXIgX2lkICAgPSB0YXJnZXQuaWQsXHJcblx0XHQgICAgXHRfZGVjayA9IG1haW4uZ2V0RWxlbWVudEJ5SWQoX2lkKTtcclxuXHQgICAgXHRtYWluLmV2ZW50LmRpc3BhdGNoKCdydW5EZWNrQWN0aW9ucycsIHtcclxuXHRcdFx0XHRkZWNrIDogX2RlY2tcclxuXHRcdFx0fSk7XHJcblx0ICAgIH1cclxuXHQgICAgXHJcblx0ICAgIGlmKCB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZignZHJhZ2dhYmxlJykgPj0gMCApIHtcclxuXHRcdCAgICBcclxuXHRcdCAgICB2YXIgX2lkICAgICA9ICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldC5pZCxcclxuICAgIFx0XHRcdF9jYXJkICAgPSBfaWQgICAgICAgICAgICAgICAgICAgPyBtYWluLmdldEVsZW1lbnRCeUlkKF9pZCkgIDogbnVsbCxcclxuXHRcdFx0XHRfcGFyZW50ID0gX2NhcmQgJiYgX2NhcmQucGFyZW50ID8gX2NhcmQucGFyZW50ICAgICAgICAgICAgICA6IG51bGwsXHJcblx0XHRcdFx0X2RlY2sgICA9IF9wYXJlbnQgICAgICAgICAgICAgICA/IG1haW4uZ2V0RGVja0J5SWQoX3BhcmVudCkgOiBudWxsO1xyXG5cdFx0XHRcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2NhcmQgZnJvbSBkZWNrOicsIF9kZWNrKTtcclxuXHRcdFx0XHJcblx0XHRcdG1haW4uZXZlbnQuZGlzcGF0Y2goJ3J1bkRlY2tBY3Rpb25zJywge1xyXG5cdFx0XHRcdGRlY2sgOiBfZGVja1xyXG5cdFx0XHR9KTtcclxuXHRcdFx0XHJcblx0XHRcdC8vIFRPRE9cclxuXHRcdFx0Ly8g0LIg0LTQsNC90L3QvtC5INGB0LjRgtGD0LDRhtC40Lgg0L7QsdGA0LDQsdCw0YLRi9Cy0LDQtdGC0YHRjyDRgtC+0LvRjNC60L4g0LrQu9C40Log0L/QviDQutCw0YDRgtC1LCDQv9GD0YHRgtGL0LUg0LrQvtC70L7QtNGLINC90LjQutCw0Log0L3QtSDQvtCx0YDQsNCx0LDRgtGL0LLQsNGO0YLRgdGPXHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhfaWQsIF9jYXJkLCBfcGFyZW50LCBfZGVjaywgbWFpbi5nZXRFbGVtZW50cygpKVxyXG5cdFx0XHRcclxuXHRcdFx0c2hhcmUuZHJhZ0RlY2sgPSBfZGVjayA/IF9kZWNrLlRha2UoX2lkKSA6IG51bGw7XHJcblx0XHRcdFxyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhzaGFyZS5kcmFnRGVjayk7XHJcblx0ICAgIFxyXG5cdCAgICAgICAgaWYoc2hhcmUuZHJhZ0RlY2spIHtcclxuXHJcblx0ICAgICAgICBcdHNoYXJlLnN0YXJ0Q3Vyc29yID0ge1xyXG5cdCAgICAgICAgICAgIFx0eCAgOiB4LFxyXG5cdCAgICAgICAgICAgIFx0eSAgOiB5XHJcblx0XHQgICAgICAgIH1cclxuXHJcblx0XHQgICAgICAgIG1haW4udGlwc0Rlc3RpbmF0aW9uKHtjdXJyZW50Q2FyZCA6IF9jYXJkfSk7XHJcblx0XHQgICAgfVxyXG5cdCAgICB9XHJcblxyXG5cdCAgICAvLyBjb25zb2xlLmxvZyhzaGFyZS5kcmFnRGVjaywgc2hhcmUuc3RhcnRDdXJzb3IpO1xyXG5cclxuXHJcblx0fVxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG5cclxuXHR2YXIgY21vdmUgPSBmdW5jdGlvbih4LCB5KSB7XHJcblxyXG5cdCAgICBpZighc2hhcmUuZHJhZ0RlY2sgfHwgIXNoYXJlLnN0YXJ0Q3Vyc29yKSByZXR1cm47XHJcblxyXG5cdFx0Ly8gaWYobWFpbi5kZWJ1Z0xhYmVscygpKSB7XHJcblx0XHRcdC8vIHZhciBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuXHRcdFx0Ly8gY2FudmFzLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCAxMjgpO1xyXG5cdFx0XHQvLyBjYW52YXMuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCAxMjgpO1xyXG5cdFx0XHQvLyBjYW52YXMuc2V0QXR0cmlidXRlKCdpZCcsICdjYW52YXMnKTtcclxuXHRcdFx0Ly8gY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XHJcblx0XHRcdC8vIGNvbnRleHQubGluZVdpZHRoID0gMjtcclxuXHRcdFx0Ly8gY29udGV4dC5mb250ID0gXCIxMnB4IFZlcmRhbmFcIjtcclxuXHRcdFx0Ly8gY29udGV4dC5maWxsU3R5bGUgPSBcImJsdWVcIjsvL3doaXRlXCI7XHJcblx0XHRcdC8vIGNvbnRleHQuc3Ryb2tlU3R5bGUgPSBcIndoaXRlXCI7Ly9ibGFja1wiO1xyXG5cdFx0XHQvLyB2YXIgdGV4dCA9IFwiKHg6eSk6IFwiICsgeCArIFwiOlwiICsgeTtcclxuXHRcdFx0Ly8gY29udGV4dC5zdHJva2VUZXh0KHRleHQsIDE1LCAyMCk7XHJcblx0XHRcdC8vIGNvbnRleHQuZmlsbFRleHQodGV4dCwgMTUsIDIwKTtcclxuXHRcdFx0Ly8gLy8gaWYoc2hhcmUuZHJhZ0RlY2spICQoc2hhcmUuZHJhZ0RlY2tbMF0uY2FyZCkuaGlkZSgpO1xyXG5cdFx0XHQvLyB2YXIgX2VsID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KTtcclxuXHRcdFx0Ly8gaWYoX2VsKSB7XHJcblx0XHRcdC8vIHRleHQgPSBcImN1cnNvciBvbjogXCIgKyBfZWwuaWQ7XHJcblx0XHRcdC8vIFx0Ly8gaWYoc2hhcmUuZHJhZ0RlY2spICQoc2hhcmUuZHJhZ0RlY2tbMF0uY2FyZCkuc2hvdygpO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCAxNSwgMzUpO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuZmlsbFRleHQodGV4dCwgMTUsIDM1KTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyBpZihzaGFyZS5kcmFnRGVjaykge1xyXG5cdFx0XHQvLyBcdHRleHQgPSBcInRha2U6IFwiICsgc2hhcmUuZHJhZ0RlY2tbMF0uY2FyZC5pZDtcclxuXHRcdFx0Ly8gXHRjb250ZXh0LnN0cm9rZVRleHQodGV4dCwgMTUsIDUwKTtcclxuXHRcdFx0Ly8gXHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIDE1LCA1MCk7XHJcblx0XHRcdC8vIFx0dGV4dCA9IFwiLi4uKHg6eSk6IFwiICsgc2hhcmUuc3RhcnRDdXJzb3IueCArIFwiOlwiICsgc2hhcmUuc3RhcnRDdXJzb3IueTtcclxuXHRcdFx0Ly8gXHRjb250ZXh0LnN0cm9rZVRleHQodGV4dCwgMTUsIDY1KTtcclxuXHRcdFx0Ly8gXHRjb250ZXh0LmZpbGxUZXh0KHRleHQsIDE1LCA2NSk7XHJcblx0XHRcdC8vIFx0dGV4dCA9IFwiZGlzdC46IFwiICsgX2Rpc3RhbmNlO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuc3Ryb2tlVGV4dCh0ZXh0LCAxNSwgODApO1xyXG5cdFx0XHQvLyBcdGNvbnRleHQuZmlsbFRleHQodGV4dCwgMTUsIDgwKTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyB2YXIgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuXHRcdFx0Ly8gaW1hZ2Uuc3JjID0gXCJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUNBQUFBQWdDQVlBQUFCemVucjBBQUFBQm1KTFIwUUFBQUFBQUFENVE3dC9BQUFCaUVsRVFWUll3KzJXd1VyRFFCQkEzOVRZcEZVSUZKUmE4Q3FrbitIVlgrak5teWRQZnBzSTZsLzBBenoxVkZ1cVprT3Q0eUd6TmFsNk1va2lmVEFrdTJHVGw5bGxkK0NYRVl1V1hRRVVlTE5ySXdUQW5ockFQckJiRUtxVmxrVUlNQndPVWRVRjBER3gyaVZhd0k0WG1FNm5YbUxlbElTZit3REFPZGU0UkZCc1pGbkdaaVpFSkFaUzRKVWFGbVpKd0RtM3ZtOUtJdGpzY002dFJacVErQ1FRUlZHcFhiZEVTU0NLSXNJd0xJbjBlajJBMmlSS0F2N2pXWll4R0F3QUdJL0hwUUVtMFFWV2xRdDQwalNsMysrdi8xNUVMb0ZuWUdGUktWM2dXRlUxam1PL0hWK3BxaVpKb2ttUytMNFQ0QWlJZ1loOEQva3gvaVVLTUp2TkVKRUw0QmJ5QlZoTWpHVWhCWlpVdEFoYjlxS2xwWG9FWEFPUEluSSttVXlBOVFKOHNERXJLcHAvTDdBQ01oRTVBMjZBR1RBSDdyL0lRcHVLVWw4a0lKL1Rqa1hiMmdmQVNBc0FoL2E4TXFRUUhyVy83SkRYQnFma0orWUxjQWM4WVZOV2xjQjMvUUg1TVIyYXdCTElMRloxQy9obnZtQVJQa3ExUnN1MUxWdTIvRTlzVzkveU4zZ0h4QmpHZ3ZwRjBvMEFBQUFBU1VWT1JLNUNZSUk9XCI7XHJcblx0XHRcdC8vIGltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQvLyAgICAgY29udGV4dC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIDMwLCAzMCk7XHJcblx0XHRcdC8vIFx0JCgnI21hdCcpLmNzcyh7Y3Vyc29yIDogJ3VybChcXCcnICsgY2FudmFzLnRvRGF0YVVSTCgpICsgJ1xcJyksIHBvaW50ZXInfSk7XHJcblx0XHRcdC8vIH07XHJcblx0XHQvLyB9XHJcblxyXG5cdFx0dmFyIF9kaXN0YW5jZSA9IHNoYXJlLnN0YXJ0Q3Vyc29yID8gTWF0aC5zcXJ0KE1hdGguc3FyKHggLSBzaGFyZS5zdGFydEN1cnNvci54KSArIE1hdGguc3FyKHkgLSBzaGFyZS5zdGFydEN1cnNvci55KSkgOiAwO1xyXG5cclxuICAgIFx0dmFyIF9kZWNrID0gbWFpbi5nZXRFbGVtZW50QnlJZChzaGFyZS5kcmFnRGVja1swXS5jYXJkLnBhcmVudCk7XHJcblx0ICAgIGZvcih2YXIgaSBpbiBzaGFyZS5kcmFnRGVjaykge1xyXG5cdCAgICBcdHZhciBfcG9zaXRpb24gPSBfZGVjay5wYWRkaW5nKHNoYXJlLmRyYWdEZWNrW2ldLmluZGV4KTtcclxuXHQgICAgXHR2YXIgX3BhcmFtcyA9IHtcclxuXHQgICAgXHRcdGxlZnQgICAgICA6IChfcG9zaXRpb24ueCArICh4IC0gc2hhcmUuc3RhcnRDdXJzb3IueCkpICsgJ3B4JyxcclxuXHQgICAgXHRcdHRvcCAgICAgICA6IChfcG9zaXRpb24ueSArICh5IC0gc2hhcmUuc3RhcnRDdXJzb3IueSkpICsgJ3B4JyxcclxuXHQgICAgXHRcdC8vIHRyYW5zZm9ybSA6ICdyb3RhdGUoMGRlZyknLFxyXG5cdCAgICBcdFx0ekluZGV4ICAgIDogdG9wX3pfaW5kZXggKyAoaXwwKVxyXG5cdCAgICBcdH1cclxuXHQgICAgXHQvLyBPcGVyYXRpb25zIHdpdGggRE9NXHJcblx0ICAgIFx0JChzaGFyZS5kcmFnRGVja1tpXS5jYXJkLmRvbUVsZW1lbnQpLmNzcyhfcGFyYW1zKTtcclxuXHQgICAgfVxyXG5cclxuXHJcblx0ICAgIHZhciBjdXJzb3JNb3ZlID0ge1xyXG5cdCAgICBcdGRpc3RhbmNlICAgICA6IF9kaXN0YW5jZSxcclxuXHQgICAgXHRkaXJlY3Rpb24gICAgOiB7XHJcblx0XHQgICAgXHR4ICAgICA6IHggLSBzaGFyZS5zdGFydEN1cnNvci54LC8vICgrKSByaWd0aCAvICgtKSBsZWZ0XHJcblx0XHQgICAgXHR5ICAgICA6IHkgLSBzaGFyZS5zdGFydEN1cnNvci55LC8vICgrKSBkb3duICAvICgtKSB1cFxyXG5cdFx0ICAgIFx0cmlnaHQgOiB4ID4gc2hhcmUuc3RhcnRDdXJzb3IueCxcclxuXHRcdCAgICBcdGxlZnQgIDogeCA8IHNoYXJlLnN0YXJ0Q3Vyc29yLngsXHJcblx0XHQgICAgXHRkb3duICA6IHkgPiBzaGFyZS5zdGFydEN1cnNvci55LFxyXG5cdFx0ICAgIFx0dXAgICAgOiB5IDwgc2hhcmUuc3RhcnRDdXJzb3IueVxyXG5cdCAgICBcdH0sXHJcblx0ICAgIFx0bGFzdFBvc2l0aW9uIDoge1xyXG5cdCAgICBcdFx0eCA6IHgsXHJcblx0ICAgIFx0XHR5IDogeVxyXG5cdCAgICBcdH0sXHJcblx0ICAgIFx0ZGVja1Bvc2l0aW9uIDoge1xyXG5cdCAgICBcdFx0eCA6IChfcG9zaXRpb24ueCArICh4IC0gc2hhcmUuc3RhcnRDdXJzb3IueCkpLFxyXG5cdCAgICBcdFx0eSA6IChfcG9zaXRpb24ueSArICh5IC0gc2hhcmUuc3RhcnRDdXJzb3IueSkpXHJcblx0ICAgIFx0fVxyXG5cdCAgICB9XHJcblx0ICAgIFxyXG5cdCAgICBtYWluLnRpcHNNb3ZlKHttb3ZlRGVjayA6IHNoYXJlLmRyYWdEZWNrLCBjdXJzb3JNb3ZlIDogY3Vyc29yTW92ZX0pO1xyXG5cclxuXHQgICAgLy8kKCcjJyArIGRyYWdfZWwuaWQpLmNzcyh7ZGlzcGxheTogJ25vbmUnfSk7XHJcblx0ICAgIC8qL3ZhciBfZG9wID0gZG9jdW1lbnQuZWxlbWVudEZyb21Qb2ludCh4LCB5KVxyXG5cdCAgICBpZihfZG9wKSB7XHJcblx0ICAgIFx0Ly9jb25zb2xlLmxvZygnRFJBRzonLCBfZG9wLmlkKTtcclxuXHQgICAgfS8qL1xyXG5cdCAgICAvKi8kKCcjJyArIGRyYWdfZWwuaWQpLmNzcyh7XHJcblx0ICAgICAgICBsZWZ0IDogKCAoeHwwKSAtIChkcmFnX2VsLmN1cnNvci54fDApICsgKGRyYWdfZWwuZWwueHwwKSApICsgJ3B4JyxcclxuXHQgICAgICAgIHRvcCAgOiAoICh5fDApIC0gKGRyYWdfZWwuY3Vyc29yLnl8MCkgKyAoZHJhZ19lbC5lbC55fDApICkgKyAncHgnLFxyXG5cdCAgICAgICAgZGlzcGxheTogJ2Jsb2NrJ1xyXG5cdCAgICB9KTsvKi9cclxuXHR9XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdHZhciBjZW5kID0gZnVuY3Rpb24odGFyZ2V0LCB4LCB5KSB7XHJcblxyXG5cdCAgICBpZighc2hhcmUuZHJhZ0RlY2sgfHwgIXNoYXJlLnN0YXJ0Q3Vyc29yKSByZXR1cm47XHJcblxyXG4gICAgXHR2YXIgX2RlY2sgPSBtYWluLmdldEVsZW1lbnRCeUlkKHNoYXJlLmRyYWdEZWNrWzBdLmNhcmQucGFyZW50KTtcclxuICAgIFx0dmFyIF9wb3NpdGlvbiA9IF9kZWNrLnBhZGRpbmcoc2hhcmUuZHJhZ0RlY2tbMF0uaW5kZXgpO1xyXG5cclxuXHQgICAgdmFyIGN1cnNvck1vdmUgPSB7XHJcblx0ICAgIFx0ZGlzdGFuY2UgICAgIDogTWF0aC5zcXJ0KE1hdGguc3FyKHggLSBzaGFyZS5zdGFydEN1cnNvci54KSArIE1hdGguc3FyKHkgLSBzaGFyZS5zdGFydEN1cnNvci55KSksXHJcblx0ICAgIFx0ZGlyZWN0aW9uICAgIDoge1xyXG5cdFx0ICAgIFx0eCAgICAgOiB4IC0gc2hhcmUuc3RhcnRDdXJzb3IueCwvLyAoKykgcmlndGggLyAoLSkgbGVmdFxyXG5cdFx0ICAgIFx0eSAgICAgOiB5IC0gc2hhcmUuc3RhcnRDdXJzb3IueSwvLyAoKykgZG93biAgLyAoLSkgdXBcclxuXHRcdCAgICBcdHJpZ2h0IDogeCA+IHNoYXJlLnN0YXJ0Q3Vyc29yLngsXHJcblx0XHQgICAgXHRsZWZ0ICA6IHggPCBzaGFyZS5zdGFydEN1cnNvci54LFxyXG5cdFx0ICAgIFx0ZG93biAgOiB5ID4gc2hhcmUuc3RhcnRDdXJzb3IueSxcclxuXHRcdCAgICBcdHVwICAgIDogeSA8IHNoYXJlLnN0YXJ0Q3Vyc29yLnlcclxuXHQgICAgXHR9LFxyXG5cdCAgICBcdGxhc3RQb3NpdGlvbiA6IHtcclxuXHQgICAgXHRcdHggOiB4LFxyXG5cdCAgICBcdFx0eSA6IHlcclxuXHQgICAgXHR9LFxyXG5cdCAgICBcdGRlY2tQb3NpdGlvbiA6IHtcclxuXHQgICAgXHRcdHggOiAoX3Bvc2l0aW9uLnggKyAoeCAtIHNoYXJlLnN0YXJ0Q3Vyc29yLngpKSxcclxuXHQgICAgXHRcdHkgOiAoX3Bvc2l0aW9uLnkgKyAoeSAtIHNoYXJlLnN0YXJ0Q3Vyc29yLnkpKVxyXG5cdCAgICBcdH1cclxuXHQgICAgfVxyXG5cclxuXHQgICAgJCh0YXJnZXQpLmhpZGUoKTtcclxuXHQgICAgdmFyIF9kb3AgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KHgsIHkpO1xyXG5cdCAgICAkKHRhcmdldCkuc2hvdygpO1xyXG5cdCAgICAvLyBpZihfZG9wKSB7XHJcbiAgICBcdG1haW4uTW92ZShzaGFyZS5kcmFnRGVjaywgX2RvcCwgY3Vyc29yTW92ZSk7XHJcblx0ICAgIC8vIH1cclxuXHJcblx0ICAgIHNoYXJlLmRyYWdEZWNrID0gc2hhcmUuc3RhcnRDdXJzb3IgPSBudWxsO1xyXG5cclxuXHR9XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcblxyXG5cdGRvY3VtZW50Lm9ubW91c2Vkb3duID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0aWYoZS5idXR0b24gIT0gMCkgcmV0dXJuO1xyXG5cdCAgICBjZG93bihlLnRhcmdldCwgZS5jbGllbnRYLCBlLmNsaWVudFkpXHJcblx0fVxyXG5cdGRvY3VtZW50Lm9ubW91c2Vtb3ZlID0gZnVuY3Rpb24oZSkge1xyXG5cdCAgICBjbW92ZShlLmNsaWVudFgsIGUuY2xpZW50WSlcclxuXHR9XHJcblx0ZG9jdW1lbnQub25tb3VzZXVwID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0Ly8gaWYoZS5idXR0b24gIT0gMCkgcmV0dXJuO1xyXG5cdCAgICBjZW5kKGUudGFyZ2V0LCBlLmNsaWVudFgsIGUuY2xpZW50WSlcclxuXHR9XHJcblxyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbihlKSB7XHJcblx0ICAgIC8vIGUucHJldmVudERlZmF1bHQoKVxyXG5cdCAgICBjZG93bihlLnRhcmdldCwgZS50b3VjaGVzWzBdLmNsaWVudFgsIGUudG91Y2hlc1swXS5jbGllbnRZKVxyXG5cdH0sIGZhbHNlKTtcclxuXHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XHJcblx0XHRpZihzaGFyZS5zdGFydEN1cnNvcikgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdCAgICBjbW92ZShlLnRvdWNoZXNbMF0uY2xpZW50WCwgZS50b3VjaGVzWzBdLmNsaWVudFkpXHJcblx0fSwgZmFsc2UpO1xyXG5cdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgZnVuY3Rpb24oZSkge1xyXG5cdCAgICAvLyBlLnByZXZlbnREZWZhdWx0KClcclxuXHQgICAgY2VuZChlLmNoYW5nZWRUb3VjaGVzWzBdLnRhcmdldCwgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xyXG5cdH0sIGZhbHNlKTtcclxufTtcblxuXG4vKiogV0VCUEFDSyBGT09URVIgKipcbiAqKiBleHRlbnNpb25zL0RyYWdORHJvcC5qc1xuICoqLyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKG1haW4sIHNoYXJlKSB7XHJcblx0XHJcblx0c2hhcmUuZm9yY2VNb3ZlID0gZnVuY3Rpb24oYSkgey8vIHsnZnJvbScsICd0bycsIGRlY2tbXX1cclxuXHJcblx0XHQvLyBjb25zb2xlLmxvZygnZm9yY2VNb3ZlJywgYSk7XHJcblxyXG5cdFx0dmFyIF93YXJuID0gZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKGluZGV4LCAnSW5jb3JyZWN0IG1vdmUuJyArIChzaGFyZS5kZWJ1Z0xvZyA/ICcnIDogJyAodXNlIGRlYnVnTG9nIDogdHJ1ZSBpbiBmaWVsZCBwYXJhbWV0ZXJzIGZvciBkZXRhaWxzKScpKTtcclxuXHRcdFx0Ly8gaWYoc2hhcmUuZGVidWdMb2cgPT0gdHJ1ZSkge2NvbnNvbGUubG9nKCdBcmd1bWVudHM6JywgYSwgaW5kZXgpO31cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0aWYoIWEuZnJvbSB8fCAhYS50byB8fCAhYS5kZWNrKSB7XHJcblx0XHRcdF93YXJuKDEpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoIHR5cGVvZiBhLmZyb20gIT0gJ3N0cmluZycgfHwgdHlwZW9mIGEudG8gIT0gJ3N0cmluZycpIHtcclxuXHRcdFx0X3dhcm4oMik7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZighYS5kZWNrLmxlbmd0aCkgcmV0dXJuO1xyXG5cdFx0XHJcblx0XHR2YXIgX2Zyb20gPSBtYWluLkRlY2soYS5mcm9tKTtcclxuXHRcdHZhciBfdG8gICA9IG1haW4uRGVjayhhLnRvKTtcclxuXHJcblx0XHRpZighX2Zyb20gfHwgIV90bykge193YXJuKDMpO3JldHVybjt9XHJcblx0XHRcclxuXHRcdHZhciBfY2hlY2sgPSB0cnVlO1xyXG5cdFx0dmFyIF9mcm9tX2RlY2sgPSBfZnJvbS5nZXRDYXJkcygpO1xyXG5cdFx0XHJcblx0XHRmb3IodmFyIGkgaW4gX2Zyb21fZGVjaykge1xyXG5cdFx0XHRcclxuXHRcdFx0aWYoaSA+PSBfZnJvbV9kZWNrLmxlbmd0aCAtIGEuZGVjay5sZW5ndGgpIHtcclxuXHRcdFx0XHR2YXIgX2lkID0gaSAtIChfZnJvbV9kZWNrLmxlbmd0aHwwKSArIChhLmRlY2subGVuZ3RofDApO1xyXG5cdFx0XHRcdGlmKGEuZGVja1tfaWRdICYmIF9mcm9tX2RlY2tbaV0ubmFtZSAhPSBhLmRlY2tbX2lkXSkge1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coaSwgX2lkLCBfZnJvbV9kZWNrLCBfZnJvbV9kZWNrW2ldLm5hbWUsIGEuZGVja1tfaWRdKVxyXG5cdFx0XHRcdFx0X2NoZWNrID0gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmKF9jaGVjaykge1xyXG5cdFx0XHR2YXIgX3BvcCA9IF9mcm9tLlBvcChhLmRlY2subGVuZ3RoKTtcclxuXHRcdFx0X3RvLlB1c2goX3BvcCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRfd2Fybig0KTtcclxuXHRcdH1cclxuXHJcblx0XHRfZnJvbS5SZWRyYXcoKTtcclxuXHRcdF90byAgLlJlZHJhdygpO1xyXG5cdFx0XHJcblx0XHQvL2Zvcih2YXIgaSA9IGRlY2subGVuZ3RoO2k7aSAtPSAxKSB7XHJcblx0XHQvL1x0X3RvLnB1c2goX3RvLmdldENhcmRzKVxyXG5cdFx0Ly99XHJcblxyXG5cdFx0c2hhcmUuY2hlY2tUaXBzKCk7XHJcblxyXG5cdH07Ly8uYmluZChtYWluKTtcclxuXHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9mb3JjZU1vdmUuanNcbiAqKi8iLCIndXNlIHN0cmljdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihtYWluLCBzaGFyZSkge1xyXG5cdFxyXG5cdHZhciBzaHVmZmxlID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdC8vIGNvbnNvbGUubG9nKCdTSFVGRkxFOicsIGEsIHR5cGVvZiBhKTtcclxuICAgIFxyXG5cdCAgICBmb3IodmFyIGosIHgsIGkgPSBhLmxlbmd0aDsgaTsgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGkpLCB4ID0gYVstLWldLCBhW2ldID0gYVtqXSwgYVtqXSA9IHgpIHt9XHJcblx0ICAgIC8qdmFyIHkgPSAwLCB4ID0gMTtcclxuXHQgICAgZm9yKGkgaW4gYSkge1xyXG5cdCAgICAgICAgaWYoeCA+IDEzKSB7XHJcblx0ICAgICAgICAgICAgeCA9IDE7XHJcblx0ICAgICAgICAgICAgeSArPSAxO1xyXG5cdCAgICAgICAgfVxyXG5cdCAgICAgICAgYVtpXS55ID0geTtcclxuXHQgICAgICAgIGFbaV0ueCA9IHg7XHJcblx0ICAgICAgICB4ICs9IDFcclxuXHQgICAgfSovXHJcblx0ICAgIHJldHVybiBhO1xyXG5cdH1cclxuXHJcblx0bWFpbi5kZWNrR2VuZXJhdG9yID0gZnVuY3Rpb24oYSkge1xyXG5cclxuXHRcdHZhciBkZWZhdWx0X3R5cGUgPSAnYWxsJztcclxuXHJcblx0XHR2YXIgZGVmYXVsdF9zaHVmZmxlID0gZmFsc2U7XHJcblx0XHR2YXIgbWF4X2l0ZXJhdGlvbnMgPSAxMDtcclxuXHJcblx0XHR2YXIgdHlwZSAgICAgICAgPSBhICYmIGEudHlwZSAgICAgICAmJiB0eXBlb2YgYS50eXBlICAgICAgID09ICdzdHJpbmcnICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYS50eXBlICAgICAgIDogZGVmYXVsdF90eXBlO1xyXG5cdFx0dmFyIF9pdGVyYXRpb25zID0gYSAmJiBhLml0ZXJhdGlvbnMgJiYgdHlwZW9mIGEuaXRlcmF0aW9ucyA9PSAnbnVtYmVyJyAmJiBhLml0ZXJhdGlvbnMgPCBtYXhfaXRlcmF0aW9ucyA/IGEuaXRlcmF0aW9ucyA6IDE7XHJcblx0XHR2YXIgX3NodWZmbGUgICAgPSBhICYmIGEuc2h1ZmZsZSAgICAmJiB0eXBlb2YgYS5zaHVmZmxlICAgID09ICdib29sZWFuJyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gYS5zaHVmZmxlICAgIDogZGVmYXVsdF9zaHVmZmxlO1xyXG5cclxuXHRcdHZhciBnZW5UeXBlID0gZnVuY3Rpb24oX2NhcmRzQ29sb3JzLCBfY2FyZHNSYW5rcykge1xyXG5cdFx0XHR2YXIgX2RlY2sgPSBbXTtcclxuXHRcdFx0Zm9yKHZhciBjIGluIF9jYXJkc0NvbG9ycykge1xyXG5cdFx0XHRcdGZvcih2YXIgciBpbiBfY2FyZHNSYW5rcykge1xyXG5cdFx0XHRcdFx0X2RlY2sucHVzaChfY2FyZHNDb2xvcnNbY10gKyBfY2FyZHNSYW5rc1tyXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBfZGVjaztcclxuXHRcdH1cclxuXHRcdHZhciBfcmFua3MgPSBzaGFyZS5jYXJkc1JhbmtTO1xyXG5cdFx0aWYoYSAmJiBhLnJhbmtzKSB7XHJcblx0XHRcdF9yYW5rcyA9IFtdXHJcblx0XHRcdGZvcihpIGluIGEucmFua3MpIHtcclxuXHRcdFx0XHRpZihzaGFyZS5jYXJkc1JhbmtTLmluZGV4T2YoYS5yYW5rc1tpXS50b1N0cmluZygpKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRfcmFua3MucHVzaChhLnJhbmtzW2ldLnRvU3RyaW5nKCkpXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciBnZW5UeXBlcyA9IHtcclxuXHRcdFx0YWxsICAgIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoc2hhcmUuY2FyZHNTdWl0cywgX3JhbmtzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YmxhY2sgIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gc2hhcmUuY2FyZENvbG9ycy5ibGFjaztcclxuXHRcdFx0XHRyZXR1cm4gZ2VuVHlwZShfY2FyZHNTdWl0cywgX3JhbmtzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0cmVkICAgIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gc2hhcmUuY2FyZENvbG9ycy5yZWQ7XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoX2NhcmRzU3VpdHMsIF9yYW5rcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGJsYWNrX2FuZF9yZWQgIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gW1xyXG5cdFx0XHRcdFx0c2hhcmUuY2FyZENvbG9ycy5yZWRbKE1hdGgucmFuZG9tKCkgKiBzaGFyZS5jYXJkQ29sb3JzLnJlZC5sZW5ndGgpfDBdLCBcclxuXHRcdFx0XHRcdHNoYXJlLmNhcmRDb2xvcnMuYmxhY2tbKE1hdGgucmFuZG9tKCkgKiBzaGFyZS5jYXJkQ29sb3JzLmJsYWNrLmxlbmd0aCl8MF1cclxuXHRcdFx0XHRdO1xyXG5cdFx0XHRcdHJldHVybiBnZW5UeXBlKF9jYXJkc1N1aXRzLCBfcmFua3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRoX29ubHkgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHR2YXIgX2NhcmRzU3VpdHMgPSBbJ2gnXTtcclxuXHRcdFx0XHRyZXR1cm4gZ2VuVHlwZShfY2FyZHNTdWl0cywgX3JhbmtzKTtcclxuXHRcdFx0fSwgXHJcblx0XHRcdGRfb25seSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBfY2FyZHNTdWl0cyA9IFsnZCddO1xyXG5cdFx0XHRcdHJldHVybiBnZW5UeXBlKF9jYXJkc1N1aXRzLCBfcmFua3MpO1xyXG5cdFx0XHR9LCBcclxuXHRcdFx0Y19vbmx5IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gWydjJ107XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoX2NhcmRzU3VpdHMsIF9yYW5rcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHNfb25seSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBfY2FyZHNTdWl0cyA9IFsncyddO1xyXG5cdFx0XHRcdHJldHVybiBnZW5UeXBlKF9jYXJkc1N1aXRzLCBfcmFua3MpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRvbmVfcmFua19vbmx5IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIF9jYXJkc1N1aXRzID0gW3NoYXJlLmNhcmRzQ29sb3JzWyhNYXRoLnJhbmRvbSgpICogc2hhcmUuY2FyZHNDb2xvcnMubGVuZ3RoKXwwXV07XHJcblx0XHRcdFx0cmV0dXJuIGdlblR5cGUoX2NhcmRzU3VpdHMsIF9yYW5rcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIF9kZWNrID0gW107XHJcblx0XHRcclxuXHRcdGZvcig7X2l0ZXJhdGlvbnMgPiAwO19pdGVyYXRpb25zIC09IDEpIHtcclxuXHRcdFx0X2RlY2sgPSBfZGVjay5jb25jYXQoZ2VuVHlwZXNbdHlwZV0oKSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYoX3NodWZmbGUpIHtcclxuXHRcdFx0X2RlY2sgPSBzaHVmZmxlKF9kZWNrKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gX2RlY2s7XHJcblxyXG5cdH0uYmluZChtYWluKTtcclxuXHJcbn07XG5cblxuLyoqIFdFQlBBQ0sgRk9PVEVSICoqXG4gKiogZXh0ZW5zaW9ucy9kZWNrR2VuZXJhdG9yLmpzXG4gKiovIl0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQ3RDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBUUE7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBd0JBO0FBQ0E7QUFDQTs7QUFBQTtBQUNBOzs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBOzs7Ozs7QUMzREE7QUFDQTs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBRkE7OztBQUxBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUF2Q0E7QUE2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFoREE7QUFrREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBVkE7QUFDQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBSEE7QUFGQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBREE7QUFiQTtBQUNBO0FBcUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBOzs7QUExR0E7QUFDQTtBQWdIQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBOztBQURBO0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBSEE7QUFEQTtBQU9BO0FBUEE7QUFEQTtBQURBO0FBYUE7QUFmQTtBQUNBO0FBaUJBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTs7QUFEQTs7QUFBQTtBQUNBO0FBTUE7O0FBRUE7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7O0FBREE7QUFBQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7O0FBVEE7QUFnQkE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQURBO0FBT0E7QUFDQTtBQVJBO0FBZkE7QUFoTEE7QUFDQTtBQTBNQTs7Ozs7O0FDN01BO0FBQ0E7Ozs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7O0FBSEE7QUFNQTtBQURBO0FBQ0E7O0FBTkE7QUFDQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtB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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRkE7QUFLQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBTEE7QUFKQTtBQUZBO0FBRkE7QUFGQTtBQUpBO0FBSEE7O0FBSEE7QUFBQTs7Ozs7OztBQ0pBO0FBQ0E7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFOQTtBQVFBO0FBQ0E7QUFEQTtBQUdBO0FBREE7QUFHQTtBQUhBO0FBS0E7QUFDQTtBQURBO0FBUkE7O0FBUEE7QUFDQTtBQXFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQTNCQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBa0NBO0FBQ0E7OztBQUdBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBVkE7QUFBQTtBQUNBO0FBa0NBO0FBQ0E7O0FBRUE7QUFDQTtBQURBO0FBSEE7QUFDQTtBQU9BO0FBQ0E7O0FBRUE7QUFDQTtBQURBO0FBSEE7QUFDQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7OztBQUxBO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUE3QkE7QUFrQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQXJDQTtBQUNBO0FBMENBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUFOQTtBQS9DQTtBQUNBO0FBZ0VBOztBQUVBO0FBQ0E7QUFEQTtBQUZBO0FBQ0E7QUFNQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBREE7QUFNQTtBQUNBO0FBQ0E7QUFGQTtBQU5BO0FBRkE7QUFDQTtBQWNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTkE7QUFDQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7Ozs7O0FBQ0E7O0FBRUE7QUFBQTtBQUFBO0FBQ0E7O0FBSEE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQVBBO0FBQ0E7QUFTQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFQQTtBQUNBOzs7QUFyQkE7QUFDQTtBQWlDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFEQTtBQUNBOzs7QUFQQTtBQUNBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFKQTtBQUNBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQU5BO0FBVUE7QUFEQTtBQUNBOzs7Ozs7QUFWQTtBQUNBOzs7QUFEQTtBQUNBO0FBdUJBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQVBBO0FBdEJBO0FBQ0E7O0FBeEJBO0FBQUE7OztBQWhDQTtBQUNBO0FBZ0dBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBSEE7QUFDQTtBQTZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFKQTs7QUFGQTtBQUFBO0FBQ0E7QUFZQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFkQTtBQUNBO0FBbUJBO0FBQ0E7Ozs7Ozs7Ozs7O0FBakZBO0FBQ0E7OztBQWhHQTtBQUNBO0FBZ01BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFkQTtBQUNBO0FBbUJBO0FBQ0E7QUFDQTs7QUE3QkE7OztBQUFBO0FBQUE7QUFDQTs7O0FBaE1BO0FBd09BO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBOztBQUVBO0FBRkE7QUFDQTtBQUlBOztBQUVBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBOztBQUVBO0FBRkE7QUEzUEE7QUFDQTtBQThQQTs7Ozs7O0FDalFBO0FBQ0E7Ozs7O0FBQ0E7QUFDQTtBQUNBOzs7OztBQUlBO0FBQ0E7O0FBREE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUZBO0FBRkE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFKQTtBQUNBO0FBTUE7QUFDQTtBQUNBOzs7OztBQWpEQTtBQUFBO0FBRkE7QUFBQTtBQTREQTs7Ozs7O0FDOURBO0FBQ0E7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOzs7Ozs7Ozs7OztBQUpBO0FBQUE7QUFDQTtBQWlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBREE7QUFLQTtBQVBBO0FBU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFEQTtBQUZBO0FBQ0E7QUFRQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBSUE7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBRkE7QUFuQ0E7QUFDQTtBQXdDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBakZBO0FBcEJBO0FBQ0E7QUF3R0E7OzsiLCJzb3VyY2VSb290IjoiIn0=