const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

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
    reducer, table: table.reducer
});