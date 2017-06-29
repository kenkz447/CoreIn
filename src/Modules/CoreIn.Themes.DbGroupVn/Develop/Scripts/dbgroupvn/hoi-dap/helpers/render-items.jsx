import { Link } from 'react-router-dom'

import { PageItem } from '../../shared/components'
import { Row, Col } from 'reactstrap'
import { Image } from '../../shared/components'

const pageConfigure = require('../configuration.js')

function renderItem(item) {
    try {
        const { thumbnailUrl, moreDetails } = item

        return (
            <article className="hoi-dap-item w-100">
                <div className="hoi-dap-item-thumbnail mb-5">
                    <Image url={ thumbnailUrl }
                        title={ moreDetails && moreDetails.thumbnailTitle && moreDetails.thumbnailTitle }
                        alt={ moreDetails && moreDetails.thumbnailAlt && moreDetails.thumbnailAlt } />
                </div>
                <div className="hoi-dap-item-content" dangerouslySetInnerHTML={ moreDetails && { __html: moreDetails.content } } />
            </article>
        )
    }
    catch (e) {
        console.error('renderItem Error:')
        console.log(item)
        console.error(e)
    }
}

export { renderItem }