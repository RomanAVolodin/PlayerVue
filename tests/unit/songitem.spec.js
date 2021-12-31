import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('SongItem.vue', () => {
  it('renders song.modified_name', () => {
    const song = {
      genre: 'test',
    };
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });
    // console.log(wrapper.html());
    expect(wrapper.text()).toContain(song.genre);
  });

  it('renders song.docId in id attribute', () => {
    const song = {
      docId: 'abc',
    };
    const wrapper = shallowMount(SongItem, {
      propsData: {
        song,
      },
      global: {
        components: {
          'router-link': RouterLinkStub,
        },
      },
    });

    // expect(wrapper.attributes().id).toBe(`song-id-${song.docId}`);
    expect(wrapper.classes()).toContain(`song-id-${song.docId}`);
  });
});
