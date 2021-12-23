<template>
    <div class="p-6">
        <div class="border border-gray-200 p-3 mb-4 rounded">
            <div v-if="!showForm">
                <h4 class="inline-block text-2xl font-bold">
                    {{ song.modified_name }}
                </h4>
                <button @click.prevent="deleteSong"
                    class="ml-1 py-1 px-2 text-sm rounded text-white bg-red-600 float-right">
                  <i class="fa fa-times"></i>
                </button>
                <button @click.prevent="showForm = !showForm"
                    class="ml-1 py-1 px-2 text-sm rounded text-white bg-blue-600 float-right">
                  <i class="fa fa-pencil-alt"></i>
                </button>
            </div>
            <div v-else>
                <div class="text-white text-center font-bold p-5 mb-4"
                    v-if="show_alert" :class="alert_variant">
                    {{ alert_msg }}
                </div>
                <vee-form :validation-schema="schema" @submit="edit" :initial-values="song" >
                  <div class="mb-3">
                    <label class="inline-block mb-2">Song Title</label>
                    <vee-field type="text" name="modified_name"
                        @input="updateUnsavedFlag(true)"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Song Title" />
                      <ErrorMessage class="text-red-600" name="modified_name" />
                  </div>
                  <div class="mb-3">
                    <label class="inline-block mb-2">Genre</label>
                    <vee-field type="text" name="genre"
                        @input="updateUnsavedFlag(true)"
                      class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300
                        transition duration-500 focus:outline-none focus:border-black rounded"
                      placeholder="Enter Genre" />
                      <ErrorMessage class="text-red-600" name="genre" />
                  </div>
                  <button :disabled="in_submission"
                    type="submit" class="py-1.5 px-3 rounded text-white bg-green-600">
                    Submit
                  </button>
                  <button @click.prevent="showForm = !showForm"
                    :disabled="in_submission"
                    type="submit" class="py-1.5 px-3 rounded text-white bg-gray-600">
                    Go Back
                  </button>
                </vee-form>
            </div>
        </div>
    </div>
</template>
<script>
import fb from '@/includes/firebase';

export default {
  name: 'CompositionItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
    updateSong: {
      type: Function,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    removeSong: {
      type: Function,
      required: true,
    },
    updateUnsavedFlag: {
      type: Function,
    },
  },
  data: () => ({
    showForm: false,
    schema: {
      modified_name: 'required',
      genre: 'required',
    },
    in_submission: false,
    show_alert: false,
    alert_variant: 'bg-blue-500',
    alert_msg: 'Please wait! we are logging you in',
  }),
  methods: {
    async edit(values) {
      console.log(values);
      this.in_submission = true;
      this.show_alert = true;
      this.alert_variant = 'bg-blue-500';
      this.alert_msg = 'Please wait! Updatting song info';

      try {
        const songDocumentRef = fb.doc(fb.db, 'songs', this.song.docId);
        await fb.updateDoc(songDocumentRef, values);
      } catch (error) {
        this.in_submission = false;
        this.alert_variant = 'bg-red-500';
        this.alert_msg = 'Something went wrong! Error';
        return;
      }

      this.updateSong(this.index, values);
      this.in_submission = false;
      this.alert_variant = 'bg-green-500';
      this.alert_msg = 'success';
      this.showForm = false;

      this.updateUnsavedFlag(false);
    },
    async deleteSong() {
      try {
        const songStorageRef = fb.ref(fb.storage, `songs/${this.song.original_name}`);
        await fb.deleteObject(songStorageRef);

        const songDocumentRef = fb.doc(fb.db, 'songs', this.song.docId);
        await fb.deleteDoc(songDocumentRef);
      } catch (error) {
        console.log(error);
      }

      this.removeSong(this.index);
    },
  },
};
</script>
