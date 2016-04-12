'use strict';

import event          from 'event';
import share          from 'share';
import defaults       from 'defaults';
import common         from 'SolitaireCommon';

import flipTypes      from 'flipTypes';
import readyPutRules  from 'readyPutRules';
import readyTakeRules from 'readyTakeRules';
import fillRules      from 'fillRules';
import paddingTypes   from 'paddingTypes';
import deckActions    from 'deckActions';
import Take           from 'deckTake';
import Put            from 'deckPut';
import genCardByName  from 'genCardByName';
import Group          from 'addGroup';
import History        from 'SolitaireHistory';

var deckConstructor = function(a, _id) {

	// console.log("Deck:addDeck", a);

	if(!a) return false;

	this.cards = [];
	
	this.getTopCard = function() {
		return this.cards[this.cards.length - 1];
	}
	
	// parameters
	
	this.type = 'deck';
	this.fill = false;
	var id = _id;

	this.getId = function() {
		return id;
	}

	this.locked = a.locked ? true : false;

	var _parent_el   = Group.Group(a.parent),
		_parent_name = _parent_el ? _parent_el.name : 'xname',// ???
		_new_id      = _parent_el ? _parent_el.getDecks().length : id;
	
	this.name = a.name && typeof a.name == 'string' 
		? a.name 
		: (_parent_name + '_' + _new_id);
	this.visible = a.visible && typeof a.visible   == 'boolean' ? a.visible : true;// default true
	this.groupIndex = a.groupIndex && typeof a.groupIndex == 'number' ? a.groupIndex : null;

	this.parent   = a.parent && typeof a.parent == 'string' ? a.parent : 'field';
	this.autoHide = a.autoHide && typeof a.autoHide == 'boolean' ? a.autoHide : defaults.autohide;
	
	var params = {};
	params.startZIndex = a.startZIndex && typeof a.startZIndex == 'number' ? a.startZIndex : defaults.start_z_index;
	
	// changed parameters
	
	if(typeof a.showSlot == "undefined") {
		a.showSlot = defaults.showSlot;
	}
	// DOM
	params.x              = 0; 
	params.y              = 0; 
	params.rotate = this.rotate = 0; 
	params.padding_y      = (    a.paddingY && typeof     a.paddingY == 'number') ?     a.paddingY :      defaults.padding_y;
	params.flip_padding_y = (a.flipPaddingY && typeof a.flipPaddingY == 'number') ? a.flipPaddingY : defaults.flip_padding_y;
	params.padding_x      = (    a.paddingX && typeof     a.paddingX == 'number') ?     a.paddingX :      defaults.padding_x;
	params.flip_padding_x = (a.flipPaddingX && typeof a.flipPaddingX == 'number') ? a.flipPaddingX : defaults.flip_padding_x;
	
	// ------------- FLIP -------------
	
	var flipType = a.flip && typeof a.flip == 'string' ? a.flip : defaults.flip_type,
		checkFlip = flipTypes[flipType];

	this.flipCheck = function() {
		// console.log('flipCheck', flipType, this.name);
		for(var i in this.cards) {
			checkFlip(this.cards[i], i|0, this.cards.length);
		}
	}
	
	// ------------- PUT -------------

	this.putRules = a.putRules 
		? typeof a.putRules == 'function' 
			? a.putRules
			: typeof a.putRules == 'string' 
				? readyPutRules[a.putRules] 
					? readyPutRules[a.putRules]
					: readyPutRules[defaults.putName]
				// : typeof a.putRules === 'object' 
				: a.putRules.constructor == Array 
					? a.putRules
					: readyPutRules[defaults.putName]
		: readyPutRules[defaults.putName];

	// console.log('putRules', this.name, this.putRules);

	// ------------- TAKE -------------
	
	// можно ли взять карту/стопку
	this.takeRules = a.takeRules;

	// ------------- FILL -------------
	
	
	var fillRule = (
		a.fillRule 
	 && typeof a.fillRule == "string" 
	 && typeof fillRules[a.fillRule] == "function"
	) ? fillRules[a.fillRule]
	  : fillRules['not'];
	
	// ------------- PADDING -------------
	
	// порядок карт в колоде

	// console.log('PADDING', this.name, a.paddingType, a.paddingX, a.paddingY);
	
	var padding = a.paddingX || a.paddingY
		? paddingTypes['special'] 
		: a.paddingType 
			? (typeof a.paddingType == 'string' && paddingTypes[a.paddingType]) 
				? paddingTypes[a.paddingType] 
				: paddingTypes['none']
			: paddingTypes[defaults.paddingType];

	// var padding = a.paddingType 
	// 	? (typeof a.paddingType == 'string' && paddingTypes[a.paddingType]) 
	// 		? paddingTypes[a.paddingType] 
	// 		: typeof a.paddingType == 'function' 
	// 			? a.paddingType 
	// 			: paddingTypes['none']
	// 	: a.paddingX || a.paddingY 
	// 		? paddingTypes['special'] 
	// 		: paddingTypes[defaults.paddingType];

	this.padding = function(index) {
		var _padding = padding(params, this.cards[index], index, this.cards.length, this.cards);
		return _padding;
	}
	
	this.actions = [];
	if(a.actions) {
		// TODO сделать красивее
		this.actions = a.actions;
	}
	this.runActions = function() {
		deckActions.runActions.call(this);
	}
	
	event.dispatch('addDeckEl', {
		a     : a, 
		deck  : this,
		params: params
	});

	event.listen('moveDragDeck', function(data) {
		if(data.destination.name != this.deck.name) return;
		var _deck = data.destination;
		if(_deck && !this.fill && this.callback({deck : _deck})) {
			this.deck.fill = true;
			History.add({fill : {
				deck : this.deck.name
			}});
			// event.dispatch('fillDeck', {deck : this.deck});
		}
	}.bind({
		deck     : this, 
		callback : fillRule
	}));

	this.Redraw = function(_a) {
		
		event.dispatch('redrawDeck', {
			deck   : this,
			a      : _a,
			params : params,
			cards  : this.cards
		});
		
	}

};

// -------------------------------------------------------------------------------------------------

deckConstructor.prototype.Fill = function(cardNames) {	
	for(var i in cardNames) {
		this.genCardByName(cardNames[i]);
	}
}

deckConstructor.prototype.clear = function() {
	for(var i in this.cards) {
		event.dispatch('removeEl', this.cards[i]);
		this.cards[i] = null;
	}
	this.cards = [];
	event.dispatch('removeEl', this);
}

deckConstructor.prototype.Push = function(deck) {// , parentName) {
	for(var i in deck) {
		deck[i].parent = this.getId();
		this.cards.push(deck[i]);
	}
}

deckConstructor.prototype.Pop = function(count, clearParent) {
		
	if(this.cards.length < count) return false;

	var _deck = [];
	for(;count;count -= 1) {
		var _pop = this.cards.pop();
		if(clearParent) _pop.parent = null;
		// console.log('POP:', _pop)
		_deck.push(_pop);
		_deck[_deck.length - 1].parent = null;
	}
	_deck.reverse();

	// что делать если вынули все карты
	if(this.autoHide && this.cards.length == 0) {
		this.hide();
	}
	
	this.Redraw();

	return _deck;
}

deckConstructor.prototype.Take = function(cardId) {
	return Take.call(this, cardId);// ??? .call(this, attributes);
};

// проверяем, можем ли положить стопку/карту
// возвращает true, если согласно правилам сюда можно положить карту
deckConstructor.prototype.Put = function(putDeck) {
	return Put.call(this, putDeck);//(deckConstructor);
};

// создать карту
deckConstructor.prototype.genCardByName = function(name) {
	return genCardByName.call(this, name);
}

deckConstructor.prototype.hide = function() {
	this.visible = false;
	History.add({hideDeck : this.name});
	this.Redraw();
}

deckConstructor.prototype.show = function() {
	this.visible = false;
	History.add({showDeck : this.name});
	this.Redraw();
}

// deckConstructor.prototype.getCards = function() {
// 	return this.cards;
// }

deckConstructor.prototype.getCardsByName = function(cardName) {
	var _cards = [];
	for(var i in this.cards) {
		if(this.cards[i].name == cardName) {
			_cards.push(this.cards[i]);
		}
	}
	return _cards;
}

deckConstructor.prototype.Card = function(cardName) {
	return this.getCardsByName(cardName)[0];
}

deckConstructor.prototype.hideCards = function() {
	for(var i in this.cards) {
		this.cards[i].visible = false;
		event.dispatch('hideCard', this.cards[i]);
	}
}

deckConstructor.prototype.showCards = function() {
	for(var i in this.cards) {
		this.cards[i].visible = true;
		event.dispatch('showCard', this.cards[i]);
	}
}

// deckConstructor.prototype.parent = function(a) {
// 	if(typeof a == 'string') parent = a;
// 	return parent;
// }

// ------------------------------------------------------------------------------------------------------------------------------------------

var addDeck = function(a) {

	// console.log('addDeck', a);

	if(!a) return false;
	
	var _id = 'deck_' + common.genId();
	
	var _a = Object['assign'] 
		? Object['assign']({}, a) 
		: JSON.parse(JSON.stringify(a));
	
	var _el_deck = new deckConstructor(_a, _id);


	// fill deck
	if(a.fill) {
		for(var i in a.fill) {
			if(typeof a.fill[i] == 'string') {
				_el_deck.genCardByName(a.fill[i]);
			}
		}
	}
	
	var _elements = share.get('elements');

	_elements[_id] = _el_deck;
	
	share.set('elements', _elements);

	return _el_deck;
};

var Deck = function(name, groupName) {
	
	var _decks = common.getElementsByName(name, 'deck');
	if(groupName && typeof groupName == 'string') {
		for(var i in _decks) {
			var _group = common.getElementById(_gecks[i].parent());
			if(_group && _group.name && _group.name == groupName) {
				return _decks[i];
			}
		}
		return false;
	} else {
		return _decks[0];
	}
}

// Get all decks

var getDecks = function(a) {

	// console.log('getDecks', a)

	var _decks = {}
	var _elements = share.get('elements');
	for(var d in _elements) {
		if(_elements[d].type == 'deck') {
			if(a && a.visible) {
				if(_elements[d].visible) {
					_decks[d] = _elements[d];
				}
			} else {
				_decks[d] = _elements[d];
			}
		}
	}
	return _decks;
}

var getDeckById = function(id) {// ID
	
	var _elements = share.get('elements');
	for(var d in _elements) {
		if(_elements[d].type == 'deck' && d == id) {
			return _elements[d];
		}
	}
	return null;
}


var deckCardNames = function(a) {
	
	var _deck = [];
	for(var i in a) {
		if(a[i].card && a[i].card.name) {
			_deck.push(a[i].card.name);
		} else if(a[i].name) {
			_deck.push(a[i].name);
		}
	}
	return _deck;
}

export default {
	addDeck,
	Deck,
	getDecks,
	getDeckById,
	deckCardNames
};
