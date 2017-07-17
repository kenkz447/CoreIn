(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
﻿global.Admin = {
    login: require('./admin/login')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./admin/login":2}],2:[function(require,module,exports){
module.exports = {
    index: require('./login/index')
}

},{"./login/index":3}],3:[function(require,module,exports){
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
        React.createElement(Provider, {store: store}, 
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("div", {className: "col-12 col-md-4 mx-auto mt-2 pull-xs-none vamiddle"}, 
                        React.createElement("div", {className: "card-group"}, 
                            React.createElement("div", {className: "card p-a-2"}, 
                                React.createElement(ReduxLoginForm, null)
                            )
                        )
                    )
                )
            )
        )
    );
}


},{"./index/components/loginForm":4,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],4:[function(require,module,exports){
const $ = require('jquery');
const { reduxForm, Field } = require('redux-form');

var {Button, Alert, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return (
        React.createElement(Input, React.__spread({}, input, { id: id, state: validationState, type: type, placeholder: placeholder }))
    )
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, label, displayName, placeholder, prompt}, meta: {touched, error, warning}} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, { color: validationState, className: "mb-1" },
            React.createElement(InputGroup, null,
                React.createElement(InputGroupAddon, { dangerouslySetInnerHTML: { __html: label } }),
                React.createElement(Input, React.__spread({}, input, { id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName }))
            ),
            prompt && React.createElement(FormText, { color: "muted" }, prompt),
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderCheckBox = (props) => {
    const {input, display: {id, placeholder}} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox", checked: input.value})), 
                React.createElement("span", null), 
                ' Remember me'
            )
        )
    );
}

const renderField = props => {
    const {display: {renderType}} = props;
    if (renderType === "inputgroup") {
        return RenderInputGroup(props);
    } else if (renderType === 'formgroup') {
        return RenderFormGroup(props);
    } else if (renderType === 'checkbox') {
        return RenderCheckBox(props);
    }
}

const submit = Corein.components.form.submit({
    url: 'login',
    method: 'POST',
    successAction: (response) => {
        window.location.href = response.result;
}});

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

},{"jquery":"XpFelZ","reactstrap":"jldOQ7","redux-form":"LVfYvK"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5Mb2dpblxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLkxvZ2luXFxkZXZlbG9wXFxzY3JpcHRzXFxhZG1pbi5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuTG9naW5cXGRldmVsb3BcXHNjcmlwdHNcXGFkbWluXFxsb2dpbi5qc3giLCJEOlxccHJvamVjdHNcXGRvdG5ldFxcQ29yZUluXFxDb3JlSW5cXHNyY1xcTW9kdWxlc1xcQ29yZUluLk1vZHVsZXMuTG9naW5cXGRldmVsb3BcXHNjcmlwdHNcXGFkbWluXFxsb2dpblxcaW5kZXguanN4IiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLkxvZ2luXFxkZXZlbG9wXFxzY3JpcHRzXFxhZG1pblxcbG9naW5cXGluZGV4XFxjb21wb25lbnRzXFxsb2dpbkZvcm0uanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHO0lBQ1osS0FBSyxFQUFFLE9BQU8sQ0FBQyxlQUFlLENBQUM7Ozs7OztBQ0RuQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZCxLQUFLLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQzs7OztBQ0RuQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxTQUFTLEdBQUcs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QUEsRUFBUSxDQUFFLFVBQVksQ0FBQSxFQUFDLE9BQU8sQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsR0FBRyxRQUFrQixDQUFBO2dCQUN6RyxDQUFBO1lBQ0gsQ0FBQTtRQUNMLENBQUE7TUFDUjtBQUNOLENBQUMsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIu+7v2dsb2JhbC5BZG1pbiA9IHtcclxuICAgIGxvZ2luOiByZXF1aXJlKCcuL2FkbWluL2xvZ2luJylcclxufSIsIu+7v21vZHVsZS5leHBvcnRzID0ge1xyXG4gICAgaW5kZXg6IHJlcXVpcmUoJy4vbG9naW4vaW5kZXgnKVxyXG59Iiwi77u/Y29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5jb25zdCBSZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XHJcbmNvbnN0IHJlZHV4Rm9ybSA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKS5yZWR1eEZvcm07XHJcbmNvbnN0IGZvcm1SZWR1Y2VyID0gcmVxdWlyZSgncmVkdXgtZm9ybScpLnJlZHVjZXI7XHJcbmNvbnN0IHtQcm92aWRlciwgY29ubmVjdH0gPSByZXF1aXJlKCdyZWFjdC1yZWR1eCcpO1xyXG5jb25zdCBMb2dpbkZvcm0gPSByZXF1aXJlKCcuL2luZGV4L2NvbXBvbmVudHMvbG9naW5Gb3JtJyk7XHJcblxyXG5jb25zdCBpc1R5cGUgPSAodmFsdWUsIHR5cGUpID0+IHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ2VtYWlsJzpcclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlICYmIC9eW0EtWjAtOS5fJSstXStAW0EtWjAtOS4tXStcXC5bQS1aXXsyLDR9JC9pLnRlc3QodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5jb25zdCB2YWxpZGF0b3IgPSB2YWxpZGF0aW5nID0+IHZhbHVlcyA9PiB7XHJcbiAgICBjb25zdCBlcnJvcnMgPSB7fTtcclxuXHJcbiAgICBmb3IgKHZhciBwcm9wZXJ0eSBpbiB2YWxpZGF0aW5nKSB7XHJcblxyXG4gICAgICAgIHZhciBmaWVsZE5hbWUgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS5pbnB1dC5uYW1lO1xyXG5cclxuICAgICAgICB2YXIgaGFzUmVxdWlyZWQgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5yZXF1aXJlZDtcclxuICAgICAgICB2YXIgdHlwZVJlcXVpcmVkID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUudHlwZTtcclxuICAgICAgICB2YXIgbWluTGVuZ3RoUmVxdWlyZWQgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5taW5MZW5ndGg7XHJcbiAgICAgICAgdmFyIG1heExlbmd0aFJlcXVpcmVkID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUubWF4TGVuZ3RoO1xyXG4gICAgICAgIHZhciBoYXNDb21wYXJlID0gdmFsaWRhdGluZ1twcm9wZXJ0eV0udmFsaWRhdGUuY29tcGFyZTtcclxuXHJcbiAgICAgICAgdmFyIGhhc0NvbnRhaW5Mb3dlcmNhc2UgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5jb250YWluTG93ZXI7XHJcbiAgICAgICAgdmFyIGhhc0NvbnRhaW5VcHBlcmNhc2UgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5jb250YWluVXBwZXI7XHJcbiAgICAgICAgdmFyIGhhc0NvbnRhaW5OdW1iZXIgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5jb250YWluTnVtYmVyO1xyXG4gICAgICAgIHZhciBoYXNDb250YWluU3BlY2lhbENoYXIgPSB2YWxpZGF0aW5nW3Byb3BlcnR5XS52YWxpZGF0ZS5jb250YWluU3BlY2lhbDtcclxuXHJcbiAgICAgICAgaWYgKGhhc1JlcXVpcmVkICYmIGhhc1JlcXVpcmVkLnZhbHVlICYmICF2YWx1ZXNbZmllbGROYW1lXSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc1JlcXVpcmVkLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmICh0eXBlUmVxdWlyZWQgJiYgIWlzVHlwZSh2YWx1ZXNbZmllbGROYW1lXSwgdHlwZVJlcXVpcmVkLnZhbHVlKSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IHR5cGVSZXF1aXJlZC5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAobWluTGVuZ3RoUmVxdWlyZWQgJiYgdmFsdWVzW2ZpZWxkTmFtZV0gJiYgdmFsdWVzW2ZpZWxkTmFtZV0ubGVuZ3RoIDwgbWluTGVuZ3RoUmVxdWlyZWQudmFsdWUpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBtaW5MZW5ndGhSZXF1aXJlZC5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGFzQ29tcGFyZSAmJiB2YWx1ZXNbZmllbGROYW1lXSAhPSB2YWx1ZXNbaGFzQ29tcGFyZS52YWx1ZV0pIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNDb21wYXJlLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb250YWluTG93ZXJjYXNlICYmICEvKD89LipbYS16XSkvLnRlc3QodmFsdWVzW2ZpZWxkTmFtZV0pKSB7XHJcbiAgICAgICAgICAgIGVycm9yc1tmaWVsZE5hbWVdID0gaGFzQ29udGFpbkxvd2VyY2FzZS5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZiAoaGFzQ29udGFpblVwcGVyY2FzZSAmJiAhLyg/PS4qW0EtWl0pLy50ZXN0KHZhbHVlc1tmaWVsZE5hbWVdKSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbnRhaW5VcHBlcmNhc2UuZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGhhc0NvbnRhaW5OdW1iZXIgJiYgIS8oPz0uKlswLTldKS8udGVzdCh2YWx1ZXNbZmllbGROYW1lXSkpIHtcclxuICAgICAgICAgICAgZXJyb3JzW2ZpZWxkTmFtZV0gPSBoYXNDb250YWluTnVtYmVyLmVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChoYXNDb250YWluU3BlY2lhbENoYXIgJiYgIS8oPz0uKlshQCMkJV4mKl0pLy50ZXN0KHZhbHVlc1tmaWVsZE5hbWVdKSkge1xyXG4gICAgICAgICAgICBlcnJvcnNbZmllbGROYW1lXSA9IGhhc0NvbnRhaW5TcGVjaWFsQ2hhci5lcnJvcjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVycm9ycztcclxufVxyXG5cclxuY29uc3QgcmVkdWNlcnMgPSB7XHJcbiAgICBmb3JtOiBmb3JtUmVkdWNlclxyXG59XHJcblxyXG5jb25zdCByZWR1Y2VyID0gUmVkdXguY29tYmluZVJlZHVjZXJzKHJlZHVjZXJzKTtcclxuXHJcbmNvbnN0IHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUocmVkdWNlcik7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc29sZS5sb2cocHJvcHMpO1xyXG5cclxuICAgIGNvbnN0IHtmb3JtczpcclxuICAgICAgICB7ZGVmYXVsdDoge3RpdGxlLCBkZXNjcmlwdGlvbiwgZmllbGRzLCBpbml0aWFsVmFsdWVzfX0sIHJlc291cmNlc30gPSBwcm9wcztcclxuXHJcbiAgICBjb25zdCB2YWxpZGF0ZSA9IHZhbGlkYXRvcihmaWVsZHMpO1xyXG5cclxuICAgIHZhciBSZWR1eExvZ2luRm9ybSA9IHJlZHV4Rm9ybSh7IGZvcm06ICdyZWdpc3RlckZvcm0nLCB2YWxpZGF0ZSB9KShMb2dpbkZvcm0pO1xyXG4gICAgUmVkdXhMb2dpbkZvcm0gPSBjb25uZWN0KFxyXG4gICAgICAgIHN0YXRlID0+ICh7XHJcbiAgICAgICAgICAgIGluaXRpYWxWYWx1ZXMsXHJcbiAgICAgICAgICAgIGRpc3BsYXk6IHtcclxuICAgICAgICAgICAgICAgIHRpdGxlLCBkZXNjcmlwdGlvblxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBmaWVsZHNcclxuICAgICAgICB9KVxyXG4gICAgKShSZWR1eExvZ2luRm9ybSk7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8UHJvdmlkZXIgc3RvcmU9e3N0b3JlfT5cclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtMTIgY29sLW1kLTQgbXgtYXV0byBtdC0yIHB1bGwteHMtbm9uZSB2YW1pZGRsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQtZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBwLWEtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxSZWR1eExvZ2luRm9ybS8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9Qcm92aWRlcj5cclxuICAgICk7XHJcbn1cclxuIiwi77u/Y29uc3QgJCA9IHJlcXVpcmUoJ2pxdWVyeScpO1xyXG5jb25zdCB7IHJlZHV4Rm9ybSwgRmllbGQgfSA9IHJlcXVpcmUoJ3JlZHV4LWZvcm0nKTtcclxuXHJcbnZhciB7QnV0dG9uLCBBbGVydCwgSW5wdXQsIElucHV0R3JvdXAsIElucHV0R3JvdXBBZGRvbiwgRm9ybUZlZWRiYWNrLCBGb3JtR3JvdXAsIEZvcm1UZXh0LCBMYWJlbH0gPSByZXF1aXJlKCdyZWFjdHN0cmFwJyk7XHJcblxyXG5jb25zdCBSZW5kZXJJbnB1dCA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2lucHV0LCBpZCwgdHlwZSwgcGxhY2Vob2xkZXIsIHZhbGlkYXRpb25TdGF0ZX0gPSBwcm9wcztcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIFJlYWN0Ll9fc3ByZWFkKHt9LCBpbnB1dCwgeyBpZDogaWQsIHN0YXRlOiB2YWxpZGF0aW9uU3RhdGUsIHR5cGU6IHR5cGUsIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlciB9KSlcclxuICAgIClcclxufVxyXG5cclxuY29uc3QgUmVuZGVySW5wdXRHcm91cCA9IChwcm9wcykgPT4ge1xyXG4gICAgY29uc3Qge2lucHV0LCBkaXNwbGF5OiB7aWQsIHR5cGUsIGxhYmVsLCBkaXNwbGF5TmFtZSwgcGxhY2Vob2xkZXIsIHByb21wdH0sIG1ldGE6IHt0b3VjaGVkLCBlcnJvciwgd2FybmluZ319ID0gcHJvcHM7XHJcblxyXG4gICAgdmFyIHZhbGlkYXRpb25TdGF0ZSA9IHRvdWNoZWQgPyAoZXJyb3IgPyAnZGFuZ2VyJyA6ICh3YXJuaW5nID8gJ3dhcm5pbmcnIDogJ3N1Y2Nlc3MnKSkgOiB1bmRlZmluZWQ7XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1Hcm91cCwgeyBjb2xvcjogdmFsaWRhdGlvblN0YXRlLCBjbGFzc05hbWU6IFwibWItMVwiIH0sXHJcbiAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXRHcm91cCwgbnVsbCxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXRHcm91cEFkZG9uLCB7IGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7IF9faHRtbDogbGFiZWwgfSB9KSxcclxuICAgICAgICAgICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSW5wdXQsIFJlYWN0Ll9fc3ByZWFkKHt9LCBpbnB1dCwgeyBpZDogaWQsIHN0YXRlOiB2YWxpZGF0aW9uU3RhdGUsIHR5cGU6IHR5cGUsIHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlciA/IHBsYWNlaG9sZGVyIDogZGlzcGxheU5hbWUgfSkpXHJcbiAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgIHByb21wdCAmJiBSZWFjdC5jcmVhdGVFbGVtZW50KEZvcm1UZXh0LCB7IGNvbG9yOiBcIm11dGVkXCIgfSwgcHJvbXB0KSxcclxuICAgICAgICAgICAgdG91Y2hlZCAmJiAoKGVycm9yICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUZlZWRiYWNrLCBudWxsLCBlcnJvcikpIHx8ICh3YXJuaW5nICYmIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRm9ybUZlZWRiYWNrLCBudWxsLCB3YXJuaW5nKSkpXHJcbiAgICAgICAgKVxyXG4gICAgKTtcclxufVxyXG5cclxuY29uc3QgUmVuZGVyQ2hlY2tCb3ggPSAocHJvcHMpID0+IHtcclxuICAgIGNvbnN0IHtpbnB1dCwgZGlzcGxheToge2lkLCBwbGFjZWhvbGRlcn19ID0gcHJvcHM7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxGb3JtR3JvdXAgY2hlY2s+XHJcbiAgICAgICAgICAgIDxMYWJlbCBjaGVjaz5cclxuICAgICAgICAgICAgICAgIDxJbnB1dCB7Li4uaW5wdXR9IGlkPXtpZH0gdHlwZT1cImNoZWNrYm94XCIgY2hlY2tlZD17aW5wdXQudmFsdWV9IC8+XHJcbiAgICAgICAgICAgICAgICA8c3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICB7JyBSZW1lbWJlciBtZSd9XHJcbiAgICAgICAgICAgIDwvTGFiZWw+XHJcbiAgICAgICAgPC9Gb3JtR3JvdXA+XHJcbiAgICApO1xyXG59XHJcblxyXG5jb25zdCByZW5kZXJGaWVsZCA9IHByb3BzID0+IHtcclxuICAgIGNvbnN0IHtkaXNwbGF5OiB7cmVuZGVyVHlwZX19ID0gcHJvcHM7XHJcbiAgICBpZiAocmVuZGVyVHlwZSA9PT0gXCJpbnB1dGdyb3VwXCIpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVySW5wdXRHcm91cChwcm9wcyk7XHJcbiAgICB9IGVsc2UgaWYgKHJlbmRlclR5cGUgPT09ICdmb3JtZ3JvdXAnKSB7XHJcbiAgICAgICAgcmV0dXJuIFJlbmRlckZvcm1Hcm91cChwcm9wcyk7XHJcbiAgICB9IGVsc2UgaWYgKHJlbmRlclR5cGUgPT09ICdjaGVja2JveCcpIHtcclxuICAgICAgICByZXR1cm4gUmVuZGVyQ2hlY2tCb3gocHJvcHMpO1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzdWJtaXQgPSBDb3JlaW4uY29tcG9uZW50cy5mb3JtLnN1Ym1pdCh7XHJcbiAgICB1cmw6ICdsb2dpbicsXHJcbiAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgIHN1Y2Nlc3NBY3Rpb246IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gcmVzcG9uc2UucmVzdWx0O1xyXG59fSk7XHJcblxyXG5jb25zdCBmb3JtID0gKHByb3BzKSA9PiB7XHJcbiAgICBjb25zdCB7IGVycm9yLCBoYW5kbGVTdWJtaXQsIHByaXN0aW5lLCByZXNldCwgc3VibWl0dGluZywgc3VibWl0U3VjY2VlZGVkLCBmaWVsZHMsIGRpc3BsYXkgfSA9IHByb3BzO1xyXG5cclxuICAgIGNvbnN0IGZvcm1GaWVsZHMgPSBbXTtcclxuXHJcbiAgICAkLm1hcChmaWVsZHMsIChwcm9wcywgaW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCB7aW5wdXQ6IHtuYW1lLCB2YWx1ZX0sIGRpc3BsYXl9ID0gcHJvcHM7XHJcbiAgICAgICAgZm9ybUZpZWxkcy5wdXNoKDxGaWVsZCBrZXk9e2luZGV4fSBjb21wb25lbnQ9e3JlbmRlckZpZWxkfSBuYW1lPXtuYW1lfSB2YWx1ZT17dmFsdWV9IGRpc3BsYXk9e2Rpc3BsYXl9IC8+KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPGRpdiBpZD1cIkxvZ2luRm9ybVwiPlxyXG4gICAgICAgICAgICA8Zm9ybSBvblN1Ym1pdD17aGFuZGxlU3VibWl0KHN1Ym1pdCl9IGNsYXNzTmFtZT1cImNhcmQtYmxvY2tcIj5cclxuICAgICAgICAgICAgICAgIDxoMT57ZGlzcGxheS50aXRsZX08L2gxPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1tdXRlZFwiPntkaXNwbGF5LmRlc2NyaXB0aW9ufTwvcD5cclxuICAgICAgICAgICAgICAgIHshc3VibWl0dGluZyAmJiAoZXJyb3IgJiYgPEFsZXJ0IGNvbG9yPVwiZGFuZ2VyXCI+e2Vycm9yfTwvQWxlcnQ+KX1cclxuICAgICAgICAgICAgICAgIHtmb3JtRmllbGRzfVxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17c3VibWl0dGluZ30+e2Rpc3BsYXkuc3VibWl0TGFiZWwgPyBkaXNwbGF5LnN1Ym1pdExhYmVsIDogXCJTdWJtaXRcIn08L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG59O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmb3JtIl19
