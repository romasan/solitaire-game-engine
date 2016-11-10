'use strict';

// module.exports = function(main, share) {
import share        from 'share';
import event        from 'event';
import defaults     from 'defaults';
import common       from 'common';

import Group        from 'group';
import Deck         from 'deck';
import Tips         from 'tips';
import addAutoSteps from 'addAutoSteps';
import storage      from 'storage';

// Model
// let values = {
// 	"homeGroups": {
// 		"type": ["array", "string"],
// 		"value": [],
// 		"dest": "array"
// 	}
// }

class Field {

	constructor() {

		share.set('elements', {});
		
		this.tipsParams = {};
		this.inputParams = {};
	}

	create(data) {

		let a = null;
		try {
			a = Object.assign({}, data);
		} catch(e) {
			a = data;
			console.warn('Field input params is not JSON, maybe the rules are wrong.');
		}

		this.homeGroups = a.homeGroups ? a.homeGroups : [];

		// вкл./выкл. подсказок
		if(typeof a.showTips == 'boolean' && a.showTips) {
			Tips.showTips({init : true});
		} else {
			Tips.hideTips({init : true});
		}

		// устанвливаем тип хода по умолчанию
		share.set('stepType', defaults.stepType);

		// Альтернативные подсказки
		share.set(
		'showTipsDestination', 
		typeof a.showTipsDestination == 'boolean' 
			? a       .showTipsDestination 
			: defaults.showTipsDestination
		);
		
		share.set(
			'showTipPriority', 
			typeof a.showTipPriority == 'boolean' 
				? a       .showTipPriority 
				: defaults.showTipPriority
		);

		share.set(
			'moveDistance', 
			a.moveDistance && typeof a.moveDistance == 'number' 
				? a.moveDistance 
				: defaults.moveDistance
		);

		// условие выигрыша
		share.set('winCheck', a.winCheck);

		// масштаб отображения
		share.set(
			'zoom', 
			(a.zoom && typeof a.zoom == 'number') 
				? a.zoom 
				: defaults.zoom
		);

		// Настройки игры
		if(a.preferences) {
			let _pref = storage.get('pref'),
			    _preferences = {},
			    _prefData    = {};
			for(let prefName in a.preferences) {
				if(typeof prefName == "string") {
					_preferences[prefName] = a.preferences[prefName];
					_prefData[prefName] = _pref && typeof _pref[prefName] != "undefined" ? _pref[prefName] : a.preferences[prefName].value;
				}
			}
			share.set('gamePreferences', _preferences);
			share.set('gamePreferencesData', _prefData);
		} else {
			share.set('gamePreferences', {});
		}

		// время анимации
		share.set({
			animationTime : typeof data.animationTime == "number"
				? data.animationTime
				: defaults.animationTime
		});

		// параметры отображения подсказок
		for(let tipParamName in defaults.tipsParams) {
			this.tipsParams[tipParamName] = (a.tipsParams && typeof a.tipsParams[tipParamName] != "undefined")
				? a.tipsParams[tipParamName]
				: defaults.tipsParams[tipParamName]
		}

		// параметры ввода
		for(let inputParamName in defaults.inputParams) {
			this.inputParams[inputParamName] = (a.inputParams && typeof a.inputParams[inputParamName] != "undefined")
				? a.inputParams[inputParamName]
				: defaults.inputParams[inputParamName]
		}

		// дополнительные параметры отображения
		// начальная позиция порядка отображения элементов
		if(a.startZIndex && typeof a.startZIndex == 'number') {
			share.set('start_z_index', a.startZIndex);
		}

		// инициализация автоходов
		if(a.autoSteps) {
			this.autoSteps = addAutoSteps(a.autoSteps);
		}

		// NOTE: на событие подписан deckActions
		// если ставить позже отрисовки элементов, переделать
		event.dispatch('initField', a);

		// Отрисовка элементов
		if(a.groups) {
			for(let groupName in a.groups) {
				a.groups[groupName].name = groupName;
				Group.addGroup(a.groups[groupName]);
			}
		}

		if(a.decks) {
			for(let e in a.decks) {
				Deck.addDeck(a.decks[e]);
			}
		}

		if(a.fill) {
			
			let _decks = Deck.getDecks();
			let _fill  = null;
			try {
				_fill = Object.assign([], a.fill);
			} catch(e) {
				_fill = a.fill;
			}

			for(;_fill.length;) {
				for(let deckId in _decks) {
					if(_fill.length) {
						let _card = _fill.shift();
						_decks[deckId].Fill([_card]);
					}
				}
			}
		}

		// Найти возможные ходы
		Tips.checkTips();

		// событие: игра началась
		event.dispatch('newGame');

	}

	Redraw(data) {

		let a = null;

		if(data) {

			try {
				a = Object.assign({}, data);
			} catch(e) {
				a = data;
				console.warn('Field.Redraw input params is not JSON, can\'t clone');
			}

			for(let _groupName in a.groups) {

				let _group = Group.getGroup(_groupName);
				
				if(_group) {
					_group.Redraw(a.groups[_groupName]);
				}
			}

			for(let i in a.decks) {
				
				let _deck = Deck.getDeck(a.decks[i].name);
				
				if(_deck) {
					_deck.Redraw(a.decks[i]);
				}
			}

		} else {
			
			let _decks = Deck.getDecks();
			
			for(let i in _decks) {
				_decks[i].Redraw();
			}
		}
	}

	clear() {

		let _elements = share.get('elements');
		
		for(let i in _elements) {
			if(_elements[i].type == 'deck') {
				_elements[i].clear();
				_elements[i] = null;
			} else if(_elements[i].type == 'group') {
				_elements[i] = null;
			}
		}
		
		share.set('elements', {});
	}
}

export default new Field();