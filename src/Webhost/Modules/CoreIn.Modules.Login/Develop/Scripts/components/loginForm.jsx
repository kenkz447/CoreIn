const React = require('react');
const {reduxForm, Field} = require('redux-form');
const $ = require('jquery');
const corein = require('corein');
const renderField = require('corein').renderField;

var {FormFeedback, FormGroup, Label, Button, Input, InputGroup, InputGroupAddon, Alert} = require('reactstrap');

const submit = require('./submit').loginSubmit;

const form = (props) => {
    const { error, handleSubmit, pristine, reset, submitting, submitSucceeded, fields, display } = props;

    const formFields = [];

    $.map(fields, (props, index) => {
        const {input: {name, value}, display} = props;
        formFields.push(<Field key={index} component={renderField} name={name} value={value} display={display} />);
    });

    return (
        <div id="LoginForm">
            <form onSubmit={handleSubmit(submit)} className="card-block">
                <h1>{display.title}</h1>
                <p className="text-muted">{display.description}</p>
                {!submitting && (error && <Alert color="danger">{error}</Alert>)}
                {formFields}
                <div>
                    <Button type="submit" disabled={submitting}>{display.submitLabel ? display.submitLabel : "Submit"}</Button>
                </div>
            </form>
        </div>
    );
};

module.exports = form