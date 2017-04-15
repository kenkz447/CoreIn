const $ = require('jquery');
const { loadEntityTypes, entityTypeChange, newTaxonomyFormChange, newTaxonomy } = require('../redux/tu-actions');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { TabControl, tabControlActions: { tabChange, tabAdd } } = require('corein');
const { getNewTaxonomyForm } = require('../redux/tu-ajaxs');
const { Label } = require('reactstrap');
const { reduxForm } = require('redux-form');
const { newTaxonomySubmit } = require('../redux/tu-formSubmits');
const { dynamicFormValidator } = require('corein');

const { DynamicForm } = require('corein');

const TaxonomyList = (props) => {
    const { taxonomyTypeChanged, currentTaxonomyType, newTaxonomyFormChange, activeTab, tabs, tabAdd, tabChange, newTaxonomy } = props;

    if (!currentTaxonomyType)
        return null;

    if (taxonomyTypeChanged) {
        getNewTaxonomyForm((formResult) => {
            const vatidateData = { details: formResult.details, meta: formResult.meta };
            const validate = dynamicFormValidator(vatidateData);
            const ReduxDynamicForm = reduxForm({ form: 'newTaxonomy', validate, formData: formResult, initialValues: formResult.initialValues })(DynamicForm);

            var submit = newTaxonomySubmit({newTaxonomy});
            tabAdd('new-tax', `New ${currentTaxonomyType.title}`, <ReduxDynamicForm onSubmit={submit}/>);
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

module.exports = connect(stateToProps, reducerToProps)(TaxonomyList);


