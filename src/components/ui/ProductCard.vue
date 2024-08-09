<script setup>
  import { computed } from 'vue'
  
  const props = defineProps({
    product: {
      type: Object,
      required: true
    },
    showCategory: {
      type: Boolean,
      default: false
    }
  })

  const productID = computed(() => {
    return props.product ? props.product.id : null
  })

  const productTitle = computed(() => {
    return props.product?.title
  })

  const productCategory = computed(() => {
    return props.product?.category
  })

  const productCategoryName = computed(() => {
    return productCategory.value?.name
  })

  const productDescription = computed(() => {
    return props.product?.description
  })

  const productImage = computed(() => {
    let productImage = props.product?.images[0];

    // There's an instance where the product image is a stringified JSON
    try {
      productImage = JSON.parse(productImage)[0]
    } catch (error) {
      //
    }

    return productImage
  })

  const productPrice = computed(() => {
    return props.product
      ? props.product.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) 
      : 0
  })

  const emit = defineEmits(['clicked'])

  const viewProduct = () => {
    emit('clicked', {
      id: productID.value,
      title: productTitle.value,
      image: productImage.value,
      price: productPrice.value,
      category: productCategoryName.value,
      description: productDescription.value
    })
  }
</script>

<template>
  <d-card class="product-card" bordered compact @click="viewProduct">
    <template #image-top>
      <img class="product-img"
        :src="productImage"
        :alt="productTitle"
        onerror="this.classList.add('opacity-0')"
        />
    </template>

    <template v-if="showCategory">
      <div class="category">{{ productCategoryName }}</div>
    </template>

    <div class="flex flex-col gap-3 h-full">
      <div class="flex-grow text-lg font-bold">{{ productTitle }}</div>
      <p class="flex text-primary font-bold text-2xl items-end">&dollar; {{ productPrice }}</p>
    </div>
  </d-card>
</template>

<style scope lang="postcss">
  .product-card {
    @apply cursor-pointer shadow-xl hover:shadow-2xl;

    .category {
      @apply badge badge-ghost p-3 rounded-md absolute top-2 left-2 opacity-70 shadow-lg;
    }

    figure {
      @apply bg-base-300 !important;

      img {
        @apply w-full h-full min-w-full object-cover aspect-square;
      }
    }
  }
</style>