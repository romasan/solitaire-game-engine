'use strict';

export default function(main, share) {

	var deckActions = {
		
		"testDeckAction" : function() {
			// TODO
		},
		
		"twindeck" : function(e) {
			
			// console.log("twindeck action:", e);
			if(e.deck_from.iteration == 0) {
				return;
			}


			var deck_to = main.Deck(e.data.to);
			
			var moveCardsCount = e.data.count && typeof e.data.count == 'number' ? e.data.count : share.default_twindeck_move_card_count;
			
			// количество оставшихся карт в первой колоде
			var deckFromCardsCount = e.deck_from.getCards().length;
			
			if(deckFromCardsCount < moveCardsCount) {
				moveCardsCount = deckFromCardsCount;
			}
			
			// инициализация
			if(typeof e.deck_from.iteration == 'undefined') {
				// "-1" - infinity
				e.deck_from.iteration = -1;
				e.deck_from.twindeck = [];
			}

			// количество циклов перелистываний сначало до конца
			if(e.iterations && e.deck_from.iteration < 0) {
				e.deck_from.iteration = e.iterations
			}

			deck_to.hideCards();

			var _deck = deck_to.Pop(deck_to.getCards().length);

			// Step
			share.oneStepWay.twindeck = {};
			share.oneStepWay.twindeck.toHide = share.deckCardNames(_deck);
			
			_deck.reverse();
			for(var i in _deck) {
				e.deck_from.twindeck.unshift(_deck[i]);
			}
			
			// первая колода пуста
			if(e.deck_from.twindeck && e.deck_from.twindeck.length && deckFromCardsCount == 0 && e.deck_from.iteration != 0) {
				// e.deck_from.twindeck.reverse();
				e.deck_from.Push(e.deck_from.twindeck);
				e.deck_from.twindeck = [];// unshift
			// перелистывание
			} else {
				var _deck = e.deck_from.Pop(moveCardsCount);
				deck_to.Push(_deck);
			}
			
			e.deck_from.showCards();
			
			// ------------ FLIP ------------
			// var _deck_from = e.deck_from.getCards();
			// var _deck_to = deck_to.getCards();
			
			e.deck_from.flipCheck();
			deck_to    .flipCheck();
			
			e.deck_from.Redraw();
			deck_to    .Redraw();
			
			// ------------ STEP ------------
			share.oneStepWay.twindeck.from      = e.deck_from.name,
			share.oneStepWay.twindeck.to        = deck_to    .name,
			share.oneStepWay.twindeck.moveCards = share.deckCardNames(_deck),
			share.oneStepWay.twindeck.iteration = (e.deck_from.iteration|0)
			
			// hiddenCards : share.deckCardNames(e.deck_from.twindeck), 
			// cards       : share.deckCardNames(e.deck_from.getCards()),

			if(typeof share.undoMethods == "undefined") {
				share.undoMethods = {};
			}

			// History extension
			share.undoMethods.twindeck = function(a) {
				if(a.twindeck) {
					
					var _deck_from = main.Deck(a.twindeck.from),
						_deck_to   = main.Deck(a.twindeck.to);
					
					// TODO
					// deck_to cards [moveCards] -> deck_from
					var _moveDeck = _deck_to.Pop(a.twindeck.moveCards.length);
					if(_moveDeck.length) {
						console.log('push#0', _moveDeck);
						_deck_from.Push(_moveDeck);
					}

					// deck_from.twindeck cards [toHide]  -> deck_to
					var _twindeck = [];
					for(var i in a.twindeck.toHide) {
						if(_deck_from.twindeck.length) {
							_twindeck.push(
								_deck_from.twindeck.pop()
							);
						}
					}
					_twindeck.reverse();

					console.log('_deck_from.twindeck:', _deck_from.twindeck);
					console.log('a.twindeck.toHide:', a.twindeck.toHide);
					console.log('_twindeck:', _twindeck);
					
					if(_twindeck.length) {
						console.log('push#1');
						_deck_to.Push(_twindeck);
					}

					_deck_to.showCards();
					
					_deck_from.flipCheck();

					_deck_from.Redraw();
					_deck_to  .Redraw();
					
					console.log('twindeck undo:', a.twindeck, share.deckCardNames(_deck_from.twindeck));
				}
			}
			
			share.redoMethods.twindeck = function(a) {
				if(a.twindeck) {
					console.log('twindeck redo:', a.twindeck);
				}
			}

			main.event.dispatch('makeStep', share.oneStepWay);
			// ------------------------------

			share.checkTips();

			e.deck_from.iteration -= 1;

		}
	};

	main.event.listen('runDeckActions', function(e) {
		// console.log('runDeckActios:', e.deck);
		for(var actionName in e.deck.actions) {
			if(deckActions[actionName]) {
				deckActions[actionName]({
					deck_from : e.deck, 
					data      : e.deck.actions[actionName]
				});
			}
		}
	});

	main.event.listen('runDeckAction', function(e) {
		if(e.name && typeof deckActions[e.name] == 'string'/* && e.data*/) {
			deckActions[e.name](e.data);
		}
	});

	main.event.listen('addDeckAction', function(e) {
		console.log(deckActions);
		if(e.name && e.callback) deckActions[e.name] = e.callback;

	});

	return deckActions;

};