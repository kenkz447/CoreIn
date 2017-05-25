const $ = require('jquery');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { modalToggle } = require('../file-manager/fm-actions');

const FormLayout2 = require('./form-layout-two');

const form = (props) => {
    return (
        <FormLayout2 {...props} />
    );
}

const stateToProps = (state) => {
    return {
        fileManagerModalOpened: state.fm.modal.toggle,
    }
}

const reducerToProps = (reducer) => (
    bindActionCreators({ fileManagerModalToggle: modalToggle }, reducer)
);

module.exports = connect(stateToProps, reducerToProps)(form);