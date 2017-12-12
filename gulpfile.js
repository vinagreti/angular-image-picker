var gulp = require('gulp');
var inlineResources = require('@bsj/angular-inline-resources');

/** Inlines resources (html, css) into the JS output (for either ESM or CJS output). */
gulp.task('js:inline-resources', () => inlineResources('./src/app/angular-image-picker/**/*'));
