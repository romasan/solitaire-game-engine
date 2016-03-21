'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';
import common    from 'SolitaireCommon';

import tipsRules from 'tipsRules';
import bestTip   from 'bestTip';
import Deck      from 'addDeck';
import Field     from 'Field';

var _showTips = defaults.showTips;

var tipTypes = [
	'tip', 
	'tipTo', 
	'tipPriority'
];

var _tips = [];

var getTips = function() {
	return _tips;
}

var checkTips = function(a) {

	// console.log('%cCHECK TIPS', 'background : green');

	event.dispatch('hideTips');

	var _decks = Deck.getDecks({visible : true});
	
	var _autoTipsName = share.get('autoTips');
	var _autoTips = tipsRules[_autoTipsName];
	
	if(typeof _autoTips == 'function') {
		_tips = _autoTips({
			decks : _decks
		});
	} else {
		for(i in share.autoTips) {
			if(typeof share.autoTips[i] == 'function') {
				_tips = _tips.concat(
					autoTips[i]({
						decks : _decks
					})
				);
			} else {
				if(tipsRules[i]) {
					_tips = _tips.concat(
						tipsRules[i]({
							decks : _decks,
							rules : share.autoTips[i]
						})
					);
				}
			}
		}
	}

	// var _showTips = share.get('showTips')
	if(_showTips) {

		var _field = Field();
		var _homeGroups = _field.homeGroups;

		for(var i in _tips) {

			// TODO инициализировать "hideTipsInDom" в Field.js 
			if(
				(
			 	_tips[i].to.count == 0 
			 && _field.tipsParams.hideOnEmpty
			 	)
			 || (
			 	_field.tipsParams.excludeHomeGroups
			 && _homeGroups
			 && _homeGroups.length
			 
			 && _homeGroups.indexOf(_tips[i].from.deck.parent) >= 0
			 	)
			) {
				// ?#$%&!
			} else {

				event.dispatch('showTip', {
					el : _tips[i].from.card, 
					type : 'tip'
				});
			}
		}
	}

	// console.log('Tips:', _tips);
	
};

var showTips = function(a) {
	_showTips = true;
	if(a && a.init) return;
	checkTips();
};
event.listen('tipsON', showTips);

var hideTips = function(a) {
	_showTips = false;
	if(a && a.init) return;
	checkTips();
};
event.listen('tipsOFF', hideTips);

var tipsMove = function(a) {

	if(!share.showTipPriority) return;

	event.dispatch('hideTips', {types : ['tipPriority']});

	if( share.showTipPriority 
	 && a 
	 && a.moveDeck 
	 && a.cursorMove 
	 && a.cursorMove.distance 
	 && a.cursorMove.distance >= share.moveDistance
	) {

		var Tip = bestTip(a.moveDeck, a.cursorMove);

		if(Tip) {

			event.dispatch('showTip', {el : Tip.to.deck, type : 'tipPriority'});
		}
	}
};

var tipsDestination = function(a) {

	if(share.get('showTipsDestination')) {

		event.dispatch('hideTips');
		
		if(a && a.currentCard && a.currentCard.id) {
			for(var i in _tips) {
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

export default {
	tipTypes,
	getTips,
	checkTips,
	showTips,
	hideTips,
	tipsMove,
	tipsDestination
};
