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
            <div id="file-manager" className={classnames({ 'aside-menu-hidden': !asideOpened })}>
                <div id="UploadPane">
                    <div className="card card-block">
                        <JFiler/>
                    </div>
                </div>
                <div className="card">
                    <div className="card-block">
                        <Button color="danger" onClick={this.deleteBtnClicked.bind(this)} className="pull-left"><i className="icon-trash icons"></i> Delete</Button>
                    </div>
                </div>
                {files.length !== 0 ? <FileList /> : getFilesFromServer(loadFiles, 0, initLoadItems)}
                <SidePanel />
                <div className={classnames('overlay', 'fade-in-out', { 'hidden': !asideOpened })} onClick={() => {
                    toggleAside(false);
                }} />
            </div>
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