const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const pageAlert = require('../components/page-alerts');
const PageTable = require('./index/components/table');
const { PageTitle } = require('../components/page');

const pageReducer = require('./index/redux/reducer');

const store = createStore(pageReducer);

var PageContent = (props) => {
    const { title, createNewUrl, dataUrl, deleteUrl, tableColumns } = props;

    return (
        <div>
            <pageAlert.default />
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <PageTitle>{ title }</PageTitle>
                </div>
                <div className="pull-left ml-1">
                    <a className="btn btn-outline-primary" href={createNewUrl}>Create new</a>
                </div>
            </div>
            <Card>
                <CardBlock>
                    <PageTable dataUrl={dataUrl} deleteUrl={deleteUrl} columns={tableColumns}/>
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
            <PageContent {...props}/>
        </Provider>
    );
};