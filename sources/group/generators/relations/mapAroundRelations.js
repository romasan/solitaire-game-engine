'use strict';

import mapCommon from 'mapCommon';

export default (e) => {// {x, y, map, mapSize, el, data}

	let _relations = [];

	for(let i in mapCommon.aroundRelations) {

		if(
			mapCommon.inMap(e.x + mapCommon.aroundRelations[i].x, e.y + mapCommon.aroundRelations[i].y, e.mapSize)
		 && e.map[e.y + mapCommon.aroundRelations[i].y][e.x + mapCommon.aroundRelations[i].x]
		) {
			_relations.push({
				name : 'around',
				type : mapCommon.aroundRelations[i].type,
				id   : mapCommon.aroundRelations[i].id,
				to   : e.map[e.y + mapCommon.aroundRelations[i].y][e.x + mapCommon.aroundRelations[i].x].name
			});
			
		}
	}

	return _relations;
}