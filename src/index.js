import install from './install'

const deferred = {}
deferred.promise = new Promise((resolve, reject) => {
  deferred.resolve = resolve
  deferred.reject = reject
})
const methods = [
  'trackPageview',
  'trackEvent',
  'setCustomVar'
]

const ba = {
  /**
  * internal user only
  */
  _cache: [],
  /**
   * internal user only, resolve the promise
   */
  _resolve () {
    deferred.resolve()
  },
  /**
     * internal user only, reject the promise
     */
  _reject () {
    deferred.reject()
  },

    /**
   * push the args into _czc, or _cache if the script is not loaded yet
   */
  _push (...args) {
    this.debug(args)
    if (window._hmt) {
      window._hmt.push(...args)
    } else {
      this._cache.push(...args)
    }
  },
  /**
   * general method to create baidu analystics apis
   */
  _createMethod (method) {
    return (...args) => {
      this._push([`_${method}`, ...args])
    }
  },

  /**
   * debug
   */
  debug () {},
  /**
   * the plugins is ready when the script is loaded
   */
  ready () {
    return deferred.promise
  },
  /**
   * install function
   */

  install,
  /**
     * patch up to create new api
     */
  patch (method) {
    this[method] = this._createMethod(method)
  }
}

// uweb apis
methods.forEach((method) => (ba[method] = ba._createMethod(method)))

if (window.Vue) {
  window.ba = ba
}

export default ba
