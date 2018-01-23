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

		console.warn('padding', card.parent, open, group, padding, card.name, index, length, context);

		if (
			(index | 0) >= length - open && // delimiter and after
			card.flip   == false            // closed cards
		) {

			let shift = 0;

			if (length - open < 0) {
				shift = -(length - open);
			}

			console.log('#1', index - shift, length, open, shift);

			return {
				"x" : params.x + (defaults.card.width * share.get('zoom')) + padding + ((index - shift) - length + open) * params.padding_x,
				"y" : params.y                                                       + ((index - shift) - length + open) * params.padding_y
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