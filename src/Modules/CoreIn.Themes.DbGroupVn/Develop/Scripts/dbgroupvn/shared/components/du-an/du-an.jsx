const { Link } = require('react-router-dom');

class DuAn extends React.Component {
    constructor(props){
        super(props);
        this.renderLink = this.renderLink.bind(this);
    }

    renderLink(title) {
        return(
            <Link to="/du-an"><span>{title}</span></Link>
        )
    }

    render() {
        const { data: { thumbnailUrl, title} } = this.props;

        return (
            <div data-aos="zoom-in-up">
                <div className="page-item-thumbnail">
                    <img className="w-100" src={`/${thumbnailUrl}`}/>
                    <div className="overlay"/>
                    {this.renderLink(localizationString.getString("Chi tiết"))}
                </div>
                <div className="page-item-title">
                    {this.renderLink(title)}
                </div>
            </div>
        );
    }
}

module.exports = DuAn;