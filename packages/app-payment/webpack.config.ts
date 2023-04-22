import { resolve } from 'path';
import type { Configuration } from 'webpack';

const config: Configuration = {
  entry: resolve(__dirname, 'main.ts'),
  output: {
    path: resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        type: 'asset/resource',
      },
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          configFile: resolve(__dirname, '.babelrc.json'),
        },
      },
    ],
  },
};

export default config;
