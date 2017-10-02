'use strict';

import Take from '../deck/deckTake';
import Put  from '../deck/deckPut' ;

class allToAll {

	constructor() {}

	// 1)
	// пробегаем все колоды
	get(decks, state) {

		this._decks = decks;
		this._moves = [];

		for (let deckIndex in this._decks) {

			let _cards = this._decks[deckIndex].cards;
			// each cards in  current deck
			this.cardsInTakeDeck(_cards, deckIndex, state);
		};

		return this._moves;
	}

	// 2)
	// выбираем карты из колоды
	// патаемся взять карту
	cardsInTakeDeck(_cards, deckIndex, state) {

		for (let cardIndex in _cards) {

			let _id = _cards[cardIndex].id;

			let _take = Take(this._decks[deckIndex], _id);

			if (_take) {
				this.decksToPut(_cards, _take, deckIndex, cardIndex, state);
			};
		};
	}

	// 3)
	// пробегаем все остальные колоды и пробуем положить на них то что взяли
	decksToPut(_cards, _take, deckIndex, cardIndex, state) {

		for (let deckIndex_2 in this._decks) {

			if (deckIndex != deckIndex_2) {

				let _put = Put(this._decks[deckIndex_2], _take, this._decks, state);

				if (_put) {
					this.put(deckIndex_2, deckIndex, cardIndex, _cards)
				};
			};
		};
	}

	// 4)
	// если получилось положить карты (с текущими правилами) записываем как возможный ход
	put(deckIndex_2, deckIndex, cardIndex, _cards) {

		let _cards_to = this._decks[deckIndex_2].cards,
		    _card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1].id : null;

		this._moves.push({

			"from" : {
				// "deck"  : this._decks[deckIndex],
				"deck"  : this._decks[deckIndex].id,
				// "card"  : _cards[cardIndex]     ,
				"card"  : _cards[cardIndex].id     ,
				"count" : _cards.length
			},

			"to" : {
				// "deck"     : this._decks[deckIndex_2],
				"deck"     : this._decks[deckIndex_2].id,
				"lastCard" : _card_to                ,
				"count"    : _cards_to.length
			}
		});
	}
};

export default new allToAll();