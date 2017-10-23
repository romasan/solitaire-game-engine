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

class fieldClass extends Component {

	constructor(props) {

		super(props);

		this.state = {};

		this.state.isMobileOrTablet = false;

		try {
			this.state.isMobileOrTablet = (
				/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || window.opera) ||			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0,4))
			);
		} catch (e) {}
	}
	
	render() {

		const {zoom} = this.props;

		/**
		 * Theme
		 */

		// TODO
		// get theme from storage
		// insert values to classes

		let classList = [
			"solitaireField"  ,
			"default_field"   ,
			"default_face"    ,
			"alternative_back"
		];

		/**
		 * Groups
		 */

		let groups = [];

		for(let i in this.props.groups) {

			const {
				id,
				position,
				decks
			} = this.props.groups[i];
			
			groups.push(
				<Group
					key = {id}
					{...{
						id      ,
						zoom    ,
						position,
						decks
					}}
					// {...this.props.groups[i]}
					// _decks = {this.props.groups[i].decks}
				/>
			);
		}

		/**
		 * Decks
		 */

		let decks = [];

		for (let i in this.props.decks) {

			const {
				id      ,
				position,
				showSlot,
				visible ,
				rotate  ,
				cards				
			} = this.props.decks[i];

			decks.push(
				<Deck
					key = {id}
					{...{
						id      ,
						position,
						zoom    ,
						showSlot,
						visible ,
						rotate  ,
						cards
					}}
					// {...this.props.decks[i]}
				/>
			);
		}

		let cards = []; // dragged cards

		for (let i in this.props.drag.cards) {

			const {
				id      ,
				name    ,
				flip    ,
				tip     ,
				position,
				visible ,
				rotate
			} = this.props.drag.cards[i];

			cards.push(
				<Card
					key = {id}
					{...{
						id      ,
						name    ,
						flip    ,
						tip     ,
						position,
						visible ,
						rotate  ,
						zoom
					}}
					// {...this.props.drag.cards[i]}
				/>
			)
		}

		return <div
			className = {classList.join(' ')}

			onMouseDown  = { this.state.isMobileOrTablet ? null : this.Take }
			onMouseMove  = { this.state.isMobileOrTablet ? null : this.Drag }
			onMouseUp    = { this.state.isMobileOrTablet ? null : this.Put  }

			onTouchStart = { this.state.isMobileOrTablet ? this.Take : null }
			onTouchMove  = { this.state.isMobileOrTablet ? this.Drag : null }
			onTouchEnd   = { this.state.isMobileOrTablet ? this.Put  : null }
		>
			{groups}
			{decks}
			{cards}
		</div>;
	}

	Take(data) {
		console.log('Take CARD', data);
	}

	Drag(data) {
		console.log('Drag CARD', data, this);
	}

	Put(data) {
		console.log('Put CARD', data);
	}

	/**
	 * Init game field state
	 * @param {Map} state
	 * @param {*} data
	 */
	static init(state, data) {

		// Init new state
		const _state = {};

		_state.nextId = 0;
		
		// TODO пометить группы
		_state.homeGroups = data.homeGroups ? data.homeGroups : [];
		
		_state.autoMoveToHomeOpenDecks = data.autoMoveToHomeOpenDecks
			? data.autoMoveToHomeOpenDecks
			: [];
		
		// устанвливаем тип хода по умолчанию
		_state['stepType'] = defaults.stepType;
		
		let _values = {
			"showTips"             : 'boolean', // вкл./выкл. подсказок
			"showTipsDestination"  : 'boolean', // Альтернативные подсказки
			"showTipPriority"      : 'boolean',
			"moveDistance"         : 'number' ,
			"zoom"                 : 'number' , // масштаб отображения
			// "movesAnimation"    : 'string' ,
			"animationTime"        : 'number' , // время анимации
			"showHistoryAnimation" : 'boolean',
			"showPrevFlipCard"     : 'boolean',
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
		_state.winCheck = data.winCheck;
		
		// Настройки оформления (если нет сохранений)
		_state.theme = data.theme;

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
		if (typeof data.startZIndex == 'number') {
			_state['start_z_index'] = data.startZIndex;
		}
		
		// инициализация автоходов
		if (data.autoSteps || data.stepTypes) {
			// this.autoSteps = addAutoSteps(data.autoSteps);
		}
		
		// NOTE: на событие подписан deckActions
		// если ставить позже отрисовки элементов, переделать
		// event.dispatch('initField', data);
		
		/**
		 * Groups
		 */

		 _state.groups = [];
		
		// Отрисовка элементов
		if (data.groups) {
			
			for (let groupName in data.groups) {
				
				// data.groups[groupName].name = groupName;
				// Group.add(data.groups[groupName]);
				
				_state.groups.push(
					Group.init(
						{
							"name" : groupName
						},
						data.groups[groupName],
						() => _state.nextId++
					)
				);
			}
		}

		/**
		 * Decks
		 */
		
		_state.decks = [];

		// init decks from field
		if (data.decks) {

			for (let e in data.decks) {

				// Deck.addDeck(data.decks[e]);

				_state.decks.push(
					Deck.init(
						{
							"parent" : "field"
							// "showPrevFlipCard" : _state.showPrevFlipCard
						},
						data.decks[e],
						() => _state.nextId++
					)
				);
			}
		}

		/**
		 * Fill
		 */
		
		// fill decks
		// top priority
		if (data.fill) {
			
			// for-in groups
			//   for-in decks

			// for in decks
		}

		// событие: игра началась
		// event.dispatch('newGame');

		_state.drag = {
			"cursor" : false,
			"cards"  : []
		};

		// return fromJS(_state);
		return JSON.parse( JSON.stringify(_state) );
	}

	static changeTipsMode(state, data) {

		// console.log('changeTipsMode', data);

		// let _state = state.toJS();
		let _state = state;

		_state.showTips = data;

		// return fromJS(_state);
		return _state;
	}

	static takeCards(state, data) {

		// let _state = state.toJS();
		let _state = state;
		
		console.log('Take cards', _state, decks);

		/**
		 * All decks
		 */

		let decks = [];
	
		// Decks from Field
		decks.push(
			..._state.decks
		);
	
		// Decks from groups
		for (let i in _state.groups) {
			decks.push(
				..._state.groups[i].decks
			);
		}
	
		// Departure deck
		let deck = decks.filter(
			e => e.visible && e.cards.some(
				c => c.id == data.id
			)
		)[0];

		_state.drag.cards = deck && deck.cards.splice( deck.cards.findIndex(e => e.id == data.id) );

		_state.drag.start = {
			"x" : data.x,
			"y" : data.y
		};

		_state.drag.cursor = {
			"x" : data.x,
			"y" : data.y
		};

		_state.drag.cards && _state.drag.cards.forEach(e => {

			console.log( e.name, JSON.stringify(e.position), JSON.stringify(e.offset) );

			e.position = e.offset;
		});

		console.log('takeCards', data, _state);
		
		// return fromJS(_state);
		return JSON.parse( JSON.stringify(_state) );
	}

	static moveCards(state, data) {

		// let _state = state.toJS();
		let _state = state;

		for (let i in _state.drag.cards) {

			let card = _state.drag.cards[i];

			card.position = {
				"x" : card.position.x - _state.drag.cursor.x + data.x,
				"y" : card.position.y - _state.drag.cursor.y + data.y
			};
		}

		_state.drag.cursor = {
			"x" : data.x,
			"y" : data.y
		};

		// return fromJS(_state);
		return JSON.parse( JSON.stringify(_state) );
	}

	static putCards(state, data) {

		console.log('putCards', data);

		return state;
	}
}

// export default connect(state => state.toJS())(fieldClass);
export default connect(state => state)(fieldClass);

// export default Field;