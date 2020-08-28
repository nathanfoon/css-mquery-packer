# CSS Media Query Packer

Simple media packer, merges same CSS media query rules into one via PostCSS

[![npm](https://img.shields.io/npm/v/css-mquery-packer)](https://www.npmjs.com/package/css-mquery-packer)
[![GitHub](https://img.shields.io/github/license/n19htz/css-mquery-packer)](https://github.com/n19htz/css-mquery-packer/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/n19htz/css-mquery-packer.svg?branch=master)](https://travis-ci.org/n19htz/css-mquery-packer)
[![Codacy Badge](https://api.codacy.com/project/badge/Coverage/2c3985601ce1436dbc26800b3642ca68)](https://www.codacy.com/manual/n19htz/css-mquery-packer?utm_source=github.com&utm_medium=referral&utm_content=n19htz/css-mquery-packer&utm_campaign=Badge_Coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/2c3985601ce1436dbc26800b3642ca68)](https://www.codacy.com/manual/n19htz/css-mquery-packer?utm_source=github.com&utm_medium=referral&utm_content=n19htz/css-mquery-packer&utm_campaign=Badge_Grade)
[![Depfu](https://img.shields.io/depfu/n19htz/css-mquery-packer)](https://depfu.com/repos/github/n19htz/css-mquery-packer)

## ABOUT

A straight forward example of what it does for you:

### Before

```css
.btn {
  display: inline-block;
}

@media screen and (max-width: 660px) {
  .btn {
    display: block;
    width: 100%;
  }
}

.wrapper {
  max-width: 1160px;
}

@media screen and (max-width: 660px) {
  .wrapper {
    max-width: 400px;
  }
}
```

### After

```css
.btn {
  display: inline-block;
}

.wrapper {
  max-width: 1160px;
}

@media screen and (max-width: 660px) {
  .btn {
    display: block;
    width: 100%;
  }
  .wrapper {
    max-width: 400px;
  }
}
```

## INSTALL

```bash
npm install --save-dev css-mquery-packer
```

## USAGE

Usage as a PostCSS plugin:

### Gulp

`gulpfile.js`

```javascript
const gulp = require('gulp');
const scss = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');
const postssMergeRules = require('postcss-merge-rules');
const cssnano = require('cssnano');
const mqpacker = require('css-mquery-packer');

const processStyles = () => {
  const plugins = [
    mqpacker(),
    postssMergeRules(),
    cssnano({...}),
  ];

  return gulp.src('./path/to/src')
      .pipe(sourcemaps.init())
      .pipe(scss()).on('error', scss.logError)
      .pipe(postcss(plugins))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./path/to/dist'));
};
```

### Webpack

`webpack.config.js`

```javascript
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')
// ...
module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: true,
              reloadAll: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('postcss-import')(),
                require('css-mquery-packer')(),
                ...
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
//...
```

`postcss.config.js`

```javascript
module.exports = {
  plugins: {
    'css-mquery-packer': {},
    'postcss-merge-rules': {},
    cssnano: {
      preset: [
        'advanced',
        {
          normalizeWhitespace: false,
          discardUnused: false,
          mergeIdents: false,
          reduceIdents: false,
          autoprefixer: {},
        },
      ],
    },
  },
};
```

## LICENSE

[MIT](https://github.com/n19htz/css-mquery-packer/blob/master/LICENSE)
