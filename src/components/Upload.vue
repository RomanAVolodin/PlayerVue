<template>
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">{{ $t('manage.upload') }}</span>
            <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <div
              class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed
                border-gray-400 text-gray-400 transition duration-500 hover:text-white
                hover:bg-green-400 hover:border-green-400 hover:border-solid"
                :class="{ 'bg-green-400 border-green-400 border-solid': is_dragover }"
                @drag.prevent.stop=""
                @dragstart.prevent.stop=""
                @dragend.prevent.stop="is_dragover = false"
                @dragover.prevent.stop="is_dragover = true"
                @dragenter.prevent.stop="is_dragover = true"
                @dragleave.prevent.stop="is_dragover = false"
                @drop.prevent.stop="upload"
                >
              <h5>Drop your files here</h5>
            </div>
            <input type="file" multiple  @change="upload"/>

            <hr class="my-6" />
            <div class="mb-4" v-for="file in uploads" :key="file.name">
                <div class="font-bold text-sm" :class="file.text_class">
                    <i :class="file.icon"></i>
                  {{ file.name }}
                </div>
                <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
                    <div class="transition-all progress-bar"
                        :class="file.variant"
                        :style="{ width: file.current_progress + '%' }"></div>
                </div>
            </div>
          </div>
    </div>
</template>
<script>
import fb from '@/includes/firebase';

export default {
  name: 'Upload',
  props: {
    addSong: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    is_dragover: false,
    uploads: [],
  }),
  methods: {
    async upload($event) {
      this.is_dragover = false;
      const files = $event.dataTransfer
        ? [...$event.dataTransfer.files]
        : [...$event.target.files];
      files.forEach((file) => {
        if (file.type !== 'audio/mpeg') {
          return;
        }

        if (!navigator.onLine) {
          this.uploads.push({
            task: {},
            current_progress: 100,
            name: file.name,
            variant: 'bg-red-400',
            icon: 'fas fa-times',
            text_class: 'bg-red-400',
          });
          return;
        }

        const storageRef = fb.ref(fb.storage, `songs/${file.name}`);
        const task = fb.uploadBytesResumable(storageRef, file);
        const uploadIndex = this.uploads.push({
          task,
          current_progress: 0,
          name: file.name,
          variant: 'bg-blue-400',
          icon: 'fas fa-spinner fa-spin',
          text_class: '',
        }) - 1;
        const fileUploading = this.uploads[uploadIndex];

        task.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            fileUploading.current_progress = progress;
          },
          (error) => {
            console.log(error);
            fileUploading.variant = 'bg-red-400';
            fileUploading.icon = 'fas fa-times';
            fileUploading.text_class = 'text-red-400';
          },
          async () => {
            const song = {
              uid: fb.getAuth().currentUser.uid,
              display_name: fb.getAuth().currentUser.displayName,
              original_name: task.snapshot.ref.name,
              modified_name: task.snapshot.ref.name,
              genre: '',
              comment_count: 0,
            };

            song.url = await fb.getDownloadURL(task.snapshot.ref);

            const ref = await this.$store.dispatch('addSong', song);

            song.docId = ref.id;
            this.addSong(song);

            fileUploading.variant = 'bg-green-400';
            fileUploading.icon = 'fas fa-check';
            fileUploading.text_class = 'text-green-400';
          });
      });
      console.log(files);
    },
    cancelUploads() {
      this.uploads.forEach((file) => {
        file.task.cancel();
      });
    },
  },
  beforeUnmount() {
    this.cancelUploads();
  },
};
</script>
