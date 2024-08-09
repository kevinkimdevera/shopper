import { createApp } from 'vue'

// Axios Configuration
import axios from 'axios'
window.axios = axios
window.axios.defaults.baseURL = import.meta.env.VITE_API_URL
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Router
import router from '@/router';

// Store
import store from '@/store';

// App component
import App from '@/App.vue'

// UI Components
import DButton from '@components/ui/Button.vue'
import DCard from '@components/ui/Card.vue'
import DDropdown from '@components/ui/Dropdown.vue';
import DModal from '@components/ui/Modal.vue';

// Custom Components
import CategoryCard from '@components/ui/CategoryCard.vue';
import ProductCard from '@components/ui/ProductCard.vue';
import ProductModal from '@components/ui/ProductModal.vue';

// Form Components
import DInput from '@components/form/InputText.vue'
import DInputFile from '@components/form/InputFile.vue'
import DTextarea from '@components/form/Textarea.vue'

// Create the app
const app = createApp(App);

// Register the UI components
app.component('d-button', DButton);
app.component('d-input', DInput);
app.component('d-input-file', DInputFile);
app.component('d-card', DCard);
app.component('d-dropdown', DDropdown);
app.component('d-modal', DModal);
app.component('d-textarea', DTextarea);

// Custom Components
app.component('category-card', CategoryCard);
app.component('product-card', ProductCard);
app.component('product-modal', ProductModal);

app.use(router)
  .use(store)
  .mount('#app');