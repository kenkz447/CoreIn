const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;
const fmTabControl = require('../../../components/tab-control').reducer

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: require('../../../components/page-alerts').reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: require('../../../components/file-manager').fmReducer,
    fmTabControl
});