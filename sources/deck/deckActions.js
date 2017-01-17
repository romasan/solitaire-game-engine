'use strict';

import event    from 'event'                     ;
import share    from 'share'                     ;
import defaults from 'defaults'                  ;
import common   from 'common'                    ;

// Actions
import twindeck       from 'twindeckAction'      ;
import dealerdeck     from 'dealerdeckAction'    ;
import kickAction     from 'kickAction'          ;
import stepsAround    from 'stepsAroundAction'   ;
import changeStepType from 'changeStepTypeAction';
import lock           from 'lockAction'          ;
import unlock         from 'unlockAction'        ;
import checkFull      from 'checkFullAction'     ;

let _actions = {
	"twindeck"       : twindeck      ,
	"dealerdeck"     : dealerdeck    ,
	"kick"           : kickAction    ,
	"stepsAround"    : stepsAround   ,
	"changeStepType" : changeStepType,
	"lock"           : lock          ,
	"unlock"         : unlock        ,
	"checkFull"      : checkFull
};

/*
 * addActionEvent
 * add
 * autoRunActions
 */

let _decksActions  = [],
    _events        = [];

event.listen('initField', e => {
	_decksActions = [];
	_events       = [];
})

let addActionEvent = eventName => {

	event.listen(

		// event name
		eventName, 
		
		// callback
		data => {

			for(let i in _decksActions) {
				if(_decksActions[i].event == eventName) {
					
					let _actionName = _decksActions[i].action;

					let _canRun = eventName == 'click'
					    ? data.to.name == _decksActions[i].deck.name
					    : true;
					
					if(_canRun) {
						
						_actions[_actionName].run(
							
							_decksActions[i].deck, 
							
							{
								actionData : _decksActions[i].deck.actions[_actionName],
								eventData  : data,
								eventName
							}
						);
					};
				}
			}
		},

		// context
		'addActionEvent:' + eventName
	);

};

let add = deck => {

	for(let actionName in deck.actions) {

		// если не описано событие выполнять по клику
		if(!deck.actions[actionName].event) {
			deck.actions[actionName].event = 'click';
		}

		// если такой action существует
		if(_actions[actionName]) {
			
			// сохраняем action
			_decksActions.push({
				deck   : deck, 
				event  : deck.actions[actionName].event,
				action : actionName
			});

			share.set('actionEvent:' + deck.name + ':' + deck.actions[actionName].event, true);
			
			// создаём событие если оно еще не создано
			if(!_events.indexOf(deck.actions[actionName].event) >= 0) {
				
				// сохраняем событие в список с уже созданными
				_events.push(deck.actions[actionName].event);
				
				// вешаем событие
				addActionEvent(deck.actions[actionName].event);
			}
		} else {
			console.warn('Action', actionName, 'for', deck.name, 'not found.');
		};

	}
	
	autoRunActions(deck);
};

let autoRunActions = deck => {

	common.animationDefault();

	for(let actionName in deck.actions) {
		if(deck.actions[actionName].autorun) {
			if(_actions[actionName]) {
				_actions[actionName].run(

					deck, 

					{
						actionData : deck.actions[actionName],
						eventData  : null,
						eventName  : deck.actions[actionName].event
					}
				);
			}
		}
	}
	// Tips.checkTips();
}

export default {
	add
}