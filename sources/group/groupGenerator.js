/*
 * генерация стопок в группах
 */

'use strict';

import   countGenerator from 'countGenerator'  ;
import     fanGenerator from 'fanGenerator'    ;
import     mapGenerator from 'mapGenerator'    ;
import    lineGenerator from 'lineGenerator'   ;
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
