import ba from '../index'
import { notChanged, isEmpty } from './utils'

export default function (el, binding, vnode) {
  if (notChanged(binding) || isEmpty(binding)) {
    return
  }

  let args = []
  let events = Object.keys(binding.modifiers).map(modifier => {
    if (binding.modifiers[modifier]) {
      return modifier
    }
  })

  if (typeof binding.value === 'object') {
    let value = binding.value
    if (value.category) args.push(value.category)
    if (value.action) args.push(value.action)
    if (value.opt_label) args.push(value.opt_label)
    if (value.opt_value) args.push(value.opt_value)
  } else if (typeof binding.value === 'string') {
    args = binding.value.split(',')
    args.forEach((arg, i) => (args[i] = arg.trim()))
  }

  if (!events.length) events.push('click') // default  listen click

  events.forEach((eventValue) => {
    const customTag = 'custom'
    let [event, custom] = eventValue.split(':')
    if (custom === customTag) {
      vnode.componentInstance.$on(event, () => ba.trackEvent(...args), false)
    } else {
      el.addEventListener(event, () => ba.trackEvent(...args), false)
    }
  })
}
