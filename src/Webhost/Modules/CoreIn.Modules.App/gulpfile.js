var gulp = require("gulp");
var copy = require('gulp-copy');

var packageCopyFolder = 'node_modules/corein';
var updateDestFolders = [
    '../../',
    '../CoreIn.Modules.Register/',
    '../CoreIn.Modules.Login/',
    '../CoreIn.Modules.FileManager/',
    '../CoreIn.Modules.TaxonomyUI/'
]

gulp.task('default', ['watch'], function () {
});

gulp.task('watch', function () {
    return gulp.watch(['develop/scripts/components/index.js', 'develop/scripts/components/*.*'], ['update-corein']);
})

gulp.task('update-corein', function () {
    //var json = require('develop/scripts/package.json');

    var stream = gulp.src(['develop/scripts/**/*.*']);
    for (var i = 0; i < updateDestFolders.length; i++) {
        var dest = updateDestFolders[i] + packageCopyFolder;
        console.log(dest);
        stream.pipe(copy(dest, { prefix: 2}));
    }
    return stream;
})