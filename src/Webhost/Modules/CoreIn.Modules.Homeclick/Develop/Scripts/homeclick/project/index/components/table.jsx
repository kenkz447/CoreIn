const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

const editUrl = '/project/update';
const deleteUrl = '/project/delete';
const dataUrl = '/project/GetTableData';

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
        this.getColumns = this.getColumns.bind(this);
    }

    getColumns() {
        return [
            {
                header: "Thumbnail",
                accessor: 'thumbnail',
                render: row => (<div><img className="table-thumbnail" src={row.value} /></div>),
                width: 160,
                sortable: false,
                hideFilter: true
            }, {
                header: "Title",
                accessor: 'title',
                render: row => (<div><a href={`${editUrl}/${row.rowValues.id}`} target="blank">{row.value}</a></div>),
            }
        ];
    }

    render() {
        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            <Table {...this.props} deleteProps={deleteProps} columns={this.getColumns()} dataUrl={dataUrl} />
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);
