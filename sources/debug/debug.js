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
	"d" : 68, // debug
	"n" : 78, // next
}

let kosynka_log = data => {

	console.log('ROLLER DECK:');
	let deck = common.getElementByName('rollerDeck');
	logCardsInDeck(deck);

	console.log('GROUP HOME:');
	eachDecksInGroup('group_home', logCardsInDeck);

	console.log('GROUP ROW:');
	eachDecksInGroup('group_row', logCardsInDeck, data);
}

event.listen('kosynka_log', kosynka_log);

document.onkeyup = e => {

	if(e.keyCode == keys.d) {
		kosynka_log();
	} else if(e.keyCode == keys.n) {
		event.dispatch('next_history_step');
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
