'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';
import common   from 'SolitaireCommon';

import Deck     from 'addDeck';
import Tips     from 'Tips';
import Move     from 'Move';
import _el      from 'elRender';

// пусть будет
Math.sqr = function(i) {
	return i * i;
}

// var drag_el = null;
share.set('dragDeck',    null);
share.set('startCursor', null);

event.listen('undo', function() {
	/*share.moveCardToHome(
		share.dragDeck, 
		main.getDeckById(share.dragDeck[0].card.parent)
	);*/
	if(share.get('dragDeck')) {
		common.getDeckById(share.dragDeck[0].card.parent).Redraw();
	}
	share.set('dragDeck',    null);
	share.set('startCursor', null);
});

event.listen('redo', function() {
	/*share.moveCardToHome(
		share.dragDeck, 
		main.getDeckById(share.dragDeck[0].card.parent)
	);*/
	if(share.get('dragDeck')) {
		common.getDeckById(_dragDeck[0].card.parent).Redraw();
	}
	share.set('dragDeck',    null);
	share.set('startCursor', null);
});

// -------------------------------------------------------------------------------------------------------------

var cdown = function(target, x, y) {

    var _startCursor = share.get('startCursor'),
        _dragDeck    = share.get('dragDeck');
    
    if(common.isCurLock()) return;

    try {
        $('.draggable').finish();
    } catch(e) {
        console.warn(e);
    }

    if(_dragDeck || _startCursor) return;
        
    if( target.className.split(' ').indexOf('slot') >= 0 ) {
        
        var _id   = target.id,
            _deck = common.getElementById(_id);
        _deck.runActions();
    }
    
    if( target.className.split(' ').indexOf('draggable') >= 0 ) {

        
        var _id     = target.id,
            _card   = _id                   ? common.getElementById(_id) : null,
            _parent = _card && _card.parent ? _card.parent               : null,
            _deck   = _parent               ? Deck.getDeckById(_parent)  : null;
        
        
        // console.log('card from deck:', _deck);
        
        _deck.runActions();
        
        // TODO
        // в данной ситуации обрабатывается только клик по карте, пустые колоды никак не обрабатываются
        
        // console.log(_id, _card, _parent, _deck, main.getElements())
        
        var _dragDeck = _deck ? _deck.Take(_id) : null;

        // console.log('CDOWN', _id, _deck, _deck.Take(_id));
        // console.log('_dragDeck', _dragDeck);
		
        share.set('dragDeck', _dragDeck);
		
		// console.log(share.dragDeck);
    
        if(share.get('dragDeck')) {

        	share.set('startCursor', {
            	x : x,
            	y : y
	        });

        	// ???
	        Tips.tipsDestination({currentCard : _card});
	    }
    }

}

// -------------------------------------------------------------------------------------------------------------

var cmove = function(x, y) {

    var _startCursor = share.get('startCursor'),
    	_dragDeck    = share.get('dragDeck');
    
    if(!_dragDeck || !_startCursor) return;

	var _distance = _startCursor 
		? Math.sqrt(Math.sqr(x - _startCursor.x) + Math.sqr(y - _startCursor.y)) 
		: 0;

	var _deck = common.getElementById(_dragDeck[0].card.parent);
    for(var i in _dragDeck) {
    	var _position = _deck.padding(_dragDeck[i].index);
    	var _params = {
    		'left'    : (_position.x * share.get('zoom') + (x - _startCursor.x)) + 'px',
    		'top'     : (_position.y * share.get('zoom') + (y - _startCursor.y)) + 'px',
    		// transform : 'rotate(0deg)',
    		'z-index' : defaults.topZIndex + (i|0)
    	}
    	// Operations with DOM
        _el(_dragDeck[i].card.domElement)
            .css(_params);   
    }

    var cursorMove = {
    	distance     : _distance,
    	direction    : {
	    	x     : x - _startCursor.x,// (+) rigth / (-) left
	    	y     : y - _startCursor.y,// (+) down  / (-) up
	    	right : x > _startCursor.x,
	    	left  : x < _startCursor.x,
	    	down  : y > _startCursor.y,
	    	up    : y < _startCursor.y
    	},
    	lastPosition : {
    		x : x,
    		y : y
    	},
    	deckPosition : {
    		x : (_position.x + (x - _startCursor.x)),
    		y : (_position.y + (y - _startCursor.y))
    	}
    }
    
    Tips.tipsMove({
    	moveDeck   : _dragDeck, 
    	cursorMove : cursorMove
    });

}

// -------------------------------------------------------------------------------------------------------------

var cend = function(target, x, y, dbclick) {

    var _startCursor = share.get('startCursor'),
    	_dragDeck    = share.get('dragDeck');
    
    if(!_dragDeck || !_startCursor) return;

	var _deck = common.getElementById(_dragDeck[0].card.parent);
	var _position = _deck.padding(_dragDeck[0].index);
    var cursorMove = {
        distance     : Math.sqrt(Math.sqr(x - _startCursor.x) + Math.sqr(y - _startCursor.y)),
        dbclick      : dbclick,
        direction    : {
            x     : x - _startCursor.x,// (+) rigth / (-) left
            y     : y - _startCursor.y,// (+) down  / (-) up
            right : x > _startCursor.x,
            left  : x < _startCursor.x,
            down  : y > _startCursor.y,
            up    : y < _startCursor.y
        },
        lastPosition : {
            x : x,
            y : y
        },
        deckPosition : {
            x : (_position.x + (x - _startCursor.x)),
            y : (_position.y + (y - _startCursor.y))
        }
    }

    _el(target).hide();
    var _dop = document.elementFromPoint(x, y);
    _el(target).show();
    // if(_dop) {
	Move(_dragDeck, _dop, cursorMove);
    // }

    share.set('dragDeck',    null);
    share.set('startCursor', null);

}

// -------------------------------------------------------------------------------------------------------------

document.onmousedown = function(e) {
    if(e.button != 0) return;
    cdown(e.target, e.clientX, e.clientY);
}
document.onmousemove = function(e) {
    cmove(e.clientX, e.clientY);
}
document.onmouseup = function(e) {
    cend(e.target, e.clientX, e.clientY);
}
document.ondblclick = function(e) {
    cdown(e.target, e.clientX, e.clientY);
    cend(e.target, e.clientX, e.clientY, true);
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