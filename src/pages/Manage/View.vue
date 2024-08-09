<script setup>
  import { onMounted, ref, computed, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { onBeforeRouteUpdate, useRouter } from 'vue-router';
  import { useVuelidate } from '@vuelidate/core'
  import { required, requiredIf } from '@vuelidate/validators'

  const store = useStore()
  const router = useRouter()

  const props = defineProps({
    id: {
      type: [String, Number],
      required: true
    }
  })

  const loading = ref(false)
  const loadingProducts = ref(false)
  const error = ref(false)
  const category = ref(null)
  const products = ref([])

  const categoryName = computed(() => {
    return category.value ? category.value.name : ''
  })

  const formModal = ref(false)
  const selectedProductId = ref(null)
  const selectedProductImage = ref(null)
  const form = reactive({
    name: '',
    image: '',
    description: '',
    price: ''
  })

  const rules = computed(() => {
    return {
      name: { required },
      image: { requiredIf: requiredIf(() => !selectedProductId.value) },
      description: { required },
      price: { required }
    }
  })

  const formErrors = ref({
    name: null,
    image: null,
    description: null,
    price: null
  })

  // Vuelidate
  const v$ = useVuelidate(rules, form)

  // Selected File binary
  const selectedFile = ref(null)

  const showCategory = () => {
    loading.value = true
    store.dispatch('category/show', props.id)
      .then((response) => {
        category.value = response

        // Get products
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

  const productSearch = ref('')
  const getProducts = () => {
    loadingProducts.value = true
    store.dispatch('product/fetchProducts', {
      categoryId: props.id,
      title: productSearch.value
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

  const clearForm = () => {
    form.name = ''
    form.image = ''
    form.description = ''
    form.price = ''
    selectedProductId.value = null
    selectedProductImage.value = null
  }

  const clearErrors = () => {
    formErrors.value = {
      name: null,
      image: null,
      description: null,
      price: null
    }
  }

  const openFormModal = () => {
    clearForm()
    clearErrors()
    formModal.value = true
  }

  const closeFormModal = () => {
    clearForm()
    clearErrors()
    formModal.value = false
  }

  const editProduct = (product) => {
    selectedProductId.value = product.id
    selectedProductImage.value = product.image
    form.name = product.title
    form.description = product.description
    form.price = parseFloat(product.price)
    formModal.value = true
  }

  const handleFile = (e) => {
    selectedFile.value = e.target.files[0]
  }

  const saveProduct = async () => {
    // Upload File
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // Upload Image
    const response = await store.dispatch('file/upload', formData)

    const imageFileLocation = response.location

    return store.dispatch('product/save', {
      title: form.name,
      description: form.description,
      price: form.price,
      categoryId: props.id,
      images: [ imageFileLocation ]
    })
  }

  const updateProduct = async () => {
    // Upload File
    let imageFileLocation = selectedProductImage.value

    // Upload File if new file is selected
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('file', selectedFile.value)

      // Upload Image
      const response = await store.dispatch('file/upload', formData)

      imageFileLocation = response.location
    }

    return store.dispatch('product/update', {
      id: selectedProductId.value,
      data: {
        title: form.name,
        description: form.description,
        price: form.price,
        images: [ imageFileLocation ]
      }
    })
  }

  const saving = ref(false)
  const handleSubmit = async () => {
    saving.value = true

    const result = await v$.value.$validate()

    const errors = v$.value.$errors

    clearErrors()

    errors.forEach((error) => {
      const $field = error.$property
      const message = error.$message

      formErrors.value[$field] = message
    })

    if (!result) {
      saving.value = false
      return
    }

    let response = null
    // Save or Update
    if (selectedProductId.value) {
      // Update
      response = await updateProduct()
    }
    else {
      // Save
      response = await saveProduct()
    }

    if (response) {
      clearForm()
      closeFormModal()
      getProducts()
    }

    saving.value = false
  }

  const deleteModal = ref(false)
  const deleting = ref(false)
  const confirmDelete = (product) => {
    selectedProductId.value = product
    deleteModal.value = true
  }

  const handleDelete = async () => {
    deleting.value = true
    await store.dispatch('product/delete', selectedProductId.value)
    getProducts()
    deleteModal.value = false
    deleting.value = false
    selectedProductId.value = null
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
        <li>Manage</li>
        <li><router-link :to="{ name: 'manage.index' }">Categories</router-link></li>
        <li>{{ categoryName }}</li>
      </ul>
    </div>

    <d-card bordered compact color="base-300" class="h-full">
      <template #title>
        <h3 class="text-lg md:text-xl lg:text-2xl">Products</h3>

        <div class="flex justify-end items-center gap-3">
          <form class="input-group w-[250px]" @submit.prevent="getProducts">
              <d-input size="sm" placeholder="Search..." ghost v-model="productSearch" />
              <d-button size="sm" shape="square">
                  <span class="icon">search</span>
              </d-button>
          </form>

          <d-button size="sm" color="primary" @click="openFormModal">Add Product</d-button>
        </div>
      </template>

      <div class="pt-5">
        <template v-if="loadingProducts">
          <div class="w-full flex justify-center items-center h-[300px]">
            <div class="text-center">
              <span class="loading loading-spinner mb-3"></span>
              <div>
                Loading products...
              </div>
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
          <div class="overflow-x-auto">
            <table class="table border-1 table-pin-rows">
              <thead>
                <tr>
                  <th class="w-[300px]">Name</th>
                  <th>Description</th>
                  <th class="w-[200px] text-center">Price</th>
                  <th class="w-[200px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="product in products" :key="product.id">
                  <tr>
                    <td>
                      <a class="flex items-center gap-3">
                        <div>
                          <img :src="product.image" :alt="product.title" class="w-10 h-10 object-cover rounded-lg" />
                        </div>
                        <div>{{ product.title }}</div>
                      </a>
                    </td>
                    <td>{{ product.description }}</td>
                    <td class="text-center">&dollar; {{ product.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</td>
                    <td class="flex gap-2 justify-center">
                      <d-button size="sm" shape="square" color="info" @click="editProduct(product)">
                        <span class="icon">edit</span>
                      </d-button>
                      <d-button size="sm" shape="square" color="error" @click="confirmDelete(product.id)">
                        <span class="icon">delete</span>
                      </d-button>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </template>
      </div>
    </d-card>
  </template>

  <!-- Form Modal (Save or Update) -->
  <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
    <d-modal v-model="formModal" title="Category Management">
      <!-- Product Name -->
      <label class="form-control" :class="{ 'has-error' : formErrors.name }">
        <div class="label">
          <span class="label-text">Product Name</span>
        </div>
        <d-input v-model="form.name" />
        <div class="label">
          <span class="label-text-alt">{{ formErrors.name }}</span>
        </div>
      </label>

      <!-- Product Name -->
      <label class="form-control" :class="{ 'has-error' : formErrors.price }">
        <div class="label">
          <span class="label-text">Product Price</span>
        </div>
        <d-input v-model="form.price" type="number" min="1" />
        <div class="label">
          <span class="label-text-alt">{{ formErrors.price }}</span>
        </div>
      </label>

      <!-- Product Image -->
      <label class="form-control" :class="{ 'has-error' : formErrors.image }">
        <div class="label">
          <span class="label-text">Image</span>
        </div>
        <d-input-file accept="image/*" v-model="form.image" ref="file" @change="handleFile" />
        <div class="label">
          <span class="label-text-alt">{{ formErrors.image ?? (selectedProductId ? 'Select a file to change' : null) }}</span>
        </div>
      </label>

      <!-- Product Description -->
      <label class="form-control" :class="{ 'has-error' : formErrors.description }">
        <div class="label">
          <span class="label-text">Description</span>
        </div>
        <d-textarea v-model="form.description" />
        <div class="label">
          <span class="label-text-alt">{{ formErrors.description }}</span>
        </div>
      </label>

      <template #actions>
        <d-button color="neutral" type="button" @click="closeFormModal">Cancel</d-button>
        <d-button color="primary" type="submit" :loading="saving">Save</d-button>
      </template>
    </d-modal>
  </form>
  
  <!-- Confirm Delete Modal -->
  <form @submit.prevent="handleDelete">
    <d-modal v-model="deleteModal" title="Confirm Delete" size="sm">
      <p>Are you sure you want to delete this product?</p>

      <template #actions>
        <d-button color="neutral" size="sm" @click="deleteModal = false">Cancel</d-button>
        <d-button color="error" size="sm" type="submit" :loading="deleting">Delete</d-button>
      </template>
    </d-modal>
  </form>
</template>