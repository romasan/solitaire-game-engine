'use strict';

import share    from 'share';
import event    from 'event';
import defaults from 'defaults';

import Field    from 'field';
import elRender from 'elRender';

event.listen('initField', function(e) {

	// console.log('initField');
	
	var domElement = e.a.field ? e.a.field : '#mat';// default;
	if(typeof domElement == 'string') {
		if(domElement.split('.').length == 2) {
			domElement = document.getElementsByClassName(domElement.split('.')[1])[0];
		} else if(domElement.split('#').length == 2) {
			domElement = document.getElementById(domElement.split('#')[1]);
		} else {
			domElement = document.getElementsByTagName(domElement);
		}
		if(!domElement) {
			domElement = document.getElementById('mat')
		}
	};
	// share.field = e.field;
	var _field = Field();
	_field.domElement = domElement;

	var _params = {};

	if(e.a.width  && typeof e.a.width  == 'number') { _params.width  = share.get('zoom') * e.a.width  + 'px'; }
	if(e.a.height && typeof e.a.height == 'number') { _params.height = share.get('zoom') * e.a.height + 'px'; }
	if(e.a.top    && typeof e.a.top    == 'number') { _params.top    = share.get('zoom') * e.a.top    + 'px'; }
	if(e.a.left   && typeof e.a.left   == 'number') { _params.left   = share.get('zoom') * e.a.left   + 'px'; }
	// if(a.rotate && typeof a.rotate == 'number') _params.transform = 'rotate(' + (a.rotate|0) + 'deg)';
	
	var themeName = 
		typeof e.a.theme == 'string' 
			? e.a.theme 
			: typeof e.a.theme == 'object' && e.a.theme.name
				? e.a.theme.name
				: defaults.theme.name;

	elRender(domElement)
		.css(_params)
		.addClass('field')
		.addClass(themeName);
});