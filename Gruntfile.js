/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Project directories
    dir: {
      dist: 'dist'
    },
    // Task configuration.
    clean: {
      dist: ['<%= dir.dist %>/*']
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'app/scripts/{,*/}*.js'
      ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        devel: true,
        jquery: true,
        globals: {}
      }
    },
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true
      }
    },
    uglify: {
      options: {
        mangle: false,
        banner: '/* \n<%= pkg.description %> \nv<%= pkg.version %> \nDavid Shaevel \n*/ \n'
      },
      my_target: {
        files: {
          '<%= dir.dist %>/chatMessage.min.js': ['app/scripts/chatMessage.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['clean:dist', 'jshint', 'karma', 'uglify']);

};
