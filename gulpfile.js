import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'dart-sass';

const sass = gulpSass(dartSass);

gulp.task('sass', () => {
  return gulp
    .src(['node_modules/bootstrap/scss/*.scss', 'src/views/**/**/**.scss', 'src/views/custom.scss'])
    .pipe(sass())
    .pipe(gulp.dest('public/styles'));
});

gulp.task('watch', gulp.series(function()  {
  gulp.watch(['node_modules/bootstrap/scss/*.scss', 'src/views/**/**/**.scss', 'src/views/custom.scss'], gulp.parallel(['sass']));
}));

gulp.task('default', gulp.series(['sass', 'watch']));