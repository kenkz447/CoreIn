const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein;

const initialState = {

};

const reducer = (state = initialState, action) => {
    return state;
};

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: reducer,
    projectForm: require('../../shared/components/project-form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
    layoutModal: require('../../shared/components/layout-modal').reducer
});