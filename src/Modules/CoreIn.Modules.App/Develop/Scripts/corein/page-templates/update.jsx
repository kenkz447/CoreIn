const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Row, Col, Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');

const PageAlerts = require('../components/page-alerts').default;

const SharedForm = require('./shared/components/form').default;
const { PageTitle } = require('../components/page');

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description, createNewUrl, formUrl, formSubmitData, indexUrl, Form } = props;

    return (
        <div>
            <PageAlerts />
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <PageTitle><a href={indexUrl}>{title}</a></PageTitle>
                </div>
                <div className="pull-left ml-1">
                    <a className="btn btn-outline-primary" href={createNewUrl}>Create new</a>
                </div>
            </div>
            <Card>
                <CardBlock>
                    {
                        Form ? Form : <SharedForm formName="create" formUrl={formUrl} formUrlData={parameters} formSubmitData={formSubmitData}/>
                    }
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
    bindActionCreators({ }, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <PageContent {...props} />
        </Provider>
    );
};