/**
 * <%= projectTitle  %> - v <%= projectVersion %>
 * Created on <%= creationDate %> by <%= authorName %>
 *
 * <%= projectDescription %>
 *
 */

module.exports = function(grunt) {

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Folder names and build path definitions
        buildPath: '<%= buildPath %>',
        jsFolder: '<%= jsFolder %>',
        cssFolder: '<%= cssFolder %>',
        imgFolder: '<%= imgFolder %>',
        fontsFolder: '<%= fontsFolder %>',
        <%
        if (includeBootstrap) { %>
            bootstrapAssets: 'scss/bootstrap',
                bootstrapConfig: grunt.file.readYAML('bootstrap.yaml'), <%
        }
        if (includeFontawesome) { %>
            fontawesomeAssets: 'bower_components/fontawesome/scss', <%
        } %>
        <%
        if (useGruntConnect) { %>
            // Grunt connect
            connect: {
                server: {
                    options: {
                        port: <%= gruntConnectPort %> ,
                        hostname: '*',
                        base: '<%%= buildPath %>',
                        livereload: true
                    }
                }
            }, <%
        } %>

        // Javascript and css concatenation
        concat: {
            script: {
                // Script order:
                // 1. Modernizr
                // 2. other libraries
                // 3. custom sources others then script.js
                // 4. script.js
                src: [
                    // libraries
                    'js/lib/modernizr-<%%= pkg.name %>.js', <%
                    if (includeBootstrap) { %>
                        '<%%= bootstrapConfig.components %>', <%
                    } %>
                    'js/lib/**/!(_*).js',
                    // sources
                    'js/src/!(script).js',
                    'js/src/script.js'
                ],
                dest: 'js/script.js',
                options: {
                    separator: '\n\n'
                },
            },
            // Appends stylesheets other then main.css at the bottom of style.css
            css: {
                options: {
                    'sourceMap': true
                },
                src: [
                    'css/parts/main.css',
                    'css/parts/!(main).css'
                ],
                dest: '<%%= buildPath %>/<%%= cssFolder %>/style.css'
            }
        },
        <%
        if (includeModernizr) { %>

            // Create a custom Modernizr build based on calls inside your javascripts
            modernizr: {
                dist: {
                    'devFile': 'bower_components/modernizr/modernizr.js',
                    'outputFile': 'js/lib/modernizr-<%%= pkg.name %>.js',
                    // Javascripts to search into for Modernizr calls
                    'files': {
                        'src': ['js/src/*.js']
                    }
                }
            }, <%
        } %>

        // Once concatenated, create a minified version of your javascript
        uglify: {
            build: {
                options: {
                    sourceMap: true,
                },
                files: [{
                    expand: true,
                    cwd: 'js',
                    src: '*.js',
                    dest: '<%%= buildPath %>/<%%= jsFolder %>',
                    ext: '.min.js'
                }]
            }
        },
        <%
        if (useJshint) { %>

            jshint: {
                options: {
                    jshintrc: true,
                },
                sources: ['js/src/**/*.js'],
                grunt: ['Gruntfile.js']
            }, <%
        } %>

        // Optimize .svg files
        // Original images must be placed in src folder
        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false, // required by IE
                    removeUselessStrokeAndFill: true,
                    removeEmptyAttrs: true
                }]
            },
            // Build folder
            build: {
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: '**/*.svg',
                    dest: '<%%= buildPath %>/<%%= imgFolder %>/',
                    ext: '.svg'
                }]
            }
        },

        // Once optimized .svg, create fallback .png versions
        svg2png: {
            all: {
                files: [{
                    src: ['img/**/*.svg']
                }]
            }
        },

        // Compress .jpg, .png and .gif images
        // Original images must be placed in 'src' folder
        imagemin: {
            options: {
                cache: false
            },
            // Build folder
            build: {
                files: [{
                    expand: true,
                    cwd: 'img',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%%= buildPath %>/<%%= imgFolder %>/'
                }]
            }
        },

        // Use SASS to compile frameworks separately.
        // It's up to you to decide if keep them apart or merge with your css.
        // Remember IE css selector limits!
        // http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx
        sass: {
            // Build folder
            build: {
                options: {
                    style: 'compressed',
                    bundleExec: true
                },
                files: { <%
                    if (includeBootstrap) { %> '<%%= buildPath %>/<%%= cssFolder %>/bootstrap.css': '<%%= bootstrapAssets %>/bootstrap.scss', <%
                    }
                    if (includeFontawesome) { %> '<%%= buildPath %>/<%%= cssFolder %>/font-awesome.css': '<%%= fontawesomeAssets %>/font-awesome.scss' <%
                    } %>
                }
            }
        },

        // Use Compass to compile your stylesheets and place them in css staging folder so they can be concatenated later.
        compass: {
            dev: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'css/parts',
                    specify: ['scss/*.scss'],
                    config: 'config.rb',
                    bundleExec: true
                }
            }
        },
        <%
        if (useAutoprefixer) { %>

            // autoprefixer
            autoprefixer: {
                build: {
                    options: {
                        map: true
                    },
                    files: [{
                        expand: true,
                        cwd: 'css/parts',
                        src: '**/*.css',
                        dest: 'css/parts'
                }]
                }
            }, <%
        } %>

        // Haml
        haml: {
            dev: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'index.html': [
                        'haml/index.haml'
                    ]
                }
            }
        },

        // Trigger tasks on save
        watch: {
            // when a source or a lib change in js folder, merge them together, then minify the concatenated file.
            // If no errors, notify success.
            scripts: {
                files: ['js/!(script).js', 'js/src/*.js', 'js/lib/**/*.js'],
                tasks: [ <%
                    if (includeModernizr) { %> 'modernizr', <%
                    } %> 'concat:script', <%
                    if (useJshint) { %> 'jshint:sources', <%
                    } %> 'uglify', 'notify:script'],
                options: {
                    livereload: true,
                    spawn: false
                }
            },
            // when anything change in scss folder, compile evrerything in css staging folder then concatenate.
            // If no errors, notify success.
            scss: {
                files: ['scss/**/*.scss', 'css/parts/*.css', '<%%= bootstrapAssets %>/*.scss'],
                tasks: ['newer:sass', 'compass', <%
                    if (useAutoprefixer) { %> 'autoprefixer', <%
                    } %> 'concat:css', 'notify:css'],
            },
            css: {
                files: ['<%%= buildPath %>/<%%= cssFolder %>/*.css'],
                options: {
                    livereload: true
                }
            },
            <%
            if (useHaml) { %>
                // when anything change in haml folder, compile.
                // If no errors, notify success.
                haml: {
                    files: ['haml/**/*.haml'],
                    tasks: ['haml', 'notify:template'],
                    options: {
                        spawn: false
                    }
                }, <%
            } %>
            // when a .svg is modified, optimize it and create a .png fallback.
            // If no errors, notify success.
            svg: {
                files: ['img/**/*.svg'],
                tasks: ['newer:svgmin', 'newer:svg2png', 'notify:images'],
                options: {
                    spawn: false
                }
            },
            img: {
                files: ['img/**/*.{png,jpg,gif}'],
                tasks: ['newer:imagemin', 'notify:images'],
                options: {
                    spawn: false
                }
            },
            // reload browser when .css or template changes
            livereload: {
                options: {
                    livereload: true
                },
                files: ['<%= buildPath %>/*.{html,php,tpl,haml}']
            }
        },

        // Notification messages
        notify: {
            css: {
                options: {
                    title: 'Stylesheet processed',
                    message: 'All stylesheets have been processed, compiled and merged in /css/style.css',
                }
            },
            script: {
                options: {
                    title: 'Scripts combined',
                    message: 'All javascripts have been processed and merged in /js/script.js',
                }
            },
            images: {
                options: {
                    title: 'Task Complete',
                    message: 'All images have been optimized/compressed',
                }
            },
            template: {
                options: {
                    title: 'Templates processed',
                    message: 'All template files has been processed succesfully',
                }
            },
        },
        <%
        if (includeBootstrap || includeFontawesome) { %>
            // copy task is used during scaffolding with Yeoman.
            // Please be aware that running this task during development WILL OVERWRITE following files
            // - scss/bootstrap/bootstrap.scss
            // - scss/bootstrap/_variables.scss
            // - js/lib/twbs_js/*.js
            // - scss/fontawesome/_variables.scss

            copy: { <%
                if (includeBootstrap) { %>
                    bootstrap_css: {
                            expand: true,
                            flatten: true,
                            cwd: 'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/',
                            src: ['bootstrap/_variables.scss', 'bootstrap.scss'],
                            dest: 'scss/bootstrap/',
                            filter: 'isFile',
                            options: {
                                process: function(content, srcpath) {
                                    return content.replace(/@import "bootstrap\/*/mg, '@import \"bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap/');
                                }
                            },
                        },
                        bootstrap_js: {
                            expand: true,
                            flatten: true,
                            src: ['bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/*.js', ],
                            dest: 'js/lib/twbs_js/'
                        }, <%
                }
                if (includeFontawesome) { %>
                    fontawesome: {
                        files: [{
                                src: 'bower_components/fontawesome/scss/_variables.scss',
                                dest: 'scss/fonts/_fonts-variables.scss'

                    }, {
                                expand: true,
                                cwd: 'bower_components/fontawesome/fonts',
                                src: '*',
                                dest: '<%%= buildPath %>/<%%= fontsFolder %>/',
                                filter: 'isFile'
                    }
                ]
                    } <%
                } %>
            } <%
        } %>

    });

    // Task registration
    grunt.registerTask('default', [
        'watch'
    ]);

    grunt.registerTask('build', [
        'uglify',
        'imagemin'
    ]);

};