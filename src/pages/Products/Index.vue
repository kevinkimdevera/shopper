<script setup>
  import { computed, onMounted, reactive, ref, watch } from 'vue'
  import { useStore } from 'vuex'

  const store = useStore()

  const loading = ref(false)
  const products = ref([])
  const categorySearch = ref('')
  const categories = ref([])
  const selectedCategory = ref(null)
  const productModalVisible = ref(false)
  const selectedProduct = ref(null)

  const loadingCategories = ref(false)
  const allCategories = computed(() => {
    return store.getters['category/allCategories']
  })

  const filters = reactive({
    title: null,
    price_min: null,
    price_max: null,
    categoryId: null
  })

  watch(allCategories, () => {
    categories.value = allCategories.value
  })

  const selectCategory = (c) => {
    selectedCategory.value = c
    filters.value = { ...filters.value, categoryId: c }
    getProducts()
  }

  const getCategories = async () => {
    loadingCategories.value = true
    await store.dispatch('category/fetchCategories')
    loadingCategories.value = false
  }

  const searchCategory = () => {
    if (categorySearch.value) {
      let c = categories.value.filter(category => {
        return category.name.toLowerCase().includes(categorySearch.value.toLowerCase())
      })
      
      categories.value = c
    }
    else {
      categories.value = allCategories.value
    }
  }

  const applyFilters = (f) => {
    filters.value =  { ...f , categoryId: selectedCategory.value }
    getProducts()
  }

  const resetFilters = () => {
    selectedCategory.value = null

    filters.value = {
      title: null,
      price_min: null,
      price_max: null,
      categoryId: null
    }

    getProducts()
  }

  const getProducts = async () => {
    console.log('getProducts', filters.value)
    loading.value = true
    products.value = await store.dispatch('product/fetchProducts', filters.value)
    loading.value = false
  }

  const viewProduct = (product) => {
    productModalVisible.value = true
    selectedProduct.value = product
  }

  onMounted(() => {
    getCategories()
    getProducts()
  })
</script>

<template>
  <h1 class="text-3xl font-bold">Products</h1>
  <div class="breadcrumbs text-sm my-3">
    <ul>
      <li><router-link :to="{ name: 'home' }">Home</router-link></li>
      <li>Products</li>
    </ul>
  </div>
  <div class="divider"></div>

  <product-filter :loading="loading" @filter="applyFilters" @reset="resetFilters"></product-filter>

  <div class="flex flex-col lg:flex-row gap-3 my-5">
    <div class="lg:w-[300px] ">
      <d-card compact class="bg-base-300 sticky top-[80px]">
        <template #title>
          <span class="text-sm">Filter by Category</span>
        </template>

        <template v-if="loadingCategories">
          <div class="flex w-full gap-4 justify-center align-middle">
            <div class="p-5 text-center">
              <span class="loading loading-spinner mb-3"></span>
              <p>Loading Categories...</p>
            </div>
          </div>
        </template>

        <template v-else-if="categories.length == 0">
          <div class="w-full flex gap-4 justify-center items-center">
            <div class="p-5 text-center">
              <span class="icon text-error">error</span>
              <div>
                No categories found.
              </div>
            </div>
          </div>
        </template> 

        <template v-else>
          <form class="input-group my-3" @submit.prevent="searchCategory">
            <d-input size="sm" placeholder="Search..." ghost v-model="categorySearch" />
            <d-button size="sm" shape="square">
                <span class="icon">search</span>
            </d-button>
          </form>

          <div class="h-[50vh] overflow-y-auto custom-scroll">
            <ul class="menu p-0">
              <li class="rounded-lg" :class="{ 'active': selectedCategory == null }" @click="selectCategory(null)">
                <div class="flex items-center">
                  <div class="flex-none flex rounded-full bg-slate-500">
                    <span class="icon">done_all</span>
                  </div>
                  <div class="flex-grow ml-3">
                    <div class="text-sm font-bold">All</div>
                  </div>
                </div>
              </li>
              <template v-for="category in categories" :key="category.id">
                <li class="rounded-lg" :class="{ 'active': category.id == selectedCategory }" @click="selectCategory(category.id)">
                  <div class="flex items-center">
                    <div class="flex-none flex rounded-full bg-slate-500">
                      <img :src="category.image" class=" w-[24px] h-[24px] aspect-square rounded-full" alt="" onerror="this.classList.add('opacity-0')">
                    </div>
                    <div class="flex-grow ml-3">
                      <div class="text-sm font-bold">{{ category.name }}</div>
                      <div class="text-xs text-gray-500">{{ category.description }}</div>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </d-card> 
    </div>

    <div class="flex-1">
      <template v-if="loading">
        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 my-9">
          <div class="flex w-full flex-col gap-4" v-for="(item, index) in 12" :key="index">
            <div class="skeleton aspect-square w-full"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-28"></div>
          </div>
        </div>  
      </template>

      <template v-else-if="products.length ==0 ">
        <div class="w-full flex justify-center items-center h-[300px]">
          <div class="text-center">
            <span class="icon">info</span>
            <div>
              No products found.
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <p class="mb-5">Found {{ products.length }} products.</p>

        <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 my-5">
          <product-card
            v-for="product in products"
            :key="`product-card-${product.id}`"
            show-category
            :product="product"
            @clicked="viewProduct">
          </product-card>
        </div>
      </template>
    </div>

  </div>

  

  <!-- Product Details Modal -->
  <product-modal v-model="productModalVisible" :product="selectedProduct"></product-modal>
</template>

<style scoped lang="postcss">
  .menu {
    .active {
      @apply bg-primary bg-opacity-50;
    }
  }
</style>

