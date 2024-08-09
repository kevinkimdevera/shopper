<script setup>
    import { defineProps, computed } from 'vue'

    const props = defineProps({
        label: {
            type: String,
            default: null,
        },
        width: {
            type: [Number, String],
            default: 240,
        },
        class: {
            type: String,
            default: '',
        },
        align: {
            type: String,
            default: 'left',
        },
        direction: {
            type: String,
            default: 'bottom',
        },
        open: {
            type: Boolean,
            default: false,
        },
        hover: {
            type: Boolean,
            default: false,
        },
    })

    const dropdownAlignClass = computed(() => {
        return props.align === 'end' ? 'dropdown-end' : ''
    })

    const dropdownOpenClass = computed(() => {
        return props.open ? 'dropdown-open' : ''
    })

    const dropdownHoverClass = computed(() => {
        return props.hover ? 'dropdown-hover' : ''
    })

    const dropdownClasses = computed(() => {
        return [
            'dropdown',
            `dropdown-${props.direction}`,
            dropdownAlignClass.value,
            dropdownOpenClass.value,
            dropdownHoverClass.value,
        ]
    })

    const dropdownMenuClasses = computed(() => {
        return [
            'dropdown-content',
            'bg-base-200',
            'rounded',
            'z-[99]',
            'shadow-lg',
            ...props.class.split(' ')
        ]
    })
</script>

<template>
    <div :class="dropdownClasses">
        <slot name="label">
            <summary class="btn btn-ghost" role="button" tabindex="0">{{ label }}</summary>
        </slot>
        <div :class="dropdownMenuClasses" tabindex="0">
            <slot></slot>
        </div>
    </div>
</template>
