<script setup>
    import { computed } from 'vue'

    import { useColor, useSize } from '@composables/helpers'

    import { useRouter  } from 'vue-router';

    const router = useRouter();

    // Define props
    const props = defineProps({
        type: {
            type: String,
            default: '',
        },
        color: {
            type: String,
            default: '',
        },
        class: {
            type: String,
            default: '',
        },
        outline: {
            type: Boolean,
            default: false,
        },
        size: {
            type: String,
        },
        wide: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        shape: {
            type: String,
        },
        block: {
            type: Boolean,
            default: false,
        },
        loading: {
            type: Boolean,
            default: false,
        },
        ghost: {
            type: Boolean,
            default: false,
        },
        active: {
            type: Boolean,
            default: false,
        },
        to: {
            type: [Object, String],
            default: null,
        },
    })

    const emit = defineEmits([
      'click',
    ])

    // Click event handler
    const handleClick = (event) => {
        if (props.to) {
            if (typeof props.to === 'string') {
                router.push(props.to)
            }
            else {
                router.push(props.to)
            }
        }
        else {
          emit('click', event)
        }
    }

    const btnActiveClass = computed(() => {
        return props.active ? 'btn-active' : null
    })

    const btnOutlineClass = computed(() => {
        return props.outline ? 'btn-outline' : null
    })

    const btnWideClass = computed(() => {
        return props.wide ? 'btn-wide' : null
    })

    const specifiedClasses = computed(() => {
        return props.class.split(' ')
    })

    const btnColorClass = computed(() => {
        let thisColor = useColor(props.color)

        if (props.ghost) {
            return 'btn-ghost'
        }
        else {
            return thisColor ? `btn-${thisColor}` : null
        }
    })

    const btnSizeClass = computed(() => {
        let thisSize = useSize(props.size)

        return `btn-${thisSize}`
    })

    const loadingSpinnerClass = computed(() => {
        let size = useSize(props.size)

        return size ? `loading-${size}` : 'loading-md'
    })

    const btnShapeClass = computed(() => {
        let allowedShapes = ['square', 'circle']

        return allowedShapes.includes(props.shape) ? `btn-${props.shape}` : null
    })

    const btnBlockClass = computed(() => {
        return props.block ? 'btn-block' : null
    })

    const btnLoadingClass = computed(() => {
        return props.loading ? 'btn-loading' : null
    })

    const btnDisabled = computed(() => {
        return props.disabled || props.loading
    })

    const btnClasses = computed(() => {
        return [
            'btn',
            btnActiveClass.value,
            btnColorClass.value,
            btnOutlineClass.value,
            btnSizeClass.value,
            btnWideClass.value,
            btnShapeClass.value,
            btnBlockClass.value,
            btnLoadingClass.value,
            ...specifiedClasses.value,
        ]
    })
</script>

<template>
    <button :type="props.type" :disabled="btnDisabled" :class="btnClasses" @click="handleClick">
        <span class="loading loading-spinner" :class="[ loadingSpinnerClass ]"></span>

        <div class="btn-container">
            <slot></slot>
        </div>
    </button>
</template>
