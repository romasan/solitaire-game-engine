'use strict';

import mapCommon from 'mapCommon';

// map froup generator fall relations

// const directions = [
// 	'left' ,
// 	'rigth',
// 	'up'   ,
// 	'down'
// ];

const opposite = [
	{"left"  : 'right'},
	{"right" : 'left' },
	{"up"    : 'down' },
	{"down"  : 'up'   }
];

export default data => {// {x, y, map, mapSize, el, data}

	let _relations = [];

	let _directions = [];
	
	for(let i in data.data.directions) {
		if(
			!_directions.indexOf(data.data.directions[i])           >= 0 && // этого направления ещё не было
			!_directions.indexOf(opposite[data.data.directions[i]]) >= 0    // противоположного направления тоже не было
		) {
			_directions.push(data.data.directions[i]);
		}
	}
	
	for(let i in _directions) {

		let x = null,
		    y = null;

		switch(_directions[i]) {
			
			case 'left' :
			
				x = (data.x | 0) + mapCommon.beSide.left.x;
				y = (data.y | 0) + mapCommon.beSide.left.y;
			
				if(mapCommon.exist(x, y, data.mapSize, data.map)) {
					_relations.push({
						"name"      : 'fall',
						"direction" : 'left',
						"to"        : data.map[y][x].name
					});
				}
			
				break;
			
			case 'right':
			
				x = (data.x | 0) + mapCommon.beSide.right.x;
				y = (data.y | 0) + mapCommon.beSide.right.y;
			
				if(mapCommon.exist(x, y, data.mapSize, data.map)) {
					_relations.push({
						"name"      : 'fall',
						"direction" : 'right',
						"to"        : data.map[y][x].name
					});
				}
			
				break;
			
			case 'up'   :
			
				x = (data.x | 0) + mapCommon.beSide.up.x;
				y = (data.y | 0) + mapCommon.beSide.up.y;
			
				if(mapCommon.exist(x, y, data.mapSize, data.map)) {
					_relations.push({
						"name"      : 'fall',
						"direction" : 'up',
						"to"        : data.map[y][x].name
					});
				}
			
				break;
			
			case 'down' :
			
				x = (data.x | 0) + mapCommon.beSide.down.x;
				y = (data.y | 0) + mapCommon.beSide.down.y;
			
				if(mapCommon.exist(x, y, data.mapSize, data.map)) {
					_relations.push({
						"name"      : 'fall',
						"direction" : 'down',
						"to"        : data.map[y][x].name
					});
				}
			
				break;
		}
	}

	return _relations;
}