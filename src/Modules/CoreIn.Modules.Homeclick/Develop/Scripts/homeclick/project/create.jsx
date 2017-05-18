const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

const {create: {formUrl, formSubmitData}} = require('./shared');

var PageContent = (props) => {

    const {title, description} = props;

    return (
        <div>
            <Card>
                <CardHeader>
                    <strong>{title}</strong> {description && ` ${description}` }
                </CardHeader>
                <CardBlock>
                    <Form formName="create"
                        formUrl={formUrl}
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