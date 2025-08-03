module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@controllers': './src/controllers',
          '@routes': './src/routes',
          '@services': './src/services',
          '@errors': './src/errors',
          '@providers': './src/providers',
          '@config': './src/config',
          '@middlewares': './src/middlewares',
          '@schemas': './src/schemas',
        },
      },
    ],
    'babel-plugin-transform-typescript-metadata',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
};
