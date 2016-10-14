'use strict';


/* jshint node: true */
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

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
                    'node_modules/jquery.1/node_modules/jquery/dist/jquery.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'src/<%= pkg.name %>.js',
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            },
            gsc: {
                nonull: true,
                src: [
                    'src/<%= pkg.name %>.js',
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        babel: {
            options: {
                sourceMap: true,
                presets: ['es2015']
            },
            dist: {
                files: {
                    'dist/gsc.babel.js': 'dist/gsc.js'
                }
            }
        },
        jsdoc: {
            dist: {
                src: [
                    'DOC.md',
                    'dist/<%= pkg.name %>.js'
                ],
                options: {
                    destination: 'doc',
                    template: 'node_modules/ink-docstrap/template',
                    configure: 'node_modules/ink-docstrap/template/jsdoc.conf.json'
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
                src: 'dist/gsc.babel.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            dev: ['src/**/*.js'],
            gruntfile: ['Gruntfile.js']
        },
        jscs: {
            src: 'src/**/*.js',
            options: {
                preset: 'google.json',
                config: '.jscsrc',
                // If you use ES6 http://jscs.info/overview.html#esnext
                esnext: true,
                verbose: true,
                fix: true,
                requireCurlyBraces: ["if"]
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
                dest: "dist/gsc.css"
            },
            gsc: {
                src: [
                    'css/*.css'
                ],
                dest: "dist/gsc.css"
            }
        },
        cssmin: {
            target: {
                files: [{
                        expand: true,
                        src: ['dist/gsc.css'],
                        dest: '',
                        ext: '.min.css'
                    }]
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.all %>',
                tasks: ['jshint:all']
            },
            default: {
                files: '<%= jshint.all %>',
                tasks: ['default-gsc-without-jscs']
            },
            develop: {
                files: '<%= jshint.all %>',
                tasks: ['default-gsc-without-jscs']
            },
            docs: {
                files: '<%= jshint.all %>',
                tasks: ['update-docs']
            }
        },
        jasmine: {
            customTemplate: {
                src: 'test/**/*.test.js',
                options: {
                    vendor: [
                        'node_modules/jquery/dist/jquery.js',
                        'node_modules/openlayers/dist/ol.js',
                        "dist/gsc.min.js"
                    ]
                }
            }
        }
    });

    // Load plugins
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jscs');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task.
    grunt.registerTask('default', ['jshint', 'jscs', 'build-js', 'build-css', 'update-docs']);
    grunt.registerTask('babeling', ['babel']);
    grunt.registerTask('build-js', ['concat', 'babel', 'uglify']);
    grunt.registerTask('build-css', ['concat_css', 'cssmin']);
    grunt.registerTask('update-docs', ['concat', 'jsdoc']);

    // Default task - only GSC custom code.
    grunt.registerTask('default-gsc', ['jshint', 'jscs', 'build-js-gsc', 'build-css-gsc']);
    grunt.registerTask('default-gsc-without-jscs', ['jshint', 'build-js-gsc', 'build-css-gsc']);
    grunt.registerTask('default-gsc-with-docs', [
        'jshint', 'jscs', 'build-js-gsc', 'build-css-gsc', 'update-docs-gsc']);
    grunt.registerTask('update-docs-gsc', ['concat:gsc', 'jsdoc']);
    grunt.registerTask('build-js-gsc', ['concat:gsc', 'uglify']);
    grunt.registerTask('build-css-gsc', ['concat_css:gsc', 'cssmin']);
    grunt.registerTask('update-docs-gsc', ['concat:gsc', 'jsdoc']);
    grunt.registerTask('build', ['jshint', 'jscs', 'build-js-gsc', 'build-css-gsc']);
    grunt.registerTask('docs', ['concat:gsc', 'jsdoc']);
    grunt.registerTask('deploy', ['default-gsc-with-docs']);

};
