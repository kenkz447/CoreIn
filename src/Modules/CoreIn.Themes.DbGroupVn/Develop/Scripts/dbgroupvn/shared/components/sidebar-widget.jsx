import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { NavLink } from 'react-router-dom'
import { Collapse } from 'reactstrap'

class SidebarWidget extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        toggleDefault: PropTypes.bool
    };

    static defaultProps = {
        title: 'Missing title',
        toggleDefault: true
    }

    constructor(props) {
        super(props);
        this.state = {
            toggle: props.toggleDefault
        }

        this.widgetClassName = classNames("widget-item", { "no-border": props.noBorder }, )
        this.titleClassName = classNames('widget-item-title', props.titleClassName)
        this.toggle = this.toggle.bind(this)
        this.renderContent = this.renderContent.bind(this)
    }

    toggle() {
        this.setState({ toggle: !this.state.toggle })
    }

    renderContent() {
        const { children, className } = this.props

        return (
            <div className={ classNames(className, 'widget-item-content') }>
                {
                    children
                }
            </div>
        )
    }

    render() {
        const { title, link, noCollapse } = this.props

        return (
            <div className={ this.widgetClassName } >
                <div className="widget-item-header">
                    {
                        link ? (
                            <NavLink to={ link } className={ this.titleClassName } activeClassName="current">
                                { title }
                            </NavLink>
                        ) :
                            <span href="#" className={ this.titleClassName }>
                                { title }
                            </span>
                    }

                    {
                        noCollapse || (
                            <span className="chevron" onClick={ this.toggle }>
                                <i className="fa fa-angle-down" aria-hidden="true" />
                            </span>
                        )
                    }
                </div>
                <div className="widget-item-content-container">
                    {
                        noCollapse ? this.renderContent() :
                            (
                                <Collapse isOpen={ this.state.toggle } >
                                    { this.renderContent() }
                                </Collapse>
                            )
                    }

                </div>
            </div>
        );
    }
}

export default SidebarWidget;