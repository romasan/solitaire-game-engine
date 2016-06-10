'use strict';

import mapRelationsCommon from 'mapRelationsCommon';

const _beSide = {
	left  : {x: -1, y:  0}, 
	right : {x:  1, y:  0}, 
	up    : {x:  0, y: -1}, 
	down  : {x:  0, y:  1} 
};

var getBeside = (x, y, mapSize, map, el, type)=>{

	if(typeof el[type] == "string") {

		switch(el[type]) {
			case 'left':
				return mapRelationsCommon.exist(x + _beSide.left.x, y + _beSide.left.y, mapSize, map)
			 		? map[y + _beSide.left.y][x + _beSide.left.x].name
			 		: null;
			case 'rigth':
				return mapRelationsCommon.exist(x + _beSide.rigth.x, y + _beSide.rigth.y, mapSize, map)
			 		? map[y + _beSide.rigth.y][x + _beSide.rigth.x].name
			 		: null;
			case 'up':
				return mapRelationsCommon.exist(x + _beSide.up.x, y + _beSide.up.y, mapSize, map)
			 		? map[y + _beSide.up.y][x + _beSide.up.x].name
			 		: null;
			case 'down':
				return mapRelationsCommon.exist(x + _beSide.down.x, y + _beSide.down.y, mapSize, map)
			 		? map[y + _beSide.down.y][x + _beSide.down.x].name
			 		: null;
			default: return el[type].name;
		}
	};
	return null;
};

export default (x, y, map, mapSize, el)=>{

	let _relations = [];

	var _next = getBeside(x, y, mapSize, map, el, 'next') && (
		_relations.push({name: 'next', to: _next})
	);
	var _prev = getBeside(x, y, mapSize, map, el, 'prev') && (
		_relations.push({name: 'prev', to: _prev})
	);

	return _relations;
};