// Configuring Grunt tasks:
// http://gruntjs.com/configuring-tasks
module.exports = function (grunt) {

    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Optimizes the images from src/images and places them inside of images
    imagemin: {
      dynamic: {
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'src/images',             // Src matches are relative to this path
          src: ['**/*.{jpg,gif}'],       // Actual patterns to match
          dest: 'images/',               // Destination path prefix
        }],
        options: {                       // Target options
          optimizationLevel: 7
        }
      }
    },

    pngmin: {
      compile: {
        options: {
          ext: '.png',
          quality: '75-85'
        },
        files: [{
          expand: true, // required option
          src: ['**/*.png', "!sprites/**/*.png", "!sprites2x/**/*.png", "!sprites3x/**/*.png"],
          cwd: 'src/images', // required option
          dest: 'images/'
        }]
      }
    },

    // Compass task: https://npmjs.org/package/grunt-contrib-compass
    compass: {
      dist: {
        options: {
          // use default Compass config
          config: 'config.rb'
        }
      },
      watch: {
        options: {
          // use default Compass config
          config: 'config.rb',
          watch: true
        }
      }
    },

    // Prefixes CSS commands
    autoprefixer: {
      options: {
        //diff: true,
        map: true,
      },
      target: {
        expand: true,
        cwd: 'src/css/',
        src: ['*.css'],
        dest: 'css/',
      },
    },

    // Combines Media Queries on Output
    combine_mq: {
      default_options: {
        expand: true,
        src: 'css/*.css',
      }
    },

     // Minifies CSS outputted by Compass
    cssmin: {
      minify: {
        expand: true,
        src: 'css/*.css',
      }
    },

    // Cleans the images and css directories
    clean: ["css/*", "images/*"],

    // Concatenates and minifies js files and movies them from src/js to js
    uglify: {
      options: {
        mangle: false, // Doesn't modify the variable names
      },
      my_target: {
        files: {
          'js/script.js': ['src/js/*.js']
        }
      }
    },

    pixrem: {
      options: {
        rootvalue: '16px',
        replace: true
      },
      dist: {
        src: 'css/styles-ie.css',
        dest: 'css/styles-ie.css'
      }
    },

    stripmq: {
      //Viewport options
      options: {
        width: 1000,
        type: 'screen'
      },
      all: {
        files: {
          //follows the pattern 'destination': ['source']
          'css/styles-ie.css': ['src/css/styles.css']
        }
      }
    },

    // Watch task: https://npmjs.org/package/grunt-contrib-watch
    watch: {
      images: {
        files: ['src/images/*.{png,jpg,gif}'],
        tasks: ['imagemin', 'pngmin'],
      },
      js: {
        files: ['src/js/*.js'],
        tasks: ['uglify'],
      },
       css: {
         files: ['src/css/**/*.css'],
         tasks: ['autoprefixer'],

       },
      // LiveReload whenever specified files change,
      // using browser extension: http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
      livereload: {
        files: [
          'css/**/*.css',
          'js/*.js',
          'images/{,**/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: 35729,
        },
      },
    },

    concurrent: {
      options: {
        logConcurrentOutput: true
      },
      watch: ['watch','compass:watch']
    }
  });

  // Load the plugin(s)
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-combine-mq');
  grunt.loadNpmTasks('grunt-stripmq');
  grunt.loadNpmTasks('grunt-pixrem');
  grunt.loadNpmTasks('grunt-pngmin');

  // Set base to main theme
  grunt.file.setBase('sites/all/themes/main/'),

  // Default task(s).
  grunt.registerTask('default', ['concurrent:watch']);
  grunt.registerTask('build', ['clean', 'compass:dist', 'imagemin', 'pngmin', 'autoprefixer', 'combine_mq', 'stripmq', 'pixrem', 'cssmin', 'uglify']);
};
