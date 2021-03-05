// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/plugin-proposal-class-properties']
};
module.exports = function(api) {
  const presets = ['@babel/preset-env', '@babel/preset-react'];
  const plugins = ['@babel/plugin-proposal-class-properties'];

  /** this is just for minimal working purposes,
   * for testing larger applications it is
   * advisable to cache the transpiled modules in
   * node_modules/.bin/.cache/@babel/register* */
  api.cache(false);

  return {
    presets,
    plugins
  };
};
