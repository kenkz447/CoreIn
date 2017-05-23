const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;
const { tabControl, fileManager: { FileManager, fmReducer } } = Corein.components;

const reducers = {
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControl.reducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer); 

module.exports = {
    index: (props) => {
		return (
			<Provider store={store}>
				<FileManager />
			</Provider>
		);
	}	
}