import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import SongItem from '@/components/SongItem.vue';

describe('Snapshots SongItem.vue', () => {
  it('renders correctly', () => {
    const song = {
      docId: 'abc',
      modified_name: 'test',
      display_name: 'test',
      commenst_count: 5,
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

    expect(wrapper.element).toMatchSnapshot();
  });
});
