'use strict';

import event    from 'event'   ;
import share    from 'share'   ;

import elRender from 'elRender';
import Tips     from 'tips'    ;

event.listen('showTip', data => {

	if(data && data.el && data.type) {// data && data.el && data.el.domElement && data.type

		let _elDomElement = share.get('domElement:' + data.el.id);

		elRender(_elDomElement)
			.addClass(data.type);
	}
});

event.listen('hideTips', data => {

	if(data && data.types) {

		for(let i in data.types) {
			
			let typeName = data.types[i];
			
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