var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  argv = require('yargs').argv;

gulp.task('browser-sync', function() {
  var base, baseGlob, port;
  if (argv.base) {
    base = argv.base;
  } else {
    base = 'book_code';
  }

  if (argv.port) {
    port = Number(argv.port);
  } else {
    port = 3000;
  }

  baseGlob = base + '/**/*';
  browserSync.init([baseGlob], {
    server: {
      baseDir: base,
      routes: {
        '/lib': 'lib/'
      }
    },
    port: port
  });

  gulp.watch([baseGlob]).on('change', browserSync.reload);
});

gulp.task('up', ['browser-sync']);
