(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const table = require('./components/table');
const fileManager = require('./components/file-manager');

const appKeys = {
    parentId: 'parentId'
};

module.exports = {
    form: {
        default: require('./components/dynamic-form'),
        validator: require('./components/form/validator'),
        submit: require('./components/form/submit')
    },
    pageAlerts: require('./components/page-alerts'),
    pageComponents: require('./components/page'),
    tabControl: require('./components/tab-control'),
    appKeys,
    table,
    fileManager
};

},{"./components/dynamic-form":2,"./components/file-manager":3,"./components/form/submit":29,"./components/form/validator":30,"./components/page":32,"./components/page-alerts":31,"./components/tab-control":33,"./components/table":34}],2:[function(require,module,exports){
const $ = require('jquery');
const _ = require('underscore');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, getFormValues } = require('redux-form');

const { modalToggle } = require('./file-manager/fm-actions');

var DynamicFormBasic = require('./form/form');

const FileManagerModal = require('./file-manager/modal');


class DynamicForm extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { layout, form, commands, onSubmit, formData, _initialValues} = this.props;

        const initialValues = _initialValues || {};
        if ($.isEmptyObject(initialValues.taxonomyTypes)) {
            if (formData.taxonomyTypes) {
                initialValues.taxonomyTypes = {};
                for (var type in formData.taxonomyTypes) {
                    initialValues.taxonomyTypes[formData.taxonomyTypes[type].typeId] = {}
                }
            }
        }

        const _formData = $.extend(true, {}, formData);
        _formData.details = _.sortBy(formData.details, (o) => o.group);

        var ReduxDynamicForm = reduxForm({
            layout,
            form,
            formData: _formData,
            commands,
            onSubmit,
            initialValues,
        })(DynamicFormBasic);

        ReduxDynamicForm = connect(state => ({ formValues: getFormValues(form)(state) }))(ReduxDynamicForm);

        return (
            React.createElement("div", {className: "dynamic-form"}, 
                React.createElement(ReduxDynamicForm, null), 
                React.createElement(FileManagerModal, null)
            )
        );
    }
}

const stateToProps = (state) => {
    return {
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(DynamicForm);

},{"./file-manager/fm-actions":4,"./file-manager/modal":13,"./form/form":25,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK","underscore":"vBgcj5"}],3:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const classnames = require('classnames');
var { Button } = require('reactstrap');

const fmReducer = require('./file-manager/fm-reducer');
const { getFilesFromServer } = require('./file-manager/fm-ajaxs');
const { loadFiles, fileDelete, toggleAside } = require('./file-manager/fm-actions');
const { deleteFilesFromServer } = require('./file-manager/fm-ajaxs');

const JFiler = require('./file-manager/fm-filer.jsx');
const FileList = require('./file-manager/fm-fileList');
const SidePanel = require('./file-manager/fm-sidePanel');

class FileManager extends React.Component {
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
        const { files, loadFiles, deleteFiles, options: { initLoadItems }, asideOpened, toggleAside } = this.props;

        if (!files)
            return null;

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
                React.createElement("div", {className: classnames('overlay', 'fade-in-out', { 'hidden': !asideOpened }), onClick: () => {
                    toggleAside(false);
                }})
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
    FileManagerModal: require('./file-manager/modal'),
    fmReducer
};

},{"./file-manager/fm-actions":4,"./file-manager/fm-ajaxs":5,"./file-manager/fm-fileList":7,"./file-manager/fm-filer.jsx":8,"./file-manager/fm-reducer":10,"./file-manager/fm-sidePanel":11,"./file-manager/modal":13,"classnames":"4z/pR8","jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],4:[function(require,module,exports){
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

const setOptions = (options) => ({
    type: fmKeys.setOptions,
    options
});

const modalToggle = (isOpen, onSelect) => ({
    type: fmKeys.modalToggle,
    isOpen,
    onSelect
})

const nestedModalToggle = (isOpen) => ({
    type: fmKeys.nestedModalToggle,
    isOpen
})

const setNestedModal = (nestedModal) => ({
    type: fmKeys.setNestedModal,
    nestedModal
});

module.exports = {
    fileUploaded,
    loadFiles,
    fileChecked,
    fileDelete,
    fileClick,
    fileUpdate,
    toggleAside,
    setOptions,
    modalToggle,
    nestedModalToggle,
    setNestedModal
};

},{"./fm-keys":9}],5:[function(require,module,exports){
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

},{"jquery":"XpFelZ"}],6:[function(require,module,exports){
const $ = require('jquery');
const _ = require('underscore');

const { connect } = require('react-redux');
const { fileChecked, toggleAside} = require('./fm-actions');
const { getFormInfoFromServer } = require('./fm-ajaxs');
const { bindActionCreators } = require('redux');
const { reduxForm } = require('redux-form');
const dynamicFormValidator = require('../form/validator');
const {setNestedModal} = require('./fm-actions');
const { tabAdd, tabRemove } = require('../tab-control').actions;
const formSubmit = require('../form/submit');

class FileItem extends React.Component {
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

        if (allowSelectMulti && event.shiftKey && checkedFiles.length > 1) {
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
        const { setNestedModal, tabAdd, tabRemove, toggleAside, options: { displayAsModal } } = this.props;
        getFormInfoFromServer((formResult) => {
            const form = formResult.result;
            const formId = "properties";

            const validate = dynamicFormValidator({ details: form.details, meta: form.meta });
            const onSubmit = formSubmit({
                url: '/filemanager/update',
                method: 'PUT',
                successAction: (response) => {
                    if (displayAsModal)
                        setNestedModal({ toggle: false });
                    else
                        toggleAside(false);
                }
            });

            const _form = $.extend(true, {}, form);
            _form.details = _.sortBy(form.details, (o) => o.group);

            const ReduxDynamicForm = reduxForm({
                layout: 1,
                form: formId,
                validate,
                initialValues: form.initialValues,
                formData: _form,
                onSubmit
            })(require('../form/form'));

            if (!displayAsModal) {
                tabRemove(formId);
                tabAdd(
                    formId,
                    '<i class="icon-wrench icons"></i> ' + formResult.fileName,
                    React.createElement("div", {className: "p-1"}, React.createElement(ReduxDynamicForm, {onClose: () => {
                        toggleAside(false);
                        tabRemove(formId);
                    }}))
                );
                toggleAside(true);
            }
            else {
                setNestedModal({ title: formResult.fileName, content: React.createElement(ReduxDynamicForm, {layout: 1, onClose: () => { setNestedModal({ toggle: false }); }}), toggle: true });
            }

        }, this.props.data.fileName);
    }

    render() {
        const { data: {id, fileName, type, urlThumb, extension} } = this.props;
        const fieldId = `file_${id}`;
        const fieldName = `file[${id}]`;
        return (
            React.createElement("div", {className: "col-sm-6 col-md-4 col-lg-3 col-xl-2 p-0"}, 
                React.createElement("div", {className: "card card-fileThumb mb-1 mr-1"}, 
                    React.createElement("label", {className: "fancy-checkbox-label", htmlFor: fieldId}, 
                        React.createElement("input", {type: "checkbox", className: "thumb-checkbox", id: fieldId, name: fieldName, "data-file-id": id, "data-file-name": fileName, onClick: this.onClick.bind(this)}), 
                        React.createElement("span", {className: "fancy-checkbox fancy-checkbox-img"}), 
                        (type === 'Image'
                            ? React.createElement("img", {src: `\\${urlThumb}`, alt: fileName})
                            : React.createElement("span", {className: "fancy-thumb-icon"}, React.createElement("i", {className: "fa fa-file"}), " ", React.createElement("b", null, extension)))
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
    bindActionCreators({ onChecked: fileChecked, toggleAside, tabAdd, tabRemove, setNestedModal }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileItem);

},{"../form/form":25,"../form/submit":29,"../form/validator":30,"../tab-control":33,"./fm-actions":4,"./fm-ajaxs":5,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK","underscore":"vBgcj5"}],7:[function(require,module,exports){
const $ = require('jquery');
const fmKeys = require('./fm-keys');
const { getFilesFromServer } = require('./fm-ajaxs');
const { connect } = require('react-redux');
const { loadFiles } = require('./fm-actions');
const { bindActionCreators } = require('redux');

var Button = require('reactstrap').Button;
var FileItem = require('./fm-fileItem');

class FileThumbList extends React.Component {
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
                        React.createElement(FileItem, {key: item.id, data: item})
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

},{"./fm-actions":4,"./fm-ajaxs":5,"./fm-fileItem":6,"./fm-keys":9,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],8:[function(require,module,exports){
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


},{"./fm-actions":4,"jquery":"XpFelZ","jquery.filer":"pPPu8c","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],9:[function(require,module,exports){
const fmKeys = {
    fileUploaded: 'FILE_UPLOADED',
    fileChecked: 'FILE_CHEKED',
    fileDelete: 'FILE_DELETE',
    fileClick: 'FILE_CLICK',
    fileUpdate: 'FILE_UPDATE',
    toggleAside: 'SIDEPANEL_TOGGLE',
    loadFiles: 'LOAD_FILES',
    setOptions: "SET_OPTIONS",
    modalToggle: "MODAL_TOGGLE",
    nestedModalToggle: "NESTED_MODAL_TOGGLE",
    setNestedModal: "SET_NESTED_MODAL"
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
        itemPerLoad: 12,
        displayAsModal: false,
    },
    asideOpened: false,
    modal: {
        toggle: false,
        onSelect: null,
        nestedModal: {
            toggle: false,
        }
    }
}

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);

    switch (action.type) {
        case fmKeys.setOptions:
            for (var optionName in action.options) {
                newState.options[optionName] = action.options[optionName];
            }
            break;
        case fmKeys.fileUploaded:
            newState.files.unshift(action.file);
            break;
        case fmKeys.loadFiles:
            if (!newState.files.length && !action.files)
                newState.files = null;
            else
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
        //Modal
        case fmKeys.modalToggle:
            newState.modal.toggle = action.isOpen;
            newState.modal.onSelect = action.onSelect;
            if (action.isOpen)
                newState.checkedFiles = [];
            break;
        case fmKeys.nestedModalToggle:
            newState.modal.nestedModal.toggle = action.isOpen;
            break;
        case fmKeys.setNestedModal:
            newState.modal.nestedModal = action.nestedModal;
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
var { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

const dynamicFormValidator = require('../form/validator');
const DynamicForm = require('../dynamic-form');
const { tabAdd, tabRemove, tabChange } = require('../tab-control').actions;
const TabControl = require('../tab-control').default;

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


},{"../dynamic-form":2,"../form/validator":30,"../tab-control":33,"classnames":"4z/pR8","jquery":"XpFelZ","react":"b6Dds6","react-dom":"Ld8xHf","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],12:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const { nestedModalToggle } = require('./fm-actions');

class ModalSingleFile extends React.Component {
    constructor(props) {
        super(props);
        this.toggleNested = this.toggleNested.bind(this);
    }

    toggleNested() {
        const {nestedModalToggle, nestedModal: { toggle }} = this.props;
        nestedModalToggle(!toggle);
    }

    render() {
        const { nestedModal: { toggle, title, content } } = this.props;
        return (
            React.createElement(Modal, {isOpen: toggle, toggle: this.toggleNested}, 
                React.createElement(ModalHeader, null, title), 
                React.createElement(ModalBody, null, content)
            )
        );
    }
}

const stateToProps = (state) => {
    return {
        nestedModal: state.fm.modal.nestedModal
    }
};

const dispatchToProps = (dispatch) => (
    bindActionCreators({ nestedModalToggle}, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(ModalSingleFile);

},{"./fm-actions":4,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],13:[function(require,module,exports){
const $ = require('jquery');
const _ = require('underscore');

const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const classnames = require('classnames');
var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const { getFilesFromServer, deleteFilesFromServer } = require('./fm-ajaxs');
const { loadFiles, fileDelete, setOptions, modalToggle, nestedModalToggle } = require('./fm-actions');

const JFiler = require('./fm-filer.jsx');
const FileList = require('./fm-fileList');
const SidePanel = require('./fm-sidePanel');

const ModalSingleFile = require('./modal-single-file');

class FileManagerModal extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.toggleNested = this.toggleNested.bind(this);
    }

    toggle() {
        const { files, checkedFiles, modalToggle, modalOpened, onFileSelected } = this.props;
        modalToggle(!modalOpened);
        if (onFileSelected) {
            var items = _.filter(files, (file) => checkedFiles.indexOf(file.fileName) >= 0);
            onFileSelected(items)
        }
    }

    toggleNested() {
        const {nestedModalToggle, nestedModal: { toggle }} = this.props;
        nestedModalToggle(!toggle);
    }

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
        const {
            files,
            checkedFiles,
            loadFiles,
            deleteFiles,
            options: { initLoadItems, displayAsModal },
            asideOpened,
            setOptions,
            modalOpened,
            nestedModal
        } = this.props;

        if (!displayAsModal) {
            setOptions({ displayAsModal: true })
            return null;
        }

        if (!files)
            return null;

        return (
            React.createElement(Modal, {isOpen: modalOpened, toggle: this.toggle, className: "fullscreen "}, 
                React.createElement(ModalHeader, {toggle: this.toggle}, "Files and media"), 
                React.createElement(ModalBody, null, 
                    React.createElement("div", {id: "file-manager"}, 
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
                        files.length !== 0 ? React.createElement(FileList, null) : getFilesFromServer(loadFiles, 0, initLoadItems)
                    ), 

                    React.createElement(ModalSingleFile, null)

                ), 

                React.createElement(ModalFooter, null, 
                    React.createElement(Button, {color: "primary", onClick: this.toggle}, "Select"), ' '
                )
            )
        );
    }
}

const stateToProps = (state) => {
    return {
        modalOpened: state.fm.modal.toggle,
        onFileSelected: state.fm.modal.onSelect,
        nestedModal: state.fm.modal.nestedModal,
        files: state.fm.files,
        options: state.fm.options,
        checkedFiles: state.fm.checkedFiles
    }
};

const dispatchToProps = (dispatch) => (
    bindActionCreators({ loadFiles, fileDelete, setOptions, modalToggle, nestedModalToggle}, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileManagerModal);

},{"./fm-actions":4,"./fm-ajaxs":5,"./fm-fileList":7,"./fm-filer.jsx":8,"./fm-sidePanel":11,"./modal-single-file":12,"classnames":"4z/pR8","jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","underscore":"vBgcj5"}],14:[function(require,module,exports){
const $ = require('jquery');
const classNames = require('classnames')
const {Card, CardBlock, CardHeader, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const renderFieldType = require('./render-field-type');

module.exports = (props) => {
    const { fields, childFields, fieldValidate, display: { title, prompt}, fileManagerModalToggle, executeFormAction, meta: {error, warning } } = props;

    var validationState = fieldValidate ? (error ? 'danger' : (warning && 'warning')) : null;

    return (
        React.createElement("div", {className: "form-member"}, 
            React.createElement("div", {className: classNames({ "mb-1": prompt != undefined })}, 
                React.createElement("label", null, title), 
                prompt && React.createElement(FormText, {color: "muted"}, prompt)
            ), 
            
            React.createElement("div", {className: "form-array-container"}, 
                
                    fields.map((field, index) => {
                        return (
                            React.createElement(Card, {key: index, className: "form-array-item"}, 
                                React.createElement("span", {className: "dot"}), 
                                React.createElement(CardHeader, null, 
                                    "Member #", index + 1, " ", 
                                    React.createElement("div", {className: "card-actions"}, 
                                        React.createElement("a", {className: "btn-close", onClick: 
                                            (e) => {
                                                fields.remove(index);
                                                e.preventDefault();
                                            }, href: "#"}, React.createElement("i", {className: "icon-close"}))
                                    )
                                ), 
                                React.createElement(CardBlock, null, 
                                    
                                        childFields &&
                                        childFields.map((props) => {
                                            $.extend(props, { fileManagerModalToggle, executeFormAction });
                                            return renderFieldType(field, props);
                                        })
                                    
                                )
                            )
                        )
                    }
                ), 
                React.createElement("div", {className: "form-array-actions"}, 
                    React.createElement("div", null, 
                        React.createElement(Button, {type: "button", className: "btn-rounded", outline: true, color: "primary", onClick: () => fields.push({})}, "Add +")
                    )
                )
            ), 
            
                validationState &&
                React.createElement(FormGroup, {color: validationState}, 
                    (error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning))
                )
            
        )
    )
}

},{"./render-field-type":27,"classnames":"4z/pR8","jquery":"XpFelZ","reactstrap":"jldOQ7"}],15:[function(require,module,exports){
const $ = require('jquery');
const _ = require('underscore');

const { modalToggle } = require('../file-manager/fm-actions');
const { Alert, Button } = require('reactstrap');
const renderFieldType = require('./render-field-type')
const CheckboxList = require('./fields/checkboxlist');

module.exports = class BaseForm extends React.Component {
    constructor(props) {
        super(props);
        this.executeFormAction = this.executeFormAction.bind(this);
        this.fileManagerModalToggle = this.fileManagerModalToggle.bind(this);

        this.renderFormHeader = this.renderFormHeader.bind(this);
        this.renderMetaFields = this.renderMetaFields.bind(this);
        this.renderDetailFields = this.renderDetailFields.bind(this);
        this.renderTaxonomies = this.renderTaxonomies.bind(this);
        this.renderFormActions = this.renderFormActions.bind(this);
    }

    fileManagerModalToggle() {
        const { fileManagerModalToggle, fileManagerModalOpened } = this.props;

        return function (selectFunc, options = {}) {
            fileManagerModalToggle(!fileManagerModalOpened, selectFunc);
        }
    }

    executeFormAction(command, fieldData) {
        const { commands, formValues } = this.props;

        commands[command](formValues, fieldData, this.props);
    }

    renderFormHeader() {
        const { display, submitting, error } = this.props;
        return (
            React.createElement("div", {className: "form-header"}, 
                display && React.createElement("h1", null, display.title), 
                display && React.createElement("p", {className: "text-muted"}, display.description), 

                !submitting && (error && React.createElement(Alert, {color: "danger"}, error))
            )
            )
    }

    renderMetaFields() {
        const { formData: { meta } } = this.props;
        return meta &&
            React.createElement("div", {className: "meta"}, 
                meta.map((props, index) => {
                    return renderFieldType("meta", props);
                })
            )
    }

    renderDetailFields() {
        const { formData: { details } } = this.props;
        return details &&
            React.createElement("div", {className: "details"}, 
                details.map((props, index) => {
                    $.extend(props, { fileManagerModalToggle: this.fileManagerModalToggle(), executeFormAction: this.executeFormAction });
                    return renderFieldType("details", props);
                })
            )
    }

    renderTaxonomies() {
        const { formData: { taxonomyTypes } } = this.props;

        return taxonomyTypes &&
            React.createElement("div", {className: "taxonomies"}, 
                
                    taxonomyTypes.map((props) => {
                        const { typeId, input: { name }, display: { title }, taxonomies } = props;
                        return React.createElement(CheckboxList, {key: typeId, taxonomyName: `taxonomyTypes.${typeId}`, title: title, taxonomies: taxonomies});
                    })
                
            )
    }

    renderFormActions() {
        const { submitting, display, onClose } = this.props;

        return (
            React.createElement("div", {className: "actions"}, 
                React.createElement(Button, {color: "primary", type: "submit", disabled: submitting}, display ? display.submitLabel : "Submit"), 
                
                    onClose && React.createElement(Button, {className: "ml-h", type: "Button", onClick: onClose, disabled: submitting}, display ? display.dismissForm : "Cancel")
                
            )
        )
    }
};


},{"../file-manager/fm-actions":4,"./fields/checkboxlist":17,"./render-field-type":27,"jquery":"XpFelZ","reactstrap":"jldOQ7","underscore":"vBgcj5"}],16:[function(require,module,exports){
var {Input, FormGroup, Label} = require('reactstrap');

module.exports = function(props) {
    const {input, display: {id, title, placeholder}} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox", checked: input.value})), 
                React.createElement("span", null), 
                ' ' + title
            )
        )
    );
};

},{"reactstrap":"jldOQ7"}],17:[function(require,module,exports){
const $ = require('jquery');
const listToTree = require('list-to-tree');
const CheckBox = require('./checkbox');
const { Field } = require('redux-form');

class CheckboxList extends React.Component {
    constructor(props) {
        super();
        this.renderNode = this.renderNode.bind(this);
    }


    renderNode(node) {
        const {taxonomyName} = this.props;
        const name = `${taxonomyName}.${node.id}`

        return (
            React.createElement("div", {key: node.id, className: "item"}, 
                React.createElement(Field, {component: CheckBox, display: { title: node.title}, name: name}), 
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
                React.createElement("h6", null, title), 
                tree &&
                    React.createElement("div", {className: "items"}, 
                        
                            $.map(tree, (node) => {
                                return this.renderNode(node);
                            })
                        
                    )
                
            ));
    };
};

module.exports = CheckboxList;

},{"./checkbox":16,"jquery":"XpFelZ","list-to-tree":"3c/Ypl","redux-form":"LVfYvK"}],18:[function(require,module,exports){
const $ = require('jquery');
const { Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button } = require('reactstrap');

const { Editor } = require('react-draft-wysiwyg');
const draftToHtml = require('draftjs-to-html').default;

const { convertToRaw, EditorState, ContentState } = require('draft-js');
const htmlToDraft = require('html-to-draftjs').default;

class FormInput extends React.Component {
    constructor(props) {
        super(props);
        const { input: { value }, display: { type } } = props;
        this.editorStateChange = this.editorStateChange.bind(this);

        const state = {};
        if (value) {
            if (value) {
                let blocksFromHtml = htmlToDraft(value);
                let contentBlocks = blocksFromHtml.contentBlocks;
                let contentState = ContentState.createFromBlockArray(contentBlocks);
                let editorState = EditorState.createWithContent(contentState);
                state.editorState = editorState;
            }
            else {
                state.editorState = EditorState.createEmpty();
            }
        }
        this.state = state;
    }

    editorStateChange(editorState) {
        this.setState({ editorState });
        const value = draftToHtml(convertToRaw(editorState.getCurrentContent()));
        this.props.input.onChange(value);
    }

    render() {
        const { input, fieldValidate, display: { id, type, title, displayName, placeholder, prompt }, meta: { touched, error, warning }, status } = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning && 'warning')) : null;

        return (
            React.createElement(FormGroup, {color: validationState, className: "form-member"}, 
                title && React.createElement(Label, {for: id, dangerouslySetInnerHTML: { __html: title}}), 

                React.createElement(Editor, {
                    placeholder: placeholder, 
                    editorState: this.state.editorState, 
                    editorClassName: "editor", 
                    onEditorStateChange: this.editorStateChange}
                ), 
                prompt && React.createElement(FormText, {color: "muted"}, prompt), 
                touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
            )
        );
    }
}

module.exports = FormInput;

},{"draft-js":"boBfee","draftjs-to-html":"uO7lW/","html-to-draftjs":"ZGWgnz","jquery":"XpFelZ","react-draft-wysiwyg":"pBmj1g","reactstrap":"jldOQ7"}],19:[function(require,module,exports){
const $ = require('jquery');

var { Card, CardBlock, Input, FormFeedback, FormGroup, FormText, Label, Button } = require('reactstrap');

const FileManagerModal = require('../../file-manager/modal');

class ImageField extends React.Component {
    constructor(props) {
        super(props);
        this.renderImage = this.renderImage.bind(this);
        this.renderImageInfo = this.renderImageInfo.bind(this);
        this.onSelectClick = this.onSelectClick.bind(this);
    }

    onSelectClick(e) {
        const { input: { onChange }, fileManagerModalToggle } = this.props;

        fileManagerModalToggle(
            (files) => {
                if (!files.length)
                    return;
                onChange(files[0]);
            }
        );
        e.preventDefault();
    }

    renderImageInfo() {
        const { input: { value } } = this.props;
        return (
            React.createElement("div", {className: "field-image-info"}, 
                React.createElement("div", {className: "mb-h"}, 
                    "Url: ", React.createElement("strong", null, value.url)
                ), 
                React.createElement("div", {className: "mb-h"}, 
                    "Dimension: ", React.createElement("strong", null, value.dimension)
                ), 
                React.createElement("div", {className: "mb-h"}, 
                    "Size: ", React.createElement("strong", null, value.size)
                )
            )          
            );
    }

    renderImage() {
        const { input: { value } } = this.props;
        var img = (value && value.url) ? `/${value.url}` : "/img/default.png";

        return (
            React.createElement("div", {className: "d-flex"}, 
                React.createElement("div", {className: "image-fill d-inline-block", style: { backgroundImage: `url('${img}')`}, tabIndex: "-1"}), 
                
                    React.createElement("div", {className: "d-inline-block ml-1"}, 
                        React.createElement("div", {className: "mb-h"}, 
                            React.createElement("a", {href: "#", onClick: this.onSelectClick}, "Select...")
                        ), 
                        value && this.renderImageInfo()
                    )
                
            )          
            );
    }

    render() {        const { isChildField, fieldValidate, input: { value }, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning} } = this.props;
        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;
        return (
            React.createElement(FormGroup, {color: validationState, className: "form-member"}, 
                React.createElement(Label, null, title), 
                
                    isChildField ? this.renderImage() :
                        React.createElement(Card, null, 
                            React.createElement(CardBlock, null, 
                                this.renderImage()
                            )
                        ), 
                
                prompt && React.createElement(FormText, {color: "muted"}, prompt), 
                touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
            )
        );
    }
}

module.exports = ImageField;

},{"../../file-manager/modal":13,"jquery":"XpFelZ","reactstrap":"jldOQ7"}],20:[function(require,module,exports){
const $ = require('jquery');
const shallowCompare = require('react-addons-shallow-compare');

const {Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button} = require('reactstrap');
const {Editor} = require('react-draft-wysiwyg');
const draftToHtml = require('draftjs-to-html').default;
const { convertToRaw, EditorState, ContentState } = require('draft-js');
const htmlToDraft = require('html-to-draftjs').default;

class FormInput extends React.Component {
    constructor(props) {
        super(props);
        this.actionBtnClick = this.actionBtnClick.bind(this);
        this.renderActions = this.renderActions.bind(this);
    }

    renderActions() {
        const { actions } = this.props;

        if (!actions)
            return null;

        return (
            React.createElement(InputGroupButton, null, 
                actions.map(props => {
                    const { title, command } = props;
                    return React.createElement(Button, {key: command, type: "button", color: "secondary", onClick: () => { this.actionBtnClick(command); }}, title)
                })
            )
        );
    }

    actionBtnClick(command) {
        const { executeFormAction } = this.props;

        executeFormAction(command, this.props);
    }

    render() {
        const { input, fieldValidate, display: { id, type, title, displayName, placeholder, prompt }, meta: { touched, error, warning }, status } = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning && 'warning')) : null;

        return (
            React.createElement(FormGroup, {color: validationState, className: "form-member"}, 
                title && React.createElement(Label, {for: id, dangerouslySetInnerHTML: { __html: title}}), 

                React.createElement(InputGroup, null, 
                    React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName, readOnly: status === 'ReadOnly'})), 
                    this.renderActions()
                ), 
                prompt && React.createElement(FormText, {color: "muted"}, prompt), 
                touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning)))
            )
        );
    }
}

module.exports = FormInput;

},{"draft-js":"boBfee","draftjs-to-html":"uO7lW/","html-to-draftjs":"ZGWgnz","jquery":"XpFelZ","react-addons-shallow-compare":46,"react-draft-wysiwyg":"pBmj1g","reactstrap":"jldOQ7"}],21:[function(require,module,exports){
const $ = require('jquery');
const {Input, FormGroup, Label} = require('reactstrap');

module.exports = function(props) {
    const {input, display: {id, title, placeholder}, values} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, null, title), 

            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {type: "select"}), 
                    
                        $.map(values, (key) => {
                            React.createElement("option", {value: key}, values[key])
                        })
                    
                )
            )
        )
    );
};

},{"jquery":"XpFelZ","reactstrap":"jldOQ7"}],22:[function(require,module,exports){
const $ = require('jquery');
const {Input, FormGroup, Label} = require('reactstrap');

module.exports = function (props) {
    const { input: { value }, display: { title } } = props;
    return (
        React.createElement("div", {className: "mb-h"}, 
            `${title}: `, 
            React.createElement("strong", null, value)
        )
    );
};

},{"jquery":"XpFelZ","reactstrap":"jldOQ7"}],23:[function(require,module,exports){
const $ = require('jquery');
const BaseForm = require('./base-form');

class Form extends BaseForm {
    render() {
        const { handleSubmit } = this.props;

        return (
            React.createElement("form", {onSubmit: handleSubmit}, 
                React.createElement("div", null, 
                    this.renderFormHeader()
                ), 
                React.createElement("div", {className: "mb-1"}, 
                    this.renderMetaFields()
                ), 
                React.createElement("div", {className: "mb-1"}, 
                    this.renderDetailFields()
                ), 
                React.createElement("div", {className: "mb-1"}, 
                    this.renderTaxonomies()
                ), 
                this.renderFormActions()
            )
        );
    }  
};

module.exports = Form;

},{"./base-form":15,"jquery":"XpFelZ"}],24:[function(require,module,exports){
const $ = require('jquery');
const { Row, Col, Card, CardBlock } = require('reactstrap');

const BaseForm = require('./base-form');

class Form extends BaseForm {
    componentDidMount() {
        jQuery("#FormActions").stick_in_parent({ offset_top: 70 });
    }

    render() {
        const { handleSubmit, formData: { taxonomyTypes } } = this.props;

        return (
            React.createElement("form", {onSubmit: handleSubmit}, 
                this.renderFormHeader(), 
                React.createElement(Row, null, 
                    React.createElement(Col, {md: "9"}, 
                        this.renderDetailFields()
                    ), 
                    React.createElement(Col, {md: "3"}, 
                         taxonomyTypes &&
                            React.createElement(Card, null, 
                                React.createElement(CardBlock, null, 
                                    this.renderTaxonomies()
                                )
                            ), 
                        

                        React.createElement(Card, {id: "FormActions"}, 
                            React.createElement(CardBlock, null, 
                                this.renderMetaFields(), 
                                this.renderFormActions()
                            )
                        )
                    )
                )
            )
        );
    }  
};

module.exports = Form;

},{"./base-form":15,"jquery":"XpFelZ","reactstrap":"jldOQ7"}],25:[function(require,module,exports){
const $ = require('jquery');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { modalToggle } = require('../file-manager/fm-actions');

const FormLayout1 = require('./form-layout-one');
const FormLayout2 = require('./form-layout-two');//default: 2

const form = (props) => {
    return (
        props.layout && props.layout === 1 ?
            React.createElement(FormLayout1, React.__spread({},  props)) :
        React.createElement(FormLayout2, React.__spread({},  props))
    );
}

const stateToProps = (state) => {
    return {
        fileManagerModalOpened: state.fm.modal.toggle,
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ fileManagerModalToggle: modalToggle }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(form);

},{"../file-manager/fm-actions":4,"./form-layout-one":23,"./form-layout-two":24,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],26:[function(require,module,exports){
const $ = require('jquery');
const classnames = require('classnames');

const { Button, Input } = require('reactstrap');

var addUrlParam = function (search, key, val) {
    var newParam = key + '=' + val,
        params = '?' + newParam;

    // If the "search" string exists, then build params from it
    if (search) {
        // Try to replace an existance instance
        params = search.replace(new RegExp('([?&])' + key + '[^&]*'), '$1' + newParam);

        // If nothing was replaced, then add the new param to the end
        if (params === search) {
            params += '&' + newParam;
        }
    }

    return params;
};

module.exports = class LanguageSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedLang: props.defaultLanguage
        };

        this.onSelectChange = this.onSelectChange.bind(this);
        this.onButtonClick = this.onButtonClick.bind(this);
        this.getUrl = this.getUrl.bind(this);
        this.isCurrentLang = this.isCurrentLang.bind(this);
    }

    isCurrentLang(lang) {
        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        var langParam = searchParams.get('lang');

        return (langParam === lang) || (!langParam && this.props.defaultLanguage === lang);
    }

    getUrl(lang) {
        return window.location.pathname + addUrlParam(window.location.search, 'lang', lang);
    }

    onSelectChange(e) {
        var target = e.target;
        this.setState({ selectedLang: target.value });
    }

    onButtonClick(e) {
        window.location.href = window.location.pathname + addUrlParam(window.location.search, 'lang', this.state.selectedLang);
    }

    render() {
        const { languages} = this.props;

        return (
            React.createElement("div", {className: "form-language"}, 
                (languages.length >= 5) ?
                    React.createElement("div", null, 
                        React.createElement("div", {className: "pull-right ml-q"}, 
                            React.createElement(Button, {className: "btn btn-secondary", 
                                onClick: this.onButtonClick}, "OK")
                        ), 
                        React.createElement("div", {className: "pull-right"}, 
                            React.createElement(Input, {type: "select", value: this.state.selectedLang, onChange: this.onSelectChange}, 
                                
                                    $.map(languages, (lang, index) => {
                                        return React.createElement("option", {key: index, value: index}, lang);
                                    })
                                
                            )
                        )
                    ) :
                    React.createElement("div", {className: "clearfix"}, 
                        React.createElement("div", {className: "pull-left"}, 
                            "Nhập nội dung cho:" 
                        ), 
                        React.createElement("div", {className: "pull-left"}, 
                            
                                $.map(languages, (lang, index) => {
                                    const isCurrentLang = this.isCurrentLang(index);
                                    return (
                                        React.createElement("div", {key: index, className: "pull-right ml-h"}, 
                                            React.createElement("a", {className: classnames({ 'current-lang': isCurrentLang }), href: !isCurrentLang ? this.getUrl(index) : "#"}, lang)
                                        )
                                    );
                                })
                            
                        )
                    )
                
            )
        );
    }
};

},{"classnames":"4z/pR8","jquery":"XpFelZ","reactstrap":"jldOQ7"}],27:[function(require,module,exports){
const $ = require('jquery');
const { Field, FieldArray} = require('redux-form');
const { renderField } = require('./render-field');

module.exports = function (prefixName, props) {
    const { name, childFields, display } = props;
    const renderFieldArray = require('./array');

    const newProps = $.extend(true, {}, props,
        {
            name: prefixName ? `${prefixName}.${name}` : name,
            key: name
        });

    if (childFields && !(display && display.renderType == "Image"))
        return React.createElement(FieldArray, React.__spread({},  newProps, {component: renderFieldArray}));

    return React.createElement(Field, React.__spread({},  newProps, {component: renderField}));
}

},{"./array":14,"./render-field":28,"jquery":"XpFelZ","redux-form":"LVfYvK"}],28:[function(require,module,exports){
const { Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const ImageField = require('./fields/image');
const CheckboxList = require('./fields/checkboxlist');
const Select = require('./fields/select');
const Editor = require('./fields/editor');
const FormInput = require('./fields/input');
const Text = require('./fields/text');

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

function renderField(props) {
    const { display, status } = props;

    if (!display)
        return null;

    switch (display.renderType) {
        case 'Image':
            return React.createElement(ImageField, React.__spread({},  props))
        case 'InputGroup':
            return RenderInputGroup(props);
        case 'Checkbox':
            return RenderCheckBox(props);
        case 'CheckboxList':
            return React.createElement(CheckboxList, React.__spread({},  props));
        case 'Select':
            return React.createElement(Select, React.__spread({},  props))
        case 'Editor':
            return React.createElement(Editor, React.__spread({},  props))
        case 'Text':
            return React.createElement(Text, React.__spread({},  props))
        default:
            return React.createElement(FormInput, React.__spread({},  props));
    }
};

module.exports = {
    renderField
}


},{"./fields/checkboxlist":17,"./fields/editor":18,"./fields/image":19,"./fields/input":20,"./fields/select":21,"./fields/text":22,"reactstrap":"jldOQ7"}],29:[function(require,module,exports){
const $ = require('jquery');
const {SubmissionError} = require('redux-form');

function formAjaxPromise(url, method, data) {
    return new Promise((resolve, reject) =>
        $.ajax({
            url: url,
            method: method,
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
}

function formSubmit(props) {
    const {url, method, successAction, validate} = props;

    return function (values) {
        if (validate) {
            var errors = validate(values);
            var noErrors = (errors.details == undefined && errors.meta == undefined);
            if (!noErrors)
                return new Promise((resolve) => { resolve(); }).then(
                    () => {
                        throw new SubmissionError(errors);
                    })
        }
        return formAjaxPromise(url, method, values)
            .then((response) => {
                successAction(response, props);
            })
            .catch((response) => {
                if (response.resultState) {
                    throw new SubmissionError(response.Message);
                } else {
                    throw new SubmissionError({ _error: response.statusText });
                }
            });
    }
}

module.exports = formSubmit;

},{"jquery":"XpFelZ","redux-form":"LVfYvK"}],30:[function(require,module,exports){
const $ = require('jquery');

const isType = (value, type) => {
    switch (type) {
        case 'email':
            return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);
    }
    return false;
}

function fieldValidate(fields, values) {
    const errors = {};

    
    for (var field in fields) {
        if (!values)
            values = {};

        const fieldObj = fields[field];

        var fieldName = fieldObj.name;
        var isArray = fieldObj.display && fieldObj.display.renderType != 'Image' && fieldObj.childFields;
        if (isArray && values[fieldName] && values[fieldName].length) {
            for (var index in values[fieldName]) {
                var validateResult = fieldValidate(fieldObj.childFields, values[fieldName][index]);
                if (validateResult) {
                    if (!errors[fieldName])
                        errors[fieldName] = [];
                    errors[fieldName].push(validateResult);
                }
            }
        }

        const validate = fieldObj.fieldValidate;

        if (!validate)
            continue;

        var hasRequired = validate.required;
        var typeRequired = validate.type;
        var minLengthRequired = validate.minLength;
        var maxLengthRequired = validate.maxLength;
        var hasCompare = validate.compare;

        var hasContainLowercase = validate.containLower;
        var hasContainUppercase = validate.containUpper;
        var hasContainNumber = validate.containNumber;
        var hasContainSpecialChar = validate.containSpecial;

        if (hasRequired && !values[fieldName] || (Array.isArray(values[fieldName]) && !values[fieldName].length)) {
            errors[fieldName] = !isArray ? hasRequired : { _error: hasRequired };
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
    return $.isEmptyObject(errors) ? undefined : errors;
}

const validator = fieldGroups => values => {
    const errors = {};

    for (var fieldGroup in fieldGroups) {
        errors[fieldGroup] = fieldValidate(fieldGroups[fieldGroup], values[fieldGroup]);
    }

    return errors;
}

module.exports = validator

},{"jquery":"XpFelZ"}],31:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { Alert } = require('reactstrap');

const keys = {
    push: "PUSH",
    remove: "REMOVE"
};

const actions = {
    push: (alertType, content) => ({
        type: keys.push,
        alertType,
        content
    }),
    remove: (index) => ({
        type: keys.remove,
        index
    })
}

const initState = {
    alerts: []
}

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.push:
            newState.alerts.push({ type: action.alertType, content: action.content });
            break;
        case keys.remove:
            newState.alerts.splice(action.index, 1);
            break;
        default:
            return state;
    }
    return newState;
}

class PageAlerts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { alerts, remove } = this.props;
        return (
            React.createElement("div", null, 
                
                    alerts.map((alert, index) => {
                        return (
                            React.createElement(Alert, {key: index, color: alert.type, 
                                toggle: () => {
                                    remove(index);
                                }}, alert.content)
                            );
                    })
                
            )
            );
    }
}

const stateToProps = (state) => {
    return state.pageAlerts
}

const reducerToProps = (reducer) => (
    bindActionCreators(actions, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(PageAlerts),
    actions,
    reducer
}


},{"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],32:[function(require,module,exports){
const PageTitle = (props) => {
    return (
        React.createElement("h3", {className: "page-title"}, props.children)
        );
}

module.exports = {
    PageTitle
}

},{}],33:[function(require,module,exports){
const $ = require('jquery');
const classnames = require('classnames');
const { Nav, NavItem, NavLink, TabContent, TabPane } = require('reactstrap');

const keys = {
    tabAdd: "TAB_ADD",
    tabRemove: "TAD_REMOVE",
    tabChange: "TAB_CHANGE"
};
const actions = {
    tabAdd: (id, title, content) => ({
        type: keys.tabAdd,
        tab: { id, title, content }
    }),

    tabRemove: (tab) => ({
        type: keys.tabRemove,
        tab
    }),

    tabChange: (tab) => ({
        type: keys.tabChange,
        tab
    })
}

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

module.exports = {
    default: TabControl,
    actions,
    reducer
};



},{"classnames":"4z/pR8","jquery":"XpFelZ","reactstrap":"jldOQ7"}],34:[function(require,module,exports){
const $ = require('jquery');
const _ = require('underscore');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const ReactTable = require('react-table').default;
const { ButtonGroup, Button, Input, Row, Col } = require('reactstrap');

// Keys
const keys = {
    init: "INIT",
    loaded: "LOADED",
    loading: "LOADING",
    selectRow: "SELECT_ROW",
    deleteSelectedRows: "DETETE_SELECTED_ROWS",
    deleteRows: "DELETE_ROWS",
    setTaxonomyTypes: "SET_TAXONOMYTYPE"
};

const ON_PAGE_SIZE_CHANGE = "TABLE@ON_PAGE_SIZE_CHANGE"

// Actions
const actions = {
    init: (initValue) => ({
        type: keys.init,
        initValue
    }),
    dataLoading: (isLoading) => ({
        type: keys.loading,
        isLoading
    }),
    dataLoad: (data) => ({
        type: keys.loaded,
        data
    }),
    selectRow: (index) => ({
        type: keys.selectRow,
        index
    }),
    deleteSelectedRows: () => ({
        type: keys.deleteSelectedRows
    }),

    deleteRows: (indexs) => ({
        type: keys.deleteRows,
        indexs
    }),

    setTaxonomyTypes: (taxonomyTypes) => ({
        type: keys.setTaxonomyTypes,
        taxonomyTypes
    }),
    onPageSizeChange: (pageSize) => ({
        type: ON_PAGE_SIZE_CHANGE,
        pageSize
    })
}

// Reducer
const initialState = {
    data: [],
    pages: 0,
    loading: false,
    defaultPageSize: 25,
    showFilters: true,
    selectedRows: [],
    taxonomyTypes: []
}

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.init:
            newState.columns = action.initValue.columns;
            break;
        case keys.loading:
            newState.loading = true;
            break;
        case keys.loaded:
            newState.data = action.data.entities;
            newState.pages = Math.ceil(action.data.totalCount / (newState.pageSize || newState.defaultPageSize));
            if ((newState.data.length % newState.defaultPageSize) !== 0)
                newState.pages++;
            newState.loading = false;

            break;
        case keys.selectRow:
            var index = newState.selectedRows.indexOf(action.index);
            if (index >= 0)
                newState.selectedRows.splice(index, 1);
            else
                newState.selectedRows.push(action.index);
            break;
        case keys.deleteSelectedRows:
            newState.data = newState.data.filter((row, index) => newState.selectedRows.indexOf(index) < 0);
            newState.selectedRows = [];
            break;
        case keys.deleteRows:
            const filter = (row, index) => (action.indexs.indexOf(index) < 0);
            newState.data = newState.data.filter(filter);
            newState.selectedRows = newState.selectedRows.filter(filter);
            break;
        case keys.setTaxonomyTypes:
            newState.taxonomyTypes = action.taxonomyTypes;
            break;
        case ON_PAGE_SIZE_CHANGE:
            newState.pageSize = action.pageSize
            break;
        default:
            return state;
    }
    return newState;
};

function defaultFilterMethod(filter, row, column) {
    var id = filter.pivotId || filter.id;
    return void 0 === row[id] || String(row[id]).startsWith(filter.value)
}

const dataRequest = (url, pageSize, page, sorted, filtering, taxonomies, entityTypeId, callback) => {
    $.ajax({
        url,
        method: "POST",
        data: { pageSize, page, sorted, filtering, taxonomies, entityTypeId },
        success: callback
    });
}

// Component
class Table extends React.Component {
    constructor(props) {
        super(props);

        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        let entityTypeId = +searchParams.get('entityTypeId');

        this.state = {
            entityTypeId,
            taxonomyTypesProviderUrl: '/TaxonomyUI/GetTaxonomyTypesForEntityType',
        };

        this.taxonomyFiltering = {};
        this.ReactTableState = null;
        this.ReactTableInstance = null;

        this.deleteRows = this.deleteRows.bind(this);
        this.getFirstColumn = this.getFirstColumn.bind(this);
        this.getTaxonomyColumn = this.getTaxonomyColumn.bind(this);
    }

    fetchData(state = this.ReactTableState, instance = this.ReactTableInstance) {
        const { dataUrl, dataLoad } = this.props;

        var taxonomyFiltering = {};
        state.filtered.filter(filter => {
            return filter.id.startsWith('taxonomyTypes');
        }).map(filter => {
            var typeId = filter.id.split('.')[1];
            taxonomyFiltering[typeId] = +filter.value;
        });

        var filtered = state.filtered.filter(filter => {
            return !filter.id.startsWith('taxonomyTypes');
        });

        const entityTypeId = this.state.entityTypeId;

        dataRequest(dataUrl, state.pageSize, state.page + 1, state.sorted, filtered, taxonomyFiltering, entityTypeId, dataLoad);

        this.ReactTableState = state;
        this.ReactTableInstance = instance;
    }

    getFirstColumn() {
        const { selectRow } = this.props;
        return (
            {
                Header: "",
                accessor: 'id',
                Cell: props => {
                    const { selectedRows } = this.props;
                    const checked = selectedRows.indexOf(props.index) >= 0;
                    return (
                        React.createElement("div", {className: "checkbox"}, 
                            React.createElement("input", {type: "checkbox", 
                                onClick: () => {
                                    selectRow(props.index);
                                }, checked: checked}), 
                            React.createElement("span", null)
                        )
                    )
                },
                width: 32,
                sortable: false,
                hideFilter: true
            }
        );
    }

    getActionsColumn() {
        return {
            Header: "Actions",
            accessor: 'id',
            Cell: props => {
                console.log(props)
                return (
                    React.createElement("div", {className: "table-row-actions"}, 
                        React.createElement("div", null, 
                            "Id: ", props.value
                        ), 
                        
                        React.createElement(ButtonGroup, null, 
                            React.createElement("button", {className: "btn btn-icon text-danger", 
                                onClick: () => {
                                    const { deleteRows, deleteProps: { url, success } } = this.props;

                                    this.deleteRows(url, [props.value], (response) => {
                                        success(response);
                                        deleteRows([props.index]);
                                    });
                                }}, 
                                React.createElement("i", {className: "fa fa-trash-o", "aria-hidden": "true"})
                            )
                        )
                    )
                )
            },
            width: 120,
            sortable: false,
            hideFilter: true
        }
    }

    deleteRows(url, rowIds, callback) {
        var result = window.confirm("delete?");
        if (result) {
            $.ajax({
                url,
                method: "DELETE",
                data: { ids: rowIds },
                success: callback
            });
        }
    }

    onDelete() {
        const { data, selectedRows, deleteSelectedRows, deleteProps: { url, success } } = this.props;

        const ids = data.filter((row, index) => {
            return selectedRows.indexOf(index) >= 0;
        }).map((row) => row.id);;

        this.deleteRows(url, ids,
            (response) => {
                success(response);
                deleteSelectedRows();
            });
    }

    

    getTaxonomyColumn(taxonomyType) {
        return {
            Header: taxonomyType.title,
            accessor: `taxonomyTypes.${taxonomyType.id}`,
            Cell: props => {
                return (
                    React.createElement("ul", null, 
                        
                            props.value && props.value.map(taxonomy => {
                                return React.createElement("li", null, taxonomy.title)
                            })
                        
                    )
                )
            },
            width: 200,
            sortable: false,
            filterable: true,
            Filter: (props) => {
                const { filter, onChange } = props;
                return (
                    React.createElement("select", {
                        onChange: event => onChange(event.target.value), 
                        style: { width: '100%'}, 
                        value: filter ? filter.value : 'all'
                    }, 
                        React.createElement("option", {value: ""}, taxonomyType.title), 
                        
                            taxonomyType.taxonomies && taxonomyType.taxonomies.map(taxonomy => {
                                return React.createElement("option", {key: taxonomy.id, value: taxonomy.id}, taxonomy.title)
                            })
                        
                    )
                )
                    }
        }
    }
    render() {
        const { columns, data, pages, loading, defaultPageSize, showFilters, selectedRows, taxonomyTypes, setTaxonomyTypes } = this.props;

        if (!columns)
            return;

        if (this.state.entityTypeId && !taxonomyTypes.length) {
            $.get(this.state.taxonomyTypesProviderUrl, { entityTypeId: this.state.entityTypeId }, setTaxonomyTypes);
            return null;
        }

        if (!(columns[0].accessor === "id")) {
            columns.unshift(this.getFirstColumn());
            for (var taxonomyType in taxonomyTypes) {
                columns.push(this.getTaxonomyColumn(taxonomyTypes[taxonomyType]));
            }
            columns.push(this.getActionsColumn());
        }

        return (
            React.createElement("div", {className: "react-table"}, 
                React.createElement("div", {className: "mb-1 clearfix"}, 
                    React.createElement("div", {className: "pull-right clearfix"}, 
                        React.createElement(Button, {className: "ml-q pull-right", outline: true, disabled: !selectedRows.length, onClick: this.onDelete.bind(this)}, 
                            "Ok"
                        ), 
                        React.createElement("div", {className: "pull-right"}, 
                            React.createElement(Input, {type: "select"}, 
                                React.createElement("option", null, "Delete selected")
                            )
                        )
                    )
                ), 
                React.createElement("div", {className: "table-wrap"}, 
                    React.createElement(ReactTable, {manual: true, 
                        className: "-striped -highlight", 
                        columns: columns, 
                        data: data, 
                        defaultPageSize: defaultPageSize, 
                        loading: loading, 
                        onFetchData: this.fetchData.bind(this), 
                        pages: pages}
                    )
                )
            )
        );
    }
};

const stateToProps = (state) => {
    return {}
};

const reducerToProps = (reducer) => (
    bindActionCreators(actions, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(Table),
    reducer,
    actions,
    dataRequest
}

},{"jquery":"XpFelZ","react-redux":"MzQWgz","react-table":"OYum5A","reactstrap":"jldOQ7","redux":"czVV+t","underscore":"vBgcj5"}],35:[function(require,module,exports){
module.exports = {
    index: require('./page-templates/index'),
    create: require('./page-templates/create'),
    update: require('./page-templates/update'),
    form: require('./page-templates/shared/components/form')
};

},{"./page-templates/create":36,"./page-templates/index":37,"./page-templates/shared/components/form":40,"./page-templates/update":43}],36:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const { connect, Provider } = require('react-redux');
const { Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');
const SharedForm = require('./shared/components/form').default;

const store = createStore(require('./shared/redux/reducer'));
const { PageTitle } = require('../components/page');

var PageContent = (props) => {
    const { parameters, title, description, formUrl, formSubmitData, formCommands, indexUrl, urls} = props;

    return (
        React.createElement("div", null, 
            React.createElement("div", {className: "clearfix mb-1"}, 
                React.createElement("div", {className: "pull-left"}, 
                    React.createElement(PageTitle, null, React.createElement("a", {href: indexUrl || urls.index}, title)), 
                    description
                )
            ), 
            
                React.createElement(SharedForm, {formName: "create", commands: formCommands, formUrlData: parameters, formUrl: formUrl, formSubmitData: formSubmitData})
            
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

},{"../components/page":32,"./shared/components/form":40,"./shared/redux/reducer":42,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],37:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect} = require('react-redux');

const { Provider } = require('react-redux');
const { Button, Card, CardHeader, CardBlock } = require('reactstrap');

const pageAlert = require('../components/page-alerts');
const PageTable = require('./index/components/table');
const { PageTitle } = require('../components/page');

const pageReducer = require('./index/redux/reducer');

const store = createStore(pageReducer);

var PageContent = (props) => {
    const { title, createNewUrl, dataUrl, deleteUrl, tableColumns, urls } = props;

    return (
        React.createElement("div", null, 
            React.createElement(pageAlert.default, null), 
            React.createElement("div", {className: "clearfix mb-1"}, 
                React.createElement("div", {className: "pull-left"}, 
                    React.createElement(PageTitle, null,  title )
                ), 
                React.createElement("div", {className: "pull-left ml-1"}, 
                    React.createElement("a", {className: "btn btn-outline-primary", href:  createNewUrl || urls.create}, "Create new")
                )
            ), 
            React.createElement(Card, null, 
                React.createElement(CardBlock, null, 
                    React.createElement(PageTable, {dataUrl: dataUrl, deleteUrl: deleteUrl, columns: tableColumns})
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

},{"../components/page":32,"../components/page-alerts":31,"./index/components/table":38,"./index/redux/reducer":39,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],38:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');

const Table = require('../../../components/table').default;

const ReduxTable = (props) => {
    const { dataUrl, deleteUrl, columns } = props;

    const deleteProps = {
        url: deleteUrl,
        success: (response) => {
            console.log(response);
        }
    };

    return (
        React.createElement(Table, React.__spread({},  props, {deleteProps: deleteProps, columns: columns, dataUrl: dataUrl}))
    );
}

const stateToProps = (state) => {
    return state.table
}

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);


},{"../../../components/table":34,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t"}],39:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers } = require('redux');

const table = require('../../../components/table').reducer;
const pageAlerts = require('../../../components/page-alerts').reducer;

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
    reducer,
    table,
    pageAlerts
});

},{"../../../components/page-alerts":31,"../../../components/table":34,"jquery":"XpFelZ","redux":"czVV+t"}],40:[function(require,module,exports){
const $ = require('jquery');
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
        this.getForm = this.getForm.bind(this);
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
            commands,
            onSubmit: submit(sumbitProps),
            _initialValues: formData.initialValues,
        };

        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "docs-brief-intro font-italic"}, 
                    
                        formTitle &&
                        React.createElement("div", {className: "card-text"}, 
                            React.createElement("h6", null, 
                                formTitle
                            )
                        ), 
                    
                     formLanguages && React.createElement(LanguageSelect, {languages: formLanguages, defaultLanguage: formDefaultLanguage})
                ), 
                React.createElement(DynamicForm, React.__spread({},  reduxFormProps))
            )
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

},{"../../../components/dynamic-form":2,"../../../components/form/language-select":26,"../../../components/form/submit":29,"../../../components/form/validator":30,"../../../components/page-alerts":31,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","redux-form":"LVfYvK"}],41:[function(require,module,exports){
module.exports = {
};

},{}],42:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./keys');
const { combineReducers } = require('redux');
const formReducer = require('redux-form').reducer;
const fmTabControl = require('../../../components/tab-control').reducer

const pageReducer = (state = {}, action) => {
    return state;
}

module.exports = combineReducers({
    pageAlerts: require('../../../components/page-alerts').reducer,
    page: pageReducer,
    mainForm: require('../components/form').reducer,
    form: formReducer,
    fm: require('../../../components/file-manager').fmReducer,
    fmTabControl
});

},{"../../../components/file-manager":3,"../../../components/page-alerts":31,"../../../components/tab-control":33,"../components/form":40,"./keys":41,"jquery":"XpFelZ","redux":"czVV+t","redux-form":"LVfYvK"}],43:[function(require,module,exports){
const $ = require('jquery');
const { combineReducers, createStore, bindActionCreators } = require('redux');
const {connect, Provider} = require('react-redux');
const { Row, Col, Input, Button, Card, CardHeader, CardBlock } = require('reactstrap');

const PageAlerts = require('../components/page-alerts').default;

const SharedForm = require('./shared/components/form').default;
const { PageTitle } = require('../components/page');

const store = createStore(require('./shared/redux/reducer'));

var PageContent = (props) => {
    const { parameters, title, description, createNewUrl, formUrl, formSubmitData, formCommands, indexUrl, urls } = props;

    return (
        React.createElement("div", null, 
            React.createElement(PageAlerts, null), 
            React.createElement("div", {className: "clearfix mb-1"}, 
                React.createElement("div", {className: "pull-left"}, 
                    React.createElement(PageTitle, null, React.createElement("a", {href: indexUrl || urls.index}, title))
                ), 
                React.createElement("div", {className: "pull-left ml-1"}, 
                    React.createElement("a", {className: "btn btn-outline-primary", href: createNewUrl || urls.create}, "Create new")
                )
            ), 
            
                React.createElement(SharedForm, {formName: "create", commands: formCommands, formUrl: formUrl, formUrlData: parameters, formSubmitData: formSubmitData})
            
        )
    );
};

const stateToProps = (state) => {
    return ({
    });
}

const reducerToProps = (reducer) => (
    bindActionCreators({ }, reducer)
);

PageContent = connect(stateToProps, reducerToProps)(PageContent);

module.exports = (props) => {
    return (
        React.createElement(Provider, {store: store}, 
            React.createElement(PageContent, React.__spread({},  props))
        )
    );
};

},{"../components/page":32,"../components/page-alerts":31,"./shared/components/form":40,"./shared/redux/reducer":42,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],44:[function(require,module,exports){
(function (global){
global.Corein = {
    components: require('./corein/components'),
    pageTemplates: require('./corein/page-templates')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./corein/components":1,"./corein/page-templates":35}],45:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks
 * 
 */

/*eslint-disable no-self-compare */

'use strict';

var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */
function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  // Test for A's keys different from B.
  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

module.exports = shallowEqual;

},{}],46:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule shallowCompare
 */

'use strict';

var shallowEqual = require('fbjs/lib/shallowEqual');

/**
 * Does a shallow comparison for props and state.
 * See ReactComponentWithPureRenderMixin
 * See also https://facebook.github.io/react/docs/shallow-compare.html
 */
function shallowCompare(instance, nextProps, nextState) {
  return (
    !shallowEqual(instance.props, nextProps) ||
    !shallowEqual(instance.state, nextState)
  );
}

module.exports = shallowCompare;


},{"fbjs/lib/shallowEqual":45}]},{},[44])

//# sourceMappingURL=corein.js.map
