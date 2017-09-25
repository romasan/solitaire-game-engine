import {Map} from 'immutable';

import Field from '../field';
import actions from '../actions';

// import {combineReducers} from 'redux';
// export default combineReducers({});

export default function(state = Map({}), action) {

    switch (action.type) {

        case actions.INIT_STATE:
            return action.data ? Field.init(Map({}), action.data): Map({});

        // case actions.CHANGE_TIPS_MODE:
            // return Field.changeTipsMode(state, action.data);

        default:
            return state;
    }

    return state;
}