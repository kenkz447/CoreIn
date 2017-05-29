const $ = require('jquery');

var { Card, CardBlock, Input, FormFeedback, FormGroup, FormText, Label, Button } = require('reactstrap');

const FileManagerModal = require('../../file-manager/modal');

class ImageField extends React.Component {
    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);
        this.renderImageInfo = this.renderImageInfo.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
    }

    onSelectClick(e) {
        const { input: { onChange }, fileManagerModalToggle } = this.props;

        fileManagerModalToggle(
            (files) => {
                if (!files.length)
                    return;
                onChange(files[0]);
            }
        );
        e.preventDefault();
    }

    renderImageInfo() {
        const { input: { value } } = this.props;
        return (
            <div className="field-image-info">
                <div className="mb-h">
                    Url: <strong>{value.url}</strong>
                </div>
                <div className="mb-h">
                    Dimension: <strong>{value.dimension}</strong>
                </div>
                <div className="mb-h">
                    Size: <strong>{value.size}</strong>
                </div>
            </div>          
            );
    }

    renderImage() {
        const { input: { value } } = this.props;
        var img = (value && value.url) ? `/${value.url}` : "/img/default.png";

        return (
            <div className="d-flex">
                <div className="image-fill d-inline-block" style={{ backgroundImage: `url('${img}')` }} tabIndex="-1"  />
                {
                    <div className="d-inline-block ml-1">
                        <div className="mb-h">
                            <a href="#" onClick={this.onSelectClick}>Select...</a>
                        </div>
                        {value && this.renderImageInfo()}
                    </div>
                }
            </div>          
            );
    }

    render() {        const { isChildField, fieldValidate, input: { value }, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning} } = this.props;
        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;
        return (
            <FormGroup color={validationState} className="form-member">
                <Label>{title}</Label>
                {
                    isChildField ? this.renderImage() :
                        <Card>
                            <CardBlock>
                                {this.renderImage()}
                            </CardBlock>
                        </Card>
                }
                {prompt && <FormText color="muted">{prompt}</FormText>}
                {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
            </FormGroup>
        );
    }
}

module.exports = ImageField;