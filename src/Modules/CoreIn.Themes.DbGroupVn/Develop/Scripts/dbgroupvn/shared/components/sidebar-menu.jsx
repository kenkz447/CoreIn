import React, { Component } from 'react'
import { default as SidebarWidget } from './sidebar-widget'
import { NavLink } from 'react-router-dom'

class SidebarMenu extends Component {

    render() {
        const { noBorder, title, onTransitionTo, currentUrl, items } = this.props

        return (
            <SidebarWidget noBorder={ noBorder } title={ title }>
                <ul className="sidebar-widget-menu">
                    {
                        items.map((item, index) => (
                            <li className="sidebar-widget-item" key={ index }>
                                <NavLink className="sidebar-widget-link" to={ item.path } activeClassName='current'>
                                    <span className="sidebar-widget-link-title">
                                        { item.title }
                                    </span>
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </SidebarWidget>
        )
    }
}

SidebarMenu.defaultProps = {
    items: []
}


export default SidebarMenu;