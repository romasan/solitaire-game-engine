/*
 * генерация стопок в группах
 */

'use strict';

import countGenerator from "countGenerator";
import fanGenerator   from "fanGenerator"  ;
import mapGenerator   from "mapGenerator"  ;
import lineGenerator  from "lineGenerator" ;

export default {
	"count" : countGenerator,
	"fan"   : fanGenerator,
	"map"   : mapGenerator,
	"line"  : lineGenerator
};