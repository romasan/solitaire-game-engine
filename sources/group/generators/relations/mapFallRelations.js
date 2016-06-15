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
	{left  : 'rigth'},
	{rigth : 'left' },
	{up    : 'down' },
	{down  : 'up'   }
];

export default (e)=>{// {x, y, map, mapSize, el, data}

	var _relations = [];

	let _directions = [];
	for(let i in e.data.directions) {
		if(
			_directions.indexOf(e.data.directions[i]) < 0
		 && _directions.indexOf(opposite[e.data.directions[i]]) < 0
		) {
			_directions.push(e.data.directions[i]);
		}
	}
	for(let i in _directions) {
		switch(_directions[i]) {
			case 'left' :
				let x = (e.x|0) + mapRelationsCommon.beSide.left.x,
					y = (e.y|0) + mapRelationsCommon.beSide.left.y;
				if(mapRelationsCommon.exists(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'left',
						to        : e.map[y][x].name
					});
				}
				break;
			case 'rigth':
				let x = (e.x|0) + mapRelationsCommon.beSide.rigth.x,
					y = (e.y|0) + mapRelationsCommon.beSide.rigth.y;
				if(mapRelationsCommon.exists(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'rigth',
						to        : e.map[y][x].name
					});
				}
				break;
			case 'up'   :
				let x = (e.x|0) + mapRelationsCommon.beSide.up.x,
					y = (e.y|0) + mapRelationsCommon.beSide.up.y;
				if(mapRelationsCommon.exists(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'up',
						to        : e.map[y][x].name
					});
				}
				break;
			case 'down' :
				let x = (e.x|0) + mapRelationsCommon.beSide.down.x,
					y = (e.y|0) + mapRelationsCommon.beSide.down.y;
				if(mapRelationsCommon.exists(x, y, e.mapSize, e.map)) {
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