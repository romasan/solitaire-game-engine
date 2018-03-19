'use strict';

/**
 * Правила взятия карт из стопки
 */
let takeRules = {
				
	// SimpleRules
	/**
	 * Нельзя брать карты
	 */
	"not"      : data => false                                ,

	/**
	 * Нельзя брать первую в стопке (последнюю оставшуюся) карту
	 */
	"notFirst" : data => data.cardIndex > 0                   ,
	
	/**
	 * @alias notFirst
	 */
	"notfirst" : data => takeRules.notFirst(data)             ,

	/**
	 * Можно брать любую карту или последовательность
	 */
	"any"      : data => true                                 ,

	/**
	 * Можно брать только верхнюю карту
	 */
	"onlyTop"  : data => data.cardIndex == data.deckLength - 1,
	
	/**
	 * @alias onlyTop
	 */
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