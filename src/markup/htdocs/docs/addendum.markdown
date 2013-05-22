#### Other Stuff in the Works

Behind this HTML, CSS, and JS veneer there's quite a bit going on. It'd be nice to take some of my logic and put together some grunt plugin(s).

Potential Grunt Tasks:

* Jade One-to-Many
    * Compiles one source template with different data to different destinations
* Pygments
    * Provide a multitask wrapper to syntax highlight for the Web
* Markdown
    * Because a proper simple multitask is yet to exist 

Also, now up & running, is a test suite for the build processes. [Mocha](http://visionmedia.github.io/mocha/), [Should](https://github.com/visionmedia/should.js/), and [Sinon](http://sinonjs.org/) test my Gruntfile and Jade Locals module to ensure proper compilation of files.

The tests are written in [CoffeeScript](http://coffeescript.org) for gorgeous syntax and legibility, then compiled side by side to JavaScript. The results of these tests are publicly available on [Travis.CI](http://travis-ci.org/simshanith/simshanith.github.io). The build status is now:

[![Build Status](https://travis-ci.org/simshanith/simshanith.github.io.png)](https://travis-ci.org/simshanith/simshanith.github.io)

It'd be nice to get [Jasmine](http://pivotal.github.io/jasmine/) going for client-side code coverage.

This included markdown file lives at [/docs/addendum.html](/docs/addendum.html) and [/src/markup/htdocs/docs/addendum.markdown](https://github.com/simshanith/simshanith.github.io/tree/master/src/markup/htdocs/docs/addendum.markdown).