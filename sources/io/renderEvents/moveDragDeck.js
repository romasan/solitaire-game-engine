'use strict';

import common, {event, share, defaults} from '../../common';

import {elRender}                       from '../dom'      ;

let angleValidate = angle => {

	// if (angle < 0  ) {
	// 	angle += 360;
	// }

	// if (angle > 360) {
	// 	angle -= 360;
	// }

	return angle;
};

/**
 * moveDeck - Listener
 */
event.listen('moveDragDeck', data => {

	if (share.get('nodraw')) {

		if (typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	// console.log('moveDragDeck', data);
	// let _debugMoveDeck = data.moveDeck.map(e => e.card.name).join(',');

	common.curLock();

	let _lastIndex = data.moveDeck.length - 1;

	for (let i in data.moveDeck) {

		let _position = data.destination.padding(
			data.destination.cardsCount() - data.moveDeck.length + (i | 0),
			true
		);

		_position.random = Math.random();

		let departureAngle   = angleValidate(data.departure	 .rotate), 
		    destinationAngle = angleValidate(data.destination.rotate);

		let _cardDomElement = share.get('domElement:' + data.moveDeck[i].card.id);

		elRender(_cardDomElement)
			.css({
				"transform" : 'rotate(' + departureAngle + 'deg)'
			})

		if (departureAngle - destinationAngle > 180) {

			departureAngle = departureAngle - 360;
			elRender(_cardDomElement)
				.css({
					"transform" : 'rotate(' + departureAngle + 'deg)'
				})
		};

		if (departureAngle - destinationAngle < -180) {
			destinationAngle -= 360;
		}

		const zoom = share.get('zoom');

		let _params = {
			"transform" : 'rotate(' + destinationAngle + 'deg)',
			"left"      : _position.x * zoom + 'px'                   ,
			"top"       : _position.y * zoom + 'px'
		};

		let _zIndex = (defaults.topZIndex | 0) + (i | 0);

		let _last = i == _lastIndex;
		// let _callback = function(data, _last) {
		let _callback = e => {

			// если при раздаче (dealAction) первой стопкой для раздачи
			// оказывается спопка из которой сделан ход, перерисовка ломает анимацию
			// data.departure  .Redraw();
			data.destination.Redraw();

			if (
				_last                              &&
				typeof data.callback == 'function'
			) {

				common.curUnLock();

				// console.log('moveDragDeck:callback');

				data.callback();
			}

			event.dispatch('moveDragDeckDone', {
				"deck" : data.destination
			});
		// }.bind(null, data, i == _lastIndex);
		};

		// event.once('clearCallbacks', e => {
		// 	_callback = e => {};
		// });

		elRender(_cardDomElement)
			.css({
				"z-index" : _zIndex
			})
			.animate(
				_params  ,
				_callback
			);
	}
});

/**
 * moveDragDeckDone - Listener
 */
event.listen('moveDragDeckDone', data => {

	if (!data.deck.full) {
		return;
	}

	if (share.get('nodraw')) {

		if (typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	let _deck = data.deck.cards;

	for (let i in _deck) {

		let _cardDomElement = share.get('domElement:' + _deck[i].id);

		elRender(_cardDomElement)
			.addClass('full')
	}
});

/**
 * dragDeck - Listener
 */
event.listen('dragDeck', data => { // {x, y, dragDeck, startCursor, deck}

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}
	
	const zoom = share.get('zoom');

	for (let i in data.dragDeck) {

		let _position = data.deck.padding(data.dragDeck[i].index);

		let _params = {
			"left"    : (_position.x * zoom + (data.x - data.startCursor.x)) + 'px',
			"top"     : (_position.y * zoom + (data.y - data.startCursor.y)) + 'px',
			"z-index" : defaults.topZIndex + (i | 0)
		}

		// Operations with DOM
		let _cardDomElement = share.get('domElement:' + data.dragDeck[i].card.id);

		elRender(_cardDomElement)
			.css(_params);
	}
});
