'use strict';

/*

Rules:

 * not
 * notFirst | notfirst
 * any
 * onlyTop | onlytop
 
 */

let takeRules = {
				
	// SimpleRules
	"not"      : data => false                                ,

	"notFirst" : data => data.cardIndex > 0                   ,
	"notfirst" : data => takeRules.notFirst(data)             ,

	"any"      : data => true                                 ,

	"onlyTop"  : data => data.cardIndex == data.deckLength - 1,
	"onlytop"  : data => takeRules.onlyTop(data)
	
	// TODO rules
	
	// ask : function(data) {
	// 	return true;
	// },

	// desc : function(data) {
	// 	return true;
	// }
};

export default takeRules;