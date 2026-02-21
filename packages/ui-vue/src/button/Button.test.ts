import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Button from './Button.vue';

describe('Button', () => {
  it('renders default button content', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Save',
      },
    });

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.text()).toContain('Save');
  });

  it('shows loading state and disables interaction', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        variant: 'danger',
      },
      slots: {
        default: 'Deleting',
      },
    });

    const button = wrapper.find('button');
    expect(button.attributes('aria-busy')).toBe('true');
    expect(button.attributes('disabled')).toBeDefined();
    expect(button.find('span[aria-hidden="true"]').exists()).toBe(true);
    expect(button.classes().join(' ')).toContain('bg-danger');
  });
});
