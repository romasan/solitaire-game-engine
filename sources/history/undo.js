'use strict';

import event        from 'event'       ;
import share        from 'share'       ;
import common       from 'common'      ;
import defaults     from 'defaults'    ;

import inputs       from 'inputs'      ;
import History      from 'history'     ;
import Tips         from 'tips'        ;
import atom         from 'atom'        ;
import stateManager from 'stateManager';

/*
 * flip
 * unflip
 * hide
 * show
 * full
 * lock
 * unlock
 * swap
 * move
 */

let undo = data => {

	if(share.get('sessionStarted')) {

		event.dispatch('stopAnimations');
		stateManager.restore();
	}

	// undo flip
	if(data.flip) {

		let deck = common.getElementByName(data.flip.deckName);

		let card = deck.getCardByIndex(data.flip.cardIndex | 0);

		if(
			card                            &&
			card.name == data.flip.cardName
		) {
			card.flip = false;
			deck.Redraw();
		}
	}

	// undo unflip
	if(data.unflip) {

		let deck = common.getElementByName(data.unflip.deckName, 'deck');

		let card = deck.getCardByIndex(data.unflip.cardIndex | 0);

		event.dispatch('removeMarkCard', {
			"card" : card
		});

		if(
			card                              &&
			card.name == data.unflip.cardName
		) {
			card.flip = true;
			deck.Redraw();
		}
	}

	// undo hide
	if(data.hide) {

		let deck = common.getElementByName(data.hide.deckName, 'deck');

		if(
			deck                                                       &&
			deck.cards[data.hide.cardIndex].name == data.hide.cardName
		) {
			deck.cards[data.hide.cardIndex].visible = true;
			deck.Redraw();
		} else {
			console.warn('Incorrect history atom of step [undo hide]:', data.hide, deck.cards[data.hide.cardIndex].name, data.hide.cardName);
		}
	}

	// undo show
	if(data.show) {

		// console.log('UNDO SHOW:', data.show);

		let deck = common.getElementByName(data.show.deckName, 'deck');

		if(
			deck                                                       &&
			deck.cards[data.show.cardIndex].name == data.show.cardName
		) {
			deck.cards[data.show.cardIndex].visible = false;
			deck.Redraw();
		} else {
			console.warn('Incorrect history atom of step [undo show]:', data.show, deck.cards[data.show.cardIndex].name, data.show.cardName);
		}

		deck.Redraw();
	}

	// undo full
	if(data.full) {
		// 
	}

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

	// redo swap
	if(
		typeof data.swap           != 'undefined' &&
		typeof data.swap.deckName  != 'undefined' &&
		typeof data.swap.fromIndex != 'undefined' &&
		typeof data.swap.toIndex   != 'undefined'
	) {

		let deck = common.getElementByName(data.swap.deckName, 'deck');

		atom.swap(deck, data.swap.fromIndex, data.swap.toIndex, false);

		deck.Redraw();
	}

	// undo move
	if(
		typeof data.move      != 'undefined' &&
		typeof data.move.from != 'undefined' &&
		typeof data.move.to   != 'undefined' &&
		typeof data.move.deck != 'undefined'
	) {

		if(data.move.stepType) {

			if(typeof data.move.stepType == 'string') {
				share.set('stepType', data.move.stepType);
			}

			if(typeof data.move.stepType.undo == 'string') {
				share.set('stepType', data.move.stepType.undo);
			}
		}

		let forceMoveData = {
			"from" : data.move.to  , // from ->
			"to"   : data.move.from, //      <- to
			"deck" : data.move.deck
		};

		if(typeof data.move.flip == "boolean") {
			forceMoveData.flip = !data.move.flip;
		}

		if(!share.get('showHistoryAnimation')) {

			common.animationOff();

			forceMoveData.callback = e => {
				common.animationOn();
			};
		}

		event.dispatch('forceMove', forceMoveData);
	}
};

event.listen('undo', undoData => {

	if(!undoData) {
		return;
	}

	// console.log('%cUNDO: ' + JSON.stringify(undoData), 'background:#d6deff');

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