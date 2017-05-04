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