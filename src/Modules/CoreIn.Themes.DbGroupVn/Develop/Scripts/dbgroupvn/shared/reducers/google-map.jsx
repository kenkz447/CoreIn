const SHOW_MARKER_BALLOON = "GMAP_SHOW_MARKER_BALLOON"
const CREATE_MAP = "GMAP_CEATE_MAP"
const SET_MAP_VALUE = "GMAP_SET_MAP"
const SET_MAP_MARKERS = "GMAP_SET_MAP_MARKERS"

const showMarkerBalloon = (mapId, markerId) => ({
    type: SHOW_MARKER_BALLOON,
    mapId,
    markerId
})

const createMap = (mapId) => ({
    type: CREATE_MAP,
    mapId
})

const setMapValue = (mapId, map) => ({
    type: SET_MAP_VALUE,
    mapId,
    map
})

const setMapMarkers = (mapId, markers) => ({
    type: SET_MAP_MARKERS,
    mapId, 
    markers
})

const googleMapInitialState = {

}

const googleMapReducer = (state = googleMapInitialState, action) => {
    switch (action.type) {
        case CREATE_MAP:
            var newState = $.extend(true, {}, state)
            newState[ action.mapId ] = {}
            return newState
        case SET_MAP_VALUE:
            var newState = $.extend(true, {}, state)
            newState[ action.mapId ] = $.extend(true, {}, newState[ action.mapId ], action.map)
            return newState
        case SET_MAP_MARKERS:
            var newState = $.extend(true, {}, state)

            //Đôi khi, action này đc gọi trước khi init map
            //các giá trị của map sẽ lấy theo mặc định của component
            if(!newState[ action.mapId ])
                newState[ action.mapId ] = {}

            newState[ action.mapId ].markers = action.markers
            return newState
        case SHOW_MARKER_BALLOON:
            var newState = $.extend(true, {}, state)
            newState[ action.mapId ].showBalloonForMarker = action.markerId
            return newState
        default:
            return state
    }
}

export {
    createMap,
    showMarkerBalloon,
    setMapValue,
    setMapMarkers,
    googleMapReducer
}