'use strict';

import event  from '../common/event';
import share  from '../common/share';
import common from '../common'      ;

import Field  from '../field'       ;
import Tips   from '../tips'        ;
import fallAutoStep from '../autosteps/fallAutoStep';

let checkAutoMoveToHomeOpenDecks = e => {

	let autoMoveToHomeOpenDecks = share.get('autoMoveToHomeOpenDecks');

	if (autoMoveToHomeOpenDecks.checked) {
		return;
	}

	let _data = {
		"checked" : true,
		"decks"   : []
	};

	for (let i in autoMoveToHomeOpenDecks) {

		let el = common.getElementByName(autoMoveToHomeOpenDecks[i]);

		if (el) {

			if (el.type == 'group') {

				let _decks = el.getDecks();

				for (let deckIndex in _decks) {
					_data.decks.push(_decks[deckIndex]);
				}
			} else if (el.type == 'deck') {
				_data.decks.push(el);
			}
		}
	}

	share.set('autoMoveToHomeOpenDecks', _data);
}

// Автоход в "дом"
let autoMoveToHomeActive = false;
let breakAutoMoveToHome  = false;

let autoMoveToHome = outer => {

	if (autoMoveToHomeActive && outer) {
		console.log('auto move to home is active');
		return;
	}

	// if (outer) {
	// 	breakAutoMoveToHome = false;
	// }

	share.set('pre_undo_redo_callback', () => {

		share.delete('pre_undo_redo_callback');

		breakAutoMoveToHome = true;
	});

	if (breakAutoMoveToHome) {

		breakAutoMoveToHome  = false;
		autoMoveToHomeActive = false;

		share.delete('pre_undo_redo_callback');
	// 	console.log('break auto move to home on history undo/redo');
		return;
	}

	autoMoveToHomeActive = true;

	// console.log('autoMoveToHome');

	checkAutoMoveToHomeOpenDecks();

	let autoMoveToHomeOpenDecks = share.get('autoMoveToHomeOpenDecks');

	for (let i in autoMoveToHomeOpenDecks.decks) {

		let _topCard = autoMoveToHomeOpenDecks.decks[i].getTopCard();

		if (_topCard && _topCard.flip == true) {
			event.dispatch('clickCard', _topCard);
		}
	}

	// Tips.checkTips();

	let _tips = Tips.getTips();

	if (_tips.length) {
		event.dispatch('autoMoveToHome:start');
	}

	// event.dispatch('startRunHistory');

	let _homeGroups = Field.homeGroups;
	let homeGroupDecksNames = [];

	for (let groupNameIndex in _homeGroups) {

		let groupName = _homeGroups[groupNameIndex];

		let group = common.getElementsByName(groupName, 'deck')[0];
		let decks = group.getDecks();

		for (let deckIndex in decks) {

			let deck = decks[deckIndex];

			homeGroupDecksNames.push(deck.name);
		}
	}

	let suitableTips = [];

	for (let tipIndex in _tips) {

		let tip = _tips[tipIndex];

		if (
			homeGroupDecksNames.indexOf(tip.to  .deck.name) >= 0 &&
			homeGroupDecksNames.indexOf(tip.from.deck.name) <  0
		) {
			suitableTips.push(tip);
		}
	}

	if (suitableTips.length > 0) {

		let tip = suitableTips[0];

		let autoMoveToHomeCallback = e => {

			Tips.checkTips();

			event.dispatch('undo_redo_end_of_expectation', 'autoMoveToHome');
			
			autoMoveToHome();
		};

		let forceMoveData = {
			"from"     :  tip.from.deck.name   ,
			"to"       :  tip.to  .deck.name   ,
			"deck"     : [tip.from.card.name]  ,
			"addStep"  : true                  ,
			"save"     : true                  ,
			"callback" : autoMoveToHomeCallback
		};

		event.dispatch('forceMove', forceMoveData);
	} else {

		autoMoveToHomeActive = false;

		share.delete('pre_undo_redo_callback');

		event.dispatch('undo_redo_end_of_expectation', 'autoMoveToHome');

		event.dispatch('winCheck', {
			"show" : true
		});

		event.dispatch('autoMoveToHome:done');
	}
};

// event.listen('undoredo', e => {
// 	console.log('make', e);
// 	breakAutoMoveToHome = true;
// });

event.listen('initField', e => {
	autoMoveToHomeActive = false;
})

event.listen('autoMoveToHome', e => {
	autoMoveToHome(true);
});