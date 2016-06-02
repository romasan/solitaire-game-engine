'use strict';

class storage {

	// TODO настройки сохраняются для всех игр,
	// возможно нужно будет для каждой отдельно,
	// тогда в конфигурацию нужно будет включить gameId

	constructor() {

		if(!localStorage.hasOwnProperty('SolitaireEngine')) {
			localStorage.SolitaireEngine = "{}";
		}
	}

	set(key, data) {
		// console.log('set', key);

		let _ls = JSON.parse(localStorage.SolitaireEngine);
		// Object['assign'](_ls, data);
		_ls[key] = data;
		localStorage.SolitaireEngine = JSON.stringify(_ls);
	}
	
	get(key) {

		let _ls = JSON.parse(localStorage.SolitaireEngine);
		return _ls[key];
	}
	
	clear() {
		localStorage.SolitaireEngine = "{}";
	}
}

export default new storage();