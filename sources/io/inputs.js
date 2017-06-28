'use strict';

import share    from 'share'   ;
import event    from 'event'   ;
import defaults from 'defaults';
import common   from 'common'  ;

import Deck     from 'deck'    ;
import Tips     from 'tips'    ;
import geometry from 'geometry';

/*
 * _break
 * take
 * drag
 * put
 */

class inputsClass {

	constructor() {

		share.set('dragDeck'   , null);
		share.set('startCursor', null);

		try {

			// let field = share.get('domElement:field');
			let lastCoord = null ;
			let lastTime  = null ;
			let breakUp   = false;

			// Mouse events

			document.body.addEventListener('mousedown', data => {

				if(data.button !== 0) {
					return;
				}

				let newTime = new Date().getTime();

				// if(
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

				if(breakUp) {

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

			window.addEventListener('touchstart', data => {

				this.take(data.target, data.touches[0].clientX, data.touches[0].clientY);

				if(data.target.className.split(' ').indexOf('card') >= 0) {
					data.preventDefault();
					return false;
				}
			}, {"passive" : false});

			window.addEventListener('touchmove', data => {

				this.drag(data.touches[0].clientX, data.touches[0].clientY);

				// if(share.get('startCursor')) {
				if(data.target.className.split(' ').indexOf('card') >= 0) {
					data.preventDefault();
					// data.stopPropagation();
					return false;
				}
			}, {"passive" : false});

			window.addEventListener('touchend', data => {

				this.put(data.changedTouches[0].target, data.changedTouches[0].clientX, data.changedTouches[0].clientY);

				if(data.target.className.split(' ').indexOf('card') >= 0) {
					data.preventDefault();
					return false;
				}
			}, {"passive" : false});
		} catch(e) {}
	}

	_break() {

		let _dragDeck = share.get('dragDeck');

		if(
			_dragDeck                &&
			_dragDeck[0]             &&
			_dragDeck[0].card        &&
			_dragDeck[0].card.parent
		) {

			let _deck = Deck.getDeckById(_dragDeck[0].card.parent);

			if(_deck) {
				_deck.Redraw();
			}
		}

		share.set('dragDeck'   , null);
		share.set('startCursor', null);

		common.curUnLock();
	}

	take(target, x, y) {

		share.set('dragDeck'   , null);
		share.set('startCursor', null);

		if(
			common.isCurLock()                                 ||
			document.getElementsByClassName('animated').length || // TODO )==
			share.get('gameIsWon')                             ||
			share.get('sessionStarted')
		) {
			return;
		}

		event.dispatch('startRunHistory');

		// click empty deck
		if( target.className.split(' ').indexOf('slot') >= 0 ) {

			let _id   = target.id                 ,
			    _deck = common.getElementById(_id);

			if(
				share.get('markerMode')      ||
				share.get('specialStepMode')
			) { // break;
				_deck = null;
			}

			if(_deck) {

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
		if(
			target.className.split(' ').indexOf('draggable') >= 0
		) {

			let _id     = target.id                                                ,
			    _card   = _id                   ? common.getElementById(_id) : null,
			    _parent = _card && _card.parent ? _card.parent               : null,
			    _deck   = _parent               ? Deck.getDeckById(_parent)  : null;

			// mark card
			if(_deck && share.get('markerMode')) { // break;

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

						event.dispatch('addStep', stepData);

						event.dispatch('toggleMarkerMode');
					}
				});

				_deck = null;
			}

			if(_deck && share.get('specialStepMode')) { // break;
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

			if(_deck) {

				// event.dispatch('dragStart', {
				// 	"deck" : _deck,
				// 	"card" : _card
				// });

				event.dispatch('click', {
					"to"     : _deck,
					"toCard" : _card
				});

				if(_card.flip) {

					event.dispatch('click:flipCard', {
						"to"     : _deck,
						"toCard" : _card
					});

					// this.put(target, x, y, false);

					if(!defaults.canMoveFlip) {
						return;
					}

				} else {

					event.dispatch('click:unflipCard', {
						"to"     : _deck,
						"toCard" : _card
					});
				}

				// нельзя брать перевёрнутые карты
				if(_card.flip) {
					return;
				}
			}

			// _deck.runActions();

			let _dragDeck = _deck ? _deck.Take(_id) : null;

			share.set('dragDeck', _dragDeck);

			if(_dragDeck) {

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

	drag(x, y) {

		if(common.isCurLock()) {
			return;
		}

		let _startCursor = share.get('startCursor'),
		    _dragDeck    = share.get('dragDeck')   ;

		if(!_dragDeck || !_startCursor) {
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

	put(target, x, y, dbclick) {

		if(common.isCurLock()) {
			return;
		}

		let _startCursor = share.get('startCursor'), // начальная позиция курсора
		    _dragDeck    = share.get('dragDeck')   ;

		if(!_dragDeck || !_startCursor) {
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

		if(
			_distance == 0      &&
			_deck.autoUnflipTop
		) {
			_deck.Redraw();
		}

		share.set('lastCursorMove', cursorMove, defaults.forceClone);
		share.set('lastDragDeck', {
			"dragDeckParentId" : _dragDeck[0].card.parent,
			"dragDeck"         : _dragDeck
		}, defaults.forceClone);

		// let _top  = target.style.top;
		// let _left = target.style.left;
		// event.dispatch('hideCard', target);
		if(!dbclick) {
			// target.style.display = 'none';

			// target.style.top  = y + 'px';
			// target.style.left = x + 'px';
		}
		// let _dop = document.elementFromPoint(x, y);
		let _dop = 'field';
		// event.dispatch('showCard', target);
		if(!dbclick) {
			// target.style.display = 'block';

			// target.style.top  = _top;
			// target.style.left = _left;
		}

		// if(_dop && _dop.id) {
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

	// onmove(x, y) {

	// 	let _dop = document.elementFromPoint(x, y);

	// 	if(_dop.className.split(' ').indexOf('card') >= 0) {

	// 		event.dispatch('moveOnCard', _dop.className.split(' ').indexOf('card') >= 0
	// 			? {
	// 				"flip" : _dop.className.split(' ').indexOf('flip') >= 0,
	// 				"id"   : _dop.id
	// 			}
	// 			: null
	// 		);
	// 	}
	// }
}

let _inputs = null;

event.listen('newGame', e => {
	if(!_inputs) {
		_inputs = new inputsClass();
	}
})

event.listen('inputsBreak', e => {
	if(_inputs) {
		_inputs._break();
	}
});
