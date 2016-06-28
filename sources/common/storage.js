'use strict';

class storage {

	// TODO настройки сохраняются для всех игр,
	// возможно нужно будет для каждой отдельно,
	// тогда в конфигурацию нужно будет включить gameId

	constructor() {
		
		try {
			if(!localStorage.hasOwnProperty('SolitaireEngine')) {
				localStorage.SolitaireEngine = "{}";
			}
		} catch(e) {}
	}

	set(key, data) {

		try {
			let _ls = JSON.parse(localStorage.SolitaireEngine);
			_ls[key] = data;
			localStorage.SolitaireEngine = JSON.stringify(_ls);
		} catch(e) {}
	}
	
	get(key) {

		try {
			let _ls = JSON.parse(localStorage.SolitaireEngine);
			return _ls[key];
		} catch(e) {
			return null;
		}
	}
	
	clear() {
		
		try {
			localStorage.SolitaireEngine = "{}";
		} catch(e) {}
	}
}

export default new storage();