'use strict';

export default function(cardNames) {

	var deckIndex = [];
	var _decksLength = 0;

	// создаём карты из списка cardNames в порядке очерёдности колод (по одной карте)
	for(var i in this.decks) {
		_decksLength += 1;
		deckIndex.push(null);
	}
	
	for(var i in this.decks) {
		if(this.decks[i].groupIndex && this.decks[i].groupIndex <= _decksLength) {
			deckIndex[this.decks[i].groupIndex - 1] = true;
		}
	}	
	
	for(var i in this.decks) {
		if(!this.decks[i].groupIndex) {
			var _index = 0;
			for(;deckIndex[_index] != null;_index += 1) {}
			deckIndex[_index] = this.decks[i].getId();
		}
	}

	for(var i in this.decks) {
		if(this.decks[i].groupIndex && this.decks[i].groupIndex <= _decksLength) {
			deckIndex[this.decks[i].groupIndex - 1] = this.decks[i].getId();
		}
	}

	var _decksWithBigIndex = {}
	for(var i in this.decks) {
		if(this.decks[i].groupIndex && this.decks[i].groupIndex > _decksLength) {
			_decksWithBigIndex[this.decks[i].groupIndex - 1] = this.decks[i].getId();
		}
	}

	for(var i in _decksWithBigIndex) {
		var _index = 0;
		for(;deckIndex[_index] != null;_index += 1) {}
		deckIndex[_index] = this.decks[_decksWithBigIndex[i]].getId();
	}

	var _checkDeck = true;
	for(var i in cardNames) {
		_checkDeck = _checkDeck && typeof cardNames[i] == 'string';
	}

	if(_checkDeck) {
		// циклично добавляет карты в колоды в группе (в порядке добавления)
		for(var i in cardNames) {
			var _index = deckIndex[i % deckIndex.length];
			this.decks[_index].genCardByName(cardNames[i]);
		}
	} else {
	 	for(var i in cardNames) {
	 		if(i < deckIndex.length) {
	 			this.decks[deckIndex[i]].Fill(cardNames[i]);
	 		}
	 	}
	}
};