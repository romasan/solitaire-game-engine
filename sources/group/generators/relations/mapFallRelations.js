'use strict';

// map froup generator fall relations

// const directions = [
// 	'left' ,
// 	'rigth',
// 	'up'   ,
// 	'down'
// ];

const opposite = [
	// ['left', 'right'],
	// ['up'  , 'down' ]
	{left  : 'rigth'},
	{rigth : 'left' },
	{up    : 'down' },
	{down  : 'up'   }
];

export default (el, data)=>{

	var _relations = [];

	let _directions = [];
	for(let i in data.directions) {
		if(
			_directions.indexOf(data.directions[i]) < 0
		 && _directions.indexOf(opposite[data.directions[i]]) < 0
		) {
			_directions.push(data.directions[i]);
		}
	}
	for(let i in _directions) {
		switch(_directions[i]) {
			case 'left' :
				break;
			case 'rigth':
				break;
			case 'up'   :
				break;
			case 'down' :
				break;
		}
	}

	return _relations;
}