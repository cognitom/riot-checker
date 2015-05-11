var gulp        = require('gulp')
var streamify   = require('gulp-streamify')
var uglify      = require('gulp-uglify')
var sourcemaps  = require('gulp-sourcemaps')
var browserify  = require('browserify')
var riotify     = require('riotify')
var source      = require('vinyl-source-stream')
var buffer      = require('vinyl-buffer')
var path        = require('path')
var browserSync = require('browser-sync')
var reload      = browserSync.reload

var $ = {
  dist:       './',
  app:        './src/app.js',
  components: './src/components/*.html',
  watch:      ['*.html', '*.js', '*.css']
}

gulp.task('default', ['browserify', 'watch'])

gulp.task('browserify', function() {
  browserify({ entries: [$.app], debug: true })
    .transform(riotify, { ext: 'html' })
    .bundle()
    .pipe(source(path.basename($.app)))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    //.pipe(streamify(uglify()))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest($.dist))
})

gulp.task('watch', function() {
  var o = { debounceDelay: 3000 }
  browserSync.init({
    notify: false,
    server: { baseDir: './' }
  })
  gulp.watch([$.app, $.components], o, ['browserify'])
  gulp.watch($.watch, o, reload)
})
