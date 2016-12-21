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

	// common

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _inputs = __webpack_require__(4);

	var _inputs2 = _interopRequireDefault(_inputs);

	var _move = __webpack_require__(61);

	var _move2 = _interopRequireDefault(_move);

	var _forceMove = __webpack_require__(25);

	var _forceMove2 = _interopRequireDefault(_forceMove);

	var _render = __webpack_require__(64);

	var _render2 = _interopRequireDefault(_render);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _winCheck = __webpack_require__(62);

	var _winCheck2 = _interopRequireDefault(_winCheck);

	var _history = __webpack_require__(36);

	var _history2 = _interopRequireDefault(_history);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	var _deckGenerator = __webpack_require__(78);

	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// init
	var preloadCallback = null,
	    firstInit = true;

	exports.event = _event2.default;
	exports.options = _defaults2.default;
	exports.winCheck = _winCheck2.default.hwinCheck;
	exports.generator = _deckGenerator2.default;
	exports.version = (9091493405).toString().split(9).slice(1).map(function (e) {
		return parseInt(e, 8);
	}).join('.');

	exports.onload = function (callback) {
		preloadCallback = callback;
	};

	exports.onChangePreferences = function (callback) {
		_share2.default.set('changePreferencesCallback', callback);
	};

	// exports.getPreferences = () => {
	// 	let _pref = storage.get('pref');
	// };

	exports.init = function (gameConfig) {

		_event2.default.dispatch('gameInit', { firstInit: firstInit });

		_event2.default.clearByTag(_event2.default.tags.inGame);
		_event2.default.setTag(_event2.default.tags.inGame);

		_field2.default.clear();
		_field2.default.create(gameConfig);

		if (firstInit) {

			firstInit = false;

			if (typeof preloadCallback == "function") {
				var _data = _share2.default.get('gamePreferencesData');
				preloadCallback(_data);
			}

			var changePreferencesCallback = _share2.default.get('changePreferencesCallback');

			if (typeof changePreferencesCallback == "function") {
				var _data2 = _share2.default.get('gamePreferencesData');
				changePreferencesCallback(_data2);
			}
		}

		_event2.default.dispatch('gameInited');

		exports.Redraw = function (data) {
			_field2.default.Redraw(data);
		};
	};

	if (true) {
		var debug = __webpack_require__(79);
		exports.debug = debug.default;
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 * get
	 * set
	 * getAll
	 * delete
	 */

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
			value: function set(name, data) {
				var forceClone = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


				// "foo", "bar", false
				if (typeof name == "string") {

					_event2.default.dispatch('shareChange:' + name, {
						from: this._data[name],
						to: data
					});

					if (typeof forceClone == "boolean" && forceClone) {
						try {
							// this._data[name] = Object.assign({}, data);
							this._data[name] = ['string', 'number', 'boolean'].includes(typeof data === 'undefined' ? 'undefined' : _typeof(data)) ? data : data instanceof Array ? Object.assign([], data) : Object.assign({}, data);
						} catch (e) {
							this._data[name] = data;
						}
					} else {
						this._data[name] = data;
					}

					_event2.default.dispatch('shareSet:' + name, data);

					// {"foo" : "bar"}, false
				} else if (name instanceof Object) {

					if (typeof data == 'boolean') {
						forceClone = data;
					}

					for (var _name2 in name) {

						_event2.default.dispatch('shareChange:' + name, {
							from: this._data[_name2],
							to: name[_name2]
						});

						if (typeof forceClone == "boolean" && forceClone) {
							try {
								// this._data[_name] = Object.assign({}, name[_name]);
								this._data[_name2] = ['string', 'number', 'boolean'].includes(_typeof(name[_name2])) ? name[_name2] : name[_name2] instanceof Array ? Object.assign([], name[_name2]) : Object.assign({}, name[_name2]);
							} catch (e) {
								this._data[_name2] = name[_name2];
							}
						} else {
							this._data[_name2] = name[_name2];
						}

						_event2.default.dispatch('shareSet:' + _name2, name[_name2]);
					}
				} else {
					console.warn('Error share.set:', _name, name[_name]);
				}
			}
		}, {
			key: 'getAll',
			value: function getAll() {
				return this._data;
			}
		}, {
			key: 'delete',
			value: function _delete(name) {
				delete this._data[name];
			}
		}]);

		return shareClass;
	}();

	exports.default = new shareClass();

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict';

	/*
	 * listen
	 * dispatch
	 * clear
	 * setTag
	 * clearByTag
	 * get
	 * has
	 */

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Event = function () {
		function Event() {
			_classCallCheck(this, Event);

			this.tags = {
				preInit: 'preInit',
				inGame: 'inGame'
			};

			this._tag = this.tags.preInit;

			this._events = {};
		}

		_createClass(Event, [{
			key: 'listen',
			value: function listen(eventName, callback, context) {

				// console.log('listen: (tag:', this._tag + ')', eventName);

				if (typeof callback != 'function' || typeof eventName != 'string') {
					return;
				}

				if (this._events[eventName]) {
					this._events[eventName].push({
						tag: this._tag,
						context: context,
						callback: callback
					});
				} else {
					this._events[eventName] = [{
						tag: this._tag,
						callback: callback
					}];
				}
			}

			// this.do =

		}, {
			key: 'dispatch',
			value: function dispatch(eventName, data) {

				if (this._events[eventName]) {

					for (var i in this._events[eventName]) {

						if (this._events[eventName][i]) {

							this._events[eventName][i].callback(data, {
								eventInfo: {
									eventName: eventName,
									index: i,
									count: this._events[eventName].length
								}
							});
						}
					}
				}
			}
		}, {
			key: 'clear',
			value: function clear() {
				this._events = {};
			}
		}, {
			key: 'setTag',
			value: function setTag(tag) {
				this._tag = tag;
			}
		}, {
			key: 'clearByTag',
			value: function clearByTag(tag) {
				for (var eventName in this._events) {
					for (var i in this._events[eventName]) {
						if (this._events[eventName][i] && this._events[eventName][i].tag == tag) {
							// this._events[eventName][i] = null;
							this._events[eventName] = this._events[eventName].slice(0, i).concat(this._events[eventName].slice((i | 0) + 1));
						}
					}
				}
			}
		}, {
			key: 'get',
			value: function get(eventName, filter) {

				if (filter) {

					var _events = [];

					for (var i in this._events[eventName]) {

						var _correct = true;

						for (var _attr in filter) {

							// if(_attr == "slice") {

							// 	for(let _sliceAttr in filter[_attr]) {

							// 		let _name = _sliceAttr;

							// 		_correct = _correct && this._events[eventName][i][_name].split(':') == filter[_attr][_sliceAttr];
							// 	}
							// } else {
							_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
							// }
						}

						if (_correct) {
							_events.push(this._events[eventName][i]);
						}
					}

					return _events;
				} else {
					return this._events[eventName];
				}
			}
		}, {
			key: 'has',
			value: function has(eventName, filter) {

				if (filter) {

					var _count = 0;

					for (var i in this._events[eventName]) {

						var _correct = true;

						for (var _attr in filter) {
							_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
						}

						if (_correct) {
							_count += 1;
						}
					}

					return _count;
				} else {
					return this._events[eventName] ? this._events[eventName].length : 0;
				}
			}

			// getEventsByName(eventName) {
			// 	return this._events.indexOf(eventName) >= 0 ? this._events[this._events.indexOf(eventName)] : null;
			// }

			// log() {}

		}]);

		return Event;
	}();

	;

	exports.default = new Event();

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {

		// Theme ---------------------------------------------------------------------------------

		"themes": {
			"field": ["default_field", "alternative_field"],
			"face": ["default_face", "alternative_face"],
			"back": ["default_back", "alternative_back"]
			// empty : [
			// 	"default_empty",
			// 	"alternative_empty"
			// ]
		},

		"pref": {
			"field": "default_field", // 0
			"face": "alternative_face", // 1
			"back": "default_back" // 0
		},

		// Tips ----------------------------------------------------------------------------------

		"showTips": true,
		"showTipsDestination": false,
		"showTipPriority": false,
		"canMoveFlip": false,

		"tipsParams": {
			"hideOnEmpty": false,
			"excludeHomeGroups": true
		},

		// Field ---------------------------------------------------------------------------------

		"zoom": 1.0,

		"locale": "ru",

		"animation": true,
		"animationTime": 400, // time in milliseconds

		"inputParams": {
			"doubleClick": false
		},

		// Group ---------------------------------------------------------------------------------

		"flip": null, // param for deck
		"actions": null, // param for deck

		// Deck ----------------------------------------------------------------------------------

		"can_move_flip": false,
		"showSlot": true,
		"autohide": false,

		"paddingType": 'none',
		"flip_type": 'none',

		"rotate": 0,

		"takeRules": ['onlytop'],
		"putRule": 'any',

		"moveDistance": 0,

		"padding_y": 0,
		"padding_x": 0,
		"flip_padding_y": 0, // 5,
		"flip_padding_x": 0, // 20,
		"move_distance": 10,
		"debugLabels": false,

		"startZIndex": 100,
		"topZIndex": 900,

		// Card ----------------------------------------------------------------------------------

		"card": {
			"width": 71,
			"height": 96,

			"suits": ['h', 'd', 'c', 's'],
			"ranks": ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'],
			"values": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
			"ranks36": ['1', '6', '7', '8', '9', '10', 'j', 'q', 'k'],

			"colors": {
				"red": ['h', 'd'],
				"black": ['c', 's']
			}
		},

		// ---------------------------------------------------------------------------------------

		"stepType": 'default',
		"forceClone": true,
		// "movesAnimation"    : "simple" // simple|byStep|not
		"showHistoryAnimation": true

	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _deck3 = __webpack_require__(14);

	var _deck4 = _interopRequireDefault(_deck3);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// -------------------------------------------------------------------------------------------------------------

	var inputs = function () {
		function inputs() {
			var _this = this;

			_classCallCheck(this, inputs);

			_share2.default.set('dragDeck', null);
			_share2.default.set('startCursor', null);

			// event.listen('undo', this._inputUndoRedo());
			// event.listen('redo', this._inputUndoRedo());

			try {

				document.onmousedown = function (data) {

					if (data.button !== 0) {
						return;
					}

					_this.take(data.target, data.clientX, data.clientY);
				};

				document.onmousemove = function (data) {
					_this.drag(data.clientX, data.clientY);
				};

				document.onmouseup = function (data) {
					_this.put(data.target, data.clientX, data.clientY);
				};

				// TODO
				// Решение: (if distance > 0)
				// Click
				// Click
				// Dblclick

				// let timeoutId = null;
				// document.onmouseup = (e) {
				// 	timeoutId && timeoutId = setTimeout(() => {
				// 		this.put(e.target, e.clientX, e.clientY);
				// 		timeoutId = null;
				// 	}, 500);
				// };
				// document.ondblclick =function(){
				// 	clearTimeout(timeoutId);
				// 	this.take(e.target, e.clientX, e.clientY);
				// 	this.put(e.target, e.clientX, e.clientY, true);
				// 	common.curUnLock();
				// };

				document.ondblclick = function (data) {

					_event2.default.dispatch('stopAnimations');

					_this.take(data.target, data.clientX, data.clientY);
					_this.put(data.target, data.clientX, data.clientY, true);

					_common2.default.curUnLock();
				};

				document.addEventListener('touchstart', function (data) {
					// data.preventDefault()
					_this.take(data.target, data.touches[0].clientX, data.touches[0].clientY);
				}, false);

				document.addEventListener('touchmove', function (data) {

					if (_share2.default.startCursor) {
						data.preventDefault();
					}

					_this.drag(data.touches[0].clientX, data.touches[0].clientY);
				}, false);

				document.addEventListener('touchend', function (data) {
					// data.preventDefault()
					_this.put(data.changedTouches[0].target, data.changedTouches[0].clientX, data.changedTouches[0].clientY);
				}, false);
			} catch (e) {}
		}

		_createClass(inputs, [{
			key: 'break',
			value: function _break() {

				var _dragDeck = _share2.default.get('dragDeck');

				if (_dragDeck && _dragDeck[0] && _dragDeck[0].card && _dragDeck[0].card.parent) {

					var _deck = _deck4.default.getDeckById(_dragDeck[0].card.parent);

					if (_deck) {
						_deck.Redraw();
					}
				}

				_share2.default.set('dragDeck', null);
				_share2.default.set('startCursor', null);

				_common2.default.curUnLock();
			}
		}, {
			key: 'take',
			value: function take(target, x, y) {

				_share2.default.set('dragDeck', null);
				_share2.default.set('startCursor', null);

				if (_common2.default.isCurLock() || _share2.default.get('sessionStarted')) {
					return;
				}

				if (target.className.split(' ').includes('slot')) {

					var _id = target.id,
					    _deck = _common2.default.getElementById(_id);

					if (_deck) {
						_event2.default.dispatch('click', {
							to: _deck
						});
					}
				}

				if (target.className.split(' ').includes('draggable')) {

					var _id2 = target.id,
					    _card = _id2 ? _common2.default.getElementById(_id2) : null,
					    _parent = _card && _card.parent ? _card.parent : null,
					    _deck2 = _parent ? _deck4.default.getDeckById(_parent) : null;

					if (_deck2) {
						_event2.default.dispatch('click', {
							to: _deck2
						});
					}

					// _deck.runActions();

					// TODO
					// в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются

					var _dragDeck = _deck2 ? _deck2.Take(_id2) : null;

					_share2.default.set('dragDeck', _dragDeck);

					if (_dragDeck) {

						_share2.default.set('startCursor', { x: x, y: y });

						// ???
						_tips2.default.tipsDestination({ currentCard: _card });
					}
				}
			}

			// -------------------------------------------------------------------------------------------------------------

		}, {
			key: 'drag',
			value: function drag(x, y) {

				if (_common2.default.isCurLock()) {
					return;
				}

				var _startCursor = _share2.default.get('startCursor'),
				    _dragDeck = _share2.default.get('dragDeck');

				if (!_dragDeck || !_startCursor) {
					return;
				}

				// let _distance = _startCursor 
				// 	? Math.sqrt(common.sqr(x - _startCursor.x) + common.sqr(y - _startCursor.y)) 
				// 	: 0;

				var _deck = _common2.default.getElementById(_dragDeck[0].card.parent);

				// let _position = _deck.padding(_dragDeck[_dragDeck.length - 1].index);

				_event2.default.dispatch('dragDeck', {
					x: x, y: y,
					_dragDeck: _dragDeck,
					_startCursor: _startCursor,
					_deck: _deck
				});

				// подсказка лучшего хода до отпускания

				// let cursorMove = {
				// 	distance     : _distance,
				// 	direction    : {
				// 		x     : x - _startCursor.x,// (+) rigth / (-) left
				// 		y     : y - _startCursor.y,// (+) down  / (-) up
				// 		right : x > _startCursor.x,
				// 		left  : x < _startCursor.x,
				// 		down  : y > _startCursor.y,
				// 		up    : y < _startCursor.y
				// 	},
				// 	lastPosition : {x, y},
				// 	deckPosition : {
				// 		x : (_position.x + (x - _startCursor.x)),
				// 		y : (_position.y + (y - _startCursor.y))
				// 	}
				// };

				// Tips.tipsMove({
				// 	moveDeck   : _dragDeck, 
				// 	cursorMove : cursorMove
				// });
			}

			// -------------------------------------------------------------------------------------------------------------

		}, {
			key: 'put',
			value: function put(target, x, y, dbclick) {

				if (_common2.default.isCurLock()) {
					return;
				}

				var _startCursor = _share2.default.get('startCursor'),
				    // начальная позиция курсора
				_dragDeck = _share2.default.get('dragDeck');

				if (!_dragDeck || !_startCursor) {
					return;
				}

				var _deck = _common2.default.getElementById(_dragDeck[0].card.parent);

				var _position = _deck.padding(_dragDeck[0].index);

				var _distance = Math.sqrt(function (i) {
					return i * i;
				}(x - _startCursor.x) + function (i) {
					return i * i;
				}(y - _startCursor.y));

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

				_share2.default.set('lastCursorMove', cursorMove, _defaults2.default.forceClone);

				_event2.default.dispatch('hideCard', target);
				var _dop = document.elementFromPoint(x, y);
				_event2.default.dispatch('showCard', target);

				_event2.default.dispatch('Move', {
					moveDeck: _dragDeck,
					to: _dop.id,
					cursorMove: cursorMove
				});

				_share2.default.set('dragDeck', null);
				_share2.default.set('startCursor', null);
			}
		}]);

		return inputs;
	}();

	exports.default = new inputs();

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

	var _stateManager = __webpack_require__(6);

	var _stateManager2 = _interopRequireDefault(_stateManager);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _history = __webpack_require__(36);

	var _history2 = _interopRequireDefault(_history);

	var _drawPreferences = __webpack_require__(56);

	var _drawPreferences2 = _interopRequireDefault(_drawPreferences);

	var _preferencesEvents = __webpack_require__(58);

	var _preferencesEvents2 = _interopRequireDefault(_preferencesEvents);

	var _defaultPreferences = __webpack_require__(60);

	var _defaultPreferences2 = _interopRequireDefault(_defaultPreferences);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*

	Listeners:

	 * gameInit
	 * gameInited
	 * moveEnd
	 * actionBreak
	 * startSession
	 * stopSession

	 * newGame
	 * historyReapeater

	Methods:

	 * isCurLock
	 * curLock
	 * curUnLock
	 * getElements
	 * getElementById
	 * getElementsByName
	 * validateCardName
	 * genId
	 * animationOn
	 * animationDefault
	 * animationOff

	 */

	_event2.default.listen('gameInit', function (data) {

		_share2.default.set('stepType', _defaults2.default.stepType);
		_share2.default.delete('sessionStarted');

		curUnLock();

		if (!data.firstInit) {
			return;
		};

		(0, _drawPreferences2.default)();
		(0, _preferencesEvents2.default)();
	});

	_event2.default.listen('gameInited', function (e) {
		(0, _defaultPreferences2.default)();
	});

	_event2.default.listen('moveEnd', function (e) {
		_tips2.default.checkTips();
	});

	_event2.default.listen('actionBreak', function (e) {
		_tips2.default.checkTips();
	});

	_event2.default.listen('startSession', function (e) {
		_share2.default.set('sessionStarted', true);
		_stateManager2.default.backup();
	});

	_event2.default.listen('stopSession', function (e) {
		_share2.default.set('sessionStarted', false);
		// stateManager.backup();
	});

	var isCurLock = function isCurLock(e) {
		return _share2.default.get('curLockState');
	};

	var curLock = function curLock(e) {
		_share2.default.set('curLockState', true);
	};

	var curUnLock = function curUnLock(e) {
		_share2.default.set('curLockState', false);
	};

	// getters

	var getElements = function getElements(e) {
		return _share2.default.get('elements');
	};

	var getElementById = function getElementById(id) {

		var _elements = _share2.default.get('elements');

		return _elements[id];
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

	var validateCardName = function validateCardName(name) {

		if (typeof name != 'string') {

			console.warn('Warning: validate name must have string type "' + name + '"', name);

			// throw new Error('validateCardName');

			return false;
		}

		var suit = name.slice(0, 1),
		    rank = name.slice(1, 3),
		    color = null,
		    value = _defaults2.default.card.values[_defaults2.default.card.ranks.indexOf(rank)];

		for (var colorName in _defaults2.default.card.colors) {
			if (_defaults2.default.card.colors[colorName].includes(suit)) {
				color = colorName;
			}
		}

		if (_defaults2.default.card.suits.includes(suit) && _defaults2.default.card.ranks.includes(rank)) {
			return {
				color: color,
				value: value,
				name: name,
				suit: suit,
				rank: rank
			};
		} else {
			console.warn('Warning: validate name:', name, '- incorrect');
			// throw new Error();
			return false;
		}
	};

	// ID generator

	var _id = 0;

	var genId = function genId() {
		return _id += 1;
	};

	// animations

	_share2.default.set('animation', _defaults2.default.animation);

	var animationOn = function animationOn(e) {
		_share2.default.set('animation', true);
	};

	var animationDefault = function animationDefault(e) {
		_share2.default.set('animation', _defaults2.default.animation);
	};

	var animationOff = function animationOff(e) {
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

	_event2.default.listen('historyReapeater', function (data) {
		if (data) {
			_share2.default.set('noRedraw', true);
			_share2.default.set('noTips', true);
		} else {
			_share2.default.set('noRedraw', false);
			_field2.default.Redraw();
			_share2.default.set('noTips', false);
			_tips2.default.checkTips();
		}
	});

	_share2.default.set('stepType', _defaults2.default.stepType);

	exports.default = {
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
		animationDefault: animationDefault
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _getDecks = __webpack_require__(7);

	var _getDecks2 = _interopRequireDefault(_getDecks);

	var _getDeckById = __webpack_require__(8);

	var _getDeckById2 = _interopRequireDefault(_getDeckById);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var cardAttributes = ['parent', 'visible', 'flip'];

	/*
	 * backup
	 * restore
	 * get
	 */

	var stateManager = function () {
		function stateManager() {
			_classCallCheck(this, stateManager);

			this._state = null;

			this._sourceList = ['stepType'];

			this._clearList = ['animatedCallback', 'animatedElements', 'animatedElementsStack', 'curLockState', 'sessionStarted', 'startCursor', 'lastCursorMove'];
		}

		_createClass(stateManager, [{
			key: 'backup',
			value: function backup() {

				this._state = {};

				for (var i in this._sourceList) {

					var _element = _share2.default.get(this._sourceList[i]);

					this._state[this._sourceList[i]] = ['string', 'number', 'boolean'].includes(typeof _element === 'undefined' ? 'undefined' : _typeof(_element)) ? _element : _element instanceof Array ? Object.assign([], _element) : Object.assign({}, _element);
				}

				this._state.model = {};

				var _decks = (0, _getDecks2.default)();

				for (var deckId in _decks) {

					var _cards = [];

					for (var cardId in _decks[deckId].cards) {

						var _card = {
							'name': _decks[deckId].cards[cardId].name,
							'id': _decks[deckId].cards[cardId].id
						};

						for (var _i in cardAttributes) {
							var _name = cardAttributes[_i];
							_card[_name] = _decks[deckId].cards[cardId][name];
						}

						_cards.push(_card);
					}

					this._state.model[deckId] = {
						'name': _decks[deckId].name,
						'cards': _cards,
						'group': _decks[deckId].parent
					};
				}
			}
		}, {
			key: 'restore',
			value: function restore() {

				if (!this._state) {

					console.warn('Restore fail. Store is empty.');

					return;
				}

				// restore share
				for (var i in this._clearList) {
					_share2.default.delete(this._clearList[i]);
				}

				for (var _i2 in this._sourceList) {
					_share2.default.set(this._sourceList[_i2], this._state[this._sourceList[_i2]], true);
				}

				for (var deckId in this._state.model) {

					var _deck = (0, _getDeckById2.default)(deckId);

					var _cards = [];

					for (var _i3 in this._state.model[deckId].cards) {

						var cardId = this._state.model[deckId].cards[_i3].id;

						var _card = _common2.default.getElementById(cardId);

						if (_card.name == this._state.model[deckId].cards[_i3].name) {

							for (var _i4 in cardAttributes) {
								var _name = cardAttributes[_i4];
								_card[_name] = this._state.model[deckId].cards[_i4][name];
							}

							_cards.push(_card);
						} else {
							// console.warn(
							// 	'Что-то не так с картой'               ,
							// 	this._state.model[deckId].cards[i].id  ,
							// 	this._state.model[deckId].cards[i].name,
							// 	' != '                                 ,
							// 	_card.id                               ,
							// 	_card.name
							// );
						}
					}

					_deck.cards = _cards;
					_deck.Redraw();
				}
			}
		}, {
			key: 'get',
			value: function get() {
				return this._state;
			}
		}]);

		return stateManager;
	}();

	exports.default = new stateManager();

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (data) {

		var _decks = {};

		var _elements = _share2.default.get('elements');

		if (data && data.visible) {

			for (var deckId in _elements) {
				if (_elements[deckId].type == 'deck') {
					if (_elements[deckId].visible) {
						_decks[deckId] = _elements[deckId];
					}
				};
			};
		} else {
			for (var _deckId in _elements) {
				if (_elements[_deckId].type == 'deck') {
					_decks[_deckId] = _elements[_deckId];
				};
			};
		}

		return _decks;
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (id) {

		var _elements = _share2.default.get('elements');

		return _elements[id] && _elements[id].type == 'deck' ? _elements[id] : false;
	};

/***/ },
/* 9 */
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

	var _allToAll = __webpack_require__(10);

	var _allToAll2 = _interopRequireDefault(_allToAll);

	var _bestTip = __webpack_require__(11);

	var _bestTip2 = _interopRequireDefault(_bestTip);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var _showTips = _defaults2.default.showTips;

	var tipTypes = ['tip', 'tipTo', 'tipPriority', 'tipToHome'];

	var _tips = [];

	var getTips = function getTips(e) {
		return _tips;
	};

	var checkTips = function checkTips(e) {

		if (_share2.default.get('noTips')) {
			return false;
		}

		_event2.default.dispatch('hideTips');

		var _decks = _deck2.default.getDecks({ visible: true });

		_tips = (0, _allToAll2.default)({
			decks: _decks
		});

		if (_tips.length == 0 && _share2.default.get('stepType') == _defaults2.default.stepType) {

			_event2.default.dispatch('noTips');
			console.log('No possible moves.');
		}

		// let _showTips = share.get('showTips')
		if (_showTips) {

			var _homeGroups = _field2.default.homeGroups;

			for (var i in _tips) {

				// TODO инициализировать "hideTipsInDom" в Field.js 
				if (_tips[i].to.count === 0 && _field2.default.tipsParams.hideOnEmpty || _field2.default.tipsParams.excludeHomeGroups && _homeGroups && _homeGroups.length && _homeGroups.includes(_tips[i].from.deck.parent)) {
					// ?#$%&!
				} else {

					_event2.default.dispatch('showTip', {
						el: _tips[i].from.card,
						type: 'tip'
					});
				}

				if (_homeGroups.includes(_tips[i].to.deck.parent)) {
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

	var showTips = function showTips(data) {

		_showTips = true;

		if (data && data.init) {
			return;
		}

		checkTips();
	};
	_event2.default.listen('tipsON', showTips);

	var hideTips = function hideTips(data) {

		_showTips = false;

		if (data && data.init) {
			return;
		}

		checkTips();
	};
	_event2.default.listen('tipsOFF', hideTips);

	// --------------------------------------------------------

	var tipsMove = function tipsMove(data) {

		if (!_share2.default.get('showTipPriority')) {
			return;
		}

		_event2.default.dispatch('hideTips', { types: ['tipPriority'] });

		if (_share2.default.showTipPriority && data && data.moveDeck && data.cursorMove && data.cursorMove.distance && data.cursorMove.distance >= _share2.default.moveDistance) {

			var Tip = (0, _bestTip2.default)(data.moveDeck, data.cursorMove);

			if (Tip) {

				_event2.default.dispatch('showTip', {
					el: Tip.to.deck,
					type: 'tipPriority'
				});
			}
		}
	};

	// --------------------------------------------------------

	var tipsDestination = function tipsDestination(data) {

		if (_share2.default.get('showTipsDestination')) {

			_event2.default.dispatch('hideTips');

			if (data && data.currentCard && data.currentCard.id) {
				for (var i in _tips) {
					if (_tips[i].from.card.id == data.currentCard.id) {

						_event2.default.dispatch('showTip', {
							'el': _tips[i].to.deck,
							'type': 'tipTo'
						});
					}
				}
			}
		}
	};

	var checkFrom = function checkFrom(from) {

		for (var i in _tips) {
			if (_tips[i].from.deck.name == from) {
				return true;
			}
		}

		return false;
	};

	var fromTo = function fromTo(from, to) {

		for (var i in _tips) {
			if (_tips[i].from.deck.name == from && _tips[i].to.deck.name == to) {
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
		checkFrom: checkFrom,
		fromTo: fromTo,
		tipsDestination: tipsDestination
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var allToAll = function () {
		function allToAll() {
			_classCallCheck(this, allToAll);

			this._decks = null;
			this._moves = [];
		}

		// 1)
		// пробегаем все колоды


		_createClass(allToAll, [{
			key: 'get',
			value: function get(data) {

				this._decks = data.decks;
				this._moves = [];

				for (var deckIndex in this._decks) {

					var _cards = this._decks[deckIndex].cards;
					// each cards in  current deck
					this.cardsInTakeDeck(_cards, deckIndex);
				};

				return this._moves;
			}

			// 2)
			// выбираем карты из колоды
			// патаемся взять карту

		}, {
			key: 'cardsInTakeDeck',
			value: function cardsInTakeDeck(_cards, deckIndex) {

				for (var cardIndex in _cards) {

					var _id = _cards[cardIndex].id;

					var _take = this._decks[deckIndex].Take(_id);

					if (_take) {
						this.decksToPut(_cards, _take, deckIndex, cardIndex);
					};
				};
			}

			// 3)
			// пробегаем все остальные колоды и пробуем положить на них то что взяли

		}, {
			key: 'decksToPut',
			value: function decksToPut(_cards, _take, deckIndex, cardIndex) {

				for (var deckIndex_2 in this._decks) {

					if (deckIndex != deckIndex_2) {

						var _put = this._decks[deckIndex_2].Put(_take);
						if (_put) {
							this.put(deckIndex_2, deckIndex, cardIndex, _cards);
						};
					};
				};
			}

			// 4)
			// если получилось положить карты (с текущими правилами) записываем как возможный ход

		}, {
			key: 'put',
			value: function put(deckIndex_2, deckIndex, cardIndex, _cards) {

				var _cards_to = this._decks[deckIndex_2].cards,
				    _card_to = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;

				this._moves.push({

					from: {
						deck: this._decks[deckIndex],
						card: _cards[cardIndex], // firstCard of moved deck
						count: _cards.length
						// deckName : this._decks[deckIndex].name
					},

					to: {
						deck: this._decks[deckIndex_2],
						lastCard: _card_to,
						count: _cards_to.length
						// deckName : this._decks[deckIndex_2].name
					}
				});
			}
		}]);

		return allToAll;
	}();

	;

	var _allToAll = new allToAll();

	exports.default = function (data) {
		return _allToAll.get(data);
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _tips4 = __webpack_require__(9);

	var _tips5 = _interopRequireDefault(_tips4);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (moveDeck, cursorMove) {

		var _autoTips = [];

		// выбрать подсказки для стопки из кторорой взяли карты
		var _tips = _tips5.default.getTips();
		for (var i in _tips) {
			if (_tips[i].from.card.id == moveDeck[0].card.id) {
				_autoTips.push(_tips[i]);
			}
		}

		if (_autoTips.length == 0) {
			return false;
		}

		// move card to closest deck of a possible move
		var _tip_index = 0,
		    _in_direction_count = 0,
		    _min_distance = -1;

		// Приоритет для homeGroups
		var _homeGroups = _field2.default.homeGroups;

		if (_homeGroups) {

			var _tips2 = [];

			for (var homeGroupIndex in _homeGroups) {

				for (var _i in _autoTips) {
					if (_autoTips[_i].to.deck.parent == _homeGroups[homeGroupIndex]) {
						_tips2.push(_autoTips[_i]);
					}
				}
			}

			// есть подсказки ведущие в homeGroups
			if (_tips2.length) {
				_autoTips = _tips2;
			}
		}

		// вариантов несколько
		if (_autoTips.length > 1) {

			// у пустых стопок назначения приоритет меньше
			for (var _i2 = 0; _i2 < _autoTips.length; _i2 += 1) {

				var _tips3 = [];

				if (_autoTips[_i2].to.deck.cardsCount()) {
					_tips3.push(_autoTips[_i2]);
				}

				if (_tips3.length) {
					_autoTips = _tips3;
				}
			}

			for (var _i3 in _autoTips) {

				// координаты центра перетаскиваемой карты/стопки
				var center_from = {
					x: cursorMove.deckPosition.x + (_defaults2.default.card.width / 2 | 0),
					y: cursorMove.deckPosition.y + (_defaults2.default.card.height / 2 | 0)
				};

				var _destination_deck_last_card_position = _autoTips[_i3].to.deck.padding(_autoTips[_i3].to.deck.cards.length);
				// координаты центра стопки назначения
				var center_to = {
					x: _destination_deck_last_card_position.x + (_defaults2.default.card.width / 2 | 0),
					y: _destination_deck_last_card_position.y + (_defaults2.default.card.height / 2 | 0)
				};

				// расстояние между стопкой и перетаскиваемой картой/стопкой
				_autoTips[_i3].distance = Math.sqrt(function (i) {
					return i * i;
				}(center_from.x - center_to.x) + function (i) {
					return i * i;
				}(center_from.y - center_to.y));

				// смотрим находится ли стопка назначения в направлении движения
				_autoTips[_i3].inDirection = false;
				if (cursorMove.direction.x > 0 && center_to.x > center_from.x || cursorMove.direction.x < 0 && center_to.x < center_from.x) {
					_autoTips[_i3].inDirection = true;
					_in_direction_count += 1;
				}
			}

			// ищем ближайшую стопку среди из подсказок
			for (var _i4 in _autoTips) {

				// первая итерация
				if (_min_distance == '-1') {

					// нет подсказок в направлении движения
					if (_in_direction_count == 0) {
						_min_distance = _autoTips[_i4].distance;

						// есть подсказки в направлении движения
					} else {
						if (_autoTips[_i4].inDirection) {
							_min_distance = _autoTips[_i4].distance;
							_tip_index = _i4;
						}
					}
				} else {

					// нашли меньше
					if (_autoTips[_i4].distance < _min_distance) {

						// нет подсказок в направлении движения
						if (_in_direction_count == 0) {
							_min_distance = _autoTips[_i4].distance;
							_tip_index = _i4;

							// есть подсказки в направлении движения
						} else {
							if (_autoTips[_i4].inDirection) {
								_min_distance = _autoTips[_i4].distance;
								_tip_index = _i4;
							}
						}
					}
				}
			}
			// _tip_index - номер ближайшей стопки в направлении движения
		}

		return _autoTips[_tip_index];
	};

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _group2 = __webpack_require__(13);

	var _group3 = _interopRequireDefault(_group2);

	var _deck2 = __webpack_require__(14);

	var _deck3 = _interopRequireDefault(_deck2);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	var _addAutoSteps = __webpack_require__(52);

	var _addAutoSteps2 = _interopRequireDefault(_addAutoSteps);

	var _storage = __webpack_require__(55);

	var _storage2 = _interopRequireDefault(_storage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// Model
	// let values = {
	// 	"homeGroups": {
	// 		"type": ["array", "string"],
	// 		"value": [],
	// 		"dest": "array"
	// 	}
	// }

	/*
	 * create
	 * Redraw
	 * clear
	 */

	var Field = function () {
		function Field() {
			_classCallCheck(this, Field);

			_share2.default.set('elements', {});

			this.tipsParams = {};
			this.inputParams = {};
		}

		_createClass(Field, [{
			key: 'create',
			value: function create(data) {

				this.homeGroups = data.homeGroups ? data.homeGroups : [];

				// вкл./выкл. подсказок
				if (typeof data.showTips == 'boolean' && data.showTips) {
					_tips2.default.showTips({ init: true });
				} else {
					_tips2.default.hideTips({ init: true });
				}

				// устанвливаем тип хода по умолчанию
				_share2.default.set('stepType', _defaults2.default.stepType);

				var _values = {
					"showTipsDestination": "boolean", // Альтернативные подсказки
					"showTipPriority": "boolean",
					"moveDistance": "number",
					"zoom": "number", // масштаб отображения
					// "movesAnimation"       : "string" ,
					"animationTime": "number", // время анимации
					"showHistoryAnimation": "boolean"
				};

				for (var valueName in _values) {
					_share2.default.set(valueName, _typeof(data[valueName]) == _values[valueName] ? data[valueName] : _defaults2.default[valueName]);
				}

				// условие выигрыша
				_share2.default.set('winCheck', data.winCheck);

				// Настройки игры
				if (data.preferences) {

					var _pref = _storage2.default.get('pref'),
					    _preferences = {},
					    _prefData = {};

					for (var prefName in data.preferences) {
						if (typeof prefName == "string") {

							_preferences[prefName] = data.preferences[prefName];

							_prefData[prefName] = _pref && typeof _pref[prefName] != "undefined" ? _pref[prefName] : data.preferences[prefName].value;
						}
					}

					_share2.default.set('gamePreferences', _preferences);
					_share2.default.set('gamePreferencesData', _prefData);
				} else {
					_share2.default.set('gamePreferences', {});
				}

				// параметры отображения подсказок
				for (var tipParamName in _defaults2.default.tipsParams) {
					this.tipsParams[tipParamName] = data.tipsParams && typeof data.tipsParams[tipParamName] != "undefined" ? data.tipsParams[tipParamName] : _defaults2.default.tipsParams[tipParamName];
				}

				// параметры ввода
				for (var inputParamName in _defaults2.default.inputParams) {
					this.inputParams[inputParamName] = data.inputParams && typeof data.inputParams[inputParamName] != "undefined" ? data.inputParams[inputParamName] : _defaults2.default.inputParams[inputParamName];
				}

				// дополнительные параметры отображения
				// начальная позиция порядка отображения элементов
				if (data.startZIndex && typeof data.startZIndex == 'number') {
					_share2.default.set('start_z_index', data.startZIndex);
				}

				// инициализация автоходов
				if (data.autoSteps) {
					this.autoSteps = (0, _addAutoSteps2.default)(data.autoSteps);
				}

				// NOTE: на событие подписан deckActions
				// если ставить позже отрисовки элементов, переделать
				_event2.default.dispatch('initField', data);

				// Отрисовка элементов
				if (data.groups) {
					for (var groupName in data.groups) {
						data.groups[groupName].name = groupName;
						_group3.default.add(data.groups[groupName]);
					}
				}

				if (data.decks) {
					for (var e in data.decks) {
						_deck3.default.addDeck(data.decks[e]);
					}
				}

				if (data.fill) {

					var _decks = _deck3.default.getDecks();
					var _fill = null;
					try {
						_fill = Object.assign([], data.fill);
					} catch (e) {
						_fill = data.fill;
					}

					for (; _fill.length;) {
						for (var deckId in _decks) {
							if (_fill.length) {
								var _card = _fill.shift();
								_decks[deckId].Fill([_card]);
							}
						}
					}
				}

				// Найти возможные ходы
				_tips2.default.checkTips();

				// событие: игра началась
				_event2.default.dispatch('newGame');
			}
		}, {
			key: 'Redraw',
			value: function Redraw(data) {

				// прокидываеем <новую> конфигурацию
				if (data) {

					// ерерисовываем все группы и стопки в них
					for (var _groupName in data.groups) {

						var _group = _group3.default.getByName(_groupName);

						if (_group) {
							_group.Redraw(data.groups[_groupName]);
						}
					}

					// перерисовываем отдельно стоящие стопки
					for (var i in data.decks) {

						var _deck = _deck3.default.getDeck(data.decks[i].name);

						if (_deck) {
							_deck.Redraw(data.decks[i]);
						}
					}

					// перерисовка без конфигурации
				} else {

					// получаем все существующие стопки
					var _decks = _deck3.default.getDecks();

					// перерисовываем каждую
					for (var _i in _decks) {
						_decks[_i].Redraw();
					}
				}
			}
		}, {
			key: 'clear',
			value: function clear() {

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
			}
		}]);

		return Field;
	}();

	exports.default = new Field();

/***/ },
/* 13 */
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

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _groupFill = __webpack_require__(39);

	var _groupFill2 = _interopRequireDefault(_groupFill);

	var _groupRedraw = __webpack_require__(40);

	var _groupRedraw2 = _interopRequireDefault(_groupRedraw);

	var _groupGenerator = __webpack_require__(41);

	var _groupGenerator2 = _interopRequireDefault(_groupGenerator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var params = {
		"paddingType": { "type": "any" },
		"flip": { "type": "any" },
		"showSlot": { "type": "any" },
		"takeRules": { "type": "any" },
		"putRules": { "type": "any" },
		"fullRules": { "type": "any" },
		"autoHide": { "type": "any" },
		"paddingX": { "type": "any" },
		"paddingY": { "type": "any" },
		"flipPaddingX": { "type": "any" },
		"flipPaddingY": { "type": "any" },
		"actions": { "type": "any" },
		"tags": { "type": "any" },
		"save": {
			"type": "boolean",
			"default": true
		}
	};

	/*
	 * addDeck
	 * Fill
	 * getDeckById
	 * getDeckIndexById
	 * getDeckIdByIndex
	 * decksCount
	 * getDeckByIndex
	 * getDecksByName
	 * getDecks
	 * Redraw
	 * hasDeck
	 */

	var groupClass = function () {
		function groupClass(data, id) {
			_classCallCheck(this, groupClass);

			this.type = 'group';

			this.id = id;

			this.name = data.name && typeof data.name == 'string' ? data.name : 'name_' + id;

			this.position = {
				x: data.position && data.position.x && typeof data.position.x == 'number' ? data.position.x : 0,
				y: data.position && data.position.y && typeof data.position.y == 'number' ? data.position.y : 0
			};

			this.placement = data.placement ? {
				x: data.placement.x ? data.placement.x : 0,
				y: data.placement.y ? data.placement.y : 0
			} : null;

			this.decks = {};

			// сохраняем атрибуты чтобы прокинуть их колодам
			this.parameters = {};
			for (var paramName in params) {
				if (params[paramName].type == "any") {
					this.parameters[paramName] = data[paramName] ? data[paramName] : _defaults2.default[paramName];
				} else if (params[paramName].type == "boolean") {
					this.parameters[paramName] = typeof data[paramName] == "boolean" ? data[paramName] : params[paramName].default;
					// this.parameters[paramName] = typeof data[paramName] == "boolean" ? data[paramName] : defaults[paramName];
				}
			};

			this.deckIndex = [];

			this.tags = data.tags;
		}

		// Add deck to group


		_createClass(groupClass, [{
			key: 'addDeck',
			value: function addDeck(data) {

				if (!data) {
					return;
				}

				if (!data.position) {
					data.position = {
						'x': 0,
						'y': 0
					};
				}

				// сортировка элементов в группе по заданному индексу и порядку добавления

				// if(!data.position.x) { data.position.x = 0; }
				// if(!data.position.y) { data.position.y = 0; }

				if (!data.parent) {
					data.parent = this.name;
				}

				data.parentPosition = {
					x: this.position.x,
					y: this.position.y
				};

				// расставляем колоды в группе
				// 1 приоретет отдаётся параметру groupIndex
				// остальные вставляются в промежутки или добавляются в конец
				var _index = 0;

				if (data.groupIndex && decks[this.deckIndex[data.groupIndex - 1]].this.deckIndex == data.this.deckIndex && typeof data.groupIndex == 'number' && this.deckIndex[data.groupIndex - 1]) {
					console.warn('Warning: duplicate groupIndex', data.groupIndex, 'changed to null');
					data.groupIndex = null;
				}

				if (data.groupIndex && typeof data.groupIndex == 'number') {

					if (this.deckIndex[data.groupIndex - 1]) {

						for (; typeof this.deckIndex[_index] != 'undefined'; _index += 1) {}

						if (placement) {

							var _index2 = this.deckIndex[data.groupIndex - 1];

							var _elements = _share2.default.get('elements');

							if (placement.x) {
								_elements[_index2].x(this.position.x + (placement.x + _defaults2.default.card.width) * _index2);
							}

							if (placement.y) {
								_elements[_index2].y(this.position.y + (placement.y + _defaults2.default.card.width) * _index2);
							}

							_share2.default.set('elements', _elements);
						}

						this.deckIndex[_index] = this.deckIndex[data.groupIndex - 1];
						this.deckIndex[data.groupIndex - 1] = true;

						_index = data.groupIndex - 1;
					} else {

						this.deckIndex[data.groupIndex - 1] = true;

						_index = data.groupIndex - 1;
					}
				} else {
					for (; typeof this.deckIndex[_index] != 'undefined'; _index += 1) {};
					this.deckIndex[_index] = true;
				}

				// смещаем координаты колод относительно координад группы
				if (this.placement) {

					if (this.placement.x) {
						data.position.x = (this.placement.x + _defaults2.default.card.width) * _index;
					}

					if (this.placement.y) {
						data.position.y = (this.placement.y + _defaults2.default.card.height) * _index;
					}
				}

				// прокидываем некоторые атрибуты всем колодам группы (у атрибутов заданных колоде приоритет выше)
				for (var paramName in params) {

					if (params[paramName].type == "any") {
						if (this.parameters[paramName] && typeof data[paramName] == "undefined") {
							data[paramName] = this.parameters[paramName];
						};
					} else if (params[paramName].type == "boolean") {

						if (typeof this.parameters[paramName] == "boolean" && typeof data[paramName] == "undefined") {
							data[paramName] = this.parameters[paramName];
						}
					}
				};

				data.deckIndex = typeof data.deckIndex == "number" ? data.deckIndex : (_index | 0) + 1;

				var _el = _deck2.default.addDeck(data);

				this.deckIndex[_index] = _el.id;
				this.decks[_el.id] = _el;
			}

			// Fill group

		}, {
			key: 'Fill',
			value: function Fill(cardNames) {
				(0, _groupFill2.default)(this, cardNames);
			}
		}, {
			key: 'getDeckById',
			value: function getDeckById(id) {
				return this.decks[id];
			}
		}, {
			key: 'getDeckIndexById',
			value: function getDeckIndexById(id) {

				for (var i in this.deckIndex) {
					if (this.deckIndex[i] == id) {
						return i;
					}
				}

				return null;
			}
		}, {
			key: 'getDeckIdByIndex',
			value: function getDeckIdByIndex(index) {
				return this.deckIndex[(index | 0) - 1];
			}
		}, {
			key: 'getDeckByIndex',
			value: function getDeckByIndex(index) {

				var id = this.getDeckIdByIndex(index);

				return this.getDeckById(id);
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
			value: function getDecks(data) {

				var _decks = [];

				for (var i in this.decks) {
					if (data && data.visible) {
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
			value: function Redraw(data) {
				(0, _groupRedraw2.default)(this, data);
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
		}, {
			key: 'decksCount',
			get: function get() {

				var _count = 0;

				for (var i in this.decks) {
					_count += 1;
				}

				return _count;
			}
		}]);

		return groupClass;
	}();

	// -----------------------------------------------------------------------------------------------------------------------

	var add = function add(data) {

		if (!data) {
			return false;
		}

		if (!data.decks) {
			return false;
		}

		var id = 'group_' + _common2.default.genId();

		var _el_group = new groupClass(data, id);

		if (data.decks) {

			if (typeof data.decks == 'number') {
				data.decks = {
					"generator": {
						"type": "count",
						"count": data.decks
					}
				};
			}

			if (data.decks.generator) {

				if (data.decks.generator.type) {

					if (_groupGenerator2.default[data.decks.generator.type]) {

						data.decks = _groupGenerator2.default[data.decks.generator.type](_el_group, data.decks.generator);
					} else {
						console.warn('Deck generator type "' + data.decks.generator.type + '" not found.');
						return;
					}
				} else {
					console.warn('Deck generator type is null.');
					return;
				};

				data.placement = null;
			}

			// relations TO <-> FROM
			// if( data.backRelations ) TODO
			for (var to in data.decks) {

				for (var relId in data.decks[to].relations) {

					var _relation = null;
					try {
						_relation = Object.assign({}, data.decks[to].relations[relId]);
					} catch (e) {
						_relation = data.decks[to].relations[relId];
					}

					for (var from in data.decks) {

						if (data.decks[from].name == _relation.to) {
							_relation.to = null;
							_relation.from = data.decks[to].name;
							data.decks[from].relations.push(_relation);
						}
					}
				}
			}

			for (var d in data.decks) {
				_el_group.addDeck(data.decks[d]);
			};
		}

		var _elements = _share2.default.get('elements');
		_elements[id] = _el_group;
		_share2.default.set('elements', _elements);

		// fill group
		if (data && data.fill) {

			var _checkFillDeck = data.fill.length;
			if (_checkFillDeck) {
				_el_group.Fill(data.fill);
			}
		}

		return _el_group;
	};

	// TODO rename to "getByName"
	var getByName = function getByName(name) {
		return _common2.default.getElementsByName(name, 'group')[0];
	};

	exports.default = {
		getByName: getByName,
		add: add
	};

/***/ },
/* 14 */
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

	var _flipTypes = __webpack_require__(15);

	var _flipTypes2 = _interopRequireDefault(_flipTypes);

	var _readyPutRules = __webpack_require__(16);

	var _readyPutRules2 = _interopRequireDefault(_readyPutRules);

	var _readyTakeRules = __webpack_require__(18);

	var _readyTakeRules2 = _interopRequireDefault(_readyTakeRules);

	var _fullRules = __webpack_require__(19);

	var _fullRules2 = _interopRequireDefault(_fullRules);

	var _paddingTypes = __webpack_require__(20);

	var _paddingTypes2 = _interopRequireDefault(_paddingTypes);

	var _deckActions = __webpack_require__(21);

	var _deckActions2 = _interopRequireDefault(_deckActions);

	var _deckTake = __webpack_require__(33);

	var _deckTake2 = _interopRequireDefault(_deckTake);

	var _deckPut = __webpack_require__(34);

	var _deckPut2 = _interopRequireDefault(_deckPut);

	var _genCardByName2 = __webpack_require__(35);

	var _genCardByName3 = _interopRequireDefault(_genCardByName2);

	var _group = __webpack_require__(13);

	var _group2 = _interopRequireDefault(_group);

	var _history = __webpack_require__(36);

	var _history2 = _interopRequireDefault(_history);

	var _getDecks = __webpack_require__(7);

	var _getDecks2 = _interopRequireDefault(_getDecks);

	var _getDeckById = __webpack_require__(8);

	var _getDeckById2 = _interopRequireDefault(_getDeckById);

	var _deckCardNames = __webpack_require__(37);

	var _deckCardNames2 = _interopRequireDefault(_deckCardNames);

	var _getDeck = __webpack_require__(38);

	var _getDeck2 = _interopRequireDefault(_getDeck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 * Redraw
	 * getTopCard
	 * lock
	 * unlock
	 * flipCheck
	 * checkFull
	 * Fill
	 * clear
	 * Push
	 * Pop
	 * Take
	 * Put
	 * genCardByName
	 * hide
	 * show
	 * getCards
	 * hideCards
	 * showCards
	 * getCardsNames
	 * cardsCount
	 * getRelationsByName
	 * hasTag
	 */

	var Deck = function () {
		function Deck(data, id) {
			var _this = this;

			_classCallCheck(this, Deck);

			if (!data) {
				return false;
			}

			this.cards = [];

			// parameters
			this.type = 'deck';
			this.full = false;

			this.id = id;

			var _parent_el = _group2.default.getByName(data.parent),
			    _parent_name = _parent_el ? _parent_el.name : 'no_parent_',
			    _new_id = _parent_el ? _parent_el.getDecks().length : id;

			this.name = typeof data.name == 'string' ? data.name : _parent_name + '_' + _new_id;

			this.locked = data.locked ? true : false;
			this.save = data.save ? true : false;
			this.visible = typeof data.visible == 'boolean' ? data.visible : true;
			this.deckIndex = typeof data.deckIndex == 'number' ? data.deckIndex : null;
			this.parent = typeof data.parent == 'string' ? data.parent : 'field';
			this.autoHide = typeof data.autoHide == 'boolean' ? data.autoHide : _defaults2.default.autohide;

			// changed parameters
			if (typeof data.showSlot == "undefined") {
				data.showSlot = _defaults2.default.showSlot;
			}

			this._params = {
				padding_y: typeof data.paddingY == 'number' ? data.paddingY : _defaults2.default.padding_y,
				flip_padding_y: typeof data.flipPaddingY == 'number' ? data.flipPaddingY : _defaults2.default.flip_padding_y,
				padding_x: typeof data.paddingX == 'number' ? data.paddingX : _defaults2.default.padding_x,
				flip_padding_x: typeof data.flipPaddingX == 'number' ? data.flipPaddingX : _defaults2.default.flip_padding_x,
				startZIndex: typeof data.startZIndex == 'number' ? data.startZIndex : _defaults2.default.startZIndex,
				rotate: typeof data.rotate == 'number' ? data.rotate : _defaults2.default.rotate,
				x: 0,
				y: 0
			};

			this.rotate = this._params.rotate;

			// Flip
			var flipType = data.flip && typeof data.flip == 'string' ? data.flip : _defaults2.default.flip_type;

			this.cardFlipCheck = _flipTypes2.default[flipType];

			// Put
			this.putRules = data.putRules ? typeof data.putRules == 'function' ? data.putRules : typeof data.putRules == 'string' ? _readyPutRules2.default[data.putRules] ? _readyPutRules2.default[data.putRules] : _readyPutRules2.default[_defaults2.default.putRule] : data.putRules.constructor == Array ? data.putRules : _readyPutRules2.default[_defaults2.default.putRule] : _readyPutRules2.default[_defaults2.default.putRule];

			// Take
			// можно ли взять карту/стопку
			this.takeRules = data.takeRules;

			// Full
			this.fullRules = null;

			if (data.fullRules) {
				this.fullRules = data.fullRules;
			}

			// Padding
			// порядок карт в колоде
			var padding = data.paddingX || data.paddingY ? _paddingTypes2.default.special : data.paddingType ? typeof data.paddingType == 'string' && _paddingTypes2.default[data.paddingType] ? _paddingTypes2.default[data.paddingType] : _paddingTypes2.default.none : _paddingTypes2.default[_defaults2.default.paddingType];

			this.padding = function (index) {
				return padding(_this._params, _this.cards[index], index, _this.cards.length, _this.cards);
			};

			this.actions = [];
			if (data.actions) {
				this.actions = data.actions;
				_deckActions2.default.add(this);
			}

			// Relations
			if (data.relations) {
				this.relations = data.relations;
			} else {
				this.relations = [];
			}

			// Tags
			this.tags = data.tags ? data.tags : [];

			_event2.default.dispatch('addDeckEl', {
				deckData: data,
				deck: this,
				params: this._params
			});

			// Подписывается на перетаскивание стопки/карты
			var _callback = function _callback(data) {

				// TODO
				// проверять fill только для тех стопок котрые участвовали в Action

				if (data.destination.name != _this.name) {
					return;
				}

				_this.checkFull();
			};

			_event2.default.listen('moveDragDeck', _callback);
		}

		// -------------------------------------------------------------------------------------------------

		// перерисовка стопки


		_createClass(Deck, [{
			key: 'Redraw',
			value: function Redraw(data) {

				_event2.default.dispatch('redrawDeck', {
					deck: this,
					deckData: data,
					params: this._params,
					cards: this.cards
				});

				_event2.default.dispatch('redrawDeckFlip', {
					cards: this.cards
				});
			}
		}, {
			key: 'getTopCard',
			value: function getTopCard() {

				if (this.cards.length == 0) {
					return false;
				}

				return this.cards[this.cards.length - 1];
			}
		}, {
			key: 'lock',
			value: function lock() {
				this.locked = true;
			}
		}, {
			key: 'unlock',
			value: function unlock() {
				this.locked = false;
			}
		}, {
			key: 'flipCheck',
			value: function flipCheck() {

				for (var cardIndex in this.cards) {
					this.cardFlipCheck(this.cards[cardIndex], cardIndex | 0, this.cards.length);
				}

				_event2.default.dispatch('redrawDeckFlip', this);
			}
		}, {
			key: 'checkFull',
			value: function checkFull() {

				if (!this.full && this.fullRules && this.fullRules.length > 0) {

					var full = true;

					for (var ruleIndex in this.fullRules) {

						var _rule = this.fullRules[ruleIndex];

						if (typeof _rule == "string") {
							console.log('###', _rule, this.name);
							full = full && typeof _fullRules2.default[_rule] == "function" && _fullRules2.default[_rule](this);
						} else {

							for (var subRule in _rule) {
								if (typeof subRule == "string" && typeof _fullRules2.default[subRule] == "function") {
									full = full && _fullRules2.default[subRule](this, _rule[subRule]);
								}
							}

							// if(_rule.query) {
							// 	fullRules._query(this, _rule.query)
							// }
						}
					}

					this.full = full;
				}

				return this.full;
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

				for (var i in deck) {
					deck[i].parent = this.id;
					this.cards.push(deck[i]);
				}
			}
		}, {
			key: 'Pop',
			value: function Pop(count, clearParent) {

				if (this.cards.length < count) {
					return false;
				}

				var _deck = [];
				for (; count; count -= 1) {
					var _pop = this.cards.pop();
					if (clearParent) _pop.parent = null;
					_deck.push(_pop);
					_deck[_deck.length - 1].parent = null;
				}
				_deck.reverse();

				// что делать если вынули все карты
				if (this.autoHide && this.cards.length == 0) {
					this.hide();
				}

				this.Redraw();

				return _deck;
			}
		}, {
			key: 'Take',
			value: function Take(cardId) {
				return (0, _deckTake2.default)(this, cardId);
			}

			// проверяем, можем ли положить стопку/карту
			// возвращает true, если согласно правилам сюда можно положить карту

		}, {
			key: 'Put',
			value: function Put(putDeck) {
				return (0, _deckPut2.default)(this, putDeck);
			}

			// создать карту

		}, {
			key: 'genCardByName',
			value: function genCardByName(name) {
				return (0, _genCardByName3.default)(this, name);
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

			// getCardsByName(cardName) {
			// 	var _cards = [];
			// 	for(var i in this.cards) {
			// 		if(this.cards[i].name == cardName) {
			// 			_cards.push(this.cards[i]);
			// 		}
			// 	}
			// 	return _cards;
			// }

			// Card(cardName) {
			// 	return this.getCardsByName(cardName)[0];
			// }

		}, {
			key: 'getCards',
			value: function getCards() {

				return this.cards;

				// let _cards = [];
				// for(let i in this.cards) {
				// 	let _card = common.getElementById(this.cards[i]);
				// 	_cards.push(_card);
				// }
				// return _cards;
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

		return Deck;
	}();

	var addDeck = function addDeck(data) {

		if (!data) {
			return false;
		}

		var id = 'deck_' + _common2.default.genId();

		var _deck = new Deck(data, id);

		// fill deck
		if (data.fill) {
			for (var i in data.fill) {
				if (typeof data.fill[i] == 'string') {
					_deck.genCardByName(data.fill[i]);
				}
			}
		}

		var _elements = _share2.default.get('elements');

		_elements[id] = _deck;

		_share2.default.set('elements', _elements);

		return _deck;
	};

	// ------------------------------------------------------------------------------------------------------------------------------------------

	exports.default = {
		deckCardNames: _deckCardNames2.default,
		addDeck: addDeck,
		getDeck: _getDeck2.default,
		getDecks: _getDecks2.default,
		getDeckById: _getDeckById2.default
	};

/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	/*

	Types:

	 * none
	 * all
	 * notlast
	 * first_1
	 * first_2
	 * first_3
	 * bee

	 */

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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _getBeside = __webpack_require__(17);

	var _getBeside2 = _interopRequireDefault(_getBeside);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*

	Relations filters:

	 * linePrev
	 * lineNext

	Internal use:

	 * _down_up_cards
	 * _down_up_rank_num

	Rules:

	 * striped
	 * firstAce
	 * firstKing
	 * notForEmpty
	 * onlyEmpty
	 * oneRank
	 * oneSuit
	 * any
	 * not
	 * ascendDeck
	 * descendDeck
	 * oneRankDeck
	 * ascend
	 * descent
	 * descentOne
	 * ascendOne
	 * ascdescOne
	 * sum14
	 * around
	 
	 */

	var readyPutRules = {

		// Relations filters

		linePrev: function linePrev(deck) {

			var prev = (0, _getBeside2.default)(deck.to).prev;

			if (prev) {

				deck.link = prev.to;

				return true;
			}

			return false;
		},

		lineNext: function lineNext(deck) {

			var next = (0, _getBeside2.default)(deck.to).next;

			if (next) {

				deck.link = next.to;

				return true;
			}

			return false;
		},

		// Internal use

		_down_up_cards: function _down_up_cards(deck) {

			if (deck.cards.length == 0) {
				return false;
			}

			var down = _common2.default.validateCardName(deck.cards[deck.cards.length - 1].name);
			var up = _common2.default.validateCardName(deck.putDeck[0].card.name);

			if (!down || !up) {
				return false;
			}

			return {
				up: up,
				down: down
			};
		},

		_down_up_rank_num: function _down_up_rank_num(deck) {

			var du = readyPutRules._down_up_cards(deck);

			return du ? {
				down: _defaults2.default.card.ranks.indexOf(du.down.rank),
				up: _defaults2.default.card.ranks.indexOf(du.up.rank)
			} : false;
		},

		_isFirst: function _isFirst(deck, _name) {

			if (deck.cards.length == 0) {

				var _validate = null;

				return (_validate = _common2.default.validateCardName(deck.putDeck[0].card.name)) && _validate.rank == _name;
			}

			return true;
		},

		// Rules

		striped: function striped(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var color_A = _common2.default.validateCardName(deck.cards[deck.cards.length - 1].name).color,
			    color_B = null,
			    _validate = null;

			if (_validate = _common2.default.validateCardName(deck.putDeck[0].card.name)) {
				color_B = _validate.color;
			}

			return color_A != color_B;
		},

		firstAce: function firstAce(deck) {
			return readyPutRules._isFirst(deck, _defaults2.default.card.ranks[0]);
		},

		firstKing: function firstKing(deck) {
			return readyPutRules._isFirst(deck, _defaults2.default.card.ranks[_defaults2.default.card.ranks.length - 1]);
		},

		notForEmpty: function notForEmpty(deck) {
			return deck.cards.length > 0;
		},

		onlyEmpty: function onlyEmpty(deck) {
			return deck.cards.length == 0;
		},

		oneRank: function oneRank(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var du = readyPutRules._down_up_cards(deck);

			return du && du.up.rank == du.down.rank;
		},

		oneSuit: function oneSuit(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var du = readyPutRules._down_up_cards(deck);

			return du && du.up.suit == du.down.suit;
		},

		any: function any(deck) {
			return true;
		},

		not: function not(deck) {
			return false;
		},

		ascendDeck: function ascendDeck(deck) {
			//ascend deck by step

			if (deck.putDeck.length == 1) {
				return true;
			}

			var ruleCorrect = true;

			for (var i in deck.putDeck) {

				if (i > 0) {

					var down = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(deck.putDeck[i - 1].card.name).rank),
					    up = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(deck.putDeck[i].card.name).rank);

					ruleCorrect = ruleCorrect && 1 + down == up;
				};
			};

			return ruleCorrect;
		},

		descendDeck: function descendDeck(deck) {
			//ascend deck by step

			if (deck.putDeck.length == 1) {
				return true;
			}

			var ruleCorrect = true;

			for (var i in deck.putDeck) {

				if (i > 0) {

					var down = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(deck.putDeck[i - 1].card.name).rank),
					    up = _defaults2.default.card.ranks.indexOf(_common2.default.validateCardName(deck.putDeck[i].card.name).rank);

					ruleCorrect = ruleCorrect && down == 1 + up;
				};
			};

			return ruleCorrect;
		},

		oneRankDeck: function oneRankDeck(deck) {

			if (deck.putDeck.length == 1) {
				return true;
			}

			var ruleCorrect = true;

			for (var i in deck.putDeck) {

				if (i > 0) {

					var down = _common2.default.validateCardName(deck.putDeck[i - 1].card.name).suit,
					    up = _common2.default.validateCardName(deck.putDeck[i].card.name).suit;

					ruleCorrect = ruleCorrect && down == up;
				}
			};

			return ruleCorrect;
		},

		ascend: function ascend(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var da = readyPutRules._down_up_rank_num(deck);

			return da && da.down < da.up;
		},

		descent: function descent(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var da = readyPutRules._down_up_rank_num(deck);

			return da && da.down > da.up;
		},

		descentOne: function descentOne(deck) {
			// one step

			if (deck.cards.length == 0) {
				return true;
			}

			var da = readyPutRules._down_up_rank_num(deck);

			return da && da.down == 1 + da.up;
		},

		ascendOne: function ascendOne(deck) {
			// one step

			if (deck.cards.length == 0) {
				return true;
			}

			var da = readyPutRules._down_up_rank_num(deck);

			return da && 1 + da.down == da.up;
		},

		ascdescOne: function ascdescOne(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var da = readyPutRules._down_up_rank_num(deck);

			return da && Math.abs(da.down - da.up) == 1;
		},

		sum14: function sum14(deck) {

			if (deck.cards.length == 0) {
				return true;
			}

			var du = readyPutRules._down_up_cards(deck);
			var _sum = du.down.value + du.up.value;

			return _sum == 14;
		},

		// TODO rules with params ??? or atom rules
		// query ?

		around: function around(deck) {
			// {from, putDeck, cards}

			if (deck.cards.length == 0) {
				return true;
			}

			var _around = deck.from.deck.getRelationsByName('around', { from: null });
			var _parent = _deck2.default.getDeckById(deck.cards[0].parent);

			for (var i in _around) {

				if (_around[i].to == _parent.name) {
					return true;
				}
			}

			return false;
		}
	};

	exports.default = readyPutRules;

/***/ },
/* 17 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (deck) {
		// {deck}

		var prev = deck.getRelationsByName('beside', {
			from: null,
			type: "prev"
		})[0];

		var next = deck.getRelationsByName('beside', {
			from: null,
			type: "next"
		})[0];

		return { prev: prev, next: next };
	};

/***/ },
/* 18 */
/***/ function(module, exports) {

	'use strict';

	/*

	Rules:

	 * not
	 * notFirst
	 * any
	 * onlytop
	 
	 */

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {

		// SimpleRules
		not: function not(data) {
			return false;
		},

		notFirst: function notFirst(data) {
			return data.cardIndex > 0;
		},

		any: function any(data) {
			return true;
		},

		onlytop: function onlytop(data) {
			return data.cardIndex == data.deckLength - 1;
		}

		// TODO rules

		// ask : function(data) {
		// 	return true;
		// },

		// desc : function(data) {
		// 	return true;
		// }
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _group2 = __webpack_require__(13);

	var _group3 = _interopRequireDefault(_group2);

	var _deck4 = __webpack_require__(14);

	var _deck5 = _interopRequireDefault(_deck4);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	var _getBeside = __webpack_require__(17);

	var _getBeside2 = _interopRequireDefault(_getBeside);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*

	Internal use:

	 * _topCard
	 * _bottomCard
	 * _besideTopCardRecoursive
	 * _besideTopCard
	 * _deckRecoursive

	Filters:

	 * query

	Rules:

	 * deckLength
	 * not
	 * topAce
	 * topKing
	 * bottomAce
	 * bottomKing
	 * prevDeckTopCardDescStep
	 * prevDeckTopCardAscStep
	 * nextDeckTopCardDescStep
	 * nextDeckTopCardAscStep
	 * prevDeckTopCardDesc
	 * prevDeckTopCardAsc
	 * nextDeckTopCardDesc
	 * nextDeckTopCardAsc
	 * recoursivePrevDeckTopCardDescStep
	 * recoursivePrevDeckTopCardAscStep
	 * recoursiveNextDeckTopCardDescStep
	 * recoursiveNextDeckTopCardAscStep
	 * recoursivePrevDeckTopCardDesc
	 * recoursivePrevDeckTopCardAsc
	 * recoursiveNextDeckTopCardDesc
	 * recoursiveNextDeckTopCardAsc
	 * descByOne
	 * ascByOne
	 * asc
	 * desc
	 * prevDeckTopCardEquallySuit
	 * nextDeckTopCardEquallySuit
	 * prevDeckFull
	 * nextDeckFull

	 */

	var fullRules = {

		// Internal use

		_topCard: function _topCard(deck) {

			var _card = deck.getTopCard();

			return _card && _common2.default.validateCardName(_card.name);
		},

		_bottomCard: function _bottomCard(deck) {

			var _card = deck.getCards()[0];

			return _card && _common2.default.validateCardName(_card.name);
		},

		_besideTopCardRecoursive: function _besideTopCardRecoursive(deck, direction, callback) {

			var _check = true;

			var _deck = deck;
			var _beside = (0, _getBeside2.default)(_deck)[direction];

			for (; _beside && _check;) {

				var besideDeck = _deck5.default.getDeck(_beside.to);

				_check = _check && callback(fullRules._topCard(deck), fullRules._topCard(besideDeck));

				_deck = besideDeck;
				_beside = (0, _getBeside2.default)(besideDeck)[direction];
			}

			return _check;
		},

		_besideTopCard: function _besideTopCard(deck, direction, callback) {

			var _beside = (0, _getBeside2.default)(deck)[direction];
			var besideDeck = _deck5.default.getDeck(_beside.to);

			return callback(fullRules._topCard(deck), fullRules._topCard(besideDeck));
		},

		_deckRecoursive: function _deckRecoursive(deck, callback) {

			var _check = true;
			var _cards = deck.getCards();

			var _cardsCount = _cards.length;

			for (var i = _cardsCount; i > 0; i -= 1) {
				_check = _check && callback(_common2.default.validateCardName(_cards[i].name), _common2.default.validateCardName(_cards[i - 1].name));
			}

			return _check;
		},

		// Filters

		query: function query(deck, data) {

			// query : {
			// 	groups : ["group1", "group2"],
			// 	select : "first",
			//  decks : ["deck1", "deck2"],
			// 	rules : ["rule1", "rule2"],
			//  anyRules : ["rule1", "rule2"]
			// }

			// TODO

			var _correct = true;

			var queryDecks = [];

			// Groups
			if (data.groups) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = data.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var groupName = _step.value;


						var _group = _group3.default.getByName(groupName);

						var _decks = _group.getDecks();

						var _select = data.select ? data.select : 'all';

						// 	select: first | second | last | all
						if (_select == "first") {
							// TODO select deck with index 0
							var _deck = _group.getDeckByIndex(1);
							// console.log('###', deck.name, _select, _deck.name);

							queryDecks.push(_deck);
						} else if (_select == "second") {
							// --/-- index 0
						} else if (_select == "last") {
							// --/-- max index
						} else {
								// all
							}
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}

			// Decks
			if (data.decks) {
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = data.decks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var deckName = _step2.value;


						// get deck by name
						var _deck2 = _deck5.default.getDeck(deckName);

						if (_deck2) {
							queryDecks.push(_deck2);
						}
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}

			// Rules
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;

			try {
				for (var _iterator3 = queryDecks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var _deck3 = _step3.value;
					var _iteratorNormalCompletion4 = true;
					var _didIteratorError4 = false;
					var _iteratorError4 = undefined;

					try {

						for (var _iterator4 = data.rules[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
							var rule = _step4.value;


							// TODO тут предполагается что все "подправила" будут только строковые
							if (fullRules[rule]) {
								_correct = _correct && fullRules[rule](_deck3);
							}
						}
					} catch (err) {
						_didIteratorError4 = true;
						_iteratorError4 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion4 && _iterator4.return) {
								_iterator4.return();
							}
						} finally {
							if (_didIteratorError4) {
								throw _iteratorError4;
							}
						}
					}

					if (data.anyRule) {

						var _anyCorrect = false;

						for (var ruleIndex in data.anyRule) {

							var _rule = data.anyRule[ruleIndex];

							if (fullRules[_rule]) {
								_anyCorrect = _anyCorrect || fullRules[_rule](_deck3);
							}
						}

						_correct = _correct && _anyCorrect;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}

			return _correct;
		},

		// Rules

		deckLength: function deckLength(deck) {
			return _defaults2.default.card.ranks.length <= deck.cards.length;
		},

		not: function not(deck) {
			return false;
		},

		// noMoves    : deck => !Tips.checkFrom(deck.name),

		topAce: function topAce(deck) {

			var _card = fullRules._topCard(deck);

			return _card && _card.rank == _defaults2.default.card.ranks[0];
		},

		topKing: function topKing(deck) {

			var _card = fullRules._topCard(deck);

			var lastIndex = _defaults2.default.card.ranks.length - 1;

			return _card && _card.rank == _defaults2.default.card.ranks[lastIndex];
		},

		bottomAce: function bottomAce(deck) {

			var _card = fullRules._bottomCard(deck);

			return _card && _card.rank == _defaults2.default.card.ranks[0];
		},

		bottomKing: function bottomKing(deck) {

			var _card = fullRules._bottomCard(deck);

			var lastIndex = _defaults2.default.card.ranks.length - 1;

			return _card && _card.rank == _defaults2.default.card.ranks[lastIndex];
		},

		prevDeckTopCardDescStep: function prevDeckTopCardDescStep(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},

		prevDeckTopCardAscStep: function prevDeckTopCardAscStep(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},

		nextDeckTopCardDescStep: function nextDeckTopCardDescStep(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},

		nextDeckTopCardAscStep: function nextDeckTopCardAscStep(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},

		prevDeckTopCardDesc: function prevDeckTopCardDesc(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return from.value > to.value;
			});
		},

		prevDeckTopCardAsc: function prevDeckTopCardAsc(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return from.value < to.value;
			});
		},

		nextDeckTopCardDesc: function nextDeckTopCardDesc(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return from.value > to.value;
			});
		},

		nextDeckTopCardAsc: function nextDeckTopCardAsc(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return from.value < to.value;
			});
		},

		recoursivePrevDeckTopCardDescStep: function recoursivePrevDeckTopCardDescStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},

		recoursivePrevDeckTopCardAscStep: function recoursivePrevDeckTopCardAscStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},

		recoursiveNextDeckTopCardDescStep: function recoursiveNextDeckTopCardDescStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},

		recoursiveNextDeckTopCardAscStep: function recoursiveNextDeckTopCardAscStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},

		recoursivePrevDeckTopCardDesc: function recoursivePrevDeckTopCardDesc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return from.value > to.value;
			});
		},

		recoursivePrevDeckTopCardAsc: function recoursivePrevDeckTopCardAsc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return from.value < to.value;
			});
		},

		recoursiveNextDeckTopCardDesc: function recoursiveNextDeckTopCardDesc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return from.value > to.value;
			});
		},

		recoursiveNextDeckTopCardAsc: function recoursiveNextDeckTopCardAsc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return from.value < to.value;
			});
		},

		descByStep: function descByStep(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return up.value == (down.value | 0) + 1;
			});
		},

		ascByStep: function ascByStep(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return (up.value | 0) + 1 == down.value;
			});
		},

		asc: function asc(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return up.value > down.value;
			});
		},

		desc: function desc(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return up.value < down.value;
			});
		},

		prevDeckTopCardEquallySuit: function prevDeckTopCardEquallySuit(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (up, down) {
				return up.suit == down.suit;
			});
		},

		nextDeckTopCardEquallySuit: function nextDeckTopCardEquallySuit(deck) {
			return false;
		},

		prevDeckFull: function prevDeckFull(deck) {
			return _deck5.default.getDeck((0, _getBeside2.default)(deck).prev.to).full;
		},

		nextDeckFull: function nextDeckFull(deck) {
			return _deck5.default.getDeck((0, _getBeside2.default)(deck).next.to).full;
		}
	};

	exports.default = fullRules;

/***/ },
/* 20 */
/***/ function(module, exports) {

	'use strict';

	/*

	Types:

	 * none
	 * last_three_min
	 * radial
	 * special
	 * vertical
	 * horizontal

	 */

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {

		none: function none(params, card, index, length, deck) {

			return {
				x: params.x,
				y: params.y
			};
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
				return {
					x: x,
					y: y
				};
			}
		},

		// twindeck_typeA : (params, card, index, length, deck) => {

		// 	let twindeck_max_cards       = 24,
		// 		twindeck_deck_length     = 3;

		// 	let _padding = {
		// 		x : 2,
		// 		y : 1
		// 	}

		// 	let _depth = (length / twindeck_max_cards * twindeck_deck_length)|0;
		// 	if(_depth >= twindeck_deck_length) _depth = twindeck_deck_length - 1;

		// 	let _plus = index - (length - _depth - 1);
		// 	if(_plus < 0) _plus = 0;

		// 	return {
		// 		x : params.x + _padding.x * _plus, 
		// 		y : params.y + _padding.y * _plus
		// 	};
		// },

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

			return {
				x: _x,
				y: _y
			};
		},

		vertical: function vertical(params, card, index, length, deck) {

			var _y = params.y;

			for (var i = 0; i < index; i += 1) {
				_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
			}

			var _return = {
				x: params.x,
				y: _y
			};

			return _return;
		},

		horizontal: function horizontal(params, card, index, length, deck) {

			var _x = params.x;

			for (var i = 0; i < index; i += 1) {
				_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
			}

			var _return = {
				x: _x,
				y: params.y
			};

			return _return;
		}
	};

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

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _twindeckAction = __webpack_require__(22);

	var _twindeckAction2 = _interopRequireDefault(_twindeckAction);

	var _dealerdeckAction = __webpack_require__(24);

	var _dealerdeckAction2 = _interopRequireDefault(_dealerdeckAction);

	var _kickAction = __webpack_require__(26);

	var _kickAction2 = _interopRequireDefault(_kickAction);

	var _stepsAroundAction = __webpack_require__(27);

	var _stepsAroundAction2 = _interopRequireDefault(_stepsAroundAction);

	var _changeStepTypeAction = __webpack_require__(28);

	var _changeStepTypeAction2 = _interopRequireDefault(_changeStepTypeAction);

	var _lockAction = __webpack_require__(29);

	var _lockAction2 = _interopRequireDefault(_lockAction);

	var _unlockAction = __webpack_require__(31);

	var _unlockAction2 = _interopRequireDefault(_unlockAction);

	var _checkFullAction = __webpack_require__(32);

	var _checkFullAction2 = _interopRequireDefault(_checkFullAction);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Actions
	var _actions = {
		"twindeck": _twindeckAction2.default,
		"dealerdeck": _dealerdeckAction2.default,
		"kick": _kickAction2.default,
		"stepsAround": _stepsAroundAction2.default,
		"changeStepType": _changeStepTypeAction2.default,
		"lock": _lockAction2.default,
		"unlock": _unlockAction2.default,
		"checkFull": _checkFullAction2.default
	};

	// ------------------------------------------------------------------------------------------

	var _decksActions = [],
	    _events = [];

	_event2.default.listen('initField', function (e) {
		_decksActions = [];
		_events = [];
	});

	var addActionEvent = function addActionEvent(eventName) {

		_event2.default.listen(

		// event name
		eventName,

		// callback
		function (data) {

			for (var i in _decksActions) {
				if (_decksActions[i].event == eventName) {

					var _actionName = _decksActions[i].action;

					var _canRun = eventName == 'click' ? data.to.name == _decksActions[i].deck.name : true;

					if (_canRun) {

						_actions[_actionName].run(_decksActions[i].deck, {
							actionData: _decksActions[i].deck.actions[_actionName],
							eventData: data,
							eventName: eventName
						});
					};
				}
			}
		},

		// context
		'addActionEvent:' + eventName);
	};

	var add = function add(deck) {

		for (var actionName in deck.actions) {

			// если не описано событие выполнять по клику
			if (!deck.actions[actionName].event) {
				deck.actions[actionName].event = 'click';
			}

			// если такой action существует
			if (_actions[actionName]) {

				// сохраняем action
				_decksActions.push({
					deck: deck,
					event: deck.actions[actionName].event,
					action: actionName
				});

				_share2.default.set('actionEvent:' + deck.name + ':' + deck.actions[actionName].event, true);

				// создаём событие если оно еще не создано
				if (!_events.includes(deck.actions[actionName].event)) {

					// сохраняем событие в список с уже созданными
					_events.push(deck.actions[actionName].event);

					// вешаем событие
					addActionEvent(deck.actions[actionName].event);
				}
			} else {
				console.warn('Action', actionName, 'for', deck.name, 'not found.');
			};
		}

		autoRunActions(deck);
	};

	var autoRunActions = function autoRunActions(deck) {

		_common2.default.animationDefault();

		for (var actionName in deck.actions) {
			if (deck.actions[actionName].autorun) {
				if (_actions[actionName]) {
					_actions[actionName].run(deck, {
						actionData: deck.actions[actionName],
						eventData: null,
						eventName: deck.actions[actionName].event
					});
				}
			}
		}
		// Tips.checkTips();
	};

	exports.default = {
		add: add
	};

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var stepType = 'twindeckStepType';

	var twindeckAction = function (_deckAction) {
		_inherits(twindeckAction, _deckAction);

		function twindeckAction() {
			_classCallCheck(this, twindeckAction);

			return _possibleConstructorReturn(this, (twindeckAction.__proto__ || Object.getPrototypeOf(twindeckAction)).call(this));
		}

		// TODO переделать


		_createClass(twindeckAction, [{
			key: 'run',
			value: function run(deck, data) {

				// !data.actionData.dispatch
				_get(twindeckAction.prototype.__proto__ || Object.getPrototypeOf(twindeckAction.prototype), 'end', this).call(this);
			}
		}]);

		return twindeckAction;
	}(_deckAction3.default);

	exports.default = new twindeckAction();

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/*
	 * run
	 * end
	 * break
	 */
	var deckAction = function () {
		function deckAction() {
			_classCallCheck(this, deckAction);
		}

		_createClass(deckAction, [{
			key: 'run',
			value: function run() {}
		}, {
			key: 'end',
			value: function end() {
				_event2.default.dispatch('stopSession');
			}
		}, {
			key: 'break',
			value: function _break() {
				// TODO
			}
		}]);

		return deckAction;
	}();

	exports.default = deckAction;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _forceMove = __webpack_require__(25);

	var _forceMove2 = _interopRequireDefault(_forceMove);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var stepType = 'dealerdeckStepType';

	var dealerdeckAction = function (_deckAction) {
		_inherits(dealerdeckAction, _deckAction);

		function dealerdeckAction() {
			_classCallCheck(this, dealerdeckAction);

			return _possibleConstructorReturn(this, (dealerdeckAction.__proto__ || Object.getPrototypeOf(dealerdeckAction)).call(this));
		}

		_createClass(dealerdeckAction, [{
			key: 'run',
			value: function run(deck, data) {
				// data.actionData, e

				// default data.actionData.onlyEmpty - false
				// default data.actionData.from      - deck.name
				// default data.actionData.stepType  - NULL

				// console.log('dealerdeckAction:', deck.name, data);

				if (typeof data.actionData.stepType == "string" && data.actionData.stepType != _share2.default.get('stepType')) {

					_get(dealerdeckAction.prototype.__proto__ || Object.getPrototypeOf(dealerdeckAction.prototype), 'break', this).call(this);

					return;
				}

				// меняем тип хода
				_share2.default.set('stepType', stepType);

				var dealDeck = typeof data.actionData.from == "string" ? Deck.getDeck(data.actionData.from) : deck;

				// смотрим остались ли карты
				if (dealDeck.cards.length == 0) {

					_share2.default.set('stepType', _defaults2.default.stepType);

					_event2.default.dispatch('actionBreak');
					_event2.default.dispatch('dealEnd');

					_get(dealerdeckAction.prototype.__proto__ || Object.getPrototypeOf(dealerdeckAction.prototype), 'end', this).call(this);

					return;
				}

				// карты для раздачи
				var _decks = [];

				// to == toGroup ???
				if (data.actionData.toGroup && !data.actionData.to) {

					data.actionData.to = data.actionData.toGroup;
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
								// let __decks = Group.Group(data.actionData.to).decks;

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

						for (var _i in data.actionData.to) {

							var _elements2 = _common2.default.getElementsByName(data.actionData.to[_i]);

							for (var elIndex in _elements2) {

								if (_elements2[elIndex].type == "group") {
									// _decks = _decks.concat(Group.Group(data.actionData.to[i]).decks);
									// let __decks = Group.Group(data.actionData.to[i]).decks;
									for (var _deckIndex in _elements2[elIndex].decks) {
										_decks.push(_elements2[elIndex].decks[_deckIndex]);
									}
								};

								if (_elements2[elIndex].type == "deck") {
									_decks.push(_elements2[elIndex]);
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
					var _card = dealDeck.getTopCard();

					// флаг что такой ход возможен
					var _canStep = data.actionData.onlyEmpty ? _decks[deckId].cards.length == 0 : true;

					if (_canStep && _card) {

						_makeStep = true;

						var _cardName = _card.name;

						var _callback = function _callback() {

							_event2.default.dispatch('checkTips');
						};

						(0, _forceMove2.default)({
							from: dealDeck.name,
							to: _decks[deckId].name,
							deck: [_cardName],
							flip: true,
							callback: _callback
						}, true);

						_decks[deckId].flipCheck();
						// _decks[deckId].Redraw();

						_event2.default.dispatch('dealEnd');

						_event2.default.dispatch('addStep', {
							'move': {
								from: dealDeck.name,
								to: _decks[deckId].name,
								deck: [_cardName],
								flip: true,
								stepType: {
									undo: _share2.default.get('stepType'),
									redo: data.actionData.dispatch ? _share2.default.get('stepType') : _defaults2.default.stepType
								},
								context: "dealerdeckAction"
							}
						});
					};
				};

				if (_makeStep) {

					// сохраняем если паздача удалась
					_event2.default.dispatch('saveSteps');
				};

				if (data.actionData.dispatch) {

					_event2.default.dispatch(data.actionData.dispatch, !_makeStep);
				} else {

					_get(dealerdeckAction.prototype.__proto__ || Object.getPrototypeOf(dealerdeckAction.prototype), 'end', this).call(this);
					// сохраняем если ничего не вызываем
					_share2.default.set('stepType', _defaults2.default.stepType);
				}
			}
		}]);

		return dealerdeckAction;
	}(_deckAction3.default);

	exports.default = new dealerdeckAction();

/***/ },
/* 25 */
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

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var forceMove = function forceMove(data) {
		// {from, to, deck, <flip>, <callback>}

		// console.log('forceMove', data);

		if (!data.from || !data.to || !data.deck) {
			return;
		}

		if (!data.deck.length) {
			return;
		}

		var deckFrom = typeof data.from == "string" ? _deck2.default.getDeck(data.from) : data.from;

		var deckTo = typeof data.to == "string" ? _deck2.default.getDeck(data.to) : data.to;

		if (!deckFrom || deckFrom.type != "deck" || !deckTo || deckTo.type != "deck") {
			return;
		}

		var _check = true;

		var deckFromCards = deckFrom.cards;

		for (var i in deckFromCards) {

			if (i >= deckFromCards.length - data.deck.length) {

				var _id = i - (deckFromCards.length | 0) + (data.deck.length | 0);

				if (data.deck[_id] && deckFromCards[i].name != data.deck[_id]) {
					_check = false;
				}
			}
		}

		if (_check) {

			var cardsPop = deckFrom.Pop(data.deck.length);

			// перевернуть карты во время хода
			if (data.flip) {
				for (var _i in cardsPop) {
					cardsPop[_i].flip = !cardsPop[_i].flip;
				}
			}

			deckTo.Push(cardsPop);

			var cardsMove = [];

			for (var _i2 in cardsPop) {
				cardsMove.push({
					card: cardsPop[_i2]
				});
			}

			var moveDragDeckParams = {
				moveDeck: cardsMove,
				departure: deckFrom,
				destination: deckTo
			};

			if (typeof data.callback == "function") {
				moveDragDeckParams.callback = function (e) {
					_event2.default.dispatch('forceMoveEnd');
					data.callback();
				};
			} else {
				moveDragDeckParams.callback = function (e) {
					_event2.default.dispatch('forceMoveEnd');
				};
			}

			_event2.default.dispatch('moveDragDeck', moveDragDeckParams);
		} else {
			console.warn("forceMove:Ход невозможен", data);
		}
	};

	_event2.default.listen('forceMove', function (data) {
		forceMove(data);
	});

	exports.default = forceMove;

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var stepType = 'kickStepType';

	var kickAction = function (_deckAction) {
		_inherits(kickAction, _deckAction);

		function kickAction() {
			_classCallCheck(this, kickAction);

			return _possibleConstructorReturn(this, (kickAction.__proto__ || Object.getPrototypeOf(kickAction)).call(this));
		}

		_createClass(kickAction, [{
			key: 'run',
			value: function run(deck, data) {
				var _this2 = this;

				// если тип хода не стандартный не выполнять кик
				if (_share2.default.get('stepType') != _defaults2.default.stepType) {

					_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'break', this).call(this);

					return false;
				}

				// TODO спорный момент
				if (typeof data.eventData.stepType == "string" && data.eventData.stepType != _defaults2.default.stepType) {

					_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'break', this).call(this);

					return false;
				}

				if (data.eventData.to.name != deck.name) {
					// data.eventData.to - куда мы перетащили карты

					_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'break', this).call(this);

					return false;
				}

				_share2.default.set('stepType', stepType);

				_common2.default.animationDefault();

				var _from = data.eventData.to,
				    //Deck.Deck(_name),
				_deck = _from.getCardsNames();

				var _callback = function _callback(e) {

					var _addStep = function _addStep(historyData) {

						_event2.default.dispatch('addStep', {
							"move": {
								from: _from.name,
								to: data.actionData.to,
								deck: _deck,
								flip: true,
								stepType: {
									undo: historyData.undo,
									redo: historyData.redo
								},
								context: "kickAction"
							}
						});
					};

					_share2.default.set('stepType', _defaults2.default.stepType);

					if (data.actionData.dispatch) {

						_event2.default.dispatch(data.actionData.dispatch, {
							before: function before(data) {

								_addStep({
									undo: stepType,
									redo: data.stepType
								});

								_event2.default.dispatch('saveSteps');
							}
						});
					} else {

						_addStep({
							undo: stepType, // share.get('stepType'),
							redo: data.actionData.dispatch ? _share2.default.get('stepType') : _defaults2.default.stepType
						});

						_event2.default.dispatch('saveSteps');

						_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'end', _this2).call(_this2);
					}
				};

				// TODO interval
				var forceMoveParams = {
					from: _from,
					to: data.actionData.to,
					deck: _deck,
					flip: true,
					callback: _callback
				};

				// forceMove(forceMoveParams);
				_event2.default.dispatch('forceMove', forceMoveParams);
			}
		}]);

		return kickAction;
	}(_deckAction3.default);

	exports.default = new kickAction();

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var stepType = 'stepsAround';

	var stepsAroundAction = function (_deckAction) {
		_inherits(stepsAroundAction, _deckAction);

		function stepsAroundAction() {
			_classCallCheck(this, stepsAroundAction);

			return _possibleConstructorReturn(this, (stepsAroundAction.__proto__ || Object.getPrototypeOf(stepsAroundAction)).call(this));
		}

		_createClass(stepsAroundAction, [{
			key: 'run',
			value: function run(deck, data) {
				var _this2 = this;

				// {actionData, eventData, eventName}

				var _stepType = _share2.default.get('stepType');

				if (_stepType != _defaults2.default.stepType) {

					_get(stepsAroundAction.prototype.__proto__ || Object.getPrototypeOf(stepsAroundAction.prototype), 'break', this).call(this);

					return;
				};

				_share2.default.set('stepType', stepType);
				// stop Drag'n'Drop
				_common2.default.curLock();

				var _relations = deck.getRelationsByName('around', { from: null });
				// let _tips = Tips.getTips();

				// выполняется для всех вокруг
				// ход не делается
				// вместо хода выполняется едействие для текущей стопки (если _central, по умолчанию true)
				if (typeof data.actionData.run == "string") {
					(function () {

						var _central = typeof data.actionData.central == "boolean" ? data.actionData.central : true;

						var _runStack = [];

						for (var i in _relations) {

							if (_tips2.default.fromTo(deck.name, _relations[i].to)) {
								_runStack.push(_relations[i]);
							}
						}

						var _counter = _runStack.length;

						var _callback = function _callback(e) {

							_counter -= 1;
							if (_counter === 0) {

								_this2.end();
								// event.dispatch(data.actionData.dispatch)
							}
						};

						if (_counter === 0) {

							_this2.end();
						} else if (_central) {

							_counter += 1;

							_event2.default.dispatch(data.actionData.run, {
								to: deck.name,
								callback: _callback
							});
						}

						for (var _i in _runStack) {

							var _data = null;
							try {
								_data = Object.assign({}, _runStack[_i]);
							} catch (e) {
								_data = _runStack[_i];
							}

							_data.callback = _callback;
							_event2.default.dispatch(data.actionData.run, _data);
						}

						// выполняется после хода 
					})();
				} else {

					var _callback2 = function _callback2(e) {

						if (_share2.default.get('stepType') == stepType) {
							_this2.end();
						}
					};

					_event2.default.listen('makeStep', _callback2);
					// event.dispatch(data.actionData.dispatch)
				}
			}
		}, {
			key: 'end',
			value: function end() {

				_share2.default.set('stepType', _defaults2.default.stepType);
				_common2.default.curUnLock();
				// Tips.checkTips();

				if (data.actionData.dispatch) {
					_event2.default.dispatch(data.actionData.dispatch, data.eventData);
				}

				_get(stepsAroundAction.prototype.__proto__ || Object.getPrototypeOf(stepsAroundAction.prototype), 'end', this).call(this);
			}
		}]);

		return stepsAroundAction;
	}(_deckAction3.default);

	exports.default = new stepsAroundAction();

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var changeStepTypeAction = function (_deckAction) {
		_inherits(changeStepTypeAction, _deckAction);

		function changeStepTypeAction() {
			_classCallCheck(this, changeStepTypeAction);

			return _possibleConstructorReturn(this, (changeStepTypeAction.__proto__ || Object.getPrototypeOf(changeStepTypeAction)).call(this));
		}

		_createClass(changeStepTypeAction, [{
			key: 'run',
			value: function run(deck, data) {

				if (data.eventData.to.name != deck.name) {
					return false;
				}

				if (typeof data.actionData.to != "string") {

					// !data.actionData.dispatch
					_get(changeStepTypeAction.prototype.__proto__ || Object.getPrototypeOf(changeStepTypeAction.prototype), 'end', this).call(this);

					return;
				} else {

					// !data.actionData.dispatch
					_get(changeStepTypeAction.prototype.__proto__ || Object.getPrototypeOf(changeStepTypeAction.prototype), 'end', this).call(this);

					_share2.default.set('stepType', data.actionData.to);
				}
			}
		}]);

		return changeStepTypeAction;
	}(_deckAction3.default);

	exports.default = new changeStepTypeAction();

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	var _lockActionCommon = __webpack_require__(30);

	var _lockActionCommon2 = _interopRequireDefault(_lockActionCommon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var lockAction = function (_deckAction) {
		_inherits(lockAction, _deckAction);

		function lockAction() {
			_classCallCheck(this, lockAction);

			return _possibleConstructorReturn(this, (lockAction.__proto__ || Object.getPrototypeOf(lockAction)).call(this));
		}

		_createClass(lockAction, [{
			key: 'run',
			value: function run(deck, data) {

				if (data.eventData.to.name != deck.name) {
					return false;
				}

				(0, _lockActionCommon2.default)(data.actionData, 'lock', deck.name);

				// !data.actionData.dispatch
				_get(lockAction.prototype.__proto__ || Object.getPrototypeOf(lockAction.prototype), 'end', this).call(this);
			}
		}]);

		return lockAction;
	}(_deckAction3.default);

	exports.default = new lockAction();

/***/ },
/* 30 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (data, method, me) {

		var sources = [];
		if (typeof data.source != "string") {
			if (data.source && data.source.constructor == Array) {
				for (var i in data.source) {
					sources.push(data.source[i]);
				}
			} else {
				sources = [me];
			}
		} else {
			sources = [data.source];
		}

		if (data.save) {
			var _step = {};
			_step[method] = sources;
			_event2.default.dispatch('addStep', _step);
			_event2.default.dispatch('saveSteps');
		}

		for (var _i in sources) {

			var current = _common2.default.getElementsByName(sources[_i])[0];

			if (current.type == "group") {
				var decks = current.getDecks();
				for (var deckIndex in decks) {
					decks[deckIndex][method]();
				}
			}

			if (current.type == "deck") {
				current[method]();
			}
		}
	};

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	var _lockActionCommon = __webpack_require__(30);

	var _lockActionCommon2 = _interopRequireDefault(_lockActionCommon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var unlockAction = function (_deckAction) {
		_inherits(unlockAction, _deckAction);

		function unlockAction() {
			_classCallCheck(this, unlockAction);

			return _possibleConstructorReturn(this, (unlockAction.__proto__ || Object.getPrototypeOf(unlockAction)).call(this));
		}

		_createClass(unlockAction, [{
			key: 'run',
			value: function run(deck, data) {

				if (data.eventData.to.name != deck.name) {
					return false;
				}

				(0, _lockActionCommon2.default)(data.actionData, 'unlock', deck.name);

				// !data.actionData.dispatch
				_get(unlockAction.prototype.__proto__ || Object.getPrototypeOf(unlockAction.prototype), 'end', this).call(this);
			}
		}]);

		return unlockAction;
	}(_deckAction3.default);

	exports.default = new unlockAction();

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _group2 = __webpack_require__(13);

	var _group3 = _interopRequireDefault(_group2);

	var _deckAction2 = __webpack_require__(23);

	var _deckAction3 = _interopRequireDefault(_deckAction2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var checkFullAction = function (_deckAction) {
		_inherits(checkFullAction, _deckAction);

		function checkFullAction() {
			_classCallCheck(this, checkFullAction);

			return _possibleConstructorReturn(this, (checkFullAction.__proto__ || Object.getPrototypeOf(checkFullAction)).call(this));
		}

		_createClass(checkFullAction, [{
			key: 'run',
			value: function run(deck, data) {

				if (data.eventData.to.name != deck.name) {
					return false;
				}

				if (data && data.actionData && data.actionData.query) {

					var _query = data.actionData.query;

					var _selectedDecks = [];

					if (_query.groups) {

						var _select = _query.select ? _query.select : 'all';

						var _iteratorNormalCompletion = true;
						var _didIteratorError = false;
						var _iteratorError = undefined;

						try {
							for (var _iterator = _query.groups[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
								var groupName = _step.value;


								var _group = _group3.default.getByName(groupName);

								var _decks = _group.getDecks();

								if (_select == 'first') {

									var _deck = _group.getDeckByIndex(1);

									if (_deck) {
										_selectedDecks.push(_deck);
									}
								} else if (_select == 'last') {

									var _index = _group.decksCount;

									var _deck2 = _group.getDeckByIndex(_index);

									if (_deck2) {

										var _index2 = _group.decksCount;

										var _deck3 = _group.getDeckByIndex(_index2);

										_selectedDecks.push(_deck3);
									}
								} else if (_select == 'all') {

									var _decks2 = _group.getDecks();

									_selectedDecks.concat(_decks2);
								}
							}
						} catch (err) {
							_didIteratorError = true;
							_iteratorError = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion && _iterator.return) {
									_iterator.return();
								}
							} finally {
								if (_didIteratorError) {
									throw _iteratorError;
								}
							}
						}
					}

					if (_query.decks) {
						var _iteratorNormalCompletion2 = true;
						var _didIteratorError2 = false;
						var _iteratorError2 = undefined;

						try {

							for (var _iterator2 = _query.decks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
								var deckName = _step2.value;


								var _deck4 = Deck.getByName(deckName);

								if (_deck4) {
									_selectedDecks.push(_deck4);
								}
							}
						} catch (err) {
							_didIteratorError2 = true;
							_iteratorError2 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion2 && _iterator2.return) {
									_iterator2.return();
								}
							} finally {
								if (_didIteratorError2) {
									throw _iteratorError2;
								}
							}
						}
					}

					for (var deckIndex in _selectedDecks) {

						var _deck5 = _selectedDecks[deckIndex];

						if (_deck5.checkFull()) {
							_deck5.Redraw();
						}
					}
				}

				_event2.default.dispatch('saveSteps');

				_get(checkFullAction.prototype.__proto__ || Object.getPrototypeOf(checkFullAction.prototype), 'end', this).call(this);
			}
		}]);

		return checkFullAction;
	}(_deckAction3.default);

	exports.default = new checkFullAction();

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _readyTakeRules = __webpack_require__(18);

	var _readyTakeRules2 = _interopRequireDefault(_readyTakeRules);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (deck, cardId) {

		// Нестандартный ход (autosteps)
		// if(share.get('stepType') != defaults.stepType) {return false;};

		var rulesCorrect = true; //!common.isLock();

		rulesCorrect = rulesCorrect && !deck.locked;

		if (typeof deck.full == "boolean") {
			rulesCorrect = rulesCorrect && !deck.full;
		}

		// берём карту/стопку

		var cardIndex = -1;
		var cardName = null;
		var cardSuit = null;
		var cardRank = null;
		var deckLength = deck.cards.length;

		// проверяем не является ли перевернутой

		var takeDeck = [];

		for (var i in deck.cards) {

			if (deck.cards[i].id == cardId) {

				cardIndex = i | 0;
				cardName = deck.cards[i].name;

				var _name = _common2.default.validateCardName(cardName);

				rulesCorrect = rulesCorrect && _name;

				if (_name) {
					cardSuit = _name.suit;
					cardRank = _name.rank;
				}

				rulesCorrect = rulesCorrect && !deck.cards[i].flip && deck.cards[i].flip == _defaults2.default.canMoveFlip;
			}

			if (cardIndex >= 0) {

				takeDeck.push({
					index: i,
					card: deck.cards[i]
				});
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

		for (var ruleIndex in deck.takeRules) {

			var ruleName = deck.takeRules[ruleIndex];

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

		rulesCorrect = rulesCorrect && takeDeck;

		return rulesCorrect;
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _deck2 = __webpack_require__(14);

	var _deck3 = _interopRequireDefault(_deck2);

	var _readyPutRules = __webpack_require__(16);

	var _readyPutRules2 = _interopRequireDefault(_readyPutRules);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (deck, putDeck) {

		var _stepType = _share2.default.get('stepType');

		var rulesCorrect = true;

		var _deckId = putDeck[0].card.parent;
		var _deck_departure = _deck3.default.getDeckById(_deckId);

		rulesCorrect = rulesCorrect && !deck.locked;

		if (_stepType != _defaults2.default.stepType) {

			// Нестандартный ход (autosteps)
			rulesCorrect = rulesCorrect && _field2.default.autoSteps && _field2.default.autoSteps[_stepType] ? _field2.default.autoSteps[_stepType].manual({
				putDeck: putDeck,
				to: deck
			}) : false;
		} else {

			var _link = null; // deckName
			var _deck = deck;

			for (var ruleIndex in deck.putRules) {

				if (rulesCorrect) {

					if (_link) {
						_deck = _deck3.default.getDeck(_link);
					}

					var ruleName = deck.putRules[ruleIndex];

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

/***/ },
/* 35 */
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// class card {

	// 	constructor(e) {
	// 		deck.id      = e.id;
	// 		deck.name    = e.name;
	// 		deck.type    = 'card';
	// 		deck.visible = true;
	// 		deck.flip    = false;
	// 	}

	// 	set domElement(e) {

	// 	}

	// 	get domElement() {
	// 		return null;
	// 	}
	// };

	exports.default = function (deck, name) {

		var _name = _common2.default.validateCardName(name); // {color, rank}

		if (_name) {

			var _id = 'card_' + _common2.default.genId();

			var _card = {
				id: _id,
				name: name,
				type: 'card',
				visible: true,
				flip: false,
				// filled  : false  ,
				parent: deck.id
			};

			_event2.default.dispatch('addCardEl', _card);

			var _elements = _share2.default.get('elements');
			_elements[_id] = _card;
			_share2.default.set('elements', _elements);

			deck.Push([_card]);
			deck.flipCheck();
			deck.Redraw();

			return _card;
		}

		return false;
	};

/***/ },
/* 36 */
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

	var _stateManager = __webpack_require__(6);

	var _stateManager2 = _interopRequireDefault(_stateManager);

	var _forceMove = __webpack_require__(25);

	var _forceMove2 = _interopRequireDefault(_forceMove);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _inputs = __webpack_require__(4);

	var _inputs2 = _interopRequireDefault(_inputs);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// import elRender  from 'elRender';

	// let _undoMethods = {};
	// let _redoMethods = {};

	var _movesCallback = function _movesCallback(e) {
		if (_movesStack.length) {
			_movesStack.shift()();
		} else {
			// 
		}
	};

	var _movesStack = [];

	// --

	var _stepsCallback = function _stepsCallback(e) {
		if (_stepsStack.length) {
			_stepsStack.shift()();
		} else {
			// 
		}
	};

	var _stepsStack = [];

	// ---------------------------------------- UNDO ----------------------------------------

	var historyStack = [];

	var _undo = function _undo(data) {

		if (_share2.default.get('sessionStarted')) {
			// _undoMoveStack = [];
			_event2.default.dispatch('stopAnimations');
			_stateManager2.default.restore();
		}

		// FLIP
		// if(data.flip) {};

		// UNFLIP
		// if(data.unflip) {};

		// FULL
		// if(data.full) {};

		// LOCK
		if (typeof data.lock != "undefined") {
			for (var i in data.lock) {
				var _element = _common2.default.getElementsByName(data.lock[i])[0];
				_element.unlock();
			}
		}

		// UNLOCK
		if (typeof data.unlock != "undefined") {
			for (var _i2 in data.unlock) {
				var _element2 = _common2.default.getElementsByName(data.unlock[_i2])[0];
				_element2.lock();
			}
		}

		// MOVE
		if (typeof data.move != "undefined" && typeof data.move.from != "undefined" && typeof data.move.to != "undefined" && typeof data.move.deck != "undefined") {

			// TODO
			var movesAnimation = _share2.default.get('movesAnimation');

			if (data.move.stepType) {

				if (typeof data.move.stepType == "string") {
					_share2.default.set('stepType', data.move.stepType);
				}

				if (typeof data.move.stepType.undo == "string") {
					_share2.default.set('stepType', data.move.stepType.undo);
				}
			}

			// TODO
			// _movesStack.push(e => {

			var forceMoveData = {
				from: data.move.to, // from ->
				to: data.move.from, //      <- to
				deck: data.move.deck,
				flip: data.move.flip
			};

			if (!_share2.default.get('showHistoryAnimation')) {

				_common2.default.animationOff();

				forceMoveData.callback = function (e) {
					_common2.default.animationOn();
				};
			}
			// forceMoveData.callback = _movesCallback
			(0, _forceMove2.default)(forceMoveData);

			// });

			// if(_movesStack.length == 1) {
			// _movesStack.shift()();
			// }
		}
	};

	_event2.default.listen('undo', function (undoData) {

		_inputs2.default.break();

		_event2.default.dispatch('stopAnimations');

		if (!undoData) {
			return;
		};

		// Обратная совместимость
		if (undoData instanceof Array) {

			undoData.reverse();

			for (var _i in undoData) {
				var data = undoData[_i];
				_undo(data);
			}
		} else {
			_undo(undoData);
		}

		_tips2.default.checkTips();
	});

	// ---------------------------------------- REDO ----------------------------------------

	var _redo = function _redo(data) {

		if (_share2.default.get('sessionStarted')) {
			// _undoMoveStack = [];
			_event2.default.dispatch('stopAnimations');
			_stateManager2.default.restore();
		}

		// FLIP
		// if(data.flip) {};

		// UNFLIP
		// if(data.unflip) {};

		// FULL
		// if(data.full) {};

		// LOCK
		if (typeof data.lock != "undefined") {
			for (var i in data.lock) {
				var _element = _common2.default.getElementsByName(data.lock[i])[0];
				_element.lock();
			}
		}

		// UNLOCK
		if (typeof data.unlock != "undefined") {
			for (var _i3 in data.unlock) {
				var _element3 = _common2.default.getElementsByName(data.unlock[_i3])[0];
				_element3.unlock();
			}
		}

		// MOVE
		if (typeof data.move != "undefined" && typeof data.move.from != "undefined" && typeof data.move.to != "undefined" && typeof data.move.deck != "undefined") {

			if (data.move.stepType) {

				if (typeof data.move.stepType == "string") {
					_share2.default.set('stepType', data.move.stepType);
				}

				if (typeof data.move.stepType.redo == "string") {
					_share2.default.set('stepType', data.move.stepType.redo);
				}
			}

			var forceMoveData = {
				from: data.move.from,
				to: data.move.to,
				deck: data.move.deck,
				flip: data.move.flip
			};

			if (!_share2.default.get('showHistoryAnimation')) {

				_common2.default.animationOff();

				forceMoveData.callback = function (e) {
					_common2.default.animationOn();
				};
			}

			(0, _forceMove2.default)(forceMoveData);
		}

		if (data.redo && typeof data.redo.stepType == "string") {
			_share2.default.set('stepType', data.redo.stepType);
		}
	};

	_event2.default.listen('redo', function (redoData) {

		_inputs2.default.break();

		_event2.default.dispatch('stopAnimations');

		if (!redoData) {
			return;
		}

		// Обратная совместимость
		if (redoData instanceof Array) {

			redoData.reverse();

			for (var _i in redoData) {
				var data = redoData[_i];
				_redo(data);
			}
		} else {
			_redo(redoData);
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

				// for(let i in step) {
				this.steps.push(step);
				// }
			}

			// get steps and reset

		}, {
			key: 'get',
			value: function get() {
				var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;


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

			// addUndoMethods(data) {
			// 	for(let i in data) {
			// 		_undoMethods[i] = data[i];
			// 	}
			// }

			// addRedoMethods(data) {
			// 	for(let i in data) {
			// 		_redoMethods[i] = data[i];
			// 	}
			// }

		}]);

		return history;
	}();

	var _history = new history();

	_event2.default.listen('addStep', function (data) {
		_history.add(data);
	});

	// save steps to client history
	_event2.default.listen('saveSteps', function (e) {
		_event2.default.dispatch('makeStep', _history.get());
	});

	exports.default = _history;

/***/ },
/* 37 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (data) {
		// Take deck [{card, index}]

		var _deck = [];

		for (var i in data) {
			if (data[i].card && data[i].card.name) {
				_deck.push(data[i].card.name);
			} else if (data[i].name) {
				_deck.push(data[i].name);
			};
		};

		return _deck;
	};

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

/***/ },
/* 39 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (group, cardNames) {

		var deckIndex = [];
		var _decksLength = 0;

		// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)
		for (var i in group.decks) {
			_decksLength += 1;
			deckIndex.push(null);
		};

		// если параметр groupIndex не выходит за рамки занимаем соответствующий порядковый номер
		for (var _i in group.decks) {
			if (group.decks[_i].groupIndex && group.decks[_i].groupIndex <= _decksLength) {
				deckIndex[group.decks[_i].groupIndex - 1] = true;
			};
		};

		// если нет параметра groupIndex (начинается с 1) ставим первый свободный порядковый номер
		for (var _i2 in group.decks) {
			if (!group.decks[_i2].groupIndex) {
				var _index = 0;
				for (; deckIndex[_index] != null; _index += 1) {}
				deckIndex[_index] = group.decks[_i2].id;
			};
		};

		// если параметр groupIndex не выходит за рамки ставим соответствующий порядковый номер
		for (var _i3 in group.decks) {
			if (group.decks[_i3].groupIndex && group.decks[_i3].groupIndex <= _decksLength) {
				deckIndex[group.decks[_i3].groupIndex - 1] = group.decks[_i3].id;
			};
		};

		// если параметр groupIndex выходит за рамки запоминаем...
		var _decksWithBigIndex = {};
		for (var _i4 in group.decks) {
			if (group.decks[_i4].groupIndex && group.decks[_i4].groupIndex > _decksLength) {
				_decksWithBigIndex[group.decks[_i4].groupIndex - 1] = group.decks[_i4].id;
			};
		};
		// ...и сортируем
		for (var _i5 in _decksWithBigIndex) {
			var _index2 = 0;
			for (; deckIndex[_index2] != null; _index2 += 1) {}
			deckIndex[_index2] = group.decks[_decksWithBigIndex[_i5]].id;
		};

		// сморим являются ли элементы названиями карт (строкой)
		var _checkDeck = true;
		for (var _i6 in cardNames) {
			_checkDeck = _checkDeck && typeof cardNames[_i6] == 'string';
		};

		// циклично добавляет карты в колоды в группе (в порядке добавления)
		if (_checkDeck) {

			for (var _i7 in cardNames) {

				var _index3 = deckIndex[_i7 % deckIndex.length];

				group.decks[_index3].genCardByName(cardNames[_i7]);
			}
			// если нужно добавить несколько групп карт
		} else {

			for (var _i8 in cardNames) {
				if (_i8 < deckIndex.length) {

					// console.log('fillDeck', deckIndex[i].name, cardNames[i]);

					group.decks[deckIndex[_i8]].Fill(cardNames[_i8]);
				};
			};
		};
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (group, data) {

		if (!group || !data) {
			return;
		}

		// получаем стопки текущей группы
		var decks = group.getDecks();

		if (typeof data.decks == 'undefined' || typeof data.decks == 'number') {
			data.decks = [];
		}

		// прокидываем конфигурацию для стопок
		for (var i in decks) {

			// иннициируем конфигурацию стопки если отсутствует
			if (!data.decks[i]) {
				data.decks[i] = {};
			};

			// прокидываем информацию о координатах группы
			if (data.position && data.decks[i].parentPosition) {
				data.decks[i].parentPosition = {
					x: data.position.x,
					y: data.position.y
				};
			};

			// прокидываем остальные параметры (параметры группы приоритетнее)
			if (typeof data.paddingX == "number") {
				data.decks[i].paddingX = data.paddingX;
			};
			if (typeof data.paddingY == "number") {
				data.decks[i].paddingY = data.paddingY;
			};

			if (typeof data.flipPaddingX == "number") {
				data.decks[i].flipPaddingX = data.flipPaddingX;
			};
			if (typeof data.flipPaddingY == "number") {
				data.decks[i].flipPaddingY = data.flipPaddingY;
			};

			if (typeof data.decks[i].position == "undefined") {
				data.decks[i].position = {};
			};

			data.decks[i].parentPosition = {};

			if (typeof data.rotate == "number") {
				data.decks[i].parentRotate = data.rotate;
			};

			if (data.position && typeof data.position.x == 'number') {
				data.decks[i].parentPosition.x = data.position.x;
			};

			if (data.position && typeof data.position.y == 'number') {
				data.decks[i].parentPosition.y = data.position.y;
			};

			// расстановка стопок
			if (data.placement) {
				if (data.placement.x) {
					data.decks[i].position.x = (data.placement.x + _defaults2.default.card.width) * i;
				}
				if (data.placement.y) {
					data.decks[i].position.y = (data.placement.y + _defaults2.default.card.height) * i;
				}
			};

			if (!data.decks[i].rotate && data.rotate && typeof data.rotate == 'number') {
				data.decks[i].rotate = data.rotate;
			};
			if (!data.decks[i].paddingX && data.paddingX && typeof data.paddingX == 'number') {
				data.decks[i].paddingX = data.paddingX;
			};
			if (!data.decks[i].paddingY && data.paddingY && typeof data.paddingY == 'number') {
				data.decks[i].paddingY = data.paddingY;
			};
			if (!data.decks[i].flipPaddingX && data.flipPaddingX && typeof data.flipPaddingX == 'number') {
				data.decks[i].flipPaddingX = data.flipPaddingX;
			};
			if (!data.decks[i].flipPaddingY && data.flipPaddingY && typeof data.flipPaddingY == 'number') {
				data.decks[i].flipPaddingY = data.flipPaddingY;
			};

			decks[i].Redraw(data.decks[i]);
		};
	};

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * генерация стопок в группах
	 */

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _countGenerator = __webpack_require__(42);

	var _countGenerator2 = _interopRequireDefault(_countGenerator);

	var _fanGenerator = __webpack_require__(43);

	var _fanGenerator2 = _interopRequireDefault(_fanGenerator);

	var _mapGenerator = __webpack_require__(44);

	var _mapGenerator2 = _interopRequireDefault(_mapGenerator);

	var _lineGenerator = __webpack_require__(51);

	var _lineGenerator2 = _interopRequireDefault(_lineGenerator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		"count": _countGenerator2.default,
		"fan": _fanGenerator2.default,
		"map": _mapGenerator2.default,
		"line": _lineGenerator2.default
	};

/***/ },
/* 42 */
/***/ function(module, exports) {

	/*
	 * сгенерировать ряд из N карт
	 */

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function (group, data) {

		// {
		// 	type   : "count",
		// 	count  : int,
		// }

		var _count = data.count;
		var _decks = [];

		for (var deckIndex = 0; deckIndex < _count; deckIndex += 1) {

			var _deckName = group.name + "_deck" + (deckIndex + 1);

			_decks.push({
				name: _deckName
			});
		}

		return _decks;
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать группу для полумесяца
	 */

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (group, data) {

		// {
		// 	type   : "fan",
		// 	count  : int,
		// 	radius : int,
		// 	center : {
		// 		x : int,
		// 		y : int
		// 	}
		// }

		group.placement = {
			x: 0,
			y: 0
		};

		//              b
		//       C  ..`:   A = sin(b) * C
		//     ...``   :B  B = cos(b) * C
		// a.``.......+:
		//        A     y 90deg

		var _decks = [];
		var _count = typeof data.count == "number" ? data.count : 3; //16
		var _step = 180 / _count;
		var _radius = typeof data.radius == "number" ? data.radius : 100; //405;
		var _center = typeof data.center != "undefined" && typeof data.center.x != "undefined" && typeof data.center.y != "undefined" ? data.center : {
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
				"name": group.name + "_deck" + deckIndex,
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

/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать группу из матрицы
	 */

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _relationsGenerator = __webpack_require__(45);

	var _relationsGenerator2 = _interopRequireDefault(_relationsGenerator);

	var _mapCommon = __webpack_require__(47);

	var _mapCommon2 = _interopRequireDefault(_mapCommon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// let getName = (el)=>{
	// 	return typeof el == "string" ? el : typeof el != "undefined" && typeof el.name == "string" ? el.name : null;
	// };

	// -------------------------------------------------------------------------------------------------------------------

	exports.default = function (group, data) {

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

		var _placement = group.placement ? {
			x: typeof group.placement.x != "undefined" ? group.placement.x : _default_placement.x,
			y: typeof group.placement.y != "undefined" ? group.placement.y : _default_placement.y
		} : _default_placement;

		group.placement = { x: 0, y: 0 };

		var _index = 1;

		var _mapSize = _mapCommon2.default.mapSize(data.map);

		// {name: 'groupName_deck_0_0'}
		for (var y in data.map) {
			for (var x in data.map[y]) {

				if (typeof data.map[y][x] == "boolean" && data.map[y][x] || typeof data.map[y][x] == "number" && data.map[y][x] > 0) {
					data.map[y][x] = {};
				};

				if (typeof data.map[y][x] == "string") {
					data.map[y][x] = { name: data.map[y][x] };
				} else if (data.map[y][x] && typeof data.map[y][x] != "undefined" && typeof data.map[y][x].name != "string") {
					data.map[y][x].name = group.name + "_deck_" + x + "_" + y;
				};
			}
		}

		for (var _y in data.map) {
			for (var _x in data.map[_y]) {

				var _x2 = _x | 0,
				    _y2 = _y | 0;

				var _el = data.map[_y2][_x2];

				if (_el) {

					var _deck = {
						"name": data.map[_y2][_x2].name, // (group.name + "_deck" + _index) OR (group.name + '_' + data.map[y][x])
						"position": {
							"x": _x2 * ((_defaults2.default.card.width | 0) + (_placement.x | 0)),
							"y": _y2 * ((_defaults2.default.card.height | 0) + (_placement.y | 0))
						}
					};

					//  ---------------------------------------------------------
					var _relations = [];

					var _relGenerators = {
						"around": "mapAroundRelations",
						"beside": "mapBesideRelations",
						"fall": "mapFallRelations"
					};

					if (data.relations) {

						for (var relGenName in _relGenerators) {

							if (data.relations[relGenName]) {
								_relations = _relations.concat(_relationsGenerator2.default[_relGenerators[relGenName]]({
									x: _x2, y: _y2,
									map: data.map,
									mapSize: _mapSize,
									el: _el,
									data: data.relations[relGenName]
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

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mapFallRelations = __webpack_require__(46);

	var _mapFallRelations2 = _interopRequireDefault(_mapFallRelations);

	var _mapAroundRelations = __webpack_require__(48);

	var _mapAroundRelations2 = _interopRequireDefault(_mapAroundRelations);

	var _mapBesideRelations = __webpack_require__(49);

	var _mapBesideRelations2 = _interopRequireDefault(_mapBesideRelations);

	var _lineBesideRelations = __webpack_require__(50);

	var _lineBesideRelations2 = _interopRequireDefault(_lineBesideRelations);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = {
		mapFallRelations: _mapFallRelations2.default,
		mapAroundRelations: _mapAroundRelations2.default,
		mapBesideRelations: _mapBesideRelations2.default,
		lineBesideRelations: _lineBesideRelations2.default
	};

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mapCommon = __webpack_require__(47);

	var _mapCommon2 = _interopRequireDefault(_mapCommon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// map froup generator fall relations

	// const directions = [
	// 	'left' ,
	// 	'rigth',
	// 	'up'   ,
	// 	'down'
	// ];

	var opposite = [{ left: 'right' }, { right: 'left' }, { up: 'down' }, { down: 'up' }];

	exports.default = function (data) {
		// {x, y, map, mapSize, el, data}

		var _relations = [];

		var _directions = [];

		for (var i in data.data.directions) {
			if (!_directions.includes(data.data.directions[i]) && // этого направления ещё не было
			!_directions.includes(opposite[data.data.directions[i]]) // противоположного направления тоже не было
			) {
					_directions.push(data.data.directions[i]);
				}
		}

		for (var _i in _directions) {

			var x = null,
			    y = null;

			switch (_directions[_i]) {

				case 'left':

					x = (data.x | 0) + _mapCommon2.default.beSide.left.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.left.y;

					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							name: 'fall',
							direction: 'left',
							to: data.map[y][x].name
						});
					}

					break;

				case 'right':

					x = (data.x | 0) + _mapCommon2.default.beSide.right.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.right.y;

					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							name: 'fall',
							direction: 'right',
							to: data.map[y][x].name
						});
					}

					break;

				case 'up':

					x = (data.x | 0) + _mapCommon2.default.beSide.up.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.up.y;

					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							name: 'fall',
							direction: 'up',
							to: data.map[y][x].name
						});
					}

					break;

				case 'down':

					x = (data.x | 0) + _mapCommon2.default.beSide.down.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.down.y;

					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							name: 'fall',
							direction: 'down',
							to: data.map[y][x].name
						});
					}

					break;
			}
		}

		return _relations;
	};

/***/ },
/* 47 */
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

		map.forEach(function (data) {
			_mapSize.width = Math.max(_mapSize.width, data.length);
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
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mapCommon = __webpack_require__(47);

	var _mapCommon2 = _interopRequireDefault(_mapCommon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (data) {
		// {x, y, map, mapSize, el, data}

		var _relations = [];

		for (var i in _mapCommon2.default.aroundRelations) {

			if (_mapCommon2.default.inMap(data.x + _mapCommon2.default.aroundRelations[i].x, data.y + _mapCommon2.default.aroundRelations[i].y, data.mapSize) && data.map[data.y + _mapCommon2.default.aroundRelations[i].y][data.x + _mapCommon2.default.aroundRelations[i].x]) {
				_relations.push({
					to: data.map[data.y + _mapCommon2.default.aroundRelations[i].y][data.x + _mapCommon2.default.aroundRelations[i].x].name,
					type: _mapCommon2.default.aroundRelations[i].type,
					id: _mapCommon2.default.aroundRelations[i].id,
					name: 'around'
				});
			}
		}

		return _relations;
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mapCommon = __webpack_require__(47);

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

	exports.default = function (data) {
		// {x, y, map, mapSize, el, data}

		var _relations = [];

		// var _next = getBeside(data.x, data.y, data.mapSize, data.map, data.el, 'next') && (
		// 	_relations.push({name: 'next', to: _next})
		// );
		// var _prev = getBeside(data.x, data.y, data.mapSize, data.map, data.el, 'prev') && (
		// 	_relations.push({name: 'prev', to: _prev})
		// );

		return _relations;
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _mapCommon = __webpack_require__(47);

	var _mapCommon2 = _interopRequireDefault(_mapCommon);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (data) {
		// {deckIndex, count, decks, data}

		var _relations = [];

		var _prev = data.deckIndex > 0 ? data.decks[(data.deckIndex | 0) - 1].name : null;

		if (_prev) {
			_relations.push({
				name: 'beside',
				type: 'prev',
				to: _prev
			});
		}

		var _next = data.deckIndex < data.count - 1 ? data.decks[(data.deckIndex | 0) + 1].name : null;

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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать ряд из N карт
	 */

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _relationsGenerator = __webpack_require__(45);

	var _relationsGenerator2 = _interopRequireDefault(_relationsGenerator);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (group, data) {

		// {
		// 	type	 : "line",
		// 	count	: int,
		// 	relations : {
		// 		"beside" : true
		// 	}
		// }

		// direction <- placement: {x, y}

		var _count = data.count;
		var _decks = [];

		for (var deckIndex = 0; deckIndex < _count; deckIndex += 1) {

			var _deckName = group.name + "_deck" + (deckIndex + 1);

			var _deck = {
				name: _deckName
			};

			_decks.push(_deck);
		}

		// first/last
		// TODO надо поправить перекрытие тегов из генератора и группы
		_decks[0].tags = ['first'];

		if (data.first) {

			var _deck2 = _decks[0];

			for (var propName in data.first) {
				_deck2[propName] = data.first[propName];
			}
		}

		if (_decks[1]) {
			_decks[1].tags = ['second'];
		}

		_decks[_decks.length - 1].tags = ['last'];

		if (data.last) {

			var _deck3 = _decks[_decks.length - 1];

			for (var _propName in data.last) {
				_deck3[_propName] = data.last[_propName];
			}
		}

		// Generate relations
		for (var _deckIndex in _decks) {

			var _relations = [];

			var _relGenerators = {
				"beside": "lineBesideRelations"
			};

			if (data.relations) {

				for (var relGenName in _relGenerators) {

					// TODO
					if (data.relations[relGenName]) {
						_relations = _relations.concat(_relationsGenerator2.default[_relGenerators[relGenName]]({
							deckIndex: _deckIndex,
							count: _count,
							decks: _decks,
							data: data.relations[relGenName]
						}));
					};
				};
			};

			_decks[_deckIndex].relations = _relations;
		}

		return _decks;
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _fallAutoStep = __webpack_require__(53);

	var _fallAutoStep2 = _interopRequireDefault(_fallAutoStep);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
/* 53 */
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

	var _autoStep2 = __webpack_require__(54);

	var _autoStep3 = _interopRequireDefault(_autoStep2);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _tips2 = __webpack_require__(9);

	var _tips3 = _interopRequireDefault(_tips2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var fallAutoStep = function (_autoStep) {
		_inherits(fallAutoStep, _autoStep);

		function fallAutoStep(params) {
			_classCallCheck(this, fallAutoStep);

			return _possibleConstructorReturn(this, (fallAutoStep.__proto__ || Object.getPrototypeOf(fallAutoStep)).call(this, params));

			// event.listen('fallAutoStepCheck', this.check);
		}

		// есть ли ещё ходы этого типа


		_createClass(fallAutoStep, [{
			key: 'check',
			value: function check() {

				_tips3.default.checkTips();

				var _tips = _tips3.default.getTips();

				if (_tips.length == 0) {

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

				console.log('-- fallAutoStep:auto, curLockState -', _share2.default.get('curLockState'));
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
				var _from = _deck2.default.getDeckById(data.putDeck[0].card.parent),
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
/* 54 */
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
			value: function start(e) {

				if (!this.autoStep) {
					_event2.default.dispatch('stopSession');
				}

				_share2.default.set('autoStep:stepType', this.stepType);

				if (e && typeof e.before == "function") {
					e.before({
						stepType: this.stepType
					});
				}

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
					_event2.default.dispatch(this.dispatch, {
						stepType: _share2.default.get('stepType'),
						callback: function callback(e) {
							_share2.default.set('stepType', _defaults2.default.stepType);
						}
					});
				} else {
					// share.set('stepType', defaults.stepType);
					_event2.default.dispatch('stopSession');
				}

				_share2.default.delete('autoStep:stepType');
			}
		}, {
			key: 'init',
			value: function init(stepType) {
				var _this = this;

				this.stepType = stepType;

				if (this.event) {
					_event2.default.listen(this.event, function (data) {
						_this.start(data);
					});
				}

				if (!this.autoStep) {

					_event2.default.listen('moveEnd', function () {

						if (_share2.default.get('stepType') != _this.stepType) {
							return;
						}

						_this.check();
					},

					// this
					'addAutoStepEvent:' + this.event);
				}
			}
		}]);

		return _class;
	}();

	exports.default = _class;

/***/ },
/* 55 */
/***/ function(module, exports) {

	'use strict';

	/*
	 * set
	 * get
	 * clear
	 */

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
					var _data = JSON.stringify(_ls);
					localStorage.SolitaireEngine = _data;
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// import share from 'share';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import gamePreferences from 'gamePreferences';

	// import elRender from 'elRender';

	exports.default = function (e) {

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

		var _html = __webpack_require__(57);

		$("#gpCommit").parent().before(_html);

		// gamePreferences.draw();
	};

/***/ },
/* 57 */
/***/ function(module, exports) {

	module.exports = "<div id=\"solitaire-engine-style-preferences\">\n    <h4>Настройки оформления</h4>\n    <div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Фон:</span>\n\t    <!-- <select id=\"pref_field\" class=\"solitaire-engine-style-preferences-element\"> -->\n        <label>\n        \t<input type=\"radio\" name=\"pref_field\" value=\"default_field\">\n        \tКлассический\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_field\" value=\"alternative_field\">\n        \tАльтернативный\n    \t</label>\n\t    <!-- </select> -->\n\t</div>\n\t<div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Лицевая сторона:</span>\n\t    <!-- <select id=\"pref_face\" class=\"solitaire-engine-style-preferences-element\"> -->\n        <label>\n        \t<input type=\"radio\" name=\"pref_face\" value=\"default_face\">\n        \tКлассическая\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_face\" value=\"alternative_face\">\n        \tАнгло-американская\n    \t</label>\n\t    <!-- </select> -->\n\t</div>\n    <div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Рубашка:</span>\n\t    <!-- <select id=\"pref_back\" class=\"solitaire-engine-style-preferences-element\"> -->\n        <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"default_back\">\n        \tКлассическая\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"alternative_back\">\n        \tАльтернативная\n    \t</label>\n        <!-- <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"red_back\">\n        \tКрасная\n    \t</label>\n        <label>\n        \t<input type=\"radio\" name=\"pref_back\" value=\"blue_back\">\n        \tСиняя\n    \t</label> -->\n\t    <!-- </select> -->\n\t</div>\n    <div id=\"gamePreferences\"></div>\n    <!-- <div>\n\t    <span class=\"solitaire-engine-style-preferences-label\">Пустая ячейка:</span>\n\t    <select id=\"pref_empty\" class=\"solitaire-engine-style-preferences-element\">\n\t        <option value=0>Классическая</option>\n\t        <option value=1>С обводкой</option>\n\t    </select>\n\t</div> -->\n\n</div>";

/***/ },
/* 58 */
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

	var _storage = __webpack_require__(55);

	var _storage2 = _interopRequireDefault(_storage);

	var _gamePreferences = __webpack_require__(59);

	var _gamePreferences2 = _interopRequireDefault(_gamePreferences);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var onShowParameters = function onShowParameters(e) {

		var pref = _storage2.default.get('pref');
		!pref && (pref = _defaults2.default.pref);

		for (var prefName in _defaults2.default.themes) {

			var _pref = pref[prefName] && _defaults2.default.themes[prefName].includes(pref[prefName]) ? pref[prefName] : _defaults2.default.pref[prefName];

			$('input[name=\'pref_' + prefName + '\'][value=\'' + _pref.toString() + '\']').prop({ checked: true });
		}

		_gamePreferences2.default.show(pref);
	};

	var applyParameters = function applyParameters(e) {

		var pref = {};

		for (var prefName in _defaults2.default.themes) {
			var _value = $('input[name=\'pref_' + prefName + '\']:checked').val();
			_value = _value == "true" ? true : _value == "false" ? false : _value;
			pref[prefName] = _value;
		}

		_event2.default.dispatch('fieldThemesSet', pref);

		_gamePreferences2.default.get(pref);

		// event.dispatch('changeGameParameters', pref);

		saveParameters(pref);

		var changePreferencesCallback = _share2.default.get('changePreferencesCallback');
		if (typeof changePreferencesCallback == "function") {
			var _data = pref;
			changePreferencesCallback(_data);
		}
	};

	var saveParameters = function saveParameters(pref) {
		_storage2.default.set('pref', pref);
	};

	exports.default = function (e) {

		// TODO переделать без jQuery

		$("#bbParameters").click(onShowParameters);
		// event.dispatch('addDomEvent', {
		// 	"event"    : "click"
		// 	"element"  : "#bbParameters",
		// 	"callback" : onShowParameters
		// });

		// $("#gpCommit").click(saveParameters);

		$('#parametersPanel').on('change', 'input', applyParameters);
		// $("#solitaire-engine-style-preferences input").change(applyParameters);

		// event.dispatch('addDomEvent', {
		// 	"event"    : "change"
		// 	"element"  : ".solitaire-engine-style-preferences-element",
		// 	"callback" : applyParameters
		// });
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var gamePreferences = function () {
		function gamePreferences() {
			_classCallCheck(this, gamePreferences);

			this.exist = false;
		}

		_createClass(gamePreferences, [{
			key: 'draw',
			value: function draw() {

				if (this.exist) {
					return;
				}

				var _preferences = _share2.default.get('gamePreferences');

				for (var prefName in _preferences) {

					var _label = $('<div>').append($('<span>').addClass('solitaire-engine-style-preferences-label').html(_preferences[prefName].title));

					for (var i in _preferences[prefName].options) {
						$(_label).append($('<label>').append($('<input>').prop({
							type: 'radio',
							name: 'gamePref_' + prefName,
							value: _preferences[prefName].options[i].value
						})).append(_preferences[prefName].options[i].title));
					}
					$('#gamePreferences').append(_label);
				}

				this.exist = true;
			}
		}, {
			key: 'show',
			value: function show(pref) {

				this.draw();

				var _preferences = _share2.default.get('gamePreferences');

				for (var prefName in _preferences) {
					if (pref && typeof pref[prefName] != "undefined") {
						$('input[name=\'gamePref_' + prefName + '\'][value=\'' + pref[prefName].toString() + '\']').prop({ checked: true });
					} else {
						console.log('2>', 'input[name=\'gamePref_' + prefName + '\'][value=\'' + _preferences[prefName].value.toString() + '\']');
						$('input[name=\'gamePref_' + prefName + '\'][value=\'' + _preferences[prefName].value.toString() + '\']').prop({ checked: true });
					}
				}
			}
		}, {
			key: 'get',
			value: function get(pref) {

				var _preferences = _share2.default.get('gamePreferences');

				for (var prefName in _preferences) {

					var _value = $('input[name=\'gamePref_' + prefName + '\']:checked').val();
					_value = _value == "true" ? true : _value == "false" ? false : _value;
					pref[prefName] = _value;
				}
			}
		}]);

		return gamePreferences;
	}();

	exports.default = new gamePreferences();

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _storage = __webpack_require__(55);

	var _storage2 = _interopRequireDefault(_storage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (e) {

		var pref = _storage2.default.get('pref');
		!pref && (pref = _defaults2.default.pref);

		for (var prefName in pref) {

			if (_defaults2.default.themes[prefName]) {

				if (!_defaults2.default.themes[prefName].includes(pref[prefName])) {
					pref[prefName] = _defaults2.default.pref[prefName];
				}
			}
		}

		_event2.default.dispatch('fieldThemesSet', pref);
	};

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

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	var _tips2 = __webpack_require__(9);

	var _tips3 = _interopRequireDefault(_tips2);

	var _bestTip = __webpack_require__(11);

	var _bestTip2 = _interopRequireDefault(_bestTip);

	var _winCheck = __webpack_require__(62);

	var _winCheck2 = _interopRequireDefault(_winCheck);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Move = function Move(moveDeck, to, cursorMove) {

		_common2.default.animationDefault();

		var _deck_departure = moveDeck[0].card.parent && _common2.default.getElementById(moveDeck[0].card.parent),
		    // стопка из которой взяли
		_deck_destination = null,
		    // в которую положили
		_success = true; // флаг возможности хода

		var _stepType = _share2.default.get('stepType');

		if (!cursorMove.dbclick && cursorMove.distance === 0 && _share2.default.get('moveDistance') > 0 && _stepType == _defaults2.default.stepType) {
			// кликнули один раз
			// чтобы сделать ход нужно переместить карту стопку (moveDistance != 0)
			return false;
		}

		// выйти если не стандартный ход
		if (_stepType != _defaults2.default.stepType && (_field2.default.autoSteps && !_field2.default.autoSteps[_stepType] || !_field2.default.autoSteps)) {

			var _deck_departure2 = moveDeck[0].card.parent && _common2.default.getElementById(moveDeck[0].card.parent);

			_event2.default.dispatch('moveCardToHome', {
				moveDeck: moveDeck,
				departure: _deck_departure2,
				stepType: _share2.default.get('stepType')
			});

			return;
		}

		_event2.default.dispatch('startSession', { type: 'move' });

		_success = _success && to; // to - не пустой

		var _el = null;

		if (_success) {
			_el = _common2.default.getElementById(to); // получаем карту/стопку
		}

		_success = _success && _el;

		// если положили на карту узнаём из какой она стопки
		if (_success) {
			if (_el.type == 'card') {
				_deck_destination = _common2.default.getElementById(_el.parent);
			} else if (_el.type == 'deck') {
				_deck_destination = _el;
			}
		}

		_success = _success && _deck_destination;

		// _deck_departure = moveDeck[0].card.parent && common.getElementById(moveDeck[0].card.parent);
		_success = _success && _deck_departure;

		_success = _success && _deck_destination.id != _deck_departure.id;

		// смотрим не одна и та же ли эта стопка
		if (_success) {

			// узнаём можно ли положить карты на папку назначения
			var _put = _deck_destination.Put(moveDeck);
			_success = _success && _put;
			if (_put) {
				// } && _deck_departure) {

				// если можно положить карты берём их из исходной стопки
				var _pop = _deck_departure.Pop(moveDeck.length);
				_success = _success && _pop;

				if (_pop) {
					(function () {

						// ложим карты в колоду назначения
						_deck_destination.Push(_pop);

						// режим анимации по умолчанию
						_common2.default.animationDefault();

						var _stepType = _share2.default.get('stepType');

						var _checkMoveEnd = false;

						for (var _actionName in _deck_destination.actions) {
							if (_deck_destination.actions[_actionName].event == "moveEnd") {
								_checkMoveEnd = true;
							}
						}

						_event2.default.dispatch('addStep', {
							'move': {
								from: _deck_departure.name,
								to: _deck_destination.name,
								deck: _deck2.default.deckCardNames(moveDeck),
								stepType: {
									undo: _stepType,
									redo: _checkMoveEnd ? "specialStepType" : _stepType
								},
								context: "move"
							}
						});

						var issetMoves = null;

						_event2.default.dispatch('moveDragDeck', {

							departure: _deck_departure,
							destination: _deck_destination,
							moveDeck: moveDeck,
							callback: function callback(e) {

								if (
								// !event.has('moveEnd', {
								!_event2.default.has('actionEvent:moveEnd:' + _deck_destination.name, {
									tag: _event2.default.tags.inGame
								}) || _share2.default.get('autoStep:stepType') == _share2.default.get('stepType')) {
									_event2.default.dispatch('stopSession');
								}

								_tips3.default.checkTips();

								var _tips = _tips3.default.getTips();
								if (_deck_destination.save || _tips.length > 0 && _stepType != _defaults2.default.stepType) {
									_event2.default.dispatch('saveSteps');
								}

								_event2.default.dispatch('moveEnd:' + _share2.default.get('stepType'));
								_event2.default.dispatch('moveEnd', {
									from: _deck_departure,
									to: _deck_destination,
									moveDeck: moveDeck,
									stepType: _share2.default.get('stepType'),
									before: function before(data) {
										if (data && typeof data.stepType == "string") {
											_event2.default.dispatch('addStep', {
												'redo': {
													'stepType': data.stepType
												}
											});
										}
									}
								});

								_winCheck2.default.winCheck({ show: true });
							}
						});
					})();
				}
			}
		}

		// если не кдалось положить карты, вернуть обратно
		// или положить на лучшее возможное место
		if (!_success && _deck_departure) {

			// достаточно ли перетащили (если клика не достаточно и не двойной клик)
			if (_field2.default.inputParams.doubleClick && cursorMove.dbclick || cursorMove.distance >= _share2.default.get('moveDistance')) {
				var Tip = (0, _bestTip2.default)(moveDeck, cursorMove);

				if (Tip) {

					Move(moveDeck, Tip.to.deck.id, cursorMove);

					return;
				} else {

					_event2.default.dispatch('moveCardToHome', {
						moveDeck: moveDeck,
						departure: _deck_departure
					});
					// ^ callback
					_event2.default.dispatch('stopSession');
				}
			} else {

				_event2.default.dispatch('moveCardToHome', {
					moveDeck: moveDeck,
					departure: _deck_departure
				});
				// ^ callback
				_event2.default.dispatch('stopSession');
			}
		}
	};

	_event2.default.listen('Move', function (data) {
		Move(data.moveDeck, data.to, data.cursorMove);
	});

	// --

	_event2.default.listen('autoStepToHome', function (e) {

		var _tips = _tips3.default.getTips();

		// TODO

		// Move(_moveDeck, _to, _cursorMove);
	});

/***/ },
/* 62 */
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

	var _winCheckRules2 = __webpack_require__(63);

	var _winCheckRules3 = _interopRequireDefault(_winCheckRules2);

	var _deck = __webpack_require__(14);

	var _deck2 = _interopRequireDefault(_deck);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var winCheck = function winCheck(params) {

		var rulesCorrect = true;
		var _hasRules = false;

		var _winCheck = _share2.default.get('winCheck');

		if (!_winCheck) {
			return false;
		}

		// if(_winCheck.rules) {
		// 	_winCheck = winCheck.rules;
		// }

		var _winCheckRules = _winCheck.rules ? _winCheck.rules : _winCheck;

		for (var ruleName in _winCheckRules) {

			_hasRules = true;

			if (_winCheckRules3.default[ruleName]) {

				var _result = _winCheckRules3.default[ruleName]({
					decks: _deck2.default.getDecks({ visible: true }),
					rulesArgs: _winCheckRules[ruleName]
				});

				rulesCorrect = rulesCorrect && _result;
			} else {
				rulesCorrect = rulesCorrect && _winCheckRules3.default.newerWin();
			}
		}

		if (!_hasRules) {
			rulesCorrect = rulesCorrect && _winCheckRules3.default.newerWin();
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
	var hwinCheck = function hwinCheck(params) {

		if (!params) {
			params = {};
		}

		if (typeof params.show == 'undefined') {
			params.show = false;
		}

		winCheck(params);
		// return winCheck({noCallback : true});
	};

	exports.default = {
		winCheck: winCheck,
		hwinCheck: hwinCheck
	};

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// import Deck     from 'deck';

	/*

	Filters:

	 * group
	 * groups
	 * deck
	 * decks

	Tag filters:

	 * firstEmpty

	Internal use:

	 * _asc_desk

	Simple rules:

	 * newerWin
	 * allEmpty
	 * empty
	 * allInOne
	 * allAscend
	 * allDescent

	Conposite rules:

	 * query
	 * lego

	 */

	var winCheckRules = {

		// Filters

		// возвращает колоды определённой группы/групп
		group: function group(data) {

			if (!data.filter || !data.filterArgs) {
				return false;
			}

			var _decks = [];
			for (var _i in data.decks) {

				// let _parent = data.decks[_i].parent
				// if(data.filterArgs.indexOf(data.decks[_i].parent)) {
				if (typeof data.filterArgs == "string" && data.decks[_i].parent == data.filterArgs || data.filterArgs.length && data.filterArgs.includes(data.decks[_i].parent)) {
					_decks.push(data.decks[_i]);
				}
			}

			data.decks = _decks;

			return _decks.length;
		},

		groups: function groups(data) {
			return winCheckRules.group(data);
		},

		select: function select(data) {
			// by Tag

			var _decks = [];

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = data.decks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var deck = _step.value;

					// let maxDeckIndex = Group.getGroup(deck.parent).decksCount();
					if (deck.tags.includes(data.filterArgs)) {
						_decks.push(deck);
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			data.decks = _decks;

			return _decks.length;
		},

		deck: function deck(data) {

			if (!data.filter || !data.filterArgs) {
				return false;
			}

			var _decks = [];

			for (var _i in data.decks) {
				if (typeof data.filterArgs == "string" && data.decks[_i].name == data.filterArgs || data.filterArgs.includes(data.decks[_i].name)) {
					_decks.push(data.decks[_i]);
				}
			}

			data.decks = _decks;
			return _decks.length;
		},

		decks: function decks(data) {
			return winCheckRules.deck(data);
		},

		// Tag filters

		firstEmpty: function firstEmpty(data) {

			var _decks = [];

			for (var _i in data.decks) {
				if (data.decks[_i].tags.includes('last')) {
					_decks.push(data.decks[_i]);
				}
			}

			data.decks = _decks;

			return _decks.length;
		},

		// Internal use

		_asc_desk: function _asc_desk(data) {

			if (!data || typeof data.asc_desk != 'number') {
				return false;
			}

			var _correct = true;

			for (var deckIndex in data.decks) {

				if (!_correct) {
					return false;
				}

				var _cards = data.decks[deckIndex].cards;

				for (var cardIndex in _cards) {
					if (cardIndex > 0) {

						var down = _common2.default.validateCardName(_cards[(cardIndex | 0) - 1].name),
						    up = _common2.default.validateCardName(_cards[cardIndex | 0].name);

						var _cardsRankS = _defaults2.default.card.ranks;

						_correct = _correct && down && up && _cardsRankS.indexOf(down.rank) == _cardsRankS.indexOf(up.rank) + data.asc_desk;
					}
				}
			}

			console.log('asc_desk', data.asc_desk, _correct);

			return _correct;
		},

		// Simple rules

		newerWin: function newerWin(data) {

			console.warn("You use 'newerWin' rule for checking Win. Maybe arguments in 'winCheck.rule' have incorrect rule name.");
			throw new Error('Newer win');
			return false;
		},

		// все колоды пусты
		allEmpty: function allEmpty(data) {

			var _correct = true;

			for (var _i in data.decks) {
				_correct = _correct && data.decks[_i].cards.length == 0;
			}

			return _correct;
		},

		empty: function empty(data) {
			winCheckRules.allEmpty(data);
		},

		// Combined rules (use like filter)

		// все карты в одной колоде
		allInOne: function allInOne(data) {

			var _emptyDecksCount = 0,
			    _decksLength = 0,
			    _fillIndex = 0;

			for (var i in data.decks) {
				if (data.decks[i].cards.length == 0) {
					_emptyDecksCount += 1;
				} else {
					_fillIndex = i;
				}
				_decksLength += 1;
			}

			var _correct = _emptyDecksCount == _decksLength - 1;

			if (data.filter) {
				data.decks = _correct ? [data.decks[_fillIndex]] : [];
			}

			return _correct;
		},

		// step by step 1, 2, 3
		// во всех колодах карты по возрастанию
		allAscend: function allAscend(data) {

			data.asc_desk = -1;

			return winCheckRules._asc_desk(data);
		},

		// step by step 3, 2, 1
		// во всех колодах карты по убыванию
		allDescent: function allDescent(data) {

			data.asc_desk = 1;

			return winCheckRules._asc_desk(data);
		},

		// Composite rules (input arguments)

		// комбинированное правило
		query: function query(data) {
			// {
			// 	decks[],  - all visible decks
			// 	rulesArgs
			// }

			if (!data || !data.rulesArgs) {
				return false;
			}

			var _correct = true;

			// apply filters
			for (var next in data.rulesArgs) {

				var _decksClone = {};

				for (var i in data.decks) {
					_decksClone[i] = data.decks[i];
				}

				var queryData = {
					// filters : data[next].filters,
					// rules   : data[next].rules,
					decks: _decksClone
				};

				// применяем фильтры, оставляем только интересующие колоды
				if (_correct && data.rulesArgs[next].filters) {

					queryData.filter = true;

					for (var _i2 in data.rulesArgs[next].filters) {
						if (typeof data.rulesArgs[next].filters[_i2] == 'string' && winCheckRules[data.rulesArgs[next].filters[_i2]]) {

							queryData.filterArgs = null;
							_correct = _correct && winCheckRules[data.rulesArgs[next].filters[_i2]](queryData);
						} else {

							// if(typeof data.rulesArgs[next].filters[i] == 'object') {
							if (data.rulesArgs[next].filters[_i2] && data.rulesArgs[next].filters[_i2].toString() == "[object Object]") {

								for (var filterName in data.rulesArgs[next].filters[_i2]) {
									// console.log('>>> filterName', filterName, typeof winCheckRules[filterName]);
									if (winCheckRules[filterName]) {
										queryData.filterArgs = data.rulesArgs[next].filters[_i2][filterName];
										_correct = _correct && winCheckRules[filterName](queryData);
									} else {
										_correct = _correct && winCheckRules.newerWin();
									}
								}
							} else {
								_correct = _correct && winCheckRules.newerWin();
							}
						}
					}

					queryData.filter = false;
				}

				// применяем правила к оставшимся колодам
				if (data.rulesArgs[next].rules) {

					for (var _i3 in data.rulesArgs[next].rules) {
						if (winCheckRules[data.rulesArgs[next].rules[_i3]]) {
							_correct = _correct && winCheckRules[data.rulesArgs[next].rules[_i3]](queryData);
						} else {
							_correct = _correct && winCheckRules.newerWin();
						}
					}
				}
			}

			return _correct;
		},

		lego: function lego(data) {
			return winCheckRules.query(data);
		}
	};

	exports.default = winCheckRules;

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	var _initField = __webpack_require__(68);

	var _initField2 = _interopRequireDefault(_initField);

	var _drawDeck = __webpack_require__(69);

	var _drawDeck2 = _interopRequireDefault(_drawDeck);

	var _drawCard = __webpack_require__(70);

	var _drawCard2 = _interopRequireDefault(_drawCard);

	var _drawTip = __webpack_require__(71);

	var _drawTip2 = _interopRequireDefault(_drawTip);

	var _moveDragDeck = __webpack_require__(72);

	var _moveDragDeck2 = _interopRequireDefault(_moveDragDeck);

	var _moveCardToHome = __webpack_require__(73);

	var _moveCardToHome2 = _interopRequireDefault(_moveCardToHome);

	var _fieldThemesSet = __webpack_require__(74);

	var _fieldThemesSet2 = _interopRequireDefault(_fieldThemesSet);

	__webpack_require__(75);

	__webpack_require__(76);

	__webpack_require__(77);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// common

	_event2.default.listen('removeEl', function (data) {

		var _elDomElement = _share2.default.get('domElement:' + data.id);

		_elDomElement.remove();

		_share2.default.delete('domElement:' + data.id);
	});

	// styles DOM


	_event2.default.listen('showCard', function (target) {
		(0, _elRender2.default)(target).show();
	});

	_event2.default.listen('hideCard', function (target) {
		(0, _elRender2.default)(target).hide();
	});

	_event2.default.listen('stopAnimations', function (e) {
		// TODO
		// elRender.stopAnimations();
	});

/***/ },
/* 65 */
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

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _elClass = __webpack_require__(66);

	var _elClass2 = _interopRequireDefault(_elClass);

	var _allElClass = __webpack_require__(67);

	var _allElClass2 = _interopRequireDefault(_allElClass);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_share2.default.set('animatedElements', 0);
	_share2.default.set('animatedElementsStack', []);
	_share2.default.set('animatedCallback', function (e) {
		return null;
	});

	var _allEl = function _allEl(data) {

		if (!data) {
			throw new Error("elRender:empty arguments");
		}

		if (typeof data == "string") {

			try {

				if (data[0] == "#") {

					var _element = document.getElementById(data.slice(1, Infinity));

					return new _elClass2.default(_element);
				} else if (data[0] == ".") {

					var _elements = document.getElementsByClassName(data.slice(1, Infinity));

					return new _allElClass2.default(_elements);
				} else if (data[0] == "<") {

					var _temp = document.createElement('temp');
					_temp.innerHTML = data;
					var _element2 = _temp.children[0];

					return new _elClass2.default(_element2);
				}
			} catch (data) {}
		} else if (data.el || data.elements) {
			return data;
		} else {
			return new _elClass2.default(data);
		}
	};

	_allEl.stopAnimations = function (e) {

		_allEl(".animated")
		// .css({transition: '0s'})
		.css({
			'transition': false
		}).removeClass("animated");
	};

	_event2.default.listen('stopAnimations', _allEl.stopAnimations);

	exports.default = _allEl;

/***/ },
/* 66 */
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

	/*
	 * attr
	 * hasClass
	 * toggleClass
	 * addClass
	 * removeClass
	 * css
	 * hide
	 * show
	 * append
	 * html
	 * animate
	 * remove
	 * parent
	 * after
	 * before
	 * listen
	 * trigger
	 * click
	 */

	var elClass = function () {
		function elClass(data) {
			_classCallCheck(this, elClass);

			this.el = data;

			if (!data) {
				// if(window._debug) throw new Error("test");
				this.el = null;
			}
		}

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
		}, {
			key: 'hasClass',
			value: function hasClass(className) {
				try {

					var _classes = this.el.className.split(' ');

					return _classes.includes(className);
				} catch (e) {}
			}
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
		}, {
			key: 'removeClass',
			value: function removeClass(className) {

				if (!this.el || !this.el.className) {
					return this;
				}

				try {

					var _classes = this.el.className.split(' ');

					// if(this.hasClass(className)) {
					var _clone = [];

					for (var i in _classes) {
						if (_classes[i] != className) {
							_clone.push(_classes[i]);
						}
					}

					_classes = _clone;

					this.el.className = _classes.join(' ');
					// }

					return this;
				} catch (e) {}
			}
		}, {
			key: 'css',
			value: function css(a) {

				if (!this.el) {
					return this;
				}

				try {

					for (var attrName in a) {
						this.el.style[attrName] = a[attrName];
					}

					return this;
				} catch (e) {}
			}
		}, {
			key: 'hide',
			value: function hide() {
				try {
					return this.css({
						'display': 'none'
					});
				} catch (e) {}
			}
		}, {
			key: 'show',
			value: function show() {
				try {
					return this.css({
						'display': 'block'
					});
				} catch (e) {}
			}
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
		}, {
			key: 'animate',
			value: function animate(params, animationTime, callback, animationName) {
				var _this = this;

				try {
					(function () {

						var _animation = _share2.default.get('animation');

						typeof animationTime == "undefined" && (animationTime = _share2.default.get('animationTime'));
						typeof animationTime == "function" && (callback = animationTime, animationTime = _share2.default.get('animationTime'));
						typeof callback == "string" && (animationName = callback, callback = null);

						// Thread
						setTimeout(function (e) {

							if (_animation) {
								_this.css({
									'transition': animationTime / 1000 + 's'
								});
							}

							var counter = 0;

							var reType = function reType(data) {
								// crutch

								var _e = data + '';

								var _px = _e.split('px');
								if (_px.length == 2) {
									return (_px[0] | 0) + 'px';
								}

								return data;
							};

							for (var attrName in params) {

								if (reType(_this.el.style[attrName]) != reType(params[attrName])) {
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
					})();
				} catch (e) {}
			}
		}, {
			key: 'remove',
			value: function remove() {
				try {
					// this.el.remove();
					this.el.parentNode.removeChild(this.el);
				} catch (e) {}
			}
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
				} catch (e) {}

				return this;
			}
		}, {
			key: 'before',
			value: function before(html) {

				try {
					this.el.parentNode.insertBefore(html, this.el);
				} catch (e) {}

				return this;
			}
		}, {
			key: 'listen',
			value: function listen(eventName, callback) {
				this.el.addEventListener(eventName, callback);
			}
		}, {
			key: 'trigger',
			value: function trigger(eventName) {
				if (typeof this.el[eventName] == "function") {
					this.el[eventName]();
				}
			}
		}, {
			key: 'click',
			value: function click(callback) {
				this.listen('click', callback);
			}
		}]);

		return elClass;
	}();

	exports.default = elClass;

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _elClass = __webpack_require__(66);

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

				typeof animationTime == "undefined" && (animationTime = share.get('animationTime'));
				typeof animationTime == "function" && (callback = animationTime, animationTime = share.get('animationTime'));
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
					// this.elements[i].remove();
					this.elements[i].parentNode.removeChild(this.elements[i]);
				}
				return this;
			}
		}]);

		return allElClass;
	}();

	exports.default = allElClass;

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_event2.default.listen('initField', function (data) {

		var domElement = data.field ? data.field : '#map';

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

		var _params = {};

		if (data.width && typeof data.width == 'number') {
			_params.width = data.width + 'px';
		}
		if (data.height && typeof data.height == 'number') {
			_params.height = data.height + 'px';
		}
		if (data.top && typeof data.top == 'number') {
			_params.top = data.top + 'px';
		}
		if (data.left && typeof data.left == 'number') {
			_params.left = data.left + 'px';
		}

		var _zoom = _share2.default.get('zoom');
		if (_zoom != _defaults2.default.zoom || _zoom != 1) {
			_params.transform = 'scale(' + _zoom + ')';
			_params['transform-origin'] = '0 0';
		}

		(0, _elRender2.default)(domElement).css(_params).addClass('solitaireField');

		_share2.default.set('domElement:field', domElement);
	});

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * addDeckEl
	 * redrawDeckFlip
	 * redrawDeckIndexes
	 * redrawDeck
	 */

	var applyChangedParameters = function applyChangedParameters(data) {

		data.params.x = ((data.deckData.position && typeof data.deckData.position.x == 'number' ? data.deckData.position.x : 0) | 0) + ((data.deckData.parentPosition && typeof data.deckData.parentPosition.x == 'number' ? data.deckData.parentPosition.x : 0) | 0);

		data.params.y = ((data.deckData.position && typeof data.deckData.position.y == 'number' ? data.deckData.position.y : 0) | 0) + ((data.deckData.parentPosition && typeof data.deckData.parentPosition.y == 'number' ? data.deckData.parentPosition.y : 0) | 0);

		data.deck.rotate = data.params.rotate = data.deckData.rotate && typeof data.deckData.rotate == 'number' ? data.deckData.rotate : 0;

		data.params.padding_y = data.deckData.paddingY && typeof data.deckData.paddingY == 'number' ? data.deckData.paddingY : data.deckData.paddingType ? _defaults2.default.padding_y : 0;

		data.params.padding_x = data.deckData.paddingX && typeof data.deckData.paddingX == 'number' ? data.deckData.paddingX : data.deckData.paddingType ? _defaults2.default.padding_x : 0;

		data.params.flip_padding_y = data.deckData.flipPaddingY && typeof data.deckData.flipPaddingY == 'number' ? data.deckData.flipPaddingY : data.deckData.paddingType ? _defaults2.default.flip_padding_y : 0;

		data.params.flip_padding_x = data.deckData.flipPaddingX && typeof data.deckData.flipPaddingX == 'number' ? data.deckData.flipPaddingX : data.deckData.paddingType ? _defaults2.default.flip_padding_x : 0;
	};

	// --------------------------------------------------------------------------------------------------------

	_event2.default.listen('addDeckEl', function (data) {

		applyChangedParameters(data);

		var _deckDomElement = (0, _elRender2.default)('<div>');

		var _params = {
			'transform': 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'width': _defaults2.default.card.width + 'px',
			'height': _defaults2.default.card.height + 'px',
			'left': data.params.x + 'px',
			'top': data.params.y + 'px',
			'display': data.deck.visible ? 'block' : 'none'
		};

		(0, _elRender2.default)(_deckDomElement).css(_params).addClass('el').attr({
			id: data.deck.id
		});

		if (data.deckData.showSlot) {
			(0, _elRender2.default)(_deckDomElement).addClass('slot');
		}

		if (data.deckData.class) {
			(0, _elRender2.default)(_deckDomElement).addClass(data.deckData.class);
		}

		var _fieldDomElement = _share2.default.get('domElement:field');

		(0, _elRender2.default)(_fieldDomElement).append(_deckDomElement);

		_share2.default.set('domElement:' + data.deck.id, _deckDomElement);
	});

	// --------------------------------------------------------------------------------------------------------

	_event2.default.listen('redrawDeckFlip', function (data) {

		if (!data || !data.cards) {
			return;
		}

		for (var i in data.cards) {

			var _params = {};

			var _cardDomElement = _share2.default.get('domElement:' + data.cards[i].id);

			if (data.cards[i].flip) {

				_cardDomElement.addClass('flip');
			} else {

				_cardDomElement.removeClass('flip');
			}

			_cardDomElement.css(_params);
		}
	});

	// --------------------------------------------------------------------------------------------------------

	_event2.default.listen('redrawDeckIndexes', function (data) {

		if (!data || !data.cards) {
			return;
		}

		for (var i in data.cards) {

			var _cardDomElement = _share2.default.get('domElement:' + data.cards[i].id);

			_cardDomElement.css({
				'z-index': (_defaults2.default.startZIndex | 0) + (i | 0)
			});
		}
	});

	// --------------------------------------------------------------------------------------------------------

	_event2.default.listen('redrawDeck', function (data) {

		if (_share2.default.get('noRedraw')) {
			return false;
		};

		if (data && data.deckData && data.deck && data.params) {
			applyChangedParameters(data);
		}

		if (data.deck.full) {
			console.log('redrawDeck:', data.deck.name, data.deck.full);
		}

		// перерисовка стопки
		var _params = {
			'transform': 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'left': data.params.x + 'px',
			'top': data.params.y + 'px',
			'display': data.deck.visible ? 'block' : 'none'
		};

		var _deckDomElement = _share2.default.get('domElement:' + data.deck.id);

		(0, _elRender2.default)(_deckDomElement).css(_params);

		// full deck (add class full to all cards in deck)
		if (data.deck.full) {
			var _cards = data.deck.getCards();
			for (var i in _cards) {
				var _cardDomElement = _share2.default.get('domElement:' + _cards[i].id);
				if (_cardDomElement) {
					(0, _elRender2.default)(_cardDomElement).addClass('full');
				}
			}
		}

		// console.log('redraw cards for', data.deck.name, data.cards);

		// перерисовка карт
		for (var _i in data.cards) {

			var _card_position = data.deck.padding(_i);
			var _zIndex = (data.params.startZIndex | 0) + (_i | 0);

			var _params2 = {
				'-ms-transform': 'rotate(' + (data.params.rotate | 0) + 'deg)',
				'-webkit-transform': 'rotate(' + (data.params.rotate | 0) + 'deg)',
				'-moz-transform': 'rotate(' + (data.params.rotate | 0) + 'deg)',
				'transform': 'rotate(' + (data.params.rotate | 0) + 'deg)',
				'left': _card_position.x + 'px',
				'top': _card_position.y + 'px',
				'z-index': _zIndex,
				'display': data.deck.visible ? 'block' : 'none'
			};

			var _cardDomElement2 = _share2.default.get('domElement:' + data.cards[_i].id);

			if (data.cards[_i].flip) {

				(0, _elRender2.default)(_cardDomElement2).addClass('flip');
			} else {

				(0, _elRender2.default)(_cardDomElement2).removeClass('flip');
			}

			(0, _elRender2.default)(_cardDomElement2).css(_params2);
		}
	});

/***/ },
/* 70 */
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

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_event2.default.listen('addCardEl', function (data) {

		var _card = {
			width: _defaults2.default.card.width.toFixed(3) * 1,
			height: _defaults2.default.card.height.toFixed(3) * 1
		};

		var _params = {
			"width": _card.width + 'px',
			"height": _card.height + 'px'
		};

		var _domElement = (0, _elRender2.default)('<div>');

		(0, _elRender2.default)(_domElement).addClass('el card draggable ' + data.name).css(_params).attr({
			id: data.id
		});

		_share2.default.set('domElement:' + data.id, _domElement);

		var _fieldDomElement = _share2.default.get('domElement:field');

		(0, _elRender2.default)(_fieldDomElement).append(_domElement);
	});

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	var _tips = __webpack_require__(9);

	var _tips2 = _interopRequireDefault(_tips);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_event2.default.listen('showTip', function (data) {

		if (data && data.el && data.type) {
			// data && data.el && data.el.domElement && data.type

			var _elDomElement = _share2.default.get('domElement:' + data.el.id);

			(0, _elRender2.default)(_elDomElement).addClass(data.type);
		}
	});

	_event2.default.listen('hideTips', function (data) {

		if (data && data.types) {

			for (var i in data.types) {

				var typeName = data.types[i];

				(0, _elRender2.default)('.' + typeName).removeClass(typeName);
			}
		} else {

			for (var _i in _tips2.default.tipTypes) {

				var _typeName = _tips2.default.tipTypes[_i];

				(0, _elRender2.default)('.' + _typeName).removeClass(_typeName);
			}
		}
	});

/***/ },
/* 72 */
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

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * moveDragDeck
	 * moveDragDeckDone
	 * dragDeck
	 */

	var angleValidate = function angleValidate(angle) {

		if (angle < 0) {
			angle += 360;
		}
		if (angle > 360) {
			angle -= 360;
		}

		return angle;
	};

	_event2.default.listen('moveDragDeck', function (data) {

		_common2.default.curLock();

		var _lastIndex = data.moveDeck.length - 1;

		for (var i in data.moveDeck) {

			var _position = data.destination.padding(data.destination.cards.length - 1 + (i | 0));

			var departureAngle = angleValidate(data.departure.rotate),
			    destinationAngle = angleValidate(data.destination.rotate);

			var _cardDomElement = _share2.default.get('domElement:' + data.moveDeck[i].card.id);

			(0, _elRender2.default)(_cardDomElement).css({
				'transform': 'rotate(' + departureAngle + 'deg)'
			});

			if (departureAngle - destinationAngle > 180) {

				departureAngle = departureAngle - 360;
				(0, _elRender2.default)(_cardDomElement).css({
					'transform': 'rotate(' + departureAngle + 'deg)'
				});
			};

			if (departureAngle - destinationAngle < -180) {
				destinationAngle -= 360;
			}

			var _params = {
				'transform': 'rotate(' + destinationAngle + 'deg)',
				'left': _position.x + 'px',
				'top': _position.y + 'px'
			};

			var _zIndex = (_defaults2.default.topZIndex | 0) + (i | 0);

			var _callback = function (data, _last) {

				data.departure.Redraw();
				data.destination.Redraw();

				_common2.default.curUnLock();

				if (_last && typeof data.callback == "function") {
					data.callback();
				}

				_event2.default.dispatch('moveDragDeckDone', {
					deck: data.destination
				});
			}.bind(null, data, i == _lastIndex);

			(0, _elRender2.default)(_cardDomElement).css({
				'z-index': _zIndex
			}).animate(_params, _callback);
		}
	});

	// --------------------------------------------------------------------------------------------------------

	_event2.default.listen('moveDragDeckDone', function (data) {

		if (!data.deck.full) {
			return;
		}

		var _deck = data.deck.cards;

		for (var i in _deck) {

			var _cardDomElement = _share2.default.get('domElement:' + _deck[i].id);

			(0, _elRender2.default)(_cardDomElement).addClass('full');
		}
	});

	// --------------------------------------------------------------------------------------------------------

	_event2.default.listen('dragDeck', function (data) {
		// {x, y, _dragDeck, _startCursor, _deck}

		for (var i in data._dragDeck) {

			var _zoom = _share2.default.get('zoom');

			var _position = data._deck.padding(data._dragDeck[i].index);

			var _params = {
				'left': _position.x + (data.x - data._startCursor.x) / _zoom + 'px',
				'top': _position.y + (data.y - data._startCursor.y) / _zoom + 'px',
				'z-index': _defaults2.default.topZIndex + (i | 0)
			};

			// Operations with DOM
			var _cardDomElement = _share2.default.get('domElement:' + data._dragDeck[i].card.id);

			(0, _elRender2.default)(_cardDomElement).css(_params);
		}
	});

/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// Move card to home
	_event2.default.listen('moveCardToHome', function (data) {

		if (_share2.default.get('lastCursorMove').distance > 0) {
			_common2.default.curLock();
		}

		for (var i in data.moveDeck) {

			var _position = data.departure.padding(data.moveDeck[i].index);
			var _params = {
				left: _position.x + 'px',
				top: _position.y + 'px'
			};

			var _cardDomElement = _share2.default.get('domElement:' + data.moveDeck[i].card.id);

			(0, _elRender2.default)(_cardDomElement).animate(_params, function () {

				_common2.default.curUnLock();

				if (data.departure) {
					data.departure.Redraw();
				}

				if (typeof data.callback == "function") {
					data.callback();
				}
			}, 'moveCardToHomeAnimation');
		}
	});

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_event2.default.listen('fieldThemesSet', function (pref) {

		var _fieldDomElement = _share2.default.get('domElement:field'); //Field.domElement;

		for (var prefName in _defaults2.default.themes) {

			// Clear old themes
			for (var i in _defaults2.default.themes[prefName]) {

				var themeName = _defaults2.default.themes[prefName][i];

				(0, _elRender2.default)(_fieldDomElement).removeClass(themeName);
			}

			// Add new themes
			var className = pref[prefName];
			// let className = defaults.themes[prefName][pref[prefName]];

			(0, _elRender2.default)(_fieldDomElement).addClass(className);
		}
	});

/***/ },
/* 75 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 76 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 77 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var shuffleArray = function shuffleArray(deck) {
		for (var j, x, _i = deck.length; _i; j = Math.floor(Math.random() * _i), x = deck[--_i], deck[_i] = deck[j], deck[j] = x) {};
	};

	var genType = function genType(_cardsColors, _cardsRanks) {

		var _deck = [];

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = _cardsColors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var cardColor = _step.value;
				var _iteratorNormalCompletion2 = true;
				var _didIteratorError2 = false;
				var _iteratorError2 = undefined;

				try {
					for (var _iterator2 = _cardsRanks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
						var cardRank = _step2.value;

						_deck.push(cardColor + cardRank);
					}
				} catch (err) {
					_didIteratorError2 = true;
					_iteratorError2 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion2 && _iterator2.return) {
							_iterator2.return();
						}
					} finally {
						if (_didIteratorError2) {
							throw _iteratorError2;
						}
					}
				}
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}

		return _deck;
	};

	var genTypes = {

		all: function all(ranks) {
			return genType(_defaults2.default.card.suits, ranks);
		},

		black: function black(ranks) {

			var _cardsSuits = _defaults2.default.card.colors.black;

			return genType(_cardsSuits, ranks);
		},

		red: function red(ranks) {

			var _cardsSuits = _defaults2.default.card.colors.red;

			return genType(_cardsSuits, ranks);
		},

		black_and_red: function black_and_red(ranks) {

			var _cardsSuits = [_defaults2.default.card.colors.red[Math.random() * _defaults2.default.card.colors.red.length | 0], _defaults2.default.card.colors.black[Math.random() * _defaults2.default.card.colors.black.length | 0]];

			return genType(_cardsSuits, ranks);
		},

		h_only: function h_only(ranks) {

			var _cardsSuits = ['h'];

			return genType(_cardsSuits, ranks);
		},

		d_only: function d_only(ranks) {

			var _cardsSuits = ['d'];

			return genType(_cardsSuits, ranks);
		},

		c_only: function c_only(ranks) {

			var _cardsSuits = ['c'];

			return genType(_cardsSuits, ranks);
		},

		s_only: function s_only(ranks) {

			var _cardsSuits = ['s'];

			return genType(_cardsSuits, ranks);
		},

		one_rank_only: function one_rank_only(ranks) {

			var _cardsSuits = [_defaults2.default.card.solors[Math.random() * _defaults2.default.card.solors.length | 0]];

			return genType(_cardsSuits, ranks);
		},

		hearts: function hearts(ranks) {
			return genTypes.h_only();
		},

		diamonds: function diamonds(ranks) {
			return genTypes.d_only();
		},

		clubs: function clubs(ranks) {
			return genTypes.c_only();
		},

		spades: function spades(ranks) {
			return genTypes.s_only();
		}
	};

	exports.default = function (data) {

		var default_type = 'all';

		var default_shuffle = false;
		var max_iterations = 10;

		var type = data && data.type && typeof data.type == 'string' ? data.type : default_type;
		var deckCount = data && data.deckCount && typeof data.deckCount == 'number' ? data.deckCount : 52;
		var iterations = data && data.iterations && typeof data.iterations == 'number' && data.iterations < max_iterations ? data.iterations : 1;
		var shuffle = data && data.shuffle && typeof data.shuffle != 'undefuned' ? data.shuffle : default_shuffle;

		var _ranks = deckCount == 36 ? _defaults2.default.card.ranks36 : _defaults2.default.card.ranks;

		if (data && data.ranks) {

			_ranks = [];

			for (i in data.ranks) {
				if (_defaults2.default.card.rank.includes(data.ranks[i].toString())) {
					_ranks.push(data.ranks[i].toString());
				}
			}
		}

		var _deck = [];

		for (; iterations > 0; iterations -= 1) {
			_deck = _deck.concat(genTypes[type](_ranks));
		}

		if (shuffle) {
			shuffleArray(_deck);
		}

		return _deck;
	};

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _share = __webpack_require__(1);

	var _share2 = _interopRequireDefault(_share);

	var _event = __webpack_require__(2);

	var _event2 = _interopRequireDefault(_event);

	var _common = __webpack_require__(5);

	var _common2 = _interopRequireDefault(_common);

	var _defaults = __webpack_require__(3);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _deckGenerator = __webpack_require__(78);

	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);

	var _field = __webpack_require__(12);

	var _field2 = _interopRequireDefault(_field);

	var _elRender = __webpack_require__(65);

	var _elRender2 = _interopRequireDefault(_elRender);

	var _mapCommon = __webpack_require__(47);

	var _mapCommon2 = _interopRequireDefault(_mapCommon);

	var _history = __webpack_require__(36);

	var _history2 = _interopRequireDefault(_history);

	var _stateManager = __webpack_require__(6);

	var _stateManager2 = _interopRequireDefault(_stateManager);

	var _renderTest = __webpack_require__(80);

	var _renderTest2 = _interopRequireDefault(_renderTest);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	// event.listen('addStep', (e) => {
	// 	console.log('* Добавили данные для истории:', e.move ? e.move.stepType : 'none', e);
	// 	if(e.move && !e.move.stepType) {
	// 		throw new Error('debug');
	// 	}
	// });

	// event.listen('makeStep', (e) => {
	// 	console.log('# Отправили данные на сохранение в историю:', e);
	// }

	// -- LOG

	// $(document).ready(() => {
	// 	$(document.body).append(
	// 		$('<span>')
	// 			.attr({id : 'log_1'})
	// 			.css({
	// 				'display'          : 'none'                                                            ,
	// 				'width'            : '250px'                                                           ,
	// 				'max-height'       : '70%'                                                             ,
	// 				'position'         : 'absolute'                                                        ,
	// 				'top'              : '0px'                                                             ,
	// 				'right'            : '2px'                                                             ,
	// 				'overflow'         : 'hidden'                                                          ,
	// 				'zIndex'           : 999                                                               ,
	// 				'background'       : 'rgba(0, 0, 0, .5)'                                               ,
	// 				'padding'          : '4px'                                                             ,
	// 				'border-radius'    : '0px 0px 5px 5px'                                                 ,
	// 				'text-shadow'      : '#000 1px 0 0px, #000 0 1px 0px, #000 -1px 0 0px, #000 0 -1px 0px',
	// 				'font-size'        : '10pt'                                                            ,
	// 				'font-family'      : 'Tahoma, Verdana'
	// 			})
	// 			.dblclick(function() {
	// 				setTimeout(() => {
	// 					$(this)
	// 						.hide()
	// 						.empty();
	// 				}, 100);
	// 			})
	// 	);
	// });


	var _log = function _log(text, color, e) {

		console.log('%c»%c' + text, 'color: white;',

		// 'background: rgba(0, 0, 0, .5);'                                                 +
		'border-radius: 3px;' +
		// 'text-shadow: #777 1px 0 0px, #777 0 1px 0px, #777 -1px 0 0px, #777 0 -1px 0px;' +
		'padding: 2px;' +
		// 'border: 1px solid black;'                                                       +
		'background: ' + color + ';',
		// 'font-weight: bold;'
		// 'color: ' + color + ';'

		e ? e : '');

		// $('#log_1')
		// 	.show()
		// 	.append(
		// 		$('<div>')
		// 		.html(text)
		// 		.css({
		// 			color
		// 		})
		// 	)
		// 	.prop({
		// 		scrollTop : 1e10//log_1.scrollHeight - log_1.clientHeight
		// 	})
	};

	// event.listen('shareSet:stepType', (e) => {
	// 	_log('stepType:' + e, 'yellow');
	// })

	// event.listen('saveSteps', e => {
	// 	if(window.xxx) {
	// 		throw new Error('saveSteps');
	// 	}
	// 	_log('saveSteps', 'yellow');
	// });

	// event.listen('shareSet:curLockState', (e) => {
	// 	_log('curLockState:' + e, '#aaffaa');
	// });

	// event.listen('moveEnd', (e) => {
	// 	_log('moveEnd', 'orange');
	// });

	// event.listen('forceMoveEnd', (e) => {
	// 	_log('forceMoveEnd', 'orange');
	// });

	// event.listen('gameInit', (e, a) => {
	// 	_log('gameInit (' + ((a.eventInfo.index | 0) + 1) + ', ' + a.eventInfo.count + ')', '#ff7777');
	// });

	// event.listen('startSession', (e) => {
	// 	_log('start', 'red', e);
	// });

	// event.listen('stopSession', () => {
	// 	_log('stop', 'green');
	// });

	// document.onwheel = (e) => {

	// 	let area = null;
	// 		// if (e.target.id == 'log_1') {
	// 		// 	area = e.target;
	// 		// } else 
	// 		if(e.target.parentNode.id == 'log_1') {
	// 		area = e.target.parentNode;
	// 	} else {
	// 		return;
	// 	}

	// 	let delta = e.deltaY || e.detail || e.wheelDelta;

	// 	area.scrollTop = area.scrollTop + delta;

	// 	// if (delta < 0 && area.scrollTop == 0) {
	// 	e.preventDefault();
	// 	// }

	// 	// if (delta > 0 && area.scrollHeight - area.clientHeight - area.scrollTop <= 1) {
	// 	e.preventDefault();
	// 	// }
	// };

	var debugHistoryMgrClass = function () {
		function debugHistoryMgrClass() {
			_classCallCheck(this, debugHistoryMgrClass);

			this._history = [];
			this._redo = [];
		}

		_createClass(debugHistoryMgrClass, [{
			key: 'record',
			value: function record(data) {

				this._redo = [];
				this._history.push(data);
			}
		}, {
			key: 'undo',
			value: function undo() {

				var _step = this._history.pop();
				if (_step) {
					this._redo.push(_step);
				};
				return _step;
			}
		}, {
			key: 'redo',
			value: function redo() {

				var _step = this._redo.pop();
				if (_step) {
					this._history.push(_step);
				};
				return _step;
			}
		}]);

		return debugHistoryMgrClass;
	}();

	;

	var debugHistoryMgr = new debugHistoryMgrClass();

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

	// let runTests = ()=>{
	// 	// renderTest();
	// }

	// event.listen('gameInit', (e)=>{
	// 	if(!e.firstInit) {return;};
	// 	runTests();
	// })

	exports.default = {
		share: _share2.default,
		deckGenerator: _deckGenerator2.default,
		debugHistory: debugHistory,
		debugHistoryMgr: debugHistoryMgr,
		validateCardName: _common2.default.validateCardName,
		elRender: _elRender2.default,
		defaults: _defaults2.default,
		stateManager: _stateManager2.default,
		history: _history2.default,
		field: _field2.default,
		groupGenerators: {
			mapCommon: _mapCommon2.default
		}
	};

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _elRender = __webpack_require__(65);

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
try{module.exports = SolitaireEngine;}catch(e){}
