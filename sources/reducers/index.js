import {Map} from 'immutable';

import Field from '../field';
import actions from '../actions';

// import {combineReducers} from 'redux';
// export default combineReducers({});

export default function(state = Map({}), action) {

    switch (action.type) {

        case actions.INIT_STATE:
            return action.data ? Field.init(Map({}), action.data): Map({});

        default:
            return state;
    }

    return state;
}