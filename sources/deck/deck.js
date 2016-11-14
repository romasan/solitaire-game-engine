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

	constructor(data, id) {

		// console.log('%cADD DECK', 'background: orange;');

		if(!data) {
			return false;
		}

		this.cards = [];
		
		// parameters
		this.type = 'deck';
		this.fill = false;

		this.id = id;

		let _parent_el   = Group.getByName(data.parent)                  ,
			_parent_name = _parent_el ? _parent_el.name : 'no_parent_'   ,
			_new_id      = _parent_el ? _parent_el.getDecks().length : id;
		
		this.name = typeof data.name == 'string' 
			? data.name
			: (_parent_name + '_' + _new_id);
		
		this.locked     = data.locked ? true : false;
		this.save       = data.save   ? true : false;
		// this.longStep   = data.longStep ? true : false;
		this.visible    = typeof data.visible    == 'boolean' ? data.visible    : true;// default true
		this.groupIndex = typeof data.groupIndex == 'number'  ? data.groupIndex : null;
		this.parent     = typeof data.parent     == 'string'  ? data.parent     : 'field';
		this.autoHide   = typeof data.autoHide   == 'boolean' ? data.autoHide   : defaults.autohide;
		
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
		
		// ------------- FLIP -------------
		
		let flipType = data.flip && typeof data.flip == 'string' 
			? data.flip 
			: defaults.flip_type;
		
		this.cardFlipCheck = flipTypes[flipType];
		
		// ------------- PUT -------------

		this.putRules = data.putRules 
			? typeof data.putRules == 'function' 
				? data.putRules
				: typeof data.putRules == 'string' 
					? readyPutRules[data.putRules] 
						? readyPutRules[data.putRules]
						: readyPutRules[defaults.putRule]
					// : typeof data.putRules === 'object' 
					: data.putRules.constructor == Array 
						? data.putRules
						: readyPutRules[defaults.putRule]
			: readyPutRules[defaults.putRule];

		// ------------- TAKE -------------
		
		// можно ли взять карту/стопку
		this.takeRules = data.takeRules;

		// ------------- FILL -------------

		this.fillRules = null;

		if(data.fillRule && !data.fillRules) {
			data.fillRules = [data.fillRule];
		}

		if(data.fillRules) {
			this.fillRules = data.fillRules;
		}
		
		// ------------- PADDING -------------
		
		// порядок карт в колоде
		let padding = data.paddingX || data.paddingY
			? paddingTypes.special 
			: data.paddingType 
				? (typeof data.paddingType == 'string' && paddingTypes[data.paddingType]) 
					? paddingTypes[data.paddingType] 
					: paddingTypes.none
				: paddingTypes[defaults.paddingType];

		this.padding = function(index) {
			
			let _padding = padding(this._params, this.cards[index], index, this.cards.length, this.cards);
			
			return _padding;
		}
		
		this.actions = [];
		if(data.actions) {
			this.actions = data.actions;
			deckActions.add(this);
		}

		// ------------ RELATIONS ------------

		if(data.relations) {
			this.relations = data.relations;
		} else {
			this.relations = [];
		}

		// --

		this.tags = data.tags ? data.tags : [];
		
		// --

		event.dispatch('addDeckEl', {
			deckData : data, 
			deck     : this,
			params   : this._params
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
			deck     : this,
			deckData : data,
			params   : this._params,
			cards    : this.cards
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

		let _cards = [];
		
		for(let i in this.cards) {
			
			let _card = common.getElementById(this.cards[i]);
			
			_cards.push(_card);
		}

		return _cards;
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

let addDeck = (data) => {

	if(!data) {
		return false;
	}
	
	let id = 'deck_' + common.genId();
	
	let _el_deck = new Deck(data, id);

	// fill deck
	if(data.fill) {
		for(let i in data.fill) {
			if(typeof data.fill[i] == 'string') {
				_el_deck.genCardByName(data.fill[i]);
			}
		}
	}
	
	let _elements = share.get('elements');

	_elements[id] = _el_deck;
	
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
