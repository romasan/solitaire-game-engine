'use strict';

import share    from 'share';
import defaults from 'defaults';
import common   from 'SolitaireCommon';

import takeRules from 'readyTakeRules';

export default function(cardId) {

	var rulesCorrect = true;//!common.isLock();

	rulesCorrect = rulesCorrect && !this.locked;
	
	if(typeof this.fill == "boolean") {
		rulesCorrect = rulesCorrect && !this.fill;
	}

	// берём карту/стопку
	// console.log('Take', cardId);

	var cardIndex  = -1;
	var cardName   = null; 
	var cardSuit   = null; 
	var cardRank   = null; 
	var deckLength = this.cards.length;

	// проверяем не является ли перевернутой

	var takeDeck = []

	for(var i in this.cards) {

		if(this.cards[i].id == cardId) {
			cardIndex = i|0;
			cardName  = this.cards[i].name;
			
			var _name = common.validateCardName(cardName);
			
			rulesCorrect = rulesCorrect && _name;

			
			if(_name) {
				cardSuit = _name.suit;
				cardRank = _name.rank;
			}
			
			rulesCorrect = rulesCorrect && (
				!this.cards[i].flip
			 || this.cards[i].flip == defaults.canMoveFlip
			);
		}

		if(cardIndex >= 0) {
			takeDeck.push({index : i, card : this.cards[i]});
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
	// if(typeof takeRules == 'function') {
		// rulesCorrect = rulesCorrect && takeRules(_attrs);
		// TODO
		// лучше обрабатывать строку если правило одно и не нужен массив
	// } else if(typeof takeRules == 'string') {
	// } else {
	for(var ruleIndex in this.takeRules) {
		var ruleName = this.takeRules[ruleIndex];

		// console.log(this.takeRules);
		
		if(takeRules[ruleName]) {
			rulesCorrect = rulesCorrect && takeRules[ruleName](_attrs);
		} else {// if(typeof takeRules[ruleIndex] == 'function') {
			// rulesCorrect = rulesCorrect && takeRules[ruleIndex](_attrs);
			console.log('Incorrect take rule:', ruleName);
			rulesCorrect = false;
		}
	}
	// }
	
	// возвращает массив ID карт которые можно будет перетащить
	// записывает их как активные
	
	rulesCorrect = rulesCorrect && (cardIndex >= 0);

	return rulesCorrect && takeDeck;
};