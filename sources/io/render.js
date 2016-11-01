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

import addDeck        from 'addDeck';
import addGroup       from 'addGroup';

// common

event.listen('removeEl', function(e) {

	let _elDomElement = share.get('domElement:' + e.id);

	elRender(_elDomElement)
		.remove();
});

event.listen('showCard', function(target) {
	elRender(target).show();
});

event.listen('hideCard', function(target) {
	elRender(target).hide();
});

event.listen('stopAnimations', function() {
	// TODO
	// elRender.stopAnimations();
});