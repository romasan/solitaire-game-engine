'use strict';

export default (a)=>{

	let _moves = [];
	
	let put = (deckIndex_2, deckIndex, cardIndex, _cards)=>{
		
		var _cards_to = a.decks[deckIndex_2].cards,
			_card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
		
		_moves.push({
			from : {
				deck     : a.decks[deckIndex],
				card     : _cards[cardIndex],//firstCard of moved deck
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

	}
	// ^
	let decksToPut = (_cards, _take, deckIndex, cardIndex)=>{

		for(var deckIndex_2 in a.decks) {
			// ...all without current
			if(deckIndex != deckIndex_2) {
				
				var _put = a.decks[deckIndex_2].Put(_take);
				if(_put) {
					put(deckIndex_2, deckIndex, cardIndex, _cards)
				}

			}
		}

	}
	// ^
	let cardsInTakeDeck = (_cards, deckIndex)=>{

		for(let cardIndex in _cards) {
			let _id = _cards[cardIndex].id;
			// check can take this card/deck
			let _take = a.decks[deckIndex].Take(_id);
			if(_take) {
				// check put taked card/deck iinto another decks
				decksToPut(_cards, _take, deckIndex, cardIndex);
			}
		}

	}
	// ^
	// each decks
	for(let deckIndex in a.decks) {
		
		let _cards = a.decks[deckIndex].cards;
		// each cards in  current deck
		cardsInTakeDeck(_cards, deckIndex);
		
	}
	return _moves;
};