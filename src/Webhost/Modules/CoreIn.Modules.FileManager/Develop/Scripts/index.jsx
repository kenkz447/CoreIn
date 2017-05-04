const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;
const { tabControlReducer, fileManager: { FileManager, fmReducer } } = Corein;

const reducers = {
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer
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