'use strict';

import event                  from 'event'                 ;
import share                  from 'share'                 ;
import defaults               from 'defaults'              ;

import Field                  from 'field'                 ;
import elRender               from 'elRender'              ;
import applyChangedParameters from 'applyChangedParameters';

/*
 * addDeckEl
 * redrawDeckFlip
 * redrawDeckIndexes
 * redrawDeck
 */

event.listen('addDeckEl', data => {

	if(share.get('nodraw')) {

		if(data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	applyChangedParameters(data);

	let _deckDomElement = 
		elRender('<div>');

	let _params = {
		"transform" : 'rotate(' + (data.params.rotate | 0) + 'deg)'    ,
		"left"      :              data.params.x           + 'px'      ,
		"top"       :              data.params.y           + 'px'      ,
		"width"     :              defaults.card.width     + 'px'      ,
		"height"    :              defaults.card.height    + 'px'      ,
		"display"   :              data.deck.visible ? 'block' : 'none'
	};

	elRender(_deckDomElement)
		.css(_params)
		.addClass('el')
		.attr({
			"id" : data.deck.id
		})
		.setAttribute('data-content', data.deckData.label);

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

event.listen('redrawDeckFlip', data => {

	if(!data || !data.cards) {
		return;
	}

	if(share.get('nodraw')) {

		if(data && typeof data.callback == "function") {
			data.callback();
		}

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

event.listen('redrawDeckIndexes', data => {

	if(
		!data       ||
		!data.cards
	) {
		return;
	}

	if(share.get('nodraw')) {

		if(data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	for(let i in data.cards) {

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		_cardDomElement.css({
			"z-index" : (defaults.startZIndex | 0) + (i | 0)
		});
	}
});

event.listen('redrawDeck', data => {

	if(share.get('noRedraw')) {
		return false;
	}

	if(share.get('nodraw')) {

		if(data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	if(
		data          &&
		data.deckData &&
		data.deck     &&
		data.params
	) {
		applyChangedParameters(data);
	}

	// перерисовка стопки
	let _params = {
		"transform" : 'rotate(' + (data.params.rotate | 0) + 'deg)',
		"left"      : data.params.x + 'px'                         ,
		"top"       : data.params.y + 'px'                         ,
		"display"   : data.deck.visible ? 'block' : 'none'
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


	// перерисовка карт
	for(let i in data.cards) {

		let _card_position = data.deck.padding(i);
		let _zIndex        = (data.params.startZIndex | 0) + (i | 0);

		let _params = {
			"-ms-transform"     : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"-webkit-transform" : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"-moz-transform"    : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"transform"         : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"left"              :              _card_position.x        + 'px'  ,
			"top"               :              _card_position.y        + 'px'  ,
			"z-index"           :              _zIndex                         ,
			"display"           : data.deck.visible && data.cards[i].visible
			                    	? 'block'
			                    	: 'none'
		};

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		if(data.cards[i].flip) {

			elRender(_cardDomElement)
				.addClass('flip');
		} else {

			elRender(_cardDomElement)
				.removeClass('flip');
		}
		
		// console.log(data.cards[i].classList);
		for(let _class in data.cards[i].classList) {

			if(data.cards[i].classList[_class] === true) {

				console.log(data.deck.name, data.cards[i].name, _class);

				elRender(_cardDomElement)
					.addClass(_class);
			} else {

				elRender(_cardDomElement)
					.removeClass(_class);
			}
		}

		// elRender(_cardDomElement)
		// 	.css(_params);
		for(let paramName in _params) {
			_cardDomElement.el.style[paramName] = _params[paramName];
		}
	}
});