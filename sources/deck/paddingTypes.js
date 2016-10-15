'use strict';

export default {
	
	none : function(params, card, index, length, deck) {
		return {x : params.x, y : params.y};
	},
	last_three_min : function(params, card, index, length, deck) {
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
			return {x : x, y : y};
		}
	},
	// twindeck_typeA : function(params, card, index, length, deck) {

	// 	var twindeck_max_cards       = 24,
	// 		twindeck_deck_length     = 3;
		
	// 	var _padding = {
	// 		x : 2,
	// 		y : 1
	// 	}

	// 	var _depth = (length / twindeck_max_cards * twindeck_deck_length)|0;
	// 	if(_depth >= twindeck_deck_length) _depth = twindeck_deck_length - 1;

	// 	var _plus = index - (length - _depth - 1);
	// 	if(_plus < 0) _plus = 0;

	// 	return {
	// 		x : params.x + _padding.x * _plus, 
	// 		y : params.y + _padding.y * _plus
	// 	};
	// },
	radial : function(params, card, index, length, deck) {

		let _depth  = 1                                ,
		    _radius = index * _depth                   ,
		    _angle  = params.rotate                    ,
		    _deg    = Math.PI / 180                    ,
		    _a      = Math.sin(_angle * _deg) * _radius,
		    _b      = Math.cos(_angle * _deg) * _radius;

		return {
            x : params.x + _a,
            y : params.y - _b
		};
	},
	special : function(params, card, index, length, deck) {
		
		var _y = params.y, _x = params.x;
		
		for(var i = 0; i < index; i += 1) {
			_y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
			_x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
		}
		return {x : _x, y : _y};
	},
	vertical: function(params, card, index, length, deck) {
		var _y = params.y;
		for(var i = 0; i < index; i += 1) _y += deck[i] && deck[i].flip ? params.flip_padding_y : params.padding_y;
		var _return = {
			x : params.x,
			y : _y
		};
		return _return;
	},
	horizontal: function(params, card, index, length, deck) {
		var _x = params.x;
		for(var i = 0; i < index; i += 1) _x += deck[i] && deck[i].flip ? params.flip_padding_x : params.padding_x;
		var _return = {
			x : _x,
			y : params.y
		};
		return _return;
	}
};