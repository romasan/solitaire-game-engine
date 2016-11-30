'use strict';

import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import takeRules from 'readyTakeRules';

export default (deck, cardId) => {

	// Нестандартный ход (autosteps)
	// if(share.get('stepType') != defaults.stepType) {return false;};

	let rulesCorrect = true;//!common.isLock();

	rulesCorrect = rulesCorrect && !deck.locked;
	
	if(typeof deck.full == "boolean") {
		rulesCorrect = rulesCorrect && !deck.full;
	}

	// берём карту/стопку

	let cardIndex  = -1;
	let cardName   = null; 
	let cardSuit   = null; 
	let cardRank   = null; 
	let deckLength = deck.cards.length;

	// проверяем не является ли перевернутой

	let takeDeck = []

	for(let i in deck.cards) {

		if(deck.cards[i].id == cardId) {
			
			cardIndex = i|0;
			cardName  = deck.cards[i].name;
			
			let _name = common.validateCardName(cardName);
			
			rulesCorrect = rulesCorrect && _name;

			
			if(_name) {
				cardSuit = _name.suit;
				cardRank = _name.rank;
			}
			
			rulesCorrect = rulesCorrect && (
				!deck.cards[i].flip                        &&
				deck.cards[i].flip == defaults.canMoveFlip
			);
		}

		if(cardIndex >= 0) {
			
			takeDeck.push({
				index : i,
				card  : deck.cards[i]
			});
		}
	}
	
	let _attrs = {
		cardId     : cardId, 
		cardName   : cardName, 
		cardSuit   : cardSuit, 
		cardRank   : cardRank, 
		cardIndex  : cardIndex, 
		deckLength : deckLength
	}

	for(let ruleIndex in deck.takeRules) {
		
		let ruleName = deck.takeRules[ruleIndex];
		
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
