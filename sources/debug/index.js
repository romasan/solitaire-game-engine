'use strict';

import share         from 'share'        ;
import event         from 'event'        ;
import defaults      from 'defaults'     ;
import common        from 'common'       ;

import field         from 'field'        ;
import deckGenerator from 'deckGenerator';
import elRender      from 'elRender'     ;
import storage       from 'storage'      ;
import stateManager  from 'stateManager' ;
import history       from 'history'      ;
import mapCommon     from 'mapCommon'    ;

import 'debug.scss'                      ;

try {

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

	document.body.onclick = e => {
		try {
			if(e.target.id == "insert_button") {
				getDataFromPanel();
				togglePanel();
			} else if(e.target.tagName == 'LABEL') {
				if(e.target.className.split(' ').indexOf('groupLabel') >= 0) {
					[...document.getElementsByClassName('selectedGroup')].forEach(e => e.className = e.className.split(' ').filter(c => c != 'selectedGroup').join(' '));
					let decks = common.getElementByName(e.target.innerText, 'group').getDecks();
					for(let deckId in decks) {
						let cards = decks[deckId].getCards();
						for(let cardId in cards) {
							document.getElementById(cards[cardId].id).className += ' selectedGroup';
						}
					}
				} else if(e.target.className.split(' ').indexOf('deckLabel') >= 0) {
					[...document.getElementsByClassName('selectedGroup')].forEach(e => e.className = e.className.split(' ').filter(c => c != 'selectedGroup').join(' '));
					let cards = common.getElementByName(e.target.innerText, 'deck').getCards();
					for(let cardId in cards) {
						document.getElementById(cards[cardId].id).className += ' selectedGroup';
					}
				}
			}
		} catch(e) {}
	}

});
} catch(e) {}

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

	let _log = [deck.name + ' (' + deck.cards.length + '): '];

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

let getDataFromPanel = e => {
	let panel = document.getElementById('panel');
	if(panel) {
		[...document.getElementById('panel').children].forEach(
			e => {
				if(e.children.length == 2) {
					if(e.children[1].type == 'text') {
						gameConfig.decks.filter(d => d.name == e.children[0].innerText)[0].fill = e.children[1].value.toLowerCase().split(' ')
					} else {
						gameConfig.groups[e.children[0].innerText].fill = e.children[1].value.split('\n').map(d => d.toLowerCase().split(' '))
					}
				}
			}
		);
		window.SolitaireEngine.init(window.gameConfig);
	}
};

let togglePanel = e => {
	try{
		document.getElementById('panel').remove();
		[...document.getElementsByClassName('selectedGroup')].forEach(e => e.className = e.className.split(' ').filter(c => c != 'selectedGroup').join(' '));
	} catch(e) {
		let el = document.createElement('div');
		el.setAttribute('id', 'panel');
		document.body.appendChild(el);
		el.innerHTML += `
	${(() => {
		let a = [];
		for(let groupName in window.gameConfig.groups) {
			let lines = common.getElementByName(groupName).getDecks().map(e => e.getCards().map(c => c.name).join(' ').toUpperCase());
			a.push(`
				<div>
					<label class="groupLabel">${groupName}</label>
					<textarea rows="${lines.length}" id="line_${groupName}">${lines.join('\n')}</textarea>
				</div>
			`);
		}
		return a.join('');
	})()}
	${(() => {
		let a = [];
		for(let i in window.gameConfig.decks) {
			let deckName = window.gameConfig.decks[i].name;
			let line = common.getElementByName(deckName).getCards().map(c => c.name).join(' ').toUpperCase();
			a.push(`
				<div>
					<label class="deckLabel">${deckName}</label>
					<input id="line_${deckName}" value="${line}"/>
				</div>
			`);
		}
		return a.join('');
	})()}
	<div>
		<button id="insert_button">NEW GAME</button>
	</div>`;
	}
};

let keys = {
	"c" : 67, // clear
	"d" : 68, // debug
	"h" : 72, // history
	"n" : 78, // next
	"p" : 80, // show panel
	"s" : 83  // stepType
}
try {
document.onkeyup = e => {

	if(e.keyCode == keys.d) {

		solitaire_log();
	} else if(e.keyCode == keys.n) {

		event.dispatch('next_history_step');
	} else if(e.keyCode == keys.c) {

		console.clear();
		window._debug = window._debug ? false : true;
		console.log('_debug', window._debug ? 'ON' : 'OFF');
	} else if(e.keyCode == keys.h) {

		// console.log('History:', history.get(false));
		let _history = history.get(false);
		console.groupCollapsed('debug:history', _history.length);
		console.log('%c' + JSON.stringify(_history, true, 2), 'background: #faede0;');
		console.groupEnd();
	} else if(e.keyCode == keys.s) {

		console.log('stepType:', share.get('stepType'));
	} else if(e.keyCode == keys.p) {
		togglePanel();
	}

	// console.log('keyUp:', e);
}
} catch(e) {}

export default {
	share        ,
	defaults     ,
	common       ,
	field        ,
	deckGenerator,
	elRender     ,
	storage      ,
	stateManager ,
	history      ,
	mapCommon    ,
	deckGenerator,
	validateCardName : common.validateCardName
};
