const { Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const FormInput = require('./form-input');
const ImageField = require('./image');
const CheckboxList = require('./fields/checkboxlist');
const Select = require('./fields/select');

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

const RenderHidden = (props) => {
    const {input} = props;
    return (
        <input {...input} type="hidden" />
    );
}

function renderField(props) {
    const {display, status } = props;

    if (status && status.toLowerCase() == 'hidden')
        return RenderHidden(props);

    var rt = display.renderType.toLowerCase();
    switch (rt) {
        case 'image':
            return <ImageField {...props} />
        case 'inputgroup':
            return RenderInputGroup(props);
        case 'checkbox':
            return RenderCheckBox(props);
        case 'checkboxlist':
            return <CheckboxList {...props} />;
        case 'select':
            return <Select {...props} />
        default:
            return <FormInput {...props} />;
    }
};

module.exports = {
    renderField
}
