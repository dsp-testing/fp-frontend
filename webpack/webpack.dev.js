const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const commonDevAndProd = require('./webpack.common');
const { ModuleFederationPlugin } = require('webpack').container;

const ROOT_DIR = path.resolve(__dirname, '../public/client');
const PACKAGES_DIR = path.join(__dirname, '../packages');
const APP_DIR = path.resolve(PACKAGES_DIR, 'sak-app/src');

const config = {
  mode: 'development',
  devtool: 'eval-cheap-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:9000',
    'webpack/hot/only-dev-server',
    APP_DIR + '/index.ts',
  ],
  output: {
    path: ROOT_DIR,
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ModuleFederationPlugin({
      name: "fp-frontend",
      remotes: {
        fp_tilbake_frontend: `fp_tilbake_frontend@//localhost:9005/remoteEntry.js`,
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
  optimization: {
    moduleIds: 'named',
    splitChunks: {
      chunks: 'all',
    },
  },
  devServer: {
    historyApiFallback: true,
  },
};

module.exports = merge(commonDevAndProd, config);
