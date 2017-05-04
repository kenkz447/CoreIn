const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const ReactTable = require('react-table').default;

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
    dataUrl: '',
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
            newState.dataUrl = action.initValue.dataUrl;
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
    fetchData(state, instance) {
        const { dataUrl, onLoaded } = this.props;
        $.get(dataUrl, onLoaded);
    }

    render() {
        const {columns, data, pages, loading, defaultPageSize, showFilters } = this.props;

        if (!columns)
            return;

        return (
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
        );
    }
};

module.exports = {
    default: Table,
    reducer,
    actions
}
