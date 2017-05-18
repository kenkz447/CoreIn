const $ = require('jquery');

const mvcController = 'post';

module.exports = {
    createNewUrl: `/${mvcController}/create`,
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Thumbnail",
            accessor: 'thumbnail',
            render: row => (<div><img className="table-thumbnail" src={row.value} /></div>),
            width: 160,
            sortable: false,
            hideFilter: true
        }, {
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
            successAction: (response, props) => {
                const { alertPush } = props;
                alertPush("success", response.message);
                $("html, body").stop().animate({ scrollTop: 0 }, 500, 'swing');
            },
        }
    }
}