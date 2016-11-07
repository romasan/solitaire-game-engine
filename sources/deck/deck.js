'use strict';

import event          from 'event';
import share          from 'share';
import defaults       from 'defaults';
import common         from 'common';

import flipTypes      from 'flipTypes';
import readyPutRules  from 'readyPutRules';
import readyTakeRules from 'readyTakeRules';
import fillRules      from 'fillRules';
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

	constructor(a, _id) {

		// console.log('%cADD DECK', 'background: orange;');

		if(!a) {
			return false;
		}

		this.cards = [];
		
		// parameters
		this.type = 'deck';
		this.fill = false;

		this.id = _id;

		let _parent_el   = Group.getGroup(a.parent),
			_parent_name = _parent_el ? _parent_el.name : 'xname',// ???
			_new_id      = _parent_el ? _parent_el.getDecks().length : _id;
		
		this.name = a.name && typeof a.name == 'string' 
			? a.name
			: (_parent_name + '_' + _new_id);
		
		this.locked     = a.locked ? true : false;
		this.save       = a.save   ? true : false;
		// this.longStep   = a.longStep ? true : false;
		this.visible    = a.visible    && typeof a.visible    == 'boolean' ? a.visible    : true;// default true
		this.groupIndex = a.groupIndex && typeof a.groupIndex == 'number'  ? a.groupIndex : null;
		this.parent     = a.parent     && typeof a.parent     == 'string'  ? a.parent     : 'field';
		this.autoHide   = a.autoHide   && typeof a.autoHide   == 'boolean' ? a.autoHide   : defaults.autohide;
		
		// changed parameters
		if(typeof a.showSlot == "undefined") {
			a.showSlot = defaults.showSlot;
		}
		
		this._params = {
			padding_y      : ( a.paddingY     && typeof a.paddingY     == 'number' ) ? a.paddingY     : defaults.padding_y     ,
			flip_padding_y : ( a.flipPaddingY && typeof a.flipPaddingY == 'number' ) ? a.flipPaddingY : defaults.flip_padding_y,
			padding_x      : ( a.paddingX     && typeof a.paddingX     == 'number' ) ? a.paddingX     : defaults.padding_x     ,
			flip_padding_x : ( a.flipPaddingX && typeof a.flipPaddingX == 'number' ) ? a.flipPaddingX : defaults.flip_padding_x,
			startZIndex    : ( a.startZIndex  && typeof a.startZIndex  == 'number' ) ? a.startZIndex  : defaults.startZIndex   ,
			rotate         : this.rotate = 0                                                                                   ,
			x              : 0                                                                                                 ,
			y              : 0
		};
		
		// ------------- FLIP -------------
		
		let flipType = a.flip && typeof a.flip == 'string' 
			? a.flip 
			: defaults.flip_type;
		
		this.cardFlipCheck = flipTypes[flipType];
		
		// ------------- PUT -------------

		this.putRules = a.putRules 
			? typeof a.putRules == 'function' 
				? a.putRules
				: typeof a.putRules == 'string' 
					? readyPutRules[a.putRules] 
						? readyPutRules[a.putRules]
						: readyPutRules[defaults.putRule]
					// : typeof a.putRules === 'object' 
					: a.putRules.constructor == Array 
						? a.putRules
						: readyPutRules[defaults.putRule]
			: readyPutRules[defaults.putRule];

		// ------------- TAKE -------------
		
		// можно ли взять карту/стопку
		this.takeRules = a.takeRules;

		// ------------- FILL -------------

		this.fillRules = null;

		if(a.fillRule && !a.fillRules) {
			a.fillRules = [a.fillRule];
		}

		if(a.fillRules) {
			this.fillRules = a.fillRules;
		}
		
		// ------------- PADDING -------------
		
		// порядок карт в колоде
		let padding = a.paddingX || a.paddingY
			? paddingTypes.special 
			: a.paddingType 
				? (typeof a.paddingType == 'string' && paddingTypes[a.paddingType]) 
					? paddingTypes[a.paddingType] 
					: paddingTypes.none
				: paddingTypes[defaults.paddingType];

		this.padding = function(index) {
			
			let _padding = padding(this._params, this.cards[index], index, this.cards.length, this.cards);
			
			return _padding;
		}
		
		this.actions = [];
		if(a.actions) {
			this.actions = a.actions;
			deckActions.addActions.call(this);
		}

		// ------------ RELATIONS ------------

		if(a.relations) {
			this.relations = a.relations;
		} else {
			this.relations = [];
		}

		// --

		this.tags = a.tags ? a.tags : [];
		
		// --

		event.dispatch('addDeckEl', {
			a     : a, 
			deck  : this,
			params: this._params
		});

		// Подписывается на перетаскивание стопки/карты
		let _callback = (data) => {

			// TODO
			// проверять fill только для тех стопок котрые участвовали в Action
			
			if(data.destination.name != this.name) {
				return;
			}

			this.checkFill();
		};
		event.listen('moveDragDeck', _callback);
	}

// -------------------------------------------------------------------------------------------------

	// перерисовка стопки
	Redraw(data) {

		event.dispatch('redrawDeck', {
			deck   : this,
			data   : data,
			params : this._params,
			cards  : this.cards
		});
	}

	getTopCard() {

		if(this.cards.length === 0) {
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
			
		for(var i in this.cards) {
			this.cardFlipCheck(this.cards[i], i|0, this.cards.length);
		}
		
		event.dispatch('redrawDeckFlip', this);
	}
	
	checkFill() {

		if(!this.fill) {

			let notFill = true;
			
			for(let ruleName in this.fillRules) {

				if(fillRules[ruleName]) {
					notFill = notFill && !fillRules[ruleName](this);
				}
			}
			
			this.fill = !notFill;
		}
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

	Push(deck) {// , parentName) {
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
		if(this.autoHide && this.cards.length === 0) {
			this.hide();
		}
		
		this.Redraw();

		return _deck;
	}

	Take(cardId) {
		return Take.call(this, cardId);// ??? .call(this, attributes);
	}

// проверяем, можем ли положить стопку/карту
// возвращает true, если согласно правилам сюда можно положить карту
	Put(putDeck) {
		return Put.call(this, putDeck);//(deckConstructor);
	}

// создать карту
	genCardByName(name) {
		return genCardByName.call(this, name);
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

	getCardsByName(cardName) {
		var _cards = [];
		for(var i in this.cards) {
			if(this.cards[i].name == cardName) {
				_cards.push(this.cards[i]);
			}
		}
		return _cards;
	}

	Card(cardName) {
		return this.getCardsByName(cardName)[0];
	}

	hideCards() {
		for(var i in this.cards) {
			this.cards[i].visible = false;
			event.dispatch('hideCard', this.cards[i]);
		}
	}

	showCards() {
		for(var i in this.cards) {
			this.cards[i].visible = true;
			event.dispatch('showCard', this.cards[i]);
		}
	}

	getCardsNames() {
		
		var _cardsNames = [];
		
		for(var i in this.cards) {
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

let addDeck = (a) => {

	if(!a) {
		return false;
	}
	
	let _id = 'deck_' + common.genId();
	
	let _a = null;
	try {
		_a = Object.assign({}, a);
	} catch(e) {
		_a = a;
	}
	
	let _el_deck = new Deck(_a, _id);

	// fill deck
	if(a.fill) {
		for(let i in a.fill) {
			if(typeof a.fill[i] == 'string') {
				_el_deck.genCardByName(a.fill[i]);
			}
		}
	}
	
	let _elements = share.get('elements');

	_elements[_id] = _el_deck;
	
	share.set('elements', _elements);

	return _el_deck;
};

// ------------------------------------------------------------------------------------------------------------------------------------------

export default {
	deckCardNames,
	addDeck      ,
	getDeck      ,
	getDecks     ,
	getDeckById
};
