# generator-sisar

> [Yeoman](http://yeoman.io) generator to scaffold a new project following guidelines and structure usually adopted by [@iamsisar](https://github.com/iamsisar) and the cool people he works with.

## Features
Gives structure to your workflow to make your life easier! 

**generator-sisar** is really awesome because

- Generates customized Bootstrap build with only parts you need
- Allows you to define **multiple stand-alone grid systems** 

...and of course it also

- Compiles SASS with Compass on save
- Concatenates and minify javascripts
- Compiles HAML on save
- Automagically generates custom Modernizr build based on calls in your javascripts
- Optimizes graphical assets by compressing images and minimifying svgs
- Generates fallback png in support of your svg
- Live-reloads your browser on save
- Prints out fancy notification where supported


## Installation

**Please note you need to install Bundler.** [http://bundler.io/](http://bundler.io/)

```bash
$ gem install bundler
```

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

### Gems dependencies with Bundler
Once your project files structure is ready you can customize you environment by specifing gems you need in `Gemfile` and running 

````bash
$ bundler update
````

## Workflow
generator-sisar is strictly tailored around it's author's habits and everyday work needs. Nevertheless it can rapresent a precious resource for digging into advanced workflow automation and modular front end developing. It's intended to be used both by individuals and teams and, since it's way far from perfection, many parts may be frequently changed/refactored. Any suggestion is welcome.


### Directory structure
Scaffolds out a complete project directory structure like the following (* indicates optionals):

```
 ├── Gruntfile.js
 ├── bower.json
 ├── package.json
 ├── Gemfile
 ├── config.rb
 ├── bootstrap.yaml
 │
 │ ///// compiled css staging area
 ├── css
 │   └── parts
 │
 │ ///// graphical assets directory
 ├── img
 │   └── src
 │
 │ ///// javascript
 ├── js
 │   ├── lib
 │   │  *└── twbs_js
 │   └── src
 │
 │ ///// haml
*├── haml
 │
 │ ///// stylesheets SASS source files
 └── scss
     ├── _animations.scss
     ├── _fallbacks.scss
     ├── _mixins.scss
     ├── _palette.scss
     ├── _reset.scss
     ├── _setup.scss
     ├── _variables.scss
    *├── bootstrap
     │  *├── _custom-ext-grid.sass    
     │  *├── _custom-ext-responsive-utilities.scss    
     │  *├── _variables.scss
     │  *└── bootstrap.scss
    *├── fontawesome
     │  *└── _variables.scss
     ├── ie.scss
     └── main.scss
```
### Stylesheet workflow
Most of your styling rules will be defined in `main.scss` as well as all of your `@import` rules. This is the main stylesheet that will be eventually compiled. Since the main aim is to balance files size and http requests, you can choose either to merge your stylesheet with bootstrap or keep them apart. Please uncomment the following line if you plan to merge them together:

```scss
//@import '../bower_components/bootstrap-sass-official/vendor/assets/stylesheets/bootstrap/bootstrap';
```

#### @import partials

- **_setup.scss** Contains only dev stuff such as path variables, `@debug` rules etc.

- **_reset.scss** Eric Meyer's reset.css, plus custom anchor text color reset rule. Please note that reset.css will override normalize.css included in Bootstrap. Please comment `@import 'reset';` if you wish to mantain bootstrap typography and spacing.

- **_palette.scss** Colors variables definition goes here. Comes with a bunch of famous brands colors. Except for brand colors, you'll want to name your palette variables by hue name (e.g. `$fandango-pink`) rather then their usage (e.g. `$love-letter-bg`) in order to keep your code highly maintainable. Please use `_variables.scss` to pair your colors with their usage.

- **_variables.scss** Any other variable you'd like to define goes here. Re-declaring Bootstrap variables will override `!default` ones (e.g. `$grid-columns: 8`).

- **_mixins.scss** Your magical functions and `@mixin` directives are defined here. Comes with some useful stuff such as:
  - FontAwesome shorthand (e.g. `@include icon($fa-var-anchor)`. Please refer to **FontAwesome** for explaination)
  - media queries shorthand (e.g. `@include breakpoint(sm){ ... }`. Please refer to **Responsive approach** for explaination)

- **_animations.scss** Bibbidi-bobbidi-rules go here.

- **_fallbacks.scss** If you're planning to use Modernizr, this is a good place to put your you fallback rules.

- **_ie.scss** Filename say it all. 

#### Bootstrap
As mentioned above, you can choose either compile Bootstrap separately or merge it with your stylesheet. In both cases *variables* and *mixins* are included in `main.scss` as well as @extend-only porting of *grid* and *responsive utilities*. This is useful if you want to keep your markup as clean as possible and DRY out your style. Example:

```scss
.my-custom-column-class{
	@extend %visible-sm-block;
	@extend %col-sm-6;
	@extend %col-md-4;
	@extend %col-lg-push-4;
}
```

While any other `.scss` is compiled through Compass, Bootstrap relies on standard SASS. You can choose which modules to include by commenting out the correspondent lines in `scss/bootstrap/bootstrap.scss`.

Bootstrap javascript components are concatenated in your script by default. Due to components dependencies, the concatenation order is specified in `bootstrap.yaml`. You can configure your own build by commenting out unnecessary components.

##### Custom grid generator (alpha)
If you need to use multiple stand-alone grid systems you can define them in `scss/bootstrap/custom-ext-grid.scss` by using 

```scss
@include generate-custom-grid($prefix, $desired-cols)
```

The `@mixin` accepts two arguments

- `$prefix` a String to namespace generated classes
- `$desired-columns` a collection of Int that answer the following question: *In how many parts your grid must be able to be divided?*

The `@mixin` will generate necessary `@extend` classes and your terminal will output
a recap telling you wich to use to obtain desired subdivision.

For example if you want your grid to have 5 columns on desktop, 3 columns on tablet and 2 columns on mobile, you will need

```scss
@include generate-custom-grid("my-", 5 3 2)
```
On compile your console will output

```
CUSTOM GRID GENERATED:
Class prefix: %my-
Grid columns:30.
Desired classes are:
  • %my-col-{breakpoint}-6 results 5 columns
  • %my-col-{breakpoint}-10 results 3 columns
  • %my-col-{breakpoint}-15 results 2 columns
```
Then you can extend theese classes in your selector as follow

```scss
.my-grid .elements{
	@extend %my-col-xs-15;
	@extend %my-cols-sm-10;
	@extend %my-cols-md-6;
}
```

Ok, now you can freak out.


#### FontAwesome
Similar to Bootstrap, even FontAwesome has been partially included in `mains.scss` enabling the `@include icon()` shorthand defined in `_mixins.scss`.

This allow you to define in your stylesheet only the rules you need whithout embedding FontAwesome css in your document and keeping your markup semantic.

> `@include icon($icon, $where)`

- `$icon` is the unicode character. You can find all the definitions in `scss/fontawesome/variables`. By default the name is `$fa-var-{icon-name}`, you'll want to refer to [FontAwesome cheatsheet](http://fortawesome.github.io/Font-Awesome/cheatsheet/) for a list of icon names.
- `$where` deafult: `before`. You can alter the generated pseudo element for the icon choosing `:before` or `:after`

Example:

```scss
.anchor{
    @include icon($fa-var-anchor, 'after')
}

.bars{
    @include icon($fa-var-bars)
}
```
will generate:
```css
.fa, .anchor:after, .bars:before {
    display: inline-block;
    font-family: FontAwesome;
    font-style: normal;
    font-weight: normal;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.anchor:after {
    content: "\f13d";
}

.bars:before {
    content: "\f0c9";
}
```
### Responsive approach
The *media query shorthand* defined in `_mixins.scss` offers a less verbose way to develop your responsive layout and follow a *mobile first* principle (`min-width` media queries).

A deprecated version that uses `max-width` mq has been left commented out in the `mixin`. If you choose to use it instead of the *mobile first* version, you are supposed to know what you're doing.

### Javascript workflow
*coming soon*
#### Modernizr
Based on you js calls an custom build of Modernizr will be compiled when you save your javascripts.

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
