// config-overrides.js
const webpack = require('webpack');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Add the fallbacks for missing modules
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve("crypto-browserify"),
        http: require.resolve("stream-http"),
        https: require.resolve("https-browserify"),
        zlib: require.resolve("browserify-zlib"),
        stream: require.resolve("stream-browserify"),
        buffer: require.resolve("buffer/")
      };
      console.log(config.plugins);
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
      ]);
    }
    return config;
  },
  devtool: 'source-map',
};
