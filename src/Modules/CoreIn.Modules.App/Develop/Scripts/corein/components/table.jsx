const $ = require('jquery');
const _ = require('underscore');
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
    deleteRows: "DELETE_ROWS",
    setTaxonomyTypes: "SET_TAXONOMYTYPE"
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
    }),

    setTaxonomyTypes: (taxonomyTypes) => ({
        type: keys.setTaxonomyTypes,
        taxonomyTypes
    })
}

// Reducer
const initialState = {
    data: [],
    pages: 0,
    loading: false,
    defaultPageSize: 25,
    showFilters: true,
    selectedRows: [],
    taxonomyTypes: []
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
        case keys.setTaxonomyTypes:
            newState.taxonomyTypes = action.taxonomyTypes;
            break;
        default:
            return state;
    }
    return newState;
};

function defaultFilterMethod(filter, row, column) {
    var id = filter.pivotId || filter.id;
    return void 0 === row[id] || String(row[id]).startsWith(filter.value)
}

const requestData = (url, pageSize, page, sorted, filtering, taxonomies, callback) => {
    $.ajax({
        url,
        method: "POST",
        data: { pageSize, page, sorted, filtering, taxonomies },
        success: callback
    });
}

// Component
class Table extends React.Component {
    constructor(props) {
        super(props);

        let url = new URL(window.location.href);
        let searchParams = new URLSearchParams(url.search);
        let entityTypeId = +searchParams.get('entityTypeId');

        this.state = {
            entityTypeId,
            taxonomyTypesProviderUrl: '/TaxonomyUI/GetTaxonomyTypesForEntityType',
        };

        this.taxonomyFiltering = {};
        this.ReactTableState = null;
        this.ReactTableInstance = null;

        this.deleteRows = this.deleteRows.bind(this);
        this.getFirstColumn = this.getFirstColumn.bind(this);
        this.getTaxonomyColumn = this.getTaxonomyColumn.bind(this);
    }

    fetchData(state = this.ReactTableState, instance = this.ReactTableInstance) {
        const { dataUrl, dataLoad } = this.props;

        var taxonomyFiltering = {};
        state.filtered.filter(filter => {
            return filter.id.startsWith('taxonomyTypes');
        }).map(filter => {
            var typeId = filter.id.split('.')[1];
            taxonomyFiltering[typeId] = +filter.value;
        });

        var filtered = state.filtered.filter(filter => {
            return !filter.id.startsWith('taxonomyTypes');
        });

        requestData(dataUrl, state.pageSize, state.page, state.sorted, filtered, taxonomyFiltering, dataLoad);
        this.ReactTableState = state;
        this.ReactTableInstance = instance;
    }

    getFirstColumn() {
        const { selectRow } = this.props;
        return (
            {
                Header: "",
                accessor: 'id',
                Cell: props => {
                    const { selectedRows } = this.props;
                    const checked = selectedRows.indexOf(props.index) >= 0;
                    return (
                        <div className="checkbox">
                            <input type="checkbox"
                                onClick={() => {
                                    selectRow(props.index);
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
            Header: "Actions",
            accessor: 'id',
            Cell: props => {
                return (
                    <div className="table-row-actions">
                        <ButtonGroup>
                            <button className="btn btn-icon text-danger"
                                onClick={() => {
                                    const { deleteRows, deleteProps: { url, success } } = this.props;

                                    this.deleteRows(url, [props.value], (response) => {
                                        success(response);
                                        deleteRows([props.index]);
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
        const { data, selectedRows, deleteSelectedRows, deleteProps: { url, success } } = this.props;

        const ids = data.filter((row, index) => {
            return selectedRows.indexOf(index) >= 0;
        }).map((row) => row.id);;

        this.deleteRows(url, ids,
            (response) => {
                success(response);
                deleteSelectedRows();
            });
    }

    

    getTaxonomyColumn(taxonomyType) {
        return {
            Header: taxonomyType.title,
            accessor: `taxonomyTypes.${taxonomyType.id}`,
            Cell: props => {
                return (
                    <ul>
                        {
                            props.value && props.value.map(taxonomy => {
                                return <li>{taxonomy.title}</li>
                            })
                        }
                    </ul>
                )
            },
            width: 200,
            sortable: false,
            filterable: true,
            Filter: (props) => {
                const { filter, onChange } = props;
                return (
                    <select
                        onChange={event => onChange(event.target.value)}
                        style={{ width: '100%' }}
                        value={filter ? filter.value : 'all'}
                    >
                        <option value="">{taxonomyType.title}</option>
                        {
                            taxonomyType.taxonomies && taxonomyType.taxonomies.map(taxonomy => {
                                return <option key={taxonomy.id} value={taxonomy.id}>{taxonomy.title}</option>
                            })
                        }
                    </select>
                )
                    }
        }
    }
    render() {
        const { columns, data, pages, loading, defaultPageSize, showFilters, selectedRows, taxonomyTypes, setTaxonomyTypes } = this.props;

        if (!columns)
            return;

        if (this.state.entityTypeId && !taxonomyTypes.length) {
            $.get(this.state.taxonomyTypesProviderUrl, { entityTypeId: this.state.entityTypeId }, setTaxonomyTypes);
            return null;
        }

        if (!(columns[0].accessor === "id")) {
            columns.unshift(this.getFirstColumn());
            for (var taxonomyType in taxonomyTypes) {
                columns.push(this.getTaxonomyColumn(taxonomyTypes[taxonomyType]));
            }
            columns.push(this.getActionsColumn());
        }

        return (
            <div className="react-table">
                <div className="mb-1 clearfix">
                    <div className="pull-right clearfix">
                        <Button className="ml-q pull-right" outline disabled={!selectedRows.length} onClick={this.onDelete.bind(this)}>
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
                        columns={columns}
                        data={data}
                        defaultPageSize={defaultPageSize}
                        loading={loading}
                        manual
                        onFetchData={this.fetchData.bind(this)}
                        pages={pages}
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


//renderTaxonomyFilter() {
//    const { taxonomyTypes, setTaxonomyTypes } = this.props;

//    if (!taxonomyTypes.length) {
//        $.get(this.state.taxonomyTypesProviderUrl, { entityTypeId: this.state.entityTypeId }, setTaxonomyTypes);
//        return null;
//    }

//    return (
//        <div className="pull-right clearfix mr-1">
//            {
//                taxonomyTypes && taxonomyTypes.map((taxonomyType) => {

//                    return (
//                        <Input key={taxonomyType.id} type="select" className="mr-q" onChange={(e) => {
//                            var value = e.target.value;

//                            if (!value)
//                                delete this.taxonomyFiltering[taxonomyType.id];
//                            else
//                                this.taxonomyFiltering[taxonomyType.id] = +e.target.value;

//                            this.fetchData();
//                        }}>
//                            <option value="">{taxonomyType.title}</option>
//                            {
//                                taxonomyType.taxonomies && taxonomyType.taxonomies.map(taxonomy => {
//                                    return <option key={taxonomy.id} value={taxonomy.id}>{taxonomy.title}</option>
//                                })
//                            }
//                        </Input>
//                    );
//                })
//            }
//        </div>
//    );
//}