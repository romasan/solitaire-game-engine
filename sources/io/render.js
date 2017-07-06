'use strict';

import event from 'event'                  ;
import share from 'share'                  ;

import elRender from 'elRender'            ;

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

event.listen('removeEl', data => {

	let _elDomElement = share.get('domElement:' + data.id);

	try {
		_elDomElement.remove();

		share.delete('domElement:' + data.id);
	} catch(e) {
		console.warn('Dom element for', data.id, 'not found');
	}
});

let triggerMouseEvent = (node, eventName) => {

    let mouseEvent = document.createEvent('MouseEvents');

    mouseEvent.initEvent(eventName, true, true);

    node.dispatchEvent(mouseEvent);
};

event.listen('clickCard', card => {

	let _elDomElement = share.get('domElement:' + card.id);

	triggerMouseEvent(_elDomElement.el, 'mousedown');
})

event.listen('showCard', target => {
	elRender(target).show();
});

event.listen('hideCard', target => {
	elRender(target).hide();
});
