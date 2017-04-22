require('shelljs/global');
const gulp = require('gulp4');
const devServer = require('gulp-develop-server');
const notifier = require('node-notifier');

const notify = msg => {
	notifier.notify({
		title: 'Web-Dojo Server',
		message: msg
	});
};

gulp.task('clean', done => {
	rm('-rf', 'dist');
	done();
});

gulp.task('copy', () => {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', done => {
	devServer.listen({ path: './dist/index.js' }, err => {
		if (err) { console.error(err); }
		done();
	});
});

gulp.task('restart', done => {
	devServer.restart(err => {
		if (err) { console.error(err); }
		done();
	});
});

gulp.task('watch', done => {
	let watcher = gulp.watch([
		'./src/**/*',
		'!./src/database/**/*'
	]);
	watcher.on('all', gulp.series('copy', 'restart', () => notify('Restart server succeed.')));
	done();
});

gulp.task('default', gulp.series('clean', 'copy', 'serve', 'watch'));
