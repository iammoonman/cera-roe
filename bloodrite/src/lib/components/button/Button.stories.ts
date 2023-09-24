import type { Meta, StoryObj } from '@storybook/svelte';

import Button from './Button.svelte';

// More on how to set up stories at: https://storybook.js.org/docs/svelte/writing-stories/introduction
const meta = {
	title: 'Example/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		size: {
			control: { type: 'select' },
			options: ['small', 'medium', 'large']
		},
		color: {
			control: { type: 'select' },
			options: ['colorless', 'white', 'blue', 'black', 'red', 'green', 'gold']
		},
		set_symbol: {}
	}
} satisfies Meta<Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/svelte/writing-stories/args
export const Medium: Story = {
	args: {
		label: 'Medium Button'
	}
};

export const Large: Story = {
	args: {
		size: 'large',
		label: 'Large Button'
	}
};

export const Small: Story = {
	args: {
		size: 'small',
		label: 'Small Button'
	}
};
