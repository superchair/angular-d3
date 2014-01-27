'use strict';

module.exports = function(grunt) {

    var config = {
        paths: {
            src: 'src',
            test: 'test',
            deploy: 'deploy',
            reports: 'reports'
        },
        ports: {
            watch: 35729,
            livereload: 9000
        },
        less: {
            'src/css/main.css': 'src/less/main.less'
        }
    };

    // load all grunt tasks for use
    require('load-grunt-tasks')(grunt);

    // task configurations
    grunt.initConfig({

        // load config parameters
        config: config,

        // watch config parameters
        watch: {
            livereload: {
                options: {
                    livereload: config.ports.watch
                },
                files: [
                    '<%= config.paths.src %>/**/*.html',
                    '<%= config.paths.src %>/**/*.less',
                    '<%= config.paths.src %>/**/*.css',
                    '<%= config.paths.src %>/js/**/*.js',
                    '<%= config.paths.src %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.paths.test %>/**/*.js'
                ],
                tasks: [
                    'less:dev',
                    'jshint:dev',
                    'karma:dev:run'
                ]
            }
        }, // watch config parameters

        // connect config parameters
        connect: {
            livereload: {
                options: {
                    port: config.ports.livereload,
                    hostname: '0.0.0.0',
                    base: '<%= config.paths.src %>',
                    middleware: function(connect, options) {
                        return [
                            require('connect-livereload')({
                                port: config.ports.watch
                            }),
                            connect.static(options.base)
                        ]
                    }
                }
            }
        }, // connect config parameters

        // open config parameters
        open: {
            // opens the live reload url
            livereload: {
                url: 'http://localhost:<%= connect.livereload.options.port %>'
            }
        }, // open config parameters

        // jshint config parameters
        jshint: {
            // for development environment, report to stdio only
            dev: {
                options: {
                    jshintrc: '.jshintrc',
                    ignores: [
                        '<%= config.paths.src %>/lib/**/*.js',
                        '<%= config.paths.test %>/lib/**/*.js'
                    ]
                },
                src: [
                    '<%= config.paths.src %>/**/*.js',
                    '<%= config.paths.test %>/**/*.js'
                ]
            },
            
            // for CI environment, creates checkstyle report
            ci: {
                options: {
                    jshintrc: '.jshintrc',
                    ignores: [
                        '<%= config.paths.src %>/lib/**/*.js',
                        '<%= config.paths.test %>/lib/**/*.js'
                    ],
                    reporter: 'checkstyle',
                    reporterOutput: '<%= config.paths.reports %>/checkstyle.xml',
                    force: true
                },
                src: [
                    '<%= config.paths.src %>/**/*.js',
                    '<%= config.paths.test %>/**/*.js'
                ]
            },

            singlerun: {
                options: {
                    jshintrc: '.jshintrc',
                    ignores: [
                        '<%= config.paths.src %>/lib/**/*.js',
                        '<%= config.paths.test %>/lib/**/*.js'
                    ]
                },
                src: [
                    '<%= config.paths.src %>/**/*.js',
                    '<%= config.paths.test %>/**/*.js'
                ]
            }
        }, // jshint config parameters

        // karma config parameters
        karma: {
            // for development environment, report to stdio only
            dev: {
                configFile: 'karma.conf.js',
                browsers: ['Chrome'],
                singleRun: false,
                background: true
            },

            // for CI environment, creates junit coverage report
            ci: {
                configFile: 'karma.conf.js',
                colors: false,
                browsers: ['Firefox', 'Chrome'],
                reporters: ['junit', 'progress', 'coverage'],
                junitReporter: {
                    outputFile: '<%= config.paths.reports %>/test-results.xml'
                },
                preprocessors: {
                    'src/js/**/*.js': 'coverage',
                },
                coverageReporter: {
                    type: 'cobertura',
                    dir: '<%= config.paths.reports %>/coverage/'
                }
            },

            singlerun: {
                configFile: 'karma.conf.js',
                browsers: ['Chrome'],
                reporters: ['coverage'],
                preprocessors: {
                    'src/js/**/*.js': 'coverage',
                },
                coverageReporter: {
                    type: 'text',
                    dir: '<%= config.paths.reports %>/coverage/'
                }
            }

        }, // karma config parameters

        // uglify config parameters
        uglify: {
            deploy: {
                options: {

                },
                files: {
                    '<%= config.paths.deploy %>/js/angular-tv.min.js': [
                        '<%= config.paths.src %>/js/**/*.js'
                    ]
                }
            }
        }, // uglify config parameters

        // less config parameters
        less: {
            dev: {
                options: {
                    paths: [
                        'src/less'
                    ]
                },
                files: config.less
            },
            ci: {
                options: {
                    paths: [
                        'src/less'
                    ],
                    cleancss: true
                },
                files: config.less
            }
        } // less config parameters
    });

    // grunt target definitions

    // prepare and run development environment
    grunt.registerTask('devenv', function() {
        grunt.task.run([
            'connect:livereload',
            'karma:dev', // start the server
            'open:livereload',
            'watch:livereload'
        ]);
    });

    // run CI test suite
    grunt.registerTask('ci', function() {
        grunt.task.run([
            'less:ci',
            'jshint:ci',
            'karma:ci'
        ]);
    });

    // one time test run
    grunt.registerTask('test', function() {
        grunt.task.run([
            'jshint:singlerun',
            'karma:singlerun'
        ]);
    });

    // build deployment
    grunt.registerTask('build', function() {
        grunt.task.run([
            'uglify:deploy'
        ]);
    });
};
