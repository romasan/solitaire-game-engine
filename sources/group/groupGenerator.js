'use strict';

/**
 * генерация стопок в группах
 */

import countGenerator from './generators/countGenerator';
import   fanGenerator from './generators/fanGenerator'  ;
import   mapGenerator from './generators/mapGenerator'  ;
import  lineGenerator from './generators/lineGenerator' ;
// import rhombusGenerator from 'rhombusGenerator';
// import   roundGenerator from 'roundGenerator'  ;

export default {
	"count" : countGenerator,
	"fan"   :   fanGenerator,
	"map"   :   mapGenerator,
	"line"  :  lineGenerator
	// "rhombus" : rhombusGenerator,
	// "round"   :   roundGenerator
};
