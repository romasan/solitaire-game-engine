'use strict';

import fallAutoStep from 'fallAutoStep';
// import A         from 'A';
// import B         from 'B';
// import C         from 'C';

const autosteps = {
	fallAutoStep,
//  A,
//  B,
//  C
};

export default (autoStepsParams)=>{
	
	let _autosteps = {};

	for(let autoStepName in autoStepsParams) {
		if(autosteps[autoStepName]) {
			let _autostep = new autosteps[autoStepName](autoStepsParams[autoStepName]);
			_autosteps[autoStepName] = _autostep;
		} else {
			console.warn(`Autostep '${autoStepName}' is not exist.`);
		}
	}

	return _autosteps;
};