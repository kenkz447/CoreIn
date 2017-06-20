import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Row } from 'reactstrap'
import { default as PagingItemWrapper } from './item-wrapper'
import $ from 'jquery'
import { default as classNames } from 'classnames'

class PagingItemContainer extends Component {
    static defaultProps = {
        items: []
    }
    
    constructor(props) {
        super(props);

        this.state = {
            itemToDisplay: []
        }
        this.refreshContainerView = this.refreshContainerView.bind(this)
        this.displayNewItems = this.displayNewItems.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(nextProps.items) != JSON.stringify(this.props.items)) {
            this.refreshContainerView(nextProps.items)
        }
    }

    displayNewItems() { 
        this.setState({ displayNewItems: this.itemToDisplay })
    }

    refreshContainerView(itemToDisplay) {
        this.itemToDisplay = itemToDisplay

        const $wrapper = $(ReactDOM.findDOMNode(this.refs[ 'wrapper' ]))
        $('.paging-item-wrapper.on-display').addClass('fade-left').delay(500).queue(this.displayNewItems)
    }

    render() {
        const { className, items, renderItem, layout, itemWrapperClassName } = this.props
        return (
            <div className={classNames("paging-wrapper", className)} ref="wrapper">
                <Row className="paging-item-container">
                    {
                        items.map((item, index) => {
                            return <PagingItemWrapper key={index} className={classNames("paging-item-wrapper", itemWrapperClassName)} {...layout} item={ item } renderItem={ renderItem } />
                        })
                    }
                </Row>
            </div>
        )
    }
}

export default PagingItemContainer