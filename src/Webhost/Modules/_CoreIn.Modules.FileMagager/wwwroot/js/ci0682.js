(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            React.createElement("aside", {className: "aside-menu"}, this.props.children)
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
            React.createElement("div", {className: "jFiler-container"}, 
                React.createElement("input", {type: "file", id: "jFiler", name: "jFiler", multiple: this.props.multiple, className: "collapse"}), 
                React.createElement("div", {className: "progress-container collapse mt-1"}, 
                    React.createElement(Progress, null)
                )
            )
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
            return (React.createElement("div", null));
        }
        return (
            React.createElement("div", {className: "fileInfo-details-container p-1"}, 
                React.createElement("div", {className: "detailt-preview text-center"}, 
                    (fileInfo.meta.type == 'Image' ? React.createElement("img", {src: fileInfo.meta.src_thumb}) : React.createElement("span", {className: "fancy-thumb-icon"}, React.createElement("i", {className: "fa fa-file"}), React.createElement("b", null, this.props.data.meta.ext)))
                ), 
                React.createElement("form", {onSubmit: this.onSubmit.bind(this)}, 
                    React.createElement("input", {type: "hidden", name: "fileId", value: fileInfo.fileId}), 
                    React.createElement("input", {type: "hidden", name: "meta[src]", value: fileInfo.meta.src}), 
                    React.createElement("input", {type: "hidden", name: "meta[src_thumb]", value: fileInfo.meta.src_thumb}), 

                    React.createElement("input", {type: "hidden", value: fileInfo.fileId}), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "File name"), 
                        React.createElement("input", {className: "form-control", name: "fileName", type: "text", value: fileInfo.fileName, readOnly: "readonly"})
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "Type"), 
                        React.createElement("input", {className: "form-control", name: "fileType", type: "text", value: fileInfo.meta.type, readOnly: "readonly"})
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "Url"), 
                        React.createElement("input", {className: "form-control", name: "meta[src]", type: "text", value: fileInfo.meta.src, readOnly: "readonly"})
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "Title"), 
                        React.createElement("input", {className: "form-control", name: "meta[title]", type: "text", value: fileInfo.meta.title})
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement("label", null, "Description"), 
                        React.createElement("textarea", {className: "form-control", name: "meta[description]", rows: "3", type: "text", value: fileInfo.meta.description})
                    ), 
                    React.createElement(Button, {className: "mr-1", color: "primary", type: "submit"}, "Ok")
                )
            )
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
            React.createElement("div", {className: "col-sm-6 col-md-4 col-lg-3 col-xl-2 p-0"}, 
                React.createElement("div", {className: "card card-fileThumb mb-1 mr-1"}, 
                    React.createElement("label", {className: "fancy-checkbox-label", htmlFor: fieldId}, 
                        React.createElement("input", {type: "checkbox", className: "thumb-checkbox", id: fieldId, name: fieldName, "data-file-id": this.props.data.fileId, "data-file-name": this.props.data.fileName, onChange: this.onChecked, onClick: this.onClick}), 
                        React.createElement("span", {className: "fancy-checkbox fancy-checkbox-img"}), 
                        (this.props.data.meta.type == 'Image' ? React.createElement("img", {src: this.props.data.meta.src_thumb}) : React.createElement("span", {className: "fancy-thumb-icon"}, React.createElement("i", {className: "fa fa-file"}), " ", React.createElement("b", null, this.props.data.meta.ext)))
                    ), 
                    React.createElement("div", {className: "file-info p-1", onClick: this.onInfoClick.bind(this)}, 
                        React.createElement("i", {className: "fa fa-info", "aria-hidden": "true"}), 
                        React.createElement("span", {className: "file-name"}, this.props.data.fileName)
                    )
                )
            )
        )
    }
}

/*
 * File thumbnail list
 */
const FileThumbList = React.createClass({displayName: "FileThumbList",
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
            fileThumbs.push(React.createElement(FileThumb, {key: item.fileId, data: item})); 
        });
        return (
            React.createElement("div", {id: "FileThumbList", className: "container-fluid"}, 
                React.createElement("div", {className: "row"}, 
                     fileThumbs
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement(Button, {id: "LoadMoreBtn", color: "secondary", onClick: this.onLoadMoreBtnClick}, this.state.strings.loadMore)
                )
            )
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
            React.createElement("div", {id: "MainContainer", className: mainContainerClasses}, 
                React.createElement("div", {id: "UploadPane", className: "collapse"}, 
                    React.createElement("div", {className: "card card-block"}, 
                        React.createElement(JFiler, null)
                    )
                ), 
                React.createElement(FileThumbList, null), 
                React.createElement(FloatingButtonGroup, null, 
                    React.createElement(FloatingButtonPlace, {title: "Delete"}, 
                        React.createElement("div", {className: "floating-action", onClick: this.deleteBtnClicked}, 
                            React.createElement("i", {className: "fa fa-trash"})
                        )
                    ), 
                    React.createElement(FloatingButtonPlace, {title: "Upload"}, 
                        React.createElement("div", {className: "floating-action", "data-toggle": "collapse", "data-target": "#UploadPane", "aria-expanded": "false", "aria-controls": "UploadPane"}, 
                            React.createElement("i", {className: "icon-cloud-upload"})
                        )
                    )
                ), 
                React.createElement(SidePanel, null, 
                    React.createElement(FileInfo, {data: this.state.openFile})
                )
            )
        )
    }
}

},{"jquery":"or5cxk","react":"himR+j","react-dom":"m5IHX/","redux":"BvgFxT"}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxwcm9qZWN0c1xcZG90bmV0XFxDb3JlSW5cXENvcmVJblxcc3JjXFxXZWJob3N0XFxNb2R1bGVzXFxDb3JlSW4uTW9kdWxlcy5GaWxlTWFnYWdlclxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiRDpcXHByb2plY3RzXFxkb3RuZXRcXENvcmVJblxcQ29yZUluXFxzcmNcXFdlYmhvc3RcXE1vZHVsZXNcXENvcmVJbi5Nb2R1bGVzLkZpbGVNYWdhZ2VyXFxzY3JpcHRzXFxpbmRleC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxDQUFDLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM5QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzdCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFMUI7O0dBRUc7QUFDSCxNQUFNLGVBQWUsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7SUFDOUIsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEVBQUU7UUFDaEIsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hCLElBQUksT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssUUFBUSxFQUFFO2dCQUM3QixJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxPQUFPLEtBQUssQ0FBQzthQUN4RDtnQkFDRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7U0FDN0Q7WUFDRyxPQUFPLEtB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QUEsRUFBYSxDQUFDLFlBQWEsQ0FBQSxFQUFBOzRCQUMvSCxvQkFBQSxHQUFFLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLG1CQUFvQixDQUFJLENBQUE7d0JBQ25DLENBQUE7b0JBQ1ksQ0FBQTtnQkFDSixDQUFBLEVBQUE7Z0JBQ3RCLG9CQUFDLFNBQVMsRUFBQSxJQUFDLEVBQUE7b0JBQ1Asb0JBQUMsUUFBUSxFQUFBLENBQUEsQ0FBQyxJQUFBLEVBQUksQ0FBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVMsQ0FBRSxDQUFBO2dCQUM5QixDQUFBO1lBQ1YsQ0FBQTtTQUNUO0tBQ0oiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwi77u/dmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxudmFyIFJlYWN0RE9NID0gcmVxdWlyZSgncmVhY3QtZG9tJyk7XHJcbnZhciBSZWR1eCA9IHJlcXVpcmUoJ3JlZHV4Jyk7XHJcbnZhciAkID0gcmVxdWlyZSgnanF1ZXJ5Jyk7XHJcblxyXG4vKlxyXG4gKiBHbG9iYWwgZnVuY3Rpb25zXHJcbiAqL1xyXG5jb25zdCBvYmplY3RzQXJlRXF1YWwgPSAoYSwgYikgPT4ge1xyXG4gICAgZm9yICh2YXIgcHJvcCBpbiBhKSB7XHJcbiAgICAgICAgaWYgKGIuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhW3Byb3BdID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvYmplY3RzQXJlRXF1YWwoYVtwcm9wXSwgYltwcm9wXSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfSBlbHNlXHJcbiAgICAgICAgICAgICAgICBpZiAoU3RyaW5nKGFbcHJvcF0pICE9PSBTdHJpbmcoYltwcm9wXSkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbi8qXHJcbiAqIFJlYWN0c3RyYXAgY29tcG9uZW50XHJcbiAqL1xyXG5jb25zdCBiYXNlVXJsID0gJy9BZG1pbi9GaWxlTWFuYWdlcidcclxuY29uc3QgQnV0dG9uID0gUmVhY3RzdHJhcC5CdXR0b247XHJcblxyXG4vKlxyXG4gKiBEZWZhdWx0IHN0YXRlXHJcbiAqL1xyXG5jb25zdCBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICBmaWxlczogW10sXHJcbiAgICBjaGVja2VkczogW10sXHJcbiAgICBzaWRlUGFuZWw6IHtcclxuICAgICAgICBpc09wZW46IGZhbHNlLFxyXG4gICAgICAgIG9wZW5GaWxlOiBudWxsXHJcbiAgICB9XHJcbn07XHJcblxyXG4vKlxyXG4gKiBGdW5jdGlvbnNcclxuICovXHJcbi8vL2hhbmRsZXI6IGZ1bmN0aW9uIGhhbmRsZSByZXNwb25zZSBkYXRhLlxyXG5jb25zdCBnZXRGaWxlc0Zyb21TZXJ2ZXIgPSAoaGFuZGxlciwgc2VsZWN0RnJvbSwgdGFrZSkgPT4ge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IFwiL0FkbWluL0ZpbGVNYW5hZ2VyL0dldEZpbGVzXCIsXHJcbiAgICAgICAgZGF0YTogeyBzZWxlY3RGcm9tOiBzZWxlY3RGcm9tLCB0YWtlIDogdGFrZX0sXHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBzdWNjZXNzOiByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIocmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBnZXRGaWxlRnJvbVNlcnZlciA9IChoYW5kbGVyLCBmaWxlTmFtZSkgPT4ge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IGJhc2VVcmwgKyAnL0dldEZpbGUnLFxyXG4gICAgICAgIGRhdGE6IHsgZmlsZU5hbWU6IGZpbGVOYW1lIH0sXHJcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICBzdWNjZXNzOiByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIocmVzcG9uc2UpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59XHJcblxyXG5jb25zdCBkZWxldGVGaWxlRnJvbVNlcnZlciA9IChoYW5kbGVyLCBmaWxlTmFtZSkgPT4ge1xyXG4gICAgJC5hamF4KHtcclxuICAgICAgICB1cmw6IGJhc2VVcmwgKyAnL0RlbGV0ZUZpbGUnLFxyXG4gICAgICAgIGRhdGE6IHsgZmlsZU5hbWU6IGZpbGVOYW1lIH0sXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgc3VjY2VzczogcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuY29uc3QgJHVwZGF0ZUZpbGVJbmZvID0gKGhhbmRsZXIsIGZpbGVJbmZvKSA9PiB7XHJcbiAgICAkLmFqYXgoe1xyXG4gICAgICAgIHVybDogYmFzZVVybCArIFwiL1VwZGF0ZVwiLFxyXG4gICAgICAgIGRhdGE6IHsgZmlsZUluZm9WaWV3TW9kZWw6IGZpbGVJbmZvIH0sXHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgc3VjY2VzczogcmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBoYW5kbGVyKHJlc3BvbnNlKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufVxyXG5cclxuLypcclxuICogQWN0aW9uc1xyXG4gKi9cclxuY29uc3QgZ2V0RmlsZXMgPSAoZmlsZXMpID0+IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgdHlwZTogJ0dFVF9GSUxFUycsXHJcbiAgICAgICAgZmlsZXM6IGZpbGVzXHJcbiAgICB9O1xyXG59XHJcblxyXG5jb25zdCB1cGxvYWRlZCA9IChmaWxlSW5mbykgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnVVBMT0FERUQnLFxyXG4gICAgICAgIGZpbGVJbmZvOiBmaWxlSW5mb1xyXG4gICAgfTtcclxufVxyXG4gXHJcbmNvbnN0IGNoZWNrZWQgPSAoZmlsZU5hbWUsY2hlY2tlZCkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnQ0hFQ0tFRCcsXHJcbiAgICAgICAgZmlsZU5hbWU6IGZpbGVOYW1lLFxyXG4gICAgICAgIGNoZWNrZWQ6IGNoZWNrZWRcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZGV0ZXRlRmlsZSA9IChmaWxlTmFtZSkgPT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICB0eXBlOiAnREVMRVRFX0ZJTEUnLFxyXG4gICAgICAgIGZpbGVOYW1lOiBmaWxlTmFtZVxyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBmaWxlSW5mb0NsaWNrID0gKGZpbGVJbmZvKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdGSUxFSU5GT19DTElDSycsXHJcbiAgICAgICAgZmlsZUluZm86IGZpbGVJbmZvXHJcbiAgICB9XHJcbn1cclxuXHJcbmNvbnN0IHVwZGF0ZUZpbGVJbmZvID0gKGZpbGVJbmZvKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdGSUxFSU5GT19VUERBVEUnLFxyXG4gICAgICAgIGZpbGVJbmZvOiBmaWxlSW5mb1xyXG4gICAgfVxyXG59XHJcblxyXG5jb25zdCBzaWRlUGFuZWxUb2dnbGUgPSAoaXNPcGVuKSA9PiB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHR5cGU6ICdTSURFUEFORUxfVE9HR0xFJyxcclxuICAgICAgICBpc1RvZ2dsZTogaXNPcGVuXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqIFJlZHVjZXJcclxuICovXHJcbmNvbnN0IGZpbGVNYW5hZ2VyID0gKHN0YXRlLCBhY3Rpb24pID0+IHtcclxuICAgIGNvbnN0IG5ld1N0YXRlID0gJC5leHRlbmQoe30sIHN0YXRlKTtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdHRVRfRklMRVMnOlxyXG4gICAgICAgICAgICBuZXdTdGF0ZS5maWxlcyA9IHN0YXRlLmZpbGVzLmNvbmNhdChhY3Rpb24uZmlsZXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdVUExPQURFRCc6XHJcbiAgICAgICAgICAgIGxldCBuZXdGaWxlID0gYWN0aW9uLmZpbGVJbmZvO1xyXG4gICAgICAgICAgICBuZXdTdGF0ZS5maWxlcy51bnNoaWZ0KG5ld0ZpbGUpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdDSEVDS0VEJzpcclxuICAgICAgICAgICAgaWYgKGFjdGlvbi5jaGVja2VkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3RhdGUuY2hlY2tlZHMuaW5kZXhPZihhY3Rpb24uZmlsZU5hbWUpIDwgMClcclxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0ZS5jaGVja2Vkcy5wdXNoKGFjdGlvbi5maWxlTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBzdGF0ZS5jaGVja2Vkcy5pbmRleE9mKGFjdGlvbi5maWxlTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPj0gMClcclxuICAgICAgICAgICAgICAgICAgICBuZXdTdGF0ZS5jaGVja2Vkcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0RFTEVURV9GSUxFJzpcclxuICAgICAgICAgICAgbmV3U3RhdGUuZmlsZXMgPSBzaWZ0KHsgZmlsZU5hbWU6IHsgJG5vdDogYWN0aW9uLmZpbGVOYW1lIH0gfSwgc3RhdGUuZmlsZXMpO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdGSUxFSU5GT19DTElDSyc6XHJcbiAgICAgICAgICAgIG5ld1N0YXRlLnNpZGVQYW5lbC5pc09wZW4gPSB0cnVlO1xyXG4gICAgICAgICAgICBuZXdTdGF0ZS5zaWRlUGFuZWwub3BlbkZpbGUgPSBhY3Rpb24uZmlsZUluZm87XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ0ZJTEVJTkZPX1VQREFURSc6XHJcbiAgICAgICAgICAgIC8vdmFyIG9sZEZpbGUgPSBzaWZ0KHsgZmlsZU5hbWU6IGFjdGlvbi5maWxlSW5mby5maWxlTmFtZSB9LCBzdGF0ZS5maWxlcyk7XHJcbiAgICAgICAgICAgIHZhciBvbGRGaWxlSW5kZXggPSBzdGF0ZS5maWxlcy5maW5kSW5kZXgoKG9iaikgPT4gb2JqLmZpbGVJZCA9PSBhY3Rpb24uZmlsZUluZm8uZmlsZUlkKTtcclxuICAgICAgICAgICAgbmV3U3RhdGUuZmlsZXNbb2xkRmlsZUluZGV4XSA9IGFjdGlvbi5maWxlSW5mbztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnU0lERVBBTkVMX1RPR0dMRSc6XHJcbiAgICAgICAgICAgIG5ld1N0YXRlLnNpZGVQYW5lbC5pc09wZW4gPSBhY3Rpb24uaXNPcGVuO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbmV3U3RhdGU7XHJcbn1cclxuXHJcbi8qXHJcbiAqIERlZmF1bHQgc3RhdGUgYW5kIGNyZWF0ZSBzdG9yZVxyXG4gKi9cclxudmFyIHN0b3JlID0gUmVkdXguY3JlYXRlU3RvcmUoZmlsZU1hbmFnZXIsIGRlZmF1bHRTdGF0ZSk7XHJcblxyXG4vKlxyXG4gKiBTaWRlcGFuZWw7XHJcbiAqL1xyXG5jbGFzcyBTaWRlUGFuZWwgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxhc2lkZSBjbGFzc05hbWU9XCJhc2lkZS1tZW51XCI+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9hc2lkZT5cclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cclxuLypcclxuICogSkZpbGVyXHJcbiAqL1xyXG5jbGFzcyBKRmlsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgY29uc3QgJGpGaWxlciA9ICQoJyNqRmlsZXInKSxcclxuICAgICAgICAgICAgJHByb2dyZXNzQmFyID0gJCgnLmpGaWxlci1jb250YWluZXIgLnByb2dyZXNzLWJhcicpLFxyXG4gICAgICAgICAgICAkcHJvZ3Jlc3NDb250YWluZXIgPSAkKCcuakZpbGVyLWNvbnRhaW5lciAucHJvZ3Jlc3MtY29udGFpbmVyJylcclxuXHJcbiAgICAgICAgbGV0IG9wdHMgPSB7XHJcbiAgICAgICAgICAgICAgICBjaGFuZ2VJbnB1dDogJzxkaXYgY2xhc3M9XCJqRmlsZXItaW5wdXQtZHJhZ0Ryb3AgbS0wIHctMTAwXCI+PGRpdiBjbGFzcz1cImpGaWxlci1pbnB1dC1pbm5lclwiPjxkaXYgY2xhc3M9XCJqRmlsZXItaW5wdXQtaWNvblwiPjxpIGNsYXNzPVwiaWNvbi1qZmktY2xvdWQtdXAtb1wiPjwvaT48L2Rpdj48ZGl2IGNsYXNzPVwiakZpbGVyLWlucHV0LXRleHRcIj48aDM+RHJhZyZEcm9wIGZpbGVzIGhlcmU8L2gzPiA8c3Bhbj5vcjwvc3Bhbj48L2Rpdj48YSBjbGFzcz1cImpGaWxlci1pbnB1dC1jaG9vc2UtYnRuIGJsdWVcIj5Ccm93c2UgRmlsZXM8L2E+PC9kaXY+PC9kaXY+JyxcclxuICAgICAgICAgICAgICAgIHNob3dUaHVtYnM6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdGhlbWU6IFwiZHJhZ2Ryb3Bib3hcIixcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb2dyZXNzQmFyOiAnJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkcmFnRHJvcDoge1xyXG5cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRGaWxlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL0FkbWluL0ZpbGVNYW5hZ2VyL1VwbG9hZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge30sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuY3R5cGU6ICdtdWx0aXBhcnQvZm9ybS1kYXRhJyxcclxuICAgICAgICAgICAgICAgICAgICBzeW5jaHJvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9ncmVzc0NvbnRhaW5lci5yZW1vdmVDbGFzcygnY29sbGFwc2UnKTtcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXNwb25zZSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09ICdzdWNjZXNzJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHVwbG9hZGVkKHJlc3BvbnNlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvblByb2dyZXNzOiAocHJvZ3Jlc3MpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2dyZXNzQmFyLmNzcygnd2lkdGgnLCBwcm9ncmVzcyArICclJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRwcm9ncmVzc0NvbnRhaW5lci5hZGRDbGFzcygnY29sbGFwc2UnKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHByb2dyZXNzQmFyLmNzcygnd2lkdGgnLCAnMCUnKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgJGpGaWxlci5maWxlcihvcHRzKTtcclxuICAgIH07XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBQcm9ncmVzcyA9IFJlYWN0c3RyYXAuUHJvZ3Jlc3M7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJqRmlsZXItY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImZpbGVcIiBpZD1cImpGaWxlclwiIG5hbWU9XCJqRmlsZXJcIiBtdWx0aXBsZT17dGhpcy5wcm9wcy5tdWx0aXBsZX0gY2xhc3NOYW1lPVwiY29sbGFwc2VcIi8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInByb2dyZXNzLWNvbnRhaW5lciBjb2xsYXBzZSBtdC0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPFByb2dyZXNzIC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9O1xyXG59O1xyXG5cclxuY2xhc3MgRmlsZUluZm8gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHByb3BzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICBzdG9yZS5zdWJzY3JpYmUoKCkgPT4ge1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvblN1Ym1pdChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgdmFyICRmb3JtID0gJChldmVudC50YXJnZXQpO1xyXG4gICAgICAgIHZhciBuZXdPYmplY3QgPSAkZm9ybS5zZXJpYWxpemVPYmplY3QoKTtcclxuICAgICAgICBpZiAoIW9iamVjdHNBcmVFcXVhbChuZXdPYmplY3QsIHRoaXMucHJvcHMuZGF0YSkpIHtcclxuICAgICAgICAgICAgJHVwZGF0ZUZpbGVJbmZvKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh1cGRhdGVGaWxlSW5mbyhkYXRhKSk7XHJcbiAgICAgICAgICAgIH0sIG5ld09iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHN0b3JlLmRpc3BhdGNoKHNpZGVQYW5lbFRvZ2dsZShmYWxzZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgZmlsZUluZm8gPSB0aGlzLnByb3BzLmRhdGE7XHJcbiAgICAgICAgaWYgKCFmaWxlSW5mbykge1xyXG4gICAgICAgICAgICByZXR1cm4gKDxkaXYvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmlsZUluZm8tZGV0YWlscy1jb250YWluZXIgcC0xXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRldGFpbHQtcHJldmlldyB0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIHsoZmlsZUluZm8ubWV0YS50eXBlID09ICdJbWFnZScgPyA8aW1nIHNyYz17ZmlsZUluZm8ubWV0YS5zcmNfdGh1bWJ9IC8+IDogPHNwYW4gY2xhc3NOYW1lPVwiZmFuY3ktdGh1bWItaWNvblwiPjxpIGNsYXNzTmFtZT1cImZhIGZhLWZpbGVcIj48L2k+PGI+e3RoaXMucHJvcHMuZGF0YS5tZXRhLmV4dH08L2I+PC9zcGFuPil9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxmb3JtIG9uU3VibWl0PXt0aGlzLm9uU3VibWl0LmJpbmQodGhpcyl9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT1cImZpbGVJZFwiIHZhbHVlPXtmaWxlSW5mby5maWxlSWR9Lz5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIG5hbWU9XCJtZXRhW3NyY11cIiB2YWx1ZT17ZmlsZUluZm8ubWV0YS5zcmN9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPVwibWV0YVtzcmNfdGh1bWJdXCIgdmFsdWU9e2ZpbGVJbmZvLm1ldGEuc3JjX3RodW1ifSAvPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImhpZGRlblwiIHZhbHVlPXtmaWxlSW5mby5maWxlSWR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCA+RmlsZSBuYW1lPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJmaWxlTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2ZpbGVJbmZvLmZpbGVOYW1lfSByZWFkT25seT1cInJlYWRvbmx5XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsID5UeXBlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJmaWxlVHlwZVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2ZpbGVJbmZvLm1ldGEudHlwZX0gcmVhZE9ubHk9XCJyZWFkb25seVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD5Vcmw8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3NOYW1lPVwiZm9ybS1jb250cm9sXCIgbmFtZT1cIm1ldGFbc3JjXVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2ZpbGVJbmZvLm1ldGEuc3JjfSByZWFkT25seT1cInJlYWRvbmx5XCIgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPlRpdGxlPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJtZXRhW3RpdGxlXVwiIHR5cGU9XCJ0ZXh0XCIgdmFsdWU9e2ZpbGVJbmZvLm1ldGEudGl0bGV9Lz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPkRlc2NyaXB0aW9uPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGNsYXNzTmFtZT1cImZvcm0tY29udHJvbFwiIG5hbWU9XCJtZXRhW2Rlc2NyaXB0aW9uXVwiIHJvd3M9XCIzXCIgdHlwZT1cInRleHRcIiB2YWx1ZT17ZmlsZUluZm8ubWV0YS5kZXNjcmlwdGlvbn0vPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwibXItMVwiIGNvbG9yPVwicHJpbWFyeVwiIHR5cGU9XCJzdWJtaXRcIj5PazwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICApO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKlxyXG4gKiBGaWxlIHRodW1ibmFpbFxyXG4gKi9cclxuY2xhc3MgRmlsZVRodW1iIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcclxuXHJcbiAgICBvbkNoZWNrZWQoZXZlbnQpIHtcclxuICAgICAgICBsZXQgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KSxcclxuICAgICAgICAgICAgZmlsZU5hbWUgPSAkdGFyZ2V0LmRhdGEoJ2ZpbGUtbmFtZScpLFxyXG4gICAgICAgICAgICBpc0NoZWNrZWQgPSAkdGFyZ2V0LnByb3AoJ2NoZWNrZWQnKTtcclxuICAgIH1cclxuXHJcbiAgICBvbkNsaWNrKGV2ZW50KSB7XHJcbiAgICAgICAgbGV0ICR0YXJnZXQgPSAkKGV2ZW50LnRhcmdldCksXHJcbiAgICAgICAgICAgIGZpbGVOYW1lID0gJHRhcmdldC5kYXRhKCdmaWxlLW5hbWUnKSxcclxuICAgICAgICAgICAgaXNDaGVja2VkID0gJHRhcmdldC5wcm9wKCdjaGVja2VkJyk7XHJcbiAgICAgICAgc3RvcmUuZGlzcGF0Y2goY2hlY2tlZChmaWxlTmFtZSwgaXNDaGVja2VkKSk7XHJcblxyXG4gICAgICAgIGNvbnN0ICRjaGVja2JveGVzID0gJCgnLnRodW1iLWNoZWNrYm94JyksXHJcbiAgICAgICAgICAgIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTsgICBcclxuICAgICAgICBsZXQgZmlyc3RDaGVja2VkID0gJGNoZWNrYm94ZXMuZmlsdGVyKCdbZGF0YS1maWxlLW5hbWU9XCInICsgc3RhdGUuY2hlY2tlZHNbMF0gKyAnXCJdJylbMF07XHJcblxyXG4gICAgICAgIGlmIChldmVudC5zaGlmdEtleSAmJiBzdGF0ZS5jaGVja2Vkcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgIHZhciBzdGFydCA9ICRjaGVja2JveGVzLmluZGV4KGZpcnN0Q2hlY2tlZCksXHJcbiAgICAgICAgICAgICAgICBlbmQgPSAkY2hlY2tib3hlcy5pbmRleChldmVudC50YXJnZXQpO1xyXG5cclxuICAgICAgICAgICAgJGNoZWNrYm94ZXMubWFwKChpbmRleCwgY2hlY2tib3gpID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBpc0NoZWNrZWQgPSAoZW5kIDwgc3RhcnQgJiYgKGluZGV4ID49IGVuZCAmJiBpbmRleCA8PSBzdGFydCkpIHx8IChlbmQgPiBzdGFydCAmJiAoaW5kZXggPj0gc3RhcnQgJiYgaW5kZXggPD0gZW5kKSk7XHJcbiAgICAgICAgICAgICAgICBjaGVja2JveC5jaGVja2VkID0gaXNDaGVja2VkO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goY2hlY2tlZChjaGVja2JveC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpbGUtbmFtZVwiKSwgaXNDaGVja2VkKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChldmVudC5jdHJsS2V5KSB7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHN0YXRlLmNoZWNrZWRzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICR0YXJnZXQucHJvcCgnY2hlY2tlZCcsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goY2hlY2tlZCgkdGFyZ2V0LmRhdGEoXCJmaWxlLW5hbWVcIiksIHRydWUpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyICRjaGVja2VkQ2hlY2tib3hlcyA9ICRjaGVja2JveGVzLmZpbHRlcignOmNoZWNrZWQnKS5ub3QoJHRhcmdldCk7XHJcbiAgICAgICAgICAgICRjaGVja2VkQ2hlY2tib3hlcy5tYXAoKGluZGV4LCBjaGVja2JveCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goY2hlY2tlZChjaGVja2JveC5nZXRBdHRyaWJ1dGUoXCJkYXRhLWZpbGUtbmFtZVwiKSwgZmFsc2UpKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG9uSW5mb0NsaWNrKCkge1xyXG4gICAgICAgIGdldEZpbGVGcm9tU2VydmVyKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGZpbGVJbmZvQ2xpY2soZGF0YSkpXHJcbiAgICAgICAgfSwgdGhpcy5wcm9wcy5kYXRhLmZpbGVOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdmFyIGZpZWxkSWQgPSBcImZpbGVfXCIgKyB0aGlzLnByb3BzLmRhdGEuZmlsZUlkO1xyXG4gICAgICAgIHZhciBmaWVsZE5hbWUgPSBcIkZpbGVbXCIgKyB0aGlzLnByb3BzLmRhdGEuZmlsZUlkICsgXCJdXCI7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb2wtc20tNiBjb2wtbWQtNCBjb2wtbGctMyBjb2wteGwtMiBwLTBcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY2FyZCBjYXJkLWZpbGVUaHVtYiBtYi0xIG1yLTFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPVwiZmFuY3ktY2hlY2tib3gtbGFiZWxcIiBodG1sRm9yPXtmaWVsZElkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzTmFtZT1cInRodW1iLWNoZWNrYm94XCIgaWQ9e2ZpZWxkSWR9IG5hbWU9e2ZpZWxkTmFtZX0gZGF0YS1maWxlLWlkPXt0aGlzLnByb3BzLmRhdGEuZmlsZUlkfSBkYXRhLWZpbGUtbmFtZT17dGhpcy5wcm9wcy5kYXRhLmZpbGVOYW1lfSBvbkNoYW5nZT17dGhpcy5vbkNoZWNrZWR9IG9uQ2xpY2s9e3RoaXMub25DbGlja30vPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmYW5jeS1jaGVja2JveCBmYW5jeS1jaGVja2JveC1pbWdcIi8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHsodGhpcy5wcm9wcy5kYXRhLm1ldGEudHlwZSA9PSAnSW1hZ2UnID8gPGltZyBzcmM9e3RoaXMucHJvcHMuZGF0YS5tZXRhLnNyY190aHVtYn0gLz4gOiA8c3BhbiBjbGFzc05hbWU9XCJmYW5jeS10aHVtYi1pY29uXCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtZmlsZVwiPjwvaT4gPGI+e3RoaXMucHJvcHMuZGF0YS5tZXRhLmV4dH08L2I+PC9zcGFuPil9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZpbGUtaW5mbyBwLTFcIiBvbkNsaWNrPXt0aGlzLm9uSW5mb0NsaWNrLmJpbmQodGhpcyl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1pbmZvXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJmaWxlLW5hbWVcIj57dGhpcy5wcm9wcy5kYXRhLmZpbGVOYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn1cclxuXHJcbi8qXHJcbiAqIEZpbGUgdGh1bWJuYWlsIGxpc3RcclxuICovXHJcbmNvbnN0IEZpbGVUaHVtYkxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBnZXRJbml0aWFsU3RhdGUoKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBmaWxlczogW10sXHJcbiAgICAgICAgICAgIHN0cmluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGxvYWRNb3JlOiBcIkxvYWQgbW9yZVwiLFxyXG4gICAgICAgICAgICAgICAgb25Mb2FkTW9yZTogXCJMb2FkaW5nLi4uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uTG9hZE1vcmVCdG5DbGljayA9IHRoaXMub25Mb2FkTW9yZUJ0bkNsaWNrLmJpbmQodGhpcyk7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZE1vcmVCdG5DbGljayhldmVudCkge1xyXG4gICAgICAgIHZhciAkbG9hZE1vcmVCdG4gPSAkKGV2ZW50LnRhcmdldCk7XHJcbiAgICAgICAgJGxvYWRNb3JlQnRuLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSk7XHJcbiAgICAgICAgJGxvYWRNb3JlQnRuLnRleHQodGhpcy5zdGF0ZS5zdHJpbmdzLm9uTG9hZE1vcmUpO1xyXG4gICAgICAgIGdldEZpbGVzRnJvbVNlcnZlcihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goZ2V0RmlsZXMocmVzcG9uc2UpKTtcclxuICAgICAgICAgICAgJGxvYWRNb3JlQnRuLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpO1xyXG4gICAgICAgICAgICAkbG9hZE1vcmVCdG4udGV4dCh0aGlzLnN0YXRlLnN0cmluZ3MubG9hZE1vcmUpXHJcbiAgICAgICAgfS5iaW5kKHRoaXMpLCB0aGlzLnN0YXRlLmZpbGVzLmxlbmd0aCwgMTIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgc3RvcmUuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBmaWxlczogc3RhdGUuZmlsZXMsXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvL0dldCBmaWxlIGxpc3QgZm9yIGZpcnN0IGxvYWQuXHJcbiAgICAgICAgZ2V0RmlsZXNGcm9tU2VydmVyKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBzdG9yZS5kaXNwYXRjaChnZXRGaWxlcyhyZXNwb25zZSkpO1xyXG4gICAgICAgIH0sIDAsIDMwKTtcclxuICAgIH0sXHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBmaWxlVGh1bWJzID0gW107XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5maWxlcy5tYXAoaXRlbSA9PiB7XHJcbiAgICAgICAgICAgIGZpbGVUaHVtYnMucHVzaCg8RmlsZVRodW1iIGtleT17aXRlbS5maWxlSWR9IGRhdGE9e2l0ZW19Lz4pOyBcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiRmlsZVRodW1iTGlzdFwiIGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgeyBmaWxlVGh1bWJzfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxCdXR0b24gaWQ9XCJMb2FkTW9yZUJ0blwiIGNvbG9yPVwic2Vjb25kYXJ5XCIgb25DbGljaz17dGhpcy5vbkxvYWRNb3JlQnRuQ2xpY2t9Pnt0aGlzLnN0YXRlLnN0cmluZ3MubG9hZE1vcmV9PC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKVxyXG4gICAgfVxyXG59KVxyXG5cclxuLypcclxuICogSW5kZXhcclxuICovXHJcbmNsYXNzIEZpbGVNYW5hZ2VySW5kZXggZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcclxuICAgICAgICBzdXBlcihwcm9wcyk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgc2lkZVBhbmVsT3BlbjogZmFsc2UsXHJcbiAgICAgICAgICAgIG9wZW5GaWxlOiBudWxsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmRlbGV0ZUJ0bkNsaWNrZWQgPSB0aGlzLmRlbGV0ZUJ0bkNsaWNrZWQuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQoKSB7XHJcbiAgICAgICAgc3RvcmUuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICBzaWRlUGFuZWxPcGVuOiBzdGF0ZS5zaWRlUGFuZWwuaXNPcGVuLFxyXG4gICAgICAgICAgICAgICAgb3BlbkZpbGU6IHN0YXRlLnNpZGVQYW5lbC5vcGVuRmlsZSxcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGVCdG5DbGlja2VkKGV2ZW50KSB7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gc3RvcmUuZ2V0U3RhdGUoKTtcclxuICAgICAgICBzdGF0ZS5jaGVja2Vkcy5tYXAoKGZpbGVOYW1lKSA9PiB7XHJcbiAgICAgICAgICAgIGRlbGV0ZUZpbGVGcm9tU2VydmVyKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PSBcInN1Y2Nlc3NcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKGRldGV0ZUZpbGUoZmlsZU5hbWUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHVuY2hla2VkKGZpbGVOYW1lKSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgZmlsZU5hbWUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgbWFpbkNvbnRhaW5lckNsYXNzZXMgPSBcImNvbnRhaW5lci1mbHVpZCBhc2lkZS1tZW51LWZpeGVkIHNjcmVlbi1vdmVybGF5LXByZXNlbnRcIjtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLnN0YXRlLnNpZGVQYW5lbE9wZW4pIHtcclxuICAgICAgICAgICAgbWFpbkNvbnRhaW5lckNsYXNzZXMgKz0gXCIgIGFzaWRlLW1lbnUtaGlkZGVuIG92ZXJsYXktaGlkZGVuXCJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybihcclxuICAgICAgICAgICAgPGRpdiBpZD1cIk1haW5Db250YWluZXJcIiBjbGFzc05hbWU9e21haW5Db250YWluZXJDbGFzc2VzfT5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJVcGxvYWRQYW5lXCIgY2xhc3NOYW1lPVwiY29sbGFwc2VcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNhcmQgY2FyZC1ibG9ja1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8SkZpbGVyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxGaWxlVGh1bWJMaXN0Lz5cclxuICAgICAgICAgICAgICAgIDxGbG9hdGluZ0J1dHRvbkdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgIDxGbG9hdGluZ0J1dHRvblBsYWNlIHRpdGxlPVwiRGVsZXRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxvYXRpbmctYWN0aW9uXCIgb25DbGljaz17dGhpcy5kZWxldGVCdG5DbGlja2VkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLXRyYXNoXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gXHJcbiAgICAgICAgICAgICAgICAgICAgPC9GbG9hdGluZ0J1dHRvblBsYWNlPlxyXG4gICAgICAgICAgICAgICAgICAgIDxGbG9hdGluZ0J1dHRvblBsYWNlIHRpdGxlPVwiVXBsb2FkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZmxvYXRpbmctYWN0aW9uXCIgZGF0YS10b2dnbGU9XCJjb2xsYXBzZVwiIGRhdGEtdGFyZ2V0PVwiI1VwbG9hZFBhbmVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIiBhcmlhLWNvbnRyb2xzPVwiVXBsb2FkUGFuZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiaWNvbi1jbG91ZC11cGxvYWRcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvRmxvYXRpbmdCdXR0b25QbGFjZT5cclxuICAgICAgICAgICAgICAgIDwvRmxvYXRpbmdCdXR0b25Hcm91cD5cclxuICAgICAgICAgICAgICAgIDxTaWRlUGFuZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPEZpbGVJbmZvIGRhdGE9e3RoaXMuc3RhdGUub3BlbkZpbGV9Lz5cclxuICAgICAgICAgICAgICAgIDwvU2lkZVBhbmVsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApXHJcbiAgICB9XHJcbn0iXX0=
