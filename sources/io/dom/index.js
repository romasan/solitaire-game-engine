'use strict';

const existAnimatedElementsNow = () => document.getElementsByClassName('animated').length > 0;

export {existAnimatedElementsNow};

export { default as allElClass } from './allElClass';
export { default as elClass    } from './elClass'   ;
export { default as elRender   } from './elRender'  ;