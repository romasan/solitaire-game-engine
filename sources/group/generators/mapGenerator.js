'use strict';

import defaults from "defaults";

var inMap = function(x, y, mapSize) {
	return x >= 0 && y >= 0 && x < mapSize.width && y < mapSize.height;
};

export default function(e) {
	
	// TODO
	// console.log('MAP GENERATOR', e);
	
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

	var _mapSize = {
		width  : e.map[0].length,//MAX LENGTH
		height : e.map   .length
	}
	e.map.forEach(function(e) {
		_mapSize.width = Math.max(_mapSize.width, e.length);
	});
	
	for(var y in e.map) {
		for(var x in e.map[y]) {
			if(e.map[y][x]) {
				
				var _deck = {
					"name"     : e.map[y][x],// (this.name + "_deck" + _index) OR (this.name + '_' + e.map[y][x])
					"position" : {
						"x" : x * ((defaults.card.width|0)  + (_placement.x|0)),
						"y" : y * ((defaults.card.height|0) + (_placement.y|0))
					},
				}
				
				if(e.aroundRealtions) {// default false

					// CLT TOP CRT ... CORN SIDE CORN
					// LFT  *  RGT ... SIDE      SIDE
					// CLB BTM CRB ... CORN SIDE CORN

					var _relations = [];

					// SYS: name, from (type???)

					if( inMap(y - 1, x - 1, _mapSize) && e.map[y - 1] && e.map[y - 1][x - 1] ) { _relations.push({ name : 'around', type : 'corn', id : 'clt', to : e.map[y - 1][x - 1] }); };
					if( inMap(y - 1, x    , _mapSize) && e.map[y - 1] && e.map[y - 1][x]     ) { _relations.push({ name : 'around', type : 'side', id : 'top', to : e.map[y - 1][x]     }); };
					if( inMap(y - 1, x + 1, _mapSize) && e.map[y - 1] && e.map[y - 1][x + 1] ) { _relations.push({ name : 'around', type : 'corn', id : 'crt', to : e.map[y - 1][x + 1] }); };
					
					if( inMap(y    , x - 1, _mapSize) && e.map[y]     && e.map[y][x - 1]     ) { _relations.push({ name : 'around', type : 'side', id : 'lft', to : e.map[y][x - 1]     }); };
					if( inMap(y    , x + 1, _mapSize) && e.map[y]     && e.map[y][x + 1]     ) { _relations.push({ name : 'around', type : 'side', id : 'rgt', to : e.map[y][x + 1]     }); };
					
					if( inMap(y + 1, x - 1, _mapSize) && e.map[y + 1] && e.map[y + 1][x - 1] ) { _relations.push({ name : 'around', type : 'corn', id : 'clb', to : e.map[y + 1][x - 1] }); };
					if( inMap(y + 1, x    , _mapSize) && e.map[y + 1] && e.map[y + 1][x]     ) { _relations.push({ name : 'around', type : 'side', id : 'btm', to : e.map[y + 1][x]     }); };
					if( inMap(y + 1, x + 1, _mapSize) && e.map[y + 1] && e.map[y + 1][x + 1] ) { _relations.push({ name : 'around', type : 'corn', id : 'crb', to : e.map[y + 1][x + 1] }); };

					_deck.relations = _relations;
				}
				
				_decks.push(_deck);
				_index += 1;
			}
		}
	}


	// -----------------------------

	// if(e.generateDeckRelations) {}

	return _decks;
};