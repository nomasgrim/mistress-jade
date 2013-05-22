////////////////////////////////////////////////////////////////////////////////
//
// ## Grunt Build Notes
// ### Main front-end script loader. Should be included inline in HTML.
//
// The Jade helper file, `src/scripts/jade/helpers/jade_locals.js`,
// exposes a `includeJS` function that returns script injecting JavaScript
// read from the filesystem, based on the build configuration.
// 
// The Jade include, `src/markup/includes/endScripts.jade`,
// uses the unescaped return value of `includeJs('yepnope')`
//
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
// ### Main Script
// 
// Loads site payload. Logs complete message.
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
  },{ // ## Main Script
    load: ['/assets/scripts/main.min.js'],
    complete: function() {
      window.console && console.log && console.log('All scripts loaded.');
      yepnope.complete();
    }
  }]);