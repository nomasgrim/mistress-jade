describe 'jQuery', ->
  
  it 'should be loaded', ->
    expect(window.jQuery).toBeTruthy()

describe 'body', ->

  it 'should be dark', ->
    expect($('body.dark').length).toBeTruthy()

  it 'should be light after toggle', ->
    window.toggleTheme()
    expect($('body.light').length).toBeTruthy()