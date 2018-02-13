'use strict';

import common, {event, share} from '../common';

import {elRender}             from './dom'    ;

import './inputs'                             ;
import './renderEvents'                       ;
import '../styles'                            ;

/**
 * Set default noredraw value
 */
share.set('nodraw', false);

/**
 * Render on - Listener
 */
event.listen('render:on', e => {
	share.set('nodraw', false);
});

/**
 * Render off - Listener
 */
event.listen('render:off', e => {
	share.set('nodraw', true);
});

/**
 * removeEl - Listener
 */
event.listen('removeEl', data => {

	let _elDomElement = share.get('domElement:' + data.id);

	if (_elDomElement) {

		_elDomElement.remove();

		share.delete('domElement:' + data.id);
	}
});


/**
 * triggerMouseEvent
 * @param {*} node 
 * @param {string} eventName 
 */
let triggerMouseEvent = (node, eventName) => {

    let mouseEvent = document.createEvent('MouseEvents');

    mouseEvent.initEvent(eventName, true, true);

    node.dispatchEvent(mouseEvent);
};

/**
 * clickCard - Listener
 */
event.listen('clickCard', card => {

	let deck = common.getElementById(card.parent);

	if (deck) {

		event.dispatch('click:flipCard', {
			"to"     : deck, // deckClass
			"toCard" : card  // card
		});
	}
});

/**
 * showCard - Listener
 */
event.listen('showCard', target => {
	elRender(target)
		.show();
});

/**
 * hideCard - Listener
 */
event.listen('hideCard', target => {
	elRender(target)
		.hide();
});

/**
 * checkAnimations - Listener
 */
event.listen('checkAnimations', callback => {
	callback( document.getElementsByClassName('animated').length > 0 );
});
