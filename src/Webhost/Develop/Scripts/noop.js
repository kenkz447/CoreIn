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

jQuery(document).on('click', '.card-actions a', function (e) {
    e.preventDefault();

    if (jQuery(this).hasClass('btn-close')) {
        jQuery(this).parent().parent().parent().fadeOut();
    } else if (jQuery(this).hasClass('btn-minimize')) {
        var $target = jQuery(this).parent().parent().next('.card-block');
        if (!jQuery(this).hasClass('collapsed')) {
            jQuery('i', jQuery(this)).removeClass(jQuery.panelIconOpened).addClass(jQuery.panelIconClosed);
        } else {
            jQuery('i', jQuery(this)).removeClass(jQuery.panelIconClosed).addClass(jQuery.panelIconOpened);
        }

    } else if (jQuery(this).hasClass('btn-setting')) {
        jQuery('#myModal').modal('show');
    }

});

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