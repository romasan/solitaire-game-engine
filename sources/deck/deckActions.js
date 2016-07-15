'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

// Actions
import twindeck    from 'twindeckAction';
import dealerdeck  from 'dealerdeckAction';
import kickAction  from 'kickAction';
import stepsAround from 'stepsAroundAction';

var _actions = {
	"twindeck"    : twindeck   ,
	"dealerdeck"  : dealerdeck ,
	"kick"        : kickAction ,
	"stepsAround" : stepsAround     
};

// ------------------------------------------------------------------------------------------

var _decksActions  = [],
	_events = [];

var addActionEvent = function(_event) {

	event.listen(_event, function(data) {

		for(var i in _decksActions) {
			if(_decksActions[i].event == _event) {
				
				var _actionName = _decksActions[i].action;
				

				var _canRun = _event == 'click'
					? data.name == _decksActions[i].deck.name
					: true;
				
				if(_canRun) {
					
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
		}
	});

};

var addActions = function() {

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
	addActions
}