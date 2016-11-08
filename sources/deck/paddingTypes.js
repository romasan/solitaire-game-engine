'use strict';

export default {

	none : (params, card, index, length, deck) => {

		return {
			x : params.x,
			y : params.y
		};
	},

	last_three_min : (params, card, index, length, deck) => {

		if(index > length - 3) {
			if(length > 3) {
				return {
					x : params.x - (length - 3 - index) * 2,
					y : params.y - (length - 3 - index)
				};
			} else {
				return {
					x : params.x + (index * 2),
					y : params.y + (index|0)
				};
			}
		} else {
			return {
				x : x,
				y : y
			};
		}
	},
	
	twindeck_typeA : (params, card, index, length, deck) => {

		let twindeck_max_cards       = 24,
			twindeck_deck_length     = 3;

		let _padding = {
			x : 2,
			y : 1
		}

		let _depth = (length / twindeck_max_cards * twindeck_deck_length)|0;
		if(_depth >= twindeck_deck_length) _depth = twindeck_deck_length - 1;

		let _plus = index - (length - _depth - 1);
		if(_plus < 0) _plus = 0;

		return {
			x : params.x + _padding.x * _plus, 
			y : params.y + _padding.y * _plus
		};
	},
	
	radial : (params, card, index, length, deck) => {

		//              b
		//       C  ..`:   A = sin(b) * C
		//     ...``   :B  B = cos(b) * C
		// a.``.......+:
		//        A     y 90deg
		let _depth  = 1,
		_radius = index * _depth,
		// _step   = 180 / 16,
		// _card   = defaults.card,
		_angle  = params.rotate,//_step / 2 + 270;
		_deg    = Math.PI / 180,
		_a      = Math.sin(_angle * _deg) * _radius,
		_b      = Math.cos(_angle * _deg) * _radius;
		// if(_angle > 360) _angle -= 360;

		return {
			x : params.x + _a,// - _card.width  / 2,
			y : params.y - _b // - _card.height / 2
		};
	},
	
	special : (params, card, index, length, deck) => {

		let _y = params.y, _x = params.x;

		for(let i = 0; i < index; i += 1) {
			_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
			_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
		}

		return {
			x : _x,
			y : _y
		};
	},

	vertical: (params, card, index, length, deck) => {

		let _y = params.y;

		for(let i = 0; i < index; i += 1) {
			_y += deck[i] && deck[i].flip
				? params.flip_padding_y
				: params.padding_y;
		}

		let _return = {
			x : params.x,
			y : _y
		};

		return _return;
	},

	horizontal: (params, card, index, length, deck) => {

		let _x = params.x;

		for(let i = 0; i < index; i += 1) {
			_x += deck[i] && deck[i].flip
				? params.flip_padding_x
				: params.padding_x;
		}

		let _return = {
			x : _x,
			y : params.y
		};
		
		return _return;
	}
};