const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');

const Table = Corein.table.default;
const tableActions = Corein.table.actions;
const {Button} = require('reactstrap');

function renderColumn(columns) {
    const result = [];

    for (var column in columns) {

    }
}

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
        this.getColumns = this.getColumns.bind(this);
    }

    getColumns() {
        const { selectRow, selectedRows } = this.props;

        return [
            {
                header: "",
                accessor: 'id',
                render: row => (
                    <div>
                        <input type="checkbox"
                            onClick={() => {
                                selectRow(row.index);
                            }} />
                    </div>
                ),
                width: 22,
                sortable: false,
                hideFilter: true
            },
            {
                header: "Thumbnail",
                accessor: 'thumbnail',
                render: row => (<div><img className="table-thumbnail" src={row.value} /></div>),
                width: 160,
                sortable: false,
                hideFilter: true
            }, {
                header: "Title",
                accessor: 'title'
            }
        ];
    }

    render() {
        const {columns, data, init, deleteSelectedRows} = this.props;

        if (!columns) {
            init({ columns: this.getColumns(), dataUrl: '/project/GetTableData' });
            return null;
        }

        return (
            <div>
                <div className="mb-1 text-right">
                    <Button className="btn-circle" outline color="danger"
                        onClick={() => {
                            deleteSelectedRows();
                        }}><i className="fa fa-remove" /></Button>
                </div>
                <Table {...this.props} />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return state.index.table
};

const reducerToProps = (reducer) => (
    bindActionCreators(tableActions, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);
