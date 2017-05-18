const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const Table = Corein.components.table.default;

class ReduxTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataUrl, deleteUrl, columns } = this.props;

        const deleteProps = {
            url: deleteUrl,
            success: (response) => {
                console.log(response);
            }
        };

        return (
            <Table {...this.props} deleteProps={deleteProps} columns={columns} dataUrl={dataUrl} />
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
