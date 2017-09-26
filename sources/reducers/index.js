import {Map} from 'immutable';

import Field from '../field';
import actions from '../actions';
import Tips from '../tips';

// import {combineReducers} from 'redux';
// export default combineReducers({});

export default function(state = Map({}), action) {

    switch (action.type) {

        case actions.INIT_STATE:
            return Tips.checkTips(
                action.data ? Field.init(state, action.data) : state
            );

        // case actions.CHANGE_TIPS_MODE:
            // return Field.changeTipsMode(state, action.data);

        default:
            return state;
    }

    return state;
}