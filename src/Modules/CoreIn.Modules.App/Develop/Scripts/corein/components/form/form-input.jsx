const $ = require('jquery');
const shallowCompare = require('react-addons-shallow-compare');

const {Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button} = require('reactstrap');
const {Editor} = require('react-draft-wysiwyg');
const draftToHtml = require('draftjs-to-html').default;
const { convertToRaw, EditorState, ContentState } = require('draft-js');
const htmlToDraft = require('html-to-draftjs').default;

class FormInput extends React.Component {
    constructor(props) {
        super(props);
        const { input: { value }, display: { type }} = props;
        this.actionBtnClick = this.actionBtnClick.bind(this);
        this.renderActions = this.renderActions.bind(this);
        this.editorStateChange = this.editorStateChange.bind(this);

        const state = {};
        if (type === "textarea" && value) {
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

    renderActions() {
        const { actions } = this.props;

        if (!actions)
            return null;

        return (
            <InputGroupButton>
                {actions.map(props => {
                    const {title, command} = props;
                    return <Button key={command} type="button" color="secondary" onClick={() => { this.actionBtnClick(command); }}>{title}</Button>
                })}
            </InputGroupButton>
        );
    }

    actionBtnClick(command) {
        const { executeFormAction } = this.props;

        executeFormAction(command, this.props);
    }

    render() {
        const {input, fieldValidate, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status} = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

        return (
            <FormGroup color={validationState} className="form-member">
                {title && <Label for={id} dangerouslySetInnerHTML={{ __html: title }} />}
                {
                    type === "textarea" ?
                        <Editor
                            editorState={this.state.editorState}
                            editorClassName="editor"
                            onEditorStateChange={this.editorStateChange}
                            onBlur={(e, editorState) => {
                                const value = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()));
                                input.onChange(value);
                            }}
                        /> :
                        <InputGroup>
                            <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder ? placeholder : displayName} readOnly={status === 'ReadOnly'} />
                            {this.renderActions()}
                        </InputGroup>
                }
                {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
                {prompt && <FormText color="muted">{prompt}</FormText>}
            </FormGroup>
        );
    }
}

module.exports = FormInput;