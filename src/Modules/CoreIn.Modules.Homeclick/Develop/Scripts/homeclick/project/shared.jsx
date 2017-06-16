const $ = require('jquery');

const mvcController = 'project';

module.exports = {
    index: {
        url: `/${mvcController}`,
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
    },

    formCommands: {
        SET_LAYOUT: (formValues, fieldData, props) => {
            const { openLayoutModal } = props;
            var roomName = fieldData.input.name.split('.')[1];

            const roomArrayIndex = /\[([^]+)\]/.exec(roomName)[1];
            const room = formValues.details['rooms'][roomArrayIndex];
            const layoutImage = room.layoutimage;
            if (layoutImage)
                openLayoutModal(layoutImage, fieldData.input.value, fieldData.input.onChange, fieldData.fileManagerModalToggle);
        }
    }
}