import babelPlugin from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

const babel = {
  ...require("./build/babel"),
  exclude: "node_modules/**",
};

const external = [
  "react",
];

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/index.esm.js",
        sourcemap: true,
        format: "esm",
      },
      {
        file: "dist/index.js",
        sourcemap: true,
        format: "cjs",
      },
    ],
    plugins: [
      nodeResolve({ preferBuiltins: true }),
      babelPlugin({
        ...babel,
        babelHelpers: "bundled",
      }),
      commonjs(),
    ],
    external,
  },
  {
    input: "src/browser.js",
    output: [
      {
        file: "dist/browser.esm.js",
        sourcemap: true,
        format: "esm",
      },
    ],
    plugins: [
      nodeResolve({
        preferBuiltins: false,
        mainFields: ["browser", "module", "main"],
      }),
      babelPlugin({
        ...babel,
        babelHelpers: "bundled",
      }),
      commonjs(),
    ],
    external,
  },
];