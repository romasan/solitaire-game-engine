'use strict';

import event	from 'event';
import share	from 'share';
import common	from 'common';
import defaults from 'defaults';

import elRender from 'elRender';

let angleValidate = (_angle)=>{

	if(_angle < 0	 ) { _angle += 360; }
	if(_angle > 360) { _angle -= 360; }

	return _angle;
};

event.listen('moveDragDeck', (e)=>{

	common.curLock();

	let _lastIndex = e.moveDeck.length - 1;
	for(let i in e.moveDeck) {

		let _position = e.destination.padding(e.destination.cards.length - 1 + (i | 0));

		let departureAngle = angleValidate(e.departure	.rotate), 
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
			destinationAngle -= 360;
		}

		let _params = {
			'left'			: _position.x + 'px', 
			'top'			 : _position.y + 'px',
			'transform' : 'rotate(' + destinationAngle + 'deg)'
		};

		let _zIndex = (defaults.topZIndex | 0) + (i | 0);

		let _callback = function(e, _last) {

			e.departure	 .Redraw();
			e.destination.Redraw();

			common.curUnLock();

			if(_last && typeof e.callback == "function") {
				e.callback();
			}

			event.dispatch('moveDragDeckDone', {
				deck : e.destination
			});
		}.bind(null, e, i == _lastIndex);

		elRender(e.moveDeck[i].card.domElement)
			.css({'z-index' : _zIndex})
			.animate(
				_params, 
				_callback
			);

		// elRender(e.moveDeck[i].card.domElement)
			// .animate(_params)

	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('moveDragDeckDone', (e)=>{

	if(!e.deck.fill) {
		return;
	}

	let _deck = e.deck.cards;
	for(let i in _deck) {
		elRender(_deck[i].domElement)
			.addClass('fill')
	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('dragDeck', (e)=>{// {x, y, _dragDeck, _startCursor, _deck}

	for(let i in e._dragDeck) {
			let _position = e._deck.padding(e._dragDeck[i].index);
			let _params = {
				'left'    : (_position.x + (e.x - e._startCursor.x)) + 'px',
				'top'     : (_position.y + (e.y - e._startCursor.y)) + 'px',
				// transform : 'rotate(0deg)',
				'z-index' : defaults.topZIndex + (i | 0)
			}
			// Operations with DOM
				elRender(e._dragDeck[i].card.domElement)
						.css(_params);	 
		}
});
