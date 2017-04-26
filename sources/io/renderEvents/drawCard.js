'use strict';

import share    from 'share'   ;
import event    from 'event'   ;
import defaults from 'defaults';
import common   from 'common'  ;

import Field    from 'field'   ;
import elRender from 'elRender';

/*
 * addCardEl
 * toggleMarkCard
 * markCard
 * unmarkCard
 * unflipCard
 */

event.listen('addCardEl', data => {

	let _params = {
		"width"  : defaults.card.width  + 'px',
		"height" : defaults.card.height + 'px'
	};

	let _domElement = elRender('<div>');

	elRender(_domElement)
		.addClass('el card draggable ' + data.name)
		.css(_params)
		.attr({
			"id" : data.id,
			"title" : data.id
		});

	share.set('domElement:' + data.id, _domElement);

	let _fieldDomElement = share.get('domElement:field');

	elRender(_fieldDomElement)
		.append(_domElement);
});

event.listen('toggleMarkCard', data => {

	let el = share.get('domElement:' + data.card.id);

	if(
		el                   &&
		!el.hasClass('flip')
	) {

		let cardIsMarked = null;

		if(el.hasClass('marker')) {

			cardIsMarked = false;

			el.removeClass('marker');
		} else {

			cardIsMarked = true;

			el.addClass('marker');
		}

		if(typeof data.callback == "function") {
			data.callback(cardIsMarked);
		}
	}
});

event.listen('markCard', data => {

	let el = share.get('domElement:' + data.card.id);

	if(el) {
		el.removeClass('marker');
	}
});

event.listen('unmarkCard', data => {

	let el = share.get('domElement:' + data.card.id);

	if(
		el                   &&
		!el.hasClass('flip')
	) {
		el.removeClass('marker');
	}
});

event.listen('unflipCard', card => {

	let el = share.get('domElement:' + card.id);

	if(
		el                   &&
		el.hasClass('flip')
	) {
		el.removeClass('flip');
	} 
});

// event.listen('redrawCardFlip', card => {

// 	let el = share.get('domElement:' + card.id);

// 	if(card.flip) {
// 		el.addClass('flip');
// 	} else {
// 		el.removeClass('flip');
// 	}
// });
