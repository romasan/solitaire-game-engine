'use strict';

import share    from 'share'   ;
import event    from 'event'   ;
import defaults from 'defaults';

import Field    from 'field'   ;
import elRender from 'elRender';

event.listen('initField', data => {

	let domElement = data.field ? data.field : '#map';

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

	let _params = {};

	if(data.width  && typeof data.width  == 'number') { _params.width  = data.width  + 'px'; }
	if(data.height && typeof data.height == 'number') { _params.height = data.height + 'px'; }
	if(data.top    && typeof data.top    == 'number') { _params.top    = data.top    + 'px'; }
	if(data.left   && typeof data.left   == 'number') { _params.left   = data.left   + 'px'; }

	let _zoom = share.get('zoom');
	if(_zoom != defaults.zoom || _zoom != 1) {
		_params.transform = 'scale(' + _zoom + ')';
		_params['transform-origin'] = '0 0';
	}

	elRender(domElement)
		.css(_params)
		.addClass('solitaireField')

	share.set('domElement:field', domElement);
});