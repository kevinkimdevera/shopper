<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const loadingCategories = ref(false)
  const categories = computed(() => {
    return store.getters['category/allCategories']
  })

  const getCategories = async () => {
    loadingCategories.value = true
    await store.dispatch('category/fetchCategories')
    loadingCategories.value = false
  }

  onMounted(() => {
    getCategories()
  })
</script>

<template>
  <h1 class="text-3xl font-bold">Categories</h1>
  <div class="breadcrumbs text-sm my-3">
    <ul>
      <li><router-link :to="{ name: 'home' }">Home</router-link></li>
      <li>Categories</li>
    </ul>
  </div>

  <template v-if="loadingCategories">
    <div class="categories-grid">
      <div class="flex w-full flex-col gap-4" v-for="(item, index) in 12" :key="index">
        <div class="skeleton aspect-square w-full"></div>
      </div>
    </div>
  </template>

  <template v-else-if="categories.length == 0">
    <div class="w-full flex justify-center items-center h-[300px]">
      <div class="text-center">
        <span class="icon text-error">error</span>
        <div>
          No categories found.
        </div>
      </div>
    </div>
  </template> 

  <template v-else>
    <div class="categories-grid">
      <category-card
        v-for="category in categories"
        :key="`category-card-${category.id}`"
        :category="category">
      </category-card>
    </div>
  </template>
</template>

<style scoped lang="postcss">
  .categories-grid {
    @apply grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4;
  }

  .card {
    @apply cursor-pointer shadow-xl hover:shadow-2xl;

    &.category-card {
      @apply aspect-square;
    }

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