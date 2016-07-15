'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';
import common    from 'common';

import forceMove from 'forceMove';

let stepType = 'dealerdeckStepType';

export default function(data) {// data.actionData, e

	// listen click
	// click is for me (default)
	// if(this.name != data.actionData.name) { return; };
	
	share.set('stepType', stepType);
	
	if(this.cards.length == 0) {

		share.set('stepType', defaults.stepType);
		
		return;
	}

	var _decks = [];

	if(data.actionData.toGroup && !data.actionData.to) {
		
		data.actionData.to = data.actionData.toGroup;
		
		// _decks = _decks.concat(Group.Group(e.toGroup).decks);
		
		// var __decks = Group.Group(data.actionData.toGroup).decks;
		// for(var deckIndex in __decks) {
		// 	_decks.push(__decks[deckIndex]);
		// }
	};

	if(data.actionData.to) {
		if(typeof data.actionData.to == "string") {
			
			var _elements = common.getElementsByName(data.actionData.to);
			for(var i in _elements) {

				if(_elements[i].type == "group") {
					
					// _decks = _decks.concat(Group.Group(data.actionData.to).decks);
					// var __decks = Group.Group(data.actionData.to).decks;
					
					for(var deckIndex in _elements[i].decks) {
						_decks.push(_elements[i].decks[deckIndex]);
					}
				};

				if(_elements[i].type == "deck") {
					_decks.push(_el);
				};

			}

		} else {
			for(var i in data.actionData.to) {
				
				var _elements = common.getElementsByName(data.actionData.to[i]);
				
				for(var elIndex in _elements) {

					if(_elements[elIndex].type == "group") {
						// _decks = _decks.concat(Group.Group(data.actionData.to[i]).decks);
						// var __decks = Group.Group(data.actionData.to[i]).decks;
						for(var deckIndex in _elements[elIndex].decks) {
							_decks.push(_elements[elIndex].decks[deckIndex]);
						}
					};

					if(_elements[elIndex].type == "deck") {
						_decks.push(_elements[elIndex]);
					};

				}

			}
		}
	};
	
	common.animationDefault();

	var _makeStep = false;

	for(var deckId in _decks) {
		
		var _card = this.getTopCard();

		_decks[deckId].cards.length == 0 && data.actionData.onlyEmpty

		var _canStep = data.actionData.onlyEmpty
			? _decks[deckId].cards.length == 0
			: true;
		
		if(_canStep && _card) {

			_makeStep = true;

			var _cardName = _card.name
			
			forceMove({
				from : this.name,
				to   : _decks[deckId].name,
				deck : [_cardName],
				flip : true
			}, true);
			
			_decks[deckId].flipCheck();
			// _decks[deckId].Redraw();

			event.dispatch('addStep', {
				from : this.name,
				to   : _decks[deckId].name,
				deck : [_cardName],
				flip : true
			});

		};

	};
	
	if(_makeStep) {
		
		event.dispatch('saveSteps');
		// if(History.count()) {
		// 	event.dispatch('makeStep', History.get());
		// }
	};

	if(data.actionData.dispatch) {

		event.dispatch(data.actionData.dispatch, !_makeStep);
	} else {
		
		share.set('stepType', defaults.stepType);
	}

}