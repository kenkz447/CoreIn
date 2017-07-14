var gulp = require("gulp");
var sass = require("gulp-sass");
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');
var reactify = require('reactify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

var libs = [
    'bootstrap',
    'classnames',
    'draft-js',
    'draftjs-to-html',
    'html-to-draftjs',
    'jquery',
    'jquery.filer',
    'list-to-tree',
    'prop-types',
    'rc-slider',
    'react',
    'react-addons-css-transition-group',
    'react-addons-transition-group',
    'react-checkbox-tree',
    'react-dom',
    'react-draft-wysiwyg',
    'react-redux',
    'react-router',
    'reactstrap',
    'react-table',
    'react-ui-tree',
    'redux',
    'redux-form',
    'sift',
    'tether',
    'underscore',
    'react-router-dom',
    'react-router-redux',
    'history',
    'react-owl-carousel2',
    'react-localization',
    'react-touch',
    'react-codemirror'
];

var production = (process.env.NODE_ENV === 'production');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('vendor', function () {

    var stream = gulp.src('develop/scripts/noop.js', { read: false })
        .pipe(browserify({
            debug: !production,
            transform: ['reactify'],
            extensions: ['.jsx']
        }))
        .on('prebundle', function (bundle) {
            libs.forEach(function (lib) {
                bundle.require(lib);
            });
        });

    if (production)
        stream.pipe(uglify());

    stream.pipe(rename('vendor.admin.js'))
        .pipe(gulp.dest('wwwroot/js'));

    return stream;
});

gulp.task('style', function () {
    var bundles = [
        'develop/styles/style.scss'
    ];

    var stream = gulp.src(bundles);

    stream.pipe(sourcemaps.init())
        .pipe(sass())
        //.pipe(concat('style.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(rename('style.admin.css'))
        .pipe(gulp.dest('wwwroot/css'));
})