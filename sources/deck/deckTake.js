'use strict';

import share     from 'share'    ;
import defaults  from 'defaults' ;

import takeRules from 'takeRules';

export default (deck, cardId) => {

	// Нестандартный ход (autosteps)
	// if(share.get('stepType') != defaults.stepType) {return false;};

	let rulesCorrect = true; // !common.isLock();

	rulesCorrect = rulesCorrect && !deck.locked;

	// смотрим не заполнена ли колода
	if(typeof deck.full == 'boolean') {
		rulesCorrect = rulesCorrect && !deck.full;
	}

	// берём карту/стопку

	let cardIndex  = -1;
	let cardName   = null; 
	let cardSuit   = null; 
	let cardRank   = null; 
	let deckLength = deck.cardsCount();

	// проверяем не является ли перевернутой

	let takeDeck = [];

	let cards = deck.getCards();
	for(let i in cards) {

		if(cards[i].id == cardId) {

			let _card = cards[i];
			cardIndex = i | 0;
			cardName  = _card.name;

			if(_card) {
				cardSuit = _card.suit;
				cardRank = _card.rank;
			}

			rulesCorrect = rulesCorrect && (
				!_card.flip                         &&
				 _card.flip == defaults.canMoveFlip
			);
		}

		if(cardIndex >= 0) {

			takeDeck.push({
				"index" : i       ,
				"card"  : cards[i]
			});
		}
	}

	let _attrs = {
		"cardId"     : cardId    , 
		"cardName"   : cardName  , 
		"cardSuit"   : cardSuit  , 
		"cardRank"   : cardRank  , 
		"cardIndex"  : cardIndex , 
		"deckLength" : deckLength
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
