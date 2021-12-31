import { createStore } from 'vuex';
import { cloneDeep } from 'lodash';
import auth from '@/store/modules/auth';
import player from '@/store/modules/player';

jest.mock('@/includes/firebase', () => ({
  signInWithEmailAndPassword: () => Promise.resolve(),
  getAuth: () => Promise.resolve(),
}));

describe('Vuex store', () => {
  it('toggleAuth mutation sets userLoggedIn to true ', () => {
    const clonedAuth = cloneDeep(auth);
    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.userLoggedIn).not.toBe(true);
    store.commit('toggleAuth');
    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  it('login action sets userLoggedIn to true', async () => {
    expect.assertions(2);

    const clonedAuth = cloneDeep(auth);
    const store = createStore({
      modules: {
        auth: clonedAuth,
      },
    });

    expect(store.state.auth.userLoggedIn).toBe(false);
    await store.dispatch('login', { email: '', password: '' });
    expect(store.state.auth.userLoggedIn).toBe(true);
  });

  it('playing returns true idf audio is playing', async () => {
    const state = {
      sound: {
        playing: () => true,
      },
    };
    const result = player.getters.playing(state);
    expect(result).toEqual(true);
  });
});
