import React from 'react'
import {
    Layout,
    Props,
} from '../Layout'
import renderer from 'react-test-renderer'

const defaultProps: Props = {}

const createTree = (props?: Partial<Props>) => {
    return renderer.create(<Layout {...defaultProps} {...props}/>).toJSON()
}

describe('snapshots', () => {
    it('default', () => {
        const tree = createTree()
        expect(tree).toMatchSnapshot()
    })

    it('with absolute layout', () => {
        const tree = createTree({isAbsolute: true})
        expect(tree).toMatchSnapshot()
    })

    it('with centered content', () => {
        const tree = createTree({hasCenteredContent: true})
        expect(tree).toMatchSnapshot()
    })

    it('with custom css class', () => {
        const tree = createTree({className: 'test'})
        expect(tree).toMatchSnapshot()
    })
})
