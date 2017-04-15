/// <binding ProjectOpened='default' />
var gulp = require("gulp");
var sass = require("gulp-sass");
var watch = require('gulp-watch');
var browserify = require('gulp-browserify');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var pkg = require('./package.json');

var libs = [
    'react',
    'react-dom',
    'redux',
    'react-redux',
    'jquery'
];

gulp.task('default', ['watch']);

gulp.task('watch', function () {
    gulp.watch('Styles/**/*.scss', ['sass']);
    gulp.watch('scripts/**/*.jsx', ['jsx']);
});

gulp.task('jsx', function () {
    var production = (process.env.NODE_ENV === 'production');

    var stream = gulp.src(['scripts/index.jsx'], { read: false })
        .pipe(browserify({
            debug: !production,
            transform: ['reactify'],
            extensions: ['.js']
        }))
        .on('prebundle', function (bundle) {
            libs.forEach(function (lib) {
                bundle.external(lib);
            });
        });
    if (production)
        stream.pipe(uglify());

    stream.pipe(rename(pkg.name + (production ? '.min' : '') + '.js'))
        .pipe(gulp.dest('wwwroot/js'));

    return stream;
});

gulp.task('sass', function () {
    return gulp.src('Styles/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('wwwroot/css'));
});
