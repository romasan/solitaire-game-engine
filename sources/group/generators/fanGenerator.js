/*
 * сгенерировать группу для полумесяца
 */

'use strict';

import defaults from 'defaults';

export default (group, data) => {

	// {
	// 	type   : "fan",
	// 	count  : int,
	// 	radius : int,
	// 	center : {
	// 		x : int,
	// 		y : int
	// 	}
	// }

	group.placement = {
		x : 0,
		y : 0
	};

	//              b
	//       C  ..`:   A = sin(b) * C
	//     ...``   :B  B = cos(b) * C
	// a.``.......+:
	//        A     y 90deg

	let _decks  = [];
	let _count  = typeof data.count == "number" ? data.count : 3;//16
	let _step   = 180 / _count;
	let _radius = typeof data.radius == "number" ? data.radius : 100;//405;
	let _center = 
		typeof data.center   != "undefined" && 
		typeof data.center.x != "undefined" && 
		typeof data.center.y != "undefined"
			? data.center 
			: {
				"x" : 0,
				"y" : 0
			};
	let _angle  = _step / 2 + 270;
	let _deg    = Math.PI / 180;

	for(let deckIndex = 0; deckIndex < _count; deckIndex += 1) {

		let _a = Math.sin(_angle * _deg) * _radius;
		let _b = Math.cos(_angle * _deg) * _radius;
		if(_angle > 360) _angle -= 360;
		_decks.push({
			"name"     : group.name + "_deck" + deckIndex,
			"rotate"   : _angle,
			"position" : {
				"x" : _center.x + _a - defaults.card.width  / 2,
				"y" : _center.y - _b - defaults.card.height / 2
			}
		});
		_angle += _step;
	}

	return _decks;
};