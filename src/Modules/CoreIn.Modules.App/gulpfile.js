var gulp = require("gulp");
var sass = require("gulp-sass");
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var browsersync = require('browser-sync').create();
//var exorcist = require('exorcist');
var sourcemaps = require('gulp-sourcemaps');

var pkg = require('./package.json');

var libs = [
    'bootstrap',
    'classnames',
    'draft-js',
    'draftjs-to-html',
    'html-to-draftjs',
    'jquery',
    'jquery.filer',
    'list-to-tree',
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
    'react-codemirror'
];

var production = (process.env.NODE_ENV === 'production');

gulp.task('default', ['watch']);

gulp.task('watch', function () {
    browsersync.init({
        proxy: 'http://localhost:51579'
    });

    gulp.watch('develop/styles/**/*.scss', ['sass']);
    gulp.watch('develop/scripts/**/*.jsx', ['jsx-watch']);
});

gulp.task('jsx-watch', ['jsx'], function (done) {
    browsersync.reload();
    done();
});

gulp.task('jsx', function () {
    var stream = gulp.src(['develop/scripts/*.jsx'], { read: false })
        .pipe(browserify({
            debug: !production,

            transform: ['reactify'],
            extensions: ['.jsx']
        }))
        .on('prebundle', function (bundle) {
            libs.forEach(function (lib) {
                bundle.external(lib);
            });
        }).pipe(sourcemaps.init({ loadMaps: true }));

    if (production)
        stream.pipe(uglify());

    stream.pipe(rename(pkg.name + (production ? '.min' : '') + '.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('wwwroot/js'));

    return stream;
});

gulp.task('sass', function () {
    return gulp.src('develop/styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/css'))
        .pipe(browsersync.stream());
});