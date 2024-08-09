<script setup>
  import { computed } from 'vue'
  import { useColor, useSize } from '@composables/helpers'

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'md',
    },
    class: {
      type: String,
      default: '',
    },
    backdrop: {
      type: Boolean,
      default: false,
    },
  })

  const modalId = computed(() => {
    return `modal-${Math.random().toString(36).substring(2, 15)}`
  })

  const emit = defineEmits([
    'update:modelValue',
  ])

  const modalSizes = {
    'xs': 'md:w-1/2 lg:w-1/5',
    'sm': 'md:w-1/2 lg:w-1/4',
    'md': 'lg:w-1/3',
    'lg': 'w-2/3',
    'xl': 'w-3/3',
  }

  const model = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value)
    }
  })

  const modalClasses = computed(() => {
    return [
      'modal',
    ]
  })

  const modalBoxClasses = computed(() => {
    let thisSize = useSize(props.size)

    return [
      'modal-box',
      modalSizes[thisSize],
      ...props.class.split(' '),

    ]
  })
</script>

<template>
  <div>
    <input :id="modalId" type="checkbox" class="modal-toggle" v-model="model" />

    <div :class="modalClasses" role="dialog">
      <label class="modal-backdrop" :for="modalId" v-if="backdrop">Close</label>
      <div :class="modalBoxClasses">
        <h2 class="text-lg font-bold">
          <slot name="title">
              {{ title }}
          </slot>
        </h2>

        <label :for="modalId" class="btn btn-sm btn-circle absolute right-[1rem] top-[1rem]">
          <span class="icon">close</span>
        </label>

        <div class="py-4">
            <slot></slot>
        </div>

        <div class="modal-actions mt-4 flex justify-end gap-3">
            <slot name="actions"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>