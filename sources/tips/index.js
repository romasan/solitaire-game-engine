'use strict';

import event          from '../common/event'       ;
import share          from '../common/share'       ;
import defaults       from '../common/defaults'    ;

import allToAll       from './allToAll'            ;
import bestTip        from './bestTip'             ;
import Deck           from '../deck'               ;
import Field          from '../field'              ;
import autoMoveToHome from '../move/autoMoveToHome';

import {fromJS} from 'immutable';

const EMPTY = "EMPTY";

let tipTypes = [
	'tip'        ,
	'tipTo'      ,
	'tipPriority',
	'tipToHome'
];

/**
 * Check tips
 * @param {*} state
 */
let checkTips = state => {

	let _state = state.toJS();

	/**
	 * All decks
	 */

	let decks = [];

	// Decks from Field
	decks.push(
		..._state.decks
	);

	// Decks from groups
	for (let i in _state.groups) {
		decks.push(
			..._state.groups[i].decks
		);
	}

	// Only visible decks
	decks.filter(e => e.visible);

	// All possible moves
	_state.tips = allToAll.get(decks, state);

	// Highlight cards
	for (let deckIndex in decks) {

		const deck = decks[deckIndex];

		for (let cardIndex in deck.cards) {

			const card = deck.cards[cardIndex];

			card.tip = _state.showTips ? ((dID, cID) => {

				for (let i in _state.tips) {

					const tip = _state.tips[i];

					if (
						//  tip.from.deck == dID &&
						tip.from.card == cID
					) {

						// Исключить ходы из "Дом-а"
						if (
							// (
							// 	_tips[i].to.count === 0            &&
							// 	Field.tipsParams.hideOnEmpty
							// )                                   ||
							// (
							// не выделять подсказки с ходом из "дома"
							state.tipsParams.excludeHomeGroups         &&
							state.homeGroups                           &&
							state.homeGroups.length                    &&
							state.homeGroups.indexOf(deck.parent) >= 0
							// )
						) {
							return false;
						}

						// Исключить равнозначные ходы внутри одной группы
						// Например:
						// С пустого слота на другой пустой слот
						// С равнозначных предыдущих в стопке карт на такие же
						if (
							state.stepType == defaults.stepType
						) {

							let fromDeck = deck;
							let   toDeck = decks.filter(e => e.id == tip.to.deck)[0];

							let fromCards = fromDeck.cards.filter(e => e.visible);
							let   toCards = toDeck  .cards.filter(e => e.visible);

							let takeCardIndex = fromDeck.cards
								.map((e, i) => ({i, e}))
								.filter(e => e.id == _tips[i].from.card.id)[0].i;

								let takeCardsLength = fromCards.length - takeCardIndex;

							let fromParentCard = fromCards.length > 0 && takeCardIndex > 0
								? fromCards[takeCardIndex - 1]
								: EMPTY;

							let toParentCard = toCards.length > 0                     
								? toCards[toCards.length - 1]
								: EMPTY;

							if (
								fromDeck.parent == toDeck.parent &&
								(
									fromParentCard == EMPTY &&
									  toParentCard == EMPTY
								) ||
								(
									fromParentCard       != EMPTY              &&
									  toParentCard       != EMPTY              &&
									fromParentCard.flip  == false              &&
									// TODO сделать относительно takeRules и putRules
									fromParentCard.color == toParentCard.color &&
									fromParentCard.value == toParentCard.value
									// TODO в идеале надо узнать не появится ли ход если убрать карту
								)
							) {
								return false;
							}
						}

						return true;
					}
				}

				return false;
			})(deck.id, card.id) : false;
		}
	}

	return fromJS(_state);
}
// event.listen('makeStep' , checkTips);
// event.listen('checkTips', checkTips);

// лучший ход на в текущем положении перетаскиваемой стопки
/**
 * Tips for move
 * @param {*} data 
 */
let tipsMove = data => {

	if (!share.get('showTipPriority')) {
		return;
	}

	event.dispatch('hideTips', {
		"types" : ['tipPriority']
	});

	if (
		share.showTipPriority                          &&
		data                                           &&
		data.moveDeck                                  &&
		data.cursorMove                                &&
		data.cursorMove.distance                       &&
		data.cursorMove.distance >= share.moveDistance
	) {

		let Tip = bestTip(data.moveDeck, data.cursorMove);

		if (Tip) {

			event.dispatch('showTip', {
				"el"   : Tip.to.deck  ,
				"type" : 'tipPriority'
			});
		}
	}
};

// tips destination decks
/**
 * Tips for destination deck
 * @param {*} data 
 */
let tipsDestination = data => {

	if (share.get('showTipsDestination')) {

		event.dispatch('hideTips');

		if (data && data.currentCard && data.currentCard.id) {
			for (let i in _tips) {
				if (_tips[i].from.card.id == data.currentCard.id) {					

					event.dispatch('showTip', {
						"el"   : _tips[i].to.deck, 
						"type" : 'tipTo'
					});
				}
			}
		}
	}
};

// has tips with from
/**
 * Has tips for moves to departure deck
 * @param {*} from 
 */
let checkFrom = from => {

	for (let i in _tips) {
		if (
			_tips[i].from.deck.name == from
		) {
			return true;
		}
	}

	return false;
};

// has tips with from and to
/**
 * Has tips for moves from departure deck to destination deck
 * @param {*} from 
 * @param {*} to 
 */
let fromTo = (from, to) => {

	for (let i in _tips) {
		if (
			_tips[i].from.deck.name == from &&
			_tips[i].to  .deck.name == to
		) {
			return true;
		}
	}

	return false;
};

export default {
	"tipTypes"        : tipTypes       ,
	"checkTips"       : checkTips      ,
	"tipsMove"        : tipsMove       ,
	"checkFrom"       : checkFrom      ,
	"fromTo"          : fromTo         ,
	"tipsDestination" : tipsDestination
};