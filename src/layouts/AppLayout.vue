<script setup>
  import { computed, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const cartItems = computed(() => store.getters['cart/items'])
  const cartItemCount = computed(() => store.getters['cart/items_count'])

  const darkMode = ref(true);

  watch(darkMode, (value) => {
    if (value) {
      document.documentElement.dataset.theme = 'dark'
    } else {
      document.documentElement.dataset.theme = 'light'
    }

    localStorage.setItem('darkMode', value)
  });

  // Autoload dark mode
  if (localStorage.getItem('darkMode')) {
    darkMode.value = localStorage.getItem('darkMode') === 'true'
  }
</script>

<template>
  <div>
    <div class="navbar bg-base-300 fixed top-0 z-50">
      <div class="navbar-start">
        <d-button :to="{ name: 'home' }" ghost>
          <i class="icon">shopping_bag</i> Shopper
        </d-button>
      </div>

      <div class="navbar-end">
        <label class="swap swap-rotate btn btn-square btn-ghost">
          <input type="checkbox" class="theme-controller" v-model="darkMode" />
          <div class="swap-on">
            <i class="icon">dark_mode</i>
          </div>
          <div class="swap-off">
            <i class="icon">light_mode</i>
          </div>
        </label>

        <d-button shape="square" ghost>
          <div class="indicator">
            <span class="indicator-item badge badge-secondary" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
            <i class="icon">shopping_cart</i>
          </div>
        </d-button>

        <d-button shape="square" ghost>
          <i class="icon">account_circle</i>
        </d-button>
      </div>
    </div>

    <main class="p-5 mt-[64px]">
      <router-view></router-view>
    </main>

    <footer class="footer bg-base-200 text-base-content p-10">
      <aside>
        <span class="icon text-5xl">
          shopping_bag
        </span>
        <p class="text-xl">
          Shopper
        </p>
        <p>&copy; {{ new Date().getFullYear() }}</p>
      </aside>
      <nav>
        <h6 class="footer-title">Collection</h6>
        <a class="link link-hover">Products</a>
        <a class="link link-hover">Categories</a>
      </nav>
      <nav>
        <h6 class="footer-title">Company</h6>
        <a class="link link-hover">About us</a>
        <a class="link link-hover">Contact</a>
      </nav>
      <nav>
        <h6 class="footer-title">Legal</h6>
        <a class="link link-hover">Terms of use</a>
        <a class="link link-hover">Privacy policy</a>
        <a class="link link-hover">Cookie policy</a>
      </nav>
    </footer>
  </div>
</template>

<style scoped>
</style>