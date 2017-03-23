'use strict';

import event        from 'event'       ;
import share        from 'share'       ;
import common       from 'common'      ;
import defaults     from 'defaults'    ;
import stateManager from 'stateManager';

import forceMove    from 'forceMove'   ;
import Deck         from 'deck'        ;
import Tips         from 'tips'        ;
import field        from 'field'       ;
import inputs       from 'inputs'      ;

// TODO пошаговая анимация

// let _movesCallback = e => {
// 	if(_movesStack.length) {
// 		_movesStack.shift()();
// 	} else {
// 		// 
// 	}
// };
// let _movesStack = [];

// let _stepsCallback = e => {
// 	if(_stepsStack.length) {
// 		_stepsStack.shift()();
// 	} else {
// 		// 
// 	}
// };
// let _stepsStack = [];

// undo

let historyStack = [];

let _undo = data => {

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
		if(deck.cards[data.hide.cardIndex].name == data.hide.cardName) {
			deck.cards[data.hide.cardIndex].visible = true;
			deck.Redraw();
		}
	}

	// undo show
	if(data.show) {
		let deck = common.getElementByName(data.show.deckName, 'deck');
		if(deck.cards[data.show.cardIndex].name == data.show.cardName) {
			deck.cards[data.show.cardIndex].visible = false;
			deck.Redraw();
		}
	}

	// FULL
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
		// forceMoveData.callback = _movesCallback
		forceMove(forceMoveData);

		// });

		// if(_movesStack.length == 1) {
			// _movesStack.shift()();
		// }
	}
};

event.listen('undo', undoData => {

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

	_history.reset();

	if(share.get('animation')) {
		event.dispatch('stopAnimations');
	}
	// Обратная совместимость
	if(undoData instanceof Array) {

		undoData.reverse();
		for(let _i in undoData) {
			let data = undoData[_i];
			_undo(data);
		}
		undoData.reverse();
	} else {
		_undo(undoData);
	}

	Tips.checkTips();
});

// redo

let _redo = data => {

	if(share.get('sessionStarted')) {
		// _undoMoveStack = [];
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
	};

	// redo unflip
	if(data.unflip) {
		let deck = common.getElementByName(data.unflip.deckName);
		let card = deck.getCardByIndex(data.unflip.cardIndex | 0);
		if(card) {
			card.flip = false;
			deck.Redraw();
		}
	};

	// redo hide
	if(data.hide) {
		let deck = common.getElementByName(data.hide.deckName, 'deck');
		if(deck.cards[data.hide.cardIndex].name == data.hide.cardName) {
			deck.cards[data.hide.cardIndex].visible = false;
			deck.Redraw();
		}
	}

	// redo show
	if(data.show) {
		let deck = common.getElementByName(data.show.deckName, 'deck');
		if(deck.cards[data.show.cardIndex].name == data.show.cardName) {
			deck.cards[data.show.cardIndex].visible = true;
			deck.Redraw();
		}
	}
	
	// FULL
	// if(data.full) {};

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

		forceMove(forceMoveData);
	}

	if(
		data.redo                            &&
		typeof data.redo.stepType == 'string'
	) {
		share.set('stepType', data.redo.stepType);
	}
};

event.listen('redo', redoData => {

	inputs.break();

	_history.reset();

	if(share.get('animation')) {
		event.dispatch('stopAnimations');
	}

	if(!redoData) {
		return;
	}

	// Обратная совместимость
	if(redoData instanceof Array) {

		for(let _i in redoData) {
			let data = redoData[_i];
			_redo(data);
		}
	} else {
		_redo(redoData);
	}

	Tips.checkTips();

	if(
		share.get('stepType') != defaults.stepType &&
		Tips.getTips().length == 0
	) {
		share.set('stepType', defaults.stepType);
		Tips.checkTips();
	}
});

// history

class history {

	constructor() {

		this.steps = [];
	}

	reset() {

		// console.log('History:clear');

		this.steps = [];
	}

	add(step) {

		// console.log('History:add', step);

		this.steps.push(step);
	}

	// get steps and reset
	get(reset = true) {

		let _req = this.steps;

		if(reset) {
			this.reset(true);
		}

		// console.log('History:get', _req);

		return _req;
	}

	// log() {}

	count() {
		return this.steps.length;
	}

	// addUndoMethods(data) {
	// 	for(let i in data) {
	// 		_undoMethods[i] = data[i];
	// 	}
	// }

	// addRedoMethods(data) {
	// 	for(let i in data) {
	// 		_redoMethods[i] = data[i];
	// 	}
	// }
}

let _history = new history();

// events

event.listen('addStep', data => {
	if(data.debug) {
		delete data.debug;
	}
	_history.add(data)
});

// save steps to client history
event.listen('saveSteps', e => {
	let data = _history.get();
	if(data.length) {
		event.dispatch('makeStep', data);
	} else {
		console.warn('Empty history to save.');
	}
});

event.listen('doHistory', e => {

	// common.animationOff();

	for(let i in e.data) {

		event.dispatch('redo', e.data[i]);

		if(typeof e.callback == 'function') {
			e.callback(e.data[i]);
		}
	}

	// common.animationOn();
});

event.listen('resetHistory', e => {
	_history.reset();
});

export default _history;