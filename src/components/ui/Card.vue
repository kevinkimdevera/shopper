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

        class: {
            type: String,
            default: '',
        },
    })

    const cardBorderedClass = computed(() => {
        return props.bordered ? 'card-bordered' : null
    })

    const cardColorClass = computed(() => {
        let thisColor = useColor(props.color)

        return thisColor ? `bg-${thisColor}` : null
    })

    const specifiedClasses = computed(() => {
        return props.class.split(' ')
    })

    const cardClass = computed(() => {
        return [
            'card',
            cardColorClass.value,
            cardBorderedClass.value,
            ...specifiedClasses.value,
        ]
    })
</script>

<template>
    <div :class="cardClass">
        <figure>
          <slot name="image-top"></slot>
        </figure>
        <div class="card-body">
            <div class="card-title">
                <slot name="title"></slot>
            </div>
            <slot></slot>

            <div class="card-actions">
                <slot name="actions"></slot>
            </div>
        </div>
        <figure>
          <slot name="image-bottom"></slot>
        </figure>
    </div>
</template>
