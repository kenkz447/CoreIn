var React = require('react');
var ReactDOM = require('react-dom');
var Redux = require('redux');
var $ = require('jquery');

/*
 * Global functions
 */
const objectsAreEqual = (a, b) => {
    for (var prop in a) {
        if (b.hasOwnProperty(prop)) {
            if (typeof a[prop] === 'object') {
                if (!objectsAreEqual(a[prop], b[prop])) return false;
            } else
                if (String(a[prop]) !== String(b[prop])) return false;
        } else
            return false;
    }
    return true;
}

/*
 * Reactstrap component
 */
const baseUrl = '/Admin/FileManager'
const Button = Reactstrap.Button;

/*
 * Default state
 */
const defaultState = {
    files: [],
    checkeds: [],
    sidePanel: {
        isOpen: false,
        openFile: null
    }
};

/*
 * Functions
 */
///handler: function handle response data.
const getFilesFromServer = (handler, selectFrom, take) => {
    $.ajax({
        url: "/Admin/FileManager/GetFiles",
        data: { selectFrom: selectFrom, take : take},
        method: "POST",
        success: response => {
            handler(response);
        }
    });
}

const getFileFromServer = (handler, fileName) => {
    $.ajax({
        url: baseUrl + '/GetFile',
        data: { fileName: fileName },
        method: "POST",
        success: response => {
            handler(response);
        }
    });
}

const deleteFileFromServer = (handler, fileName) => {
    $.ajax({
        url: baseUrl + '/DeleteFile',
        data: { fileName: fileName },
        method: 'POST',
        success: response => {
            handler(response);
        }
    });
}

const $updateFileInfo = (handler, fileInfo) => {
    $.ajax({
        url: baseUrl + "/Update",
        data: { fileInfoViewModel: fileInfo },
        method: 'POST',
        success: response => {
            handler(response);
        }
    });
}

/*
 * Actions
 */
const getFiles = (files) => {
    return {
        type: 'GET_FILES',
        files: files
    };
}

const uploaded = (fileInfo) => {
    return {
        type: 'UPLOADED',
        fileInfo: fileInfo
    };
}
 
const checked = (fileName,checked) => {
    return {
        type: 'CHECKED',
        fileName: fileName,
        checked: checked
    }
}

const deteteFile = (fileName) => {
    return {
        type: 'DELETE_FILE',
        fileName: fileName
    }
}

const fileInfoClick = (fileInfo) => {
    return {
        type: 'FILEINFO_CLICK',
        fileInfo: fileInfo
    }
}

const updateFileInfo = (fileInfo) => {
    return {
        type: 'FILEINFO_UPDATE',
        fileInfo: fileInfo
    }
}

const sidePanelToggle = (isOpen) => {
    return {
        type: 'SIDEPANEL_TOGGLE',
        isToggle: isOpen
    }
}

/*
 * Reducer
 */
const fileManager = (state, action) => {
    const newState = $.extend({}, state);
    switch (action.type) {
        case 'GET_FILES':
            newState.files = state.files.concat(action.files);
            break;
        case 'UPLOADED':
            let newFile = action.fileInfo;
            newState.files.unshift(newFile);
            break;
        case 'CHECKED':
            if (action.checked) {
                if (state.checkeds.indexOf(action.fileName) < 0)
                    newState.checkeds.push(action.fileName);
            }
            else {
                var index = state.checkeds.indexOf(action.fileName);
                if (index >= 0)
                    newState.checkeds.splice(index, 1);
            }
            break;
        case 'DELETE_FILE':
            newState.files = sift({ fileName: { $not: action.fileName } }, state.files);
            break;
        case 'FILEINFO_CLICK':
            newState.sidePanel.isOpen = true;
            newState.sidePanel.openFile = action.fileInfo;
            break;
        case 'FILEINFO_UPDATE':
            //var oldFile = sift({ fileName: action.fileInfo.fileName }, state.files);
            var oldFileIndex = state.files.findIndex((obj) => obj.fileId == action.fileInfo.fileId);
            newState.files[oldFileIndex] = action.fileInfo;
            break;
        case 'SIDEPANEL_TOGGLE':
            newState.sidePanel.isOpen = action.isOpen;
            break;
        default:
            return state;
    }
    return newState;
}

/*
 * Default state and create store
 */
var store = Redux.createStore(fileManager, defaultState);

/*
 * Sidepanel;
 */
class SidePanel extends React.Component {
    render() {
        return (
            <aside className="aside-menu">{this.props.children}</aside>
            );
    }
}

/*
 * JFiler
 */
class JFiler extends React.Component {
    componentDidMount() {
        const $jFiler = $('#jFiler'),
            $progressBar = $('.jFiler-container .progress-bar'),
            $progressContainer = $('.jFiler-container .progress-container')

        let opts = {
                changeInput: '<div class="jFiler-input-dragDrop m-0 w-100"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag&Drop files here</h3> <span>or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div></div>',
                showThumbs: false,
                theme: "dragdropbox",
                templates: {
                    progressBar: '',
                },
                dragDrop: {

                },
                uploadFile: {
                    url: '/Admin/FileManager/Upload',
                    data: {},
                    type: 'POST',
                    enctype: 'multipart/form-data',
                    synchron: true,
                    beforeSend: () => {
                        $progressContainer.removeClass('collapse');
                    },
                    success: (response) => {
                        if (response.status == 'success')
                            store.dispatch(uploaded(response));
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
    };

    render() {
        var Progress = Reactstrap.Progress;
        return (
            <div className="jFiler-container">
                <input type="file" id="jFiler" name="jFiler" multiple={this.props.multiple} className="collapse"/>
                <div className="progress-container collapse mt-1">
                    <Progress />
                </div>
            </div>
            );
    };
};

class FileInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
    }

    componentWillMount() {
        store.subscribe(() => {

        });
    }

    onSubmit(event) {
        event.preventDefault();
        var $form = $(event.target);
        var newObject = $form.serializeObject();
        if (!objectsAreEqual(newObject, this.props.data)) {
            $updateFileInfo((data) => {
                store.dispatch(updateFileInfo(data));
            }, newObject);
        }
        store.dispatch(sidePanelToggle(false));
    }

    render() {
        var fileInfo = this.props.data;
        if (!fileInfo) {
            return (<div/>);
        }
        return (
            <div className="fileInfo-details-container p-1">
                <div className="detailt-preview text-center">
                    {(fileInfo.meta.type == 'Image' ? <img src={fileInfo.meta.src_thumb} /> : <span className="fancy-thumb-icon"><i className="fa fa-file"></i><b>{this.props.data.meta.ext}</b></span>)}
                </div>
                <form onSubmit={this.onSubmit.bind(this)}>
                    <input type="hidden" name="fileId" value={fileInfo.fileId}/>
                    <input type="hidden" name="meta[src]" value={fileInfo.meta.src} />
                    <input type="hidden" name="meta[src_thumb]" value={fileInfo.meta.src_thumb} />

                    <input type="hidden" value={fileInfo.fileId} />
                    <div className="form-group">
                        <label >File name</label>
                        <input className="form-control" name="fileName" type="text" value={fileInfo.fileName} readOnly="readonly" />
                    </div>
                    <div className="form-group">
                        <label >Type</label>
                        <input className="form-control" name="fileType" type="text" value={fileInfo.meta.type} readOnly="readonly" />
                    </div>
                    <div className="form-group">
                        <label>Url</label>
                        <input className="form-control" name="meta[src]" type="text" value={fileInfo.meta.src} readOnly="readonly" />
                    </div>
                    <div className="form-group">
                        <label>Title</label>
                        <input className="form-control" name="meta[title]" type="text" value={fileInfo.meta.title}/>
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea className="form-control" name="meta[description]" rows="3" type="text" value={fileInfo.meta.description}/>
                    </div>
                    <Button className="mr-1" color="primary" type="submit">Ok</Button>
                </form>
            </div>
     );
    }
}

/*
 * File thumbnail
 */
class FileThumb extends React.Component {

    onChecked(event) {
        let $target = $(event.target),
            fileName = $target.data('file-name'),
            isChecked = $target.prop('checked');
    }

    onClick(event) {
        let $target = $(event.target),
            fileName = $target.data('file-name'),
            isChecked = $target.prop('checked');
        store.dispatch(checked(fileName, isChecked));

        const $checkboxes = $('.thumb-checkbox'),
            state = store.getState();   
        let firstChecked = $checkboxes.filter('[data-file-name="' + state.checkeds[0] + '"]')[0];

        if (event.shiftKey && state.checkeds.length > 1) {
            var start = $checkboxes.index(firstChecked),
                end = $checkboxes.index(event.target);

            $checkboxes.map((index, checkbox) => {
                var isChecked = (end < start && (index >= end && index <= start)) || (end > start && (index >= start && index <= end));
                checkbox.checked = isChecked;
                store.dispatch(checked(checkbox.getAttribute("data-file-name"), isChecked));
            });
        }
        else if (event.ctrlKey) {

        }
        else {
            if (state.checkeds.length > 1) {
                $target.prop('checked', true);
                store.dispatch(checked($target.data("file-name"), true));
            }

            var $checkedCheckboxes = $checkboxes.filter(':checked').not($target);
            $checkedCheckboxes.map((index, checkbox) => {
                checkbox.checked = false;
                store.dispatch(checked(checkbox.getAttribute("data-file-name"), false));
            });
        }
    }

    onInfoClick() {
        getFileFromServer((data) => {
            store.dispatch(fileInfoClick(data))
        }, this.props.data.fileName);
    }

    render() {
        var fieldId = "file_" + this.props.data.fileId;
        var fieldName = "File[" + this.props.data.fileId + "]";
        return (
            <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2 p-0">
                <div className="card card-fileThumb mb-1 mr-1">
                    <label className="fancy-checkbox-label" htmlFor={fieldId}>
                        <input type="checkbox" className="thumb-checkbox" id={fieldId} name={fieldName} data-file-id={this.props.data.fileId} data-file-name={this.props.data.fileName} onChange={this.onChecked} onClick={this.onClick}/>
                        <span className="fancy-checkbox fancy-checkbox-img"/>
                        {(this.props.data.meta.type == 'Image' ? <img src={this.props.data.meta.src_thumb} /> : <span className="fancy-thumb-icon"><i className="fa fa-file"></i> <b>{this.props.data.meta.ext}</b></span>)}
                    </label>
                    <div className="file-info p-1" onClick={this.onInfoClick.bind(this)}>
                        <i className="fa fa-info" aria-hidden="true"></i>
                        <span className="file-name">{this.props.data.fileName}</span>
                    </div>
                </div>
            </div>
        )
    }
}

/*
 * File thumbnail list
 */
const FileThumbList = React.createClass({
    getInitialState(){
        return {
            files: [],
            strings: {
                loadMore: "Load more",
                onLoadMore: "Loading..."
            }
        }
        this.onLoadMoreBtnClick = this.onLoadMoreBtnClick.bind(this);
    },

    onLoadMoreBtnClick(event) {
        var $loadMoreBtn = $(event.target);
        $loadMoreBtn.prop('disabled', true);
        $loadMoreBtn.text(this.state.strings.onLoadMore);
        getFilesFromServer(function (response) {
            store.dispatch(getFiles(response));
            $loadMoreBtn.prop('disabled', false);
            $loadMoreBtn.text(this.state.strings.loadMore)
        }.bind(this), this.state.files.length, 12);
    },

    componentWillMount() {
        store.subscribe(() => {
            var state = store.getState();
            this.setState({
                files: state.files,
            });
        });

        //Get file list for first load.
        getFilesFromServer(function (response) {
            store.dispatch(getFiles(response));
        }, 0, 30);
    },

    render() {
        var fileThumbs = [];
        this.state.files.map(item => {
            fileThumbs.push(<FileThumb key={item.fileId} data={item}/>); 
        });
        return (
            <div id="FileThumbList" className="container-fluid">
                <div className="row"> 
                    { fileThumbs}
                </div>
                <div className="row">
                    <Button id="LoadMoreBtn" color="secondary" onClick={this.onLoadMoreBtnClick}>{this.state.strings.loadMore}</Button>
                </div>
            </div>
        )
    }
})

/*
 * Index
 */
class FileManagerIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidePanelOpen: false,
            openFile: null
        };
        this.deleteBtnClicked = this.deleteBtnClicked.bind(this);
    }

    componentWillMount() {
        store.subscribe(() => {
            var state = store.getState();
            this.setState({
                sidePanelOpen: state.sidePanel.isOpen,
                openFile: state.sidePanel.openFile,
            });
        })
    }

    deleteBtnClicked(event) {
        var state = store.getState();
        state.checkeds.map((fileName) => {
            deleteFileFromServer(function (response) {
                if (response.status == "success") {
                    store.dispatch(deteteFile(fileName))
                    store.dispatch(uncheked(fileName))
                }
                else {

                }
            }, fileName);
        });
    }

    render() {
        var mainContainerClasses = "container-fluid aside-menu-fixed screen-overlay-present";

        if (!this.state.sidePanelOpen) {
            mainContainerClasses += "  aside-menu-hidden overlay-hidden"
        }

        return(
            <div id="MainContainer" className={mainContainerClasses}>
                <div id="UploadPane" className="collapse">
                    <div className="card card-block">
                        <JFiler />
                    </div>
                </div>
                <FileThumbList/>
                <FloatingButtonGroup>
                    <FloatingButtonPlace title="Delete">
                        <div className="floating-action" onClick={this.deleteBtnClicked}>
                            <i className="fa fa-trash"></i>
                        </div> 
                    </FloatingButtonPlace>
                    <FloatingButtonPlace title="Upload">
                        <div className="floating-action" data-toggle="collapse" data-target="#UploadPane" aria-expanded="false" aria-controls="UploadPane">
                            <i className="icon-cloud-upload"></i>
                        </div>
                    </FloatingButtonPlace>
                </FloatingButtonGroup>
                <SidePanel>
                    <FileInfo data={this.state.openFile}/>
                </SidePanel>
            </div>
        )
    }
}