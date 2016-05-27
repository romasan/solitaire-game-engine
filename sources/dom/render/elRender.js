'use strict';

import allElementsClass from 'allElementsClass';

let allElements = (e)=>{

	return new allElementsClass(e);
};

allElements.stopAnimations = (callback)=>{

	new allElementsClass(".animated").removeClass("animated").css({transition : null});
};

export default allElements;