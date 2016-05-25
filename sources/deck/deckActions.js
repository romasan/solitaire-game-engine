'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

// Actions
import twindeckAction   from 'twindeckAction';
import dealerdeckAction from 'dealerdeckAction';
import kickAction       from 'kickAction';

var _actions = {
	"twindeck"   : twindeckAction  ,
	"dealerdeck" : dealerdeckAction,
	"kick"       : kickAction      ,
	"avalanche"  : function(e) {// 
		// listen avalanche
	}
};

// ------------------------------------------------------------------------------------------

// History extension
// History.addUndoMethods({twindeck : function(a) {
// 	if(a.twindeck) {
		
// 		var _deck_from = Deck.Deck(a.twindeck.from),
// 			_deck_to   = Deck.Deck(a.twindeck.to);
		
// 		// TODO
// 		// deck_to cards [moveCards] -> deck_from
// 		var _moveDeck = _deck_to.Pop(a.twindeck.moveCards.length);
// 		if(_moveDeck.length) {
// 			_deck_from.Push(_moveDeck);
// 		}

// 		var _twindeck = [];
// 		for(var i in a.twindeck.toHide) {
// 			if(_deck_from.twindeck.length) {
// 				_twindeck.push(
// 					_deck_from.twindeck.pop()
// 				);
// 			}
// 		}
// 		_twindeck.reverse();
		
// 		if(_twindeck.length) {
// 			_deck_to.Push(_twindeck);
// 		}

// 		_deck_from.flipCheck();
// 		_deck_to  .showCards();
// 		_deck_from.Redraw();
// 		_deck_to  .Redraw();
		
// 		// console.log('twindeck undo:', a.twindeck, share.deckCardNames(_deck_from.twindeck));
// 	}
// }});

// History.addRedoMethods({twindeck : function(a) {
// 	if(a.twindeck) {
// 		// TODO
// 		console.log('twindeck redo:', a.twindeck);
// 	}
// }});

var _decksActions  = [],
	_events = [];

var addActionEvent = function(_event) {
	
	// console.log('addActionEvent#1', _event);
	
	event.listen(_event, function(data) {

		// console.log(_event, data, _decks);

		for(var i in _decksActions) {
			if(_decksActions[i].event == _event) {
				
				var _actionName = _decksActions[i].action;
				

				var _canRun = _event == 'click'
					? data.name == _decksActions[i].deck.name
					: true;
				
				if(_canRun) {
					
					// console.log('RUN', _actionName, 'for', _decksActions[i].deck.name, 'on', _event);
					
					_actions[_actionName].call(
						_decksActions[i].deck, 
						{
							actionData : _decksActions[i].deck.actions[_actionName],
							eventData  : data,
							eventName  : _event
						}
					);
				};
			}
			// for(var actionName in _decksActions[i].deck.actions) {
				// if(_decksActions[i].actions[actionName].event == _event) {

					
					// if(_actions[actionName]) {
					
					// _actions[actionName].call(_decks[i], _decks[i].actions[actionName], e);
					
					// }
				// }
			// }
		}
	});

};

// addActionEvent('click');

var addActions = function() {

	// console.log(this.name, 'add actions:', this);

	for(var actionName in this.actions) {

		if(!this.actions[actionName].event) {
			this.actions[actionName].event = 'click';
		}

		if(_actions[actionName]) {
			
			_decksActions.push({
				deck   : this, 
				event  : this.actions[actionName].event,
				action : actionName
			});

			// console.log('add action:', actionName, this.actions[actionName].event, _events.indexOf(this.actions[actionName].event) < 0, _events);
			if(_events.indexOf(this.actions[actionName].event) < 0) {
				_events.push(this.actions[actionName].event);
				addActionEvent(this.actions[actionName].event);
			}
		} else {
			console.warn('Action', actionName, 'for', this.name, 'not found.');
		};

	}
	autoRunActions(this.actions);
};

/*var runActions = function(e) {// bind this deck

	common.animationDefault()

	for(var actionName in this.actions) {
		if(
			typeof this.actions[actionName].type == "undefined"
		 || this.actions[actionName].type && this.actions[actionName].listen == "click" // default action event - click
		) {
			if(_actions[actionName]) {
				// console.log('run action', this, actionName, this.actions[actionName]);
				_actions[actionName].call(this, this.actions[actionName]);
			}
		}
	}
	// Tips.checkTips();
}*/

var autoRunActions = function(data) {// bind this deck

	common.animationDefault();

	for(var actionName in data.actions) {
		if(data.actions[actionName].autorun) {
			if(_actions[actionName]) {
				_actions[actionName].call(
					data, 
					{
						actionData : data.actions[actionName],
						eventData  : null,
						eventName  : data.actions[actionName].event
					}
				);
			}
		}
	}
	// Tips.checkTips();
}

export default {
	// autoRunActions,
	// runActions,
	addActions
}