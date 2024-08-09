<script setup>
  import { computed, reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useStore } from 'vuex'

  const router = useRouter()
  const store = useStore()

  const cartItems = computed(() => store.getters['cart/items'])
  const cartItemCount = computed(() => store.getters['cart/items_count'])
  const cartTotal = computed(() => store.getters['cart/total'])

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

  const removeFromCart = (productId) => {
    store.dispatch('cart/removeItem', productId)
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

        <!-- Cart -->
        <d-dropdown align="end" class="card w-[320px]">
          <template #label>
            <d-button shape="square" ghost>
              <div class="indicator">
                <span class="indicator-item badge badge-secondary" v-if="cartItemCount > 0">{{ cartItemCount }}</span>
                <i class="icon">shopping_cart</i>
              </div>
            </d-button>
          </template>

          <div class="card-title justify-between p-3 text-sm border-b border-b-base-100">
            <div>Cart</div>

            <div>{{ cartItemCount }} items</div>
          </div>

          <div class="card-body p-3 h-[320px] overflow-y-auto custom-scroll">
            <div class="text-center h-[320px] flex justify-center items-center text-neutral-content" v-if="cartItemCount < 1">
              <div>
                <span class="icon text-5xl mb-3">shopping_cart</span>
                <p>Your cart is empty</p>
              </div>
            </div>

            <template v-else>
              <template v-for="item in cartItems" :key="item.id">
                <div class="rounded-lg flex justify-between hover:bg-base-300 p-3 cursor-pointer" >
                  <div class="flex flex-1 max-w-[200px] gap-3 items-center">
                    <img :src="item.image" :alt="item.title" class="w-12 h-12 object-cover rounded-lg" />
                    <div class="overflow-hidden">
                      <p class="text-sm font-bold truncate overflow-ellipsis">{{ item.title }}</p>
                      <p class="text-sm">&dollar;{{ item.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}</p>
                    </div>
                  </div>
                  <div class="flex-none">
                    <d-button color="error" @click="removeFromCart(item.id)" shape="circle" ghost size="sm">
                      <i class="icon">close</i>
                    </d-button>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <div class="card-title justify-between p-3 text-sm border-t border-t-base-100">
            <div>Total</div>

            <div>&dollar; {{ cartTotal }}</div>
          </div>
        </d-dropdown>

        <d-button shape="square" ghost :to="{ name: 'manage.index' }">
          <i class="icon">settings</i>
        </d-button>
      </div>
    </div>

    <main class="mt-[64px] flex flex-col">
      <section class="p-5 flex-1">
        <router-view></router-view>
      </section>

      <footer class="flex-none footer bg-base-200 text-base-content p-10">
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
    </main>
  </div>
</template>

<style scoped>
  main {
    min-height: calc(100vh - 64px);
  }
</style>