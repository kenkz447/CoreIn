const { combineReducers } = require('redux');
const { routerReducer } = require('react-router-redux');

//reducers
const localization = require('./reducers/localization').reducer;
const menu = require('./_layout/header/menu').reducer;
const layout = require('./_layout').reducer;
const connectedBasePage = require('./_layout/main/connected-base-page').reducer;

import { googleMapReducer } from './reducers/google-map'
import { reducer as appRouter } from '../routes'

const reducer = combineReducers({
    layout,
    localization,
    menu,
    connectedBasePage,
    router: routerReducer,
    appRouter,
    googleMap: googleMapReducer
})

module.exports = reducer;