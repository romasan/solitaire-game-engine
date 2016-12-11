'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

/*
 * addDeckEl
 * redrawDeckFlip
 * redrawDeckIndexes
 * redrawDeck
 */

let applyChangedParameters = data => {

	data.params.x = (
			(data.deckData.position                     &&
			typeof data.deckData.position.x == 'number'
				? data.deckData.position.x
				: 0) | 0
		) +
		(
			(data.deckData.parentPosition                     &&
			typeof data.deckData.parentPosition.x == 'number'
				? data.deckData.parentPosition.x
				: 0) | 0
		);

	data.params.y = (
			(data.deckData.position                     &&
			typeof data.deckData.position.y == 'number'
				? data.deckData.position.y
				: 0) | 0
		) +
		(
			(data.deckData.parentPosition                     &&
			typeof data.deckData.parentPosition.y == 'number'
				? data.deckData.parentPosition.y
				: 0) | 0
		);

	data.deck.rotate = data.params.rotate = 
		data.deckData.rotate                    &&
		typeof data.deckData.rotate == 'number'
			? data.deckData.rotate
			: 0;

	data.params.padding_y = 
		data.deckData.paddingY                    &&
		typeof data.deckData.paddingY == 'number' 
			? data.deckData.paddingY 
			: data.deckData.paddingType
				? defaults.padding_y      
				: 0;

	data.params.padding_x = 
		data.deckData.paddingX                    &&
		typeof data.deckData.paddingX == 'number' 
			? data.deckData.paddingX 
			: data.deckData.paddingType
				? defaults.padding_x      
				: 0;

	data.params.flip_padding_y = 
		data.deckData.flipPaddingY                    &&
		typeof data.deckData.flipPaddingY == 'number' 
			? data.deckData.flipPaddingY 
			: data.deckData.paddingType
				? defaults.flip_padding_y 
				: 0;

	data.params.flip_padding_x = 
		data.deckData.flipPaddingX                    &&
		typeof data.deckData.flipPaddingX == 'number' 
			? data.deckData.flipPaddingX 
			: data.deckData.paddingType
				? defaults.flip_padding_x 
				: 0;
};

// --------------------------------------------------------------------------------------------------------

event.listen('addDeckEl', data => {

	applyChangedParameters(data);

	let _deckDomElement = 
		elRender('<div>');

	let _params = {
		'transform' : 'rotate(' + (data.params.rotate | 0) + 'deg)',
		'width'     : defaults.card.width  + 'px'                  ,
 		'height'    : defaults.card.height + 'px'                  ,
		'left'      : data.params.x        + 'px'                  ,
		'top'       : data.params.y        + 'px'                  ,
		'display'   : data.deck.visible ? 'block' : 'none'
	};

	elRender(_deckDomElement)
		.css(_params)
		.addClass('el')
		.attr({
			id : data.deck.id
		});

	if(data.deckData.showSlot) {
		elRender(_deckDomElement)
			.addClass('slot');
	}
	
	if(data.deckData.class) {
		elRender(_deckDomElement)
			.addClass(data.deckData.class);
	}

	let _fieldDomElement = share.get('domElement:field');
	
	elRender(_fieldDomElement)
		.append(_deckDomElement);

	share.set('domElement:' + data.deck.id, _deckDomElement);
});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckFlip', data => {

	if(!data || !data.cards) {
		return;
	}

	for(let i in data.cards) {
		
		let _params = {};

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);
		
		if(data.cards[i].flip) {

			_cardDomElement.addClass('flip');
		} else {

			_cardDomElement.removeClass('flip');
		}
		
		_cardDomElement.css(_params);
	}

});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckIndexes', data => {

	if(!data || !data.cards) {
		return;
	}

	for(let i in data.cards) {

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		_cardDomElement.css({
			'z-index' : (defaults.startZIndex | 0) + (i | 0)
		});
	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeck', data => {

	if(share.get('noRedraw')) {
		return false;
	};

	if(
		data          &&
		data.deckData &&
		data.deck     &&
		data.params
	) {
		applyChangedParameters(data);
	}

	if(data.deck.full) {
		console.log('redrawDeck:', data.deck.name, data.deck.full);
	}

	// перерисовка стопки
	let _params = {
		'transform' : 'rotate(' + (data.params.rotate | 0) + 'deg)',
		'left'      : data.params.x + 'px'                         ,
		'top'       : data.params.y + 'px'                         ,
		'display'   : data.deck.visible ? 'block' : 'none'
	};	

	let _deckDomElement = share.get('domElement:' + data.deck.id);
	
	elRender(_deckDomElement)
		.css(_params);

	// full deck (add class full to all cards in deck)
	if(data.deck.full) {
		let _cards = data.deck.getCards();
		for(let i in _cards) {
			let _cardDomElement = share.get('domElement:' + _cards[i].id);
			if(_cardDomElement) {
				elRender(_cardDomElement)
					.addClass('full');
			}
		}
	}

	// console.log('redraw cards for', data.deck.name, data.cards);

	// перерисовка карт
	for(let i in data.cards) {
		
		let _card_position = data.deck.padding(i);
		let _zIndex        = (data.params.startZIndex | 0) + (i | 0);
		
		let _params = {
			'-ms-transform'     : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'-webkit-transform' : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'-moz-transform'    : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'transform'         : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'left'              : _card_position.x + 'px'                      ,
			'top'               : _card_position.y + 'px'                      ,
			'z-index'           : _zIndex                                      ,
			'display'           : data.deck.visible ? 'block' : 'none'
		};

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		if(data.cards[i].flip) {
		
			elRender(_cardDomElement)
				.addClass('flip');
		} else {
		
			elRender(_cardDomElement)
				.removeClass('flip');
		}
		
		elRender(_cardDomElement)
			.css(_params);
	}
});