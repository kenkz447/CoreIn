var React = require('react');
var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return (
        <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder}/>
    );
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        <FormGroup color={validationState} className="mb-1">
            <InputGroup>
                <InputGroupAddon dangerouslySetInnerHTML={{ __html: title }} />
                <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder ? placeholder : displayName} readOnly={status === 'ReadOnly'} />
            </InputGroup>
            {prompt && <FormText color="muted">{prompt}</FormText>}
            {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
        </FormGroup>
    );
}

const RenderFormGroup = (props) => {
    const {input, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        <FormGroup color={validationState} className="mb-1">
            <Label for={id} dangerouslySetInnerHTML={{ __html: title }}/>
            <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder ? placeholder : displayName} readOnly={status === 'ReadOnly'} />
            {prompt && <FormText color="muted">{prompt}</FormText>}
            {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
        </FormGroup>
    );
}

const RenderCheckBox = (props) => {
    const {input, display: {id, title, placeholder}} = props;
    return (
        <FormGroup check>
            <Label check>
                <Input {...input} id={id} type="checkbox" checked={input.value} />
                {' ' + (title ? title : placeholder)}
            </Label>
        </FormGroup>
    );
}

const RenderHidden = (props) => {
    const {input} = props;
    return (
        <input {...input} type="hidden" />
    );
}

const renderField = props => {
    const {display, status } = props;

    if (status && status.toLowerCase() == 'hidden')
        return RenderHidden(props);

    var rt = display.renderType.toLowerCase();
    switch (rt) {
        case 'inputgroup':
            return RenderInputGroup(props);
        case 'checkbox':
            return RenderCheckBox(props);
        default:
            return RenderFormGroup(props);
    }
}

module.exports = renderField;