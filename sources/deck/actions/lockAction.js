'use strict';

import event    from 'event';
import share    from 'share';
import defaults from 'defaults';
import common   from 'common';

import lockActionCommon from 'lockActionCommon';

export default function(data) {

	if(data.eventData.to.name != this.name) {
		return false;
	}

	lockActionCommon(data.actionData, 'lock', this.name);
};