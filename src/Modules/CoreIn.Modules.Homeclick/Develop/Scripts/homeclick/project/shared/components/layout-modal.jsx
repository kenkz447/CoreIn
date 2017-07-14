const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const {Modal, ModalHeader, ModalBody, ModalFooter, Button} = require('reactstrap');

const Slider = require('rc-slider');

const keys = {
    toggle: 'TOGGLE',
    openLayoutModal: 'OPEN_LAYOUT_MODAL',
    addValue: 'ADD_VALUE',
    removeSelectedValue: 'REMOVE_VALUE',
    selectValueIndex: 'SELECT_VALUE_INDEX',
    updateValue: 'UPDATE_VALUE'
}

const actions = {
    toggle: () => ({
        type: keys.toggle
    }),

    openLayoutModal: (layoutImage, fieldValue, field_onChange, fileManagerModalToggle) => ({
        type: keys.openLayoutModal,
        layoutImage,
        fieldValue,
        field_onChange,
        fileManagerModalToggle
    }),

    addValue: (value) => ({
        type: keys.addValue,
        value
    }),

    removeSelectedValue: () => ({
        type: keys.removeSelectedValue
    }),

    selectValueIndex: (index) => ({
        type: keys.selectValueIndex,
        index
    }),

    updateValue: (value) => ({
        type: keys.updateValue,
        value
    })
}

const initialState = {
    values: [],
    isOpen: false,
    layoutImage: null,
    field_onChange: null,
    fileManagerModalToggle: null,
    selectedIndex: -1
}

const reducer = (state = initialState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.toggle:
            newState.isOpen = !newState.isOpen;
            selectedIndex = -1;
            break;
        case keys.openLayoutModal:
            newState.layoutImage = action.layoutImage;
            newState.field_onChange = action.field_onChange;
            newState.fileManagerModalToggle = action.fileManagerModalToggle;

            newState.values = action.fieldValue ? JSON.parse(action.fieldValue) : [];

            newState.isOpen = true;
            break;
        case keys.addValue:
            newState.values.push(action.value);
            newState.selectedIndex = newState.values.length - 1;
            break;
        case keys.removeSelectedValue:
            newState.values.splice(newState.selectedIndex, 1);
            newState.selectedIndex = -1;
            break;
        case keys.selectValueIndex:
            newState.selectedIndex = action.index;
            break;
        case keys.updateValue:
            newState.values[newState.selectedIndex] = action.value;
            break;
        default:
            return state;
    }

    return newState;
}

class LayoutModal extends React.Component {
    constructor(props) {
        super(props);
        this.imageClick = this.imageClick.bind(this);
        this.okButtonClick = this.okButtonClick.bind(this);
        this.selectImgBtnClick = this.selectImgBtnClick.bind(this);
        this.deleteBtnClick = this.deleteBtnClick.bind(this);
        this.onSliderChange = this.onSliderChange.bind(this);
    }

    imageClick(e) {
        const { addValue } = this.props;

        const $target = $(e.target);

        const currentImgSize = {
            w: $target.width(),
            h: $target.height()
        }

        const imgFileSize = {
            w: $target.prop('naturalWidth'),
            h: $target.prop('naturalHeight')
        }

        var offset_t = $target.offset().top - $(window).scrollTop();
        var offset_l = $target.offset().left - $(window).scrollLeft();

        var left = Math.round((e.clientX - offset_l));
        var top = Math.round((e.clientY - offset_t));

        var percX = (left / $target.width() * 100).toFixed(3);
        var percY = (top / $target.height() * 100).toFixed(3);

        addValue({ image: '', rotate: 0, x: percX, y: percY });
    }

    deleteBtnClick() {
        const { removeSelectedValue } = this.props;
        removeSelectedValue();
    }

    selectImgBtnClick() {

        const { values, selectedIndex, fileManagerModalToggle, toggle, updateValue } = this.props;

        fileManagerModalToggle((files) => {
            var file = files[0]

            if (!file)
                return;

            const selectedValue = values[selectedIndex];
            selectedValue.image = file.url;
            updateValue(selectedValue);
        });
    }

    okButtonClick() {
        const {changeFieldValue, toggle, values} = this.props;

        toggle();
        changeFieldValue(JSON.stringify(values));
    }

    onSliderChange(e) {
        const { values, selectedIndex, updateValue } = this.props;

        const selectedValue = values[selectedIndex];
        selectedValue.rotate = e;
        updateValue(selectedValue);
    }

    render() {
        const {selectedIndex, values, layoutImage, toggle, isOpen, selectValueIndex, updateValue} = this.props;

        var selectedValue = values[selectedIndex];
        var image = layoutImage && (String(layoutImage.url).startsWith('/') ? layoutImage.url : `/${layoutImage.url}`)
        return (
            <Modal className="modal-lg" isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>Modal title</ModalHeader>
                <ModalBody>
                    <div className="layout-modal">
                        <div className="arrow-container">
                            <img src={image} className="w-100" onClick={this.imageClick} />
                            {
                                values.map((data, index) => {
                                    const divStyle = {
                                        transform: `rotate(${data.rotate}deg)`,
                                        left: `calc(${data.x}% - 10px)`,
                                        top: `calc(${data.y}% - 10px)`,
                                    };

                                    return (
                                        <div key={index} style={divStyle} className="arrow" onClick={() => { selectValueIndex(index); }}>
                                            
                                        </div>
                                    );
                                })
                            }
                        </div>
                        {
                            selectedValue &&
                            <div className="controls" style={{ left: 'calc(' + selectedValue.x + "% + 20px)", top: 'calc(' + selectedValue.y + "% - 0px)" }}>
                                <Button onClick={this.selectImgBtnClick}>
                                    <i className="fa fa-picture-o" aria-hidden="true"></i>
                                </Button>
                                <Slider className="slider" min={0} max={360} defaultValue={3} value={selectedValue.rotate}
                                    onChange={(e) => {
                                        selectedValue.rotate = e;
                                        updateValue(selectedValue);
                                    }} />
                                <Button onClick={this.deleteBtnClick}>
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </Button>
                            </div>
                        }
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.okButtonClick}>OK</Button>
                </ModalFooter>
            </Modal>
        )
    }
};

const stateToProps = (state) => {
    return {
        values: state.layoutModal.values,
        isOpen: state.layoutModal.isOpen,
        layoutImage: state.layoutModal.layoutImage,
        changeFieldValue: state.layoutModal.field_onChange,
        fileManagerModalToggle: state.layoutModal.fileManagerModalToggle,
        selectedIndex: state.layoutModal.selectedIndex,
    }
};

const reducerToProps = (reducer) => (
    bindActionCreators({ toggle: actions.toggle, addValue: actions.addValue, selectValueIndex: actions.selectValueIndex, removeSelectedValue: actions.removeSelectedValue, updateValue: actions.updateValue }, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(LayoutModal),
    reducer,
    actions
}