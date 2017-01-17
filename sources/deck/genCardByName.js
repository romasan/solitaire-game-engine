'use strict';

import event  from 'event' ;
import share  from 'share' ;
import common from 'common';

// class card {

// 	constructor(e) {
// 		deck.id      = e.id;
// 		deck.name    = e.name;
// 		deck.type    = 'card';
// 		deck.visible = true;
// 		deck.flip    = false;
// 	}

// 	set domElement(e) {

// 	}

// 	get domElement() {
// 		return null;
// 	}
// };

export default (deck, name) => {

	let _name = common.validateCardName(name);// {color, rank}
	
	if(_name) {

		let _id = 'card_' + common.genId();

		let _card = {
			id      : _id    ,
			name    : name   ,
			type    : 'card' ,
			visible : true   ,
			flip    : false  ,
			// filled  : false  ,
			parent  : deck.id
		};
		
		event.dispatch('addCardEl', _card);
		
		let _elements = share.get('elements');
		_elements[_id] = _card;
		share.set('elements', _elements);
		
		deck.Push([_card]);
		deck.flipCheck();
		deck.Redraw();

		return _card;
	}
	
	return false;
};