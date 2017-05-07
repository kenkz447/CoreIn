(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const index = require('./project/index');
const create = require('./project/create');
const update = require('./project/update');

module.exports = {
    index,
    create,
    update
}

},{"./project/create":2,"./project/index":5,"./project/update":10}],2:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');
const Form = require('../project/shared/components/project-form').default;
const store = createStore(require('./create/redux/reducer'));

var PageContent = (props) => {

    const {title, description} = props;

    return (
        React.createElement("div", null, 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Button, {color: "primary"}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: "/project/GetNewProjectForm", 
                        formSubmitData: {
                            url: '/project/create',
                            method: 'POST',
                            successAction: (respo) => {
                                window.location.href = respo.result;
                            },
                        }}
                    )
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"../project/shared/components/project-form":9,"./create/redux/reducer":4,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],3:[function(require,module,exports){
module.exports = {
};

},{}],4:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: pageReducer,
    projectForm: require('../../shared/components/project-form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
    layoutModal: require('../../shared/components/layout-modal').reducer
});

},{"../../shared/components/layout-modal":8,"../../shared/components/project-form":9,"./keys":3,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],5:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const Table = require('./index/components/table');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const tableActions = Corein.components.table.actions;
const PageAlert = Corein.components.pageAlerts.default;
const pageAlertsReducer = Corein.components.pageAlerts.reducer;

const reducer = combineReducers({
    index: require('./index/redux/reducer'),
    pageAlerts: pageAlertsReducer
});

const store = createStore(reducer);

var PageContent = (props) => {
    const { deleteSelectedRows } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlert, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Button, {color: "primary"}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Table, null)
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({

    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, null)
        )
    );
};

},{"./index/components/table":6,"./index/redux/reducer":7,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],6:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

const editUrl = '/project/update';
const deleteUrl = '/project/delete';
const dataUrl = '/project/GetTableData';

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
        this.getColumns = this.getColumns.bind(this);
    }

    getColumns() {
        return [
            {
                header: "Thumbnail",
                accessor: 'thumbnail',
                render: row => (React.createElement("div", null, React.createElement("img", {className: "table-thumbnail", src: row.value}))),
                width: 160,
                sortable: false,
                hideFilter: true
            }, {
                header: "Title",
                accessor: 'title',
                render: row => (React.createElement("div", null, React.createElement("a", {href: `${editUrl}/${row.rowValues.id}`, target: "blank"}, row.value))),
            }
        ];
    }

    render() {
        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            React.createElement(Table, React.__spread({},  this.props, {deleteProps: deleteProps, columns: this.getColumns(), dataUrl: dataUrl}))
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],7:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const { table } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        default:
            return state;
    }
    return newState;
};

module.exports = combineReducers({
    reducer, table: table.reducer
});

},{"jquery":"XpFelZ","redux":"czVV+t"}],8:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {Modal, ModalHeader, ModalBody, ModalFooter, Button} = require('reactstrap');

const Slider = require('rc-slider');

const keys = {
    toggle: 'TOGGLE',
    openLayoutModal: 'OPEN_LAYOUT_MODAL',
    addValue: 'ADD_VALUE',
    removeSelectedValue: 'REMOVE_VALUE',
    selectValueIndex: 'SELECT_VALUE_INDEX',
    updateValue: 'UPDATE_VALUE'
}

const actions = {
    toggle: () => ({
        type: keys.toggle
    }),

    openLayoutModal: (layoutImage, fieldValue, field_onChange, fileManagerModalToggle) => ({
        type: keys.openLayoutModal,
        layoutImage,
        fieldValue,
        field_onChange,
        fileManagerModalToggle
    }),

    addValue: (value) => ({
        type: keys.addValue,
        value
    }),

    removeSelectedValue: () => ({
        type: keys.removeSelectedValue
    }),

    selectValueIndex: (index) => ({
        type: keys.selectValueIndex,
        index
    }),

    updateValue: (value) => ({
        type: keys.updateValue,
        value
    })
}

const initialState = {
    values: [],
    isOpen: false,
    layoutImage: null,
    field_onChange: null,
    fileManagerModalToggle: null,
    selectedIndex: -1
}

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.toggle:
            newState.isOpen = !newState.isOpen;
            selectedIndex = -1;
            break;
        case keys.openLayoutModal:
            newState.layoutImage = action.layoutImage;
            newState.field_onChange = action.field_onChange;
            newState.fileManagerModalToggle = action.fileManagerModalToggle;

            newState.values = action.fieldValue ? JSON.parse(action.fieldValue) : [];

            newState.isOpen = true;
            break;
        case keys.addValue:
            newState.values.push(action.value);
            newState.selectedIndex = newState.values.length - 1;
            break;
        case keys.removeSelectedValue:
            newState.values.splice(newState.selectedIndex, 1);
            newState.selectedIndex = -1;
            break;
        case keys.selectValueIndex:
            newState.selectedIndex = action.index;
            break;
        case keys.updateValue:
            newState.values[newState.selectedIndex] = action.value;
            break;
        default:
            return state;
    }

    return newState;
}

class LayoutModal extends React.Component {
    constructor(props) {
        super(props);
        this.imageClick = this.imageClick.bind(this);
        this.okButtonClick = this.okButtonClick.bind(this);
        this.selectImgBtnClick = this.selectImgBtnClick.bind(this);
        this.deleteBtnClick = this.deleteBtnClick.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    imageClick(e) {
        const { addValue } = this.props;

        const $target = $(e.target);

        const currentImgSize = {
            w: $target.width(),
            h: $target.height()
        }

        const imgFileSize = {
            w: $target.prop('naturalWidth'),
            h: $target.prop('naturalHeight')
        }

        var offset_t = $target.offset().top - $(window).scrollTop();
        var offset_l = $target.offset().left - $(window).scrollLeft();

        var left = Math.round((e.clientX - offset_l));
        var top = Math.round((e.clientY - offset_t));

        var percX = (left / $target.width() * 100).toFixed(3);
        var percY = (top / $target.height() * 100).toFixed(3);

        addValue({ image: '', rotate: 0, x: percX, y: percY });
    }

    deleteBtnClick() {
        const { removeSelectedValue } = this.props;
        removeSelectedValue();
    }

    selectImgBtnClick() {

        const { values, selectedIndex, fileManagerModalToggle, toggle, updateValue } = this.props;

        fileManagerModalToggle((files) => {
            var file = files[0]

            if (!file)
                return;

            const selectedValue = values[selectedIndex];
            selectedValue.image = file.meta.src;
            updateValue(selectedValue);
        });
    }

    okButtonClick() {
        const {changeFieldValue, toggle, values} = this.props;

        toggle();
        changeFieldValue(JSON.stringify(values));
    }

    onSliderChange(e) {
        const { values, selectedIndex, updateValue } = this.props;

        const selectedValue = values[selectedIndex];
        selectedValue.rotate = e;
        updateValue(selectedValue);
    }

    render() {
        const {selectedIndex, values, layoutImage, toggle, isOpen, selectValueIndex, updateValue} = this.props;

        var selectedValue = values[selectedIndex];

        return (
            React.createElement(Modal, {className: "modal-lg", isOpen: isOpen, toggle: toggle}, 
                React.createElement(ModalHeader, {toggle: toggle}, "Modal title"), 
                React.createElement(ModalBody, null, 
                    React.createElement("div", {className: "layout-modal"}, 
                        React.createElement("div", {className: "arrow-container"}, 
                            React.createElement("img", {src: layoutImage, className: "w-100", onClick: this.imageClick}), 
                            
                                values.map((data, index) => {
                                    const divStyle = {
                                        transform: `rotate(${data.rotate}deg)`,
                                        left: `calc(${data.x}% - 10px)`,
                                        top: `calc(${data.y}% - 10px)`,
                                    };

                                    return (
                                        React.createElement("div", {key: index, style: divStyle, className: "arrow", onClick: () => { selectValueIndex(index); }}
                                            
                                        )
                                    );
                                })
                            
                        ), 
                        
                            selectedValue &&
                            React.createElement("div", {className: "controls", style: { left: 'calc(' + selectedValue.x + "% + 20px)", top: 'calc(' + selectedValue.y + "% - 0px)"}}, 
                                React.createElement(Button, {onClick: this.selectImgBtnClick}, 
                                    React.createElement("i", {className: "fa fa-picture-o", "aria-hidden": "true"})
                                ), 
                                React.createElement(Slider, {className: "slider", min: 0, max: 360, defaultValue: 3, value: selectedValue.rotate, 
                                    onChange: (e) => {
                                        selectedValue.rotate = e;
                                        updateValue(selectedValue);
                                    }}), 
                                React.createElement(Button, {onClick: this.deleteBtnClick}, 
                                    React.createElement("i", {className: "fa fa-times", "aria-hidden": "true"})
                                )
                            )
                        
                    )
                ), 
                React.createElement(ModalFooter, null, 
                    React.createElement(Button, {color: "secondary", onClick: this.okButtonClick}, "OK")
                )
            )
        )
    }
};

const stateToProps = (state) => {
    return {
        values: state.layoutModal.values,
        isOpen: state.layoutModal.isOpen,
        layoutImage: state.layoutModal.layoutImage,
        changeFieldValue: state.layoutModal.field_onChange,
        fileManagerModalToggle: state.layoutModal.fileManagerModalToggle,
        selectedIndex: state.layoutModal.selectedIndex,
    }
};

const reducerToProps = (reducer) => (
    bindActionCreators({ toggle: actions.toggle, addValue: actions.addValue, selectValueIndex: actions.selectValueIndex, removeSelectedValue: actions.removeSelectedValue, updateValue: actions.updateValue }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(LayoutModal),
    reducer,
    actions
}

},{"jquery":"XpFelZ","rc-slider":"6pHinT","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],9:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { form } = Corein.components;
const { reduxForm, getFormValues } = require('redux-form');

const LayoutModal = require('../../shared/components/layout-modal').default;
const { openLayoutModal } = require('../../shared/components/layout-modal').actions;

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
    formData: null
};

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.loadNewForm:
            newState.formData = action.formData;
            break;

        default:
            return state;
    }
    return newState;
};

class ProjectForm extends React.Component {
    constructor(props) {
        super(props);
        this.getCommands = this.getCommands.bind(this);
        this.getForm = this.getForm.bind(this);
    }

    getCommands() {
        const { openLayoutModal } = this.props;

        return {
            SET_LAYOUT: (formValues, fieldData) => {
                var roomName = fieldData.input.name.split('.')[1];

                const roomArrayIndex = /\[([^]+)\]/.exec(roomName)[1];
                const room = formValues.details['rooms'][roomArrayIndex];
                const layoutImage = room.layoutimage;
                if (layoutImage)
                    openLayoutModal(layoutImage, fieldData.input.value, fieldData.input.onChange, fieldData.fileManagerModalToggle);
            }
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
        const { formData, formName, formSubmitData } = this.props;

        if (!formData)
            return this.getForm();

        const validate = form.validator({ details: formData.details, meta: formData.meta });
        const sumbitProps = $.extend({ validate }, formSubmitData);
        const onSubmit = form.submit(sumbitProps);

        var ReduxDynamicForm = reduxForm({
            form: formName,
            formData,
            commands: this.getCommands(),
            onSubmit,
            initialValues: formData.initialValues,
        })(form.default);

        ReduxDynamicForm = connect(state => ({ formValues: getFormValues(formName)(state) }))(ReduxDynamicForm);

        return (
            React.createElement("div", null, 
                React.createElement(ReduxDynamicForm, null), 
                React.createElement(LayoutModal, null)
            )
        );
    }
};

const stateToProps = (state) => {
    return state.projectForm;
};

const reducerToProps = (reducer) => (
    bindActionCreators({ loadNewForm: actions.loadNewForm, openLayoutModal }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(ProjectForm),
    actions,
    reducer
};

},{"../../shared/components/layout-modal":8,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],10:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const alerts = Corein.components.pageAlerts;
const PageAlerts = alerts.default;

const Form = require('../project/shared/components/project-form').default;

const store = createStore(require('./update/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description, alertPush } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlerts, null), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(Button, {color: "primary"}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardHeader, null, 
                    React.createElement("strong", null, title), " ", description && ` ${description}`
                ), 
                React.createElement(CardBlock, null, 
                    React.createElement(Form, {formName: "create", 
                        formUrl: "/project/GetNewProjectForm", 
                        formUrlData: parameters, 
                        formSubmitData: {
                            url: '/project/update',
                            method: 'PUT',
                            successAction: (respo) => {
                                alertPush("success", respo.message);
                                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
                            },
                        }}
                    )
                )
            )
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({ alertPush: alerts.actions.push}, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"../project/shared/components/project-form":9,"./update/redux/reducer":12,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],11:[function(require,module,exports){
module.exports = {
};

},{}],12:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;

const { tabControlReducer, fileManager: { fmReducer }, pageAlerts } = Corein.components;

const initialState = {

};

const reducer = (state = initialState, action) => {
    return state;
};

module.exports = combineReducers({
    pageAlerts: pageAlerts.reducer,
    page: reducer,
    projectForm: require('../../shared/components/project-form').reducer,
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer,
    layoutModal: require('../../shared/components/layout-modal').reducer
});

},{"../../shared/components/layout-modal":8,"../../shared/components/project-form":9,"./keys":11,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],13:[function(require,module,exports){
(function (global){
﻿const project = require('./homeclick/project');

global.Homeclick = {
    project
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./homeclick/project":1}]},{},[13])

//# sourceMappingURL=homeclick.js.map
