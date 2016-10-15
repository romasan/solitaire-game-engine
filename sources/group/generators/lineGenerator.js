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

		_decks.push(_deck);
	}

	if(e.first) {
		
		let _deck = _decks[0];
		
		for(let propName in e.first) {
			_deck[propName] = e.first[propName];
		}
	}

	_decks[0].tag = 'first';

	if(e.last) {

		let _deck = _decks[_decks.length - 1];
		
		for(let propName in e.first) {
			_deck[propName] = e.first[propName];
		}
	}

	_decks[_decks.length - 1].tag = 'last';

	for(let deckIndex in _decks) {
		//  ---------------------------------------------------------
		let _relations = [];

		let _relGenerators = {
			"beside" : "lineBesideRelations"
		};

		if(e.relations) {

			for(let relGenName in _relGenerators) {

				if(e.relations[relGenName]) {
					_relations = _relations.concat(relationsGenerator[_relGenerators[relGenName]]({
						deckIndex,
						count     : _count,
						decks     : _decks,
						data      : e.relations[relGenName]
					}));
				};
			};
		};

		_decks[deckIndex].relations = _relations;
		//  ---------------------------------------------------------
	}

	return _decks;
}