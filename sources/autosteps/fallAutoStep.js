'use strict';

import share    from 'share';
import defaults from 'defaults';
import event    from 'event';

import autoStep from 'autoStep';

// Fall auto step
const _stepType = 'fall',
	  	_click    = false;

export default class fallAutoStep extends autoStep {

	// init
	constructor(params) {

		if(!params) {
			params = {};
		}
		
		params._stepType = _stepType;
		params._click    = _click;

		super(params);

		// event.listen('fallAutoStepCheck', this.check);
	}

	start() {
		
		if(this.autoStep) {
			this.auto();
		} else {
			share.set('stepType', _stepType);
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
	manual(putDeck) {//by move

		
		// empty
		// check fall
		// this.check();

		console.log('fallAutoStep:manual');

		return false;
	}

	putCheck(putDeck) {
		
		console.log('fallAutoStep:putCheck', putDeck);
		
		return false;
	}
}