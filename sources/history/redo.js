'use strict';

import event    from 'event'   ;
import share    from 'share'   ;
import common   from 'common'  ;
import defaults from 'defaults';

import inputs   from 'inputs'  ;
import History  from 'history' ;
import Tips     from 'tips'    ;
import atom     from 'atom'    ;

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

let redo = data => {

	if(share.get('sessionStarted')) {

		event.dispatch('stopAnimations');
		stateManager.restore();
	}

	// redo flip
	if(data.flip) {

		let deck = common.getElementByName(data.flip.deckName);

		let card = deck.getCardByIndex(data.flip.cardIndex | 0);

		if(card) {
			card.flip = true;
			deck.Redraw();
		}
	}

	// redo unflip
	if(data.unflip) {

		let deck = common.getElementByName(data.unflip.deckName, 'deck');

		let card = deck.getCardByIndex(data.unflip.cardIndex | 0);

		if(card) {
			card.flip = false;
			deck.Redraw();
		}
	}

	// redo hide
	if(data.hide) {

		let deck = common.getElementByName(data.hide.deckName, 'deck');

		if(
			deck                                                       &&
			deck.cards[data.hide.cardIndex].name == data.hide.cardName // TODO check
		) {
			deck.cards[data.hide.cardIndex].visible = false;
			deck.Redraw();
		} else {
			console.warn('Incorrect history substep [redo hide]:', data.hide);
		}
	}

	// redo show
	if(data.show) {

		let deck = common.getElementByName(data.show.deckName, 'deck');

		if(
			deck                                                       &&
			deck.cards[data.show.cardIndex].name == data.show.cardName
		) {
			deck.cards[data.show.cardIndex].visible = true;
			deck.Redraw();
		} else {
			console.warn('Incorrect history substep [redo show]:', data.hide);
		}
	}
	
	// redo full
	if(data.full) {
		// 
	}

	// redo lock
	if(
		typeof data.lock != 'undefined'
	) {
		for(let i in data.lock) {
			let _element = common.getElementsByName(data.lock[i])[0];
			_element.lock();
		}
	}

	// redo unlock
	if(
		typeof data.unlock != 'undefined'
	) {
		for(let i in data.unlock) {
			let _element = common.getElementsByName(data.unlock[i])[0];
			_element.unlock();
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

	// redo move
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

			if(typeof data.move.stepType.redo == 'string') {
				share.set('stepType', data.move.stepType.redo);
			}
		}

		let forceMoveData = {
			"from" : data.move.from,
			"to"   : data.move.to  ,
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
	}

	// TODO актуально ли ещё?
	// if(
	// 	data.redo                            &&
	// 	typeof data.redo.stepType == 'string'
	// ) {
	// 	share.set('stepType', data.redo.stepType);
	// }
};

event.listen('redo', redoData => {

	if(!redoData) {
		return;
	}

	inputs.break();

	History.reset();

	if(share.get('animation')) {
		event.dispatch('stopAnimations');
	}

	// Обратная совместимость
	if(redoData instanceof Array) {

		for(let _i in redoData) {
			let data = redoData[_i];
			redo(data);
		}
	} else {
		redo(redoData);
	}

	Tips.checkTips();

	// TODO актуально ли ещё?
	// if(
	// 	share.get('stepType') != defaults.stepType &&
	// 	Tips.getTips().length == 0
	// ) {
	// 	share.set('stepType', defaults.stepType);
	// 	Tips.checkTips();
	// }
});