<script setup>
  import { ref, computed } from 'vue'

  const props = defineProps({
    loading: {
      type: Boolean,
      default: false,
    }
  })

  const search = ref('')
  const priceMin = ref(null)
  const priceMax = ref(null)

  const hasFilters = computed(() => {
    return !!search.value || !!priceMin.value || !!priceMax.value
  })

  const emit = defineEmits(['filter'])

  const handleSubmit = () => {
    let priceMinValue = priceMin.value
    let priceMaxValue = priceMax.value

    // If priceMin is present and priceMax is not, set priceMax to a large number
    if (priceMinValue && !priceMaxValue) {
      priceMaxValue = 999999999;
    }

    // If priceMax is present and priceMin is not, set priceMin to 1
    if (priceMaxValue && !priceMinValue) {
      priceMinValue = 1;
    }

    emit('filter', {
      title: search.value,
      price_min: priceMinValue,
      price_max: priceMaxValue,
    })
  }

  const handleReset = () => {
    if (!hasFilters.value) {
      return
    }

    emit('reset')

    search.value = ''
    priceMin.value = null
    priceMax.value = null

    emit('filter', {
      title: null,
      price_min: null,
      price_max: null,
    })
  }
</script>

<template>
  <form class="flex flex-col md:flex-row gap-3" @submit.prevent="handleSubmit">
    <div class="flex-1">
      <d-input placeholder="Search products" bordered v-model="search" />
    </div>
    <div class="flex flex-none gap-3 items-center">
      <d-input type="number" min="0" placeholder="Price (Min)" bordered class="w-1/4" v-model="priceMin" />
      <span>-</span>
      <d-input type="number" min="0" placeholder="Price (Max)" bordered class="w-1/4" v-model="priceMax" />
    </div>
    <div class="flex flex-none justify-end gap-3">
      <d-button color="neutral" type="button" @click="handleReset">Reset</d-button>
      <d-button color="primary" type="submit" :loading="(loading && hasFilters)">Search</d-button>
    </div>
  </form>
</template>