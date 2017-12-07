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

class deckClass {

	/**
	 * Create a deck
	 * @param {*} data 
	 * @param {string} id
	 */
	constructor(data, id) {

		if (!data) {
			return false;
		}

		/**
		 * @type {Card[]}
		 */
		this.cards = [];

		// parameters
		/**
		 * @type {string}
		 */
		this.type = 'deck';

		/**
		 * @type {boolean}
		 */
		this.full = false;

		/**
		 * @type {string}
		 */
		this.id = id;

		// let _parent_el   = Group.getByName(data.parent)                  ,
		//     _parent_name = _parent_el ? _parent_el.name : 'no_parent_'   ,
		// 	_new_id      = _parent_el ? _parent_el.getDecks().length : id;
		let _parent_name = data.parent ? data.parent : 'no_parent';

		/**
		 * @type {name}
		 */
		this.name = typeof data.name == 'string'
			? data.name
			: (_parent_name + '_' + data.deckIndex);
		
		if (
			typeof data.name != "string" &&
				  !data.deckIndex
		) {
			console.warn('Deck name', this.name, 'is incorrect');
		}

		// console.log('Deck', id, this.name);

		/**
		 * @type {boolean}
		 */
		this.locked = data.locked ? true : false;

		/**
		 * @type {boolean}
		 */
		this.save = data.save ? true : false;

		/**
		 * @type {boolean}
		 */
		this.visible = typeof data.visible == 'boolean' ? data.visible : true;

		/**
		 * @type {number}
		 */
		this.deckIndex = typeof data.deckIndex == 'number' ? data.deckIndex : null;

		/**
		 * @type {string}
		 */
		this.parent = typeof data.parent == 'string' ? data.parent : 'field';

		/**
		 * @type {boolean}
		 */
		this.autoHide = typeof data.autoHide == 'boolean' ? data.autoHide : defaults.autohide;

		/**
		 * @type {boolean}
		 */
		this.autoCheckFlip = typeof data.autoCheckFlip == 'boolean' ? data.autoCheckFlip : defaults.autoCheckFlip;

		/**
		 * @type {boolean}
		 */
		this.showPrefFlipCard = typeof data.showPrefFlipCard == 'boolean' ? data.showPrefFlipCard : share.get('showPrefFlipCard');

		/**
		 * @type {boolean}
		 */
		this.showPrevAttempts = typeof data.showPrevAttempts == 'boolean' ? data.showPrevAttempts : defaults.showPrevAttempts;

		/**
		 * @type {boolean}
		 */
		this.checkNextCards = typeof data.checkNextCards == 'boolean' ? data.checkNextCards : defaults.checkNextCards;

		this.data = {};

		// changed parameters
		if (typeof data.showSlot == 'undefined') {
			data.showSlot = defaults.showSlot;
		}

		if (data.padding) {
			if (
				typeof data.padding.x == 'number' &&
				typeof data.paddingX  != 'number'
			) {
				data.paddingX = data.padding.x;
			}
			if (
				typeof data.padding.y == 'number' &&
				typeof data.paddingY  != 'number'
			) {
				data.paddingY = data.padding.y;
			}
		}

		if (data.flipPadding) {
			if (
				typeof data.flipPadding.x == 'number' &&
				typeof data.flipPaddingX  != 'number'
			) {
				data.flipPaddingX = data.flipPadding.x;
			}
			if (
				typeof data.flipPadding.y == 'number' &&
				typeof data.flipPaddingY  != 'number'
			) {
				data.flipPaddingY = data.flipPadding.y;
			}
		}

		this._params = {
			"padding_y"      : typeof data.paddingY     == 'number' ? data.paddingY     : defaults.padding_y     ,
			"flip_padding_y" : typeof data.flipPaddingY == 'number' ? data.flipPaddingY : defaults.flip_padding_y,
			"padding_x"      : typeof data.paddingX     == 'number' ? data.paddingX     : defaults.padding_x     ,
			"flip_padding_x" : typeof data.flipPaddingX == 'number' ? data.flipPaddingX : defaults.flip_padding_x,
			"startZIndex"    : typeof data.startZIndex  == 'number' ? data.startZIndex  : defaults.startZIndex   ,
			"rotate"         : typeof data.rotate       == 'number' ? data.rotate       : defaults.rotate        ,
			"x"              : 0                                                                                 ,
			"y"              : 0
		};

		let __data = applyChangedParameters({
			"deckData" : data        ,
			"deck"     : this        ,
			"params"   : this._params
		}, false);

		/**
		 * @typedef {Object} Vector2d
		 * @property {number} x
		 * @property {number} y
		 */

		/**
		 * Get position
		 * @returns {Vector2d}
		 */
		this.getPosition = e => {
			return {
				"x": __data.params.x,
				"y": __data.params.y
			};
		}

		/**
		 * @type {number}
		 */
		this.rotate = this._params.rotate;

		/**
		 * @type {boolean}
		 */
		this.autoUnflipTop = typeof data.autoUnflipTop == 'boolean' ? data.autoUnflipTop : defaults.autoUnflipTop;

		// Flip
		let flipData = null;

		let flipType = data.flip && typeof data.flip == 'string'
			? data.flip.indexOf(':') > 0
				? (e => {

					let name = e[0];

					if (e.length == 2) {
						flipData = e[1];
					}

					return flipTypes[name]
						? name
						: defaults.flip_type;
				})(data.flip.split(':'))
				: flipTypes[data.flip]
					? data.flip
					: defaults.flip_type
			: defaults.flip_type;

		/**
		 * Check card flip
		 * @param {Card} card
		 * @param {number} index
		 * @param {number} length
		 */
		this.cardFlipCheck = (card, index, length) => {
			card.flip = flipTypes[flipType](index, length, flipData, this);
		};

		/**
		 * Parse string with parameter
		 * @param {string} line
		 * @returns {string}
		 */
		let stringWithColon = line => {
			if (
				typeof line == "string" &&
				line.indexOf(':') > 0
			) {
				return line.split(':')[0];
			} else {
				return line;
			}
		};

		/**
		 * Put rules
		 * @type {string|string[]}
		 */
		this.putRules = data.putRules
			? typeof data.putRules == 'string'
				? putRules[stringWithColon(data.putRules)]
					? [data.putRules]
					: defaults.putRules
				: data.putRules.constructor == Array
					? data.putRules.filter(
						ruleName => typeof ruleName == 'string' && putRules[stringWithColon(ruleName)] // TODO Exception (putRule "***" not found)
							? true
							: false
					)
					: defaults.putRules
			: defaults.putRules;

		if (this.putRules.length == 0) {
			this.putRules = defaults.putRules;
		}

		/**
		 * Take rules
		 * @type {string|string[]}
		 */
		this.takeRules = data.takeRules
			? typeof data.takeRules == 'string'
				? takeRules[data.takeRules]
					? [data.takeRules]
					: defaults.takeRules
				: data.takeRules.constructor == Array
					? data.takeRules.filter(
						ruleName => typeof ruleName == 'string' && takeRules[ruleName] // TODO Exception (takeRule "***" not found)
					)
					: defaults.takeRules
			: defaults.takeRules;

		// Правила сложенной колоды
		// Сложенная колода может использоваться для определения выиигрыша
		// В сложенную колоду нельзя класть новые карты
		/**
		 * Full rules
		 * @type {string|string[]}
		 */
		this.fullRules = data.fullRules
			? typeof data.fullRules == "string"
				? fullRules[data.fullRules]
					? [data.fullRules]
					: defaults.fullRules
				: data.fullRules.constructor == Array
					? data.fullRules.filter(
						ruleName => typeof ruleName == "string" && fullRules[ruleName]
					)
					: defaults.fullRules
			: defaults.fullRules;

		// Padding
		// порядок карт в колоде
		let paddingData = null;
		let padding = data.paddingType                                 // isset data.paddingType
			? typeof data.paddingType == 'string'                      // is string
				? paddingTypes[data.paddingType]                       // isset method
					? paddingTypes[data.paddingType]                   // use method(data.paddingType)
					: data.paddingType.indexOf(':') >= 0               // is method with attribute
						? (e => {

							let name = e[0];                           // method name

							if (paddingTypes[name]) {
								paddingData = e.length > 1             // save method data
									? e.slice(1).join(':')
									: '';
								return paddingTypes[name];             // use method(data.paddingType)
							}

							return paddingTypes[defaults.paddingType]; // use default
						})(data.paddingType.split(':'))
						: paddingTypes[defaults.paddingType]           // use default
				: paddingTypes[defaults.paddingType]                   // use default
			: paddingTypes[defaults.paddingType];                      // use default

		/**
		 * Get padding for card by index
		 * @param {number}
		 * @returns {Vector2d}
		 */
		this.padding = index => {

			let _cards = this.getCards();
			let _index = index < _cards.length ? index : _cards.length - 1;
			let _card  = _cards[_index] ? _cards[_index] : this.cards[index];

			return padding(
				this._params ,
				_card        ,
				_index       ,
				_cards.length,
				_cards       ,
				paddingData
			);
		}

		/**
		 * Deck actions
		 */
		this.actions = [];

		if (data.actions) {
			this.actions = data.actions;
			deckActions.add(this);
		}

		/**
		 * Relations
		 */
		this.relations = [];
		if (data.relations) {
			this.relations = data.relations;
		}

		// Tags
		/**
		 * @type {string[]}
		 */
		this.tags = data.tags ? data.tags : [];

		event.dispatch('addDeckEl', {
			"deckData" : data        , 
			"deck"     : this        ,
			"params"   : this._params
		});

		// Подписывается на перетаскивание стопки/карты
		let _callback = data => {

			// TODO
			// проверять fill только для тех стопок котрые участвовали в Action

			if (data.destination.name != this.name) {
				return;
			}

			this.checkFull();
		};

		event.listen('moveDragDeck', _callback);
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
	 * Deck redraw
	 * @param {*} data 
	 */
	Redraw(data) {

		// console.log('deck:Redraw', this.name);

		event.dispatch('redrawDeck', {
			"deck"     : this        ,
			"deckData" : data        ,
			"params"   : this._params,
			"cards"    : this.cards
		});

		// this.checkFlip();

		event.dispatch('redrawDeckFlip', {
			"cards" : this.cards
		});
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
	hideCardByIndex(index, redraw, save) {

		if (this.cards[index]) {

			this.cards[index].visible = false;

			if (redraw) {
				this.Redraw();
			}

			if (save) {

				event.dispatch('addStep', {
					"hide" : {
						"cardIndex" : index                 ,
						"cardName"  : this.cards[index].name,
						"deckName"  : this             .name
					}
				});
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

export default deckClass;