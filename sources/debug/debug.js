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
let _css = {
	"position"    : 'absolute'         ,
	"top"         : '0px'              ,
	"width"       : '100px'            ,
	"height"      : '20px'             ,
	"border"      : '1px solid #c0c0c0',
	"background"  : 'white'            ,
	"color"       : 'white'            ,
	"text-shadow" : 'black 1px 1px 0px,' +
	' black -1px 1px 0px, black -1px -1px 0px, black 1px -1px 0px'
};
$(document).ready(e => {
	$(document.body)
		.append(
			$('<div>').css(_css).css({ "right" : '20px' }).attr({ "id" : 'flag_1' })
				.css({ "height" : '0px' }).animate({ "height" : '20px' }, 'fast')
		)
		.append(
			$('<div>').css(_css).css({ "right" : '122px' }).attr({ "id" : 'flag_2' })
				.css({ "height" : '0px' }).animate({ "height" : '20px' }, 'fast')
		)
		.append(
			$('<div>').css(_css).css({ "right" : '224px' }).attr({ "id" : 'flag_3' })
				.css({ "height" : '0px' }).animate({ "height" : '20px' }, 'fast')
		);
});

event.listen('debugFlag', e => {
	$('#flag_' + e.flag).css({ "background" : e.color }).html(e.text);
});
*/
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

export default {
	share        ,
	defaults     ,
	common       ,
	field        ,
	deckGenerator,
	elRender     ,
	stateManager ,
	history      ,
	mapCommon    ,
	stamp
};
