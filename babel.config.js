// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
module.exports = {
  entry: ['@babel/polyfill']
};
module.exports = function(api) {
  const presets = ['@babel/preset-env', '@babel/preset-react'];
  const plugins = [
    [
      '@babel/plugin-transform-runtime',
      {
        regenerator: true
      }
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-default-from'
  ];

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
