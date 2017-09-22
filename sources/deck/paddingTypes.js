'use strict';

import share    from '../common/share'   ;
import defaults from '../common/defaults';
import common   from '../common'         ;

/*

Types:

 * _default
 * vertical
 * horizontal
 * roller

 */

let paddingTypes = {

	/**
	 * Deafult padding
	 * @param {*} params - deck state.params
	 * @param {*} card
	 * @param {number} index
	 * @param {number} length
	 * @param {*[]} deck - cards list
	 */
	"_default" : (state, index) => {

		// console.log('_default', {params, card, index, length, deck});

		let y = 0,
		    x = 0;

		for (let i = 0; i < index; i += 1) {
			y += state.cards[i].flip ? state.flipPadding.y : state.padding.y;
			x += state.cards[i].flip ? state.flipPadding.x : state.padding.x;
		}

		return {
			"x" : x,
			"y" : y
		};
	},

	"afterFlip" : (state, index, value) => {

		const card = state.cards[index];		

		let _padding = paddingTypes._default(state, index, value);

		let _plus = {
			"x" : 0,
			"y" : 0
		};

		let _data = value ? value.split(':') : [];

		if (_data.length > 1) {

			if (_data[0] == "x") {
				_plus.x = _data[1] | 0;	
			} else if (_data[0] == "y") {
				_plus.y = _data[1] | 0;	
			} else if (_data[0] == "xy") {
				_plus.x = _data[1] | 0;
				_plus.y = _data[2] | 0;
			}
		} else {
			_plus.x = _data[0] | 0;
		}

		if (card.flip == false) {
			_padding.x += _plus.x;
			_padding.y += _plus.y;
		}

		return _padding;
	},

	// "none" : (params, card, index, length, deck) => {
	// 	return {
	// 		"x" : params.x,
	// 		"y" : params.y
	// 	};
	// },

	// "last_three_min" : (params, card, index, length, deck) => {}

	// "radial" : (params, card, index, length, deck) => {
	// 	let _depth  = 1,
	// 	_radius = index * _depth,
	// 	// _step   = 180 / 16,
	// 	// _card   = defaults.card,
	// 	_angle  = params.rotate,//_step / 2 + 270;
	// 	_deg    = Math.PI / 180,
	// 	_a      = Math.sin(_angle * _deg) * _radius,
	// 	_b      = Math.cos(_angle * _deg) * _radius;
	// 	// if (_angle > 360) _angle -= 360;
	// 	return {
	// 		"x" : params.x + _a,
	// 		"y" : params.y - _b
	// 	};
	// },

	"vertical": (state, index, value) => {

		state.padding.x     = state.padding.x     ? state.padding.x     : 0 ;
		state.padding.y     = state.padding.y     ? state.padding.y     : 15;
		state.flipPadding.x = state.flipPadding.x ? state.flipPadding.x : 0 ;
		state.flipPadding.y = state.flipPadding.y ? state.flipPadding.y : 5 ;

		return paddingTypes._default(state, index, value);
	},

	"horizontal": (state, index, value) => {

		state.padding.x     = state.padding.x     ? state.padding.x     : 10;
		state.padding.y     = state.padding.y     ? state.padding.y     : 0 ;
		state.flipPadding.x = state.flipPadding.x ? state.flipPadding.x : 5 ;
		state.flipPadding.y = state.flipPadding.y ? state.flipPadding.y : 0 ;

		return paddingTypes._default(state, index, value);
	},

	"roller": (state, index, value) => {
	// "roller": (params, card, index, length, deck, data) => {
		// data: "open,group,padding"
		// flipRule: "topUnflip:open"

		const card = state.cards[index];

		let _data   =   value.split(',') ,
		    open    =  _data[0] | 0     , // open cards count
		    group   = (_data[1] | 0) > 0  // closed cards group count
		    	? _data[1] | 0
		    	: 1,
		    padding = _data[2] | 0;       // padding

		let correct = 0;

		if (
			index     >= length - open && // delimiter and after
			card.flip == false            // closed cards
		) {

			return {
				"x" : defaults.card.width + padding + ((index - length + open - correct) * state.padding.x),
				"y" : (index - length + open) * state.padding.y
			}
		} else {                          // before delimiter

			if (index >= length - open) {
				correct += 1;
			}

			return {
				"x" : state.flipPadding.x * ((index / group) | 0),
				"y" : state.flipPadding.y * ((index / group) | 0)
			}
		} 

		return {
			"x" : 0,
			"y" : 0
		};
	},

	"puffed": (state, index, value) => {

		let group = (value | 0) > 0 ? (value | 0) : 1; 

		return {
			"x" : state.flipPadding.x * ((index / group) | 0),
			"y" : state.flipPadding.y * ((index / group) | 0)
		}
	}
};

export default paddingTypes;