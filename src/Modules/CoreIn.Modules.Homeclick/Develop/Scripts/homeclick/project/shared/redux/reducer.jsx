const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
    layoutModal: require('../components/layout-modal').reducer
});