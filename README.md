# generator-sisar

> [Yeoman](http://yeoman.io) generator to scaffold a new project following guidelines and structure usually adopted by [@iamsisar](https://twitter.com/iamsisar) ([cescoc](https://github.com/cescoc)) and the cool people he works with.

## Features
Gives structure to your workflow to make your life easier
* Compiles SASS with Compass on save
* Generates customized Bootstrap build with only parts you need
* Concatenates and minify javascripts
* Automagically generates custom Modernizr build based on calls in your javascripts
* Optimizes graphical assets by compressing images and minimifying svgs
* Generates fallback png in support of your svg
* Live-reloads your browser on save
* Prints out fancy notification where supported

## Installation

Since this is a Yeoman scaffolding tool, you need **yo** to be installed on your machine:
```bash
$ npm install -g yo
```

generator-sisar cannot be installed via npm, so you'll have to clone it in a directory on your system then make it available to Yeoman running this command:

```bash
$ git clone git://github.com/cescoc/generator-sisar.git
$ npm link
```

Finally, move to your project dir and initiate the generator:

```bash
$ yo sisar
```

## Workflow
generator-sisar is strictly tailored around it's author's habits and everyday work needs. Nevertheless it can rapresent a precious resource for digging into advanced workflow automation and modular front end developing. It's intended to be used both by individuals and teams and, since it's way far from perfection, many parts may be frequently changed/refactored. Any suggestion is welcome.


### Directory structure
Scaffolds out a complete project directory structure like the following (elements in brackets are optional):

```
├── Gruntfile.js
├── bower.json
├── package.json
├── config.rb
|
| ///// compiled css staging area
├── css
│   └── parts
|
| ///// graphical assets directory
├── img
│   └── src
|
| ///// javascripts
├── js
│   ├── lib
│   │   └── (twbs_js)
│   └── src
|
| ///// stylesheets SASS source files
└── scss
    ├── _animations.scss
    ├── _fallbacks.scss
    ├── _grid-extend.scss
    ├── _mixins.scss
    ├── _palette.scss
    ├── _reset.scss
    ├── _setup.scss
    ├── _variables.scss
    ├── (bootstrap)
    │   ├── (_custom-grid-extend.scss)
    │   ├── (_variables.scss)
    │   └── (bootstrap.scss)
    ├── (fontawesome)
    │   └── (_variables.scss)
    ├── ie.scss
    └── main.scss
```
### Stylesheet workflow
*coming soon*
#### main.scss
90% of your styling rules wil be defined here as well as all of your @imports. It's the main source stylesheet which will be finally compiled. Since the principal aim is to balance files size and http requests, you can choose either to merge your stylesheet with bootstrap or keep them apart by commenting the following line (default):

```
//@import '../bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap/bootstrap';
```

Please read the **Bootstrap** section to learn more about pros and cons of merging Bootstrap in your stylesheet.

#### @imports
There's a bunch of `_underscored.scss` files that help to structure your css workflow:

**_setup.scss** *coming soon*

**_reset.scss** Eric Meyer's reset.css, plus custom anchor text color reset rule. Please note that reset.css will override normalize.css included in Bootstrap. Please comment `@import 'reset';` if you wish to mantain bootstrap typography and spacing.

**_palette.scss** Colors variables definition goes here. Comes with a bunch of useful well known brands colors. Except for brand colors, you'll want to name your palette variables by hue name (e.g. `$fandango-pink`) rather then their final usage (e.g. `$barbie-title`) in order to keep your code highly maintainable. Please use `_variables.scss` to couple your colors with their usage.

**_variables.scss** Any other variable you'd like to define goes here. Re-declaring a Bootstrap variable it will be overridden with the new value (e.g. `$grid-columns: 8`)

**_mixins.scss** *coming soon*

**_animations.scss** *coming soon*

**_fallbacks.scss** *coming soon*

#### Bootstrap
*coming soon*

### Javascript workflow
*coming soon*
#### Modernizr
*coming soon*

## What is Yeoman?

Trick question. It's not a thing. It's this guy:

![](http://i.imgur.com/tjeYZu3.png)

Basically, he wears a top hat, lives in your computer, and waits for you to tell him what kind of application you wish to create.

Not every new computer comes with a Yeoman pre-installed. He lives in the [npm](https://npmjs.org) package repository. You only have to ask for him once, then he packs up and moves into your hard drive. *Make sure you clean up, he likes new and shiny things.*

```bash
$ npm install -g yo
```


### Getting To Know Yeoman

Yeoman has a heart of gold. He's a person with feelings and opinions, but he's very easy to work with. If you think he's too opinionated, he can be easily convinced.

If you'd like to get to know Yeoman better and meet some of his friends, [Grunt](http://gruntjs.com) and [Bower](http://bower.io), check out the complete [Getting Started Guide](https://github.com/yeoman/yeoman/wiki/Getting-Started).


## License

MIT
