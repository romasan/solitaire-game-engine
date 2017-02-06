'use strict';

import event from 'event'                  ;
import share from 'share'                  ;

import elRender from 'elRender'            ;

import initField      from 'initField'     ;
import drawDeck       from 'drawDeck'      ;
import drawCard       from 'drawCard'      ;
import drawTip        from 'drawTip'       ;
import moveDragDeck   from 'moveDragDeck'  ;
import moveCardToHome from 'moveCardToHome';
import fieldThemesSet from 'fieldThemesSet';

// styles DOM
import 'common.scss'                       ;
import 'default_theme.scss'                ;
import 'alternative_theme.scss'            ;

event.listen('removeEl', data => {

	let _elDomElement = share.get('domElement:' + data.id);

	_elDomElement.remove();

	share.delete('domElement:' + data.id);
});

event.listen('showCard', target => {
	elRender(target).show();
});

event.listen('hideCard', target => {
	elRender(target).hide();
});
