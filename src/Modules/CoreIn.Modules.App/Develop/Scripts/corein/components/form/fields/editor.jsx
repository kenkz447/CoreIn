const $ = require('jquery');
const { TabContent, TabPane, Nav, NavItem, NavLink, Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button } = require('reactstrap');
const CodeMirror = require('react-codemirror');
const { Editor } = require('react-draft-wysiwyg');
const { stateToHTML } = require('draft-js-export-html');

const classnames = require('classnames')
const { convertToRaw, EditorState, ContentState, convertFromHTML } = require('draft-js');
const htmlToDraft = require('html-to-draftjs').default;

const blockRenderMap = {
    'unstyled': {
        element: 'div'
    }
}

class FormInput extends React.Component {
    constructor(props) {
        super(props);
        const { input: { value }, display: { type } } = props;
        this.editorStateChange = this.editorStateChange.bind(this);
        this.toggle = this.toggle.bind(this);

        const state = {
            activeTab: '1',
        };

        if (value) {
            if (value) {
                state.editorState = this.htmlToEditorState(value);
            }
            else {
                state.editorState = EditorState.createEmpty();
            }
        }
        this.state = state;
    }

    editorStateChange(editorState) {
        const contentState = editorState.getCurrentContent();
        const html = stateToHTML(contentState);
        this.props.input.onChange(html)
        this.setState({ editorState: this.htmlToEditorState(html)  });
    }

    htmlToEditorState(value) {
        //let blocksFromHtml = htmlToDraft(value);
        //let contentBlocks = blocksFromHtml.contentBlocks;
        const blocksFromHTML = convertFromHTML(value);
        const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
        const editorState = EditorState.createWithContent(contentState);
        return editorState
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            const newState = {
                activeTab: tab,
            }

            if (tab === '1')
                newState.editorState = this.htmlToEditorState(this.props.input.value || '<p></p>')

            this.setState(newState);
        }
    }

    render() {
        const { input, fieldValidate, display: { id, type, title, displayName, placeholder, prompt }, meta: { touched, error, warning }, status } = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning && 'warning')) : null;

        return (
            <div>
                <Nav tabs>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggle('1'); }} >
                            Article
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggle('2'); }} >
                            Html
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={this.state.activeTab}>
                    <TabPane tabId="1">
                        <FormGroup color={validationState} className="form-member">
                            {title && <Label for={id} dangerouslySetInnerHTML={{ __html: title }} />}

                            <Editor
                                placeholder={placeholder}
                                editorState={this.state.editorState}
                                editorClassName="editor"
                                onEditorStateChange={this.editorStateChange}
                            />
                            {prompt && <FormText color="muted">{prompt}</FormText>}
                            {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
                        </FormGroup>
                    </TabPane>
                    <TabPane tabId="2">
                        {
                            this.state.activeTab === '2' && <CodeMirror className="CodeMirror cm-s-default" options={{}} value={this.props.input.value} onChange={(newValue) => { input.onChange(newValue) }} />

                        }
                    </TabPane>
                </TabContent>
            </div>

        );
    }
}

FormInput.defaultProps = {

}

module.exports = FormInput;