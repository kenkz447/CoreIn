(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
    index: require('./taxonomy-UI/index')
}

},{"./taxonomy-UI/index":2}],2:[function(require,module,exports){
const { combineReducers, createStore } = require('redux');
const { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: {fmReducer} } = Corein.components;

const tuReducer = require('./index/redux/tu-reducer');
const EntityTypeList = require('./index/components/tu-taxonomyTypeList');
const Tabs = require('./index/components/tu-actionTabControl');
const TaxonomyTree = require('./index/components/tu-taxonomyList');

const reducers = {
    fm: fmReducer,
    form: formReducer,
    tu: tuReducer,
    tc: tabControlReducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement("div", {className: "row"}, 
                React.createElement("div", {className: "col-sm-6 col-md-4"}, 
                    React.createElement(EntityTypeList, null)
                ), 
                React.createElement("div", {className: "col-sm-6 col-md-4"}, 
                    React.createElement(TaxonomyTree, null)
                ), 
                React.createElement("div", {className: "col-sm-6 col-md-4"}, 
                    React.createElement(Tabs, null)
                )
            )
        )
    );
}

},{"./index/components/tu-actionTabControl":3,"./index/components/tu-taxonomyList":4,"./index/components/tu-taxonomyTypeList":5,"./index/redux/tu-reducer":10,"react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],3:[function(require,module,exports){
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
            const ReduxDynamicForm = reduxForm({ form: 'newTaxonomy', validate, formData: formResult, initialValues: formResult.initialValues })(form.default);

            var submit = newTaxonomySubmit({newTaxonomy});
            tabAdd('new-tax', `New ${currentTaxonomyType.title}`, React.createElement(ReduxDynamicForm, {onSubmit: submit}));
            newTaxonomyFormChange();
        }, currentTaxonomyType.id);
    }
    return (
        React.createElement("div", {className: "card"}, 
            React.createElement(TabControl, {activeTab: activeTab, tabs: tabs, tabChange: tabChange})
        )
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




},{"../redux/tu-actions":6,"../redux/tu-ajaxs":7,"../redux/tu-formSubmits":8,"classnames":"4z/pR8","jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","redux-form":"LVfYvK"}],4:[function(require,module,exports){
(function (global){
﻿const _ = require('underscore');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const classnames = require('classnames');
const Tree = require('react-ui-tree');
const ajaxs = require('../redux/tu-ajaxs');
const { form, tabControlActions: { tabRemove, tabAdd } } = Corein.components;
const { loadTaxonomies, taxonomyClick, taxonomySelect, taxonomiesDeleted, taxonomiesUpdating, taxonomiesUpdated, taxonomyUpdated, componentLoaded} = require('../redux/tu-actions');
const listToTree = require('list-to-tree');
const { Button, ButtonGroup } = require('reactstrap');
const { reduxForm } = require('redux-form');
const {updateTaxonomySubmit} = require('../redux/tu-formSubmits');


const componentName = "taxonomyList";

class TaxonomyTypeList extends React.Component {
    constructor(props) {
        super();
        this.loaded = false;

        this.convertTreeToList = this.convertTreeToList.bind(this);
        this.onTaxonomyUpdate = this.onTaxonomyUpdate.bind(this);
        this.onTaxonomyEditing = this.onTaxonomyEditing.bind(this);
        this.onTaxonomyNodeClick = this.onTaxonomyNodeClick.bind(this);
    }

    visitNode(node, hashMap, array) {
        if (!hashMap[node.id]) {
            hashMap[node.id] = true;
            array.push(node);
        }
    }

    convertTreeToList(root) {
        var stack = [], array = [], hashMap = {};
        stack.push(root);

        var currentParent = root;
        while (stack.length !== 0) {
            var node = stack.pop();
            var notRoot = node.id && true;

            if (!node.children) {
                this.visitNode(node, hashMap, array);
            } else {
                if (notRoot)
                    array.push(node);
                for (var i = node.children.length - 1; i >= 0; i--) {
                    node.children[i].parentId = node.id
                    stack.push(node.children[i]);
                }
            }
        }

        return array;
    }

    renderNode(node) {
        const { currentTaxonomy, taxonomySelect, selectedTaxonomies} = this.props;
        var isActive = (currentTaxonomy && (node.id === currentTaxonomy.id));
        var isChecked = _.findWhere(selectedTaxonomies, { id: node.id }) && true;
        return (
            React.createElement("div", {className: classnames('node', { 'active': isActive }), onClick: () => { this.onTaxonomyNodeClick(node) }}, 
                node.id && React.createElement("input", {type: "checkbox", checked: isChecked, onClick: () => { taxonomySelect(node.id && node); }}), 
                React.createElement("span", null, 
                    node.title
                )
            )
        );
    }

    onTaxonomyNodeClick(node) {
        const { taxonomyClick } = this.props;
        taxonomyClick(node.id && node);
    }

    onTaxonomyUpdate() {
        const { taxonomies, taxonomiesUpdating, taxonomiesUpdated } = this.props;
        taxonomiesUpdating();
        ajaxs.updateTaxonomies(taxonomiesUpdated, taxonomies);
    }

    onTaxonomyEditing() {
        const {tabAdd, tabRemove, currentTaxonomy, taxonomyUpdated} = this.props;
        ajaxs.getTaxonomyFormFor((formResult) => {
            const vatidateData = { details: formResult.details, meta: formResult.meta };
            const validate = form.validator(vatidateData);
            const ReduxDynamicForm = reduxForm({ form: 'edit-taxonomy', validate, formData: formResult, initialValues: formResult.initialValues })(form.default);

            var submit = updateTaxonomySubmit({ successAction: taxonomyUpdated });

            tabRemove('edit-taxonomy');
            tabAdd('edit-taxonomy', `${currentTaxonomy.title}`, React.createElement(ReduxDynamicForm, {onSubmit: submit}));
        }, currentTaxonomy.id);
    }

    render() {
        const { componentLoaded, taxonomies, currentTaxonomy, currentTaxonomyType, loadTaxonomies, taxonomiesChanged, taxonomiesDeleted, selectedTaxonomies, isTaxonomiesUpdating } = this.props;

        if (!currentTaxonomyType || taxonomies == null)
            return null;

        global.selectedTaxonomyId = currentTaxonomy ? currentTaxonomy.id : null;

        if (taxonomies.length === 0) {
            ajaxs.getTaxonomies((taxonomiesResult) => {
                loadTaxonomies(taxonomiesResult);
            }, currentTaxonomyType.id)
            this.loaded = true;
            return null;
        }

        const ltt = new listToTree(taxonomies, {
            key_id: 'id',
            key_parent: 'parentId',
            key_child: 'children'
        });

        const taxonomyTree = { title: currentTaxonomyType.title, children: ltt.GetTree() };

        return (
            React.createElement("div", {className: "card"}, 
                React.createElement("div", {className: "card-block"}, 
                    React.createElement(ButtonGroup, null, 
                        React.createElement(Button, {type: "button", disabled: !currentTaxonomy && true, onClick: this.onTaxonomyEditing}, "Edit"), 
                        React.createElement(Button, {type: "button", disabled: isTaxonomiesUpdating, onClick: this.onTaxonomyUpdate}, "Update"), 
                        React.createElement(Button, {type: "button", disabled: selectedTaxonomies.length === 0, onClick: () => { ajaxs.deleteTaxonomies(taxonomiesDeleted, selectedTaxonomies.map((taxonomy) => (taxonomy.id))) }}, "Delete")
                    ), 
                    React.createElement("hr", null), 
                    React.createElement(Tree, {
                        paddingLeft: 20, 
                        tree: taxonomyTree, 
                        onChange: (root) => {
                            loadTaxonomies(this.convertTreeToList(root));
                        }, 
                        renderNode: this.renderNode.bind(this)}
                    )
                )
            )
        );
    };
};

const stateToProps = (state) => ({
    currentTaxonomy: state.tu.current.taxonomy,
    currentTaxonomyType: state.tu.current.taxonomyType,
    taxonomies: state.tu.current.taxonomies,
    selectedTaxonomies: state.tu.selectedTaxonomies,
    isTaxonomiesUpdating: state.tu.isTaxonomiesUpdating
});

const reducerToProps = (reducer) => (
    bindActionCreators({
        loadTaxonomies,
        taxonomyClick,
        taxonomySelect,
        taxonomiesDeleted,
        taxonomiesUpdating,
        taxonomiesUpdated,
        taxonomyUpdated,
        componentLoaded,
        tabAdd,
        tabRemove
    }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(TaxonomyTypeList);




}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../redux/tu-actions":6,"../redux/tu-ajaxs":7,"../redux/tu-formSubmits":8,"classnames":"4z/pR8","list-to-tree":"3c/Ypl","react-redux":"MzQWgz","react-ui-tree":"0pOQFP","reactstrap":"jldOQ7","redux":"czVV+t","redux-form":"LVfYvK","underscore":"vBgcj5"}],5:[function(require,module,exports){
const $ = require('jquery');
const _ = require('underscore');
const ajaxs = require('../redux/tu-ajaxs');
const { loadTaxonomyTypes, loadTaxonomies, entityTypeChange, taxonomyTypeChange } = require('../redux/tu-actions');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { ListGroup, ListGroupItem, Label, Collapse, Card, CardBlock } = require('reactstrap');

_.groupByMulti = function (obj, values, context) {
    if (!values.length)
        return obj;
    var byFirst = _.groupBy(obj, values[0], context),
        rest = values.slice(1);
    for (var prop in byFirst) {
        byFirst[prop] = _.groupByMulti(byFirst[prop], rest, context);
    }
    return byFirst;
};

const TaxonomyTypeList = (props) => {
    const {loadTaxonomyTypes, loadTaxonomies, currentEntityType, currentTaxonomyType, taxonomyTypes, entityTypeChange, taxonomyTypeChange} = props;

    if (taxonomyTypes.length === 0) {
        ajaxs.getTaxonomyTypes((taxonomyTypeResult) => {
            loadTaxonomyTypes(taxonomyTypeResult);
        });
        return null;
    }

    const entityTypeGroups = _.groupByMulti(taxonomyTypes, ['entityTypeGroup', 'entityType'], null);

    return (
        React.createElement("div", {className: "entity-type-groups"}, 
            entityTypeGroups &&
                $.map(entityTypeGroups, (entityTypeGroup,index) => {
                    return (
                        React.createElement("div", {key: index, className: "entity-type-group mb-1"}, 
                            React.createElement(Label, null, React.createElement("strong", null, index)), 
                            React.createElement(ListGroup, null, 
                                
                                    $.map(entityTypeGroup, (entityTypes, index) => {
                                        const entityTypeName = index;
                                        const isActive = (entityTypeName === currentEntityType);
                                        return (
                                            React.createElement("div", {key: index}, 
                                                React.createElement(ListGroupItem, {action: true, tag: "button", onClick: () => { entityTypeChange(entityTypeName) }}, entityTypeName), 
                                                
                                                    React.createElement(Collapse, {isOpen: isActive}, 
                                                        React.createElement(ListGroup, null, 
                                                            
                                                                entityTypes.map((taxonomyType) => {
                                                                    const isCurrentTaxType = (currentTaxonomyType && currentTaxonomyType.name === taxonomyType.name);
                                                                    return (
                                                                        React.createElement(ListGroupItem, {key: taxonomyType.name, active: isCurrentTaxType, action: true, tag: "button", 
                                                                            onClick: () => {
                                                                                taxonomyTypeChange(taxonomyType);
                                                                            }}, 
                                                                            React.createElement("i", {className: "fa fa-caret-right ml-1 mr-1", "aria-hidden": "true"}), 
                                                                            taxonomyType.title
                                                                        )
                                                                    );
                                                                })
                                                            
                                                        )
                                                    )
                                                
                                            ));
                                    })
                                
                            )
                        )
                    );

                })
        )
    );
};

const stateToProps = (state) => ({
    taxonomyTypes: state.tu.taxonomyTypes,
    currentEntityType: state.tu.current.entityType,
    currentTaxonomyType: state.tu.current.taxonomyType
});

const reducerToProps = (reducer) => (
    bindActionCreators({ loadTaxonomyTypes, loadTaxonomies, entityTypeChange, taxonomyTypeChange }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(TaxonomyTypeList);

},{"../redux/tu-actions":6,"../redux/tu-ajaxs":7,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","underscore":"vBgcj5"}],6:[function(require,module,exports){
const keys = require('./tu-keys');

const loadTaxonomyTypes = (taxonomyTypes) => ({
    type: keys.loadTaxonomyTypes,
    taxonomyTypes
});

const entityTypeChange = (entityType) => ({
    type: keys.entityTypeChange,
    entityType
});

const taxonomyTypeChange = (taxonomyType) => ({
    type: keys.taxonomyTypeChange,
    taxonomyType
});

const newTaxonomyFormChange = () => ({
    type: keys.newTaxonomyFormChange,
});

const loadTaxonomies = (taxonomies) => ({
    type: keys.loadTaxonomies,
    taxonomies
});

const newTaxonomy = (taxonomy) => ({
    type: keys.newTaxonomy,
    taxonomy
}); 

const taxonomyClick = (taxonomy) => ({
    type: keys.taxonomyClick,
    taxonomy
});

const taxonomiesDeleted = (deleteResult) => ({
    type: keys.taxonomiesDeleted,
    deleteResult
});

const taxonomySelect = (taxonomy) => ({
    type: keys.taxonomySelect,
    taxonomy
});

const taxonomiesUpdating = () => ({
    type: keys.taxonomiesUpdating,
});

const taxonomiesUpdated = (updateResult) => ({
    type: keys.taxonomiesUpdated,
    updateResult
});

const taxonomyUpdated = (updateResult) => ({
    type: keys.taxonomyUpdated,
    updateResult
});

const componentLoaded = (componentName) => ({
    type: keys.componentLoaded,
    componentName
});

module.exports = {
    loadTaxonomyTypes,
    entityTypeChange,
    taxonomyTypeChange,
    newTaxonomyFormChange,
    loadTaxonomies,
    newTaxonomy,
    taxonomyClick,
    taxonomiesDeleted,
    taxonomySelect,
    taxonomiesUpdating,
    taxonomiesUpdated,
    taxonomyUpdated,
    componentLoaded
};

},{"./tu-keys":9}],7:[function(require,module,exports){
const $ = require('jquery');

const getTaxonomyTypes = (handler) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomyTypes",
        type: "GET",
        success: handler
    });
};

const getNewTaxonomyForm = (handler, taxonomyTypeId) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomyForm",
        data: { taxonomyTypeId },
        type: "GET",
        success: handler
    });
};

const getTaxonomies = (handler, taxonomyTypeId) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomies",
        data: { taxonomyTypeId },
        type: "GET",
        success: handler
    });
};

const deleteTaxonomies = (handler, taxonomyIds) => {
    $.ajax({
        url: "/taxonomyui/DeleteTaxonomies",
        data: { taxonomyIds },
        method: 'DELETE',
        success: (result) => {
            handler(result);
        }
    });
};

const updateTaxonomies = (handler, taxonomies) => {
    $.ajax({
        url: "/taxonomyui/UpdateTaxonomyTree",
        data: { viewModels: taxonomies },
        method: 'PUT',
        success: handler
    });
};

const getTaxonomyFormFor = (handler, taxonomyId) => {
    $.ajax({
        url: "/taxonomyui/GetTaxonomyFormFor",
        data: { taxonomyId},
        success: handler
    });
};

module.exports = { getTaxonomyTypes, getNewTaxonomyForm, getTaxonomies, deleteTaxonomies, updateTaxonomies, getTaxonomyFormFor };

},{"jquery":"XpFelZ"}],8:[function(require,module,exports){
(function (global){
﻿const $ = require('jquery');
const {SubmissionError} = require('redux-form');
const { parentId } = Corein.components.appKeys;

const newTaxonomyRequest = (data) => new Promise((resolve, reject) =>
    $.ajax({
        url: '/taxonomyui/NewTaxonomy',
        method: 'POST',
        data: data,
        success: (response) => {
            if (response.id) {
                resolve(response);
            } else {
                reject(response);
            }
        },
        error: (response) => {
            reject(response);
        }
    })
);

function newTaxonomySubmit(props) {
    const {newTaxonomy} = props;

    return function (formValues) {
        //add parentId to submit data
        if (formValues.meta)
            formValues.meta[parentId] = global.selectedTaxonomyId;

        return newTaxonomyRequest(formValues)
            .then((response) => {
                newTaxonomy(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Something wrong?' });
                }
            });
    }
}

const updateTaxonomyRequest = (data) => new Promise((resolve, reject) =>
    $.ajax({
        url: '/taxonomyui/UpdateTaxonomy',
        method: 'PUT',
        data: data,
        success: (response) => {
            if (response.resultState !== 0) {
                resolve(response);
            } else {
                reject(response);
            }
        },
        error: (response) => {
            reject(response);
        }
    })
);

function updateTaxonomySubmit(props) {

    return function (formValues) {
        const {successAction, currentTaxonomy} = props;

        return updateTaxonomyRequest(formValues)
            .then((response) => {
                successAction(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Something wrong?' });
                }
            });
    }
}

module.exports = {
    newTaxonomySubmit,
    updateTaxonomySubmit
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"jquery":"XpFelZ","redux-form":"LVfYvK"}],9:[function(require,module,exports){
const keys = {
    loadTaxonomyTypes: "LOAD_TAXONOMY_TYPES",
    entityTypeChange: "ENTITY_TYPE_CHANGE",
    taxonomyTypeChange: "TAXONOMY_TYPE_CHANGE",
    newTaxonomyFormChange: "NEW_TAXONOMY_FORM_CHANGE",
    addTab: "ADD_TAB",
    loadTaxonomies: "LOAD_TAXONOMIES",
    newTaxonomy: "NEW_TAXONOMY",
    taxonomyClick: "TAXONOMY_CLICK",
    taxonomiesDeleted: "TAXONOMIES_DELETED",
    taxonomySelect: "TAXONOMY_SELECT",
    taxonomiesUpdating: "TAXONOMIES_UPDATING",
    taxonomiesUpdated: "TAXONOMIES_UPDATED",
    taxonomyUpdated: "TAXONOMY_UPDATED",
    componentLoaded: "COMPONENT_LOADED"
};

module.exports = keys;

},{}],10:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./tu-keys');
const _ = require('underscore');

const initState = {
    taxonomyTypes: [],
    taxonomyTypeChanged: false,
    isTaxonomiesUpdating: false,
    selectedTaxonomies: [],
    current: {
        taxonomies: [],
        taxonomy: null,
        taxonomyType: null,
        entityType: ''
    }
};

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) { 
        case keys.loadTaxonomyTypes:
            newState.taxonomyTypes = action.taxonomyTypes;
            break;
        case keys.entityTypeChange:
            newState.current.entityType = action.entityType;
            break;
        case keys.taxonomyTypeChange:
            newState.taxonomyTypeChanged = true;
            newState.current.taxonomyType = action.taxonomyType;
            newState.current.taxonomies = [];
            break;
        case keys.newTaxonomyFormChange:
            newState.taxonomyTypeChanged = false;
            break;
        case keys.loadTaxonomies:
            if (action.taxonomies.length === 0)
                newState.current.taxonomies = null;
            else
                newState.current.taxonomies = action.taxonomies;
            break;
        case keys.newTaxonomy:
            if (!newState.current.taxonomies)
                newState.current.taxonomies = [];
            newState.current.taxonomies.push(action.taxonomy);
            break;
        case keys.taxonomyClick:
            newState.current.taxonomy = action.taxonomy;
            break;
        case keys.taxonomiesDeleted:
            newState.selectedTaxonomies = [];
            if (typeof action.deleteResult !== 'string')
                newState.current.taxonomies = action.deleteResult;
            break;
        case keys.taxonomySelect:
            var taxonomy = _.find(newState.selectedTaxonomies, { id: action.taxonomy.id });
            if (taxonomy)
                newState.selectedTaxonomies = _.without(newState.selectedTaxonomies, taxonomy);
            else
                newState.selectedTaxonomies.push(action.taxonomy);
            break;
        case keys.taxonomiesUpdating:
            newState.isTaxonomiesUpdating = true;
            break;
        case keys.taxonomiesUpdated:
            newState.isTaxonomiesUpdating = false;
            newState.current.taxonomies = action.updateResult.result;
            break;
        case keys.taxonomyUpdated:
            var taxonomyIndex = _.findIndex(newState.current.taxonomies, { id: action.updateResult.result.id });
            if (taxonomyIndex >= 0)
                newState.current.taxonomies[taxonomyIndex] = action.updateResult.result;
            break;
        default:
            return state;
    }
    return newState;
};

module.exports = reducer;

},{"./tu-keys":9,"jquery":"XpFelZ","underscore":"vBgcj5"}],11:[function(require,module,exports){
(function (global){
﻿global.Admin = {
    taxonomyUI: require('./admin/taxonomy-UI')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./admin/taxonomy-UI":1}]},{},[11])

//# sourceMappingURL=taxonomyui.js.map
