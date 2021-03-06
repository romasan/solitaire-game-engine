'use strict';

import common, {event, share, defaults} from '../common'                             ;

import flipTypes              from './flipTypes'                                     ;
import PutRules               from './putRules'                                      ;
import TakeRules              from './takeRules'                                     ;
import FullRules              from './fullRules'                                     ;
import paddingTypes           from './paddingTypes'                                  ;
import deckActions            from './deckActions'                                   ;
import Take                   from './deckTake'                                      ;
import Put                    from './deckPut'                                       ;
import Card                   from '../card'                                         ;
import Group                  from '../group'                                        ;
import Extends                from './extends'                                       ;

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

		const {
			name            ,
			parent          ,
			deckIndex       ,
			locked          ,
			save            ,
			visible         ,
			autoHide        ,
			autoCheckFlip   ,
			showPrefFlipCard,
			showPrevAttempts,
			checkNextCards  ,
			autoUnflipTop   ,
			flip            ,
			putRules        ,
			takeRules       ,
			fullRules       ,
			paddingType     ,
			actions
		} = data;

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
		let _parent_name = parent ? parent : 'no_parent';

		/**
		 * @type {name}
		 */
		this.name = typeof name == 'string'
			? name
			: (_parent_name + '_' + deckIndex);
		
		if (
			typeof name != "string" &&
			!deckIndex
		) {
			// console.warn('Deck name', this.name, 'is incorrect');
			this.name = "deck_no_name_" + this.id;
		}

		// console.log('Deck', id, this.name);

		/**
		 * @type {boolean}
		 */
		this.locked = typeof locked == "boolean" ? locked : false;

		/**
		 * @type {boolean}
		 */
		this.save = typeof save == "boolean" ? save : true;

		/**
		 * @type {boolean}
		 */
		this.visible = typeof visible == 'boolean' ? visible : true;

		/**
		 * @type {number}
		 */
		this.deckIndex = typeof deckIndex == 'number' ? deckIndex : null;

		/**
		 * @type {string}
		 */
		this.parent = typeof data.parent == 'string' ? data.parent : 'field';

		/**
		 * @type {boolean}
		 */
		this.autoHide = typeof autoHide == 'boolean' ? autoHide : defaults.autohide;

		/**
		 * @type {boolean}
		 */
		this.autoCheckFlip = typeof autoCheckFlip == 'boolean' ? autoCheckFlip : defaults.autoCheckFlip;

		/**
		 * @type {boolean}
		 */
		this.showPrefFlipCard = typeof showPrefFlipCard == 'boolean' ? showPrefFlipCard : share.get('showPrefFlipCard');

		/**
		 * @type {boolean}
		 */
		this.showPrevAttempts = typeof showPrevAttempts == 'boolean' ? showPrevAttempts : defaults.showPrevAttempts;

		/**
		 * @type {boolean}
		 */
		this.checkNextCards = typeof checkNextCards == 'boolean' ? checkNextCards : defaults.checkNextCards;

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
		this.autoUnflipTop = typeof autoUnflipTop == 'boolean' ? autoUnflipTop : defaults.autoUnflipTop;

		// Flip
		let flipData = null;

		let flipType = flip && typeof flip == 'string'
			? flip.indexOf(':') > 0
				? (e => {

					let name = e[0];

					if (e.length == 2) {
						flipData = e[1];
					}

					return flipTypes[name]
						? name
						: defaults.flip_type;
				})(flip.split(':'))
				: flipTypes[flip]
					? flip
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
		this.putRules = putRules
			? typeof putRules == 'string'
				? PutRules[stringWithColon(putRules)]
					? [putRules]
					: defaults.putRules
				: putRules.constructor == Array
					? putRules.filter(
						ruleName => typeof ruleName == 'string' && PutRules[stringWithColon(ruleName)] // TODO Exception (putRule "***" not found)
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
		 * @type {string | Array<string>}
		 */
		this.takeRules = takeRules
			? typeof takeRules == 'string'
				? TakeRules[takeRules]
					? [takeRules]
					: defaults.takeRules
				: takeRules.constructor == Array
					? takeRules.filter(
						ruleName => typeof ruleName == 'string' && TakeRules[ruleName] // TODO Exception (takeRule "***" not found)
					)
					: defaults.takeRules
			: defaults.takeRules;

		// Правила сложенной колоды
		// Сложенная колода может использоваться для определения выиигрыша
		// В сложенную колоду нельзя класть новые карты
		/**
		 * Full rules
		 * @type {string | Array<string>}
		 */
		this.fullRules = fullRules
			? typeof fullRules == "string"
				? FullRules[fullRules]
					? [fullRules]
					: defaults.fullRules
				: fullRules.constructor == Array
					? fullRules.filter(
						ruleName => typeof ruleName == "string" && FullRules[ruleName]
					)
					: defaults.fullRules
			: defaults.fullRules;

		// Padding
		// порядок карт в колоде
		let paddingData = null;
		let padding = paddingType                                 // isset paddingType
			? typeof paddingType == 'string'                      // is string
				? paddingTypes[paddingType]                       // isset method
					? paddingTypes[paddingType]                   // use method(paddingType)
					: paddingType.indexOf(':') >= 0               // is method with attribute
						? (e => {

							let name = e[0];                           // method name

							if (paddingTypes[name]) {
								paddingData = e.length > 1             // save method data
									? e.slice(1).join(':')
									: '';
								return paddingTypes[name];             // use method(paddingType)
							}

							return paddingTypes[defaults.paddingType]; // use default
						})(paddingType.split(':'))
						: paddingTypes[defaults.paddingType]           // use default
				: paddingTypes[defaults.paddingType]                   // use default
			: paddingTypes[defaults.paddingType];                      // use default

		/**
		 * Get padding for card by index
		 * @param {number}
		 * @returns {Vector2d}
		 */
		this.padding = index => {

			let _cards = this.getCards(); // filter = {"visible" : true}
			let _index = index < _cards.length ? index : _cards.length - 1;
			let _card  = _cards[_index] ? _cards[_index] : this.cards[index];

			let _padding = padding(
				this._params ,
				_card        ,
				_index       ,
				_cards.length,
				_cards       ,
				paddingData
			);

			// for (let key in this.actions) {

			// 	const actionExtends = deckActions.getExtends(key);

			// 	if (
			// 		       actionExtends                       &&
			// 		typeof actionExtends.padding == "function"
			// 	) {
			// 		_padding = actionExtends.padding(this, _padding, padding, index);
			// 	}
			// }

			let e_padding = Extends.padding(
				this    ,
				_padding,
				e_index => padding(
					this._params     ,
					_card            ,
					e_index          ,
					_cards.length    ,
					_cards           ,
					paddingData      ,
					'extends:padding'
				),
				index
			);

			if (e_padding) {
				_padding = e_padding;
			}

			return _padding;
		}

		/**
		 * Deck actions
		 */
		this.actions = [];

		if (actions) {
			this.actions = actions;
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

		// console.log('deck:Redraw', this.name, typeof data);

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
	unflipCardByIndex(index, redraw = true, save) {

		// console.log('deck:unflipCardByIndex:', this.name, index);

		if (this.cards[index]) {

			this.cards[index].flip = false;

			// event.dispatch('redrawDeckFlip', this);
			if (redraw) {
				this.Redraw();
			}

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

			this.unflipCardByIndex(this.cards.length - 1, true, save);
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

		// console.log('deck:unflipAllCards', save);

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
					       typeof FullRules[_rule] == 'function' &&
					       FullRules[_rule](this);
				} else {

					for (let subRule in _rule) {
						if (
							typeof subRule            == 'string'   &&
							typeof fullRules[subRule] == 'function'
						) {
							full = full && FullRules[subRule](this, _rule[subRule]);
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
					_correct = _correct && (
						filters[filterName] == null
							? true
							: (
								this.cards[i][filterName] == filters[filterName]
							)
					);
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

	hasCard(card) { // , stat = false) {
		
		let name = null,
			id   = null;

		let data = {
			cards: []
		};

		if (typeof card == "string") {
			name = card;
		} else if (card && typeof card.type == "string" && card.type == "card") {
			id = card.id;
		}

		for (let i in this.cards) {

			// let result = false;

			const card = this.cards[i];

			if (name && card.name == name) {
				// result = true;
				return true;
			}

			if (id && card.id == id) {
				// result = true;
				return true;
			}

			// if (stat) {

			// 	data.cards[i] = {
			// 		"name"    : card.name   ,
			// 		"id"      : card.id     ,
			// 		"flip"    : card.flip   ,
			// 		"visible" : card.visible
			// 	};

			// 	if (result) {
			// 		data.index = i;
			// 		data.name  = card.name;
			// 		data.id    = card.id;
			// 	}

			// } else if (result){
			// 	return result;
			// }
		}

		// if (stat) {

		// 	let visible   = 0,
		// 		invisible = 0,
		// 		flip      = 0,
		// 		unflip    = 0;

		// 	for (let i in data.cards) {

		// 		const card = data.cards[i];

		// 		if (i < data.index) {

		// 			if (card.visible == true) {
		// 				visible += 1;
		// 				invisible = 0;
		// 			}

		// 			if (card.visible == false) {
		// 				invisible += 1;
		// 				visible = 0;
		// 			}

		// 			if (card.flip == true) {
		// 				flip += 1;
		// 				unflip = 0;
		// 			}

		// 			if (card.flip == false) {
		// 				unflip += 1;
		// 				flip = 0;
		// 			}
		// 		} else if (i == data.index) {

		// 			data.before = {
		// 				"visible"   : visible  ,
		// 				"invisible" : invisible,
		// 				"flip"      : flip     ,
		// 				"unflip"    : unflip
		// 			};

		// 			visible   = 0;
		// 			invisible = 0;
		// 			flip      = 0;
		// 			unflip    = 0;
		// 		} else if (i > datacards.index) {

		// 			if (card.visible == true) {
		// 				visible += 1;
		// 				invisible = 0;
		// 			}

		// 			if (card.visible == false) {
		// 				invisible += 1;
		// 				visible = 0;
		// 			}

		// 			if (card.flip == true) {
		// 				flip += 1;
		// 				unflip = 0;
		// 			}

		// 			if (card.flip == false) {
		// 				unflip += 1;
		// 				flip = 0;
		// 			} 
		// 		}
		// 	}

		// 	data.after = {
		// 		"visible"   : visible  ,
		// 		"invisible" : invisible,
		// 		"flip"      : flip     ,
		// 		"unflip"    : unflip
		// 	};

		// 	return data;
		// }

		return false;
	
	}
}

export default deckClass;

export { default as getDecks    } from './getDecks'     ;
export { default as getDeckById } from './getDeckById'  ;
export { default as generator   } from './deckGenerator';
export { default as actions     } from './deckActions'  ;
export { default as atom        } from './atom'         ;