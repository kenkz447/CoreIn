import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap'
import { PageItem, Image } from '../../shared/components'

class DuAnCategory extends Component {
    constructor(props) {
        super(props);
        this.getCurrentCategory = this.getCurrentCategory.bind(this)
    }

    getCurrentCategory(match) {
        match = match || this.props.match
        const { categories } = this.props

        const currentCategory = categories.filter((categoryItem) => {
            return categoryItem.name === match.params.category
        })[ 0 ]
        return currentCategory
    }

    componentWillMount() {
        const { searchArea, searchCity, fecthData } = this.props
        const category = this.getCurrentCategory()
        fecthData(category, searchArea, searchCity);
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props) != JSON.stringify(nextProps))
            this.props.fecthData(this.getCurrentCategory(nextProps.match), nextProps.searchArea, nextProps.searchCity);
    }

    render() {
        const { match, pageCoverImage, currentCategory, basePath, onItemHover, items } = this.props
        return (
            <Container>
                <Image {...pageCoverImage} />
                <div className="page-titles mt-4 mb-3">
                    <span className="page-title">{ localizationString.getString("Bộ sưu tập") }</span>
                    <span>|</span>
                    <span className="page-title">{ currentCategory ? currentCategory.title : localizationString.getString("Tất cả") }</span>
                </div>
                <Row>
                    {
                        items.map((item, index) => {
                            return (
                                <Col key={ item.id } xs="6" lg="4" className="page-item"
                                    onMouseEnter={() => {
                                        onItemHover(true, item)
                                    }}
                                    onMouseLeave={()=> {
                                        onItemHover(false, item)
                                    }}
                                >
                                    <PageItem data={ item } extraText={ item.area } path={ `/${basePath}/${items.name}` } />
                                </Col>
                            );
                        })
                    }
                </Row>
            </Container>

        );
    }
}

export default DuAnCategory;