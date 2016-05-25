'use strict';

import event from 'event';

import elRender from 'elRender';

import initField      from 'initField';
import drawDeck       from 'drawDeck';
import drawCard       from 'drawCard';
import drawTip        from 'drawTip';
import moveDragDeck   from 'moveDragDeck';
import moveCardToHome from 'moveCardToHome';

event.listen('removeEl', function(e) {
	elRender(e.domElement)
		.remove();
});

event.listen('showCard', function(target) {
	elRender(target).show();
});

event.listen('hideCard', function(target) {
	elRender(target).hide();
});

event.listen('stopAnimations', function() {
	elRender.stopAnimations();
});
