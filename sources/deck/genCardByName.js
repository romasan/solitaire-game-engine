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

	let _name = common.validateCardName(name);// {color, rank}
	
	if(_name) {

		let _id = 'card_' + common.genId();

		let _card = {
			id      : _id    ,
			name    : name   ,
			type    : 'card' ,
			visible : true   ,
			flip    : false  ,
			parent  : this.id
		};
		
		event.dispatch('addCardEl', _card);
		
		let _elements = share.get('elements');
		_elements[_id] = _card;
		share.set('elements', _elements);
		
		this.Push([_card]);
		this.flipCheck();
		this.Redraw();

		return _card;
	}
	
	return false;
};