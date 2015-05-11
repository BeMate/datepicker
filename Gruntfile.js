module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dev: {
        options: {
          style: 'expanded',
          sourcemap: 'none'
        },
        files: {
          'tmp/datepicker.css': 'scss/datepicker.scss'
        }
      },

      build: {
        options: {
          style: 'compressed',
          sourcemap: 'none'
        },
        files: {
          'tmp/datepicker.css': 'scss/datepicker.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 5 versions', 'Firefox ESR', 'Opera 12.1', 'Explorer 9', 'Explorer 10']
      },
      dev: {
        src: 'tmp/datepicker.css',
        dest: 'css/datepicker.css'
      },
      build: {
        src: 'tmp/datepicker.css',
        dest: 'build/datepicker.css'
      }
    },

    clean: ['tmp/*.css'],

    uglify: {
      dates: {
        files: {
          'build/dates.min.js': ['dates.js']
        }
      },
      datepicker: {
        files: {
          'build/datepicker.min.js': ['datepicker.js']
        }
      },
      bundle: {
        files: {
          'build/bundle.min.js': ['dates.js', 'datepicker.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('help', 'Log some stuff.', function() {
    grunt.log.subhead('This grunt file contains these tasks:');
    grunt.log.writeln('- grunt: to show command help');
    grunt.log.writeln('- grunt build: build the library.');
  });

  grunt.registerTask('default', ['help']);
  grunt.registerTask('css', ['sass:dev', 'autoprefixer', 'clean']);
  grunt.registerTask('js', ['uglify']);
  grunt.registerTask('build', ['sass:build', 'autoprefixer', 'uglify', 'clean']);
}
