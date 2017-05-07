const { combineReducers, createStore } = require('redux');
const { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: {fmReducer} } = Corein.components;

const tuReducer = require('./index/redux/tu-reducer');
const EntityTypeList = require('./index/components/tu-taxonomyTypeList');
const Tabs = require('./index/components/tu-actionTabControl');
const TaxonomyTree = require('./index/components/tu-taxonomyList');

const reducers = {
    fm: fmReducer,
    form: formReducer,
    tu: tuReducer,
    tc: tabControlReducer
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