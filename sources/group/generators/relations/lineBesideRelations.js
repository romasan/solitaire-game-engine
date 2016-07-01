'use strict';

import mapCommon from 'mapCommon';

// TODO

// let getBeside = (_x, _y, mapSize, map, el, type)=>{

// 	if(typeof el[type] == "string") {

// 		switch(el[type]) {
// 			case 'left':
// 				var x = _x + mapCommon.beSide.left.x,
// 					y = _y + mapCommon.beSide.left.y;
// 				return mapCommon.exist(x, y, mapSize, map)
// 			 		? map[y][x].name
// 			 		: null;
// 			case 'rigth':
// 				var x = _x + mapCommon.beSide.rigth.x,
// 					y = _y + mapCommon.beSide.rigth.y;
// 				return mapCommon.exist(x, y, mapSize, map)
// 			 		? map[y][x].name
// 			 		: null;
// 			case 'up':
// 				var x = _x + mapCommon.beSide.up.x,
// 					y = _y + mapCommon.beSide.up.y;
// 				return mapCommon.exist(x, y, mapSize, map)
// 			 		? map[y][x].name
// 			 		: null;
// 			case 'down':
// 				var x = _x + mapCommon.beSide.down.x,
// 					y = _y + mapCommon.beSide.down.y;
// 				return mapCommon.exist(x, y, mapSize, map)
// 			 		? map[y][x].name
// 			 		: null;
// 			default:
// 				return null;
// 		}
// 	};
// 	return null;
// };

export default (e)=>{// {x, y, map, mapSize, el, data}

	let _relations = [];

	// var _next = getBeside(e.x, e.y, e.mapSize, e.map, e.el, 'next') && (
	// 	_relations.push({name: 'next', to: _next})
	// );
	// var _prev = getBeside(e.x, e.y, e.mapSize, e.map, e.el, 'prev') && (
	// 	_relations.push({name: 'prev', to: _prev})
	// );

	return _relations;
};