const Title = require('./components/section-title');
const PageArticle = require('./components/page-article');
const Image = require('./components/image');
const RenderDelay = require('./components/_commons/delay-render');

import { default as ConnectedBreacrumbs } from './components/connected-breacrumbs'
import { default as Sidebar } from './components/sidebar'
import { default as CategoryMenu } from './components/category-menu'
import { default as PageItem } from './components/page-item'
import { default as SidebarMenu } from './components/sidebar-menu'
import { default as SidebarWidget } from './components/sidebar-widget'
import { default as GoogleMap } from './components/gmap/google-map'
import { default as Pagination } from './components/pagination'

module.exports = {
    RenderDelay,
    Title,
    PageArticle,
    Image,
    ConnectedBreacrumbs,
    Sidebar,
    CategoryMenu,
    PageItem,
    SidebarMenu,
    SidebarWidget,
    GoogleMap,
    Pagination
}