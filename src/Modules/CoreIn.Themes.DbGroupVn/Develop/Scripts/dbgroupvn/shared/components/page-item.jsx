const { Link } = require('react-router-dom');
const Image = require('./image')

class PageItem extends React.Component {
    constructor(props) {
        super(props);
        this.renderLink = this.renderLink.bind(this);
    }

    renderLink(title) {
        const { path } = this.props
        return (
            <Link to={ path }><span>{ title }</span></Link>
        )
    }

    render() {
        const { data: { thumbnailUrl, title }, extraText } = this.props;

        return (
            <div className="page-item-wrapper">
                <div className="page-item-thumbnail">
                    <Image className="w-100" url={ thumbnailUrl } description={ title } />
                    <div className="overlay" />
                    { this.renderLink(localizationString.getString("Chi tiết")) }
                </div>
                <div className="page-item-title">
                    { this.renderLink(title) }
                    <span className="extra-text">
                        { extraText }
                    </span>
                </div>
            </div>
        );
    }
}

PageItem.defautProps = {
    basePath: '/',
    extraText: '',
    data: {
        title: 'Missing title!',
        thumbnailUrl: '/img/default.png'
    }
}

module.exports = PageItem;