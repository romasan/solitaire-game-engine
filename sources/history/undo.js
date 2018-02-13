// 'use strict';

import common, {event, share, defaults} from '../common';

import History      from './'                    ;
import Tips         from '../tips'               ;
import atom         from '../deck/atom'          ;
import stateManager from '../common/stateManager';

/*
 * flip
 * unflip
 * hide
 * show
 * lock
 * unlock
 * swap
 * move
 * markCard
 * unmarkCard
 * setStepType
 */

let undo = data => {

	if (share.get('sessionStarted')) {

		event.dispatch('stopAnimations');
		// stateManager.restore();
	}

	const {
		flip       ,
		unflip     ,
		hide       ,
		show       ,
		lock       ,
		unlock     ,
		swap       ,
		move       ,
		markCard   ,
		unmarkCard ,
		setStepType
	} = data;

	// undo flip
	if (flip) {

		const {deckName, cardIndex, cardName} = flip;

		let deck = common.getElementByName(deckName);

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                            &&
			card.name == cardName
		) {

			card.flip = false;

			deck.Redraw();
		}
	}

	// undo unflip
	if (unflip) {

		const {deckName, cardIndex, cardName} = unflip;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		// console.log('undo:unflip -> flip', unflip, deck.name, card.name, deck.cards.map(e => e.name));

		// event.dispatch('removeMarkCard', {
		// 	"card" : card
		// });

		if (
			card                              &&
			card.name == cardName
		) {
			card.flip = true;
			deck.Redraw();
		}
	}

	// undo hide
	if (hide) {

		const {deckName, cardIndex, cardName} = hide;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                            &&
			card.name == cardName
		) {
			card.visible = true;
			deck.Redraw();
		} else {
			console.warn('Incorrect history atom of step [undo hide]:', hide);
		}
	}

	// undo show
	if (show) {

		const {deckName, cardIndex, cardName} = show;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                            &&
			card.name == cardName
		) {
			card.visible = false;
			deck.Redraw();
		} else {
			console.warn('Incorrect history atom of step [undo show]:', show);
		}

		deck.Redraw();
	}

	// undo lock
	if (
		typeof lock != 'undefined'
	) {
		for (let i in lock) {
			let _element = common.getElementsByName(lock[i])[0];
			_element.unlock();
		}
	}

	// undo unlock
	if (
		typeof unlock != 'undefined'
	) {
		for (let i in unlock) {
			let _element = common.getElementsByName(unlock[i])[0];
			_element.lock();
		}
	}

	// redo swap
	if (swap) {

		const {deckName, fromIndex, toIndex} = swap;

		let deck = deckName && common.getElementByName(deckName, 'deck');

		deck && atom.swap(deck, fromIndex, toIndex, false) && deck.Redraw();
	}

	// undo move
	if (move) {

		// console.log('undo:move', JSON.stringify(move));

		const {from, to, deck, flip, stepType} = move;

		if (stepType) {

			if (typeof stepType == 'string') {
				share.set('stepType', stepType);
			}

			if (typeof stepType.undo == 'string') {
				share.set('stepType', stepType.undo);
			}
		}

		let forceMoveData = {
			"from" : to  , // from ->
			"to"   : from, //      <- to
			"deck" : deck
			// "flip" : flip
		};

		if (typeof flip == "boolean") {
			forceMoveData.flip = !flip;
		}

		if (!share.get('showHistoryAnimation')) {

			common.animationOff();

			forceMoveData.callback = e => {

				// undo move end
				share.set('inHistoryMove', false);

				common.animationOn();
			};
		} else {
			forceMoveData.callback = e => {

				// undo move end
				share.set('inHistoryMove', false);
			}
		}

		share.set('inHistoryMove', true);

		event.dispatch('forceMove', forceMoveData);
	}

	// if (markCard) {
		
	// 	const {deckName, cardIndex, cardName} = markCard;

	// 	let deck = common.getElementByName(deckName, 'deck');

	// 	let card = deck.getCardByIndex(cardIndex | 0);

	// 	if (
	// 		card                  &&
	// 		cardName == card.name
	// 	) {
	// 		event.dispatch('unmarkCard', {
	// 			"card" : card
	// 		});
	// 	}
	// }

	// if (unmarkCard) {

	// 	const {deckName, cardIndex, cardName} = unmarkCard;

	// 	let deck = common.getElementByName(deckName, 'deck');

	// 	let card = deck.getCardByIndex(cardIndex | 0);

	// 	if (
	// 		card                  &&
	// 		cardName == card.name
	// 	) {
	// 		event.dispatch('markCard', {
	// 			"card" : card
	// 		});
	// 	}
	// }

	if (
		       setStepType                  &&
		typeof setStepType.undo == "string"
	) {
		share.set('stepType', stepType.undo);
	}
};

event.listen('undo', undoData => {

	// let _break = false;

	// event.dispatch('checkAnimations', issetAnimated => {
	// 	if (issetAnimated) {
	// 		_break = true;
	// 	}
	// });

	// if (_break) {
	// 	// TODO -> redo
	// 	return;
	// }

	if (!undoData || share.get('stopRunHistory')) {
		return;
	}

	event.dispatch('undoredo', 'undo');

	// inputs.break();
	event.dispatch('inputsBreak');

	// console.groupCollapsed('UNDO');
	// console.log('%c' + JSON.stringify(undoData, true, 2), 'background:#d6deff');
	// console.groupEnd();

	if (share.get('animation')) {
		event.dispatch('stopAnimations');
	}

	let zipHistory = share.get('zipHistory');

	// History.reset();
	let history = History.get(true, zipHistory);

	if (history.length > 0) {

		for (let i = history.length - 1; i >= 0; i -= 1) {

			// console.groupCollapsed('<<<');
			// console.log(JSON.stringify(history[i], true, 2));
			// console.groupEnd();
			undo(history[i]);
		}
	}

	// Обратная совместимость
	if (undoData instanceof Array) {

		if (zipHistory) {
			undoData = History.unzip(undoData);
		}

		undoData.reverse();

		for (let _i in undoData) {
			let data = undoData[_i];
			undo(data);
		}

		undoData.reverse();
	} else {
		undo(undoData);
	}

	Tips.checkTips();

	// console.log('undo:stepType:', share.get('stepType'));
});

export default undo;
