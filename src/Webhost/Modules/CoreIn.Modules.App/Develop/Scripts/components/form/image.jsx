var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const FileManagerModal = require('../file-manager/modal');

class ImageField extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            img: null,
        }
    }

    openModal() {
        const { input: {onChange}, fileManagerModalToggle } = this.props;

        fileManagerModalToggle(
            (files) => {
                if (!files.length)
                    return

                var file = files[0];
                this.setState({ img: file.meta.src_thumb });
                onChange(file.meta.src);
            }
        )
    }

    render() {
        const { fieldValidate, input, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning} } = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

        return (
            <FormGroup color={validationState} className="form-member">
                <Label>{title}</Label>
                <div>
                    {
                        this.state.img &&
                            <img src={this.state.img }/>
                    }
                </div>
                {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
                {prompt && <FormText color="muted">{prompt}</FormText>}

                <Button color="link" onClick={this.openModal.bind(this) }>Select image</Button>
            </FormGroup>
        );
    }
}

module.exports = ImageField;