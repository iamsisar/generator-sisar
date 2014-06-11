/*!
 * <%= projectTitle  %> - v <%= projectVersion %>
 * Created on <%= creationDate %> by <%= authorName %>
 *
 * <%= projectDescription %>
 *
 */


module.exports = function(grunt) {

// Project configuration.
    grunt.initConfig({
        pkg         : grunt.file.readJSON('package.json'),

        // Folders and paths
        buildPath   : '<%= buildPath %>',
        jsFolder    : '<%= jsFolder %>',
        cssFolder   : '<%= cssFolder %>',
        imgFolder   : '<%= imgFolder %>',
        <% if (includeBootstrap) {  %>
        bootstrapAssets     : 'scss/bootstrap',<% }
        if (includeFontawesome) { %>
        fontawesomeAssets   : 'bower_components/fontawesome/scss',<% } %>

        // Tasks configuration.
        uglify: {
            build: {
                // minification
                src: 'js/script.js',
                dest: 'js/script.min.js'
            }
        },

        concat: {
            script_dev: {
                options: {
                    // Keep parts separated by line breaks, for the sake of readability
                    separator:'\n\n'
                },
                src: [
                    // JS libs first with Modernizr at the top, then custom scripts (script.js is the last)
                    'js/lib/modernizr.js',
                    'js/lib/!(modernizr|_*).js',
                    'js/src/!(script).js',
                    'js/src/script.js'
                ],
                dest: 'js/script.js',
            },
            script_build: {
                options: {
                    separator:'\n\n'
                },
                src: [
                    'js/lib/modernizr.js',
                    'js/lib/!(modernizr|_*).js',
                    'js/src/!(script).js',
                    'js/src/script.js'
                ],
                dest: '<%%= buildPath %>/<%%= jsFolder %>/script.js'
            },
            css_dev: {
                src: [
                    // Stylesheets other then main.css is treated as a shame-sheet
                    'css/parts/main.css',
                    'css/parts/!(main).css'
                ],
                dest: 'css/style.css'
            },
            css_build: {
                src: [
                    // Stylesheets other then main.css is treated as a shame-sheet
                    'css/parts/main.css',
                    'css/parts/!(main).css'
                ],
                dest: '<%%= buildPath %>/<%%= cssFolder %>/style.css'
            }
        },

        imagemin: {
            options: {
                cache: false
            },
            dist: {
                files: [{
                    // original images must be placed in src folder
                    expand: true,
                    cwd: 'img/src',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'img/'
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%%= imgFolder %>/src',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: '<%%= buildPath %>/<%%= imgFolder %>/'
                }]
            }
        },


        svgmin: {
            options: {
                plugins: [{
                    removeViewBox: false, // requested by IE
                    removeUselessStrokeAndFill: true,
                    removeEmptyAttrs: true
                }]
            },
            dist: {
                files: [{
                    // original images must be placed in src folder
                    expand: true,
                    cwd: 'img/src',
                    src: '**/*.svg',
                    dest: 'img/',
                    ext: '.svg'
                }]
            }
        },

        svg2png: {
            all: {
                files: [{
                    // once minified, .svg are converted to .png in the same folder
                    src: ['img/**/*.svg']
                }]
            }
        },

        sass: {
            dev: {
                // standard sass is used to compile framework separately. Remember IE css selector limits!
                // http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/10164546.aspx
                options: {
                    style: 'compact'
                },
                files: {
                    'css/bootstrap.css': '<%%= bootstrapAssets %>/bootstrap.scss',
                    'css/font-awesome.css': '<%%= fontawesomeAssets %>/font-awesome.scss'
                }
            },
            build: {
                options: {
                    style: 'nested'
                },
                files: {
                    '<%%= buildPath %>/<%%= cssFolder %>/bootstrap.css': '<%%= bootstrapAssets %>/bootstrap.scss',
                    '<%%= buildPath %>/<%%= cssFolder %>/font-awesome.css': '<%%= fontawesomeAssets %>/font-awesome.scss'
                }
            }
        },

        compass: {
            // uses Compass. Compiled stylesheets are placed in css/parts folder so they can be concatenated later.
            dev: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'css/parts',
                    specify: ['scss/*.scss'],
                    config: 'config.rb'
                }
            }
        },


        watch: {
            // enable livereload. See followeing link for browser extensions
            // http://feedback.livereload.com/knowledgebase/articles/86242-how-do-i-install-and-use-the-browser-extensions-
            options: { livereload: true },
            scripts: {
                // when a source or a lib change in js folder, merge them together, then minify the concatenated file.
                // If no errors, notify success.
                files: ['js/src/*.js', 'js/lib/*.js'],
                tasks: ['concat:script_dev','concat:script_build', 'uglify','jshint','notify:script'],
                options: {
                    spawn: false
                }
            },

            css: {
                files: ['scss/*.scss', 'css/parts/*.css', '<%%= bootstrapAssets %>/*.scss'],
                tasks: ['sass:dev','sass:build','compass:dev','concat:css_dev','concat:css_build','notify:css'],
                options: {
                    spawn: false
                }
            },

            svg: {
                files: ['img/src/**/*.svg'],
                tasks: ['svgmin','svg2png','notify:images'],
                options: {
                    spawn: false
                }
            },

            livereload: {
                options: { livereload: true },
                files: ['css/**/*', '*.{html,php,tpl}']
            }
        },

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
            }
        },


        copy: {
            <% if (includeBootstrap) { %>
            bootstrap: [{
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
                }]
            },<% } if (includeFontawesome) { %>
            fontawesome: {
                src: 'bower_components/fontawesome/scss/_variables.scss',
                dest: 'scss/fontawesome/_variables.scss',
            }<% } %>
        }


    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-svgmin');
    grunt.loadNpmTasks('grunt-svg2png');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-notify');

    grunt.loadNpmTasks('grunt-contrib-copy');



    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask('default', [
        'watch'
    ]);

    grunt.registerTask('build', [
        'uglify',
        'imagemin'
    ]);

};
