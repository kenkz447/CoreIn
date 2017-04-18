const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, Field, FieldArray} = require('redux-form');
const renderField = require('./formField.jsx');
const { FormGroup, Label, Input } = require('reactstrap');
const { Alert, Button } = require('reactstrap');
const listToTree = require('list-to-tree');

class CheckboxList extends React.Component {
    constructor(props) {
        super();
        this.renderNode = this.renderNode.bind(this);
    }

    renderNode(node) {
        const {taxonomyName} = this.props;
        return (
            <div key={node.id} className="item">
                <Field component={renderField} display={{ renderType: 'checkbox', title: node.title }} name={`${taxonomyName}.${node.id}`} />
                {node.children &&
                    <div className="children">
                        {
                        $.map(node.children, (node) => {
                                return this.renderNode(node);
                            })
                        }
                    </div>
                }
            </div>            
            );
    }

    render() {
        const { taxonomies, taxonomyName, title } = this.props;

        const ltt = new listToTree(taxonomies, {
            key_id: 'id',
            key_parent: 'parentId',
            key_child: 'children'
        });

        const tree = ltt.GetTree();

        return (
            <div className="checkbox-list">
                <h4>{title}</h4>
                {tree &&
                    <div className="items">
                    {
                        $.map(tree, (node) => {
                            return this.renderNode(node);
                        })
                    }
                    </div>
                }
            </div>);
    };
};

const CHECKBOXLIST = 'checkboxlist';

const TaxonomyFields = (props) => {
    const { renderType } = props;
    switch (renderType) {
        default:
            return <CheckboxList {...props} />
    }
};

const DynamicForm = (props) => {
    const { formName, formData, onClose, error, handleSubmit, pristine, reset, submitting, submitSucceeded, display } = props;

    return (
        <div className="dynamic-form card-block">
            <form onSubmit={handleSubmit}>
                {display && <h1>{display.title}</h1>}
                {display && <p className="text-muted">{display.description}</p>}
                
                {!submitting && (error && <Alert color="danger">{error}</Alert>)}

                {
                    formData.meta &&
                    <div className="meta">
                        {formData.meta.map((props, index) => {
                            const {readonly, input: {name, value}, display, status} = props;
                            return <Field key={index} component={renderField} readOnly={readonly} name={`meta.${name}`} value={value} display={display} status={status} />;
                        })}
                    </div>
                }

                {
                    formData.details && 
                    <div className="details">
                        {formData.details.map((props, index) => {
                            const {readonly, input: {name, value}, display, status} = props;
                            return <Field key={index} component={renderField} readOnly={readonly} name={`details.${name}`} value={value} display={display} status={status}/>;
                        })}
                    </div>
                }

                {
                    formData.taxonomyTypes && 
                    <div className="taxonomies">
                        {
                            formData.taxonomyTypes.map((props) => {
                                const { typeId, input: {name}, display: {renderType, title}, taxonomies} = props;
                                return <TaxonomyFields key={typeId} renderType={renderType} taxonomyName={`taxonomyTypes.${typeId}`} title={title} taxonomies={taxonomies} />;
                            })
                        }
                    </div>
                }
                <hr/>
                <div className="actions">
                    <Button className="mr-1" color="primary" type="submit" disabled={submitting}>{display ? display.submitLabel : "Submit"}</Button>
                    {
                        onClose && <Button type="Button" onClick={onClose} disabled={submitting}>{display ? display.dismissForm : "Cancel"}</Button>
                    }
                </div>
            </form>
        </div>
    );
};

module.exports = DynamicForm;