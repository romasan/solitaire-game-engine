'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';
import common   from 'common';

import Field    from 'field';
import elRender from 'elRender';

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

	// TODO Переписать на SASS
	/*if(share.get('spriteTexture')) {
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
	}*/

	e.domElement = 
		elRender('<div>')
			// .getEl();
	
	elRender(e.domElement)
		// .addClass(e.name)
		.addClass('el card draggable ' + e.name)
		// .css({'background-size' : null})
		.css(_params)
		.attr({
			id: e.id
		});
	elRender(_field.domElement)
		.append(e.domElement);
});

event.listen('hideCard', function(e) {

	// console.log('hideCard:', e);
	if(e && e.domElement) {
		elRender(e.domElement[0])
			.hide();
	}
});
	
event.listen('showCard', function(e) {

	// console.log('showCard:', e);
	if(e && e.domElement) {
		elRender(e.domElement[0])
			.show();
	}
});