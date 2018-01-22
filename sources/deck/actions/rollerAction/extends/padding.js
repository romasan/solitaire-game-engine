import rules from './paddingTypes'          ;
import event from '../../../../common/event';

let rollerPaddingExtend = (deck, padding, paddingMethod, index) => {

    if ( !deck.hasTag('ignore_visibility') ) {
        return padding;
    }
    
    let firstOpenCardIndex = -1;
    
    const cards = deck.getCards({});
    
    for (let i in cards) {
        if (
            firstOpenCardIndex < 0 &&
            cards[i].flip == false
        ) {
            firstOpenCardIndex = (i | 0);
        }
    }
    
    if (
        cards[index].visible == false          &&
                       firstOpenCardIndex >= 0 &&
        (index | 0) >= firstOpenCardIndex
    ) {

        let _padding = paddingMethod(firstOpenCardIndex);

        return _padding;
    }

    return padding;
}

export default {
    "do"    : rollerPaddingExtend,
    "rules" : rules
};