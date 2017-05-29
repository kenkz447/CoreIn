global.jQuery = require('jquery');
global.Tether = require('tether');
global.Bootstrap = require('bootstrap');
global.React = require('react');
global.ReactDOM = require('react-dom');

/*****
 * COREUI CONFIGURATION
 *****/

//Main navigation
jQuery.navigation = jQuery('nav > ul.nav');

jQuery.panelIconOpened = 'icon-arrow-up';
jQuery.panelIconClosed = 'icon-arrow-down';

//Default colours
jQuery.brandPrimary = '#20a8d8';
jQuery.brandSuccess = '#4dbd74';
jQuery.brandInfo = '#63c2de';
jQuery.brandWarning = '#f8cb00';
jQuery.brandDanger = '#f86c6b';
jQuery.grayDark = '#2a2c36';
jQuery.gray = '#55595c';
jQuery.grayLight = '#818a91';
jQuery.grayLighter = '#d1d4d7';
jQuery.grayLightest = '#f8f9fa';

'use strict';

/****
* MAIN NAVIGATION
*/
jQuery(document).ready(function ($) {
    // Add class .active to current link
    jQuery.navigation.find('a').each(function () {

        var cUrl = String(window.location).split('?')[0];

        if (cUrl.substr(cUrl.length - 1) === '#') {
            cUrl = cUrl.slice(0, -1);
        }

        if (jQuery(jQuery(this))[0].href === cUrl) {
            jQuery(this).addClass('active');

            jQuery(this).parents('ul').add(this).each(function () {
                jQuery(this).parent().addClass('open');
            });
        }
    });

    // Dropdown Menu
    jQuery.navigation.on('click', 'a', function (e) {
        if (jQuery.ajaxLoad) {
            e.preventDefault();
        }

        if (jQuery(this).hasClass('nav-dropdown-toggle')) {
            jQuery(this).parent().toggleClass('open');
            resizeBroadcast();
        }
    });

    function resizeBroadcast() {
        var timesRun = 0;
        var interval = setInterval(function () {
            timesRun += 1;
            if (timesRun === 5) {
                clearInterval(interval);
            }
            window.dispatchEvent(new Event('resize'));
        }, 62.5);
    }

    /* ---------- Main Menu Open/Close, Min/Full ---------- */
    jQuery('.navbar-toggler').click(function () {
        if (jQuery(this).hasClass('sidebar-toggler')) {
            jQuery('body').toggleClass('sidebar-hidden');
            resizeBroadcast();
        }

        if (jQuery(this).hasClass('mobile-sidebar-toggler')) {
            jQuery('body').toggleClass('sidebar-mobile-show');
            resizeBroadcast();
        }
    });

    jQuery('.sidebar-close').click(function () {
        jQuery('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');
    });
    /* ---------- Disable moving to top ---------- */
    jQuery('a[href="#"][data-top!=true]').click(function (e) {
        e.preventDefault();
    });
    jQuery('[data-toggle="tooltip"]').tooltip();
});

/****
* CARDS ACTIONS
*/

//jQuery(document).on('click', '.card-actions a', function (e) {
//    e.preventDefault();

//    if (jQuery(this).hasClass('btn-close')) {
//        jQuery(this).parent().parent().parent().fadeOut();
//    } else if (jQuery(this).hasClass('btn-minimize')) {
//        var $target = jQuery(this).parent().parent().next('.card-block');
//        if (!jQuery(this).hasClass('collapsed')) {
//            jQuery('i', jQuery(this)).removeClass(jQuery.panelIconOpened).addClass(jQuery.panelIconClosed);
//        } else {
//            jQuery('i', jQuery(this)).removeClass(jQuery.panelIconClosed).addClass(jQuery.panelIconOpened);
//        }

//    } else if (jQuery(this).hasClass('btn-setting')) {
//        jQuery('#myModal').modal('show');
//    }

//});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {
    /* ---------- Tooltip ---------- */
    jQuery('[rel="tooltip"],[data-rel="tooltip"]').tooltip({ "placement": "bottom", delay: { show: 400, hide: 200 } });

    /* ---------- Popover ---------- */
    jQuery('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();
}
/*****
 * END COREUI CONFIGURATION
 *****/

/*
 Sticky-kit v1.1.2 | WTFPL | Leaf Corcoran 2015 | http://leafo.net
*/
(function(){var b,f;b=this.jQuery||window.jQuery;f=b(window);b.fn.stick_in_parent=function(d){var A,w,J,n,B,K,p,q,k,E,t;null==d&&(d={});t=d.sticky_class;B=d.inner_scrolling;E=d.recalc_every;k=d.parent;q=d.offset_top;p=d.spacer;w=d.bottoming;null==q&&(q=0);null==k&&(k=void 0);null==B&&(B=!0);null==t&&(t="is_stuck");A=b(document);null==w&&(w=!0);J=function(a,d,n,C,F,u,r,G){var v,H,m,D,I,c,g,x,y,z,h,l;if(!a.data("sticky_kit")){a.data("sticky_kit",!0);I=A.height();g=a.parent();null!=k&&(g=g.closest(k));
if(!g.length)throw"failed to find stick parent";v=m=!1;(h=null!=p?p&&a.closest(p):b("<div />"))&&h.css("position",a.css("position"));x=function(){var c,f,e;if(!G&&(I=A.height(),c=parseInt(g.css("border-top-width"),10),f=parseInt(g.css("padding-top"),10),d=parseInt(g.css("padding-bottom"),10),n=g.offset().top+c+f,C=g.height(),m&&(v=m=!1,null==p&&(a.insertAfter(h),h.detach()),a.css({position:"",top:"",width:"",bottom:""}).removeClass(t),e=!0),F=a.offset().top-(parseInt(a.css("margin-top"),10)||0)-q,
u=a.outerHeight(!0),r=a.css("float"),h&&h.css({width:a.outerWidth(!0),height:u,display:a.css("display"),"vertical-align":a.css("vertical-align"),"float":r}),e))return l()};x();if(u!==C)return D=void 0,c=q,z=E,l=function(){var b,l,e,k;if(!G&&(e=!1,null!=z&&(--z,0>=z&&(z=E,x(),e=!0)),e||A.height()===I||x(),e=f.scrollTop(),null!=D&&(l=e-D),D=e,m?(w&&(k=e+u+c>C+n,v&&!k&&(v=!1,a.css({position:"fixed",bottom:"",top:c}).trigger("sticky_kit:unbottom"))),e<F&&(m=!1,c=q,null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),
h.detach()),b={position:"",width:"",top:""},a.css(b).removeClass(t).trigger("sticky_kit:unstick")),B&&(b=f.height(),u+q>b&&!v&&(c-=l,c=Math.max(b-u,c),c=Math.min(q,c),m&&a.css({top:c+"px"})))):e>F&&(m=!0,b={position:"fixed",top:c},b.width="border-box"===a.css("box-sizing")?a.outerWidth()+"px":a.width()+"px",a.css(b).addClass(t),null==p&&(a.after(h),"left"!==r&&"right"!==r||h.append(a)),a.trigger("sticky_kit:stick")),m&&w&&(null==k&&(k=e+u+c>C+n),!v&&k)))return v=!0,"static"===g.css("position")&&g.css({position:"relative"}),
a.css({position:"absolute",bottom:d,top:"auto"}).trigger("sticky_kit:bottom")},y=function(){x();return l()},H=function(){G=!0;f.off("touchmove",l);f.off("scroll",l);f.off("resize",y);b(document.body).off("sticky_kit:recalc",y);a.off("sticky_kit:detach",H);a.removeData("sticky_kit");a.css({position:"",bottom:"",top:"",width:""});g.position("position","");if(m)return null==p&&("left"!==r&&"right"!==r||a.insertAfter(h),h.remove()),a.removeClass(t)},f.on("touchmove",l),f.on("scroll",l),f.on("resize",
y),b(document.body).on("sticky_kit:recalc",y),a.on("sticky_kit:detach",H),setTimeout(l,0)}};n=0;for(K=this.length;n<K;n++)d=this[n],J(b(d));return this}}).call(this);