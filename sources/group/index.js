'use strict';

import event          from '../common/event'   ;
import share          from '../common/share'   ;
import defaults       from '../common/defaults';
import common         from '../common'         ;

import Deck           from '../deck'           ;
import groupFill      from './groupFill'       ;
import groupRedraw    from './groupRedraw'     ;
import groupGenerator from './groupGenerator'  ;

import React, {Component} from 'react';
import {connect} from 'react-redux';

class groupClass extends Component {

	render() {

		const {
			id      ,
			zoom    ,
			position
		} = this.props;

		/**
		 * Decks
		 */

		let decks = [];

		for (let i in this.props._decks) {

			const {id} = this.props._decks[i];

			decks.push(
				<Deck
					key = {id}
					{...this.props._decks[i]}
				/>
			);
		}

		return <div
			id = {id}
			className = "el group"
			style ={{
				"left" : zoom * position.x + 'px',
				"top"  : zoom * position.y + 'px'
			}}
		>
			{decks}
		</div>;
	}

	static init(state, data, nextId) {

		state.id = 'group_' + nextId();

		state.type = 'group';

		state.position = {
			"x" : 0,
			"y" : 0
		};

		if (data.position) {

			if (typeof data.position.x == "number") {
				state.position.x = data.position.x;
			}

			if (typeof data.position.y == "number") {
				state.position.y = data.position.y;
			}
		}

		state.offset = state.position;

		state.placement = {
			"x" : null,
			"y" : null
		};

		if (data.placement) {

			if (typeof data.placement.x == "number") {
				state.placement.x = data.placement.x;
			}

			if (typeof data.placement.y == "number") {
				state.placement.y = data.placement.y;
			}
		}

		/**
		 * Decks
		 */
		
		state.decks = [];
		
		if (data.decks) {
			
			if (typeof data.decks == 'number') {
				data.decks = {
					"generator" : {
						"type"  : 'count'   ,
						"count" : data.decks
					}
				};
			}

			if (data.decks.generator) {

				if (typeof data.decks.generator.type == "string") {

					if (groupGenerator[data.decks.generator.type]) {

						data.decks = groupGenerator[data.decks.generator.type](state, data.decks.generator);
					} else {
						console.warn('Deck generator type "' + data.decks.generator.type + '" not found.');
						return;
					}
				} else {
					console.warn('Unknown deck generator type:', data.decks.generator.type);
					return;
				};

				data.placement = null;

			}

			// sort decks by deckIndex
			data.decks.sort((a, b) => a.deckIndex > b.deckIndex ? 1 : -1)

			for (let deckIndex in data.decks) {

				const deck = data.decks[deckIndex];

				if (!deck.position) {
					deck.position = {};
				}

				if (
					typeof deck.position.x   != "number" &&
					typeof state.placement.x == "number"
				) {
					deck.position.x = deckIndex * defaults.card.width + deckIndex * state.placement.x;
				}

				if (
					typeof deck.position.y   != "number" &&
					typeof state.placement.y == "number"
				) {
					deck.position.y = deckIndex * defaults.card.width + deckIndex * state.placement.y;
				}
			}

			for (let deckIndex in data.decks) {

				let deck = data.decks[deckIndex];
				
				const data_transfuse_list = [
					"save"            ,
					"visible"         ,
					"autoHide"        ,
					"autoCheckFlip"   ,
					"showPrevFlipCard", // showPrefFlipCard
					"showPrevAttempts",
					"checkNextCards"  ,
					"autoUnflipTop"   ,
					"padding"         ,
					"paddingX"        ,
					"paddingY"        ,
					"flipPadding"     ,
					"flipPaddingX"    ,
					"flipPaddingY"    ,
					"paddingType"     ,
					"flip"            ,
					"flipType"        ,
					"takeRules"       ,
					"putRules"        ,
					"fullRules"       ,
					"rotate"          , // TODO for decks or for group
					"actions"         ,
					"relations"       ,
					"tags"
				];
		
				for (let i in data_transfuse_list) {
		
					const param = data_transfuse_list[i];
		
					if (typeof data.decks[deckIndex][param] == "undefined") {
						data.decks[deckIndex][param] = data[param];
					}
				};
			}
		}

		if (data.fill) {

			for (let fillIndex in data.fill) {

				const item = data.fill[fillIndex];

				const deckIndex = fillIndex % data.decks.length;

				const deck = data.decks[deckIndex];
				
				if (typeof item == "string") {

					if (
						deck.fill        &&
						deck.fill.length
					) {
						deck.fill.push(item);
					} else {
						deck.fill = [item];
					}
				} else {
					for (let i in item) {

						const _item = item[i];

						if (
							deck.fill        &&
							deck.fill.length
						) {
							deck.fill.push(_item);
						} else {
							deck.fill = [_item];
						}
					}
				}
			}
		}

		for (let i in data.decks) {

			const deck = data.decks[i];

			state.decks.push(
				Deck.init(
					{
						"parent" : state.id
					},
					deck,
					nextId
				)
			);
		}
		
		return state;
	}

	/**
	 * Add new group
	 * @param {*} data
	 * @return groupClass
	 */
	static add(data) {

		if (!data) {
			return false;
		}

		if (!data.decks) {
			return false;
		}

		let id = 'group_' + common.genId();

		let _el_group = new groupClass(data, id);

		if (data.decks) {

			if (typeof data.decks == 'number') {
				data.decks = {
					"generator" : {
						"type"  : 'count'   ,
						"count" : data.decks
					}
				};
			}

			if (data.decks.generator) {

				if (data.decks.generator.type) {

					if (groupGenerator[data.decks.generator.type]) {

						data.decks = groupGenerator[data.decks.generator.type](_el_group, data.decks.generator);
					} else {
						console.warn('Deck generator type "' + data.decks.generator.type + '" not found.');
						return;
					}
				} else {
					console.warn('Deck generator type is null.');
					return;
				};

				data.placement = null;

			}

			// relations TO <-> FROM
			// if ( data.backRelations ) TODO
			for (let to in data.decks) {

				for (let relId in data.decks[to].relations) {

					let _relation = null;
					try {
						_relation = Object.assign({}, data.decks[to].relations[relId]);
					} catch (e) {
						_relation = data.decks[to].relations[relId];
					}

					// TODO обратные связи
					// затирают прямы связи в IE
					// for (let from in data.decks) {

					// 	if (data.decks[from].name == _relation.to) {
					// 		_relation.to = null;
					// 		_relation.from = data.decks[to].name;
					// 		data.decks[from].relations.push(_relation)
					// 	}
					// }
				}
			}

			for (let d in data.decks) {
				_el_group.addDeck(data.decks[d]);
			};
		}

		let _elements = share.get('elements');
		_elements[id] = _el_group;
		share.set('elements', _elements);

		// console.log('>>>add group to share:', _el_group.name);

		// fill group
		if (data && data.fill) {

			let _checkFillDeck = data.fill.length;
			if (_checkFillDeck) {
				_el_group.Fill(data.fill);
			}
		}

		return _el_group;
	}

	/**
	 * Get group by name
	 * @param {string} name 
	 * @return groupClass
	 */
	static getByName(name) {
		return common.getElementsByName(name, 'group')[0];
	}

	/**
	 * Add deck to group
	 * @param {*} data 
	 */
	addDeck(data) {

		if (!data) {
			return;
		}

		if (!data.position) {
			data.position = {
				"x" : 0, 
				"y" : 0
			};
		}

		// сортировка элементов в группе по заданному индексу и порядку добавления

		if (!data.parent) {
			data.parent = this.name;
		}

		data.parentPosition = {
			"x" : this.position.x, 
			"y" : this.position.y
		};

		// расставляем колоды в группе
		// 1 приоретет отдаётся параметру groupIndex
		// остальные вставляются в промежутки или добавляются в конец
		let _index = 0;

		if (
			data.groupIndex                                                                    &&
			decks[ this.deckIndex[data.groupIndex - 1] ].this.deckIndex == data.this.deckIndex &&
			typeof data.groupIndex == 'number'                                                 &&
			this.deckIndex[data.groupIndex - 1]
		) {
			console.warn('Warning: duplicate groupIndex', data.groupIndex, 'changed to null');
			data.groupIndex = null;
		}

		if (data.groupIndex && typeof data.groupIndex == 'number') {

			if (this.deckIndex[data.groupIndex - 1]) {

				for (;typeof this.deckIndex[_index] != 'undefined';_index += 1) {}

				if (placement) {

					let _index    = this.deckIndex[data.groupIndex - 1];

					let _elements = share.get('elements');

					if (placement.x) {
						_elements[_index].x( this.position.x + (placement.x + defaults.card.width) * _index );
					}

					if (placement.y) {
						_elements[_index].y( this.position.y + (placement.y + defaults.card.width) * _index );
					}

					share.set('elements', _elements);
				}

				this.deckIndex[_index] = this.deckIndex[data.groupIndex - 1];
				this.deckIndex[data.groupIndex - 1] = true;

				_index = data.groupIndex - 1
			} else {

				this.deckIndex[data.groupIndex - 1] = true;

				_index = data.groupIndex - 1
			}

		} else {
			for (;typeof this.deckIndex[_index] != 'undefined';_index += 1);
			this.deckIndex[_index] = true;
		}

		// смещаем координаты колод относительно координад группы
		if (this.placement) {

			if (this.placement.x) {
				data.position.x = (this.placement.x + defaults.card.width)  * (_index);
			}

			if (this.placement.y) {
				data.position.y = (this.placement.y + defaults.card.height) * (_index);
			}
		}

		// прокидываем некоторые атрибуты всем колодам группы (у атрибутов заданных колоде приоритет выше)
		for (let paramName in PARAMS) {

			if (PARAMS[paramName].type == 'any') {
				if (
					this.parameters[paramName]        &&
					typeof data[paramName] == 'undefined'
				) {
					data[paramName] = this.parameters[paramName];
				};
			} else if (PARAMS[paramName].type == 'boolean') {

				if (
					typeof this.parameters[paramName] == 'boolean' &&
					typeof data[paramName] == 'undefined'
				) {
					data[paramName] = this.parameters[paramName];
				}			
			} else if (typeof this.parameters[paramName] != 'undefined') {
				data[paramName] = this.parameters[paramName];
			}
		};

		data.deckIndex = typeof data.deckIndex == 'number'
			? data.deckIndex
			:(_index | 0) + 1;

		let _el = Deck.addDeck(data);

		this.deckIndex[_index]  = _el.id;
		this.decks[_el.id] = _el;
	}

	/**
	 * Fill decks in groups
	 * @param {string[]} cardNames 
	 */
	Fill(cardNames) {
		groupFill(this, cardNames);
	}

	/**
	 * Get deck by id
	 * @param {string} id
	 * @returns {Deck}
	 */
	getDeckById(id) {
		return this.decks[id];
	}

	/**
	 * Get deck index in group by deck id
	 * @param {number} id
	 * @returns {number}
	 */
	getDeckIndexById(id) {

		for (let i in this.deckIndex) {
			if (this.deckIndex[i] == id) {
				return i;
			}
		}

		return null;
	}

	/**
	 * Get deck id by deck index in group
	 * @param {number} index 
	 * @returns {string}
	 */
	getDeckIdByIndex(index) {
		return this.deckIndex[(index | 0) - 1];
	}

	/**
	 * Count of decks in group
	 */
	get decksCount() {

		let _count = 0;

		for (let i in this.decks) {
			_count += 1;
		}

		return _count;
	}

	/**
	 * Get a deck according to the deck index in the group
	 * @param {number} index
	 * @returns {Deck}
	 */
	getDeckByIndex(index) {

		let id = this.getDeckIdByIndex(index);

		return this.getDeckById(id);
	}

	/**
	 * Get decks from group by their name
	 * @param {string} name
	 * @returns {Deck[]}
	 */
	getDecksByName(name) {

		let _decks = {};

		for (let d in this.decks) {
			if (this.decks[d].name == name) {
				_decks[d] = decks[d];
			}
		}

		return _decks;
	}

	/**
	 * Get decks from group (use filter)
	 * @param {*} data
	 * @returns {Deck[]}
	 */
	getDecks(data) {

		let _decks = [];

		for (let i in this.decks) {
			if (data && data.visible) {
				if (this.decks[i].visible) {
					_decks.push(this.decks[i]);
				}
			} else {
				_decks.push(this.decks[i]);
			}
		}

		return _decks;
	}

	/**
	 * Check for the existence of a deck in a group
	 * @param {string} deckName
	 * @returns {boolean}
	 */
	hasDeck(deckName) {

		let has = false;

		for (let deckId in decks) {
			if (decks[deckId].name == deckName) {
				has = true;
			}
		}

		return has;
	}
}

export default connect(state => state.toJS())(groupClass);
// export default groupClass;
