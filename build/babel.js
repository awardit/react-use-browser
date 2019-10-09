/* @flow */

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        loose: true,
        shippedProposals: true,
        targets: {
          node: "current",
          ie: 11,
          firefox: 50,
          chrome: 50,
        },
        exclude: [
          "transform-typeof-symbol",
        ],
      },
    ],
  ],
  plugins: [
    "@babel/plugin-syntax-flow",
    "@babel/plugin-transform-flow-strip-types",
  ],
};
