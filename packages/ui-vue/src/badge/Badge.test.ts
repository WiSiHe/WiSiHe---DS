import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Badge from './Badge.vue';

describe('Badge', () => {
  it('renders slotted content', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: 'New',
      },
    });

    expect(wrapper.find('span').exists()).toBe(true);
    expect(wrapper.text()).toContain('New');
  });

  it('applies variant and size styling classes', () => {
    const wrapper = mount(Badge, {
      props: {
        variant: 'success',
        size: 'lg',
      },
      slots: {
        default: 'Success',
      },
    });

    const classList = wrapper.find('span').classes().join(' ');
    expect(classList).toContain('bg-success');
    expect(classList).toContain('text-sm');
  });
});
