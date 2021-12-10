import {
    ComponentMeta,
    ComponentStory,
} from '@storybook/react'
import {
    Button,
    ButtonType,
} from './Button'
import React from 'react'
import './Button.stories.scss'

export default {
    title: 'superformula/Button',
    component: Button,
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
    children: 'label',
}

export const Danger = Template.bind({})
Danger.args = {
    type: ButtonType.Danger,
    children: 'label',
}

export const WithCustomClassName = Template.bind({})
WithCustomClassName.args = {
    className: 'testButton',
    children: 'label',
}

export const Disabled = Template.bind({})
Disabled.args = {
    isDisabled: true,
    children: 'label',
}
