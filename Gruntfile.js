var querystring = require('querystring');

module.exports = function(grunt) {
  var _ = grunt.util._;
  // Load all of our NPM tasks...
  var languages = ['jade', 'stylus', 'coffee'],
      minifiers = ['uglify'],
      linters   = ['jshint'],
      testing   = ['jasmine'],
      utilities = ['concat', 'copy', 'clean', 'watch', 'connect'];

  var contribLibs = _.union(languages, minifiers, linters, testing, utilities);
  function prefixLibs(name) {return 'grunt-contrib-' + name;}
  contribLibs = _.map(contribLibs, prefixLibs);

  var thirdPartyLibs = ['grunt-template-helper', 'grunt-bg-shell','grunt-cafe-mocha'];
  var npmTasks = _.union(contribLibs, thirdPartyLibs);

  _.each(npmTasks, grunt.loadNpmTasks);

  // load our jade locals module
  var jadeLocals = require('./src/markup/helpers/scripts/jade_locals.js')(grunt);

  // load stylus plugins
  var stylusPlugins = [require('fluidity'), require('roots-css')];

  var port = process.env.PORT || 0;

  grunt.initConfig({
    // Read build info from --dev or --build="build" command line args.
    build: grunt.option('dev') && 'dev' || grunt.option('build') || 'default',
    // Allow specification from command line of which jade and/or stylus file(s) to compile.
    jadeFilter: _.isString(grunt.option('jadeFilter')) && grunt.option('jadeFilter') || undefined,
    stylusFilter: _.isString(grunt.option('stylusFilter')) && grunt.option('stylusFilter') || undefined,
    pygments: {
      src: 'src/markup/htdocs/index.jade',
      dest: 'docs/highlighted.html'
    },
    markdownPath: '',
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      name: '<%= pkg.name %>',
      banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= template.today("m/d/yyyy") %> */'
    },
    concat: {
      pygments: {
        src: ['build/source-code/**/*.html'],
        dest: 'docs/source-code/source-code.html',
        options: {
          process: function(src, filepath){
            var sourcePath = filepath.slice(0,-5).replace('build/source-code/', 'src/');

            //if(_.contains(filepath, 'docs/'))
            //    sourcePath = sourcePath.replace('src/','docs/');

            var repoPath = 'https://github.com/simshanith/simshanith.github.io/tree/master/';
            //console.log('repo path: '+repoPath);
            var gitHubLink = ['<a href="', repoPath, sourcePath,'">',sourcePath,'</a>'].join('');
            //console.log('gh link: '+gitHubLink);
            var fileHeader = ['<h3><pre>', gitHubLink, '</pre></h3>'].join('');
            return fileHeader+src;
          }
        }
      }
    },
    coffee: {
      options: {

      },
      tests: {
        files: [{
          expand: true,
          cwd: 'test/',
          src: '{jasmine,mocha}/**/*.coffee',
          dest: 'test/',
          ext: '.js'
        }]
      }
    },
    jshint: {
      options: {
        expr: true,
        maxcomplexity: 5
      },
      browser: {
        src: ['src/scripts/lib/**/*.js', 'src/scripts/jade/includes/**/*.js']
      },
      build: {
        src: ['gruntfile.js', 'src/scripts/jade/helpers/**/*.js']
      },
      tests: {
        src: ['test/**/*.js'],
        options: {
          boss: true
        }
      }
    },
    uglify: {
      options: {
        banner: ['/***************',
            'Compiled <%= pkg.name %> JavaScript',
            'v<%= pkg.version %>',
            '<%= grunt.template.today("mm-dd-yyyy")%>',
            '***************/\n'].join('\n\n'),
        compress: true,
        mangle: true
      },
      main: {
        src: 'src/scripts/lib/main.js',
        dest: 'build/scripts/main.min.js'
      }
    },
    stylus: {
      options:{
        use: stylusPlugins
      },
      compile: {
        files: [{
          expand: true,     // Enable dynamic expansion.
          cwd: 'src/styles/lib',      // Src matches are relative to this path.
          src: ['**/*.styl', '!**/_*'], // Actual pattern(s) to match.
          dest: 'build/styles/stylus/',   // Destination path prefix.
          ext: '.css',   // Dest filepaths will have this extension.
          filter:  function(src) {
            var stylusFilter = grunt.config('stylusFilter');
            return stylusFilter ? grunt.file.isMatch(stylusFilter, src) : true;
          }
        }]
      }
    },
    jade: {
      options: {
        pretty: true,
        data: _.extend({},jadeLocals, {build: '<%= build %>'})
      },
      compile: {
        files: [{
          expand: true,  // Enable dynamic expansion.
          cwd: 'src/markup/htdocs/',      // Src matches are relative to this path.
          src: '**/*.jade', // Actual pattern(s) to match.
          dest: 'build/markup/jade/',   // Destination path prefix.
          ext: '.html',   // Dest filepaths will have this extension.
          filter: function(src) {
            var jadeFilter = grunt.config('jadeFilter');
            return jadeFilter ? grunt.file.isMatch(jadeFilter, src) : true;
          }
        }]
      },
      wrapMarkdown: {
        src: 'src/markup/templates/markdown.jade',
        dest: '<%= markdownPath && markdownPath.replace( ".markdown" , ".html" ).replace( "src/markup/htdocs/" , "" ) %>'
      }
    },
    bgShell: {
      _defaults: {
        bg: false
      },
      pygmentize: {
        cmd: 'pygmentize -f html -o <%= pygments.dest %> <%= pygments.src %>'
      }
    },
    template: {
      prettyJade: {
        options: {
          minify: {
            pretty: {
              mode: 'beautify',
              lang: 'markup',
              html: 'html-yes'
            }
          }
        },
        files: [{
          expand: true,  // Enable dynamic expansion.
          cwd: 'build/markup/jade/',      // Src matches are relative to this path.
          src: '**/*.html', // Actual pattern(s) to match.
          dest: 'build/markup/prettyhtml/'   // Destination path prefix.
        }]
      }
    },
    copy: {
      vendorScripts: {
        files: [{
          expand: true,
          cwd: 'src/scripts/vendor/',
          src: '**/*',
          dest: 'build/scripts/vendor/'
        }]
      },
      devScripts: {
        files: [{
          expand: true,
          cwd: 'src/scripts/lib',
          src: '**/*.js',
          dest: 'assets/scripts/'
        }]
      },
      scripts: {
        files: [{
          expand: true,
          cwd: 'build/scripts/',
          src: '**/*',
          dest: 'assets/scripts/'
        }]
      },
      vendorStyles: {
        files: [{
          expand: true,
          cwd: 'src/styles/vendor/',
          src: '**/*.css',
          dest: 'build/styles/vendor/'
        }]
      },
      stylusStyles: {
        files: [{
          expand: true,  // Enable dynamic expansion.
          cwd: 'build/styles/stylus/',      // Src matches are relative to this path.
          src: '**/*.css', // Actual pattern(s) to match.
          dest: 'build/styles/'   // Destination path prefix.
        }]
      },
      srcStyles: {
        files: [{
          expand: true,  // Enable dynamic expansion.
          cwd: 'src/styles/',      // Src matches are relative to this path.
          src: '**/*.css', // Actual pattern(s) to match.
          dest: 'build/styles/'   // Destination path prefix.
        }]
      },
      styles: {
        files: [{
          expand: true,
          cwd: 'build/styles/',
          src: '**/*',
          dest: 'assets/styles/'
        }]
      },
      markup: {
        files: [{
          expand: true,  // Enable dynamic expansion.
          cwd: 'build/markup/prettyhtml/',      // Src matches are relative to this path.
          src: '**/*.html', // Actual pattern(s) to match.
          dest: '.'   // Destination path prefix.
        }]
      }
    },
    clean: {
      build: ['build'],
      scripts: ['build/scripts'],
      styles: ['build/styles'],
      markup: ['build/markup'],
      genScripts: ['assets/scripts/'],
      genStyles: ['assets/styles/'],
      genMarkup: {
        src: ['**/*.html','!node_modules/**/*'],
        filter: function(filepath) {
          var jadepath = filepath.replace('.html','.jade');
          return grunt.file.exists('src/markup/htdocs/' + jadepath);
        }
      },
      stylus: ['build/styles/stylus'],
      jade: ['build/markup/jade'],
      template: ['build/markup/prettyhtml'],
      test: {
        src: ['test/{jasmine,mocha}/**/*.js'],
        filter: function(filepath){
          var coffeepath = filepath.replace('.js','.coffee');
          return grunt.file.exists(coffeepath);
        }
      },
      pygments: ['build/source-code/'],
      genPygments: ['docs/source-code/'],
      markdown: ['docs/**/*.marked.html'],
      genMarkdown: {
        src: ['docs/**/*.html'],
        filter: function(filepath){
          var markedpath = filepath.replace('.html','.markdown').replace('docs/', 'src/markdown/');
          return grunt.file.exists(markedpath);
        }
      }
    },
    watch: {
      options: {
        interrupt: false
      },
      scripts: {
        files: ['src/scripts/lib/*.js'],
        tasks: ['scripts']
      },
      styles: {
        files: ['src/styles/**/*.{styl,css}'],
        tasks: ['styles']
      },
      markup: {
        files: ['src/markup/**/*{.jade,.js,.markdown}'],
        tasks: ['markup']
      },
      mochaTest: {
        files: ['gruntfile.js', 'src/scripts/jade/helpers/jade_locals.js','test/{jasmine,mocha}/**/*.coffee'],
        tasks: ['test:build']
      }
    },
    connect: {
      options: {
        port: port,
        host: '0.0.0.0'
      },
      site: {}
    },
    jasmine: {
      options: {
        specs: ['test/jasmine/specs/*.js'],
        vendor: ['src/scripts/vendor/*.js'],
        template: ['test/jasmine/templates/main.tmpl'],
        keepRunner: false
      },
      dev: {
        src: ['src/scripts/lib/main.js']
      },
      compiled: {
        src: ['assets/scripts/main.min.js']
      }
    },
    cafemocha: {
      options: {
        reporter: 'tap',
        growl: true,
        compilers: 'coffee-script'
      },
      test: {
        src: 'test/mocha/spec.js',
        options: {
          reporter: 'spec'
        }
      }
    }
  });
  // END `grunt.initConfig`

  function chainTasks(tasks){
    grunt.task.run(tasks);

    var name = grunt.task.current.name;
    // Clean based on task name.
    if(!_.isString(name)){
      grunt.log.error('No name supplied for cleaning; check grunt configuration.');
      grunt.log.error('Not cleaning intermediate files.');
      return;
    }

    if(!grunt.option('debug') && !grunt.option('no-clean'))
        grunt.task.run('clean:'+name);
    else // redundant `else` as `grunt.log.debug` only logs with debug option specified
        grunt.log.subhead('Not cleaning intermediate '+name+'.');

  }

  grunt.registerTask('scripts', 'Concatenate and minify Javascript files.', function(){
    chainTasks(['copy:vendorScripts', 'uglify:main', 'copy:devScripts', 'copy:scripts', 'test:browser']);
  });

  grunt.registerTask('styles', 'Compile Stylus to CSS & minify.', function(){
    chainTasks(['copy:vendorStyles', 'stylus:compile', 'copy:stylusStyles', 'clean:stylus', 'copy:srcStyles', 'copy:styles']);
  });
  grunt.registerTask('markup', 'Compile Jade to HTML & beautify.', function() {
    // `grunt markup:dev` == `grunt markup --dev` == `grunt markup --build=dev`
    if(this.flags.dev){
      grunt.config('build','dev');
      grunt.log.error('Development build; including unminified scripts.');
    }

    chainTasks(['pygmentize','test:build','markdown','jade:compile', 'template:prettyJade', 'copy:markup', 'clean:markdown']);

  });

  grunt.registerTask('test', 'Build and run tests.',function(flag) {
    grunt.log.subhead('TESTING');
    var target = _.isString(flag) && flag || 'all';

    if(target !== 'build' && target !== 'browser'){
      target = 'all';
    }

    var taskList = ['coffee:tests', 'jshint:tests'];

    if(target === 'build' || target === 'all'){
      taskList.push('jshint:build');
      taskList.push('cafemocha:test');
    }

    if(target === 'browser' || target === 'all'){
      taskList.push('jshint:browser');
      taskList.push('jasmine');
    }

    chainTasks(taskList);
  });

  function cleanBuild (target){
    return 'clean:'+target;
  }

  function cleanGen (target){
    return 'clean:gen'+_.capitalize(target);
  }

  var mainTasks = ['scripts', 'styles', 'markup'];

  /*
  No longer necessary with build directory.
  grunt.registerTask('clean:build',
    'Remove / clean all intermediate build files.',
    _.map(mainTasks, cleanBuild)
  );
  */

  grunt.registerTask('clean:gen',
    'Remove / clean all final generated files.',
    _.map(mainTasks, cleanGen)
  );

  grunt.registerTask('default', "Grunt.", function() {
    grunt.task.run(mainTasks);
    if(!grunt.option('no-watch')) grunt.task.run('watch');
  });


  grunt.registerTask('markdown', 'Generate HTML from Markdown source', function(){
    var sourceFiles = ['**/*.markdown'],
        expandOpts  = {cwd: 'src/', flatten: false, ext: '.marked.html'},
        targetDir   = 'docs/',
        fileMatches = grunt.file.expandMapping(sourceFiles, targetDir, expandOpts);

    grunt.log.subhead('Found '+fileMatches.length+' source files to compile.');

    var tasks = _.map(fileMatches, function(pair){
      var pairStr = querystring.stringify(pair);
      return ['_marked:'+pairStr, 'jade:wrapMarkdown'];
    });

    grunt.task.run(_.flatten(tasks));


  });

  grunt.registerTask('_marked', function(pairStr) {
    var pair = querystring.parse(pairStr);
    //grunt.log.writeln(pair.src);
    grunt.config('markdownPath', pair.src);
  });

  grunt.registerTask('_pyg', 'internal grunt config', function(pairStr){
    var pair = querystring.parse(pairStr);
    // Create file & intermediate directories.
    grunt.file.write(pair.dest, 'Running pygments...');
    grunt.config('pygments', pair);
  });

  grunt.registerTask('pygmentize', 'Generate HTML of syntax-highlighted source code.', function() {

    var expandOpts  = {cwd: 'src/', flatten: false, rename: pygRename},
        sourceFiles = ['{markup,scripts}/**/*.{jade,js}', '!**/vendor/*', '!markup/**/*.js'],
        targetDir   = 'build/source-code/',
        fileMatches = grunt.file.expandMapping(sourceFiles, targetDir, expandOpts);

    function pygRename(dest, matchedSrcPath, options) {
      return dest + matchedSrcPath + '.html';
    }

    grunt.log.subhead('Found '+fileMatches.length+' source files to highlight.');

    _.each(fileMatches, function(pair){
      var pairStr = querystring.stringify(pair);
      grunt.task.run(['_pyg:'+pairStr,'bgShell:pygmentize']);
    });

    grunt.task.run(['concat:pygments', 'clean:pygments']);
  });

  grunt.registerTask('heroku', 'Confirm grunt cli works.', function(){
    grunt.log.ok('`grunt heroku` called successfully!');
    grunt.log.subhead('process.env.PORT: '+process.env.PORT);
    grunt.log.writeln(port);
  });

};