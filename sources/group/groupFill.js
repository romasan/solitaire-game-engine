'use strict';

export default function(cardNames) {

	let deckIndex = [];
	let _decksLength = 0;

	// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)
	for(let i in this.decks) {
		_decksLength += 1;
		deckIndex.push(null);
	};
	
	// если параметр groupIndex не выходит за рамки занимаем соответствующий порядковый номер
	for(let i in this.decks) {
		if(this.decks[i].groupIndex && this.decks[i].groupIndex <= _decksLength) {
			deckIndex[this.decks[i].groupIndex - 1] = true;
		};
	};
	
	// если нет параметра groupIndex (начинается с 1) ставим первый свободный порядковый номер
	for(let i in this.decks) {
		if(!this.decks[i].groupIndex) {
			let _index = 0;
			for(;deckIndex[_index] != null;_index += 1) {}
			deckIndex[_index] = this.decks[i].id;
		};
	};

	// если параметр groupIndex не выходит за рамки ставим соответствующий порядковый номер
	for(let i in this.decks) {
		if(this.decks[i].groupIndex && this.decks[i].groupIndex <= _decksLength) {
			deckIndex[this.decks[i].groupIndex - 1] = this.decks[i].id;
		};
	};

	// если параметр groupIndex выходит за рамки запоминаем...
	let _decksWithBigIndex = {}
	for(let i in this.decks) {
		if(this.decks[i].groupIndex && this.decks[i].groupIndex > _decksLength) {
			_decksWithBigIndex[this.decks[i].groupIndex - 1] = this.decks[i].id;
		};
	};
	// ...и сортируем
	for(let i in _decksWithBigIndex) {
		let _index = 0;
		for(;deckIndex[_index] != null;_index += 1) {}
		deckIndex[_index] = this.decks[_decksWithBigIndex[i]].id;
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
			
			this.decks[_index].genCardByName(cardNames[i]);
		}
	// если нужно добавить несколько групп карт
	} else {

	 	for(let i in cardNames) {
	 		if(i < deckIndex.length) {

	 			// console.log('fillDeck', deckIndex[i].name, cardNames[i]);

	 			this.decks[deckIndex[i]].Fill(cardNames[i]);
	 		};
	 	};
	};
};