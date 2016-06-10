'use strict';

var inMap = (x, y, mapSize)=>{
	return x >= 0 && y >= 0 && x < mapSize.width && y < mapSize.height;
};

var exist = (x, y, mapSize, map)=> {
	return inMap(x, y, mapSize)
		&& map[y][x]
};

export default {
	inMap,
	exist
};