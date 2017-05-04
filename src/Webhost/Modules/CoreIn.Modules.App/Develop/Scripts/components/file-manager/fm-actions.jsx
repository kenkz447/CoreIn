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