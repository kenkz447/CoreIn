const React = require('react');
const {reduxForm, Field} = require('redux-form');
const {SubmissionError} = require('redux-form');
const FlipCard = require('react-flipcard');
const $ = require('jquery');

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
        React.createElement(FormGroup, { check: true },
            React.createElement(Label, { check: true },
                React.createElement(Input, React.__spread({}, input, { id: id, type: "checkbox" })),
                ' ' + placeholder
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
    url: 'register',
    method: 'POST',
    successAction: (response) => {
        global.registerSuccessReturnUrl = response.result;
    }
});

const registerForm = (props) => {
    const { error, handleSubmit, pristine, reset, submitting, submitSucceeded, fields, display, resources } = props;

    const formFields = [];

    $.map(fields, (props, index) => {
        const {input: {name, value}, display} = props;
        formFields.push(<Field key={index} component={renderField} name={name} value={value} display={display}/>);
    });

    return (
        <div id="RegisterForm">
            <FlipCard disabled={true} flipped={submitSucceeded}>
                <div className="card">
                    <form onSubmit={handleSubmit(submit)} className="card-block">
                        <h1>{display.title}</h1>
                        <p className="text-muted">{display.description}</p>
                        {!submitting && (error && <Alert color="danger">{error}</Alert>)}
                        {formFields}
                        <div>
                            <Button type="submit" disabled={submitting}>{display.submitLabel ? display.submitLabel : "Submit"}</Button>
                        </div>
                    </form>
                </div>
                <div className="card">
                    <div className="card-block d-flex align-items-center">
                        <div className="flex-column text-center">
                            <div>
                                <h3>{display.successMessageTitle}</h3>
                                <p>{display.successMessage}</p>
                            </div>
                            <a href={global.registerSuccessReturnUrl} className="btn btn-success mx-center">{display.loginBtnLabel}</a>
                        </div>
                    </div>
                </div>
            </FlipCard> 
        </div>
    );
};

module.exports = registerForm