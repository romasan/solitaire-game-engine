'use strict';

import common   from '../common'         ;
import event    from '../common/event'   ;
import share    from '../common/share'   ;
import defaults from '../common/defaults';
import Deck     from '../deck'           ;

import React, {Component} from 'react';
import {connect} from 'react-redux';

class cardClass extends Component {

	// constructor(props) {

	// 	super(props);

	// 	this.state = {
	// 		test: 'test'
	// 	};
	// }

	render() {
		
		const {
			id      ,
			name    ,
			flip    ,
			tip     ,
			position,
			visible ,
			rotate  ,
			zoom
		} = this.props;

		const {
			width ,
			height
		} = defaults.card;
		
		const display = visible ? 'block' : 'none';
		
		return <div
			id = {id}
			className={`el card ${name}${flip ? ' flip' : ''}${tip ? ' tip' : ''}`}
			style ={{
				display   : visible ? 'block' : 'none',
				transform : `rotate(${rotate}deg)`    ,
				left      : zoom * position.x + 'px'  ,
				top       : zoom * position.y + 'px'  ,
				width     : zoom * width      + 'px'  ,
				height    : zoom * height     + 'px'
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

		state.type = 'card';

		state.suit  = name.slice(0, 1);
		state.rank  = name.slice(1, 3);
		state.value = defaults.card.values[defaults.card.ranks.indexOf(state.rank)];

		for (let colorName in defaults.card.colors) {
			if (defaults.card.colors[colorName].indexOf(state.suit) >= 0) {
				state.color = colorName;
			}
		}

		state.visible = true;
		state.flip    = false;

		state.position = {
			"x" : 0,
			"y" : 0
		};

		state.offset = {
			"x" : 0,
			"y" : 0
		};

		return state;
	}

	/**
	 * Validate card name
	 * @param {string} name
	 * @param {boolean} init - return card info
	 */
	static validateCardName(name, init = false) {

		if (typeof name != 'string') {

			console.warn('Warning: validate name must have string type "' + name + '"', name);

			return false;
		}

		const suit = name.slice(0, 1),
		      rank = name.slice(1, 3);

		if (
			defaults.card.suits.indexOf(suit) >= 0 &&
			defaults.card.ranks.indexOf(rank) >= 0
		) {
			return !init ? true : {
				"color"  : (e => {

					for (let colorName in defaults.card.colors) {
						if (defaults.card.colors[colorName].indexOf(suit) >= 0) {
							return colorName;
						}
					}

					console.warn('A card with a suit', e, 'does not have a color');
				})(suit),
				"value"  : defaults.card.values[defaults.card.ranks.indexOf(rank)],
				"name"   : name                                                   ,
				"suit"   : suit                                                   ,
				"rank"   : rank
				// "isCard" : true
			};
		} else {

			console.warn('Warning: validate name:', name, '- incorrect');

			return false;
		}
	}
}

export default cardClass;
// export default connect(state => state.toJS())(cardClass);
// export default connect(state => state)(cardClass);
