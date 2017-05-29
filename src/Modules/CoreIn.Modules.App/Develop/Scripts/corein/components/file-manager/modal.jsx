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
            <Modal isOpen={modalOpened} toggle={this.toggle} className="fullscreen ">
                <ModalHeader toggle={this.toggle}>Files and media</ModalHeader>
                <ModalBody>
                    <div id="file-manager">
                        <div id="UploadPane">
                            <div className="card card-block">
                                <JFiler />
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-block">
                                <Button color="danger" onClick={this.deleteBtnClicked.bind(this)} className="pull-left"><i className="icon-trash icons"></i> Delete</Button>
                            </div>
                        </div>
                        {files.length !== 0 ? <FileList /> : getFilesFromServer(loadFiles, 0, initLoadItems)}
                    </div>

                    <ModalSingleFile />

                </ModalBody>

                <ModalFooter>
                    <Button color="primary" onClick={this.toggle}>Select</Button>{' '}
                </ModalFooter>
            </Modal>
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