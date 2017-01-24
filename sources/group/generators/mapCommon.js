'use strict';

/*
 * inMap
 * exist
 * mapSize
 */

const beSide = {
	"left"  : {"x": -1, "y":  0}, 
	"right" : {"x":  1, "y":  0}, 
	"up"    : {"x":  0, "y": -1}, 
	"down"  : {"x":  0, "y":  1} 
};

let inMap = (x, y, mapSize) => 
	x >= 0             &&
	y >= 0             &&
	x < mapSize.width  &&
	y < mapSize.height;

let exist = (x, y, mapSize, map) => 
	inMap(x, y, mapSize) &&
	map[y][x];

let mapSize = map => {

	let _mapSize = {
		"width"  : map[0].length,//MAX LENGTH
		"height" : map   .length
	};

	map.forEach(data => {
		_mapSize.width = Math.max(_mapSize.width, data.length);
	});

	return _mapSize;
};

// IDs             TYPEs
// CLT TOP CRT ... CORN SIDE CORN
// LFT     RGT ... SIDE      SIDE
// CLB BTM CRB ... CORN SIDE CORN
const aroundRelations = [

	{"x": -1, y: -1, "type": 'corn', "id": 'clt'},
	{"x":  0, y: -1, "type": 'side', "id": 'top'},
	{"x":  1, y: -1, "type": 'corn', "id": 'crt'},
	
	{"x": -1, y:  0, "type": 'side', "id": 'lft'},
	{"x":  1, y:  0, "type": 'side', "id": 'rgt'},

	{"x": -1, y:  1, "type": 'corn', "id": 'clb'},
	{"x":  0, y:  1, "type": 'side', "id": 'btm'},
	{"x":  1, y:  1, "type": 'corn', "id": 'crb'}

];

export default {
	beSide         ,
	mapSize        ,
	inMap          ,
	aroundRelations,
	exist
};