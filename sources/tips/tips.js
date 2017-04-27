'use strict';

import event    from 'event'   ;
import share    from 'share'   ;
import defaults from 'defaults';
import common   from 'common'  ;

import allToAll from 'allToAll';
import bestTip  from 'bestTip' ;
import Deck     from 'deck'    ;
import Field    from 'field'   ;

/*
 * getTips
 * checkTips
 * showTips
 * hideTips
 * tipsMove
 * tipsDestination
 * checkFrom
 * fromTo
 * autoMoveToHome
 */

let _showTips = defaults.showTips;

let tipTypes = [
	'tip'        ,
	'tipTo'      ,
	'tipPriority',
	'tipToHome'
];

let _tips = [];

let getTips = e => _tips;

let checkTips = e => {

	if(share.get('noTips')) {
		return false;
	}

	event.dispatch('hideTips');

	let _decks = Deck.getDecks({
		"visible" : true
	});

	// console.groupCollapsed('check tips');
	_tips = allToAll({
		"decks" : _decks
	});
	// console.groupEnd();

	if(
		_tips.length == 0                          &&
		share.get('stepType') == defaults.stepType
	) {

		event.dispatch('noTips');
		console.log('No possible moves.');
	}

	// let _showTips = share.get('showTips')
	if(_showTips) {

		let _homeGroups = Field.homeGroups;

		for(let i in _tips) {

			// TODO инициализировать "hideTipsInDom" в Field.js 
			if(
				// (
				// 	_tips[i].to.count === 0            &&
				// 	Field.tipsParams.hideOnEmpty
				// )                                   ||
				(
					Field.tipsParams.excludeHomeGroups &&
					_homeGroups                        &&
					_homeGroups.length
				)
			) {
				// не выделять подсказки с ходом из "дома"
				if(_homeGroups.indexOf(_tips[i].from.deck.parent) < 0) {
					event.dispatch('showTip', {
						"el"   : _tips[i].from.card, 
						"type" : 'tipToHome'
					});
				}
			} else {
				event.dispatch('showTip', {
					"el"   : _tips[i].from.card, 
					"type" : 'tipToHome'
				});
			}
		}
	}
};

event.listen('makeStep' , checkTips);
event.listen('checkTips', checkTips);

// вкл./выкл. показа подсказок

let showTips = data => {

	_showTips = true;

	if(data && data.init) {
		return;
	}

	checkTips();
};
event.listen('tips:on', showTips);
event.listen('tipsON' , showTips);

let hideTips = data => {

	_showTips = false;

	if(data && data.init) {
		return;
	}

	checkTips();
};
event.listen('tips:off', hideTips);
event.listen('tipsOFF' , hideTips);

// лучший ход на в текущем положении перетаскиваемой стопки
let tipsMove = data => {

	if(!share.get('showTipPriority')) {
		return;
	}

	event.dispatch('hideTips', { "types" : ['tipPriority'] });

	if(
		share.showTipPriority                          &&
		data                                           &&
		data.moveDeck                                  &&
		data.cursorMove                                &&
		data.cursorMove.distance                       &&
		data.cursorMove.distance >= share.moveDistance
	) {

		let Tip = bestTip(data.moveDeck, data.cursorMove);

		if(Tip) {

			event.dispatch('showTip', {
				"el"   : Tip.to.deck,
				"type" : 'tipPriority'
			});
		}
	}
};

// tips destination decks
let tipsDestination = data => {

	if(share.get('showTipsDestination')) {

		event.dispatch('hideTips');

		if(data && data.currentCard && data.currentCard.id) {
			for(let i in _tips) {
				if(_tips[i].from.card.id == data.currentCard.id) {					

					event.dispatch('showTip', {
						"el"   : _tips[i].to.deck, 
						"type" : 'tipTo'
					});
				}
			}
		}
	}
};

// has tips with from
let checkFrom = from => {

	for(let i in _tips) {
		if(
			_tips[i].from.deck.name == from
		) {
			return true;
		}
	}

	return false;
};

// has tips with from and to
let fromTo = (from, to) => {

	for(let i in _tips) {
		if(
			_tips[i].from.deck.name == from &&
			_tips[i].to  .deck.name == to
		) {
			return true;
		}
	}

	return false;
};

// Автоход в "дом"
let autoMoveToHome = data => {

	event.dispatch('startRunHistory');

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

		let forceMoveData = {
			"from"    :  tip.from.deck.name ,
			"to"      :  tip.to  .deck.name ,
			"deck"    : [tip.from.card.name],
			"addStep" : true                ,
			"save"    : true
		};

		event.dispatch('forceMove', forceMoveData);

		checkTips();

		autoMoveToHome(data);
	} else {
		event.dispatch('winCheck', {
			"show" : true
		});
	}
};

event.listen('autoMoveToHome', autoMoveToHome);

export default {
	"tipTypes"        : tipTypes       ,
	"getTips"         : getTips        ,
	"checkTips"       : checkTips      ,
	"showTips"        : showTips       ,
	"hideTips"        : hideTips       ,
	"tipsMove"        : tipsMove       ,
	"checkFrom"       : checkFrom      ,
	"fromTo"          : fromTo         ,
	"tipsDestination" : tipsDestination
};