'use strict';
var gulp = require('gulp'),
      concat = require('gulp-concat'),
	  rename = require('gulp-rename'),
	  uglify = require('gulp-uglify'),
	  util = require('gulp-util');

var config = {
	  js:['src/definition.js','src/iuQueryForm.js']
};

/*==============================================================
= js
==============================================================*/
gulp.task('js', function() {
  return gulp.src(config.js)
    .pipe(concat('queryForm.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});
