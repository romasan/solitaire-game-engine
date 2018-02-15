'use strict';

import common, {share, event, defaults} from '../../common';

import Field                            from '../../field' ;
import {elRender}                       from '../dom'      ;

/**
 * addCardEl - Listener
 */
event.listen('addCardEl', data => {

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	let _params = {
		"width"  : defaults.card.width  + 'px',
		"height" : defaults.card.height + 'px'
	};

	let _domElement = elRender('<div>');

	elRender(_domElement)
		.addClass('el card draggable ' + data.name)
		.css(_params)
		.attr({
			"id" : data.id
			// "title" : data.id
		});

	share.set('domElement:' + data.id, _domElement);

	let _fieldDomElement = share.get('domElement:field');

	if (_fieldDomElement) {
		elRender(_fieldDomElement)
			.append(_domElement);
	}
});

/**
 * toggleMarkCard - Listener
 */
event.listen('toggleMarkCard', data => {

	let el = share.get('domElement:' + data.card.id);

	if (
		el                   &&
		!el.hasClass('flip')
	) {

		let cardIsMarked = null;

		if (el.hasClass('marker')) {

			cardIsMarked = false;

			el.removeClass('marker');
		} else {

			cardIsMarked = true;

			el.addClass('marker');
		}

		if (typeof data.callback == "function") {
			data.callback(cardIsMarked);
		}
	}
});

/**
 * markCard - Listener
 */
event.listen('markCard', data => {

	let el = share.get('domElement:' + data.card.id);

	if (el) {
		el.addClass('marker');
	}
});

/**
 * unmarkCard - Listener
 */
event.listen('unmarkCard', data => {

	let el = share.get('domElement:' + data.card.id);

	if (
		el //                  &&
		// !el.hasClass('flip')
	) {
		el.removeClass('marker');
	}
});

/**
 * unflipCard - Listener
 */
event.listen('unflipCard', card => {

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	let el = share.get('domElement:' + card.id);

	if (
		el                  &&
		el.hasClass('flip')
	) {
		el.removeClass('flip');
	} 
});

/**
 * removeCardElements - Listener
 */
event.listen('removeCardElements', e => {

	let item = null;

	while(item = document.getElementsByClassName('card')[0]) {
		item.remove();
	}
})

// let specialStepMark = null;

// event.listen('moveOnCard', card => {

// 	if (card) {

// 		if (
// 			share.get('specialStepMode') &&
// 			!data.flip
// 		) {

// 			let el = share.get('domElement:' + data.id);

// 			if (specialStepMark == data.id)

// 			el.addClass('specialStepMark');
// 		}
// 	} else {
// 		if (specialStepMark) {
// 			// unmarkCard
// 			specialStepMark = null;
// 		}
// 	}

// });

// event.listen('redrawCardFlip', card => {

// 	let el = share.get('domElement:' + card.id);

// 	if (card.flip) {
// 		el.addClass('flip');
// 	} else {
// 		el.removeClass('flip');
// 	}
// });
