(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
﻿const React = require('react');
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
        React.createElement(Provider, {store: store}, 
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-md-7 mx-auto mt-2 pull-xs-none vamiddle"}, 
                        React.createElement("div", {className: "card-group"}, 
                            React.createElement("div", {className: "card p-a-2"}, 
                                React.createElement(ReduxLoginForm, null)
                            ), 
                            React.createElement("div", {className: "card bg-transparent no-border"}, 
                                React.createElement("div", {className: "card-block text-xs-center"}, 
                                    React.createElement("div", null, 
                                        React.createElement("h2", null, resources.register), 
                                        React.createElement("p", null, resources.registerDescription), 
                                        React.createElement("a", {href: resources.registerUrl, className: "btn btn-primary active"}, resources.registerLinkLabel)
                                    )
                                )
                            )
                        )
                    )
                )
            )
        )
    );
}

global.Login = Login;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/loginForm":2,"corein":6,"jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],2:[function(require,module,exports){
const React = require('react');
const {reduxForm, Field} = require('redux-form');
const {FormFeedback, FormGroup, Label, Button, Input, InputGroup, InputGroupAddon, Alert} = require('reactstrap');
const $ = require('jquery');
const corein = require('corein');
const renderField = require('corein').renderField;

const submit = require('./submit').loginSubmit;

const form = (props) => {
    const { error, handleSubmit, pristine, reset, submitting, submitSucceeded, fields, display } = props;

    const formFields = [];

    $.map(fields, (props, index) => {
        const {input: {name, value}, display} = props;
        formFields.push(React.createElement(Field, {key: index, component: renderField, name: name, value: value, display: display}));
    });

    return (
        React.createElement("div", {id: "LoginForm"}, 
            React.createElement("form", {onSubmit: handleSubmit(submit), className: "card-block"}, 
                React.createElement("h1", null, display.title), 
                React.createElement("p", {className: "text-muted"}, display.description), 
                !submitting && (error && React.createElement(Alert, {color: "danger"}, error)), 
                formFields, 
                React.createElement("div", null, 
                    React.createElement(Button, {type: "submit", disabled: submitting}, display.submitLabel ? display.submitLabel : "Submit")
                )
            )
        )
    );
};

module.exports = form

},{"./submit":3,"corein":6,"jquery":"XpFelZ","react":"b6Dds6","reactstrap":"jldOQ7","redux-form":"LVfYvK"}],3:[function(require,module,exports){
var $ = require('jquery');
var {SubmissionError} = require('redux-form');

const loginRequest = data => new Promise((resolve, reject) =>
    $.ajax({
        url: 'login',
        method: 'POST',
        data: data,
        success: (response) => {
            if (response.result === "success") {
                resolve(response);
            }
            else {
                reject(response);
            }
        },
        error: (response) => {
            reject(response);
        }
    })
)

function loginSubmit(values) {
    return loginRequest(values)
        .then((response) => {
            window.location.href = response.returnUrl;
        })
        .catch((response) => {
            if (response.result && response.result === "error") {
                throw new SubmissionError(response.errors);
            } else {
                throw new SubmissionError({ _error: 'Login failed!' })
            }
        });
}

module.exports = {
    loginSubmit: loginSubmit
}

},{"jquery":"XpFelZ","redux-form":"LVfYvK"}],4:[function(require,module,exports){
var React = require('react');
var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return ( 
        React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder}))
    )
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, label, displayName, placeholder, prompt}, meta: {touched, error, warning}} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, {color: validationState, className: "mb-1"}, 
            React.createElement(InputGroup, null, 
                React.createElement(InputGroupAddon, {dangerouslySetInnerHTML: { __html: label}}), 
                React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName}))
            ), 
            prompt && React.createElement(FormText, {color: "muted"}, prompt), 
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderCheckBox = (props) => {
    const {input, display: {id, placeholder}} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox"})), 
                ' ' + placeholder
            )
        )
    );
}

const renderField = props => {
    const {display: {renderType}} = props;
    if (renderType === "inputgroup") {
        return RenderInputGroup(props);
    } else if (renderType === 'formgroup'){
        return RenderFormGroup(props);
    } else if (renderType === 'checkbox') {
        return RenderCheckBox(props);
    }
}

module.exports = renderField;

},{"react":"b6Dds6","reactstrap":"jldOQ7"}],5:[function(require,module,exports){
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

module.exports = validator

},{}],6:[function(require,module,exports){
var renderField = require('./components/formField.jsx');
var validator = require('./components/validator');

module.exports = {
    renderField,
    validator
};

},{"./components/formField.jsx":4,"./components/validator":5}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5Mb2dpblxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLkxvZ2luXFxkZXZlbG9wXFxzY3JpcHRzXFxMb2dpbi5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuTG9naW5cXGRldmVsb3BcXHNjcmlwdHNcXGNvbXBvbmVudHNcXGxvZ2luRm9ybS5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuTG9naW5cXGRldmVsb3BcXHNjcmlwdHNcXGNvbXBvbmVudHNcXHN1Ym1pdC5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcV2ViaG9zdFxcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuTG9naW5cXG5vZGVfbW9kdWxlc1xcY29yZWluXFxjb21wb25lbnRzXFxmb3JtRmllbGQuanN4IiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLkxvZ2luXFxub2RlX21vZHVsZXNcXGNvcmVpblxcY29tcG9uZW50c1xcdmFsaWRhdG9yLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLkxvZ2luXFxub2RlX21vZHVsZXNcXGNvcmVpblxcaW5kZXguanMiXSwi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QUFJLHFCQUFxQixJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFO1lBQzNFLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLENBQUM7U0FDbkQ7QUFDVCxLQUFLOztJQUVELE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRzs7O0FDdkRqQixDQUFDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQ3pELElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDOztBQUVsRCxNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsV0FBVztJQUNYLFNBQVM7Q0FDWiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79jb25zdCBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbmNvbnN0IFJlZHV4ID0gcmVxdWlyZSgncmVkdXgnKTtcclxuXHJcbmNvbnN0IHJlZHV4Rm9ybSA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKS5yZWR1eEZvcm07XHJcbmNvbnN0IGZvcm1SZWR1Y2VyID0gcmVxdWlyZSgncmVkdXgtZm9ybScpLnJlZHVjZXI7XHJcbmNvbnN0IHtQcm92aWRlciwgY29ubmVjdH0gPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xyXG5jb25zdCBMb2dpbkZvcm0gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvbG9naW5Gb3JtJyk7XHJcbmNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxuY29uc3QgdmFsaWRhdG9yID0gcmVxdWlyZSgnY29yZWluJykudmFsaWRhdG9yO1xyXG5cclxuY29uc3QgcmVkdWNlcnMgPSB7XHJcbiAgICBmb3JtOiBmb3JtUmVkdWNlclxyXG59XHJcblxyXG5jb25zdCByZWR1Y2VyID0gUmVkdXguY29tYmluZVJlZHVjZXJzKHJlZHVjZXJzKTtcclxuXHJcbmNvbnN0IHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUocmVkdWNlcik7XHJcblxyXG5jb25zdCBMb2dpbiA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2luZGV4OiB7Zm9ybXM6IHtkZWZhdWx0OiB7dGl0bGUsIGRlc2NyaXB0aW9uLCBmaWVsZHMsIGluaXRpYWxWYWx1ZXN9fSwgcmVzb3VyY2VzfX0gPSBwcm9wcztcclxuXHJcbiAgICBjb25zdCB2YWxpZGF0ZSA9IHZhbGlkYXRvcihmaWVsZHMpO1xyXG5cclxuICAgIHZhciBSZWR1eExvZ2luRm9ybSA9IHJlZHV4Rm9ybSh7IGZvcm06ICdyZWdpc3RlckZvcm0nLCB2YWxpZGF0ZSB9KShMb2dpbkZvcm0pO1xyXG4gICAgUmVkdXhMb2dpbkZvcm0gPSBjb25uZWN0KFxyXG4gICAgICAgIHN0YXRlID0+ICh7XHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZXMsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlLCBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmaWVsZHNcclxuICAgICAgICB9KVxyXG4gICAgKShSZWR1eExvZ2luRm9ybSk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtbWQtNyBteC1hdXRvIG10LTIgcHVsbC14cy1ub25lIHZhbWlkZGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIHAtYS0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFJlZHV4TG9naW5Gb3JtLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjYXJkIGJnLXRyYW5zcGFyZW50IG5vLWJvcmRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZC1ibG9jayB0ZXh0LXhzLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgyPntyZXNvdXJjZXMucmVnaXN0ZXJ9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPntyZXNvdXJjZXMucmVnaXN0ZXJEZXNjcmlwdGlvbn08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXtyZXNvdXJjZXMucmVnaXN0ZXJVcmx9IGNsYXNzTmFtZT1cImJ0biBidG4tcHJpbWFyeSBhY3RpdmVcIj57cmVzb3VyY2VzLnJlZ2lzdGVyTGlua0xhYmVsfTwvYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9Qcm92aWRlcj5cclxuICAgICk7XHJcbn1cclxuXHJcbmdsb2JhbC5Mb2dpbiA9IExvZ2luOyIsIu+7v2NvbnN0IFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuY29uc3Qge3JlZHV4Rm9ybSwgRmllbGR9ID0gcmVxdWlyZSgncmVkdXgtZm9ybScpO1xyXG5jb25zdCB7Rm9ybUZlZWRiYWNrLCBGb3JtR3JvdXAsIExhYmVsLCBCdXR0b24sIElucHV0LCBJbnB1dEdyb3VwLCBJbnB1dEdyb3VwQWRkb24sIEFsZXJ0fSA9IHJlcXVpcmUoJ3JlYWN0c3RyYXAnKTtcclxuY29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5jb25zdCBjb3JlaW4gPSByZXF1aXJlKCdjb3JlaW4nKTtcclxuY29uc3QgcmVuZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlaW4nKS5yZW5kZXJGaWVsZDtcclxuXHJcbmNvbnN0IHN1Ym1pdCA9IHJlcXVpcmUoJy4vc3VibWl0JykubG9naW5TdWJtaXQ7XHJcblxyXG5jb25zdCBmb3JtID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7IGVycm9yLCBoYW5kbGVTdWJtaXQsIHByaXN0aW5lLCByZXNldCwgc3VibWl0dGluZywgc3VibWl0U3VjY2VlZGVkLCBmaWVsZHMsIGRpc3BsYXkgfSA9IHByb3BzO1xyXG5cclxuICAgIGNvbnN0IGZvcm1GaWVsZHMgPSBbXTtcclxuXHJcbiAgICAkLm1hcChmaWVsZHMsIChwcm9wcywgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCB7aW5wdXQ6IHtuYW1lLCB2YWx1ZX0sIGRpc3BsYXl9ID0gcHJvcHM7XHJcbiAgICAgICAgZm9ybUZpZWxkcy5wdXNoKDxGaWVsZCBrZXk9e2luZGV4fSBjb21wb25lbnQ9e3JlbmRlckZpZWxkfSBuYW1lPXtuYW1lfSB2YWx1ZT17dmFsdWV9IGRpc3BsYXk9e2Rpc3BsYXl9IC8+KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBpZD1cIkxvZ2luRm9ybVwiPlxyXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0KHN1Ym1pdCl9IGNsYXNzTmFtZT1cImNhcmQtYmxvY2tcIj5cclxuICAgICAgICAgICAgICAgIDxoMT57ZGlzcGxheS50aXRsZX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZFwiPntkaXNwbGF5LmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgICAgIHshc3VibWl0dGluZyAmJiAoZXJyb3IgJiYgPEFsZXJ0IGNvbG9yPVwiZGFuZ2VyXCI+e2Vycm9yfTwvQWxlcnQ+KX1cclxuICAgICAgICAgICAgICAgIHtmb3JtRmllbGRzfVxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17c3VibWl0dGluZ30+e2Rpc3BsYXkuc3VibWl0TGFiZWwgPyBkaXNwbGF5LnN1Ym1pdExhYmVsIDogXCJTdWJtaXRcIn08L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmb3JtIiwi77u/dmFyICQgPSByZXF1aXJlKCdqcXVlcnknKTtcclxudmFyIHtTdWJtaXNzaW9uRXJyb3J9ID0gcmVxdWlyZSgncmVkdXgtZm9ybScpO1xyXG5cclxuY29uc3QgbG9naW5SZXF1ZXN0ID0gZGF0YSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6ICdsb2dpbicsXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgZGF0YTogZGF0YSxcclxuICAgICAgICBzdWNjZXNzOiAocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnJlc3VsdCA9PT0gXCJzdWNjZXNzXCIpIHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXJyb3I6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0pXG4pXG5cbmZ1bmN0aW9uIGxvZ2luU3VibWl0KHZhbHVlcykge1xyXG4gICAgcmV0dXJuIGxvZ2luUmVxdWVzdCh2YWx1ZXMpXHJcbiAgICAgICAgLnRoZW4oKHJlc3BvbnNlKSA9PiB7XHJcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVzcG9uc2UucmV0dXJuVXJsO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2UucmVzdWx0ICYmIHJlc3BvbnNlLnJlc3VsdCA9PT0gXCJlcnJvclwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3VibWlzc2lvbkVycm9yKHJlc3BvbnNlLmVycm9ycyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgU3VibWlzc2lvbkVycm9yKHsgX2Vycm9yOiAnTG9naW4gZmFpbGVkIScgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGxvZ2luU3VibWl0OiBsb2dpblN1Ym1pdFxyXG59Iiwi77u/dmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIHtJbnB1dCwgSW5wdXRHcm91cCwgSW5wdXRHcm91cEFkZG9uLCBGb3JtRmVlZGJhY2ssIEZvcm1Hcm91cCwgRm9ybVRleHQsIExhYmVsfSA9IHJlcXVpcmUoJ3JlYWN0c3RyYXAnKTtcclxuXHJcbmNvbnN0IFJlbmRlcklucHV0ID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7aW5wdXQsIGlkLCB0eXBlLCBwbGFjZWhvbGRlciwgdmFsaWRhdGlvblN0YXRlfSA9IHByb3BzO1xyXG5cclxuICAgIHJldHVybiAoIFxyXG4gICAgICAgIDxJbnB1dCB7Li4uaW5wdXR9IGlkPXtpZH0gc3RhdGU9e3ZhbGlkYXRpb25TdGF0ZX0gdHlwZT17dHlwZX0gcGxhY2Vob2xkZXI9e3BsYWNlaG9sZGVyfSAvPlxyXG4gICAgKVxyXG59XHJcblxyXG5jb25zdCBSZW5kZXJJbnB1dEdyb3VwID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7aW5wdXQsIGRpc3BsYXk6IHtpZCwgdHlwZSwgbGFiZWwsIGRpc3BsYXlOYW1lLCBwbGFjZWhvbGRlciwgcHJvbXB0fSwgbWV0YToge3RvdWNoZWQsIGVycm9yLCB3YXJuaW5nfX0gPSBwcm9wcztcclxuXHJcbiAgICB2YXIgdmFsaWRhdGlvblN0YXRlID0gdG91Y2hlZCA/IChlcnJvciA/ICdkYW5nZXInIDogKHdhcm5pbmcgPyAnd2FybmluZycgOiAnc3VjY2VzcycpKSA6IHVuZGVmaW5lZDtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxGb3JtR3JvdXAgY29sb3I9e3ZhbGlkYXRpb25TdGF0ZX0gY2xhc3NOYW1lPVwibWItMVwiPlxyXG4gICAgICAgICAgICA8SW5wdXRHcm91cD5cclxuICAgICAgICAgICAgICAgIDxJbnB1dEdyb3VwQWRkb24gZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUw9e3sgX19odG1sOiBsYWJlbCB9fSAvPlxyXG4gICAgICAgICAgICAgICAgPElucHV0IHsuLi5pbnB1dH0gaWQ9e2lkfSBzdGF0ZT17dmFsaWRhdGlvblN0YXRlfSB0eXBlPXt0eXBlfSBwbGFjZWhvbGRlcj17cGxhY2Vob2xkZXIgPyBwbGFjZWhvbGRlciA6IGRpc3BsYXlOYW1lfSAvPlxyXG4gICAgICAgICAgICA8L0lucHV0R3JvdXA+XHJcbiAgICAgICAgICAgIHtwcm9tcHQgJiYgPEZvcm1UZXh0IGNvbG9yPVwibXV0ZWRcIj57cHJvbXB0fTwvRm9ybVRleHQ+fVxyXG4gICAgICAgICAgICB7dG91Y2hlZCAmJiAoKGVycm9yICYmIDxGb3JtRmVlZGJhY2s+e2Vycm9yfTwvRm9ybUZlZWRiYWNrPikgfHwgKHdhcm5pbmcgJiYgPEZvcm1GZWVkYmFjaz57d2FybmluZ308L0Zvcm1GZWVkYmFjaz4pKX1cclxuICAgICAgICA8L0Zvcm1Hcm91cD5cclxuICAgICk7XHJcbn1cclxuXHJcbmNvbnN0IFJlbmRlckNoZWNrQm94ID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7aW5wdXQsIGRpc3BsYXk6IHtpZCwgcGxhY2Vob2xkZXJ9fSA9IHByb3BzO1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8Rm9ybUdyb3VwIGNoZWNrPlxyXG4gICAgICAgICAgICA8TGFiZWwgY2hlY2s+XHJcbiAgICAgICAgICAgICAgICA8SW5wdXQgey4uLmlucHV0fSBpZD17aWR9IHR5cGU9XCJjaGVja2JveFwiIC8+XHJcbiAgICAgICAgICAgICAgICB7JyAnICsgcGxhY2Vob2xkZXJ9XHJcbiAgICAgICAgICAgIDwvTGFiZWw+XHJcbiAgICAgICAgPC9Gb3JtR3JvdXA+XHJcbiAgICApO1xyXG59XHJcblxyXG5jb25zdCByZW5kZXJGaWVsZCA9IHByb3BzID0+IHtcclxuICAgIGNvbnN0IHtkaXNwbGF5OiB7cmVuZGVyVHlwZX19ID0gcHJvcHM7XHJcbiAgICBpZiAocmVuZGVyVHlwZSA9PT0gXCJpbnB1dGdyb3VwXCIpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVySW5wdXRHcm91cChwcm9wcyk7XHJcbiAgICB9IGVsc2UgaWYgKHJlbmRlclR5cGUgPT09ICdmb3JtZ3JvdXAnKXtcclxuICAgICAgICByZXR1cm4gUmVuZGVyRm9ybUdyb3VwKHByb3BzKTtcclxuICAgIH0gZWxzZSBpZiAocmVuZGVyVHlwZSA9PT0gJ2NoZWNrYm94Jykge1xyXG4gICAgICAgIHJldHVybiBSZW5kZXJDaGVja0JveChwcm9wcyk7XHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVuZGVyRmllbGQ7Iiwi77u/Y29uc3QgaXNUeXBlID0gKHZhbHVlLCB0eXBlKSA9PiB7XHJcbiAgICBzd2l0Y2ggKHR5cGUpIHtcclxuICAgICAgICBjYXNlICdlbWFpbCc6XHJcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZSAmJiAvXltBLVowLTkuXyUrLV0rQFtBLVowLTkuLV0rXFwuW0EtWl17Miw0fSQvaS50ZXN0KHZhbHVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuY29uc3QgdmFsaWRhdG9yID0gdmFsaWRhdGluZyA9PiB2YWx1ZXMgPT4ge1xyXG4gICAgY29uc3QgZXJyb3JzID0ge307XHJcblxyXG4gICAgZm9yICh2YXIgcHJvcGVydHkgaW4gdmFsaWRhdGluZykge1xyXG5cclxuICAgICAgICB2YXIgZmllbGROYW1lID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0uaW5wdXQubmFtZTtcclxuXHJcbiAgICAgICAgdmFyIGhhc1JlcXVpcmVkID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUucmVxdWlyZWQ7XHJcbiAgICAgICAgdmFyIHR5cGVSZXF1aXJlZCA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLnR5cGU7XHJcbiAgICAgICAgdmFyIG1pbkxlbmd0aFJlcXVpcmVkID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUubWluTGVuZ3RoO1xyXG4gICAgICAgIHZhciBtYXhMZW5ndGhSZXF1aXJlZCA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLm1heExlbmd0aDtcclxuICAgICAgICB2YXIgaGFzQ29tcGFyZSA9IHZhbGlkYXRpbmdbcHJvcGVydHldLnZhbGlkYXRlLmNvbXBhcmU7XHJcblxyXG4gICAgICAgIHZhciBoYXNDb250YWluTG93ZXJjYXNlID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUuY29udGFpbkxvd2VyO1xyXG4gICAgICAgIHZhciBoYXNDb250YWluVXBwZXJjYXNlID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUuY29udGFpblVwcGVyO1xyXG4gICAgICAgIHZhciBoYXNDb250YWluTnVtYmVyID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUuY29udGFpbk51bWJlcjtcclxuICAgICAgICB2YXIgaGFzQ29udGFpblNwZWNpYWxDaGFyID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUuY29udGFpblNwZWNpYWw7XHJcblxyXG4gICAgICAgIGlmIChoYXNSZXF1aXJlZCAmJiBoYXNSZXF1aXJlZC52YWx1ZSAmJiAhdmFsdWVzW2ZpZWxkTmFtZV0pIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNSZXF1aXJlZC5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAodHlwZVJlcXVpcmVkICYmICFpc1R5cGUodmFsdWVzW2ZpZWxkTmFtZV0sIHR5cGVSZXF1aXJlZC52YWx1ZSkpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSB0eXBlUmVxdWlyZWQuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKG1pbkxlbmd0aFJlcXVpcmVkICYmIHZhbHVlc1tmaWVsZE5hbWVdICYmIHZhbHVlc1tmaWVsZE5hbWVdLmxlbmd0aCA8IG1pbkxlbmd0aFJlcXVpcmVkLnZhbHVlKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gbWluTGVuZ3RoUmVxdWlyZWQuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbXBhcmUgJiYgdmFsdWVzW2ZpZWxkTmFtZV0gIT0gdmFsdWVzW2hhc0NvbXBhcmUudmFsdWVdKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29tcGFyZS5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGFzQ29udGFpbkxvd2VyY2FzZSAmJiAhLyg/PS4qW2Etel0pLy50ZXN0KHZhbHVlc1tmaWVsZE5hbWVdKSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbnRhaW5Mb3dlcmNhc2UuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbnRhaW5VcHBlcmNhc2UgJiYgIS8oPz0uKltBLVpdKS8udGVzdCh2YWx1ZXNbZmllbGROYW1lXSkpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNDb250YWluVXBwZXJjYXNlLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb250YWluTnVtYmVyICYmICEvKD89LipbMC05XSkvLnRlc3QodmFsdWVzW2ZpZWxkTmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29udGFpbk51bWJlci5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGFzQ29udGFpblNwZWNpYWxDaGFyICYmICEvKD89LipbIUAjJCVeJipdKS8udGVzdCh2YWx1ZXNbZmllbGROYW1lXSkpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNDb250YWluU3BlY2lhbENoYXIuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBlcnJvcnM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gdmFsaWRhdG9yIiwi77u/dmFyIHJlbmRlckZpZWxkID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL2Zvcm1GaWVsZC5qc3gnKTtcclxudmFyIHZhbGlkYXRvciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy92YWxpZGF0b3InKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgcmVuZGVyRmllbGQsXHJcbiAgICB2YWxpZGF0b3JcclxufTsiXX0=
