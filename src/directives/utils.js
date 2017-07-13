import deepEqual from 'deep-equal'

/**
 * if the binding value is equal to oldeValue
 */
export function notChanged (binding) {
  if (binding.oldValue !== undefined) {
    if (typeof binding.value === 'object') {
      return deepEqual(binding.value, binding.oldValue)
    } else {
      return binding.value === binding.oldValue
    }
  } else {
    return false
  }
}

/**
 * if the binding value is empty
 */
export function isEmpty (binding) {
  return binding.value === '' || binding.value === undefined || binding.value === null
}
