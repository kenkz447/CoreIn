const ConnectedBasePage = require('./connected-base-page').default;
const PropTypes = require('prop-types');

const baseArgs = {
    page: ''
}

baseArgs.PropTypes = {
    page: PropTypes.string.require
}

module.exports = (args = baseArgs) => Element => class extends React.Component {
    render() {
        return (
            <ConnectedBasePage {...args} {...this.props} component={Element} />
        )
    }
}