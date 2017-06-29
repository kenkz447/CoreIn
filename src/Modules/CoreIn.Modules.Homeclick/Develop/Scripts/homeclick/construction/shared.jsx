const $ = require('jquery');

const mvcController = 'construction';

module.exports = {
    index: {
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            Header: "Thumbnail",
            accessor: 'thumbnailUrl',
            Cell: props => (<div className="image-fill table-thumbnail" style={{ backgroundImage: `url(${props.value})` }}></div>),
            width: 85,
            sortable: false,
            filterable: false
        }, {
            Header: "Title",
            accessor: 'title',
            Cell: props => (<div><a href={`/${mvcController}/update/${props.row.id}`}>{props.value}</a></div>),
            filterable: true,
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