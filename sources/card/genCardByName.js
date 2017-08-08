'use strict';

import event  from 'event' ;
import share  from 'share' ;
import common from 'common';

class cardClass {

	constructor(data) {

		this.type = 'card';

		this.classList = {};

		const values = [
			'id'     ,
			'name'   ,
			'visible',
			'flip'   ,
			'parent' ,
			'color'  ,
			'value'  ,
			'suit'   ,
			'rank'
		];

		for(let i in values) {

			let value = values[i];

			if(typeof data[value] != 'undefined') {
				this[value] = data[value];
			}
		}
	}

	static genCardByName(deck, name, last = true) {
		// TODO
	}

	static validateCardName(name) {
		// TODO
	}
}

let genCardByName = (deck, name, last = true) => {

	let validatedCard = common.validateCardName(name); // {color, rank}

	if(validatedCard) {

		let _id = 'card_' + common.genId();

		let _card = {
			"id"      : _id                ,
			"name"    : name               ,
			"visible" : true               ,
			"flip"    : false              ,
			"parent"  : deck.id            ,
			"color"   : validatedCard.color,
			"value"   : validatedCard.value,
			"suit"    : validatedCard.suit ,
			"rank"    : validatedCard.rank
		};

		let card = new cardClass(_card);

		event.dispatch('addCardEl', card);

		let _elements = share.get('elements');
		_elements[_id] = card;
		share.set('elements', _elements);

		deck.Push([card]);
		
		if(last) {
			deck.checkFlip();
			deck.Redraw();
		}

		return _card;
	}

	return false;
};

export default genCardByName;