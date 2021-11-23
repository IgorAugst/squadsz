const gulp = require('gulp');
const gulpSass = require('gulp-sass');
const dartSass = require('dart-sass');

const sass = gulpSass(dartSass);

gulp.task('sass', () => gulp
  .src([
    'node_modules/bootstrap/scss/*.scss',
    'public/styles/scss/**/**.scss',
    'public/styles/scss/custom.scss',
  ])
  .pipe(sass())
  .pipe(gulp.dest('public/styles/css')));

gulp.task(
  'watch',
  gulp.series(() => {
    gulp.watch(
      [
        'node_modules/bootstrap/scss/*.scss',
        'public/styles/scss/**/**.scss',
        'public/styles/scss/custom.scss',
      ],
      gulp.parallel(['sass']),
    );
  }),
);

gulp.task('default', gulp.series(['sass', 'watch']));
