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
        pkg         : grunt.file.readJSON('package.json'),

        // Folder names and build path definitions
        buildPath   : '<%= buildPath %>',
        jsFolder    : '<%= jsFolder %>',
        cssFolder   : '<%= cssFolder %>',
        imgFolder   : '<%= imgFolder %>',
        fontsFolder : '<%= fontsFolder %>',
        <% if (includeBootstrap) {  %>
        bootstrapAssets     : 'scss/bootstrap',<% }
        if (includeFontawesome) { %>
        fontawesomeAssets   : 'bower_components/fontawesome/scss',<% } %>
        <% if (useGruntConnect) {  %>
        // Grunt connect
        connect: {
            server: {
                options: {
                    port: <%= gruntConnectPort %>,
                    hostname: '*',
                    base : '<%%= buildPath %>',
                    livereload : true
                }
            }
        },<% } %>

        // Javascript and css concatenation
        concat: {
            script_dev: {
                // Script order:
                // 1. Modernizr
                // 2. other libraries
                // 3. custom sources others then script.js
                // 4. script.js
                src: [
                    // libraries
                    'js/lib/modernizr-<%%= pkg.name %>.js',<% if (includeBootstrap) {  %>
                    // Bootstrap need to be built in a specific order not to break your script -.-
                    'js/lib/twbs_js/transition.js',
                    'js/lib/twbs_js/alert.js',
                    'js/lib/twbs_js/button.js',
                    'js/lib/twbs_js/carousel.js',
                    'js/lib/twbs_js/collapse.js',
                    'js/lib/twbs_js/dropdown.js',
                    'js/lib/twbs_js/modal.js',
                    'js/lib/twbs_js/tooltip.js',
                    'js/lib/twbs_js/popover.js',
                    'js/lib/twbs_js/scrollspy.js',
                    'js/lib/twbs_js/tab.js',
                    'js/lib/twbs_js/affix.js',<% } %>
                    'js/lib/**/!(_*).js',
                    // sources
                    'js/src/!(script).js',
                    'js/src/script.js'
                ],
                dest: 'js/script.js',
                options: {
                    // Keep parts separated by line breaks
                    separator:'\n\n'
                }
            },
            // Same as above, but save result in build folder
            script_build: {
                src: [
                    'js/lib/modernizr-<%%= pkg.name %>.js',<% if (includeBootstrap) {  %>
                    'js/lib/twbs_js/transition.js',
                    'js/lib/twbs_js/alert.js',
                    'js/lib/twbs_js/button.js',
                    'js/lib/twbs_js/carousel.js',
                    'js/lib/twbs_js/collapse.js',
                    'js/lib/twbs_js/dropdown.js',
                    'js/lib/twbs_js/modal.js',
                    'js/lib/twbs_js/tooltip.js',
                    'js/lib/twbs_js/popover.js',
                    'js/lib/twbs_js/scrollspy.js',
                    'js/lib/twbs_js/tab.js',
                    'js/lib/twbs_js/affix.js',<% } %>
                    'js/lib/**/!(_*).js',
                    'js/src/!(script).js',
                    'js/src/script.js'
                ],
                dest: '<%%= buildPath %>/<%%= jsFolder %>/script.js',
                options: {
                    separator:'\n\n'
                },
            },
            // Appends stylesheets other then main.css at the bottom of style.css
            css_dev: {
                src: [
                    'css/parts/main.css',
                    'css/parts/!(main).css'
                ],
                dest: 'css/style.css'
            },
            // Same as above, but save result in build folder
            css_build: {
                src: [
                    'css/parts/main.css',
                    'css/parts/!(main).css'
                ],
                dest: '<%%= buildPath %>/<%%= cssFolder %>/style.css'
            }
        },
        <% if (includeModernizr) { %>

        // Create a custom Modernizr build based on calls inside your javascripts
        modernizr: {
            dist: {
                'devFile' : 'bower_components/modernizr/modernizr.js',
                'outputFile' : 'js/lib/modernizr-<%%= pkg.name %>.js',
                // Javascripts to search into for Modernizr calls
                'files' : {
                    'src': ['js/src/*.js']
                }
            }
        },<% } %>

        // Once concatenated, create a minified version of your javascript
        uglify: {
            // Dev folder
            dev: {
                src: 'js/script.js',
                dest: 'js/script.min.js'
            },
            // Build folder
            build: {
                src: 'js/script.js',
                dest: '<%%= buildPath %>/<%%= jsFolder %>/script.min.js'
            }
        },<% if (useJshint) { %>

        jshint: {
            options: {
                jshintrc: true,
            },
            sources: ['js/src/**/*.js'],
            grunt: ['Gruntfile.js']
        },<% } %>

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
            // Dev folder
            dev: {
                files: [{
                    expand: true,
                    cwd: 'img/src',
                    src: '**/*.svg',
                    dest: 'img/',
                    ext: '.svg'
                }]
            },
            // Build folder
            build: {
                files: [{
                    expand: true,
                    cwd: 'img/src',
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
                    src: ['img/**/*.svg','<%%= buildPath %>/<%%= imgFolder %>/**/*.svg']
                }]
            }
        },

        // Compress .jpg, .png and .gif images
        // Original images must be placed in 'src' folder
        imagemin: {
            options: {
                cache: false
            },
            // Dev folder
            dev: {
                files: [{
                    expand: true,
                    cwd: 'img/src',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'img/'
                }]
            },
            // Build folder
            build: {
                files: [{
                    expand: true,
                    cwd: 'img/src',
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
            // Dev folder
            dev: {
                options: {
                    style: 'compact',
                    bundleExec: true
                },
                files: {
                    <% if (includeBootstrap) { %>'css/bootstrap.css': '<%%= bootstrapAssets %>/bootstrap.scss',
                    <% } if (includeFontawesome) { %>'css/font-awesome.css': '<%%= fontawesomeAssets %>/font-awesome.scss'<% } %>
                }
            },
            // Build folder
            build: {
                options: {
                    style: 'compressed',
                    bundleExec: true
                },
                files: {
                    <% if (includeBootstrap) { %>'<%%= buildPath %>/<%%= cssFolder %>/bootstrap.css': '<%%= bootstrapAssets %>/bootstrap.scss',
                    <% } if (includeFontawesome) { %>'<%%= buildPath %>/<%%= cssFolder %>/font-awesome.css': '<%%= fontawesomeAssets %>/font-awesome.scss'<% } %>
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
        },<% if (useAutoprefixer) { %>

        // autoprefixer
        autoprefixer: {
            dev: {
                src: 'css/style.css',
                dest:'css/style.css'
            },
            build: {
                src: 'css/style.css',
                dest:'<%%= buildPath %>/<%%= cssFolder %>/style.css'
            }
        },<% } %>

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
            // enable livereload. See followeing link for browser extensions
            // http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
            options: { livereload: true },
            // when a source or a lib change in js folder, merge them together, then minify the concatenated file.
            // If no errors, notify success.
            scripts: {
                files: ['js/src/*.js', 'js/lib/**/*.js'],
                tasks: [<% if (includeModernizr) { %>'modernizr',<% } %>'concat:script_dev','concat:script_build',<% if (useJshint) { %>'jshint:sources',<% } %>'uglify','notify:script'],
                options: {
                    spawn: false
                }
            },
            // when anything change in scss folder, compile evrerything in css staging folder then concatenate.
            // If no errors, notify success.
            css: {
                files: ['scss/**/*.scss', 'css/parts/*.css', '<%%= bootstrapAssets %>/*.scss'],
                tasks: ['sass:dev','sass:build','compass:dev','concat:css_dev','concat:css_build','notify:css'],
                options: {
                    spawn: false
                }
            },<% if (useHaml) { %>
            // when anything change in haml folder, compile.
            // If no errors, notify success.
            haml: {
                files: ['haml/**/*.haml'],
                tasks: ['haml','notify:template'],
                options: {
                    spawn: false
                }
            },<% } %>
            // when a .svg is modified, optimize it and create a .png fallback.
            // If no errors, notify success.
            svg: {
                files: ['img/src/**/*.svg'],
                tasks: ['svgmin','svg2png','notify:images'],
                options: {
                    spawn: false
                }
            },
            // reload browser when .css or template changes
            livereload: {
                options: { livereload: true },
                files: ['css/**/*', '*.{html,php,tpl,haml}']
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

        // copy task is used during scaffolding with Yeoman.
        // Please be aware that running this task during development WILL OVERWRITE following files
        // - scss/bootstrap/bootstrap.scss
        // - scss/bootstrap/_variables.scss
        // - js/lib/twbs_js/*.js
        // - scss/fontawesome/_variables.scss
        copy: {
            <% if (includeBootstrap) { %>
            bootstrap_css: {
                expand: true,
                flatten: true,
                cwd: 'bower_components/bootstrap-sass-official/vendor/assets/stylesheets/',
                src: ['bootstrap/_variables.scss','bootstrap.scss'],
                dest: 'scss/bootstrap/',
                filter: 'isFile',
                options: {
                    process: function (content, srcpath) {
                       return content.replace(/@import "bootstrap\/*/mg,'@import \"bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap/');
                    }
                },
            },
            bootstrap_js: {
                expand: true,
                flatten: true,
                src: ['bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap/*.js',],
                dest: 'js/lib/twbs_js/'
            },<% } if (includeFontawesome) { %>
            fontawesome: {
                files: [{
                    src: 'bower_components/fontawesome/scss/_variables.scss',
                    dest: 'scss/fontawesome/_variables.scss',
                    },
                    {
                    src: 'bower_components/fontawesome/fonts/*',
                    dest: '<%%= buildPath %>/<%%= fontsFolder %>/',
                    filter: 'isFile',
                    }
                ]
            }<% } %>
        }


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
