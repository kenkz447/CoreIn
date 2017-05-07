const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { getFormValues } = require('redux-form');

const { modalToggle } = require('./file-manager/fm-actions');

var DynamicFormBasic = require('./form/form');

const FileManagerModal = require('./file-manager/modal');

class DynamicForm extends React.Component {
    constructor(props) {
        super(props);
        this.fileManagerModalToggle = this.fileManagerModalToggle.bind(this);
    }

    fileManagerModalToggle() {
        const { fileManagerModalToggle, fileManagerModalOpened } = this.props;

        return function (selectFunc, options = {}) {
            fileManagerModalToggle(!fileManagerModalOpened, selectFunc);
        }
    }

    render() {
        return (
            <div className="dynamic-form">
                <DynamicFormBasic {...this.props} fileManagerModalToggle={this.fileManagerModalToggle()}/>
                <FileManagerModal />
            </div>
        );
    }
}

const stateToProps = (state) => {
    return {
        fileManagerModalOpened: state.fm.modal.toggle,
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ fileManagerModalToggle: modalToggle }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(DynamicForm);