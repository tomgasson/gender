var gulp = require('gulp')

gulp.task('default', ['webpack','copy'])

gulp.task('copy', function(){
	return gulp.src(['src/index.html','data/**/*'])
		.pipe(gulp.dest('dist'))
})

gulp.task('watch', ['default'], function(){
	return gulp.watch(['src/**/*', 'components/**/*'], ['default'])
})

gulp.task('webpack', function(cb){
	var util = require('gulp-util')
	var webpack = require('webpack')
	var config = require('./webpack.config.js')

	webpack(config, function(err, stats){
		if (err) throw new util.PluginError('webpack', err)
		util.log('[webpack]', stats.toString({colors: true, assets:false, chunks:false}))
		cb()
	})

})