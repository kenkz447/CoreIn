const React = require('react');
const Redux = require('redux');
const {Provider, connect} = require('react-redux');
const formReducer = require('redux-form').reducer;
const {reduxForm} = require('redux-form');

const RegisterForm = require('./index/components/register-form');

const reducers = {
    form: formReducer
}

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(reducer);

const validator = validating => values => {
    const errors = {};

    for (var property in validating) {

        var fieldName = validating[property].input.name;

        var hasRequired = validating[property].validate.required;
        var typeRequired = validating[property].validate.type;
        var minLengthRequired = validating[property].validate.minLength;
        var maxLengthRequired = validating[property].validate.maxLength;
        var hasCompare = validating[property].validate.compare;

        var hasContainLowercase = validating[property].validate.containLower;
        var hasContainUppercase = validating[property].validate.containUpper;
        var hasContainNumber = validating[property].validate.containNumber;
        var hasContainSpecialChar = validating[property].validate.containSpecial;

        if (hasRequired && hasRequired.value && !values[fieldName]) {
            errors[fieldName] = hasRequired.error;
        }
        else if (typeRequired && !isType(values[fieldName], typeRequired.value)) {
            errors[fieldName] = typeRequired.error;
        }
        else if (minLengthRequired && values[fieldName] && values[fieldName].length < minLengthRequired.value) {
            errors[fieldName] = minLengthRequired.error;
        }
        else if (hasCompare && values[fieldName] != values[hasCompare.value]) {
            errors[fieldName] = hasCompare.error;
        }
        else if (hasContainLowercase && !/(?=.*[a-z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainLowercase.error;
        }
        else if (hasContainUppercase && !/(?=.*[A-Z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainUppercase.error;
        }
        else if (hasContainNumber && !/(?=.*[0-9])/.test(values[fieldName])) {
            errors[fieldName] = hasContainNumber.error;
        }
        else if (hasContainSpecialChar && !/(?=.*[!@#$%^&*])/.test(values[fieldName])) {
            errors[fieldName] = hasContainSpecialChar.error;
        }
    }

    return errors;
}

module.exports = (props) => {
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