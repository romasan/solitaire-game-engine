'use strict';

import common, {event, share, defaults} from '../common';

import History      from './'                    ;
import Tips         from '../tips'               ;
import atom         from '../deck/atom'          ;
import stateManager from '../common/stateManager';
import undo         from './undo'                ;

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

let redo = data => {

	if (share.get('sessionStarted')) {

		event.dispatch('stopAnimations');
		// stateManager.restore();
	}

	// console.log('REDO', data);

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

	// redo flip
	if (flip) {

		const {deckName, cardIndex, cardName} = flip;

		let deck = common.getElementByName(deckName);

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                            &&
			card.name == cardName
		) {

			card.flip = true;

			deck.Redraw();
		}
	}

	// redo unflip
	if (unflip) {

		const {deckName, cardIndex, cardName} = unflip;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                              &&
			card.name == cardName
		) {

			card.flip = false;

			deck.Redraw();
		}
	}

	// redo hide
	if (hide) {

		const {deckName, cardIndex, cardName} = hide;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                            &&
			card.name == cardName // TODO check
		) {
			card.visible = false;
			deck.Redraw();
		} else {
			console.warn('Incorrect history substep [redo hide]:', hide);
		}
	}

	// redo show
	if (show) {

		const {deckName, cardIndex, cardName} = show;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck && deck.getCardByIndex(cardIndex | 0);

		if (
			card                            &&
			card.name == cardName
		) {

			card.visible = true;

			deck.Redraw();
		} else {
			console.warn('Incorrect history substep [redo show]:', show);
		}
	}
	
	// redo lock
	if (
		typeof lock != 'undefined'
	) {
		for (let i in lock) {
			let _element = common.getElementsByName(lock[i])[0];
			_element.lock();
		}
	}

	// redo unlock
	if (
		typeof unlock != 'undefined'
	) {
		for (let i in unlock) {
			let _element = common.getElementsByName(unlock[i])[0];
			_element.unlock();
		}
	}

	// redo swap
	if (swap) {

		const {deckName, fromIndex, toIndex} = swap;

		let deck = deckName && common.getElementByName(deckName, 'deck');

		deck && atom.swap(deck, fromIndex, toIndex, false) && deck.Redraw();
	}

	// redo move
	if (move) {

		// console.log('redo:move');

		const {from, to, deck, flip, stepType} = move;

		if (move.stepType) {

			if (typeof stepType == 'string') {
				share.set('stepType', stepType);
			}

			if (typeof stepType.redo == 'string') {
				share.set('stepType', stepType.redo);
			}
		}

		let forceMoveData = {
			"from" : from,
			"to"   : to  ,
			"deck" : deck,
			"flip" : flip
		};

		if (typeof move.flip == "boolean") {
			forceMoveData.flip = flip;
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
			};
		}

		share.set('inHistoryMove', true);

		event.dispatch('forceMove', forceMoveData);
	}

	if (markCard && share.get('inDoHistory')) {

		const {deckName, cardIndex, cardName} = markCard;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck.getCardByIndex(cardIndex | 0);

		if (
			card                  &&
			cardName == card.name
		) {
			event.dispatch('markCard', {
				"card" : card
			});
		}
	}

	if (unmarkCard && share.get('inDoHistory')) {

		const {deckName, cardIndex, cardName} = unmarkCard;

		let deck = common.getElementByName(deckName, 'deck');

		let card = deck.getCardByIndex(cardIndex | 0);

		if (
			            card      &&
			cardName == card.name
		) {
			event.dispatch('unmarkCard', {
				"card" : card
			});
		}
	}

	if (setStepType) {

		if (typeof setStepType == "string") {
			share.set('stepType', setStepType);
		} else {
			if (typeof setStepType.redo == "string") {
				share.set('stepType', setStepType.redo);
			}
		}
	}
};

event.listen('redo', redoData => {

	// let _break = false;
	
	// event.dispatch('checkAnimations', issetAnimated => {
	// 	if (issetAnimated) {
	// 		_break = true;
	// 	}
	// });

	// if (_break) {
	// 	// TODO -> undo
	// 	return;
	// }

	if (!redoData || share.get('stopRunHistory')) {
		return;
	}

	event.dispatch('undoredo', 'redo');

	// share.set('inRedo', true);

	// inputs.break();
	event.dispatch('inputsBreak');

	// console.groupCollapsed('REDO');
	// console.log('%c' + JSON.stringify(redoData, true, 2), 'background:#fff7d6');
	// console.groupEnd();

	if (share.get('animation')) {
		event.dispatch('stopAnimations');
	}

	let zipHistory = share.get('zipHistory');

	// History.reset();
	let history = History.get(true, zipHistory);

	if (history.length > 0) {

		for (let i = history.length - 1; i >= 0; i -= 1) {
			
			// console.groupCollapsed('redo:<<<');
			// console.log(JSON.stringify(history[i], true, 2));
			// console.groupEnd();

			undo(history[i]);
		}
	}

	// Обратная совместимость
	// console.groupCollapsed('redo');
	if (redoData instanceof Array) {

		if (zipHistory) {
			redoData = History.unzip(redoData);
		}

		for (let _i in redoData) {
			let data = redoData[_i];
			// console.log(JSON.stringify(redoData[_i], true, 2));
			redo(data);
		}
	} else {
		// console.log(JSON.stringify(redoData, true, 2));
		redo(redoData);
	}
	// console.groupEnd();

	// share.set('inRedo', false);

	Tips.checkTips();

	// console.log('redo:stepType:', share.get('stepType'));
});

export default redo;
