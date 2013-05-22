chai = require 'chai'
grunt = require 'grunt'
fs = require 'fs'

assert = chai.assert

describe 'Task template', ->
  it 'should create destination file', ->
    assert.isTrue grunt.file.exists './test/actual/main.html'

  it 'should replace variables with data', ->
    source = grunt.file.read './test/source/main.template'
    actual = grunt.file.read './test/actual/main.html'

    assert.isTrue(source.indexOf('<%= message %>')  > 0)
    assert.isTrue(actual.indexOf('<%= message %>') is -1)

  it 'should correctly format the file', ->
    expected = grunt.file.read './test/expected/main.html'
    actual = grunt.file.read './test/actual/main.html'

    assert.strictEqual actual, expected

  it 'should manage to concatenate files', ->
    assert.isTrue grunt.file.exists('./test/actual/concat.html')

    expected = grunt.file.read './test/expected/concat.html'
    actual = grunt.file.read './test/actual/concat.html'

    assert.strictEqual actual, expected

  it 'should be able to wrap templates', ->
    assert.isTrue grunt.file.exists './test/actual/wrapped.html'

    expected = grunt.file.read './test/expected/wrapped.html'
    actual = grunt.file.read './test/actual/wrapped.html'

    assert.strictEqual actual, expected

  it 'should be able to inject current filepath in wrapping', ->
    assert.isTrue grunt.file.exists './test/actual/wrappedAdv.html'

    expected = grunt.file.read './test/expected/wrappedAdv.html'
    actual = grunt.file.read './test/actual/wrappedAdv.html'

    assert.strictEqual actual, expected

  it 'should wrap fragments individually when concatenating and wrapping', ->
    assert.isTrue grunt.file.exists './test/actual/wrappedConcat.html'

    expected = grunt.file.read './test/expected/wrappedConcat.html'
    actual = grunt.file.read './test/actual/wrappedConcat.html'

    assert.strictEqual actual, expected

  it 'should be able to replace part of an injected value', ->
    assert.isTrue grunt.file.exists './test/actual/wrappedReplace.html'

    expected = grunt.file.read './test/expected/wrappedReplace.html'
    actual = grunt.file.read './test/actual/wrappedReplace.html'

    assert.strictEqual actual, expected

  it 'should be able to minify html output', ->
    assert.isTrue grunt.file.exists './test/actual/min.html'

    expected = grunt.file.read './test/expected/min.html'
    actual = grunt.file.read './test/actual/min.html'

    assert.strictEqual actual, expected

  it 'should be able to minify a css file', ->
    assert.isTrue grunt.file.exists './test/actual/foo.min.css'

    expected = grunt.file.read './test/expected/foo.min.css'
    actual = grunt.file.read './test/actual/foo.min.css'

    assert.strictEqual actual, expected