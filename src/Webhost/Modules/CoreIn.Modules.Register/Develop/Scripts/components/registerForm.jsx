const React = require('react');
const {reduxForm, Field} = require('redux-form');
const {FormFeedback, FormGroup, Label, Button, Input, InputGroup, InputGroupAddon, Alert} = require('reactstrap');
const {SubmissionError} = require('redux-form');
const FlipCard = require('react-flipcard');
const $ = require('jquery');
const corein = require('corein');
const renderField = require('corein').renderField;

const submit = require('./submit').registerSubmit;

const registerForm = (props) => {
    const { error, handleSubmit, pristine, reset, submitting, submitSucceeded, fields, display, resources } = props;

    const formFields = [];

    $.map(fields, (props, index) => {
        const {input: {name, value}, display} = props;
        formFields.push(<Field key={index} component={renderField} name={name} value={value} display={display}/>);
    });

    return (
        <div id="RegisterForm">
            <FlipCard disabled={true} flipped={submitSucceeded}>
                <div className="card">
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
                <div className="card">
                    <div className="card-block d-flex align-items-center">
                        <div className="flex-column text-center">
                            <div>
                                <h3>{display.successMessageTitle}</h3>
                                <p>{display.successMessage}</p>
                            </div>
                            <a href={global.registerSuccessReturnUrl} className="btn btn-success mx-center">{display.loginBtnLabel}</a>
                        </div>
                    </div>
                </div>
            </FlipCard> 
        </div>
    );
};

module.exports = registerForm