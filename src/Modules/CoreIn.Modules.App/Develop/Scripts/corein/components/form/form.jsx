const $ = require('jquery');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const { modalToggle } = require('../file-manager/fm-actions');

const FormLayout1 = require('./form-layout-one');
const FormLayout2 = require('./form-layout-two');//default: 2

const form = (props) => {
    return (
        props.layout && props.layout === 1 ?
            <FormLayout1 {...props} /> :
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