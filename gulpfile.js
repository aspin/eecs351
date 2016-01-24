var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  argv = require('yargs').argv;

gulp.task('browser-sync', function() {
  var base, baseGlob;
  if (argv.base) {
    base = argv.base;
  } else {
    base = 'book_code';
  }

  baseGlob = base + '/**/*';
  browserSync.init([baseGlob], {
    server: {
      baseDir: base,
      routes: {
        '/lib': 'lib/'
      }
    },
    port: 3000
  });

  gulp.watch([baseGlob]).on('change', browserSync.reload);
});

gulp.task('up', ['browser-sync']);
