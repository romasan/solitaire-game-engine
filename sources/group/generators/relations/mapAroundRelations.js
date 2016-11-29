'use strict';

import mapCommon from 'mapCommon';

export default data => {// {x, y, map, mapSize, el, data}

	let _relations = [];

	for(let i in mapCommon.aroundRelations) {

		if(
			mapCommon.inMap(
				data.x + mapCommon.aroundRelations[i].x,
				data.y + mapCommon.aroundRelations[i].y, data.mapSize
			) &&
			data.map[data.y + mapCommon.aroundRelations[i].y][data.x + mapCommon.aroundRelations[i].x]
		) {
			_relations.push({
				to   : data.map[data.y + mapCommon.aroundRelations[i].y][data.x + mapCommon.aroundRelations[i].x].name,
				type : mapCommon.aroundRelations[i].type                                                     ,
				id   : mapCommon.aroundRelations[i].id                                                       ,
				name : 'around'
			});
		}
	}

	return _relations;
}