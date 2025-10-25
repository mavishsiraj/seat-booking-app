const path = require('path');
<<<<<<< HEAD
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    publicPath: '/'
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    proxy: [{
      context: ['/bus', '/admin', '/user', '/booking'],
      target: 'http://localhost:3001',
      changeOrigin: true
    }]
=======

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
>>>>>>> 946f0036a4f09f279ede8bb6faa27cbda6336eee
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
<<<<<<< HEAD
        use: 'babel-loader'
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
=======
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
>>>>>>> 946f0036a4f09f279ede8bb6faa27cbda6336eee
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
<<<<<<< HEAD
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html'
    })
  ],
  mode: 'development',
  cache: false
};
=======
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
  }
};
>>>>>>> 946f0036a4f09f279ede8bb6faa27cbda6336eee
