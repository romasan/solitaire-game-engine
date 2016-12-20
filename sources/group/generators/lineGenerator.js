/*
 * сгенерировать ряд из N карт
 */

'use strict';

import relationsGenerator from 'relationsGenerator';

export default (group, data) => {

	// {
	// 	type	 : "line",
	// 	count	: int,
	// 	relations : {
	// 		"beside" : true
	// 	}
	// }

	// direction <- placement: {x, y}

	let _count = data.count;
	let _decks = [];

	for(let deckIndex = 0; deckIndex < _count; deckIndex += 1) {

		let _deckName = group.name + "_deck" + (deckIndex + 1);

		let _deck = {
			name : _deckName
		};

		_decks.push(_deck);
	}

	// first/last
	// TODO надо поправить перекрытие тегов из генератора и группы
	_decks[0].tags = ['first'];

	if(data.first) {

		let _deck = _decks[0];

		for(let propName in data.first) {
			_deck[propName] = data.first[propName];
		}
	}
	
	if(_decks[1]) {
		_decks[1].tags = ['second'];
	}

	_decks[_decks.length - 1].tags = ['last'];

	if(data.last) {

		let _deck = _decks[_decks.length - 1];

		for(let propName in data.last) {
			_deck[propName] = data.last[propName];
		}
	}

	// Generate relations
	for(let deckIndex in _decks) {

		let _relations = [];

		let _relGenerators = {
			"beside" : "lineBesideRelations"
		};

		if(data.relations) {

			for(let relGenName in _relGenerators) {

				// TODO
				if(data.relations[relGenName]) {
					_relations = _relations.concat(relationsGenerator[_relGenerators[relGenName]]({
						deckIndex,
						count     : _count,
						decks     : _decks,
						data      : data.relations[relGenName]
					}));
				};
			};
		};

		_decks[deckIndex].relations = _relations;
	}

	return _decks;
}