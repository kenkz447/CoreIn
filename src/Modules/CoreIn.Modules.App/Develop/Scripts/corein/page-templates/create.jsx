const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const { connect, Provider } = require('react-redux');
const { Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');
const SharedForm = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));
const { PageTitle } = require('../components/page');

var PageContent = (props) => {
    const { parameters, title, description, formUrl, formSubmitData, indexUrl, Form} = props;

    return (
        <div>
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <PageTitle><a href={indexUrl}>{title}</a></PageTitle>
                    { description }
                </div>
            </div>
            <Card>
                <CardBlock>
                    {
                        Form ? Form : <SharedForm formName="create" formUrlData={parameters} formUrl={formUrl} formSubmitData={formSubmitData} />
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
    bindActionCreators({}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <PageContent {...props} />
        </Provider>
    );
};