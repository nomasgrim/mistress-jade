#### Currently Supported Features

This project breaks up source files across the three major divisions of modern Web development:

* Scripts,
* Styles,
* and Markup

##### Scripts

* [Grunt-powered linting](https://github.com/gruntjs/grunt-contrib-jshint) with [JShint](http://jshint.com/)
* [Grunt-powered minification](https://github.com/gruntjs/grunt-contrib-uglify) with [UglifyJS](http://lisperator.net/uglifyjs/)
* Grunt managed assets provide vendor, development, and production scripts (yay [automated copying](https://github.com/gruntjs/grunt-contrib-copy))
*  Asynchronously loaded in the browser with [yepnope](http://yepnopejs.com/)

##### Styles

* [Stylus](http://learnboost.github.io/stylus/) preprocessing language
* Includes both [Fluidity](http://fluiditycss.com/) & [Axis](http://roots.cx/axis/) Frameworks
* Design adapted from LESS snippet for [Solarized](http://ethanschoonover.com/solarized) syntax highlighting color scheme.
* Responsive Grid setup with variable breakpoints.
    *  Currently using [Fluidity's semantic grid system](http://fluiditycss.com/#grid)
    *  Roots / Axis offers **the** [Semantic Grid System](http://semantic.gs/)
* Can use vanilla CSS alongside Stylus

##### Markup

* [HTML5 Boilerplate](http://html5boilerplate.com/) inspired template
* Extensive use of [Jade](http://jade-lang.com)
* Locals module can provide helpers & is tested
* Exposes local helpers as [mixins](https://github.com/visionmedia/jade#a14) when possible
* Can inline JavaScript files configured by build type
* Works with [Markdown](http://daringfireball.net/projects/markdown/) via [Marked](https://github.com/chjj/marked)
* Generates syntax-highlighted source code as HTML with [Pygments](http://pygments.org), then templates with Jade

This included markdown file lives at [/docs/features.html](/docs/features.html) and [/src/markup/htdocs/docs/features.markdown](https://github.com/simshanith/simshanith.github.io/tree/master/src/markup/htdocs/docs/features.markdown).
