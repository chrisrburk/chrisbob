var gulp = require('gulp');
var sass = require('gulp-sass');


gulp.task('hello', function() {
  console.log('I\'m not your monkey :|');
});

gulp.task('sass', function(){
  return gulp.src('app/scss/**/*.scss')
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
});

gulp.task('watch', function(){
  gulp.watch('app/scss/**/*.scss', ['sass']);
  // Other watchers
})
