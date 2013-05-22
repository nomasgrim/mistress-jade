////////////////////////////////////////////////////////////////////////////////
//
// ## Grunt Build Notes
// ### Main front-end script loader. Should be included inline in HTML.
//
// The Jade helper file, `src/scripts/jade/helpers/jade_locals.js`,
// exposes a `scriptLoader` function that returns script injecting JavaScript
// read from the filesystem.
// 
// The Jade include, `src/markup/includes/endScripts.jade`,
// calls `scriptLoader()` and wraps the unescaped return value
// in a `<script type="text/javascript"> tag.
//
// The `scriptLoader` function can be modified in the helper file
// to include different JavaScript based on the build.
//
// ## Script Notes
//  
// Development convenience script loader.
//
// ### jQuery
//
// Checks for online status, then attempts to download jQuery via CDN.
// Then, it checks for jQuery and falls back to a local copy.
//
// ### Scripts
// 
// Loads individual site scipts. Logs complete message.
//
////////////////////////////////////////////////////////////////////////////////
window.yepnope.complete = yepnope.complete || function (){};

yepnope([{
    // ### jQuery
    test: window.navigator && navigator.onLine || !window.navigator,
    yep: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js',
    complete: function(){
      yepnope({
        test: window.jQuery,
        nope: '/assets/scripts/vendor/jquery.min.js'
      });
    }
  },{ // ### Scripts
    load: ['/assets/scripts/main.js'],
    complete: function() {
      window.console && console.log && console.log('All scripts loaded.');
      window.yepnope.complete();
    }
  }]);