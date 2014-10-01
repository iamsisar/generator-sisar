'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var SisarGenerator = yeoman.generators.Base.extend({

  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      this.installDependencies({
        skipInstall: this.options['skip-install'],
        callback: function() {
            // Emit a new event - dependencies installed
            this.emit('dependenciesInstalled');
        }.bind(this)
      });
    });
  },

  done: function () {
      this.on('dependenciesInstalled', function() {
        this.spawnCommand('grunt', ['copy']);
      });
  },

  askFor: function () {
    var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay('Welcome to the marvelous Sisar generator!'));
    this.log(chalk.yellow(
      'Hello! We\'re now about to scaffold a new project following guidelines and\n'+
      'structure usually adopted by @iamsisar and the cool people he works with.\n'));

    var prompts = [
    // Prompt for these values.
    {
      name: 'authorName',
      message: 'First of all, what\'s your name?'
    },
    {
      name: 'projectTitle',
      message: 'Please, give a name to this project.',
      default: 'My awesome project'
    },
    {
      name: 'projectDescription',
      message: 'How about providing a short description? Feel free to write down your thoughts, your fears, your desires...',
    },
    {
      name: 'projectVersion',
      message: 'There is a version number?',
      default: '0.0.1'
    },
    {
    type: 'checkbox',
    name: 'ingredients',
    message: 'Good! Now it\'s time to choose the ingredients for your soup!',
    choices: [{
      name: 'Bootstrap (bootstrap-sass)',
      value: 'includeBootstrap',
      checked: true
      },
      {
      name: 'FontAwesome',
      value: 'includeFontawesome',
      checked: true
      },
      {
      name: 'Modernizr',
      value: 'includeModernizr',
      default: true
      }
    ]
    },
    {
      name: 'multipleGridsSupport',
      type: 'confirm',
      message: 'Bootstrap: add support to multiple grids? (experimental)',
      default: false,
      when: function( answers ) {
        return answers.ingredients.indexOf('includeBootstrap') !== -1;
      }
    },
    {
    type: 'confirm',
    name: 'useHaml',
    message: 'Would you like to use HAML? (experimental)'
    },
    {
      name: 'buildPath',
      message: 'Please enter the relative path to the build root',
      default: '..'
    },
    {
      name: 'cssFolder',
      message: 'Please specify a name for the Stylesheet folder',
      default: 'css'
    },
    {
      name: 'jsFolder',
      message: 'Please specify a name for the Javascript folder',
      default: 'js'
    },
    {
      name: 'imgFolder',
      message: 'Please specify a name for the Images folder',
      default: 'img'
    },
    {
      name: 'fontsFolder',
      message: 'Please specify a name for the Fonts folder',
      default: 'fonts'
    },
    {
      name: 'jqueryVersion',
      message: 'Wich version of jQuery shall we use? (only numbers and dots).\nPlease note that jQuery 2.0+ only supports IE9+. By default we use 1.9.0 but you can specify an earlier version and forget about dumb browsers.',
      default: '1.9.0'
    },
    {
      name: 'googlefonts',
      message: 'Any particular Google Web Font to use?.\nSpecify fonts name separated by pipes and replace whitespaces with pluses./n(Eg. Lato|Droid+Sans . Leave blank if not desired.)',
    },
    {
    type: 'checkbox',
    name: 'tools',
    message: 'Would you like some other tool?',
    choices: [{
      name: 'JS Hint',
      value: 'useJshint',
      checked: false
      },
      {
      name: 'Autoprefixer',
      value: 'useAutoprefixer',
      checked: true
      },
      {
      name: 'Grunt connect',
      value: 'useGruntConnect',
      checked: false
      }
    ]
    },
    {
      name: 'gruntConnectPort',
      message: 'Please specify port number for Grunt Connect',
      default: '8282',
      when: function( answers ) {
        return answers.tools.indexOf('useGruntConnect') !== -1;
      }
    },


    ];

    this.prompt(prompts, function (answers) {

      var ingredients = answers.ingredients;
      var tools = answers.tools;
	    function hasFeature(group,feat) { return group.indexOf(feat) !== -1; }

	    this.includeModernizr = hasFeature(ingredients,'includeModernizr');
	    this.includeBootstrap = hasFeature(ingredients,'includeBootstrap');
      this.includeFontawesome = hasFeature(ingredients,'includeFontawesome');
      this.googlefonts = hasFeature(ingredients,'googlefonts');
      this.useJshint = hasFeature(tools,'useJshint');
      this.useGruntConnect = hasFeature(tools,'useGruntConnect');
      this.useAutoprefixer = hasFeature(tools,'useAutoprefixer');
      this.gruntConnectPort = answers.gruntConnectPort;

      this.authorName = answers.authorName;
      this.projectTitle = answers.projectTitle;
      this.projectDescription = answers.projectDescription;
      this.projectVersion = answers.projectVersion;
      this.multipleGridsSupport = answers.multipleGridsSupport;
      this.useHaml = answers.useHaml;
      this.buildPath = answers.buildPath;
      this.cssFolder = answers.cssFolder;
      this.jsFolder = answers.jsFolder;
      this.imgFolder = answers.imgFolder;
      this.fontsFolder = answers.fontsFolder;
      this.jqueryVersion = answers.jqueryVersion;
      this.googlefonts = answers.googlefonts;


      var date = new Date();
      var today = date.getUTCMonth() + 1;
      today += '-' + date.getDate();
      today += '-' + date.getFullYear();

      this.creationDate = today;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('css');
    this.mkdir('css/parts');

    this.mkdir('js');
    this.mkdir('js/lib');
    this.directory('js/src','js/src');

    this.mkdir('img');
    this.mkdir('img/src');

    this.directory('scss', 'scss');

    if ( this.includeBootstrap ){
      this.directory('scss-bootstrap','scss/bootstrap');
    }
    if ( this.includeFontawesome ){
      this.mkdir('scss/fontawesome');
    }

    if ( this.useHaml ){
      this.directory('haml','haml');
    }

    this.template('_package.json', 'package.json');
    this.template('_bower.json', 'bower.json');
    this.template('Gruntfile.js', 'Gruntfile.js');
    this.template('head.html', 'head.html');
    this.copy('_config.rb', 'config.rb');

    this.template('scss/main.scss', 'scss/main.scss');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');

    if( this.useJshint ){
      this.copy('jshintrc', '.jshintrc');
    }
  }

});

module.exports = SisarGenerator;
