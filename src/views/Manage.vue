<template>
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
          <app-upload :addSong="addSong" ref="upload" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.my_songs') }}</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>

          <composition-item
            :updateSong="updateSong"
            :removeSong="removeSong"
            :updateUnsavedFlag="updateUnsavedFlag"
            v-for="(song, i) in songs"
            :key="song.docId"
            :index="i"
            :song="song" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
// import store from '@/store';
import AppUpload from '@/components/Upload.vue';
import fb from '@/includes/firebase';
import CompositionItem from '@/components/CompositionItem.vue';

export default {
  name: 'manage',
  components: {
    AppUpload,
    CompositionItem,
  },
  data: () => ({
    songs: [],
    unsavedFlag: false,
  }),
  async created() {
    const q = fb.query(fb.collection(fb.db, 'songs'), fb.where('uid', '==', fb.getAuth().currentUser.uid));
    const querySnapshot = await fb.getDocs(q);
    querySnapshot.forEach((doc) => {
      const song = {
        ...doc.data(),
        docId: doc.id,
      };
      this.songs.push(song);
    });
  },
  methods: {
    updateSong(i, values) {
      this.songs[i] = { ...this.songs[i], ...values };
    },
    removeSong(i) {
      this.songs.splice(i, 1);
    },
    addSong(song) {
      this.songs.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      // eslint-disable-next-line no-alert, no-restricted-globals
      const leave = confirm('You have some unsaves data');
      next(leave);
    }
  },
//   beforeRouteEnter(to, from, next) {
//     console.log(store.state.userLoggedIn);
//     if (store.state.userLoggedIn) {
//       next();
//     } else {
//       next({ name: 'home' });
//     }
//   },
};
</script>
