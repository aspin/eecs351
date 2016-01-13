var gulp = require('gulp'),
    browserSync = require('browser-sync');

gulp.task('browser-sync-book', function() {
  browserSync.init(['book_code/**/*'], {
    server: {
      baseDir: 'book_code'
    },
    port: 3000
  });

  gulp.watch(['book_code/**/*']).on('change', browserSync.reload);
});

gulp.task('up', ['browser-sync-book']);
