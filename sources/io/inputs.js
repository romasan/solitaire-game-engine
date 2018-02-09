'use strict';

import share    from '../common/share'   ;
import event    from '../common/event'   ;
import defaults from '../common/defaults';
import common   from '../common'         ;

import Deck     from '../deck'           ;
import Tips     from '../tips'           ;
// import geometry from './geometry';

class inputsClass {

	/**
	 * Create inputs handler
	 */
	constructor() {

		share.set('dragDeck'   , null);
		share.set('startCursor', null);

		try {

			// let field = share.get('domElement:field');
			let lastCoord = null ;
			let lastTime  = null ;
			let breakUp   = false;


			// let isPC = ['Windows', 'Mac', 'Linux'].some(e => window.navigator.platform.indexOf(e) > -1);
			let isMobileOrTablet = (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) ||
				/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0,4))
			);

			// Mouse events

			document.body.addEventListener('mousedown', data => {

				if (data.button !== 0) {
					return;
				}

				let newTime = new Date().getTime();

				// if (
				// 	lastCoord                   &&
				// 	lastCoord.x == data.clientX &&
				// 	lastCoord.y == data.clientY &&
				// 	newTime - lastTime < 500
				// ) {

				// 	breakUp = true;

				// 	return;
				// }

				this.take(data.target, data.clientX, data.clientY);

				lastCoord = {
					"x" : data.clientX,
					"y" : data.clientY
				};

				lastTime = newTime;
			});

			document.body.addEventListener('mousemove', data => {
				this.drag(data.clientX, data.clientY);
				// this.onmove(data.clientX, data.clientY);
			});

			document.body.addEventListener('mouseup', data => {

				if (breakUp) {

					breakUp = false;

					return;
				}

				this.put(data.target, data.clientX, data.clientY);
			});

			document.body.addEventListener('mouseleave', data => {

				breakUp = false;

				this.put(data.target, data.clientX, data.clientY);
			});

			document.body.addEventListener('dblclick', data => {

				// event.dispatch('stopAnimations');

				this.take(data.target, data.clientX, data.clientY);
				this.put (data.target, data.clientX, data.clientY, true);

				common.curUnLock();
			});

			// Touch events

			if (isMobileOrTablet) {

				// TODO vk frame touch
				window.addEventListener('touchstart', data => {

					this.take(data.target, data.touches[0].clientX, data.touches[0].clientY, true);

					if (data.target.className.split(' ').indexOf('card') >= 0) {
						data.preventDefault();
						return false;
					}
				}, {
					"passive" : false
				});

				window.addEventListener('touchmove', data => {

					this.drag(data.touches[0].clientX, data.touches[0].clientY);

					// if (share.get('startCursor')) {
					if (data.target.className.split(' ').indexOf('card') >= 0) {
						data.preventDefault();
						// data.stopPropagation();
						return false;
					}
				}, {
					"passive" : false
				});

				window.addEventListener('touchend', data => {

					this.put(data.changedTouches[0].target, data.changedTouches[0].clientX, data.changedTouches[0].clientY);

					if (data.target.className.split(' ').indexOf('card') >= 0) {
						data.preventDefault();
						return false;
					}
				}, {
					"passive" : false
				});
			}
		} catch (e) {}
	}

	/**
	 * Break inputs
	 */
	_break() {

		let _dragDeck = share.get('dragDeck');

		if (
			_dragDeck                &&
			_dragDeck[0]             &&
			_dragDeck[0].card        &&
			_dragDeck[0].card.parent
		) {

			let _deck = Deck.getDeckById(_dragDeck[0].card.parent);

			if (_deck) {
				_deck.Redraw();
			}
		}

		share.set('dragDeck'   , null);
		share.set('startCursor', null);

		common.curUnLock();
	}

	/**
	 * Take card
	 * @param {EventTarget} target 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {boolean} touch 
	 */
	take(target, x, y, touch) {

		if (touch) {

			let _startCursor = share.get('startCursor'),
			    _dragDeck    = share.get('dragDeck')   ;

			if (_dragDeck || _startCursor) {
				return;
			}
		} else {
			
			share.set('dragDeck'   , null);
			share.set('startCursor', null);
		}

		if (
			common.isCurLock()                                 ||
			document.getElementsByClassName('animated').length || // TODO
			share.get('gameIsWon')                             ||
			share.get('sessionStarted')
		) {
			return;
		}

		event.dispatch('startRunHistory');

		// click empty deck
		if (
			target.className.split(' ').indexOf('slot') >= 0
		) {

			let _id   = target.id                 ,
			    _deck = common.getElementById(_id);

			if (
				share.get('markerMode')      ||
				share.get('specialStepMode')
			) { // break;
				_deck = null;
			}

			if (_deck) {

				event.dispatch('click', {
					"to"     : _deck,
					"toCard" : null
				});

				event.dispatch('click:emptyDeck', {
					"to"     : _deck,
					"toCard" : null
				});
			}
		}

		// click card in deck
		if (
			target.className.split(' ').indexOf('draggable') >= 0
		) {

			let _id     = target.id                                                ,
			    _card   = _id                   ? common.getElementById(_id) : null,
			    _parent = _card && _card.parent ? _card.parent               : null,
				_deck   = _parent               ? Deck.getDeckById(_parent)  : null;
				
			event.dispatch('takeCard', _card);

			// mark card
			if (_deck && share.get('markerMode')) { // break;

				event.dispatch('toggleMarkCard', {
					"card"     : _card,
					"callback" : cardIsMarked => {

						let cardIndex = _deck.getCardIndexById(_card.id);

						let stepData = {};

						stepData[cardIsMarked ? 'markCard' : 'unmarkCard'] = {
							"deckName"  : _deck.name,
							"cardName"  : _card.name,
							"cardIndex" : cardIndex
						};

						// event.dispatch('addStep', stepData);
						event.dispatch('appendToLastStep', stepData);

						event.dispatch('toggleMarkerMode');
					}
				});

				_deck = null;
			}

			if (_deck && share.get('specialStepMode')) { // break;
				event.dispatch('specialStep', {
					"card" : _card,
					"callback" : done => {
						event.dispatch('toggleSpecialStepMode', {
							"done" : done
						});
					}
				});
				_deck = null;
			}

			if (_deck) {

				// event.dispatch('dragStart', {
				// 	"deck" : _deck,
				// 	"card" : _card
				// });

				event.dispatch('click', {
					"to"     : _deck,
					"toCard" : _card
				});

				if (_card.flip) {

					event.dispatch('click:flipCard', {
						"to"     : _deck,
						"toCard" : _card
					});

					// this.put(target, x, y, false);

					if (!defaults.canMoveFlip) {
						return;
					}

				} else {

					event.dispatch('click:unflipCard', {
						"to"     : _deck,
						"toCard" : _card
					});
				}

				// нельзя брать перевёрнутые карты
				if (_card.flip) {
					return;
				}
			}

			// _deck.runActions();

			let _dragDeck = _deck
				? _deck.Take(_id)
				: null;

			share.set('dragDeck', _dragDeck);

			if (_dragDeck) {

				share.set('startCursor', {
					"x" : x,
					"y" : y
				});

				// ???
				Tips.tipsDestination({
					"currentCard" : _card
				});
			}
		}
	}

	/**
	 * Drag card
	 * @param {number} x 
	 * @param {number} y 
	 */
	drag(x, y) {

		if (common.isCurLock()) {
			return;
		}

		let _startCursor = share.get('startCursor'),
		    _dragDeck    = share.get('dragDeck')   ;

		if (!_dragDeck || !_startCursor) {
			return;
		}

		let _distance = _startCursor 
			? Math.sqrt((e => e * e)(x - _startCursor.x) + (e => e * e)(y - _startCursor.y))
			: 0;

		let _deck = common.getElementById(_dragDeck[0].card.parent);

		// let _position = _deck.padding(_dragDeck[_dragDeck.length - 1].index);

		event.dispatch('dragDeck', {
			"x"           : x                ,
			"y"           : y                ,
			"dragDeck"    : _dragDeck        ,
			"startCursor" : _startCursor     ,
			"deck"        : _deck            ,
			"card"        : _dragDeck[0].card,
			"distance"    : _distance
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

	/**
	 * Put card
	 * @param {EventTarget} target 
	 * @param {number} x 
	 * @param {number} y 
	 * @param {boolean} dbclick 
	 */
	put(target, x, y, dbclick) {

		if (common.isCurLock()) {
			return;
		}

		let _startCursor = share.get('startCursor'), // начальная позиция курсора
		    _dragDeck    = share.get('dragDeck')   ;

		if (!_dragDeck || !_startCursor) {
			return;
		}

		let _deck = common.getElementById(_dragDeck[0].card.parent);

		let _position = _deck.padding(_dragDeck[0].index);

		let _distance = Math.sqrt((i => i * i)(x - _startCursor.x) + (i => i * i)(y - _startCursor.y));

		let cursorMove = {
			"distance"  : _distance,
			"dbclick"   : !!dbclick,
			"direction" : {
				"x"     : x - _startCursor.x, // (+) rigth / (-) left
				"y"     : y - _startCursor.y, // (+) down  / (-) up
				"right" : x > _startCursor.x,
				"left"  : x < _startCursor.x,
				"down"  : y > _startCursor.y,
				"up"    : y < _startCursor.y
			},
			"lastPosition" : {
				"x" : x,
				"y" : y
			},
			"deckPosition" : {
				"x" : (_position.x + (x - _startCursor.x)),
				"y" : (_position.y + (y - _startCursor.y))
			}
		};

		if (
			_distance == 0      &&
			_deck.autoUnflipTop
		) {
			_deck.Redraw();
		}

		share.set('lastCursorMove', cursorMove, defaults.forceClone);
		share.set('lastDragDeck', {
			"dragDeckParentId" : _dragDeck[0].card.parent,
			"dragDeck"         : _dragDeck
		}, true); // defaults.forceClone);

		// let _top  = target.style.top;
		// let _left = target.style.left;
		// event.dispatch('hideCard', target);
		if (!dbclick) {
			// target.style.display = 'none';

			// target.style.top  = y + 'px';
			// target.style.left = x + 'px';
		}
		// let _dop = document.elementFromPoint(x, y);
		let _dop = 'field';
		// event.dispatch('showCard', target);
		if (!dbclick) {
			// target.style.display = 'block';

			// target.style.top  = _top;
			// target.style.left = _left;
		}

		// if (_dop && _dop.id) {

		event.dispatch('takeCard', _dragDeck[0]);
		
		event.dispatch('move', {
			"moveDeck"   : _dragDeck                        ,
			"to"         : _dop && _dop.id ? _dop.id : 'mat',
			"cursorMove" : cursorMove
		});
		// }

		// _deck.Redraw();

		share.set('dragDeck'   , null);
		share.set('startCursor', null);
	}
}

let _inputs = null;

event.listen('newGame', e => {
	if (!_inputs) {
		_inputs = new inputsClass();
	}
});

event.listen('inputsBreak', e => {
	if (_inputs) {
		_inputs._break();
	}
});
