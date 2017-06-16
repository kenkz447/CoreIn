const $ = require('jquery');

const mvcController = 'album';

module.exports = {
    index: {
        url: `/${mvcController}`,
        dataUrl: `/${mvcController}/GetTableData`,
        deleteUrl: `/${mvcController}/delete`,
        tableColumns: [{
            Header: "Title",
            accessor: 'title',
            Cell: props => (<div><a href={`/${mvcController}/update/${props.row.id}`}>{props.value}</a></div>),
            filterable: true,
        }]
    },
    create: {
        url: `/${mvcController}/create`,
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