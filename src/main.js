import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import fb from './includes/firebase';
import './assets/tailwind.css';
import './assets/main.css';
import VeeValidatePlugin from './includes/validation';

let app;
fb.getAuth().onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidatePlugin, { someField: 'hello' });

    app.mount('#app');
  }
});
