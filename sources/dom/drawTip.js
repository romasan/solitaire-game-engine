'use strict';

import event    from 'event';

import elRender from 'elRender';
import Tips     from 'tips';

event.listen('showTip', function(e) {

	// console.log('showTip', e);
	
	if(e && e.el && e.el.domElement && e.type) {
		elRender(e.el.domElement)
			.addClass(e.type);
	}
});

event.listen('hideTips', function(e) {
	
	// console.log('hideTips', e);
	
	if(e && e.types) {
		for(var i in e.types) {
			var typeName = e.types[i];
			elRender('.' + typeName)
				.removeClass(typeName);
		}
	} else {
		
		for(var i in Tips.tipTypes) {
			var typeName = Tips.tipTypes[i];
			elRender('.' + typeName)
				.removeClass(typeName, 777);
		}

	}
});