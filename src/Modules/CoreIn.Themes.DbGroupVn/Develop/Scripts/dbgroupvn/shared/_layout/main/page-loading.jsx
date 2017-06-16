const { connect } = require('react-redux');
const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"> <g class="anim-0"> <circle cx="50" cy="50" r="50" fill="white" /> </g> <g class="anim-1"> <circle cx="50" cy="50" r="5" fill="#ff5e7C" /> </g> <g class="anim-2"> <circle cx="75" cy="50" r="5" fill="#ff5e7C" /> <line x1="25" y1="50" x2="75" y2="50" stroke="#ff5e7C" stroke-width="3" /> </g> <g class="anim-3"> <circle cx="50" cy="25" r="5" fill="#ff5e7C" /> <line x1="50" y1="25" x2="25" y2="75" stroke="#ff5e7C" stroke-width="3" /> <line x1="50" y1="25" x2="75" y2="75" stroke="#ff5e7C" stroke-width="3" /> </g> <g class="anim-4"> <circle cx="75" cy="25" r="5" fill="#ff5e7C" /> <line x1="75" y1="25" x2="25" y2="25" stroke="#ff5e7C" stroke-width="3" /> </g></svg>';

class Loading extends React.Component {
    componentDidUpdate() {
        const { isVisible } = this.props;
        var $element = $(ReactDOM.findDOMNode(this));

        if(isVisible)
            $element.fadeTo(500, 1, function(){
            });   
        else
            $element.fadeTo(500, 0, function(){
                $element.hide();
            });   
    }

    componentDidMount() {

    }

    render() {
        return (
            <div id="loading" dangerouslySetInnerHTML={{ __html: svg }} />
        )
    }
}

const stateToProps = (state) => ({
    isVisible: state.layout.isPageLoadingVisible
})

module.exports = connect(stateToProps)(Loading);