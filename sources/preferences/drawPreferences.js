'use strict';

import {defaults, share} from '../common';


export default e => {

	let _locale = null;
		_locale = _locale || share.get('locale');
		_locale = _locale || defaults.locale;

	let _html = {
		"ru" : require('html!./preferncesTemplate.ru.html'),
		"en" : require('html!./preferncesTemplate.en.html')
	};

	try {

		let el = document.getElementById('gpCommit');

		let div = document.createElement('div');
		div.innerHTML = _html[_locale];

		el.parentNode.insertBefore(div, el);
	} catch (e) {}
};
