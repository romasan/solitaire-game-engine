'use strict';

// import event    from 'event';
// import defaults from 'defaults';

export default function(e) {
// TODO переделать
		
/*
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
*/
}