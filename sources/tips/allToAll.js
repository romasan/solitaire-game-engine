'use strict';

class allToAll {

	constructor() {

		this._decks = null;
		this._moves = [];
	}

	/**
	 * пробегаем все колоды
	 */
	get(data) {

		this._decks = data.decks;
		this._moves = [];

		for (let deckIndex in this._decks) {

			let _cards = this._decks[deckIndex].cards;
			// each cards in  current deck
			this.cardsInTakeDeck(_cards, deckIndex);
		};

		return this._moves;
	}

	/**
	 * выбираем карты из колоды
	 * патаемся взять карту
	 */
	cardsInTakeDeck(_cards, deckIndex) {

		for (let cardIndex in _cards) {

			let _id = _cards[cardIndex].id;

			let _take = this._decks[deckIndex].Take(_id);

			if (_take) {
				this.decksToPut(_cards, _take, deckIndex, cardIndex);
			};
		};
	}

	/**
	 * пробегаем все остальные колоды и пробуем положить на них то что взяли
	 */
	decksToPut(_cards, _take, deckIndex, cardIndex) {

		for (let deckIndex_2 in this._decks) {

			if (deckIndex != deckIndex_2) {

				let _put = this._decks[deckIndex_2].Put(_take);
				if (_put) {
					this.put(deckIndex_2, deckIndex, cardIndex, _cards)
				};
			};
		};
	}

	/**
	 * если получилось положить карты (с текущими правилами) записываем как возможный ход
	 */
	put(deckIndex_2, deckIndex, cardIndex, _cards) {

		let _cards_to = this._decks[deckIndex_2].cards,
		    _card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;

		this._moves.push({

			"from" : {
				"deck"  : this._decks[deckIndex],
				"card"  : _cards[cardIndex]     ,
				"count" : _cards.length
			},

			"to" : {
				"deck"     : this._decks[deckIndex_2],
				"lastCard" : _card_to                ,
				"count"    : _cards_to.length
			},

			"index": (this._moves.length | 0) + 1
		});
	}
};

let _allToAll = new allToAll();

export default data => {
	return _allToAll.get(data);
};