'use strict';

import event    from 'event'   ;
import share    from 'share'   ;
import defaults from 'defaults';
import common   from 'common'  ;

export default (data, method, me) => {

	let sources = [];

	if(typeof data.source != 'string') {
		if(
			data.source                      &&
			data.source.constructor == Array
		) {
			for(let i in data.source) {
				sources.push(data.source[i]);
			}
		} else {
			sources = [me];			
		}
	} else {
		sources = [data.source];
	}

	if(data.save) {
		let _step = {};
		_step[method] = sources;
		event.dispatch('addStep', _step);
		event.dispatch('saveSteps', 'LOCKACTIONCOMMON');
	}

	for(let i in sources) {

		let current = common.getElementsByName(sources[i])[0];

		if(current.type == 'group') {
			let decks = current.getDecks();
			for(let deckIndex in decks) {
				decks[deckIndex][method]();
			}
		}

		if(current.type == 'deck') {
			current[method]();
		}
	}
};
