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

const sidePanelToggle = (isOpen) => ({
    type: fmKeys.sidePanelToggle,
    isToggle: isOpen
});


const asideTabAdd = (tabId, tabTitle, tabContent) => ({
    type: fmKeys.asideTabAdd,
    tabId, tabTitle, tabContent
});

const asideTabRemove = (tabId) => ({
    type: fmKeys.asideTabRemove,
    tabId
});

const asideTabChange = (tab) => ({
    type: fmKeys.asideTabChange,
    tab
});

module.exports = { fileUploaded, loadFiles, fileChecked, fileDelete, fileClick, fileUpdate, sidePanelToggle, asideTabAdd, asideTabRemove, asideTabChange };