<script setup>
  import { computed } from 'vue'

  import { useColor, useSize } from '@composables/helpers'

  const props = defineProps({
      bordered: {
          type: Boolean,
          default: false,
      },
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
      rows: {
          type: Number,
          default: 3,
      },
  })

  const borderedClass = computed(() => {
    return props.bordered ? 'textarea-bordered' : ''
  })

  const colorClass = computed(() => {
    let color = useColor(props.color)

    return color ? `focus:textarea-${color}` : ''
  })

  const sizeClass = computed(() => {
    let thisSize = useSize(props.size) ?? 'md'
    return `textarea-${thisSize}`
  })

  const textareaClass = computed(() => {
    return [
      'form-input',
      'textarea',
      'w-full',
      sizeClass.value,
      borderedClass.value,
      colorClass.value,
    ]
  })

  const emit = defineEmits(['update:modelValue'])

  function updateModelValue (event) {
    emit('update:modelValue', event.target.value)
  }

</script>

<template>
  <textarea
    :value="props.modelValue"
    :class="textareaClass"
    @input="updateModelValue"
    :rows="props.rows"
  ></textarea>
</template>