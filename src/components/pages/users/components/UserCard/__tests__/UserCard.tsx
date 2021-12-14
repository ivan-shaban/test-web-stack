import React from 'react'
import {
    UserCard,
    Props,
} from '../UserCard'
import renderer from 'react-test-renderer'
import {mount} from 'enzyme'

const defaultProps: Props = {
    user: {
        address: 'address',
        description: 'description',
        id: 0,
        dob: new Date('1990-01-01'),
        name: 'name',
        image: 'image',
        createdAt: new Date('1999-01-01'),
        updatedAt: new Date('1999-02-01'),
    },
    onClick: jest.fn(),
}

const createTree = (props?: Partial<Props>) => {
    return renderer.create(<UserCard {...defaultProps} {...props}/>).toJSON()
}

const createWrapper = (props?: Partial<Props>) => {
    return mount(<UserCard {...defaultProps} {...props}/>)
}

describe('snapshots', () => {
    it('default', () => {
        const tree = createTree()
        expect(tree).toMatchSnapshot()
    })

    it('with disabled state', () => {
        const tree = createTree({isDisabled: true})
        expect(tree).toMatchSnapshot()
    })
})

it('should handle onClick', function () {
    const onClick = jest.fn()
    const wrapper = createWrapper({onClick})
    wrapper.simulate('click')

    expect(onClick).toHaveBeenCalledWith(defaultProps.user)
})
