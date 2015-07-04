var webpack = require('webpack')
var path = require('path')

module.exports = {
	entry:{
		index: './src/index.js'
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: "[name].js",
		publicPath: 'dist/'
	},
	module: {
		loaders: [
			{
				test: /\.css$/,
				loader: "style!css?module&importLoaders=1&localIdentName=[path][name]_[local]_[hash:base64:5]"
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel?optional[]=runtime&stage=0'
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "url-loader?limit=10000&minetype=application/font-woff"
			},
			{
				test: /\.(ttf|eot|svg|png|json)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: "file-loader"
			}
		]
	},
	resolve: {
		modulesDirectories: ['node_modules', 'components'],
		extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': '"development"'
			}
		})
	],
	postcss: [
		require('postcss-nested')
	]
}