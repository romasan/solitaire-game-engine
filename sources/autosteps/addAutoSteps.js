'use strict';

import fallAutoStep from 'fallAutoStep';

const autosteps = {
	fallAutoStep
};

export default (autoSteps)=>{
	
	let _autosteps = {};

	for(let autoStepName in autoSteps) {
		if(autosteps[autoStepName]) {
			let _autostep = new autosteps[autoStepName](autoSteps[autoStepName]);
			_autosteps[_autostep.stepType] = _autostep;
		}
	};

	return _autosteps;
};