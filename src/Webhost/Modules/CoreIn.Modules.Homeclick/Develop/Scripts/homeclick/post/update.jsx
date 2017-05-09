const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const alerts = Corein.components.pageAlerts;
const PageAlerts = alerts.default;

const Form = require('./shared/components/form').default;

const store = createStore(require('./update/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description, alertPush } = props;

    return (
        <div>
            <PageAlerts />
            <Card>
                <CardBlock>
                    <Button color="primary">Create new</Button>
                </CardBlock>
            </Card>
            <Card>
                <CardHeader>
                    <strong>{title}</strong> {description && ` ${description}`}
                </CardHeader>
                <CardBlock>
                    <Form formName="create"
                        formUrl="/post/GetNewProjectForm"
                        formUrlData={parameters}
                        formSubmitData={{
                            url: '/post/update',
                            method: 'PUT',
                            successAction: (respo) => {
                                alertPush("success", respo.message);
                                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
                            },
                        }}
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
    bindActionCreators({ alertPush: alerts.actions.push}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        <Provider store={store}>
            <PageContent {...props} />
        </Provider>
    );
};