'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';

import Field    from 'field';
import _el      from 'elRender';

var applyChangedParameters = function(p, a, deck) {
	
	// console.log('applyChangedParameters', a);
	
	p.x = a.position && a.position.x && typeof a.position.x == 'number'  ? a.position.x : 0,
	p.y = a.position && a.position.y && typeof a.position.y == 'number'  ? a.position.y : 0;
	p.x = a.parentPosition && a.parentPosition.x ? p.x + a.parentPosition.x : p.x;
	p.y = a.parentPosition && a.parentPosition.y ? p.y + a.parentPosition.y : p.y;
	
	deck.rotate = p.rotate = a.rotate && typeof a.rotate == 'number' ? a.rotate : 0;
	
	// у padding_x, padding_y приоритет выше чем paddingType

	p.padding_y = a.paddingY          && typeof a.paddingY     == 'number' 
		? a.paddingY 
		: a.paddingType
			? defaults.padding_y      
			: 0,
	p.padding_x = a.paddingX          && typeof a.paddingX     == 'number' 
	? a.paddingX 
	: a.paddingType
		? defaults.padding_x      
		: 0,
	p.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' 
	? a.flipPaddingY 
	: a.paddingType
		? defaults.flip_padding_y 
		: 0,
	p.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' 
	? a.flipPaddingX 
	: a.paddingType
		? defaults.flip_padding_x 
		: 0;
};

// --------------------------------------------------------------------------------------------------------

event.listen('addDeckEl', function(e) {

	var _field = Field();
	
	// console.log('addDeckEl', e);

	applyChangedParameters(e.params, e.a, e.deck);

	e.deck.domElement = 
		_el('<div>')
			.getEl();
	
	var _params = {
		left      : share.get('zoom') * e.params.x           + 'px',
		top       : share.get('zoom') * e.params.y           + 'px',
		width     : share.get('zoom') * defaults.card.width  + 'px',
 		height    : share.get('zoom') * defaults.card.height + 'px',
		transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
	};
	
	_params.display = e.deck.visible ? 'block' : 'none';

	_el(e.deck.domElement)
		.css(_params)
		.addClass('el')
		.attr({
			id: e.deck.getId()
		});

	// var showSlot = e.a.showSlot && typeof e.a.showSlot == 'boolean' ? e.a.showSlot : defaults.showSlot;
	// console.log('slot', e.a);
	if(e.a.showSlot) {
		_el(e.deck.domElement)
			.addClass('slot');
	}
	if(e.a.class) {
		_el(e.deck.domElement)
			.addClass(e.a.class);
	}

	_el(_field.domElement)
		.append(e.deck.domElement);


	// add label
		
	var label = e.a.label && typeof e.a.label == 'string' ? e.a.label : null;
	
	// console.log('debugLabels -->', share.get('debugLabels'));

	if(!e.a.label && share.get('debugLabels')) {
		label = '<span style="color:#65B0FF;">' + e.deck.name + '</span>';
	}
	if(label) {
		var _labelElement = 
			_el('<div>')
				.addClass('deckLabel')
		// DEBUG, TODO remove next string
				.attr({
					"title" : e.deck.getId() + " (" + e.deck.parent + ")"
				})
				.getEl();
		_el(_labelElement)
			.html(label);
		_el(e.deck.domElement)
			.append(_labelElement);
		
	}

});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckFlip', function(e) {
	
	if(!e || !e.cards) return;

	for(var i in e.cards) {
		var _params = {};
		
		if(e.cards[i].flip) {
			_el(e.cards[i].domElement)
				.addClass('flip');
		} else {
			_el(e.cards[i].domElement)
				.removeClass('flip');
		}
		_el(e.cards[i].domElement)
			.css(_params);
	}

});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeckIndexes', function(e) {
	
	console.log('redrawDeckPaddings:', e);
	
	if(!e || !e.cards) return;

	for(var i in e.cards) {
		_el(e.cards[i].domElement).css({
			'z-index' : (defaults.startZIndex|0) + (i|0)
		})
	}
});

// --------------------------------------------------------------------------------------------------------

event.listen('redrawDeck', function(e) {

	// console.log('redrawDeck', share.get('noRedraw'));
	
	if(share.get('noRedraw')) { return false; };
	

	if(e.data) {
		applyChangedParameters(e.params, e.data, e.deck);

		if(e.data.paddingX    ) share.get('padding_x',      e.data.paddingX    );
		if(e.data.flipPaddingX) share.get('flip_padding_x', e.data.flipPaddingX);
		if(e.data.paddingY    ) share.get('padding_y',      e.data.paddingY    );
		if(e.data.flipPaddingY) share.get('flip_padding_y', e.data.flipPaddingY);
	}

	var _params = {
		left      : share.get('zoom') * e.params.x,
		top       : share.get('zoom') * e.params.y,
		transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
	};
	
	_params.display = e.deck.visible ? 'block' : 'none';

	// console.log('DECK REDRAW', e.deck.domElement);

	_el(e.deck.domElement)
		.css(_params);

	for(var i in e.cards) {
		var _card_position = e.deck.padding(i);
		var _zIndex = (e.params.startZIndex|0) + (i|0);
		// console.log('>>> Z-INDEX:', e.deck.name, _zIndex);
		var _params = {
			'left'              : share.get('zoom') * _card_position.x + 'px', 
			'top'               : share.get('zoom') * _card_position.y + 'px',
			'z-index'           : _zIndex,
		    '-ms-transform'     : 'rotate(' + (e.params.rotate|0) + 'deg)',
		    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
		    '-moz-transform'    : 'rotate(' + (e.params.rotate|0) + 'deg)',
			'transform'         : 'rotate(' + (e.params.rotate|0) + 'deg)'
		};
		_params.display = e.deck.visible ? 'block' : 'none';

		// e.deck.checkFlip(e.cards[i], i|0, e.cards.length|0);
		
		if(e.cards[i].flip) {
			_el(e.cards[i].domElement)
				.addClass('flip');
		} else {
			_el(e.cards[i].domElement)
				.removeClass('flip');
		}
		_el(e.cards[i].domElement)
			.css(_params);
	}

});