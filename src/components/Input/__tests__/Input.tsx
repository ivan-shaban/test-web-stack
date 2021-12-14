import React from 'react'
import renderer from 'react-test-renderer'
import {
    Input,
    Props,
} from '../Input'

const defaultProps: Props = {}

const createTree = (props?: Partial<Props>) => {
    return renderer.create(<Input {...defaultProps} {...props}/>).toJSON()
}

it('default', () => {
    const tree = createTree()
    expect(tree).toMatchSnapshot()
})

it('with custom css class', () => {
    const tree = createTree({className: 'test'})
    expect(tree).toMatchSnapshot()
})
