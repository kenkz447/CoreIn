const Title = require('./components/section-title');
const PageArticle = require('./components/page-article');
const Image = require('./components/image');
const RenderDelay = require('./components/_commons/delay-render');

import { default as ConnectedBreacrumbs } from './components/connected-breacrumbs'
import { default as Sidebar } from './components/sidebar';
import { default as CategoryMenu } from './components/category-menu';

module.exports = {
    RenderDelay, Title, PageArticle, Image, ConnectedBreacrumbs, Sidebar, CategoryMenu
}