<script setup>
    import { computed } from 'vue'

    import { useColor, useSize } from '@composables/helpers'

    const props = defineProps({
        type: {
            type: String,
            default: 'text',
        },
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
        ghost: {
            type: Boolean,
            default: false,
        },
        modelValue: {
            type: String,
        },
    })

    const borderedClass = computed(() => {
        return props.bordered ? 'input-bordered' : ''
    })

    const colorClass = computed(() => {
        let color = useColor(props.color)

        return color ? `focus:input-${color}` : ''
    })

    const sizeClass = computed(() => {
        let thisSize = useSize(props.size) ?? 'md'
        return `input-${thisSize}`
    })

    const ghostClass = computed(() => {
        return props.ghost ? 'input-ghost' : ''
    })

    const inputClass = computed(() => {
        return [
            'form-input',
            'input',
            'w-full',
            sizeClass.value,
            borderedClass.value,
            colorClass.value,
            ghostClass.value,
        ]
    })

    const emit = defineEmits(['update:modelValue'])

    function updateModelValue (event) {
        emit('update:modelValue', event.target.value)
    }
</script>

<template>
    <input
        :class="inputClass"
        :value="props.modelValue"
        :type="props.type"
        @input="updateModelValue"
    />
</template>
