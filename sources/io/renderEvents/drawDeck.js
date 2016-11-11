'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

let applyChangedParameters = (params, deckData, deck) => {

	params.x = deckData.position && deckData.position.x && typeof deckData.position.x == 'number' ? deckData.position.x : 0,
	params.y = deckData.position && deckData.position.y && typeof deckData.position.y == 'number' ? deckData.position.y : 0;
	
	params.x = deckData.parentPosition && deckData.parentPosition.x ? params.x + deckData.parentPosition.x : params.x;
	params.y = deckData.parentPosition && deckData.parentPosition.y ? params.y + deckData.parentPosition.y : params.y;

	deck.rotate = params.rotate = deckData.rotate && typeof deckData.rotate == 'number' ? deckData.rotate : 0;

	params.padding_y = deckData.paddingY          && typeof deckData.paddingY     == 'number' 
		? deckData.paddingY 
		: deckData.paddingType
			? defaults.padding_y      
			: 0;

	params.padding_x = deckData.paddingX          && typeof deckData.paddingX     == 'number' 
		? deckData.paddingX 
		: deckData.paddingType
			? defaults.padding_x      
			: 0;

	params.flip_padding_y = deckData.flipPaddingY && typeof deckData.flipPaddingY == 'number' 
		? deckData.flipPaddingY 
		: deckData.paddingType
			? defaults.flip_padding_y 
			: 0;

	params.flip_padding_x = deckData.flipPaddingX && typeof deckData.flipPaddingX == 'number' 
		? deckData.flipPaddingX 
		: deckData.paddingType
			? defaults.flip_padding_x 
			: 0;
};

// --------------------------------------------------------------------------------------------------------

event.listen('addDeckEl', (data) => {

	applyChangedParameters(data.params, data.deckData, data.deck);

	let _deckDomElement = 
		elRender('<div>')

	let _params = {
		transform : 'rotate(' + (data.params.rotate|0) + 'deg)',
		width     : defaults.card.width  + 'px'                ,
 		height    : defaults.card.height + 'px'                ,
		left      : data.params.x        + 'px'                ,
		top       : data.params.y        + 'px'
	};
	
	_params.display = data.deck.visible ? 'block' : 'none';

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

event.listen('redrawDeckFlip', (data) => {

	if(!data || !data.cards) {
		return;
	}

	for(let i in data.cards) {
		
		let _params = {};

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);
		
		if(data.cards[i].flip) {

			elRender(_cardDomElement)
				.addClass('flip');
		} else {

			elRender(_cardDomElement)
				.removeClass('flip');
		}
		
		elRender(data.cards[i])
			.css(_params);
	}

});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckIndexes', (data) => {

	if(!data || !data.cards) {
		return;
	}

	for(let i in data.cards) {

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		elRender(_cardDomElement).css({
			'z-index' : (defaults.startZIndex|0) + (i|0)
		})
	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeck', (data) => {

	if(share.get('noRedraw')) {
		return false;
	};

	if(data.deckData) {

		applyChangedParameters(data.params, data.deckData, data.deck);

		if(data.deckData.paddingX) {
			share.get('padding_x',      data.deckData.paddingX);
		}

		if(data.deckData.flipPaddingX) {
			share.get('flip_padding_x', data.deckData.flipPaddingX);
		}

		if(data.deckData.paddingY) {
			share.get('padding_y',      data.deckData.paddingY);
		}

		if(data.deckData.flipPaddingY) {
			share.get('flip_padding_y', data.deckData.flipPaddingY);
		}
	}

	// перерисовка стопки
	let _params = {
		transform : 'rotate(' + (data.params.rotate|0) + 'deg)',
		left      : data.params.x + 'px'                       ,
		top       : data.params.y + 'px'
	};
	
	_params.display = data.deck.visible ? 'block' : 'none';

	let _deckDomElement = share.get('domElement:' + data.deck.id);
	
	elRender(_deckDomElement)
		.css(_params);

	// перерисовка карт
	for(let i in data.cards) {
		
		let _card_position = data.deck.padding(i);
		let _zIndex        = (data.params.startZIndex|0) + (i|0);
		
		let _params = {
			'-ms-transform'     : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'-webkit-transform' : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'-moz-transform'    : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'transform'         : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			'left'              : _card_position.x + 'px'                   ,
			'top'               : _card_position.y + 'px'                   ,
			'z-index'           : _zIndex
		};
		
		_params.display = data.deck.visible ? 'block' : 'none';

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