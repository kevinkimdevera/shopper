<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter, onBeforeRouteUpdate } from 'vue-router'
  import { useStore } from 'vuex'

  const props = defineProps({
    id: {
      type: [String, Number],
      required: true
    }
  })

  const router = useRouter()
  const store = useStore()

  const loading = ref(false)
  const loadingProducts = ref(false)
  const error = ref(false)
  const category = ref(null)
  const products = ref([])

  const categoryName = computed(() => {
    return category.value ? category.value.name : ''
  })

  const showCategory = () => {
    loading.value = true
    store.dispatch('category/show', props.id)
      .then((response) => {
        category.value = response

        getProducts()
      })
      .catch((e) => {
        // Not Found
        error.value = true
      })
      .finally(() => {
        loading.value = false
      })
  }

  const getProducts = async (filters = {}) => {
    loadingProducts.value = true

    let f = {
      categoryId: props.id,
      ...filters
    }
    products.value = await store.dispatch('product/fetchProducts', f)

    loadingProducts.value = false
  }

  const productModalVisible = ref(false)
  const selectedProduct = ref(null)

  const viewProduct = (product) => {
    productModalVisible.value = true
    selectedProduct.value = product
  }

  onMounted(() => {
    showCategory()
  })

  onBeforeRouteUpdate((to, from, next) => {
    showCategory()
    next()
  })
</script>

<template>
  <template v-if="loading">
    <div class="w-full flex justify-center items-center page-loader">
      <div class="text-center">
        <span class="loading loading-spinner mb-3"></span>
      </div>
    </div>
  </template>

  <template v-else-if="error">
    <div class="w-full flex justify-center items-center page-loader">
      <div class="text-center text-xl">
        <span class="icon text-error">error</span>
        <div>
          Category not found.
        </div>
      </div>
    </div>
  </template> 

  <template v-else>
    <h1 class="text-3xl font-bold">{{ categoryName }}</h1>
    <div class="breadcrumbs text-sm my-3">
      <ul>
        <li><router-link :to="{ name: 'home' }">Home</router-link></li>
        <li><router-link :to="{ name: 'categories.index' }">Categories</router-link></li>
        <li>{{ categoryName }}</li>
      </ul>
    </div>
    <div class="divider"></div>

    <product-filter :loading="loadingProducts" @filter="getProducts"></product-filter>

    <template v-if="loadingProducts">
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
      <p class="my-5">Found {{ products.length }} products.</p>

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 my-5">
        <product-card
          v-for="product in products"
          :key="`product-card-${product.id}`"
          :product="product"
          @clicked="viewProduct">
        </product-card>
      </div>
    </template> 
  </template>

  <!-- Product Details Modal -->
  <product-modal v-model="productModalVisible" :product="selectedProduct"></product-modal>
</template>