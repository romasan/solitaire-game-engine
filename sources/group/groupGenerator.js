'use strict';

import mapGenerator from "mapGenerator";
import fanGenerator from "fanGenerator";

// сгенерировать ряд из N карт

// "generator" : {
//     "type"  : "count"
//     "count" : 4
// }    

// сгенерировать группу из матрицы

// "generator" : {
//     "type"  : "map",
//     "map" : [
//         [null, 'B1', null]
//         ['A2', 'B2', 'C2']
//         [null, 'B3', null]
//     ]
// }

// сгенерировать группу для полумесяца

// "generator" : {
//     "type"   : "fan",
//     "count"  : 16,
//     "radius" : 405
// }

export default {
	"count" : function(e) {
		// console.log('!COUNT GENERATOR', e);
		var _count = e.count;
		var _decks = [];
		for(var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
			var _deckName = this.name + "_deck" + (deckIndex + 1);
			_decks.push({
				name : _deckName
			});
		}
		return _decks;
	},

	"map" : mapGenerator,
	"fan" : fanGenerator
};