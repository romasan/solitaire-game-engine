'use strict';

import share         from 'share'        ;
import event         from 'event'        ;
import defaults      from 'defaults'     ;
import common        from 'common'       ;

import field         from 'field'        ;
import deck          from 'deck'         ;
import deckGenerator from 'deckGenerator';
import elRender      from 'elRender'     ;
import stateManager  from 'stateManager' ;
import history       from 'history'      ;
import mapCommon     from 'mapCommon'    ;

/*
let stamp = e => {
	let summaryAnimationsCallbacksCouns = 0;
	return {
		"stepType" : share.get('stepType'),
		"decks"    : (e => {

			e = deck.getDecks();
			let decks = [];

			for(let i in e) {
				decks.push({
					"name"  : e[i].name,
					"cards" : e[i].cards.map(c => {
						return {
							"name" : c.name,
							"el"   : (z => {
								let el = share.get('domElement:' + c.id);
								summaryAnimationsCallbacksCouns += el._animationCallbacks.length;
								return {
									_animationCallbacksLength : el._animationCallbacks.length
								}
							})()
						}
					})
				});
			}

			return decks;
		})(),
		summaryAnimationsCallbacksCouns : summaryAnimationsCallbacksCouns,
		history : history.get().length
	}
}
*/

// Firebug
document.addEventListener("DOMContentLoaded", e => {

	if(document.location.hash == '#debug') {
		(function(F, i, r, e, b, u, g, L, I, T, E) {
			if(F.getElementById(b)) { return; }
			E = F[i + 'NS'] && F.documentElement.namespaceURI;
			E = E
				? F[i + 'NS'](E, 'script')
				: F[i]('script');
			E[r]('id', b);
			E[r]('src', I + g + T);
			E[r](b, u);
			(F[e]('head')[0] || F[e]('body')[0]).appendChild(E);
			E = new Image;
			E[r]('src', I + L);
		})(
			document,
			'createElement'                          ,
			'setAttribute'                           ,
			'getElementsByTagName'                   ,
			'FirebugLite'                            ,
			'4'                                      ,
			'firebug-lite.js'                        ,
			'releases/lite/latest/skin/xp/sprite.png',
			'https://getfirebug.com/'                ,
			'#startOpened'
		);
	}

	// document.body.addEventListener('transitionend', e => {
	// 	console.log('TEST:', e);
	// });

	// let f = e => {
	// 	el.style.transition = (500 / 1000) + 's';
	// 	el.style.left = ((Math.random() * 1000) | 0) + 'px';
	// 	el.style.top  = ((Math.random() * 1000) | 0) + 'px';
	// 	let f2 = e => {
	// 		el.style.transition = null;
	// 		console.log('done');
	// 		removeEventListener('transitionend', f2)
	// 	};
	// 	el.addEventListener('transitionend', f2, false);
	// }

});

let eachDecksInGroup = (groupName, callback, data) => {

	let group = common.getElementByName(groupName, 'group');
	let decks = group.getDecks();

	for(let deckIndex in decks) {
		if(typeof callback == "function") {
			callback(decks[deckIndex], data ? (decks[deckIndex].name == data.from ? '>' : decks[deckIndex].name == data.to ? '<' : ' ') : null);
		}
	}
}

let logCardsInDeck = (deck, pref) => {

	let _log = [pref ? pref + ' ' : ''];

	for(let card of deck.cards) {
		_log[0] += '%c' + card.name + ' ';
		_log.push(
			card.visible
				? card.flip
					? 'color:blue;text-decoration:underline;'
					: 'color:blue;'
				: card.flip
					? 'color:grey;text-decoration:underline;'
					: 'color:grey;'
		)
	}

	console.log.apply(console, _log);
}

event.listen('logCardsInDeck', logCardsInDeck);

let keys = {
	"c" : 67, // clear
	"d" : 68, // debug
	"h" : 72, // history
	"n" : 78, // next
}

let solitaire_log = data => {

	let groups = common.getElementsByType('group');
	for(let i in groups) {
		console.log('Group:', groups[i].name);
		eachDecksInGroup(groups[i].name, logCardsInDeck);
	}

	// console.log('GROUP HOME:');
	// eachDecksInGroup('group_home', logCardsInDeck);

	let decks = common.getElementsByType('deck', {
		"parent" : 'field'
	});

	for(let i in decks) {
		console.log('Deck:', decks[i].name);
		logCardsInDeck(decks[i]);
	}

	// console.log('ROLLER DECK:');
	// let deck = common.getElementByName('rollerDeck');
	// logCardsInDeck(deck);
}

event.listen('solitaire_log', solitaire_log);

document.onkeyup = e => {

	if(e.keyCode == keys.d) {
		solitaire_log();
	} else if(e.keyCode == keys.n) {
		event.dispatch('next_history_step');
	} else if(e.keyCode == keys.c) {
		console.clear();
	} else if(e.keyCode == keys.h) {
		console.log('History:', JSON.stringify(history.get(false), true, 2));
	}
}

export default {
	share        ,
	defaults     ,
	common       ,
	field        ,
	deckGenerator,
	elRender     ,
	stateManager ,
	history      ,
	mapCommon
};
