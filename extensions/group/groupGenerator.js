'use strict';

import mapGenerator from "mapGenerator";
import fanGenerator from "fanGenerator";

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