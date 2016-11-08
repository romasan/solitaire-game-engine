'use strict';

import event from 'event';
import share from 'share';

import elRender from 'elRender';

import initField      from 'initField';
import drawDeck       from 'drawDeck';
import drawCard       from 'drawCard';
import drawTip        from 'drawTip';
import moveDragDeck   from 'moveDragDeck';
import moveCardToHome from 'moveCardToHome';
import fieldThemesSet from 'fieldThemesSet';

// common

event.listen('removeEl', (e) => {

	let _elDomElement = share.get('domElement:' + e.id);

	elRender(_elDomElement)
		.remove();
});

event.listen('showCard', (target) => {
	elRender(target).show();
});

event.listen('hideCard', (target) => {
	elRender(target).hide();
});

event.listen('stopAnimations', () => {
	// TODO
	// elRender.stopAnimations();
});