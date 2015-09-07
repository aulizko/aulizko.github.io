var postcss = require('gulp-postcss');
var gulp = require('gulp');
var cssnext = require('cssnext');
var precss = require('precss');
var rucksack = require('rucksack-css');
var cssnano = require('cssnano');

var processors = [
	cssnext,
	precss,
	rucksack,
	cssnano
];

gulp.task('css', function () {
    return gulp.src('./postcss/main.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./css'));
});