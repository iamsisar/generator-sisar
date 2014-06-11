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
* Prints out fancy notification where supported

## Installation

generator-sisar cannot be installed via npm, so you'll have to clone it in a directory on your system the make it available to Yeoman running this command:

```bash
$ npm link
```

Finally, move to your project dir and initiate the generator:

```bash
$ yo sisar
```

## Directory structure
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

### What is Yeoman?

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
