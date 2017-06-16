const { Link } = require('react-router-dom');

class PageItem extends React.Component {
    constructor(props){
        super(props);
        this.renderLink = this.renderLink.bind(this);
    }

    renderLink(title) {
        return(
            <Link to="/cong-trinh"><span>{title}</span></Link>
        )
    }

    render() {
        const { data: { thumbnailUrl, title, acreage} } = this.props;

        return (
            <div>
                <div className="page-item-thumbnail">
                    <img className="w-100" src={`/${thumbnailUrl}`}/>
                    <div className="overlay"/>
                    {this.renderLink(localizationString.getString("Chi tiết"))}
                </div>
                <div className="page-item-title">
                    {this.renderLink(title)}
                    <span className="extra">
                        { acreage }
                    </span>
                </div>
            </div>
        );
    }
}

module.exports = PageItem;