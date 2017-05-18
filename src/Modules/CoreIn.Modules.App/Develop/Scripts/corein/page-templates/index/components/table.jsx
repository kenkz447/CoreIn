const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');

const Table = require('../../../components/table').default;

const ReduxTable = (props) => {
    const { dataUrl, deleteUrl, columns } = props;

    const deleteProps = {
        url: deleteUrl,
        success: (response) => {
            console.log(response);
        }
    };

    return (
        <Table {...props} deleteProps={deleteProps} columns={columns} dataUrl={dataUrl} />
    );
}

const stateToProps = (state) => {
    return state.table
}

const reducerToProps = (reducer) => (
    bindActionCreators({}, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(ReduxTable);
