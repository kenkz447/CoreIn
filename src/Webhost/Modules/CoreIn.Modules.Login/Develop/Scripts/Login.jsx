const React = require('react');
const Redux = require('redux');

const reduxForm = require('redux-form').reduxForm;
const formReducer = require('redux-form').reducer;
const {Provider, connect} = require('react-redux');
const LoginForm = require('./components/loginForm');
const $ = require('jquery');
const validator = require('corein').validator;

const reducers = {
    form: formReducer
}

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(reducer);

const Login = (props) => {
    const {index: {forms: {default: {title, description, fields, initialValues}}, resources}} = props;

    const validate = validator(fields);

    var ReduxLoginForm = reduxForm({ form: 'registerForm', validate })(LoginForm);
    ReduxLoginForm = connect(
        state => ({
            initialValues,
            display: {
                title, description
            },
            fields
        })
    )(ReduxLoginForm);

    return (
        <Provider store={store}>
            <div className="container">
                <div className="row">
                    <div className="col-md-7 mx-auto mt-2 pull-xs-none vamiddle">
                        <div className="card-group">
                            <div className="card p-a-2">
                                <ReduxLoginForm/>
                            </div>
                            <div className="card bg-transparent no-border">
                                <div className="card-block text-xs-center">
                                    <div>
                                        <h2>{resources.register}</h2>
                                        <p>{resources.registerDescription}</p>
                                        <a href={resources.registerUrl} className="btn btn-primary active">{resources.registerLinkLabel}</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Provider>
    );
}

global.Login = Login;