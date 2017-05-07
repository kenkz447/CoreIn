(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const validator = require('./components/validator');
const TabControl = require('./components/tabControl');
const tabControlActions = require('./redux/tc-actions');
const tabControlReducer = require('./redux/tc-reducer');
const table = require('./components/table');
const fileManager = require('./components/file-manager');

const appKeys = {
    parentId: 'parentId'
};

module.exports = {
    validator,
    form: {
        default: require('./components/dynamic-form'),
        validator: require('./components/form/validator'),
        submit: require('./components/form/sumbit')
    },
    pageAlerts: require('./components/page-alerts'),
    TabControl,
    tabControlActions,
    tabControlReducer,
    appKeys,
    table,
    fileManager
};

},{"./components/dynamic-form":2,"./components/file-manager":3,"./components/form/sumbit":21,"./components/form/validator":22,"./components/page-alerts":23,"./components/tabControl":24,"./components/table":25,"./components/validator":26,"./redux/tc-actions":27,"./redux/tc-reducer":29}],2:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { getFormValues } = require('redux-form');

const { modalToggle } = require('./file-manager/fm-actions');

var DynamicFormBasic = require('./form/form');

const FileManagerModal = require('./file-manager/modal');

class DynamicForm extends React.Component {
    constructor(props) {
        super(props);
        this.fileManagerModalToggle = this.fileManagerModalToggle.bind(this);
    }

    fileManagerModalToggle() {
        const { fileManagerModalToggle, fileManagerModalOpened } = this.props;

        return function (selectFunc, options = {}) {
            fileManagerModalToggle(!fileManagerModalOpened, selectFunc);
        }
    }

    render() {
        return (
            React.createElement("div", {className: "dynamic-form"}, 
                React.createElement(DynamicFormBasic, React.__spread({},  this.props, {fileManagerModalToggle: this.fileManagerModalToggle()})), 
                React.createElement(FileManagerModal, null)
            )
        );
    }
}

const stateToProps = (state) => {
    return {
        fileManagerModalOpened: state.fm.modal.toggle,
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ fileManagerModalToggle: modalToggle }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(DynamicForm);

},{"./file-manager/fm-actions":4,"./file-manager/modal":12,"./form/form":17,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],3:[function(require,module,exports){
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

},{"./file-manager/fm-actions":4,"./file-manager/fm-ajaxs":5,"./file-manager/fm-fileList":7,"./file-manager/fm-filer.jsx":8,"./file-manager/fm-reducer":10,"./file-manager/fm-sidePanel":11,"./file-manager/modal":12,"classnames":"4z/pR8","jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],4:[function(require,module,exports){
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
const { connect } = require('react-redux');
const { fileChecked, toggleAside} = require('./fm-actions');
const { getFormInfoFromServer } = require('./fm-ajaxs');
const { bindActionCreators } = require('redux');
const { reduxForm } = require('redux-form');
const dynamicFormValidator = require('../form/validator');
const {setNestedModal} = require('./fm-actions');
const { tabAdd, tabRemove } = require('../../redux/tc-actions');
const formSubmit = require('../form/sumbit');

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

            const ReduxDynamicForm = reduxForm({
                form: formId,
                validate,
                initialValues: form.initialValues,
                formData: form,
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
                setNestedModal({ title: formResult.fileName, content: React.createElement(ReduxDynamicForm, {onClose: () => { setNestedModal({ toggle: false }); }}), toggle: true });
            }

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
    bindActionCreators({ onChecked: fileChecked, toggleAside, tabAdd, tabRemove, setNestedModal }, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(FileItem);

},{"../../redux/tc-actions":27,"../form/form":17,"../form/sumbit":21,"../form/validator":22,"./fm-actions":4,"./fm-ajaxs":5,"jquery":"XpFelZ","react-redux":"MzQWgz","redux":"czVV+t","redux-form":"LVfYvK"}],7:[function(require,module,exports){
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
const dynamicFormValidator = require('../form/validator');
const DynamicForm = require('../dynamic-form');
const { tabAdd, tabRemove, tabChange } = require('../../redux/tc-actions');
const TabControl = require('../tabControl');
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


},{"../../redux/tc-actions":27,"../dynamic-form":2,"../form/validator":22,"../tabControl":24,"classnames":"4z/pR8","jquery":"XpFelZ","react":"b6Dds6","react-dom":"Ld8xHf","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],12:[function(require,module,exports){
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
                React.createElement(ModalHeader, {toggle: this.toggle}, "Modal title"), 
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

                    React.createElement(Modal, {isOpen: nestedModal.toggle, toggle: this.toggleNested}, 
                        React.createElement(ModalHeader, null, nestedModal.title), 
                        React.createElement(ModalBody, null, nestedModal.content)
                    )

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

},{"./fm-actions":4,"./fm-ajaxs":5,"./fm-fileList":7,"./fm-filer.jsx":8,"./fm-sidePanel":11,"classnames":"4z/pR8","jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","underscore":"vBgcj5"}],13:[function(require,module,exports){
const $ = require('jquery');
const {Card, CardBlock, CardHeader, Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const renderFieldType = require('./render-field-type');

module.exports = (props) => {
    const { fields, childFields, display: { title }, fileManagerModalToggle, executeFormAction } = props;

    return (
        React.createElement("div", null, 
            React.createElement("div", {className: "mb-1"}, 
                React.createElement("label", null, title), 
                React.createElement(Button, {type: "button", className: "ml-1", onClick: () => fields.push({})}, "+")
            ), 
            
            React.createElement("div", null, 
                
                    fields.map((field, index) => {
                        return (
                            React.createElement(Card, {key: index}, 
                                React.createElement(CardHeader, null, 
                                    "Member #", index + 1, 
                                    React.createElement("div", {className: "card-actions"}, 
                                        React.createElement("a", {className: "btn-close", onClick: () => fields.remove(index), href: "#"}, React.createElement("i", {className: "icon-close"}))
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
                )
            )
        )
    )
}

},{"./render-field-type":19,"jquery":"XpFelZ","reactstrap":"jldOQ7"}],14:[function(require,module,exports){
var {Input, FormGroup, Label} = require('reactstrap');

module.exports = function(props) {
    const {input, display: {id, title, placeholder}} = props;
    return (
        React.createElement(FormGroup, {check: true}, 
            React.createElement(Label, {check: true}, 
                React.createElement(Input, React.__spread({},  input, {id: id, type: "checkbox", checked: input.value})), 
                ' ' + title
            )
        )
    );
};

},{"reactstrap":"jldOQ7"}],15:[function(require,module,exports){
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

module.exports = CheckboxList;

},{"./checkbox":14,"jquery":"XpFelZ","list-to-tree":"3c/Ypl","redux-form":"LVfYvK"}],16:[function(require,module,exports){
const $ = require('jquery');
const shallowCompare = require('react-addons-shallow-compare');

const {Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button} = require('reactstrap');

class FormInput extends React.Component {
    constructor(props) {
        super();
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
                    const {title, command} = props;
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
        const {input, fieldValidate, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status} = this.props;

        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

        return (
            React.createElement(FormGroup, {color: validationState, className: "form-member"}, 
                title && React.createElement(Label, {for: id, dangerouslySetInnerHTML: { __html: title}}), 
                React.createElement(InputGroup, null, 
                    React.createElement(Input, React.__spread({},  input, {id: id, state: validationState, type: type, placeholder: placeholder ? placeholder : displayName, readOnly: status === 'ReadOnly'})), 
                    this.renderActions()
                ), 
                touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning))), 
                prompt && React.createElement(FormText, {color: "muted"}, prompt)
            )
        );
    }
}

module.exports = FormInput;

    //(props) => {
    //    const {input, fieldValidate, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning}, status, actions, executeFormAction} = props;

    //    var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;

    //    return (
    //        <FormGroup color={validationState} className="form-member">
    //            {title && <Label for={id} dangerouslySetInnerHTML={{ __html: title }} />}
    //            <InputGroup>
    //                <Input {...input} id={id} state={validationState} type={type} placeholder={placeholder ? placeholder : displayName} readOnly={status === 'ReadOnly'} />
    //                {
    //                    actions &&
    //                    <InputGroupButton>
    //                        {actions.map(props => {
    //                            const {title, command} = props;
    //                            return <Button key={command} type="button" color="secondary"
    //                                onClick={() => {
    //                                    executeFormAction(command, props);
    //                                }
    //                                }>{title}</Button>
    //                        })}
    //                    </InputGroupButton>
    //                }
    //            </InputGroup>
    //            {touched && ((error && <FormFeedback>{error}</FormFeedback>) || (warning && <FormFeedback>{warning}</FormFeedback>))}
    //            {prompt && <FormText color="muted">{prompt}</FormText>}
    //        </FormGroup>
    //    );
    //};

},{"jquery":"XpFelZ","react-addons-shallow-compare":32,"reactstrap":"jldOQ7"}],17:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { reduxForm, Field, FieldArray} = require('redux-form');
const { FormGroup, Label, Input } = require('reactstrap');
const { Alert, Button } = require('reactstrap');
const { renderField } = require('./render-field');
const CheckboxList = require('./fields/checkboxlist');

const renderFieldType = require('./render-field-type')

module.exports = class Form extends React.Component {
    constructor(props) {
        super(props);
        this.executeFormAction = this.executeFormAction.bind(this);
    }


    executeFormAction(command, fieldData) {
        const { commands, formValues } = this.props;

        commands[command](formValues, fieldData);
    }


    render() {
        const { formName, formData, onClose, error, handleSubmit, pristine, reset, submitting, submitSucceeded, display, fileManagerModalToggle } = this.props;

        return (
            React.createElement("form", {onSubmit: handleSubmit}, 
                display && React.createElement("h1", null, display.title), 
                display && React.createElement("p", {className: "text-muted"}, display.description), 

                !submitting && (error && React.createElement(Alert, {color: "danger"}, error)), 

                
                    formData.meta &&
                    React.createElement("div", {className: "meta"}, 
                        formData.meta.map((props, index) => {
                            return renderFieldType("meta", props);
                        })
                    ), 
                

                
                    formData.details &&
                    React.createElement("div", {className: "details"}, 
                        formData.details.map((props, index) => {
                            $.extend(props, { fileManagerModalToggle, executeFormAction: this.executeFormAction });
                            return renderFieldType("details", props);
                        })
                    ), 
                

                
                    formData.taxonomyTypes &&
                    React.createElement("div", {className: "taxonomies"}, 
                        
                            formData.taxonomyTypes.map((props) => {
                                const { typeId, input: {name}, display: {title}, taxonomies} = props;
                                return React.createElement(CheckboxList, {key: typeId, taxonomyName: `taxonomyTypes.${typeId}`, title: title, taxonomies: taxonomies});
                            })
                        
                    ), 
                
                React.createElement("hr", null), 
                React.createElement("div", {className: "actions"}, 
                    React.createElement(Button, {className: "mr-1", color: "primary", type: "submit", disabled: submitting}, display ? display.submitLabel : "Submit"), 
                    
                        onClose && React.createElement(Button, {type: "Button", onClick: onClose, disabled: submitting}, display ? display.dismissForm : "Cancel")
                    
                )
            )
        );
    }  
};

},{"./fields/checkboxlist":15,"./render-field":20,"./render-field-type":19,"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t","redux-form":"LVfYvK"}],18:[function(require,module,exports){
const $ = require('jquery');

var {Input, InputGroup, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const FileManagerModal = require('../file-manager/modal');

class ImageField extends React.Component {
    constructor(props) {
        super(props);

    }

    openModal() {
        const { input: {onChange}, fileManagerModalToggle } = this.props;

        fileManagerModalToggle(
            (files) => {
                if (!files.length)
                    return

                var file = files[0];
                onChange(file.meta.src);
            }
        )
    }

    render() {
        const { fieldValidate, input: { value }, display: {id, type, title, displayName, placeholder, prompt}, meta: {touched, error, warning} } = this.props;
        var validationState = fieldValidate && touched ? (error ? 'danger' : (warning ? 'warning' : 'success')) : undefined;
        var img = value ? value.replace(/\\/g, "/") : "/img/default.png";
        return (
            React.createElement(FormGroup, {color: validationState, className: "form-member"}, 
                React.createElement(Label, null, title), 
                React.createElement("div", null, 
                    React.createElement("div", {className: "image-fill", style: { backgroundImage: `url('${img}')`}, tabIndex: "-1", onClick: this.openModal.bind(this)})
                ), 
                touched && ((error && React.createElement(FormFeedback, null, error)) || (warning && React.createElement(FormFeedback, null, warning))), 
                prompt && React.createElement(FormText, {color: "muted"}, prompt)
            )
        );
    }
}

module.exports = ImageField;

},{"../file-manager/modal":12,"jquery":"XpFelZ","reactstrap":"jldOQ7"}],19:[function(require,module,exports){
const $ = require('jquery');
const { Field, FieldArray} = require('redux-form');
const { renderField } = require('./render-field');

module.exports = function (prefixName, props) {
    const { name, childFields } = props;
    const renderFieldArray = require('./array');

    const newProps = $.extend(true, {}, props,
        {
            name: prefixName ? `${prefixName}.${name}` : name,
            key: name
        });


    if (childFields)
        return React.createElement(FieldArray, React.__spread({},  newProps, {component: renderFieldArray}));

    return React.createElement(Field, React.__spread({},  newProps, {component: renderField}));
}

},{"./array":13,"./render-field":20,"jquery":"XpFelZ","redux-form":"LVfYvK"}],20:[function(require,module,exports){
const { Input, InputGroup, InputGroupButton, InputGroupAddon, FormFeedback, FormGroup, FormText, Label, Button, Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const FormInput = require('./form-input');
const ImageField = require('./image');
const CheckboxList = require('./fields/checkboxlist');

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

const RenderHidden = (props) => {
    const {input} = props;
    return (
        React.createElement("input", React.__spread({},  input, {type: "hidden"}))
    );
}

function renderField(props) {
    const {display, status } = props;

    if (status && status.toLowerCase() == 'hidden')
        return RenderHidden(props);

    var rt = display.renderType.toLowerCase();
    switch (rt) {
        case 'image':
            return React.createElement(ImageField, React.__spread({},  props))
        case 'inputgroup':
            return RenderInputGroup(props);
        case 'checkbox':
            return RenderCheckBox(props);
        case 'checkboxlist':
            return React.createElement(CheckboxList, React.__spread({},  props));
        default:
            return React.createElement(FormInput, React.__spread({},  props));
    }
};

module.exports = {
    renderField
}


},{"./fields/checkboxlist":15,"./form-input":16,"./image":18,"reactstrap":"jldOQ7"}],21:[function(require,module,exports){
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
                successAction(response);
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

},{"jquery":"XpFelZ","redux-form":"LVfYvK"}],22:[function(require,module,exports){
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

        if (fieldObj.childFields) {
            for (var value in values[fieldName]) {
                var validateResult = fieldValidate(fieldObj.childFields, values[fieldName][value]);
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
            errors[fieldName] = hasRequired;
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

},{"jquery":"XpFelZ"}],23:[function(require,module,exports){
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


},{"jquery":"XpFelZ","react-redux":"MzQWgz","reactstrap":"jldOQ7","redux":"czVV+t"}],24:[function(require,module,exports){
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



},{"classnames":"4z/pR8","reactstrap":"jldOQ7"}],25:[function(require,module,exports){
const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const ReactTable = require('react-table').default;
const {Button} = require('reactstrap');

// Keys
const keys = {
    init: "INIT",
    loaded: "LOADED",
    loading: "LOADING",
    selectRow: "SELECT_ROW",
    deleteSelectedRows: "DETETE_SELECTED_ROWS"
};

// Actions
const actions = {
    init: (initValue) => ({
        type: keys.init,
        initValue
    }),
    onLoading: (isLoading) => ({
        type: keys.loading,
        isLoading
    }),
    onLoaded: (data) => ({
        type: keys.loaded,
        data
    }),
    selectRow: (index) => ({
        type: keys.selectRow,
        index
    }),
    deleteSelectedRows: () => ({
        type: keys.deleteSelectedRows
    })
}

// Reducer
const initialState = {
    data: [],
    pages: 0,
    loading: false,
    defaultPageSize: 25,
    showFilters: true,
    selectedRows: []
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
            newState.data = action.data;
            newState.pages = parseInt(newState.data.length / newState.defaultPageSize);
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
        default:
            return state;
    }
    return newState;
};

function defaultFilterMethod (filter, row, column)
{
    var id = filter.pivotId || filter.id;
    return void 0 === row[id] || String(row[id]).startsWith(filter.value)
}

// Component
class Table extends React.Component {
    constructor(props) {
        super();
        this.getCheckColumn = this.getCheckColumn.bind(this);
    }

    fetchData(state, instance) {
        const { dataUrl, onLoaded } = this.props;

        $.get(dataUrl, onLoaded);
    }

    getCheckColumn() {
        const { selectRow, selectedRows } = this.props;

        return (
            {
                header: "",
                accessor: 'id',
                render: row => (
                    React.createElement("div", null, 
                        React.createElement("input", {type: "checkbox", 
                            onClick: () => {
                                selectRow(row.index);
                            }, checked: selectedRows.indexOf(row.index) >= 0})
                    )
                ),
                width: 22,
                sortable: false,
                hideFilter: true
            }
        );
    }

    onDelete() {
        const {data, selectedRows, deleteSelectedRows, deleteProps: { url, success }} = this.props;

        const ids = data.filter((row, index) => {
            return selectedRows.indexOf(index) >= 0;
        }).map((row) => row.id);;

        $.ajax({
            url,
            method: "DELETE",
            data: { ids },
            success: (response) => {
                success(response);
                deleteSelectedRows();
            }
        });
    }

    render() {
        const {columns, data, pages, loading, defaultPageSize, showFilters, selectedRows } = this.props;

        if (!columns)
            return;

        columns.unshift(this.getCheckColumn());

        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "mb-1 text-right"}, 
                    React.createElement(Button, {className: "btn-circle", outline: true, color: "danger", disabled: !selectedRows.length, 
                        onClick: this.onDelete.bind(this)}, " ", React.createElement("i", {className: "fa fa-remove"}))
                ), 

                React.createElement(ReactTable, {
                    className: "-striped -highlight", 
                    manual: true, 
                    defaultPageSize: defaultPageSize, 
                    showFilters: showFilters, 
                    data: data, 
                    pages: pages, 
                    loading: loading, 
                    columns: columns, 
                    onChange: this.fetchData.bind(this), 
                    defaultFilterMethod: defaultFilterMethod}
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
    actions
}


},{"jquery":"XpFelZ","react-redux":"MzQWgz","react-table":"OYum5A","reactstrap":"jldOQ7","redux":"czVV+t"}],26:[function(require,module,exports){
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

},{}],27:[function(require,module,exports){
const keys = require('./tc-keys');

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

},{"./tc-keys":28}],28:[function(require,module,exports){
const keys = {
    tabAdd: "TAB_ADD",
    tabRemove: "TAD_REMOVE",
    tabChange: "TAB_CHANGE"
};

module.exports = keys;

},{}],29:[function(require,module,exports){
const $ = require('jquery');
const keys = require('./tc-keys');

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

},{"./tc-keys":28,"jquery":"XpFelZ"}],30:[function(require,module,exports){
(function (global){
global.Corein = {
    components: require('./corein/components')
}

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./corein/components":1}],31:[function(require,module,exports){
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

},{}],32:[function(require,module,exports){
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


},{"fbjs/lib/shallowEqual":31}]},{},[30])

//# sourceMappingURL=corein.js.map
