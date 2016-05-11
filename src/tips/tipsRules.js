'use strict';

export default {
	
	allToAll : function(a) {

		var decksToPut = function(_cards, _take, deckIndex, cardIndex) {

			for(var deckIndex_2 in a.decks) {
				// ...all without current
				if(deckIndex != deckIndex_2) {

					
					var _put = a.decks[deckIndex_2].Put(_take);
					// console.log("PUT >>>", a.decks[deckIndex_2].name, _put);
					if(_put) {
						var _cards_to = a.decks[deckIndex_2].cards,
							_card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
						// console.log('Tip:', a.decks[deckIndex_2].domElement);
						// _cards[cardIndex].name, 'from', a.decks[deckIndex].name, a.decks[deckIndex].visible, 'to', a.decks[deckIndex_2].name
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
				}
			}

		}

		var cardsInTakeDeck = function(_cards) {

			for(var cardIndex in _cards) {
				var _id = _cards[cardIndex].id;
				// check can take this card/deck
				var _take = a.decks[deckIndex].Take(_id);
				if(_take) {
					// console.log('>>> TAKE', a.decks[deckIndex].name, _cards[cardIndex].name, _take);
					// check put taked card/deck iinto another decks
					decksToPut(_cards, _take, deckIndex, cardIndex);
				}
			}

		}

		// console.log('%cTIPS', 'color : red; font-size : 30pt; font-weigth : bold;', 'allToAll', a);
		
		var _moves = [];
		// each decks
		for(var deckIndex in a.decks) {


			// var _cards = a.decks[deckIndex].getCards();
			var _cards = a.decks[deckIndex].cards;
			// each cards in  current deck
			cardsInTakeDeck(_cards);
			
		}
		// console.log('allToAll:', _moves.length);
		return _moves;
	}
};