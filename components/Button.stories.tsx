import Button from './Button';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
	title: 'Button',
	component: Button,
	argTypes: {
		name: {
			control: 'text',
		},
		className: {
			control: 'text',
		},
	},
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Default = Template.bind({});

Default.args = {
	name: 'Hello Tailwind CSS',
	className: 'bg-teal-400 text-white',
};
