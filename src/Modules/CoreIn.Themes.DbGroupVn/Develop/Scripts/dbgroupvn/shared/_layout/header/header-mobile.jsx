const classNames = require('classnames');
const LanguageSelect = require('./language-select');
const Search = require('./search');


module.exports = class extends React.Component {
	openMenu() {

	}
	componentDidMount() {
		if ('ontouchstart' in window)
			var click = 'touchstart';
		else
			var click = 'click';

		var $layout = $($('.layout')[0]);
		var $wrapper = $layout.find('.wrapper');
		var $burger = $layout.find('.burger');

		global.closeMenu = function closeMenu() {
			$layout.removeClass('animate').delay(500).queue(function () {
				$wrapper.unbind(click);
				$layout.removeClass('modalview').dequeue();
			});
			$burger.removeClass('open');
		}

		global.openMenu = function openMenu() {
			$burger.addClass('open');
			$layout.addClass('modalview');
			$layout.addClass('animate').delay(500).queue(function () {
				$wrapper.bind(click, function () {
					if ($layout.hasClass('modalview'))
						closeMenu();
				});
				$layout.addClass('modalview').dequeue();
			});
		}

		$burger.on(click, function () {
			openMenu();
		});

		var $nav = $layout.find('.outer-nav');
		$nav.find('a').bind(click, function() {
			closeMenu();
		});
	}
	render() {
		return (
			<div className={classNames("header-mobile clearfix", this.props.className)}>
				<div className="float-left mt-1">
					<div className="burger">
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>

				<div className="float-right">
					<div className="float-left language-select pr-3 mr-3">
						<LanguageSelect />
					</div>
					<div className="float-left">
						<Search />
					</div>
				</div>
			</div>
		)
	}
}