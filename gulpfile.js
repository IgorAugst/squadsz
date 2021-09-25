const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const dartSass = require('dart-sass');

const sass = gulpSass(dartSass);

gulp.task('sass', () => gulp
  .src([
    'node_modules/bootstrap/scss/*.scss',
    'src/views/**/**/**.scss',
    'src/views/custom.scss',
  ])
  .pipe(sass())
  .pipe(gulp.dest('public/styles')));

gulp.task(
  'watch',
  gulp.series(() => {
    gulp.watch(
      [
        'node_modules/bootstrap/scss/*.scss',
        'src/views/**/**/**.scss',
        'src/views/custom.scss',
      ],
      gulp.parallel(['sass']),
    );
  }),
);

gulp.task('default', gulp.series(['sass', 'watch']));
