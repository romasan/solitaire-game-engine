'use strict';

import share    from 'share'   ;
import defaults from 'defaults';
import common   from 'common'  ;

/*

Types:

 * _default
 * vertical
 * horizontal
 * roller

 */

let paddingTypes = {

	"_default" : (params, card, index, length, deck) => {

		// console.log('_default', {params, card, index, length, deck});

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

	"afterFlip" : (params, card, index, length, deck, data) => {

		let _padding = paddingTypes._default(params, card, index, length, deck);

		let _plus = {
			"x" : 0,
			"y" : 0
		};

		let _data = data ? data.split(':') : [];

		if(_data.length > 1) {

			if(_data[0] == "x") {
				_plus.x = _data[1] | 0;	
			} else if(_data[0] == "y") {
				_plus.y = _data[1] | 0;	
			} else if(_data[0] == "xy") {
				_plus.x = _data[1] | 0;
				_plus.y = _data[2] | 0;
			}
		} else {
			_plus.x = _data[0] | 0;
		}

		if(card.flip == false) {
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
	// 	// if(_angle > 360) _angle -= 360;
	// 	return {
	// 		"x" : params.x + _a,
	// 		"y" : params.y - _b
	// 	};
	// },

	"vertical": (params, card, index, length, deck) => {

		let _params = {};

		for(let name in params) {
			_params[name] = params[name];
		}

		_params.padding_x      = 0 ;
		_params.padding_y      = 15;
		_params.flip_padding_x = 0 ;
		_params.flip_padding_y = 5 ;

		return paddingTypes._default(_params, card, index, length, deck);
	},

	"horizontal": (params, card, index, length, deck) => {

		let _params = {};

		for(let name in params) {
			_params[name] = params[name];
		}

		_params.padding_x      = 10;
		_params.padding_y      = 0 ;
		_params.flip_padding_x = 5 ;
		_params.flip_padding_y = 0 ;

		return paddingTypes._default(_params, card, index, length, deck);
	},

	"roller": (params, card, index, length, deck, data) => {
		// data: "open,group,padding"
		// flipRule: "topUnflip:open"

		let _data   =   data.split(',') ,
		    open    =  _data[0] | 0     , // open cards count
		    group   = (_data[1] | 0) > 0  // closed cards group count
		    	? _data[1] | 0
		    	: 1,
		    padding = _data[2] | 0;

		let correct = 0;

		if(
			index     >= length - open && // delimiter and after
			card.flip == false            // closed cards
		) {

			return {
				"x" : params.x + (defaults.card.width * share.get('zoom')) + padding + ((index - length + open - correct) * params.padding_x),
				"y" : params.y + (index - length + open) * params.padding_y
			}
		} else {                          // before delimiter

			if(index >= length - open) {
				correct += 1;
			}

			return {
				"x" : params.x + params.flip_padding_x * ((index / group) | 0),
				"y" : params.y + params.flip_padding_y * ((index / group) | 0)
			}
		} 

		return {
			"x" : params.x,
			"y" : params.y
		};
	},

	"puffed": (params, card, index, length, deck, data) => {

		// console.log('puffed', data);

		let group = (data | 0) > 0 ? (data | 0) : 1; 

		return {
			"x" : params.x + params.flip_padding_x * ((index / group) | 0),
			"y" : params.y + params.flip_padding_y * ((index / group) | 0)
		}
	}
};

export default paddingTypes;