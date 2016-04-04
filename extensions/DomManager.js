'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'SolitaireCommon';

import Field    from 'Field';
import Tips     from 'Tips';

// ---------------------------------------------------------------------------

var _elConstructor = function(e) {
	this.el = e;
};

_elConstructor.prototype.addClass = function(className) {
	try {
		var _classes = this.el.className.split(' ');
		if(_classes.indexOf(className) < 0) {
			_classes.push(className);
			this.el.className = _classes.join(' ');
		}
	} catch(_e) {
		console.warn(_e, this.el);
	}
	return this;
};

_elConstructor.prototype.removeClass = function(className) {
	try {
		var _classes = this.el.className.split(' ');
		if(_classes.indexOf(className) >= 0) {
			var _clone = [];
			for(var i in _classes) {
				if(_classes[i] != className) {
					_clone.push(_classes[i]);
				}
			}
			_classes = _clone;
			this.el.className = _classes.join(' ');
		}
	} catch(_e) {
		console.warn(_e, this.el);
	}
	return this;
};

var _el = function(e) {

	// if(!e) return;

	if(typeof e == "string") {
		e = document.querySelector(e);
	} else if(e instanceof Array) {
		e = e[0];
	}

	return new _elConstructor(e);
};

// ---------------------------------------------------------------------------

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
	
	var theme = (e.a.theme && typeof e.a.theme == 'string') ? e.a.theme : defaults.theme;// TODO (theme from config)

	$(domElement)
		.css(_params)
		.addClass('field')
		.addClass(theme);
});

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

event.listen('hideCard', function(e) {

	// console.log('hideCard:', e);
	if(e && e.domElement) {
		// $(e.domElement).hide();
		e.domElement[0].style.display = 'none';
	}
});
	
event.listen('showCard', function(e) {

	// console.log('showCard:', e);
	if(e && e.domElement) {
		// $(e.domElement).show();
		e.domElement[0].style.display = 'block';
	}
});
	
event.listen('addDeckEl', function(e) {

	var _field = Field();
	
	// console.log('addDeckEl', e);

	applyChangedParameters(e.params, e.a, e.deck);

	e.deck.domElement = $('<div>')[0];
	
	var _params = {
		left      : share.get('zoom') * e.params.x           + 'px',
		top       : share.get('zoom') * e.params.y           + 'px',
		width     : share.get('zoom') * defaults.card.width  + 'px',
 		height    : share.get('zoom') * defaults.card.height + 'px',
		transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
	};
	
	_params.display = e.deck.visible ? 'block' : 'none';

	$(e.deck.domElement)
		.css(_params)
		.addClass('el')
		.attr({
			id: e.deck.getId()
		});

	// var showSlot = e.a.showSlot && typeof e.a.showSlot == 'boolean' ? e.a.showSlot : defaults.showSlot;
	// if(showSlot) $(e.deck.domElement).addClass('slot');
	// console.log('slot', e.a);
	if(e.a.showSlot) {
		$(e.deck.domElement)
			.addClass('slot');
	}
	if(e.a.class) {
		$(e.deck.domElement)
			.addClass(e.a.class);
	}

	$(_field.domElement)
		.append(e.deck.domElement);


	// add label
		
	var label = e.a.label && typeof e.a.label == 'string' ? e.a.label : null;
	
	// console.log('debugLabels -->', share.get('debugLabels'));

	if(!e.a.label && share.get('debugLabels')) {
		label = '<span style="color:#65B0FF;">' + e.deck.name + '</span>';
	}

	if(label) {
		var _labelElement = $('<div>').addClass('deckLabel')
		// DEBUG, TODO remove next string
		.attr({"title" : e.deck.getId() + " (" + e.deck.parent + ")"});
		$(_labelElement)
			.html(label);
		$(e.deck.domElement)
			.append(_labelElement);
		
	}

});

event.listen('showTip', function(e) {
	// console.log('showTip', e);
	if(e && e.el && e.el.domElement && e.type) {
		// $(e.el.domElement).addClass(e.type);
		_el(e.el.domElement[0]).addClass(e.type);
	}
});

event.listen('hideTips', function(e) {
	// console.log('hideTips', e);
	if(e && e.types) {
		for(var i in e.types) {
			var typeName = e.types[i];
			// $('.' + typeName).removeClass(typeName);
			var _elements = document.getElementsByClassName(typeName);
			for(var i in _elements) {
				_el(_elements[i]).removeClass(typeName);
			}
		}
	} else {
		for(var i in Tips.tipTypes) {
			var typeName = Tips.tipTypes[i];
			// $('.' + typeName).removeClass(typeName);
			var _elements = document.getElementsByClassName(typeName);
			for(var elNum in _elements) {
				if(_elements.length == 0) {
					return;
				}
				_el(_elements[elNum]).removeClass(typeName);
			}
		}
	}
});

event.listen('removeEl', function(e) {
	$(e.domElement)
		.remove();
})

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

	$(e.deck.domElement).css(_params);

	for(var i in e.cards) {
		var _card_position = e.deck.padding(i);
		var _params = {
			'left'              : share.get('zoom') * _card_position.x + 'px', 
			'top'               : share.get('zoom') * _card_position.y + 'px',
			'z-index'           : e.params.startZIndex + (i|0),
		    '-ms-transform'     : 'rotate(' + (e.params.rotate|0) + 'deg)',
		    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
		    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
		    '-moz-transform'    : 'rotate(' + (e.params.rotate|0) + 'deg)',
			// transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
		};
		_params.display = e.deck.visible ? 'block' : 'none';

		// e.deck.checkFlip(e.cards[i], i|0, e.cards.length|0);
		
		if(e.cards[i].flip) {
			// $(e.cards[i].domElement)
			// 	.addClass('flip');
			_el(e.cards[i].domElement[0]).addClass('flip');
		} else {
			// $(e.cards[i].domElement)
			// 	.removeClass('flip');
			_el(e.cards[i].domElement[0]).removeClass('flip');
		}
		$(e.cards[i].domElement)
			.css(_params);
		for(var paramName in _params) {
			e.cards[i].domElement[0].style[paramName] = _params[paramName];
		}
	}

});
	
event.listen('addCardEl', function(e) {
	
	var _field = Field();

	e.domElement = $('<div>')
		.addClass('el card draggable')
		.addClass(e.name);
	var _params = {
		width  : share.get('zoom') * defaults.card.width + 'px',
		height : share.get('zoom') * defaults.card.height + 'px'
	}
	
	// console.log('addCardEl', _params,share.get('zoom'));
	
	$(e.domElement)
		.css(_params)
		.attr({
			id: e.id
		});
	$(_field.domElement)
		.append(e.domElement);
});

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

		

		// var _zIndex = $(this).css('z-index');// <- defaults.topZIndex TODO
		// console.log(_zIndex);
		
		$({deg: a, e : e})
			.animate({deg: b}, {
				duration: defaults.animationTime,
				step: function (now) {
				$(this).css({
					'-ms-transform'     : 'rotate(' + now + 'deg)',
					'-webkit-transform' : 'rotate(' + now + 'deg)',
					'-webkit-transform' : 'rotate(' + now + 'deg)',
					'-moz-transform'    : 'rotate(' + now + 'deg)',
					// transform: 'rotate(' + now + 'deg)',
				});
				}.bind(e.moveDeck[i].card.domElement)
			});
		$(e.moveDeck[i].card.domElement).animate(_params, defaults.animationTime, function() {
			e.departure.Redraw();
			e.destination.Redraw();
		});
	}
	$('.draggable').promise().done(function(){
	    common.curUnLock();
	    event.dispatch('moveDragDeckDone', {deck : e.destination});
	});
});

event.listen('moveCardToHome', function(e) {
	//  Move card home
	// console.log('Move card home', e);
	common.curLock();
    for(var i in e.moveDeck) {
    	var _position = e.departure.padding(e.moveDeck[i].index);
    	var _params = {
    		left : _position.x + 'px',
    		top  : _position.y + 'px'
    	}
    	$(e.moveDeck[i].card.domElement)
    		.animate(_params, defaults.animationTime);
    }
	$('.draggable').promise().done(function(){
	    common.curUnLock();
	});
    
	$('.draggable').promise().done(function() {
		if(e.departure) {
			e.departure.Redraw();
		}
	});
})
	
event.listen('moveDragDeckDone', function(e) {
	
	if(!e.deck.fill) return;
	
	var _deck = e.deck.cards;
	for(var i in _deck) {
		// $(_deck[i].domElement).addClass('fill');
		_el(_deck[i].domElement[0]).addClass('fill')
	}
});