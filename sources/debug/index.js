'use strict';

import common        from '../common'                    ;
import share         from '../common/share'              ;
import event         from '../common/event'              ;
import defaults      from '../common/defaults'           ;

import field         from '../field'                     ;
import deckGenerator from '../deck/deckGenerator'        ;
import elRender      from '../io/dom/elRender'           ;
import _storage      from '../common/storage'            ;
import stateManager  from '../common/stateManager'       ;
import history       from '../history'                   ;
import mapCommon     from '../group/generators/mapCommon';

import './debug.scss'                                    ;

let solitaireField = null;

let triggerMouseEvent = (node, eventName, x, y) => {
	try {
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent(eventName, true, true, window, 0, 0, 0, (x | 0), (y | 0), false, false, false, false, 0, null);
		node.dispatchEvent(evt);

		// let _el = document.createElement('div');
		// _el.style.background = eventName == 'click' ? 'red' : eventName == 'mousemove' ? 'blue' : 'yellow';
		// _el.style.position   = 'absolute';
		// _el.style.width      = (eventName == 'mouseup' ? '3' : '2') + 'px';
		// _el.style.height     = '2px';
		// _el.style.left       = ((x | 0) - 1) + 'px';
		// _el.style.top        = ((y | 0) - 1) + 'px';
		// _el.style['z-index'] = '999';
		// _el.className        = 'dot';
		// document.body.appendChild(_el);
	} catch(e) {}
};

let storage = [];
let record = false;

let startTime = Date.now();

let _zip = a => a.map(e =>
	(e.time).toString(25) + '.' +
	(['click', 'mousemove', 'mouseup', 'mousedown'].indexOf(e.name)) +
	(e.clientX).toString(25) + 'z' + 
	(e.clientY).toString(25)
).join(' ');

let _unzip = a => a.split(' ').map(e => ({
	"time" : parseInt(e.slice(0, e.indexOf('.')), 25),
	"name" : ['click', 'mousemove', 'mouseup', 'mousedown'][e.slice(e.indexOf('.') + 1)[0] | 0],
	"clientX" : parseInt(e.slice(e.indexOf('.') + 2, e.indexOf('z')), 25),
	"clientY" : parseInt(e.slice(e.indexOf('z') + 1), 25)
}));

let start = e => {
	startTime = Date.now();
	record = true;
};

let stop = e => {
	record = false;
	console.log('storage:', storage);
};

let play = i => {

	if(typeof i == "undefined") {
		i = 0;
	}

	document.getElementById('play_record_button').innerHTML = ((i / (storage.length / 100)) | 0) + '%';

	if(i >= storage.length) {
		document.getElementById('play_record_button').classList.remove("blue_button");
		document.getElementById('play_record_button').innerHTML = 'PLAY';
		return;
	}

	setTimeout(e => {

		if(!solitaireField) {
			solitaireField = document.getElementsByClassName('solitaireField')[0];
		}

		let field = solitaireField.getBoundingClientRect();
		let x = (storage[i].clientX | 0) + (field.left | 0),
		    y = (storage[i].clientY | 0) + (field.top | 0);
		let el = document.elementFromPoint(x, y);
		triggerMouseEvent(el, storage[i].name, x, y);

		i += 1;
		play(i);
	}, storage[i].time);
};

let export_record = e => {
	prompt("export", JSON.stringify({
		"storage" : _zip(storage)
	}));
};

let import_record = e => {
	storage = _unzip(JSON.parse(prompt("import")).storage);
};

try {
	document.addEventListener("DOMContentLoaded", e => {

		solitaireField = document.getElementsByClassName('solitaireField')[0];

		let drag = false;

		let mouseEvents = [
			{"event": 'mousedown', "setDrag" : true     },
			{"event": 'mouseup'  , "setDrag" : false    },
			{"event": 'click'                           },
			{"event": 'mousemove', "exitOnNoDrag" : true}
		];

		for (let i in mouseEvents) {

			let mouseEvent = mouseEvents[i];

			document.body.addEventListener(mouseEvent.event, data => {

				if (!record) {
					return;
				}

				if (mouseEvent.exitOnNoDrag && !drag) {
					return;
				}

				if (typeof mouseEvent.setDrag == "boolean") {
					drag = mouseEvent.setDrag;
				}

				let time = Date.now();

				if (!solitaireField) {
					solitaireField = document.getElementsByClassName('solitaireField')[0];
				}

				let field = solitaireField.getBoundingClientRect();

				storage.push({
					time : time - startTime,
					name : mouseEvent.event,
					clientX : (data.clientX - field.left | 0),
					clientY : (data.clientY - field.top  | 0)
				});

				startTime = time;
			})
		}

		// Firebug

		if (document.location.hash == '#debug') {
			(function(F, i, r, e, b, u, g, L, I, T, E) {
				if (F.getElementById(b)) { return; }
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

		document.body.onclick = e => {
			try {
				if(e.target.id == "insert_button") {
					getDataFromPanel();
					togglePanel();
				} else if (e.target.tagName == 'LABEL') {
					if (e.target.className.split(' ').indexOf('groupLabel') >= 0) {
						[...document.getElementsByClassName('selectedGroup')].forEach(e => e.className = e.className.split(' ').filter(c => c != 'selectedGroup').join(' '));
						let decks = common.getElementByName(e.target.innerText, 'group').getDecks();
						for (let deckId in decks) {
							let cards = decks[deckId].getCards();
							for (let cardId in cards) {
								document.getElementById(cards[cardId].id).className += ' selectedGroup';
							}
						}
					} else if (e.target.className.split(' ').indexOf('deckLabel') >= 0) {
						[...document.getElementsByClassName('selectedGroup')].forEach(e => e.className = e.className.split(' ').filter(c => c != 'selectedGroup').join(' '));
						let cards = common.getElementByName(e.target.innerText, 'deck').getCards();
						for (let cardId in cards) {
							document.getElementById(cards[cardId].id).className += ' selectedGroup';
						}
					}
				} else if (e.target.id == 'start_record_button') {
					if (record) {
						document.getElementById('start_record_button').classList.remove("red_button");
						storage.pop();
						storage.pop();
						storage.pop();
						storage.pop();
						stop();
					} else {
						document.getElementById('start_record_button').classList.add("red_button");
						storage = [];
						start();
					}
				} else if (e.target.id == 'stop_record_button') {
					document.getElementById('start_record_button').classList.remove("red_button");
					stop();
				} else if (e.target.id == 'play_record_button') {
					document.getElementById('start_record_button').classList.remove("red_button");
					document.getElementById('play_record_button').classList.add("blue_button");
					stop();
					play();
				} else if (e.target.id == 'export_record_button') {
					export_record();
				} else if (e.target.id == 'import_record_button') {
					import_record();
				} 
			} catch(e) {}
		}
	});
} catch(e) {}

let eachDecksInGroup = (groupName, callback) => {

	let group = common.getElementByName(groupName, 'group');
	let decks = group.getDecks();

	for (let deckIndex in decks) {
		if (typeof callback == "function") {
			callback(decks[deckIndex]); // , data ? (decks[deckIndex].name == data.from ? '>' : decks[deckIndex].name == data.to ? '<' : ' ') : null);
		}
	}
};

let logCardsInDeck = deck => {

	let _log = [deck.name + ' (' + deck.cards.length + '): '];

	for (let card of deck.cards) {
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
};

let solitaire_log = data => {

	console.groupCollapsed('debug log');

	let groups = common.getElementsByType('group');
	for (let i in groups) {
		console.groupCollapsed('Group:', groups[i].name);
		eachDecksInGroup(groups[i].name, logCardsInDeck);
		console.groupEnd();
	}

	let decks = common.getElementsByType('deck', {
		"parent" : 'field'
	});

	for (let i in decks) {
		// console.log('Deck:', decks[i].name);
		logCardsInDeck(decks[i]);
	}

	console.groupEnd();
};
event.listen('solitaire_log', solitaire_log);

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

let toggleRecordPanel = e => {
	try{
		document.getElementById('record_panel').remove();
		[...document.getElementsByClassName('selectedGroup')].forEach(e => e.className = e.className.split(' ').filter(c => c != 'selectedGroup').join(' '));
	} catch(e) {
		let el = document.createElement('div');
		el.setAttribute('id', 'record_panel');
		document.body.appendChild(el);
		el.innerHTML += `
			<button id="start_record_button">REC</button>
			<!---<button id="stop_record_button">STOP</button>--->
			<button id="play_record_button">PLAY</button>
			<button id="export_record_button">EXPORT</button>
			<button id="import_record_button">IMPORT</button>
		`;
	}
};

let togglePanel = e => {
	try{
		document.getElementById('panel').remove();
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
	"r" : 82, // record
	"s" : 83  // stepType
};

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
		} else if(e.keyCode == keys.r) {
			toggleRecordPanel();
		}
	}
} catch(e) {}

export default {
	share        ,
	defaults     ,
	common       ,
	field        ,
	deckGenerator,
	elRender     ,
	storage : _storage,
	stateManager ,
	history      ,
	mapCommon    ,
	deckGenerator
};
