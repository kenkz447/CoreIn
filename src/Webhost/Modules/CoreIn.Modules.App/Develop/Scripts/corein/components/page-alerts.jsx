const $ = require('jquery');
const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { Alert } = require('reactstrap');

const keys = {
    push: "PUSH",
    remove: "REMOVE"
};

const actions = {
    push: (alertType, content) => ({
        type: keys.push,
        alertType,
        content
    }),
    remove: (index) => ({
        type: keys.remove,
        index
    })
}

const initState = {
    alerts: []
}

const reducer = (state = initState, action) => {
    const newState = $.extend(true, {}, state);
    switch (action.type) {
        case keys.push:
            newState.alerts.push({ type: action.alertType, content: action.content });
            break;
        case keys.remove:
            newState.alerts.splice(action.index, 1);
            break;
        default:
            return state;
    }
    return newState;
}

class PageAlerts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { alerts, remove } = this.props;
        return (
            <div>
                {
                    alerts.map((alert, index) => {
                        return (
                            <Alert key={index} color={alert.type}
                                toggle={() => {
                                    remove(index);
                                }} >{alert.content}</Alert>
                            );
                    })
                }
            </div>
            );
    }
}

const stateToProps = (state) => {
    return state.pageAlerts
}

const reducerToProps = (reducer) => (
    bindActionCreators(actions, reducer)
);

module.exports = {
    default: connect(stateToProps, reducerToProps)(PageAlerts),
    actions,
    reducer
}
