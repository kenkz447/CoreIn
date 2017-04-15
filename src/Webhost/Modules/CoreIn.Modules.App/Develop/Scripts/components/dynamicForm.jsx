const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, Field, FieldArray} = require('redux-form');
const renderField = require('./formField.jsx');
const { FormGroup, Label, Input } = require('reactstrap');
const { Alert, Button } = require('reactstrap');

const CheckBoxNode = (props) => {
    const { childrenTerms, level, taxonomyName } = props;
    var a = global.jQuery.map(childrenTerms,
        (term, index) => {
            const display = {
                renderType: 'checkbox',
                title: term.title
            }
            const taxName = `${taxonomyName}.${term.name}`;

            return (
                <div check key={index} className={`pl-${level}`}>
                    <Field component={renderField} type="checkbox" display={display} name={taxName}/>
                    {term.childrenTerms &&
                        <CheckBoxNode level={level + 1} childrenTerms={term.childrenTerms} taxonomyName={taxonomyName}/>}
                </div>);
        });

    return <div className={`checkboxlist-${level === 0 ? 'root' : 'node'}`}>{a}</div>;
};

const CheckboxList = (props) => {
    const { terms, taxonomyName, label } = props;
    return (
        <div className="checkboxlist">
            <h4>{label}</h4>
            {terms && <CheckBoxNode childrenTerms={terms} taxonomyName={taxonomyName} level={0}/>}
        </div>);
};

const CHECKBOXLIST = 'checkboxlist';

const TaxonomyFields = (props) => {
    const { renderType, terms, taxonomyName, label  } = props;
    switch (renderType) {
        default:
            return <CheckboxList terms={terms} taxonomyName={taxonomyName} label={label} />;
    }
};

const DynamicForm = (props) => {
    const { formName, formData, close, error, handleSubmit, pristine, reset, submitting, submitSucceeded, display } = props;

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
                    formData.taxonomies && 
                    <div className="taxonomies">
                        {
                            formData.taxonomies.map((props, index) => {
                                return <TaxonomyFields key={index} renderType={props.renderType} taxonomyName={`taxonomies.${props.input.name}`} label={props.display.label} terms={props.terms} />;
                            })
                        }
                    </div>
                }
                <hr/>
                <div className="actions">
                    <Button className="mr-1" color="primary" type="submit" disabled={submitting}>{display ? display.submitLabel : "Submit"}</Button>
                    {
                        close && <Button type="Button" onClick={() => { close(formName);}} disabled={submitting}>{display ? display.dismissForm : "Cancel"}</Button>
                    }
                </div>
            </form>
        </div>
    );
};

module.exports = DynamicForm;