// process.env.CHROME_BIN = require('puppeteer').executablePath();
const { version, name } = require('./package.json');
const { camelize } = require('toxic-utils');

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [ 'mocha' ],

    // list of files / patterns to load in the browser
    files: [
      'tests/**/*.js',
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'tests/**/*.js': [ 'rollup' ],
      'lib/esnext/**/*.js': [ 'coverage' ],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: [ 'mocha', 'coverage-istanbul', 'progress', 'coverage', 'coveralls' ],

    coverageIstanbulReporter: {
      reports: [ 'lcov', 'text-summary' ],
    },

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/',
    },

    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-babel')({
          presets: [
            [ '@babel/env', {
              modules: false,
              targets: {
                browsers: [ 'last 2 versions', 'not ie <= 8' ],
              },
            }],
          ],
          exclude: 'node_modules/**',
          plugins: [
            [ '@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-class-properties',
            'lodash',
            '@babel/plugin-transform-runtime',
          ],
          externalHelpers: true,
          runtimeHelpers: true,
          babelrc: false,
        }),
        require('rollup-plugin-node-resolve')({
          customResolveOptions: {
            moduleDirectory: [ 'src', 'node_modules' ],
          },
          preferBuiltins: false,
        }),
        require('rollup-plugin-commonjs')({
          namedExports: {
            // left-hand side can be an absolute path, a path
            // relative to the current directory, or the name
            // of a module in node_modules
            'node_modules/events/events.js': [ 'EventEmitter' ],
          },
        }),
        require('rollup-plugin-replace')({
          'process.env.VERSION': `'${version}'`,
          'process.env.TRAVIS': `${process.env.TRAVIS}`,
        }),
      ],
      output: {
        format: 'iife', // Helps prevent naming collisions.
        name: camelize(name), // Required for 'iife' format.
      },
      sourcemap: 'inline', // Sensible for testing.
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    // colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [ 'FirefoxHeadless' ],

    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [ '-headless' ],
      },
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
  });
};
