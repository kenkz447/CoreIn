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
    'react',
    'react-dom',
    'react-addons-css-transition-group',
    'react-addons-transition-group',
    'redux',
    'react-redux',
    'redux-form',
    'jquery',
    'tether',
    'bootstrap',
    'reactstrap',
    'jquery.filer',
    'sift',
    'classnames',
    'react-checkbox-tree',
    'underscore',
    'react-ui-tree',
    'list-to-tree',
    'react-table',
    'rc-slider',
    'react-draft-wysiwyg',
    'draft-js',
    'draftjs-to-html',
    'html-to-draftjs',
];

var production = (process.env.NODE_ENV === 'production');

gulp.task('default', function () {
    // place code for your default task here
});

gulp.task('vendor', function () {

    var b = browserify({
        debug: false,
        transform: ['reactify']
    });

    var stream = gulp.src('develop/scripts/noop.js', { read: false })
        .pipe(b)
        .on('prebundle', function (bundle) {
            libs.forEach(function (lib) {
                bundle.require(lib);
            });
        });

    if (production)
        stream.pipe(uglify());

    stream.pipe(rename('vendor' + (production ? '.min' : '') + '.js'))
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
        .pipe(gulp.dest('wwwroot/css'));
})