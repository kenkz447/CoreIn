var gulp = require("gulp");
var sass = require("gulp-sass");
var watch = require('gulp-watch');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browsersync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var babelify = require('babelify');

var pkg = require('./package.json');

var libs = [
    'bootstrap',
    'classnames',
    'history',
    'jquery',
    'prop-types',
    'react',
    'react-addons-css-transition-group',
    'react-addons-transition-group',
    'react-dom',
    'react-localization',
    'react-owl-carousel2',
    'react-redux',
    'react-router',
    'react-router-dom',
    'react-router-redux',
    'reactstrap',
    'react-touch',
    'redux',
    'tether',
    'react-breadcrumbs',
    'list-to-tree',
    'google-map-react',
    'react-pure-render',
    'react-controllables'
];

gulp.task('sass', function() {
    return gulp.src('develop/styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/css'))
        .pipe(browsersync.stream());
});

gulp.task('default', ['watch']);

gulp.task('watch', function() {
    browsersync.init({
        proxy: 'http://localhost:51579/',
        files: ["wwwroot/js/*.js"]
    });

    gulp.watch('develop/styles/**/*.scss', ['sass'])
    gulp.watch('develop/scripts/**/*.jsx', ['jsx'])
});

gulp.task('jsx', function() {
    browserify({
            entries: './develop/scripts/dbgroupvn.jsx',
            extensions: ['.jsx'],
            debug: true
        })
        .transform(babelify, {
            'presets': ['es2015', 'react'],
            'plugins': ['transform-decorators-legacy',
                'babel-plugin-transform-class-properties',
                'babel-plugin-transform-object-rest-spread'
            ]
        })
        .external(libs)
        .bundle()
        .on('error', onError)
        .pipe(source(`${pkg.name}.js`))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('wwwroot/js'))
})

gulp.task('vendor', function() {
    browserify({
            entries: 'develop/scripts/dbgroupvn.vendor.js',
        })
        .require(libs)
        .bundle()
        .pipe(source(`${pkg.name}.vendor.js`))
        .pipe(buffer())
        .pipe(gulp.dest('wwwroot/js'))
});

gulp.task('vendor-min', function() {
    var stream = gulp.src('wwwroot/js/dbgroupvn.vendor.js')
        .pipe(uglify()).pipe(rename('dbgroupvn.vendor.min.js'))
        .pipe(gulp.dest('wwwroot/js'));
    return stream;
});

function onError(err) {
    console.log(err);
    this.emit('end');
}