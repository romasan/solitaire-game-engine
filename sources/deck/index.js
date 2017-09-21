'use strict';

import event                  from '../common/event'                                 ;
import share                  from '../common/share'                                 ;
import defaults               from '../common/defaults'                              ;
import common                 from '../common'                                       ;

import flipTypes              from './flipTypes'                                     ;
import putRules               from './putRules'                                      ;
import takeRules              from './takeRules'                                     ;
import fullRules              from './fullRules'                                     ;
import paddingTypes           from './paddingTypes'                                  ;
import deckActions            from './deckActions'                                   ;
import Take                   from './deckTake'                                      ;
import Put                    from './deckPut'                                       ;
import Card                   from '../card'                                         ;
import Group                  from '../group'                                        ;

import getDecks               from './getDecks'                                      ;
import getDeckById            from './getDeckById'                                   ;
import deckCardNames          from './deckCardNames'                                 ;
import getDeck                from './getDeck'                                       ;
import applyChangedParameters from '../io/renderEvents/common/applyChangedParameters';

import React, {Component} from 'react';
import {connect} from 'react-redux';

class deckClass extends Component {

	// constructor(data, id) {

	// 	// Flip
	// 	let flipData = null;

	// 	let flipType = data.flip && typeof data.flip == 'string'
	// 		? data.flip.indexOf(':') > 0
	// 			? (e => {

	// 				let name = e[0];

	// 				if (e.length == 2) {
	// 					flipData = e[1];
	// 				}

	// 				return flipTypes[name]
	// 					? name
	// 					: defaults.flip_type;
	// 			})(data.flip.split(':'))
	// 			: flipTypes[data.flip]
	// 				? data.flip
	// 				: defaults.flip_type
	// 		: defaults.flip_type;

	// 	/**
	// 	 * Check card flip
	// 	 * @param {Card} card
	// 	 * @param {number} index
	// 	 * @param {number} length
	// 	 */
	// 	this.cardFlipCheck = (card, index, length) => {
	// 		card.flip = flipTypes[flipType](index, length, flipData, this);
	// 	};

	// 	/**
	// 	 * Parse string with parameter
	// 	 * @param {string} line
	// 	 * @returns {string}
	// 	 */
	// 	let stringWithColon = line => {
	// 		if (
	// 			typeof line == "string" &&
	// 			line.indexOf(':') > 0
	// 		) {
	// 			return line.split(':')[0];
	// 		} else {
	// 			return line;
	// 		}
	// 	};

	// 	/**
	// 	 * Put rules
	// 	 * @type {string|string[]}
	// 	 */
	// 	this.putRules = data.putRules
	// 		? typeof data.putRules == 'string'
	// 			? putRules[stringWithColon(data.putRules)]
	// 				? [data.putRules]
	// 				: defaults.putRules
	// 			: data.putRules.constructor == Array
	// 				? data.putRules.filter(
	// 					ruleName => typeof ruleName == 'string' && putRules[stringWithColon(ruleName)] // TODO Exception (putRule "***" not found)
	// 						? true
	// 						: false
	// 				)
	// 				: defaults.putRules
	// 		: defaults.putRules;

	// 	if (this.putRules.length == 0) {
	// 		this.putRules = defaults.putRules;
	// 	}

	// 	/**
	// 	 * Take rules
	// 	 * @type {string|string[]}
	// 	 */
	// 	this.takeRules = data.takeRules
	// 		? typeof data.takeRules == 'string'
	// 			? takeRules[data.takeRules]
	// 				? [data.takeRules]
	// 				: defaults.takeRules
	// 			: data.takeRules.constructor == Array
	// 				? data.takeRules.filter(
	// 					ruleName => typeof ruleName == 'string' && takeRules[ruleName] // TODO Exception (takeRule "***" not found)
	// 				)
	// 				: defaults.takeRules
	// 		: defaults.takeRules;

	// 	// Правила сложенной колоды
	// 	// Сложенная колода может использоваться для определения выиигрыша
	// 	// В сложенную колоду нельзя класть новые карты
	// 	/**
	// 	 * Full rules
	// 	 * @type {string|string[]}
	// 	 */
	// 	this.fullRules = data.fullRules
	// 		? typeof data.fullRules == "string"
	// 			? fullRules[data.fullRules]
	// 				? [data.fullRules]
	// 				: defaults.fullRules
	// 			: data.fullRules.constructor == Array
	// 				? data.fullRules.filter(
	// 					ruleName => typeof ruleName == "string" && fullRules[ruleName]
	// 				)
	// 				: defaults.fullRules
	// 		: defaults.fullRules;

	// 	/**
	// 	 * Get padding for card by index
	// 	 * @param {number}
	// 	 * @returns {Vector2d}
	// 	 */
	// 	this.padding = index => {

	// 		let _cards = this.getCards();
	// 		let _index = index < _cards.length ? index : _cards.length - 1;
	// 		let _card  = _cards[_index] ? _cards[_index] : this.cards[index];

	// 		return padding(
	// 			this._params ,
	// 			_card        ,
	// 			_index       ,
	// 			_cards.length,
	// 			_cards       ,
	// 			paddingData
	// 		);
	// 	}

	// 	// Подписывается на перетаскивание стопки/карты
	// 	let _callback = data => {

	// 		// TODO
	// 		// проверять fill только для тех стопок котрые участвовали в Action

	// 		if (data.destination.name != this.name) {
	// 			return;
	// 		}

	// 		this.checkFull();
	// 	};

	// 	event.listen('moveDragDeck', _callback);
	// }

	render() {

		console.log('%cDraw Deck', 'color: green;font-weight: bold');		
		console.log('###DECK:', this.props);

		const {
			id      ,
			position,
			zoom    ,
			showSlot,
			visible ,
			rotate
		} = this.props;

		const {
			width,
			height
		} = defaults.card;

		/**
		 * Cards
		 */

		let cards = [];
		
		for (let i in this.props.cards) {

			const {id} = this.props.cards[i];

			cards.push(
				<Card
					key = {id}
					{...this.props.cards[i]}
				/>
			);
		}

		return <div
			className = {`el deck${showSlot ? ' slot' : ''}`}
			id = {id}
			style = {{
				display   : visible ? 'block' : 'none',
				transform : `rotate(${rotate}deg)`    ,
				left      : zoom * position.x + 'px'  ,
				top       : zoom * position.y + 'px'  ,
				width     : zoom * width      + 'px'  ,
				height    : zoom * height     + 'px'
			}}>
			{cards}
		</div>;
	}

	/**
	 * Init deck state part
	 * @param {*} state
	 * @param {*} data
	 * @param {function} nextId
	 */
	static init(state, data, nextId) {

		console.log('%cInit Deck', 'color: blue;');

		state.cards = [];
		
		// parameters
		state.type = "deck";

		state.full = false;

		state.id = 'deck_' + nextId();

		let _parent_name = data.parent ? data.parent : 'no_parent';

		state.name = typeof data.name == 'string'
			? data.name
			: (_parent_name + '_' + data.deckIndex);

		if (
			typeof data.name != "string" &&
			      !data.deckIndex
		) {
			console.warn('Deck name', state.name, 'is incorrect');
		}

		state.locked = data.locked ? true : false;

		state.save = data.save ? true : false;

		state.visible = typeof data.visible == 'boolean'
			? data.visible
			: true;

		state.deckIndex = typeof data.deckIndex == 'number'
			? data.deckIndex
			: null;

		state.parent = typeof data.parent == 'string' ? data.parent : 'field';

		state.autoHide = typeof data.autoHide == 'boolean'
			? data.autoHide
			: defaults.autoHide;

		state.autoCheckFlip = typeof data.autoCheckFlip == 'boolean'
			? data.autoCheckFlip
			: defaults.autoCheckFlip;

		if (typeof data.showPrefFlipCard == 'boolean') {
			state.showPrefFlipCard = data.showPrefFlipCard;
		}
		
		state.showPrevAttempts = typeof data.showPrevAttempts == 'boolean'
			? data.showPrevAttempts
			: defaults.showPrevAttempts;

		state.checkNextCards = typeof data.checkNextCards == 'boolean'
			? data.checkNextCards
			: defaults.checkNextCards;

		if (typeof data.showSlot == 'undefined') {
			data.showSlot = defaults.showSlot;
		}

		state.data = {};

		// changed parameters

		state.showSlot = typeof showSlot == 'boolean'
			? showSlot
			: defaults.showSlot;

		/**
		 * Padding
		 */

		state.padding = {
			"x" : defaults.padding_x,
			"y" : defaults.padding_y
		};

		state.flipPadding = {
			"x" : defaults.flip_padding_x,
			"y" : defaults.flip_padding_y
		};

		if (data.padding) {

			if (typeof data.padding.x  == "number") {
				state.padding.x = data.padding.x;
			}

			if (typeof data.padding.y  == "number") {
				state.padding.y = data.padding.y;
			}
		}

		if (data.flipPadding) {
			
			if (typeof data.flipPadding.x  == "number") {
				state.flipPadding.x = data.flipPadding.x;
			}

			if (typeof data.flipPadding.y  == "number") {
				state.flipPadding.y = data.flipPadding.y;
			}
		}

		if (typeof data.paddingX == "number") {
			state.padding.x = data.paddingX;
		}

		if (typeof data.paddingY == "number") {
			state.padding.y = data.paddingY;
		}

		if (typeof data.flipPaddingX == "number") {
			state.flipPadding.x = data.flipPaddingX;
		}

		if (typeof data.flipPaddingY == "number") {
			state.flipPadding.y = data.flipPaddingY;
		}

		state.paddingType = {
			"name"  : defaults.paddingType,
			"value" : null
		};
		
		if (
			      typeof data.paddingType == "string"    &&
			paddingTypes[data.paddingType.split(':')[0]]
		) {

			state.paddingType = {
				"name"  : data.paddingType.split(':')[0],
				"value" : data.paddingType.split(':')[1]
			};
		}

		// TODO так же Flip и Full

		// TODO пример для Take и Put

		// const paddingTypes = data.paddingType || data.paddingTypes;
		
		// if (paddingTypes) {
		// 	state.paddingTypes = typeof paddingTypes == 'string'   // is string
		// 		? paddingTypes[data.paddingType.split(':')[0]]    // isset method
		// 			? [{
		// 				"name"  : paddingTypes.split(':')[0],
		// 				"value" : paddingTypes.split(':')[1]
		// 			}]
		// 			: [defaults.paddingType]                      // use default
		// 		: ((e, a) => {
		// 			if (e.length) {

		// 				for (i in e) {

		// 					const paddingType = e[i];

		// 					if (
		// 						typeof paddingType == "string"          ||
		// 						paddingTypes[paddingType.split(':')[0]]
		// 					) {
		// 						a.push({
		// 							"name"  : null,
		// 							"value" : null
		// 						});
		// 					}
		// 				}

		// 				if (e.length == 0 || a.length == 0) {
		// 					return [defaults.paddingType]
		// 				}
		// 			} else {
		// 				return [defaults.paddingType]
		// 			}
		// 		})(paddingTypes, [])
		// }

		console.log('deck', state.padding, state.name);

		/**
		 * Position
		 */

		state.position = {
			"x" : 0,
			"y" : 0
		};

		// TODO offset - позиция относительно Field
		
		state.offset = {
			"x" : 0,
			"y" : 0
		};

		if (data.position) {

			const {x, y} = data.position;

			state.position = {
				"x" : x ? x : 0,
				"y" : y ? y : 0
			}
		}

		state.rotate = typeof data.rotate == "number" ? data.rotate : defaults.rotate;

		state.autoUnflipTop = typeof data.autoUnflipTop == 'boolean'
			? data.autoUnflipTop
			: defaults.autoUnflipTop;
		
		// cardFlipCheck()

		// let stringWithColon()

		// putRules

		// takeRules

		// fullRules

		/**
		 * Actions
		 */

		state.actions = [];

		if (data.actions) {
			state.actions = data.actions;
			// deckActions.add(this);
		}

		state.relations = data.relations ? data.relations : []

		state.tags = data.tags ? data.tags : [];

		/**
		 * Cards
		 */

		state.cards = [];

		if (data.fill) {

			for (let i in data.fill) {

				const name = data.fill[i];

				if (Card.validateCardName(name)) {

					state.cards.push(
						Card.init(
							{
								name,
								parent: state.id
							},
							nextId
						)
					);
				}
			}
		}

		// dispatch addDeckEl

		// listen moveDragDeck

		console.log('%cEnd init Deck', 'color: blue');		

		return state;
	}

	/**
	 * Padding
	 * @param {number} index
	 * @returns {Vector2d}
	 */
	static padding(state, index) {
		// 
	}

	/**
	 * Return deck cards names
	 * @param {*[]} data
	 * @returns {string[]}
	 */
	static deckCardNames(data) {
		return deckCardNames(data);
	}

	/**
	 * Add new deck
	 * @param {*} data
	 * @returns {deckClass}
	 */
	static addDeck(data) {

		if (!data) {
			return false;
		}

		let id = 'deck_' + common.genId();

		let _deck = new deckClass(data, id);

		// fill deck
		if (data.fill) {
			for (let i in data.fill) {
				if (typeof data.fill[i] == 'string') {
					_deck.genCardByName(data.fill[i], i == data.fill.length - 1);
				}
			}
		}

		let _elements = share.get('elements');

		_elements[id] = _deck;

		share.set('elements', _elements);

		return _deck;
	}

	/**
	 * Get a deck by name from a group with a specific name
	 * @param {string} name 
	 * @param {string} groupName 
	 * @returns {deckClass}
	 */
	static getDeck(name, groupName) {
		return getDeck(name, groupName);
	}

	/**
	 * Get decks
	 * @param {*} data
	 * @returns {deckClass[]}
	 */
	static getDecks(data) {
		return getDecks(data);
	}

	/**
	 * Get deck by id
	 * @param {number} id
	 * @returns {deckClass}
	 */
	static getDeckById(id) {
		return getDeckById(id);
	}

	/**
	 * Get some cards
	 * @param {number} count 
	 * @returns {Card[]}
	 */
	getSomeCards(count) {

		let _cards = [];

		if (
			typeof count != 'number'         ||
			       count > this.cards.length ||
			       count < 1
		) {
			count = this.cards.length;
		}

		for (let i = 0; i < count; i += 1) {
			_cards.push(this.cards[this.cards.length - 1 - i]);
		}

		return _cards;
	}

	/**
	 * Lock deck
	 */
	lock() {
		this.locked = true;
	}

	/**
	 * Unlock deck
	 */
	unlock() {
		this.locked = false;
	}

	/**
	 * Check cards flip
	 */
	checkFlip() {

		for (let cardIndex in this.cards) {
			this.cardFlipCheck(
				this.cards[cardIndex]                 ,
				cardIndex | 0                         ,
				this.cards.length                     ,
				this.cards[this.cards.length - 1].name
			);
		}

		event.dispatch('redrawDeckFlip', this);
	}

	/**
	 * Unflip card by index
	 * @param {number} index 
	 * @param {boolean} save 
	 */
	unflipCardByIndex(index, save) {

		// console.log('deck:unflipCardByIndex:', this.name, index);

		if (this.cards[index]) {

			this.cards[index].flip = false;

			// event.dispatch('redrawDeckFlip', this);
			this.Redraw();

			if (save) {

				event.dispatch('addStep', {
					"unflip" : {
						"deckName"  : this.name             ,
						"cardIndex" : index                 ,
						"cardName"  : this.cards[index].name
					}
				});
			}
		}
	}

	/**
	 * Unflip top card in deck
	 * @param {boolean} save 
	 */
	unflipTopCard(save) {

		// console.log('deck:unflipTopCard:', save);

		if (this.cards.length > 0) {

			this.unflipCardByIndex(this.cards.length - 1, save);

			// if (save) {
			// 	event.dispatch('addStep', {
			// 		"unflip" : {
			// 			"cardName"  : this.cards[this.cards.length - 1].name,
			// 			"cardIndex" : this.cards.length - 1                 ,
			// 			"deckName"  : this.name
			// 		}
			// 	});
			// }
		}
	}

	/**
	 * Flip all cards in deck
	 * @param {boolean} redraw 
	 * @param {boolean} save 
	 */
	flipAllCards(redraw = true, save) {

		for (let i in this.cards) {

			this.cards[i].flip = true;

			if (save) {
				event.dispatch('addStep', {
					"flip" : {
						"cardName"  : this.cards[i].name,
						"cardIndex" : i                 ,
						"deckName"  : this.name
					}
				});
			}
		}

		if (redraw) {
			this.Redraw();
		}
	}

	/**
	 * Unflip all cards in deck
	 * @param {boolean} redraw 
	 * @param {boolean} save 
	 */
	unflipAllCards(redraw = true, save) {

		console.log('deck:unflipAllCards', save);

		for (let i in this.cards) {

			this.cards[i].flip = false;

			if (save) {
				event.dispatch('addStep', {
					"unflip" : {
						"cardName"  : this.cards[i].name,
						"cardIndex" : i                 ,
						"deckName"  : this.name
					}
				});
			}
		}

		if (redraw) {
			this.Redraw();
		}
	}

	/**
	 * Checking the completeness of the deck
	 */
	checkFull() {

		if (
			!this.full                 &&
			 this.fullRules            &&
			 this.fullRules.length > 0
		) {

			let full = true;

			for (let ruleIndex in this.fullRules) {

				let _rule = this.fullRules[ruleIndex];

				if (
					typeof _rule == 'string'
				) {
					full = full                                  &&
					       typeof fullRules[_rule] == 'function' &&
					       fullRules[_rule](this);
				} else {

					for (let subRule in _rule) {
						if (
							typeof subRule            == 'string'   &&
							typeof fullRules[subRule] == 'function'
						) {
							full = full && fullRules[subRule](this, _rule[subRule]);
						}
					}

					// if (_rule.query) {
					// 	fullRules._query(this, _rule.query)
					// }
				}
			}

			this.full = full;
		}

		return this.full;
	}

	/**
	 * Filling the deck with name-generated cards
	 * @param {string[]} cardNames
	 */
	Fill(cardNames) {

		for (let i in cardNames) {
			this.genCardByName(cardNames[i], i == cardNames.length - 1);
		}
	}

	/**
	 * Clear deck
	 */
	clear() {

		// console.log('Deck:clear', this.name);

		for (let i in this.cards) {
			event.dispatch('removeEl', this.cards[i]);
			this.cards[i] = null;
		}

		this.cards = [];

		event.dispatch('removeEl', this);
	}

	/**
	 * Push card or pile in to deck
	 * @param {*[]} deck 
	 * @param {boolean} afterVisible 
	 */
	Push(deck, afterVisible = false) {

		// console.log('deck:Push', this.name, deck ? deck.map(e => e.name).join(',') : deck);

		let visibleCardsCount = this.cardsCount();

		// change cards parent id
		if (deck && typeof deck.length == "number") {
			deck = deck.map(e => (e.parent = this.id, e));
		} else {
			console.warn('deck:Push:map', deck, this.name);
		}

		// insert push deck after visible cards
		this.cards.splice(visibleCardsCount, 0, ...deck);
	}

	/**
	 * Pop card from deck
	 * @param {number} count 
	 * @param {boolean} clearParent - delete values about the parent from cards
	 */
	Pop(count, clearParent) {

		// console.log('%cdeck:Pop', 'color:orange;font-weight:bold;', this.name, count, this.cards.length);
		if (this.cards.length < count) {
			console.warn('Pop', count, ' cards from', this.name, 'is failed');
		}

		let _cards = this.getCards();

		if (_cards.length < count) {
			return false;
		}

		let _deck = [];

		for (; count; count -= 1) {

			// get top visible card
			let _pop = _cards.pop();

			// remove this card from cards list
			for (let i = 0; i < this.cards.length; i += 1) {
				if (this.cards[i].id == _pop.id) {

					this.cards.splice(i, 1);

					// this.cards = [].concat(
					// 	this.cards.slice(0, i)       ,
					// 	this.cards.slice((i | 0) + 1)
					// )
				}
			}

			// clear card parent value
			if (clearParent) {
				_pop.parent = null;
			}

			// _deck.push(_pop);
			// _deck[_deck.length - 1].parent = null;
			_deck.unshift(_pop);
			_deck[0].parent = null;
		}

		// _deck.reverse();

		// скрыть стопку если вынули все карты
		if (
			this.autoHide          && 
			this.cards.length == 0
		) {
			this.hide();
		}

		// this.Redraw();

		return _deck;
	}

	/**
	 * @typedef {Object} deckTakeReturns
	 * @property {number} index
	 * @property {Card} card
	 */

	/**
	 * Take card from deck by cardId
	 * @param {string} cardId
	 * @returns {deckTakeReturns[]}
	 */
	Take(cardId) {
		return Take(this, cardId);
	}

	/**
	 * Checking, the possibility of putting the card
	 * @param {deckTakeReturns[]} putDeck 
	 * @returns {boolean}
	 */
	Put(putDeck) {
		return Put(this, putDeck);
	}

	/**
	 * Generate card by name and add in to deck
	 * @param {string} name 
	 * @param {boolean} last 
	 */
	genCardByName(name, last) {
		Card.genCardByName(this, name, last);
	}

	/**
	 * Hide deck
	 */
	hide() {

		this.visible = false;

		event.dispatch('addStep', {
			"hideDeck" : this.name
		});

		this.Redraw();
	}

	/**
	 * Show deck
	 */
	show() {

		this.visible = false;

		event.dispatch('addStep', {
			"showDeck" : this.name
		});

		this.Redraw();
	}

	/**
	 * Hide card from deck
	 * @param {boolean} redraw 
	 * @param {?boolean} save 
	 */
	hideCards(redraw = true, save) {

		for (let i in this.cards) {

			this.cards[i].visible = false;

			if (save) {
				event.dispatch('addStep', {
					"hide" : {
						"cardName"  : this.cards[i].name,
						"cardIndex" : i                 ,
						"deckName"  : this.name
					}
				});
			}
			// event.dispatch('hideCard', this.cards[i]);
		}

		if (redraw) {
			this.Redraw();
		}
	}

	// TODO можно использовать только для карт сверху
	/**
	 * Hide card by index
	 * @param {number} index 
	 * @param {boolean} redraw 
	 */
	hideCardByIndex(index, redraw) {
		if (this.cards[index]) {

			this.cards[index].visible = false;

			if (redraw) {
				this.Redraw();
			}
		}
	}

	/**
	 * Show cards from deck
	 * @param {?boolean} redraw 
	 * @param {?boolean} save 
	 * @param {?boolean} forceAll 
	 */
	showCards(redraw = true, save, forceAll) {

		for (let i in this.cards) {

			let changed = forceAll ? true : this.cards[i].visible == false;

			this.cards[i].visible = true;

			if (changed && save) {
				event.dispatch('addStep', {
					"show" : {
						"cardName"  : this.cards[i].name,
						"cardIndex" : i                 ,
						"deckName"  : this.name
					}
				});
			}
			// event.dispatch('showCard', this.cards[i]);
		}

		if (redraw) {
			this.Redraw();
		}
	}

	/**
	 * Show card by index
	 * @param {number} index 
	 * @param {?boolean} redraw 
	 */
	showCardByIndex(index, redraw) {
		if (this.cards[index]) {

			this.cards[index].visible = true;

			if (redraw) {
				this.Redraw();
			}
		}
	}

	/**
	 * Get card names
	 * @returns {string[]}
	 */
	getCardsNames() {

		let _cardsNames = [];

		for (let i in this.cards) {
			_cardsNames.push(this.cards[i].name);
		}

		return _cardsNames;
	}

	/**
	 * Get cards
	 * @param {*} filters 
	 * @returns {Card[]}
	 */
	getCards(filters = {
		"visible": true
	}) {

		// filter
		// this.cards = this.cards.filter(e => e);

		let _cards = [];

		for (let i in this.cards) {

			let _correct = true;

			for (let filterName in filters) {
				try {
					_correct = _correct && this.cards[i][filterName] == filters[filterName];
				} catch (e) {
					console.warn('Incorrect filter ' + filterName + ' in deck:getCards');
				}
			}

			if (_correct) {
				_cards.push(this.cards[i]);
			}
		}

		return _cards;
	}

	/**
	 * Get top cards
	 * @param {number} count 
	 * @param {*} filters 
	 * @returns {Card[]}
	 */
	getTopCards(count, filters) {
		return this.getCards(filters).slice(-(count | 0));
	}

	/**
	 * Get top card
	 * @param {*} filters 
	 * @returns {Card}
	 */
	getTopCard(filters) {
		return this.getTopCards(1, filters)[0];
	}

	/**
	 * Count of cards
	 * @param {*} filters 
	 * @returns {number}
	 */
	cardsCount(filters) {
		return this.getCards(filters).length;
	}

	/**
	 * Get card from deck by index
	 * @param {number} index
	 * @returns {false|Card}
	 */
	getCardByIndex(index) {
		return this.cards[index] ? this.cards[index] : false;
	}

	/**
	 * Get card index by id
	 * @param {string} id
	 * @returns {false|number} 
	 */
	getCardIndexById(id) {

		let index = false;

		for (let i in this.cards) {
			if (this.cards[i].id == id) {
				index = i;
			}
		}

		return index;
	}

	/**
	 * @typedef {Object} deckRelation
	 * @property {string} type
	 * @property {string} name
	 * @property {?string} id
	 * @property {?string} direction
	 * @property {string} to
	 */

	/**
	 * Get deck relations with other decks by relation name
	 * @param {string} relationName 
	 * @param {*} filters 
	 * @returns {deckRelation[]}
	 */
	getRelationsByName(relationName, filters) {

		let _relations = [];

		for (let i in this.relations) {
			if (this.relations[i].name == relationName) {

				if (filters) {

					let _correct = true;

					for (let attr in filters) {
						_correct = _correct && this.relations[i][attr] == filters[attr];
					}

					if (_correct) {
						_relations.push(this.relations[i]);
					}
				} else {
					_relations.push(this.relations[i]);
				}
			}
		}

		return _relations;
	}

	/**
	 * Check for the existence of a TAG in a deck
	 * @param {number} tagName
	 */
	hasTag(tagName) {

		for (let i in this.tags) {
			if (this.tags[i] == tagName) {
				return true;
			}
		}

		return false;
	}
}

export default connect(state => state.toJS())(deckClass);
// export default deckClass;