/*
 * сгенерировать группу из матрицы
 */

'use strict';

import defaults from 'defaults'                    ;

import relationsGenerator from 'relationsGenerator';
import mapCommon          from 'mapCommon'         ;

// let getName = (el)=>{
// 	return typeof el == "string" ? el : typeof el != "undefined" && typeof el.name == "string" ? el.name : null;
// };

export default (group, data) => {

	// {
	// 	type            : "map",
	// 	map             : [[string|{name, next, prev}]],
	// 	relations       : {
	// 		around : true,
	// 		beside : ???,
	// 		fall   : {
	// 			directories : [
	// 				"down",
	// 				"right"
	// 			]
	// 		}
	// 	}
	// }

	let _decks = [];
	
	let _default_placement = {
		"x" : 0,
		"y" : 0
	};

	let _placement = 
		group.placement
			? {
				"x" : typeof group.placement.x != 'undefined' ? group.placement.x : _default_placement.x,
				"y" : typeof group.placement.y != 'undefined' ? group.placement.y : _default_placement.y
			}
			: _default_placement;

	group.placement = {x : 0, y : 0};

	let _index = 1;

	let _mapSize = mapCommon.mapSize(data.map);

	// {name: 'groupName_deck_0_0'}
	for(let y in data.map) {
		for(let x in data.map[y]) {

			if(
				typeof data.map[y][x] == 'boolean' && data.map[y][x]     ||
				typeof data.map[y][x] == 'number'  && data.map[y][x] > 0
			) {
				data.map[y][x] = {};
			};

			if(typeof data.map[y][x] == 'string') {
				data.map[y][x] = {name: data.map[y][x]};
			} else if(
				data.map[y][x]                            &&
				typeof data.map[y][x]      != 'undefined' &&
				typeof data.map[y][x].name != 'string'
			) {
				data.map[y][x].name = group.name + '_deck_' + x + '_' + y;
			};
		}
	}

	for(let _y in data.map) {
		for(let _x in data.map[_y]) {

			let x = _x | 0,
				y = _y | 0;

			let _el = data.map[y][x];
			
			if(_el) {
				
				let _deck = {
					"name"     : data.map[y][x].name,// (group.name + "_deck" + _index) OR (group.name + '_' + data.map[y][x])
					"position" : {
						"x" : x * ((defaults.card.width  | 0) + (_placement.x | 0)),
						"y" : y * ((defaults.card.height | 0) + (_placement.y | 0))
					},
				}
				
				let _relations = [];

				let _relGenerators = {
					"around" : 'mapAroundRelations',
					"beside" : 'mapBesideRelations',
					"fall"   : 'mapFallRelations'
				};

				if(data.relations) {

					for(let relGenName in _relGenerators) {

						if(data.relations[relGenName]) {
							_relations = _relations.concat(relationsGenerator[_relGenerators[relGenName]]({
								"x"       : x,
								"y"       : y, 
								"map"     : data.map,
								"mapSize" : _mapSize,
								"el"      : _el,
								"data"    : data.relations[relGenName]
							}));
						};
					};
				};

				_deck.relations = _relations;
				
				_decks.push(_deck);
				_index += 1;
			}
		}
	}

	return _decks;
};