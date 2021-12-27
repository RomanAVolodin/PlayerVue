import { getAuth } from 'firebase/auth';
import fb from '@/includes/firebase';

export default {
  state: {
    authModalShow: false,
    userLoggedIn: false,
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
  },
  getters: {},
  actions: {
    async register({ commit }, payload) {
      const userCred = await fb.createUserWithEmailAndPassword(
        fb.getAuth(),
        payload.email,
        payload.password,
      );
      await fb.setDoc(fb.doc(fb.db, 'users', userCred.user.uid), {
        name: payload.name,
        email: payload.email,
        age: payload.age,
        country: payload.country,
      });

      const user = fb.getAuth().currentUser;
      await fb.updateProfile(
        user,
        {
          displayName: payload.name,
        },
      );

      commit('toggleAuth');
    },
    init_login({ commit }) {
      const user = fb.getAuth().currentUser;

      if (user) {
        commit('toggleAuth');
      }
    },
    async login({ commit }, payload) {
      await fb.signInWithEmailAndPassword(
        fb.getAuth(),
        payload.email,
        payload.password,
      );

      commit('toggleAuth');
    },
    async signOut({ commit }, payload) {
      await fb.signOut(getAuth());
      commit('toggleAuth');
      if (payload.route.meta.requiresAuth) {
        payload.router.push({ name: 'home' });
      }
    },
  },
};
