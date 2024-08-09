<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const loadingCategories = ref(false)
  const categories = computed(() => {
    let categories = store.getters['category/allCategories']

    return categories.map(category => {
      return {
        id: category.id,
        name: category.name,
        image: category.image
      }
    })
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
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="category in categories" :key="category.id">
        <router-link :to="{ name: 'categories.view', params: { id: category.id } }">
          <d-card class="category-card image-full" bordered>
            <template #image-top>
              <img class="product-img" :src="category.image" :alt="category.name"
                onerror="this.src='images/tag.png'"
              />
            </template>
            <template #title>
              <h3 class="text-lg md:text-xl lg:text-2xl">{{ category.name }}</h3>
            </template>
            
          </d-card>
        </router-link>
      </div>
    </div>
  </template>
</template>

<style scoped lang="postcss">
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