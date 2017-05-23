var gulp = require("gulp");
var copy = require('gulp-copy');
var browserify = require('gulp-browserify');
var sourcemaps = require('gulp-sourcemaps');

var packageCopyFolder = 'node_modules/corein';
var production = (process.env.NODE_ENV === 'production');
var rename = require('gulp-rename');

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
    'react-draft-wysiwyg',
    'draft-js',
    'draftjs-to-html',
    'html-to-draftjs'
];

var updateDestFolders = [
    '../../',
    '../CoreIn.Modules.Register/',
    '../CoreIn.Modules.Login/',
    '../CoreIn.Modules.FileManager/',
    '../CoreIn.Modules.TaxonomyUI/',
    '../CoreIn.Modules.Homeclick/'
]

gulp.task('default', ['watch'], function () {
});

gulp.task('watch', function () {
    return gulp.watch(['develop/**/*.jsx'], ['jsx']);
})

gulp.task('jsx', function () {
    var stream = gulp.src(['develop/scripts/index.jsx'], { read: false })
        .pipe(browserify({
            debug: !production,
            transform: ['reactify'],
            extensions: ['.jsx'],
        }))
        .on('prebundle', function (bundle) {
            libs.forEach(function (lib) {
                bundle.external(lib);
            });
        }).pipe(sourcemaps.init({ loadMaps: true }));

    if (production)
        stream.pipe(uglify());

    stream.pipe(rename('corein.js'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('wwwroot/js'));

    return stream;
});

gulp.task('update-corein', function () {
    //var json = require('develop/scripts/package.json');

    var stream = gulp.src(['develop/scripts/corein.jsx']);
    for (var i = 0; i < updateDestFolders.length; i++) {
        var dest = updateDestFolders[i] + packageCopyFolder;
        console.log(dest);
        stream.pipe(copy(dest, { prefix: 2}));
    }
    return stream;
})