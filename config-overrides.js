module.exports = function override(config, env) {
    config.module.defaultRules =
    [
        {
          type: "javascript/auto",
          resolve: {}
        },
        {
          test: /\.json$/i,
          type: "json"
        },
   ]

    return config;
  }