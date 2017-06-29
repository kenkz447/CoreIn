function generateEntityDetailUrl(entities, routePath, paramKey = ':entity') {
    entities = entities.map((entity) => {
        entity.path = String(routePath).replace(paramKey, entity.name)
        return entity
    })
    return entities
}

export default generateEntityDetailUrl