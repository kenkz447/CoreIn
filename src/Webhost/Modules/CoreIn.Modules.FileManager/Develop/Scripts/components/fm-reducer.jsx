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