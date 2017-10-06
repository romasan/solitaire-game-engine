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
// import {connect} from 'react-redux';

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

		state.offset = {
			"x" : state.position.x,
			"y" : state.position.y
		};

		state.placement = {
			"x" : null,
			"y" : null
		};

		console.log('group', state.name, state.id, JSON.stringify(state.position), JSON.stringify(state.offset));

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

				deck.parent = state.id;

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
					deck.position.y = deckIndex * defaults.card.height + deckIndex * state.placement.y;
				}

				deck.offset = state.offset;

			// }

			// for (let deckIndex in data.decks) {

			// 	let deck = data.decks[deckIndex];
				
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
	 * Get group by name
	 * @param {string} name 
	 * @return groupClass
	 */
	static getByName(name) {
		return common.getElementsByName(name, 'group')[0];
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

// export default connect(state => state.toJS())(groupClass);
// export default connect(state => state)(groupClass);
export default groupClass;
