import ba from '../index'
import { notChanged, isEmpty } from './utils'

export let watch = []

const trackPageview = {
  bind (el, binding) {
    let index = watch.findIndex(element => element === el)
    let isWatched = index !== -1
    if (el.style.display === 'none') {
      if (!isWatched) watch.push(el)
      return
    } else {
      if (isWatched) watch.splice(index, 1)
    }

    if (!isWatched && (notChanged(binding) || isEmpty(binding))) return

    let args = []

    if (typeof binding.value === 'object') {
      let value = binding.value
      if (value.pageURL) args.push(value.pageURL)
    } else if (typeof binding.value === 'string' && binding.value) {
      args = binding.value.split(',')
      args.forEach((arg, i) => (arg[i] = arg.trim()))
    }
    ba.trackPageview(...args)
  },
  unbind (el, binding) {
    let index = watch.findIndex(element => element === el)
    if (index !== -1) watch.splice(index, 1)
  }
}

trackPageview.update = trackPageview.bind

export default trackPageview
