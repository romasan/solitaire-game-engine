'use strict';

import event from 'event';

event.listen('specialStep', data => {
	console.log('specialStep:', data); 
});