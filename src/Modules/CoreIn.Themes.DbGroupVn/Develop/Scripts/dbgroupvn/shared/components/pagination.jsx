import React, { Component } from 'react';

import { default as PropTypes } from 'prop-types'
import { default as classNames } from 'classnames'

import { default as Pager } from './pagination/pager'
import { default as ItemContainer } from './pagination/item-container'
import { default as PagerAjax } from './pagination/pager-ajax'

class componentName extends Component {
    static propTypes = {
        renderItem: PropTypes.func.isRequired
    }

    static defaultProps = {
        items: [],
        itemPerPage: 9,
        layout: {
            xs: 12, sm: 6, md: 4, lg: 4, xl: 4
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            currentPage: 1
        }
        this.onItemsChange = this.onItemsChange.bind(this)
    }

    onItemsChange(pageItems, currentPage, totalPages) {
        this.setState({ pageItems, currentPage, totalPages })
    }

    render() {
        const { className,
            items, layout, itemWrapperClassName, renderItem,
            itemPerPage, currentPage, templatePath, totalPages
        } = this.props

        //ItemContainer will render current page item
        //Ajax pager render page list only
        return (
            <div className={ classNames(className, "pagination-container clearfix") }>
                <ItemContainer className={ "mb-4" }
                    items={ this.state.pageItems || items }
                    layout={ layout }
                    renderItem={ renderItem }
                    itemWrapperClassName={ itemWrapperClassName } />
                {
                    templatePath ?
                        <PagerAjax className="float-right"
                            currentPage={ currentPage }
                            totalPages={ totalPages }
                            itemPerPage={ itemPerPage }
                            templatePath={ templatePath }
                            onItemsChange={ this.onItemsChange }
                        /> :
                        <Pager className="float-right"
                            items={ items }
                            itemPerPage={ itemPerPage }
                            onItemsChange={ this.onItemsChange }
                        />
                }
            </div>
        );
    }
}

export default componentName;