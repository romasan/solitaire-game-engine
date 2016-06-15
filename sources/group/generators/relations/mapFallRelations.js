'use strict';

import mapRelationsCommon from 'mapRelationsCommon';

// map froup generator fall relations

// const directions = [
// 	'left' ,
// 	'rigth',
// 	'up'   ,
// 	'down'
// ];

const opposite = [
	// ['left', 'right'],
	// ['up'  , 'down' ]
	{left  : 'right'},
	{right : 'left' },
	{up    : 'down' },
	{down  : 'up'   }
];

export default (e)=>{// {x, y, map, mapSize, el, data}

	var _relations = [];

	let _directions = [];
	for(let i in e.data.directions) {
		if(
			_directions.indexOf(e.data.directions[i]) < 0          // этого направления ещё не было
		 && _directions.indexOf(opposite[e.data.directions[i]]) < 0// противоположного направления тоже не было
		) {
			_directions.push(e.data.directions[i]);
		}
	}
	
	for(let i in _directions) {
		switch(_directions[i]) {
			case 'left' :
				var x = (e.x|0) + mapRelationsCommon.beSide.left.x,
					y = (e.y|0) + mapRelationsCommon.beSide.left.y;
				if(mapRelationsCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'left',
						to        : e.map[y][x].name
					});
				}
				break;
			case 'right':
				var x = (e.x|0) + mapRelationsCommon.beSide.right.x,
					y = (e.y|0) + mapRelationsCommon.beSide.right.y;
				if(mapRelationsCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'right',
						to        : e.map[y][x].name
					});
				}
				break;
			case 'up'   :
				var x = (e.x|0) + mapRelationsCommon.beSide.up.x,
					y = (e.y|0) + mapRelationsCommon.beSide.up.y;
				if(mapRelationsCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'up',
						to        : e.map[y][x].name
					});
				}
				break;
			case 'down' :
				var x = (e.x|0) + mapRelationsCommon.beSide.down.x,
					y = (e.y|0) + mapRelationsCommon.beSide.down.y;
				if(mapRelationsCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'down',
						to        : e.map[y][x].name
					});
				}
				break;
		}
	}

	return _relations;
}