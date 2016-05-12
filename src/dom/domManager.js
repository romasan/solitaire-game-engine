'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';
import common    from 'common';

import Field     from 'field';
import Tips      from 'tips';
import _el       from 'elRender';

import initField from 'initField';
import drawDeck  from 'drawDeck';
import drawCard  from 'drawCard';

var angleValidate = function(_angle) {
	if(_angle < 0)   { _angle = 360 + _angle; };
	if(_angle > 360) { _angle = _angle - 360; };
	return _angle;
};

// --------------------------------------------------------------------------------------------------------

event.listen('showTip', function(e) {

	// console.log('showTip', e);
	
	if(e && e.el && e.el.domElement && e.type) {
		_el(e.el.domElement)
			.addClass(e.type);
	}
});

event.listen('hideTips', function(e) {
	
	// console.log('hideTips', e);
	
	if(e && e.types) {
		for(var i in e.types) {
			var typeName = e.types[i];
			_el('.' + typeName)
				.removeClass(typeName);
		}
	} else {
		
		for(var i in Tips.tipTypes) {
			var typeName = Tips.tipTypes[i];
			_el('.' + typeName)
				.removeClass(typeName, 777);
		}

	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('removeEl', function(e) {
	_el(e.domElement)
		.remove();
})

// --------------------------------------------------------------------------------------------------------
	


// --------------------------------------------------------------------------------------------------------

event.listen('moveDragDeck', function(e) {
	
	console.log('moveDragDeck', e);
	
	common.curLock();

	for(var i in e.moveDeck) {

		var _position = e.destination.padding(e.destination.cards.length - 1 + (i|0));

		var departureAngle   = angleValidate(e.departure  .rotate), 
			destinationAngle = angleValidate(e.destination.rotate);

		_el(e.moveDeck[i].card.domElement)
			.css({
				'transform' : 'rotate(' + departureAngle + 'deg)'
			})
		
		if(departureAngle - destinationAngle > 180) {
			
			departureAngle = departureAngle - 360;
			_el(e.moveDeck[i].card.domElement)
				.css({
					'transform' : 'rotate(' + departureAngle + 'deg)'
				})
		};
		
		if(departureAngle - destinationAngle < -180) {
			destinationAngle = destinationAngle - 360;
		}

		var _params = {
			'left'              : share.get('zoom') * _position.x + 'px', 
			'top'               : share.get('zoom') * _position.y + 'px',
			'transform'         : 'rotate(' + destinationAngle + 'deg)' ,
			'-ms-transform'     : 'rotate(' + destinationAngle + 'deg)' ,
			'-webkit-transform' : 'rotate(' + destinationAngle + 'deg)' ,
			'-moz-transform'    : 'rotate(' + destinationAngle + 'deg)'
		};

		var _zIndex = (defaults.topZIndex | 0) + (i | 0);
		// console.log('_zIndex :', _zIndex);
		_el(e.moveDeck[i].card.domElement)
			.css({'z-index' : _zIndex})
			.animate(
				_params, 
				function(e) {

					console.log('>>> moveDragDeck:animationEnd')
					
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
		
		// _el(e.moveDeck[i].card.domElement)
			// .animate(_params)

	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('moveCardToHome', function(e) {

	//  Move card home
	
	console.log('Move card home', e);
	
	common.curLock();
    for(var i in e.moveDeck) {
    	var _position = e.departure.padding(e.moveDeck[i].index);
    	var _params = {
    		left : _position.x * share.get('zoom') + 'px',
    		top  : _position.y * share.get('zoom') + 'px'
    	}
    	_el(e.moveDeck[i].card.domElement)
    		.animate(
    			_params, 
    			function() {
				    common.curUnLock();
					if(e.departure) {
						e.departure.Redraw();
					}
				});
    }
    
})

// --------------------------------------------------------------------------------------------------------
	
event.listen('moveDragDeckDone', function(e) {
	
	if(!e.deck.fill) return;
	
	var _deck = e.deck.cards;
	for(var i in _deck) {
		_el(_deck[i].domElement)
			.addClass('fill')
	}
});