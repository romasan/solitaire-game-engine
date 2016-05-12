'use strict';

import event from 'event';

import _el   from 'elRender';

event.listen('showTip', function(e) {

	// console.log('showTip', e);
	
	if(e && e.el && e.el.domElement && e.type) {
		_el(e.el.domElement)
			.addClass(e.type);
	}
});

event.listen('hideTips', function(e) {
	
	// console.log('hideTips', e);
	
	if(e && e.types) {
		for(var i in e.types) {
			var typeName = e.types[i];
			_el('.' + typeName)
				.removeClass(typeName);
		}
	} else {
		
		for(var i in Tips.tipTypes) {
			var typeName = Tips.tipTypes[i];
			_el('.' + typeName)
				.removeClass(typeName, 777);
		}

	}
});