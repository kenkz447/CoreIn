const $ = require('jquery');
const { loadEntityTypes, entityTypeChange, newTaxonomyFormChange, newTaxonomy } = require('../redux/tu-actions');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { form, TabControl, tabControlActions: { tabChange, tabAdd } } = Corein.components;
const { getNewTaxonomyForm } = require('../redux/tu-ajaxs');
const { Label } = require('reactstrap');
const { reduxForm } = require('redux-form');
const { newTaxonomySubmit } = require('../redux/tu-formSubmits');

const ActionTabControl = (props) => {
    const { taxonomyTypeChanged, currentTaxonomyType, newTaxonomyFormChange, activeTab, tabs, tabAdd, tabChange, newTaxonomy } = props;

    if (!currentTaxonomyType)
        return null;

    if (taxonomyTypeChanged) {
        getNewTaxonomyForm((formResult) => {
            const vatidateData = { details: formResult.details, meta: formResult.meta };
            const validate = form.validator(vatidateData);

            var submit = newTaxonomySubmit({ newTaxonomy});

            const _initialValues = formResult.initialValues;

            const formProps = {
                form: 'newTaxonomy',
                validate, formData: formResult,
                _initialValues,
                onSubmit: submit
            };

            tabAdd('new-tax', `New ${currentTaxonomyType.title}`, <form.default {...formProps}/>);
            newTaxonomyFormChange();
        }, currentTaxonomyType.id);
    }
    return (
        <div className="card">
            <TabControl activeTab={activeTab} tabs={tabs} tabChange={tabChange} />
        </div>
    );
};

const stateToProps = (state) => ({
    taxonomyTypeChanged: state.tu.taxonomyTypeChanged,
    currentTaxonomyType: state.tu.current.taxonomyType,
    activeTab: state.tc.active,
    tabs: state.tc.tabs
});

const reducerToProps = (reducer) => (
    bindActionCreators({ newTaxonomyFormChange, tabChange, tabAdd, newTaxonomy }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ActionTabControl);


