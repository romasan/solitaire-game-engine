'use strict';

import share    from 'share';
import defaults from 'defaults';
import event    from 'event';

import autoStep from 'autoStep';

// Fall auto step

export default class fallAutoStep extends autoStep {

	// init
	constructor(params) {

		super(params);

		// event.listen('fallAutoStepCheck', this.check);
	}

	// start() {}

	check() {
		// share.set('stepType', 'fall');
		// share.set('stepType', defaults.stepType);
	}

	auto() {}

	manual() {}
}
