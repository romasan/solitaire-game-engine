'use strict';

/**
 * React drag'n'drop
 * https://github.com/mzabriskie/react-draggable
 * https://github.com/mikefey/react-draggable
 * https://github.com/mgechev/react-drag
 * React animate
 * https://facebook.github.io/react/docs/animation.html
 * https://github.com/chenglou/react-motion
 * https://github.com/react-tools/react-move
 * https://github.com/reactjs/react-transition-group
 */

import event          from '../common/event'              ;
import share          from '../common/share'              ;
import common         from '../common'                    ;

// event.listen('render:on', e => {
// 	share.set('nodraw', false);
// });

// event.listen('render:off', e => {
// 	share.set('nodraw', true);
// });

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

	if (deck) {

		event.dispatch('click:flipCard', {
			"to"     : deck, // deckClass
			"toCard" : card  // card
		});
	}
})

// event.listen('showCard', target => {
// 	elRender(target).show();
// });

// event.listen('hideCard', target => {
// 	elRender(target).hide();
// });
