const path = require('path');

const apply = function (options, compiler) {
	if (options == null) {
		options = {};
	}
	var test = options.test;
	if (test == null) {
		return;
	}
	var callback = options.callback || function (filepath, source) {
		return source;
	};
	var dirname = options.dirname || path.resolve(__dirname);
	compiler.hooks.compilation.tap('ModifyAssetsPlugin', compilation => {
		compilation.hooks.processAssets.tap(
			{
				name: 'ModifyAssetsPlugin',
				stage: compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS
			},
			(assets) => {
				for (var basename in assets) {
					var filepath = path.resolve(dirname, basename);
					if (test.test(filepath)) {
						var asset = assets[basename];
						var origFn = asset.source();
						asset.source = () => callback(filepath, origFn);
						asset.size = () => asset.source().length;
					}
				}
			});
	});
};

module.exports = function (options) {
	return {
		apply: apply.bind(this, options)
	};
};
