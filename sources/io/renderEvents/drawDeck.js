'use strict';

import {event, share, defaults} from '../../common'                   ;

import Field                    from '../../field'                    ;
import {elRender}               from '../dom'                         ;
import applyChangedParameters   from './common/applyChangedParameters';

/**
 * addDeckEl - Listener
 */
event.listen('addDeckEl', data => {

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
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

	if (data.deckData.showSlot) {
		elRender(_deckDomElement)
			.addClass('slot');
	}

	if (data.deckData.class) {
		elRender(_deckDomElement)
			.addClass(data.deckData.class);
	}

	let _fieldDomElement = share.get('domElement:field');

	if (_fieldDomElement) {
		elRender(_fieldDomElement)
			.append(_deckDomElement);
	}

	share.set('domElement:' + data.deck.id, _deckDomElement);
});

/**
 * addDeckEl - Listener
 */
event.listen('redrawDeckFlip', data => {

	if (!data || !data.cards) {
		return;
	}

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	for (let i in data.cards) {

		let _params = {};

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		if (data.cards[i].flip) {
			_cardDomElement.addClass('flip');
		} else {
			_cardDomElement.removeClass('flip');
		}

		_cardDomElement.css(_params);
	}
});

/**
 * redrawDeckIndexes - Listener
 */
event.listen('redrawDeckIndexes', data => {

	if (
		!data       ||
		!data.cards
	) {
		return;
	}

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	for (let i in data.cards) {

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		_cardDomElement.css({
			"z-index" : (defaults.startZIndex | 0) + (i | 0)
		});
	}
});

/**
 * redrawDeck - Listener
 */
event.listen('redrawDeck', data => {

	if (share.get('noRedraw')) {
		return false;
	}

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	const ignore_visibility = data.deck.hasTag('ignore_visibility');
	
	if (
		data          &&
		data.deckData &&
		data.deck     &&
		data.params
	) {
		applyChangedParameters(data);
	}

	const zoom = share.get('zoom');
	
	// перерисовка стопки
	let _params = {
		"transform" : 'rotate(' + (data.params.rotate | 0) + 'deg)'            ,
		"left"      :              data.params.x * zoom + 'px'                 ,
		"top"       :              data.params.y * zoom + 'px'                 ,
		"width"     :       defaults.card.width  * zoom + 'px'                 ,
		"height"    :       defaults.card.height * zoom + 'px'                 ,
		"display"   : data.deck.visible || ignore_visibility ? 'block' : 'none'
	};

	let _deckDomElement = share.get('domElement:' + data.deck.id);

	elRender(_deckDomElement)
		.css(_params);

	// full deck (add class full to all cards in deck)
	
	let _cards = data.deck.getCards();

	let openCount   = 0,
	    hiddenCount = 0;

	for (let i in data.cards) {

		const card = data.cards[i];
		
		let _cardDomElement = share.get('domElement:' + card.id);

		if (ignore_visibility) {

			if (card.visible && card.flip == false) {
				openCount += 1;
			}

			if (card.visible == false) {
				hiddenCount += 1;
			}
		}
		
		if (_cardDomElement) {
			
			if (data.deck.full) {
				elRender(_cardDomElement)
					.addClass('full');
			} else {
				elRender(_cardDomElement)
					.removeClass('full');
			}
		}
	}

	// перерисовка карт
	for (let i in data.cards) {

		const card = data.cards[i];

		let _card_position = data.deck.padding(i);
		let _zIndex        = (data.params.startZIndex | 0) + (i | 0);

		let _params = {
			"-ms-transform"     : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"-webkit-transform" : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"-moz-transform"    : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"transform"         : 'rotate(' + (data.params.rotate | 0) + 'deg)',
			"left"              :     _card_position.x * zoom + 'px'           ,
			"top"               :     _card_position.y * zoom + 'px'           ,
			"width"             : defaults.card.width  * zoom + 'px'           ,
			"height"            : defaults.card.height * zoom + 'px'           ,
			"z-index"           : (
				ignore_visibility
					? (card.visible
						? _zIndex + hiddenCount + openCount
						: data.cards.length - _zIndex + (data.params.startZIndex | 0) * 2 - 1
					) 
					: _zIndex
			),
			"display"           : (data.deck.visible && data.cards[i].visible) || ignore_visibility
			                    	? 'block'
			                    	: 'none'
		};

		let _cardDomElement = share.get('domElement:' + data.cards[i].id);

		if (data.cards[i].flip) {

			elRender(_cardDomElement)
				.addClass('flip');
		} else {

			elRender(_cardDomElement)
				.removeClass('flip');
		}
		
		for (let _class in data.cards[i].classList) {

			if (data.cards[i].classList[_class] === true) {

				elRender(_cardDomElement)
					.addClass(_class);
			} else {

				elRender(_cardDomElement)
					.removeClass(_class);
			}
		}

		// elRender(_cardDomElement)
		// 	.css(_params);
		for (let paramName in _params) {
			_cardDomElement.el.style[paramName] = _params[paramName];
		}
	}
});

/**
 * updateNextCards - Listener
 */
event.listen('updateNextCards', function(data) {

	for (let deckId in data) {

		let _cardDomElement = share.get('domElement:' + deckId);

		let _cards = data[deckId];

		let _content = '';
		
		let oneRank = _cards.every(function(e) {
			return e.rank == this.rank;
		}, _cards[0]);

		if (oneRank) {
			// _content = defaults.card.names[share.get('locale')][defaults.card.ranks.indexOf(_cards[0].rank)];
			// _content = _cards[0].rank.toUpperCase();
			_content = _cards.length
				? defaults.card.aliases[defaults.card.ranks.indexOf(_cards[0].rank)]
				: '';
		} else {
			_content = data[deckId].map(e => e.name).join(', ').toUpperCase();
		}

		elRender(_cardDomElement).attr({
			"data-content" : _content
		});
	}
});