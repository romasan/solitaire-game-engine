'use strict';

import common from 'common';

/*

Types:

 * _default
 * none

 */

let paddingTypes = {

	"_default" : (params, card, index, length, deck) => {

		let _y = params.y,
		    _x = params.x;

		for(let i = 0; i < index; i += 1) {
			_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
			_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
		}

		return {
			"x" : _x,
			"y" : _y
		};
	},

	"none" : (params, card, index, length, deck) => {

		return {
			"x" : params.x,
			"y" : params.y
		};
	},

	// "last_three_min" : (params, card, index, length, deck) => {

	// 	if(index > length - 3) {
	// 		if(length > 3) {
	// 			return {
	// 				"x" : params.x - (length - 3 - index) * 2,
	// 				"y" : params.y - (length - 3 - index)
	// 			};
	// 		} else {
	// 			return {
	// 				"x" : params.x + (index * 2),
	// 				"y" : params.y + (index | 0)
	// 			};
	// 		}
	// 	} else {
	// 		return {
	// 			"x" : x,
	// 			"y" : y
	// 		};
	// 	}
	// },

	// "radial" : (params, card, index, length, deck) => {

	// 	//              b
	// 	//       C  ..`:   A = sin(b) * C
	// 	//     ...``   :B  B = cos(b) * C
	// 	// a.``.......+:
	// 	//        A     y 90deg
	// 	let _depth  = 1,
	// 	_radius = index * _depth,
	// 	// _step   = 180 / 16,
	// 	// _card   = defaults.card,
	// 	_angle  = params.rotate,//_step / 2 + 270;
	// 	_deg    = Math.PI / 180,
	// 	_a      = Math.sin(_angle * _deg) * _radius,
	// 	_b      = Math.cos(_angle * _deg) * _radius;
	// 	// if(_angle > 360) _angle -= 360;

	// 	return {
	// 		"x" : params.x + _a,// - _card.width  / 2,
	// 		"y" : params.y - _b // - _card.height / 2
	// 	};
	// },

	"vertical": (params, card, index, length, deck) => {

		let _params = {};

		for(let name in params) {
			_params[name] = params[name];
		}

		_params.padding_y      = 10;
		_params.flip_padding_y = 5;

		return paddingTypes._default(_params, card, index, length, deck);
	},

	"horizontal": (params, card, index, length, deck) => {

		let _params = {};

		for(let name in params) {
			_params[name] = params[name];
		}

		_params.padding_x      = 10;
		_params.flip_padding_x = 5;

		return paddingTypes._default(_params, card, index, length, deck);
	},


	"roller": (params, card, index, length, deck, data) => {
		console.log('ROLLER PADDING');
		return {
			"x" : params.x,
			"y" : params.y
		};
	}
};

export default  paddingTypes;