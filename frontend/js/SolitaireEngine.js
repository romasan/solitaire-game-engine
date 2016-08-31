var SolitaireEngine =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// common
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _inputs = __webpack_require__(4);
	
	var _inputs2 = _interopRequireDefault(_inputs);
	
	var _move = __webpack_require__(53);
	
	var _move2 = _interopRequireDefault(_move);
	
	var _forceMove = __webpack_require__(21);
	
	var _forceMove2 = _interopRequireDefault(_forceMove);
	
	var _domManager = __webpack_require__(56);
	
	var _domManager2 = _interopRequireDefault(_domManager);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _winCheck = __webpack_require__(54);
	
	var _winCheck2 = _interopRequireDefault(_winCheck);
	
	var _history = __webpack_require__(27);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _deckGenerator = __webpack_require__(67);
	
	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);
	
	__webpack_require__(68);
	
	__webpack_require__(69);
	
	__webpack_require__(70);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.event = _event2.default;
	
	// import debug   from 'debug';
	
	// var debug = null;
	// if(dev) {
	// 	debug = require('debug');
	// }
	
	// styles DOM
	
	
	// init
	
	exports.options = _defaults2.default;
	exports.winCheck = _winCheck2.default.hwinCheck;
	exports.generator = _deckGenerator2.default;
	
	var firstInit = true;
	
	exports.init = function (gameConfig) {
	
		_event2.default.dispatch('gameInit', { firstInit: firstInit });
	
		if (firstInit) {
			firstInit = false;
		}
	
		var _field = (0, _field3.default)(gameConfig);
	
		_event2.default.dispatch('gameInited');
	
		exports.Redraw = function (data) {
			_field.Redraw(data);
		};
	};
	
	// dev <-- process.env.MODE == 'dev'
	if (true) {
		var debug = __webpack_require__(71);
		exports.debug = debug.default;
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// export default new function() {
	var shareClass = function () {
		function shareClass() {
			_classCallCheck(this, shareClass);
	
			this._data = {};
		}
	
		_createClass(shareClass, [{
			key: 'get',
			value: function get(name) {
				if (typeof this._data[name] != "undefined") {
					// TODO решить наконец проблему, 
					// почему Object.assign не работает после babel-я
	
					_event2.default.dispatch('shareGet:' + name, this._data[name]);
					return this._data[name];
				} else {
					return null;
				}
			}
		}, {
			key: 'set',
			value: function set(name, data, forceClone) {
	
				if (typeof name == "string") {
	
					if (typeof forceClone == "boolean" && forceClone) {
	
						this._data[name] = Object.assign({}, data);
					} else {
	
						_event2.default.dispatch('shareChange:' + name, {
							from: this._data[name],
							to: data
						});
	
						this._data[name] = data;
	
						_event2.default.dispatch('shareSet:' + name, data);
					}
					// event.dispatch('shareSet', {name : _data});
				} else if (name instanceof Object && typeof data == "undefined") {
	
					for (var _name in name) {
						this._data[_name] = name[_name];
					}
					// event.dispatch('shareSet', name);
				} else {
	
					console.warn('Error share.set:', name, data);
				}
			}
		}, {
			key: 'getAll',
			value: function getAll() {
				return this._data;
			}
		}]);
	
		return shareClass;
	}();
	
	exports.default = new shareClass();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var events = {};
	
	exports.default = new function () {
	
		// this.on = 
		this.listen = function (name, callback) {
			if (typeof name != 'string' || typeof callback != 'function') return;
			if (events[name]) {
				events[name].push(callback);
			} else {
				events[name] = [callback];
			}
		};
	
		// this.do =
		this.dispatch = function (name, data) {
	
			if (events[name]) {
				for (var i in events[name]) {
					events[name][i](data);
				}
			}
		};
	
		// this.one function(name, data) {};
	}();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
	
		// Theme ---------------------------------------------------------------------------------
	
		// theme               : {
		// 	name          : 'alternative_theme',
		// 	spriteTexture : true,
		//     textureSuits  : ['d', 'c', 'h', 's']
		// },
	
		pref: {
			field: "default_field", // 0
			face: "alternative_face", // 1
			back: "default_back" // 0
			// empty : 1
		},
	
		stepType: 'default',
	
		themes: {
			field: ["default_field", "alternative_field"],
			face: ["default_face", "alternative_face"],
			back: ["default_back", "alternative_back" //,
			// "red_back",
			// "blue_back"
			]
			// empty : [
			// 	"default_empty",
			// 	"alternative_empty"
			// ]
		},
	
		// Tips ----------------------------------------------------------------------------------
	
		showTips: true,
		showTipsDestination: false,
		showTipPriority: false,
		canMoveFlip: false,
	
		tipsParams: {
			hideOnEmpty: false,
			excludeHomeGroups: true
		},
	
		// Field ---------------------------------------------------------------------------------
	
		zoom: 1.0,
	
		locale: "ru",
	
		animation: true,
		animationTime: 600, // ms.
	
		inputParams: {
			doubleClick: false
		},
	
		// Group
	
		flip: null, // param for deck
		actions: null, // param for deck
	
		// Deck ----------------------------------------------------------------------------------
	
		can_move_flip: false,
		showSlot: true,
		autohide: false,
	
		paddingType: 'none',
		flip_type: 'none',
	
		takeRules: ['onlytop'],
		putRule: 'any',
	
		moveDistance: 0,
	
		padding_y: 0,
		padding_x: 0,
		flip_padding_y: 0, //5,
		flip_padding_x: 0, //20,
		move_distance: 10,
		debugLabels: false,
	
		startZIndex: 100,
		topZIndex: 900,
	
		// afterStep           : false,// Ждать действия после элементарного хода
	
		// Card ----------------------------------------------------------------------------------
	
		card: {
			width: 71,
			height: 96,
	
			suits: ['h', 'd', 'c', 's'],
			// suitindexes : [ 1,   2,   3,   4 ],
			colors: {
				red: ['h', 'd'],
				black: ['c', 's']
			},
	
			ranks: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
			values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
			ranks36: ['1', '6', '7', '8', '9', '10', 'j', 'q', 'k']
		}
	
		// Actions defaults ----------------------------------------------------------------------
	
		// actions : {
		// 	twindeck : {
		// 		cardCount : 3
		// 	}
		// }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// var drag_el = null;
	_share2.default.set('dragDeck', null);
	_share2.default.set('startCursor', null);
	
	var _inputUndoRedo = function _inputUndoRedo() {
	
		var _dragDeck = _share2.default.get('dragDeck');
		if (_dragDeck && _dragDeck[0] && _dragDeck[0].card && _dragDeck[0].card.parent) {
	
			var _deck = _addDeck2.default.getDeckById(_dragDeck[0].card.parent);
			if (_deck) {
				_deck.Redraw();
			}
		}
	
		_share2.default.set('dragDeck', null);
		_share2.default.set('startCursor', null);
	
		_common2.default.curUnLock();
	};
	
	_event2.default.listen('undo', function () {
		_inputUndoRedo();
	});
	
	_event2.default.listen('redo', function () {
		_inputUndoRedo();
	});
	
	// -------------------------------------------------------------------------------------------------------------
	
	var cdown = function cdown(target, x, y) {
	
		_share2.default.set('dragDeck', null);
		_share2.default.set('startCursor', null);
	
		// var _startCursor = share.get('startCursor'),
		//     _dragDeck    = share.get('dragDeck');
		// if(_dragDeck || _startCursor) return;
	
		if (_common2.default.isCurLock()) {
			return;
		}
	
		// if (target.className.split(' ').indexOf('animated') >= 0) {
		//     return;
		// }
	
		if (target.className.split(' ').indexOf('slot') >= 0) {
	
			var _id = target.id,
			    _deck = _common2.default.getElementById(_id);
			if (_deck) {
				_event2.default.dispatch('click', _deck);
			}
			// _deck.runActions();
		}
	
		if (target.className.split(' ').indexOf('draggable') >= 0) {
	
			var _id = target.id,
			    _card = _id ? _common2.default.getElementById(_id) : null,
			    _parent = _card && _card.parent ? _card.parent : null,
			    _deck = _parent ? _addDeck2.default.getDeckById(_parent) : null;
	
			if (_deck) {
				_event2.default.dispatch('click', _deck);
			}
	
			// _deck.runActions();
	
			// TODO
			// в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются
	
			var _dragDeck = _deck ? _deck.Take(_id) : null;
	
			_share2.default.set('dragDeck', _dragDeck);
	
			if (_dragDeck) {
	
				_share2.default.set('startCursor', { x: x, y: y });
	
				// ???
				_tips2.default.tipsDestination({ currentCard: _card });
			}
		}
	};
	
	// -------------------------------------------------------------------------------------------------------------
	
	var cmove = function cmove(x, y) {
	
		if (_common2.default.isCurLock()) {
			return;
		}
	
		var _startCursor = _share2.default.get('startCursor'),
		    _dragDeck = _share2.default.get('dragDeck');
	
		if (!_dragDeck || !_startCursor) return;
	
		var _distance = _startCursor ? Math.sqrt(_common2.default.sqr(x - _startCursor.x) + _common2.default.sqr(y - _startCursor.y)) : 0;
		// console.clear();
		console.log(x - _startCursor.x, y - _startCursor.y);
	
		var _deck = _common2.default.getElementById(_dragDeck[0].card.parent);
	
		var _position = _deck.padding(_dragDeck[_dragDeck.length - 1].index);
	
		_event2.default.dispatch('dragDeck', {
			x: x, y: y,
			_dragDeck: _dragDeck,
			_startCursor: _startCursor,
			_deck: _deck
		});
	
		var cursorMove = {
			distance: _distance,
			direction: {
				x: x - _startCursor.x, // (+) rigth / (-) left
				y: y - _startCursor.y, // (+) down  / (-) up
				right: x > _startCursor.x,
				left: x < _startCursor.x,
				down: y > _startCursor.y,
				up: y < _startCursor.y
			},
			lastPosition: { x: x, y: y },
			deckPosition: {
				x: _position.x + (x - _startCursor.x),
				y: _position.y + (y - _startCursor.y)
			}
		};
	
		_tips2.default.tipsMove({
			moveDeck: _dragDeck,
			cursorMove: cursorMove
		});
	};
	
	// -------------------------------------------------------------------------------------------------------------
	
	var cend = function cend(target, x, y, dbclick) {
	
		if (_common2.default.isCurLock()) {
			return;
		}
	
		var _startCursor = _share2.default.get('startCursor'),
		    _dragDeck = _share2.default.get('dragDeck');
	
		if (!_dragDeck || !_startCursor) return;
	
		var _deck = _common2.default.getElementById(_dragDeck[0].card.parent);
	
		var _position = _deck.padding(_dragDeck[0].index);
		var _distance = Math.sqrt(_common2.default.sqr(x - _startCursor.x) + _common2.default.sqr(y - _startCursor.y));
		console.log('>>> distance:', _distance, x - _startCursor.x, y - _startCursor.y);
		var cursorMove = {
			distance: _distance,
			dbclick: !!dbclick,
			direction: {
				x: x - _startCursor.x, // (+) rigth / (-) left
				y: y - _startCursor.y, // (+) down  / (-) up
				right: x > _startCursor.x,
				left: x < _startCursor.x,
				down: y > _startCursor.y,
				up: y < _startCursor.y
			},
			lastPosition: { x: x, y: y },
			deckPosition: {
				x: _position.x + (x - _startCursor.x),
				y: _position.y + (y - _startCursor.y)
			}
		};
	
		_share2.default.set('lastCursorMove', cursorMove, true);
	
		_event2.default.dispatch('hideCard', target);
		var _dop = document.elementFromPoint(x, y);
		_event2.default.dispatch('showCard', target);
		// if(_dop) {
	
		// Move(_dragDeck, _dop, cursorMove);
		_event2.default.dispatch('Move', {
			moveDeck: _dragDeck,
			to: _dop,
			cursorMove: cursorMove
		});
		// }
	
		// event.dispatch('redrawDeckIndexes', _deck);
	
		_share2.default.set('dragDeck', null);
		_share2.default.set('startCursor', null);
	};
	
	// -------------------------------------------------------------------------------------------------------------
	try {
	
		document.onmousedown = function (e) {
			if (e.button !== 0) {
				return;
			}
			cdown(e.target, e.clientX, e.clientY);
		};
	
		document.onmousemove = function (e) {
			cmove(e.clientX, e.clientY);
		};
	
		document.onmouseup = function (e) {
			cend(e.target, e.clientX, e.clientY);
		};
	
		document.ondblclick = function (e) {
			cdown(e.target, e.clientX, e.clientY);
			cend(e.target, e.clientX, e.clientY, true);
			_common2.default.curUnLock();
		};
	
		document.addEventListener('touchstart', function (e) {
			// e.preventDefault()
			cdown(e.target, e.touches[0].clientX, e.touches[0].clientY);
		}, false);
	
		document.addEventListener('touchmove', function (e) {
	
			if (_share2.default.startCursor) {
				e.preventDefault();
			}
	
			cmove(e.touches[0].clientX, e.touches[0].clientY);
		}, false);
	
		document.addEventListener('touchend', function (e) {
			// e.preventDefault()
			cend(e.changedTouches[0].target, e.changedTouches[0].clientX, e.changedTouches[0].clientY);
		}, false);
	} catch (e) {}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _history = __webpack_require__(27);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _drawPreferences = __webpack_require__(48);
	
	var _drawPreferences2 = _interopRequireDefault(_drawPreferences);
	
	var _preferencesEvents = __webpack_require__(50);
	
	var _preferencesEvents2 = _interopRequireDefault(_preferencesEvents);
	
	var _defaultPreferences = __webpack_require__(52);
	
	var _defaultPreferences2 = _interopRequireDefault(_defaultPreferences);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// event.listen('shareChange:stepType', (e) => {
	// 	console.log('%cshareChange:stepType', 'background-color: green;color: white;', e);
	// });
	
	// event.listen('shareChange:curLockState', (e) => {
	// 	console.log('%cshareChange:curLockState', 'background-color: blue;color: white;', e);
	// });
	
	_event2.default.listen('gameInit', function (e) {
	
		_share2.default.set('stepType', _defaults2.default.stepType);
	
		curUnLock();
	
		if (!e.firstInit) {
			return;
		};
		(0, _drawPreferences2.default)();
		(0, _preferencesEvents2.default)();
	});
	
	_event2.default.listen('gameInited', function () {
		(0, _defaultPreferences2.default)();
	});
	
	_share2.default.set('prevStepType', _defaults2.default.stepType);
	_event2.default.listen('change:stepType', function () {
		_share2.default.set('prevStepType', _share2.default.get('stepType'));
	});
	
	_event2.default.listen('moveEnd', function (e) {
		_tips2.default.checkTips();
	});
	
	_event2.default.listen('actionBreak', function (e) {
		_tips2.default.checkTips();
	});
	
	// event.listen("saveSteps", ()=>{
	// 	share.set('stepType', defaults.stepType);	
	// });
	
	// Lock/Unlock
	
	var sqr = function sqr(i) {
		return i * i;
	};
	
	// --
	
	var _lock = false;
	
	var isLock = function isLock() {
		return _lock;
	};
	
	var lock = function lock() {
		_lock = true;
	};
	_event2.default.listen('lock', lock);
	
	var unlock = function unlock() {
		lock = false;
	};
	_event2.default.listen('unlock', unlock);
	
	// --
	
	var isCurLock = function isCurLock() {
		return _share2.default.get('curLockState');
	};
	
	var curLock = function curLock() {
		// !window.debug_i && (window.debug_i = 0);
		// window.debug_i += 1;
	
		// console.log('curLock');
	
		// if(window.debug_i == 2) {
		// 	throw new Error('z');
		// }
		_share2.default.set('curLockState', true);
	};
	
	var curUnLock = function curUnLock() {
		// console.log('curUnLock');
		_share2.default.set('curLockState', false);
	};
	
	// getters
	
	var getElements = function getElements() {
		return _share2.default.get('elements');
	};
	
	var getElementById = function getElementById(a) {
		var _elements = _share2.default.get('elements');
		return _elements[a];
	};
	
	var getElementsByName = function getElementsByName(name, type) {
		var response = [];
		var _elements = _share2.default.get('elements');
		for (var i in _elements) {
			if (_elements[i].name && typeof _elements[i].name == 'string' && _elements[i].name == name) {
				if (type && typeof _elements[i].type == 'string') {
					if (type && _elements[i].type == type) {
						response.push(_elements[i]);
					} else {
						response.push(_elements[i]);
					}
				} else {
					response.push(_elements[i]);
				}
			}
		}
		return response;
	};
	
	// validator
	
	var validateCardName = function validateCardName(name, nolog) {
	
		if (typeof name != 'string') {
			console.warn('Warning: validate name must have string type', name);
			// throw new Error('z');
			return false;
		}
	
		var suit = name.slice(0, 1),
		    rank = name.slice(1, 3),
		    color = null,
		    value = _defaults2.default.card.values[_defaults2.default.card.ranks.indexOf(rank)];
		for (var colorName in _defaults2.default.card.colors) {
			if (_defaults2.default.card.colors[colorName].indexOf(suit) >= 0) {
				color = colorName;
			}
		}
	
		if (_defaults2.default.card.suits.indexOf(suit) >= 0 && _defaults2.default.card.ranks.indexOf(rank) >= 0) {
			return {
				suit: suit,
				rank: rank,
				color: color,
				value: value,
				name: name
			};
		} else {
			console.warn('Warning: validate name:', name, '- incorrect');
			// throw new Error();
			return false;
		}
	};
	
	// ID generator
	
	var _id = 0,
	    genId = function genId() {
		return _id++;
	};
	
	// --
	
	_share2.default.set('animation', _defaults2.default.animation);
	
	var animationOn = function animationOn() {
		_share2.default.set('animation', true);
	};
	
	var animationDefault = function animationDefault() {
		_share2.default.set('animation', _defaults2.default.animation);
	};
	
	var animationOff = function animationOff() {
		_share2.default.set('animation', false);
	};
	
	_event2.default.listen('newGame', function (e) {
		// TODO
		// из-за отключения анимации 
		// на время восстановления ходов из истории приходится костылять
		// и везде где нужна анимация ставить common.animationDefault();
		// надо исправить когда из истории можно будет получить
		// не только историю ходов
		animationOff();
	});
	
	// --
	
	_event2.default.listen('historyReapeater', function (e) {
		if (e) {
			_share2.default.set('noRedraw', true);
			_share2.default.set('noTips', true);
		} else {
			_share2.default.set('noRedraw', false);
			var _field = (0, _field3.default)();
			_field.Redraw();
			_share2.default.set('noTips', false);
			_tips2.default.checkTips();
		}
	});
	
	// --
	
	var deckInGroups = function deckInGroups(deck, groups) {
		for (var groupName in groups) {
			Group.Group(groupName).hasDeck();
		}
	};
	
	// event.listen('makeStep', function(e) {
	// share.set('animation', defaults.animation);
	// });
	
	_share2.default.set('stepType', _defaults2.default.stepType);
	
	// let clearInput = ()=>{
	//     share.set('dragDeck',    null);
	//     share.set('startCursor', null);
	// 		console.log('clearInput');
	// }
	
	// share.set('lang', defaults.lang);
	
	exports.default = {
		isLock: isLock,
		lock: lock,
		unlock: unlock,
		isCurLock: isCurLock,
		curLock: curLock,
		curUnLock: curUnLock,
		getElements: getElements,
		getElementById: getElementById,
		getElementsByName: getElementsByName,
		validateCardName: validateCardName,
		genId: genId,
		animationOn: animationOn,
		animationOff: animationOff,
		animationDefault: animationDefault,
		deckInGroups: deckInGroups,
		sqr: sqr
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _allToAll = __webpack_require__(7);
	
	var _allToAll2 = _interopRequireDefault(_allToAll);
	
	var _bestTip = __webpack_require__(8);
	
	var _bestTip2 = _interopRequireDefault(_bestTip);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _showTips = _defaults2.default.showTips;
	
	var tipTypes = ['tip', 'tipTo', 'tipPriority', 'tipToHome'];
	
	var _tips = [];
	
	var getTips = function getTips() {
		return _tips;
	};
	
	var checkTips = function checkTips() {
	
		if (_share2.default.get('noTips')) {
			return false;
		}
	
		_event2.default.dispatch('hideTips');
	
		var _decks = _addDeck2.default.getDecks({ visible: true });
	
		_tips = (0, _allToAll2.default)({
			decks: _decks
		});
	
		if (_tips.length === 0 && _share2.default.get('stepType') == _defaults2.default.stepType) {
	
			_event2.default.dispatch('noTips');
			console.log('GAME OVER (Подсказок больше нет)');
		}
	
		// var _showTips = share.get('showTips')
		if (_showTips) {
	
			var _field = (0, _field3.default)();
			var _homeGroups = _field.homeGroups;
	
			for (var i in _tips) {
	
				// TODO инициализировать "hideTipsInDom" в Field.js 
				if (_tips[i].to.count === 0 && _field.tipsParams.hideOnEmpty || _field.tipsParams.excludeHomeGroups && _homeGroups && _homeGroups.length && _homeGroups.indexOf(_tips[i].from.deck.parent) >= 0) {
					// ?#$%&!
				} else {
	
					_event2.default.dispatch('showTip', {
						el: _tips[i].from.card,
						type: 'tip'
					});
				}
	
				if (_homeGroups.indexOf(_tips[i].to.deck.parent) >= 0) {
					_event2.default.dispatch('showTip', {
						el: _tips[i].from.card,
						type: 'tipToHome'
					});
				}
			}
		}
	};
	
	_event2.default.listen('makeStep', checkTips);
	_event2.default.listen('checkTips', checkTips);
	
	// --------------------------------------------------------
	
	var showTips = function showTips(a) {
		_showTips = true;
		if (a && a.init) return;
		checkTips();
	};
	_event2.default.listen('tipsON', showTips);
	
	var hideTips = function hideTips(a) {
		_showTips = false;
		if (a && a.init) return;
		checkTips();
	};
	_event2.default.listen('tipsOFF', hideTips);
	
	// --------------------------------------------------------
	
	var tipsMove = function tipsMove(a) {
	
		if (!_share2.default.get('showTipPriority')) {
			return;
		}
	
		_event2.default.dispatch('hideTips', { types: ['tipPriority'] });
	
		if (_share2.default.showTipPriority && a && a.moveDeck && a.cursorMove && a.cursorMove.distance && a.cursorMove.distance >= _share2.default.moveDistance) {
	
			var Tip = (0, _bestTip2.default)(a.moveDeck, a.cursorMove);
	
			if (Tip) {
	
				_event2.default.dispatch('showTip', {
					el: Tip.to.deck,
					type: 'tipPriority'
				});
			}
		}
	};
	
	// --------------------------------------------------------
	
	var tipsDestination = function tipsDestination(a) {
	
		if (_share2.default.get('showTipsDestination')) {
	
			_event2.default.dispatch('hideTips');
	
			if (a && a.currentCard && a.currentCard.id) {
				for (var i in _tips) {
					if (_tips[i].from.card.id == a.currentCard.id) {
	
						_event2.default.dispatch('showTip', {
							'el': _tips[i].to.deck,
							'type': 'tipTo'
						});
					}
				}
			}
		}
	};
	
	var checkFrom = function checkFrom(_from) {
	
		for (var i in _tips) {
			if (_tips[i].from.deck.name == _from) {
				return true;
			}
		}
		return false;
	};
	
	var fromTo = function fromTo(_from, _to) {
	
		for (var i in _tips) {
			if (_tips[i].from.deck.name == _from && _tips[i].to.deck.name == _to) {
				return true;
			}
		}
		return false;
	};
	
	exports.default = {
		tipTypes: tipTypes,
		getTips: getTips,
		checkTips: checkTips,
		showTips: showTips,
		hideTips: hideTips,
		tipsMove: tipsMove,
		//  tiprFrom       ,// TODO
		checkFrom: checkFrom,
		fromTo: fromTo,
		tipsDestination: tipsDestination
	};

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (a) {
	
		var _moves = [];
	
		// 4)
	
		// если получилось положить карты (с текущими правилами) записываем как возможный ход
		var put = function put(deckIndex_2, deckIndex, cardIndex, _cards) {
	
			var _cards_to = a.decks[deckIndex_2].cards,
			    _card_to = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
	
			_moves.push({
	
				from: {
					deck: a.decks[deckIndex],
					card: _cards[cardIndex], // firstCard of moved deck
					count: _cards.length
					// deckName : a.decks[deckIndex].name
				},
	
				to: {
					deck: a.decks[deckIndex_2],
					lastCard: _card_to,
					count: _cards_to.length
					// deckName : a.decks[deckIndex_2].name
				}
			});
		};
	
		// 3) ^
	
		// пробегаем все остальные колоды и пробуем положить на них то что взяли
		var decksToPut = function decksToPut(_cards, _take, deckIndex, cardIndex) {
	
			for (var deckIndex_2 in a.decks) {
	
				if (deckIndex != deckIndex_2) {
	
					var _put = a.decks[deckIndex_2].Put(_take);
					if (_put) {
						put(deckIndex_2, deckIndex, cardIndex, _cards);
					};
				};
			};
		};
	
		// 2) ^
	
		// выбираем карты из колоды
		// патаемся взять карту
		var cardsInTakeDeck = function cardsInTakeDeck(_cards, deckIndex) {
	
			for (var cardIndex in _cards) {
	
				var _id = _cards[cardIndex].id;
	
				var _take = a.decks[deckIndex].Take(_id);
	
				if (_take) {
					decksToPut(_cards, _take, deckIndex, cardIndex);
				};
			};
		};
	
		// 1) ^
	
		// пробегаем все колоды
		for (var deckIndex in a.decks) {
	
			var _cards = a.decks[deckIndex].cards;
			// each cards in  current deck
			cardsInTakeDeck(_cards, deckIndex);
		};
	
		return _moves;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (moveDeck, cursorMove) {
	
		var _autoTips = [];
	
		// выбрать подсказки для стопки из кторорой взяли карты
		var _tips = _tips3.default.getTips();
		for (i in _tips) {
			if (_tips[i].from.card.id == moveDeck[0].card.id) {
				_autoTips.push(_tips[i]);
			}
		}
	
		if (_autoTips.length == 0) {
			return false;
		}
	
		// move card to closest deck of a possible move
		var _min_distance = -1,
		    _tip_index = 0,
		    _in_direction_count = 0;
	
		// Приоритет для homeGroups
		var _field = (0, _field3.default)();
		var _homeGroups = _field.homeGroups;
	
		if (_homeGroups) {
			var _tips = [];
			for (var i in _homeGroups) {
				for (var t in _autoTips) {
					if (_autoTips[t].to.deck.parent == _homeGroups[i]) {
						_tips.push(_autoTips[t]);
					}
				}
			}
			if (_tips.length) _autoTips = _tips;
		}
	
		// вариантов несколько
		if (_autoTips.length >= 2) {
	
			for (var i in _autoTips) {
	
				var center_from = {
					x: cursorMove.deckPosition.x + _defaults2.default.card.width,
					y: cursorMove.deckPosition.y + _defaults2.default.card.height
				};
	
				var _destination_deck_last_card_position = _autoTips[i].to.deck.padding(_autoTips[i].to.deck.cards.length);
				var center_to = {
					x: _destination_deck_last_card_position.x + _defaults2.default.card.width,
					y: _destination_deck_last_card_position.y + _defaults2.default.card.height
				};
	
				_autoTips[i].distance = Math.sqrt(_common2.default.sqr(center_from.x - center_to.x) + _common2.default.sqr(center_from.y - center_to.y));
				_autoTips[i].inDirection = false;
				if (cursorMove.direction.x > 0 && center_to.x > center_from.x || cursorMove.direction.x < 0 && center_to.x < center_from.x) {
					_autoTips[i].inDirection = true;
					_in_direction_count += 1;
				}
			}
	
			for (var i in _autoTips) {
	
				if (_min_distance == '-1') {
					if (_in_direction_count == 0) {
						_min_distance = _autoTips[i].distance;
					} else {
						if (_autoTips[i].inDirection) {
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
						if (_autoTips[i].inDirection) {
							_min_distance = _autoTips[i].distance;
							_tip_index = i;
						}
					}
				}
			}
		}
	
		return _autoTips[_tip_index];
	};
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _tips2 = __webpack_require__(6);
	
	var _tips3 = _interopRequireDefault(_tips2);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// module.exports = function(main, share) {
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _addGroup = __webpack_require__(10);
	
	var _addGroup2 = _interopRequireDefault(_addGroup);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _addAutoSteps = __webpack_require__(45);
	
	var _addAutoSteps2 = _interopRequireDefault(_addAutoSteps);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var _field = null;
	
	// _params = {},
	// _elements = {};
	
	// TODO
	// class Field {}
	var Field = function Field(data) {
	
		if (!data) {
			return false;
		}
	
		_common2.default.unlock();
	
		if (data && _field) {
	
			_field.clear();
		} else {
			_share2.default.set('elements', {});
		}
	
		var a = null;
		try {
			a = Object.assign({}, data);
		} catch (e) {
			a = data;
			console.warn('Field input params is not JSON, maybe the rules are wrong.');
		}
	
		this.homeGroups = a.homeGroups ? a.homeGroups : [];
	
		// Tips
	
		if (typeof a.showTips == 'boolean' && a.showTips) {
			_tips2.default.showTips({ init: true });
		} else {
			_tips2.default.hideTips({ init: true });
		}
	
		_share2.default.set('stepType', _defaults2.default.stepType);
	
		_share2.default.set('showTipsDestination', typeof a.showTipsDestination == 'boolean' ? a.showTipsDestination : _defaults2.default.showTipsDestination);
		_share2.default.set('showTipPriority', typeof a.showTipPriority == 'boolean' ? a.showTipPriority : _defaults2.default.showTipPriority);
	
		_share2.default.set('moveDistance', a.moveDistance && typeof a.moveDistance == 'number' ? a.moveDistance : _defaults2.default.moveDistance);
	
		// check Win
	
		_share2.default.set('winCheck', a.winCheck);
	
		if (a.winCheck && a.winCheck.callback && typeof a.winCheck.callback == 'function') {
			winCheckCallback = a.winCheck.callback;
		}
	
		// extension: winCheckMethods
	
		if (a.saveStep && typeof a.saveStep == 'function') {
			saveStepCallback = a.saveStep;
		}
	
		// parameters and values
	
		_share2.default.set('zoom', a.zoom && typeof a.zoom == 'number' ? a.zoom : _defaults2.default.zoom);
	
		this.tipsParams = {};
	
		for (var tipParamName in _defaults2.default.tipsParams) {
			this.tipsParams[tipParamName] = a.tipsParams && typeof a.tipsParams[tipParamName] != "undefined" ? a.tipsParams[tipParamName] : _defaults2.default.tipsParams[tipParamName];
		}
	
		this.inputParams = {};
		for (var inputParamName in _defaults2.default.inputParams) {
			this.inputParams[inputParamName] = a.inputParams && typeof a.inputParams[inputParamName] != "undefined" ? a.inputParams[inputParamName] : _defaults2.default.inputParams[inputParamName];
		}
	
		var _can_move_flip = a.can_move_flip && typeof a.can_move_flip == 'boolean' ? a.can_move_flip : _defaults2.default.canMoveFlip;
		_share2.default.set('can_move_flip', _can_move_flip);
	
		_share2.default.set('debugLabels', a.debugLabels && typeof a.debugLabels == 'boolean' ? a.debugLabels : _defaults2.default.debugLabels);
	
		if (a.startZIndex && typeof a.startZIndex == 'number') {
			_share2.default.set('start_z_index', a.startZIndex);
		}
	
		if (a.autoSteps) {
			this.autoSteps = (0, _addAutoSteps2.default)(a.autoSteps);
		}
	
		if (typeof a.lang == "string") {
			_share2.default.set('lang', a.lang);
		};
	
		// --
	
		this.Draw = function (data) {
	
			_share2.default.set('noRedraw', true);
	
			if (data) {
				a = Object.assign({}, data);
			}
	
			if (!a) return;
	
			if (a.groups) {
				for (var groupName in a.groups) {
					a.groups[groupName].name = groupName;
					_addGroup2.default.addGroup(a.groups[groupName]);
				}
			}
	
			if (a.decks) {
				for (var e in a.decks) {
					_addDeck2.default.addDeck(a.decks[e]);
				}
			}
	
			// fill elements in field
			if (a.fill) {
	
				var _decks = _addDeck2.default.getDecks(),
				    _fill = Object.assign([], a.fill);
	
				for (; _fill.length;) {
					for (var deckId in _decks) {
						if (_fill.length) {
							var _card = _fill.shift();
							_decks[deckId].Fill([_card]);
						}
					}
				}
			}
	
			_share2.default.set('noRedraw', false);
			this.Redraw();
	
			_tips2.default.checkTips();
	
			_event2.default.dispatch('newGame');
			_common2.default.unlock();
		};
	};
	
	Field.prototype.clear = function () {
	
		var _elements = _share2.default.get('elements');
		for (var i in _elements) {
			if (_elements[i].type == 'deck') {
				_elements[i].clear();
				_elements[i] = null;
			} else if (_elements[i].type == 'group') {
				_elements[i] = null;
			}
		}
		_share2.default.set('elements', {});
	};
	
	Field.prototype.Redraw = function (data) {
	
		var a = null;
	
		if (data) {
	
			try {
				a = Object.assign({}, data);
			} catch (e) {
				a = data;
				console.warn('Field.Redraw input params is not JSON, can\'t clone');
			}
	
			for (var _groupName in a.groups) {
	
				var _group = _addGroup2.default.Group(_groupName);
				if (_group) {
					_group.Redraw(a.groups[_groupName]);
				}
			}
	
			for (var i in a.decks) {
	
				var _deck = _addDeck2.default.Deck(a.decks[i].name);
				if (_deck) {
					_deck.Redraw(a.decks[i]);
				}
			}
		} else {
			var _decks = _addDeck2.default.getDecks();
			for (var i in _decks) {
				_decks[i].Redraw();
			}
		}
	};
	
	var _fieldExport = function _fieldExport(data) {
	
		if (data && _field) {
			// TODO THIS
	
			_field.clear();
			_field.Draw(data);
		}
	
		if (data && !_field) {
	
			_field = new Field(data);
			_event2.default.dispatch('initField', { a: data });
			_field.Draw();
		};
	
		// this = _field
		return _field;
	};
	
	// _fieldExport.prototype.Redraw = function() {
	// 	_field.Redraw();
	// };
	
	exports.default = _fieldExport;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _groupFill = __webpack_require__(32);
	
	var _groupFill2 = _interopRequireDefault(_groupFill);
	
	var _groupRedraw = __webpack_require__(33);
	
	var _groupRedraw2 = _interopRequireDefault(_groupRedraw);
	
	var _groupGenerator = __webpack_require__(34);
	
	var _groupGenerator2 = _interopRequireDefault(_groupGenerator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var params = {
		"paddingType": { type: "any" },
		"flip": { type: "any" },
		"showSlot": { type: "any" },
		"takeRules": { type: "any" },
		"putRules": { type: "any" },
		"fillRule": { type: "any" },
		"autoHide": { type: "any" },
		"paddingX": { type: "any" },
		"paddingY": { type: "any" },
		"flipPaddingX": { type: "any" },
		"flipPaddingY": { type: "any" },
		"actions": { type: "any" }
		//  "afterStep"    : {type: "boolean"}
	};
	
	var groupClass = function () {
		function groupClass(a, _id) {
			_classCallCheck(this, groupClass);
	
			this.type = 'group';
	
			var id = _id;
	
			this.getId = function () {
				return id;
			};
	
			this.name = a.name && typeof a.name == 'string' ? a.name : 'name_' + id;
	
			this.position = {
				x: a.position && a.position.x && typeof a.position.x == 'number' ? a.position.x : 0,
				y: a.position && a.position.y && typeof a.position.y == 'number' ? a.position.y : 0
			};
	
			this.placement = a.placement ? {
				x: a.placement.x ? a.placement.x : 0,
				y: a.placement.y ? a.placement.y : 0
			} : null;
	
			this.decks = {};
	
			// сохраняем атрибуты чтобы прокинуть их колодам
			this.parameters = {};
			for (var paramName in params) {
				if (params[paramName].type == "any") {
					this.parameters[paramName] = a[paramName] ? a[paramName] : _defaults2.default[paramName];
				} else if (params[paramName].type == "boolean") {
					this.parameters[paramName] = typeof a[paramName] == "boolean" ? a[paramName] : _defaults2.default[paramName];
				}
			};
	
			this.deckIndex = [];
		}
	
		// --------------------------------------------------------------------
	
		// Add deck to group
	
	
		_createClass(groupClass, [{
			key: 'addDeck',
			value: function addDeck(a) {
	
				if (!a) return;
	
				if (!a.position) {
					a.position = {
						'x': 0,
						'y': 0
					};
				}
	
				// сортировка элементов в группе по заданному индексу и порядку добавления
	
				// if(!a.position.x) { a.position.x = 0; }
				// if(!a.position.y) { a.position.y = 0; }
	
				if (!a.parent) a.parent = this.name;
	
				a.parentPosition = {
					x: this.position.x,
					y: this.position.y
				};
	
				// расставляем колоды в группе
				// 1 приоретет отдаётся параметру groupIndex
				// остальные вставляются в промежутки или добавляются в конец
				var _index = 0;
	
				if (a.groupIndex && typeof a.groupIndex == 'number' && this.deckIndex[a.groupIndex - 1] && decks[this.deckIndex[a.groupIndex - 1]].this.deckIndex == a.this.deckIndex) {
					console.warn('Warning: duplicate groupIndex', a.groupIndex, 'changed to null');
					a.groupIndex = null;
				}
	
				if (a.groupIndex && typeof a.groupIndex == 'number') {
	
					if (this.deckIndex[a.groupIndex - 1]) {
	
						for (; typeof this.deckIndex[_index] != 'undefined'; _index += 1) {}
	
						if (placement) {
							var _index = this.deckIndex[a.groupIndex - 1];
							var _elements = _share2.default.get('elements');
							if (placement.x) {
								_elements[_index].x(this.position.x + (placement.x + _defaults2.default.card.width) * _index);
							}
							if (placement.y) {
								_elements[_index].y(this.position.y + (placement.y + _defaults2.default.card.width) * _index);
							}
							_share2.default.set('elements', _elements);
						}
	
						this.deckIndex[_index] = this.deckIndex[a.groupIndex - 1];
						this.deckIndex[a.groupIndex - 1] = true;
						_index = a.groupIndex - 1;
					} else {
	
						this.deckIndex[a.groupIndex - 1] = true;
						_index = a.groupIndex - 1;
					}
				} else {
					for (; typeof this.deckIndex[_index] != 'undefined'; _index += 1) {};
					this.deckIndex[_index] = true;
				}
	
				// смещаем координаты колод относиткльно координад группы
				if (this.placement) {
	
					if (this.placement.x) {
						a.position.x = (this.placement.x + _defaults2.default.card.width) * _index;
					}
					if (this.placement.y) {
						a.position.y = (this.placement.y + _defaults2.default.card.height) * _index;
					}
				}
	
				// прокидываем некоторые атрибуты всем колодам группы (у атрибутов заданных колоде приоритет выше)
				for (var paramName in params) {
	
					if (params[paramName].type == "any") {
						if (this.parameters[paramName] && typeof a[paramName] == "undefined") {
							a[paramName] = this.parameters[paramName];
						};
					} else if (params[paramName].type == "boolean") {
						if (typeof this.parameters[paramName] != "undefined" && typeof a[paramName] == "undefined") {
							a[paramName] = this.parameters[paramName];
						}
					}
				};
	
				var _el = _addDeck2.default.addDeck(a);
	
				this.deckIndex[_index] = _el.getId();
				this.decks[_el.getId()] = _el;
			}
	
			// Fill group
	
		}, {
			key: 'Fill',
			value: function Fill(cardNames) {
				_groupFill2.default.call(this, cardNames);
			}
		}, {
			key: 'getDeckById',
			value: function getDeckById(id) {
				return this.decks[id];
			}
		}, {
			key: 'getDecksByName',
			value: function getDecksByName(name) {
				var _decks = {};
				for (var d in this.decks) {
					if (this.decks[d].name == name) {
						_decks[d] = decks[d];
					}
				}
				return _decks;
			}
	
			// Get decks from group
	
		}, {
			key: 'getDecks',
			value: function getDecks(a) {
				var _decks = [];
				for (var i in this.decks) {
					if (a && a.visible) {
						if (this.decks[i].visible) {
							_decks.push(this.decks[i]);
						}
					} else {
						_decks.push(this.decks[i]);
					}
				}
				return _decks;
			}
	
			// Redraw group
	
		}, {
			key: 'Redraw',
			value: function Redraw(_a) {
				_groupRedraw2.default.call(this, _a);
			}
		}, {
			key: 'hasDeck',
			value: function hasDeck(deckName) {
				var has = false;
				for (var deckId in decks) {
					if (decks[deckId].name == deckName) {
						has = true;
					}
				}
				return has;
			}
		}]);
	
		return groupClass;
	}();
	
	// -----------------------------------------------------------------------------------------------------------------------
	
	var addGroup = function addGroup(a) {
	
		if (!a) return false;
		var _id = 'group_' + _common2.default.genId();
	
		var _el_group = new groupClass(a, _id);
	
		if (a.decks) {
	
			if (typeof a.decks == 'number') {
				a.decks = {
					"generator": {
						"type": "count",
						"count": a.decks
					}
				};
			};
	
			if (a.decks.generator) {
	
				if (a.decks.generator.type) {
	
					if (_groupGenerator2.default[a.decks.generator.type]) {
	
						a.decks = _groupGenerator2.default[a.decks.generator.type].call(_el_group, a.decks.generator);
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
			for (var to in a.decks) {
	
				for (var relId in a.decks[to].relations) {
	
					var _relation = Object.assign({}, a.decks[to].relations[relId]);
	
					for (var from in a.decks) {
	
						if (a.decks[from].name == _relation.to) {
							_relation.to = null;
							_relation.from = a.decks[to].name;
							a.decks[from].relations.push(_relation);
						}
					}
				}
			}
	
			for (var d in a.decks) {
				_el_group.addDeck(a.decks[d]);
			};
		};
	
		var _elements = _share2.default.get('elements');
		_elements[_id] = _el_group;
		_share2.default.set('elements', _elements);
	
		// fill group
		if (a && a.fill) {
	
			var _checkFillDeck = a.fill.length;
			if (_checkFillDeck) {
				_el_group.Fill(a.fill);
			}
		}
	
		return _el_group;
	};
	
	var Group = function Group(name) {
		return _common2.default.getElementsByName(name, 'group')[0];
	};
	
	exports.default = {
		addGroup: addGroup,
		Group: Group
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _flipTypes = __webpack_require__(12);
	
	var _flipTypes2 = _interopRequireDefault(_flipTypes);
	
	var _readyPutRules = __webpack_require__(13);
	
	var _readyPutRules2 = _interopRequireDefault(_readyPutRules);
	
	var _readyTakeRules = __webpack_require__(15);
	
	var _readyTakeRules2 = _interopRequireDefault(_readyTakeRules);
	
	var _fillRules = __webpack_require__(16);
	
	var _fillRules2 = _interopRequireDefault(_fillRules);
	
	var _paddingTypes = __webpack_require__(17);
	
	var _paddingTypes2 = _interopRequireDefault(_paddingTypes);
	
	var _deckActions = __webpack_require__(18);
	
	var _deckActions2 = _interopRequireDefault(_deckActions);
	
	var _deckTake = __webpack_require__(24);
	
	var _deckTake2 = _interopRequireDefault(_deckTake);
	
	var _deckPut = __webpack_require__(25);
	
	var _deckPut2 = _interopRequireDefault(_deckPut);
	
	var _genCardByName2 = __webpack_require__(26);
	
	var _genCardByName3 = _interopRequireDefault(_genCardByName2);
	
	var _addGroup = __webpack_require__(10);
	
	var _addGroup2 = _interopRequireDefault(_addGroup);
	
	var _history = __webpack_require__(27);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _getDecks = __webpack_require__(28);
	
	var _getDecks2 = _interopRequireDefault(_getDecks);
	
	var _getDeckById = __webpack_require__(29);
	
	var _getDeckById2 = _interopRequireDefault(_getDeckById);
	
	var _deckCardNames = __webpack_require__(30);
	
	var _deckCardNames2 = _interopRequireDefault(_deckCardNames);
	
	var _getDeck = __webpack_require__(31);
	
	var _getDeck2 = _interopRequireDefault(_getDeck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var deckClass = function () {
		function deckClass(a, _id) {
			var _this = this;
	
			_classCallCheck(this, deckClass);
	
			if (!a) return false;
	
			this.cards = [];
	
			this.getTopCard = function () {
	
				if (this.cards.length === 0) {
					return false;
				}
				return this.cards[this.cards.length - 1];
			};
	
			// parameters
			this.type = 'deck';
			this.fill = false;
			var id = _id;
	
			this.getId = function () {
				return id;
			};
	
			this.locked = a.locked ? true : false;
	
			var _parent_el = _addGroup2.default.Group(a.parent),
			    _parent_name = _parent_el ? _parent_el.name : 'xname',
			    // ???
			_new_id = _parent_el ? _parent_el.getDecks().length : id;
	
			this.name = a.name && typeof a.name == 'string' ? a.name : _parent_name + '_' + _new_id;
	
			this.visible = a.visible && typeof a.visible == 'boolean' ? a.visible : true; // default true
	
			this.groupIndex = a.groupIndex && typeof a.groupIndex == 'number' ? a.groupIndex : null;
	
			this.parent = a.parent && typeof a.parent == 'string' ? a.parent : 'field';
	
			this.autoHide = a.autoHide && typeof a.autoHide == 'boolean' ? a.autoHide : _defaults2.default.autohide;
	
			// changed parameters
			if (typeof a.showSlot == "undefined") {
				a.showSlot = _defaults2.default.showSlot;
			}
	
			// DOM
			var params = {};
			params.x = 0;
			params.y = 0;
			params.rotate = this.rotate = 0;
			params.padding_y = a.paddingY && typeof a.paddingY == 'number' ? a.paddingY : _defaults2.default.padding_y;
			params.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' ? a.flipPaddingY : _defaults2.default.flip_padding_y;
			params.padding_x = a.paddingX && typeof a.paddingX == 'number' ? a.paddingX : _defaults2.default.padding_x;
			params.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' ? a.flipPaddingX : _defaults2.default.flip_padding_x;
			params.startZIndex = a.startZIndex && typeof a.startZIndex == 'number' ? a.startZIndex : _defaults2.default.startZIndex;
	
			// ------------- FLIP -------------
	
			var flipType = a.flip && typeof a.flip == 'string' ? a.flip : _defaults2.default.flip_type,
			    checkFlip = _flipTypes2.default[flipType];
	
			this.flipCheck = function () {
				for (var i in this.cards) {
					checkFlip(this.cards[i], i | 0, this.cards.length);
				}
				_event2.default.dispatch('redrawDeckFlip', this);
			};
	
			// ------------- PUT -------------
	
			this.putRules = a.putRules ? typeof a.putRules == 'function' ? a.putRules : typeof a.putRules == 'string' ? _readyPutRules2.default[a.putRules] ? _readyPutRules2.default[a.putRules] : _readyPutRules2.default[_defaults2.default.putRule]
			// : typeof a.putRules === 'object' 
			: a.putRules.constructor == Array ? a.putRules : _readyPutRules2.default[_defaults2.default.putRule] : _readyPutRules2.default[_defaults2.default.putRule];
	
			// ------------- TAKE -------------
	
			// можно ли взять карту/стопку
			this.takeRules = a.takeRules;
	
			// ------------- FILL -------------
	
			// var fillRule = (
			// 	a.fillRule 
			//  && typeof a.fillRule == "string" 
			//  && typeof fillRules[a.fillRule] == "function"
			// ) ? fillRules[a.fillRule]
			//   : fillRules['not'];
	
			this.fillRules = null;
	
			if (a.fillRule && !a.fillRules) {
				a.fillRules = [a.fillRule];
			}
	
			if (a.fillRules) {
				this.fillRules = a.fillRules;
			}
	
			// ------------- PADDING -------------
	
			// порядок карт в колоде
			var padding = a.paddingX || a.paddingY ? _paddingTypes2.default.special : a.paddingType ? typeof a.paddingType == 'string' && _paddingTypes2.default[a.paddingType] ? _paddingTypes2.default[a.paddingType] : _paddingTypes2.default.none : _paddingTypes2.default[_defaults2.default.paddingType];
	
			this.padding = function (index) {
				var _padding = padding(params, this.cards[index], index, this.cards.length, this.cards);
				return _padding;
			};
	
			this.actions = [];
	
			if (a.actions) {
				this.actions = a.actions;
				_deckActions2.default.addActions.call(this);
			}
	
			// this.afterStep = a.afterStep;
	
			// ------------ RELATIONS ------------
	
			if (a.relations) {
				this.relations = a.relations;
			} else {
				this.relations = [];
			}
	
			// --
	
			this.tags = a.tags ? a.tags : [];
	
			// --
	
			_event2.default.dispatch('addDeckEl', {
				a: a,
				deck: this,
				params: params
			});
	
			var _callback = function _callback(data) {
	
				// TODO
				// проверять fill только для тех стопок котрые участвовали в Action
	
				if (data.destination.name != _this.name) {
					return;
				}
	
				// console.log('_callback', this.checkFill, this.fillRules);
	
				_this.checkFill();
	
				// var _deck = data.destination;
	
				// if(_deck && !this.fill && this.callback({deck : _deck})) {
				// 	this.deck.fill = true;
				// 	History.add({fill : {
				// 		deck : this.deck.name
				// 	}});
				// 	// event.dispatch('fillDeck', {deck : this.deck});
				// }
			};
			_event2.default.listen('moveDragDeck', _callback);
	
			this.Redraw = function (data) {
	
				_event2.default.dispatch('redrawDeck', {
					deck: this,
					data: data,
					params: params,
					cards: this.cards
				});
			};
		}
	
		// -------------------------------------------------------------------------------------------------
	
		_createClass(deckClass, [{
			key: 'checkFill',
			value: function checkFill() {
	
				if (!this.fill) {
	
					var notFill = true;
	
					for (var ruleName in this.fillRules) {
	
						if (_fillRules2.default[ruleName]) {
							notFill = notFill && !_fillRules2.default[ruleName](this);
						}
					}
	
					this.fill = !notFill;
				}
			}
		}, {
			key: 'Fill',
			value: function Fill(cardNames) {
	
				for (var i in cardNames) {
					this.genCardByName(cardNames[i]);
				}
			}
		}, {
			key: 'clear',
			value: function clear() {
				for (var i in this.cards) {
					_event2.default.dispatch('removeEl', this.cards[i]);
					this.cards[i] = null;
				}
				this.cards = [];
				_event2.default.dispatch('removeEl', this);
			}
		}, {
			key: 'Push',
			value: function Push(deck) {
				// , parentName) {
				for (var i in deck) {
					deck[i].parent = this.getId();
					this.cards.push(deck[i]);
				}
			}
		}, {
			key: 'Pop',
			value: function Pop(count, clearParent) {
	
				if (this.cards.length < count) return false;
	
				var _deck = [];
				for (; count; count -= 1) {
					var _pop = this.cards.pop();
					if (clearParent) _pop.parent = null;
					_deck.push(_pop);
					_deck[_deck.length - 1].parent = null;
				}
				_deck.reverse();
	
				// что делать если вынули все карты
				if (this.autoHide && this.cards.length === 0) {
					this.hide();
				}
	
				this.Redraw();
	
				return _deck;
			}
		}, {
			key: 'Take',
			value: function Take(cardId) {
				return _deckTake2.default.call(this, cardId); // ??? .call(this, attributes);
			}
	
			// проверяем, можем ли положить стопку/карту
			// возвращает true, если согласно правилам сюда можно положить карту
	
		}, {
			key: 'Put',
			value: function Put(putDeck) {
				return _deckPut2.default.call(this, putDeck); //(deckConstructor);
			}
	
			// создать карту
	
		}, {
			key: 'genCardByName',
			value: function genCardByName(name) {
				return _genCardByName3.default.call(this, name);
			}
		}, {
			key: 'hide',
			value: function hide() {
				this.visible = false;
				_history2.default.add({ hideDeck: this.name });
				this.Redraw();
			}
		}, {
			key: 'show',
			value: function show() {
				this.visible = false;
				_history2.default.add({ showDeck: this.name });
				this.Redraw();
			}
		}, {
			key: 'getCardsByName',
			value: function getCardsByName(cardName) {
				var _cards = [];
				for (var i in this.cards) {
					if (this.cards[i].name == cardName) {
						_cards.push(this.cards[i]);
					}
				}
				return _cards;
			}
		}, {
			key: 'Card',
			value: function Card(cardName) {
				return this.getCardsByName(cardName)[0];
			}
		}, {
			key: 'hideCards',
			value: function hideCards() {
				for (var i in this.cards) {
					this.cards[i].visible = false;
					_event2.default.dispatch('hideCard', this.cards[i]);
				}
			}
		}, {
			key: 'showCards',
			value: function showCards() {
				for (var i in this.cards) {
					this.cards[i].visible = true;
					_event2.default.dispatch('showCard', this.cards[i]);
				}
			}
		}, {
			key: 'getCardsNames',
			value: function getCardsNames() {
				var _cardsNames = [];
				for (var i in this.cards) {
					_cardsNames.push(this.cards[i].name);
				}
				return _cardsNames;
			}
		}, {
			key: 'cardsCount',
			value: function cardsCount() {
				return this.cards.length;
			}
		}, {
			key: 'getRelationsByName',
			value: function getRelationsByName(relationName, filter) {
	
				var _relations = [];
	
				for (var i in this.relations) {
					if (this.relations[i].name == relationName) {
	
						if (filter) {
	
							var _checked = 0,
							    _count = 0;
	
							for (var attr in filter) {
								_count += 1;
								if (this.relations[i][attr] == filter[attr]) {
									_checked += 1;
								}
							}
	
							if (_checked == _count) {
								_relations.push(this.relations[i]);
							}
						} else {
	
							_relations.push(this.relations[i]);
						}
					}
				}
	
				return _relations;
			}
		}, {
			key: 'hasTag',
			value: function hasTag(tagName) {
	
				for (var i in this.tags) {
					if (this.tags[i] == tagName) {
						return true;
					}
				}
	
				return false;
			}
		}]);
	
		return deckClass;
	}();
	
	// ------------------------------------------------------------------------------------------------------------------------------------------
	
	var addDeck = function addDeck(a) {
	
		if (!a) return false;
	
		var _id = 'deck_' + _common2.default.genId();
	
		var _a = Object.assign({}, a);
	
		var _el_deck = new deckClass(_a, _id);
	
		// fill deck
		if (a.fill) {
			for (var i in a.fill) {
				if (typeof a.fill[i] == 'string') {
					_el_deck.genCardByName(a.fill[i]);
				}
			}
		}
	
		var _elements = _share2.default.get('elements');
	
		_elements[_id] = _el_deck;
	
		_share2.default.set('elements', _elements);
	
		return _el_deck;
	};
	
	exports.default = {
		addDeck: addDeck,
		Deck: _getDeck2.default,
		getDecks: _getDecks2.default,
		getDeckById: _getDeckById2.default,
		deckCardNames: _deckCardNames2.default
	};

/***/ },
/* 12 */
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
		},
		bee: function bee(card, i, length) {
			card.flip = i == length - 1 ? false : i % 2 == 0 ? true : false;
		}
	};

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _getBeside = __webpack_require__(14);
	
	var _getBeside2 = _interopRequireDefault(_getBeside);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var rpr = {
	
		// Realtions filters
	
		linePrev: function linePrev(a) {
	
			var prev = (0, _getBeside2.default)(a.to).prev;
	
			if (prev) {
	
				a.link = prev.to;
	
				return true;
			}
	
			return false;
		},
	
		lineNext: function lineNext(a) {
	
			var next = (0, _getBeside2.default)(a.to).next;
	
			if (next) {
	
				a.link = next.to;
	
				return true;
			}
	
			return false;
		},
	
		// Internal use
	
		_downupcards: function _downupcards(a) {
	
			if (a.cards.length == 0) return false;
	
			var down = _common2.default.validateCardName(a.cards[a.cards.length - 1].name);
			var up = _common2.default.validateCardName(a.putDeck[0].card.name);
	
			if (!down || !up) return false;
	
			return {
				up: up,
				down: down
			};
		},
	
		_downupranknum: function _downupranknum(a) {
	
			var du = rpr._downupcards(a);
	
			return du ? {
				down: _defaults2.default.card.ranks.indexOf(du.down.rank),
				up: _defaults2.default.card.ranks.indexOf(du.up.rank)
			} : false;
		},
	
		_isFirst: function _isFirst(a, _name) {
	
			if (a.cards.length == 0) {
	
				var _validate = null;
	
				return (_validate = _common2.default.validateCardName(a.putDeck[0].card.name)) && _validate.rank == _name;
			}
	
			return true;
		},
	
		// Rules
	
		striped: function striped(a) {
	
			if (a.cards.length == 0) return true;
	
			var color_A = _common2.default.validateCardName(a.cards[a.cards.length - 1].name).color,
			    color_B = null,
			    _validate = null;
	
			if (_validate = _common2.default.validateCardName(a.putDeck[0].card.name)) {
				color_B = _validate.color;
			}
	
			return color_A != color_B;
		},
	
		firstAce: function firstAce(a) {
	
			// let _rank = defaults.card.ranks[0];
	
			return rpr._isFirst(a, "1");
		},
	
		firstKing: function firstKing(a) {
	
			// let _rank = defaults.card.ranks[defaults.card.ranks.length - 1];
	
			return rpr._isFirst(a, "k");
		},
	
		notForEmpty: function notForEmpty(a) {
	
			return a.cards.length;
		},
	
		onlyEmpty: function onlyEmpty(a) {
	
			return a.cards.length === 0;
		},
	
		oneRank: function oneRank(a) {
	
			if (a.cards.length == 0) return true;
	
			var du = rpr._downupcards(a);
	
			return du && du.up.rank == du.down.rank;
		},
	
		oneSuit: function oneSuit(a) {
	
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
	
					var down = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(a.putDeck[i - 1].card.name).rank),
					    up = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(a.putDeck[i].card.name).rank);
	
					ruleCorrect = ruleCorrect && 1 + down == up;
				};
			};
	
			return ruleCorrect;
		},
	
		descendDeck: function descendDeck(a) {
			//ascend deck by step
	
			if (a.putDeck.length == 1) return true;
	
			var ruleCorrect = true;
	
			for (var i in a.putDeck) {
	
				if (i > 0) {
	
					var down = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(a.putDeck[i - 1].card.name).rank),
					    up = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(a.putDeck[i].card.name).rank);
	
					ruleCorrect = ruleCorrect && down == 1 + up;
				};
			};
	
			return ruleCorrect;
		},
	
		oneRankDeck: function oneRankDeck(a) {
	
			if (a.putDeck.length == 1) return true;
	
			var ruleCorrect = true;
	
			for (var i in a.putDeck) {
	
				if (i > 0) {
	
					var down = _common2.default.validateCardName(a.putDeck[i - 1].card.name).suit,
					    up = _common2.default.validateCardName(a.putDeck[i].card.name).suit;
	
					ruleCorrect = ruleCorrect && down == up;
				}
			};
	
			return ruleCorrect;
		},
	
		ascend: function ascend(a) {
	
			if (a.cards.length == 0) return true;
	
			var da = rpr._downupranknum(a);
	
			return da && da.down < da.up;
		},
	
		descent: function descent(a) {
	
			if (a.cards.length == 0) return true;
	
			var da = rpr._downupranknum(a);
	
			return da && da.down > da.up;
		},
	
		descentOne: function descentOne(a) {
			// one step
	
			if (a.cards.length == 0) return true;
	
			var da = rpr._downupranknum(a);
	
			return da && da.down == 1 + da.up;
		},
	
		ascendOne: function ascendOne(a) {
			// one step
	
			if (a.cards.length == 0) return true;
	
			var da = rpr._downupranknum(a);
	
			return da && 1 + da.down == da.up;
		},
	
		ascdescOne: function ascdescOne(a) {
	
			if (a.cards.length == 0) return true;
	
			var da = rpr._downupranknum(a);
	
			return da && Math.abs(da.down - da.up) == 1;
		},
	
		sum14: function sum14(a) {
	
			if (a.cards.length == 0) return true;
	
			var du = rpr._downupcards(a);
			var _sum = du.down.value + du.up.value;
	
			return _sum == 14;
		},
	
		// TODO rules with params ??? or atom rules
	
		around: function around(a) {
			// {from, putDeck, cards}
	
			if (a.cards.length == 0) return true;
	
			var _around = a.from.deck.getRelationsByName('around', { from: null });
			var _parent = _addDeck2.default.getDeckById(a.cards[0].parent);
	
			for (var i in _around) {
	
				if (_around[i].to == _parent.name) {
					return true;
				}
			}
	
			return false;
		}
	
	};
	
	exports.default = rpr;

/***/ },
/* 14 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (_deck) {
		// {deck}
	
		var prev = _deck.getRelationsByName('beside', {
			from: null,
			type: "prev"
		})[0];
	
		var next = _deck.getRelationsByName('beside', {
			from: null,
			type: "next"
		})[0];
	
		return { prev: prev, next: next };
	};

/***/ },
/* 15 */
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
			return a.cardIndex > 0;
		},
	
		any: function any(a) {
			return true;
		},
	
		onlytop: function onlytop(a) {
	
			return a.cardIndex == a.deckLength - 1;
		}
	
		// TODO rules
	
		// ask : function(a) {
		// 	return true;
		// },
	
		// desc : function(a) {
		// 	return true;
		// }
	};

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _getBeside = __webpack_require__(14);
	
	var _getBeside2 = _interopRequireDefault(_getBeside);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var fr = {
	
		deckLength: function deckLength(e) {
	
			return _defaults2.default.card.ranks.length <= a.deck.cards.length;
		},
	
		not: function not() {
	
			return false;
		},
	
		noMoves: function noMoves(a) {
	
			return !_tips2.default.checkFrom(a.name);
		},
	
		_top: function _top(a) {
			// filter
	
			var _card = e.getTopCard();
			return _card && _common2.default.validateCardName(_card).rank;
		},
	
		topAce: function topAce(e) {
	
			return fr._top() == '1';
		},
	
		topKing: function topKing(e) {
	
			return fr._top() == 'k';
		},
	
		_prev_next_desc_ask: function _prev_next_desc_ask(e, _type, _callback) {
			// filter
	
			var _check = true;
			var _prev = (0, _getBeside2.default)(a.to)[_type];
			var _topCard = e.getTopCard();
	
			for (; _prev && _check;) {
	
				var _deck = _addDeck2.default.Deck(_prev);
				_card = _deck.getTopCard();
	
				_check = _check && _card && _callback(_common2.default.validateCardName(_topCard).value, _common2.default.validateCardName(_card).value | 0);
	
				_topCard = _card;
				_prev = (0, _getBeside2.default)(_deck)[_type];
			}
	
			return _check;
		},
	
		// prevDescOne: (e)=>{
	
		// 	let _check = true;
		// 	let _prev = getBeside(a.to).prev;
		// 	let _topCard = e.getTopCard();
	
		// 	for(;_prev && _check;) {
	
		// 		let _deck = Deck.Deck(_prev);
	
		// 		_card = _deck.getTopCard();
	
		// 		_check = _check && _card && common.validateCardName(_topCard).value == (common.validateCardName(_card).value|0) + 1;
	
		// 		_topCard = _card;
	
		// 		_prev = getBeside(_deck).prev;
		// 	}
	
		// 	return _check;
		// }
	
		prevDescOne: function prevDescOne(e) {
	
			return fr._prev_next_desc_ask(e, 'prev', function (u, d) {
				return u == (d | 0) + 1;
			});
		},
	
		prevAscOne: function prevAscOne(e) {
	
			return fr._prev_next_desc_ask(e, 'prev', function (u, d) {
				return (u | 0) + 1 == d;
			});
		},
	
		nextDescOne: function nextDescOne(e) {
	
			return fr._prev_next_desc_ask(e, 'next', function (u, d) {
				return u == (d | 0) + 1;
			});
		},
	
		nextAscOne: function nextAscOne(e) {
	
			return fr._prev_next_desc_ask(e, 'next', function (u, d) {
				return (u | 0) + 1 == d;
			});
		},
	
		prevDesc: function prevDesc() {
	
			return fr._prev_next_desc_ask(e, 'prev', function (u, d) {
				return u > d;
			});
		},
		prevAsc: function prevAsc() {
	
			return fr._prev_next_desc_ask(e, 'prev', function (u, d) {
				return u < d;
			});
		},
		nextDesc: function nextDesc() {
	
			return fr._prev_next_desc_ask(e, 'next', function (u, d) {
				return u > d;
			});
		},
		nextAsc: function nextAsc() {
	
			return fr._prev_next_desc_ask(e, 'next', function (u, d) {
				return u < d;
			});
		}
	};
	
	exports.default = fr;

/***/ },
/* 17 */
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
	
			// _step   = 180 / 16,
			// _card   = defaults.card,
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
			return _return;
		}
	};

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event2 = __webpack_require__(2);
	
	var _event3 = _interopRequireDefault(_event2);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _twindeckAction = __webpack_require__(19);
	
	var _twindeckAction2 = _interopRequireDefault(_twindeckAction);
	
	var _dealerdeckAction = __webpack_require__(20);
	
	var _dealerdeckAction2 = _interopRequireDefault(_dealerdeckAction);
	
	var _kickAction = __webpack_require__(22);
	
	var _kickAction2 = _interopRequireDefault(_kickAction);
	
	var _stepsAroundAction = __webpack_require__(23);
	
	var _stepsAroundAction2 = _interopRequireDefault(_stepsAroundAction);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Actions
	var _actions = {
		"twindeck": _twindeckAction2.default,
		"dealerdeck": _dealerdeckAction2.default,
		"kick": _kickAction2.default,
		"stepsAround": _stepsAroundAction2.default
	};
	
	// ------------------------------------------------------------------------------------------
	
	var _decksActions = [],
	    _events = [];
	
	var addActionEvent = function addActionEvent(_event) {
	
		_event3.default.listen(_event, function (data) {
	
			for (var i in _decksActions) {
				if (_decksActions[i].event == _event) {
	
					var _actionName = _decksActions[i].action;
	
					var _canRun = _event == 'click' ? data.name == _decksActions[i].deck.name : true;
	
					if (_canRun) {
	
						_actions[_actionName].call(_decksActions[i].deck, {
							actionData: _decksActions[i].deck.actions[_actionName],
							eventData: data,
							eventName: _event
						});
					};
				}
			}
		});
	};
	
	var addActions = function addActions() {
	
		for (var actionName in this.actions) {
	
			if (!this.actions[actionName].event) {
				this.actions[actionName].event = 'click';
			}
	
			if (_actions[actionName]) {
	
				_decksActions.push({
					deck: this,
					event: this.actions[actionName].event,
					action: actionName
				});
	
				if (_events.indexOf(this.actions[actionName].event) < 0) {
					_events.push(this.actions[actionName].event);
					addActionEvent(this.actions[actionName].event);
				}
			} else {
				console.warn('Action', actionName, 'for', this.name, 'not found.');
			};
		}
		autoRunActions(this.actions);
	};
	
	var autoRunActions = function autoRunActions(data) {
		// bind this deck
	
		_common2.default.animationDefault();
	
		for (var actionName in data.actions) {
			if (data.actions[actionName].autorun) {
				if (_actions[actionName]) {
					_actions[actionName].call(data, {
						actionData: data.actions[actionName],
						eventData: null,
						eventName: data.actions[actionName].event
					});
				}
			}
		}
		// Tips.checkTips();
	};
	
	exports.default = {
		addActions: addActions
	};

/***/ },
/* 19 */
/***/ function(module, exports) {

	'use strict';
	
	// import event    from 'event';
	// import defaults from 'defaults';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (e) {
		// TODO переделать
	
		/*
	 	if(e.deck_from.iteration == 0) {
	 		return;
	 	}
	 
	 	var deck_to = Deck.Deck(e.data.to);
	 	
	 	var moveCardsCount = e.data.count && typeof e.data.count == 'number' 
	 		? e.data.count 
	 		: defaults.actions.twindeck.CardsCount;
	 	
	 	// количество оставшихся карт в первой колоде
	 	var deckFromCardsCount = e.deck_from.cards.length;
	 	
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
	 
	 	var _deck = deck_to.Pop(deck_to.cards.length);
	 
	 	// oneStepWay.add('toHide') = Deck.deckCardNames(_deck);
	 	
	 	_deck.reverse();
	 	for(var i in _deck) {
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
	 
	 	// var _deck_from = e.deck_from.cards;
	 	// var _deck_to = deck_to.cards;
	 	
	 	e.deck_from.flipCheck();
	 	deck_to    .flipCheck();
	 	
	 	e.deck_from.Redraw();
	 	deck_to    .Redraw();
	 	
	 	// ------------ STEP ------------
	 
	 	// Step
	 	var _twindeckStep = {
	 		from      : e.deck_from.name,
	 		to        : deck_to    .name,
	 		moveCards : share.deckCardNames(_deck),
	 		iteration : (e.deck_from.iteration|0)
	 	};
	 	
	 	// hiddenCards : share.deckCardNames(e.deck_from.twindeck), 
	 	// cards       : share.deckCardNames(e.deck_from.cards),
	 
	 	History.add(_twindeckStep);
	 	
	 	event.dispatch('makeStep', History.get());
	 	
	 	// ------------------------------
	 
	 	// share.checkTips();
	 
	 	e.deck_from.iteration -= 1;
	 */
	};

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (data) {
		// data.actionData, e
	
		// listen click
		// click is for me (default)
		// if(this.name != data.actionData.name) { return; };
	
		// меняем тип хода
		_share2.default.set('stepType', stepType);
	
		// смотрим остались ли карты
		if (this.cards.length == 0) {
	
			_share2.default.set('stepType', _defaults2.default.stepType);
	
			_event2.default.dispatch('actionBreak');
	
			return;
		}
	
		// карты для раздачи
		var _decks = [];
	
		// to == toGroup ???
		if (data.actionData.toGroup && !data.actionData.to) {
	
			data.actionData.to = data.actionData.toGroup;
	
			// _decks = _decks.concat(Group.Group(e.toGroup).decks);
	
			// var __decks = Group.Group(data.actionData.toGroup).decks;
			// for(var deckIndex in __decks) {
			// 	_decks.push(__decks[deckIndex]);
			// }
		};
	
		// есть куда раздать
		if (data.actionData.to) {
	
			// передали имя
			if (typeof data.actionData.to == "string") {
	
				// ищем элементы с таким именем
				var _elements = _common2.default.getElementsByName(data.actionData.to);
				for (var i in _elements) {
	
					// это группа
					if (_elements[i].type == "group") {
	
						// _decks = _decks.concat(Group.Group(data.actionData.to).decks);
						// var __decks = Group.Group(data.actionData.to).decks;
	
						// берём колоды из группы
						for (var deckIndex in _elements[i].decks) {
							_decks.push(_elements[i].decks[deckIndex]);
						}
					};
	
					// это колода, добавляем её в список
					if (_elements[i].type == "deck") {
						_decks.push(_el);
					};
				}
	
				// передали массив
			} else {
	
				for (var i in data.actionData.to) {
	
					var _elements = _common2.default.getElementsByName(data.actionData.to[i]);
	
					for (var elIndex in _elements) {
	
						if (_elements[elIndex].type == "group") {
							// _decks = _decks.concat(Group.Group(data.actionData.to[i]).decks);
							// var __decks = Group.Group(data.actionData.to[i]).decks;
							for (var deckIndex in _elements[elIndex].decks) {
								_decks.push(_elements[elIndex].decks[deckIndex]);
							}
						};
	
						if (_elements[elIndex].type == "deck") {
							_decks.push(_elements[elIndex]);
						};
					}
				}
			}
		};
	
		// вкл/выкл анимации по умолчанию
		_common2.default.animationDefault();
	
		// флаг, что раздача удалась
		var _makeStep = false;
	
		// пробегаем колоды из списка
		for (var deckId in _decks) {
	
			// берём верхнюю карту
			var _card = this.getTopCard();
	
			// флаг что такой ход возможен
			var _canStep = data.actionData.onlyEmpty ? _decks[deckId].cards.length == 0 : true;
	
			if (_canStep && _card) {
	
				_makeStep = true;
	
				var _cardName = _card.name;
	
				var _callback = function _callback() {
					_event2.default.dispatch('checkTips');
				};
	
				(0, _forceMove2.default)({
					from: this.name,
					to: _decks[deckId].name,
					deck: [_cardName],
					flip: true,
					callback: _callback
				}, true);
	
				_decks[deckId].flipCheck();
				// _decks[deckId].Redraw();
	
				_event2.default.dispatch('addStep', {
					'move': {
						from: this.name,
						to: _decks[deckId].name,
						deck: [_cardName],
						flip: true,
						stepType: _share2.default.get('stepType')
					}
				});
			};
		};
	
		if (_makeStep) {
	
			console.log('-------------------------------------#');
	
			// сохраняем если паздача удалась
			_event2.default.dispatch('saveSteps');
			// event.dispatch('checkTips');
			// if(History.count()) {
			// 	event.dispatch('makeStep', History.get());
			// }
		};
	
		if (data.actionData.dispatch) {
	
			_event2.default.dispatch(data.actionData.dispatch, !_makeStep);
		} else {
			// сохраняем если ничего не вызываем
	
			_share2.default.set('stepType', _defaults2.default.stepType);
		}
	};
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _forceMove = __webpack_require__(21);
	
	var _forceMove2 = _interopRequireDefault(_forceMove);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var stepType = 'dealerdeckStepType';

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var forceMove = function forceMove(a) {
		// {from, to, deck, <flip>, <callback>}
	
		// console.log('forceMove', a);
	
		if (!a.from || !a.to || !a.deck) {
			return;
		}
	
		if (!a.deck.length) return;
	
		var _from = typeof a.from == "string" ? _addDeck2.default.Deck(a.from) : a.from;
	
		var _to = typeof a.to == "string" ? _addDeck2.default.Deck(a.to) : a.to;
	
		if (!_from || !_to || _from.type != "deck" || _to.type != "deck") {
			return;
		}
	
		var _check = true;
		var _from_deck = _from.cards;
	
		for (var i in _from_deck) {
	
			if (i >= _from_deck.length - a.deck.length) {
	
				var _id = i - (_from_deck.length | 0) + (a.deck.length | 0);
	
				if (a.deck[_id] && _from_deck[i].name != a.deck[_id]) {
					_check = false;
				}
			}
		}
	
		if (_check) {
	
			var _pop = _from.Pop(a.deck.length);
	
			// перевернуть карты во время хода
			if (a.flip) {
				for (var _i in _pop) {
					_pop[_i].flip = !_pop[_i].flip;
				}
			}
	
			_to.Push(_pop);
	
			var __pop = [];
			for (var _i2 in _pop) {
				__pop.push({
					card: _pop[_i2]
				});
			}
	
			var moveDragDeckParams = {
				departure: _from,
				destination: _to,
				moveDeck: __pop
			};
	
			if (typeof a.callback == "function") {
				moveDragDeckParams.callback = a.callback;
			}
	
			_event2.default.dispatch('moveDragDeck', moveDragDeckParams);
		} else {
			// _warn(4);
			console.warn("forceMove:Ход невозможен", a);
		}
	};
	
	_event2.default.listen('forceMove', function (e) {
		forceMove(e);
	});
	
	exports.default = forceMove;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (data) {
	
		if (_share2.default.get('stepType') != _defaults2.default.stepType) {
			// console.log('#no_kick 1');
			return false;
		}
	
		if (data.eventData.stepType != _defaults2.default.stepType) {
			return false;
		}
	
		// if(share.get('prevStepType') != defaults.stepType) {
		// 	return false;
		// }
	
		// let _name = null;
		// if(
		// 	data.eventData[0]                            &&
		// 	data.eventData[0].move                       &&
		// 	typeof data.eventData[0].move.to == "string"
		// ) {
		// 	_name = data.eventData[0].move.to;
		// }
	
		// if(
		// 	data.eventData.to                    &&
		// 	typeof data.eventData.to == "string"
		// ) {
		// 	_name = data.eventData.to;
		// }
	
		// if(
		// 	data.eventData.to                         &&
		// 	typeof data.eventData.to != "string"      &&
		// 	typeof data.eventData.to.name == "string"
		// ) {
		// 	_name = data.eventData.to.name;
		// }
	
		if (data.eventData.to.name != this.name) {
			return false;
		}
	
		// console.log('#kick -----------------------------------------');
	
		// console.log('KICK', data, share.get('prevStepType'));
	
		// if(
		// 	data.eventData[0]                         &&
		// 	typeof data.eventData[0].name == "string" &&
		// 	data.eventData[0].name != this.name
		// ) {
		// 	return false;
		// }
	
		_common2.default.animationDefault();
	
		// var _toDeck = Deck.Deck(data.actionData.to);
	
		// let _from = typeof data.eventData.to == "string"
		// 		? Deck.Deck(_name)
		// 		: data.eventData.to
	
		var _from = data.eventData.to,
		    //Deck.Deck(_name),
		_deck = _from.getCardsNames();
	
		var _callback = function _callback() {
	
			_event2.default.dispatch('addStep', {
				"move": {
					from: _from.name,
					to: data.actionData.to,
					deck: _deck,
					flip: true
				}
			});
	
			_event2.default.dispatch('saveSteps');
	
			if (data.actionData.dispatch) {
				_event2.default.dispatch(data.actionData.dispatch);
			}
		};
	
		// TODO interval
		var forceMoveParams = {
			from: _from, // deck
			to: data.actionData.to, // _decks[deckId].name,
			deck: _deck, // [_cardName],
			flip: true, // true
			callback: _callback
		};
	
		// forceMove(forceMoveParams);
		_event2.default.dispatch('forceMove', forceMoveParams);
	
		// if(e.after) {
		// 	_events[e.after].call(this, e);
		// };
	};
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (data) {
		var _this = this;
	
		// {actionData, eventData, eventName}
	
		var _stepType = _share2.default.get('stepType');
		if (_stepType != _defaults2.default.stepType) {
			return;
		};
	
		_share2.default.set('stepType', stepType);
		// stop Drag'n'Drop
		_common2.default.curLock();
	
		var _relations = this.getRelationsByName('around', { from: null });
		var _tips = _tips3.default.getTips();
	
		if (typeof data.actionData.action == "string") {}
	
		// выполняется для всех вокруг
		// ход не делается
		// вместо хода выполняется едействие для текущей стопки (если _central, по умолчанию true)
		if (typeof data.actionData.run == "string") {
			(function () {
	
				var _central = typeof data.actionData.central == "boolean" ? data.actionData.central : true;
	
				var _runStack = [];
	
				for (var i in _relations) {
	
					if (_tips3.default.fromTo(_this.name, _relations[i].to)) {
						_runStack.push(_relations[i]);
					}
				}
	
				var _counter = _runStack.length;
	
				var _callback = function _callback() {
	
					_counter -= 1;
					if (_counter === 0) {
	
						endAction();
						// event.dispatch(data.actionData.dispatch)
					}
				};
	
				if (_counter === 0) {
	
					endAction();
				} else if (_central) {
	
					_counter += 1;
	
					_event2.default.dispatch(data.actionData.run, {
						to: _this.name,
						callback: _callback
					});
				}
	
				for (var _i in _runStack) {
	
					var _data = Object.assign({}, _runStack[_i]);
					_data.callback = _callback;
					_event2.default.dispatch(data.actionData.run, _data);
				}
	
				// выполняется после хода 
			})();
		} else {
	
			var _callback2 = function _callback2() {
	
				if (_share2.default.get('stepType') == stepType) {
					endAction();
				}
			};
	
			_event2.default.listen('makeStep', _callback2);
			// event.dispatch(data.actionData.dispatch)
		}
	};
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _tips2 = __webpack_require__(6);
	
	var _tips3 = _interopRequireDefault(_tips2);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var stepType = 'stepsAround';
	
	var endAction = function endAction() {
	
		_share2.default.set('stepType', _defaults2.default.stepType);
		_common2.default.curUnLock();
		// Tips.checkTips();
	
		if (data.actionData.dispatch) {
			_event2.default.dispatch(data.actionData.dispatch, data.eventData);
		}
	};
	
	;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (cardId) {
	
		// Нестандартный ход (autosteps)
		// if(share.get('stepType') != defaults.stepType) {return false;};
	
		var rulesCorrect = true; //!common.isLock();
	
		rulesCorrect = rulesCorrect && !this.locked;
	
		if (typeof this.fill == "boolean") {
			rulesCorrect = rulesCorrect && !this.fill;
		}
	
		// берём карту/стопку
	
		var cardIndex = -1;
		var cardName = null;
		var cardSuit = null;
		var cardRank = null;
		var deckLength = this.cards.length;
	
		// проверяем не является ли перевернутой
	
		var takeDeck = [];
	
		for (var i in this.cards) {
	
			if (this.cards[i].id == cardId) {
				cardIndex = i | 0;
				cardName = this.cards[i].name;
	
				var _name = _common2.default.validateCardName(cardName);
	
				rulesCorrect = rulesCorrect && _name;
	
				if (_name) {
					cardSuit = _name.suit;
					cardRank = _name.rank;
				}
	
				rulesCorrect = rulesCorrect && (!this.cards[i].flip || this.cards[i].flip == _defaults2.default.canMoveFlip);
			}
	
			if (cardIndex >= 0) {
				takeDeck.push({ index: i, card: this.cards[i] });
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
	
		for (var ruleIndex in this.takeRules) {
			var ruleName = this.takeRules[ruleIndex];
	
			if (_readyTakeRules2.default[ruleName]) {
				rulesCorrect = rulesCorrect && _readyTakeRules2.default[ruleName](_attrs);
			} else {
				console.warn('Incorrect take rule:', ruleName);
				rulesCorrect = false;
			}
		}
	
		// возвращает массив ID карт которые можно будет перетащить
		// записывает их как активные
	
		rulesCorrect = rulesCorrect && cardIndex >= 0;
	
		return rulesCorrect && takeDeck;
	};
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _readyTakeRules = __webpack_require__(15);
	
	var _readyTakeRules2 = _interopRequireDefault(_readyTakeRules);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (putDeck) {
	
		var _stepType = _share2.default.get('stepType');
	
		var rulesCorrect = true;
	
		var _deckId = putDeck[0].card.parent;
		var _deck_departure = _addDeck2.default.getDeckById(_deckId);
	
		rulesCorrect = rulesCorrect && !this.locked;
	
		if (_stepType != _defaults2.default.stepType) {
	
			// Нестандартный ход (autosteps)
			var _field = (0, _field3.default)();
			rulesCorrect = rulesCorrect && _field.autoSteps && _field.autoSteps[_stepType] ? _field.autoSteps[_stepType].manual({
				putDeck: putDeck,
				to: this
			}) : false;
		} else {
	
			var _link = null; // deckName
			var _deck = this;
	
			for (var ruleIndex in this.putRules) {
	
				if (rulesCorrect) {
	
					if (_link) {
						_deck = _addDeck2.default.Deck(_link);
					}
	
					var ruleName = this.putRules[ruleIndex];
	
					if (_readyPutRules2.default[ruleName]) {
	
						var _param = {
							from: {
								deckId: _deckId,
								deck: _deck_departure
							},
							putDeck: putDeck,
							cards: _deck.cards,
							to: _deck,
							link: _link
							// rulesArgs : putRules[ruleName]
						};
						rulesCorrect = rulesCorrect && _readyPutRules2.default[ruleName](_param);
						_link = _param.link;
					} else {
						console.warn('putRule:', ruleName, 'not exists');
						rulesCorrect = false;
					}
				}
			}
		}
	
		return rulesCorrect;
	};
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _readyPutRules = __webpack_require__(13);
	
	var _readyPutRules2 = _interopRequireDefault(_readyPutRules);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (name) {
		// TODO
	
		var _name = _common2.default.validateCardName(name); // {color, rank}
	
		if (_name) {
	
			var _id = 'card_' + _common2.default.genId(),
			    _card = {
				id: _id,
				name: name,
				type: 'card',
				// domElement : domElement,
				visible: true,
				// parent  : _parent,
				flip: false
			};
			_card.parent = this.getId();
	
			_event2.default.dispatch('addCardEl', _card);
	
			var _elements = _share2.default.get('elements');
			_elements[_id] = _card;
			_share2.default.set('elements', _elements);
	
			this.Push([_card]);
			this.flipCheck();
			this.Redraw();
	
			return _card;
		}
	
		return false;
	};
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _forceMove = __webpack_require__(21);
	
	var _forceMove2 = _interopRequireDefault(_forceMove);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	// import elRender  from 'elRender';
	
	// var _undoMethods = {};
	// var _redoMethods = {};
	
	// ---------------------------------------- UNDO ----------------------------------------
	
	var _undo = function _undo(a) {
	
		// for(var i in _undoMethods) {
		// 	_undoMethods[i](a);
		// }
	
		// if(a.flip) {
		// };
	
		// if(a.unflip) {
		// 	if(
		// 		typeof a.unflip.deck       == "string"
		// 	 && typeof a.unflip.card       != "undefined"
		// 	 && typeof a.unflip.card.name  == "string"
		// 	 && typeof a.unflip.card.index != "undefined"
		// 	) {
		// 		var _deck = Deck.Deck(a.unflip.deck),
		// 			_cards = _deck ? _deck.cards : [];
		// 		if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
		// 			_cards[a.unflip.card.index].flip = true;
		// 		}
		// 	}
		// };
	
		// if(a.fill) {
		// 	// TODO
		// };
	
		// MOVE
		if (typeof a.move != "undefined" && typeof a.move.from != "undefined" && typeof a.move.to != "undefined" && typeof a.move.deck != "undefined") {
			(0, _forceMove2.default)({
				from: a.move.to, // from <=> to
				to: a.move.from,
				deck: a.move.deck,
				flip: a.move.flip
			});
		}
	};
	
	_event2.default.listen('undo', function (_a) {
	
		// elRender.animationsEnd();
		_event2.default.dispatch('stopAnimations');
	
		if (!_a) {
			return;
		};
	
		// Обратная совместимость
		if (_a instanceof Array) {
	
			_a.reverse();
	
			for (var _i in _a) {
				var a = _a[_i];
				_undo(a);
			}
		} else {
	
			_undo(_a);
		}
	
		_tips2.default.checkTips();
	});
	
	// ---------------------------------------- REDO ----------------------------------------
	
	var _redo = function _redo(a) {
	
		// for(var i in _redoMethods) {
		// 	_redoMethods[i](a);
		// }
	
		// if(a.flip) {
		// };
	
		// if(a.unflip) {
		// 	if(
		// 		typeof a.unflip.deck       == "string"
		// 	 && typeof a.unflip.card       != "undefined"
		// 	 && typeof a.unflip.card.name  == "string"
		// 	 && typeof a.unflip.card.index != "undefined"
		// 	) {
		// 		var _deck = Deck.Deck(a.unflip.deck),
		// 			_cards = _deck ? _deck.cards : [];
		// 		if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
		// 			_cards[a.unflip.card.index].flip = false;
		// 		}
		// 	}
		// };
	
		// if(a.fill) {
		// 	// TODO
		// };
	
		if (typeof a.move != "undefined" && typeof a.move.from != "undefined" && typeof a.move.to != "undefined" && typeof a.move.deck != "undefined") {
			(0, _forceMove2.default)(a.move);
		}
	};
	
	_event2.default.listen('redo', function (_a) {
	
		// elRender.animationsEnd();
		_event2.default.dispatch('stopAnimations');
	
		if (!_a) return;
	
		// Обратная совместимость
		if (_a instanceof Array) {
			_a.reverse();
			for (var _i in _a) {
				var a = _a[_i];
				_redo(a);
			}
		} else {
			_redo(_a);
		}
	
		_tips2.default.checkTips();
	});
	
	// ----------------------------------------------
	
	var history = function () {
		function history() {
			_classCallCheck(this, history);
	
			this.steps = [];
		}
	
		_createClass(history, [{
			key: 'reset',
			value: function reset() {
				this.steps = [];
			}
		}, {
			key: 'add',
			value: function add(step) {
	
				// for(var i in step) {
				this.steps.push(step);
				// }
			}
	
			// get steps and reset
	
		}, {
			key: 'get',
			value: function get() {
				var reset = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
	
	
				var _req = this.steps;
	
				if (reset) {
					this.reset();
				}
	
				return _req;
			}
		}, {
			key: 'log',
			value: function log() {
				console.log(this.steps);
			}
		}, {
			key: 'count',
			value: function count() {
				return this.steps.length;
			}
	
			// addUndoMethods(a) {
			// 	for(var i in a) {
			// 		_undoMethods[i] = a[i];
			// 	}
			// }
	
			// addRedoMethods(a) {
			// 	for(var i in a) {
			// 		_redoMethods[i] = a[i];
			// 	}
			// }
	
		}]);
	
		return history;
	}();
	
	var _history = new history();
	
	_event2.default.listen('addStep', function (e) {
		_history.add(e);
	});
	
	_event2.default.listen('saveSteps', function () {
	
		// save steps to client history
		_event2.default.dispatch('makeStep', _history.get());
	});
	
	exports.default = _history;

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (a) {
	
		var _decks = {};
		var _elements = _share2.default.get('elements');
		for (var d in _elements) {
			if (_elements[d].type == 'deck') {
				if (a && a.visible) {
					if (_elements[d].visible) {
						_decks[d] = _elements[d];
					}
				} else {
					_decks[d] = _elements[d];
				};
			};
		};
		return _decks;
	};
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (id) {
		// ID
	
		var _elements = _share2.default.get('elements');
	
		// for(var d in _elements) {
		// 	if(_elements[d].type == 'deck' && d == id) {
		// 		return _elements[d];
		// 	};
		// };
	
		return _elements[id];
	};
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 30 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (a) {
		// Take deck [{card, index}]
	
		var _deck = [];
		for (var i in a) {
			if (a[i].card && a[i].card.name) {
				_deck.push(a[i].card.name);
			} else if (a[i].name) {
				_deck.push(a[i].name);
			};
		};
		return _deck;
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (name, groupName) {
	
		var _decks = _common2.default.getElementsByName(name, 'deck');
		if (groupName && typeof groupName == 'string') {
			for (var i in _decks) {
				var _group = _common2.default.getElementById(_decks[i].parent());
				if (_group && _group.name && _group.name == groupName) {
					return _decks[i];
				}
			}
			return false;
		} else {
			return _decks[0];
		}
	};
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 32 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (cardNames) {
	
		var deckIndex = [];
		var _decksLength = 0;
	
		// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)
		for (var i in this.decks) {
			_decksLength += 1;
			deckIndex.push(null);
		};
	
		// если параметр groupIndex не выходит за рамки занимаем соответствующий порядковый номер
		for (var i in this.decks) {
			if (this.decks[i].groupIndex && this.decks[i].groupIndex <= _decksLength) {
				deckIndex[this.decks[i].groupIndex - 1] = true;
			};
		};
	
		// если нет параметра groupIndex (начинается с 1) ставим первый свободный порядковый номер
		for (var i in this.decks) {
			if (!this.decks[i].groupIndex) {
				var _index = 0;
				for (; deckIndex[_index] != null; _index += 1) {}
				deckIndex[_index] = this.decks[i].getId();
			};
		};
	
		// если параметр groupIndex не выходит за рамки ставим соответствующий порядковый номер
		for (var i in this.decks) {
			if (this.decks[i].groupIndex && this.decks[i].groupIndex <= _decksLength) {
				deckIndex[this.decks[i].groupIndex - 1] = this.decks[i].getId();
			};
		};
	
		// если параметр groupIndex выходит за рамки запоминаем...
		var _decksWithBigIndex = {};
		for (var i in this.decks) {
			if (this.decks[i].groupIndex && this.decks[i].groupIndex > _decksLength) {
				_decksWithBigIndex[this.decks[i].groupIndex - 1] = this.decks[i].getId();
			};
		};
		// ...и сортируем
		for (var i in _decksWithBigIndex) {
			var _index = 0;
			for (; deckIndex[_index] != null; _index += 1) {}
			deckIndex[_index] = this.decks[_decksWithBigIndex[i]].getId();
		};
	
		// сморим являются ли элементы названиями карт (строкой)
		var _checkDeck = true;
		for (var i in cardNames) {
			_checkDeck = _checkDeck && typeof cardNames[i] == 'string';
		};
	
		// циклично добавляет карты в колоды в группе (в порядке добавления)
		if (_checkDeck) {
	
			for (var i in cardNames) {
	
				var _index = deckIndex[i % deckIndex.length];
	
				this.decks[_index].genCardByName(cardNames[i]);
			}
			// если нужно добавить несколько групп карт
		} else {
	
			for (var i in cardNames) {
				if (i < deckIndex.length) {
	
					// console.log('fillDeck', deckIndex[i].name, cardNames[i]);
	
					this.decks[deckIndex[i]].Fill(cardNames[i]);
				};
			};
		};
	};
	
	;

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (_a) {
	
		var _decks = this.getDecks();
		// var _index = {}
	
		if (typeof _a.decks == 'undefined' || typeof _a.decks == 'number') {
			_a.decks = [];
		}
	
		for (var i in _decks) {
	
			if (!_a.decks[i]) {
				_a.decks[i] = {};
			};
	
			// changed values
			if (_a.position && _a.decks[i].parentPosition) {
				_a.decks[i].parentPosition = {
					x: _a.position.x,
					y: _a.position.y
				};
			};
	
			if (_a.rotate) {
				_a.decks[i].rotate = _a.rotate;
			};
			if (_a.paddingX) {
				_a.decks[i].paddingX = _a.paddingX;
			};
			if (_a.paddingY) {
				_a.decks[i].paddingY = _a.paddingY;
			};
			if (_a.flipPaddingX) {
				_a.decks[i].flipPaddingX = _a.flipPaddingX;
			};
			if (_a.flipPaddingY) {
				_a.decks[i].flipPaddingY = _a.flipPaddingY;
			};
			if (!_a.decks[i].position) {
				_a.decks[i].position = {};
			};
			if (!_a.decks[i].parentPosition) {
				_a.decks[i].parentPosition = {};
			};
	
			if (!_a.decks[i].parentPosition.x && a.position && a.position.x && typeof a.position.x == 'number') {
				_a.decks[i].parentPosition.x = _a.position.x;
			};
	
			if (!_a.decks[i].parentPosition.y && a.position && a.position.y && typeof a.position.y == 'number') {
				_a.decks[i].parentPosition.y = _a.position.y;
			};
	
			if (_a.placement) {
	
				var _card = _defaults2.default.card;
				if (_a.placement.x) _a.decks[i].position.x = (_a.placement.x + _card.width) * i;
				if (_a.placement.y) _a.decks[i].position.y = (_a.placement.y + _card.height) * i;
			};
	
			if (!_a.decks[i].rotate && _a.rotate && typeof _a.rotate == 'number') {
				_a.decks[i].rotate = _a.rotate;
			};
			if (!_a.decks[i].paddingX && _a.paddingX && typeof _a.paddingX == 'number') {
				_a.decks[i].paddingX = _a.paddingX;
			};
			if (!_a.decks[i].paddingY && _a.paddingY && typeof _a.paddingY == 'number') {
				_a.decks[i].paddingY = _a.paddingY;
			};
			if (!_a.decks[i].flipPaddingX && _a.flipPaddingX && typeof _a.flipPaddingX == 'number') {
				_a.decks[i].flipPaddingX = _a.flipPaddingX;
			};
			if (!_a.decks[i].flipPaddingY && _a.flipPaddingY && typeof _a.flipPaddingY == 'number') {
				_a.decks[i].flipPaddingY = _a.flipPaddingY;
			};
	
			_decks[i].Redraw(_a.decks[i]);
		};
	};
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * генерация стопок в группах
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _countGenerator = __webpack_require__(35);
	
	var _countGenerator2 = _interopRequireDefault(_countGenerator);
	
	var _fanGenerator = __webpack_require__(36);
	
	var _fanGenerator2 = _interopRequireDefault(_fanGenerator);
	
	var _mapGenerator = __webpack_require__(37);
	
	var _mapGenerator2 = _interopRequireDefault(_mapGenerator);
	
	var _lineGenerator = __webpack_require__(44);
	
	var _lineGenerator2 = _interopRequireDefault(_lineGenerator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
		"count": _countGenerator2.default,
		"fan": _fanGenerator2.default,
		"map": _mapGenerator2.default,
		"line": _lineGenerator2.default
	};

/***/ },
/* 35 */
/***/ function(module, exports) {

	/*
	 * сгенерировать ряд из N карт
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (e) {
	
		// {
		//   type   : "count",
		//   count  : int,
		// }
	
		var _count = e.count;
		var _decks = [];
	
		for (var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
			var _deckName = this.name + "_deck" + (deckIndex + 1);
			_decks.push({
				name: _deckName
			});
		}
	
		return _decks;
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать группу для полумесяца
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	exports.default = function (e) {
	
	    // {
	    //   type   : "fan",
	    //   count  : int,
	    //   radius : int,
	    //   center : {
	    //     x : int,
	    //     y : int
	    //   }
	    // }
	
	    this.placement = {
	        x: 0,
	        y: 0
	    };
	
	    //              b
	    //       C  ..`:   A = sin(b) * C
	    //     ...``   :B  B = cos(b) * C
	    // a.``.......+:
	    //        A     y 90deg
	    var _decks = [];
	
	    var _count = typeof e.count == "number" ? e.count : 3; //16
	    var _step = 180 / _count;
	    var _radius = typeof e.radius == "number" ? e.radius : 100; //405;
	    var _center = typeof e.center != "undefined" && typeof e.center.x != "undefined" && typeof e.center.y != "undefined" ? e.center : {
	        "x": 0,
	        "y": 0
	    };
	    var _angle = _step / 2 + 270;
	    var _deg = Math.PI / 180;
	    for (var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
	
	        var _a = Math.sin(_angle * _deg) * _radius;
	        var _b = Math.cos(_angle * _deg) * _radius;
	        if (_angle > 360) _angle -= 360;
	        _decks.push({
	            "name": this.name + "_deck" + deckIndex,
	            "rotate": _angle,
	            "position": {
	                "x": _center.x + _a - _defaults2.default.card.width / 2,
	                "y": _center.y - _b - _defaults2.default.card.height / 2
	            }
	        });
	        _angle += _step;
	    }
	
	    return _decks;
	};
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;

/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать группу из матрицы
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (e) {
	
		// {
		// 	type            : "map",
		// 	map             : [[string|{name, next, prev}]],
		// 	relations       : {
		// 		around : true,
		// 		beside : ???,
		// 		fall   : {
		// 			directories : [
		// 				"down",
		// 				"right"
		// 			]
		// 		}
		// 	}
		// }
	
		var _decks = [];
	
		var _default_placement = {
			x: 0,
			y: 0
		};
	
		var _placement = this.placement ? {
			x: typeof this.placement.x != "undefined" ? this.placement.x : _default_placement.x,
			y: typeof this.placement.y != "undefined" ? this.placement.y : _default_placement.y
		} : _default_placement;
	
		this.placement = { x: 0, y: 0 };
	
		var _index = 1;
	
		var _mapSize = _mapCommon2.default.mapSize(e.map);
	
		// {name: 'groupName_deck_0_0'}
		for (var y in e.map) {
			for (var x in e.map[y]) {
	
				if (typeof e.map[y][x] == "boolean" && e.map[y][x] || typeof e.map[y][x] == "number" && e.map[y][x] > 0) {
					e.map[y][x] = {};
				};
	
				if (typeof e.map[y][x] == "string") {
					e.map[y][x] = { name: e.map[y][x] };
				} else if (e.map[y][x] && typeof e.map[y][x] != "undefined" && typeof e.map[y][x].name != "string") {
					e.map[y][x].name = this.name + "_deck_" + x + "_" + y;
				};
			}
		}
	
		for (var _y in e.map) {
			for (var _x in e.map[_y]) {
	
				var x = _x | 0,
				    y = _y | 0;
	
				var _el = e.map[y][x];
	
				if (_el) {
	
					var _deck = {
						"name": e.map[y][x].name, // (this.name + "_deck" + _index) OR (this.name + '_' + e.map[y][x])
						"position": {
							"x": x * ((_defaults2.default.card.width | 0) + (_placement.x | 0)),
							"y": y * ((_defaults2.default.card.height | 0) + (_placement.y | 0))
						}
					};
	
					//  ---------------------------------------------------------
					var _relations = [];
	
					var _relGenerators = {
						"around": "mapAroundRelations",
						"beside": "mapBesideRelations",
						"fall": "mapFallRelations"
					};
	
					if (e.relations) {
	
						for (var relGenName in _relGenerators) {
	
							if (e.relations[relGenName]) {
								_relations = _relations.concat(_relationsGenerator2.default[_relGenerators[relGenName]]({
									x: x, y: y,
									map: e.map,
									mapSize: _mapSize,
									el: _el,
									data: e.relations[relGenName]
								}));
							};
						};
					};
	
					_deck.relations = _relations;
					//  ---------------------------------------------------------
	
					_decks.push(_deck);
					_index += 1;
				}
			}
		}
	
		return _decks;
	};
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _relationsGenerator = __webpack_require__(38);
	
	var _relationsGenerator2 = _interopRequireDefault(_relationsGenerator);
	
	var _mapCommon = __webpack_require__(40);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	;
	
	// var getName = (el)=>{
	// 	return typeof el == "string" ? el : typeof el != "undefined" && typeof el.name == "string" ? el.name : null;
	// };
	
	// -------------------------------------------------------------------------------------------------------------------

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapFallRelations = __webpack_require__(39);
	
	var _mapFallRelations2 = _interopRequireDefault(_mapFallRelations);
	
	var _mapAroundRelations = __webpack_require__(41);
	
	var _mapAroundRelations2 = _interopRequireDefault(_mapAroundRelations);
	
	var _mapBesideRelations = __webpack_require__(42);
	
	var _mapBesideRelations2 = _interopRequireDefault(_mapBesideRelations);
	
	var _lineBesideRelations = __webpack_require__(43);
	
	var _lineBesideRelations2 = _interopRequireDefault(_lineBesideRelations);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
		mapFallRelations: _mapFallRelations2.default,
		mapAroundRelations: _mapAroundRelations2.default,
		mapBesideRelations: _mapBesideRelations2.default,
		lineBesideRelations: _lineBesideRelations2.default
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(40);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// map froup generator fall relations
	
	// const directions = [
	// 	'left' ,
	// 	'rigth',
	// 	'up'   ,
	// 	'down'
	// ];
	
	var opposite = [
	// ['left', 'right'],
	// ['up'  , 'down' ]
	{ left: 'right' }, { right: 'left' }, { up: 'down' }, { down: 'up' }];
	
	exports.default = function (e) {
		// {x, y, map, mapSize, el, data}
	
		var _relations = [];
	
		var _directions = [];
		for (var i in e.data.directions) {
			if (_directions.indexOf(e.data.directions[i]) < 0 // этого направления ещё не было
			&& _directions.indexOf(opposite[e.data.directions[i]]) < 0 // противоположного направления тоже не было
			) {
					_directions.push(e.data.directions[i]);
				}
		}
	
		for (var _i in _directions) {
			switch (_directions[_i]) {
				case 'left':
					var x = (e.x | 0) + _mapCommon2.default.beSide.left.x,
					    y = (e.y | 0) + _mapCommon2.default.beSide.left.y;
					if (_mapCommon2.default.exist(x, y, e.mapSize, e.map)) {
						_relations.push({
							name: 'fall',
							direction: 'left',
							to: e.map[y][x].name
						});
					}
					break;
				case 'right':
					var x = (e.x | 0) + _mapCommon2.default.beSide.right.x,
					    y = (e.y | 0) + _mapCommon2.default.beSide.right.y;
					if (_mapCommon2.default.exist(x, y, e.mapSize, e.map)) {
						_relations.push({
							name: 'fall',
							direction: 'right',
							to: e.map[y][x].name
						});
					}
					break;
				case 'up':
					var x = (e.x | 0) + _mapCommon2.default.beSide.up.x,
					    y = (e.y | 0) + _mapCommon2.default.beSide.up.y;
					if (_mapCommon2.default.exist(x, y, e.mapSize, e.map)) {
						_relations.push({
							name: 'fall',
							direction: 'up',
							to: e.map[y][x].name
						});
					}
					break;
				case 'down':
					var x = (e.x | 0) + _mapCommon2.default.beSide.down.x,
					    y = (e.y | 0) + _mapCommon2.default.beSide.down.y;
					if (_mapCommon2.default.exist(x, y, e.mapSize, e.map)) {
						_relations.push({
							name: 'fall',
							direction: 'down',
							to: e.map[y][x].name
						});
					}
					break;
			}
		}
	
		return _relations;
	};

/***/ },
/* 40 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var beSide = {
		left: { x: -1, y: 0 },
		right: { x: 1, y: 0 },
		up: { x: 0, y: -1 },
		down: { x: 0, y: 1 }
	};
	
	var inMap = function inMap(x, y, mapSize) {
		return x >= 0 && y >= 0 && x < mapSize.width && y < mapSize.height;
	};
	
	var exist = function exist(x, y, mapSize, map) {
		return inMap(x, y, mapSize) && map[y][x];
	};
	
	var mapSize = function mapSize(map) {
	
		var _mapSize = {
			width: map[0].length, //MAX LENGTH
			height: map.length
		};
	
		map.forEach(function (e) {
			_mapSize.width = Math.max(_mapSize.width, e.length);
		});
	
		return _mapSize;
	};
	
	// IDs             TYPEs
	// CLT TOP CRT ... CORN SIDE CORN
	// LFT     RGT ... SIDE      SIDE
	// CLB BTM CRB ... CORN SIDE CORN
	var aroundRelations = [{ x: -1, y: -1, type: 'corn', id: 'clt' }, { x: 0, y: -1, type: 'side', id: 'top' }, { x: 1, y: -1, type: 'corn', id: 'crt' }, { x: -1, y: 0, type: 'side', id: 'lft' }, { x: 1, y: 0, type: 'side', id: 'rgt' }, { x: -1, y: 1, type: 'corn', id: 'clb' }, { x: 0, y: 1, type: 'side', id: 'btm' }, { x: 1, y: 1, type: 'corn', id: 'crb' }];
	
	exports.default = {
		beSide: beSide,
		mapSize: mapSize,
		inMap: inMap,
		aroundRelations: aroundRelations,
		exist: exist
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(40);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (e) {
		// {x, y, map, mapSize, el, data}
	
		var _relations = [];
	
		for (var i in _mapCommon2.default.aroundRelations) {
	
			if (_mapCommon2.default.inMap(e.x + _mapCommon2.default.aroundRelations[i].x, e.y + _mapCommon2.default.aroundRelations[i].y, e.mapSize) && e.map[e.y + _mapCommon2.default.aroundRelations[i].y][e.x + _mapCommon2.default.aroundRelations[i].x]) {
				_relations.push({
					name: 'around',
					type: _mapCommon2.default.aroundRelations[i].type,
					id: _mapCommon2.default.aroundRelations[i].id,
					to: e.map[e.y + _mapCommon2.default.aroundRelations[i].y][e.x + _mapCommon2.default.aroundRelations[i].x].name
				});
			}
		}
	
		return _relations;
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(40);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// let getBeside = (_x, _y, mapSize, map, el, type)=>{
	
	// 	if(typeof el[type] == "string") {
	
	// 		switch(el[type]) {
	// 			case 'left':
	// 				var x = _x + mapCommon.beSide.left.x,
	// 					y = _y + mapCommon.beSide.left.y;
	// 				return mapCommon.exist(x, y, mapSize, map)
	// 			 		? map[y][x].name
	// 			 		: null;
	// 			case 'rigth':
	// 				var x = _x + mapCommon.beSide.rigth.x,
	// 					y = _y + mapCommon.beSide.rigth.y;
	// 				return mapCommon.exist(x, y, mapSize, map)
	// 			 		? map[y][x].name
	// 			 		: null;
	// 			case 'up':
	// 				var x = _x + mapCommon.beSide.up.x,
	// 					y = _y + mapCommon.beSide.up.y;
	// 				return mapCommon.exist(x, y, mapSize, map)
	// 			 		? map[y][x].name
	// 			 		: null;
	// 			case 'down':
	// 				var x = _x + mapCommon.beSide.down.x,
	// 					y = _y + mapCommon.beSide.down.y;
	// 				return mapCommon.exist(x, y, mapSize, map)
	// 			 		? map[y][x].name
	// 			 		: null;
	// 			default:
	// 				return null;
	// 		}
	// 	};
	// 	return null;
	// };
	
	exports.default = function (e) {
		// {x, y, map, mapSize, el, data}
	
		var _relations = [];
	
		// var _next = getBeside(e.x, e.y, e.mapSize, e.map, e.el, 'next') && (
		// 	_relations.push({name: 'next', to: _next})
		// );
		// var _prev = getBeside(e.x, e.y, e.mapSize, e.map, e.el, 'prev') && (
		// 	_relations.push({name: 'prev', to: _prev})
		// );
	
		return _relations;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(40);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (e) {
		// {deckIndex, count, decks, data}
	
		var _relations = [];
	
		var _prev = e.deckIndex > 0 ? e.decks[(e.deckIndex | 0) - 1].name : null;
		if (_prev) {
			_relations.push({
				name: 'beside',
				type: 'prev',
				to: _prev
			});
		}
	
		var _next = e.deckIndex < e.count - 1 ? e.decks[(e.deckIndex | 0) + 1].name : null;
		if (_next) {
			_relations.push({
				name: 'beside',
				type: 'next',
				to: _next
			});
		}
	
		return _relations;
	};

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать ряд из N карт
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (e) {
	
		// {
		// 	type	 : "line",
		// 	count	: int,
		// 	relations : {
		// 		"beside" : true
		// 	}
		// }
	
		// direction <- placement: {x, y}
	
		var _count = e.count;
		var _decks = [];
	
		for (var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
			var _deckName = this.name + "_deck" + (deckIndex + 1);
	
			var _deck = {
				name: _deckName
			};
	
			_decks.push(_deck);
		}
	
		if (e.first) {
	
			var _deck2 = _decks[0];
	
			for (var propName in e.first) {
				_deck2[propName] = e.first[propName];
			}
		}
	
		_decks[0].tag = 'first';
	
		if (e.last) {
	
			var _deck3 = _decks[_decks.length - 1];
	
			for (var _propName in e.first) {
				_deck3[_propName] = e.first[_propName];
			}
		}
	
		_decks[_decks.length - 1].tag = 'last';
	
		for (var _deckIndex in _decks) {
			//  ---------------------------------------------------------
			var _relations = [];
	
			var _relGenerators = {
				"beside": "lineBesideRelations"
			};
	
			if (e.relations) {
	
				for (var relGenName in _relGenerators) {
	
					// TODO
					if (e.relations[relGenName]) {
						_relations = _relations.concat(_relationsGenerator2.default[_relGenerators[relGenName]]({
							deckIndex: _deckIndex,
							count: _count,
							decks: _decks,
							data: e.relations[relGenName]
						}));
					};
				};
			};
	
			_decks[_deckIndex].relations = _relations;
			//  ---------------------------------------------------------
		}
	
		return _decks;
	};
	
	var _relationsGenerator = __webpack_require__(38);
	
	var _relationsGenerator2 = _interopRequireDefault(_relationsGenerator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _fallAutoStep = __webpack_require__(46);
	
	var _fallAutoStep2 = _interopRequireDefault(_fallAutoStep);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import A         from 'A';
	// import B         from 'B';
	// import C         from 'C';
	
	var autosteps = {
		fallAutoStep: _fallAutoStep2.default
	};
	
	exports.default = function (autoStepsParams) {
	
		var _autosteps = {};
	
		for (var autoStepName in autoStepsParams) {
	
			if (autosteps[autoStepName]) {
	
				var _autostep = new autosteps[autoStepName](autoStepsParams[autoStepName]);
				_autostep.init(autoStepName);
	
				_autosteps[autoStepName] = _autostep;
			} else {
				console.warn('Autostep \'' + autoStepName + '\' is not exist.');
			}
		}
	
		return _autosteps;
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _autoStep2 = __webpack_require__(47);
	
	var _autoStep3 = _interopRequireDefault(_autoStep2);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips2 = __webpack_require__(6);
	
	var _tips3 = _interopRequireDefault(_tips2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var fallAutoStep = function (_autoStep) {
		_inherits(fallAutoStep, _autoStep);
	
		function fallAutoStep(params) {
			_classCallCheck(this, fallAutoStep);
	
			return _possibleConstructorReturn(this, Object.getPrototypeOf(fallAutoStep).call(this, params));
	
			// event.listen('fallAutoStepCheck', this.check);
		}
	
		// есть ли ещё ходы этого типа
	
	
		_createClass(fallAutoStep, [{
			key: 'check',
			value: function check() {
	
				_tips3.default.checkTips();
	
				var _tips = _tips3.default.getTips();
	
				if (_tips.length === 0) {
	
					this.end();
					// Tips.checkTips();
				}
			}
	
			// start() {
			// 	super.start();
			// 	console.log('FALL AUTO STEP');
			// }
	
		}, {
			key: 'auto',
			value: function auto() {
	
				console.log('-- fallAutoStep:auto', _share2.default.get('curLockState'));
				// fall lines auto
	
				// get groups
				// 	get fall directions ???
				// 	get decks
				// 	get fall relations
	
				// OR getTips + random ???
			}
	
			// manual если autostep = false
			// если click = true, вручную отрабатываем перемещения карт возвращаем false
			// если click = false то отрабатывается move а здесь проверка возможен ли ход
	
		}, {
			key: 'manual',
			value: function manual(data) {
	
				// empty
				// check fall
				// this.check();
				var _from = _addDeck2.default.getDeckById(data.putDeck[0].card.parent),
				    _to = data.to;
	
				var _relations = _from.getRelationsByName('fall', { from: null });
	
				for (var i in _relations) {
					if (_relations[i].to == _to.name && _to.cardsCount() === 0) {
						return true;
					}
				}
	
				return false;
			}
		}]);
	
		return fallAutoStep;
	}(_autoStep3.default);
	
	exports.default = fallAutoStep;

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var _class = function () {
		function _class(params) {
			_classCallCheck(this, _class);
	
			if (typeof params.groups != "undefined") {
				this.groups = params.groups;
			}
	
			if (typeof params.event == "string") {
				this.event = params.event;
			}
	
			if (typeof params.dispatch == "string") {
				this.dispatch = params.dispatch;
			}
	
			if (typeof params.autoStep == "boolean") {
				this.autoStep = params.autoStep;
			}
		}
	
		_createClass(_class, [{
			key: 'start',
			value: function start() {
	
				_share2.default.set('stepType', this.stepType);
	
				if (this.autoStep) {
	
					_common2.default.curLock();
					this.auto();
				} else {
	
					this.check();
				}
			}
		}, {
			key: 'end',
			value: function end() {
	
				if (this.dispatch) {
					_event2.default.dispatch(this.dispatch, { callback: function callback() {
							_share2.default.set('stepType', _defaults2.default.stepType);
						} });
				} else {
					// share.set('stepType', defaults.stepType);
				}
			}
		}, {
			key: 'init',
			value: function init(stepType) {
				var _this = this;
	
				this.stepType = stepType;
	
				if (this.event) {
					_event2.default.listen(this.event, function () {
						_this.start();
					});
				}
	
				if (!this.autoStep) {
	
					_event2.default.listen('moveEnd', function () {
	
						if (_share2.default.get('stepType') != _this.stepType) {
							return;
						}
	
						_this.check();
					});
				}
			}
		}]);

		return _class;
	}();

	exports.default = _class;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// import share from 'share';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// import elRender from 'elRender';
	
	exports.default = function () {
	
		// let _locale = require('json!locales.json')[defaults.locale];
	
		// let Tpl = require("./preferncesTemplate.hamlc");//
	
		// let _values = {
		// 	locale: _locale,
		// 	preferences: []
		// };
	
		// for(let propName in defaults.themes) {
	
		// 	let _pref = {
		// 		title   : _locale["label_" + propName],
		// 		options : []
		// 	};
	
		// 	for(let i in defaults.themes[propName]) {
		// 		_pref.options.push({
		// 			value : defaults.themes[propName][i],
		// 			label : _locale[defaults.themes[propName][i]]
		// 		});
		// 	}
	
		// 	_values.preferences.push(_pref);
		// };
	
		// let _html = Tpl(_values);
	
		// --
	
		var _html = __webpack_require__(49);
	
		$("#gpCommit").parent().before(_html);
	};

/***/ },
/* 49 */
/***/ function(module, exports) {

	module.exports = "<div id=\"solitaire-engine-style-preferences\">\n    <h4>Настройки оформления</h4>\n    <div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Фон:</span>\n\t    <!-- <select id=\"pref_field\" class=\"solitaire-engine-style-preferences-element\"> -->\n        <label>\n        \t<input type=\"radio\" name=\"pref_field\" value=\"default_field\">\n        \tКлассический\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_field\" value=\"alternative_field\">\n        \tАльтернативный\n    \t</label>\n\t    <!-- </select> -->\n\t</div>\n\t<div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Лицевая сторона:</span>\n\t    <!-- <select id=\"pref_face\" class=\"solitaire-engine-style-preferences-element\"> -->\n        <label>\n        \t<input type=\"radio\" name=\"pref_face\" value=\"default_face\">\n        \tКлассическая\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_face\" value=\"alternative_face\">\n        \tАнгло-американская\n    \t</label>\n\t    <!-- </select> -->\n\t</div>\n    <div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Рубашка:</span>\n\t    <!-- <select id=\"pref_back\" class=\"solitaire-engine-style-preferences-element\"> -->\n        <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"default_back\">\n        \tКлассическая\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"alternative_back\">\n        \tАльтернативная\n    \t</label>\n        <!-- <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"red_back\">\n        \tКрасная\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"blue_back\">\n        \tСиняя\n    \t</label> -->\n\t    <!-- </select> -->\n\t</div>\n    <!-- <div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Пустая ячейка:</span>\n\t    <select id=\"pref_empty\" class=\"solitaire-engine-style-preferences-element\">\n\t        <option value=0>Классическая</option>\n\t        <option value=1>С обводкой</option>\n\t    </select>\n\t</div> -->\n\n</div>";

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _storage = __webpack_require__(51);
	
	var _storage2 = _interopRequireDefault(_storage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var onShowParameters = function onShowParameters() {
	
		var pref = _storage2.default.get('pref');
		!pref && (pref = _defaults2.default.pref);
	
		for (var prefName in _defaults2.default.themes) {
			var _pref = pref[prefName] ? pref[prefName] : _defaults2.default.pref[prefName];
			$('input[name=\'pref_' + prefName + '\'][value=\'' + _pref + '\']').prop({ checked: true });
		}
	};
	
	var applyParameters = function applyParameters() {
	
		var pref = {};
		for (var prefName in _defaults2.default.themes) {
			pref[prefName] = $('input[name=\'pref_' + prefName + '\']:checked').val();
		}
	
		_event2.default.dispatch('fieldThemesSet', pref);
	
		saveParameters(pref);
	};
	
	var saveParameters = function saveParameters(pref) {
	
		_storage2.default.set('pref', pref);
	};
	
	exports.default = function () {
	
		// TODO переделать без jQuery
	
		$("#bbParameters").click(onShowParameters);
		// event.dispatch('addDomEvent', {
		// 	"event"    : "click"
		// 	"element"  : "#bbParameters",
		// 	"callback" : onShowParameters
		// });
	
		// $("#gpCommit").click(saveParameters);
	
		$("#solitaire-engine-style-preferences input").change(applyParameters);
		// event.dispatch('addDomEvent', {
		// 	"event"    : "change"
		// 	"element"  : ".solitaire-engine-style-preferences-element",
		// 	"callback" : applyParameters
		// });
	};

/***/ },
/* 51 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var storage = function () {
	
		// TODO настройки сохраняются для всех игр,
		// возможно нужно будет для каждой отдельно,
		// тогда в конфигурацию нужно будет включить gameId
	
		function storage() {
			_classCallCheck(this, storage);
	
			try {
				if (!localStorage.hasOwnProperty('SolitaireEngine')) {
					localStorage.SolitaireEngine = "{}";
				}
			} catch (e) {}
		}
	
		_createClass(storage, [{
			key: 'set',
			value: function set(key, data) {
	
				try {
					var _ls = JSON.parse(localStorage.SolitaireEngine);
					_ls[key] = data;
					localStorage.SolitaireEngine = JSON.stringify(_ls);
				} catch (e) {}
			}
		}, {
			key: 'get',
			value: function get(key) {
	
				try {
					var _ls = JSON.parse(localStorage.SolitaireEngine);
					return _ls[key];
				} catch (e) {
					return null;
				}
			}
		}, {
			key: 'clear',
			value: function clear() {
	
				try {
					localStorage.SolitaireEngine = "{}";
				} catch (e) {}
			}
		}]);
	
		return storage;
	}();
	
	exports.default = new storage();

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _storage = __webpack_require__(51);
	
	var _storage2 = _interopRequireDefault(_storage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	
		var pref = _storage2.default.get('pref');
		!pref && (pref = _defaults2.default.pref);
	
		_event2.default.dispatch('fieldThemesSet', pref);
	};

/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _bestTip = __webpack_require__(8);
	
	var _bestTip2 = _interopRequireDefault(_bestTip);
	
	var _winCheck = __webpack_require__(54);
	
	var _winCheck2 = _interopRequireDefault(_winCheck);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Move = function Move(moveDeck, to, cursorMove) {
	
		_common2.default.animationDefault();
	
		var _deck_destination = null,
		    // to
		// находим стопку из которой взяли
		_deck_departure = moveDeck[0].card.parent && _common2.default.getElementById(moveDeck[0].card.parent),
		    // from
		_success = true;
	
		var _field = (0, _field3.default)();
	
		var _stepType = _share2.default.get('stepType');
	
		// выйти если не стандартный ход
		if (
		// var _field = Field();
		_stepType != _defaults2.default.stepType && (_field.autoSteps && !_field.autoSteps[_stepType] || !_field.autoSteps)) {
	
			var _deck_departure2 = moveDeck[0].card.parent && _common2.default.getElementById(moveDeck[0].card.parent);
	
			_event2.default.dispatch('moveCardToHome', {
				moveDeck: moveDeck,
				departure: _deck_departure2,
				stepType: _share2.default.get('stepType')
			});
			return;
		}
	
		if (!cursorMove.dbclick && cursorMove.distance === 0 && _share2.default.get('moveDistance') > 0 && _stepType == _defaults2.default.stepType) {
			// кликнули один раз
			// чтобы сделать ход нужно переместить карту стопку (moveDistance != 0)
			return false;
		}
	
		_success = _success && to; // to - не пустой
	
		var _el = to && to.id && _common2.default.getElementById(to.id); // получаем карту/стопку
	
		// если положили на карту узнаём из какой она стопки
		if (_el) {
			if (_el.type == 'card') {
				_deck_destination = _common2.default.getElementById(_el.parent);
			} else if (_el.type == 'deck') {
				_deck_destination = _el;
			}
		}
	
		_success = _success && _deck_destination;
	
		// _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);
		_success = _success && _deck_departure;
	
		// смотрим не одна и та же ли эта стопка
		if (_deck_destination && _deck_destination.getId() != _deck_departure.getId()) {
	
			// узнаём можно ли положить карты на папку назначения
			var _put = _deck_destination.Put(moveDeck);
			_success = _success && _put;
	
			if (_put) {
				// } && _deck_departure) {
	
				// если можно положить карты берём их из исходной стопки
				var _pop = _deck_departure.Pop(moveDeck.length);
				_success = _success && _pop;
	
				if (_pop) {
	
					// ложим карты в колоду назначения
					_deck_destination.Push(_pop);
	
					// режим анимации по умолчанию
					_common2.default.animationDefault();
	
					_event2.default.dispatch('addStep', {
						'move': {
							from: _deck_departure.name,
							to: _deck_destination.name,
							deck: _addDeck2.default.deckCardNames(moveDeck),
							stepType: _share2.default.get('stepType')
						}
					});
					_event2.default.dispatch('saveSteps');
	
					// var _deck = _deck_departure.cards;
					// if(_deck.length && _deck[_deck.length - 1].flip) {
	
					// 	_deck[_deck.length - 1].flip = false;
	
					// 	event.dispatch('addStep', {
					// 		deck : _deck_departure.name,
					// 		card : {
					// 			name  : _deck[_deck.length - 1].name,
					// 			index : _deck.length - 1
					// 		}
					// 	});
					// }
	
					_event2.default.dispatch('moveDragDeck', {
	
						departure: _deck_departure,
						destination: _deck_destination,
						moveDeck: moveDeck,
	
						callback: function callback() {
	
							// записать ход (если он не составной)
							// if(_stepType == defaults.stepType) {				
							// }
	
							_event2.default.dispatch('moveEnd', {
								from: _deck_departure,
								to: _deck_destination,
								moveDeck: moveDeck
							});
	
							_tips2.default.checkTips();
	
							_winCheck2.default.winCheck({ show: true });
						}
					});
				}
			}
		} else {
			// карту отпустили на той же стопке
			// + минимальное неоходимое расстояние для автохода не пройдено
			_success = false;
		}
	
		// если не кдалось положить карты, вернуть обратно
		// или положить на лучшее возможное место
		if (!_success && _deck_departure) {
	
			// достаточно ли перетащили (если клика не достаточно и не двойной клик)
			if (_field.inputParams.doubleClick && cursorMove.dbclick || cursorMove.distance >= _share2.default.get('moveDistance')) {
				var Tip = (0, _bestTip2.default)(moveDeck, cursorMove);
	
				if (Tip) {
					Move(moveDeck, Tip.to.deck.domElement.el, cursorMove);
					return;
				} else {
					_event2.default.dispatch('moveCardToHome', {
						moveDeck: moveDeck,
						departure: _deck_departure
					});
					// share.moveCardToHome();
				}
			} else {
				_event2.default.dispatch('moveCardToHome', {
					moveDeck: moveDeck,
					departure: _deck_departure
				});
			}
		}
	
		// if(_success) {
		// afterMove();
		// }
	};
	
	_event2.default.listen('Move', function (e) {
		Move(e.moveDeck, e.to, e.cursorMove);
	});

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _winCheckMethods = __webpack_require__(55);
	
	var _winCheckMethods2 = _interopRequireDefault(_winCheckMethods);
	
	var _addDeck = __webpack_require__(11);
	
	var _addDeck2 = _interopRequireDefault(_addDeck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var winCheck = function winCheck(params) {
	
		var rulesCorrect = true;
		var _hasMetods = false;
		var _winCheck = _share2.default.get('winCheck'); // _field.winCheck
	
		for (var ruleName in _winCheck.rules) {
			_hasMetods = true;
	
			if (_winCheckMethods2.default[ruleName]) {
	
				var _result = _winCheckMethods2.default[ruleName]({
					decks: _addDeck2.default.getDecks({ visible: true }),
					rulesArgs: _winCheck.rules[ruleName]
				});
	
				rulesCorrect = rulesCorrect && _result;
			} else {
				rulesCorrect = rulesCorrect && _winCheckMethods2.default.newerWin();
			}
		}
	
		if (!_hasMetods) {
			rulesCorrect = rulesCorrect && _winCheckMethods2.default.newerWin();
		}
	
		if (rulesCorrect) {
	
			if (params && params.noCallback) {
				return true;
			}
	
			// show you win message
			_event2.default.dispatch('win', params);
	
			console.log('WIN');
	
			return true;
		}
	
		return false;
	};
	
	// hidden check
	var hwinCheck = function hwinCheck(a) {
	
		if (!a) {
			a = {};
		}
	
		if (typeof a.show == 'undefined') {
			a.show = false;
		}
	
		winCheck(a);
		// return winCheck({noCallback : true});
	};
	
	exports.default = {
		winCheck: winCheck,
		hwinCheck: hwinCheck
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/*
	 * Client-server application for planning biomechanical stimulation =)
	 * version: 1.0
	 * author: Romasan
	 * date: 05.05.2016
	 */
	
	// import share    from 'share';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var wcm = {
	
		// Filters
	
		// возвращает колоды определённой группы/групп
		group: function group(a) {
	
			if (!a.filter || !a.filterArgs) {
				return false;
			}
	
			var _decks = [];
			for (var _i in a.decks) {
	
				// var _parent = a.decks[_i].parent
				// if(a.filterArgs.indexOf(a.decks[_i].parent)) {
				if (typeof a.filterArgs == "string" && a.decks[_i].parent == a.filterArgs || a.filterArgs.length && a.filterArgs.indexOf(a.decks[_i].parent) >= 0) {
					_decks.push(a.decks[_i]);
				}
			}
	
			a.decks = _decks;
	
			return _decks.length;
		},
	
		groups: function groups(a) {
			return wcm.group(a);
		},
	
		deck: function deck(a) {
	
			if (!a.filter || !a.filterArgs) {
				return false;
			}
	
			var _decks = [];
	
			for (var _i in a.decks) {
				if (typeof a.filterArgs == "string" && a.decks[_i].name == a.filterArgs || a.filterArgs.indexOf(a.decks[_i].name) >= 0) {
					_decks.push(a.decks[_i]);
				}
			}
	
			a.decks = _decks;
			return _decks.length;
		},
	
		decks: function decks(a) {
			return wcm.deck(a);
		},
	
		// Tag filters
	
		firstEmpty: function firstEmpty(a) {
	
			var _decks = [];
	
			for (var _i in a.decks) {
				if (a.decks[_i].tags.indexOf('last') >= 0) {
					_decks.push(a.decks[_i]);
				}
			}
	
			a.decks = _decks;
	
			return _decks.length;
		},
	
		// Internal use
	
		_asc_desk: function _asc_desk(a) {
	
			if (!a || typeof a.asc_desk != 'number') {
				return false;
			}
	
			var _correct = true;
	
			for (var d in a.decks) {
	
				if (!_correct) return false;
	
				var _cards = a.decks[d].cards;
				for (var c in _cards) {
					if (c > 0) {
						var down = _common2.default.validateCardName(_cards[(c | 0) - 1].name),
						    up = _common2.default.validateCardName(_cards[c | 0].name);
						var _cardsRankS = _defaults2.default.card.ranks;
						_correct = _correct && down && up && _cardsRankS.indexOf(down.rank) == _cardsRankS.indexOf(up.rank) + a.asc_desk;
					}
				}
			}
	
			console.log('asc_desk', a.asc_desk, _correct);
	
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
				_correct = _correct && a.decks[_i].cards.length === 0;
			}
	
			return _correct;
		},
	
		empty: function empty(a) {
			wcm.allEmpty(a);
		},
	
		// Combined rules (use like filter)
	
		// все карты в одной колоде
		allInOne: function allInOne(a) {
	
			var _emptyDecksCount = 0,
			    _decksLength = 0,
			    _fillIndex = 0;
	
			for (var i in a.decks) {
				if (a.decks[i].cards.length === 0) {
					_emptyDecksCount += 1;
				} else {
					_fillIndex = i;
				}
				_decksLength += 1;
			}
	
			var _correct = _emptyDecksCount == _decksLength - 1;
	
			if (a.filter) {
				a.decks = _correct ? [a.decks[_fillIndex]] : [];
			}
	
			return _correct;
		},
	
		// step by step 1, 2, 3
		// во всех колодах карты по возрастанию
		allAscend: function allAscend(a) {
	
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
	
			if (!_a || !_a.rulesArgs) return false;
	
			var _correct = true;
	
			// apply filters
			for (var next in _a.rulesArgs) {
	
				var _decksClone = {};
				for (var i in _a.decks) {
					_decksClone[i] = _a.decks[i];
				}
				var a = {
					// filters : _a[next].filters,
					// rules   : _a[next].rules,
					decks: _decksClone
				};
	
				// применяем фильтры, оставляем только интересующие колоды
	
				if (_correct && _a.rulesArgs[next].filters) {
	
					a.filter = true;
	
					for (var _i2 in _a.rulesArgs[next].filters) {
						if (typeof _a.rulesArgs[next].filters[_i2] == 'string' && wcm[_a.rulesArgs[next].filters[_i2]]) {
							a.filterArgs = null;
							_correct = _correct && wcm[_a.rulesArgs[next].filters[_i2]](a);
						} else {
							// if(typeof _a.rulesArgs[next].filters[i] == 'object') {
							if (_a.rulesArgs[next].filters[_i2] && _a.rulesArgs[next].filters[_i2].toString() == "[object Object]") {
								for (var filterName in _a.rulesArgs[next].filters[_i2]) {
									if (wcm[filterName]) {
										a.filterArgs = _a.rulesArgs[next].filters[_i2][filterName];
										_correct = _correct && wcm[filterName](a);
									} else {
										_correct = _correct && wcm.newerWin();
									}
								}
							} else {
								_correct = _correct && wcm.newerWin();
							}
						}
					}
	
					a.filter = false;
				}
	
				// применяем правила к оставшимся колодам
	
				if (_a.rulesArgs[next].rules) {
	
					for (var _i3 in _a.rulesArgs[next].rules) {
						if (wcm[_a.rulesArgs[next].rules[_i3]]) {
							_correct = _correct && wcm[_a.rulesArgs[next].rules[_i3]](a);
						} else {
							_correct = _correct && wcm.newerWin();
						}
					}
				}
			}
	
			return _correct;
		}
	};
	
	exports.default = wcm;

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	var _initField = __webpack_require__(60);
	
	var _initField2 = _interopRequireDefault(_initField);
	
	var _drawDeck = __webpack_require__(61);
	
	var _drawDeck2 = _interopRequireDefault(_drawDeck);
	
	var _drawCard = __webpack_require__(62);
	
	var _drawCard2 = _interopRequireDefault(_drawCard);
	
	var _drawTip = __webpack_require__(63);
	
	var _drawTip2 = _interopRequireDefault(_drawTip);
	
	var _moveDragDeck = __webpack_require__(64);
	
	var _moveDragDeck2 = _interopRequireDefault(_moveDragDeck);
	
	var _moveCardToHome = __webpack_require__(65);
	
	var _moveCardToHome2 = _interopRequireDefault(_moveCardToHome);
	
	var _fieldThemesSet = __webpack_require__(66);
	
	var _fieldThemesSet2 = _interopRequireDefault(_fieldThemesSet);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_event2.default.listen('removeEl', function (e) {
		(0, _elRender2.default)(e.domElement).remove();
	});
	
	_event2.default.listen('showCard', function (target) {
		(0, _elRender2.default)(target).show();
	});
	
	_event2.default.listen('hideCard', function (target) {
		(0, _elRender2.default)(target).hide();
	});
	
	_event2.default.listen('stopAnimations', function () {
		_elRender2.default.stopAnimations();
	});

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// let jquery = require("script!../../../frontend/js/jquery-2.2.4.min.js");
	
	// export default jquery;
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _elClass = __webpack_require__(58);
	
	var _elClass2 = _interopRequireDefault(_elClass);
	
	var _allElClass = __webpack_require__(59);
	
	var _allElClass2 = _interopRequireDefault(_allElClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_share2.default.set('animatedElements', 0);
	_share2.default.set('animatedElementsStack', []);
	_share2.default.set('animatedCallback', function () {});
	
	var _allEl = function _allEl(e) {
	
		if (!e) {
			throw new Error("elRender:empty arguments");
		}
	
		if (typeof e == "string") {
	
			try {
				if (e[0] == "#") {
					var _element = document.getElementById(e.slice(1, Infinity));
					return new _elClass2.default(_element);
				} else if (e[0] == ".") {
					var _elements = document.getElementsByClassName(e.slice(1, Infinity));
					return new _allElClass2.default(_elements);
				} else if (e[0] == "<") {
					var _temp = document.createElement('temp');
					_temp.innerHTML = e;
					var _element2 = _temp.children[0];
					return new _elClass2.default(_element2);
				}
			} catch (e) {}
		} else if (e.el || e.elements) {
			return e;
		} else {
			return new _elClass2.default(e);
		}
	};
	
	_allEl.stopAnimations = function (callback) {
	
		_allEl(".animated").css({ transition: '0s' }).removeClass("animated");
	
		/*var _animatedElementsStack = share.get('animatedElementsStack');
	 	for(var i in _animatedElementsStack) {
	 	_animatedElementsStack[i].el.style.transition = null;
	 };
	 share.set('animatedElementsStack', []);
	 	share.set('animatedElements', 0);
	 var _animatedCallback = share.get('animatedCallback');
	 _animatedCallback.call(this);
	 share.set('animatedCallback', ()=>{});*/
	};
	
	exports.default = _allEl;

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var elClass = function () {
		function elClass(e) {
			_classCallCheck(this, elClass);
	
			this.el = e;
	
			if (!e) {
				// if(window._debug) throw new Error("test");
				this.el = null;
			}
		}
		// --
	
	
		_createClass(elClass, [{
			key: 'attr',
			value: function attr(attributes) {
				try {
					for (var attrName in attributes) {
						this.el[attrName] = attributes[attrName];
					}
					return this;
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'hasClass',
			value: function hasClass(className) {
				try {
	
					var _classes = this.el.className.split(' ');
					return _classes.indexOf(className) >= 0;
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'toggleClass',
			value: function toggleClass(className) {
				try {
	
					if (this.hasClass(className)) {
						this.removeClass(className);
					} else {
						this.addClass(className);
					}
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'addClass',
			value: function addClass(className) {
				try {
	
					var _classes = this.el.className.split(' ');
					if (!this.hasClass(className)) {
						_classes.push(className);
						this.el.className = _classes.join(' ');
					}
					return this;
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'removeClass',
			value: function removeClass(className) {
	
				if (!this.el || !this.el.className) return this;
	
				try {
	
					var _classes = this.el.className.split(' ');
	
					if (this.hasClass(className)) {
	
						var _clone = [];
						for (var i in _classes) {
							if (_classes[i] != className) {
								_clone.push(_classes[i]);
							}
						}
						_classes = _clone;
						this.el.className = _classes.join(' ');
					}
					return this;
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'css',
			value: function css(a) {
	
				if (!this.el) return this;
	
				try {
	
					for (var attrName in a) {
						try {
							this.el.style[attrName] = a[attrName];
						} catch (e) {}
					}
					return this;
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'hide',
			value: function hide() {
				try {
	
					return this.css({ 'display': 'none' });
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'show',
			value: function show() {
				try {
	
					return this.css({ 'display': 'block' });
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'append',
			value: function append(el) {
				try {
	
					if (el.el) {
						el = el.el;
					}
					this.el.appendChild(el);
					return this;
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'html',
			value: function html(el) {
				try {
	
					if (typeof el == "undefined") {
						return this.el.innerHTML;
					}
	
					if (el.el) {
						el = el.el;
					}
	
					this.el.innerHTML = el;
	
					return this;
				} catch (e) {}
			}
			// --
	
		}, {
			key: 'animate',
			value: function animate(params, animationTime, callback, animationName) {
				var _this = this;
	
				try {
					var _animation = _share2.default.get('animation');
	
					typeof animationTime == "undefined" && (animationTime = _defaults2.default.animationTime);
					typeof animationTime == "function" && (callback = animationTime, animationTime = _defaults2.default.animationTime);
					typeof callback == "string" && (animationName = callback, callback = null);
	
					// Thread
					setTimeout(function () {
	
						if (_animation) {
							_this.css({ transition: animationTime / 1000 + 's' });
						}
	
						var counter = 0;
	
						var reType = function reType(e) {
							// crutch
	
							var _e = e + '';
	
							var _px = _e.split('px');
							if (_px.length == 2) {
								return (_px[0] | 0) + 'px';
							}
	
							return e;
						};
	
						for (var attrName in params) {
	
							if (
							// this.el.style[attrName] != params[attrName]
							reType(_this.el.style[attrName]) != reType(params[attrName])) {
								counter += 1;
							}
							_this.el.style[attrName] = params[attrName];
						}
	
						if (_animation) {
	
							_this.addClass("animated");
	
							_this.el.addEventListener("transitionend", function () {
	
								counter -= 1;
	
								// event.dispatch('animationEnd', this);
	
								if (!counter) {
	
									_this.removeClass("animated");
									_this.css({ transition: null });
	
									if (typeof callback == "function") {
										callback();
									}
	
									_event2.default.dispatch('allAnimationsEnd', animationName);
								}
							}, false);
						} else {
	
							// event.dispatch('animationEnd', this);
	
							if (typeof callback == "function") {
								callback();
							}
	
							_event2.default.dispatch('allAnimationsEnd', animationName);
						}
					}, 0);
				} catch (e) {}
			}
			// --	
	
		}, {
			key: 'remove',
			value: function remove() {
				try {
	
					this.el.remove();
				} catch (e) {}
			}
	
			/*getEl() {
	  	
	  	return this.el;
	  }*/
	
		}, {
			key: 'parent',
			value: function parent() {
				return new elClass(this.el.parentNode);
			}
		}, {
			key: 'after',
			value: function after(html) {
				try {
					this.el.parentNode.insertBefore(html, this.el.nextElementSibling);
					/*if(html.el) html = html.el;
	    	var _parentElements = this.el.parentNode.children;
	    var _newChildren = [];
	    
	    for(var i in _parentElements) {
	    	_newChildren.push(_parentElements[i]);
	    	if(_parentElements[i] == this.el) {
	    		_newChildren.push(html);
	    	}
	    }
	    
	    this.el.parentNode.children = _newChildren;*/
				} catch (e) {}
				return this;
			}
		}, {
			key: 'before',
			value: function before(html) {
				try {
					this.el.parentNode.insertBefore(html, this.el);
					/*if(html.el) html = html.el;
	    	var _parentElements = this.el.parentNode.children;
	    var _newChildren = [];
	    
	    for(var i in _parentElements) {
	    	if(_parentElements[i] == this.el) {
	    		_newChildren.push(html);
	    	}
	    	_newChildren.push(_parentElements[i]);
	    }
	    
	    this.el.parentNode.children = _newChildren;*/
				} catch (e) {}
				return this;
			}
		}, {
			key: 'event',
			value: function event(eventName, callback) {
				this.el.addEventListener(eventName, callback);
			}
		}, {
			key: 'click',
			value: function click(callback) {
				this.event(callback);
			}
		}]);
	
		return elClass;
	}();
	
	exports.default = elClass;

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _elClass = __webpack_require__(58);
	
	var _elClass2 = _interopRequireDefault(_elClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var allElClass = function () {
		function allElClass(elements) {
			_classCallCheck(this, allElClass);
	
			this.elements = [];
	
			for (var i in elements) {
				this.elements.push(new _elClass2.default(elements[i]));
			}
		}
		// --
	
	
		_createClass(allElClass, [{
			key: 'attr',
			value: function attr(attributes) {
				for (var i in this.elements) {
					this.elements[i].attr(attributes);
				}
				return this;
			}
			// --
	
		}, {
			key: 'toggleClass',
			value: function toggleClass(className) {
				for (var i in this.elements) {
					this.elements[i].toggleClass(className);
				}
				return this;
			}
			// --
	
		}, {
			key: 'addClass',
			value: function addClass(className) {
				for (var i in this.elements) {
					this.elements[i].addClass(className);
				}
				return this;
			}
			// --
	
		}, {
			key: 'removeClass',
			value: function removeClass(className) {
				for (var i in this.elements) {
					this.elements[i].removeClass(className);
				}
				return this;
			}
			// --
	
		}, {
			key: 'css',
			value: function css(a) {
				for (var i in this.elements) {
					this.elements[i].css(a);
				}
				return this;
			}
			// --
	
		}, {
			key: 'hide',
			value: function hide() {
				for (var i in this.elements) {
					this.elements[i].hide();
				}
				return this;
			}
			// --
	
		}, {
			key: 'show',
			value: function show() {
				for (var i in this.elements) {
					this.elements[i].show();
				}
				return this;
			}
			// --
	
		}, {
			key: 'animate',
			value: function animate(params, animationTime, callback, animationName) {
	
				typeof animationTime == "undefined" && (animationTime = _defaults2.default.animationTime);
				typeof animationTime == "function" && (callback = animationTime, animationTime = _defaults2.default.animationTime);
				typeof callback == "string" && (animationName = callback, callback = null);
	
				var counter = 0;
	
				for (var i in this.elements) {
					counter += 1;
					this.elements[i].animate(params, animationTime, function () {
						counter -= 1;
						if (!counter) callback();
					});
				}
				return this;
			}
			// --
	
		}, {
			key: 'remove',
			value: function remove() {
				for (var i in this.elements) {
					this.elements[i].remove();
				}
				return this;
			}
		}]);
	
		return allElClass;
	}();
	
	exports.default = allElClass;

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_event2.default.listen('initField', function (e) {
	
		var domElement = e.a.field ? e.a.field : '#map'; // default;
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
		var _field = (0, _field3.default)();
		_field.domElement = domElement;
	
		var _params = {};
	
		if (e.a.width && typeof e.a.width == 'number') {
			_params.width = e.a.width + 'px';
		}
		if (e.a.height && typeof e.a.height == 'number') {
			_params.height = e.a.height + 'px';
		}
		if (e.a.top && typeof e.a.top == 'number') {
			_params.top = e.a.top + 'px';
		}
		if (e.a.left && typeof e.a.left == 'number') {
			_params.left = e.a.left + 'px';
		}
	
		var _zoom = _share2.default.get('zoom');
		(_zoom != _defaults2.default.zoom || _zoom != 1) && (_params.transform = 'scale(' + _zoom + ')', _params['transform-origin'] = '0 0');
		// if(a.rotate && typeof a.rotate == 'number') _params.transform = 'rotate(' + (a.rotate|0) + 'deg)';
	
		// var themeName = 
		// 	typeof e.a.theme == 'string' 
		// 		? e.a.theme 
		// 		: typeof e.a.theme == 'object' && e.a.theme.name
		// 			? e.a.theme.name
		// 			: defaults.theme.name;
	
		(0, _elRender2.default)(domElement).css(_params).addClass('solitaireField');
		// .addClass(themeName);
	});

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var applyChangedParameters = function applyChangedParameters(p, a, deck) {
	
		p.x = a.position && a.position.x && typeof a.position.x == 'number' ? a.position.x : 0, p.y = a.position && a.position.y && typeof a.position.y == 'number' ? a.position.y : 0;
		p.x = a.parentPosition && a.parentPosition.x ? p.x + a.parentPosition.x : p.x;
		p.y = a.parentPosition && a.parentPosition.y ? p.y + a.parentPosition.y : p.y;
	
		deck.rotate = p.rotate = a.rotate && typeof a.rotate == 'number' ? a.rotate : 0;
	
		// у padding_x, padding_y приоритет выше чем paddingType
	
		p.padding_y = a.paddingY && typeof a.paddingY == 'number' ? a.paddingY : a.paddingType ? _defaults2.default.padding_y : 0, p.padding_x = a.paddingX && typeof a.paddingX == 'number' ? a.paddingX : a.paddingType ? _defaults2.default.padding_x : 0, p.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' ? a.flipPaddingY : a.paddingType ? _defaults2.default.flip_padding_y : 0, p.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' ? a.flipPaddingX : a.paddingType ? _defaults2.default.flip_padding_x : 0;
	};
	
	// --------------------------------------------------------------------------------------------------------
	
	_event2.default.listen('addDeckEl', function (e) {
	
		var _field = (0, _field3.default)();
	
		applyChangedParameters(e.params, e.a, e.deck);
	
		e.deck.domElement = (0, _elRender2.default)('<div>');
		// .getEl();
	
		var _params = {
			left: e.params.x + 'px',
			top: e.params.y + 'px',
			width: _defaults2.default.card.width + 'px',
			height: _defaults2.default.card.height + 'px',
			transform: 'rotate(' + (e.params.rotate | 0) + 'deg)'
		};
	
		_params.display = e.deck.visible ? 'block' : 'none';
	
		(0, _elRender2.default)(e.deck.domElement).css(_params).addClass('el').attr({
			id: e.deck.getId()
		});
	
		// var showSlot = e.a.showSlot && typeof e.a.showSlot == 'boolean' ? e.a.showSlot : defaults.showSlot;
		if (e.a.showSlot) {
			(0, _elRender2.default)(e.deck.domElement).addClass('slot');
		}
		if (e.a.class) {
			(0, _elRender2.default)(e.deck.domElement).addClass(e.a.class);
		}
	
		(0, _elRender2.default)(_field.domElement).append(e.deck.domElement);
	
		// add label
	
		var label = e.a.label && typeof e.a.label == 'string' ? e.a.label : null;
	
		if ((true) && !e.a.label && _share2.default.get('debugLabels')) {
			label = '<span style="color:#65B0FF;">' + e.deck.name + '</span>';
		}
		if (label) {
			var _labelElement = (0, _elRender2.default)('<div>').addClass('deckLabel');
			// .attr({
			// 	"title" : e.deck.getId() + " (" + e.deck.parent + ")"
			// })
			// .getEl();
			(0, _elRender2.default)(_labelElement).html(label);
			(0, _elRender2.default)(e.deck.domElement).append(_labelElement);
		}
	});
	
	// --------------------------------------------------------------------------------------------------------
	
	_event2.default.listen('redrawDeckFlip', function (e) {
	
		if (!e || !e.cards) return;
	
		for (var i in e.cards) {
			var _params = {};
	
			if (e.cards[i].flip) {
				(0, _elRender2.default)(e.cards[i].domElement).addClass('flip');
			} else {
				(0, _elRender2.default)(e.cards[i].domElement).removeClass('flip');
			}
			(0, _elRender2.default)(e.cards[i].domElement).css(_params);
		}
	});
	
	// --------------------------------------------------------------------------------------------------------
	
	_event2.default.listen('redrawDeckIndexes', function (e) {
	
		if (!e || !e.cards) return;
	
		for (var i in e.cards) {
			(0, _elRender2.default)(e.cards[i].domElement).css({
				'z-index': (_defaults2.default.startZIndex | 0) + (i | 0)
			});
		}
	});
	
	// --------------------------------------------------------------------------------------------------------
	
	_event2.default.listen('redrawDeck', function (e) {
	
		if (_share2.default.get('noRedraw')) {
			return false;
		};
	
		if (e.data) {
			applyChangedParameters(e.params, e.data, e.deck);
	
			if (e.data.paddingX) _share2.default.get('padding_x', e.data.paddingX);
			if (e.data.flipPaddingX) _share2.default.get('flip_padding_x', e.data.flipPaddingX);
			if (e.data.paddingY) _share2.default.get('padding_y', e.data.paddingY);
			if (e.data.flipPaddingY) _share2.default.get('flip_padding_y', e.data.flipPaddingY);
		}
	
		var _params = {
			left: e.params.x,
			top: e.params.y,
			transform: 'rotate(' + (e.params.rotate | 0) + 'deg)'
		};
	
		_params.display = e.deck.visible ? 'block' : 'none';
	
		(0, _elRender2.default)(e.deck.domElement).css(_params);
	
		for (var i in e.cards) {
			var _card_position = e.deck.padding(i);
			var _zIndex = (e.params.startZIndex | 0) + (i | 0);
			var _params = {
				'left': _card_position.x + 'px',
				'top': _card_position.y + 'px',
				'z-index': _zIndex,
				'-ms-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)',
				'-webkit-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)',
				'-moz-transform': 'rotate(' + (e.params.rotate | 0) + 'deg)',
				'transform': 'rotate(' + (e.params.rotate | 0) + 'deg)'
			};
			_params.display = e.deck.visible ? 'block' : 'none';
	
			// e.deck.checkFlip(e.cards[i], i|0, e.cards.length|0);
	
			if (e.cards[i].flip) {
				(0, _elRender2.default)(e.cards[i].domElement).addClass('flip');
			} else {
				(0, _elRender2.default)(e.cards[i].domElement).removeClass('flip');
			}
			(0, _elRender2.default)(e.cards[i].domElement).css(_params);
		}
	});

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_event2.default.listen('addCardEl', function (e) {
	
		var _field = (0, _field3.default)();
	
		var _card = {
			width: _defaults2.default.card.width,
			height: _defaults2.default.card.height
		};
		_card = {
			width: _card.width.toFixed(3) * 1,
			height: _card.height.toFixed(3) * 1
		};
	
		var _params = {
			"width": _card.width + 'px',
			"height": _card.height + 'px'
		};
	
		e.domElement = (0, _elRender2.default)('<div>');
		// .getEl();
	
		(0, _elRender2.default)(e.domElement)
		// .addClass(e.name)
		.addClass('el card draggable ' + e.name)
		// .css({'background-size' : null})
		.css(_params).attr({
			id: e.id
		});
		(0, _elRender2.default)(_field.domElement).append(e.domElement);
	});
	
	_event2.default.listen('hideCard', function (e) {
	
		if (e && e.domElement) {
			(0, _elRender2.default)(e.domElement[0]).hide();
		}
	});
	
	_event2.default.listen('showCard', function (e) {
	
		if (e && e.domElement) {
			(0, _elRender2.default)(e.domElement[0]).show();
		}
	});

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	var _tips = __webpack_require__(6);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_event2.default.listen('showTip', function (e) {
	
		if (e && e.el && e.el.domElement && e.type) {
			(0, _elRender2.default)(e.el.domElement).addClass(e.type);
		}
	});
	
	_event2.default.listen('hideTips', function (e) {
	
		if (e && e.types) {
			for (var i in e.types) {
				var typeName = e.types[i];
				(0, _elRender2.default)('.' + typeName).removeClass(typeName);
			}
		} else {
	
			for (var i in _tips2.default.tipTypes) {
				var typeName = _tips2.default.tipTypes[i];
				(0, _elRender2.default)('.' + typeName).removeClass(typeName);
			}
		}
	});

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var angleValidate = function angleValidate(_angle) {
	
		if (_angle < 0) {
			_angle += 360;
		}
		if (_angle > 360) {
			_angle -= 360;
		}
	
		return _angle;
	};
	
	_event2.default.listen('moveDragDeck', function (e) {
	
		_common2.default.curLock();
	
		var _lastIndex = e.moveDeck.length - 1;
		for (var i in e.moveDeck) {
	
			var _position = e.destination.padding(e.destination.cards.length - 1 + (i | 0));
	
			var departureAngle = angleValidate(e.departure.rotate),
			    destinationAngle = angleValidate(e.destination.rotate);
	
			(0, _elRender2.default)(e.moveDeck[i].card.domElement).css({
				'transform': 'rotate(' + departureAngle + 'deg)'
			});
	
			if (departureAngle - destinationAngle > 180) {
	
				departureAngle = departureAngle - 360;
				(0, _elRender2.default)(e.moveDeck[i].card.domElement).css({
					'transform': 'rotate(' + departureAngle + 'deg)'
				});
			};
	
			if (departureAngle - destinationAngle < -180) {
				destinationAngle -= 360;
			}
	
			var _params = {
				'left': _position.x + 'px',
				'top': _position.y + 'px',
				'transform': 'rotate(' + destinationAngle + 'deg)'
			};
	
			var _zIndex = (_defaults2.default.topZIndex | 0) + (i | 0);
	
			var _callback = function (e, _last) {
	
				e.departure.Redraw();
				e.destination.Redraw();
	
				_common2.default.curUnLock();
	
				if (_last && typeof e.callback == "function") {
					e.callback();
				}
	
				_event2.default.dispatch('moveDragDeckDone', {
					deck: e.destination
				});
			}.bind(null, e, i == _lastIndex);
	
			(0, _elRender2.default)(e.moveDeck[i].card.domElement).css({ 'z-index': _zIndex }).animate(_params, _callback);
	
			// elRender(e.moveDeck[i].card.domElement)
			// .animate(_params)
		}
	});
	
	// --------------------------------------------------------------------------------------------------------
	
	_event2.default.listen('moveDragDeckDone', function (e) {
	
		if (!e.deck.fill) {
			return;
		}
	
		var _deck = e.deck.cards;
		for (var i in _deck) {
			(0, _elRender2.default)(_deck[i].domElement).addClass('fill');
		}
	});
	
	// --------------------------------------------------------------------------------------------------------
	
	_event2.default.listen('dragDeck', function (e) {
		// {x, y, _dragDeck, _startCursor, _deck}
	
		for (var i in e._dragDeck) {
			var _position = e._deck.padding(e._dragDeck[i].index);
			var _params = {
				'left': _position.x + (e.x - e._startCursor.x) + 'px',
				'top': _position.y + (e.y - e._startCursor.y) + 'px',
				// transform : 'rotate(0deg)',
				'z-index': _defaults2.default.topZIndex + (i | 0)
			};
			// Operations with DOM
			(0, _elRender2.default)(e._dragDeck[i].card.domElement).css(_params);
		}
	});

/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Move card to home
	_event2.default.listen('moveCardToHome', function (e) {
	
		if (_share2.default.get('lastCursorMove').distance > 0) {
			_common2.default.curLock();
		}
	
		for (var i in e.moveDeck) {
	
			var _position = e.departure.padding(e.moveDeck[i].index);
			var _params = {
				left: _position.x + 'px',
				top: _position.y + 'px'
			};
	
			(0, _elRender2.default)(e.moveDeck[i].card.domElement).animate(_params, function () {
	
				_common2.default.curUnLock();
	
				if (e.departure) {
					e.departure.Redraw();
				}
	
				if (typeof e.callback == "function") {
					e.callback();
				}
			}, 'moveCardToHomeAnimation');
		}
	});

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _field2 = __webpack_require__(9);
	
	var _field3 = _interopRequireDefault(_field2);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_event2.default.listen('fieldThemesSet', function (pref) {
	
		var _field = (0, _field3.default)();
	
		var fieldDomElement = _field.domElement;
	
		for (var prefName in _defaults2.default.themes) {
	
			// Clear old themes
			for (var i in _defaults2.default.themes[prefName]) {
				var themeName = _defaults2.default.themes[prefName][i];
				(0, _elRender2.default)(fieldDomElement).removeClass(themeName);
			}
	
			// Add new themes
			// let className = defaults.themes[prefName][pref[prefName]];
			var className = pref[prefName];
			(0, _elRender2.default)(fieldDomElement).addClass(className);
		}
	});

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	exports.default = function (a) {
	
		var default_type = 'all';
	
		var default_shuffle = false;
		var max_iterations = 10;
	
		var type = a && a.type && typeof a.type == 'string' ? a.type : default_type;
		var _deckCount = a && a.deckCount && typeof a.deckCount == 'number' ? a.deckCount : 52;
		var _iterations = a && a.iterations && typeof a.iterations == 'number' && a.iterations < max_iterations ? a.iterations : 1;
		var _shuffle = a && a.shuffle && typeof a.shuffle != 'undefuned' ? a.shuffle : default_shuffle;
	
		var genType = function genType(_cardsColors, _cardsRanks) {
			var _deck = [];
			for (var c in _cardsColors) {
				for (var r in _cardsRanks) {
					_deck.push(_cardsColors[c] + _cardsRanks[r]);
				}
			}
			return _deck;
		};
	
		var _ranks = _deckCount == 36 ? _defaults2.default.card.ranks36 : _defaults2.default.card.ranks;
		if (a && a.ranks) {
			_ranks = [];
			for (i in a.ranks) {
				if (_defaults2.default.card.rank.indexOf(a.ranks[i].toString()) >= 0) {
					_ranks.push(a.ranks[i].toString());
				}
			}
		}
	
		var genTypes = {
			all: function all() {
				return genType(_defaults2.default.card.suits, _ranks);
			},
			black: function black() {
				var _cardsSuits = _defaults2.default.card.colors.black;
				return genType(_cardsSuits, _ranks);
			},
			red: function red() {
				var _cardsSuits = _defaults2.default.card.colors.red;
				return genType(_cardsSuits, _ranks);
			},
			black_and_red: function black_and_red() {
				var _cardsSuits = [_defaults2.default.card.colors.red[Math.random() * _defaults2.default.card.colors.red.length | 0], _defaults2.default.card.colors.black[Math.random() * _defaults2.default.card.colors.black.length | 0]];
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
				var _cardsSuits = [_defaults2.default.card.solors[Math.random() * _defaults2.default.card.solors.length | 0]];
				return genType(_cardsSuits, _ranks);
			}
	
		};
	
		genTypes.hearts = genTypes.h_only;
		genTypes.diamonds = genTypes.d_only;
		genTypes.clubs = genTypes.c_only;
		genTypes.spades = genTypes.s_only;
	
		var _deck = [];
	
		for (; _iterations > 0; _iterations -= 1) {
			_deck = _deck.concat(genTypes[type]());
		}
	
		if (_shuffle) {
			shuffle(_deck);
		}
	
		return _deck;
	};
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var shuffle = function shuffle(a) {
		for (var j, x, i = a.length; i; j = Math.floor(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x) {};
	};
	
	;

/***/ },
/* 68 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 69 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 70 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _deckGenerator = __webpack_require__(67);
	
	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	var _mapCommon = __webpack_require__(40);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	var _history2 = __webpack_require__(27);
	
	var _history3 = _interopRequireDefault(_history2);
	
	var _renderTest = __webpack_require__(72);
	
	var _renderTest2 = _interopRequireDefault(_renderTest);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// event.listen('addStep', (e) => {
	// 	console.log('* Добавили данные для истории:', e.move ? e.move.stepType : 'none', e);
	// 	if(e.move && !e.move.stepType) {
	// 		throw new Error('debug');
	// 	}
	// });
	
	// event.listen('makeStep', (e) => {
	// 	console.log('# Отправили данные на сохранение в историю:', e);
	// }
	
	var _history = [],
	    _redo = [];
	
	var debugHistoryMgr = new function () {
	
		this.record = function (data) {
			_redo = [];
			_history.push(data);
		};
	
		this.undo = function () {
	
			var _step = _history.pop();
			if (_step) {
				_redo.push(_step);
			};
			return _step;
		};
	
		this.redo = function () {
	
			var _step = _redo.pop();
			if (_step) {
				_history.push(_step);
			};
			return _step;
		};
	}();
	
	// add buttons
	
	var _debugHistory = false;
	var debugHistory = function debugHistory(a) {
	
		if (_debugHistory) {
			return;
		}
		_debugHistory = true;
	
		_event2.default.listen('makeStep', debugHistoryMgr.record);
	
		if (a && a.drawButtons) (0, _elRender2.default)(document.body).append((0, _elRender2.default)("<div>").append($("<span>").addClass('awesome').text('UNDO').click(function () {
			var _data = debugHistoryMgr.undo();
			if (_data) {
				SolitaireEngine.event.dispatch('undo', _data);
			}
		})).append($("<span>").addClass('awesome').text('REDO').click(function () {
			var _data = debugHistoryMgr.redo();
			if (_data) {
				SolitaireEngine.event.dispatch('redo', _data);
			}
		})).css({
			position: 'fixed',
			top: '1px',
			left: '1px'
		}));
	};
	
	var runTests = function runTests() {
		// renderTest();
	};
	
	_event2.default.listen('gameInit', function (e) {
		if (!e.firstInit) {
			return;
		};
		runTests();
	});
	
	exports.default = {
		share: _share2.default,
		deckGenerator: _deckGenerator2.default,
		debugHistory: debugHistory,
		debugHistoryMgr: debugHistoryMgr,
		validateCardName: _common2.default.validateCardName,
		elRender: _elRender2.default,
		defaults: _defaults2.default,
		groupGenerators: {
			mapCommon: _mapCommon2.default
		},
		history: _history3.default
	};

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _elRender = __webpack_require__(57);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function () {
	
		/*	log("-- renderTests");
	 // --
	 	log("- startTest#1");
	 	let _el_1 = elRender("<div>");
	 	log(
	 		"- renderTest#1-A",
	 		_el_1
	 	);
	 	// log(
	 	// 	"- renderTest#1-B",
	 	// 	_el_1.elements[0].el.className
	 	// );
	 // --	log("-- renderTests");
	 // --
	 	log("- startTest#1");
	 	let _el_1 = elRender("<div>");
	 	log(
	 		"- renderTest#1-A",
	 		_el_1
	 	);
	 	// log(
	 	// 	"- renderTest#1-B",
	 	// 	_el_1.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#2");
	 	let _el_2 = elRender("#tbUndo");
	 	log(
	 		"- renderTest#2-A",
	 		_el_2
	 	);
	 	// log(
	 	// 	"- renderTest#2-B",
	 	// 	_el_2.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#3");
	 	let _el_3 = elRender(".titleBandLink");
	 	log(
	 		"- renderTest#3 '.titleBandLink'",
	 		_el_3
	 	);
	 	// log(
	 	// 	"- renderTest#3-B",
	 	// 	_el_3.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#4");
	 	let _el_4 = document.querySelector(".titleBandLink");
	 	log(
	 		"- renderTest#4-A",
	 		elRender(_el_4)
	 	);
	 	// log(
	 	// 	"- renderTest#4-B",
	 	// 	_el_4.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#5");
	 	let _el_5 = document.querySelectorAll(".titleBandLink");
	 	log(
	 		"- renderTest#5 '.titleBandLink'",
	 		_el_5
	 	);
	 	// log(
	 	// 	"- renderTest#5-B",
	 	// 	_el_5.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#6");
	 	let _el = elRender("#tbUndo");
	 	let _el_6 = elRender(_el);
	 	log(
	 		"- renderTest#6-A",
	 		_el_6
	 	);
	 	// log(
	 	// 	"- renderTest#6-B",
	 	// 	_el_6.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#7");
	 	let _elements = elRender(".titleBandLink");
	 	let _el_7 = elRender(_elements);
	 	log(
	 		"- renderTest#7-A",
	 		_el_7
	 	);
	 	// log(
	 	// 	"- renderTest#7-B",
	 	// 	_el_7.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#8");
	 	let _element = elRender("#tbUndo");
	 	let _element2 = elRender("#tbRedo");
	 	let _el_8 = elRender(_element)
	 		.after(_element2);
	 	log(
	 		"- renderTest#8-A",
	 		_el_8
	 	);
	 	log("- startTest#2");
	 	let _el_2 = elRender("#tbUndo");
	 	log(
	 		"- renderTest#2-A",
	 		_el_2
	 	);
	 	// log(
	 	// 	"- renderTest#2-B",
	 	// 	_el_2.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#3");
	 	let _el_3 = elRender(".titleBandLink");
	 	log(
	 		"- renderTest#3 '.titleBandLink'",
	 		_el_3
	 	);
	 	// log(
	 	// 	"- renderTest#3-B",
	 	// 	_el_3.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#4");
	 	let _el_4 = document.querySelector(".titleBandLink");
	 	log(
	 		"- renderTest#4-A",
	 		elRender(_el_4)
	 	);
	 	// log(
	 	// 	"- renderTest#4-B",
	 	// 	_el_4.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#5");
	 	let _el_5 = document.querySelectorAll(".titleBandLink");
	 	log(
	 		"- renderTest#5 '.titleBandLink'",
	 		_el_5
	 	);
	 	// log(
	 	// 	"- renderTest#5-B",
	 	// 	_el_5.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#6");
	 	let _el = elRender("#tbUndo");
	 	let _el_6 = elRender(_el);
	 	log(
	 		"- renderTest#6-A",
	 		_el_6
	 	);
	 	// log(
	 	// 	"- renderTest#6-B",
	 	// 	_el_6.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#7");
	 	let _elements = elRender(".titleBandLink");
	 	let _el_7 = elRender(_elements);
	 	log(
	 		"- renderTest#7-A",
	 		_el_7
	 	);
	 	// log(
	 	// 	"- renderTest#7-B",
	 	// 	_el_7.elements[0].el.className
	 	// );
	 // --
	 	log("- startTest#8");
	 	let _element = elRender("#tbUndo");
	 	let _element2 = elRender("#tbRedo");
	 	let _el_8 = elRender(_element)
	 		.after(_element2);
	 	log(
	 		"- renderTest#8-A",
	 		_el_8
	 	);*/
	};

/***/ }
/******/ ]);
//# sourceMappingURL=SolitaireEngine.js.map