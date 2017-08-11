'use strict';

import event          from 'event'         ;
import share          from 'share'         ;
import common         from 'common'        ;

import elRender       from 'elRender'      ;
import inputs         from 'inputs'        ;

import initField      from 'initField'     ;
import drawDeck       from 'drawDeck'      ;
import drawCard       from 'drawCard'      ;
import drawTip        from 'drawTip'       ;
import moveDragDeck   from 'moveDragDeck'  ;
import moveCardBack   from 'moveCardBack'  ;
import fieldThemesSet from 'fieldThemesSet';

// styles DOM
import 'common.scss'                       ;
import 'default_theme.scss'                ;
import 'alternative_theme.scss'            ;
import 'environment.css'                   ;

share.set('nodraw', false);

event.listen('render:on', e => {
	share.set('nodraw', false);
});

event.listen('render:off', e => {
	share.set('nodraw', true);
});

event.listen('removeEl', data => {

	if(share.get('nodraw')) {

		if(data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	let _elDomElement = share.get('domElement:' + data.id);

	// try {
	if(_elDomElement) {

		_elDomElement.remove();

		share.delete('domElement:' + data.id);
	} else {
	// } catch(e) {
		// console.warn('Dom element for', data.id, 'not found');
	}
});

let triggerMouseEvent = (node, eventName) => {

    let mouseEvent = document.createEvent('MouseEvents');

    mouseEvent.initEvent(eventName, true, true);

    node.dispatchEvent(mouseEvent);
};

event.listen('clickCard', card => {

	// let _elDomElement = share.get('domElement:' + card.id);

	// console.log('clickCard', card.name);

	// triggerMouseEvent(_elDomElement.el, 'mousedown');

	let deck = common.getElementById(card.parent);

	if(deck) {

		event.dispatch('click:flipCard', {
			"to"     : deck, // deckClass
			"toCard" : card  // card
		});
	}
})

event.listen('showCard', target => {
	elRender(target).show();
});

event.listen('hideCard', target => {
	elRender(target).hide();
});
