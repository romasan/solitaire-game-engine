'use strict';

import share       from 'share';
import event       from 'event';
import defaults    from 'defaults';
import common      from 'common';

import getDecks    from 'getDecks';
import getDeckById from 'getDeckById';

let cardAttributes = [
	'parent' ,
	'visible',
	'flip'
];

/*
 * backup
 * restore
 * get
 */

class stateManager {
	
	constructor() {
		
		this._state = null;

		this._sourceList = [
			'stepType'
		];

		this._clearList = [
			'animatedCallback'     ,
			'animatedElements'     ,
			'animatedElementsStack',
			'curLockState'         ,
			'sessionStarted'       ,
			'startCursor'          ,
			'lastCursorMove'
		];
	}

	backup() {

		this._state = {};

		for(let i in this._sourceList) {

			let _element = share.get(this._sourceList[i]);
			
			this._state[this._sourceList[i]] = ['string', 'number', 'boolean'].indexOf(typeof _element) >= 0
				? _element
				: _element instanceof Array
					? Object.assign([], _element)
					: Object.assign({}, _element);
		}

		this._state.model = {};

		let _decks = getDecks();

		for(let deckId in _decks) {

			let _cards = [];

			for(let cardId in _decks[deckId].cards) {

				let _card = {
					'name'    : _decks[deckId].cards[cardId].name,
					'id'      : _decks[deckId].cards[cardId].id
				};

				for(let i in cardAttributes) {
					let _name = cardAttributes[i];
					_card[_name] = _decks[deckId].cards[cardId][_name];
				}

				_cards.push(_card);
			}

			this._state.model[deckId] = {
				'name'  : _decks[deckId].name  ,
				'cards' : _cards               ,
				'group' : _decks[deckId].parent
			}
		}
	}

	restore() {

		if(!this._state) {

			console.warn('Restore fail. Store is empty.');

			return;
		}

		// restore share
		for(let i in this._clearList) {
			share.delete(this._clearList[i]);
		}

		for(let i in this._sourceList) {
			share.set(this._sourceList[i], this._state[this._sourceList[i]], true);
		}

		for(let deckId in this._state.model) {
			
			let _deck = getDeckById(deckId);

			let _cards = [];

			for(let cardIndex in this._state.model[deckId].cards) {

				let cardId = this._state.model[deckId].cards[cardIndex].id;

				let _card = common.getElementById(cardId);

				if(_card.name == this._state.model[deckId].cards[cardIndex].name) {

					for(let attrIndex in cardAttributes) {
						let attrName = cardAttributes[attrIndex];
							_card[attrName] = this._state.model[deckId].cards[cardIndex][attrName];
					}
					
					_cards.push(_card);
				} else {
					// console.warn(
					// 	'Что-то не так с картой'               ,
					// 	this._state.model[deckId].cards[i].id  ,
					// 	this._state.model[deckId].cards[i].name,
					// 	' != '                                 ,
					// 	_card.id                               ,
					// 	_card.name
					// );
				}
			}

			_deck.cards = _cards;
			_deck.Redraw();
		}
	}

	get() {
		return this._state;
	}
}

export default new stateManager();