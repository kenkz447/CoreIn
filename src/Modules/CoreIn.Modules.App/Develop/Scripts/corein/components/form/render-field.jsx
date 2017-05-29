const { Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const ImageField = require('./fields/image');
const CheckboxList = require('./fields/checkboxlist');
const Select = require('./fields/select');
const Editor = require('./fields/editor');
const FormInput = require('./fields/input');
const Text = require('./fields/text');

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

function renderField(props) {
    const { display, status } = props;

    if (!display)
        return null;

    switch (display.renderType) {
        case 'Image':
            return <ImageField {...props} />
        case 'InputGroup':
            return RenderInputGroup(props);
        case 'Checkbox':
            return RenderCheckBox(props);
        case 'CheckboxList':
            return <CheckboxList {...props} />;
        case 'Select':
            return <Select {...props} />
        case 'Editor':
            return <Editor {...props} />
        case 'Text':
            return <Text {...props} />
        default:
            return <FormInput {...props} />;
    }
};

module.exports = {
    renderField
}
