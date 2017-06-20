import React, { Component } from 'react'
import { Col } from 'reactstrap'

class PagingItemWrapper extends Component {
    componentWillUnmount() {
    }

    render() {
        const { xs, sm, md, lg, xl, item, renderItem, className } = this.props
        return (
            <Col className={ className } xs={ xs } sm={ sm } md={ md } lg={ lg } xl={ xl }>
                { renderItem(item) }
            </Col>
        )
    }
}

export default PagingItemWrapper