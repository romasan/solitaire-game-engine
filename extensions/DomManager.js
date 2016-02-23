'use strict';

module.exports = function(main, share) {

	main.event.listen('initField', function(e) {

		// console.log('initField', e);

		// share.zz = 9;

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
		share.field.domElement = domElement;

		var _params = {};

		if(e.a.width  && typeof e.a.width  == 'number') _params.width  = share.zoom * e.a.width  + 'px';
		if(e.a.height && typeof e.a.height == 'number') _params.height = share.zoom * e.a.height + 'px';
		if(e.a.top    && typeof e.a.top    == 'number') _params.top    = share.zoom * e.a.top    + 'px';
		if(e.a.left   && typeof e.a.left   == 'number') _params.left   = share.zoom * e.a.left   + 'px';
		// if(a.rotate && typeof a.rotate == 'number') _params.transform = 'rotate(' + (a.rotate|0) + 'deg)';
		
		var theme = (e.a.theme && typeof e.a.theme == 'string') ? e.a.theme : share.default_theme;// TODO (theme from config)

		$(domElement).css(_params).addClass('field').addClass(theme);
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
				? share.default_padding_y      
				: 0,
		p.padding_x = a.paddingX          && typeof a.paddingX     == 'number' 
		? a.paddingX 
		: a.paddingType
			? share.default_padding_x      
			: 0,
		p.flip_padding_y = a.flipPaddingY && typeof a.flipPaddingY == 'number' 
		? a.flipPaddingY 
		: a.paddingType
			? share.default_flip_padding_y 
			: 0,
		p.flip_padding_x = a.flipPaddingX && typeof a.flipPaddingX == 'number' 
		? a.flipPaddingX 
		: a.paddingType
			? share.default_flip_padding_x 
			: 0;
	};

	main.event.listen('hideCard', function(e) {

		// console.log('hideCard:', e);
		if(e && e.domElement) {
			$(e.domElement).hide();
		}
	});
	
	main.event.listen('showCard', function(e) {

		// console.log('showCard:', e);
		if(e && e.domElement) {
			$(e.domElement).show();
		}
	});
	
	main.event.listen('addDeckEl', function(e) {

		applyChangedParameters(e.params, e.a, e.deck);

		e.deck.domElement = $('<div>')[0];

		// e.deck.domElement = e.deck.domElement;
		
		/*this.highlightOn = function() {
			highlight = true;
			$(domElement).addClass(highlightClass);
		}
		
		this.highlightOff = function() {
			highlight = false;
			$(domElement).removeClass(highlightClass);
		}*/
		
		var _params = {
			left      : share.zoom * e.params.x        + 'px',
			top       : share.zoom * e.params.y        + 'px',
			width     : share.zoom * share.card.width  + 'px',
			height    : share.zoom * share.card.height + 'px',
			transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
		};
		
		_params.display = e.deck.visible ? 'block' : 'none';

		$(e.deck.domElement).css(_params).addClass('el').attr({id: e.deck.getId()});

		// var showSlot = e.a.showSlot && typeof e.a.showSlot == 'boolean' ? e.a.showSlot : share.default_showSlot;
		// if(showSlot) $(e.deck.domElement).addClass('slot');
		// console.log('slot', e.a);
		if(e.a.showSlot) $(e.deck.domElement).addClass('slot');
		if(e.a.class) $(e.deck.domElement).addClass(e.a.class);

		$(share.field.domElement).append(e.deck.domElement);


		// add label
			
		var label = e.a.label && typeof e.a.label == 'string' ? e.a.label : null;
		
		if(!e.a.label && share.debugLabels) {
			label = '<span style="color:#65B0FF;">' + e.deck.name + '</span>';
		}

		if(label) {
			var _labelElement = $('<div>').addClass('deckLabel')
			// DEBUG, TODO remove next string
			.attr({"title" : e.deck.getId() + " (" + e.deck.parent() + ")"});
			$(_labelElement).html(label);
			$(e.deck.domElement).append(_labelElement);
			
			// label style position fix
			// DEBUG
			
			/*$(_labelElement).css({marginTop : '-' + ($(_labelElement).height() + 5) + 'px'});
			if(share.zoom != share.default_zoom) {
				$(_labelElement).css({transform : 'scale(' + share.zoom + ')'})
			}*/
		}

	});

	main.event.listen('showTip', function(e) {
		// console.log('showTip', e);
		if(e && e.el && e.el.domElement && e.type) {
			$(e.el.domElement).addClass(e.type);
		}
	});

	main.event.listen('hideTips', function(e) {
		// console.log('hideTips', e);
		if(e && e.types) {
			for(i in e.types) {
				var typeName = e.types[i];
				$('.' + typeName).removeClass(typeName);
			}
		} else {
			for(i in share.tipTypes) {
				var typeName = share.tipTypes[i];
				$('.' + typeName).removeClass(typeName);
			}
		}
	});

	main.event.listen('removeEl', function(e) {
		$(e.domElement).remove();
	})

	main.event.listen('redrawDeck', function(e) {

		if(e.a) {
			applyChangedParameters(e.params, e.a, e.deck);

			if(e.a.paddingX)     share.padding_x      = e.a.paddingX;
			if(e.a.flipPaddingX) share.flip_padding_x = e.a.flipPaddingX;
			if(e.a.paddingY)     share.padding_y      = e.a.paddingY;
			if(e.a.flipPaddingY) share.flip_padding_y = e.a.flipPaddingY;
		}

		var _params = {
			left      : share.zoom * e.params.x,
			top       : share.zoom * e.params.y,
			transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
		};
		
		_params.display = e.deck.visible ? 'block' : 'none';

		$(e.deck.domElement).css(_params);

		for(i in e.cards) {
			var _card_position = e.deck.padding(i);
			var _params = {
				left      : share.zoom * _card_position.x + 'px', 
				top       : share.zoom * _card_position.y + 'px',
				zIndex    : e.params.startZIndex + (i|0),
			    '-ms-transform'     : 'rotate(' + (e.params.rotate|0) + 'deg)',
			    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
			    '-webkit-transform' : 'rotate(' + (e.params.rotate|0) + 'deg)',
			    '-moz-transform'    : 'rotate(' + (e.params.rotate|0) + 'deg)',
				// transform : 'rotate(' + (e.params.rotate|0) + 'deg)'
			};
			_params.display = e.deck.visible ? 'block' : 'none';

			// e.deck.checkFlip(e.cards[i], i|0, e.cards.length|0);
			
			if(e.cards[i].flip) {
				$(e.cards[i].domElement).addClass('flip');
			} else {
				$(e.cards[i].domElement).removeClass('flip');
			}
			$(e.cards[i].domElement).css(_params);
		}

	});
	
	main.event.listen('addCardEl', function(e) {

		// console.log('addCardEl', e);

		e.domElement = $('<div>').addClass('el card draggable').addClass(e.name);
		var _params = {
			width  : share.zoom * share.card.width + 'px',
			height : share.zoom * share.card.height + 'px'
		}
		$(e.domElement).css(_params).attr({id: e.id});
		$(share.field.domElement).append(e.domElement);
	});

	main.event.listen('moveDragDeck', function(e) {
		// console.log('moveDragDeck', e);
		share.curLock();
		for(i in e.moveDeck) {
			var _position = e.destination.padding(e.destination.getCards().length - 1 + (i|0));
			             // e.destination.padding(e.moveDeck[i].index);
			var _params = {
				left      : share.zoom * _position.x + 'px', 
				top       : share.zoom * _position.y + 'px',
				// transform : 'rotate(0deg)'
			};
			var a = e.departure.rotate, b = e.destination.rotate;
			if(Math.abs(a - b) > 180) if(a > b) {a = a - 360} else {b = b - 360};
			// console.log('rotate', a, b)
			$({deg: a, e : e}).animate({deg: b}, {
			  duration: share.animationTime,
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
			$(e.moveDeck[i].card.domElement).animate(_params, share.animationTime, function() {
				e.departure.Redraw();
				e.destination.Redraw();
			});
		}
		$('.draggable').promise().done(function(){
		    share.curUnLock();
		    main.event.dispatch('moveDragDeckDone', {deck : e.destination});
		});
	});

	main.event.listen('moveCardToHome', function(e) {
		//  Move card home
		// console.log('Move card home', e);
		share.curLock();
	    for(i in e.moveDeck) {
	    	var _position = e.departure.padding(e.moveDeck[i].index);
	    	var _params = {
	    		left : _position.x + 'px',
	    		top  : _position.y + 'px'
	    	}
	    	$(e.moveDeck[i].card.domElement).animate(_params, share.animationTime);
	    }
    	$('.draggable').promise().done(function(){
		    share.curUnLock();
		});
	    
		$('.draggable').promise().done(function() {
			
			// console.log(_deck_departure, _deck_destination);
			if(e.departure) {
				e.departure.Redraw();
			}
			/*if(_deck_destination) {
				_deck_destination.Redraw();
			}*/
		});
	})
	
	main.event.listen('moveDragDeckDone', function(e) {
		
		if(!e.deck.fill) return;
		
		var _deck = e.deck.getCards();
		for(i in _deck) {
			$(_deck[i].domElement).addClass('fill');
		}
	});

};