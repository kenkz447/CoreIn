const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const DynamicForm = Corein;
const {Button} = require('reactstrap');

const tableActions = Corein.table.actions;

const reducer = combineReducers({
    index: require('./index/redux/reducer')
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        <div>
            <div className="card">
                <div className="card-block">
                    <Button color="primary">Create new</Button>
                </div>
            </div>
            <div className="card">
                <div className="card-block">
                    <Table />
                </div>
            </div>
        </div>
    );
};

const stateToProps = (state) => {
    return ({

    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <PageContent />
        </Provider>
    );
};