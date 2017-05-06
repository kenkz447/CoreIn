﻿const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.table.actions;
const PageAlert = Corein.pageAlerts.default;
const pageAlertsReducer = Corein.pageAlerts.reducer;

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
                    <Button color="primary">Create new</Button>
                </CardBlock>
            </Card>
            <Card>
                <CardBlock>
                    <Table />
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