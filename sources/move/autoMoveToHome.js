'use strict';

import event  from 'event' ;
import common from 'common';

import Field  from 'field' ;
import Tips   from 'tips'  ;

// Автоход в "дом"
let autoMoveToHome = e => {

	// console.log('autoMoveToHome');

	let _tips = Tips.getTips();

	// event.dispatch('startRunHistory');

	let _homeGroups = Field.homeGroups;
	let homeGroupDecksNames = [];

	for(let groupNameIndex in _homeGroups) {

		let groupName = _homeGroups[groupNameIndex];

		let group = common.getElementsByName(groupName, 'deck')[0];
		let decks = group.getDecks();

		for(let deckIndex in decks) {

			let deck = decks[deckIndex];

			homeGroupDecksNames.push(deck.name);
		}
	}

	let suitableTips = [];

	for(let tipIndex in _tips) {

		let tip = _tips[tipIndex];

		if(
			homeGroupDecksNames.indexOf(tip.to  .deck.name) >= 0 &&
			homeGroupDecksNames.indexOf(tip.from.deck.name) <  0
		) {
			suitableTips.push(tip);
		}
	}

	if(suitableTips.length > 0) {

		let tip = suitableTips[0];

		let autoMoveToHomeCallback = e => {

			Tips.checkTips();

			autoMoveToHome();
		};

		let forceMoveData = {
			"from"     :  tip.from.deck.name ,
			"to"       :  tip.to  .deck.name ,
			"deck"     : [tip.from.card.name],
			"addStep"  : true                ,
			"save"     : true                ,
			"callback" : autoMoveToHomeCallback
		};

		event.dispatch('forceMove', forceMoveData);
	} else {

		event.dispatch('winCheck', {
			"show" : true
		});

		event.dispatch('autoMoveToHome:done');
	}
};

event.listen('autoMoveToHome', autoMoveToHome);