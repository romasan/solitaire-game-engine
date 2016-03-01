'use strict';

import flipTypes      from './flipTypes';
import PutRules       from './readyPutRules';
import readyTakeRules from './readyTakeRules';
import fillRulesExt   from './fillRules';
import Padding        from './paddingTypes';
import addDeckAction  from './addDeckAction';

export default function(main, share, data) {

	var readyPutRules = PutRules      (main, share);
	var fillRules     = fillRulesExt  (main, share);
	var deckActions   = addDeckAction (main, share);
	var paddingTypes  = Padding       (main, share);

	// console.log('readyPutRules:', readyPutRules);

	var addDeck = function(a) {

		// console.log('DECK:', a, share, data);
		
		if(!a) return false;
		var _id = 'deck_' + share.genId();
		var _el_deck = new (function(a) {

			if(!a) return false;
			
			// parameters
			
			this.type = 'deck';
			var id = _id;
			this.getId = function() {
				return id;
			}

			var _parent_el   = main.Group(a.parent),
				_parent_name = _parent_el ? _parent_el.name : 'xname',
				_new_id      = _parent_el ? _parent_el.getDecks().length : id;
			this.name = a.name && typeof a.name == 'string' ? a.name : (_parent_name + '_' + _new_id);

			var parent = a.parent && typeof a.parent == 'string' ? a.parent : 'field';
			this.parent = function(a) {
				if(typeof a == 'string') parent = a;
				return parent;
			}

			var autoHide = a.autoHide && typeof a.autoHide == 'boolean' ? a.autoHide : share.default_autohide;
			
			this.visible = a.visible && typeof a.visible   == 'boolean' ? a.visible : true;// default true
			
			var params = {};
			params.startZIndex = a.startZIndex && typeof a.startZIndex == 'number' ? a.startZIndex : share.start_z_index;
			
			// changed parameters
			this.groupIndex = a.groupIndex && typeof a.groupIndex == 'number' ? a.groupIndex : null;
			
			// DOM
			params.x              = 0; 
			params.y              = 0; 
			params.rotate = this.rotate = 0; 

			params.padding_y      = (    a.paddingY && typeof     a.paddingY == 'number') ?     a.paddingY :      share.default_padding_y;
			params.flip_padding_y = (a.flipPaddingY && typeof a.flipPaddingY == 'number') ? a.flipPaddingY : share.default_flip_padding_y;
			
			params.padding_x      = (    a.paddingX && typeof     a.paddingX == 'number') ?     a.paddingX :      share.default_padding_x;
			params.flip_padding_x = (a.flipPaddingX && typeof a.flipPaddingX == 'number') ? a.flipPaddingX : share.default_flip_padding_x;
			
			// console.log('ADD DECK:', a.paddingX, a.paddingY, share.padding_x, share.padding_y);

			main.event.dispatch('addDeckEl', {
				a     : a, 
				deck  : this,
				params: params
			});

			this.hide = function() {
				this.visible = false;
				oneStepWay.hideDeck = this.name;
				this.Redraw();
				// $(domElement).hide();
			}

			this.show = function() {
				this.visible = false;
				oneStepWay.showDeck = this.name;
				this.Redraw();
				// $(domElement).show();
			}
			
			// ------------- FLIP -------------
			
			// flipTypes.js


			var flipType = a.flip && typeof a.flip == 'string' ? a.flip : share.default_flip_type,
				checkFlip = flipTypes[flipType];
			this.flipCheck = function() {
				for(var i in cards) {
					checkFlip(cards[i], i|0, cards.length);
				}
			}
			
			// --------------------------------
			
			var cards = [];// 1 or N, id : {name: '', rank: '', color: '', flip: null, id: '', paddingType: N} id - dom element id
			
			// создать карту
			this.genCardByName = function(name) {
				// console.log('genCardByName:', name);
				var _name = share.validateCardName(name);// {color, rank}
				var _parent = id;

				if(_name) {

					var _id = 'card_' + share.genId(),
						_card = {
						id      : _id,
						name    : name,
						type    : 'card',
						// domElement : domElement,
						visible : true,
						parent  : _parent,
						flip    : false
					}


					main.event.dispatch('addCardEl', _card);
					
					share.elements[_id] = _card;
					this.Push([_card]);
					
					this.flipCheck();
					
					this.Redraw();

					return _card;
				}
				
				return false;
			}//.bind(this)
			// ------------- PUT -------------

			// можно ли положить карту/стопку
			
			// readyPutRules.js
			// console.log('PUT DEBUG:', a.putRules, share.default_putName, readyPutRules);	
			var putRules = a.putRules 
				? typeof a.putRules == 'function' 
					? a.putRules
					: typeof a.putRules == 'string' 
						? readyPutRules[a.putRules] 
							? readyPutRules[a.putRules]
							: readyPutRules[share.default_putName]
						// : readyPutRules[share.default_putName]
						// : typeof a.putRules === 'object' 
						// : a.putRules.toString() == "[object Object]" 
						: a.putRules.constructor == Array 
							? a.putRules
							: readyPutRules[share.default_putName]
				: readyPutRules[share.default_putName];

			// проверяем, можем ли положить стопку/карту
			// возвращает true, если согласно правилам сюда можно положить карту
			
			// TODO
			// this.Put = function(putDeck) {
			// 	share.Put({deck : this, putDeck : putDeck})
			// }

			this.Put = function(putDeck) {

				var rulesCorrect = true;
				
				var _deckId = putDeck[0].card.parent;
				var _deck_departure = main.getDeckById(_deckId);
				// console.log('Put ------------------------------->', this.name);

				if(typeof putRules == 'function') {
					rulesCorrect = rulesCorrect && putRules({
						from    : {
							deckId : _deckId, 
							deck   : _deck_departure
						}, 
						putDeck : putDeck,
						cards   : cards
					});
				} else {
					// console.log('%cEACH', 'color: blue;font-weight : bold;', putRules);
					for(var ruleName in putRules) {
					
						var _ruleName = (parseInt(ruleName).toString() == ruleName && typeof putRules[ruleName] == 'string') ? putRules[ruleName] : ruleName;

						if(readyPutRules[_ruleName]) {
							// var _c = '#' + (((Math.random() * 15728639)|0) + 1048576).toString(16);
							// console.log('%c  ', 'border-radius : 100%;font-weight: bold;background:' + _c, _deckId, cards, _ruleName);
							rulesCorrect = rulesCorrect && readyPutRules[_ruleName]({
								from      : {
									deckId : _deckId, 
									deck   : _deck_departure
								}, 
								putDeck   : putDeck,
								cards     : cards,
								rulesArgs : putRules[ruleName]
							});
							// console.log('%c  ', 'border-radius : 100%;background:' + _c, 'END');
						} else if(typeof putRules[_ruleName] == 'function') {
							rulesCorrect = rulesCorrect && putRules[_ruleName]({
								from    : {
									deckId : _deckId, 
									deck   : _deck_departure
								}, 
								putDeck : putDeck,
								cards   : cards
							});
						} else {
							console.warn('putRule:', _ruleName, 'not exists');
							rulesCorrect = false;
						}
					}
				}

				return rulesCorrect;
			}
			// ------------- TAKE -------------
			
			// можно ли взять карту/стопку

			var takeRules = a.takeRules 
				? typeof a.takeRules == 'function' 
					? a.takeRules
					: typeof a.takeRules == 'string' 
						? readyTakeRules[a.takeRules] 
							? readyTakeRules[a.takeRules]
							: readyTakeRules[share.default_takeName]
						: readyTakeRules[share.default_takeName]
						// : typeof a.takeRules == 'object' 
						// 	? a.takeRules
						// 	: readyTakeRules[share.default_takeName]
				: readyTakeRules[share.default_takeName];
			// console.log(this.name, a.takeRules);

			this.Take = function(cardId) {

				var rulesCorrect = !share.lock;
				
				if(typeof this.fill == "boolean") {
					rulesCorrect = rulesCorrect && !this.fill;
				}

				// берём карту/стопку
				// console.log('Take', cardId);

				var cardIndex  = -1;
				var cardName   = null; 
				var cardSuit   = null; 
				var cardRank   = null; 
				var deckLength = cards.length;

				// проверяем не является ли перевернутой

				var takeDeck = []

				for(var i in cards) {

					if(cards[i].id == cardId) {
						cardIndex = i|0;
						cardName  = cards[i].name;
						
						var _name = share.validateCardName(cardName);
						
						rulesCorrect = rulesCorrect && _name;
						
						if(_name) {
							cardSuit = _name.suit;
							cardRank  = _name.rank;
						}
						
						rulesCorrect = rulesCorrect && (cards[i].flip == false || cards[i].flip == share.default_can_move_flip);
					}

					if(cardIndex >= 0) {
						takeDeck.push({index : i, card : cards[i]});
					}
				}
				var _attrs = {
					cardId     : cardId, 
					cardName   : cardName, 
					cardSuit   : cardSuit, 
					cardRank   : cardRank, 
					cardIndex  : cardIndex, 
					deckLength : deckLength
				}
				if(typeof takeRules == 'function') {
					rulesCorrect = rulesCorrect && takeRules(_attrs);
					// TODO
					// лучше обрабатывать строку если правило одно и не нужен массив
				// } else if(typeof takeRules == 'string') {
				} else {
					for(var ruleIndex in takeRules) {
						var ruleName = takeRules[ruleIndex];

						if(share.readyTakeRules[ruleName]) {
							rulesCorrect = rulesCorrect && share.readyTakeRules[ruleName](_attrs);
						} else {// if(typeof takeRules[ruleIndex] == 'function') {
							// rulesCorrect = rulesCorrect && takeRules[ruleIndex](_attrs);
							console.log('Incorrect take rule:', ruleName);
							rulesCorrect = false;
						}
					}
				}
				
				// возвращает массив ID карт которые можно будет перетащить
				// записывает их как активные
				
				rulesCorrect = rulesCorrect && (cardIndex >= 0);
				return rulesCorrect && takeDeck;
			}
			// ------------- FILL -------------
			
			this.fill = false;
			var fillRule = (
				a.fillRule 
			 && typeof a.fillRule == "string" 
			 && typeof fillRules[a.fillRule] == "function"
			) ? fillRules[a.fillRule]
			  : fillRules['not'];
			// console.log('Fill rule:', this.name, fillRule);
			main.event.listen('moveDragDeck', function(data) {
				if(data.destination.name != this.deck.name) return;
				// console.log(this.deck.name, data.move.from, data.move.to);
				var _deck = data.destination;// 	main.Deck(data.move.to);
				if(_deck && !this.fill && this.callback({deck : _deck})) {
					this.deck.fill = true;
					share.oneStepWay.fill = {
						deck : this.deck.name
					};
					// main.event.dispatch('fillDeck', {deck : this.deck});
				}
			}.bind({deck : this, callback : fillRule}));
			
			// ------------- PADDING -------------
			
			// порядок карт в колоде
			
			// paddingTypes.js

			var padding = a.paddingType 
				? (typeof a.paddingType == 'string' && paddingTypes[a.paddingType]) 
					? paddingTypes[a.paddingType] 
					: typeof a.paddingType == 'function' 
						? a.paddingType 
						: paddingTypes['none']
				: a.paddingX || a.paddingY 
					? paddingTypes['special'] 
					: paddingTypes[share.default_paddingType];
			
			
			this.padding = function(index) {
				var _padding = padding(params, cards[index], index, cards.length, cards);
				return _padding;
			}
			
			this.hideCards = function() {
				for(var i in cards) {
					cards[i].visible = false;
					main.event.dispatch('hideCard', cards[i]);
				}
			}
			
			this.showCards = function() {
				for(var i in cards) {
					cards[i].visible = true;
					main.event.dispatch('showCard', cards[i]);
				}
			}

			if(a.actions) {
				// TODO сделать красивее
				this.actions = a.actions;
			}

			// ------------- \/\/\/\/\/ -------------

			// Redraw deck
			
			this.Redraw = function(_a) {
				
				main.event.dispatch('redrawDeck', {
					deck   : this,
					a      : _a,
					params : params,
					cards  : cards
				});
				
			}
			this.getCards = function() {
				return cards;
			}

			this.getCardsByName = function(cardName) {
				var _cards = [];
				for(var i in cards) {
					if(cards[i].name == cardName) {
						_cards.push(cards[i]);
					}
				}
				return _cards;
			}

			this.Card = function(cardName) {
				return this.getCardsByName(cardName)[0];
			}
			

			this.Pop = function(count, clearParent) {
				
				if(cards.length < count) return false;

				var _deck = [];
				for(;count;count -= 1) {
					var _pop = cards.pop();
					if(clearParent) _pop.parent = null;
					// console.log('POP:', _pop)
					_deck.push(_pop);
					_deck[_deck.length - 1].parent = null;
				}
				_deck.reverse();

				// что делать если вынули все карты
				if(autoHide && cards.length == 0) {
					this.hide();
				}
				
				this.Redraw();

				return _deck;
			}

			this.Push = function(deck) {// , parentName) {
				for(var i in deck) {
					deck[i].parent = id;
					// console.log('PUSH:', deck[i], id);
					cards.push(deck[i]);
				}
			}
	
			this.clear = function() {
				for(var i in cards) {
					main.event.dispatch('removeEl', cards[i]);
					cards[i] = null;
				}
				cards = [];
				main.event.dispatch('removeEl', this);
			}


			// Fill deck
			// заполняет карты в порядке добавления
			this.Fill = function(cardNames) {
				
				for(var i in cardNames) {
					this.genCardByName(cardNames[i]);
				}
			}

		})(a);

		// fill deck
		if(a.fill) {
			for(var i in a.fill) {
				if(typeof a.fill[i] == 'string') {
					_el_deck.genCardByName(a.fill[i]);
				}
			}
		}

		share.elements[_id] = _el_deck;
		return _el_deck;
	};//.bind(main);



	main.Deck = function(name, groupName) {
		var _decks = this.getElementsByName(name, 'deck');
		if(groupName && typeof groupName == 'string') {
			for(var i in _decks) {
				var _group = this.getElementById(_gecks[i].parent());
				if(_group && _group.name && _group.name == groupName) {
					return _decks[i];
				}
			}
			return false;
		} else {
			return _decks[0];
		}
	}.bind(main);

	// Get all decks

	main.getDecks = function(a) {

		// console.log('getDecks', a)

		var _decks = {}
		for(var d in share.elements) {
			if(share.elements[d].type == 'deck') {
				// console.log(share.elements[d].name, share.elements[d].visible)
				if(a && a.visible) {
					if(share.elements[d].visible) {
						_decks[d] = share.elements[d];
					}
				} else {
					_decks[d] = share.elements[d];
				}
			}
		}
		return _decks;
	}.bind(main);

	main.getDeckById = function(id) {// ID
		for(var d in share.elements) {
			if(share.elements[d].type == 'deck' && d == id) {
				return share.elements[d];
			}
		}
		return null;
	}.bind(main);

	
	share.deckCardNames = function(a) {
		
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

	return addDeck(data);

};