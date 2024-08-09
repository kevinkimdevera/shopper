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

  const search = ref(null)
  const priceMin = ref(null)
  const priceMax = ref(null)

  const hasFilters = computed(() => {
    return search.value || priceMin.value || priceMax.value
  })

  const resetFilters = () => {
    if (!hasFilters.value) {
      return
    }

    search.value = null
    priceMin.value = null
    priceMax.value = null

    getProducts()
  }

  const getProducts = () => {
    loadingProducts.value = true

    let priceMinValue = priceMin.value
    let priceMaxValue = priceMax.value

    // If priceMin is present and priceMax is not
    if (priceMinValue && !priceMaxValue) {
      priceMaxValue = 999999999;
    }

    // If priceMax is present and priceMin is not
    if (priceMaxValue && !priceMinValue) {
      priceMinValue = 1;
    }

    store.dispatch('product/fetchProducts', {
      categoryId: props.id,
      title: search.value,
      price_min: priceMinValue,
      price_max: priceMaxValue
    }).then((response) => {
      products.value = response.map((product) => {
        let productImage = product.images[0];

        /// There's an instance where the product image is a stringified JSON
        try {
          productImage = JSON.parse(productImage)[0]
        } catch (error) {
          //
        }

        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price),
          image: productImage,
        }
      })
    })
    .catch((e) => {

    })
    .finally(() => {
      loadingProducts.value = false
    })
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

    <form class="flex flex-col md:flex-row gap-3" @submit.prevent="getProducts">
      <div class="flex-1">
        <d-input placeholder="Search products" bordered v-model="search" />
      </div>
      <div class="flex flex-none gap-3 items-center">
        <d-input type="number" min="0" placeholder="Price (Min)" bordered class="w-1/4" v-model="priceMin" />
        <span>-</span>
        <d-input type="number" min="0" placeholder="Price (Max)" bordered class="w-1/4" v-model="priceMax" />
      </div>
      <div class="flex flex-none justify-end gap-3">
        <d-button color="neutral" type="button" @click="resetFilters">Reset</d-button>
        <d-button color="primary" type="submit" :loading="(loadingProducts && hasFilters)">Search</d-button>
      </div>
    </form>

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
        <template v-for="product in products">
          <d-card class="product-card h-full" bordered compact @click="viewProduct(product)">
            <template #title>
              <div class="text-lg">{{ product.title }}</div>
            </template>
            <template #image-top>
              <img class="product-img" :src="product.image" :alt="product.name" />
            </template>

            <p class="text-sm">{{ product.category }}</p>
            <p class="text-primary font-bold text-xl">&dollar; {{ product.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
          </d-card>
        </template>
      </div>
    </template> 
  </template>

  <!-- Product Details Modal -->
  <product-modal v-model="productModalVisible" :product="selectedProduct"></product-modal>
</template>

<style scoped lang="postcss">
  .product-img {
    aspect-ratio: 1 / 1;
    object-fit: cover;
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