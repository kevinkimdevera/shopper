<script setup>
  import { computed, ref, onMounted, watch, reactive } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  import { useVuelidate } from '@vuelidate/core'
  import { required, requiredIf } from '@vuelidate/validators'

  const store = useStore()
  const router = useRouter()

  const loadingCategories = ref(false)

  const formModal = ref(false)
  const deleteModal = ref(false)

  const categories = computed(() => {
    return store.getters['category/allCategories']
  })

  // Form Data
  const selectedCategoryId = ref(null)
  const selectedCategoryImage = ref(null)
  const form = reactive({
    name: '',
    image: ''
  })

  // Selected File binary
  const selectedFile = ref(null)

  // Form Rules
  const rules = computed(() => {
    return {
      name: { required },
      image: { requiredIf: requiredIf(() => !selectedCategoryId.value) }
    }
  })

  // Form Errors
  const formErrors = ref({
    name: null,
    image: null
  })

  // Vuelidate
  const v$ = useVuelidate(rules, form)

  const clearFields = () => {
    selectedCategoryId.value = null
    selectedCategoryImage.value = null
    form.name = null
    form.image = null
    selectedFile.value = null

    console.log(form.image)

  }

  const clearErrors = () => {
    formErrors.value = {
      name: null,
      image: null
    }
  }

  const getCategories = async () => {
    loadingCategories.value = true
    await store.dispatch('category/fetchCategories')
    loadingCategories.value = false
  }

  const editCategory = (category) => {
    clearFields()
    selectedCategoryId.value = category.id
    selectedCategoryImage.value = category.image
    form.name = category.name
    clearErrors()
    formModal.value = true
  }

  const openFormModal = () => {
    clearFields()
    clearErrors()
    formModal.value = true
  }

  const closeFormModal = () => {
    clearFields()
    clearErrors()
    formModal.value = false
  }

  const handleFile = (e) => {
    selectedFile.value = e.target.files[0]
  }

  const submitting = ref(false)

  const saveCategory = async function () {
    // Upload File
    const formData = new FormData()
    formData.append('file', selectedFile.value)

    // Upload Image
    const response = await store.dispatch('file/upload', formData)

    const imageFileLocation = response.location

    return store.dispatch('category/save', {
      name: form.name,
      image: imageFileLocation
    })
  }

  const updateCategory = async function () {
    // Upload File
    let imageFileLocation = selectedCategoryImage.value

    // Upload File if new file is selected
    if (selectedFile.value) {
      const formData = new FormData()
      formData.append('file', selectedFile.value)

      // Upload Image
      const response = await store.dispatch('file/upload', formData)

      imageFileLocation = response.location
    }

    return store.dispatch('category/update', {
      id: selectedCategoryId.value,
      data: {
        name: form.name,
        image: imageFileLocation
      }
    })
  }

  const handleSubmit = async () => {
    submitting.value = true
    const result = await v$.value.$validate()

    const errors = v$.value.$errors

    clearErrors()

    errors.forEach((error) => {
      const $field = error.$property
      const message = error.$message

      formErrors.value[$field] = message
    })

    if (!result) {
      submitting.value = false
      return
    }

    let response = null
    if (selectedCategoryId.value) {
      // Update Category
      response = await updateCategory()
    }
    else {
      // Save Category
      response = await saveCategory()
    }

    if (response) {
      closeFormModal()
      getCategories()
    }

    submitting.value = false
  }

  const confirmDelete = (category) => {
    selectedCategoryId.value = category.id
    deleteModal.value = true
  }

  const deleting = ref(false)
  const handleDelete = async () => {
    deleting.value = true
    await store.dispatch('category/delete', selectedCategoryId.value)
    getCategories()
    deleteModal.value = false
    deleting.value = false
    selectedCategoryId.value = null
  }

  onMounted(() => {
    getCategories()
  })
</script>

<template>
  <h1 class="text-3xl font-bold">Manage Categories</h1>
  <div class="breadcrumbs text-sm my-3">
    <ul>
      <li>Manage</li>
      <li>Categories</li>
    </ul>
  </div>

  <d-card bordered compact color="base-300" class="h-full">
    <template #title>
      <h3 class="text-lg md:text-xl lg:text-2xl">Categories</h3>

      <div class="flex justify-end items-center">
        <d-button size="sm" color="primary" @click="openFormModal">Add Category</d-button>
      </div>
    </template>

    <div class="pt-5">
      <template v-if="loadingCategories">
        
        <div class="w-full flex justify-center items-center h-[300px]">
          <div class="text-center">
            <span class="loading loading-spinner mb-3"></span>
            <div>
              Loading categories...
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="overflow-x-auto">
          <table class="table border-1 table-pin-rows">
            <thead>
              <tr>
                <th>Name</th>
                <th class="w-[200px] text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="category in categories" :key="category.id">
                <tr>
                  <td>
                    <router-link :to="{ name: 'manage.show', params: { id: category.id } }" class="flex items-center gap-3">
                      <div>
                        <img :src="category.image" :alt="category.name" class="w-10 h-10 object-cover rounded-lg" />
                      </div>
                      <div>{{ category.name }}</div>
                    </router-link>
                  </td>
                  <td class="flex gap-2 justify-center">
                    <d-button :to="{ name: 'manage.show', params: { id: category.id } }" size="sm" shape="square" color="primary">
                      <span class="icon">info</span>
                    </d-button>
                    <d-button size="sm" shape="square" color="info" @click="editCategory(category)">
                      <span class="icon">edit</span>
                    </d-button>
                    <d-button size="sm" shape="square" color="error" @click="confirmDelete(category)">
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

  <!-- Form Modal (Save or Update) -->
  <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
    <d-modal v-model="formModal" title="Category Management">
      <!-- Category Name -->
      <label class="form-control" :class="{ 'has-error': formErrors.name }">
        <div class="label">
          <span class="label-text">Category Name</span>
        </div>
        <d-input v-model="form.name" />
        <div class="label">
          <span class="label-text-alt">{{  formErrors.name  }}</span>
        </div>
      </label>

      <!-- Category Image -->
      <label class="form-control" :class="{ 'has-error': formErrors.image }">
        <div class="label">
          <span class="label-text">Image</span>
        </div>
        <d-input-file accept="image/*" v-model="form.image" ref="file" @change="handleFile" />
        <div class="label">
          <span class="label-text-alt">{{  formErrors.image ?? (selectedCategoryId ? 'Select a file to change' : null)  }}</span>
        </div>
      </label>

      <template #actions>
        <d-button color="neutral" type="button" @click="closeFormModal">Cancel</d-button>
        <d-button color="primary" type="submit" :loading="submitting">Save</d-button>
      </template>
    </d-modal>
  </form>

  <!-- Confirm Delete Modal -->
  <form @submit.prevent="handleDelete">
    <d-modal v-model="deleteModal" title="Confirm Delete" size="sm">
      <p>Are you sure you want to delete this category?</p>

      <template #actions>
        <d-button color="neutral" size="sm" @click="deleteModal = false">Cancel</d-button>
        <d-button color="error" size="sm" type="submit" :loading="deleting">Delete</d-button>
      </template>
    </d-modal>
  </form>
</template>