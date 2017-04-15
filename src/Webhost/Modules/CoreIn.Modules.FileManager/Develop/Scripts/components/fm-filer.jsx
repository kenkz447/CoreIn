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
            <div className="jFiler-container">
                <input type="file" id="jFiler" name="jFiler" multiple="multiple" className="collapse" />
                <div className="progress-container collapse mt-1">
                    <Progress />
                </div>
            </div>
        );
    }
};

const dispatchToProps = (dispatch) => (
    bindActionCreators({ uploaded : fileUploaded }, dispatch)
);

module.exports = connect(state => state, dispatchToProps)(JFiler);
