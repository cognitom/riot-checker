var riot     = require('riot')
var analizer = require('riot/lib/server/analyzer')
               require('./components/app-header.html')
               require('./components/editor.html')
               require('./components/checker.html')

var STORAGE_KEY = 'RIOT_CHECKER_SOURCE'
var SOURCE_SAMPLE = [
  "// A sample tag file with some errors",
  "var riot = require('riot')",
  "",
  "<valid-tag>",
  "  <h1>{ title }</h1>",
  "  <p>{ message }</p>",
  "<invalid-flagment",
  "  this.title = 'Hello world!'",
  "  this.message = 'I am hungry...'",
  "</valid-tag>",
  "",
  "<invalid-t",
  "  <h1>{ title }</h1>",
  "  <p>{ message }</p>",
  "",
  "  this.title = 'Hello world!'",
  "  this.message = 'I am hungry...'",
  "</invalid-t",
  "",
  "console.log('end of file')"
].join('\n')

function mount(selector, tag, opts, listeners) {
  var dom = document.querySelector(selector)
  var container = riot.mount(dom, tag, opts)[0]
  dom.setAttribute('riot-tag', tag)
  Object.keys(listeners).map(function(key) {
    container.on(key, listeners[key])
  })
}

var source = localStorage.getItem(STORAGE_KEY) || SOURCE_SAMPLE
var view = {
  header: function(active) {
    mount('#header', 'app-header', {
      active: active
    }, {
      showSource: function() { view.editor() },
      showResult: function() { view.checker() }
    })
  },
  editor: function() {
    mount('#container', 'editor', {
      source: source
    }, {
      change: function(newSource) {
        source = newSource
        localStorage.setItem(STORAGE_KEY, source)
      }
    })
  },
  checker: function() {
    var results = analizer(source)
    mount('#container', 'checker', {
      source: source,
      results: results
    }, {
      back: function() {
        view.editor()
      }
    })
  }
}

if (source) {
  view.header('result')
  view.checker()
} else {
  view.header('source')
  view.editor()
}
