'use strict';

// module.exports = function(main, share) {
import share     from 'share';
import event     from 'event';
import defaults  from 'defaults';
import common    from 'common';

import Group        from 'addGroup';
import Deck         from 'addDeck';
import Tips         from 'tips';
import addAutoSteps from 'addAutoSteps';

class Field {

	constructor() {

		share.set('elements', {});
		
		this.tipsParams = {};
		this.inputParams = {};
	}

	create(data) {

		var a = null;
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

		// условие выигрыша
		share.set('winCheck', a.winCheck);

		// масштаб отображения
		share.set(
			'zoom', 
			(a.zoom && typeof a.zoom == 'number') 
				? a.zoom 
				: defaults.zoom
		);

		// параметры отображения подсказок
		for(var tipParamName in defaults.tipsParams) {
			this.tipsParams[tipParamName] = (a.tipsParams && typeof a.tipsParams[tipParamName] != "undefined")
				? a.tipsParams[tipParamName]
				: defaults.tipsParams[tipParamName]
		}

		// параметры ввода
		for(var inputParamName in defaults.inputParams) {
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
			for(var groupName in a.groups) {
				a.groups[groupName].name = groupName;
				Group.addGroup(a.groups[groupName]);
			}
		}

		if(a.decks) {
			for(var e in a.decks) {
				Deck.addDeck(a.decks[e]);
			}
		}

		if(a.fill) {
			
			var _decks = Deck.getDecks(),
				_fill  = Object.assign([], a.fill);

			for(;_fill.length;) {
				for(var deckId in _decks) {
					if(_fill.length) {
						var _card = _fill.shift();
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

		var a = null;

		if(data) {

			try {
				a = Object.assign({}, data);
			} catch(e) {
				a = data;
				console.warn('Field.Redraw input params is not JSON, can\'t clone');
			}

			for(var _groupName in a.groups) {

				var _group = Group.Group(_groupName);
				if(_group) {
					_group.Redraw(a.groups[_groupName]);
				}
			}

			for(var i in a.decks) {
				
				var _deck = Deck.Deck(a.decks[i].name);
				if(_deck) {
					_deck.Redraw(a.decks[i]);
				}
			}

		} else {
			var _decks = Deck.getDecks();
			for(var i in _decks) {
				_decks[i].Redraw();
			}
		}
	}

	clear() {

		var _elements = share.get('elements');
		for(var i in _elements) {
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