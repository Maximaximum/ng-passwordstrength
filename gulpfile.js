let gulp = require('gulp');
let $ = require('gulp-load-plugins')();

const outputFile = 'passwordStrength.js';
const outputFileZxcvbn = 'passwordStrengthZxcvbn.js';

gulp.task('simple', function(){
  return gulp.src([
      'src/scripts/module.js',
      'src/scripts/services/passwordStrength.js',
      'src/scripts/directives/ngPasswordStrength.js',
  ])
  .pipe($.concat(outputFile))
  .pipe(gulp.dest('dist/scripts'))
});

gulp.task('zxcvbn', function(){
  return gulp.src([
      'src/scripts/module.js',
      'src/scripts/services/passwordStrengthZxcvbn.js',
      'src/scripts/directives/ngPasswordStrength.js',
  ])
  .pipe($.concat(outputFileZxcvbn))
  .pipe(gulp.dest('dist/scripts'))
});

gulp.task('styles', function() {
    return gulp.src([
        'src/styles/directives/ngPasswordStrength.css'
    ])
    .pipe(gulp.dest('dist/styles'));
});

gulp.task('default', ['simple', 'zxcvbn', 'styles']);