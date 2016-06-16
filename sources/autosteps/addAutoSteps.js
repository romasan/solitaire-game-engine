'use strict';

import fallAutoStep from 'fallAutoStep';

const autosteps = {
	fallAutoStep
};

export default (autoSteps)=>{
	
	for(let autoStepName in autoSteps) {
		if(autosteps[autoStepName]) {
			new autosteps[autoStepName](autoSteps[autoStepName]);
		}
	};
};