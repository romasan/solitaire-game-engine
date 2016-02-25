'use strict';

export default {
	
	allToAll : function(a) {
		var _moves = [];
		// each decks
		for(var deckIndex in a.decks) {
			var _cards = a.decks[deckIndex].getCards();
			// each cards in  current deck
			for(var cardIndex in _cards) {
				var _id = _cards[cardIndex].id;
				// check can take this card/deck
				var _take = a.decks[deckIndex].Take(_id);
				if(_take) {
					// check put taked card/deck iinto another decks
					for(var deckIndex_2 in a.decks) {
						// ...all without current
						if(deckIndex != deckIndex_2) {
							var _put = a.decks[deckIndex_2].Put(_take);
							if(_put) {
								var _cards_to = a.decks[deckIndex_2].getCards(),
									_card_to  = _cards_to.length ? _cards_to[_cards_to.length - 1] : null;
								// console.log('Tip:', a.decks[deckIndex_2].domElement/*_cards[cardIndex].name, 'from', a.decks[deckIndex].name, a.decks[deckIndex].visible, 'to', a.decks[deckIndex_2].name*/)
								_moves.push({
									from : {
										deck : a.decks[deckIndex],
										card : _cards[cardIndex],
									},
									to : {
										deck : a.decks[deckIndex_2],
										lastCard : _card_to
									}
								});
							}
						}
					}
				}
			}
		}
		// console.log('allToAll:', _moves.length);
		return _moves;
	}
};