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
    <d-card class="category-card image-full" bordered>
      <template #title>
        <h3 class="text-lg md:text-xl lg:text-2xl">{{ categoryName }}</h3>
      </template>
      <template #image-top>
        <img :src="categoryImage" :alt="categoryName"
          onerror="this.src='images/tag.png'"
        />
      </template>
    </d-card>
  </router-link>
</template>

<style scope lang="postcss">
  .category-card {
    @apply aspect-square;

    &.img-full {
      figure {
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }
</style>