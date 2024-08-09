<script setup>
import { computed, watch } from 'vue';
import store from '../../store';

  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: false,
    },
    product: {
      type: [Object, null],
    }
  })

  const emit = defineEmits([
    'update:modelValue',
  ])

  const productId = computed(() => {
    return props.product?.id
  })

  const alreadyInCart = computed(() => {
    return store.getters['cart/exists'](productId.value)
  })

  const productTitle = computed(() => {
    return props.product?.title
  })

  const productDescription = computed(() => {
    return props.product?.description
  })

  const productPrice = computed(() => {
    return props.product?.price.toLocaleString('en-US', { minimumFractionDigits: 2 })
  })

  const productCategory = computed(() => {
    return props.product?.category
  })

  const productImage = computed(() => {
    return props.product?.image
  })

  const model = computed({
    get: () => props.modelValue,
    set: (value) => {
      emit('update:modelValue', value)
    }
  })

  watch(() => props.modelValue, (value) => {
    if (value) {
      // remove the opacity-0 class from the image
      const img = document.querySelector('.product-img')
    }
  })

  const addToCart = () => {
    store.dispatch('cart/addItem', props.product)
  }

  const removeFromCart = () => {
    store.dispatch('cart/removeItem', productId.value)
  }
</script>

<template>
  <div>
    <input id="product_modal" type="checkbox" class="modal-toggle" v-model="model" />
    <div class="modal" role="dialog">
      <label class="modal-backdrop" for="product_modal">Close</label>
      <d-card class="modal-box p-0 w-[32rem]">
        <label for="product_modal" class="btn btn-sm btn-circle absolute right-[1rem] top-[1rem]">
          <span class="icon">close</span>
        </label>

        <template #title>
          {{ productTitle }}
        </template>

        <template #image-top>
          <img class="product-img aspect-square object-cover" 
            :src="productImage"
            :alt="productTitle"
            onerror="this.classList.add('opacity-0')" />
        </template>

        <p class="text-primary font-bold text-3xl my-3">&dollar; {{ productPrice }}</p>
        <p class="my-3">{{ productDescription }}</p>

        <div class="category">{{ productCategory }}</div>

        <template #actions>
          <d-button class="w-full" color="error" @click="removeFromCart" v-if="alreadyInCart">
            Remove From Cart
          </d-button>

          <d-button class="w-full" color="primary" @click="addToCart" v-else>
            Add To Cart
          </d-button>
        </template>
      </d-card>
    </div>
  </div>
</template>

<style scoped lang="postcss">
  .category {
    @apply badge badge-ghost absolute top-[1rem] left-[1rem] opacity-70 shadow-lg p-3 rounded-md;
  }

  img {
    @apply w-full h-full min-w-full object-cover aspect-square;
  }
</style>