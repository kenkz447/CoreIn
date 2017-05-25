const $ = require('jquery');

var { Card, CardBlock, Input, FormFeedback, FormGroup, FormText, Label, Button } = require('reactstrap');

const FileManagerModal = require('../../file-manager/modal');

class ImageField extends React.Component {
    constructor(props) {
        super(props);
    }

    openModal() {
        const { input: {onChange}, fileManagerModalToggle } = this.props;

        fileManagerModalToggle(
            (files) => {
                if (!files.length)
                    return

                var file = files[0];
                onChange(file.meta.src);
            }
        )
    }

    render() {
        const { fieldValidate, input: { value }, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning} } = this.props;
        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;
        var img = value ? value.replace(/\\/g, "/") : "/img/default.png";
        return (
            <FormGroup color={validationState} className="form-member">
                <Label>{title}</Label>
                <Card>
                    <CardBlock>
                        <div className="image-fill" style={{ backgroundImage: `url('${img}')` }} tabIndex="-1" onClick={this.openModal.bind(this)} />
                    </CardBlock>
                </Card>
                {prompt && <FormText color="muted">{prompt}</FormText>}
                {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
            </FormGroup>
        );
    }
}

module.exports = ImageField;