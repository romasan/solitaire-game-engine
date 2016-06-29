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
		width  : defaults.card.width,
		height : defaults.card.height
	};
	_card = {
		width  : _card.width .toFixed(3) * 1,
		height : _card.height.toFixed(3) * 1
	};

	var _params = {
		"width"  : _card.width  + 'px',
		"height" : _card.height + 'px'
	};

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

	if(e && e.domElement) {
		elRender(e.domElement[0])
			.hide();
	}
});
	
event.listen('showCard', function(e) {

	if(e && e.domElement) {
		elRender(e.domElement[0])
			.show();
	}
});