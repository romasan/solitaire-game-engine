'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';

import Deck      from 'addDeck';
import Group     from 'addGroup';
import History   from 'SolitaireHistory';
import forceMove from 'forceMove';
// import Tips      from 'Tips';

var _actions = {
	
	// TODO переделать
	"twindeck" : function(e) {

		
		// console.log("twindeck action:", e);
		if(e.deck_from.iteration == 0) {
			return;
		}

		var deck_to = Deck.Deck(e.data.to);
		
		var moveCardsCount = e.data.count && typeof e.data.count == 'number' 
			? e.data.count 
			: defaults.actions.twindeck.CardsCount;
		
		// количество оставшихся карт в первой колоде
		var deckFromCardsCount = e.deck_from.cards.length;
		
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

		var _deck = deck_to.Pop(deck_to.cards.length);

		// oneStepWay.add('toHide') = Deck.deckCardNames(_deck);
		
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
		// var _deck_from = e.deck_from.cards;
		// var _deck_to = deck_to.cards;
		
		e.deck_from.flipCheck();
		deck_to    .flipCheck();
		
		e.deck_from.Redraw();
		deck_to    .Redraw();
		
		// ------------ STEP ------------
		// Step
		var _twindeckStep = {
			from      : e.deck_from.name,
			to        : deck_to    .name,
			moveCards : share.deckCardNames(_deck),
			iteration : (e.deck_from.iteration|0)
		};
		
		// hiddenCards : share.deckCardNames(e.deck_from.twindeck), 
		// cards       : share.deckCardNames(e.deck_from.cards),

		History.add(_twindeckStep);
		
		event.dispatch('makeStep', History.get());
		
		// ------------------------------

		// share.checkTips();

		e.deck_from.iteration -= 1;

	},

	"twindeck2" : function(e) {
		// TODO
	},

	"dealerdeck" : function(e) {

		
		var _decks = Group.Group(e.toGroup).decks;

		if(this.cards.length == 0) return;
		
		for(var deckId in _decks) {
			
			// console.log('DEALERDECK', deckId, _decks);
			
			var _cardName = this.getTopCard().name
			forceMove({
				from : this.name,
				to   : _decks[deckId].name,
				// to   : deckId,
				deck : [_cardName],
				flip : true
			}, true);
			
			_decks[deckId].flipCheck();
			// _decks[deckId].Redraw();

			History.add({move : {
				from : this.name,
				to   : _decks[deckId].name,
				deck : [_cardName],
				flip : true
			}});
		}
		
		// History.add({
		// 	"action" : {
		// 		name     : "dealerdeck",
		// 		deckName : this.name,
		// 		params   : e
		// 	}
		// });
		
		event.dispatch('makeStep', History.get());
	}
};

// ------------------------------------------------------------------------------------------

// History extension
// History.addUndoMethods({twindeck : function(a) {
// 	if(a.twindeck) {
		
// 		var _deck_from = Deck.Deck(a.twindeck.from),
// 			_deck_to   = Deck.Deck(a.twindeck.to);
		
// 		// TODO
// 		// deck_to cards [moveCards] -> deck_from
// 		var _moveDeck = _deck_to.Pop(a.twindeck.moveCards.length);
// 		if(_moveDeck.length) {
// 			_deck_from.Push(_moveDeck);
// 		}

// 		var _twindeck = [];
// 		for(var i in a.twindeck.toHide) {
// 			if(_deck_from.twindeck.length) {
// 				_twindeck.push(
// 					_deck_from.twindeck.pop()
// 				);
// 			}
// 		}
// 		_twindeck.reverse();
		
// 		if(_twindeck.length) {
// 			_deck_to.Push(_twindeck);
// 		}

// 		_deck_from.flipCheck();
// 		_deck_to  .showCards();
// 		_deck_from.Redraw();
// 		_deck_to  .Redraw();
		
// 		// console.log('twindeck undo:', a.twindeck, share.deckCardNames(_deck_from.twindeck));
// 	}
// }});

// History.addRedoMethods({twindeck : function(a) {
// 	if(a.twindeck) {
// 		// TODO
// 		console.log('twindeck redo:', a.twindeck);
// 	}
// }});

var runActions = function(e) {// bind this deck

	share.set('animation', defaults.animation);

	for(var actionName in this.actions) {
		if(_actions[actionName]) {
			console.log('run action', this, actionName, this.actions[actionName]);
			_actions[actionName].call(this, this.actions[actionName]);
		}
	}
	// Tips.checkTips();
}

export default {
	runActions
}