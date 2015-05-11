var riot     = require('riot')
var analizer = require('riot/lib/server/analyzer')
               require('./components/app-header.html')
               require('./components/app-footer.html')
               require('./components/editor.html')
               require('./components/checker.html')

var STORAGE_KEY   = 'RIOT_CHECKER_SOURCE'
var SOURCE_SAMPLE = require('./source-sample')

function mount(selector, tag, opts, listeners) {
  var dom = document.querySelector(selector)
  var container = riot.mount(dom, tag, opts)[0]
  dom.setAttribute('riot-tag', tag)
  if (!listeners) return
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
  footer: function(active) {
    mount('#footer', 'app-footer')
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
      results: results
    })
  }
}

view.header('result')
view.footer()
view.checker()
