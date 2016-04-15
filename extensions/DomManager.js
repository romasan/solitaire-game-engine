'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'SolitaireCommon';

import Field    from 'Field';
import Tips     from 'Tips';
import _el      from 'elRender';

event.listen('initField', function(e) {

	// console.log('initField');
	
	var domElement = e.a.field ? e.a.field : '#mat';// default;
	if(typeof domElement == 'string') {
		if(domElement.split('.').length == 2) {
			domElement = document.getElementsByClassName(domElement.split('.')[1])[0];
		} else if(domElement.split('#').length == 2) {
			domElement = document.getElementById(domElement.split('#')[1]);
		} else {
			domElement = document.getElementsByTagName(domElement);
		}
		if(!domElement) {
			domElement = document.getElementById('mat')
		}
	};
	// share.field = e.field;
	var _field = Field();
	_field.domElement = domElement;

	var _params = {};

	if(e.a.width  && typeof e.a.width  == 'number') { _params.width  = share.get('zoom') * e.a.width  + 'px'; }
	if(e.a.height && typeof e.a.height == 'number') { _params.height = share.get('zoom') * e.a.height + 'px'; }
	if(e.a.top    && typeof e.a.top    == 'number') { _params.top    = share.get('zoom') * e.a.top    + 'px'; }
	if(e.a.left   && typeof e.a.left   == 'number') { _params.left   = share.get('zoom') * e.a.left   + 'px'; }
	// if(a.rotate && typeof a.rotate == 'number') _params.transform = 'rotate(' + (a.rotate|0) + 'deg)';
	
	var themeName = 
		typeof e.a.theme == 'string' 
			? e.a.theme 
			: typeof e.a.theme == 'object' && e.a.theme.name
				? e.a.theme.name
				: defaults.theme.name;

	_el(domElement)
		.css(_params)
		.addClass('field')
		.addClass(themeName);
});

// --------------------------------------------------------------------------------------------------------

event.listen('hideCard', function(e) {

	// console.log('hideCard:', e);
	if(e && e.domElement) {
		_el(e.domElement[0])
			.hide();
	}
});
	
event.listen('showCard', function(e) {

	// console.log('showCard:', e);
	if(e && e.domElement) {
		_el(e.domElement[0])
			.show();
	}
});

// --------------------------------------------------------------------------------------------------------

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
event.listen('redrawDeck', function(e) {

	if(e.a) {
		applyChangedParameters(e.params, e.a, e.deck);

		if(e.a.paddingX    ) share.get('padding_x',      e.a.paddingX    );
		if(e.a.flipPaddingX) share.get('flip_padding_x', e.a.flipPaddingX);
		if(e.a.paddingY    ) share.get('padding_y',      e.a.paddingY    );
		if(e.a.flipPaddingY) share.get('flip_padding_y', e.a.flipPaddingY);
	}

	var _params = {
		left      : share.get('zoom') * e.params.x,
		top       : share.get('zoom') * e.params.y,
		transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
	};
	
	_params.display = e.deck.visible ? 'block' : 'none';

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

// --------------------------------------------------------------------------------------------------------
	
event.listen('addCardEl', function(e) {
	
	var _field = Field();
	
	var _card = {
		width  : share.get('zoom') * defaults.card.width,
		height : share.get('zoom') * defaults.card.height,
	};
	_card = {
		width  : _card.width .toFixed(3) * 1,
		height : _card.height.toFixed(3) * 1
	};

	var _params = {
		"width"               : _card.width  + 'px',
		"height"              : _card.height + 'px'
	};


	if(share.get('spriteTexture')) {
		var _vcard = common.validateCardName(e.name),
		_position = {
			x : defaults.card.ranks      .indexOf(_vcard.rank),
			y : share.get('textureSuits').indexOf(_vcard.suit),
		};

		var _backgroundSize = {
				width  : defaults.card.ranks.length * _card.width,
				height : defaults.card.suits.length * _card.height
			},
			_backgroundPosition = {
				x : _position.x * _card.width,
				y : _position.y * _card.height
			};
		_backgroundSize = {
			width  : _backgroundSize.width .toFixed(3) * 1,
			height : _backgroundSize.height.toFixed(3) * 1
		};
		_backgroundPosition = {
			x : _backgroundPosition.x.toFixed(3) * 1,
			y : _backgroundPosition.y.toFixed(3) * 1
		};

		_params["background-size"]     = _backgroundSize.width + 'px ' + _backgroundSize.height + 'px';
		_params["background-position"] = _backgroundPosition.x + 'px ' + _backgroundPosition.y  + 'px';
	}

	e.domElement = 
		_el('<div>')
			.getEl();
	
	_el(e.domElement)
		// .addClass(e.name)
		.addClass('el card draggable')
		// .css({'background-size' : null})
		.css(_params)
		.attr({
			id: e.id
		});
	_el(_field.domElement)
		.append(e.domElement);
});

// --------------------------------------------------------------------------------------------------------

event.listen('moveDragDeck', function(e) {
	
	// console.log('moveDragDeck', e);
	
	common.curLock();
	for(var i in e.moveDeck) {
		var _position = e.destination.padding(e.destination.cards.length - 1 + (i|0));
		             // e.destination.padding(e.moveDeck[i].index);
		var _params = {
			left : share.get('zoom') * _position.x + 'px', 
			top  : share.get('zoom') * _position.y + 'px',
			// transform : 'rotate(0deg)'
		};
		var a = e.departure  .rotate, 
			b = e.destination.rotate;
		if(Math.abs(a - b) > 180) {
			if(a > b) {
				a = a - 360
			} else {
				b = b - 360
			}
		};
		// console.log('rotate', a, b)

		

		var _zIndex = (defaults.topZIndex|0) + (i|0);
		// console.log('_zIndex :', _zIndex);
		_el(e.moveDeck[i].card.domElement)
			.css({
				'z-index' : _zIndex
			});

		$({deg: a, e : e})
			.animate({deg: b}, {
				duration: defaults.animationTime,
				step: function (now) {
				$(this).css({
					'-ms-transform'     : 'rotate(' + now + 'deg)',
					'-webkit-transform' : 'rotate(' + now + 'deg)',
					'-moz-transform'    : 'rotate(' + now + 'deg)',
					// transform: 'rotate(' + now + 'deg)',
				});
				}.bind(e.moveDeck[i].card.domElement)
			});
		$(e.moveDeck[i].card.domElement)
			.animate(_params, defaults.animationTime, function() {
				e.departure.Redraw();
				e.destination.Redraw();
			});
		
		// _el(e.moveDeck[i].card.domElement)
			// .animate(_params)

	}
	$('.draggable')
		.promise()
		.done(function(){
		    common.curUnLock();
		    event.dispatch('moveDragDeckDone', {deck : e.destination});
		});
});

// --------------------------------------------------------------------------------------------------------

event.listen('moveCardToHome', function(e) {
	//  Move card home
	// console.log('Move card home', e);
	common.curLock();
    for(var i in e.moveDeck) {
    	var _position = e.departure.padding(e.moveDeck[i].index);
    	var _params = {
    		left : _position.x * share.get('zoom') + 'px',
    		top  : _position.y * share.get('zoom') + 'px'
    	}
    	$(e.moveDeck[i].card.domElement)
    		.animate(_params, defaults.animationTime);
    }
	$('.draggable')
		.promise()
		.done(function(){
		    common.curUnLock();
		});
    
	$('.draggable')
		.promise()
		.done(function() {
			if(e.departure) {
				e.departure.Redraw();
			}
		});
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