import {Map} from 'immutable';

import Field from '../field';
import actions from '../actions';
import Tips from '../tips';

// import {combineReducers} from 'redux';
// export default combineReducers({});

// export default function(state = Map({}), action) {
export default function(state = {}, action) {

    switch (action.type) {

        case actions.INIT_STATE:
            return Tips.checkTips(
                action.data ? Field.init(state, action.data) : state
            );

        case actions.SET_TIPS_MODE:
            return Tips.checkTips(
                Field.changeTipsMode(state, action.data)
            );

        case actions.TAKE_CARDS:
            return Field.takeCards(state, action.data);

        case actions.MOVE_CARDS:
            return Field.moveCards(state, action.data);

        case actions.PUT_CARDS:
            return Field.putCards(state, action.data);

        default:
            return state;
    }

    return state;
}