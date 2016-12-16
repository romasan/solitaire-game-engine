'use strict';

import event          from 'event';
import share          from 'share';
import defaults       from 'defaults';
import common         from 'common';

import flipTypes      from 'flipTypes';
import readyPutRules  from 'readyPutRules';
import readyTakeRules from 'readyTakeRules';
import fullRules      from 'fullRules';
import paddingTypes   from 'paddingTypes';
import deckActions    from 'deckActions';
import Take           from 'deckTake';
import Put            from 'deckPut';
import genCardByName  from 'genCardByName';
import Group          from 'group';
import History        from 'history';

import getDecks       from 'getDecks';
import getDeckById    from 'getDeckById';
import deckCardNames  from 'deckCardNames';
import getDeck        from 'getDeck';

class Deck {

	constructor(data, id) {

		if(!data) {
			return false;
		}

		this.cards = [];

		// parameters
		this.type = 'deck';
		this.full = false;

		this.id = id;

		let _parent_el   = Group.getByName(data.parent)                  ,
		    _parent_name = _parent_el ? _parent_el.name : 'no_parent_'   ,
		    _new_id      = _parent_el ? _parent_el.getDecks().length : id;

		this.name = typeof data.name == 'string' 
			? data.name
			: (_parent_name + '_' + _new_id);

		this.locked     = data.locked ? true : false;
		this.save       = data.save   ? true : false;
		this.visible    = typeof data.visible    == 'boolean' ? data.visible   : true;
		this.deckIndex  = typeof data.deckIndex  == 'number'  ? data.deckIndex : null;
		this.parent     = typeof data.parent     == 'string'  ? data.parent    : 'field';
		this.autoHide   = typeof data.autoHide   == 'boolean' ? data.autoHide  : defaults.autohide;
		
		// changed parameters
		if(typeof data.showSlot == "undefined") {
			data.showSlot = defaults.showSlot;
		}
		
		this._params = {
			padding_y      : ( typeof data.paddingY     == 'number' ) ? data.paddingY     : defaults.padding_y     ,
			flip_padding_y : ( typeof data.flipPaddingY == 'number' ) ? data.flipPaddingY : defaults.flip_padding_y,
			padding_x      : ( typeof data.paddingX     == 'number' ) ? data.paddingX     : defaults.padding_x     ,
			flip_padding_x : ( typeof data.flipPaddingX == 'number' ) ? data.flipPaddingX : defaults.flip_padding_x,
			startZIndex    : ( typeof data.startZIndex  == 'number' ) ? data.startZIndex  : defaults.startZIndex   ,
			rotate         : ( typeof data.rotate       == 'number' ) ? data.rotate       : defaults.rotate        ,
			x              : 0                                                                                     ,
			y              : 0
		};

		this.rotate = this._params.rotate;

		// Flip
		let flipType = data.flip && typeof data.flip == 'string' 
			? data.flip 
			: defaults.flip_type;

		this.cardFlipCheck = flipTypes[flipType];

		// Put
		this.putRules = data.putRules 
			? typeof data.putRules == 'function' 
				? data.putRules
				: typeof data.putRules == 'string' 
					? readyPutRules[data.putRules] 
						? readyPutRules[data.putRules]
						: readyPutRules[defaults.putRule]
					: data.putRules.constructor == Array 
						? data.putRules
						: readyPutRules[defaults.putRule]
			: readyPutRules[defaults.putRule];

		// Take
		// можно ли взять карту/стопку
		this.takeRules = data.takeRules;

		// Full
		this.fullRules = null;

		if(data.fullRules) {
			this.fullRules = data.fullRules;
		}

		// Padding
		// порядок карт в колоде
		let padding = data.paddingX || data.paddingY
			? paddingTypes.special 
			: data.paddingType 
				? (typeof data.paddingType == 'string' && paddingTypes[data.paddingType]) 
					? paddingTypes[data.paddingType] 
					: paddingTypes.none
				: paddingTypes[defaults.paddingType];

		this.padding = index => padding(this._params, this.cards[index], index, this.cards.length, this.cards);

		this.actions = [];
		if(data.actions) {
			this.actions = data.actions;
			deckActions.add(this);
		}

		// Relations
		if(data.relations) {
			this.relations = data.relations;
		} else {
			this.relations = [];
		}

		// Tags
		this.tags = data.tags ? data.tags : [];
		
		event.dispatch('addDeckEl', {
			deckData : data, 
			deck     : this,
			params   : this._params
		});

		// Подписывается на перетаскивание стопки/карты
		let _callback = data => {

			// TODO
			// проверять fill только для тех стопок котрые участвовали в Action

			if(data.destination.name != this.name) {
				return;
			}

			this.checkFull();
		};

		event.listen('moveDragDeck', _callback);
	}

// -------------------------------------------------------------------------------------------------

	// перерисовка стопки
	Redraw(data) {

		event.dispatch('redrawDeck', {
			deck     : this,
			deckData : data,
			params   : this._params,
			cards    : this.cards
		});

		event.dispatch('redrawDeckFlip', {
			cards : this.cards
		});

	}

	getTopCard() {

		if(this.cards.length == 0) {
			return false;
		}

		return this.cards[this.cards.length - 1];
	}

	lock() {
		this.locked = true;
	}

	unlock() {
		this.locked = false;
	}

	flipCheck() {

		for(let cardIndex in this.cards) {
			this.cardFlipCheck(this.cards[cardIndex], cardIndex | 0, this.cards.length);
		}

		event.dispatch('redrawDeckFlip', this);
	}

	checkFull() {

		if(
			!this.full                &&
			this.fullRules            &&
			this.fullRules.length > 0
		) {

			let full = true;

			for(let ruleIndex in this.fullRules) {

				let _rule = this.fullRules[ruleIndex];

				if(
					typeof _rule == "string"
				) {
					console.log('###', _rule, this.name);
					full = full                                  &&
					       typeof fullRules[_rule] == "function" &&
					       fullRules[_rule](this);
				} else {

					for(let subRule in _rule) {
						if(
							typeof subRule == "string"              &&
							typeof fullRules[subRule] == "function"
						) {
							full = full && fullRules[subRule](this, _rule[subRule]);
						}
					}

					// if(_rule.query) {
					// 	fullRules._query(this, _rule.query)
					// }
				}
			}

			this.full = full;
		}

		return this.full;
	}

	Fill(cardNames) {

		for(let i in cardNames) {
			this.genCardByName(cardNames[i]);
		}
	}

	clear() {

		for(let i in this.cards) {
			event.dispatch('removeEl', this.cards[i]);
			this.cards[i] = null;
		}

		this.cards = [];

		event.dispatch('removeEl', this);
	}

	Push(deck) {

		for(let i in deck) {
			deck[i].parent = this.id;
			this.cards.push(deck[i]);
		}
	}

	Pop(count, clearParent) {

		if(this.cards.length < count) {
			return false;
		}

		let _deck = [];
		for(;count;count -= 1) {
			let _pop = this.cards.pop();
			if(clearParent) _pop.parent = null;
			_deck.push(_pop);
			_deck[_deck.length - 1].parent = null;
		}
		_deck.reverse();

		// что делать если вынули все карты
		if(
			this.autoHide           && 
			this.cards.length == 0
		) {
			this.hide();
		}

		this.Redraw();

		return _deck;
	}

	Take(cardId) {
		return Take(this, cardId);
	}

	// проверяем, можем ли положить стопку/карту
	// возвращает true, если согласно правилам сюда можно положить карту
	Put(putDeck) {
		return Put(this, putDeck);
	}

	// создать карту
	genCardByName(name) {
		return genCardByName(this, name);
	}

	hide() {
		this.visible = false;
		History.add({hideDeck : this.name});
		this.Redraw();
	}

	show() {
		this.visible = false;
		History.add({showDeck : this.name});
		this.Redraw();
	}

	// getCardsByName(cardName) {
	// 	var _cards = [];
	// 	for(var i in this.cards) {
	// 		if(this.cards[i].name == cardName) {
	// 			_cards.push(this.cards[i]);
	// 		}
	// 	}
	// 	return _cards;
	// }

	// Card(cardName) {
	// 	return this.getCardsByName(cardName)[0];
	// }

	getCards() {

		return this.cards;

		// let _cards = [];
		// for(let i in this.cards) {
		// 	let _card = common.getElementById(this.cards[i]);
		// 	_cards.push(_card);
		// }
		// return _cards;
	}

	hideCards() {
		for(let i in this.cards) {
			this.cards[i].visible = false;
			event.dispatch('hideCard', this.cards[i]);
		}
	}

	showCards() {
		for(let i in this.cards) {
			this.cards[i].visible = true;
			event.dispatch('showCard', this.cards[i]);
		}
	}

	getCardsNames() {

		let _cardsNames = [];

		for(let i in this.cards) {
			_cardsNames.push(this.cards[i].name);
		}

		return _cardsNames;
	}

	cardsCount() {
		return this.cards.length;
	}

	getRelationsByName(relationName, filter) {

		let _relations = [];

		for(let i in this.relations) {
			if(this.relations[i].name == relationName) {

				if(filter) {

					let _checked = 0, _count = 0;

					for(let attr in filter) {
						_count += 1;
						if(this.relations[i][attr] == filter[attr]) {
							_checked += 1;
						}
					}

					if(_checked == _count) {
						_relations.push(this.relations[i]);
					}
				} else {
					_relations.push(this.relations[i]);
				}
			}
		}

		return _relations;
	}

	hasTag(tagName) {

		for(let i in this.tags) {
			if(this.tags[i] == tagName) {
				return true;
			}
		}

		return false;
	}
}

let addDeck = data => {

	if(!data) {
		return false;
	}

	let id = 'deck_' + common.genId();

	let _deck = new Deck(data, id);

	// fill deck
	if(data.fill) {
		for(let i in data.fill) {
			if(typeof data.fill[i] == 'string') {
				_deck.genCardByName(data.fill[i]);
			}
		}
	}

	let _elements = share.get('elements');

	_elements[id] = _deck;

	share.set('elements', _elements);

	return _deck;
};

// ------------------------------------------------------------------------------------------------------------------------------------------

export default {
	deckCardNames,
	addDeck      ,
	getDeck      ,
	getDecks     ,
	getDeckById
};
