const classNames = require('classnames');

module.exports = class extends React.Component {
    constructor(){
        super();
        this.state = {
            facebook: "/",
            twitter: "/",
            instagram: "/"
        }
    }

    render(){
        return (
            <ul className={classNames("socials pl-0", this.props.className)}>
                <li className="facebook"><a href={this.state.facebook}><i className="fa fa-facebook-official"/></a></li>
                <li className="twitter"><a href={this.state.twitter}><i className="fa fa-twitter"/></a></li>
                <li className="instagram"><a href={this.state.instagram}><i className="fa fa-instagram"/></a></li>
            </ul>
        )
    }
}