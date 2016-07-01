/*
 * сгенерировать ряд из N карт
 */

'use strict';

import relationsGenerator from 'relationsGenerator';

export default function(e) {
	
	// {
	// 	type	 : "line",
	// 	count	: int,
	// 	relations : {
	// 		"beside" : true
	// 	}
	// }
	
	// direction <- placement: {x, y}

	var _count = e.count;
	var _decks = [];
	
	for(var deckIndex = 0; deckIndex < _count; deckIndex += 1) {
		var _deckName = this.name + "_deck" + (deckIndex + 1);
		
		let _deck = {
			name : _deckName
		};
		
		//  ---------------------------------------------------------
		let _relations = [];

		let _relGenerators = {
			"beside" : "lineBesideRelations"
		};

		if(e.relations) {

			for(let relGenName in _relGenerators) {

				// TODO
				if(e.relations[relGenName]) {
					_relations = _relations.concat(relationsGenerator[_relGenerators[relGenName]]({
						deckIndex,
						count: _count,
						data		: e.relations[relGenName]
					}));
				};
			};
		};

		_deck.relations = _relations;
		//  ---------------------------------------------------------

		if(e.first) {
			
			for(let propName in e.first) {

				_deck[propName] = e.first[propName];
			}

			// if(e.first.takeRules) {
			// 	_deck.takeRules = e.first.takeRules;
			// }

			// if(e.first.putRules) {
			// 	_deck.putRules = e.first.putRules;
			// }
		}

		if(e.last) {}

		_deck.relations = _relations;
		
		_decks.push(_deck);
	}

	let _relations = [];

	return _decks;
}