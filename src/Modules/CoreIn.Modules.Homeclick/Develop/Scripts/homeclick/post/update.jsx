const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const {createNewUrl, update: {formUrl, formSubmitData}} = require('./shared');

const PageAlerts = Corein.components.pageAlerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description } = props;

    return (
        <div>
            <PageAlerts />
            <Card>
                <CardBlock>
                    <a className="btn btn-primary" href={createNewUrl}>Create new</a>
                </CardBlock>
            </Card>
            <Card>
                <CardHeader>
                    <strong>{title}</strong> {description && ` ${description}`}
                </CardHeader>
                <CardBlock>
                    <Form formName="create"
                        formUrl={formUrl}
                        formUrlData={parameters}
                        formSubmitData={formSubmitData}
                    />
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