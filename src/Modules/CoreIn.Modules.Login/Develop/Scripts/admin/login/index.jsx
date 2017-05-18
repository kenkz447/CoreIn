const $ = require('jquery');
const Redux = require('redux');
const reduxForm = require('redux-form').reduxForm;
const formReducer = require('redux-form').reducer;
const {Provider, connect} = require('react-redux');
const LoginForm = require('./index/components/loginForm');

const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

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

const reducers = {
    form: formReducer
}

const reducer = Redux.combineReducers(reducers);

const store = Redux.createStore(reducer);

module.exports = (props) => {
    console.log(props);

    const {forms:
        {default: {title, description, fields, initialValues}}, resources} = props;

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
