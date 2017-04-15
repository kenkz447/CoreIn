const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;

var { FileManager, fmReducer } = require('./components/fm-index.jsx');

const reducers = {
    form: formReducer,
    fm: fmReducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer); 

const FileManagerIndex = (props) => {
    return (
        <Provider store={store}>
            <FileManager />
        </Provider>
        );
}

global.FileManagerIndex = FileManagerIndex;