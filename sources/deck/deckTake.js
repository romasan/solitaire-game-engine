'use strict';

import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import takeRules from 'readyTakeRules';

export default function(cardId) {

	// Нестандартный ход (autosteps)
	// if(share.get('stepType') != defaults.stepType) {return false;};

	var rulesCorrect = true;//!common.isLock();

	rulesCorrect = rulesCorrect && !this.locked;
	
	if(typeof this.fill == "boolean") {
		rulesCorrect = rulesCorrect && !this.fill;
	}

	// берём карту/стопку

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
				!this.cards[i].flip                        &&
				this.cards[i].flip == defaults.canMoveFlip
			);
		}

		if(cardIndex >= 0) {
			
			takeDeck.push({
				index : i,
				card  : this.cards[i]
			});
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

	for(var ruleIndex in this.takeRules) {
		var ruleName = this.takeRules[ruleIndex];
		
		if(takeRules[ruleName]) {
			rulesCorrect = rulesCorrect && takeRules[ruleName](_attrs);
		} else {
			console.warn('Incorrect take rule:', ruleName);
			rulesCorrect = false;
		}
	}
	
	// возвращает массив ID карт которые можно будет перетащить
	// записывает их как активные
	
	rulesCorrect = rulesCorrect && (cardIndex >= 0);
	
	rulesCorrect = rulesCorrect && takeDeck;

	return rulesCorrect;
};
