'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';
import common    from 'common';

import allToAll  from 'allToAll';
import bestTip   from 'bestTip';
import Deck      from 'addDeck';
import Field     from 'field';

let _showTips = defaults.showTips;

let tipTypes = [
	'tip'        , 
	'tipTo'      , 
	'tipPriority',
	'tipToHome'
];

let _tips = [];

let getTips = () => {
	return _tips;
}

let checkTips = () => {

	if(share.get('noTips')) {
		return false;
	}

	event.dispatch('hideTips');

	let _decks = Deck.getDecks({visible : true});

	_tips = allToAll({
		decks : _decks
	});

	if(
		_tips.length === 0                         &&
		share.get('stepType') == defaults.stepType
	) {
		
		event.dispatch('noTips');
		console.log('No possible moves.');
	}

	// var _showTips = share.get('showTips')
	if(_showTips) {

		let _homeGroups = Field.homeGroups;

		for(let i in _tips) {

			// TODO инициализировать "hideTipsInDom" в Field.js 
			if(
				(
					_tips[i].to.count === 0                             &&
					Field.tipsParams.hideOnEmpty
				)                                                       ||
				(
					Field.tipsParams.excludeHomeGroups                 &&
					_homeGroups                                         &&
					_homeGroups.length                                  &&
					_homeGroups.indexOf(_tips[i].from.deck.parent) >= 0
				)
			) {
				// ?#$%&!
			} else {

				event.dispatch('showTip', {
					el   : _tips[i].from.card, 
					type : 'tip'
				});
				
			}
			
			if(_homeGroups.indexOf(_tips[i].to.deck.parent) >= 0) {
				event.dispatch('showTip', {
					el   : _tips[i].from.card, 
					type : 'tipToHome'
				});
			}

		}
	}

};

event.listen('makeStep', checkTips);
event.listen('checkTips', checkTips);

// --------------------------------------------------------

let showTips = (a) => {
	
	_showTips = true;
	
	if(a && a.init) {
		return;
	}
	
	checkTips();
};
event.listen('tipsON', showTips);

let hideTips = (a) => {
	
	_showTips = false;
	
	if(a && a.init) {
		return;
	}
	
	checkTips();
};
event.listen('tipsOFF', hideTips);

// --------------------------------------------------------

let tipsMove = (a) => {

	if(!share.get('showTipPriority')) {
		return;
	}

	event.dispatch('hideTips', {types : ['tipPriority']});

	if(
		share.showTipPriority                       &&
		a                                           &&
		a.moveDeck                                  &&
		a.cursorMove                                &&
		a.cursorMove.distance                       &&
		a.cursorMove.distance >= share.moveDistance
	) {

		let Tip = bestTip(a.moveDeck, a.cursorMove);

		if(Tip) {

			event.dispatch('showTip', {
				el   : Tip.to.deck,
				type : 'tipPriority'
			});
		}
	}
};

// --------------------------------------------------------

let tipsDestination = (a) => {

	if(share.get('showTipsDestination')) {

		event.dispatch('hideTips');
		
		if(a && a.currentCard && a.currentCard.id) {
			for(let i in _tips) {
				if(_tips[i].from.card.id == a.currentCard.id) {					
					
					event.dispatch('showTip', {
						'el'   : _tips[i].to.deck, 
						'type' : 'tipTo'
					});
				}
			}
		}
	}
};

let checkFrom = (_from) => {

	for(let i in _tips) {
		if(
			_tips[i].from.deck.name == _from
		) {
			return true;
		}
	}
	
	return false;
};

let fromTo = (_from, _to) => {
	
	for(let i in _tips) {
		if(
			_tips[i].from.deck.name == _from &&
			_tips[i].to.deck.name   == _to
		) {
			return true;
		}
	}
	
	return false;
};

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
