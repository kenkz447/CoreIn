const mvcController = 'optiongroup';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Title",
            accessor: 'title',
            render: row => (<div><a href={`/${mvcController}/update/${row.rowValues.id}`} target="blank">{row.value}</a></div>),
        }]
    },
    create: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/create`,
            method: 'POST',
            successAction: (respo) => {
                window.location.href = respo.result;
            }
        }
    },
    update: {
        formUrl: `/${mvcController}/GetForm`,
        formSubmitData: {
            url: `/${mvcController}/update`,
            method: 'PUT',
            successAction: (respo) => {
                alertPush("success", respo.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}