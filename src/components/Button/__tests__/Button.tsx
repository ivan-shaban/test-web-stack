import React from 'react'
import renderer from 'react-test-renderer'
import {
    Button,
    ButtonType,
    Props,
} from '../Button'

const defaultProps: Props = {}

const createTree = (props?: Partial<Props>) => {
    return renderer.create(<Button {...defaultProps} {...props}/>).toJSON()
}

it('default', () => {
    const tree = createTree()
    expect(tree).toMatchSnapshot()
})

it('in disabled state', () => {
    const tree = createTree({isDisabled: true})
    expect(tree).toMatchSnapshot()
})

it('with primary type', () => {
    const tree = createTree({type: ButtonType.Primary})
    expect(tree).toMatchSnapshot()
})

it('with danger type', () => {
    const tree = createTree({type: ButtonType.Danger})
    expect(tree).toMatchSnapshot()
})

it('with custom css class', () => {
    const tree = createTree({className: 'test'})
    expect(tree).toMatchSnapshot()
})
