'use strict';

export default (a) => {

	let _moves = [];

// 4)

	// если получилось положить карты (с текущими правилами) записываем как возможный ход
	let put = (deckIndex_2, deckIndex, cardIndex, _cards) => {

		var _cards_to = a.decks[deckIndex_2].cards,
		    _card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;

		_moves.push({

			from : {
				deck     : a.decks[deckIndex],
				card     : _cards[cardIndex] ,// firstCard of moved deck
				count    : _cards.length
				// deckName : a.decks[deckIndex].name
			},

			to : {
				deck     : a.decks[deckIndex_2],
				lastCard : _card_to,
				count    : _cards_to.length
				// deckName : a.decks[deckIndex_2].name
			}
		});
	};

// 3) ^

	// пробегаем все остальные колоды и пробуем положить на них то что взяли
	let decksToPut = (_cards, _take, deckIndex, cardIndex) => {

		for(var deckIndex_2 in a.decks) {

			if(deckIndex != deckIndex_2) {
				
				var _put = a.decks[deckIndex_2].Put(_take);
				if(_put) {
					put(deckIndex_2, deckIndex, cardIndex, _cards)
				};
			};
		};
	};

// 2) ^

	// выбираем карты из колоды
	// патаемся взять карту
	let cardsInTakeDeck = (_cards, deckIndex) => {

		for(let cardIndex in _cards) {

			let _id = _cards[cardIndex].id;

			let _take = a.decks[deckIndex].Take(_id);

			if(_take) {
				decksToPut(_cards, _take, deckIndex, cardIndex);
			};
		};
	};

// 1) ^

	// пробегаем все колоды
	for(let deckIndex in a.decks) {
		
		let _cards = a.decks[deckIndex].cards;
		// each cards in  current deck
		cardsInTakeDeck(_cards, deckIndex);
	};

	return _moves;
};