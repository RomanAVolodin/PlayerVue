import { mount } from '@vue/test-utils';
import About from '@/views/About.vue';

describe('About.vue', () => {
  it('renders inner text', () => {
    const wrapper = mount(About, { shallow: true });
    expect(wrapper.text()).toContain('about page');
  });
});
