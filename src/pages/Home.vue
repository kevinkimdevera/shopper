<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const loadingProducts = ref(false)
  const loadingCategories = ref(false)
  const products = ref([])
  const categories = computed(() => store.getters['category/categories'])

  const productModalVisible = ref(false)
  const selectedProduct = ref(null)

  const getProducts = async (params) => {
    loadingProducts.value = true

    let response = await store.dispatch('product/fetchProducts', params)

    if (response) {
      products.value = response.map(product => {
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: parseFloat(product.price).toFixed(2),
          image: product.images[0],
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

    <section class="my-9">
      <h1 class="text-3xl font-bold my-9">Products</h1>

      <div class="grid grid-cols-6 gap-4 my-9">
        <template v-if="loadingProducts">
          <div class="flex w-52 flex-col gap-4" v-for="(item, index) in 6" :key="index">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
          </div>
        </template>

        <template v-else>
          <template v-for="product in products">
            <d-card class="product-card" bordered @click="viewProduct(product)">
              <template #title>
                {{ product.title }}
              </template>
              <template #image-top>
                <img class="product-img" :src="product.image" :alt="product.name" />
              </template>
              <p>{{ product.category }}</p>
              <p class="text-primary">&dollar; {{ product.price }}</p>
            </d-card>
          </template>
        </template>
      </div>

      <div class="flex justify-center mt-5">
        <d-button wide size="lg" color="primary">View All Products</d-button>
      </div>
    </section>

    <section class="my-9">
      <h1 class="text-3xl font-bold my-9">Categories</h1>

      <div class="grid grid-cols-5 gap-4 my-9">
        <template v-if="loadingCategories">
          <div class="flex w-full flex-col gap-4" v-for="(item, index) in 5" :key="index">
            <div class="skeleton aspect-square w-full"></div>
          </div>
        </template>

        <template v-else>
          <template v-for="category in categories">
            <d-card class="image-full" bordered>
              <template #title>
                <h3 class="text-3xl">{{ category.name }}</h3>
              </template>
              <template #image-top>
                <img class="product-img" :src="category.image" :alt="category.name"
                  onerror="this.src='images/tag.png'"
                />
              </template>
            </d-card>
          </template>
        </template>
      </div>
    </section>

    <product-modal v-model="productModalVisible" :product="selectedProduct"></product-modal>
  </div>
</template>

<style scoped lang="postcss">
  .hero {
    background: url('images/hero.jpg');
    background-size: cover;
    background-position: center;
  }

  .product-img {
    aspect-ratio: 1 / 1;
    object-fit: cover;
  }

  .card {
    @apply cursor-pointer shadow-xl hover:shadow-2xl;

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