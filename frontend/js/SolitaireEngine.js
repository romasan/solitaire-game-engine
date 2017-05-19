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
	
	var _move = __webpack_require__(71);
	
	var _move2 = _interopRequireDefault(_move);
	
	var _forceMove = __webpack_require__(23);
	
	var _forceMove2 = _interopRequireDefault(_forceMove);
	
	var _render = __webpack_require__(72);
	
	var _render2 = _interopRequireDefault(_render);
	
	var _field = __webpack_require__(12);
	
	var _field2 = _interopRequireDefault(_field);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _winCheck = __webpack_require__(87);
	
	var _winCheck2 = _interopRequireDefault(_winCheck);
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _tips = __webpack_require__(9);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _deckGenerator = __webpack_require__(89);
	
	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// init
	var preloadCallback = null,
	    firstInit = true;
	
	exports.event = _event2.default;
	exports.options = _defaults2.default;
	exports.winCheck = _winCheck2.default.hwinCheck;
	exports.generator = _deckGenerator2.default;
	exports.version = (90914910400).toString().split(9).slice(1).map(function (e) {
		return parseInt(e, 8);
	}).join('.');
	
	exports.onload = function (callback) {
		preloadCallback = callback;
	};
	
	exports.onChangePreferences = function (callback) {
		_share2.default.set('changePreferencesCallback', callback);
	};
	
	exports.init = function (gameConfig) {
	
		_event2.default.dispatch('gameInit', { firstInit: firstInit });
	
		_event2.default.clearByTag(_event2.default.tags.inGame);
		_event2.default.setTag(_event2.default.tags.inGame);
	
		_field2.default.clear();
		_field2.default.create(gameConfig);
	
		if (firstInit) {
	
			firstInit = false;
	
			if (typeof preloadCallback == 'function') {
				var _data = _share2.default.get('gamePreferencesData');
				preloadCallback(_data);
			}
		}
	
		var changePreferencesCallback = _share2.default.get('changePreferencesCallback');
	
		if (typeof changePreferencesCallback == 'function') {
			var _data2 = _share2.default.get('gamePreferencesData');
			changePreferencesCallback(_data2);
		}
	
		_event2.default.dispatch('gameInited');
	
		exports.Redraw = function (data) {
			_field2.default.Redraw(data);
		};
	};
	
	if (true) {
		console.log('Solitaire Engine v.', exports.version);
		var debug = __webpack_require__(90);
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
				if (typeof this._data[name] != 'undefined') {
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
	
	
				// let _debugValueName = 'curLockState';
	
				// if(name == _debugValueName) {
				// 	console.log('%cgebug: change ' + _debugValueName + ' from ' + this._data[_debugValueName] + ' to ' + data, 'color:' + (data == true ? 'orange' : 'blue'));
				// }
	
				// "foo", "bar", false
				if (typeof name == 'string') {
	
					_event2.default.dispatch('shareChange:' + name, {
						"from": this._data[name],
						"to": data
					});
	
					if (typeof forceClone == 'boolean' && forceClone) {
						try {
							// this._data[name] = Object.assign({}, data);
							this._data[name] = ['string', 'number', 'boolean'].indexOf(typeof data === 'undefined' ? 'undefined' : _typeof(data)) >= 0 ? data : data instanceof Array ? Object.assign([], data) : Object.assign({}, data);
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
							"from": this._data[_name2],
							"to": name[_name2]
						});
	
						if (typeof forceClone == 'boolean' && forceClone) {
							try {
								// this._data[_name] = Object.assign({}, name[_name]);
								this._data[_name2] = ['string', 'number', 'boolean'].indexOf(_typeof(name[_name2])) >= 0 ? name[_name2] : name[_name2] instanceof Array ? Object.assign([], name[_name2]) : Object.assign({}, name[_name2]);
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
	 * once
	 * remove
	 * dispatch
	 * clear
	 * setTag
	 * clearByTag
	 * get
	 * has
	 * _getAll
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
				"preInit": 'preInit',
				"inGame": 'inGame'
			};
	
			this._tag = this.tags.preInit;
	
			this._events = {};
	
			this._id = 0;
		}
	
		_createClass(Event, [{
			key: 'listen',
			value: function listen(eventName, callback, context, once) {
	
				if (typeof callback != 'function' || typeof eventName != 'string') {
					return;
				}
	
				this._id += 1;
	
				if (this._events[eventName]) {
	
					this._events[eventName].push({
						"id": this._id,
						"tag": this._tag,
						"context": context,
						"callback": callback,
						"once": once
					});
				} else {
	
					this._events[eventName] = [{
						"id": this._id,
						"tag": this._tag,
						"callback": callback,
						"context": context,
						"once": once
					}];
				}
	
				return this._id | 0;
			}
		}, {
			key: 'once',
			value: function once(eventName, callback, context) {
				return this.listen(eventName, callback, context, true);
			}
		}, {
			key: 'remove',
			value: function remove(id, eventName) {
	
				// console.log('### event:remove', id);
	
				for (var _eventName in this._events) {
					this._events[_eventName] = this._events[_eventName].filter(function (e) {
						return e.id != id;
					});
				}
			}
		}, {
			key: 'dispatch',
			value: function dispatch(eventName, data) {
	
				if (this._events[eventName]) {
	
					for (var i in this._events[eventName]) {
	
						if (this._events[eventName][i]) {
	
							this._events[eventName][i].callback(data, {
								"eventInfo": {
									"eventName": eventName,
									"index": i,
									"count": this._events[eventName].length
								}
							});
	
							if (this._events[eventName][i].once) {
								delete this._events[eventName][i];
							}
						}
					}
	
					this._events[eventName] = this._events[eventName].filter(function (e) {
						return e;
					});
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
					this._events[eventName] = this._events[eventName].filter(function (e) {
						return e.tag != tag;
					});
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
							_correct = _correct && this._events[eventName][i][_attr] == filter[_attr];
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
		}, {
			key: '_getAll',
			value: function _getAll() {
				return this._events;
			}
	
			// getEventsByName(eventName) {
			// 	return this._events.indexOf(eventName) >= 0 ? this._events[this._events.indexOf(eventName)] : null;
			// }
	
			// log() {}
	
		}, {
			key: '_debug',
			value: function _debug() {
				var data = {};
				for (var eventName in this._events) {
					data[eventName] = this._events[eventName].length;
				}
				return data;
			}
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
	
		// Theme
	
		"themes": {
			"field": ['default_field', 'alternative_field'],
			"face": ['default_face', 'alternative_face'],
			"back": ['default_back', 'alternative_back']
		},
	
		"pref": {
			"field": 'default_field',
			"face": 'alternative_face',
			"back": 'default_back'
		},
	
		// Tips
	
		"showTips": true,
		"showTipsDestination": false,
		"showTipPriority": false,
		"canMoveFlip": false,
	
		"tipsParams": {
			"hideOnEmpty": false,
			"excludeHomeGroups": true
		},
	
		// Field
	
		"zoom": 1.0,
	
		"locale": 'ru',
	
		"animation": true,
		"animationTime": 200, // time in milliseconds for 100px
	
		"inputParams": {
			"doubleClick": false
		},
	
		"showPrefFlipCard": true,
	
		// Group
	
		"flip": null, // param for deck
		"actions": null, // param for deck
	
		// Deck
	
		"can_move_flip": false,
		"showSlot": true,
	
		"autohide": false,
		"autoUnflipTop": true,
	
		"paddingType": '_default',
		"flip_type": 'none',
	
		"rotate": 0,
	
		"takeRules": ['any'],
		"putRules": ['any'],
	
		"fullRules": ['not'],
	
		"moveDistance": 0,
	
		"padding_y": 0,
		"padding_x": 0,
		"flip_padding_y": 0,
		"flip_padding_x": 0,
		"move_distance": 10,
		"debugLabels": false,
	
		"startZIndex": 100,
		"topZIndex": 900,
	
		// Card
	
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
	
		// Other
	
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
	
	var _deck2 = __webpack_require__(14);
	
	var _deck3 = _interopRequireDefault(_deck2);
	
	var _tips = __webpack_require__(9);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/*
	 * break
	 * take
	 * drag
	 * put
	 */
	
	// class inputLog() {
	// 
	// 	constructor() {
	// 
	// 		this._log = [];
	// 		this._maxLength = 3;
	// 	}
	// 
	// 	push(eventName, date = new Date().getTime()) {
	// 
	// 		if(!eventName) {
	// 			return;
	// 		}
	// 
	// 		this.log.push({
	// 			"date"  : date,
	// 			"event" : eventName
	// 		});
	// 
	// 		if(this._log.length > this._maxLength) {
	// 			this._log.unshift();
	// 		}
	// 	}
	// }
	
	// let Log = new inputLog();
	
	// let keys = {
	// 	"37" : "left" ,
	// 	"39" : "right"
	// }
	
	// document.addEventListener('keydown', e => {
	// 	if(e.keyCode in keys) {
	// 		Log(keys[e.keyCode]);
	// 	}
	// });
	
	var inputs = function () {
		function inputs() {
			var _this = this;
	
			_classCallCheck(this, inputs);
	
			_share2.default.set('dragDeck', null);
			_share2.default.set('startCursor', null);
	
			// event.listen('undo', this._inputUndoRedo());
			// event.listen('redo', this._inputUndoRedo());
	
			try {
	
				document.addEventListener('mousedown', function (data) {
	
					if (data.button !== 0) {
						return;
					}
	
					_this.take(data.target, data.clientX, data.clientY);
				});
	
				document.addEventListener('mousemove', function (data) {
					_this.drag(data.clientX, data.clientY);
				});
	
				document.addEventListener('mouseup', function (data) {
					_this.put(data.target, data.clientX, data.clientY);
				});
	
				document.addEventListener('mouseleave', function (data) {
					_this.put(data.target, data.clientX, data.clientY);
				});
	
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
	
					// event.dispatch('stopAnimations');
	
					_this.take(data.target, data.clientX, data.clientY);
					_this.put(data.target, data.clientX, data.clientY, true);
	
					_common2.default.curUnLock();
				};
	
				document.addEventListener('touchstart', function (data) {
	
					data.preventDefault();
	
					_this.take(data.target, data.touches[0].clientX, data.touches[0].clientY);
				}, false);
	
				document.addEventListener('touchmove', function (data) {
	
					// if(share.get('startCursor')) {
					data.preventDefault();
					// }
	
					_this.drag(data.touches[0].clientX, data.touches[0].clientY);
				}, false);
	
				document.addEventListener('touchend', function (data) {
	
					data.preventDefault();
	
					_this.put(data.changedTouches[0].target, data.changedTouches[0].clientX, data.changedTouches[0].clientY);
				}, false);
			} catch (e) {}
		}
	
		_createClass(inputs, [{
			key: 'break',
			value: function _break() {
	
				var _dragDeck = _share2.default.get('dragDeck');
	
				if (_dragDeck && _dragDeck[0] && _dragDeck[0].card && _dragDeck[0].card.parent) {
	
					var _deck = _deck3.default.getDeckById(_dragDeck[0].card.parent);
	
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
	
				if (_common2.default.isCurLock() || document.getElementsByClassName('animated').length || // TODO )==
				_share2.default.get('sessionStarted')) {
					return;
				}
	
				_event2.default.dispatch('startRunHistory');
	
				// click empty deck
				if (target.className.split(' ').indexOf('slot') >= 0) {
	
					var _id = target.id,
					    _deck = _common2.default.getElementById(_id);
	
					if (_share2.default.get('markerMode') || _share2.default.get('specialStepMode')) {
						// break;
						_deck = null;
					}
	
					if (_deck) {
	
						_event2.default.dispatch('click', {
							"to": _deck,
							"toCard": null
						});
	
						_event2.default.dispatch('click:emptyDeck', {
							"to": _deck,
							"toCard": null
						});
					}
				}
	
				// click card in deck
				if (target.className.split(' ').indexOf('draggable') >= 0) {
					var _ret = function () {
	
						var _id = target.id,
						    _card = _id ? _common2.default.getElementById(_id) : null,
						    _parent = _card && _card.parent ? _card.parent : null,
						    _deck = _parent ? _deck3.default.getDeckById(_parent) : null;
	
						// mark card
						if (_deck && _share2.default.get('markerMode')) {
							// break;
	
							_event2.default.dispatch('toggleMarkCard', {
								"card": _card,
								"callback": function callback(cardIsMarked) {
	
									var cardIndex = _deck.getCardIndexById(_card.id);
	
									var stepData = {};
	
									stepData[cardIsMarked ? 'markCard' : 'unmarkCard'] = {
										"deckName": _deck.name,
										"cardName": _card.name,
										"cardIndex": cardIndex
									};
	
									_event2.default.dispatch('addStep', stepData);
	
									_event2.default.dispatch('toggleMarkerMode');
								}
							});
	
							_deck = null;
						}
	
						if (_deck && _share2.default.get('specialStepMode')) {
							// break;
							_event2.default.dispatch('specialStep', _card);
							_event2.default.dispatch('toggleSpecialStepMode');
							_deck = null;
						}
	
						if (_deck) {
	
							// event.dispatch('dragStart', {
							// 	"deck" : _deck,
							// 	"card" : _card
							// });
	
							_event2.default.dispatch('click', {
								"to": _deck,
								"toCard": _card
							});
	
							if (_card.flip) {
	
								_event2.default.dispatch('click:flipCard', {
									"to": _deck,
									"toCard": _card
								});
							} else {
	
								_event2.default.dispatch('click:unflipCard', {
									"to": _deck,
									"toCard": _card
								});
							}
	
							// нельзя брать перевёрнутые карты
							if (_card.flip) {
								return {
									v: void 0
								};
							}
						}
	
						// _deck.runActions();
	
						var _dragDeck = _deck ? _deck.Take(_id) : null;
	
						_share2.default.set('dragDeck', _dragDeck);
	
						if (_dragDeck) {
	
							_share2.default.set('startCursor', {
								"x": x,
								"y": y
							});
	
							// ???
							_tips2.default.tipsDestination({
								"currentCard": _card
							});
						}
					}();
	
					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
				}
			}
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
	
				var _distance = _startCursor ? Math.sqrt(function (e) {
					return e * e;
				}(x - _startCursor.x) + function (e) {
					return e * e;
				}(y - _startCursor.y)) : 0;
	
				var _deck = _common2.default.getElementById(_dragDeck[0].card.parent);
	
				// let _position = _deck.padding(_dragDeck[_dragDeck.length - 1].index);
	
				_event2.default.dispatch('dragDeck', {
					"x": x,
					"y": y,
					"dragDeck": _dragDeck,
					"startCursor": _startCursor,
					"deck": _deck,
					"card": _dragDeck[0].card,
					"distance": _distance
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
					"distance": _distance,
					"dbclick": !!dbclick,
					"direction": {
						"x": x - _startCursor.x, // (+) rigth / (-) left
						"y": y - _startCursor.y, // (+) down  / (-) up
						"right": x > _startCursor.x,
						"left": x < _startCursor.x,
						"down": y > _startCursor.y,
						"up": y < _startCursor.y
					},
					"lastPosition": {
						"x": x,
						"y": y
					},
					"deckPosition": {
						"x": _position.x + (x - _startCursor.x),
						"y": _position.y + (y - _startCursor.y)
					}
				};
	
				_share2.default.set('lastCursorMove', cursorMove, _defaults2.default.forceClone);
				_share2.default.set('lastDragDeck', {
					"dragDeckParentId": _dragDeck[0].card.parent,
					"dragDeck": _dragDeck
				}, _defaults2.default.forceClone);
	
				_event2.default.dispatch('hideCard', target);
				var _dop = document.elementFromPoint(x, y);
				_event2.default.dispatch('showCard', target);
	
				// if(_dop && _dop.id) {
				_event2.default.dispatch('Move', {
					"moveDeck": _dragDeck,
					"to": _dop && _dop.id ? _dop.id : 'mat',
					"cursorMove": cursorMove
				});
				// }
	
				// _deck.Redraw();
	
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
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _drawPreferences = __webpack_require__(64);
	
	var _drawPreferences2 = _interopRequireDefault(_drawPreferences);
	
	var _preferencesEvents = __webpack_require__(66);
	
	var _preferencesEvents2 = _interopRequireDefault(_preferencesEvents);
	
	var _defaultPreferences = __webpack_require__(68);
	
	var _defaultPreferences2 = _interopRequireDefault(_defaultPreferences);
	
	var _specialStep = __webpack_require__(69);
	
	var _specialStep2 = _interopRequireDefault(_specialStep);
	
	var _showFlipCardOnMove = __webpack_require__(70);
	
	var _showFlipCardOnMove2 = _interopRequireDefault(_showFlipCardOnMove);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * Listeners:
	 *
	 * gameInit
	 * gameInited
	 * moveEnd
	 * actionBreak
	 * startSession
	 * stopSession
	 * historyReapeater
	 * toggleMarkerMode
	 * toggleSpecialStepMode
	 *
	 * Methods:
	 *
	 * isCurLock
	 * curLock
	 * curUnLock
	 * getElements
	 * getElementById
	 * getElementsByName
	 * getElementByName
	 * getElementsByType
	 * validateCardName
	 * genId
	 * animationOn
	 * animationDefault
	 * animationOff
	 * stopRunHistory
	 * startRunHistory
	 * toggleMarkerMode
	 * toggleSpecialStepMode
	 */
	
	_event2.default.listen('gameInit', function (data) {
	
		_share2.default.set('stepType', _defaults2.default.stepType);
		_share2.default.delete('sessionStarted');
	
		_share2.default.set('markerMode', false);
	
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
	
	var getElementByName = function getElementByName(name, type) {
		var element = getElementsByName(name, type)[0];
		return element;
	};
	
	var getElementsByType = function getElementsByType(type, filter) {
	
		var response = [];
	
		var _elements = _share2.default.get('elements');
	
		if (type) {
			for (var i in _elements) {
				if (typeof _elements[i].type == 'string' && _elements[i].type == type) {
					if (filter) {
	
						var checkedCount = 0,
						    linesCount = 0;
	
						for (var filterName in filter) {
	
							linesCount += 1;
	
							if (filter[filterName] == _elements[i][filterName]) {
								checkedCount += 1;
							}
						}
	
						if (checkedCount > 0 && checkedCount == linesCount) {
							response.push(_elements[i]);
						}
					} else {
						response.push(_elements[i]);
					}
				}
			}
		}
	
		return response;
	};
	
	// validator
	
	var validateCardName = function validateCardName(name) {
	
		if (typeof name != 'string') {
	
			console.warn('Warning: validate name must have string type "' + name + '"', name);
	
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
				"color": color,
				"value": value,
				"name": name,
				"suit": suit,
				"rank": rank
			};
		} else {
	
			console.warn('Warning: validate name:', name, '- incorrect');
	
			return false;
		}
	};
	
	// ID generator
	
	var _id = 0;
	
	var genId = function genId(e) {
		return _id += 1;
	};
	
	// animations
	
	_share2.default.set('animation', _defaults2.default.animation);
	
	var animationOn = function animationOn(e) {
		// console.warn('animationOn');
		_share2.default.set('animation', true);
	};
	
	var animationDefault = function animationDefault(e) {
		// console.warn('animationDefault');
		_share2.default.set('animation', _defaults2.default.animation);
	};
	
	var animationOff = function animationOff(e) {
		// console.warn('animationOff');
		_share2.default.set('animation', false);
	};
	
	var stopRunHistory = function stopRunHistory(e) {
		_share2.default.set('stopRunHistory', true);
	};
	_event2.default.listen('stopRunHistory', stopRunHistory);
	
	var startRunHistory = function startRunHistory(e) {
		_share2.default.set('stopRunHistory', false);
	};
	_event2.default.listen('startRunHistory', startRunHistory);
	
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
	
	var toggleMarkerMode = function toggleMarkerMode(e) {
	
		var mode = _share2.default.get('markerMode');
	
		_share2.default.set('markerMode', !mode);
	
		if (mode) {
			document.getElementById('markCard').className = '';
		} else {
			document.getElementById('markCard').className = 'markCardButtonActive';
		}
	};
	
	_event2.default.listen('toggleMarkerMode', toggleMarkerMode);
	
	var toggleSpecialStepMode = function toggleSpecialStepMode(e) {
	
		var mode = _share2.default.get('specialStepMode');
	
		_share2.default.set('specialStepMode', !mode);
	
		var classList = document.getElementById('specialMoveBtn').className.split(' ');
	
		if (mode) {
			classList = classList.filter(function (className) {
				return className != 'specialStepButtonActive';
			});
		} else {
			classList.push('specialStepButtonActive');
		}
	
		document.getElementById('specialMoveBtn').className = classList.join(' ');
	};
	
	_event2.default.listen('toggleSpecialStepMode', toggleSpecialStepMode);
	
	// document.onkeydown = e => {
	// 	if([32, 37, 39].indexOf(e.keyCode) >= 0) {
	// 		e.preventDefault();
	// 	}
	// }
	
	exports.default = {
		"isCurLock": isCurLock,
		"curLock": curLock,
		"curUnLock": curUnLock,
		"getElements": getElements,
		"getElementById": getElementById,
		"getElementsByName": getElementsByName,
		"getElementByName": getElementByName,
		"getElementsByType": getElementsByType,
		"validateCardName": validateCardName,
		"genId": genId,
		"animationOn": animationOn,
		"animationOff": animationOff,
		"animationDefault": animationDefault
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
	 * log
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
	
				_event2.default.dispatch('debugFlag', { flag: 2, color: 'green', text: 'sm:backup' });
	
				this._state = {};
	
				for (var _i in this._sourceList) {
	
					var _element = _share2.default.get(this._sourceList[_i]);
	
					this._state[this._sourceList[_i]] = ['string', 'number', 'boolean'].indexOf(typeof _element === 'undefined' ? 'undefined' : _typeof(_element)) >= 0 ? _element : _element instanceof Array ? Object.assign([], _element) : Object.assign({}, _element);
				}
	
				this._state.model = {};
	
				var _decks = (0, _getDecks2.default)();
	
				for (var deckId in _decks) {
	
					var _cards = [];
	
					for (var cardId in _decks[deckId].cards) {
	
						var _card = {
							"name": _decks[deckId].cards[cardId].name,
							"id": _decks[deckId].cards[cardId].id
						};
	
						for (var _i2 in cardAttributes) {
							var _name = cardAttributes[_i2];
							_card[_name] = _decks[deckId].cards[cardId][_name];
						}
	
						_cards.push(_card);
					}
	
					this._state.model[deckId] = {
						"name": _decks[deckId].name,
						"cards": _cards,
						"group": _decks[deckId].parent
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
				for (var _i3 in this._clearList) {
					_share2.default.delete(this._clearList[_i3]);
				}
	
				for (var _i4 in this._sourceList) {
					_share2.default.set(this._sourceList[_i4], this._state[this._sourceList[_i4]], true);
				}
	
				for (var deckId in this._state.model) {
	
					var _deck = (0, _getDeckById2.default)(deckId);
	
					var _cards = [];
	
					for (var cardIndex in this._state.model[deckId].cards) {
	
						var cardId = this._state.model[deckId].cards[cardIndex].id;
	
						var _card = _common2.default.getElementById(cardId);
	
						if (_card.name == this._state.model[deckId].cards[cardIndex].name) {
	
							for (var attrIndex in cardAttributes) {
								var attrName = cardAttributes[attrIndex];
								_card[attrName] = this._state.model[deckId].cards[cardIndex][attrName];
							}
	
							_cards.push(_card);
						} else {
							console.warn('Что-то не так с картой', this._state.model[deckId].cards[i].id, this._state.model[deckId].cards[i].name, ' != ', _card.id, _card.name);
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
		}, {
			key: 'log',
			value: function log() {
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
	
	var _autoMoveToHome = __webpack_require__(63);
	
	var _autoMoveToHome2 = _interopRequireDefault(_autoMoveToHome);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * getTips
	 * checkTips
	 * showTips
	 * hideTips
	 * tipsMove
	 * tipsDestination
	 * checkFrom
	 * fromTo
	 */
	
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
	
		var _decks = _deck2.default.getDecks({
			"visible": true
		});
	
		// console.groupCollapsed('check tips');
		_tips = (0, _allToAll2.default)({
			"decks": _decks
		});
		// console.groupEnd();
	
		if (_tips.length == 0 && _share2.default.get('stepType') == _defaults2.default.stepType) {
	
			_event2.default.dispatch('noTips');
			console.log('No possible moves.');
		}
	
		// let _showTips = share.get('showTips')
		if (_showTips) {
	
			var _homeGroups = _field2.default.homeGroups;
	
			for (var i in _tips) {
	
				// TODO инициализировать "hideTipsInDom" в Field.js 
				if (
				// (
				// 	_tips[i].to.count === 0            &&
				// 	Field.tipsParams.hideOnEmpty
				// )                                   ||
				_field2.default.tipsParams.excludeHomeGroups && _homeGroups && _homeGroups.length) {
					// не выделять подсказки с ходом из "дома"
					if (_homeGroups.indexOf(_tips[i].from.deck.parent) < 0) {
						_event2.default.dispatch('showTip', {
							"el": _tips[i].from.card,
							"type": 'tipToHome'
						});
					}
				} else {
					_event2.default.dispatch('showTip', {
						"el": _tips[i].from.card,
						"type": 'tipToHome'
					});
				}
			}
		}
	};
	
	_event2.default.listen('makeStep', checkTips);
	_event2.default.listen('checkTips', checkTips);
	
	// вкл./выкл. показа подсказок
	
	var showTips = function showTips(data) {
	
		_showTips = true;
	
		if (data && data.init) {
			return;
		}
	
		checkTips();
	};
	_event2.default.listen('tips:on', showTips);
	_event2.default.listen('tipsON', showTips);
	
	var hideTips = function hideTips(data) {
	
		_showTips = false;
	
		if (data && data.init) {
			return;
		}
	
		checkTips();
	};
	_event2.default.listen('tips:off', hideTips);
	_event2.default.listen('tipsOFF', hideTips);
	
	// лучший ход на в текущем положении перетаскиваемой стопки
	var tipsMove = function tipsMove(data) {
	
		if (!_share2.default.get('showTipPriority')) {
			return;
		}
	
		_event2.default.dispatch('hideTips', { "types": ['tipPriority'] });
	
		if (_share2.default.showTipPriority && data && data.moveDeck && data.cursorMove && data.cursorMove.distance && data.cursorMove.distance >= _share2.default.moveDistance) {
	
			var Tip = (0, _bestTip2.default)(data.moveDeck, data.cursorMove);
	
			if (Tip) {
	
				_event2.default.dispatch('showTip', {
					"el": Tip.to.deck,
					"type": 'tipPriority'
				});
			}
		}
	};
	
	// tips destination decks
	var tipsDestination = function tipsDestination(data) {
	
		if (_share2.default.get('showTipsDestination')) {
	
			_event2.default.dispatch('hideTips');
	
			if (data && data.currentCard && data.currentCard.id) {
				for (var i in _tips) {
					if (_tips[i].from.card.id == data.currentCard.id) {
	
						_event2.default.dispatch('showTip', {
							"el": _tips[i].to.deck,
							"type": 'tipTo'
						});
					}
				}
			}
		}
	};
	
	// has tips with from
	var checkFrom = function checkFrom(from) {
	
		for (var i in _tips) {
			if (_tips[i].from.deck.name == from) {
				return true;
			}
		}
	
		return false;
	};
	
	// has tips with from and to
	var fromTo = function fromTo(from, to) {
	
		for (var i in _tips) {
			if (_tips[i].from.deck.name == from && _tips[i].to.deck.name == to) {
				return true;
			}
		}
	
		return false;
	};
	
	exports.default = {
		"tipTypes": tipTypes,
		"getTips": getTips,
		"checkTips": checkTips,
		"showTips": showTips,
		"hideTips": hideTips,
		"tipsMove": tipsMove,
		"checkFrom": checkFrom,
		"fromTo": fromTo,
		"tipsDestination": tipsDestination
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	/*
	 * get
	 * cardsInTakeDeck
	 * decksToPut
	 * put
	 */
	
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
			key: "get",
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
			key: "cardsInTakeDeck",
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
			key: "decksToPut",
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
			key: "put",
			value: function put(deckIndex_2, deckIndex, cardIndex, _cards) {
	
				var _cards_to = this._decks[deckIndex_2].cards,
				    _card_to = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
	
				this._moves.push({
	
					"from": {
						"deck": this._decks[deckIndex],
						"card": _cards[cardIndex],
						"count": _cards.length
					},
	
					"to": {
						"deck": this._decks[deckIndex_2],
						"lastCard": _card_to,
						"count": _cards_to.length
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
					"x": cursorMove.deckPosition.x + (_defaults2.default.card.width / 2 | 0),
					"y": cursorMove.deckPosition.y + (_defaults2.default.card.height / 2 | 0)
				};
	
				// координаты последней карты стопки назначения
				var _destination_deck_last_card_position = _autoTips[_i3].to.deck.padding(_autoTips[_i3].to.deck.cardsCount());
	
				// координаты центра стопки назначения
				var center_to = {
					"x": _destination_deck_last_card_position.x + (_defaults2.default.card.width / 2 | 0),
					"y": _destination_deck_last_card_position.y + (_defaults2.default.card.height / 2 | 0)
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
	
	var _addAutoSteps = __webpack_require__(59);
	
	var _addAutoSteps2 = _interopRequireDefault(_addAutoSteps);
	
	var _storage = __webpack_require__(62);
	
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
					_tips2.default.showTips({ "init": true });
				} else {
					_tips2.default.hideTips({ "init": true });
				}
	
				// устанвливаем тип хода по умолчанию
				_share2.default.set('stepType', _defaults2.default.stepType);
	
				var _values = {
					"showTipsDestination": 'boolean', // Альтернативные подсказки
					"showTipPriority": 'boolean',
					"moveDistance": 'number',
					"zoom": 'number', // масштаб отображения
					// "movesAnimation"    : 'string' ,
					"animationTime": 'number', // время анимации
					"showHistoryAnimation": 'boolean',
					"showPrefFlipCard": 'boolean'
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
						if (typeof prefName == 'string') {
	
							_preferences[prefName] = data.preferences[prefName];
	
							_prefData[prefName] = _pref && typeof _pref[prefName] != 'undefined' ? _pref[prefName] : data.preferences[prefName].value;
						}
					}
	
					_share2.default.set('gamePreferences', _preferences);
					_share2.default.set('gamePreferencesData', _prefData);
				} else {
					_share2.default.set('gamePreferences', {});
				}
	
				// параметры отображения подсказок
				for (var tipParamName in _defaults2.default.tipsParams) {
					this.tipsParams[tipParamName] = data.tipsParams && typeof data.tipsParams[tipParamName] != 'undefined' ? data.tipsParams[tipParamName] : _defaults2.default.tipsParams[tipParamName];
				}
	
				// параметры ввода
				for (var inputParamName in _defaults2.default.inputParams) {
					this.inputParams[inputParamName] = data.inputParams && typeof data.inputParams[inputParamName] != 'undefined' ? data.inputParams[inputParamName] : _defaults2.default.inputParams[inputParamName];
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
	
	var _groupFill = __webpack_require__(45);
	
	var _groupFill2 = _interopRequireDefault(_groupFill);
	
	var _groupRedraw = __webpack_require__(46);
	
	var _groupRedraw2 = _interopRequireDefault(_groupRedraw);
	
	var _groupGenerator = __webpack_require__(47);
	
	var _groupGenerator2 = _interopRequireDefault(_groupGenerator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var PARAMS = {
		"flip": { "type": 'any' },
		"showSlot": { "type": 'any' },
		"takeRules": { "type": 'any' },
		"putRules": { "type": 'any' },
		"fullRules": { "type": 'any' },
		"autoHide": { "type": 'any' },
		"paddingType": { "type": 'any' },
		"padding": { "type": 'any' },
		"paddingX": { "type": 'any' },
		"paddingY": { "type": 'any' },
		"flipPadding": { "type": 'any' },
		"flipPaddingX": { "type": 'any' },
		"flipPaddingY": { "type": 'any' },
		"actions": { "type": 'any' },
		"tags": { "type": 'any' },
		"showPrefFlipCard": { "type": null },
		"save": {
			"type": 'boolean',
			"default": true
		},
		"autoUnflipTop": {
			"type": 'boolean',
			"default": _defaults2.default.autoUnflipTop
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
				"x": data.position && data.position.x && typeof data.position.x == 'number' ? data.position.x : 0,
				"y": data.position && data.position.y && typeof data.position.y == 'number' ? data.position.y : 0
			};
	
			this.placement = data.placement ? {
				"x": data.placement.x ? data.placement.x : 0,
				"y": data.placement.y ? data.placement.y : 0
			} : null;
	
			this.decks = {};
	
			// сохраняем атрибуты чтобы прокинуть их колодам
			this.parameters = {};
			for (var paramName in PARAMS) {
				if (PARAMS[paramName].type == 'any') {
					this.parameters[paramName] = data[paramName] ? data[paramName] : _defaults2.default[paramName];
				} else if (PARAMS[paramName].type == 'boolean') {
					this.parameters[paramName] = typeof data[paramName] == 'boolean' ? data[paramName] : PARAMS[paramName].default;
					// this.parameters[paramName] = typeof data[paramName] == "boolean" ? data[paramName] : defaults[paramName];
				} else if (typeof data[paramName] != 'undefined') {
					this.parameters[paramName] = data[paramName];
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
						"x": 0,
						"y": 0
					};
				}
	
				// сортировка элементов в группе по заданному индексу и порядку добавления
	
				if (!data.parent) {
					data.parent = this.name;
				}
	
				data.parentPosition = {
					"x": this.position.x,
					"y": this.position.y
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
					for (; typeof this.deckIndex[_index] != 'undefined'; _index += 1) {}
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
				for (var paramName in PARAMS) {
	
					if (PARAMS[paramName].type == 'any') {
						if (this.parameters[paramName] && typeof data[paramName] == 'undefined') {
							data[paramName] = this.parameters[paramName];
						};
					} else if (PARAMS[paramName].type == 'boolean') {
	
						if (typeof this.parameters[paramName] == 'boolean' && typeof data[paramName] == 'undefined') {
							data[paramName] = this.parameters[paramName];
						}
					} else if (typeof this.parameters[paramName] != 'undefined') {
						data[paramName] = this.parameters[paramName];
					}
				};
	
				data.deckIndex = typeof data.deckIndex == 'number' ? data.deckIndex : (_index | 0) + 1;
	
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
	
	// add group
	
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
						"type": 'count',
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
	
					// TODO обратные связи
					// затирают прямы связи в IE
					// for(let from in data.decks) {
	
					// 	if(data.decks[from].name == _relation.to) {
					// 		_relation.to = null;
					// 		_relation.from = data.decks[to].name;
					// 		data.decks[from].relations.push(_relation)
					// 	}
					// }
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
		"getByName": getByName,
		"add": add
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
	
	var _putRules = __webpack_require__(16);
	
	var _putRules2 = _interopRequireDefault(_putRules);
	
	var _takeRules = __webpack_require__(18);
	
	var _takeRules2 = _interopRequireDefault(_takeRules);
	
	var _fullRules = __webpack_require__(19);
	
	var _fullRules2 = _interopRequireDefault(_fullRules);
	
	var _paddingTypes = __webpack_require__(20);
	
	var _paddingTypes2 = _interopRequireDefault(_paddingTypes);
	
	var _deckActions = __webpack_require__(21);
	
	var _deckActions2 = _interopRequireDefault(_deckActions);
	
	var _deckTake = __webpack_require__(40);
	
	var _deckTake2 = _interopRequireDefault(_deckTake);
	
	var _deckPut = __webpack_require__(41);
	
	var _deckPut2 = _interopRequireDefault(_deckPut);
	
	var _genCardByName2 = __webpack_require__(42);
	
	var _genCardByName3 = _interopRequireDefault(_genCardByName2);
	
	var _group = __webpack_require__(13);
	
	var _group2 = _interopRequireDefault(_group);
	
	var _getDecks = __webpack_require__(7);
	
	var _getDecks2 = _interopRequireDefault(_getDecks);
	
	var _getDeckById = __webpack_require__(8);
	
	var _getDeckById2 = _interopRequireDefault(_getDeckById);
	
	var _deckCardNames = __webpack_require__(43);
	
	var _deckCardNames2 = _interopRequireDefault(_deckCardNames);
	
	var _getDeck = __webpack_require__(44);
	
	var _getDeck2 = _interopRequireDefault(_getDeck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/*
	 * Redraw
	 * getTopCard
	 * getSomeCards
	 * lock
	 * unlock
	 * flipCheck
	 * unflipCardByIndex
	 * unflipTopCard
	 * flipAllCards
	 * unflipAllCards
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
	 * hideCards
	 * hideCardByIndex
	 * showCards
	 * showCardByIndex
	 * getCardsNames
	 * getCards
	 * getTopCards
	 * cardsCount
	 * getCardByIndex
	 * getCardIndexById
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
			this.showPrefFlipCard = typeof data.showPrefFlipCard == 'boolean' ? data.showPrefFlipCard : _share2.default.get('showPrefFlipCard');
	
			this.data = {};
	
			// changed parameters
			if (typeof data.showSlot == 'undefined') {
				data.showSlot = _defaults2.default.showSlot;
			}
	
			if (data.padding) {
				if (typeof data.padding.x == 'number' && typeof data.paddingX != 'number') {
					data.paddingX = data.padding.x;
				}
				if (typeof data.padding.y == 'number' && typeof data.paddingY != 'number') {
					data.paddingY = data.padding.y;
				}
			}
	
			if (data.flipPadding) {
				if (typeof data.flipPadding.x == 'number' && typeof data.flipPaddingX != 'number') {
					data.flipPaddingX = data.flipPadding.x;
				}
				if (typeof data.flipPadding.y == 'number' && typeof data.flipPaddingY != 'number') {
					data.flipPaddingY = data.flipPadding.y;
				}
			}
	
			this._params = {
				"padding_y": typeof data.paddingY == 'number' ? data.paddingY : _defaults2.default.padding_y,
				"flip_padding_y": typeof data.flipPaddingY == 'number' ? data.flipPaddingY : _defaults2.default.flip_padding_y,
				"padding_x": typeof data.paddingX == 'number' ? data.paddingX : _defaults2.default.padding_x,
				"flip_padding_x": typeof data.flipPaddingX == 'number' ? data.flipPaddingX : _defaults2.default.flip_padding_x,
				"startZIndex": typeof data.startZIndex == 'number' ? data.startZIndex : _defaults2.default.startZIndex,
				"rotate": typeof data.rotate == 'number' ? data.rotate : _defaults2.default.rotate,
				"x": 0,
				"y": 0
			};
	
			this.rotate = this._params.rotate;
	
			this.autoUnflipTop = typeof data.autoUnflipTop == 'boolean' ? data.autoUnflipTop : _defaults2.default.autoUnflipTop;
	
			// Flip
			var flipData = null;
			var flipType = data.flip && typeof data.flip == 'string' ? data.flip.indexOf(':') >= 0 ? function (e) {
	
				var name = e[0];
	
				if (e.length == 2) {
					flipData = e[1];
				}
	
				return _flipTypes2.default[name] ? name : _defaults2.default.flip_type;
			}(data.flip.split(':')) : _flipTypes2.default[data.flip] ? data.flip : _defaults2.default.flip_type : _defaults2.default.flip_type;
	
			this.cardFlipCheck = function (card, i, length) {
				card.flip = _flipTypes2.default[flipType](i, length, flipData);
			};
	
			// Put
			this.putRules = data.putRules ? typeof data.putRules == 'string' ? _putRules2.default[data.putRules] ? [data.putRules] : _defaults2.default.putRules : data.putRules.constructor == Array ? data.putRules.filter(function (ruleName) {
				return typeof ruleName == 'string' && _putRules2.default[ruleName] // TODO Exception (putRule "***" not found)
				? true : false;
			}) : _defaults2.default.putRules : _defaults2.default.putRules;
	
			if (this.putRules.length == 0) {
				this.putRules = _defaults2.default.putRules;
			}
	
			// Take
			// можно ли взять карту/стопку
			this.takeRules = data.takeRules ? typeof data.takeRules == 'string' ? _takeRules2.default[data.takeRules] ? [data.takeRules] : _defaults2.default.takeRules : data.takeRules.constructor == Array ? data.takeRules.filter(function (ruleName) {
				return typeof ruleName == 'string' && _takeRules2.default[ruleName];
			} // TODO Exception (putRule "***" not found)
			) : _defaults2.default.takeRules : _defaults2.default.takeRules;
	
			// Full
			// Правила сложенной колоды
			// Сложенная колода может использоваться для определения выиигрыша
			// В сложенную колоду нельзя класть новые карты
			this.fullRules = data.fullRules ? typeof data.fullRules == "string" ? _fullRules2.default[data.fullRules] ? [data.fullRules] : _defaults2.default.fullRules : data.putRules.constructor == Array ? data.fullRules.filter(function (ruleName) {
				return typeof ruleName == "string" && _fullRules2.default[ruleName];
			}) : _defaults2.default.fullRules : _defaults2.default.fullRules;
	
			// Padding
			// порядок карт в колоде
			var paddingData = null;
			var padding = data.paddingType // isset data.paddingType
			? typeof data.paddingType == 'string' // is string
			? _paddingTypes2.default[data.paddingType] // isset method
			? _paddingTypes2.default[data.paddingType] // use method(data.paddingType)
			: data.paddingType.indexOf(':') >= 0 // is method with attribute
			? function (e) {
	
				var name = e[0]; // method name
	
				if (_paddingTypes2.default[name]) {
					paddingData = e[1]; // save method data
					return _paddingTypes2.default[name]; // use method(data.paddingType:)(:data.paddingType)
				}
	
				return _paddingTypes2.default[_defaults2.default.paddingType]; // use default
			}(data.paddingType.split(':')) : _paddingTypes2.default[_defaults2.default.paddingType] // use default
			: _paddingTypes2.default[_defaults2.default.paddingType] // use default
			: _paddingTypes2.default[_defaults2.default.paddingType]; // use default
	
			this.padding = function (index) {
	
				var _cards = _this.getCards();
				var _index = index < _cards.length ? index : _cards.length - 1;
				var _card = _cards[_index] ? _cards[_index] : _this.cards[index];
	
				return padding(_this._params, _card, _index, _cards.length, _cards, paddingData);
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
				"deckData": data,
				"deck": this,
				"params": this._params
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
	
		// перерисовка стопки
	
	
		_createClass(Deck, [{
			key: 'Redraw',
			value: function Redraw(data) {
	
				// console.log('deck:Redraw', this.name);
	
				_event2.default.dispatch('redrawDeck', {
					"deck": this,
					"deckData": data,
					"params": this._params,
					"cards": this.cards
				});
	
				_event2.default.dispatch('redrawDeckFlip', {
					"cards": this.cards
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
			key: 'getSomeCards',
			value: function getSomeCards(count) {
	
				var _cards = [];
	
				if (typeof count != 'number' || count > this.cards.length || count < 1) {
					count = this.cards.length;
				}
	
				for (var i = 0; i < count; i += 1) {
					_cards.push(this.cards[this.cards.length - 1 - i]);
				}
	
				return _cards;
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
					this.cardFlipCheck(this.cards[cardIndex], cardIndex | 0, this.cards.length, this.cards[this.cards.length - 1].name);
				}
	
				_event2.default.dispatch('redrawDeckFlip', this);
			}
		}, {
			key: 'unflipCardByIndex',
			value: function unflipCardByIndex(index, save) {
	
				// console.log('deck:unflipCardByIndex:', this.name, index);
	
				if (this.cards[index]) {
	
					this.cards[index].flip = false;
	
					// event.dispatch('redrawDeckFlip', this);
					this.Redraw();
	
					if (save) {
	
						_event2.default.dispatch('addStep', {
							"unflip": {
								"deckName": this.name,
								"cardIndex": index,
								"cardName": this.cards[index].name
							}
						});
					}
				}
			}
		}, {
			key: 'unflipTopCard',
			value: function unflipTopCard(save) {
	
				// console.log('deck:unflipTopCard:', save);
	
				if (this.cards.length > 0) {
	
					this.unflipCardByIndex(this.cards.length - 1, save);
	
					// if(save) {
					// 	event.dispatch('addStep', {
					// 		"unflip" : {
					// 			"cardName"  : this.cards[this.cards.length - 1].name,
					// 			"cardIndex" : this.cards.length - 1                 ,
					// 			"deckName"  : this.name
					// 		}
					// 	});
					// }
				}
			}
		}, {
			key: 'flipAllCards',
			value: function flipAllCards() {
				var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
				var save = arguments[1];
	
	
				for (var i in this.cards) {
	
					this.cards[i].flip = true;
	
					if (save) {
						_event2.default.dispatch('addStep', {
							"flip": {
								"cardName": this.cards[i].name,
								"cardIndex": i,
								"deckName": this.name
							}
						});
					}
				}
	
				if (redraw) {
					this.Redraw();
				}
			}
		}, {
			key: 'unflipAllCards',
			value: function unflipAllCards() {
				var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
				var save = arguments[1];
	
	
				console.log('deck:unflipAllCards', save);
	
				for (var i in this.cards) {
	
					this.cards[i].flip = false;
	
					if (save) {
						_event2.default.dispatch('addStep', {
							"unflip": {
								"cardName": this.cards[i].name,
								"cardIndex": i,
								"deckName": this.name
							}
						});
					}
				}
	
				if (redraw) {
					this.Redraw();
				}
			}
		}, {
			key: 'checkFull',
			value: function checkFull() {
	
				if (!this.full && this.fullRules && this.fullRules.length > 0) {
	
					var full = true;
	
					for (var ruleIndex in this.fullRules) {
	
						var _rule = this.fullRules[ruleIndex];
	
						if (typeof _rule == 'string') {
							full = full && typeof _fullRules2.default[_rule] == 'function' && _fullRules2.default[_rule](this);
						} else {
	
							for (var subRule in _rule) {
								if (typeof subRule == 'string' && typeof _fullRules2.default[subRule] == 'function') {
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
				var _this2 = this,
				    _cards2;
	
				var afterVisible = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	
	
				// console.log('deck:Push', this.name, deck ? deck.map(e => e.name).join(',') : deck);
	
				var visibleCardsCount = this.cardsCount();
	
				// change cards parent id
				if (deck && typeof deck.length == "number") {
					deck = deck.map(function (e) {
						return e.parent = _this2.id, e;
					});
				} else {
					console.warn('deck:Push:map', deck, this.name);
				}
	
				// insert push deck after visible cards
				(_cards2 = this.cards).splice.apply(_cards2, [visibleCardsCount, 0].concat(_toConsumableArray(deck))); // TODO maybe concat faster than "..."?
			}
		}, {
			key: 'Pop',
			value: function Pop(count, clearParent) {
	
				// console.log('%cdeck:Pop', 'color:orange;font-weight:bold;', this.name, count, this.cards.length);
				if (this.cards.length < count) {
					console.warn('Pop', count, ' cards from', this.name, 'is failed');
				}
	
				var _cards = this.getCards();
	
				if (_cards.length < count) {
					return false;
				}
	
				var _deck = [];
	
				for (; count; count -= 1) {
	
					// get top visible card
					var _pop = _cards.pop();
	
					// remove this card from cards list
					for (var i = 0; i < this.cards.length; i += 1) {
						if (this.cards[i].id == _pop.id) {
	
							this.cards.splice(i, 1);
	
							// this.cards = [].concat(
							// 	this.cards.slice(0, i)       ,
							// 	this.cards.slice((i | 0) + 1)
							// )
						}
					}
	
					// clear card parent value
					if (clearParent) {
						_pop.parent = null;
					}
	
					// _deck.push(_pop);
					// _deck[_deck.length - 1].parent = null;
					_deck.unshift(_pop);
					_deck[0].parent = null;
				}
	
				// _deck.reverse();
	
				// скрыть стопку если вынули все карты
				if (this.autoHide && this.cards.length == 0) {
					this.hide();
				}
	
				// this.Redraw();
	
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
				_event2.default.dispatch('addStep', { "hideDeck": this.name });
				this.Redraw();
			}
		}, {
			key: 'show',
			value: function show() {
				this.visible = false;
				_event2.default.dispatch('addStep', { "showDeck": this.name });
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
			key: 'hideCards',
			value: function hideCards() {
				var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
				var save = arguments[1];
	
	
				for (var i in this.cards) {
	
					this.cards[i].visible = false;
	
					if (save) {
						_event2.default.dispatch('addStep', {
							"hide": {
								"cardName": this.cards[i].name,
								"cardIndex": i,
								"deckName": this.name
							}
						});
					}
					// event.dispatch('hideCard', this.cards[i]);
				}
	
				if (redraw) {
					this.Redraw();
				}
			}
	
			// TODO можно использовать только для карт сверху
	
		}, {
			key: 'hideCardByIndex',
			value: function hideCardByIndex(index, redraw) {
				if (this.cards[index]) {
	
					this.cards[index].visible = false;
	
					if (redraw) {
						this.Redraw();
					}
				}
			}
		}, {
			key: 'showCards',
			value: function showCards() {
				var redraw = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
				var save = arguments[1];
				var forceAll = arguments[2];
	
	
				for (var i in this.cards) {
	
					var changed = forceAll ? true : this.cards[i].visible == false;
	
					this.cards[i].visible = true;
	
					if (changed && save) {
						_event2.default.dispatch('addStep', {
							"show": {
								"cardName": this.cards[i].name,
								"cardIndex": i,
								"deckName": this.name
							}
						});
					}
					// event.dispatch('showCard', this.cards[i]);
				}
	
				if (redraw) {
					this.Redraw();
				}
			}
		}, {
			key: 'showCardByIndex',
			value: function showCardByIndex(index, redraw) {
				if (this.cards[index]) {
	
					this.cards[index].visible = true;
	
					if (redraw) {
						this.Redraw();
					}
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
			key: 'getCards',
			value: function getCards() {
				var filters = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { "visible": true };
	
	
				var _cards = [];
	
				for (var i in this.cards) {
	
					var _correct = true;
	
					for (var filterName in filters) {
						try {
							_correct = _correct && this.cards[i][filterName] == filters[filterName];
						} catch (e) {
							console.warn('Incorrect filter ' + filterName + ' in deck:getCards');
						}
					}
	
					if (_correct) {
						_cards.push(this.cards[i]);
					}
				}
	
				return _cards;
			}
		}, {
			key: 'getTopCards',
			value: function getTopCards(count, filters) {
				return this.getCards(filters).slice(-(count | 0));
			}
		}, {
			key: 'cardsCount',
			value: function cardsCount(filters) {
				return this.getCards(filters).length;
			}
		}, {
			key: 'getCardByIndex',
			value: function getCardByIndex(index) {
				return this.cards[index] ? this.cards[index] : false;
			}
		}, {
			key: 'getCardIndexById',
			value: function getCardIndexById(id) {
	
				var index = false;
	
				for (var i in this.cards) {
					if (this.cards[i].id == id) {
						index = i;
					}
				}
	
				return index;
			}
		}, {
			key: 'getRelationsByName',
			value: function getRelationsByName(relationName, filters) {
	
				var _relations = [];
	
				for (var i in this.relations) {
					if (this.relations[i].name == relationName) {
	
						if (filters) {
	
							var _correct = true;
	
							for (var attr in filters) {
								_correct = _correct && this.relations[i][attr] == filters[attr];
							}
	
							if (_correct) {
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
	
	// add deck
	
	
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
	
	exports.default = {
		"deckCardNames": _deckCardNames2.default,
		"addDeck": addDeck,
		"getDeck": _getDeck2.default,
		"getDecks": _getDecks2.default,
		"getDeckById": _getDeckById2.default
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
	 * bee
	 * beeFlip
	 * _direction_type
	 * bottomFlip
	 * bottomUnflip
	 * topFlip
	 * topUnflip
	
	 */
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var flipTypes = {
	
		"none": function none(i, length) {
			return false;
		},
	
		"all": function all(i, length) {
			return true;
		},
	
		"notlast": function notlast(i, length) {
			return i < length - 1 ? true : false;
		},
	
		"bee": function bee(i, length) {
			return i == length - 1 ? false : i % 2 == 0 ? true : false;
		},
	
		"beeFlip": function beeFlip(i, length) {
			return i == length - 1 ? true : i % 2 == 0 ? false : true;
		},
	
		"_direction_type": function _direction_type(direction, type, i, length, data) {
			return data && (data | 0) > 0 ? direction == "top" ? i > length - data - 1 // top
			? type == "flip" ? true : false : type == "flip" ? false : true : i < data // bottom
			? type == "flip" ? true : false : type == "flip" ? false : true : false;
		},
	
		"bottomFlip": function bottomFlip(i, length, data) {
			return flipTypes._direction_type("bootom", "flip", i, length, data);
		},
	
		"bottomUnflip": function bottomUnflip(i, length, data) {
			return flipTypes._direction_type("bootom", "unflip", i, length, data);
		},
	
		"topFlip": function topFlip(i, length, data) {
			return flipTypes._direction_type("top", "flip", i, length, data);
		},
	
		"topUnflip": function topUnflip(i, length, data) {
			return flipTypes._direction_type("top", "unflip", i, length, data);
		}
	};
	
	exports.default = flipTypes;

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
	 * oneSuitDeck
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
	
		"linePrev": function linePrev(deck) {
	
			var prev = (0, _getBeside2.default)(deck.to).prev;
	
			if (prev) {
	
				deck.link = prev.to;
	
				return true;
			}
	
			return false;
		},
	
		"lineNext": function lineNext(deck) {
	
			var next = (0, _getBeside2.default)(deck.to).next;
	
			if (next) {
	
				deck.link = next.to;
	
				return true;
			}
	
			return false;
		},
	
		// Internal use
	
		"_down_up_cards": function _down_up_cards(deck) {
	
			if (deck.cards.length == 0) {
				return false;
			}
	
			var down = _common2.default.validateCardName(deck.cards[deck.cards.length - 1].name);
			var up = _common2.default.validateCardName(deck.putDeck[0].card.name);
	
			if (!down || !up) {
				return false;
			}
	
			return {
				"up": up,
				"down": down
			};
		},
	
		"_down_up_rank_num": function _down_up_rank_num(deck) {
	
			var du = readyPutRules._down_up_cards(deck);
	
			return du ? {
				"down": _defaults2.default.card.ranks.indexOf(du.down.rank),
				"up": _defaults2.default.card.ranks.indexOf(du.up.rank)
			} : false;
		},
	
		"_isFirst": function _isFirst(deck, _name) {
	
			if (deck.cards.length == 0) {
	
				var _validate = null;
	
				return (_validate = _common2.default.validateCardName(deck.putDeck[0].card.name)) && _validate.rank == _name;
			}
	
			return true;
		},
	
		// Rules
	
		"striped": function striped(deck) {
	
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
	
		"firstAce": function firstAce(deck) {
			return readyPutRules._isFirst(deck, _defaults2.default.card.ranks[0]);
		},
	
		"firstKing": function firstKing(deck) {
			return readyPutRules._isFirst(deck, _defaults2.default.card.ranks[_defaults2.default.card.ranks.length - 1]);
		},
	
		"notForEmpty": function notForEmpty(deck) {
			return deck.cards.length > 0;
		},
	
		"onlyEmpty": function onlyEmpty(deck) {
			return deck.cards.length == 0;
		},
	
		"oneRank": function oneRank(deck) {
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var du = readyPutRules._down_up_cards(deck);
	
			return du && du.up.rank == du.down.rank;
		},
	
		"oneSuit": function oneSuit(deck) {
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var du = readyPutRules._down_up_cards(deck);
	
			return du && du.up.suit == du.down.suit;
		},
	
		"any": function any(deck) {
			return true;
		},
	
		"not": function not(deck) {
			return false;
		},
	
		"ascendDeck": function ascendDeck(deck) {
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
	
		"descendDeck": function descendDeck(deck) {
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
	
		"oneRankDeck": function oneRankDeck(deck) {
	
			if (deck.putDeck.length == 1) {
				return true;
			}
	
			var ruleCorrect = true;
	
			for (var i in deck.putDeck) {
	
				if (i > 0) {
	
					var down = _common2.default.validateCardName(deck.putDeck[i - 1].card.name).rank,
					    up = _common2.default.validateCardName(deck.putDeck[i].card.name).rank;
	
					ruleCorrect = ruleCorrect && down == up;
				}
			};
	
			return ruleCorrect;
		},
	
		"oneSuitDeck": function oneSuitDeck(deck) {
	
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
	
		"ascend": function ascend(deck) {
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var da = readyPutRules._down_up_rank_num(deck);
	
			return da && da.down < da.up;
		},
	
		"descent": function descent(deck) {
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var da = readyPutRules._down_up_rank_num(deck);
	
			return da && da.down > da.up;
		},
	
		"descentOne": function descentOne(deck) {
			// one step
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var da = readyPutRules._down_up_rank_num(deck);
	
			return da && da.down == 1 + da.up;
		},
	
		"ascendOne": function ascendOne(deck) {
			// one step
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var da = readyPutRules._down_up_rank_num(deck);
	
			return da && 1 + da.down == da.up;
		},
	
		"ascdescOne": function ascdescOne(deck) {
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var da = readyPutRules._down_up_rank_num(deck);
	
			return da && Math.abs(da.down - da.up) == 1;
		},
	
		"sum14": function sum14(deck) {
	
			if (deck.cards.length == 0) {
				return true;
			}
	
			var du = readyPutRules._down_up_cards(deck);
			var _sum = du.down.value + du.up.value;
	
			return _sum == 14;
		},
	
		// TODO rules with params ??? or atom rules
		// "sum" : (deck, data) => {} // rulename:data -> sum:14
	
		// query ?
	
		"around": function around(deck) {
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
			"from": null,
			"type": 'prev'
		})[0];
	
		var next = deck.getRelationsByName('beside', {
			"from": null,
			"type": 'next'
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
		"not": function not(data) {
			return false;
		},
	
		"notFirst": function notFirst(data) {
			return data.cardIndex > 0;
		},
	
		"any": function any(data) {
			return true;
		},
	
		"onlytop": function onlytop(data) {
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
	
		"_topCard": function _topCard(deck) {
	
			var _card = deck.getTopCard();
	
			return _card && _common2.default.validateCardName(_card.name);
		},
	
		"_bottomCard": function _bottomCard(deck) {
	
			var _card = deck.getCards()[0];
	
			return _card && _common2.default.validateCardName(_card.name);
		},
	
		"_besideTopCardRecoursive": function _besideTopCardRecoursive(deck, direction, callback) {
	
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
	
		"_besideTopCard": function _besideTopCard(deck, direction, callback) {
	
			var _beside = (0, _getBeside2.default)(deck)[direction];
			var besideDeck = _deck5.default.getDeck(_beside.to);
	
			return callback(fullRules._topCard(deck), fullRules._topCard(besideDeck));
		},
	
		"_deckRecoursive": function _deckRecoursive(deck, callback) {
	
			var _check = true;
			var _cards = deck.getCards();
	
			var _cardsCount = _cards.length;
	
			for (var i = _cardsCount; i > 0; i -= 1) {
				_check = _check && callback(_common2.default.validateCardName(_cards[i].name), _common2.default.validateCardName(_cards[i - 1].name));
			}
	
			return _check;
		},
	
		// Filters
	
		"query": function query(deck, data) {
	
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
				for (var groupNameIndex in data.groups) {
	
					var groupName = data.groups[groupNameIndex];
	
					var _group = _group3.default.getByName(groupName);
	
					var _decks = _group.getDecks();
	
					var _select = data.select ? data.select : 'all';
	
					// 	select: first | second | last | all
					if (_select == "first") {
						// TODO select deck with index 0
						var _deck = _group.getDeckByIndex(1);
	
						queryDecks.push(_deck);
					} else if (_select == "second") {
						// --/-- index 0
					} else if (_select == "last") {
						// --/-- max index
					} else {
							// all
						}
				}
			}
	
			// Decks
			if (data.decks) {
				for (var deckNameIndex in data.decks) {
	
					var deckName = data.decks[deckNameIndex];
					// get deck by name
					var _deck2 = _deck5.default.getDeck(deckName);
	
					if (_deck2) {
						queryDecks.push(_deck2);
					}
				}
			}
	
			// Rules
			for (var deckIndex in queryDecks) {
	
				var _deck3 = queryDecks[deckIndex];
	
				for (var ruleIndex in data.rules) {
	
					var rule = data.rules[ruleIndex];
	
					// TODO тут предполагается что все "подправила" будут только строковые
					if (fullRules[rule]) {
						_correct = _correct && fullRules[rule](_deck3);
					}
				}
	
				if (data.anyRule) {
	
					var _anyCorrect = false;
	
					for (var _ruleIndex in data.anyRule) {
	
						var _rule = data.anyRule[_ruleIndex];
	
						if (fullRules[_rule]) {
							_anyCorrect = _anyCorrect || fullRules[_rule](_deck3);
						}
					}
	
					_correct = _correct && _anyCorrect;
				}
			}
	
			return _correct;
		},
	
		// Rules
	
		"deckLength": function deckLength(deck) {
			return _defaults2.default.card.ranks.length <= deck.cards.length;
		},
	
		"not": function not(deck) {
			return false;
		},
	
		"topAce": function topAce(deck) {
	
			var _card = fullRules._topCard(deck);
	
			return _card && _card.rank == _defaults2.default.card.ranks[0];
		},
	
		"topKing": function topKing(deck) {
	
			var _card = fullRules._topCard(deck);
	
			var lastIndex = _defaults2.default.card.ranks.length - 1;
	
			return _card && _card.rank == _defaults2.default.card.ranks[lastIndex];
		},
	
		"bottomAce": function bottomAce(deck) {
	
			var _card = fullRules._bottomCard(deck);
	
			return _card && _card.rank == _defaults2.default.card.ranks[0];
		},
	
		"bottomKing": function bottomKing(deck) {
	
			var _card = fullRules._bottomCard(deck);
	
			var lastIndex = _defaults2.default.card.ranks.length - 1;
	
			return _card && _card.rank == _defaults2.default.card.ranks[lastIndex];
		},
	
		"prevDeckTopCardDescStep": function prevDeckTopCardDescStep(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},
	
		"prevDeckTopCardAscStep": function prevDeckTopCardAscStep(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},
	
		"nextDeckTopCardDescStep": function nextDeckTopCardDescStep(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},
	
		"nextDeckTopCardAscStep": function nextDeckTopCardAscStep(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},
	
		"prevDeckTopCardDesc": function prevDeckTopCardDesc(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return from.value > to.value;
			});
		},
	
		"prevDeckTopCardAsc": function prevDeckTopCardAsc(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (from, to) {
				return from.value < to.value;
			});
		},
	
		"nextDeckTopCardDesc": function nextDeckTopCardDesc(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return from.value > to.value;
			});
		},
	
		"nextDeckTopCardAsc": function nextDeckTopCardAsc(deck) {
			return fullRules._besideTopCard(deck, 'next', function (from, to) {
				return from.value < to.value;
			});
		},
	
		"recoursivePrevNotEmpty": function recoursivePrevNotEmpty(deck) {
			return false; // TODO
		},
	
		"recoursiveNextNotEmpty": function recoursiveNextNotEmpty(deck) {
			return false; // TODO
		},
	
		"recoursivePrevDeckTopCardDescStep": function recoursivePrevDeckTopCardDescStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},
	
		"recoursivePrevDeckTopCardAscStep": function recoursivePrevDeckTopCardAscStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},
	
		"recoursiveNextDeckTopCardDescStep": function recoursiveNextDeckTopCardDescStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return from.value == (to.value | 0) + 1;
			});
		},
	
		"recoursiveNextDeckTopCardAscStep": function recoursiveNextDeckTopCardAscStep(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return (from.value | 0) + 1 == to.value;
			});
		},
	
		"recoursivePrevDeckTopCardDesc": function recoursivePrevDeckTopCardDesc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return from.value > to.value;
			});
		},
	
		"recoursivePrevDeckTopCardAsc": function recoursivePrevDeckTopCardAsc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'prev', function (from, to) {
				return from.value < to.value;
			});
		},
	
		"recoursiveNextDeckTopCardDesc": function recoursiveNextDeckTopCardDesc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return from.value > to.value;
			});
		},
	
		"recoursiveNextDeckTopCardAsc": function recoursiveNextDeckTopCardAsc(deck) {
			return fullRules._besideTopCardRecoursive(deck, 'next', function (from, to) {
				return from.value < to.value;
			});
		},
	
		"descByStep": function descByStep(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return up.value == (down.value | 0) + 1;
			});
		},
	
		"ascByStep": function ascByStep(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return (up.value | 0) + 1 == down.value;
			});
		},
	
		"asc": function asc(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return up.value > down.value;
			});
		},
	
		"desc": function desc(deck) {
			return fullRules._deckRecoursive(deck, function (up, down) {
				return up.value < down.value;
			});
		},
	
		"prevDeckTopCardEquallySuit": function prevDeckTopCardEquallySuit(deck) {
			return fullRules._besideTopCard(deck, 'prev', function (up, down) {
				return up.suit == down.suit;
			});
		},
	
		"nextDeckTopCardEquallySuit": function nextDeckTopCardEquallySuit(deck) {
			return false;
		},
	
		"prevDeckFull": function prevDeckFull(deck) {
			return _deck5.default.getDeck((0, _getBeside2.default)(deck).prev.to).full;
		},
	
		"nextDeckFull": function nextDeckFull(deck) {
			return _deck5.default.getDeck((0, _getBeside2.default)(deck).next.to).full;
		}
	};
	
	exports.default = fullRules;

/***/ },
/* 20 */
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
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	
	Types:
	
	 * _default
	 * vertical
	 * horizontal
	 * roller
	
	 */
	
	var paddingTypes = {
	
		"_default": function _default(params, card, index, length, deck) {
	
			var _y = params.y,
			    _x = params.x;
	
			for (var i = 0; i < index; i += 1) {
				_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
				_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
			}
	
			return {
				"x": _x,
				"y": _y
			};
		},
	
		// "none" : (params, card, index, length, deck) => {
		// 	return {
		// 		"x" : params.x,
		// 		"y" : params.y
		// 	};
		// },
	
		// "last_three_min" : (params, card, index, length, deck) => {}
	
		// "radial" : (params, card, index, length, deck) => {
		// 	let _depth  = 1,
		// 	_radius = index * _depth,
		// 	// _step   = 180 / 16,
		// 	// _card   = defaults.card,
		// 	_angle  = params.rotate,//_step / 2 + 270;
		// 	_deg    = Math.PI / 180,
		// 	_a      = Math.sin(_angle * _deg) * _radius,
		// 	_b      = Math.cos(_angle * _deg) * _radius;
		// 	// if(_angle > 360) _angle -= 360;
		// 	return {
		// 		"x" : params.x + _a,
		// 		"y" : params.y - _b
		// 	};
		// },
	
		"vertical": function vertical(params, card, index, length, deck) {
	
			var _params = {};
	
			for (var name in params) {
				_params[name] = params[name];
			}
	
			_params.padding_x = 0;
			_params.padding_y = 15;
			_params.flip_padding_x = 0;
			_params.flip_padding_y = 5;
	
			return paddingTypes._default(_params, card, index, length, deck);
		},
	
		"horizontal": function horizontal(params, card, index, length, deck) {
	
			var _params = {};
	
			for (var name in params) {
				_params[name] = params[name];
			}
	
			_params.padding_x = 10;
			_params.padding_y = 0;
			_params.flip_padding_x = 5;
			_params.flip_padding_y = 0;
	
			return paddingTypes._default(_params, card, index, length, deck);
		},
	
		"roller": function roller(params, card, index, length, deck, data) {
			// data: "open,group,padding"
			// flipRule: "topUnflip:open"
	
			var _data = data.split(','),
			    open = _data[0] | 0,
			    // open cards count
			group = (_data[1] | 0) > 0 // closed cards group count
			? _data[1] | 0 : 1,
			    padding = _data[2] | 0;
	
			var correct = 0;
	
			if (index >= length - open && // delimiter and after
			card.flip == false // closed cards
			) {
	
					return {
						"x": params.x + _defaults2.default.card.width * _share2.default.get('zoom') + padding + (index - length + open - correct) * params.padding_x,
						"y": params.y + (index - length + open) * params.padding_y
					};
				} else {
				// before delimiter
	
				if (index >= length - open) {
					correct += 1;
				}
	
				return {
					"x": params.x + params.flip_padding_x * (index / group | 0),
					"y": params.y + params.flip_padding_y * (index / group | 0)
				};
			}
	
			return {
				"x": params.x,
				"y": params.y
			};
		},
	
		"puffed": function puffed(params, card, index, length, deck, data) {
	
			var group = (data | 0) > 0 ? data | 0 : 1;
	
			return {
				"x": params.x + params.flip_padding_x * (index / group | 0),
				"y": params.y + params.flip_padding_y * (index / group | 0)
			};
		}
	};
	
	exports.default = paddingTypes;

/***/ },
/* 21 */
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
	
	var _dealAction = __webpack_require__(22);
	
	var _dealAction2 = _interopRequireDefault(_dealAction);
	
	var _kickAction = __webpack_require__(32);
	
	var _kickAction2 = _interopRequireDefault(_kickAction);
	
	var _stepsAroundAction = __webpack_require__(33);
	
	var _stepsAroundAction2 = _interopRequireDefault(_stepsAroundAction);
	
	var _changeStepTypeAction = __webpack_require__(34);
	
	var _changeStepTypeAction2 = _interopRequireDefault(_changeStepTypeAction);
	
	var _lockAction = __webpack_require__(35);
	
	var _lockAction2 = _interopRequireDefault(_lockAction);
	
	var _unlockAction = __webpack_require__(37);
	
	var _unlockAction2 = _interopRequireDefault(_unlockAction);
	
	var _checkFullAction = __webpack_require__(38);
	
	var _checkFullAction2 = _interopRequireDefault(_checkFullAction);
	
	var _rollerAction = __webpack_require__(39);
	
	var _rollerAction2 = _interopRequireDefault(_rollerAction);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Actions
	var _actions = {
		"deal": _dealAction2.default,
		"kick": _kickAction2.default,
		"stepsAround": _stepsAroundAction2.default,
		"changeStepType": _changeStepTypeAction2.default,
		"lock": _lockAction2.default,
		"unlock": _unlockAction2.default,
		"checkFull": _checkFullAction2.default,
		"roller": _rollerAction2.default
	};
	
	/*
	 * addActionEvent
	 * add
	 * autoRunActions
	 * runAction
	 */
	
	var _decksActions = [],
	    _events = [];
	
	_event3.default.listen('logActions', function (e) {
		console.log('_decksActions', _decksActions);
		console.log('_events', _events);
	});
	
	_event3.default.listen('initField', function (e) {
		_decksActions = [];
		_events = [];
	});
	
	var addActionEvent = function addActionEvent(eventName) {
	
		_event3.default.listen(
	
		// event name
		eventName,
	
		// callback
		function (data) {
	
			for (var i in _decksActions) {
				if (_decksActions[i].event == eventName) {
	
					var _actionName = _decksActions[i].action;
	
					var _canRun = eventName.indexOf('click') == 0 ? data.to.name == _decksActions[i].deck.name : true;
	
					if (_canRun) {
	
						_actions[_actionName].run(_decksActions[i].deck, {
							"actionData": _decksActions[i].deck.actions[_actionName],
							"eventData": data,
							"eventName": eventName
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
	
			// если такой action существует
			if (typeof _actions[actionName] != 'undefined') {
	
				if (!deck.actions[actionName].events) {
					// если не описано событие выполнять по клику
					if (typeof deck.actions[actionName].event == "string") {
						deck.actions[actionName].events = [deck.actions[actionName].event];
					} else {
						deck.actions[actionName].events = ['click'];
					}
				}
	
				for (var i in deck.actions[actionName].events) {
	
					var _event = deck.actions[actionName].events[i];
	
					// сохраняем action
					_decksActions.push({
						"deck": deck,
						"event": _event,
						"action": actionName
					});
	
					_share2.default.set('actionEvent:' + deck.name + ':' + _event, true);
	
					// создаём событие если оно еще не создано
					if (!_events.indexOf(_event) >= 0) {
	
						// сохраняем событие в список с уже созданными
						_events.push(_event);
	
						// вешаем событие
						addActionEvent(_event);
					}
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
	
			// Требуется запуск при инициализации
			if (deck.actions[actionName].autorun) {
	
				if (_actions[actionName]) {
	
					_actions[actionName].run(deck, {
						"actionData": deck.actions[actionName],
						"eventData": null,
						"eventName": deck.actions[actionName].event
					});
				}
			}
		}
		// Tips.checkTips();
	};
	
	var runAction = function runAction(data) {
		// {actionName, deckName, <eventData>, eventName}
	
		if (_actions[data.actionName]) {
			_actions[data.actionName].run(data.deck, {
				"actionData": data.deck.actions[data.actionName],
				"eventName": data.eventName,
				"eventData": data.eventData
			});
		}
	};
	
	exports.default = {
		"add": add,
		"run": runAction
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
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _forceMove = __webpack_require__(23);
	
	var _forceMove2 = _interopRequireDefault(_forceMove);
	
	var _deckAction2 = __webpack_require__(24);
	
	var _deckAction3 = _interopRequireDefault(_deckAction2);
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var stepType = 'dealStepType';
	
	/*
	 * run
	 * end
	 */
	
	var dealAction = function (_deckAction) {
		_inherits(dealAction, _deckAction);
	
		function dealAction() {
			_classCallCheck(this, dealAction);
	
			return _possibleConstructorReturn(this, (dealAction.__proto__ || Object.getPrototypeOf(dealAction)).call(this));
		}
	
		_createClass(dealAction, [{
			key: 'run',
			value: function run(deck, data) {
				var _this2 = this;
	
				// Deck, {actionData, eventData, eventName}
	
				// console.groupCollapsed('dealAction:run');
				// console.log(JSON.stringify(data, true, 2));
				// console.groupEnd();
	
				var save = typeof data.eventData.save == "boolean" ? data.eventData.save : true;
	
				// default data.actionData.onlyEmpty - false
				// default data.actionData.from      - deck.name
				// default data.actionData.stepType  - NULL
	
				if (typeof data.actionData.stepType == 'string' && data.actionData.stepType != _share2.default.get('stepType')) {
	
					_get(dealAction.prototype.__proto__ || Object.getPrototypeOf(dealAction.prototype), 'break', this).call(this);
	
					return;
				}
	
				// меняем тип хода
				_share2.default.set('stepType', stepType);
	
				var dealDeck = typeof data.actionData.from == 'string' ? Deck.getDeck(data.actionData.from) : deck;
	
				// смотрим остались ли карты
				if (dealDeck.cards.length == 0) {
	
					var _stepType = _share2.default.get('stepType');
	
					if (_stepType != _defaults2.default.stepType) {
	
						_share2.default.set('stepType', _defaults2.default.stepType);
	
						_event2.default.dispatch('addStep', {
							"setStepType": _defaults2.default.stepType
						});
					}
	
					_event2.default.dispatch('actionBreak');
	
					this.end();
	
					var history = _history2.default.get(false);
	
					// есть ли что либо на запись в историю
					if (history.length > 0) {
	
						// console.log('dealAction:nomoves:save');
	
						_event2.default.dispatch('saveSteps');
					}
	
					return;
				}
	
				// to == toGroup ???
				if (data.actionData.toGroup && !data.actionData.to) {
	
					data.actionData.to = data.actionData.toGroup;
				};
	
				// стопки для раздачи
				var _decks = [];
	
				// есть куда раздавать
				if (data.actionData.to) {
	
					// выбираем стопки для раздачи
	
					// передали имя стопки/группы
					if (typeof data.actionData.to == 'string') {
	
						// ищем элементы с таким именем
						var _elements = _common2.default.getElementsByName(data.actionData.to);
						for (var i in _elements) {
	
							// это группа
							if (_elements[i].type == 'group') {
	
								// _decks = _decks.concat(Group.Group(data.actionData.to).decks);
								// let __decks = Group.Group(data.actionData.to).decks;
	
								// берём колоды из группы
								for (var deckIndex in _elements[i].decks) {
									_decks.push(_elements[i].decks[deckIndex]);
								}
							};
	
							// это колода, добавляем её в список
							if (_elements[i].type == 'deck') {
								_decks.push(_el);
							};
						}
	
						// передали массив имён стопок/групп
					} else {
	
						for (var _i in data.actionData.to) {
	
							var _elements2 = _common2.default.getElementsByName(data.actionData.to[_i]);
	
							for (var elIndex in _elements2) {
	
								if (_elements2[elIndex].type == 'group') {
									// _decks = _decks.concat(Group.Group(data.actionData.to[i]).decks);
									// let __decks = Group.Group(data.actionData.to[i]).decks;
									for (var _deckIndex in _elements2[elIndex].decks) {
										_decks.push(_elements2[elIndex].decks[_deckIndex]);
									}
								};
	
								if (_elements2[elIndex].type == 'deck') {
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
	
				var moveDecks = _decks.filter(function (e) {
					return e.cards.length == 0;
				});
				var _iterations = moveDecks.length;
	
				// for(let deckId in _decks) {
				for (var deckId in moveDecks) {
	
					// флаг что такой ход возможен
					var _canStep = data.actionData.onlyEmpty ? moveDecks[deckId].cards.length == 0 : true;
	
					if (_canStep && dealDeck.cards.length > 0) {
						(function () {
	
							var _steps = [];
	
							// берём верхнюю карту
							var _card = dealDeck.getTopCard();
	
							_makeStep = true;
	
							var _cardName = _card.name;
	
							var cardIndex = dealDeck.cards.length;
	
							// #1
	
							_event2.default.dispatch('addStep', {
								"step": {
									"unflip": {
										"deckName": dealDeck.name,
										"cardName": _cardName,
										"cardIndex": cardIndex - 1
									}
								},
								"callback": function callback(stepId) {
									_steps.push(stepId);
								}
							});
	
							dealDeck.Redraw();
	
							_event2.default.dispatch('addStep', {
								"step": {
									"move": {
										"from": dealDeck.name,
										"to": moveDecks[deckId].name,
										"deck": [_cardName],
										// "flip"     : true               ,
										"stepType": {
											"undo": _share2.default.get('stepType'),
											"redo": data.actionData.dispatch ? _share2.default.get('stepType') : _defaults2.default.stepType
										},
										"context": 'dealAction'
									}
								},
								"callback": function callback(stepId) {
									_steps.push(stepId);
								}
							});
	
							var _callback = function _callback(e) {
	
								_iterations -= 1;
	
								// console.log('dealAction:run:_callback', _iterations);
	
								if (_iterations == 0) {
									// _after();
									// let _after = e => {
	
									// #2
	
									if (_makeStep && save) {
										// && hasNextSteps
										// сохраняем если раздача удалась
										_event2.default.dispatch('saveSteps');
									}
	
									if (data.actionData.dispatch) {
	
										_event2.default.dispatch(data.actionData.dispatch, !_makeStep);
									} else {
	
										_this2.end();
										// сохраняем если ничего не вызываем
										_share2.default.set('stepType', _defaults2.default.stepType);
									}
	
									_event2.default.dispatch('dealEnd');
									// };
								}
	
								_event2.default.dispatch('checkTips');
							};
	
							// event.once('clearCallbacks', e => {
							// 	_callback = e => {};
							// });
	
							(0, _forceMove2.default)({
								"from": dealDeck.name,
								"to": moveDecks[deckId].name,
								"deck": [_cardName],
								"flip": false,
								"callback": _callback,
								"steps": _steps
							}, true);
	
							moveDecks[deckId].flipCheck();
							// _decks[deckId].Redraw();
	
							// #1
						})();
					}
				}
	
				// #2
			}
		}, {
			key: 'end',
			value: function end() {
	
				_event2.default.dispatch('dealEnd');
	
				_get(dealAction.prototype.__proto__ || Object.getPrototypeOf(dealAction.prototype), 'end', this).call(this);
			}
		}]);
	
		return dealAction;
	}(_deckAction3.default);
	
	exports.default = new dealAction();

/***/ },
/* 23 */
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
		// {from, to, deck, <flip>, <callback>, <steps>}
	
		// console.log('forceMove:', data);
	
		if (!data.from || !data.to || !data.deck) {
			return;
		}
	
		if (!data.deck.length) {
			return;
		}
	
		// departure
		var deckFrom = typeof data.from == 'string' ? _deck2.default.getDeck(data.from) : data.from;
	
		// destination
		var deckTo = typeof data.to == 'string' ? _deck2.default.getDeck(data.to) : data.to;
	
		if (!deckFrom || deckFrom.type != 'deck' || !deckTo || deckTo.type != 'deck') {
			return;
		}
	
		var _check = true;
	
		// let deckFromCards = deckFrom.cards;
		var deckFromCards = deckFrom.getCards();
	
		for (var i in deckFromCards) {
	
			if (i >= deckFromCards.length - data.deck.length) {
	
				var _index = i - (deckFromCards.length | 0) + (data.deck.length | 0);
	
				if (data.deck[_index] && deckFromCards[i].name != data.deck[_index]) {
	
					// console.warn('forceMove:check:false', deckFrom.name, deckTo.name, deckFromCards[i].name, data.deck[_index]);
	
					_check = false;
				}
			}
		}
	
		if (_check) {
			(function () {
	
				var cardsPop = deckFrom.Pop(data.deck.length);
				// let cardsPop = deckFrom.getTopCards(data.deck.length);
	
				// console.log(
				// 	'### forceMove:pop',
				// 	cardsPop ? cardsPop.map(e => e.name).join(',') : cardsPop,
				// 	deckFrom.name,
				// 	deckFrom.cards.map(e => e.name).join(','),
				// 	data.deck.length
				// );
	
				// перевернуть карты во время хода
				if (typeof data.flip == "boolean") {
					for (var _i in cardsPop) {
						// console.log('forceMove:flip:', i, cardsPop.length, cardsPop[i].flip, data.flip);
						cardsPop[_i].flip = data.flip; // !cardsPop[i].flip;
					}
				}
	
				var deckToInvisibleCardsCount = deckTo.cardsCount({
					"visible": false
				});
	
				deckTo.Push(cardsPop, deckToInvisibleCardsCount > 0);
	
				var rand = (1048576 + (Math.random() * 15728639 | 0)).toString(16).toUpperCase();
	
				// console.log('%c ', 'background:#' + rand, 'forceMove', rand + ':' + data.from + '>' + data.to);
	
				var _break = function _break(e) {
	
					// return; // debug
					if (_share2.default.get('inHistoryMove')) {
						return;
					}
	
					// console.log('%c %cforceMove:BREAK ' + rand + ' ' + deckFrom.name + ' ' + deckTo.name, 'background:#' + rand, 'background:none;color:red;font-weight:bold;');
	
					var _cards = deckTo.Pop(data.deck.length);
	
					if (cardsPop) {
	
						deckFrom.Push(_cards);
	
						if (typeof data.flip == "boolean") {
							for (var _i2 in cardsPop) {
								cardsPop[_i2].flip = !data.flip;
							}
						}
	
						deckFrom.Redraw();
						deckTo.Redraw();
	
						// } else
	
						if (data.steps && data.steps.length) {
	
							// TODO History.clearByContext('deal');
							// console.log('forceMove:_break:deleteHistory', data.steps);
	
							_event2.default.dispatch('deleteHistory', data.steps);
						}
					}
				};
	
				var cardsMove = [];
	
				for (var _i3 in cardsPop) {
					cardsMove.push({
						"card": cardsPop[_i3]
					});
				}
	
				var moveDragDeckParams = {
					"moveDeck": cardsMove,
					"departure": deckFrom,
					"destination": deckTo
				};
	
				var eventId = _event2.default.once('clearCallbacks', function (e) {
					if (typeof _break == "function") {
						_break();
					}
				}
				// 'forceMove: from:' + deckFrom.name + ' to:' + deckTo.name + ' card:' + cardsMove[0].card.name + ' cardId:' + cardsMove[0].card.id
				);
	
				if (typeof data.callback == 'function') {
	
					moveDragDeckParams.callback = function (e) {
	
						// TODO move here addStep?
						if (data.addStep) {
	
							_event2.default.dispatch('addStep', {
								"move": {
									"from": data.from,
									"to": data.to,
									"deck": data.deck
								}
							});
						}
	
						// console.log('%c ', 'background:#' + rand, 'forceMove:END ' + rand);
	
						_event2.default.remove(eventId);
	
						_break = null;
	
						_event2.default.dispatch('forceMoveEnd');
	
						data.callback();
	
						// _next();
					};
	
					// moveDragDeckParams.debug = 'from:forceMove';
				} else {
					moveDragDeckParams.callback = function (e) {
	
						// TODO move here addStep?
						if (data.addStep) {
	
							_event2.default.dispatch('addStep', {
								// "step" : {
								"move": {
									"from": data.from,
									"to": data.to,
									"deck": data.deck
								}
								// },
								// "callback" : stepId => {
								// steps.push(stepId)
								// }
							});
						}
	
						_event2.default.remove(eventId);
	
						console.log('%c ', 'background:#' + rand, 'forceMove:END ' + rand);
						_break = null;
	
						_event2.default.dispatch('forceMoveEnd');
	
						// _next();
					};
				}
	
				// let _next = e => {
	
				// 
	
				if (deckFrom.autoUnflipTop && deckFrom.cards.length > 0 && deckFrom.cards[deckFrom.cards.length - 1].flip) {
	
					// console.log('unflip TopCard');
	
					deckFrom.unflipTopCard(data.addStep);
				}
	
				if (data.save) {
					_event2.default.dispatch('saveSteps');
				}
				// };
	
				_event2.default.dispatch('moveDragDeck', moveDragDeckParams);
			})();
		} else {
			console.warn('forceMove:Ход невозможен', data);
		}
	};
	
	_event2.default.listen('forceMove', function (data) {
		forceMove(data);
	});
	
	exports.default = forceMove;

/***/ },
/* 24 */
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
/* 25 */
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
	
	var _undo = __webpack_require__(26);
	
	var _undo2 = _interopRequireDefault(_undo);
	
	var _redo = __webpack_require__(29);
	
	var _redo2 = _interopRequireDefault(_redo);
	
	var _historyCommon = __webpack_require__(30);
	
	var _historyCommon2 = _interopRequireDefault(_historyCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/*
	 * reset
	 * add
	 * get
	 * count
	 */
	
	var historyClass = function () {
		function historyClass() {
			_classCallCheck(this, historyClass);
	
			this.steps = [];
	
			// this._debugData = [];
			this._nextId = 0;
		}
	
		_createClass(historyClass, [{
			key: 'reset',
			value: function reset() {
	
				// console.log('History:clear');
				// this._debugData.push(this.steps);
	
				this.steps = [];
			}
		}, {
			key: 'add',
			value: function add(step) {
				// {move || flip ... }
	
				this._nextId += 1;
				var stepId = this._nextId | 0;
	
				this.steps.push({
					"id": stepId,
					"step": step
				});
	
				// console.groupCollapsed('History:add', stepId);
				// console.log(JSON.stringify(step, true, 2));
				// console.groupEnd();
	
				return stepId;
			}
		}, {
			key: 'delete',
			value: function _delete(steps) {
				// stepId || [stepId]
	
				// console.log('History:delete:', steps);
	
				if (typeof steps == "number") {
					steps = [steps];
				}
	
				// for(let i in steps) {
				// 	if(this.steps[steps[i]]) {
				// 		delete this.steps[steps[i]];
				// 	}
				// }
	
				this.steps = this.steps.filter(function (e) {
					return steps.indexOf(e.id) < 0;
				});
			}
	
			// get steps and reset
	
		}, {
			key: 'get',
			value: function get() {
				var reset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
	
	
				var _req = [];
				for (var i in this.steps) {
					_req.push(this.steps[i].step);
				}
	
				// console.groupCollapsed('History:get (reset: ' + reset + ')', _req.length);
				// console.log('%c' + JSON.stringify(_req, true, 2), 'background: #e0edfa;width: 100%;');
				// console.groupEnd();
	
				if (reset) {
	
					this.reset(true);
				}
	
				// console.log('History:get', _req);
	
				// for(let line of _req) {
				// 	for(let name in line) {
				// 		console.log('History:get', name, line[name]);
				// 	}
				// }
	
				return _req;
			}
		}, {
			key: 'count',
			value: function count() {
				return this.steps.length;
			}
	
			// TODO
	
		}, {
			key: 'zip',
			value: function zip() {
				// 
			}
		}, {
			key: 'unzip',
			value: function unzip(data) {}
			// 
	
	
			// _debugLod() {
			// 	return this._debugData;
			// }
	
		}]);
	
		return historyClass;
	}();
	
	var history = new historyClass();
	
	exports.default = history;

/***/ },
/* 26 */
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
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _inputs = __webpack_require__(4);
	
	var _inputs2 = _interopRequireDefault(_inputs);
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _tips = __webpack_require__(9);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _atom = __webpack_require__(27);
	
	var _atom2 = _interopRequireDefault(_atom);
	
	var _stateManager = __webpack_require__(6);
	
	var _stateManager2 = _interopRequireDefault(_stateManager);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * flip
	 * unflip
	 * hide
	 * show
	 * full
	 * lock
	 * unlock
	 * swap
	 * move
	 * setStepType
	 */
	
	var undo = function undo(data) {
	
		if (_share2.default.get('sessionStarted')) {
	
			_event2.default.dispatch('stopAnimations');
			_stateManager2.default.restore();
		}
	
		// undo flip
		if (data.flip) {
	
			var deck = _common2.default.getElementByName(data.flip.deckName);
	
			var card = deck.getCardByIndex(data.flip.cardIndex | 0);
	
			if (card && card.name == data.flip.cardName) {
				card.flip = false;
				deck.Redraw();
			}
		}
	
		// undo unflip
		if (data.unflip) {
	
			var _deck = _common2.default.getElementByName(data.unflip.deckName, 'deck');
	
			var _card = _deck.getCardByIndex(data.unflip.cardIndex | 0);
	
			// console.log('undo:unflip -> flip', data.unflip, deck.name, card.name, deck.cards.map(e => e.name));
	
			// event.dispatch('removeMarkCard', {
			// 	"card" : card
			// });
	
			if (_card && _card.name == data.unflip.cardName) {
				_card.flip = true;
				_deck.Redraw();
			}
		}
	
		// undo hide
		if (data.hide) {
	
			var _deck2 = _common2.default.getElementByName(data.hide.deckName, 'deck');
	
			if (_deck2 && _deck2.cards[data.hide.cardIndex].name == data.hide.cardName) {
				_deck2.cards[data.hide.cardIndex].visible = true;
				_deck2.Redraw();
			} else {
				console.warn('Incorrect history atom of step [undo hide]:', data.hide, _deck2.cards[data.hide.cardIndex].name, data.hide.cardName);
			}
		}
	
		// undo show
		if (data.show) {
	
			// console.log('UNDO SHOW:', data.show);
	
			var _deck3 = _common2.default.getElementByName(data.show.deckName, 'deck');
	
			if (_deck3 && _deck3.cards[data.show.cardIndex].name == data.show.cardName) {
				_deck3.cards[data.show.cardIndex].visible = false;
				_deck3.Redraw();
			} else {
				console.warn('Incorrect history atom of step [undo show]:', data.show, _deck3.cards[data.show.cardIndex].name, data.show.cardName);
			}
	
			_deck3.Redraw();
		}
	
		// undo full
		if (data.full) {}
		// TODO
	
	
		// undo lock
		if (typeof data.lock != 'undefined') {
			for (var i in data.lock) {
				var _element = _common2.default.getElementsByName(data.lock[i])[0];
				_element.unlock();
			}
		}
	
		// undo unlock
		if (typeof data.unlock != 'undefined') {
			for (var _i2 in data.unlock) {
				var _element2 = _common2.default.getElementsByName(data.unlock[_i2])[0];
				_element2.lock();
			}
		}
	
		// redo swap
		if (typeof data.swap != 'undefined' && typeof data.swap.deckName != 'undefined' && typeof data.swap.fromIndex != 'undefined' && typeof data.swap.toIndex != 'undefined') {
	
			var _deck4 = _common2.default.getElementByName(data.swap.deckName, 'deck');
	
			_atom2.default.swap(_deck4, data.swap.fromIndex, data.swap.toIndex, false);
	
			_deck4.Redraw();
		}
	
		// undo move
		if (typeof data.move != 'undefined' && typeof data.move.from != 'undefined' && typeof data.move.to != 'undefined' && typeof data.move.deck != 'undefined') {
	
			// console.log('undo:move', JSON.stringify(data.move));
	
			if (data.move.stepType) {
	
				if (typeof data.move.stepType == 'string') {
					_share2.default.set('stepType', data.move.stepType);
				}
	
				if (typeof data.move.stepType.undo == 'string') {
					_share2.default.set('stepType', data.move.stepType.undo);
				}
			}
	
			var forceMoveData = {
				"from": data.move.to, // from ->
				"to": data.move.from, //      <- to
				"deck": data.move.deck
				// "flip" : data.move.flip
			};
	
			if (typeof data.move.flip == "boolean") {
				forceMoveData.flip = !data.move.flip;
			}
	
			if (!_share2.default.get('showHistoryAnimation')) {
	
				_common2.default.animationOff();
	
				forceMoveData.callback = function (e) {
	
					// undo move end
					_share2.default.set('inHistoryMove', false);
	
					_common2.default.animationOn();
				};
			} else {
				forceMoveData.callback = function (e) {
	
					// undo move end
					_share2.default.set('inHistoryMove', false);
				};
			}
	
			_share2.default.set('inHistoryMove', true);
	
			_event2.default.dispatch('forceMove', forceMoveData);
		}
	
		if (data.setStepType && typeof data.setStepType.undo == "string") {
			_share2.default.set('stepType', data.stepType.undo);
		}
	}; // 'use strict';
	
	_event2.default.listen('undo', function (undoData) {
	
		if (!undoData || _share2.default.get('stopRunHistory')) {
			return;
		}
	
		_inputs2.default.break();
	
		// console.groupCollapsed('UNDO');
		// console.log('%c' + JSON.stringify(undoData, true, 2), 'background:#d6deff');
		// console.groupEnd();
	
		if (_share2.default.get('animation')) {
			_event2.default.dispatch('stopAnimations');
		}
	
		// History.reset();
		var history = _history2.default.get();
		if (history.length > 0) {
			for (var i = history.length - 1; i >= 0; i -= 1) {
	
				// console.groupCollapsed('<<<');
				// console.log(JSON.stringify(history[i], true, 2));
				// console.groupEnd();
	
				undo(history[i]);
			}
		}
	
		// Обратная совместимость
		if (undoData instanceof Array) {
	
			undoData.reverse();
	
			for (var _i in undoData) {
				var data = undoData[_i];
				undo(data);
			}
	
			undoData.reverse();
		} else {
			undo(undoData);
		}
	
		_tips2.default.checkTips();
	
		// console.log('undo:stepType:', share.get('stepType'));
	});
	
	exports.default = undo;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _atomSwap = __webpack_require__(28);
	
	var _atomSwap2 = _interopRequireDefault(_atomSwap);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
		"swap": _atomSwap2.default
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (deck, fromIndex, toIndex) {
		var save = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
	
	
		// console.log('SWAP:', deck.name, fromIndex, toIndex);
	
		var tmp = deck.cards[fromIndex];
		deck.cards[fromIndex] = deck.cards[toIndex];
		deck.cards[toIndex] = tmp;
	
		if (save) {
			_event2.default.dispatch('addStep', {
				"swap": {
					"deckName": deck.name,
					"fromIndex": fromIndex,
					"toIndex": toIndex
				}
			});
		}
	};

/***/ },
/* 29 */
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
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _inputs = __webpack_require__(4);
	
	var _inputs2 = _interopRequireDefault(_inputs);
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _tips = __webpack_require__(9);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	var _atom = __webpack_require__(27);
	
	var _atom2 = _interopRequireDefault(_atom);
	
	var _stateManager = __webpack_require__(6);
	
	var _stateManager2 = _interopRequireDefault(_stateManager);
	
	var _undo = __webpack_require__(26);
	
	var _undo2 = _interopRequireDefault(_undo);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * flip
	 * unflip
	 * hide
	 * show
	 * full
	 * lock
	 * unlock
	 * swap
	 * move
	 * markCard
	 * unmarkCard
	 * setStepType
	 */
	
	var redo = function redo(data) {
	
		if (_share2.default.get('sessionStarted')) {
	
			_event2.default.dispatch('stopAnimations');
			_stateManager2.default.restore();
		}
	
		// redo flip
		if (data.flip) {
	
			var deck = _common2.default.getElementByName(data.flip.deckName);
	
			var card = deck.getCardByIndex(data.flip.cardIndex | 0);
	
			if (card && card.name == data.flip.cardName) {
				card.flip = true;
				deck.Redraw();
			}
		}
	
		// redo unflip
		if (data.unflip) {
	
			var _deck = _common2.default.getElementByName(data.unflip.deckName, 'deck');
	
			var _card = _deck.getCardByIndex(data.unflip.cardIndex | 0);
	
			if (_card && _card.name == data.unflip.cardName) {
				_card.flip = false;
				_deck.Redraw();
			}
		}
	
		// redo hide
		if (data.hide) {
	
			var _deck2 = _common2.default.getElementByName(data.hide.deckName, 'deck');
	
			if (_deck2 && _deck2.cards[data.hide.cardIndex].name == data.hide.cardName // TODO check
			) {
					_deck2.cards[data.hide.cardIndex].visible = false;
					_deck2.Redraw();
				} else {
				console.warn('Incorrect history substep [redo hide]:', data.hide);
			}
		}
	
		// redo show
		if (data.show) {
	
			var _deck3 = _common2.default.getElementByName(data.show.deckName, 'deck');
	
			if (_deck3 && _deck3.cards[data.show.cardIndex].name == data.show.cardName) {
				_deck3.cards[data.show.cardIndex].visible = true;
				_deck3.Redraw();
			} else {
				console.warn('Incorrect history substep [redo show]:', data.hide);
			}
		}
	
		// redo full
		if (data.full) {}
		// 
	
	
		// redo lock
		if (typeof data.lock != 'undefined') {
			for (var i in data.lock) {
				var _element = _common2.default.getElementsByName(data.lock[i])[0];
				_element.lock();
			}
		}
	
		// redo unlock
		if (typeof data.unlock != 'undefined') {
			for (var _i2 in data.unlock) {
				var _element2 = _common2.default.getElementsByName(data.unlock[_i2])[0];
				_element2.unlock();
			}
		}
	
		// redo swap
		if (typeof data.swap != 'undefined' && typeof data.swap.deckName != 'undefined' && typeof data.swap.fromIndex != 'undefined' && typeof data.swap.toIndex != 'undefined') {
	
			var _deck4 = _common2.default.getElementByName(data.swap.deckName, 'deck');
	
			_atom2.default.swap(_deck4, data.swap.fromIndex, data.swap.toIndex, false);
	
			_deck4.Redraw();
		}
	
		// redo move
		if (typeof data.move != 'undefined' && typeof data.move.from != 'undefined' && typeof data.move.to != 'undefined' && typeof data.move.deck != 'undefined') {
	
			if (data.move.stepType) {
	
				if (typeof data.move.stepType == 'string') {
					_share2.default.set('stepType', data.move.stepType);
				}
	
				if (typeof data.move.stepType.redo == 'string') {
					_share2.default.set('stepType', data.move.stepType.redo);
				}
			}
	
			var forceMoveData = {
				"from": data.move.from,
				"to": data.move.to,
				"deck": data.move.deck,
				"flip": data.move.flip
			};
	
			if (typeof data.move.flip == "boolean") {
				forceMoveData.flip = data.move.flip;
			}
	
			if (!_share2.default.get('showHistoryAnimation')) {
	
				_common2.default.animationOff();
	
				forceMoveData.callback = function (e) {
	
					// undo move end
					_share2.default.set('inHistoryMove', false);
	
					_common2.default.animationOn();
				};
			} else {
				forceMoveData.callback = function (e) {
	
					// undo move end
					_share2.default.set('inHistoryMove', false);
				};
			}
	
			_share2.default.set('inHistoryMove', true);
	
			_event2.default.dispatch('forceMove', forceMoveData);
		}
	
		if (data.markCard) {
	
			var _deck5 = _common2.default.getElementByName(data.markCard.deckName, 'deck');
	
			var _card2 = _deck5.getCardByIndex(data.markCard.cardIndex | 0);
	
			if (_card2 && data.markCard.cardName == _card2.name) {
				_event2.default.dispatch('markCard', {
					"card": _card2
				});
			}
		}
	
		if (data.unmarkCard) {
	
			var _deck6 = _common2.default.getElementByName(data.unmarkCard.deckName, 'deck');
	
			var _card3 = _deck6.getCardByIndex(data.unmarkCard.cardIndex | 0);
	
			if (_card3 && data.unmarkCard.cardName == _card3.name) {
				_event2.default.dispatch('unmarkCard', {
					"card": _card3
				});
			}
		}
	
		if (data.setStepType) {
			if (typeof data.setStepType == "string") {
				_share2.default.set('stepType', data.setStepType);
			} else {
				if (typeof data.setStepType.redo == "string") {
					_share2.default.set('stepType', data.stepType.redo);
				}
			}
		}
	};
	
	_event2.default.listen('redo', function (redoData) {
	
		if (!redoData || _share2.default.get('stopRunHistory')) {
			return;
		}
	
		_inputs2.default.break();
	
		// console.groupCollapsed('REDO');
		// console.log('%c' + JSON.stringify(redoData, true, 2), 'background:#fff7d6');
		// console.groupEnd();
	
		if (_share2.default.get('animation')) {
			_event2.default.dispatch('stopAnimations');
		}
	
		// History.reset();
		var history = _history2.default.get();
		if (history.length > 0) {
			for (var i = history.length - 1; i >= 0; i -= 1) {
	
				// console.groupCollapsed('redo:<<<');
				// console.log(JSON.stringify(history[i], true, 2));
				// console.groupEnd();
	
				(0, _undo2.default)(history[i]);
			}
		}
	
		// Обратная совместимость
		if (redoData instanceof Array) {
	
			for (var _i in redoData) {
				var data = redoData[_i];
				redo(data);
			}
		} else {
			redo(redoData);
		}
	
		_tips2.default.checkTips();
	
		// console.log('redo:stepType:', share.get('stepType'));
	});
	
	exports.default = redo;

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _redoAdvanced = __webpack_require__(31);
	
	var _redoAdvanced2 = _interopRequireDefault(_redoAdvanced);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * Events:
	 *
	 * addStep
	 * saveSteps
	 * doHistory
	 * resetHistory
	 * newGame
	 */
	
	// TODO пошаговая анимация
	
	// let _movesCallback = e => {
	// 	if(_movesStack.length) {
	// 		_movesStack.shift()();
	// 	} else {
	// 		// 
	// 	}
	// };
	// let _movesStack = [];
	
	// let _stepsCallback = e => {
	// 	if(_stepsStack.length) {
	// 		_stepsStack.shift()();
	// 	} else {
	// 		// 
	// 	}
	// };
	// let _stepsStack = [];
	
	// let historyStack = [];
	
	_event2.default.listen('addStep', function (data) {
	
		if (data.step) {
	
			var stepId = _history2.default.add(data.step);
	
			if (typeof data.callback == "function") {
				data.callback(stepId);
			}
		} else {
			_history2.default.add(data);
		}
	});
	
	// save steps to client history
	_event2.default.listen('saveSteps', function (e) {
	
		var data = _history2.default.get();
	
		// console.groupCollapsed('%c### saveSteps', 'font-weight: bold; color: green;');
		// console.log('%c' + JSON.stringify(data, true, 2), 'background: #cceacc;');
		// console.groupEnd();
	
		if (data.length) {
			_event2.default.dispatch('makeStep', data);
		} else {
			console.warn('Empty history to save.');
		}
	});
	
	_event2.default.listen('doHistory', function (e) {
	
		// console.groupCollapsed('DO HISTORY');
	
		// common.animationOff();
		if (!e || !e.data) {
			console.warn('doHistory data:', e);
		}
	
		_common2.default.animationOff();
	
		for (var i in e.data) {
	
			_event2.default.dispatch('redo', e.data[i]);
	
			if (!_redoAdvanced2.default.handle(e.data[i][0]) && typeof e.callback == 'function') {
				e.callback(e.data[i]);
			}
		}
	
		_common2.default.animationDefault();
	
		_event2.default.dispatch('stopRunHistory');
	
		// console.groupEnd();
	});
	
	_event2.default.listen('resetHistory', function (e) {
		_history2.default.reset();
	});
	
	_event2.default.listen('deleteHistory', function (steps) {
		_history2.default.delete(steps);
	});
	
	_event2.default.listen('newGame', function (e) {
		_history2.default.reset();
	});

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _deckActions = __webpack_require__(21);
	
	var _deckActions2 = _interopRequireDefault(_deckActions);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var redoAdvanced = function () {
		function redoAdvanced() {
			// 
	
			_classCallCheck(this, redoAdvanced);
		}
	
		_createClass(redoAdvanced, [{
			key: 'handle',
			value: function handle(data) {
	
				// Run action
				if (data.runAction && typeof data.runAction.actionName == 'string' && typeof data.runAction.deckName == 'string') {
	
					var deck = _common2.default.getElementByName(data.runAction.deckName, 'deck');
	
					_deckActions2.default.run({
						deck: deck,
						actionName: data.runAction.actionName,
						eventName: 'redo',
						eventData: {
							"to": deck
						}
					});
	
					return true;
				}
	
				// Make move
				if (data.makeMove && data.makeMove.to && data.makeMove.from && typeof data.makeMove.from.cardName == "string") {
	
					// console.log('redoAdvanced:makeMove', JSON.stringify(data.makeMove));
	
					var fromCard = _common2.default.getElementByName(data.makeMove.from.cardName, 'card');
					var fromDeck = _common2.default.getElementById(fromCard.parent);
	
					var to = null;
	
					if (typeof data.makeMove.to.cardName == "string") {
						var toCard = _common2.default.getElementByName(data.makeMove.to.cardName, 'card');
						to = toCard.id;
					} else if (typeof data.makeMove.to.deckName == "string") {
						to = _common2.default.getElementByName(data.makeMove.to.deckName, 'deck').id;
					}
					if (to) {
	
						var moveDeck = [];
						var fromDeckCards = fromDeck.getCards();
	
						var found = false;
						for (var i in fromDeckCards) {
	
							if (fromDeckCards[i].name == fromCard.name) {
								found = true;
							}
	
							if (found) {
								moveDeck.push({
									"card": fromDeckCards[i],
									"index": i
								});
							}
						}
	
						SolitaireEngine.event.dispatch('Move', {
							"moveDeck": moveDeck,
							"to": to,
							"cursorMove": {
								"dblclick": false,
								"distance": Infinity
							}
						});
					}
	
					return true;
				}
	
				return false;
			}
		}]);
	
		return redoAdvanced;
	}();
	
	exports.default = new redoAdvanced();

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
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _deckAction2 = __webpack_require__(24);
	
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
	
			var _this = _possibleConstructorReturn(this, (kickAction.__proto__ || Object.getPrototypeOf(kickAction)).call(this));
	
			_this._actionName = 'kickAction';
			return _this;
		}
	
		_createClass(kickAction, [{
			key: 'run',
			value: function run(deck, data) {
				var _this2 = this;
	
				// Deck, {actionData, eventData, eventName}
	
				// если тип хода не стандартный не выполнять кик
				if (_share2.default.get('stepType') != _defaults2.default.stepType) {
	
					_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'break', this).call(this);
	
					return false;
				}
	
				// TODO спорный момент
				if (typeof data.eventData.stepType == 'string' && data.eventData.stepType != _defaults2.default.stepType) {
	
					_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'break', this).call(this);
	
					return false;
				}
	
				if (data.eventData.to.name != deck.name) {
					// data.eventData.to - куда мы перетащили карты
	
					_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'break', this).call(this);
	
					return false;
				}
	
				// console.log('kickAction:run');
	
				_share2.default.set('stepType', stepType);
	
				_common2.default.animationDefault();
	
				var _from = data.eventData.to,
				    //Deck.Deck(_name),
				_deck = _from.getCardsNames();
	
				var _callback = function _callback(e) {
	
					// console.log('### kickAction:_callback');
	
					var _addStep = function _addStep(historyData) {
	
						for (var i in _deck) {
	
							_event2.default.dispatch('addStep', {
								"flip": {
									"deckName": _from.name,
									"cardName": _deck[i],
									"cardIndex": i
								}
							});
						}
	
						_event2.default.dispatch('addStep', {
							"move": {
								"from": _from.name,
								"to": data.actionData.to,
								"deck": _deck,
								// "flip"     : true              ,
								"stepType": {
									"undo": historyData.undo,
									"redo": historyData.redo
								},
								"context": 'kickAction'
							}
						});
					};
	
					_share2.default.set('stepType', _defaults2.default.stepType);
	
					_event2.default.dispatch('kick:end');
	
					// _addStep({
					// 	"undo" : data.eventData.stepType,
					// 	"redo" : data.eventData.stepType // stepType
					// });
	
					var eventStepType = data.eventData.stepType;
	
					if (data.actionData.dispatch) {
	
						// event.dispatch('kick:end');
	
						_event2.default.dispatch(data.actionData.dispatch, {
							before: function before(data) {
	
								// console.log('kickAction:before -> autoStep:start');
	
								_addStep({
									"undo": eventStepType,
									"redo": data.stepType
								});
	
								// event.dispatch('saveSteps', 'KICKACTION#1');
							}
						});
					} else {
	
						// event.dispatch('kick:end');
	
						_addStep({
							"undo": eventStepType,
							"redo": eventStepType
						});
	
						_event2.default.dispatch('saveSteps', 'KICKACTION#2');
	
						_get(kickAction.prototype.__proto__ || Object.getPrototypeOf(kickAction.prototype), 'end', _this2).call(_this2);
					}
				};
	
				// TODO interval
				var forceMoveParams = {
					"from": _from,
					"to": data.actionData.to,
					"deck": _deck,
					"flip": true,
					"callback": _callback
				};
	
				// forceMove(forceMoveParams);
				_event2.default.dispatch('forceMove', forceMoveParams);
			}
	
			// end() {
			// 	event.dispatch('kickEnd');
			// 	super.end();
			// }
	
		}]);
	
		return kickAction;
	}(_deckAction3.default);
	
	exports.default = new kickAction();

/***/ },
/* 33 */
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
	
	var _deckAction2 = __webpack_require__(24);
	
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
				if (typeof data.actionData.run == 'string') {
					(function () {
	
						var _central = typeof data.actionData.central == 'boolean' ? data.actionData.central : true;
	
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
								"to": deck.name,
								"callback": _callback
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
/* 34 */
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
	
	var _deckAction2 = __webpack_require__(24);
	
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
	
				if (typeof data.actionData.to != 'string') {
	
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
/* 35 */
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
	
	var _deckAction2 = __webpack_require__(24);
	
	var _deckAction3 = _interopRequireDefault(_deckAction2);
	
	var _lockActionCommon = __webpack_require__(36);
	
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
/* 36 */
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
	
		if (typeof data.source != 'string') {
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
			_event2.default.dispatch('saveSteps', 'LOCKACTIONCOMMON');
		}
	
		for (var _i in sources) {
	
			var current = _common2.default.getElementsByName(sources[_i])[0];
	
			if (current.type == 'group') {
				var decks = current.getDecks();
				for (var deckIndex in decks) {
					decks[deckIndex][method]();
				}
			}
	
			if (current.type == 'deck') {
				current[method]();
			}
		}
	};

/***/ },
/* 37 */
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
	
	var _deckAction2 = __webpack_require__(24);
	
	var _deckAction3 = _interopRequireDefault(_deckAction2);
	
	var _lockActionCommon = __webpack_require__(36);
	
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
/* 38 */
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
	
	var _deckAction2 = __webpack_require__(24);
	
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
	
				if (data.eventData.to.name != deck.name && !data.actionData.any) {
					return false;
				}
	
				if (data && data.actionData && data.actionData.query) {
	
					var _query = data.actionData.query;
	
					var _selectedDecks = [];
	
					if (_query.groups) {
	
						var _select = _query.select ? _query.select : 'all';
	
						for (var groupNameIndex in _query.groups) {
	
							var groupName = _query.groups[groupNameIndex];
	
							var _group = _group3.default.getByName(groupName);
	
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
	
								var _decks = _group.getDecks();
	
								_selectedDecks = _selectedDecks.concat(_decks);
							}
						}
					}
	
					if (_query.decks) {
	
						for (var deckNameIndex in _query.decks) {
	
							var deckName = _query.decks[deckNameIndex];
	
							var _deck4 = Deck.getByName(deckName);
	
							if (_deck4) {
								_selectedDecks.push(_deck4);
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
	
				_event2.default.dispatch('saveSteps', 'CHECKFULLACTION');
	
				_get(checkFullAction.prototype.__proto__ || Object.getPrototypeOf(checkFullAction.prototype), 'end', this).call(this);
			}
		}]);
	
		return checkFullAction;
	}(_deckAction3.default);
	
	exports.default = new checkFullAction();

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _deckAction2 = __webpack_require__(24);
	
	var _deckAction3 = _interopRequireDefault(_deckAction2);
	
	var _deck = __webpack_require__(14);
	
	var _deck2 = _interopRequireDefault(_deck);
	
	var _history = __webpack_require__(25);
	
	var _history2 = _interopRequireDefault(_history);
	
	var _atom = __webpack_require__(27);
	
	var _atom2 = _interopRequireDefault(_atom);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var defaultOpenCount = 3;
	
	var rollerAction = function (_deckAction) {
		_inherits(rollerAction, _deckAction);
	
		function rollerAction() {
			_classCallCheck(this, rollerAction);
	
			return _possibleConstructorReturn(this, (rollerAction.__proto__ || Object.getPrototypeOf(rollerAction)).call(this));
		}
	
		_createClass(rollerAction, [{
			key: 'run',
			value: function run(deck, data) {
				var _this2 = this;
	
				if (!deck || !data || !deck.cards || deck.cards.length == 0) {
					return;
				}
	
				/*
	    * действие совершаемое после хода из стопки
	    * если задан такой event
	    */
	
				if (data.eventName.indexOf('moveEnd') >= 0) {
	
					if (data.eventData.from.name != deck.name) {
						return;
					}
	
					// количество открытых видимых карт
					var unflipCardsCount = deck.cardsCount({
						"visible": true,
						"flip": false
					});
	
					// количество скрытых карт
					var _hiddenCardsCount = deck.cardsCount({
						"visible": false
					});
	
					// если нет открытых карт показать предыдущую скрытую
					if (unflipCardsCount == 0 && _hiddenCardsCount > 0) {
	
						var next = deck.cards.length - _hiddenCardsCount;
	
						deck.showCardByIndex(next, true);
	
						// save step
						_event2.default.dispatch('addStep', {
							"show": {
								"cardIndex": next,
								"cardName": deck.cards[next].name,
								"deckName": deck.name
							}
						});
	
						_event2.default.dispatch('checkTips');
					}
	
					// event.dispatch('addStep', {
					// 	"rollerActionEnd" : deck.name
					// });
	
					return;
				}
	
				/*
	    * действие совершаемое по прочим event-ам
	    * предпочтительно клик
	    */
	
				if (data.eventData.to.name != deck.name) {
					return false;
				}
	
				// количество показываемых карт
				var openCount = data.actionData.openCount ? data.actionData.openCount : defaultOpenCount;
	
				// количество скрытых карт
				var hiddenCardsCount = deck.cardsCount({
					"visible": false
				});
	
				// количество видимых карт
				var cardsCount = deck.cardsCount({
					"visible": true
				});
	
				// есть видимые карты
				if (cardsCount > 0) {
					var _ret = function () {
	
						// количество открытых видимых карт
						var unflipCardsCount = deck.cardsCount({
							"visible": true,
							"flip": false
						});
	
						// количество закрытых видимых карт
						var flipCardsCount = deck.cardsCount({
							"visible": true,
							"flip": true
						});
	
						// не осталось видимых закрытых карт
						if (flipCardsCount == 0) {
	
							// количество скрытых карт
							hiddenCardsCount = deck.cardsCount({
								"visible": false
							});
	
							// let rewindStatus = null;
	
							_event2.default.dispatch('rewindHistory', function (data) {
	
								var found = false;
	
								var stepsCount = 0;
	
								for (var i = data.history.length - 1; i >= 0 && !found; i -= 1) {
	
									stepsCount += 1;
	
									var step = data.history[i];
	
									// find action end
									// for(let atomIndex in step) {
	
									// 	let atom = step[atomIndex];
	
									// 	if(
									// 		!found                                   &&
									// 		typeof atom.rollerActionEnd == "string"  &&
									// 		       atom.rollerActionEnd == deck.name
									// 	) {
									// 		// break rewind
									// 		return;
									// 	}
									// }
	
									for (var atomIndex in step) {
	
										var atom = step[atomIndex];
	
										// rewind
										if (!found && typeof atom.rollerActionStart == "string" && atom.rollerActionStart == deck.name) {
	
											found = true;
	
											_event2.default.dispatch('resetHistory');
	
											for (var _i = 0; _i < stepsCount; _i += 1) {
												data.undo();
											}
	
											// reset deck
											deck.showCards(false); // no redraw, add in history
											deck.flipAllCards(false); // no redraw, add in history
	
											// rewindStatus = 'done';
	
											// reset
											// если ход в истории найден раньше начала прокруток остановить rewind
										} else if (!found && atom.move) {
	
											// Swap
											for (var _i2 = 0; _i2 < (unflipCardsCount / 2 | 0); _i2 += 1) {
	
												var _next = unflipCardsCount - _i2 - 1;
	
												if (_i2 < _next) {
													_atom2.default.swap(deck, _i2, _next, true);
												}
											}
	
											// Hide visible flipped cards
											for (var _i3 = 0; _i3 < unflipCardsCount; _i3 += 1) {
	
												deck.hideCardByIndex(_i3, true);
	
												// save step
												_event2.default.dispatch('addStep', {
													"hide": {
														"cardIndex": _i3,
														"cardName": deck.cards[_i3].name,
														"deckName": deck.name
													}
												});
											}
	
											found = true;
	
											// reset deck
											deck.showCards(false, true); // no redraw, add in history
											deck.flipAllCards(false, true); // no redraw, add in history
	
											deck.Redraw();
	
											_event2.default.dispatch('saveSteps');
	
											// rewindStatus = 'break';
										}
									}
								}
							});
	
							// Restore deck
	
							// количество скрытых карт
							hiddenCardsCount = deck.cardsCount({
								"visible": false
							});
	
							// ещё есть скрытые карты
							if (hiddenCardsCount > 0) {
	
								deck.showCards(false, true); // no redraw
								deck.flipAllCards(false, true); // no redraw
	
								// event.dispatch('saveSteps');
								_this2.run(deck, data);
	
								deck.Redraw();
							}
	
							return {
								v: void 0
							};
						}
	
						// первая прокрутка
						if (hiddenCardsCount == 0 && // нет скрытых карт
						unflipCardsCount == 0 // нет открытых видимых карт
						) {
								_event2.default.dispatch('addStep', {
									"rollerActionStart": deck.name
								});
							}
	
						// количество скрываемых дальше открытых карт
						var unflippedCount = 0;
	
						// скрываем открытые видимые карты
						if (unflipCardsCount > 0) {
	
							var cards = deck.getCards();
	
							for (var i in cards) {
	
								if (cards[i].flip == false) {
	
									unflippedCount += 1;
	
									deck.hideCardByIndex(i);
	
									_event2.default.dispatch('addStep', {
										"hide": {
											"cardIndex": i,
											"cardName": deck.cards[i].name,
											"deckName": deck.name
										}
									});
								}
							}
						}
	
						// далее карты выкладываются в обратном порядке
						// поэтому возвращаем выложенные на предыдущей итерации карты в исходное положение
						if (openCount > 1) {
	
							for (var _i4 = cardsCount - unflippedCount; _i4 < cardsCount; _i4 += 1) {
	
								var _next2 = cardsCount * 2 - _i4 - unflippedCount - 1;
	
								if (_i4 < _next2) {
									_atom2.default.swap(deck, _i4, _next2, true);
								}
							}
						}
	
						// количество открытых дальше карт (карт в стопке могло остаться меньше трёх)
						unflippedCount = 0;
	
						// открываем следующие openCount|3 карт
						for (var _i5 = flipCardsCount - 1; _i5 >= 0 && _i5 >= flipCardsCount - openCount; _i5 -= 1) {
	
							unflippedCount += 1;
	
							deck.cards[_i5].flip = false;
	
							_event2.default.dispatch('addStep', {
								"unflip": {
									"cardIndex": _i5,
									"cardName": deck.cards[_i5].name,
									"deckName": deck.name
								}
							});
						}
	
						// количество видимых карт
						cardsCount = deck.cardsCount({
							"visible": true
						});
	
						// карты выкладываются в обратном порядке
						if (openCount > 1 // &&
						// unflippedCount
						) {
	
								for (var _i6 = cardsCount - unflippedCount; _i6 < cardsCount; _i6 += 1) {
	
									var _next3 = cardsCount * 2 - _i6 - unflippedCount - 1;
	
									if (_i6 < _next3) {
										_atom2.default.swap(deck, _i6, _next3, true);
									}
								}
							}
	
						_event2.default.dispatch('saveSteps');
	
						// нет видимых карт
					}();
	
					if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
				} else {
	
					// Restore deck
	
					// количество скрытых карт
					hiddenCardsCount = deck.cardsCount({
						"visible": false
					});
	
					if (hiddenCardsCount > 0) {
	
						deck.showCards(false, true); // no redraw
						deck.flipAllCards(false, true); // no redraw
	
						// event.dispatch('saveSteps');
	
						deck.Redraw();
	
						this.run(deck, data);
	
						return;
					}
				}
	
				deck.Redraw();
	
				_get(rollerAction.prototype.__proto__ || Object.getPrototypeOf(rollerAction.prototype), 'end', this).call(this);
	
				_event2.default.dispatch('checkTips');
			}
		}]);
	
		return rollerAction;
	}(_deckAction3.default);
	
	exports.default = new rollerAction();

/***/ },
/* 40 */
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
	
	var _takeRules = __webpack_require__(18);
	
	var _takeRules2 = _interopRequireDefault(_takeRules);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (deck, cardId) {
	
		// Нестандартный ход (autosteps)
		// if(share.get('stepType') != defaults.stepType) {return false;};
	
		var rulesCorrect = true; //!common.isLock();
	
		rulesCorrect = rulesCorrect && !deck.locked;
	
		// смотрим не заполнена ли колода
		if (typeof deck.full == 'boolean') {
			rulesCorrect = rulesCorrect && !deck.full;
		}
	
		// берём карту/стопку
	
		var cardIndex = -1;
		var cardName = null;
		var cardSuit = null;
		var cardRank = null;
		var deckLength = deck.cardsCount();
	
		// проверяем не является ли перевернутой
	
		var takeDeck = [];
	
		var cards = deck.getCards();
		for (var i in cards) {
	
			if (cards[i].id == cardId) {
	
				cardIndex = i | 0;
				cardName = cards[i].name;
	
				var _name = _common2.default.validateCardName(cardName);
	
				rulesCorrect = rulesCorrect && _name;
	
				if (_name) {
					cardSuit = _name.suit;
					cardRank = _name.rank;
				}
	
				rulesCorrect = rulesCorrect && !cards[i].flip && cards[i].flip == _defaults2.default.canMoveFlip;
			}
	
			if (cardIndex >= 0) {
	
				takeDeck.push({
					"index": i,
					"card": cards[i]
				});
			}
		}
	
		var _attrs = {
			"cardId": cardId,
			"cardName": cardName,
			"cardSuit": cardSuit,
			"cardRank": cardRank,
			"cardIndex": cardIndex,
			"deckLength": deckLength
		};
	
		for (var ruleIndex in deck.takeRules) {
	
			var ruleName = deck.takeRules[ruleIndex];
	
			if (_takeRules2.default[ruleName]) {
				rulesCorrect = rulesCorrect && _takeRules2.default[ruleName](_attrs);
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
/* 41 */
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
	
	var _putRules = __webpack_require__(16);
	
	var _putRules2 = _interopRequireDefault(_putRules);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (deck, putDeck) {
	
		var _stepType = _share2.default.get('stepType');
	
		var rulesCorrect = true;
	
		var _deckId = putDeck[0].card.parent;
		var _deck_departure = _deck3.default.getDeckById(_deckId);
	
		rulesCorrect = rulesCorrect && !deck.locked;
	
		// Нестандартный ход (autosteps)
		if (_stepType != _defaults2.default.stepType) {
	
			rulesCorrect = rulesCorrect && _field2.default.autoSteps && _field2.default.autoSteps[_stepType] ? _field2.default.autoSteps[_stepType].manual({
				"putDeck": putDeck,
				"to": deck
			}) : false;
			// Стандартный ход
		} else {
			// let _link = null; // target deck name?
			var _deck = deck;
	
			for (var ruleIndex in deck.putRules) {
	
				if (rulesCorrect) {
	
					// if(_link) {
					// 	_deck = Deck.getDeck(_link);
					// }
	
					var ruleName = deck.putRules[ruleIndex];
	
					if (_putRules2.default[ruleName]) {
	
						var _param = {
							"from": {
								"deckId": _deckId,
								"deck": _deck_departure
							},
							"putDeck": putDeck,
							"cards": _deck.cards,
							"to": _deck
							// "link"    : _link
						};
						rulesCorrect = rulesCorrect && _putRules2.default[ruleName](_param);
						// _link = _param.link;
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
/* 42 */
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
							"id": _id,
							"name": name,
							"type": 'card',
							"visible": true,
							"flip": false,
							"parent": deck.id
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
/* 43 */
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
/* 44 */
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
/* 45 */
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
					group.decks[deckIndex[_i8]].Fill(cardNames[_i8]);
				};
			};
		};
	};

/***/ },
/* 46 */
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
					"x": data.position.x,
					"y": data.position.y
				};
			};
	
			// прокидываем остальные параметры (параметры группы приоритетнее)
			if (typeof data.paddingX == 'number') {
				data.decks[i].paddingX = data.paddingX;
			};
			if (typeof data.paddingY == 'number') {
				data.decks[i].paddingY = data.paddingY;
			};
	
			if (typeof data.flipPaddingX == 'number') {
				data.decks[i].flipPaddingX = data.flipPaddingX;
			};
			if (typeof data.flipPaddingY == 'number') {
				data.decks[i].flipPaddingY = data.flipPaddingY;
			};
	
			if (typeof data.decks[i].position == 'undefined') {
				data.decks[i].position = {};
			};
	
			data.decks[i].parentPosition = {};
	
			if (typeof data.rotate == 'number') {
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * генерация стопок в группах
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _countGenerator = __webpack_require__(48);
	
	var _countGenerator2 = _interopRequireDefault(_countGenerator);
	
	var _fanGenerator = __webpack_require__(49);
	
	var _fanGenerator2 = _interopRequireDefault(_fanGenerator);
	
	var _mapGenerator = __webpack_require__(50);
	
	var _mapGenerator2 = _interopRequireDefault(_mapGenerator);
	
	var _lineGenerator = __webpack_require__(57);
	
	var _lineGenerator2 = _interopRequireDefault(_lineGenerator);
	
	var _rhombusGenerator = __webpack_require__(58);
	
	var _rhombusGenerator2 = _interopRequireDefault(_rhombusGenerator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
		"count": _countGenerator2.default,
		"fan": _fanGenerator2.default,
		"map": _mapGenerator2.default,
		"line": _lineGenerator2.default,
		"rhombus": _rhombusGenerator2.default
	};

/***/ },
/* 48 */
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
				"name": _deckName
			});
		}
	
		return _decks;
	};

/***/ },
/* 49 */
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
			"x": 0,
			"y": 0
		};
	
		//              b
		//       C  ..`:   A = sin(b) * C
		//     ...``   :B  B = cos(b) * C
		// a.``.......+:
		//        A     y 90deg
	
		var _decks = [];
		var _count = typeof data.count == 'number' ? data.count : 3;
		var _radius = typeof data.radius == 'number' ? data.radius : 100;
		var _step = 180 / _count;
		var _angle = _step / 2 + 270;
		var _deg = Math.PI / 180;
		var _center = typeof data.center != 'undefined' && typeof data.center.x != 'undefined' && typeof data.center.y != 'undefined' ? data.center : {
			"x": 0,
			"y": 0
		};
	
		for (var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
	
			var _a = Math.sin(_angle * _deg) * _radius;
			var _b = Math.cos(_angle * _deg) * _radius;
	
			if (_angle > 360) {
				_angle -= 360;
			}
	
			_decks.push({
				"name": group.name + '_deck' + deckIndex,
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
/* 50 */
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
	
	var _relationsGenerator = __webpack_require__(51);
	
	var _relationsGenerator2 = _interopRequireDefault(_relationsGenerator);
	
	var _mapCommon = __webpack_require__(53);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// let getName = (el)=>{
	// 	return typeof el == "string" ? el : typeof el != "undefined" && typeof el.name == "string" ? el.name : null;
	// };
	
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
			"x": 0,
			"y": 0
		};
	
		var _placement = group.placement ? {
			"x": typeof group.placement.x != 'undefined' ? group.placement.x : _default_placement.x,
			"y": typeof group.placement.y != 'undefined' ? group.placement.y : _default_placement.y
		} : _default_placement;
	
		group.placement = {
			"x": 0,
			"y": 0
		};
	
		var _index = 1;
	
		var _mapSize = _mapCommon2.default.mapSize(data.map);
	
		// {name: 'groupName_deck_0_0'}
		for (var y in data.map) {
			for (var x in data.map[y]) {
	
				if (typeof data.map[y][x] == 'boolean' && data.map[y][x] || typeof data.map[y][x] == 'number' && data.map[y][x] > 0) {
					data.map[y][x] = {};
				};
	
				if (typeof data.map[y][x] == 'string') {
					data.map[y][x] = { name: data.map[y][x] };
				} else if (data.map[y][x] && typeof data.map[y][x] != 'undefined' && typeof data.map[y][x].name != 'string') {
					data.map[y][x].name = group.name + '_deck_' + x + '_' + y;
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
	
					var _relations = [];
	
					var _relGenerators = {
						"around": 'mapAroundRelations',
						"beside": 'mapBesideRelations',
						"fall": 'mapFallRelations'
					};
	
					if (data.relations) {
	
						for (var relGenName in _relGenerators) {
	
							if (data.relations[relGenName]) {
								_relations = _relations.concat(_relationsGenerator2.default[_relGenerators[relGenName]]({
									"x": _x2,
									"y": _y2,
									"map": data.map,
									"mapSize": _mapSize,
									"el": _el,
									"data": data.relations[relGenName]
								}));
							};
						};
					};
	
					_deck.relations = _relations;
	
					_decks.push(_deck);
					_index += 1;
				}
			}
		}
	
		return _decks;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapFallRelations = __webpack_require__(52);
	
	var _mapFallRelations2 = _interopRequireDefault(_mapFallRelations);
	
	var _mapAroundRelations = __webpack_require__(54);
	
	var _mapAroundRelations2 = _interopRequireDefault(_mapAroundRelations);
	
	var _mapBesideRelations = __webpack_require__(55);
	
	var _mapBesideRelations2 = _interopRequireDefault(_mapBesideRelations);
	
	var _lineBesideRelations = __webpack_require__(56);
	
	var _lineBesideRelations2 = _interopRequireDefault(_lineBesideRelations);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
		"mapFallRelations": _mapFallRelations2.default,
		"mapAroundRelations": _mapAroundRelations2.default,
		"mapBesideRelations": _mapBesideRelations2.default,
		"lineBesideRelations": _lineBesideRelations2.default
	};

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(53);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// map froup generator fall relations
	
	// const directions = [
	// 	'left' ,
	// 	'rigth',
	// 	'up'   ,
	// 	'down'
	// ];
	
	var opposite = [{ "left": 'right' }, { "right": 'left' }, { "up": 'down' }, { "down": 'up' }];
	
	exports.default = function (data) {
		// {x, y, map, mapSize, el, data}
	
		var _relations = [];
	
		var _directions = [];
	
		for (var i in data.data.directions) {
			if (!_directions.indexOf(data.data.directions[i]) >= 0 && // этого направления ещё не было
			!_directions.indexOf(opposite[data.data.directions[i]]) >= 0 // противоположного направления тоже не было
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
							"name": 'fall',
							"direction": 'left',
							"to": data.map[y][x].name
						});
					}
	
					break;
	
				case 'right':
	
					x = (data.x | 0) + _mapCommon2.default.beSide.right.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.right.y;
	
					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							"name": 'fall',
							"direction": 'right',
							"to": data.map[y][x].name
						});
					}
	
					break;
	
				case 'up':
	
					x = (data.x | 0) + _mapCommon2.default.beSide.up.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.up.y;
	
					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							"name": 'fall',
							"direction": 'up',
							"to": data.map[y][x].name
						});
					}
	
					break;
	
				case 'down':
	
					x = (data.x | 0) + _mapCommon2.default.beSide.down.x;
					y = (data.y | 0) + _mapCommon2.default.beSide.down.y;
	
					if (_mapCommon2.default.exist(x, y, data.mapSize, data.map)) {
						_relations.push({
							"name": 'fall',
							"direction": 'down',
							"to": data.map[y][x].name
						});
					}
	
					break;
			}
		}
	
		return _relations;
	};

/***/ },
/* 53 */
/***/ function(module, exports) {

	'use strict';
	
	/*
	 * inMap
	 * exist
	 * mapSize
	 */
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var beSide = {
		"left": { "x": -1, "y": 0 },
		"right": { "x": 1, "y": 0 },
		"up": { "x": 0, "y": -1 },
		"down": { "x": 0, "y": 1 }
	};
	
	var inMap = function inMap(x, y, mapSize) {
		return x >= 0 && y >= 0 && x < mapSize.width && y < mapSize.height;
	};
	
	var exist = function exist(x, y, mapSize, map) {
		return inMap(x, y, mapSize) && map[y][x];
	};
	
	var mapSize = function mapSize(map) {
	
		var _mapSize = {
			"width": map[0].length, //MAX LENGTH
			"height": map.length
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
	var aroundRelations = [{ "x": -1, "y": -1, "type": 'corn', "id": 'clt' }, { "x": 0, "y": -1, "type": 'side', "id": 'top' }, { "x": 1, "y": -1, "type": 'corn', "id": 'crt' }, { "x": -1, "y": 0, "type": 'side', "id": 'lft' }, { "x": 1, "y": 0, "type": 'side', "id": 'rgt' }, { "x": -1, "y": 1, "type": 'corn', "id": 'clb' }, { "x": 0, "y": 1, "type": 'side', "id": 'btm' }, { "x": 1, "y": 1, "type": 'corn', "id": 'crb' }];
	
	exports.default = {
		beSide: beSide,
		mapSize: mapSize,
		inMap: inMap,
		aroundRelations: aroundRelations,
		exist: exist
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(53);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (data) {
		// {x, y, map, mapSize, el, data}
	
		var _relations = [];
	
		for (var i in _mapCommon2.default.aroundRelations) {
	
			if (_mapCommon2.default.inMap(data.x + _mapCommon2.default.aroundRelations[i].x, data.y + _mapCommon2.default.aroundRelations[i].y, data.mapSize) && data.map[data.y + _mapCommon2.default.aroundRelations[i].y][data.x + _mapCommon2.default.aroundRelations[i].x]) {
				_relations.push({
					"to": data.map[data.y + _mapCommon2.default.aroundRelations[i].y][data.x + _mapCommon2.default.aroundRelations[i].x].name,
					"type": _mapCommon2.default.aroundRelations[i].type,
					"id": _mapCommon2.default.aroundRelations[i].id,
					"name": 'around'
				});
			}
		}
	
		return _relations;
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(53);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// TODO
	
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
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _mapCommon = __webpack_require__(53);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (data) {
		// {deckIndex, count, decks, data}
	
		var _relations = [];
	
		var _prev = data.deckIndex > 0 ? data.decks[(data.deckIndex | 0) - 1].name : null;
	
		if (_prev) {
			_relations.push({
				"name": 'beside',
				"type": 'prev',
				"to": _prev
			});
		}
	
		var _next = data.deckIndex < data.count - 1 ? data.decks[(data.deckIndex | 0) + 1].name : null;
	
		if (_next) {
			_relations.push({
				"name": 'beside',
				"type": 'next',
				"to": _next
			});
		}
	
		return _relations;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * сгенерировать ряд из N карт
	 */
	
	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _relationsGenerator = __webpack_require__(51);
	
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
	
			var _deckName = group.name + '_deck' + (deckIndex + 1);
	
			var _deck = {
				"name": _deckName
			};
	
			_decks.push(_deck);
		}
	
		// first/last
		// TODO надо поправить перекрытие тегов из генератора и группы
		_decks[0].tags.push('first');
	
		if (data.first) {
	
			var _deck2 = _decks[0];
	
			for (var propName in data.first) {
				_deck2[propName] = data.first[propName];
			}
		}
	
		if (_decks[1]) {
			_decks[1].tags.push('second');
		}
	
		_decks[_decks.length - 1].tags.push('last');
	
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
							"deckIndex": _deckIndex,
							"count": _count,
							"decks": _decks,
							"data": data.relations[relGenName]
						}));
					};
				};
			};
	
			_decks[_deckIndex].relations = _relations;
		}
	
		return _decks;
	};

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (group, data) {};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _fallAutoStep = __webpack_require__(60);
	
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
/* 60 */
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
	
	var _autoStep2 = __webpack_require__(61);
	
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
	
			var _this = _possibleConstructorReturn(this, (fallAutoStep.__proto__ || Object.getPrototypeOf(fallAutoStep)).call(this, params));
	
			_this._name = 'fall';
	
			// со скольки стопок могут <<упасть>> карты в стопку из которой сделан ход
			_this.manualPossibleMoves = 0;
	
			// event.listen('fallAutoStepCheck', this.check);
			return _this;
		}
	
		// есть ли ещё ходы этого типа
	
	
		_createClass(fallAutoStep, [{
			key: 'check',
			value: function check() {
	
				_tips3.default.checkTips();
	
				var _tips = _tips3.default.getTips();
	
				// console.log('fallAutoStep:check', _tips.length);
	
				if (_tips.length == 0) {
	
					this.end();
					// Tips.checkTips();
					return false;
				} else {
					// event.dispatch('saveSteps');
				}
	
				return true;
			}
	
			// start() {
			// 	super.start();
			// 	console.log('FALL AUTO STEP');
			// }
	
		}, {
			key: 'auto',
			value: function auto() {
	
				// TODO
				console.log('fallAutoStep:auto');
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
	
				// console.log('fallAutoStep:manual');
	
				// empty
				// check fall
				// this.check();
				var _from = _deck2.default.getDeckById(data.putDeck[0].card.parent),
				    _to = data.to;
	
				var _relations = _from.getRelationsByName('fall', {
					"from": null
				});
	
				for (var i in _relations) {
					if (_relations[i].to == _to.name && _to.cardsCount() === 0) {
						this.manualPossibleMoves += 1;
						return true;
					}
				}
	
				return false;
			}
	
			// end() {
			// 	super.end({
			// 		"save" : true // (this.manualPossibleMoves > 0 ? true : false)
			// 	});
			// }
	
		}]);
	
		return fallAutoStep;
	}(_autoStep3.default);
	
	exports.default = fallAutoStep;

/***/ },
/* 61 */
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
	
	/*
	 * start
	 * end
	 * init
	 */
	
	var _class = function () {
		function _class(params) {
			_classCallCheck(this, _class);
	
			if (typeof params.groups != 'undefined') {
				this.groups = params.groups;
			}
	
			if (typeof params.event == 'string') {
				this.event = params.event;
			}
	
			if (typeof params.dispatch == 'string') {
				this.dispatch = params.dispatch;
			}
	
			if (typeof params.autoStep == 'boolean') {
				this.autoStep = params.autoStep;
			}
		}
	
		_createClass(_class, [{
			key: 'start',
			value: function start(data) {
	
				if (!this.autoStep) {
					_event2.default.dispatch('stopSession');
				}
	
				_share2.default.set('autoStep:stepType', this.stepType);
	
				_share2.default.set('stepType', this.stepType);
	
				// console.log('autoStep', this.autoStep, this._name, data);
	
				if (this.autoStep) {
	
					_common2.default.curLock();
					// TODO run data.before();
	
					this.auto();
				} else {
	
					// if(this.check()) {
	
					if (data && typeof data.before == 'function') {
	
						data.before({
							"stepType": this.stepType
						});
					}
	
					var _check = this.check();
	
					if (!_check) {
						// this.end();
					} else {
						_event2.default.dispatch('saveSteps');
					}
				}
			}
		}, {
			key: 'end',
			value: function end(data) {
	
				// console.log('autoStep:end, dispatch:', this.disptch)
	
				// let _stepType = share.get('stepType');
				_share2.default.set('stepType', _defaults2.default.stepType);
	
				if (this.dispatch) {
	
					var _data = {
						"stepType": _share2.default.get('stepType') // TODO defaults.stepType | _stepType
						// "callback" : e => {
						// 	share.set('stepType', defaults.stepType);
						// }
					};
	
					if (data) {
						for (var valueName in data) {
							_data[valueName] = data[valueName];
						}
					}
	
					_event2.default.dispatch(this.dispatch, _data);
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
	
					_event2.default.listen('moveEnd', function (e) {
	
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
/* 62 */
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
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _field = __webpack_require__(12);
	
	var _field2 = _interopRequireDefault(_field);
	
	var _tips2 = __webpack_require__(9);
	
	var _tips3 = _interopRequireDefault(_tips2);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// Автоход в "дом"
	var autoMoveToHome = function autoMoveToHome(data) {
	
		var _tips = _tips3.default.getTips();
	
		// TODO check all deck for top flipped card
	
		_event2.default.dispatch('startRunHistory');
	
		var _homeGroups = _field2.default.homeGroups;
		var homeGroupDecksNames = [];
	
		for (var groupNameIndex in _homeGroups) {
	
			var groupName = _homeGroups[groupNameIndex];
	
			var group = _common2.default.getElementsByName(groupName, 'deck')[0];
			var decks = group.getDecks();
	
			for (var deckIndex in decks) {
	
				var deck = decks[deckIndex];
	
				homeGroupDecksNames.push(deck.name);
			}
		}
	
		var suitableTips = [];
	
		for (var tipIndex in _tips) {
	
			var tip = _tips[tipIndex];
	
			if (homeGroupDecksNames.indexOf(tip.to.deck.name) >= 0 && homeGroupDecksNames.indexOf(tip.from.deck.name) < 0) {
				suitableTips.push(tip);
			}
		}
	
		if (suitableTips.length > 0) {
	
			var _tip = suitableTips[0];
	
			var _callback = function _callback(e) {
	
				_tips3.default.checkTips();
	
				autoMoveToHome(data);
			};
	
			var forceMoveData = {
				"from": _tip.from.deck.name,
				"to": _tip.to.deck.name,
				"deck": [_tip.from.card.name],
				"addStep": true,
				"save": true,
				"callback": _callback
			};
	
			_event2.default.dispatch('forceMove', forceMoveData);
		} else {
	
			_event2.default.dispatch('winCheck', {
				"show": true
			});
		}
	};
	
	_event2.default.listen('autoMoveToHome', autoMoveToHome);

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (e) {
	
		var _html = __webpack_require__(65);
	
		// $("#gpCommit")
		// 	.parent()
		// 	.before(_html);
	
		try {
	
			var el = document.getElementById('gpCommit');
	
			var div = document.createElement('div');
			div.innerHTML = _html;
	
			el.parentNode.insertBefore(div, el);
		} catch (e) {}
	};

/***/ },
/* 65 */
/***/ function(module, exports) {

	module.exports = "<div id=\"solitaire-engine-style-preferences\">\n\t<h4>Настройки оформления</h4>\n\t<div>\n\t\t<span class=\"solitaire-engine-style-preferences-label\">Фон:</span>\n\t\t<!-- <select id=\"pref_field\" class=\"solitaire-engine-style-preferences-element\"> -->\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_field\" value=\"default_field\">\n\t\t\tКлассический\n\t\t</label>\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_field\" value=\"alternative_field\">\n\t\t\tАльтернативный\n\t\t</label>\n\t\t<!-- </select> -->\n\t</div>\n\t<div>\n\t\t<span class=\"solitaire-engine-style-preferences-label\">Лицевая сторона:</span>\n\t\t<!-- <select id=\"pref_face\" class=\"solitaire-engine-style-preferences-element\"> -->\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_face\" value=\"default_face\">\n\t\t\tКлассическая\n\t\t</label>\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_face\" value=\"alternative_face\">\n\t\t\tАнгло-американская\n\t\t</label>\n\t\t<!-- </select> -->\n\t</div>\n\t<div>\n\t\t<span class=\"solitaire-engine-style-preferences-label\">Рубашка:</span>\n\t\t<!-- <select id=\"pref_back\" class=\"solitaire-engine-style-preferences-element\"> -->\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_back\" value=\"default_back\">\n\t\t\tКлассическая\n\t\t</label>\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_back\" value=\"alternative_back\">\n\t\t\tАльтернативная\n\t\t</label>\n\t\t<!-- <label>\n\t\t\t<input type=\"radio\" name=\"pref_back\" value=\"red_back\">\n\t\t\tКрасная\n\t\t</label>\n\t\t<label>\n\t\t\t<input type=\"radio\" name=\"pref_back\" value=\"blue_back\">\n\t\t\tСиняя\n\t\t</label> -->\n\t\t<!-- </select> -->\n\t</div>\n\t<div id=\"gamePreferences\"></div>\n\t<!-- <div>\n\t\t<span class=\"solitaire-engine-style-preferences-label\">Пустая ячейка:</span>\n\t\t<select id=\"pref_empty\" class=\"solitaire-engine-style-preferences-element\">\n\t\t\t<option value=0>Классическая</option>\n\t\t\t<option value=1>С обводкой</option>\n\t\t</select>\n\t</div> -->\n</div>";

/***/ },
/* 66 */
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
	
	var _storage = __webpack_require__(62);
	
	var _storage2 = _interopRequireDefault(_storage);
	
	var _gamePreferences = __webpack_require__(67);
	
	var _gamePreferences2 = _interopRequireDefault(_gamePreferences);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * onShowParameters
	 * applyParameters
	 * saveParameters
	 */
	
	var onShowParameters = function onShowParameters(e) {
	
		var pref = _storage2.default.get('pref');
	
		!pref && (pref = _defaults2.default.pref);
	
		try {
			for (var prefName in _defaults2.default.themes) {
	
				var _pref = pref[prefName] && _defaults2.default.themes[prefName].indexOf(pref[prefName]) >= 0 ? pref[prefName] : _defaults2.default.pref[prefName];
	
				$('input[name=\'pref_' + prefName + '\'][value=\'' + _pref.toString() + '\']').prop({ checked: true });
			}
		} catch (e) {}
	
		_gamePreferences2.default.show(pref);
	};
	
	var applyParameters = function applyParameters(e) {
	
		var pref = {};
	
		try {
	
			for (var prefName in _defaults2.default.themes) {
	
				var _value = $('input[name=\'pref_' + prefName + '\']:checked').val();
	
				_value = _value == 'true' ? true : _value == 'false' ? false : _value;
	
				pref[prefName] = _value;
			}
		} catch (e) {}
	
		_event2.default.dispatch('fieldThemesSet', pref);
	
		_gamePreferences2.default.get(pref);
	
		// event.dispatch('changeGameParameters', pref);
	
		saveParameters(pref);
	
		var changePreferencesCallback = _share2.default.get('changePreferencesCallback');
	
		if (typeof changePreferencesCallback == 'function') {
	
			var _data = pref;
	
			changePreferencesCallback(_data);
		}
	};
	
	var saveParameters = function saveParameters(pref) {
		_storage2.default.set('pref', pref);
	};
	
	exports.default = function (e) {
	
		// TODO переделать без jQuery
		try {
	
			$('#bbParameters').click(onShowParameters);
	
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
		} catch (e) {}
	};

/***/ },
/* 67 */
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
	
	/*
	 * draw
	 * show
	 * get
	 */
	
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
	
					// let _label = $('<div>').append(
					// 	$('<span>')
					// 		.addClass('solitaire-engine-style-preferences-label')
					// 		.html(_preferences[prefName].title)
					// );
	
					var el = document.createElement('span');
					el.setAttribute('class', 'solitaire-engine-style-preferences-label');
					el.innerHTML = _preferences[prefName].title;
					var _label = document.createElement('div');
					_label.appendChild(el);
	
					for (var i in _preferences[prefName].options) {
						$(_label).append($('<label>').append($('<input>').prop({
							"type": 'radio',
							"name": 'gamePref_' + prefName,
							"value": _preferences[prefName].options[i].value
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
					if (pref && typeof pref[prefName] != 'undefined') {
						$('input[name=\'gamePref_' + prefName + '\'][value=\'' + pref[prefName].toString() + '\']').prop({ "checked": true });
					} else {
						$('input[name=\'gamePref_' + prefName + '\'][value=\'' + _preferences[prefName].value.toString() + '\']').prop({ "checked": true });
					}
				}
			}
		}, {
			key: 'get',
			value: function get(pref) {
	
				var _preferences = _share2.default.get('gamePreferences');
	
				for (var prefName in _preferences) {
	
					var _value = $('input[name=\'gamePref_' + prefName + '\']:checked').val();
	
					_value = _value == 'true' ? true : _value == 'false' ? false : _value;
	
					pref[prefName] = _value;
				}
			}
		}]);
	
		return gamePreferences;
	}();
	
	exports.default = new gamePreferences();

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _storage = __webpack_require__(62);
	
	var _storage2 = _interopRequireDefault(_storage);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = function (e) {
	
		var pref = _storage2.default.get('pref');
	
		!pref && (pref = _defaults2.default.pref);
	
		for (var prefName in pref) {
	
			if (_defaults2.default.themes[prefName]) {
	
				if (_defaults2.default.themes[prefName].indexOf(pref[prefName]) < 0) {
	
					pref[prefName] = _defaults2.default.pref[prefName];
				}
			}
		}
	
		_event2.default.dispatch('fieldThemesSet', pref);
	};

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _deck = __webpack_require__(14);
	
	var _deck2 = _interopRequireDefault(_deck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_event2.default.listen('specialStep', function (card) {
	
		var cardName = card.name;
		var deckName = _deck2.default.getDeckById(card.parent).name;
	
		_event2.default.dispatch('rewindHistory', function (data) {
	
			var index = -1;
	
			for (var i = data.history.length - 1; i > 0 && index < 0; i -= 1) {
	
				var step = data.history[i];
	
				for (var atomIndex in step) {
	
					var atom = step[atomIndex];
	
					if (atom.move && atom.move.to == deckName && atom.move.deck[0] == cardName) {
						index = i;
					}
				}
			}
	
			var undoCount = index >= 0 ? data.history.length - index : 0;
	
			for (var _i = 0; _i < undoCount; _i += 1) {
				data.undo();
			}
		});
	});

/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _tips = __webpack_require__(9);
	
	var _tips2 = _interopRequireDefault(_tips);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var usedCardId = null;
	
	var showFlipCardOnMove = function showFlipCardOnMove(data) {
	
		return; // TODO
	
		if (!data.deck || !data.card || data.deck.showPrefFlipCard == false) {
			return;
		}
	
		var moveDistance = share.get('moveDistance');
	
		if (moveDistance > 0 && data.distance < moveDistance || usedCardId == data.card.id) {
			return;
		}
	
		var tips = _tips2.default.getTips();
	
		var inTips = false;
	
		for (var i in tips) {
			if (tips[i].from == deck.name) {
				inTips = true;
			}
		}
	
		if (!inTips) {
			return;
		}
	
		usedCardId = data.card.id;
	
		console.log('showFlipCardOnMove:', data);
		// TODO вкл./выкл. defaults, field, group, deck
		return;
	
		if (typeof data.card.flip == "boolean" && data.card.flip == false) {
	
			var prevCard = null;
	
			for (var _i = data.deck.cards.length - 1; _i >= 0 && !prevCard; _i -= 1) {
				if (data.deck.cards[_i].id == data.card.id && _i > 0) {
					prevCard = data.deck.cards[_i - 1];
				}
			}
	
			if (prevCard) {
				_event2.default.dispatch('unflipCard', prevCard);
			}
		}
	};
	
	_event2.default.listen('dragDeck', showFlipCardOnMove);

/***/ },
/* 71 */
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
	
	var _field = __webpack_require__(12);
	
	var _field2 = _interopRequireDefault(_field);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var Move = function Move(moveDeck, to, cursorMove) {
	
		// common.animationDefault();
	
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
				"moveDeck": moveDeck,
				"departure": _deck_departure2,
				"stepType": _share2.default.get('stepType')
			});
	
			return;
		}
	
		_event2.default.dispatch('startSession', {
			"type": 'move'
		});
	
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
	
				// если можно положить карты берём их из исходной стопки
				var _pop = _deck_departure.Pop(moveDeck.length);
				_success = _success && _pop;
	
				if (_pop) {
	
					// ложим карты в колоду назначения
					_deck_destination.Push(_pop, false);
	
					// режим анимации по умолчанию
					// common.animationDefault();
	
					var _checkMoveEnd = false;
	
					for (var _actionName in _deck_destination.actions) {
						if (_deck_destination.actions[_actionName].event == 'moveEnd') {
							_checkMoveEnd = true;
						}
					}
	
					// 
	
					var issetMoves = null;
	
					var _callback = function _callback(e) {
	
						// TODO add card index ?
						_event2.default.dispatch('addStep', {
							"move": {
								"from": _deck_departure.name,
								"to": _deck_destination.name,
								"deck": _deck2.default.deckCardNames(moveDeck),
								"stepType": {
									"undo": _stepType,
									"redo": _stepType
								},
								"context": "move"
							}
						});
	
						// _deck_destination.Push(_pop, false);
	
						if (
						// !event.has('moveEnd', {
						!_event2.default.has('actionEvent:moveEnd:' + _deck_destination.name, {
							tag: _event2.default.tags.inGame
						}) || _share2.default.get('autoStep:stepType') == _share2.default.get('stepType')) {
							_event2.default.dispatch('stopSession');
						}
	
						_tips3.default.checkTips();
	
						if (_deck_departure.autoUnflipTop && _deck_departure.cards.length > 0 && _deck_departure.cards[_deck_departure.cards.length - 1].flip) {
							_deck_departure.unflipTopCard(true);
						}
	
						var moveEndData = {
							"from": _deck_departure,
							"to": _deck_destination,
							"moveDeck": moveDeck,
							"stepType": _share2.default.get('stepType')
						};
	
						_event2.default.dispatch('moveEnd:beforeSave', moveEndData); // used in autoStep
	
						var _tips = _tips3.default.getTips();
	
						if (_deck_destination.save || _tips.length > 0 && _stepType != _defaults2.default.stepType) {
							_event2.default.dispatch('saveSteps', 'MOVE');
						}
	
						// moveEndData.before = data => {
						// 	if(data && typeof data.stepType == 'string') {
						// 		event.dispatch('addStep', {
						// 			"redo": {
						// 				"stepType": data.stepType
						// 			}
						// 		})
						// 	}
						// };
	
						_event2.default.dispatch('moveEnd:' + _share2.default.get('stepType'));
	
						_event2.default.dispatch('moveEnd', moveEndData);
	
						_event2.default.dispatch('winCheck', {
							"show": true
						});
					};
	
					_event2.default.dispatch('moveDragDeck', {
						"departure": _deck_departure,
						"destination": _deck_destination,
						"moveDeck": moveDeck,
						"callback": _callback
					});
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
						"moveDeck": moveDeck,
						"departure": _deck_departure
					});
					// ^ callback
					_event2.default.dispatch('stopSession');
				}
			} else {
	
				_event2.default.dispatch('moveCardToHome', {
					"moveDeck": moveDeck,
					"departure": _deck_departure
				});
				// ^ callback
				_event2.default.dispatch('stopSession');
			}
		}
	};
	
	_event2.default.listen('Move', function (data) {
		Move(data.moveDeck, data.to, data.cursorMove);
	});

/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _elRender = __webpack_require__(73);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	var _initField = __webpack_require__(76);
	
	var _initField2 = _interopRequireDefault(_initField);
	
	var _drawDeck = __webpack_require__(77);
	
	var _drawDeck2 = _interopRequireDefault(_drawDeck);
	
	var _drawCard = __webpack_require__(78);
	
	var _drawCard2 = _interopRequireDefault(_drawCard);
	
	var _drawTip = __webpack_require__(79);
	
	var _drawTip2 = _interopRequireDefault(_drawTip);
	
	var _moveDragDeck = __webpack_require__(80);
	
	var _moveDragDeck2 = _interopRequireDefault(_moveDragDeck);
	
	var _moveCardToHome = __webpack_require__(81);
	
	var _moveCardToHome2 = _interopRequireDefault(_moveCardToHome);
	
	var _fieldThemesSet = __webpack_require__(82);
	
	var _fieldThemesSet2 = _interopRequireDefault(_fieldThemesSet);
	
	__webpack_require__(83);
	
	__webpack_require__(84);
	
	__webpack_require__(85);
	
	__webpack_require__(86);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	// styles DOM
	_event2.default.listen('removeEl', function (data) {
	
		var _elDomElement = _share2.default.get('domElement:' + data.id);
	
		try {
			_elDomElement.remove();
	
			_share2.default.delete('domElement:' + data.id);
		} catch (e) {
			console.warn('Dom element for', data.id, 'not found');
		}
	});
	
	var triggerMouseEvent = function triggerMouseEvent(node, eventType) {
		var clickEvent = document.createEvent('MouseEvents');
		clickEvent.initEvent(eventType, true, true);
		node.dispatchEvent(clickEvent);
	};
	
	_event2.default.listen('clickCard', function (card) {
	
		var _elDomElement = _share2.default.get('domElement:' + card.id);
	
		triggerMouseEvent(_elDomElement.el, 'mousedown');
	});
	
	_event2.default.listen('showCard', function (target) {
		(0, _elRender2.default)(target).show();
	});
	
	_event2.default.listen('hideCard', function (target) {
		(0, _elRender2.default)(target).hide();
	});

/***/ },
/* 73 */
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
	
	var _elClass = __webpack_require__(74);
	
	var _elClass2 = _interopRequireDefault(_elClass);
	
	var _allElClass = __webpack_require__(75);
	
	var _allElClass2 = _interopRequireDefault(_allElClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_share2.default.set('animatedElements', 0);
	_share2.default.set('animatedElementsStack', []);
	_share2.default.set('animatedCallback', function (e) {
		return null;
	});
	
	var _allEl = function _allEl(data) {
	
		if (!data) {
			throw new Error('elRender:empty arguments.');
		}
	
		if (typeof data == 'string') {
	
			try {
	
				if (data[0] == '#') {
	
					var _element = document.getElementById(data.slice(1, Infinity));
	
					return new _elClass2.default(_element);
				} else if (data[0] == '.') {
	
					var _elements = document.getElementsByClassName(data.slice(1, Infinity));
	
					return new _allElClass2.default(_elements);
				} else if (data[0] == '<') {
	
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
	
	// TODO
	_allEl.stopAnimations = function (e) {
	
		// console.log('STOP ANIMATIONS');
	
		// if(!share.get('animation')) {
		// 	return;
		// }
	
		// return;
		_event2.default.dispatch('clearCallbacks');
	
		_allEl('.animated').stop().css({
			"transition": false
		}).removeClass('animated');
	};
	
	_event2.default.listen('stopAnimations', _allEl.stopAnimations);
	
	exports.default = _allEl;

/***/ },
/* 74 */
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
	 * stop
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
				this.el = null;
			}
	
			this._animationCallbacks = [];
			this._animationIndex = 0;
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
	
					return _classes.indexOf(className) >= 0;
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
						"display": 'none'
					});
				} catch (e) {}
			}
		}, {
			key: 'show',
			value: function show() {
				try {
					return this.css({
						"display": 'block'
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
	
					if (typeof el == 'undefined') {
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
	
				var _animation = _share2.default.get('animation');
	
				typeof animationTime == 'undefined' && (animationTime = _share2.default.get('animationTime'));
				typeof animationTime == 'function' && (callback = animationTime, animationTime = _share2.default.get('animationTime'));
				typeof callback == 'string' && (animationName = callback, callback = null);
	
				animationName = animationName ? animationName : 'animation_' + this._animationIndex;
	
				this._animationCallbacks[animationName] = callback;
				this._animationIndex += 1;
	
				var counter = 0;
	
				var reType = function reType(data) {
					// )===
	
					var _e = data + '';
	
					var _px = _e.split('px');
					if (_px.length == 2) {
						return (_px[0] | 0) + 'px';
					}
	
					return data;
				};
	
				var noPX = function noPX(data) {
	
					var _int = parseInt(data);
	
					if (_int.toString() != "NaN") {
						return _int | 0;
					}
	
					return false;
				};
	
				// console.log('Animation, mode:', _animation ? 'ON' : 'OFF', this.el.id);
	
				/*
	    * Animation On
	    */
	
				if (_animation) {
	
					try {
						setTimeout(function (e) {
	
							// TODO
							var top = params.top ? Math.abs(noPX(params.top) - noPX(_this.el.style.top)) : 0;
							var left = params.left ? Math.abs(noPX(params.left) - noPX(_this.el.style.left)) : 0;
	
							var distance = Math.sqrt(function (e) {
								return e * e;
							}(left) + function (e) {
								return e * e;
							}(top)) | 0;
	
							if (distance > 100) {
								animationTime = animationTime + animationTime * (distance / 100) / 5;
								// console.log('New animationTime: from', defaults.animationTime, 'to', animationTime, 'for', distance + 'px');
							}
	
							_this.css({
								"transition": animationTime / 1000 + 's'
							});
	
							for (var attrName in params) {
	
								if (reType(_this.el.style[attrName]) != reType(params[attrName])) {
									counter += 1;
								}
								_this.el.style[attrName] = params[attrName];
							}
	
							// console.log('### animation changes', this.el.id, counter);
	
							_this.addClass('animated');
	
							_this.el.addEventListener('transitionend', function (e) {
	
								// console.log('### transitionend:', this.el.id, counter);
	
								counter -= 1;
	
								// event.dispatch('animationEnd', this);
	
								if (!counter) {
	
									_this.removeClass('animated');
	
									_this.css({
										"transition": null
									});
	
									if (typeof _this._animationCallbacks[animationName] == 'function') {
										_this._animationCallbacks[animationName]();
										_this._animationCallbacks[animationName] = null;
									}
	
									_event2.default.dispatch('allAnimationsEnd', animationName);
								}
							}, false);
						}, 0);
					} catch (e) {}
	
					/*
	     * Animation Off
	     */
				} else {
					try {
	
						for (var attrName in params) {
	
							if (reType(this.el.style[attrName]) != reType(params[attrName])) {
								counter += 1;
							}
							this.el.style[attrName] = params[attrName];
						}
	
						if (typeof this._animationCallbacks[animationName] == 'function') {
							this._animationCallbacks[animationName]();
							this._animationCallbacks[animationName] = null;
						}
	
						_event2.default.dispatch('allAnimationsEnd', animationName);
					} catch (e) {}
				}
			}
		}, {
			key: 'stop',
			value: function stop() {
				this._animationCallbacks = [];
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
				if (typeof this.el[eventName] == 'function') {
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
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _elClass = __webpack_require__(74);
	
	var _elClass2 = _interopRequireDefault(_elClass);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	/*
	 * attr
	 * toggleClass
	 * addClass
	 * removeClass
	 * css
	 * hide
	 * show
	 * animate
	 * stop
	 * remove
	 */
	
	var allElClass = function () {
		function allElClass(elements) {
			_classCallCheck(this, allElClass);
	
			this.elements = [];
	
			for (var i in elements) {
				this.elements.push(new _elClass2.default(elements[i]));
			}
		}
	
		_createClass(allElClass, [{
			key: 'attr',
			value: function attr(attributes) {
	
				for (var i in this.elements) {
					this.elements[i].attr(attributes);
				}
	
				return this;
			}
		}, {
			key: 'toggleClass',
			value: function toggleClass(className) {
	
				for (var i in this.elements) {
					this.elements[i].toggleClass(className);
				}
	
				return this;
			}
		}, {
			key: 'addClass',
			value: function addClass(className) {
	
				for (var i in this.elements) {
					this.elements[i].addClass(className);
				}
	
				return this;
			}
		}, {
			key: 'removeClass',
			value: function removeClass(className) {
	
				for (var i in this.elements) {
					this.elements[i].removeClass(className);
				}
	
				return this;
			}
		}, {
			key: 'css',
			value: function css(a) {
	
				for (var i in this.elements) {
					this.elements[i].css(a);
				}
	
				return this;
			}
		}, {
			key: 'hide',
			value: function hide() {
	
				for (var i in this.elements) {
					this.elements[i].hide();
				}
	
				return this;
			}
		}, {
			key: 'show',
			value: function show() {
	
				for (var i in this.elements) {
					this.elements[i].show();
				}
	
				return this;
			}
		}, {
			key: 'animate',
			value: function animate(params, animationTime, callback, animationName) {
	
				typeof animationTime == 'undefined' && (animationTime = share.get('animationTime'));
				typeof animationTime == 'function' && (callback = animationTime, animationTime = share.get('animationTime'));
				typeof callback == 'string' && (animationName = callback, callback = null);
	
				var counter = 0;
	
				for (var i in this.elements) {
	
					counter += 1;
	
					this.elements[i].animate(params, animationTime, function () {
	
						counter -= 1;
	
						if (counter == 0) {
							callback();
						}
					});
				}
	
				return this;
			}
		}, {
			key: 'stop',
			value: function stop() {
	
				for (var i in this.elements) {
					this.elements[i].stop();
				}
	
				return this;
			}
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
/* 76 */
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
	
	var _elRender = __webpack_require__(73);
	
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
/* 77 */
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
	
	var _elRender = __webpack_require__(73);
	
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
	
	_event2.default.listen('addDeckEl', function (data) {
	
		applyChangedParameters(data);
	
		var _deckDomElement = (0, _elRender2.default)('<div>');
	
		var _params = {
			"transform": 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"width": _defaults2.default.card.width + 'px',
			"height": _defaults2.default.card.height + 'px',
			"left": data.params.x + 'px',
			"top": data.params.y + 'px',
			"display": data.deck.visible ? 'block' : 'none'
		};
	
		(0, _elRender2.default)(_deckDomElement).css(_params).addClass('el').attr({
			"id": data.deck.id
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
	
	_event2.default.listen('redrawDeckIndexes', function (data) {
	
		if (!data || !data.cards) {
			return;
		}
	
		for (var i in data.cards) {
	
			var _cardDomElement = _share2.default.get('domElement:' + data.cards[i].id);
	
			_cardDomElement.css({
				"z-index": (_defaults2.default.startZIndex | 0) + (i | 0)
			});
		}
	});
	
	_event2.default.listen('redrawDeck', function (data) {
	
		if (_share2.default.get('noRedraw')) {
			return false;
		};
	
		if (data && data.deckData && data.deck && data.params) {
			applyChangedParameters(data);
		}
	
		// перерисовка стопки
		var _params = {
			"transform": 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"left": data.params.x + 'px',
			"top": data.params.y + 'px',
			"display": data.deck.visible ? 'block' : 'none'
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
	
		// перерисовка карт
		for (var _i in data.cards) {
	
			var _card_position = data.deck.padding(_i);
			var _zIndex = (data.params.startZIndex | 0) + (_i | 0);
	
			var _params2 = {
				"-ms-transform": 'rotate(' + (data.params.rotate | 0) + 'deg)',
				"-webkit-transform": 'rotate(' + (data.params.rotate | 0) + 'deg)',
				"-moz-transform": 'rotate(' + (data.params.rotate | 0) + 'deg)',
				"transform": 'rotate(' + (data.params.rotate | 0) + 'deg)',
				"left": _card_position.x + 'px',
				"top": _card_position.y + 'px',
				"z-index": _zIndex,
				"display": data.deck.visible && data.cards[_i].visible ? 'block' : 'none'
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
/* 78 */
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
	
	var _elRender = __webpack_require__(73);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * addCardEl
	 * toggleMarkCard
	 * markCard
	 * unmarkCard
	 * unflipCard
	 */
	
	_event2.default.listen('addCardEl', function (data) {
	
		var _params = {
			"width": _defaults2.default.card.width + 'px',
			"height": _defaults2.default.card.height + 'px'
		};
	
		var _domElement = (0, _elRender2.default)('<div>');
	
		(0, _elRender2.default)(_domElement).addClass('el card draggable ' + data.name).css(_params).attr({
			"id": data.id
			// "title" : data.id
		});
	
		_share2.default.set('domElement:' + data.id, _domElement);
	
		var _fieldDomElement = _share2.default.get('domElement:field');
	
		(0, _elRender2.default)(_fieldDomElement).append(_domElement);
	});
	
	_event2.default.listen('toggleMarkCard', function (data) {
	
		var el = _share2.default.get('domElement:' + data.card.id);
	
		if (el && !el.hasClass('flip')) {
	
			var cardIsMarked = null;
	
			if (el.hasClass('marker')) {
	
				cardIsMarked = false;
	
				el.removeClass('marker');
			} else {
	
				cardIsMarked = true;
	
				el.addClass('marker');
			}
	
			if (typeof data.callback == "function") {
				data.callback(cardIsMarked);
			}
		}
	});
	
	_event2.default.listen('markCard', function (data) {
	
		var el = _share2.default.get('domElement:' + data.card.id);
	
		if (el) {
			el.removeClass('marker');
		}
	});
	
	_event2.default.listen('unmarkCard', function (data) {
	
		var el = _share2.default.get('domElement:' + data.card.id);
	
		if (el && !el.hasClass('flip')) {
			el.removeClass('marker');
		}
	});
	
	_event2.default.listen('unflipCard', function (card) {
	
		var el = _share2.default.get('domElement:' + card.id);
	
		if (el && el.hasClass('flip')) {
			el.removeClass('flip');
		}
	});
	
	// event.listen('redrawCardFlip', card => {
	
	// 	let el = share.get('domElement:' + card.id);
	
	// 	if(card.flip) {
	// 		el.addClass('flip');
	// 	} else {
	// 		el.removeClass('flip');
	// 	}
	// });

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _elRender = __webpack_require__(73);
	
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
/* 80 */
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
	
	var _elRender = __webpack_require__(73);
	
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
	
		// console.log('moveDragDeck', data);
		// let _debugMoveDeck = data.moveDeck.map(e => e.card.name).join(',');
	
		_common2.default.curLock();
	
		var _lastIndex = data.moveDeck.length - 1;
	
		var _loop = function _loop(i) {
	
			var _position = data.destination.padding(data.destination.cardsCount() - data.moveDeck.length + (i | 0), true);
			_position.random = Math.random();
	
			var departureAngle = angleValidate(data.departure.rotate),
			    destinationAngle = angleValidate(data.destination.rotate);
	
			var _cardDomElement = _share2.default.get('domElement:' + data.moveDeck[i].card.id);
	
			(0, _elRender2.default)(_cardDomElement).css({
				"transform": 'rotate(' + departureAngle + 'deg)'
			});
	
			if (departureAngle - destinationAngle > 180) {
	
				departureAngle = departureAngle - 360;
				(0, _elRender2.default)(_cardDomElement).css({
					"transform": 'rotate(' + departureAngle + 'deg)'
				});
			};
	
			if (departureAngle - destinationAngle < -180) {
				destinationAngle -= 360;
			}
	
			var _params = {
				"transform": 'rotate(' + destinationAngle + 'deg)',
				"left": _position.x + 'px',
				"top": _position.y + 'px'
			};
	
			var _zIndex = (_defaults2.default.topZIndex | 0) + (i | 0);
	
			var _last = i == _lastIndex;
			// let _callback = function(data, _last) {
			var _callback = function _callback(e) {
	
				// console.log('### moveDragDeck:_callback', i);
	
				// если при раздаче (dealAction) первой стопкой для раздачи
				// оказывается спопка из которой сделан ход, перерисовка ломает анимацию
				// data.departure  .Redraw();
				data.destination.Redraw();
	
				if (_last && typeof data.callback == 'function') {
	
					_common2.default.curUnLock();
	
					data.callback();
				}
	
				_event2.default.dispatch('moveDragDeckDone', {
					"deck": data.destination
				});
				// }.bind(null, data, i == _lastIndex);
			};
	
			// event.once('clearCallbacks', e => {
			// 	_callback = e => {};
			// });
	
			(0, _elRender2.default)(_cardDomElement).css({
				"z-index": _zIndex
			}).animate(_params, _callback);
		};
	
		for (var i in data.moveDeck) {
			_loop(i);
		}
	});
	
	_event2.default.listen('moveDragDeckDone', function (data) {
	
		if (!data.deck.full) {
			return;
		}
	
		var _deck = data.deck.cards;
	
		for (var i in _deck) {
	
			var _cardDomElement2 = _share2.default.get('domElement:' + _deck[i].id);
	
			(0, _elRender2.default)(_cardDomElement2).addClass('full');
		}
	});
	
	_event2.default.listen('dragDeck', function (data) {
		// {x, y, dragDeck, startCursor, deck}
	
		for (var i in data.dragDeck) {
	
			var _zoom = _share2.default.get('zoom');
	
			var _position = data.deck.padding(data.dragDeck[i].index);
	
			var _params = {
				"left": _position.x + (data.x - data.startCursor.x) / _zoom + 'px',
				"top": _position.y + (data.y - data.startCursor.y) / _zoom + 'px',
				"z-index": _defaults2.default.topZIndex + (i | 0)
			};
	
			// Operations with DOM
			var _cardDomElement3 = _share2.default.get('domElement:' + data.dragDeck[i].card.id);
	
			(0, _elRender2.default)(_cardDomElement3).css(_params);
		}
	});

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _event = __webpack_require__(2);
	
	var _event2 = _interopRequireDefault(_event);
	
	var _share = __webpack_require__(1);
	
	var _share2 = _interopRequireDefault(_share);
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _elRender = __webpack_require__(73);
	
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
				"left": _position.x + 'px',
				"top": _position.y + 'px'
			};
	
			var _cardDomElement = _share2.default.get('domElement:' + data.moveDeck[i].card.id);
	
			(0, _elRender2.default)(_cardDomElement).animate(_params, function (e) {
	
				_common2.default.curUnLock();
	
				if (data.departure) {
					data.departure.Redraw();
				}
	
				if (typeof data.callback == 'function') {
					data.callback();
				}
			}, 'moveCardToHomeAnimation');
		}
	});

/***/ },
/* 82 */
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
	
	var _elRender = __webpack_require__(73);
	
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
/* 83 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 84 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 85 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 86 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 87 */
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
	
	var _winCheckRules = __webpack_require__(88);
	
	var _winCheckRules2 = _interopRequireDefault(_winCheckRules);
	
	var _deck = __webpack_require__(14);
	
	var _deck2 = _interopRequireDefault(_deck);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var winCheck = function winCheck(params) {
	
		var rulesCorrect = true;
		var hasRules = false;
	
		var winCheck = _share2.default.get('winCheck');
	
		if (!winCheck) {
			return false;
		}
	
		winCheck = winCheck.rules ? winCheck.rules : winCheck;
	
		for (var ruleName in winCheck) {
	
			hasRules = true;
	
			// winCheck - Object
			if (typeof ruleName == "string" && winCheck[ruleName]) {
				rulesCorrect = rulesCorrect && _winCheckRules2.default[ruleName]({
					"decks": _deck2.default.getDecks({
						"visible": true
					}),
					"rulesArgs": winCheck[ruleName]
				});
	
				// winCheck - Array of string
			} else if (typeof ruleName == "number" && winCheck[winCheck[ruleName]]) {
				rulesCorrect = rulesCorrect && _winCheckRules2.default[ruleName]({
					"decks": _deck2.default.getDecks({
						"visible": true
					})
				});
			} else {
				rulesCorrect = rulesCorrect && _winCheckRules2.default.newerWin();
			}
		}
	
		if (!hasRules) {
			rulesCorrect = rulesCorrect && _winCheckRules2.default.newerWin();
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
	
	_event2.default.listen('winCheck', winCheck);
	
	// hidden check
	var hwinCheck = function hwinCheck(params) {
	
		if (!params) {
			params = {};
		}
	
		if (typeof params.show == 'undefined') {
			params.show = false;
		}
	
		winCheck(params);
	};
	
	exports.default = {
		"winCheck": winCheck,
		"hwinCheck": hwinCheck
	};

/***/ },
/* 88 */
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
		"group": function group(data) {
			// string | Array of string
	
			if (!data.filter || !data.filterArgs) {
				return false;
			}
	
			var decksLength = 0;
			var decks = {};
	
			for (var _deckName in data.decks) {
	
				if (typeof data.filterArgs == 'string' && data.decks[_deckName].parent == data.filterArgs || data.filterArgs.length && data.filterArgs.indexOf(data.decks[_deckName].parent) >= 0) {
					decksLength += 1;
					decks[_deckName] = data.decks[_deckName];
				}
			}
	
			data.decks = decks;
	
			return decksLength;
		},
	
		"groups": function groups(data) {
			return winCheckRules.group(data);
		},
	
		// by Tag
		"select": function select(data) {
			// string
	
			if (!data.filter || !data.filterArgs) {
				return false;
			}
	
			var decksLength = 0;
			var decks = {};
	
			for (var _deckName2 in data.decks) {
				if (data.decks[_deckName2].tags.indexOf(data.filterArgs) >= 0) {
					decksLength += 1;
					decks[_deckName2] = deck;
				}
			}
	
			data.decks = decks;
	
			return decksLength;
		},
	
		"deck": function deck(data) {
	
			if (!data.filter || !data.filterArgs) {
				return false;
			}
	
			var decksLength = 0;
			var decks = {};
	
			for (var _deckName3 in data.decks) {
				if (typeof data.filterArgs == 'string' && data.decks[_deckName3].name == data.filterArgs || data.filterArgs.indexOf(data.decks[_deckName3].name) >= 0) {
					decksLength += 1;
					decks[_deckName3] = data.decks[_deckName3];
				}
			}
	
			data.decks = decks;
	
			return decksLength;
		},
	
		"decks": function decks(data) {
			return winCheckRules.deck(data);
		},
	
		// Tag filters
	
		"firstEmpty": function firstEmpty(data) {
	
			var decks = {};
			var decksLength = 0;
	
			for (var _deckName4 in data.decks) {
				if (data.decks[_deckName4].tags.indexOf('last') >= 0) {
					decksLength += 1;
					decks[_deckName4] = data.decks[_deckName4];
				}
			}
	
			data.decks = decks;
	
			return decksLength;
		},
	
		// Internal use
	
		"_asc_desk": function _asc_desk(data) {
	
			if (!data || typeof data.asc_desk != 'number') {
				return false;
			}
	
			var correct = true;
	
			for (var _deckName5 in data.decks) {
	
				if (!correct) {
					return false;
				}
	
				var cards = data.decks[_deckName5].cards;
	
				for (var cardIndex in cards) {
					if (cardIndex > 0) {
	
						var down = _common2.default.validateCardName(cards[(cardIndex | 0) - 1].name),
						    up = _common2.default.validateCardName(cards[cardIndex | 0].name);
	
						var cardsRankS = _defaults2.default.card.ranks;
	
						correct = correct && down && up && cardsRankS.indexOf(down.rank) == cardsRankS.indexOf(up.rank) + data.asc_desk;
					}
				}
			}
	
			return correct;
		},
	
		// Simple rules
	
		"newerWin": function newerWin(data) {
	
			console.warn('You use "newerWin" rule for checking Win. Maybe arguments in "winCheck.rule" have incorrect rule name.');
			// throw new Error('Newer win');
			return false;
		},
	
		// все колоды пусты
		"allEmpty": function allEmpty(data) {
	
			var correct = true;
	
			for (var _deckName6 in data.decks) {
				correct = correct && data.decks[_deckName6].cards.length == 0;
			}
	
			return correct;
		},
	
		"empty": function empty(data) {
			return winCheckRules.allEmpty(data);
		},
	
		// Combined rules (use like filter)
	
		// все карты в одной колоде
		"allInOne": function allInOne(data) {
	
			var emptyDecksCount = 0,
			    decksLength = 0,
			    fillIndex = 0;
	
			for (var _deckName7 in data.decks) {
				if (data.decks[_deckName7].cards.length == 0) {
					emptyDecksCount += 1;
				} else {
					fillIndex = _deckName7;
				}
				decksLength += 1;
			}
	
			var correct = emptyDecksCount == decksLength - 1;
	
			if (data.filter && correct) {
				var decks = {};
				decks[deckName] = data.decks[deckName];
				data.decks = decks;
			}
	
			return correct;
		},
	
		// step by step 1, 2, 3
		// во всех колодах карты по возрастанию
		"allAscend": function allAscend(data) {
	
			data.asc_desk = -1;
	
			return winCheckRules._asc_desk(data);
		},
	
		// step by step 3, 2, 1
		// во всех колодах карты по убыванию
		"allDescent": function allDescent(data) {
	
			data.asc_desk = 1;
	
			return winCheckRules._asc_desk(data);
		},
	
		"topKing": function topKing(data) {
	
			for (var _deckName8 in data.decks) {
	
				var _deck = data.decks[_deckName8];
	
				var topCard = _deck.getTopCard();
	
				var topCardRank = _common2.default.validateCardName(topCard.name).rank;
	
				if (typeof topCardRank != 'undefined' && topCardRank != _defaults2.default.card.ranks[_defaults2.default.card.ranks.length - 1]) {
					return false;
				}
			}
	
			return true;
		},
	
		"topAce": function topAce(data) {
	
			for (var _deckName9 in data.decks) {
	
				var _deck2 = data.decks[_deckName9];
	
				var topCard = _deck2.getTopCard();
	
				var topCardRank = _common2.default.validateCardName(topCard.name).rank;
	
				if (typeof topCardRank != 'undefined' && topCardRank != _defaults2.default.card.ranks[0]) {
					return false;
				}
			}
	
			return true;
		},
	
		// Composite rules (input arguments)
	
		// комбинированное правило
		"query": function query(data) {
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
	
				// TODO 
				for (var _deckName10 in data.decks) {
					_decksClone[_deckName10] = data.decks[_deckName10];
				}
	
				var queryData = {
					// filters : data[next].filters,
					// rules   : data[next].rules,
					decks: _decksClone
				};
	
				// применяем фильтры, оставляем только интересующие колоды
				if (_correct && data.rulesArgs[next].filters) {
	
					queryData.filter = true;
	
					// пробегаемся по фильтрам
					for (var i in data.rulesArgs[next].filters) {
	
						// фильтр - строковый параметр
						if (typeof data.rulesArgs[next].filters[i] == 'string' && winCheckRules[data.rulesArgs[next].filters[i]]) {
	
							queryData.filterArgs = null;
							_correct = _correct && winCheckRules[data.rulesArgs[next].filters[i]](queryData);
						} else {
	
							// фильтр - обьект
							if (data.rulesArgs[next].filters[i] && data.rulesArgs[next].filters[i].toString() == '[object Object]') {
	
								for (var filterName in data.rulesArgs[next].filters[i]) {
	
									if (winCheckRules[filterName]) {
	
										queryData.filterArgs = data.rulesArgs[next].filters[i][filterName];
	
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
	
					for (var _i in data.rulesArgs[next].rules) {
						if (winCheckRules[data.rulesArgs[next].rules[_i]]) {
							_correct = _correct && winCheckRules[data.rulesArgs[next].rules[_i]](queryData);
						} else {
							_correct = _correct && winCheckRules.newerWin();
						}
					}
				}
			}
	
			return _correct;
		},
	
		"lego": function lego(data) {
			return winCheckRules.query(data);
		}
	};
	
	exports.default = winCheckRules;

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	
	var _defaults = __webpack_require__(3);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * shuffleArray
	 * genType
	 * genTypes
	 */
	
	var shuffleArray = function shuffleArray(deck) {
		for (var j, x, _i = deck.length; _i; j = Math.floor(Math.random() * _i), x = deck[--_i], deck[_i] = deck[j], deck[j] = x) {};
	};
	
	var genType = function genType(_cardsColors, _cardsRanks) {
	
		var _deck = [];
	
		for (var cardColorIndex in _cardsColors) {
	
			var cardColor = _cardsColors[cardColorIndex];
	
			for (var cardRankIndex in _cardsRanks) {
	
				var cardRank = _cardsRanks[cardRankIndex];
	
				_deck.push(cardColor + cardRank);
			}
		}
	
		return _deck;
	};
	
	var genTypes = {
	
		"all": function all(ranks) {
			return genType(_defaults2.default.card.suits, ranks);
		},
	
		"black": function black(ranks) {
	
			var _cardsSuits = _defaults2.default.card.colors.black;
	
			return genType(_cardsSuits, ranks);
		},
	
		"red": function red(ranks) {
	
			var _cardsSuits = _defaults2.default.card.colors.red;
	
			return genType(_cardsSuits, ranks);
		},
	
		"black_and_red": function black_and_red(ranks) {
	
			var _cardsSuits = [_defaults2.default.card.colors.red[Math.random() * _defaults2.default.card.colors.red.length | 0], _defaults2.default.card.colors.black[Math.random() * _defaults2.default.card.colors.black.length | 0]];
	
			return genType(_cardsSuits, ranks);
		},
	
		"h_only": function h_only(ranks) {
	
			var _cardsSuits = ['h'];
	
			return genType(_cardsSuits, ranks);
		},
	
		"d_only": function d_only(ranks) {
	
			var _cardsSuits = ['d'];
	
			return genType(_cardsSuits, ranks);
		},
	
		"c_only": function c_only(ranks) {
	
			var _cardsSuits = ['c'];
	
			return genType(_cardsSuits, ranks);
		},
	
		"s_only": function s_only(ranks) {
	
			var _cardsSuits = ['s'];
	
			return genType(_cardsSuits, ranks);
		},
	
		"one_rank_only": function one_rank_only(ranks) {
	
			var _cardsSuits = [_defaults2.default.card.solors[Math.random() * _defaults2.default.card.solors.length | 0]];
	
			return genType(_cardsSuits, ranks);
		},
	
		"hearts": function hearts(ranks) {
			return genTypes.h_only();
		},
	
		"diamonds": function diamonds(ranks) {
			return genTypes.d_only();
		},
	
		"clubs": function clubs(ranks) {
			return genTypes.c_only();
		},
	
		"spades": function spades(ranks) {
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
				if (_defaults2.default.card.rank.indexOf(data.ranks[i].toString()) >= 0) {
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
/* 90 */
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
	
	var _common = __webpack_require__(5);
	
	var _common2 = _interopRequireDefault(_common);
	
	var _field = __webpack_require__(12);
	
	var _field2 = _interopRequireDefault(_field);
	
	var _deckGenerator = __webpack_require__(89);
	
	var _deckGenerator2 = _interopRequireDefault(_deckGenerator);
	
	var _elRender = __webpack_require__(73);
	
	var _elRender2 = _interopRequireDefault(_elRender);
	
	var _stateManager = __webpack_require__(6);
	
	var _stateManager2 = _interopRequireDefault(_stateManager);
	
	var _history2 = __webpack_require__(25);
	
	var _history3 = _interopRequireDefault(_history2);
	
	var _mapCommon = __webpack_require__(53);
	
	var _mapCommon2 = _interopRequireDefault(_mapCommon);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	document.addEventListener("DOMContentLoaded", function (e) {
	
		// Firebug
	
		if (document.location.hash == '#debug') {
			(function (F, i, r, e, b, u, g, L, I, T, E) {
				if (F.getElementById(b)) {
					return;
				}
				E = F[i + 'NS'] && F.documentElement.namespaceURI;
				E = E ? F[i + 'NS'](E, 'script') : F[i]('script');
				E[r]('id', b);
				E[r]('src', I + g + T);
				E[r](b, u);
				(F[e]('head')[0] || F[e]('body')[0]).appendChild(E);
				E = new Image();
				E[r]('src', I + L);
			})(document, 'createElement', 'setAttribute', 'getElementsByTagName', 'FirebugLite', '4', 'firebug-lite.js', 'releases/lite/latest/skin/xp/sprite.png', 'https://getfirebug.com/', '#startOpened');
		}
	
		// document.body.addEventListener('transitionend', e => {
		// 	console.log('TEST:', e);
		// });
	});
	
	var eachDecksInGroup = function eachDecksInGroup(groupName, callback) {
	
		var group = _common2.default.getElementByName(groupName, 'group');
		var decks = group.getDecks();
	
		for (var deckIndex in decks) {
			if (typeof callback == "function") {
				callback(decks[deckIndex]); // , data ? (decks[deckIndex].name == data.from ? '>' : decks[deckIndex].name == data.to ? '<' : ' ') : null);
			}
		}
	};
	
	var logCardsInDeck = function logCardsInDeck(deck) {
	
		var _log = [deck.name + ': '];
	
		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;
	
		try {
			for (var _iterator = deck.cards[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var card = _step.value;
	
				_log[0] += '%c' + card.name + '%c ';
				_log.push(card.visible ? card.flip ? 'color:blue;text-decoration:underline;' : 'color:blue;' : card.flip ? 'color:grey;text-decoration:underline;' : 'color:grey;');
				_log.push('text-decoration: none;');
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
	
		console.groupCollapsed.apply(console, _log);
		console.log(deck.cards);
		console.groupEnd();
	};
	
	var solitaire_log = function solitaire_log(data) {
	
		console.groupCollapsed('debug log');
	
		var groups = _common2.default.getElementsByType('group');
		for (var i in groups) {
			console.groupCollapsed('Group:', groups[i].name);
			eachDecksInGroup(groups[i].name, logCardsInDeck);
			console.groupEnd();
		}
	
		var decks = _common2.default.getElementsByType('deck', {
			"parent": 'field'
		});
	
		for (var _i in decks) {
			// console.log('Deck:', decks[i].name);
			logCardsInDeck(decks[_i]);
		}
	
		console.groupEnd();
	};
	
	var keys = {
		"c": 67, // clear
		"d": 68, // debug
		"h": 72, // history
		"n": 78, // next
		"s": 83 // stepType
	};
	
	document.onkeyup = function (e) {
	
		if (e.keyCode == keys.d) {
	
			solitaire_log();
		} else if (e.keyCode == keys.n) {
	
			_event2.default.dispatch('next_history_step');
		} else if (e.keyCode == keys.c) {
	
			console.clear();
		} else if (e.keyCode == keys.h) {
	
			// console.log('History:', history.get(false));
			var _history = _history3.default.get(false);
			console.groupCollapsed('debug:history', _history.length);
			console.log('%c' + JSON.stringify(_history, true, 2), 'background: #faede0;');
			console.groupEnd();
		} else if (e.keyCode == keys.s) {
	
			console.log('stepType:', _share2.default.get('stepType'));
		}
	};
	
	exports.default = {
		share: _share2.default,
		defaults: _defaults2.default,
		common: _common2.default,
		field: _field2.default,
		deckGenerator: _deckGenerator2.default,
		elRender: _elRender2.default,
		stateManager: _stateManager2.default,
		history: _history3.default,
		mapCommon: _mapCommon2.default
	};

/***/ }
/******/ ]);
//# sourceMappingURL=SolitaireEngine.js.map