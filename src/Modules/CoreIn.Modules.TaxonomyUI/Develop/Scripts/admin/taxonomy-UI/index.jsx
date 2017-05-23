const { combineReducers, createStore } = require('redux');
const { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;

const { tabControl, fileManager: {fmReducer} } = Corein.components;

const tuReducer = require('./index/redux/reducer');
const EntityTypeList = require('./index/components/taxonomy-type-list');
const Tabs = require('./index/components/tab-control');
const TaxonomyTree = require('./index/components/taxonomy-list');

const reducers = {
    fm: fmReducer,
    form: formReducer,
    tu: tuReducer,
    tc: tabControl.reducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <div className="row">
                <div className="col-sm-6 col-md-4">
                    <EntityTypeList />
                </div>
                <div className="col-sm-6 col-md-4">
                    <TaxonomyTree />
                </div>
                <div className="col-sm-6 col-md-4">
                    <Tabs />
                </div>
            </div>
        </Provider>
    );
}