import {
    ComponentMeta,
    ComponentStory,
} from '@storybook/react'
import React from 'react'
import {Layout} from './Layout'
import './Layout.stories.scss'

export default {
    title: 'superformula/Layout',
    component: Layout,
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = (args) => <Layout {...args}>
    <div className="content">CONTENT</div>
</Layout>

export const Absolute = Template.bind({})
Absolute.args = {
    className: 'layout',
    isAbsolute: true,
}

export const WithCenteredContent = Template.bind({})
WithCenteredContent.args = {
    className: 'layout',
    isAbsolute: true,
    hasCenteredContent: true,
}

export const WithCustomClass = Template.bind({})
WithCustomClass.args = {
    className: 'layout fixedSize',
    hasCenteredContent: true,
}
