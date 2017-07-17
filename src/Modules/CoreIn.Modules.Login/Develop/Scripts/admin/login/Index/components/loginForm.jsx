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
        <FormGroup check>
            <Label check>
                <Input {...input} id={id} type="checkbox" checked={input.value} />
                <span></span>
                {' Remember me'}
            </Label>
        </FormGroup>
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
        formFields.push(<Field key={index} component={renderField} name={name} value={value} display={display} />);
    });

    return (
        <div id="LoginForm">
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
    );
};

module.exports = form