var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  fs = require('fs'),
  inject = require('gulp-inject-string'),
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

gulp.task('build', ['js', 'app', 'html']);

gulp.task('app', function() {
  var base;
  if (argv.base) {
    base = argv.base;
  } else {
    throw new Exception('needs base');
  }

  var fshader = '\'' + fs.readFileSync(base + '/shaders/fshader.esgl', 'utf8').split('\n').join('\\n') + '\'\n';
  var vshader = '\'' + fs.readFileSync(base + '/shaders/vshader.esgl', 'utf8').split('\n').join('\\n') + '\'\n';
  gulp.src(base + '/app.js')
    .pipe(inject.after('// START: Shaders', '\n/*'))
    .pipe(inject.before('// END: Shaders', '*/\n'))
    .pipe(inject.after('// FOR HTML OPEN:', '\n  callback(sources);\n'))
    .pipe(inject.after('// FOR HTML OPEN:', '  sources[VSHADER] = ' + vshader))
    .pipe(inject.after('// FOR HTML OPEN:', '  sources[FSHADER] = ' + fshader))
    .pipe(inject.after('// FOR HTML OPEN:', '\n  var sources = {};\n'))
    .pipe(gulp.dest(base + '/dist'));
});

gulp.task('js', function() {
  var base;
  if (argv.base) {
    base = argv.base;
  } else {
    throw new Exception('needs base');
  }
  gulp.src(['!' + base + '/dist/**/*', base + '/**/**.js', '!' + base + '/app.js'])
    .pipe(gulp.dest(base + '/dist'));
});

gulp.task('html', function() {
  var base;
  if (argv.base) {
    base = argv.base;
  } else {
    throw new Exception('needs base');
  }
  gulp.src(base + '/index.html')
    .pipe(gulp.dest(base + '/dist'));
});

gulp.task('up', ['browser-sync']);
