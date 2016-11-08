'use strict';

import event    from 'event';
import share    from 'share';

import elRender from 'elRender';
import Tips     from 'tips';

event.listen('showTip', (e) => {

	if(e && e.el && e.type) {// e && e.el && e.el.domElement && e.type

		let _elDomElement = share.get('domElement:' + e.el.id);

		elRender(_elDomElement)
			.addClass(e.type);
	}
});

event.listen('hideTips', (e) => {

	if(e && e.types) {

		for(let i in e.types) {
			
			let typeName = e.types[i];
			
			elRender('.' + typeName)
				.removeClass(typeName);
		}
	} else {

		for(let i in Tips.tipTypes) {
			
			let typeName = Tips.tipTypes[i];
			
			elRender('.' + typeName)
				.removeClass(typeName);
		}
	}
});