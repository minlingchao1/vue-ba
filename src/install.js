import autoPageview from './directives/auto-pageview'
import trackEvent from '././directives/track-event'
import trackPageview from '././directives/track-pageview'
export default function install (Vue, options) {
  if (this.install.installed) return

  if (options.debug) {
    this.debug = console.log
  } else {
    this.debug = () => {}
  }

  let siteId = null

  if (typeof options === 'object') {
    siteId = options.siteId
    if (options.autoPageview !== false) {
      options.autoPageview = true
    }
  } else {
    siteId = options
  }

  if (!siteId) {
    return console.error(' siteId is missing')
  }

  this.install.installed = true
  // insert baidu analystics scripts
  const script = document.createElement('script')
  const src = `https://hm.baidu.com/hm.js?` + siteId
  const realSrc = options.src || src
  script.innerHTML = 'var _hmt = _hmt || []; (function(){var hm = document.createElement(\'script\');hm.src="' +
  realSrc +
  '";var s = document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm, s);})()'
  script.onload = () => {
    // if the global object is exist, resolve the promise, otherwise reject it
    if (window._hmt) {
      this._resolve()
    } else {
      console.error('loading ba statistics script failed, please check src and siteId')
      return this._reject()
    }
    this._cache.forEach((cache) => {
      window._hmt.push(cache)
    })
    this._cache = []
  }
  document.body.appendChild(script)
  Object.defineProperty(Vue.prototype, '$ba', {
    get: () => this
  })

  Vue.directive('auto-pageview', autoPageview)
  Vue.directive('track-event', trackEvent)
  Vue.directive('track-pageview', trackPageview)
}
