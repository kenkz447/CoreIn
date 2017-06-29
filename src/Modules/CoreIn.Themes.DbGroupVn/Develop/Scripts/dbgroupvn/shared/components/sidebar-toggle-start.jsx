import React, { Component } from 'react';
import ReactDOM from 'react-dom'

import $ from 'jquery'
import { default as classNames } from 'classnames'
import { connect } from 'react-redux'
import { toggleMobileSidebar } from '../_layout/actions'

class SideBarToggleStart extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const $button = $(ReactDOM.findDOMNode(this.refs.button))
        const $content = $(ReactDOM.findDOMNode(this.refs.content))
        const contentHeight = $content.outerHeight();
        $button.css('top', '-' + Math.ceil(contentHeight / 2) + 'px')
    }

    componentWillReceiveProps(nextProps) {
        const $button = $(ReactDOM.findDOMNode(this.refs.button))
        const $content = $(ReactDOM.findDOMNode(this.refs.content))
        const $wrapper = $(ReactDOM.findDOMNode(this.refs.wrapper))
        const $window = $(window)
        const { layoutParameters: { header, breadcrumbs } } = nextProps
        const contentHeight = $content.outerHeight();
        const btnHeight = $button.height()
        const isWrapperFloat = $wrapper.hasClass('float')

        var toggleSidebarButtonOffsetTop = nextProps.layoutParameters.toggleSidebarButtonOffsetTop + 1

        if (nextProps.isMobileSidebarOpen == false)
            $button.removeClass('open').delay(500).queue(() => {
                $button.removeClass('transition-advance')
                $button.dequeue()
            })
        else
            $content.css('margin-left', '4rem')

        if (isWrapperFloat)
            toggleSidebarButtonOffsetTop = Math.ceil($wrapper.offset().top)

        if(!$wrapper.hasClass('static'))
            $(window).on('scroll.myscroll', function () {
                const windowSrcollTop = $window.scrollTop()
                if (windowSrcollTop > header.height) {
                    $button.css('position', 'fixed')
                    $button.css('top', toggleSidebarButtonOffsetTop)
                }
                else {
                    $button.css('position', 'absolute')
                    $button.css('top', '-' + Math.ceil(contentHeight / 2 - 2) + 'px')
                }

                if (windowSrcollTop > header.height + btnHeight)
                    $content.css('margin-left', '1rem')
                else
                    $content.css('margin-left', '4rem')

            });

    }

    buttonClick(e) {
        const $button = $(ReactDOM.findDOMNode(this.refs.button))

        this.props.dispatch(toggleMobileSidebar(!$button.hasClass('open')))

        if ($button.hasClass('open')) {
            $button.removeClass('open').delay(500).queue(() => {
                $button.removeClass('transition-advance')
                $button.dequeue()
            })
        }
        else {
            $button.addClass('transition-advance')
            $button.addClass('open')
        }
    }

    render() {
        return (
            <div ref="wrapper" id="sidebar-toggle-wrapper" className={ classNames(this.props.className, "sidebar-toggle-start") }>
                <div ref="content" className="sidebar-toggle-start-content transition-basic">
                    { this.props.children }
                </div>
                <div ref="button" id="sidebar-toggle-btn" className="sidebar-toggle-btn d-lg-none ml-2 text-primary" onClick={ this.buttonClick.bind(this) }>
                    <i className="fa fa-angle-double-right" aria-hidden="true"></i>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isMobileSidebarOpen: state.layout.isMobileSidebarOpen,
        layoutParameters: state.layout.parameters
    }
}

export default connect(mapStateToProps)(SideBarToggleStart);