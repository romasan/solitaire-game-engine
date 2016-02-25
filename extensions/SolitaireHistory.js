'use strict';

import forceMove from './forceMove';

export default function(main, share) {

	forceMove(main, share);

	share.undoMethods = {};
	share.redoMethods = {};
	
	main.event.listen('undo', function(a) {
		
		// console.log('forceMove undo:', share.undoMethods);

		if(!a) return;
		
		for(var i in share.undoMethods) {
			// console.log(i);
			share.undoMethods[i](a);
		}
		
		// if(a.flip) {
		// };
		
		if(a.unflip) {
			if(
				typeof a.unflip.deck       == "string"
			 && typeof a.unflip.card       != "undefined"
			 && typeof a.unflip.card.name  == "string"
			 && typeof a.unflip.card.index != "undefined"
			) {
				var _deck = main.Deck(a.unflip.deck),
					_cards = _deck ? _deck.getCards() : [];
				if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
					_cards[a.unflip.card.index].flip = true;
				}
			}
		};
		
		if(a.fill) {
			// TODO
		};

		// if(!a || !a.move) return;
		if(
			typeof a.move      != "undefined" 
		 && typeof a.move.from != "undefined" 
		 && typeof a.move.to   != "undefined" 
		 && typeof a.move.deck != "undefined"
		) {
			share.forceMove({
				from : a.move.to,
                to   : a.move.from,
                deck : a.move.deck
			})
		}


	});

	main.event.listen('redo', function(a) {
		
		// console.log('forceMove redo:', share.redoMethods);

		if(!a) return;
		
		for(var i in share.redoMethods) {
			share.redoMethods[i](a);
		}

		// if(a.flip) {
		// };
		
		if(a.unflip) {
			if(
				typeof a.unflip.deck       == "string"
			 && typeof a.unflip.card       != "undefined"
			 && typeof a.unflip.card.name  == "string"
			 && typeof a.unflip.card.index != "undefined"
			) {
				var _deck = main.Deck(a.unflip.deck),
					_cards = _deck ? _deck.getCards() : [];
				if(_cards[a.unflip.card.index].name == a.unflip.card.name) {
					_cards[a.unflip.card.index].flip = false;
				}
			}
		};
		
		if(a.fill) {
			// TODO
		};

		if(!a || !a.move) return;
		if(
			typeof a.move.from != "undefined" 
		 && typeof a.move.to   != "undefined" 
		 && typeof a.move.deck != "undefined"
		) {
			share.forceMove({
				from : a.move.from,
                to   : a.move.to,
                deck : a.move.deck
			})
		}

	});

};