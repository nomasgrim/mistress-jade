'use strict'

module.exports = (grunt) ->
  minifier = require 'prettydiff'

  grunt.registerMultiTask 'template', 'Process grunt template files', () ->
    helpers = require('grunt-lib-contrib').init grunt

    options = helpers.options @, () ->
      data    : {}
      wrap    : {}
      minify  : {}

    grunt.verbose.writeflags @.options, 'options'

    @.files.forEach((f) ->
      grunt.log.writeln "src: #{f.src}, dest: #{f.dest}"
      
      out = f.src.filter((filepath) ->
        grunt.file.exists filepath
      ).map((filepath) ->
        compileTemplate filepath, options, f.dest
      ).join grunt.util.normalizelf grunt.util.linefeed

      if out.length < 1
        grunt.log.warn 'Nothing written because compiled files were empty.'
      else
        out = minify out, options if options.minify?
        grunt.file.write f.dest, out
        grunt.log.writeln "File #{f.dest.cyan} created."
    )

  minify = (src, options) ->
    options.minify.pretty ?= { mode: 'minify', lang: 'markup', html: 'html-yes' }
    options.minify.pretty.source = src

    try
      minified = minifier.api(options.minify.pretty)[0]
    catch e
      grunt.log.error e
      grunt.fail.warn 'Oh noes! Template minification failed :('

    minified
    

  compileTemplate = (filepath, options, dest) ->
    src = grunt.file.read filepath

    try
      wrap = options.wrap?.banner? and options.wrap?.footer?
      inject = wrap and options.wrap.inject?.length >= 1

      processed = grunt.template.process src, options
      processed = "#{options.wrap.banner}#{processed}#{options.wrap.footer}" if wrap

      if wrap and inject
        for inj, pos in options.wrap.inject
          inj.rem  ?= ''
          inj.repl ?= {}

          switch inj.prop
            when 'src'
              inject = filepath.replace inj.rem, ''
            when 'dest'
              inject = dest.replace inj.rem, ''
            else
              inject = '#{' + pos + '}'
              grunt.log.warn 'Invalid inject property supplied, not replacing positional marker'

          inject = inject.replace k, v for k, v of inj.repl
          processed = processed.replace('#{' + pos + '}', inject)

      return processed
    catch e
      grunt.log.error e
      grunt.fail.warn 'Template copilation failed.'