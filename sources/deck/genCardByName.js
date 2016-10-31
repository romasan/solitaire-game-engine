'use strict';

import event  from 'event';
import share  from 'share';
import common from 'common';

// class card {

// 	constructor(e) {
// 		this.id      = e.id;
// 		this.name    = e.name;
// 		this.type    = 'card';
// 		this.visible = true;
// 		this.flip    = false;
// 	}

// 	set domElement(e) {

// 	}

// 	get domElement() {
// 		return null;
// 	}
// };

export default function(name) {// TODO

	var _name = common.validateCardName(name);// {color, rank}
	
	if(_name) {

		var _id = 'card_' + common.genId(),
			_card = {
				id      : _id,
				name    : name,
				type    : 'card',
				// domElement : domElement,
				visible : true,
				// parent  : _parent,
				flip    : false
			}
		_card.parent = this.getId();
		
		event.dispatch('addCardEl', _card);
		
		var _elements = share.get('elements');
		_elements[_id] = _card;
		share.set('elements', _elements);
		
		this.Push([_card]);
		this.flipCheck();
		this.Redraw();

		return _card;
	}
	
	return false;
};