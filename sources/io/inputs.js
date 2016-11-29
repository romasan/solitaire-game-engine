'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';
import common   from 'common';

import Deck     from 'deck';
import Tips     from 'tips';

// -------------------------------------------------------------------------------------------------------------

class inputs {

	constructor() {

		share.set('dragDeck',    null);
		share.set('startCursor', null);

		event.listen('undo', this._inputUndoRedo());
		event.listen('redo', this._inputUndoRedo());

		try {

			document.onmousedown = data => {
				
				if(data.button !== 0) {
					return;
				}
				
				this.take(data.target, data.clientX, data.clientY);
			};

			document.onmousemove = data => {
				this.drag(data.clientX, data.clientY);
			};

			document.onmouseup = data => {
				this.put(data.target, data.clientX, data.clientY);
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

			document.ondblclick = data => {

				event.dispatch('stopAnimations');
				
				this.take(data.target, data.clientX, data.clientY);
				this.put(data.target, data.clientX, data.clientY, true);
				
				common.curUnLock();
			};

			document.addEventListener('touchstart', data => {
				// data.preventDefault()
				this.take(data.target, data.touches[0].clientX, data.touches[0].clientY)
			}, false);

			document.addEventListener('touchmove', data => {

				if(share.startCursor) {
					data.preventDefault();
				}

				this.drag(data.touches[0].clientX, data.touches[0].clientY)
			}, false);

			document.addEventListener('touchend', data => {
				// data.preventDefault()
				this.put(data.changedTouches[0].target, data.changedTouches[0].clientX, data.changedTouches[0].clientY);
			}, false);
		} catch(e) {}
	
	}

	_inputUndoRedo() {

		let _dragDeck = share.get('dragDeck');
		
		if(
			_dragDeck                &&
			_dragDeck[0]             &&
			_dragDeck[0].card        &&
			_dragDeck[0].card.parent
		) {
			
			let _deck = Deck.getDeckById(_dragDeck[0].card.parent)
			
			if(_deck) {
				_deck.Redraw();
			}
		}
		
		share.set('dragDeck',    null);
		share.set('startCursor', null);

		common.curUnLock();
	}

	take(target, x, y) {

		share.set('dragDeck',    null);
		share.set('startCursor', null);

		if(
			common.isCurLock()          ||
			share.get('sessionStarted')
		) {
			return;
		}

		if( target.className.split(' ').indexOf('slot') >= 0 ) {

			let _id   = target.id,
			
			_deck = common.getElementById(_id);
			
			if(_deck) {
				event.dispatch('click', {
					to: _deck
				});
			}
		}

		if( target.className.split(' ').indexOf('draggable') >= 0 ) {

			let _id     = target.id,
			    _card   = _id                   ? common.getElementById(_id) : null,
			    _parent = _card && _card.parent ? _card.parent               : null,
			    _deck   = _parent               ? Deck.getDeckById(_parent)  : null;

			if(_deck) {
				event.dispatch('click', {
					to: _deck
				});
			}
			
			// _deck.runActions();

			// TODO
			// в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются

			let _dragDeck = _deck ? _deck.Take(_id) : null;

			share.set('dragDeck', _dragDeck);

			if(_dragDeck) {

				share.set('startCursor', {x, y});

				// ???
				Tips.tipsDestination({currentCard : _card});
			}
		}
	}

// -------------------------------------------------------------------------------------------------------------

	drag(x, y) {

		if(common.isCurLock()) {
			return;
		}
		
		let _startCursor = share.get('startCursor'),
		    _dragDeck    = share.get('dragDeck');

		if(!_dragDeck || !_startCursor) {
			return;
		}

		// let _distance = _startCursor 
		// 	? Math.sqrt(common.sqr(x - _startCursor.x) + common.sqr(y - _startCursor.y)) 
		// 	: 0;

		// console.log(x - _startCursor.x, y - _startCursor.y);

		let _deck = common.getElementById(_dragDeck[0].card.parent);

		// let _position = _deck.padding(_dragDeck[_dragDeck.length - 1].index);

		event.dispatch('dragDeck', {
			x, y        , 
			_dragDeck   , 
			_startCursor, 
			_deck
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

	put(target, x, y, dbclick) {

		if(common.isCurLock()) {
			return;
		}

		let _startCursor = share.get('startCursor'),// начальная позиция курсора
		    _dragDeck    = share.get('dragDeck');   // 

		if(!_dragDeck || !_startCursor) {
			return;
		}

		let _deck = common.getElementById(_dragDeck[0].card.parent);

		let _position = _deck.padding(_dragDeck[0].index);
		
		let _distance = Math.sqrt(common.sqr(x - _startCursor.x) + common.sqr(y - _startCursor.y));
		// console.log('>>> distance:', _distance, x - _startCursor.x, y - _startCursor.y);

		let cursorMove = {
			distance     : _distance,
			dbclick      : !!dbclick,
			direction    : {
				x     : x - _startCursor.x,// (+) rigth / (-) left
				y     : y - _startCursor.y,// (+) down  / (-) up
				right : x > _startCursor.x,
				left  : x < _startCursor.x,
				down  : y > _startCursor.y,
				up    : y < _startCursor.y
			},
			lastPosition : {x, y},
			deckPosition : {
				x : (_position.x + (x - _startCursor.x)),
				y : (_position.y + (y - _startCursor.y))
			}
		};

		share.set('lastCursorMove', cursorMove, defaults.forceClone);

		event.dispatch('hideCard', target);
		let _dop = document.elementFromPoint(x, y);
		event.dispatch('showCard', target);
		// if(_dop) {

		// Move(_dragDeck, _dop, cursorMove);
		event.dispatch('Move', {
			moveDeck   : _dragDeck,
			to         : _dop.id,
			cursorMove
		});
		// }

		// event.dispatch('redrawDeckIndexes', _deck);

		share.set('dragDeck',    null);
		share.set('startCursor', null);
	}
}

// let _inputs = new inputs();
new inputs();