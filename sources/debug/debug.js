'use strict';

import share         from 'share'        ;
import event         from 'event'        ;
import defaults      from 'defaults'     ;
import common        from 'common'       ;

import field         from 'field'        ;
import deckGenerator from 'deckGenerator';
import elRender      from 'elRender'     ;
import stateManager  from 'stateManager' ;
import history       from 'history'      ;
import mapCommon     from 'mapCommon'    ;

document.addEventListener("DOMContentLoaded", e => {

	// Firebug

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

});

let eachDecksInGroup = (groupName, callback) => {

	let group = common.getElementByName(groupName, 'group');
	let decks = group.getDecks();

	for(let deckIndex in decks) {
		if(typeof callback == "function") {
			callback(decks[deckIndex]); // , data ? (decks[deckIndex].name == data.from ? '>' : decks[deckIndex].name == data.to ? '<' : ' ') : null);
		}
	}
}

let logCardsInDeck = deck => {

	let _log = [deck.name + ': '];

	for(let card of deck.cards) {
		_log[0] += '%c' + card.name + '%c ';
		_log.push(
			card.visible
				? card.flip
					? 'color:blue;text-decoration:underline;'
					: 'color:blue;'
				: card.flip
					? 'color:grey;text-decoration:underline;'
					: 'color:grey;'
		);
		_log.push('text-decoration: none;');
	}


	console.groupCollapsed.apply(console, _log);
	console.log(deck.cards);
	console.groupEnd();
}

let solitaire_log = data => {

	console.groupCollapsed('debug log');

	let groups = common.getElementsByType('group');
	for(let i in groups) {
		console.groupCollapsed('Group:', groups[i].name);
		eachDecksInGroup(groups[i].name, logCardsInDeck);
		console.groupEnd();
	}

	let decks = common.getElementsByType('deck', {
		"parent" : 'field'
	});

	for(let i in decks) {
		// console.log('Deck:', decks[i].name);
		logCardsInDeck(decks[i]);
	}

	console.groupEnd();
}

let keys = {
	"c" : 67, // clear
	"d" : 68, // debug
	"h" : 72, // history
	"n" : 78, // next
	"s" : 83  // stepType
}

document.onkeyup = e => {

	if(e.keyCode == keys.d) {

		solitaire_log();
	} else if(e.keyCode == keys.n) {

		event.dispatch('next_history_step');
	} else if(e.keyCode == keys.c) {

		console.clear();
	} else if(e.keyCode == keys.h) {

		// console.log('History:', history.get(false));
		let _history = history.get(false);
		console.groupCollapsed('debug:history', _history.length);
		console.log('%c' + JSON.stringify(_history, true, 2), 'background: #faede0;');
		console.groupEnd();
	} else if(e.keyCode == keys.s) {

		console.log('stepType:', share.get('stepType'));
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
