/* jshint node: true */
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %>' +
                '<%= pkg.author.name %>; Licensed ' +
                ' <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                nonull: true,
                src: [
                    'node_modules/openlayers/dist/ol.js',
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'src/<%= pkg.name %>.js',
                    'src/*/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
        },
        jsdoc: {
            dist: {
                src: [
                    'DOC.md',
                    'dist/*.js'
                ],
                options: {
                    destination: 'doc'
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                preserveComments: false,
                mangle: {
                    except: ['jQuery']
                }
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            },
        },
        nodeunit: {
            files: ['test/**/*_test.js']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            dev: ['src/**/*.js'],
        },
        jscs: {

		    src: 'src/**/*.js',
		    options: {
				preset: 'google.json',
		        config: '.jscsrc',
		        // If you use ES6 http://jscs.info/overview.html#esnext
		        esnext: true,
		        // If you need output with rule names
		        // http://jscs.info/overview.html#verbose
		        verbose: true,
		        // Autofix code style violations when possible.
		        fix: true,
		        requireCurlyBraces: [ "if" ]
		    }
		},
        concat_css: {
            options: {
                // Task-specific options go here.
            },
            all: {
                src: [
                    'node_modules/openlayers/css/ol.css',
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                    'node_modules/bootstrap/dist/css/bootstrap-theme.css',
                    'css/*.css'
                     ],
                dest: "dist/styles.css"
            },
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    src: ['dist/styles.css'],
                    dest: '',
                    ext: '.min.css'
                }]
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:src', 'nodeunit']
            }
        },
    });
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');



    // Default task.
    grunt.registerTask('default',
        ['jshint', 'jscs', 'build-js', 'build-css', 'update-docs']);

    grunt.registerTask('build-js', ['concat', 'uglify']);
    grunt.registerTask('build-css', ['concat_css', 'cssmin']);
    grunt.registerTask('update-docs', ['concat', 'jsdoc']);
};