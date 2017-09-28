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
	 * Decks
	 */

	let decks = [];

	decks.push(
		..._state.decks
	);

	for (let i in _state.groups) {
		decks.push(
			..._state.groups[i].decks
		);
	}

	decks.filter(e => e.visible);

	console.groupCollapsed('allToAll');
	state.tips = allToAll.get(decks);
	console.groupEnd();

	return fromJS(_state);

	// event.dispatch('genNextCards');

	// if (share.get('noTips')) {
	// 	return false;
	// }

	// console.log('check tips');

	// event.dispatch('hideTips');

	// let _decks = Deck.getDecks({
	// 	"visible" : true
	// });

	// console.groupCollapsed('check tips');
	// console.groupEnd();

	if (
		_tips.length == 0                          &&
		share.get('stepType') == defaults.stepType
	) {

		event.dispatch('noTips');

		console.log('No possible moves.');
	}

	_showTips = typeof share.get('showTips') == "undefined"
		? defaults.showTips
		: share.get('showTips');

	if (_showTips) {

		let _homeGroups = Field.homeGroups;

		for (let i in _tips) {

			let draw   = false;
			let toHome = false;

			// TODO инициализировать "hideTipsInDom" в Field.js 
			if (
				// (
				// 	_tips[i].to.count === 0            &&
				// 	Field.tipsParams.hideOnEmpty
				// )                                   ||
				(
					Field.tipsParams.excludeHomeGroups &&
					_homeGroups                        &&
					_homeGroups.length
				)
			) {

				// не выделять подсказки с ходом из "дома"
				if (_homeGroups.indexOf(_tips[i].from.deck.parent) < 0) {
					draw = true;
				}

				if (_homeGroups.indexOf(_tips[i].to.deck.parent) >= 0) {
					toHome = true;
				}
			} else {
				draw = true;
			}

			// Filter
			if (
				draw                                       &&
				share.get('stepType') == defaults.stepType
			) {

				let fromDeck = _tips[i].from.deck;
				let   toDeck = _tips[i].to  .deck;

				let fromCards = fromDeck.getCards();
				let   toCards = toDeck  .getCards();

				let takeCardIndex   = _tips[i].from.deck.getCardIndexById(_tips[i].from.card.id);
				let takeCardsLength = fromCards.length - takeCardIndex;

				let fromParentCard = fromCards.length > 0 && takeCardIndex  > 0 ? fromCards[takeCardIndex  - 1] : EMPTY;
				let   toParentCard =   toCards.length > 0                       ?   toCards[toCards.length - 1] : EMPTY;

				if (
					fromDeck.parent == toDeck.parent &&
					(
						fromParentCard == EMPTY &&
						  toParentCard == EMPTY
					) ||
					(
						fromParentCard                    != EMPTY              &&
						  toParentCard                    != EMPTY              &&
						fromCards[takeCardIndex - 1].flip == false              &&
						fromParentCard.color              == toParentCard.color &&
						fromParentCard.value              == toParentCard.value
						// TODO в идеале надо узнать не появится ли ход если убрать карту
					)
				) {
					draw = false;
				}
			}

			if (draw) {
				event.dispatch('showTip', {
					"type" : toHome ? 'tipToHome' : 'tip',
					"el"   : _tips[i].from.card
				});
			}
		}
	}
};
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