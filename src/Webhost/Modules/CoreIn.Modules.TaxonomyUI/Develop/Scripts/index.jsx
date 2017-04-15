const { combineReducers, createStore } = require('redux');
const { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;
const { tabControlReducer } = require('corein');
const tuReducer = require('./redux/tu-reducer');
const EntityTypeList = require('./components/tu-entityTypeList');
const Tabs = require('./components/tu-tabs');
const TaxonomyTree = require('./components/tu-taxonomies');
const reducers = {
    form: formReducer,
    tu: tuReducer,
    tc: tabControlReducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer);

const TaxonomyUIIndex = (props) => {
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

global.TaxonomyUIIndex = TaxonomyUIIndex;