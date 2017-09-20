'use strict';

import common   from '../common'         ;
import event    from '../common/event'   ;
import share    from '../common/share'   ;
import defaults from '../common/defaults';
import Deck     from '../deck'           ;

import React, {Component} from 'react';

class cardClass extends Component {

	/**
	 * Create card
	 * @param {*} data 
	 */
	// constructor(data) {

	// 	this.type = 'card';

	// 	this.classList = {};

	// 	const values = [
	// 		'id'     ,
	// 		'name'   ,
	// 		'visible',
	// 		'flip'   ,
	// 		'parent' ,
	// 		'color'  ,
	// 		'value'  ,
	// 		'suit'   ,
	// 		'rank'
	// 	];

	// 	for (let i in values) {

	// 		let value = values[i];

	// 		if (typeof data[value] != 'undefined') {
	// 			this[value] = data[value];
	// 		}
	// 	}
	// }

	render() {
		
		const {
			name   ,
			flip   ,
			width  ,
			height ,
			visible
		} = this.props;

		const transform = 'rotate(0deg)';
		// const left      = '284px';
		// const top       = '15px';
		const display   = visible ? 'block' : 'none';

		return <div className={`el card ${name}${flip ? ' flip' : ''}`}
			style ={{
				transform,
				// left     ,
				// top      ,
				width    ,
				height   ,
				display
			}}></div>;
	}

	/**
	 * Init card state part
	 * @param {*} state
	 * @param {function} nextId
	 */
	static init(state, nextId) {

		const {
			name
		} = state;

		state.id = 'card_' + nextId();

		state.suit = name.slice(0, 1);
		state.rank = name.slice(1, 3);
		state.value = defaults.card.values[defaults.card.ranks.indexOf(state.rank)];

		for (let colorName in defaults.card.colors) {
			if (defaults.card.colors[colorName].indexOf(state.suit) >= 0) {
				state.color = colorName;
			}
		}

		state.visible = true;
		state.flip = false;

		return state;
	}

	/**
	 * Generate card by name and add in to deck
	 * @param {Deck} deck 
	 * @param {string} name 
	 * @param {boolean} last 
	 * @returns {cardClass}
	 */
	static genCardByName(deck, name, last = true) {
		
		const {color, value, suit, rank, isCard} = this.validateCardName(name);

		if (isCard) {


			let _card = {
				"id"      : _id    ,
				"name"    : name   ,
				"visible" : true   ,
				"flip"    : false  ,
				"parent"  : deck.id,
				"color"   : color  ,
				"value"   : value  ,
				"suit"    : suit   ,
				"rank"    : rank
			};

			let card = new cardClass(_card);

			event.dispatch('addCardEl', card);

			let _elements = share.get('elements');
			_elements[_id] = card;
			share.set('elements', _elements);

			deck.Push([card]);
			
			if (last) {
				deck.checkFlip();
				deck.Redraw();
			}

			return _card;
		}

		return false;
	}

	/**
	 * Validate card name
	 * @param {string} name 
	 */
	static validateCardName(name) {

		if (typeof name != 'string') {

			console.warn('Warning: validate name must have string type "' + name + '"', name);

			return false;
		}

		let suit  = name.slice(0, 1)                                       ,
		    rank  = name.slice(1, 3)                                       ,
		    color = null                                                   ,
		    value = defaults.card.values[defaults.card.ranks.indexOf(rank)];

		for (let colorName in defaults.card.colors) {
			if (defaults.card.colors[colorName].indexOf(suit) >= 0) {
				color = colorName;
			}
		}

		if (
			defaults.card.suits.indexOf(suit) >= 0 &&
			defaults.card.ranks.indexOf(rank) >= 0
		) {
			return {
				"color"  : color,
				"value"  : value,
				"name"   : name ,
				"suit"   : suit , 
				"rank"   : rank ,
				"isCard" : true
			}
		} else {

			console.warn('Warning: validate name:', name, '- incorrect');

			return false;
		}
	}
}

export default cardClass;