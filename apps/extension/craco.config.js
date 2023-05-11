module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve.fallback = {
        crypto: false,
        os: false,
        tty: false,
        util: false,
      };

      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        "perf_hooks": false,
      };

      return webpackConfig;
    },
  },
};
