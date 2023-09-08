module.exports = function override(config, env) {
  //do stuff with the webpack config...
  let new_config = { ...config, devServer: { historyApiFallback: true } };
  new_config.output.publicPath = "/";
  return new_config;
};
