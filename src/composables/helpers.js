// List of all daisyUI color names
const colors = [
  'primary',
  'primary-content',
  'secondary',
  'secondary-content',
  'accent',
  'accent-content',
  'neutral',
  'neutral-content',
  'base-100',
  'base-200',
  'base-300',
  'base-content',
  'info',
  'success',
  'warning',
  'warning-content',
  'error',
  'error-content',
]

// List of available sizes
const sizes = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
]

// If the specified color is not in the list, return the default color
export function useColor (thisColor) {
  return colors.includes(thisColor) ? thisColor : null
}

// If the specified size is not in the list, return the default size
export function useSize (thisSize) {
  return sizes.includes(thisSize) ? thisSize : 'md'
}


