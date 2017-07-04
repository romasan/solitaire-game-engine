'use strict';

export default (group, cardNames) => {

	let deckIndex = [];
	let _decksLength = 0;

	// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)
	for(let i in group.decks) {
		_decksLength += 1;
		deckIndex.push(null);
	};

	// если параметр groupIndex не выходит за рамки занимаем соответствующий порядковый номер
	for(let i in group.decks) {
		if(
			group.decks[i].groupIndex                 &&
			group.decks[i].groupIndex <= _decksLength
		) {
			deckIndex[group.decks[i].groupIndex - 1] = true;
		};
	};

	// если нет параметра groupIndex (начинается с 1) ставим первый свободный порядковый номер
	for(let i in group.decks) {
		if(!group.decks[i].groupIndex) {
			let _index = 0;
			for(;deckIndex[_index] != null;_index += 1) {}
			deckIndex[_index] = group.decks[i].id;
		};
	};

	// если параметр groupIndex не выходит за рамки ставим соответствующий порядковый номер
	for(let i in group.decks) {
		if(group.decks[i].groupIndex && group.decks[i].groupIndex <= _decksLength) {
			deckIndex[group.decks[i].groupIndex - 1] = group.decks[i].id;
		};
	};

	// если параметр groupIndex выходит за рамки запоминаем...
	let _decksWithBigIndex = {}
	for(let i in group.decks) {
		if(group.decks[i].groupIndex && group.decks[i].groupIndex > _decksLength) {
			_decksWithBigIndex[group.decks[i].groupIndex - 1] = group.decks[i].id;
		};
	};

	// ...и сортируем
	for(let i in _decksWithBigIndex) {
		let _index = 0;
		for(;deckIndex[_index] != null;_index += 1) {}
		deckIndex[_index] = group.decks[_decksWithBigIndex[i]].id;
	};

	// сморим являются ли элементы названиями карт (строкой)
	let _checkDeck = true;
	for(let i in cardNames) {
		_checkDeck = _checkDeck && typeof cardNames[i] == 'string';
	};

	// циклично добавляет карты в колоды в группе (в порядке добавления)
	if(_checkDeck) {

		for(let i in cardNames) {
			let _index = deckIndex[i % deckIndex.length];
			group.decks[_index].genCardByName(cardNames[i]); // , i == cardNames.length - 1);
		}
	// если нужно добавить несколько групп карт
	} else {

		for(let i in cardNames) {
			if(i < deckIndex.length) {
				group.decks[deckIndex[i]].Fill(cardNames[i]);
			};
		};
	};
};