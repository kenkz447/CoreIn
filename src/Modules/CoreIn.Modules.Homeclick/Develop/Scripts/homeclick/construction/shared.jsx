const $ = require('jquery');

const mvcController = 'construction';

module.exports = {
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            header: "Thumbnail",
            accessor: 'thumbnailUrl',
            render: row => (<div className="image-fill table-thumbnail" style={{ backgroundImage: `url(${row.value})`}}></div>),
            width: 85,
            sortable: false,
            hideFilter: true
        }, {
            header: "Title",
            accessor: 'title',
            render: row => (<div><a href={`/${mvcController}/update/${row.rowValues.id}`}>{row.value}</a></div>),
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
        url: `/${mvcController}/update`,
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