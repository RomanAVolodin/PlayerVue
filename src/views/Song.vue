<template>
    <div v-if="song">
        <section class="w-full mb-8 py-14 text-center text-white relative">
            <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg"
                style="background-image: url(/assets/img/song-header.png)">
            </div>
            <div class="container mx-auto flex items-center">
                <button @click.prevent="newSong(song)"
                  type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full
                    focus:outline-none">
                    <i class="fas fa-play"></i>
                </button>
                <div class="z-50 text-left ml-8">
                    <div class="text-3xl font-bold">
                        {{ song.modified_name }}
                    </div>
                    <div>
                        {{ song.genre }}
                    </div>
                </div>
            </div>
        </section>
    <!-- Main Content -->
    <section class="container mx-auto mt-6">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">Comments ({{ song.comment_count }})</span>
            <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
            <div class="text-white text-center font-bold p-5 mb-4"
                v-if="comment_show_alert" :class="comment_alert_variant">
                {{ comment_alert_msg }}
            </div>
            <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
                <vee-field as="textarea" name="comment"
                    class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition
                    duration-500 focus:outline-none focus:border-black rounded mb-4"
                    placeholder="Your comment here..."></vee-field>
                    <ErrorMessage class="text-red-600 block" name="comment" />
                <button type="submit"
                    :disabled="comment_in_submission"
                    class="py-1.5 px-3 rounded text-white bg-green-600">Submit</button>
            </vee-form>
            <select v-model="sort"
                class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition
                duration-500 focus:outline-none focus:border-black rounded">
                <option value="1">Latest</option>
                <option value="2">Oldest</option>
            </select>
        </div>
        </div>
    </section>
    <ul class="container mx-auto">
        <li v-for="comment in sortedComments" :key="comment.docId"
            class="p-6 bg-gray-50 border border-gray-200">
        <!-- Comment Author -->
        <div class="mb-5">
            <div class="font-bold">
                {{ comment.name }}
            </div>
            <time>
                {{ comment.datePosted }}
            </time>
        </div>

        <p>
            {{ comment.content }}
        </p>
        </li>
    </ul>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import fb from '@/includes/firebase';

export default {
  name: 'Song',
  data: () => ({
    song: {},
    comments: [],
    sort: '1',
    schema: {
      comment: 'required:min:3',
    },
    comment_in_submission: false,
    comment_show_alert: false,
    comment_alert_variant: 'bg-blue-500',
    comment_alert_msg: 'Please wait! comment is being submitting',
  }),
  methods: {
    ...mapActions(['newSong']),
    async addComment(values, { resetForm }) {
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = 'bg-blue-500';

      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: fb.getAuth().currentUser.displayName,
        uid: fb.getAuth().currentUser.uid,
      };
      try {
        const doc = await fb.addDoc(fb.collection(fb.db, 'comments'), comment);
        comment.docId = doc.id;
        this.comments.push(comment);
      } catch (error) {
        this.comment_in_submission = true;
        this.comment_show_alert = true;
        this.comment_alert_variant = 'bg-red-500';
        this.comment_alert_msg = 'Error occured!';
        return;
      }

      this.song.comment_count += 1;

      const songDocumentRef = fb.doc(fb.db, 'songs', this.song.docId);
      await fb.updateDoc(songDocumentRef, {
        comment_count: this.song.comment_count,
      });

      this.comment_in_submission = false;
      this.comment_alert_msg = 'Comment added';
      this.comment_alert_variant = 'bg-green-500';
      resetForm();
    },
    async getComments() {
      const q = fb.query(fb.collection(fb.db, 'comments'), fb.where('sid', '==', this.$route.params.id));
      const querySnapshot = await fb.getDocs(q);
      querySnapshot.forEach((doc) => {
        const song = {
          ...doc.data(),
          docId: doc.id,
        };
        this.comments.push(song);
      });
    },
  },
  async created() {
    const { getDoc, doc, db } = fb;
    const document = await getDoc(doc(db, 'songs', this.$route.params.id));
    if (!document.exists) {
      this.$router.push({ name: 'home' });
      return;
    }
    this.song = {
      ...document.data(),
      docId: document.id,
    };
    const { sort } = this.$route.query;
    this.sort = sort === '1' || sort === '2' ? sort : '1';

    console.log(this.song);
    this.getComments();
  },
  computed: {
    ...mapState(['userLoggedIn']),
    sortedComments() {
      return [...this.comments].sort((a, b) => {
        if (this.sort === '1') {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  watch: {
    sort(newVal) {
      if (newVal === this.$route.query.sort) {
        return;
      }
      this.$router.push({
        query: {
          sort: newVal,
        },
      });
    },
  },
};
</script>
