const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const { connect, Provider } = require('react-redux');
const { Row, Col, Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {index, create, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;
const { PageTitle } = Corein.components.pageComponents;

const Form = require('./shared/components/form').default;

var PageContent = (props) => {
    const { parameters, title, description, createNewUrl, indexUrl, urls } = props;

    return (
        <div>
            <PageAlerts />
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <PageTitle><a href={indexUrl || urls.index}>{title}</a></PageTitle>
                </div>
                <div className="pull-left ml-1">
                    <a className="btn btn-outline-primary" href={createNewUrl || urls.create}>Create new</a>
                </div>
            </div>
            <div>
                    <Form formName="update"
                        formUrl={formUrl}
                        formUrlData={parameters}
                        formSubmitData={formSubmitData}
                    />
            </div>
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

const store = createStore(require('./shared/redux/reducer'));
PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <PageContent {...props} />
        </Provider>
    );
};