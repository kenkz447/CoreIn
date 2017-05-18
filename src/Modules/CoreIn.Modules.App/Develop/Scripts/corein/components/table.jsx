const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const ReactTable = require('react-table').default;
const { Button, Input, Row, Col } = require('reactstrap');

// Keys
const keys = {
    init: "INIT",
    loaded: "LOADED",
    loading: "LOADING",
    selectRow: "SELECT_ROW",
    deleteSelectedRows: "DETETE_SELECTED_ROWS"
};

// Actions
const actions = {
    init: (initValue) => ({
        type: keys.init,
        initValue
    }),
    onLoading: (isLoading) => ({
        type: keys.loading,
        isLoading
    }),
    onLoaded: (data) => ({
        type: keys.loaded,
        data
    }),
    selectRow: (index) => ({
        type: keys.selectRow,
        index
    }),
    deleteSelectedRows: () => ({
        type: keys.deleteSelectedRows
    })
}

// Reducer
const initialState = {
    data: [],
    pages: 0,
    loading: false,
    defaultPageSize: 25,
    showFilters: true,
    selectedRows: []
}

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.init:
            newState.columns = action.initValue.columns;
            break;
        case keys.loading:
            newState.loading = true;
            break;
        case keys.loaded:
            newState.data = action.data;
            newState.pages = parseInt(newState.data.length / newState.defaultPageSize);
            if ((newState.data.length % newState.defaultPageSize) !== 0)
                newState.pages++;
            newState.loading = false;

            break;
        case keys.selectRow:
            var index = newState.selectedRows.indexOf(action.index);
            if (index >= 0)
                newState.selectedRows.splice(index, 1);
            else
                newState.selectedRows.push(action.index);
            break;
        case keys.deleteSelectedRows:
            newState.data = newState.data.filter((row, index) => newState.selectedRows.indexOf(index) < 0);
            newState.selectedRows = [];
            break;
        default:
            return state;
    }
    return newState;
};

function defaultFilterMethod (filter, row, column)
{
    var id = filter.pivotId || filter.id;
    return void 0 === row[id] || String(row[id]).startsWith(filter.value)
}

// Component
class Table extends React.Component {
    constructor(props) {
        super();
        this.getCheckColumn = this.getCheckColumn.bind(this);
    }

    fetchData(state, instance) {
        const { dataUrl, onLoaded } = this.props;

        $.get(dataUrl, onLoaded);
    }

    getCheckColumn() {
        const { selectRow } = this.props;
        return (
            {
                header: "",
                accessor: 'id',
                render: row => {
                    const { selectedRows } = this.props;
                    const checked = selectedRows.indexOf(row.index) >= 0;
                    return  (
                        <div>
                            <input type="checkbox"
                                onClick={() => {
                                    selectRow(row.index);
                                }} checked={checked} />
                        </div>
                    )
                },
                width: 22,
                sortable: false,
                hideFilter: true
            }
        );
    }

    onDelete() {
        const {data, selectedRows, deleteSelectedRows, deleteProps: { url, success }} = this.props;

        const ids = data.filter((row, index) => {
            return selectedRows.indexOf(index) >= 0;
        }).map((row) => row.id);;

        $.ajax({
            url,
            method: "DELETE",
            data: { ids },
            success: (response) => {
                success(response);
                deleteSelectedRows();
            }
        });
    }

    render() {
        const { columns, data, pages, loading, defaultPageSize, showFilters, selectedRows } = this.props;

        if (!columns)
            return;
        if (!(columns[0].accessor === "id"))
            columns.unshift(this.getCheckColumn());

        return (
            <div class="react-table">
                <div className="mb-1">
                    <div className="clearfix">
                        <Button className="ml-h pull-right" outline disabled={!selectedRows.length} onClick={this.onDelete.bind(this)}>
                            Ok
                        </Button>
                        <div className="pull-right">
                            <Input type="select">
                                <option>Delete selected</option>
                            </Input>
                        </div>
                    </div>
                </div>

                <ReactTable
                    className='-striped -highlight'
                    manual
                    defaultPageSize={defaultPageSize}
                    showFilters={showFilters}
                    data={data}
                    pages={pages}
                    loading={loading}
                    columns={columns}
                    onChange={this.fetchData.bind(this)}
                    defaultFilterMethod={defaultFilterMethod}
                />
            </div>
        );
    }
};

const stateToProps = (state) => {
    return {}
};

const reducerToProps = (reducer) => (
    bindActionCreators(actions, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(Table),
    reducer,
    actions
}
