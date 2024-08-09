<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const loadingProducts = ref(false)
  const loadingCategories = ref(false)
  const products = ref([])
  const categories = computed(() => {
    let categories = store.getters['category/categories']

    return categories.map(category => {
      return {
        id: category.id,
        name: category.name,
        image: category.image
      }
    })
  })

  const productModalVisible = ref(false)
  const selectedProduct = ref(null)

  const getProducts = async (params) => {
    loadingProducts.value = true

    let response = await store.dispatch('product/fetchProducts', params)

    if (response) {
      products.value = response.map(product => {
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
          category: product.category.name
        }
      })
    }

    loadingProducts.value = false
  }

  const getCategories = async () => {
    loadingCategories.value = true
    await store.dispatch('category/fetchCategories')
    loadingCategories.value = false
  }

  const viewProduct = (product) => {
    productModalVisible.value = true
    selectedProduct.value = product
  }

  onMounted(() => {
    getProducts({
      offset: 0,
      limit: 6
    })

    getCategories();
  })

</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="hero mb-5 min-h-[70vh] rounded-lg">
      <div class="hero-overlay bg-opacity-70"></div>
      <div class="hero-content justify-start w-full">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold mb-9 uppercase text-white">
            Trendy <span class="text-rose-500">Fashion</span> Collection
          </h1>
          <button class="btn btn-primary">Browse collection</button>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="my-9">
      <h1 class="text-3xl font-bold my-9">Categories</h1>

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 my-9">
        <template v-if="loadingCategories">
          <div class="flex w-full flex-col gap-4" v-for="(item, index) in 5" :key="index">
            <div class="skeleton aspect-square w-full"></div>
          </div>
        </template>

        <template v-else>
          <category-card
            v-for="category in categories"
            :key="`category-card-${category.id}`"
            :category="category">
          </category-card>
        </template>
      </div>

      <div class="flex justify-center mt-5">
        <d-button :to="{ name: 'categories.index' }" wide size="lg" color="primary">View All Categories</d-button>
      </div>
    </section>

    <!-- Products Section -->
    <section class="my-9">
      <h1 class="text-3xl font-bold my-9">Products</h1>

      <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 my-9">
        <template v-if="loadingProducts">
          <div class="flex w-full flex-col gap-4" v-for="(item, index) in 6" :key="index">
            <div class="skeleton aspect-square w-full"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-28"></div>
          </div>
        </template>

        <template v-else>
          <template v-for="product in products">
            <d-card class="product-card" bordered compact @click="viewProduct(product)">
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
        </template>
      </div>

      <div class="flex justify-center mt-5">
        <d-button wide size="lg" color="primary" :to="{ name: 'products.index' }">View All Products</d-button>
      </div>
    </section>

    <!-- Product Details Modal -->
    <product-modal v-model="productModalVisible" :product="selectedProduct"></product-modal>
  </div>
</template>

<style scoped lang="postcss">
  .hero {
    background: url('/images/hero.jpg');
    background-size: cover;
    background-position: center;
  }

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