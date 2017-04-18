(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const fmKeys = require('./fm-keys');

const fileUploaded = (fileObjectResult) => ({
    type: fmKeys.fileUploaded,
    file: fileObjectResult.result
});

const loadFiles = (files) => ({
    type: fmKeys.loadFiles,
    files
});

const fileChecked = (fileName, checked) => ({
    type: fmKeys.fileChecked,
    fileName: fileName,
    checked
});

const fileDelete = (fileName) => ({
    type: fmKeys.fileDelete,
    fileName
});

const fileClick = (file) => ({
    type: fmKeys.fileClick,
    file
});

const fileUpdate = (file) => ({
    type: fmKeys.fileUpdate,
    file
});

const toggleAside = (isOpen) => ({
    type: fmKeys.toggleAside,
    isOpen
});

module.exports = { fileUploaded, loadFiles, fileChecked, fileDelete, fileClick, fileUpdate, toggleAside };

},{"./fm-keys":8}],2:[function(require,module,exports){
const $ = require('jquery');

const getFilesFromServer = (handler, selectFrom, take) => {
    $.ajax({
        url: "/FileManager/GetFiles",
        data: { selectFrom: selectFrom, take: take },
        method: "GET",
        success: response => {
            handler(response);
        }
    });
}

const getFormInfoFromServer = (handler, fileName) => {
    $.ajax({
        url: '/FileManager/GetFormFor',
        data: { fileName: fileName },
        method: "GET",
        success: handler
    });
}

const deleteFilesFromServer = (handler, fileNames) => {
    $.ajax({
        url: '/FileManager/DeleteFiles',
        data: { fileNames },
        method: 'DELETE',
        success: (deleteResults) => {
            handler(deleteResults);
        }
    });
}

const updateFile = (handler, file) => {
    $.ajax({
        url: '/FileManager/Update',
        data: { viewModel: file },
        method: 'PUT',
        success: response => {
            handler(response);
        }
    });
}

module.exports = { getFilesFromServer, getFormInfoFromServer, deleteFilesFromServer, updateFile};

},{"jquery":"XpFelZ"}],3:[function(require,module,exports){
const react = require('react');
const $ = require('jquery');
const { connect } = require('react-redux');
const { fileChecked, toggleAside} = require('./fm-actions');
const { getFormInfoFromServer } = require('./fm-ajaxs');
const { bindActionCreators } = require('redux');
const { reduxForm } = require('redux-form');
const { dynamicFormValidator, DynamicForm, tabControlActions: { tabAdd, tabRemove } } = require('corein');
const { updateFileSubmit } = require('./fm-formSubmits');

const fmKeys = require('./fm-keys');

class FileItem extends react.Component {
    onClick(event) {
        const { onChecked, checkedFiles, options : { allowSelectMulti }} = this.props;

        let $target = $(event.target),
            fileName = $target.data('file-name'),
            isCheckboxChecked = $target.prop('checked');

        if(!isCheckboxChecked)
            onChecked(fileName, isCheckboxChecked);
        else
            checkedFiles.push(fileName);

        const $checkboxes = $('.thumb-checkbox');

        let firstChecked = $checkboxes.filter('[data-file-name="' + checkedFiles[0] + '"]')[0];

        if (event.shiftKey && checkedFiles.length > 1) {
            var start = $checkboxes.index(firstChecked),
                end = $checkboxes.index(event.target);

            $checkboxes.map((index, checkbox) => {
                const isChecked = (end < start && (index >= end && index <= start)) || (end > start && (index >= start && index <= end));
                checkbox.checked = isChecked;
                onChecked(checkbox.getAttribute("data-file-name"), isChecked);
            });
        }
        else if (event.ctrlKey) {

        }
        else {
            if (checkedFiles.length > 1) {
                $target.prop('checked', true);
                onChecked($target.data("file-name"), true);
            }

            var $checkedCheckboxes = $checkboxes.filter(':checked').not($target);
            $checkedCheckboxes.map((index, checkbox) => {
                checkbox.checked = false;
                onChecked(checkbox.getAttribute("data-file-name"), false);
            });
        }

    }

    onInfoClick() {
        const { tabAdd, tabRemove, toggleAside } = this.props;
        getFormInfoFromServer((formResult) => {
            const form = formResult.result;
            const formId = "properties";

            const validate = dynamicFormValidator({ details: form.details, meta: form.meta });
            const submit = updateFileSubmit({ successAction: {}});
            const ReduxDynamicForm = reduxForm({ form: formId, validate, initialValues: form.initialValues })(DynamicForm);

            tabRemove(formId); 
            tabAdd(
                formId,
                '<i class="icon-wrench icons"></i> ' + form.fileName,
                React.createElement(ReduxDynamicForm, {formData: form, onSubmit: submit, onClose: () => { toggleAside(false); tabRemove(formId); }})
            );
            toggleAside(true);
        }, this.props.data.fileName);
    }

    render() {
        const { data: {fileId, fileName, meta: {type, src_thumb, ext}} } = this.props;
        const fieldId = `file_${fileId}`;
        const fieldName = `file[${fileId}]`;
        return (
            React.createElement("div", {className: "col-sm-6 col-md-4 col-lg-3 col-xl-2 p-0"}, 
                React.createElement("div", {className: "card card-fileThumb mb-1 mr-1"}, 
                    React.createElement("label", {className: "fancy-checkbox-label", htmlFor: fieldId}, 
                        React.createElement("input", {type: "checkbox", className: "thumb-checkbox", id: fieldId, name: fieldName, "data-file-id": fileId, "data-file-name": fileName, onClick: this.onClick.bind(this)}), 
                        React.createElement("span", {className: "fancy-checkbox fancy-checkbox-img"}), 
                        (type === 'Image'
                            ? React.createElement("img", {src: src_thumb, alt: fileName})
                            : React.createElement("span", {className: "fancy-thumb-icon"}, React.createElement("i", {className: "fa fa-file"}), " ", React.createElement("b", null, ext)))
                    ), 
                    React.createElement("div", {className: "file-info p-1", onClick: this.onInfoClick.bind(this)}, 
                        React.createElement("i", {className: "fa fa-info", "aria-hidden": "true"}), 
                        React.createElement("span", {className: "file-name"}, fileName)
                    )
                )
            )
        );
    }
}
const stateToProps = (state) => ({
    options: state.fm.options,
    checkedFiles: state.fm.checkedFiles
});

const dispatchToProps = (dispatch) => (
    bindActionCreators({ onChecked: fileChecked, toggleAside, tabAdd, tabRemove }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileItem);

},{"./fm-actions":1,"./fm-ajaxs":2,"./fm-formSubmits":6,"./fm-keys":8,"corein":17,"jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],4:[function(require,module,exports){
const $ = require('jquery');
const fmKeys = require('./fm-keys');
const { getFilesFromServer } = require('./fm-ajaxs');
const react = require('react');
const { connect } = require('react-redux');
const { loadFiles } = require('./fm-actions');
const { bindActionCreators } = require('redux');

var Button = require('reactstrap').Button;
var FileItem = require('./fm-fileItem');

class FileThumbList extends react.Component {
    onLoadMoreBtnClick(event) {
        const { files, loadFiles, resources, options: { itemPerLoad } } = this.props;
        const $loadMoreBtn = $(event.target);

        $loadMoreBtn.prop('disabled', true);
        $loadMoreBtn.text(resources.onLoadMore);

        getFilesFromServer(function (filesResult) {
            loadFiles(filesResult);
            if (filesResult.length < itemPerLoad) {
                $loadMoreBtn.text(resources.noMore);
            } else {
                $loadMoreBtn.prop('disabled', false);
                $loadMoreBtn.text(resources.loadMore);
            }
        }.bind(this),
            files.length,
            itemPerLoad);
    }

    render() {
        const { files, resources } = this.props;
        return (
            React.createElement("div", {id: "FileThumbList", className: "container-fluid"}, 
                React.createElement("div", {className: "row"}, 
                    files.map(item => (
                        React.createElement(FileItem, {key: item.fileId, data: item})
                    ))
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement(Button, {id: "LoadMoreBtn", color: "secondary", onClick: this.onLoadMoreBtnClick.bind(this)}, resources.loadMore)
                )
            )
        );
    }
};

const stateToProps = (state) => ({
    files: state.fm.files,
    resources: state.fm.resources,
    options: state.fm.options
});

const dispatchToProps = (dispatch) => (
    bindActionCreators({ loadFiles }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileThumbList);

},{"./fm-actions":1,"./fm-ajaxs":2,"./fm-fileItem":3,"./fm-keys":8,"jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],5:[function(require,module,exports){
const $ = require('jquery');
const jFiler = require('jquery.filer');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { fileUploaded } = require('./fm-actions');

var { Progress } = require('reactstrap');

class JFiler extends React.Component {
    componentDidMount() {
        const $jFiler = $('#jFiler'),
            $progressBar = $('.jFiler-container .progress-bar'),
            $progressContainer = $('.jFiler-container .progress-container');

        let opts = {
            changeInput: '<div class="jFiler-input-dragDrop m-0 w-100"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag&Drop files here</h3> <span>or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div></div>',
            showThumbs: false,
            theme: "dragdropbox",
            templates: {
                progressBar: ''
            },
            dragDrop: {

            },
            uploadFile: {
                url: '/filemanager/upload',
                data: {},
                type: 'POST',
                enctype: 'multipart/form-data',
                synchron: true,
                beforeSend: () => {
                    $progressContainer.removeClass('collapse');
                },
                success: (fileObjectResult) => {
                    if (fileObjectResult.resultState === 1) {
                        const { uploaded } = this.props;
                        uploaded(fileObjectResult);
                    }
                },
                onProgress: (progress) => {
                    $progressBar.css('width', progress + '%');
                },
                onComplete: () => {
                    $progressContainer.addClass('collapse');
                    $progressBar.css('width', '0%');
                }
            }
        };
        $jFiler.filer(opts);
    }

    render() {
        return (
            React.createElement("div", {className: "jFiler-container"}, 
                React.createElement("input", {type: "file", id: "jFiler", name: "jFiler", multiple: "multiple", className: "collapse"}), 
                React.createElement("div", {className: "progress-container collapse mt-1"}, 
                    React.createElement(Progress, null)
                )
            )
        );
    }
};

const dispatchToProps = (dispatch) => (
    bindActionCreators({ uploaded : fileUploaded }, dispatch)
);

module.exports = connect(state => state, dispatchToProps)(JFiler);


},{"./fm-actions":1,"jquery":"XpFelZ","jquery.filer":"pPPu8c","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],6:[function(require,module,exports){
(function (global){
﻿var {SubmissionError} = require('redux-form');

const updateFileRequest = data => new Promise((resolve, reject) =>
    global.jQuery.ajax({
        url: '/filemanager/update',
        method: 'PUT',
        data: data,
        success: (response) => {
            if (response.result === "success") {
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

function updateFileSubmit(props) {
    const { successAction } = props;
    return function (values) {
        return updateFileRequest(values)
            .then((response) => {
                successAction(response);
            })
            .catch((response) => {
                if (response.result && response.result === "error") {
                    throw new SubmissionError(response.errors);
                } else {
                    throw new SubmissionError({ _error: 'Update failed!' });
                }
            });
    }
}

module.exports = {
    updateFileSubmit
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"redux-form":"LVfYvK"}],7:[function(require,module,exports){
const react = require('react');
const $ = require('jquery');
const fmReducer = require('./fm-reducer.jsx');
const { getFilesFromServer } = require('./fm-ajaxs');
const { connect } = require('react-redux');
const { loadFiles, fileDelete, toggleAside } = require('./fm-actions');
const { bindActionCreators } = require('redux');
const classnames = require('classnames');
var { Button } = require('reactstrap');

const { deleteFilesFromServer } = require('./fm-ajaxs');

var JFiler = require('./fm-filer.jsx');
var FileList = require('./fm-fileList');
var SidePanel = require('./fm-sidePanel');

class FileManager extends react.Component {
    deleteBtnClicked(event) {
        var $button = $(event.target);
        $button.prop('disabled', true);
        const { fileDelete, uncheked, checkedFiles } = this.props;
        deleteFilesFromServer((deleteResults) => {
            deleteResults.map((result, index) => {
                if (result.resultState === 1)
                    fileDelete(result.fileName);

                if (checkedFiles.length === index + 1)
                    $button.prop('disabled', false);
            });
        }, checkedFiles);
    }

    render() {
        const { files, loadFiles, deleteFiles, options: {initLoadItems}, asideOpened, toggleAside } = this.props;
        return (
            React.createElement("div", {id: "file-manager", className: classnames({ 'aside-menu-hidden': !asideOpened })}, 
                React.createElement("div", {id: "UploadPane"}, 
                    React.createElement("div", {className: "card card-block"}, 
                        React.createElement(JFiler, null)
                    )
                ), 
                React.createElement("div", {className: "card"}, 
                    React.createElement("div", {className: "card-block"}, 
                        React.createElement(Button, {color: "danger", onClick: this.deleteBtnClicked.bind(this), className: "pull-left"}, React.createElement("i", {className: "icon-trash icons"}), " Delete")
                    )
                ), 
                files.length !== 0 ? React.createElement(FileList, null) : getFilesFromServer(loadFiles, 0, initLoadItems), 
                React.createElement(SidePanel, null), 
                React.createElement("div", {className: classnames('overlay', 'fade-in-out', { 'hidden': !asideOpened }), onClick: () => { toggleAside(false); }})
            )
        );
    }
}

const stateToProps = (state) => ({
    asideOpened: state.fm.asideOpened,
    files: state.fm.files,
    options: state.fm.options,
    checkedFiles: state.fm.checkedFiles
});

const dispatchToProps = (dispatch) => (
    bindActionCreators({ loadFiles, fileDelete, toggleAside}, dispatch)
);

module.exports = {
    FileManager: connect(stateToProps, dispatchToProps)(FileManager),
    fmReducer
};

},{"./fm-actions":1,"./fm-ajaxs":2,"./fm-fileList":4,"./fm-filer.jsx":5,"./fm-reducer.jsx":9,"./fm-sidePanel":10,"classnames":"4z/pR8","jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],8:[function(require,module,exports){
const fmKeys = {
    fileUploaded: 'FILE_UPLOADED',
    fileChecked: 'FILE_CHEKED',
    fileDelete: 'FILE_DELETE',
    fileClick: 'FILE_CLICK',
    fileUpdate: 'FILE_UPDATE',
    toggleAside: 'SIDEPANEL_TOGGLE',
    loadFiles: 'LOAD_FILES',
};

module.exports = fmKeys;

},{}],9:[function(require,module,exports){
const $ = require('jquery');
const fmKeys = require('./fm-keys');
const sift = require('sift');

const initState = {
    files: [],
    checkedFiles: [],
    resources: {
        loadMore: "Load more",
        onload: "Please wait...",
        noMore: "No more!"
    },
    options: {
        allowSelectMulti: true,
        initLoadItems: 30,
        itemPerLoad: 12
    },
    asideOpened: false
}

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);

    switch (action.type) {
        case fmKeys.fileUploaded:
            newState.files.unshift(action.file);
            break;
        case fmKeys.loadFiles:
            newState.files = newState.files.concat(action.files);
            break;
        case fmKeys.fileChecked:
            if (action.checked) {
                if (state.checkedFiles.indexOf(action.fileName) < 0)
                    newState.checkedFiles.push(action.fileName);
            } else {
                let index = state.checkedFiles.indexOf(action.fileName);
                if (index >= 0)
                    newState.checkedFiles.splice(index, 1);
            }
            break;
        case fmKeys.fileDelete:
            //remove file from checked list
            var fileIndex = state.checkedFiles.indexOf(action.fileName);
            if (fileIndex >= 0)
                newState.checkedFiles.splice(fileIndex, 1);

            newState.files = sift({ fileName: { $not: action.fileName } }, newState.files);
            break;
        case fmKeys.toggleAside:
            newState.asideOpened = action.isOpen;
            break;
        default:
            return state;
    }
    return newState;
}

module.exports = reducer;

},{"./fm-keys":8,"jquery":"XpFelZ","sift":"yAbQ3S"}],10:[function(require,module,exports){
const react = require('react');
const reactDOM = require('react-dom');
const $ = require('jquery');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { bindActionCreators } = require('redux');
const { asideTabChange } = require('./fm-actions');
const { dynamicFormValidator, DynamicForm, TabControl, tabControlActions: { tabChange } } = require('corein');
var { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

class SidePanel extends react.Component {
    render() {
        const { activeTab, tabs, tabChange } = this.props;
        return (
            React.createElement("aside", {className: classnames("aside-menu")}, 
                activeTab && React.createElement(TabControl, {activeTab: activeTab, tabs: tabs, tabChange: tabChange})
            )
        );
    }
}

const stateToProps = (state) => ({
    activeTab: state.fmTabControl.active,
    tabs: state.fmTabControl.tabs
});

const distpatchToProps = (dispatch) => (
    bindActionCreators({ tabChange }, dispatch)
    );

module.exports = connect(stateToProps, distpatchToProps)(SidePanel);


},{"./fm-actions":1,"classnames":"4z/pR8","corein":17,"jquery":"XpFelZ","react":"b6Dds6","react-dom":"Ld8xHf","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],11:[function(require,module,exports){
(function (global){
﻿const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;
const { tabControlReducer } = require('corein');

var { FileManager, fmReducer } = require('./components/fm-index.jsx');

const reducers = {
    form: formReducer,
    fm: fmReducer,
    fmTabControl: tabControlReducer
}

const reducer = combineReducers(reducers);

const store = createStore(reducer); 

const FileManagerIndex = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(FileManager, null)
        )
        );
}

global.FileManagerIndex = FileManagerIndex;

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./components/fm-index.jsx":7,"corein":17,"react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],12:[function(require,module,exports){
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
            React.createElement("div", {key: node.id, className: "item"}, 
                React.createElement(Field, {component: renderField, display: { renderType: 'checkbox', title: node.title}, name: `${taxonomyName}.${node.id}`}), 
                node.children &&
                    React.createElement("div", {className: "children"}, 
                        
                        $.map(node.children, (node) => {
                                return this.renderNode(node);
                            })
                        
                    )
                
            )            
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
            React.createElement("div", {className: "checkbox-list"}, 
                React.createElement("h4", null, title), 
                tree &&
                    React.createElement("div", {className: "items"}, 
                    
                        $.map(tree, (node) => {
                            return this.renderNode(node);
                        })
                    
                    )
                
            ));
    };
};

const CHECKBOXLIST = 'checkboxlist';

const TaxonomyFields = (props) => {
    const { renderType } = props;
    switch (renderType) {
        default:
            return React.createElement(CheckboxList, React.__spread({},  props))
    }
};

const DynamicForm = (props) => {
    const { formName, formData, onClose, error, handleSubmit, pristine, reset, submitting, submitSucceeded, display } = props;

    return (
        React.createElement("div", {className: "dynamic-form card-block"}, 
            React.createElement("form", {onSubmit: handleSubmit}, 
                display && React.createElement("h1", null, display.title), 
                display && React.createElement("p", {className: "text-muted"}, display.description), 
                
                !submitting && (error && React.createElement(Alert, {color: "danger"}, error)), 

                
                    formData.meta &&
                    React.createElement("div", {className: "meta"}, 
                        formData.meta.map((props, index) => {
                            const {readonly, input: {name, value}, display, status} = props;
                            return React.createElement(Field, {key: index, component: renderField, readOnly: readonly, name: `meta.${name}`, value: value, display: display, status: status});
                        })
                    ), 
                

                
                    formData.details && 
                    React.createElement("div", {className: "details"}, 
                        formData.details.map((props, index) => {
                            const {readonly, input: {name, value}, display, status} = props;
                            return React.createElement(Field, {key: index, component: renderField, readOnly: readonly, name: `details.${name}`, value: value, display: display, status: status});
                        })
                    ), 
                

                
                    formData.taxonomyTypes && 
                    React.createElement("div", {className: "taxonomies"}, 
                        
                            formData.taxonomyTypes.map((props) => {
                                const { typeId, input: {name}, display: {renderType, title}, taxonomies} = props;
                                return React.createElement(TaxonomyFields, {key: typeId, renderType: renderType, taxonomyName: `taxonomyTypes.${typeId}`, title: title, taxonomies: taxonomies});
                            })
                        
                    ), 
                
                React.createElement("hr", null), 
                React.createElement("div", {className: "actions"}, 
                    React.createElement(Button, {className: "mr-1", color: "primary", type: "submit", disabled: submitting}, display ? display.submitLabel : "Submit"), 
                    
                        onClose && React.createElement(Button, {type: "Button", onClick: onClose, disabled: submitting}, display ? display.dismissForm : "Cancel")
                    
                )
            )
        )
    );
};

module.exports = DynamicForm;

},{"./formField.jsx":14,"jquery":"XpFelZ","list-to-tree":21,"react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","redux-form":"LVfYvK"}],13:[function(require,module,exports){
const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

const validator = validating => values => {
    const errors = {};
    for (var propertyGroup in validating)
    {
        errors[propertyGroup] = {};
        if (!values[propertyGroup])
            values[propertyGroup] = {};

        for (var property in validating[propertyGroup]) {

            if (!validating[propertyGroup][property].validate)
                continue;

            var fieldName = validating[propertyGroup][property].input.name;

            var hasRequired = validating[propertyGroup][property].validate.required;
            var typeRequired = validating[propertyGroup][property].validate.type;
            var minLengthRequired = validating[propertyGroup][property].validate.minLength;
            var maxLengthRequired = validating[propertyGroup][property].validate.maxLength;
            var hasCompare = validating[propertyGroup][property].validate.compare;

            var hasContainLowercase = validating[propertyGroup][property].validate.containLower;
            var hasContainUppercase = validating[propertyGroup][property].validate.containUpper;
            var hasContainNumber = validating[propertyGroup][property].validate.containNumber;
            var hasContainSpecialChar = validating[propertyGroup][property].validate.containSpecial;

            if (hasRequired && hasRequired.value && !values[propertyGroup][fieldName]) {
                errors[propertyGroup][fieldName] = hasRequired.error;
            }
            else if (typeRequired && !isType(values[propertyGroup][fieldName], typeRequired.value)) {
                errors[propertyGroup][fieldName] = typeRequired.error;
            }
            else if (minLengthRequired && values[propertyGroup][fieldName] && values[propertyGroup][fieldName].length < minLengthRequired.value) {
                errors[propertyGroup][fieldName] = minLengthRequired.error;
            }
            else if (hasCompare && values[propertyGroup][fieldName] != values[hasCompare.value]) {
                errors[propertyGroup][fieldName] = hasCompare.error;
            }
            else if (hasContainLowercase && !/(?=.*[a-z])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainLowercase.error;
            }
            else if (hasContainUppercase && !/(?=.*[A-Z])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainUppercase.error;
            }
            else if (hasContainNumber && !/(?=.*[0-9])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainNumber.error;
            }
            else if (hasContainSpecialChar && !/(?=.*[!@#$%^&*])/.test(values[propertyGroup][fieldName])) {
                errors[propertyGroup][fieldName] = hasContainSpecialChar.error;
            }
        }
    }
    

    return errors;
}

module.exports = validator

},{}],14:[function(require,module,exports){
var React = require('react');
var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return (
        React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder}))
    );
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, {color: validationState, className: "mb-1"}, 
            React.createElement(InputGroup, null, 
                React.createElement(InputGroupAddon, {dangerouslySetInnerHTML: { __html: title}}), 
                React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName, readOnly: status === 'ReadOnly'}))
            ), 
            prompt && React.createElement(FormText, {color: "muted"}, prompt), 
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderFormGroup = (props) => {
    const {input, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, {color: validationState, className: "mb-1"}, 
            React.createElement(Label, {for: id, dangerouslySetInnerHTML: { __html: title}}), 
            React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName, readOnly: status === 'ReadOnly'})), 
            prompt && React.createElement(FormText, {color: "muted"}, prompt), 
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderCheckBox = (props) => {
    const {input, display: {id, title, placeholder}} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox", checked: input.value})), 
                ' ' + (title ? title : placeholder)
            )
        )
    );
}

const RenderHidden = (props) => {
    const {input} = props;
    return (
        React.createElement("input", React.__spread({},  input, {type: "hidden"}))
    );
}

const renderField = props => {
    const {display, status } = props;

    if (status && status.toLowerCase() == 'hidden')
        return RenderHidden(props);

    var rt = display.renderType.toLowerCase();
    switch (rt) {
        case 'inputgroup':
            return RenderInputGroup(props);
        case 'checkbox':
            return RenderCheckBox(props);
        default:
            return RenderFormGroup(props);
    }
}

module.exports = renderField;

},{"react":"b6Dds6","reactstrap":"jldOQ7"}],15:[function(require,module,exports){
const classnames = require('classnames');
const { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

class TabControl extends React.Component {
    render()
    {
        const { activeTab, tabs, tabChange } = this.props;
        return (
            React.createElement("div", {className: "tab-control"}, 
                React.createElement(Nav, {tabs: true}, 
                    tabs.map((tab) => (
                        React.createElement(NavItem, {key: tab.id}, 
                            React.createElement(NavLink, {className: classnames({ active: activeTab && activeTab.id === tab.id }), 
                                onClick: () => { tabChange(tab); }, 
                                dangerouslySetInnerHTML: { __html: tab.title}})
                        )
                    ))
                ), 
                React.createElement(TabContent, {activeTab: activeTab && activeTab.id}, 
                    tabs.map((tab) => {
                        return (
                            React.createElement(TabPane, {key: tab.id, tabId: tab.id}, 
                                tab.content
                            )
                        );
                    })
                )
            )
        );    
    }
};

module.exports = TabControl;



},{"classnames":"4z/pR8","reactstrap":"jldOQ7"}],16:[function(require,module,exports){
const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

const validator = validating => values => {
    const errors = {};

    for (var property in validating) {

        var fieldName = validating[property].input.name;

        var hasRequired = validating[property].validate.required;
        var typeRequired = validating[property].validate.type;
        var minLengthRequired = validating[property].validate.minLength;
        var maxLengthRequired = validating[property].validate.maxLength;
        var hasCompare = validating[property].validate.compare;

        var hasContainLowercase = validating[property].validate.containLower;
        var hasContainUppercase = validating[property].validate.containUpper;
        var hasContainNumber = validating[property].validate.containNumber;
        var hasContainSpecialChar = validating[property].validate.containSpecial;

        if (hasRequired && hasRequired.value && !values[fieldName]) {
            errors[fieldName] = hasRequired.error;
        }
        else if (typeRequired && !isType(values[fieldName], typeRequired.value)) {
            errors[fieldName] = typeRequired.error;
        }
        else if (minLengthRequired && values[fieldName] && values[fieldName].length < minLengthRequired.value) {
            errors[fieldName] = minLengthRequired.error;
        }
        else if (hasCompare && values[fieldName] != values[hasCompare.value]) {
            errors[fieldName] = hasCompare.error;
        }
        else if (hasContainLowercase && !/(?=.*[a-z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainLowercase.error;
        }
        else if (hasContainUppercase && !/(?=.*[A-Z])/.test(values[fieldName])) {
            errors[fieldName] = hasContainUppercase.error;
        }
        else if (hasContainNumber && !/(?=.*[0-9])/.test(values[fieldName])) {
            errors[fieldName] = hasContainNumber.error;
        }
        else if (hasContainSpecialChar && !/(?=.*[!@#$%^&*])/.test(values[fieldName])) {
            errors[fieldName] = hasContainSpecialChar.error;
        }
    }

    return errors;
}

module.exports = validator

},{}],17:[function(require,module,exports){
const renderField = require('./components/formField.jsx');
const validator = require('./components/validator');
const dynamicFormValidator = require('./components/dynamicFormValidator');
const DynamicForm = require('./components/dynamicForm.jsx');
const TabControl = require('./components/tabControl.jsx');
const tabControlActions = require('./redux/tc-actions.jsx');
const tabControlReducer = require('./redux/tc-reducer.jsx');

const appKeys = {
    parentId: 'parentId'
};

module.exports = {
    renderField,
    validator,
    dynamicFormValidator,
    DynamicForm,
    TabControl,
    tabControlActions,
    tabControlReducer,
    appKeys
};

},{"./components/dynamicForm.jsx":12,"./components/dynamicFormValidator":13,"./components/formField.jsx":14,"./components/tabControl.jsx":15,"./components/validator":16,"./redux/tc-actions.jsx":18,"./redux/tc-reducer.jsx":20}],18:[function(require,module,exports){
const keys = require('./tc-keys.jsx');

const tabAdd = (id, title, content) => ({
    type: keys.tabAdd,
    tab: { id, title, content }
});

const tabRemove = (tab) => ({
    type: keys.tabRemove,
    tab
});

const tabChange = (tab) => ({
    type: keys.tabChange,
    tab
});

module.exports = {
    tabAdd,
    tabRemove,
    tabChange
};

},{"./tc-keys.jsx":19}],19:[function(require,module,exports){
const keys = {
    tabAdd: "TAB_ADD",
    tabRemove: "TAD_REMOVE",
    tabChange: "TAB_CHANGE"
};

module.exports = keys;

},{}],20:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./tc-keys.jsx');

const initState = {
    active: null,
    tabs: []
};

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) { 
        case keys.tabAdd:
            newState.tabs = newState.tabs.filter(tab => tab.id !== action.tab.id);
            newState.tabs.push(action.tab);
            newState.active = action.tab;
            break;
        case keys.tabRemove:
            newState.tabs = newState.tabs.filter(tab => tab.id !== action.tab.id);
            if (newState.tabs.length !== 0)
                newState.active = newState.tabs[0];
            break;
        case keys.tabChange:
            if (newState.active.id !== action.tab.id)
                newState.active = action.tab;
            break;
        default:
            return state;
    }
    return newState;
};

module.exports = reducer;

},{"./tc-keys.jsx":19,"jquery":"XpFelZ"}],21:[function(require,module,exports){
/**
 * Created by DenQ on 31.08.2015.
 * Repo: https://github.com/DenQ/list-to-tree
 */
//var _ = require('lodash');
var LTT, list, ltt;

function pluck(collection, key) {
    return collection.map(function(item) {
        return item[key];
    });
}

function unique(collection) {
    return collection.filter(function(value, index, array) {
        return array.indexOf(value) === index;
    });
}

function sortBy(collection, propertyA, propertyB) {
    return collection.sort(function(a, b) {
        if (a[propertyB] < b[propertyB]) {
            if (a[propertyA] > b[propertyA]) {
                return 1;
            }
            return -1;
        } else {
            if (a[propertyA] < b[propertyA]) {
                return -1;
            }
            return 1;
        }
    });
};

LTT = (function() {
    LTT.prototype.groupParent = [];

    LTT.prototype.key_id = 'id';

    LTT.prototype.key_parent = 'parent';

    LTT.prototype.key_child = 'child';

    LTT.prototype.options = {};

    function LTT(list, options) {
        this.list = list;
        this.options = options != null ? options : {};
        this.ParseOptions();
        this.list = sortBy(this.list, this.key_parent, this.key_id);
        this.groupParent = unique(pluck(this.list, this.key_parent));
        return this;
    }

    LTT.prototype.ParseOptions = function() {
        var that = this;
        ['key_id', 'key_parent', 'key_child'].forEach(function(item) {
            if (typeof  that.options[item] !== 'undefined') {
                that[item] = that.options[item];
            }
        });
    };

    LTT.prototype.GetParentItems = function(parent) {
        var item, result, _i, _len, _ref;
        result = [];
        _ref = this.list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (item[this.key_parent] === parent) {
                result.push(item);
            }
        }
        return result;
    };

    LTT.prototype.GetItemById = function(id) {
        var item, _i, _len, _ref;
        _ref = this.list;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            item = _ref[_i];
            if (item[this.key_id] === id) {
                return item;
            }
        }
        return false;
    };

    LTT.prototype.GetTree = function() {
        var child, i, obj, parentId, result, _i, _j, _len, _len1, _ref;
        result = [];
        _ref = this.groupParent;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            parentId = _ref[_i];
            obj = this.GetItemById(parentId);
            child = this.GetParentItems(parentId);
            if (obj === false) {
                for (_j = 0, _len1 = child.length; _j < _len1; _j++) {
                    i = child[_j];
                    result.push(i);
                }
            } else {
                obj[this.key_child] = child;
            }
        }
        return result;
    };

    return LTT;

})();

module.exports = LTT;

},{}]},{},[11])

//# sourceMappingURL=f078.js.map
