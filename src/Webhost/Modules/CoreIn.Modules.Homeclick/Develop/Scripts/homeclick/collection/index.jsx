const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        <div>
            <PageAlert/>
            <Card>
                <CardBlock>
                    <a className="btn btn-primary" href="/collection/create">Create new</a>
                </CardBlock>
            </Card>
            <Card>
                <CardBlock>
                    <Table dataUrl="/collection/GetTableData" deleteUrl="/collection/delete" updateUrl="/collection/update"/>
                </CardBlock>
            </Card>
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