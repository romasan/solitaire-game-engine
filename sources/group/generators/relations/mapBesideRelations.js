'use strict';

import mapRelationsCommon from 'mapRelationsCommon';

let getBeside = (_x, _y, mapSize, map, el, type)=>{

	if(typeof el[type] == "string") {

		switch(el[type]) {
			case 'left':
				let x = _x + mapRelationsCommon.beSide.left.x,
					y = _y + mapRelationsCommon.beSide.left.y;
				return mapRelationsCommon.exist(x, y, mapSize, map)
			 		? map[y][x].name
			 		: null;
			case 'rigth':
				let x = _x + mapRelationsCommon.beSide.rigth.x,
					y = _y + mapRelationsCommon.beSide.rigth.y;
				return mapRelationsCommon.exist(x, y, mapSize, map)
			 		? map[y][x].name
			 		: null;
			case 'up':
				let x = _x + mapRelationsCommon.beSide.up.x,
					y = _y + mapRelationsCommon.beSide.up.y;
				return mapRelationsCommon.exist(x, y, mapSize, map)
			 		? map[y][x].name
			 		: null;
			case 'down':
				let x = _x + mapRelationsCommon.beSide.down.x,
					y = _y + mapRelationsCommon.beSide.down.y;
				return mapRelationsCommon.exist(x, y, mapSize, map)
			 		? map[y][x].name
			 		: null;
			default:
				return null;
		}
	};
	return null;
};

export default (e)=>{// {x, y, map, mapSize, el, data}

	let _relations = [];

	var _next = getBeside(e.x, e.y, e.mapSize, e.map, e.el, 'next') && (
		_relations.push({name: 'next', to: _next})
	);
	var _prev = getBeside(e.x, e.y, e.mapSize, e.map, e.el, 'prev') && (
		_relations.push({name: 'prev', to: _prev})
	);

	return _relations;
};