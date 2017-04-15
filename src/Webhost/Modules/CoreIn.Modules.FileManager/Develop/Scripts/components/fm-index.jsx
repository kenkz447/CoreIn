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
            <div id="file-manager">
                <div id="UploadPane">
                    <div className="card card-block">
                        <JFiler/>
                    </div>
                    <div className="card">
                        <div className="card-block">
                            <Button color="danger" onClick={this.deleteBtnClicked.bind(this)} className="pull-left"><i className="icon-trash icons"></i> Delete</Button>
                        </div>
                    </div>
                    {files.length !== 0 ? <FileList /> : getFilesFromServer(loadFiles, 0, initLoadItems)}
                    <SidePanel/>
                </div>
            </div>
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