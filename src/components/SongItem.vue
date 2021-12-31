<template>
  <li :class="`song-id-${song.docId}`"
    class="snapshot example flex justify-between
    items-center p-3 pl-6 cursor-pointer transition duration-300 hover:bg-gray-50">
    <div>
      <router-link
        :to="{ name: 'song', params: { id: song.docId } }"
      >
        <span class="font-bold block text-gray-600 composition-name">
          {{ song.modified_name }}
        </span>
      </router-link>
      <span class="text-gray-500 text-sm">
        {{ song.genre }}
      </span>
    </div>

    <div class="text-gray-600 text-lg">
      <router-link
        custom
        :to="{ name: 'song', params: { id: song.docId }, hash: '#comments' }"
        v-slot="{ navigate }"
      >
        <span
          class="comments"
          @click="navigate"
        >
          <i class="fa fa-comments text-gray-600"></i>
          {{ song.comment_count }}
        </span>
      </router-link>
    </div>
  </li>
</template>
<script>
export default {
  name: 'SongItem',
  props: {
    song: {
      type: Object,
      required: true,
    },
  },
};
</script>
