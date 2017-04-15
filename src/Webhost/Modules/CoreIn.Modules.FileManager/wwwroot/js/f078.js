(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const react = require('react');
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {reduxForm, Field, FieldArray} = require('redux-form');
const { renderField } = require('corein');
const { FormGroup, Label, Input } = require('reactstrap');

var CheckboxTree = require('react-checkbox-tree');
var {Alert, Button} = require('reactstrap');

const CheckBoxNode = (props) => {
    const { childrenTerms, level, taxonomyName } = props;
    var a = $.map(childrenTerms,
        (term, index) => {
            const display = {
                renderType: 'checkbox',
                title: term.title
            }
            const taxName = `${taxonomyName}.${term.name}`;

            return (
                React.createElement("div", {check: true, key: index, className: `pl-${level}`}, 
                    React.createElement(Field, {component: renderField, type: "checkbox", display: display, name: taxName}), 
                    term.childrenTerms &&
                        React.createElement(CheckBoxNode, {level: level + 1, childrenTerms: term.childrenTerms, taxonomyName: taxonomyName})
                ));
        });

    return React.createElement("div", {className: `checkboxlist-${level === 0 ? 'root' : 'node'}`}, a);
};

const CheckboxList = (props) => {
    const { terms, taxonomyName, label } = props;
    return (
        React.createElement("div", {className: "checkboxlist"}, 
            React.createElement("h4", null, label), 
            terms && React.createElement(CheckBoxNode, {childrenTerms: terms, taxonomyName: taxonomyName, level: 0})
        ));
};

const CHECKBOXLIST = 'checkboxlist';

const TaxonomyFields = (props) => {
    const { renderType, terms, taxonomyName, label  } = props;
    switch (renderType) {
        default:
            return React.createElement(CheckboxList, {terms: terms, taxonomyName: taxonomyName, label: label});
    }
};

var DynamicForm = (props) => {
    const { formName, formData: { details, taxonomies }, close, error, handleSubmit, submitFunc, pristine, reset, submitting, submitSucceeded, display } = props;

    return (
        React.createElement("div", {className: "dynamic-form card-block"}, 
            React.createElement("form", {onSubmit: handleSubmit(submitFunc)}, 
                display && React.createElement("h1", null, display.title), 
                display && React.createElement("p", {className: "text-muted"}, display.description), 
                
                !submitting && (error && React.createElement(Alert, {color: "danger"}, error)), 
                React.createElement("div", {className: "details"}, 
                    details.map((props, index) => {
                        const {readonly, input: {name, value}, display} = props;
                        return React.createElement(Field, {key: index, component: renderField, readOnly: readonly, name: name, value: value, display: display});
                    })
                ), 
                React.createElement("div", {className: "taxonomies"}, 
                    
                        taxonomies && taxonomies.map((props, index) => {
                            return React.createElement(TaxonomyFields, {key: index, renderType: props.renderType, taxonomyName: `taxonomies.${props.input.name}`, label: props.display.label, terms: props.terms});
                        })
                    
                ), 
                React.createElement("hr", null), 
                React.createElement("div", {className: "actions"}, 
                    React.createElement(Button, {className: "mr-1", color: "primary", type: "submit", disabled: submitting}, display ? display.submitLabel : "Submit"), 
                    React.createElement(Button, {type: "Button", onClick: () => {
                        close(formName);
                    }, disabled: submitting}, display ? display.dismissForm : "Cancel")
                )
            )
        )
    );
};

module.exports = DynamicForm;

},{"corein":15,"jquery":"XpFelZ","react":"b6Dds6","react-checkbox-tree":"j7fO+X","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","redux-form":"LVfYvK"}],2:[function(require,module,exports){
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

const sidePanelToggle = (isOpen) => ({
    type: fmKeys.sidePanelToggle,
    isToggle: isOpen
});


const asideTabAdd = (tabId, tabTitle, tabContent) => ({
    type: fmKeys.asideTabAdd,
    tabId, tabTitle, tabContent
});

const asideTabRemove = (tabId) => ({
    type: fmKeys.asideTabRemove,
    tabId
});

const asideTabChange = (tab) => ({
    type: fmKeys.asideTabChange,
    tab
});

module.exports = { fileUploaded, loadFiles, fileChecked, fileDelete, fileClick, fileUpdate, sidePanelToggle, asideTabAdd, asideTabRemove, asideTabChange };

},{"./fm-keys":9}],3:[function(require,module,exports){
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

},{"jquery":"XpFelZ"}],4:[function(require,module,exports){
const react = require('react');
const $ = require('jquery');
const { connect } = require('react-redux');
const { fileChecked, asideTabAdd, asideTabRemove } = require('./fm-actions');
const { getFormInfoFromServer } = require('./fm-ajaxs');
const { bindActionCreators } = require('redux');
const { validator } = require('corein');
const { reduxForm } = require('redux-form');

const fmKeys = require('./fm-keys');

var DynamicForm = require('./dynamicForm.jsx');

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
        const { asideTabAdd, asideTabRemove } = this.props;
        const { updateFileSubmit } = require('./fm-formSubmits');
        const formName = "properties";

        getFormInfoFromServer((formInfoResult) => {
            const fields = formInfoResult.result.details;
            const validate = validator(fields);
            const fieldValues = {}; 
            $.map(fields, (field) => {
                const name = field.input.name;
                const value = field.input.value;
                fieldValues[name] = value;
            });
            DynamicForm = reduxForm({ form: 'fileProperty', validate })(DynamicForm);
            DynamicForm = connect((state) => ({
                initialValues: fieldValues,
                formName,
                formData: formInfoResult.result,
                submitFunc: updateFileSubmit
            }), (dispatch) => (bindActionCreators({ close: asideTabRemove}, dispatch)))(DynamicForm);

            asideTabRemove(formName); 
            asideTabAdd(
                formName,
                '<i class="icon-wrench icons"></i> ' + formInfoResult.fileName,
                React.createElement(DynamicForm, null)
            );
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
    bindActionCreators({ onChecked: fileChecked, asideTabAdd, asideTabRemove }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileItem);

},{"./dynamicForm.jsx":1,"./fm-actions":2,"./fm-ajaxs":3,"./fm-formSubmits":7,"./fm-keys":9,"corein":15,"jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],5:[function(require,module,exports){
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

},{"./fm-actions":2,"./fm-ajaxs":3,"./fm-fileItem":4,"./fm-keys":9,"jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],6:[function(require,module,exports){
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


},{"./fm-actions":2,"jquery":"XpFelZ","jquery.filer":"pPPu8c","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],7:[function(require,module,exports){
var $ = require('jquery');
var {SubmissionError} = require('redux-form');

const updateFileRequest = data => new Promise((resolve, reject) =>
    $.ajax({
        url: '/filemanager/update',
        method: 'POST',
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

function updateFileSubmit(values) {
    return updateFileRequest(values)
        .then((response) => {
            window.location.href = response.returnUrl;
        })
        .catch((response) => {
            if (response.result && response.result === "error") {
                throw new SubmissionError(response.errors);
            } else {
                throw new SubmissionError({ _error: 'Update failed!' });
            }
        });
}

module.exports = {
    updateFileSubmit
}

},{"jquery":"XpFelZ","redux-form":"LVfYvK"}],8:[function(require,module,exports){
const react = require('react');
const $ = require('jquery');
const fmReducer = require('./fm-reducer.jsx');
const { getFilesFromServer } = require('./fm-ajaxs');
const { connect } = require('react-redux');
const { loadFiles, fileDelete } = require('./fm-actions');
const { bindActionCreators } = require('redux');

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
        const { files, loadFiles, deleteFiles, options: {initLoadItems, showPanel} } = this.props;
        return (
            React.createElement("div", {id: "file-manager"}, 
                React.createElement("div", {id: "UploadPane"}, 
                    React.createElement("div", {className: "card card-block"}, 
                        React.createElement(JFiler, null)
                    ), 
                    React.createElement("div", {className: "card"}, 
                        React.createElement("div", {className: "card-block"}, 
                            React.createElement(Button, {color: "danger", onClick: this.deleteBtnClicked.bind(this), className: "pull-left"}, React.createElement("i", {className: "icon-trash icons"}), " Delete")
                        )
                    ), 
                    files.length !== 0 ? React.createElement(FileList, null) : getFilesFromServer(loadFiles, 0, initLoadItems), 
                    React.createElement(SidePanel, null)
                )
            )
        );
    }
}

const stateToProps = (state) => ({
    files: state.fm.files,
    options: state.fm.options,
    checkedFiles: state.fm.checkedFiles
});

const dispatchToProps = (dispatch) => (
    bindActionCreators({ loadFiles, fileDelete}, dispatch)
);

module.exports = {
    FileManager: connect(stateToProps, dispatchToProps)(FileManager),
    fmReducer
};

},{"./fm-actions":2,"./fm-ajaxs":3,"./fm-fileList":5,"./fm-filer.jsx":6,"./fm-reducer.jsx":10,"./fm-sidePanel":11,"jquery":"XpFelZ","react":"b6Dds6","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],9:[function(require,module,exports){
const fmKeys = {
    fileUploaded: 'FILE_UPLOADED',
    fileChecked: 'FILE_CHEKED',
    fileDelete: 'FILE_DELETE',
    fileClick: 'FILE_CLICK',
    fileUpdate: 'FILE_UPDATE',
    sidePanelToggle: 'SIDEPANEL_TOGGLE',
    loadFiles: 'LOAD_FILES',
    asideTabAdd: 'ASIDE_TAB_ADD',
    asideTabRemove: 'ASIDE_TAB_REMOVE',
    asideTabChange: 'ASIDE_TAB_CHANGE'
};

module.exports = fmKeys;

},{}],10:[function(require,module,exports){
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
    aside: {
        activeTab: null,
        isOpen: false,
        tabs: []
    }
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
        case fmKeys.asideTabAdd:
            newState.aside.tabs.push({
                id: action.tabId,
                title: action.tabTitle,
                content: action.tabContent
            });
            newState.aside.isOpen = true;
            newState.aside.activeTab = action.tabId;
            break;
        case fmKeys.asideTabRemove:
            newState.aside.tabs = newState.aside.tabs.filter(tab => tab.id !== action.tabId);
            if (newState.aside.tabs.length === 0) {
                newState.aside.isOpen = false;
            } else {
                newState.aside.activeTab = newState.aside.tabs[0].id;
            }
            break;
        case fmKeys.asideTabChange:
            if (newState.aside.activeTab !== action.tab.id)
                newState.aside.activeTab = action.tab.id;
            break;
        
        default:
            return state;
    }
    return newState;
}

module.exports = reducer;

},{"./fm-keys":9,"jquery":"XpFelZ","sift":"yAbQ3S"}],11:[function(require,module,exports){
const react = require('react');
const reactDOM = require('react-dom');
const $ = require('jquery');
const { connect } = require('react-redux');
const classnames = require('classnames');
const { bindActionCreators } = require('redux');
const { asideTabChange } = require('./fm-actions');

var { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

class SidePanel extends react.Component {
    render() {
        const { isOpen, activeTab, tabs, tabChange } = this.props;
        return (
            React.createElement("aside", {className: "aside-menu" + (isOpen && " aside-menu-hidden")}, 
                activeTab && (
                    React.createElement("div", {className: "tab-container"}, 
                        React.createElement(Nav, {tabs: true}, 
                            tabs.map((tab) => (
                            React.createElement(NavItem, {key: tab.id}, 
                                    React.createElement(NavLink, {className: classnames({ active: activeTab === tab.id }), 
                                        onClick: () => { tabChange(tab); }, 
                                        dangerouslySetInnerHTML: { __html: tab.title}})
                                )
                            ))
                        ), 
                        React.createElement(TabContent, {activeTab: activeTab}, 
                            tabs.map((tab) => (
                            React.createElement(TabPane, {key: tab.id, tabId: tab.id}, 
                                    tab.content
                                )
                            ))
                        )
                    ))
                 
            )
        );
    }
}

const stateToProps = (state) => ({
    isOpen: state.fm.aside.isOpen, 
    activeTab: state.fm.aside.activeTab,
    tabs: state.fm.aside.tabs
});

const distpatchToProps = (dispatch) => (
    bindActionCreators({ tabChange: asideTabChange}, dispatch)
    );

module.exports = connect(stateToProps, distpatchToProps)(SidePanel);


},{"./fm-actions":2,"classnames":"4z/pR8","jquery":"XpFelZ","react":"b6Dds6","react-dom":"Ld8xHf","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],12:[function(require,module,exports){
(function (global){
﻿const react = require('react');
const { combineReducers, createStore } = require('redux');
var { Provider } = require('react-redux');
const formReducer = require('redux-form').reducer;

var { FileManager, fmReducer } = require('./components/fm-index.jsx');

const reducers = {
    form: formReducer,
    fm: fmReducer
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
},{"./components/fm-index.jsx":8,"react":"b6Dds6","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],13:[function(require,module,exports){
var React = require('react');
var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label} = require('reactstrap');

const RenderInput = (props) => {
    const {input, id, type, placeholder, validationState} = props;

    return (
        React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder}))
    );
}

const RenderInputGroup = (props) => {
    const {input, display: {id, type, label, displayName, placeholder, prompt}, meta: {touched, error, warning}} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, {color: validationState, className: "mb-1"}, 
            React.createElement(InputGroup, null, 
                React.createElement(InputGroupAddon, {dangerouslySetInnerHTML: { __html: label}}), 
                React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName}))
            ), 
            prompt && React.createElement(FormText, {color: "muted"}, prompt), 
            touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
        )
    );
}

const RenderFormGroup = (props) => {
    const {input, display: {id, type, label, displayName, placeholder, prompt}, meta: {touched, error, warning}} = props;

    var validationState = touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    return (
        React.createElement(FormGroup, {color: validationState, className: "mb-1"}, 
            React.createElement(Label, {for: id, dangerouslySetInnerHTML: { __html: label}}), 
            React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName})), 
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
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox"})), 
                ' ' + (title ? title : placeholder)
            )
        )
    );
}

const renderField = props => {
    const {display: {renderType}} = props;
    var rt = renderType.toLowerCase();

    if (rt === "inputgroup") {
        return RenderInputGroup(props);
    } else if (rt === 'formgroup'){
        return RenderFormGroup(props);
    } else if (rt === 'checkbox') {
        return RenderCheckBox(props);
    }
}

module.exports = renderField;

},{"react":"b6Dds6","reactstrap":"jldOQ7"}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
var renderField = require('./components/formField.jsx');
var validator = require('./components/validator');

module.exports = {
    renderField,
    validator
};

},{"./components/formField.jsx":13,"./components/validator":14}]},{},[12])

//# sourceMappingURL=f078.js.map
