'use strict';

import defaults from "defaults";

var mapSize = (map)=>{
	
	var _mapSize = {
		width  : map[0].length,//MAX LENGTH
		height : map   .length
	};
	
	map.forEach(function(e) {
		_mapSize.width = Math.max(_mapSize.width, e.length);
	});

	return _mapSize;
};

var inMap = (x, y, mapSize)=>{
	return x >= 0 && y >= 0 && x < mapSize.width && y < mapSize.height;
};

var _exist = (x, y, mapSize, map)=> {
	return inMap(x, y, mapSize)
		&& map[y][x]
}

// var getName = (el)=>{
// 	return typeof el == "string" ? el : typeof el != "undefined" && typeof el.name == "string" ? el.name : null;
// };

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

const _beSide = {
	left  : {x: -1, y:  0}, 
	right : {x:  1, y:  0}, 
	up    : {x:  0, y: -1}, 
	down  : {x:  0, y:  1} 
}

var getBeside = (x, y, mapSize, map, el, type)=>{

	if(typeof el[type] == "string") {

		switch(el) {
			case 'left':
				return _exist(x + _beSide.left.x, y + _beSide.left.y, mapSize, map)
			 		? map[y + _beSide.left.y][x + _beSide.left.x].name
			 		: null;
			case 'rigth':
				return _exist(x + _beSide.rigth.x, y + _beSide.rigth.y, mapSize, map)
			 		? map[y + _beSide.rigth.y][x + _beSide.rigth.x].name
			 		: null;
			case 'up':
				return _exist(x + _beSide.up.x, y + _beSide.up.y, mapSize, map)
			 		? map[y + _beSide.up.y][x + _beSide.up.x].name
			 		: null;
			case 'down':
				return _exist(x + _beSide.down.x, y + _beSide.down.y, mapSize, map)
			 		? map[y + _beSide.down.y][x + _beSide.down.x].name
			 		: null;
			// TODO
			default: return el.name;
		}
	};
	return null;
};

export default (e)=>{

	// {
	// 	type            : "map",
	// 	map             : [[string|{name, next, prev}]],
	// 	aroundRelations : boolean
	// }

	console.log('MAP GENERATOR:', this);
	
	var _decks = [];
	
	var _default_placement = {
		x : 0,
		y : 0
	};

	var _placement = 
		this.placement
			? {
				x : typeof this.placement.x != "undefined" ? this.placement.x : _default_placement.x,
				y : typeof this.placement.y != "undefined" ? this.placement.y : _default_placement.y
			}
			: _default_placement;

	this.placement = {x : 0, y : 0};

	var _index = 1;

	var _mapSize = mapSize(e.map);

	// {name: 'groupName_deck_0_0'}
	for(var y in e.map) {
		for(var x in e.map[_y]) {

			var _el = e.map[y][x];

			if(typeof _el != "undefined" && typeof _el != "string" && typeof _el.name == "undefined") {
				el.name = this.name + "_deck_" + x + "_" + y;
			}

			if(typeof _el == "string") {
				e.map[y][x] = {name: _el};
			}
		}
	}

	for(var _y in e.map) {
		for(var _x in e.map[_y]) {

			var x = _x|0,
				y = _y|0;

			var _el = e.map[y][x];
			
			if(_el) {
				
				var _deck = {
					"name"     : e.map[y][x],// (this.name + "_deck" + _index) OR (this.name + '_' + e.map[y][x])
					"position" : {
						"x" : x * ((defaults.card.width  | 0) + (_placement.x | 0)),
						"y" : y * ((defaults.card.height | 0) + (_placement.y | 0))
					},
				}
				
				var _relations = [];

				// Around relations
				for(var i in aroundRelations) {

					if(
						inMap(x + aroundRelations[i].x, y + aroundRelations[i].y, _mapSize)
					 && e.map[y + aroundRelations[i].y][x + aroundRelations[i].x]
					) {
						_relations.push({
							name : 'around',
							type : aroundRelations[i].type,
							id   : aroundRelations[i].id,
							to   : e.map[y + aroundRelations[i].y][x + aroundRelations[i].x].name
						});
						
					}
				}
				
				// Next/Previous relations (fourteen fall)
				var _next = getBeside(x, y, mapSize, map, _el, 'next') && _relations.push({name: 'next', _next});
				var _prev = getBeside(x, y, mapSize, map, _el, 'prev') && _relations.push({name: 'prev', _next});

				_deck.relations = _relations;
				
				_decks.push(_deck);
				_index += 1;
			}
		}
	}

	return _decks;
};