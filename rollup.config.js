export default {
	entry: 'dist/out-tsc/inline-src/index.js',
	dest: 'dist/bundles/angular-image-picker.umd.js',
	sourceMap: false,
	format: 'umd',
	moduleName: 'ng.angular-image-picker',
	globals: {
		'@angular/animations': 'ng.animations',
		'@angular/common': 'ng.common',
		'@angular/core': 'ng.core',
		'@angular/cdk': 'ng.cdk',
		'@angular/forms': 'ng.forms',
		'@angular/http': 'ng.http',
		'@angular/material': 'ng.material',
		'@angular/platform-browser': 'ng.platform-browser',
		'@angular/platform-browser/animations': 'ng.platform-browser-animations',
		'hammerjs': 'hammerjs',
		'rxjs/Observable': 'Rx',
		'rxjs/ReplaySubject': 'Rx',
		'rxjs/add/operator/map': 'Rx.Observable.prototype',
		'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
		'rxjs/add/observable/fromEvent': 'Rx.Observable',
		'rxjs/add/observable/of': 'Rx.Observable'
	},
	external: [
		'@angular/animations',
		'@angular/common',
		'@angular/core',
		'@angular/cdk',
		'@angular/forms',
		'@angular/http',
		'@angular/material',
		'@angular/platform-browser',
		'@angular/platform-browser/animations',
		'hammerjs',
		'rxjs',
		'zone.js'
	]
}
