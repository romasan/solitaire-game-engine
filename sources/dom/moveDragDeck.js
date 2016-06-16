'use strict';

import event    from 'event';
import share    from 'share';
import common   from 'common';
import defaults from 'defaults';

import elRender from 'elRender';

var angleValidate = function(_angle) {
	if(_angle < 0)   { _angle = 360 + _angle; };
	if(_angle > 360) { _angle = _angle - 360; };
	return _angle;
};

event.listen('moveDragDeck', function(e) {
	
	console.log('moveDragDeck', e);
	
	common.curLock();

	for(var i in e.moveDeck) {

		var _position = e.destination.padding(e.destination.cards.length - 1 + (i|0));

		var departureAngle   = angleValidate(e.departure  .rotate), 
			destinationAngle = angleValidate(e.destination.rotate);

		elRender(e.moveDeck[i].card.domElement)
			.css({
				'transform' : 'rotate(' + departureAngle + 'deg)'
			})
		
		if(departureAngle - destinationAngle > 180) {
			
			departureAngle = departureAngle - 360;
			elRender(e.moveDeck[i].card.domElement)
				.css({
					'transform' : 'rotate(' + departureAngle + 'deg)'
				})
		};
		
		if(departureAngle - destinationAngle < -180) {
			destinationAngle = destinationAngle - 360;
		}

		var _params = {
			'left'              : _position.x + 'px', 
			'top'               : _position.y + 'px',
			'transform'         : 'rotate(' + destinationAngle + 'deg)'
		};

		var _zIndex = (defaults.topZIndex | 0) + (i | 0);
		// console.log('_zIndex :', _zIndex);
		elRender(e.moveDeck[i].card.domElement)
			.css({'z-index' : _zIndex})
			.animate(
				_params, 
				function(e) {

					e.departure  .Redraw();
					e.destination.Redraw();
				    
				    common.curUnLock();
				    
				    if(typeof e.callback == "function") {
				    	e.callback();
				    };

				    event.dispatch('moveDragDeckDone', {
				    	deck : e.destination
					});
				}.bind(this, e));
		
		// elRender(e.moveDeck[i].card.domElement)
			// .animate(_params)

	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('moveDragDeckDone', function(e) {
	
	if(!e.deck.fill) {
		return;
	}
	
	var _deck = e.deck.cards;
	for(var i in _deck) {
		elRender(_deck[i].domElement)
			.addClass('fill')
	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('dragDeck', function(e) {
	// {x, y, _dragDeck, _startCursor, _deck}
	
	for(var i in e._dragDeck) {
    	var _position = e._deck.padding(e._dragDeck[i].index);
    	var _params = {
    		'left'    : (_position.x + (e.x - e._startCursor.x)) + 'px',
    		'top'     : (_position.y + (e.y - e._startCursor.y)) + 'px',
    		// transform : 'rotate(0deg)',
    		'z-index' : defaults.topZIndex + (i|0)
    	}
    	// Operations with DOM
        elRender(e._dragDeck[i].card.domElement)
            .css(_params);   
    }
});
