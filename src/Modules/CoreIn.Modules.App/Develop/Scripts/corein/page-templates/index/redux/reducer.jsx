const $ = require('jquery');
const { combineReducers } = require('redux');

const table = require('../../../components/table').reducer;
const pageAlerts = require('../../../components/page-alerts').reducer;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer,
    table,
    pageAlerts
});