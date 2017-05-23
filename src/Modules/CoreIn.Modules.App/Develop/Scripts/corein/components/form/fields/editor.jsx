const $ = require('jquery');
const { Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button } = require('reactstrap');

const { Editor } = require('react-draft-wysiwyg');
const draftToHtml = require('draftjs-to-html').default;

const { convertToRaw, EditorState, ContentState } = require('draft-js');
const htmlToDraft = require('html-to-draftjs').default;

class FormInput extends React.Component {
    constructor(props) {
        super(props);
        const { input: { value }, display: { type } } = props;
        this.editorStateChange = this.editorStateChange.bind(this);

        const state = {};
        if (value) {
            if (value) {
                let blocksFromHtml = htmlToDraft(value);
                let contentBlocks = blocksFromHtml.contentBlocks;
                let contentState = ContentState.createFromBlockArray(contentBlocks);
                let editorState = EditorState.createWithContent(contentState);
                state.editorState = editorState;
            }
            else {
                state.editorState = EditorState.createEmpty();
            }
        }
        this.state = state;
    }

    editorStateChange(editorState) {
        this.setState({ editorState });
    }

    render() {
        const { input, fieldValidate, display: { id, type, title, displayName, placeholder, prompt }, meta: { touched, error, warning }, status } = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning && 'warning')) : null;

        return (
            <FormGroup color={validationState} className="form-member">
                {title && <Label for={id} dangerouslySetInnerHTML={{ __html: title }} />}

                <Editor
                    placeholder={placeholder}
                    editorState={this.state.editorState}
                    editorClassName="editor"
                    onEditorStateChange={this.editorStateChange}
                    onBlur={(e, editorState) => {
                        const value = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
                        input.onChange(value);
                    }}
                />
                {prompt && <FormText color="muted">{prompt}</FormText>}
                {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
            </FormGroup>
        );
    }
}

module.exports = FormInput;