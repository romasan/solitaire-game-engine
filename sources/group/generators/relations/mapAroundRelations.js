'use strict';

import mapRelationsCommon from 'mapRelationsCommon';

// --

// IDs             TYPEs
// CLT TOP CRT ... CORN SIDE CORN
// LFT     RGT ... SIDE      SIDE
// CLB BTM CRB ... CORN SIDE CORN
const aroundRelations = [
	{x: -1, y: -1, type: 'corn', id: 'clt'},
	{x:  0, y: -1, type: 'side', id: 'top'},
	{x:  1, y: -1, type: 'corn', id: 'crt'},
	
	{x: -1, y:  0, type: 'side', id: 'lft'},
	{x:  1, y:  0, type: 'side', id: 'rgt'},

	{x: -1, y:  1, type: 'corn', id: 'clb'},
	{x:  0, y:  1, type: 'side', id: 'btm'},
	{x:  1, y:  1, type: 'corn', id: 'crb'}
];

// --

export default (x, y, map, mapSize)=>{

	let _relations = [];

	for(let i in aroundRelations) {

		if(
			mapRelationsCommon.inMap(x + aroundRelations[i].x, y + aroundRelations[i].y, mapSize)
		 && map[y + aroundRelations[i].y][x + aroundRelations[i].x]
		) {
			_relations.push({
				name : 'around',
				type : aroundRelations[i].type,
				id   : aroundRelations[i].id,
				to   : map[y + aroundRelations[i].y][x + aroundRelations[i].x].name
			});
			
		}
	}

	return _relations;
}