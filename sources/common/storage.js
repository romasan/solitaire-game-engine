'use strict';

class storage {

	// TODO настройки сохраняются для всех игр,
	// возможно нужно будет для каждой отдельно,
	// тогда в конфигурацию нужно будет включить gameId

	/**
	 * Create storage
	 */
	constructor() {

		try {
			if (!localStorage.hasOwnProperty('SolitaireEngine')) {
				localStorage.SolitaireEngine = "{}";
			}
		} catch (e) {}
	}

	/**
	 * Add value in to storage
	 * @param {string} key 
	 * @param {*} data 
	 */
	set(key, data) {

		try {

			let _ls = JSON.parse(localStorage.SolitaireEngine);

			_ls[key] = data;

			let _data = JSON.stringify(_ls);

			localStorage.SolitaireEngine = _data;
		} catch (e) {}
	}

	/**
	 * Get value from storage
	 * @param {string} key 
	 */
	get(key) {

		try {

			let _ls = JSON.parse(localStorage.SolitaireEngine);

			return _ls[key];
		} catch (e) {
			return null;
		}
	}

	/**
	 * Clear storage
	 */
	clear() {

		try {
			localStorage.SolitaireEngine = "{}";
		} catch (e) {}
	}
}

export default new storage();