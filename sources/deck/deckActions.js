'use strict';

import common, {event, share, defaults} from '../common';

// Actions
import * as _actions from './actions';

import Deck from './';

let _decksActions = [],
	_events = [];

event.listen('logActions', e => { // debul log actions
	console.log('_decksActions', _decksActions);
	console.log('_events', _events);
});

event.listen('initField', e => {
	_decksActions = [];
	_events = [];
});

/**
 * addActionEvent
 * @param {string} eventName 
 */
let addActionEvent = eventName => {

	event.listen(

		// event name
		eventName,

		// callback
		data => {

			for (let i in _decksActions) {
				if (_decksActions[i].event == eventName) {

					let _actionName = _decksActions[i].action;

					let _canRun = eventName.indexOf('click') == 0
						? data.to.name == _decksActions[i].deck.name
						: true;

					if (
						_canRun //                &&
						// !share.get('gameIsWon')
					) {
						_actions[_actionName].run(

							_decksActions[i].deck,

							{
								"actionData" : _decksActions[i].deck.actions[_actionName],
								"eventData"  : data                                      ,
								"eventName"  : eventName
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

/**
 * Add actions by names
 * @param {Deck} deck
 */
let add = deck => {

	for (let actionName in deck.actions) {

		// если такой action существует
		if (typeof _actions[actionName] != 'undefined') {

			if (!deck.actions[actionName].events) {
				// если не описано событие выполнять по клику
				if (typeof deck.actions[actionName].event == "string") {
					deck.actions[actionName].events = [deck.actions[actionName].event];
				} else {
					deck.actions[actionName].events = ['click'];
				}
			}

			for (let i in deck.actions[actionName].events) {

				let _event = deck.actions[actionName].events[i];

				// сохраняем action
				_decksActions.push({
					"deck"   : deck      ,
					"event"  : _event    ,
					"action" : actionName
				});

				share.set('actionEvent:' + deck.name + ':' + _event, true); // TODO узнать нужна ли ещё эта строчка

				// создаём событие если оно еще не создано
				if (!_events.indexOf(_event) >= 0) {

					// сохраняем событие в список с уже созданными
					_events.push(_event);

					// вешаем событие
					addActionEvent(_event);
				}
			}
		} else {
			console.warn('Action', actionName, 'for', deck.name, 'not found.');
		};

	}

	autoRunActions(deck);
};

/**
 * autoRunActions
 * @param {Deck} deck 
 */
let autoRunActions = deck => {

	common.animationDefault();

	for (let actionName in deck.actions) {

		// Требуется запуск при инициализации
		if (deck.actions[actionName].autorun) {

			if (_actions[actionName]) {

				_actions[actionName].run(

					deck,

					{
						"actionData" : deck.actions[actionName]      ,
						"eventData"  : null                          ,
						"eventName"  : deck.actions[actionName].event
					}
				);
			}
		}
	}
	// Tips.checkTips();
}

/**
 * @typedef {Object} runActionData
 * @property {string} actionName
 * @property {string} deckName
 * @property {*} eventData
 * @property {string} eventName
 */

 /**
  * Run action
  * @param {runActionData} data
  */
let runAction = data => { // {actionName, deckName, <eventData>, eventName}

	if (_actions[data.actionName]) {
		_actions[data.actionName].run(

			data.deck,

			{
				"actionData" : data.deck.actions[data.actionName],
				"eventName"  : data.eventName                    ,
				"eventData"  : data.eventData
			}
		)
	}
}

// let getExtends = key => _actions[key].extends();

export default {
	"add"        : add       ,
	"run"        : runAction ,
	// "getExtends" : getExtends
}
