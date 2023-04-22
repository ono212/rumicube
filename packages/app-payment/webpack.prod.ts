import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import packageJson from './package.json';
import commonConfig from './webpack.config';

const { WEBPACK_PUBLIC_PATH } = process.env;

export const createVersionSpecificFileName = (fileName: string) => {
  const { version } = packageJson;
  const appId = packageJson.name.replace(/^@grepp\//, '');
  const [head, ...rest] = fileName.split('.');

  return [head, appId, 'v'.concat(version), ...rest].join('.');
};

export const productionConfig: Configuration = {
  mode: 'production',
  output: {
    clean: true,
    filename: '[contenthash].js',
    path: resolve(__dirname, 'dist'),
    publicPath: WEBPACK_PUBLIC_PATH || '/',
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                  modules: true,
                },
              },
              'sass-loader',
            ],
          },
          {
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 1,
                },
              },
              'sass-loader',
            ],
          },
        ],
      },
    ],
  },
  devtool: 'hidden-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: resolve(__dirname, 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[contenthash].css',
    }),
  ],
};

export default merge(commonConfig, productionConfig);
