const { render } = require('react-dom');
const { combineReducers, createStore, applyMiddleware } = require('redux');
const { routerReducer, routerMiddleware, push } = require('react-router-redux');
const { history, Root } = require('./dbgroupvn/Root');

const middleware = routerMiddleware(history)

const reducer = combineReducers({
    app: require('./dbgroupvn/shared/reducer'),
    router: routerReducer
});

const store = createStore(reducer, applyMiddleware(middleware));

render(
    <Root store={store} />,
    document.getElementById('root')
);