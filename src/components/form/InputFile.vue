<script setup>
  import { computed } from 'vue'
  import { useColor, useSize } from '@composables/helpers'

  const props = defineProps({
    color: {
        type: String,
    },
    size: {
        type: String,
        default: 'md',
    },
    modelValue: {
        type: String,
    },
  })

  const colorClass = computed(() => {
    let color = useColor(props.color)

    return color ? `focus:input-${color}` : ''
  })

  const sizeClass = computed(() => {
      let thisSize = useSize(props.size) ?? 'md'
      return `file-input-${thisSize}`
  })

  const inputClass = computed(() => {
      return [
          'form-input',
          'file-input',
          'w-full',
          sizeClass.value,
          colorClass.value,
      ]
  })

  const emit = defineEmits(['update:modelValue'])

  function updateModelValue (event) {
      emit('update:modelValue', event.target.value)
  }
</script>

<template>
  <input type="file" :class="inputClass" @input="updateModelValue" />
</template>