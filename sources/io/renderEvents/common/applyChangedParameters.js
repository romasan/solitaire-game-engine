'use strict';

import defaults from '../../../common/defaults';

let applyChangedParameters = (data, rewrite = true) => {

	let _data = rewrite ? data : JSON.parse(JSON.stringify(data));

	_data.params.x = (
			(
				   _data.deckData.position               &&
			typeof _data.deckData.position.x == 'number'
				?  _data.deckData.position.x
				: 0
			) | 0
		) +
		(
			(
				   _data.deckData.parentPosition               &&
			typeof _data.deckData.parentPosition.x == 'number'
				?  _data.deckData.parentPosition.x
				: 0
			) | 0
		);

	_data.params.y = (
			(
				   _data.deckData.position               &&
			typeof _data.deckData.position.y == 'number'
				?  _data.deckData.position.y
				: 0
			) | 0
		) +
		(
			(
				   _data.deckData.parentPosition               &&
			typeof _data.deckData.parentPosition.y == 'number'
				?  _data.deckData.parentPosition.y
				: 0
			) | 0
		);

	_data.deck.rotate = _data.params.rotate = _data.deckData.rotate &&
		typeof _data.deckData.rotate == 'number'
			? _data.deckData.rotate
			: 0;

	let paddingValues = {
		    'paddingY' :      'padding_y',
		    'paddingX' :      'padding_x',
		'flipPaddingY' : 'flip_padding_y',
		'flipPaddingX' : 'flip_padding_x'
	};

	for (let key in paddingValues) {

		let value = paddingValues[key];

		_data.params[value] = (
			       _data.deckData[key]             &&
			typeof _data.deckData[key] == 'number'
		)
			? _data.deckData[key] 
			: _data.deckData.paddingType
				? defaults[value]      
				: 0;
	}

	return _data;
};

export default applyChangedParameters;