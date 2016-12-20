'use strict';

import fallAutoStep from 'fallAutoStep';

const autosteps = {
	fallAutoStep
};

export default autoStepsParams => {
	
	let _autosteps = {};

	for(let autoStepName in autoStepsParams) {
		
		if(autosteps[autoStepName]) {
			
			let _autostep = new autosteps[autoStepName](autoStepsParams[autoStepName]);
			_autostep.init(autoStepName);
			
			_autosteps[autoStepName] = _autostep;
		} else {
			console.warn(`Autostep '${autoStepName}' is not exist.`);
		}
	}

	return _autosteps;
};