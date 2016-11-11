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
		
		this.tipsParams  = {};
		this.inputParams = {};
	}

	create(data) {

		this.homeGroups = data.homeGroups ? data.homeGroups : [];

		// вкл./выкл. подсказок
		if(typeof data.showTips == 'boolean' && data.showTips) {
			Tips.showTips({init : true});
		} else {
			Tips.hideTips({init : true});
		}

		// устанвливаем тип хода по умолчанию
		share.set('stepType', defaults.stepType);

		// Альтернативные подсказки
		share.set(
			'showTipsDestination', 
			typeof data.showTipsDestination == 'boolean' 
				? data.showTipsDestination 
				: defaults.showTipsDestination
		);
		
		share.set(
			'showTipPriority', 
			typeof data.showTipPriority == 'boolean' 
				? data.showTipPriority 
				: defaults.showTipPriority
		);

		share.set(
			'moveDistance', 
			data.moveDistance && typeof data.moveDistance == 'number' 
				? data.moveDistance 
				: defaults.moveDistance
		);

		// условие выигрыша
		share.set('winCheck', data.winCheck);

		// масштаб отображения
		share.set(
			'zoom', 
			data.zoom && typeof data.zoom == 'number'
				? data.zoom 
				: defaults.zoom
		);

		// Настройки игры
		if(data.preferences) {
			
			let _pref = storage.get('pref'),
			    _preferences = {}          ,
			    _prefData    = {}          ;
			
			for(let prefName in data.preferences) {
				if(typeof prefName == "string") {
					
					_preferences[prefName] = data.preferences[prefName];
					
					_prefData[prefName] = _pref && typeof _pref[prefName] != "undefined"
						? _pref[prefName]
						: data.preferences[prefName].value;
				}
			}
			
			share.set('gamePreferences',     _preferences);
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
			this.tipsParams[tipParamName] = (data.tipsParams && typeof data.tipsParams[tipParamName] != "undefined")
				? data.tipsParams[tipParamName]
				: defaults.tipsParams[tipParamName]
		}

		// параметры ввода
		for(let inputParamName in defaults.inputParams) {
			this.inputParams[inputParamName] = (data.inputParams && typeof data.inputParams[inputParamName] != "undefined")
				? data.inputParams[inputParamName]
				: defaults.inputParams[inputParamName]
		}

		// дополнительные параметры отображения
		// начальная позиция порядка отображения элементов
		if(data.startZIndex && typeof data.startZIndex == 'number') {
			share.set('start_z_index', data.startZIndex);
		}

		// инициализация автоходов
		if(data.autoSteps) {
			this.autoSteps = addAutoSteps(data.autoSteps);
		}

		// NOTE: на событие подписан deckActions
		// если ставить позже отрисовки элементов, переделать
		event.dispatch('initField', data);

		// Отрисовка элементов
		if(data.groups) {
			for(let groupName in data.groups) {
				data.groups[groupName].name = groupName;
				Group.add(data.groups[groupName]);
			}
		}

		if(data.decks) {
			for(let e in data.decks) {
				Deck.addDeck(data.decks[e]);
			}
		}

		if(data.fill) {
			
			let _decks = Deck.getDecks();
			let _fill  = null;
			try {
				_fill = Object.assign([], data.fill);
			} catch(e) {
				_fill = data.fill;
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

		// прокидываеем <новую> конфигурацию
		if(data) {

			for(let _groupName in data.groups) {

				let _group = Group.getGroup(_groupName);
				
				if(_group) {
					_group.Redraw(data.groups[_groupName]);
				}
			}

			for(let i in data.decks) {
				
				let _deck = Deck.getDeck(data.decks[i].name);
				
				if(_deck) {
					_deck.Redraw(data.decks[i]);
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