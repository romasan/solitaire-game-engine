'use strict';

import event    from 'event'   ;
import share    from 'share'   ;
import common   from 'common'  ;
import defaults from 'defaults';

import inputs   from 'inputs'  ;
import History  from 'history' ;
import Tips     from 'tips'    ;

/*
 * flip
 * unflip
 * hide
 * show
 * full
 * lock
 * unlock
 * move
 */

let undo = data => {

	if(share.get('sessionStarted')) {
		// _undoMoveStack = [];
		event.dispatch('stopAnimations');
		stateManager.restore();
	}

	// undo flip
	if(data.flip) {

		let deck = common.getElementByName(data.flip.deckName);

		let card = deck.getCardByIndex(data.flip.cardIndex | 0);

		if(card) {
			card.flip = false;
			deck.Redraw();
		}
	};

	// undo unflip
	if(data.unflip) {

		let deck = common.getElementByName(data.unflip.deckName, 'deck');

		let card = deck.getCardByIndex(data.unflip.cardIndex);

		if(card) {
			// TODO deck.flipCardByIndex(index, false);
			card.flip = true;
			// event.dispatch('redrawDeckFlip', deck);
			deck.Redraw();
		}

	};

	// undo hide
	if(data.hide) {

		let deck = common.getElementByName(data.hide.deckName, 'deck');

		if(
			deck &&
			deck.cards[data.hide.cardIndex].name == data.hide.cardName
		) {
			deck.cards[data.hide.cardIndex].visible = true;
			deck.Redraw();
		} else {
			console.warn('Incorrect history substep [undo hide]:', data.hide);
		}
	}

	// undo show
	if(data.show) {
		let deck = common.getElementByName(data.show.deckName, 'deck');
		if(
			deck &&
			deck.cards[data.show.cardIndex].name == data.show.cardName
		) {
			deck.cards[data.show.cardIndex].visible = false;
			deck.Redraw();
		} else {
			console.warn('Incorrect history substep [undo show]:', data.hide);
		}
	}

	// undo full
	// if(data.full) {};

	// undo lock
	if(
		typeof data.lock != 'undefined'
	) {
		for(let i in data.lock) {
			let _element = common.getElementsByName(data.lock[i])[0];
			_element.unlock();
		}
	}

	// undo unlock
	if(
		typeof data.unlock != 'undefined'
	) {
		for(let i in data.unlock) {
			let _element = common.getElementsByName(data.unlock[i])[0];
			_element.lock();
		}
	}

	// undo move
	if(
		typeof data.move      != 'undefined' &&
		typeof data.move.from != 'undefined' &&
		typeof data.move.to   != 'undefined' &&
		typeof data.move.deck != 'undefined'
	) {

		// TODO
		let movesAnimation = share.get('movesAnimation');

		if(data.move.stepType) {

			if(typeof data.move.stepType == 'string') {
				share.set('stepType', data.move.stepType);
			}

			if(typeof data.move.stepType.undo == 'string') {
				share.set('stepType', data.move.stepType.undo);
			}
		}

		// TODO
		// _movesStack.push(e => {

		let forceMoveData = {
			"from" : data.move.to  , // from ->
			"to"   : data.move.from, //      <- to
			"deck" : data.move.deck,
			"flip" : data.move.flip,
		};

		if(!share.get('showHistoryAnimation')) {

			common.animationOff();

			forceMoveData.callback = e => {
				common.animationOn();
			};
		}

		event.dispatch('forceMove', forceMoveData);

		// });

		// if(_movesStack.length == 1) {
			// _movesStack.shift()();
		// }
	}
};

event.listen('undo', undoData => {

	console.log('### UNDO:', undoData);

	if(!undoData) {
		return;
	};

	// let e = undoData.length ? undoData[undoData.length - 1] : undoData;

	// if(e.move) {

	// 	let _lastDragDeck = share.get('lastDragDeck');
	//     let _deck = common.getElementById(_lastDragDeck.dragDeckParentId);

	// 	common.animationOff();
	// 	event.dispatch('moveCardToHome', {
	// 		"departure" : _deck        ,
	// 		"moveDeck"  : _lastDragDeck.dragDeck
	// 	});
	// 	common.animationOn();
	// }

	inputs.break();

	History.reset();

	if(share.get('animation')) {
		event.dispatch('stopAnimations');
	}
	// Обратная совместимость
	if(undoData instanceof Array) {

		undoData.reverse();
		for(let _i in undoData) {
			let data = undoData[_i];
			undo(data);
		}
		undoData.reverse();
	} else {
		undo(undoData);
	}

	Tips.checkTips();
});