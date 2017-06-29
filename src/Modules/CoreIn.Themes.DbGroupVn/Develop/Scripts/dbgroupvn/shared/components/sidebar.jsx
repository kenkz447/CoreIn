import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { default as classNames } from 'classnames'
import { toggleMobileSidebar } from '../_layout/actions'

class Sidebar extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.isMobileSidebarOpen) {
            const { parameters: { viewportHeight, header, breadcrumbs } } = nextProps
            const $element = $(ReactDOM.findDOMNode(this.refs.sidebarMobile));

            const scrollTop = Math.ceil($(window).scrollTop())
            $element.css('height', Math.ceil(window.innerHeight))
            $element.css('top', scrollTop - header.height - breadcrumbs.height)
        }
    }

    render() {
        const { children, isMobileSidebarOpen } = this.props
        return (
            <div className="mr-lg-4">
                <aside className="d-none d-lg-block sidebar">
                    { children }
                </aside>

                <aside ref="sidebarMobile"
                    className={ classNames("d-lg-none transition-advance sidebar sidebar-mobile", { open: isMobileSidebarOpen }) }
                >
                    <div className="overlay" onClick={ (e) => {
                        this.props.dispatch(toggleMobileSidebar(false))
                    } } />

                    <div className="sidebar-mobile-wrapper transition-advance">
                        {
                            children
                        }
                    </div>
                </aside>
            </div >
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isMobileSidebarOpen: state.layout.isMobileSidebarOpen,
        parameters: state.layout.parameters
    }
}

export default connect(mapStateToProps)(Sidebar)