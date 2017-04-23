const gulp = require('gulp4');
const concat = require('gulp-concat');

gulp.task('assets.css', () => {
  return gulp.src([
    'node_modules/font-awesome/css/font-awesome.min.css',
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
  ]).pipe(concat('assets.css', { newLine: '\n\n' }))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('assets.js', () => {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/bootstrap/dist/js/bootstrap.min.js',
    'static/layer/layer.js',
    'static/emmet/emmet.js',
    'static/js-beautify/beautify.js',
    'static/js-beautify/beautify-css.js',
    'static/js-beautify/beautify-html.js',
    'static/js-beautify/unpackers/p_a_c_k_e_r_unpacker.js',
    'static/js-beautify/unpackers/urlencode_unpacker.js',
    'static/js-beautify/unpackers/myobfuscate_unpacker.js',
    'static/js-beautify/unpackers/javascriptobfuscator_unpacker.js',
  ]).pipe(concat('assets.js', { newLine: ';\n' }))
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('assets.fonts', () => {
  return gulp.src([
    'node_modules/bootstrap/fonts/*.*',
    'node_modules/font-awesome/fonts/*.*'
  ])
    .pipe(gulp.dest('dist/assets/fonts'));
});

gulp.task('assets.static', done => {
  gulp.src('static/layer/skin/**/*').pipe(gulp.dest('dist/assets/js/skin'));
  gulp.src('static/ace/**/*').pipe(gulp.dest('dist/assets/ace'));
  done();
});

gulp.task('assets', gulp.parallel('assets.css', 'assets.js', 'assets.fonts', 'assets.static'));
