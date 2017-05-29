const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {Modal, ModalHeader, ModalBody, ModalFooter} = require('reactstrap');

const { nestedModalToggle } = require('./fm-actions');

class ModalSingleFile extends React.Component {
    constructor(props) {
        super(props);
        this.toggleNested = this.toggleNested.bind(this);
    }

    toggleNested() {
        const {nestedModalToggle, nestedModal: { toggle }} = this.props;
        nestedModalToggle(!toggle);
    }

    render() {
        const { nestedModal: { toggle, title, content } } = this.props;
        return (
            <Modal isOpen={toggle} toggle={this.toggleNested}>
                <ModalHeader>{title}</ModalHeader>
                <ModalBody>{content}</ModalBody>
            </Modal>
        );
    }
}

const stateToProps = (state) => {
    return {
        nestedModal: state.fm.modal.nestedModal
    }
};

const dispatchToProps = (dispatch) => (
    bindActionCreators({ nestedModalToggle}, dispatch)
);

module.exports = connect(stateToProps, dispatchToProps)(ModalSingleFile);