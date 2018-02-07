import share    from "../../../../common/share"   ;
import defaults from '../../../../common/defaults';

export default {

    "roller": (params, card, index, length, deck, data, context) => {
		// data: "open,group,padding"
		// flipRule: "topUnflip:open"

		let _data   =   data.split(',') ,
		    open    =  _data[0] | 0     , // open cards count
		    group   = (_data[1] | 0) > 0  // closed cards group count
		    	? _data[1] | 0
		    	: 1,
			padding = _data[2] | 0;

			let firstOpenCardIndex   = -1;
			let firstHiddenCardIndex = deck.length;
			
			for (let i in deck) {
				
			if (
				firstOpenCardIndex <  0     &&
				deck[i].flip       == false
			) {
				firstOpenCardIndex = (i | 0);
			}
			
			// if (
			// 	firstHiddenCardIndex <  0     &&
			// 	deck[i].visible      == false
			// ) {
			// 	firstHiddenCardIndex = (i | 0);
			// }
		}

			if (
			(index | 0) >= length - open && // delimiter and after
			card.flip   == false            // closed cards
		) {

			let shift = 0;

			if (length - open < 0) {
				shift = -(length - open);
			}

			if (firstHiddenCardIndex - firstOpenCardIndex < open) {
				shift = open - (firstHiddenCardIndex - firstOpenCardIndex);
			}

			return {
				"x" : params.x + (defaults.card.width) + padding + ((index - shift) - length + open) * params.padding_x,
				"y" : params.y                                   + ((index - shift) - length + open) * params.padding_y
			}
		} else {                          // before delimiter

			return {
				"x" : params.x + params.flip_padding_x * ((index / group) | 0),
				"y" : params.y + params.flip_padding_y * ((index / group) | 0)
			}
		}

		return {
			"x" : params.x,
			"y" : params.y
		};
	}
};