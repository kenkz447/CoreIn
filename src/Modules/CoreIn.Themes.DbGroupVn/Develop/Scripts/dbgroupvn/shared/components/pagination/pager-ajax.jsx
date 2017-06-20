import React, { PropTypes } from 'react'
import { Link } from 'react-router-dom'
import _ from 'underscore'
import { default as classNames } from 'classnames'

class Pager extends React.Component {
    
    static propTypes = {
        onItemsChange: PropTypes.func.isRequired,
        initialPage: PropTypes.number
    }

    constructor(props) {
        super(props);
        this.state = { pager: {} };
        this.renderPage = this.renderPage.bind(this)
        this.renderPageLink = this.renderPageLink.bind(this)
    }

    renderPageLink(page, label) {
        const { getPageUrl } = this.props
        return (<Link className="page-link" to={ getPageUrl(page) } dangerouslySetInnerHTML={{__html: label || page }}/>)
    }

    renderPage() {
        const { currentPage, totalPages, basePath, getPageUrl } = this.props
        const pageComonents = []

        for (var page = 1; page <= totalPages; page++) {
            pageComonents.push(
                <li key={ page } className={ classNames("page-item", { active: currentPage === page }) }>
                    { this.renderPageLink(page) }
                </li>
            )
        }

        return pageComonents
    }

    render() {
        const { totalPages, currentPage, getPageUrl } = this.props

        if (!totalPages || totalPages <= 1) {
            // don't display pager if there is only 1 page
            return null;
        }

        return (
            <div className={ classNames("pager", this.props.className) }>
                <ul className="pagination">
                    <li className={ classNames("page-item", { disabled: currentPage === 1 }) }>
                        { this.renderPageLink(1, '<i class="fa fa-angle-left" aria-hidden="true"></i>') }
                    </li>
                    { this.renderPage() }
                    <li className={ classNames("page-item", { disabled: currentPage === totalPages }) }>
                        { this.renderPageLink(totalPages, '<i class="fa fa-angle-right" aria-hidden="true"></i>') }
                    </li>
                </ul>
            </div>
        );
    }
}

export default Pager;