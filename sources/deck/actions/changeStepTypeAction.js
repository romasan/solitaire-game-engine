'use strict';

import event     from 'event';
import share     from 'share';
import defaults  from 'defaults';
import common    from 'common';

export default function(data) {

	if(data.eventData.to.name != this.name) {
		return false;
	}

	if(typeof data.actionData.to != "string") {
		return;
	} else {
		share.set('stepType', data.actionData.to);
	}

};