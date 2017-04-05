'use strict';

import defaults  from 'defaults' ;
import common    from 'common'   ;

import Group     from 'group'    ;
import Deck      from 'deck'     ;
import Tips      from 'tips'     ;
import getBeside from 'getBeside';

/*

Internal use:

 * _topCard
 * _bottomCard
 * _besideTopCardRecoursive
 * _besideTopCard
 * _deckRecoursive

Filters:

 * query

Rules:

 * deckLength
 * not
 * topAce
 * topKing
 * bottomAce
 * bottomKing
 * prevDeckTopCardDescStep
 * prevDeckTopCardAscStep
 * nextDeckTopCardDescStep
 * nextDeckTopCardAscStep
 * prevDeckTopCardDesc
 * prevDeckTopCardAsc
 * nextDeckTopCardDesc
 * nextDeckTopCardAsc
 * recoursivePrevDeckTopCardDescStep
 * recoursivePrevDeckTopCardAscStep
 * recoursiveNextDeckTopCardDescStep
 * recoursiveNextDeckTopCardAscStep
 * recoursivePrevDeckTopCardDesc
 * recoursivePrevDeckTopCardAsc
 * recoursiveNextDeckTopCardDesc
 * recoursiveNextDeckTopCardAsc
 * descByOne
 * ascByOne
 * asc
 * desc
 * prevDeckTopCardEquallySuit
 * nextDeckTopCardEquallySuit
 * prevDeckFull
 * nextDeckFull

 */

let fullRules = {

	// Internal use

	"_topCard" : deck => {

		let _card = deck.getTopCard();

		return _card && common.validateCardName(_card.name);
	},

	"_bottomCard" : deck => {

		let _card = deck.getCards()[0];

		return _card && common.validateCardName(_card.name);
	},

	"_besideTopCardRecoursive" : (deck, direction, callback) => {

		let _check  = true;

		let _deck   = deck;
		let _beside = getBeside(_deck)[direction];

		for(;_beside && _check;) {

			let besideDeck = Deck.getDeck(_beside.to);

			_check = _check && callback(
				fullRules._topCard(deck)      ,
				fullRules._topCard(besideDeck)
			);

			_deck   = besideDeck;
			_beside = getBeside(besideDeck)[direction];
		}

		return _check;
	},

	"_besideTopCard" : (deck, direction, callback) => {

		let _beside    = getBeside(deck)[direction];
		let besideDeck = Deck.getDeck(_beside.to);

		return callback(
			fullRules._topCard(deck)      ,
			fullRules._topCard(besideDeck)
		);
	},

	"_deckRecoursive" : (deck, callback) => {

		let _check = true;
		let _cards = deck.getCards();

		let _cardsCount = _cards.length;

		for(let i = _cardsCount; i > 0; i -= 1) {
			_check = _check && callback(
				common.validateCardName(_cards[i]    .name),
				common.validateCardName(_cards[i - 1].name)
			);
		}

		return _check;
	},

	// Filters

	"query" : (deck, data) => {

		// query : {
		// 	groups : ["group1", "group2"],
		// 	select : "first",
		//  decks : ["deck1", "deck2"],
		// 	rules : ["rule1", "rule2"],
		//  anyRules : ["rule1", "rule2"]
		// }

		// TODO

		let _correct = true;

		let queryDecks = [];

		// Groups
		if(data.groups) {
			for(let groupNameIndex in data.groups) {

				let groupName = data.groups[groupNameIndex];

				let _group = Group.getByName(groupName);

				let _decks = _group.getDecks();

				let _select = data.select ? data.select : 'all';

				// 	select: first | second | last | all
				if(_select == "first") {
					// TODO select deck with index 0
					let _deck = _group.getDeckByIndex(1);

					queryDecks.push(_deck);
				} else if(_select == "second") {
					// --/-- index 0
				} else if(_select == "last") {
					// --/-- max index
				} else {
					// all
				}
			}
		}

		// Decks
		if(data.decks) {
			for(let deckNameIndex in data.decks) {

				let deckName = data.decks[deckNameIndex];
				// get deck by name
				let _deck = Deck.getDeck(deckName);

				if(_deck) {
					queryDecks.push(_deck);
				}
			}
		}

		// Rules
		for(let deckIndex in queryDecks) {

			let deck = queryDecks[deckIndex];

			for(let ruleIndex in data.rules) {

				let rule = data.rules[ruleIndex];

				// TODO тут предполагается что все "подправила" будут только строковые
				if(fullRules[rule]) {
					_correct = _correct && fullRules[rule](deck);
				}
			}

			if(data.anyRule) {

				let _anyCorrect = false;

				for(let ruleIndex in data.anyRule) {

					let _rule = data.anyRule[ruleIndex];

					if(fullRules[_rule]) {
						_anyCorrect = _anyCorrect || fullRules[_rule](deck);
					}
				}

				_correct = _correct && _anyCorrect;
			}
		}

		return _correct;
	},

	// Rules

	"deckLength" : deck => defaults.card.ranks.length <= deck.cards.length,

	"not"        : deck => false,

	"topAce"     : deck => {

		let _card = fullRules._topCard(deck);

		return _card && _card.rank == defaults.card.ranks[0];
	},

	"topKing"    : deck => {

		let _card = fullRules._topCard(deck);

		let lastIndex = defaults.card.ranks.length - 1;

		return _card && _card.rank == defaults.card.ranks[lastIndex];
	},

	"bottomAce"   : deck => {

		let _card = fullRules._bottomCard(deck);

		return _card && _card.rank == defaults.card.ranks[0];
	},

	"bottomKing"  : deck => {

		let _card = fullRules._bottomCard(deck);

		let lastIndex = defaults.card.ranks.length - 1;

		return _card && _card.rank == defaults.card.ranks[lastIndex];
	},

	"prevDeckTopCardDescStep" : deck => fullRules._besideTopCard(deck, 'prev', (from, to) => from.value == (to.value | 0) + 1),

	"prevDeckTopCardAscStep"  : deck => fullRules._besideTopCard(deck, 'prev', (from, to) => (from.value | 0) + 1 == to.value),

	"nextDeckTopCardDescStep" : deck => fullRules._besideTopCard(deck, 'next', (from, to) => from.value == (to.value | 0) + 1),

	"nextDeckTopCardAscStep"  : deck => fullRules._besideTopCard(deck, 'next', (from, to) => (from.value | 0) + 1 == to.value),

	"prevDeckTopCardDesc"     : deck => fullRules._besideTopCard(deck, 'prev', (from, to) => from.value > to.value)           ,

	"prevDeckTopCardAsc"      : deck => fullRules._besideTopCard(deck, 'prev', (from, to) => from.value < to.value)           ,

	"nextDeckTopCardDesc"     : deck => fullRules._besideTopCard(deck, 'next', (from, to) => from.value > to.value)           ,

	"nextDeckTopCardAsc"      : deck => fullRules._besideTopCard(deck, 'next', (from, to) => from.value < to.value)           ,

	"recoursivePrevNotEmpty"  : deck => {
		return false; // TODO
	},

	"recoursiveNextNotEmpty"  : deck => {
		return false; // TODO
	},

	"recoursivePrevDeckTopCardDescStep" : deck => fullRules._besideTopCardRecoursive(deck, 'prev', (from, to) => from.value == (to.value | 0) + 1),

	"recoursivePrevDeckTopCardAscStep"  : deck => fullRules._besideTopCardRecoursive(deck, 'prev', (from, to) => (from.value | 0) + 1 == to.value),

	"recoursiveNextDeckTopCardDescStep" : deck => fullRules._besideTopCardRecoursive(deck, 'next', (from, to) => from.value == (to.value | 0) + 1),

	"recoursiveNextDeckTopCardAscStep"  : deck => fullRules._besideTopCardRecoursive(deck, 'next', (from, to) => (from.value | 0) + 1 == to.value),

	"recoursivePrevDeckTopCardDesc"     : deck => fullRules._besideTopCardRecoursive(deck, 'prev', (from, to) => from.value > to.value)           ,

	"recoursivePrevDeckTopCardAsc"      : deck => fullRules._besideTopCardRecoursive(deck, 'prev', (from, to) => from.value < to.value)           ,

	"recoursiveNextDeckTopCardDesc"     : deck => fullRules._besideTopCardRecoursive(deck, 'next', (from, to) => from.value > to.value)           ,

	"recoursiveNextDeckTopCardAsc"      : deck => fullRules._besideTopCardRecoursive(deck, 'next', (from, to) => from.value < to.value)           ,

	"descByStep" : deck => fullRules._deckRecoursive(deck, (up, down) => up.value == (down.value | 0) + 1),

	"ascByStep"  : deck => fullRules._deckRecoursive(deck, (up, down) => (up.value | 0) + 1 == down.value),

	"asc"        : deck => fullRules._deckRecoursive(deck, (up, down) => up.value > down.value)           ,

	"desc"       : deck => fullRules._deckRecoursive(deck, (up, down) => up.value < down.value)           ,

	"prevDeckTopCardEquallySuit" : deck => fullRules._besideTopCard(deck, 'prev', (up, down) => up.suit == down.suit),

	"nextDeckTopCardEquallySuit" : deck => false,

	"prevDeckFull"               : deck => Deck.getDeck(getBeside(deck).prev.to).full,

	"nextDeckFull"               : deck => Deck.getDeck(getBeside(deck).next.to).full
};

export default fullRules;