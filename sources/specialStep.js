'use strict';

import event from 'event';

event.listen('specialStep', data => {

	console.log('specialStep:', data); 

	event.dispatch('specialStepHandler', history => {
		console.log('specialStepHandler:', history);
	});
});