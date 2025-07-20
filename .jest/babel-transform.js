// .jest/babel-transform.js
module.exports = require('babel-jest').createTransformer({
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
        },
      },
    ],
  ],
  babelrc: false,
  configFile: false,
});
