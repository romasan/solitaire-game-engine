/*
 * сгенерировать группу из матрицы
 */

'use strict';

import defaults from "defaults";

import relationsGenerator from "relationsGenerator";

let mapSize = (map)=>{
	
	let _mapSize = {
		width  : map[0].length,//MAX LENGTH
		height : map   .length
	};
	
	map.forEach(function(e) {
		_mapSize.width = Math.max(_mapSize.width, e.length);
	});

	return _mapSize;
};

// var getName = (el)=>{
// 	return typeof el == "string" ? el : typeof el != "undefined" && typeof el.name == "string" ? el.name : null;
// };

// -------------------------------------------------------------------------------------------------------------------

export default function(e) {

	// {
	// 	type            : "map",
	// 	map             : [[string|{name, next, prev}]],
	// }

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
		for(var x in e.map[y]) {

			if(        e.map[y][x]
			 && typeof e.map[y][x]      != "undefined"
			 && typeof e.map[y][x]      != "string"
			 && typeof e.map[y][x].name == "undefined"
			) {
				e.map[y][x].name = this.name + "_deck_" + x + "_" + y;
			}

			if(typeof e.map[y][x] == "string") {
				e.map[y][x] = {name: e.map[y][x]};
			}
		}
	}

	for(var _y in e.map) {
		for(var _x in e.map[_y]) {

			var x = _x | 0,
				y = _y | 0;

			var _el = e.map[y][x];
			
			if(_el) {
				
				let _deck = {
					"name"     : e.map[y][x].name,// (this.name + "_deck" + _index) OR (this.name + '_' + e.map[y][x])
					"position" : {
						"x" : x * ((defaults.card.width  | 0) + (_placement.x | 0)),
						"y" : y * ((defaults.card.height | 0) + (_placement.y | 0))
					},
				}
				
				let _relations = [];

				// Around relations
				_relations = _relations.concat(relationsGenerator.mapAroundRelations(x, y, e.map, _mapSize, _el));
				
				// Next/Previous relations (fourteen fall)
				_relations = _relations.concat(relationsGenerator.mapBesideRelations(x, y, e.map, _mapSize, _el));

				_deck.relations = _relations;
				
				_decks.push(_deck);
				_index += 1;
			}
		}
	}

	return _decks;
};