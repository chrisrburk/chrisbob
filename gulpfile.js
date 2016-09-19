var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');
var autoprefixer = require('gulp-autoprefixer');


//Sass complie function
gulp.task('sass', function(){
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Converts Sass to CSS with gulp-sass
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

//Load src into live browser
gulp.task('load-browser', function() {
  browserSync.init({
    server: {
      baseDir: 'parallax'
    },
  })
})

//Concat/minify all files into on master file in dist
gulp.task('useref', function(){
  return gulp.src('src/*.html')
    .pipe(useref())
    // Minifies only if it's a JavaScript file
    .pipe(gulpIf('*.js', uglify()))
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

//Optimize images
gulp.task('images', function(){
  return gulp.src('src/images/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});

//Clear the cache
gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
})

//Move fonts from dev to dist
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
})

//Clean dist folder
gulp.task('clean:dist', function() {
  return del.sync('dist');
})

//Main watch function which complies sass and launches a browser
gulp.task('watch', ['load-browser','sass'], function(){
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // Reloads the browser whenever HTML or JS files change
  gulp.watch('src/*.html', browserSync.reload);
  gulp.watch('src/js/**/*.js', browserSync.reload);
})

gulp.task('default', function (callback) {
  runSequence(['sass','load-browser', 'watch'],
    callback
  )
})

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'useref', 'images', 'fonts'],
    callback
  )
})
