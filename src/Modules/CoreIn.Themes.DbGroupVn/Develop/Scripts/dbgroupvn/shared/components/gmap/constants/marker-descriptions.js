/*
 * marker visual parameters
 * image param is more prior than imageClass if both defined
 */

const markerDescriptions = [{
    size: { width: 33, height: 51 },
    origin: { x: 15 / 33, y: 1 },
    withText: true,
    // image: require('icons/map_icons/map_icon_text_red.svg')
    imageClass: 'map_icon_text_red'
}];

export default markerDescriptions;