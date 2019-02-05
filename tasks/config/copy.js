/**
 * `tasks/config/copy`
 *
 * ---------------------------------------------------------------
 *
 * Copy files and/or folders.
 *
 * For more information, see:
 *   https://sailsjs.com/anatomy/tasks/config/copy.js
 *
 */
module.exports = function(grunt) {

  grunt.config.set('copy', {
    dev: {
      files: [{
        expand: true,
        cwd: './assets',
        src: ['**/*.!(coffee|less)'],
        dest: '.tmp/public'
      },
        {
          expand:true,
          cwd: './node_modules/@fortawesome/fontawesome-free',
          src: ['**/*'],
          dest: '.tmp/public/plugins/fontawesome'
        },
        {
          expand:true,
          cwd: './node_modules/jquery/dist',
          src: ['**/*'],
          dest: '.tmp/public/plugins/jquery'
        },
        {
          expand:true,
          cwd: './node_modules/bootstrap/dist',
          src: ['**/*'],
          dest: '.tmp/public/plugins/bootstrap'
        },
        {
          expand:true,
          cwd: './node_modules/vue/dist',
          src: ['**/*'],
          dest: '.tmp/public/plugins/vue'
        },
        {
          expand:true,
          cwd: './node_modules/vue-resource/dist',
          src: ['**/*'],
          dest: '.tmp/public/plugins/vue'
        },
        {
          expand:true,
          cwd: './node_modules/v-tooltip/dist',
          src: ['**/*'],
          dest: '.tmp/public/plugins/vue'
        },
        {
          expand:true,
          cwd: './node_modules/vue-clipboard2/dist',
          src: ['**/*'],
          dest: '.tmp/public/plugins/vue'
        },
      ]
    },
    build: {
      files: [{
        expand: true,
        cwd: '.tmp/public',
        src: ['**/*'],
        dest: 'www'
      }]
    },
    beforeLinkBuildProd: {
      files: [{
        expand: true,
        cwd: '.tmp/public/hash',
        src: ['**/*'],
        dest: '.tmp/public/dist'
      }]
    },
    fonts: {
      files: [{
          expand: true,
          cwd: './node_modules/@fortawesome/fontawesome-free/webfonts',
          src: ['**/*'],
          dest: '.tmp/public/webfonts'
        }]
    },
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // This Grunt plugin is part of the default asset pipeline in Sails,
  // so it's already been automatically loaded for you at this point.
  //
  // Of course, you can always remove this Grunt plugin altogether by
  // deleting this file.  But check this out: you can also use your
  // _own_ custom version of this Grunt plugin.
  //
  // Here's how:
  //
  // 1. Install it as a local dependency of your Sails app:
  //    ```
  //    $ npm install grunt-contrib-copy --save-dev --save-exact
  //    ```
  //
  //
  // 2. Then uncomment the following code:
  //
  // ```
  // // Load Grunt plugin from the node_modules/ folder.
  // grunt.loadNpmTasks('grunt-contrib-copy');
  // ```
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};
