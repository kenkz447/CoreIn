const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const ReactTable = require('react-table').default;
const { ButtonGroup, Button, Input, Row, Col } = require('reactstrap');

// Keys
const keys = {
    init: "INIT",
    loaded: "LOADED",
    loading: "LOADING",
    selectRow: "SELECT_ROW",
    deleteSelectedRows: "DETETE_SELECTED_ROWS",
    deleteRows: "DELETE_ROWS"
};

// Actions
const actions = {
    init: (initValue) => ({
        type: keys.init,
        initValue
    }),
    dataLoading: (isLoading) => ({
        type: keys.loading,
        isLoading
    }),
    dataLoad: (data) => ({
        type: keys.loaded,
        data
    }),
    selectRow: (index) => ({
        type: keys.selectRow,
        index
    }),
    deleteSelectedRows: () => ({
        type: keys.deleteSelectedRows
    }),

    deleteRows: (indexs) => ({
        type: keys.deleteRows,
        indexs
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
        case keys.deleteRows:
            const filter = (row, index) => (action.indexs.indexOf(index) < 0);
            newState.data = newState.data.filter(filter);
            newState.selectedRows = newState.selectedRows.filter(filter);
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

const requestData = (url, pageSize, page, sorted, filtering, callback) => {
    $.ajax({
        url,
        method: "POST",
        data: { pageSize, page, sorted, filtering },
        success: callback
    });
}

// Component
class Table extends React.Component {
    constructor(props) {
        super();
        this.getFirstColumn = this.getFirstColumn.bind(this);
        this.deleteRows = this.deleteRows.bind(this);
    }

    fetchData(state, instance) {
        const { dataUrl, dataLoad } = this.props;

        requestData(dataUrl, state.pageSize, state.page, state.sorted, state.filtering, dataLoad);
    }

    getFirstColumn() {
        const { selectRow } = this.props;
        return (
            {
                header: "",
                accessor: 'id',
                render: row => {
                    const { selectedRows } = this.props;
                    const checked = selectedRows.indexOf(row.index) >= 0;
                    return  (
                        <div className="checkbox">
                            <input type="checkbox"
                                onClick={() => {
                                    selectRow(row.index);
                                }} checked={checked} />
                            <span />
                        </div>
                    )
                },
                width: 32,
                sortable: false,
                hideFilter: true
            }
        );
    }

    getActionsColumn() {
        return {
            header: "Actions",
            accessor: 'id',
            render: row => {

                return (
                    <div className="table-row-actions">       
                        <ButtonGroup>
                            <button className="btn btn-icon text-danger"
                                onClick={() => {
                                    const { deleteRows, deleteProps: { url, success } } = this.props;

                                    this.deleteRows(url, [row.value], (response) => {
                                        success(response);
                                        deleteRows([row.index]);
                                    });
                                }}>
                                <i className="fa fa-trash-o" aria-hidden="true"></i>
                            </button>
                        </ButtonGroup>
                    </div>
                )
            },
            width: 120,
            sortable: false,
            hideFilter: true
        }
    }

    deleteRows(url, rowIds, callback) {
        var result = window.confirm("delete?");
        if (result) {
            $.ajax({
                url,
                method: "DELETE",
                data: { ids: rowIds },
                success: callback
            });
        }
    }

    onDelete() {
        const {data, selectedRows, deleteSelectedRows, deleteProps: { url, success }} = this.props;

        const ids = data.filter((row, index) => {
            return selectedRows.indexOf(index) >= 0;
        }).map((row) => row.id);;

        this.deleteRows(url, ids,
            (response) => {
                success(response);
                deleteSelectedRows();
            });
    }

    render() {
        const { columns, data, pages, loading, defaultPageSize, showFilters, selectedRows } = this.props;

        if (!columns)
            return;

        if (!(columns[0].accessor === "id")) {
            columns.unshift(this.getFirstColumn());
            columns.push(this.getActionsColumn());   
        }

        return (
            <div className="react-table">
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
                <div className="table-wrap">
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
                    />
                </div>
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
