'use strict';

import defaults  from 'defaults';
import common    from 'common';

import Group     from 'group';
import Deck      from 'deck';
import Tips      from 'tips';
import getBeside from 'getBeside';

let fullRules = {

	// Internal use

	_prev_next_desc_ask : (deck, type, callback) => {

		let _check = true;
		let _prev = getBeside(a.to)[type];
		let _topCard = deck.getTopCard();

		for(;_prev && _check;) {

			let _deck = Deck.getDeck(_prev);
			    _card = _deck.getTopCard();

			_check = _check && _card && callback(
				common.validateCardName(_topCard).value | 0,
				common.validateCardName(_card)   .value | 0
			);

			_topCard = _card;
			_prev = getBeside(_deck)[type];
		}

		return _check;
	},

	// Filters

	query : (deck, data) => {

		console.log('%c_query:', 'font-weight: bold; color: red;', deck, data);

		// query : {
		// 	all : {
		// 		groups : ["matGroup1", "matGroup2", "matGroup3", "matGroup4"],
		// 		excludeParent : true,
		// 		select : "first",
		// 	},
		// 	rules : ["topAce"]
		// }

		// TODO

		let groupName = deck.parent;
		let currentGroup = Group.getByName(groupName);

		let _correct = true;

		let _decks = [];
		
		if(!data.excludeCurrent) {
			_decks.push(deck);
		}
		
		// all | any
		if(data.all) {

			// Groups
			for(let i in data.all.groups) {

				let _group = Group.getByName(data.all.groups[i])

				if(
					data.all.excludeParent          &&
					data.all.groups[i] == groupName
				) {
					//  do nothing
				} else {

					// 	select: first | second | last | all
					if(data.all.select == "first") {
						// TODO select deck with index 0
						let _deck = _group.getDeckByIndex(0);

						_decks.push(_deck);
					} else if(data.all.select == "second") {
						// --/-- index 0
					} else if(data.all.select == "last") {
						// --/-- max index
					} else {
						// all
					}

				}
			}

			// Decks
			for(let i in data.all.decks) {

				// get decks by name
				let _deck = Deck.getDeck(data.all.decks[i]);

				if(_deck) {
					_decks.push(_deck);
				}
			}

			// Rules
			for(let deckIndex in _decks) {

				for(let ruleIndex in data.rules) {

					let _rule = data.rules[ruleIndex]

					if(fullRules[_rule]) {

						console.log('fullRule >>>', _rule, 'deck:', _decks[deckIndex].name, deckIndex);

						_correct = _correct && fullRules[_rule](_decks[deckIndex]);
					}
				}

				let _anyCorrect = false;

				for(let ruleIndex in data.anyRule) {

					let _rule = data.anyRule[ruleIndex]

					if(fullRules[_rule]) {
						_anyCorrect = _anyCorrect || fullRules[_rule](_decks[deckIndex]);
					}
				}

				_correct = _correct && _anyCorrect;
			}
		}

		return _correct;
	},

	// Rules

	deckLength : deck => defaults.card.ranks.length <= deck.cards.length,

	not : e => false,

	noMoves : deck => !Tips.checkFrom(deck.name),

	topAce : deck => {

		let _card = deck.getTopCard();

		return _card && _card.rank == defaults.card.ranks[0];
	},

	topKing : deck => {

		let lastIndex = defaults.card.ranks.length - 1;

		let _card = deck.getTopCard();

		return _card && _card.rank == defaults.card.ranks[lastIndex];
	},

	prevDescOne : deck => fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => up == (down | 0) + 1),

	prevAscOne  : deck => fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => (up | 0) + 1 == down),

	nextDescOne : deck => fullRules._prev_next_desc_ask(deck, 'next', (up, down) => up == (down | 0) + 1),

	nextAscOne  : deck => fullRules._prev_next_desc_ask(deck, 'next', (up, down) => (up | 0) + 1 == down),

	prevDesc    : deck => fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => up > down)           ,

	prevAsc     : deck => fullRules._prev_next_desc_ask(deck, 'prev', (up, down) => up < down)           ,

	nextDesc    : deck => fullRules._prev_next_desc_ask(deck, 'next', (up, down) => up > down)           ,

	nextAsc     : deck => fullRules._prev_next_desc_ask(deck, 'next', (up, down) => up < down)           ,
};

export default fullRules;