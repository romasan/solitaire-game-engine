'use strict';

import {event, share} from '../../common';

import {elRender}     from '../dom'      ;
import Tips           from '../../tips'  ;

/**
 * showTip - Listener
 */
event.listen('showTip', data => {

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	if (data && data.el && data.type) { // data && data.el && data.el.domElement && data.type

		let _elDomElement = share.get('domElement:' + data.el.id);

		elRender(_elDomElement)
			.addClass(data.type);
	}
});

/**
 * hideTips - Listener
 */
event.listen('hideTips', data => {

	if (share.get('nodraw')) {

		if (data && typeof data.callback == "function") {
			data.callback();
		}

		return;
	}

	if (data && data.types) {

		for (let i in data.types) {
			
			let typeName = data.types[i];
			
			elRender('.' + typeName)
				.removeClass(typeName);
		}
	} else {

		for (let i in Tips.tipTypes) {

			let typeName = Tips.tipTypes[i];

			elRender('.' + typeName)
				.removeClass(typeName);
		}
	}
});