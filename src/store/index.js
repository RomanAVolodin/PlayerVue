import { createStore } from 'vuex';
import { getAuth } from 'firebase/auth';
import { Howl } from 'howler';

import fb from '@/includes/firebase';
import helper from '@/includes/helper';

export default createStore({
  state: {
    authModalShow: false,
    userLoggedIn: false,
    currentSong: {},
    sound: {},
    seek: '00:00',
    duration: '00:00',
  },
  mutations: {
    toggleAuthModal: (state) => {
      state.authModalShow = !state.authModalShow;
    },
    toggleAuth: (state) => {
      state.userLoggedIn = !state.userLoggedIn;
    },
    newSong: (state, payload) => {
      state.currentSong = payload;
      state.sound = new Howl({
        src: [payload.url],
        html5: true,
      });
    },
    updatePosition(state) {
      state.seek = helper.formatTime(state.sound.seek());
      state.duration = helper.formatTime(state.sound.duration());
    },
  },
  getters: {
    // authModalShow: (state) => state.authModalShow,
    playing: (state) => {
      if (state.sound.playing) {
        return state.sound.playing();
      }
      return false;
    },
  },
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
    async addSong(ctx, payload) {
      const ref = await fb.addDoc(fb.collection(fb.db, 'songs'), payload);
      return ref;
    },
    async newSong({ commit, state, dispatch }, payload) {
      commit('newSong', payload);
      state.sound.play();
      state.sound.on('play', () => {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      });
    },
    async toggleAudio({ state }) {
      if (!state.sound.playing) {
        return;
      }
      if (state.sound.playing()) {
        state.sound.pause();
      } else {
        state.sound.play();
      }
    },
    progress({ commit, state, dispatch }) {
      commit('updatePosition');

      if (state.sound.playing()) {
        requestAnimationFrame(() => {
          dispatch('progress');
        });
      }
    },
  },
});
