//Gruntfile
module.exports = function(grunt) {

  //Initializing the configuration object
  grunt.initConfig({
    sass: {
      development: {
        files: {
          './w/w.css': './sass/main.scss'
        }
      }
    },
    concat: {
      options: {
        separator: ';\n',
      },
      dist: {
        src: [
          './bower_components/jquery/dist/jquery.min.js',
          './bower_components/bootstrap/dist/js/bootstrap.min.js',
          './bower_components/flexslider/jquery.flexslider-min.js',
          './bower_components/angular/angular.min.js',
          './bower_components/angular-sanitize/angular-sanitize.min.js',
          './bower_components/angular-animate/angular-animate.min.js',
          './bower_components/angular-bootstrap/ui-bootstrap.min.js',
          './bower_components/ui-router/release/angular-ui-router.min.js',
          './bower_components/angular-flexslider/angular-flexslider.js',
          './js/app.js',
          './js/controllers.js',
          './js/templateservice.js',
          './js/navigation.js'
        ],
        dest: './w/w.js',
      }
    },
    uglify: {
      options: {
        mangle: false // Use if you want the names of your functions and variables unchanged
      },
      frontend: {
        files: {
          './w/w.min.js': ['./w/w.js']
        }
      }
    },
    watch: {
      styles: {
        files: ['sass/*.scss'], // which files to watch
        tasks: ['sass'],
        options: {
          nospawn: true
        }
      },
      js: {
        files: ['js/*.js'], // which files to watch
        tasks: ['concat'],
        options: {
          nospawn: true
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['watch']);
};
