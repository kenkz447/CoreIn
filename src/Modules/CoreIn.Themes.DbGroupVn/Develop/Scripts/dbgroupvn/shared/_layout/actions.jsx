const UPDATE_LAYOUT = "SET_LAYOUT_PARAMETER"
const TOGGLE_PAGE_LOADING = "TOGGLE_PAGE_LOADING"
const TOGGLE_MOBILE_SIDEBAR = "TOGGLE_MOBILE_SIDEBAR"

const updateLayout = () => ({
    type: UPDATE_LAYOUT
})

const togglePageLoading = (toggle) => ({
    type: TOGGLE_PAGE_LOADING,
    toggle
})

const toggleMobileSidebar = (toggle) => ({
    type: TOGGLE_MOBILE_SIDEBAR,
    toggle
})


export { TOGGLE_MOBILE_SIDEBAR, UPDATE_LAYOUT, TOGGLE_PAGE_LOADING,
     toggleMobileSidebar, updateLayout, togglePageLoading }


