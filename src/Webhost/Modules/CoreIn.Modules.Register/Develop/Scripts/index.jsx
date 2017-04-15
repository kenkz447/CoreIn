const React = require('react');
const Redux = require('redux');
const {Provider, connect} = require('react-redux');
const formReducer = require('redux-form').reducer;
const {validator} = require('corein');
const {reduxForm} = require('redux-form');

const RegisterForm = require('./components/registerForm');

const reducers = {
    form: formReducer
}

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(reducer);

const Register = (props) => {
    const {index: {forms: {default: {title, description, fields}}, resources: {successMessageTitle, successMessage, loginBtnLabel}}} = props;

    const formDisplay = {
        title,
        description,
        successMessageTitle,
        successMessage,
        loginBtnLabel  
    }

    const validate = validator(fields);

    var ReduxRegisterForm = reduxForm({ form: 'registerForm', validate })(RegisterForm);

    ReduxRegisterForm = connect(
        state => ({
            display: formDisplay,
            fields: fields
        })
    )(ReduxRegisterForm);

    return (
        <Provider store={store}>
            <div className="container">
                <div className="Row">
                    <div className="col-md-4 mx-auto mt-2 pull-xs-none">
                        <ReduxRegisterForm/>
                    </div>
                </div>
            </div>
        </Provider>
        );
}

global.Register = Register;