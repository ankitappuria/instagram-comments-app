const Critters = require('critters-webpack-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new Critters({
          preload: 'swap', // async load CSS
          pruneSource: true, // remove inlined CSS from main.css
          compress: true
        })
      ]
    }
  }
};