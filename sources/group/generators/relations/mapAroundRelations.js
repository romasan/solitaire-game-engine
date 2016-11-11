'use strict';

import mapCommon from 'mapCommon';

export default (e) => {// {x, y, map, mapSize, el, data}

	let _relations = [];

	for(let i in mapCommon.aroundRelations) {

		if(
			mapCommon.inMap(
				e.x + mapCommon.aroundRelations[i].x,
				e.y + mapCommon.aroundRelations[i].y, e.mapSize
			) &&
			e.map[e.y + mapCommon.aroundRelations[i].y][e.x + mapCommon.aroundRelations[i].x]
		) {
			_relations.push({
				to   : e.map[e.y + mapCommon.aroundRelations[i].y][e.x + mapCommon.aroundRelations[i].x].name,
				type : mapCommon.aroundRelations[i].type                                                     ,
				id   : mapCommon.aroundRelations[i].id                                                       ,
				name : 'around'
			});
		}
	}

	return _relations;
}