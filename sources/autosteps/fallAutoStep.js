'use strict';

import share    from 'share';
import defaults from 'defaults';
import event    from 'event';

import autoStep from 'autoStep';

// Fall auto step
const stepType = 'fall',
	  click    = false;

export default class fallAutoStep extends autoStep {

	// init
	constructor(params) {

		if(!params){
			params = {};
		};
		params.stepType = stepType;
		params.click    = click;

		super(params);

		// event.listen('fallAutoStepCheck', this.check);
	}

	start() {
		
		if(this.autoStep) {
			this.auto();
		} else {
			share.set('stepType', stepType);
		}

	}

	check() {
		// if (_cant_fall) {
		// 	share.set('stepType', defaults.stepType);
		// }
	}

	auto() {
		// fall lines
	}

	// manual если autostep = false
	// если click = true, вручную отрабатываем перемещения карт возвращаем false
	// если click = false то отрабатывается move а здесь проверка возможен ли ход
	manual() {//by move
		
		// empty
		// check fall
		this.check()
	}
}
