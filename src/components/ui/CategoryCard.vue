<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    category: {
      type: Object,
      required: true
    }
  })

  const categoryID = computed(() => {
    return props.category ? props.category.id : null
  })

  const categoryName = computed(() => {
    return props.category ? props.category.name : ''
  })

  const categoryImage = computed(() => {
    return props.category ? props.category.image : ''
  })
</script>

<template>
  <router-link :to="{ name: 'categories.view', params: { id: categoryID } }">
    <d-card class="category-card image-full overflow-hidden md:compact" bordered>
      <template #title>
        <h3 class="text-lg md:text-xl lg:text-2xl">{{ categoryName }}</h3>
      </template>
      <template #image-top>
        <img :src="categoryImage" :alt="categoryName"
          onerror="this.classList.add('opacity-0')"
        />
      </template>
    </d-card>
  </router-link>
</template>

<style scoped lang="postcss">
  .category-card {
    @apply aspect-square cursor-pointer shadow-xl hover:shadow-2xl;

    &.img-full {
      figure {
        @apply w-full h-full;
        img {
          @apply object-cover aspect-square;
        }
      }
    }
  }
</style>