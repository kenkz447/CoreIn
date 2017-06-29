import { PageItem } from '../../shared/components'

function renderItem(item) {
    return <PageItem data={ item } extraText={ item.area } path={ item.path } />
}

export { renderItem }