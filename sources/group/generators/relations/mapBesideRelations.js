'use strict';

import mapRelationsCommon from 'mapRelationsCommon';

var getBeside = (x, y, mapSize, map, el, type)=>{

	if(typeof el[type] == "string") {

		switch(el[type]) {
			case 'left':
				return mapRelationsCommon.exist(x + mapRelationsCommon.beSide.left.x, y + mapRelationsCommon.beSide.left.y, mapSize, map)
			 		? map[y + mapRelationsCommon.beSide.left.y][x + mapRelationsCommon.beSide.left.x].name
			 		: null;
			case 'rigth':
				return mapRelationsCommon.exist(x + mapRelationsCommon.beSide.rigth.x, y + mapRelationsCommon.beSide.rigth.y, mapSize, map)
			 		? map[y + mapRelationsCommon.beSide.rigth.y][x + mapRelationsCommon.beSide.rigth.x].name
			 		: null;
			case 'up':
				return mapRelationsCommon.exist(x + mapRelationsCommon.beSide.up.x, y + mapRelationsCommon.beSide.up.y, mapSize, map)
			 		? map[y + mapRelationsCommon.beSide.up.y][x + mapRelationsCommon.beSide.up.x].name
			 		: null;
			case 'down':
				return mapRelationsCommon.exist(x + mapRelationsCommon.beSide.down.x, y + mapRelationsCommon.beSide.down.y, mapSize, map)
			 		? map[y + mapRelationsCommon.beSide.down.y][x + mapRelationsCommon.beSide.down.x].name
			 		: null;
			default: return el[type].name;
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