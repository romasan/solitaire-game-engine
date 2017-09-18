'use strict';

import share        from '../common/share'          ;
import event        from '../common/event'          ;
import defaults     from '../common/defaults'       ;
import common       from '../common'                ;

import Group        from '../group'                 ;
import Deck         from '../deck'                  ;
import Card         from '../card'                  ;
import Tips         from '../tips'                  ;
import addAutoSteps from '../autosteps/addAutoSteps';
import storage      from '../common/storage'        ;

import React, {Component} from 'react';
import {Map, List, fromJS} from 'immutable';
import {connect} from 'react-redux';

class Field extends Component {

	// constructor() {

	// 	share.set('elements', {});

	// 	this.tipsParams  = {};
	// 	this.inputParams = {};
	// }

	
	render() {

		let cards = [];

		let a = ['c1', 'd2', 'h3'];

		let classes = [
			"solitaireField",
			"default_field",
			"default_face",
			"alternative_back",
			"solitaireField"
		];

		console.log('>>>', this.props);

		for(let i in a) {
			// key = id ???
			cards.push(<Card key={'card_' + i} name={a[i]}/>);
		}

		let decks = [
			<Deck slot={true} key="deck_1"/>
		];

		// for(let i in this.props.decks) {}

		return <div className={classes.join(' ')}>
			{decks}
			{cards}
		</div>;
	}

	/**
	 * Create new game field
	 * @param {Map} state
	 * @param {*} data
	 */
	static create(state, data) {

		// this.clear();
		const _state = {};
		
		_state['homeGroups'] = data.homeGroups ? data.homeGroups : [];
		
		_state['autoMoveToHomeOpenDecks'] = data.autoMoveToHomeOpenDecks ? data.autoMoveToHomeOpenDecks : [];
		
		// вкл./выкл. подсказок
		_state['autoMoveToHomeOpenDecks'] = typeof data.showTips == "boolean" ? data.showTips : defaults.showTips;
		
		// устанвливаем тип хода по умолчанию
		_state['stepType'] = defaults.stepType;
		
		let _values = {
			"showTipsDestination"  : 'boolean', // Альтернативные подсказки
			"showTipPriority"      : 'boolean',
			"moveDistance"         : 'number' ,
			"zoom"                 : 'number' , // масштаб отображения
			// "movesAnimation"    : 'string' ,
			"animationTime"        : 'number' , // время анимации
			"showHistoryAnimation" : 'boolean',
			"showPrefFlipCard"     : 'boolean',
			"gameIsWon"            : 'boolean',
			// "noReplayHistory"      : 'boolean',
			"locale"               : 'string'
		};
		
		for (let valueName in _values) {

			_state[valueName] = typeof data[valueName] == _values[valueName]
				? data[valueName] 
				: defaults[valueName];
		}
		
		// условие выигрыша
		// share.set('winCheck', data.winCheck);
		_state['stepType'] = data.winCheck;
		
		// Настройки оформления (если нет сохранений)
		_state['theme'] = data.theme;

		// Дополнительные настройки игры
		if (data.preferences) {

			let _pref = storage.get('pref'),
			    _preferences = {}          ,
			    _prefData    = {}          ;

			for (let prefName in data.preferences) {
				if (typeof prefName == 'string') {

					_preferences[prefName] = data.preferences[prefName];

					_prefData[prefName] = _pref && typeof _pref[prefName] != 'undefined'
						? _pref[prefName]
						: data.preferences[prefName].value;
				}
			}

			// share.set('gamePreferences',     _preferences);
			_state['gamePreferences'] = _preferences;
			
			// share.set('gamePreferencesData', _prefData);
			_state['gamePreferencesData'] = _prefData;
		} else {
			// share.set('gamePreferences', {});
			_state['gamePreferences'] = {};
		}

		_state.tipsParams = {};

		// параметры отображения подсказок
		for (let tipParamName in defaults.tipsParams) {
			_state.tipsParams[tipParamName] = (data.tipsParams && typeof data.tipsParams[tipParamName] != 'undefined')
			? data.tipsParams[tipParamName]
			: defaults.tipsParams[tipParamName]
		}

		_state.inputParams = {};
		
		// параметры ввода
		for (let inputParamName in defaults.inputParams) {
			_state.inputParams[inputParamName] = (data.inputParams && typeof data.inputParams[inputParamName] != 'undefined')
			? data.inputParams[inputParamName]
			: defaults.inputParams[inputParamName]
		}
		
		// дополнительные параметры отображения
		// начальная позиция порядка отображения элементов
		if (data.startZIndex && typeof data.startZIndex == 'number') {
			_state['start_z_index'] = data.startZIndex;
		}
		
		// инициализация автоходов
		// if (data.autoSteps) {
		// 	this.autoSteps = addAutoSteps(data.autoSteps);
		// }

		
		// NOTE: на событие подписан deckActions
		// если ставить позже отрисовки элементов, переделать
		// event.dispatch('initField', data);

		_state.groups = {};
		
		// Отрисовка элементов
		if (data.groups) {
			
			for (let groupName in data.groups) {
				
				data.groups[groupName].name = groupName;
				// Group.add(data.groups[groupName]);
				
				Group.create(_state.groups, groupName, data.groups[groupName]);
			}
		}
		
		_state.decks = [];

		// init decks from field
		if (data.decks) {

			for (let e in data.decks) {

				// Deck.addDeck(data.decks[e]);

				_state.decks.push(
					Deck.create({}, data.decks[e])
				);
			}
		}
		
		// fill decks
		// top priority
		if (data.fill) {
			
			let _decks = Deck.getDecks();
			let _fill  = null;
			try {
				_fill = Object.assign([], data.fill);
			} catch (e) {
				_fill = data.fill;
			}
			
			for (;_fill.length;) {
				for (let deckId in _decks) {
					if (_fill.length) {
						let _card = _fill.shift();
						_decks[deckId].Fill([_card]);
					}
				}
			}
		}
		
		// Найти возможные ходы
		// Tips.checkTips();
		
		// событие: игра началась
		// event.dispatch('newGame');
		
		return fromJS(_state);
	}

	/**
	 * Redraw game field
	 * @param {*} data
	 */
	Redraw(data) {

		// console.log('Field:Redraw');

		// прокидываеем <новую> конфигурацию
		if (data) {

			// ерерисовываем все группы и стопки в них
			for (let _groupName in data.groups) {

				let _group = Group.getByName(_groupName);

				if (_group) {
					_group.Redraw(data.groups[_groupName]);
				}
			}

			// перерисовываем отдельно стоящие стопки
			for (let i in data.decks) {

				let _deck = Deck.getDeck(data.decks[i].name);

				if (_deck) {
					_deck.Redraw(data.decks[i]);
				}
			}

		// перерисовка без конфигурации
		} else {

			// получаем все существующие стопки
			let _decks = Deck.getDecks();

			// перерисовываем каждую
			for (let i in _decks) {
				_decks[i].Redraw();
			}
		}
	}

	/**
	 * Clear game field
	 */
	clear() {

		// console.log('Field:clear');

		let _elements = share.get('elements');

		for (let i in _elements) {
			if (_elements[i].type == 'deck') {
				_elements[i].clear();
				_elements[i] = null;
			} else if (_elements[i].type == 'group') {
				_elements[i] = null;
			}
		}

		// event.dispatch('removeCardElements');

		share.set('elements', {});
	}
}

export default connect(state => state.toJS())(Field);

// export default Field;