const $ = require('jquery');

const getFilesFromServer = (handler, selectFrom, take) => {
    $.ajax({
        url: "/FileManager/GetFiles",
        data: { selectFrom: selectFrom, take: take },
        method: "GET",
        success: response => {
            handler(response);
        }
    });
}

const getFormInfoFromServer = (handler, fileName) => {
    $.ajax({
        url: '/FileManager/GetFormFor',
        data: { fileName: fileName },
        method: "GET",
        success: handler
    });
}

const deleteFilesFromServer = (handler, fileNames) => {
    $.ajax({
        url: '/FileManager/DeleteFiles',
        data: { fileNames },
        method: 'DELETE',
        success: (deleteResults) => {
            handler(deleteResults);
        }
    });
}

const updateFile = (handler, file) => {
    $.ajax({
        url: '/FileManager/Update',
        data: { viewModel: file },
        method: 'PUT',
        success: response => {
            handler(response);
        }
    });
}

module.exports = { getFilesFromServer, getFormInfoFromServer, deleteFilesFromServer, updateFile};