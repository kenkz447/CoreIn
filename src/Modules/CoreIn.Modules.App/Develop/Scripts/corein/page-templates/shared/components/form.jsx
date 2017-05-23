﻿const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, getFormValues } = require('redux-form');
const { Row, Col, Input, Button } = require('reactstrap');

const alerts = require('../../../components/page-alerts');
const DynamicForm = require('../../../components/dynamic-form');
const validator = require('../../../components/form/validator');
const submit = require('../../../components/form/submit');
const LanguageSelect = require('../../../components/form/language-select');

const keys =  {
    loadNewForm: "LOAD_NEW_FORM",
};

const actions = {
    loadNewForm: (formData) => ({
        type: keys.loadNewForm,
        formData
    })
};

const initialState = {
    formData: null,
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formTitle = action.formData.title;
            newState.formLanguages = action.formData.languages;
            newState.formDefaultLanguage = action.formData.defaultLanguage;

            const newFormData = $.extend(true, {}, action.formData);
            delete newFormData.languages;
            delete newFormData.title;
            newState.formData = newFormData;

            break;
        default:
            return state;
    }
    return newState;
};

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        return {
        };
    }

    getForm() {
        const { loadNewForm, formUrl, formUrlData, } = this.props;

        $.get(formUrl, formUrlData, (formResult) => {
            loadNewForm(formResult);
        });

        return null;
    }

    render() {
        const { commands, formData, formTitle, formLanguages, formDefaultLanguage, formName, formSubmitData, alertPush } = this.props;

        if (!formData)
            return this.getForm();

        const validate = validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate, alertPush }, formSubmitData);

        const reduxFormProps = {
            form: 'create',
            formData,
            commands: this.getCommands(),
            onSubmit: submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            <div>
                <Row className="mb-1">
                    {
                        formTitle && 
                        <Col md="8">
                            <div className="card-text">
                                <h4>
                                    {formTitle}
                                </h4>
                            </div>
                        </Col>
                    }

                    {
                        formLanguages && 
                        <Col md="4">
                            <LanguageSelect languages={formLanguages} defaultLanguage={formDefaultLanguage}/>
                        </Col>
                    }
                </Row>
                <DynamicForm {...reduxFormProps} />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return state.mainForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, alertPush: alerts.actions.push }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(Form),
    actions,
    reducer
};