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
	// ['left', 'right'],
	// ['up'  , 'down' ]
	{left  : 'right'},
	{right : 'left' },
	{up    : 'down' },
	{down  : 'up'   }
];

export default (e) => {// {x, y, map, mapSize, el, data}

	let _relations = [];

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

		let x = null,
		    y = null;

		switch(_directions[i]) {
			
			case 'left' :
			
				x = (e.x|0) + mapCommon.beSide.left.x;
				y = (e.y|0) + mapCommon.beSide.left.y;
			
				if(mapCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'left',
						to        : e.map[y][x].name
					});
				}
			
				break;
			
			case 'right':
			
				x = (e.x|0) + mapCommon.beSide.right.x;
				y = (e.y|0) + mapCommon.beSide.right.y;
			
				if(mapCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'right',
						to        : e.map[y][x].name
					});
				}
			
				break;
			
			case 'up'   :
			
				x = (e.x|0) + mapCommon.beSide.up.x;
				y = (e.y|0) + mapCommon.beSide.up.y;
			
				if(mapCommon.exist(x, y, e.mapSize, e.map)) {
					_relations.push({
						name      : 'fall',
						direction : 'up',
						to        : e.map[y][x].name
					});
				}
			
				break;
			
			case 'down' :
			
				x = (e.x|0) + mapCommon.beSide.down.x;
				y = (e.y|0) + mapCommon.beSide.down.y;
			
				if(mapCommon.exist(x, y, e.mapSize, e.map)) {
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