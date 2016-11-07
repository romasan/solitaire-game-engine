'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

let applyChangedParameters = (p, a, deck) => {

	p.x = a.position && a.position.x && typeof a.position.x == 'number' ? a.position.x : 0,
	p.y = a.position && a.position.y && typeof a.position.y == 'number' ? a.position.y : 0;
	
	p.x = a.parentPosition && a.parentPosition.x ? p.x + a.parentPosition.x : p.x;
	p.y = a.parentPosition && a.parentPosition.y ? p.y + a.parentPosition.y : p.y;

	deck.rotate = p.rotate = a.rotate && typeof a.rotate == 'number' ? a.rotate : 0;

	p.padding_y = a.paddingY          && typeof a.paddingY     == 'number' 
		? a.paddingY 
		: a.paddingType
			? defaults.padding_y      
			: 0;

	p.padding_x = a.paddingX          && typeof a.paddingX     == 'number' 
		? a.paddingX 
		: a.paddingType
			? defaults.padding_x      
			: 0;

	p.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' 
		? a.flipPaddingY 
		: a.paddingType
			? defaults.flip_padding_y 
			: 0;

	p.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' 
		? a.flipPaddingX 
		: a.paddingType
			? defaults.flip_padding_x 
			: 0;
};

// --------------------------------------------------------------------------------------------------------

event.listen('addDeckEl', function(e) {

	applyChangedParameters(e.params, e.a, e.deck);

	let _deckDomElement = 
		elRender('<div>')

	let _params = {
		left      : e.params.x           + 'px',
		top       : e.params.y           + 'px',
		width     : defaults.card.width  + 'px',
 		height    : defaults.card.height + 'px',
		transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
	};
	
	_params.display = e.deck.visible ? 'block' : 'none';

	elRender(_deckDomElement)
		.css(_params)
		.addClass('el')
		.attr({
			id : e.deck.id
		});

	if(e.a.showSlot) {

		elRender(_deckDomElement)
			.addClass('slot');
	}
	
	if(e.a.class) {
		
		elRender(_deckDomElement)
			.addClass(e.a.class);
	}

	let _fieldDomElement = share.get('domElement:field');
	
	elRender(_fieldDomElement)
		.append(_deckDomElement);

	share.set('domElement:' + e.deck.id, _deckDomElement);
});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckFlip', function(e) {

	if(!e || !e.cards) {
		return;
	}

	for(let i in e.cards) {
		
		let _params = {};

		let _cardDomElement = share.get('domElement:' + e.cards[i].id);
		
		if(e.cards[i].flip) {

			elRender(_cardDomElement)
				.addClass('flip');
		} else {

			elRender(_cardDomElement)
				.removeClass('flip');
		}
		
		elRender(e.cards[i])
			.css(_params);
	}

});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckIndexes', function(e) {

	if(!e || !e.cards) {
		return;
	}

	for(let i in e.cards) {

		let _cardDomElement = share.get('domElement:' + e.cards[i].id);

		elRender(_cardDomElement).css({
			'z-index' : (defaults.startZIndex|0) + (i|0)
		})
	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeck', function(e) {

	if(share.get('noRedraw')) {
		return false;
	};

	if(e.data) {

		applyChangedParameters(e.params, e.data, e.deck);

		if(e.data.paddingX) {
			share.get('padding_x',      e.data.paddingX);
		}

		if(e.data.flipPaddingX) {
			share.get('flip_padding_x', e.data.flipPaddingX);
		}

		if(e.data.paddingY) {
			share.get('padding_y',      e.data.paddingY);
		}

		if(e.data.flipPaddingY) {
			share.get('flip_padding_y', e.data.flipPaddingY);
		}
	}

	// перерисовка стопки
	let _params = {
		transform : 'rotate(' + (e.params.rotate|0) + 'deg)',
		left      : e.params.x + 'px'                       ,
		top       : e.params.y + 'px'
	};
	
	_params.display = e.deck.visible ? 'block' : 'none';

	let _deckDomElement = share.get('domElement:' + e.deck.id);
	
	elRender(_deckDomElement)
		.css(_params);

	// перерисовка карт
	for(let i in e.cards) {
		
		let _card_position = e.deck.padding(i);
		let _zIndex        = (e.params.startZIndex|0) + (i|0);
		
		let _params = {
			'-ms-transform'     : 'rotate(' + (e.params.rotate | 0) + 'deg)',
			'-webkit-transform' : 'rotate(' + (e.params.rotate | 0) + 'deg)',
			'-moz-transform'    : 'rotate(' + (e.params.rotate | 0) + 'deg)',
			'transform'         : 'rotate(' + (e.params.rotate | 0) + 'deg)',
			'left'              : _card_position.x + 'px'                   ,
			'top'               : _card_position.y + 'px'                   ,
			'z-index'           : _zIndex
		};
		
		_params.display = e.deck.visible ? 'block' : 'none';

		let _cardDomElement = share.get('domElement:' + e.cards[i].id);

		if(e.cards[i].flip) {
		
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