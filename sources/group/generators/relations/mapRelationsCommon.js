'use strict';

const beSide = {
	left  : {x: -1, y:  0}, 
	right : {x:  1, y:  0}, 
	up    : {x:  0, y: -1}, 
	down  : {x:  0, y:  1} 
};

var inMap = (x, y, mapSize)=>{
	return x >= 0
		&& y >= 0
		&& x < mapSize.width
		&& y < mapSize.height;
};

var exist = (x, y, mapSize, map)=> {
	return inMap(x, y, mapSize)
		&& map[y][x];
};

export default {
	beSide,
	inMap,
	exist
};