var env = (process.env.ENV || 'local').toLowerCase();

var src = './ceraon/static/src/';
var dest = './ceraon/static/dest/';

module.exports = {
  env: {
    name: env
  },
  src: src,
  dest: dest,


  browserify: {
    src: src + 'js/app.js',
    dest: dest,
    debug: (env !== 'production'),
    destName: 'app.js',
    inputName: 'app.js'
  },


  sass: {
    src: src + 'sass/app.sass',
    dest: dest,
    settings: {
      includePaths: [
        src + 'sass/',
        './node_modules',
        './node_modules/semantic-ui/dist'
      ]
    }
  },
};
