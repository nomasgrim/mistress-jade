var marked = require('marked');

module.exports = function(grunt) {
  // Grunt loaded for utilities; do not configure here. 
  // Reading from configuration may not work either,
  // unless done at task runtime; e.g. in a function.
  var _ = grunt.util._;

  var jadeLocals = {};

  ///////////////////////////////////////////////////////////////////////////////////////
  // Expose grunt & _ to Jade.
  //
  // Done this way because grunt.log / grunt.verbose "or" functionality blows the stack
  // when attempting to simply `jadeLocals.grunt = grunt`
  //
  // Also, I would not advocate getting too complicated in template logic.
  // Most template scripts should be wrapped up as helper functions here,
  // rather than calling grunt directly from the template.
  //
  // Still, `!= grunt.file.read('relative/to/gruntfile.js')`
  // provides an awesome way for variable includes with absolute (project) paths,
  // and `grunt.task.current.name` may be handy.
  //
  //
  // _ + _.str just makes sense.
  //
  ///////////////////////////////////////////////////////////////////////////////////////
  var gruntOmissions       = ['log', 'verbose'];
  var gruntLogExports      = ['write','writeln','error','errorlns','ok','oklns','subhead','writeflags','debug'];

  jadeLocals.grunt         = _.omit(grunt, gruntOmissions);
  jadeLocals.grunt.log     = _.pick(grunt.log, gruntLogExports);
  jadeLocals.grunt.verbose = _.pick(grunt.verbose, gruntLogExports);
  jadeLocals._             = _;



  jadeLocals.includeJs = function(name) {
    if(!_.isString(name) || !name) {
      grunt.log.error('No script name included.');
      return;
    }

    function wrapScript(js){
      js = _.isString(js) && js || '';
      return ['<script type="text/javascript">',js,'</script>'].join('\n');
    }

    var build = grunt.config('build'),
        piece = (_.isString(build) && build != 'default') ? '.'+build : '';

    var baseDir    = 'src/markup/includes/scripts/',
        scriptPath = [baseDir, name, piece, '.js'].join(''),
        script     = grunt.file.read(scriptPath); // will fail task on error

    return wrapScript(script);
  };

  jadeLocals.includeMarkdown = function(markdownPath) {
    marked.setOptions({smartLists: true});

    markdownPath = markdownPath || grunt.config('markdownPath');

    var src  = markdownPath && _.isString(markdownPath) && grunt.file.read(markdownPath),
        output = src && marked(src);

    return output || '';
  };

  grunt.verbose.subhead('Loading Jade Locals module...').ok().writeln('Exports:');
  grunt.verbose.oklns(_.keys(jadeLocals).join('\n'));

  return jadeLocals;
};