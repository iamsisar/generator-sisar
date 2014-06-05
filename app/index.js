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
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

		// Have Yeoman greet the user.
		this.log(yosay('Welcome to the marvelous Sisar generator!'));

    var prompts = [
    // Prompt for these values.
    {
      name: 'authorName',
      message: 'Hi! Whats your name?'
    },
    {
      name: 'projectTitle',
      message: 'Please, give a name to this project.',
      default: 'My awesome project'
    },
    {
      name: 'projectDescription',
      message: 'What about providing a short description? Feel free to write down your thoughts, your fears, your desires...',
    },
    {
      name: 'projectVersion',
      message: 'Version number?',
      default: '0.0.1'
    },
    {
    type: 'checkbox',
    name: 'ingredients',
    message: 'Time to choose the ingredients for your soup!',
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
      checked: true
	    }
	  ]
  	},
    // {
    //   name: 'buildPath',
    //   message: 'Please enter the relative path to the build root',
    //   default: '..'
    // },
    // {
    //   name: 'cssFolder',
    //   message: 'Specify a name for th Stylesheet folder',
    //   default: 'css'
    // },
    // {
    //   name: 'jsFolder',
    //   message: 'Specify a name for th Javascript folder',
    //   default: 'js'
    // },
    // {
    //   name: 'imgFolder',
    //   message: 'Specify a name for the images folder',
    //   default: 'img'
    // },
    {
      name: 'jqueryVersion',
      message: 'Wich version of jQuery shall we use? (only numbers and dots).\nPlease note that jQuery 2.0+ only support IE9+. By default we use 1.9.0 but you can specify an earlier version and forget about dumb browsers.',
      default: '1.9.0'
    },
    // {
    //   name: 'googlefonts',
    //   message: 'Any particular Google Web Font to use?.\nSpecify fonts name separated by pipes and replace whitespaces with pluses. Eg. Lato|Droid+Sans',
    // }


    ];

    this.prompt(prompts, function (answers) {

	    var ingredients = answers.ingredients;

	    function hasFeature(feat) { return ingredients.indexOf(feat) !== -1; }

	    this.includeSass = hasFeature('includeModernizr');
	    this.includeBootstrap = hasFeature('includeBootstrap');
	    this.includeModernizr = hasFeature('includeFontawesome');

      this.authorName = answers.authorName;
      this.projectTitle = answers.projectTitle;
      this.projectDescription = answers.projectDescription;
      this.projectVersion = answers.projectVersion;
      this.buildPath = answers.buildPath;
      this.cssFolderName = answers.cssFolderName;
      this.jsFolderName = answers.jsFolderName;
      this.imgFolderName = answers.imgFolderName;
      this.jqueryVersion = answers.jqueryVersion;
      this.googlefonts = answers.googlefonts;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/templates');

    this.template('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }

});

module.exports = SisarGenerator;
