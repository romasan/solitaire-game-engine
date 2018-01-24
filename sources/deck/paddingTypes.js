'use strict';

import share    from '../common/share'   ;
import defaults from '../common/defaults';
import common   from '../common'         ;

let paddingTypes = {

	"_backup" : {},

	"_add" : (name, rule, overwrite = false) => {

		// console.log('Add padding rule:', name, 'overwrite', overwrite);

		let _break = false;

		if (typeof name != "string") {
			console.warn('incorrect rule name (not string)');
			_break = true;
		}

		if (typeof rule != "function") {
			console.warn('incorrect rule (not function)');
			_break = true;
		}

		if (_break) {
			return;
		}

		if (paddingTypes[name] && overwrite === false) {
			console.warn('rule', name, 'exist in padding types');
			return;
		}

		if (overwrite) {
			paddingTypes._backup[name] = paddingTypes[name];
		}

		paddingTypes[name] = (...args) => {

			try {
				return rule(...args);
			} catch (e) {

				console.warn('rule', name, 'is incorrect, replace to default rule');

				if (overwrite && paddingTypes._backup[name]) {
					paddingTypes[name] = paddingTypes._backup[name];	
				} else {
					paddingTypes[name] = (...args) => {
						return paddingTypes._default(...args);
					};
				}

				return paddingTypes._default(...args);
			}
		};
	},

	"_default" : (params, card, index, length, deck) => {

		// console.log('_default', {params, card, index, length, deck});

		let _y = params.y,
		    _x = params.x;

		for (let i = 0; i < index; i += 1) {
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

	"vertical": (params, card, index, length, deck) => {

		let _params = {};

		for (let name in params) {
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

		for (let name in params) {
			_params[name] = params[name];
		}

		_params.padding_x      = 10;
		_params.padding_y      = 0 ;
		_params.flip_padding_x = 5 ;
		_params.flip_padding_y = 0 ;

		return paddingTypes._default(_params, card, index, length, deck);
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