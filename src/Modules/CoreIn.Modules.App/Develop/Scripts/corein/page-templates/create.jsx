const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const { connect, Provider } = require('react-redux');
const { Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { title, description, formUrl, formSubmitData, indexUrl} = props;

    return (
        <div>
            <div className="clearfix mb-1">
                <div className="pull-left">
                    <h3><a href={indexUrl}>{title}</a></h3>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <div className="card-text">
                        {description && ` ${description}`}
                    </div>
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