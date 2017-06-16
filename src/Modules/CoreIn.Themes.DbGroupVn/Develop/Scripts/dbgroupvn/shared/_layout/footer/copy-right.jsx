const classNames = require('classnames');

module.exports = class extends React.Component {
    render(){
        return(
            <div className={classNames("copyright", this.props.className)}>
                C 2017 dbgroup. All rights reserved
            </div>
        )
    }
}