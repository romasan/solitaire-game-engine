'use strict';

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

/*
 * create
 * Redraw
 * clear
 */

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

		let _values = {
			"showTipsDestination"  : "boolean", // Альтернативные подсказки
			"showTipPriority"      : "boolean",
			"moveDistance"         : "number" ,
			"zoom"                 : "number" , // масштаб отображения
			// "movesAnimation"       : "string" ,
			"animationTime"        : "number" , // время анимации
			"showHistoryAnimation" : "boolean"
		};

		for(let valueName in _values) {
			share.set(
				valueName, 
				typeof data[valueName] == _values[valueName] 
					? data[valueName] 
					: defaults[valueName]
			);	
		}

		// условие выигрыша
		share.set('winCheck', data.winCheck);

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

			// ерерисовываем все группы и стопки в них
			for(let _groupName in data.groups) {

				let _group = Group.getByName(_groupName);

				if(_group) {
					_group.Redraw(data.groups[_groupName]);
				}
			}

			// перерисовываем отдельно стоящие стопки
			for(let i in data.decks) {

				let _deck = Deck.getDeck(data.decks[i].name);

				if(_deck) {
					_deck.Redraw(data.decks[i]);
				}
			}

		// перерисовка без конфигурации
		} else {

			// получаем все существующие стопки
			let _decks = Deck.getDecks();

			// перерисовываем каждую
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