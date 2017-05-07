const $ = require('jquery');
const shallowCompare = require('react-addons-shallow-compare');

const {Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button} = require('reactstrap');

class FormInput extends React.Component {
    constructor(props) {
        super();
        this.actionBtnClick = this.actionBtnClick.bind(this);
        this.renderActions = this.renderActions.bind(this);
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
                <InputGroup>
                    <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder ? placeholder : displayName} readOnly={status === 'ReadOnly'} />
                    {this.renderActions()}
                </InputGroup>
                {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
                {prompt && <FormText color="muted">{prompt}</FormText>}
            </FormGroup>
        );
    }
}

module.exports = FormInput;

    //(props) => {
    //    const {input, fieldValidate, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status, actions, executeFormAction} = props;

    //    var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    //    return (
    //        <FormGroup color={validationState} className="form-member">
    //            {title && <Label for={id} dangerouslySetInnerHTML={{ __html: title }} />}
    //            <InputGroup>
    //                <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder ? placeholder : displayName} readOnly={status === 'ReadOnly'} />
    //                {
    //                    actions &&
    //                    <InputGroupButton>
    //                        {actions.map(props => {
    //                            const {title, command} = props;
    //                            return <Button key={command} type="button" color="secondary"
    //                                onClick={() => {
    //                                    executeFormAction(command, props);
    //                                }
    //                                }>{title}</Button>
    //                        })}
    //                    </InputGroupButton>
    //                }
    //            </InputGroup>
    //            {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
    //            {prompt && <FormText color="muted">{prompt}</FormText>}
    //        </FormGroup>
    //    );
    //};