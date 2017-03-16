'use strict';

import event     from 'event'   ;
import share     from 'share'   ;
import defaults  from 'defaults';
import common    from 'common'  ;

import allToAll  from 'allToAll';
import bestTip   from 'bestTip' ;
import Deck      from 'deck'    ;
import Field     from 'field'   ;

/*
 * getTips
 * checkTips
 * showTips
 * hideTips
 * tipsMove
 * tipsDestination
 * checkFrom
 * fromTo
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

	let _decks = Deck.getDecks({visible : true});

	_tips = allToAll({
		"decks" : _decks
	});

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
				// 	_tips[i].to.count === 0                             &&
				// 	Field.tipsParams.hideOnEmpty
				// )                                                       ||
				(
					Field.tipsParams.excludeHomeGroups                  &&
					_homeGroups                                         &&
					_homeGroups.length                                  &&
					_homeGroups.indexOf(_tips[i].from.deck.parent) >= 0
				)
			) {
				// ?#$%&!
			} else {

				event.dispatch('showTip', {
					"el"   : _tips[i].from.card, 
					"type" : 'tip'
				});
				
			}

			if(_homeGroups.indexOf(_tips[i].to.deck.parent) >= 0) {
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

// show/hide tips

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

// best tip on move

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

event.listen('autoStepToHome', data => {

	console.log('autoStepToHome:', _tips);

	let _homeGroups = Field.homeGroups;
	let homeGroupDecksNames = [];

	for(let groupName of _homeGroups) {
		let group = common.getElementsByName(groupName, 'deck')[0];
		let decks = group.getDecks();
		for(let deck of decks) {
			homeGroupDecksNames.push(deck.name);
		}
	}

	let suitableTips = [];

	for(let tip of _tips) {
		if(homeGroupDecksNames.indexOf(tip.to.deck.name) >= 0) {
			suitableTips.push(tip);
		}
	}

	let groupByFrom = {};

	for(let tip of suitableTips) {
		if(groupByFrom[tip.from.deck.name]) {
			groupByFrom[tip.from.deck.name].push(tip);
		} else {
			groupByFrom[tip.from.deck.name] = [tip];
		}
		// forceMove();
	}

	for(let from in groupByFrom) {
		let tips = groupByFrom[from];
		// TODO select best tip
		let tipIndex = 0;// tips.length == 1 ? 0 : ((Math.random() * tips.length) | 0);
		let tip = tips[tipIndex];

		let forceMoveData = {
			"from" : tip.from.deck.name  ,
			"to"   : tip.to  .deck.name  ,
			"deck" : [tip.from.card.name]
		};

		event.dispatch('forceMove', forceMoveData);
	}


});

export default {
	tipTypes       ,
	getTips        ,
	checkTips      ,
	showTips       ,
	hideTips       ,
	tipsMove       ,
	checkFrom      ,
	fromTo         ,
	tipsDestination
};
