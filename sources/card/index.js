'use strict';

import common   from '../common'         ;
import event    from '../common/event'   ;
import share    from '../common/share'   ;
import defaults from '../common/defaults';

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
		
		let validatedCard = this.validateCardName(name); // {color, rank}

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
	}

	static validateCardName(name) {

		if(typeof name != 'string') {

			console.warn('Warning: validate name must have string type "' + name + '"', name);

			return false;
		}

		let suit  = name.slice(0, 1)                                       ,
		    rank  = name.slice(1, 3)                                       ,
		    color = null                                                   ,
		    value = defaults.card.values[defaults.card.ranks.indexOf(rank)];

		for(let colorName in defaults.card.colors) {
			if(defaults.card.colors[colorName].indexOf(suit) >= 0) {
				color = colorName;
			}
		}

		if(
			defaults.card.suits.indexOf(suit) >= 0 &&
			defaults.card.ranks.indexOf(rank) >= 0
		) {
			return {
				"color" : color,
				"value" : value,
				"name"  : name ,
				"suit"  : suit , 
				"rank"  : rank
			}
		} else {

			console.warn('Warning: validate name:', name, '- incorrect');

			return false;
		}
	}
}

export default cardClass;