﻿const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('../project/shared/components/project-form').default;
const store = createStore(require('./create/redux/reducer'));

var PageContent = (props) => {

    const {title, description} = props;

    return (
        <div>
            <Card>
                <CardBlock>
                    <Button color="primary">Create new</Button>
                </CardBlock>
            </Card>
            <Card>
                <CardHeader>
                    <strong>{title}</strong> {description && ` ${description}` }
                </CardHeader>
                <CardBlock>
                    <Form formName="create"
                        formUrl="/project/GetNewProjectForm"
                        formSubmitData={{
                            url: '/project/create',
                            method: 'POST',
                            successAction: (respo) => {
                                window.location.href = respo.result;
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